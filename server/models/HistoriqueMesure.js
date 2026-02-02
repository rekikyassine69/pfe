import mongoose from 'mongoose';

const historiqueMesureSchema = new mongoose.Schema({
  potId: { type: mongoose.Schema.Types.ObjectId, ref: 'PotConnecte', required: true },
  temperature: Number,
  humidite: Number,
  luminosite: Number,
  niveauEau: Number,
  dateMesure: { type: Date, default: Date.now }
}, { timestamps: true });

export const HistoriqueMesure = mongoose.model('HistoriqueMesure', historiqueMesureSchema, 'historiqueMesures');
