import mongoose from "mongoose";

const PlantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    species: { type: String, trim: true },
    lastWatered: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Plant", PlantSchema);
