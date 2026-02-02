import mongoose from 'mongoose';

const jeuSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: String,
  categorie: String,
  difficulte: { type: String, enum: ['facile', 'moyen', 'difficile'], default: 'moyen' },
  nombreJoueurs: { type: Number, default: 0 },
  scoreMaximum: Number,
  dureeEstimee: Number, // en minutes
  imageUrl: String,
  regles: String,
  statut: { type: String, enum: ['actif', 'inactif'], default: 'actif' }
}, { timestamps: true });

export const Jeu = mongoose.model('Jeu', jeuSchema, 'jeux');
