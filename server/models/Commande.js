import mongoose from 'mongoose';

const commandeSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  produits: [{
    produitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
    nom: String,
    quantite: Number,
    prix: Number
  }],
  montantTotal: { type: Number, required: true },
  statut: { type: String, enum: ['en attente', 'en cours', 'livree', 'annulee'], default: 'en attente' },
  dateCommande: { type: Date, default: Date.now },
  dateLivraison: Date,
  adresseLivraison: mongoose.Schema.Types.Mixed,
  modePaiement: String,
  numeroSuivi: String
}, { timestamps: true });

export const Commande = mongoose.model('Commande', commandeSchema, 'commandes');
