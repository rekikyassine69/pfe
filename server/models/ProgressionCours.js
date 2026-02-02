import mongoose from 'mongoose';

const progressionCoursSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  coursId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cours', required: true },
  progression: { type: Number, min: 0, max: 100, default: 0 },
  dateDebut: { type: Date, default: Date.now },
  dateDernierAcces: Date,
  dateCompletion: Date,
  statut: { type: String, enum: ['en cours', 'terminé', 'abandonné'], default: 'en cours' },
  tempsEcoule: Number, // en minutes
  lectionsCompletees: [String]
}, { timestamps: true });

export const ProgressionCours = mongoose.model('ProgressionCours', progressionCoursSchema, 'progressionCours');
