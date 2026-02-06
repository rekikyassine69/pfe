import mongoose from 'mongoose';

const panierItemSchema = new mongoose.Schema({
  produitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true },
  nom: String,
  prix: Number,
  imageUrl: String,
  quantite: { type: Number, default: 1, min: 1 }
});

const panierSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  items: [panierItemSchema],
  montantTotal: { type: Number, default: 0 },
  dateModification: { type: Date, default: Date.now }
}, { timestamps: true });

// Méthode pour calculer le montant total
panierSchema.methods.calculerTotal = function() {
  this.montantTotal = this.items.reduce((total, item) => {
    return total + (item.prix * item.quantite);
  }, 0);
  return this.montantTotal;
};

export const Panier = mongoose.model('Panier', panierSchema, 'paniers');
