import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import plantsRouter from "./routes/plants.js";
import recognitionRouter from "./routes/recognition.js";
import authRouter from "./routes/auth.js";
import collectionsRouter from "./routes/collections.js";
import { requireAuth, requireRole } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "12mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/plants", plantsRouter);
app.use("/api/recognition", recognitionRouter);
app.use("/api/auth", authRouter);
app.use("/api/collections", requireAuth, collectionsRouter);
app.use("/api/admin/collections", requireAuth, requireRole(["admin"]), collectionsRouter);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, "..", "dist");
app.use(express.static(clientDist));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) return res.status(404).json({ message: "Not found" });
  return res.sendFile(path.join(clientDist, "index.html"));
});

const { PORT = 4000, MONGODB_URI, JWT_SECRET } = process.env;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Create a .env file at the project root.");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error("Missing JWT_SECRET. Create a .env file at the project root.");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.locals.db = mongoose.connection.db;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
