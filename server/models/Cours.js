import mongoose from 'mongoose';

const coursSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: String,
  categorie: String,
  niveau: { type: String, enum: ['débutant', 'intermédiaire', 'avancé'], default: 'débutant' },
  duree: Number, // en minutes
  nombreLecons: Number,
  note: { type: Number, min: 0, max: 5 },
  nombreEtudiants: { type: Number, default: 0 },
  imageUrl: String,
  contenu: String,
  dateCreation: { type: Date, default: Date.now },
  statut: { type: String, enum: ['publié', 'brouillon', 'archivé'], default: 'publié' }
}, { timestamps: true });

export const Cours = mongoose.model('Cours', coursSchema, 'cours');
