import mongoose from 'mongoose';

const ligneCommandeSchema = new mongoose.Schema({
  idLigne: Number,
  produitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
  nomProduit: String,
  quantite: Number,
  prixUnitaire: Number,
  sousTotal: Number
});

const commandeSchema = new mongoose.Schema({
  idCommande: Number,
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  lignesCommande: [ligneCommandeSchema],
  total: { type: Number, required: true },
  statut: { type: String, enum: ['en attente', 'en cours', 'confirmee', 'livree', 'annulee'], default: 'en attente' },
  dateCommande: { type: Date, required: true, default: Date.now },
  dateLivraison: Date,
  adresseLivraison: mongoose.Schema.Types.Mixed,
  modePaiement: String,
  numeroSuivi: String
}, { timestamps: true });

// Ensure total is always populated when converting to JSON
commandeSchema.methods.toJSON = function() {
  const obj = this.toObject();
  if (!obj.total || obj.total === 0) {
    obj.total = (obj.lignesCommande || []).reduce((sum, ligne) => {
      return sum + (ligne.sousTotal || 0);
    }, 0);
  }
  return obj;
};

export const Commande = mongoose.model('Commande', commandeSchema, 'commandes');
