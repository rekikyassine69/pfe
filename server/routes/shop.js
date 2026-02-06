import express from 'express';
import mongoose from 'mongoose';
import { Produit } from '../models/Produit.js';
import { Panier } from '../models/Panier.js';
import { Commande } from '../models/Commande.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Récupérer tous les produits disponibles
router.get('/products', async (req, res) => {
  try {
    const { categorie, search, sort = 'createdAt', order = 'desc' } = req.query;
    
    const filter = {};
    if (categorie && categorie !== 'tous') {
      filter.categorie = categorie;
    }
    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortOrder };

    const produits = await Produit.find(filter).sort(sortObj);
    res.json(produits);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
  }
});

// Récupérer un produit spécifique
router.get('/products/:id', async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json(produit);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du produit' });
  }
});

// Récupérer le panier de l'utilisateur
router.get('/cart', requireAuth, async (req, res) => {
  try {
    const clientId = new mongoose.Types.ObjectId(req.user.sub);
    let panier = await Panier.findOne({ clientId }).populate('items.produitId');
    
    if (!panier) {
      panier = new Panier({ clientId, items: [] });
      await panier.save();
    }

    res.json(panier);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
  }
});

// Ajouter un produit au panier
router.post('/cart/add', requireAuth, async (req, res) => {
  try {
    const clientId = new mongoose.Types.ObjectId(req.user.sub);
    const { produitId, quantite = 1 } = req.body;

    if (!produitId) {
      return res.status(400).json({ message: 'ID du produit requis' });
    }

    const produit = await Produit.findById(produitId);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Vérifier si le produit est en rupture de stock ou hors stock
    if (produit.statut === 'rupture' || produit.quantiteStock === 0) {
      return res.status(400).json({ message: 'Ce produit n\'est pas disponible' });
    }

    if (produit.quantiteStock < quantite) {
      return res.status(400).json({ message: 'Stock insuffisant' });
    }

    let panier = await Panier.findOne({ clientId });
    
    if (!panier) {
      panier = new Panier({ clientId, items: [] });
    }

    // Vérifier si le produit est déjà dans le panier
    const existingItemIndex = panier.items.findIndex(
      item => item.produitId.toString() === produitId
    );

    if (existingItemIndex > -1) {
      // Mettre à jour la quantité
      const newQuantite = panier.items[existingItemIndex].quantite + quantite;
      if (newQuantite > produit.quantiteStock) {
        return res.status(400).json({ message: 'Stock insuffisant' });
      }
      panier.items[existingItemIndex].quantite = newQuantite;
    } else {
      // Ajouter le nouveau produit
      panier.items.push({
        produitId: produit._id,
        nom: produit.nom,
        prix: produit.prix,
        imageUrl: produit.imageUrl,
        quantite
      });
    }

    panier.calculerTotal();
    panier.dateModification = new Date();
    await panier.save();

    const panierPopulated = await Panier.findById(panier._id).populate('items.produitId');
    res.json(panierPopulated);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: error.message || 'Erreur lors de l\'ajout au panier' });
  }
});

// Mettre à jour la quantité d'un article dans le panier
router.put('/cart/:itemId', requireAuth, async (req, res) => {
  try {
    const clientId = new mongoose.Types.ObjectId(req.user.sub);
    const { itemId } = req.params;
    const { quantite } = req.body;

    if (!quantite || quantite < 1) {
      return res.status(400).json({ message: 'Quantité invalide' });
    }

    const panier = await Panier.findOne({ clientId });
    if (!panier) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    const item = panier.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Article non trouvé dans le panier' });
    }

    // Vérifier le stock
    const produit = await Produit.findById(item.produitId);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    if (quantite > produit.quantiteStock) {
      return res.status(400).json({ message: `Stock insuffisant. Disponible: ${produit.quantiteStock}` });
    }

    item.quantite = quantite;
    panier.calculerTotal();
    panier.dateModification = new Date();
    await panier.save();

    const panierPopulated = await Panier.findById(panier._id).populate('items.produitId');
    res.json(panierPopulated);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du panier' });
  }
});

