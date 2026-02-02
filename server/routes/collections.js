import { Router } from "express";
import { ObjectId } from "bson";
import { ALLOWED_COLLECTIONS } from "../config/collections.js";
import { normalizeIds } from "../utils/transform.js";

const router = Router();

const getCollection = (req, res, next) => {
  const { collection } = req.params;
  if (!ALLOWED_COLLECTIONS.includes(collection)) {
    return res.status(404).json({ message: "Unknown collection" });
  }
  req.collection = req.app.locals.db.collection(collection);
  return next();
};

router.get("/:collection", getCollection, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
  const skip = parseInt(req.query.skip || "0", 10);
  const sort = req.query.sort || "_id";
  const order = req.query.order === "asc" ? 1 : -1;

  const docs = await req.collection
    .find({})
    .sort({ [sort]: order })
    .skip(skip)
    .limit(limit)
    .toArray();

  return res.json(docs);
});

router.get("/:collection/:id", getCollection, async (req, res) => {
  const { id } = req.params;
  const _id = /^[a-fA-F0-9]{24}$/.test(id) ? new ObjectId(id) : id;

  const doc = await req.collection.findOne({ _id });
  if (!doc) return res.status(404).json({ message: "Not found" });
  return res.json(doc);
});

router.post("/:collection", getCollection, async (req, res) => {
  const payload = normalizeIds(req.body || {});
  const result = await req.collection.insertOne(payload);
  return res.status(201).json({ _id: result.insertedId, ...payload });
});

router.patch("/:collection/:id", getCollection, async (req, res) => {
  const { id } = req.params;
  const _id = /^[a-fA-F0-9]{24}$/.test(id) ? new ObjectId(id) : id;
  const payload = normalizeIds(req.body || {});

  await req.collection.updateOne({ _id }, { $set: payload });
  const doc = await req.collection.findOne({ _id });
  return res.json(doc);
});

router.delete("/:collection/:id", getCollection, async (req, res) => {
  const { id } = req.params;
  const _id = /^[a-fA-F0-9]{24}$/.test(id) ? new ObjectId(id) : id;

  await req.collection.deleteOne({ _id });
  return res.json({ message: "Deleted" });
});

export default router;
