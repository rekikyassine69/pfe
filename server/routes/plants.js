import { Router } from "express";
import Plant from "../models/Plant.js";

const router = Router();

router.get("/", async (_req, res) => {
  const plants = await Plant.find().sort({ createdAt: -1 });
  res.json(plants);
});

router.post("/", async (req, res) => {
  const { name, species, lastWatered, notes } = req.body;

  const plant = await Plant.create({
    name,
    species,
    lastWatered,
    notes,
  });

  res.status(201).json(plant);
});

export default router;