// Supprimer un article du panier
router.delete('/cart/:itemId', requireAuth, async (req, res) => {
  try {
    const clientId = new mongoose.Types.ObjectId(req.user.sub);
    const { itemId } = req.params;

    const panier = await Panier.findOne({ clientId });
    if (!panier) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    panier.items.pull(itemId);
    panier.calculerTotal();
    panier.dateModification = new Date();
    await panier.save();

    const panierPopulated = await Panier.findById(panier._id).populate('items.produitId');
    res.json(panierPopulated);
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'article' });
  }
});

// Vider le panier
router.delete('/cart', requireAuth, async (req, res) => {
  try {
    const clientId = new mongoose.Types.ObjectId(req.user.sub);
    const panier = await Panier.findOne({ clientId });
    if (!panier) {
      return res.status(404).json({ message: 'Panier non trouvé' });
    }

    panier.items = [];
    panier.montantTotal = 0;
    panier.dateModification = new Date();
    await panier.save();

    res.json(panier);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du panier' });
  }
});

// Créer une commande à partir du panier
router.post('/orders', requireAuth, async (req, res) => {
  try {
    const clientId = new mongoose.Types.ObjectId(req.user.sub);
    const { adresseLivraison, modePaiement } = req.body;

    if (!adresseLivraison) {
      return res.status(400).json({ message: 'Adresse de livraison requise' });
    }

    const panier = await Panier.findOne({ clientId }).populate('items.produitId');
    if (!panier || panier.items.length === 0) {
      return res.status(400).json({ message: 'Panier vide' });
    }

    // Vérifier le stock pour chaque produit
    for (const item of panier.items) {
      const produit = await Produit.findById(item.produitId);
      if (!produit) {
        return res.status(404).json({ message: `Produit ${item.nom} non trouvé` });
      }
      if (produit.quantiteStock < item.quantite) {
        return res.status(400).json({ 
          message: `Stock insuffisant pour ${item.nom}. Disponible: ${produit.quantiteStock}` 
        });
      }
    }

    // Créer la commande
    const commande = new Commande({
      clientId,
      lignesCommande: panier.items.map((item, index) => ({
        idLigne: index + 1,
        produitId: item.produitId._id,
        nomProduit: item.nom,
        quantite: item.quantite,
        prixUnitaire: item.prix,
        sousTotal: item.prix * item.quantite
      })),
      total: panier.montantTotal,
      statut: 'en attente',
      adresseLivraison,
      modePaiement: modePaiement || 'carte',
      dateCommande: new Date()
    });

    await commande.save();

    // Mettre à jour le stock des produits
    for (const item of panier.items) {
      await Produit.findByIdAndUpdate(
        item.produitId._id,
        { 
          $inc: { 
            quantiteStock: -item.quantite,
            nombreVentes: item.quantite
          }
        }
      );
    }

    // Vider le panier
    panier.items = [];
    panier.montantTotal = 0;
    await panier.save();

    res.status(201).json(commande);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la commande' });
  }
});

// Récupérer les commandes de l'utilisateur
router.get('/orders', requireAuth, async (req, res) => {
  try {
    const clientId = new mongoose.Types.ObjectId(req.user.sub);
    const commandes = await Commande.find({ clientId })
      .sort({ dateCommande: -1 })
      .populate('lignesCommande.produitId');
    
    // Normalize status values for consistency
    const processedCommandes = commandes.map(cmd => {
      const obj = cmd.toObject ? cmd.toObject() : cmd;
      if (obj.statut === 'en_cours') {
        obj.statut = 'en cours';
      }
      return obj;
    });
    
    res.json(processedCommandes);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
  }
});

// Récupérer une commande spécifique
router.get('/orders/:id', requireAuth, async (req, res) => {
  try {
    const clientId = new mongoose.Types.ObjectId(req.user.sub);
    const commande = await Commande.findOne({ 
      _id: req.params.id,
      clientId 
    }).populate('lignesCommande.produitId');
    
    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(commande);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la commande' });
  }
});

export default router;
