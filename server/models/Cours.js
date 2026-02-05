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
  chapitres: [{ // modules/chapters
    numero: Number,
    titre: String,
    contenu: String,
    videoUrl: String
  }],
  examen: {
    nombreQuestions: Number,
    dureeMinutes: { type: Number, default: 15 },
    scoreMinimum: { type: Number, default: 60 },
    questions: [{
      id: Number,
      question: String,
      type: String,
      options: [String],
      reponseCorrecte: Number,
      points: Number
    }]
  },
  dateCreation: { type: Date, default: Date.now },
  statut: { type: String, enum: ['publié', 'brouillon', 'archivé'], default: 'publié' }
}, { timestamps: true });

export const Cours = mongoose.model('Cours', coursSchema, 'cours');
