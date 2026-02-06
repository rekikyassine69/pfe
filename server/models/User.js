import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: false, default: '' },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  telephone: String,
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  dateInscription: { type: Date, default: Date.now },
  statut: { type: String, enum: ['actif', 'inactif'], default: 'actif' }
}, { timestamps: true });

// Separate models for clients and administrators
export const Client = mongoose.model('Client', userSchema, 'clients');
export const Administrateur = mongoose.model('Administrateur', userSchema, 'administrateurs');
