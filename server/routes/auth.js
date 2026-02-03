import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "bson";
import crypto from "crypto";
import { sendPasswordResetEmail, sendWelcomeEmail } from "../utils/email.js";

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

const RESET_TOKEN_TTL_MINUTES = Number(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES || 15);

const createResetToken = () => {
  const raw = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, tokenHash };
};

const hashResetToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

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
  
  // Send welcome email
  await sendWelcomeEmail(nom, email);
  
  return res.status(201).json({ _id: result.insertedId, ...client });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const db = req.app.locals.db;
  const match = await findUserByEmail(db, email);
  const genericMessage = "Si cet email existe, un lien vous a été envoyé";

  if (match) {
    const { raw, tokenHash } = createResetToken();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    await db.collection("passwordResets").deleteMany({
      userId: new ObjectId(match.user._id),
      userType: match.role,
    });

    await db.collection("passwordResets").insertOne({
      userId: new ObjectId(match.user._id),
      userType: match.role,
      tokenHash,
      expiresAt,
      createdAt: new Date(),
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password?token=${raw}`;
    
    // Send password reset email
    const emailSent = await sendPasswordResetEmail(email, resetUrl);
    if (!emailSent) {
      console.log(`[Password Reset] ${email} -> ${resetUrl}`);
    }

    if (process.env.RETURN_RESET_URL === "true") {
      return res.json({ message: genericMessage, resetUrl });
    }
  }

  return res.json({ message: genericMessage });
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ message: "token and newPassword are required" });
  }

  const db = req.app.locals.db;
  const tokenHash = hashResetToken(token);

  const reset = await db.collection("passwordResets").findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  });

  if (!reset) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  const collection = reset.userType === "admin" ? "administrateurs" : "clients";

  await db.collection(collection).updateOne(
    { _id: new ObjectId(reset.userId) },
    { $set: { motDePasse: hashed } }
  );

  await db.collection("passwordResets").deleteMany({
    userId: new ObjectId(reset.userId),
    userType: reset.userType,
  });

  await db.collection("sessions").deleteMany({
    userId: new ObjectId(reset.userId),
    userType: reset.userType,
  });

  return res.json({ message: "Mot de passe réinitialisé avec succès" });
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
