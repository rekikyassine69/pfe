import mongoose from "mongoose";

const PlantInfoSchema = new mongoose.Schema(
  {
    // Plant name variations (common names in different languages)
    commonNames: [{ type: String, trim: true }],
    scientificName: { type: String, trim: true },

    // Care requirements
    careRequirements: {
      humidity: {
        min: { type: Number, required: true }, // Minimum humidity percentage
        max: { type: Number, required: true }, // Maximum humidity percentage
        ideal: { type: Number }, // Ideal humidity percentage
      },
      luminosity: {
        min: { type: Number }, // Minimum lux
        max: { type: Number }, // Maximum lux
        ideal: { type: Number }, // Ideal lux
        description: { type: String }, // e.g., "Full sun", "Partial shade"
      },
      watering: {
        frequency: { type: String, required: true }, // e.g., "Daily", "Every 2 days", "Weekly"
        description: { type: String }, // Additional details
        minIntervalDays: { type: Number }, // Minimum days between watering
        maxIntervalDays: { type: Number }, // Maximum days between watering
      },
      temperature: {
        min: { type: Number }, // Minimum temperature in Celsius
        max: { type: Number }, // Maximum temperature in Celsius
        ideal: { type: Number }, // Ideal temperature in Celsius
      },
    },

    // Additional information
    description: { type: String },
    difficulty: { type: String, enum: ["Facile", "Intermédiaire", "Difficile"] },
    toxicity: { type: String }, // e.g., "Non-toxique", "Toxique pour les animaux"
    origin: { type: String },
    bloomingSeason: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

// Create indexes for efficient searches
PlantInfoSchema.index({ commonNames: 1 });
PlantInfoSchema.index({ scientificName: 1 });

export default mongoose.model("PlantInfo", PlantInfoSchema);
