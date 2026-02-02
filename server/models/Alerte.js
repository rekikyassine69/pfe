import mongoose from 'mongoose';

const alerteSchema = new mongoose.Schema({
  potId: { type: mongoose.Schema.Types.ObjectId, ref: 'PotConnecte' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  type: { type: String, enum: ['critique', 'avertissement', 'info'], required: true },
  message: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now },
  statut: { type: String, enum: ['non lue', 'lue', 'résolue'], default: 'non lue' },
  severite: { type: String, enum: ['haute', 'moyenne', 'basse'], default: 'moyenne' }
}, { timestamps: true });

export const Alerte = mongoose.model('Alerte', alerteSchema, 'alertes');
