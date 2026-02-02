import mongoose from 'mongoose';

const historiqueArrosageSchema = new mongoose.Schema({
  potId: { type: mongoose.Schema.Types.ObjectId, ref: 'PotConnecte', required: true },
  dateArrosage: { type: Date, default: Date.now },
  quantiteEau: Number,
  modeArrosage: { type: String, enum: ['automatique', 'manuel'], default: 'automatique' },
  declenchePar: String,
  duree: Number // en secondes
}, { timestamps: true });

export const HistoriqueArrosage = mongoose.model('HistoriqueArrosage', historiqueArrosageSchema, 'historiqueArrosage');
