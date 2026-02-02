import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { EJSON } from "bson";

dotenv.config();

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data", "json");
const { MONGODB_URI, IMPORT_DB, IMPORT_DROP = "false" } = process.env;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Create a .env file at the project root.");
  process.exit(1);
}

const parseCollectionName = (fileName) => {
  // Expected: plateformeDB.collection.json
  const base = fileName.replace(/\.json$/i, "");
  const parts = base.split(".");
  return parts.length >= 2 ? parts.slice(1).join(".") : base;
};

const parseDbNameFromUri = (uri) => {
  try {
    const url = new URL(uri);
    const dbName = url.pathname?.replace(/^\//, "");
    return dbName || null;
  } catch {
    return null;
  }
};

const importFiles = async () => {
  const dbName = IMPORT_DB || parseDbNameFromUri(MONGODB_URI);

  if (!dbName) {
    console.error("Database name not found. Set IMPORT_DB in your .env.");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { dbName });

  const files = await fs.readdir(DATA_DIR);
  const jsonFiles = files.filter((file) => file.toLowerCase().endsWith(".json"));

  if (jsonFiles.length === 0) {
    console.log("No JSON files found in", DATA_DIR);
    return;
  }

  for (const file of jsonFiles) {
    const filePath = path.join(DATA_DIR, file);
    const collectionName = parseCollectionName(file);

    const raw = await fs.readFile(filePath, "utf8");
    const parsed = EJSON.parse(raw);
    const docs = Array.isArray(parsed) ? parsed : [parsed];

    const collection = mongoose.connection.db.collection(collectionName);

    if (IMPORT_DROP === "true") {
      await collection.deleteMany({});
    }

    if (docs.length > 0) {
      await collection.insertMany(docs, { ordered: false });
    }

    console.log(`Imported ${docs.length} docs into ${collectionName}`);
  }

  await mongoose.disconnect();
};

importFiles().catch((error) => {
  console.error("Import failed:", error);
  process.exit(1);
});
