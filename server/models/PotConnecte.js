import mongoose from 'mongoose';

const potConnecteSchema = new mongoose.Schema({
  nomPot: { type: String, required: true },
  typePlante: String,
  dateInstallation: { type: Date, default: Date.now },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  etatArrosage: { type: String, enum: ['actif', 'inactif'], default: 'actif' },
  dernierArrosage: Date,
  seuilHumidite: { type: Number, default: 30 },
  frequenceArrosage: { type: Number, default: 24 }, // heures
  localisation: String,
  statut: { type: String, enum: ['en ligne', 'hors ligne', 'maintenance'], default: 'en ligne' }
}, { timestamps: true });

export const PotConnecte = mongoose.model('PotConnecte', potConnecteSchema, 'potsConnectes');
