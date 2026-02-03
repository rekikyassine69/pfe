import mongoose from "mongoose";

const RecognitionAnalysisSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ["plant", "insect"],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    name: String,
    scientificName: String,
    confidence: Number,
    diseases: [String],
    status: {
      type: String,
      enum: ["healthy", "warning"],
      default: "healthy",
    },
    response: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const RecognitionAnalysis = mongoose.model(
  "RecognitionAnalysis",
  RecognitionAnalysisSchema
);

export default RecognitionAnalysis;
