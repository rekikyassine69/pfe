import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "bson";

const router = Router();

const findUserByEmail = async (db, email) => {
  const admin = await db.collection("administrateurs").findOne({ email });
  if (admin) return { user: admin, role: "admin", collection: "administrateurs" };

  const client = await db.collection("clients").findOne({ email });
  if (client) return { user: client, role: "client", collection: "clients" };

  return null;
};

const verifyPassword = async (plain, stored) => {
  if (!stored) return false;
  if (stored.startsWith("$2")) {
    return bcrypt.compare(plain, stored);
  }
  return plain === stored;
};

const signToken = (payload) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || "2h";
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

router.post("/login", async (req, res) => {
  const { email, password, userType } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const db = req.app.locals.db;
  let match = null;

  if (userType === "admin") {
    const admin = await db.collection("administrateurs").findOne({ email });
    if (admin) match = { user: admin, role: "admin" };
  } else if (userType === "client") {
    const client = await db.collection("clients").findOne({ email });
    if (client) match = { user: client, role: "client" };
  } else {
    match = await findUserByEmail(db, email);
  }

  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await verifyPassword(password, match.user.motDePasse);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({
    sub: match.user._id.toString(),
    role: match.role,
    email: match.user.email,
  });

  await db.collection("sessions").insertOne({
    userId: new ObjectId(match.user._id),
    userType: match.role,
    token,
    dateCreation: new Date(),
    dateExpiration: new Date(Date.now() + 2 * 60 * 60 * 1000),
    adresseIP: req.ip,
    appareil: req.headers["user-agent"],
  });

  return res.json({ token, role: match.role, user: match.user });
});

router.post("/register", async (req, res) => {
  const { nom, email, password } = req.body;
  if (!nom || !email || !password) {
    return res.status(400).json({ message: "nom, email, password are required" });
  }

  const db = req.app.locals.db;
  const existing = await db.collection("clients").findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const lastClient = await db
    .collection("clients")
    .find()
    .sort({ idClient: -1 })
    .limit(1)
    .toArray();

  const nextId = lastClient.length ? (lastClient[0].idClient || 0) + 1 : 1;
  const hashed = await bcrypt.hash(password, 10);

  const client = {
    idClient: nextId,
    nom,
    email,
    motDePasse: hashed,
    dateInscription: new Date(),
    notifications: [],
  };

  const result = await db.collection("clients").insertOne(client);
  return res.status(201).json({ _id: result.insertedId, ...client });
});

router.get("/me", async (req, res) => {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const db = req.app.locals.db;
    const collection = payload.role === "admin" ? "administrateurs" : "clients";
    const user = await db.collection(collection).findOne({ _id: new ObjectId(payload.sub) });
    return res.json({ user, role: payload.role });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

router.post("/logout", async (req, res) => {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) return res.status(400).json({ message: "Missing token" });

  const db = req.app.locals.db;
  await db.collection("sessions").deleteOne({ token });
  return res.json({ message: "Logged out" });
});

export default router;
