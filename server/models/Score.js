import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  jeuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jeu', required: true },
  score: { type: Number, required: true },
  dateObtention: { type: Date, default: Date.now },
  tempsJeu: Number, // en secondes
  niveau: Number,
  estRecord: { type: Boolean, default: false }
}, { timestamps: true });

export const Score = mongoose.model('Score', scoreSchema, 'scores');
