import mongoose from 'mongoose';

const produitSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: String,
  categorie: String,
  prix: { type: Number, required: true },
  quantiteStock: { type: Number, default: 0 },
  imageUrl: String,
  specifications: mongoose.Schema.Types.Mixed,
  marque: String,
  note: { type: Number, min: 0, max: 5 },
  nombreVentes: { type: Number, default: 0 },
  estBestseller: { type: Boolean, default: false },
  statut: { type: String, enum: ['disponible', 'rupture', 'bientôt'], default: 'disponible' }
}, { timestamps: true });

export const Produit = mongoose.model('Produit', produitSchema, 'produits');
