import express from 'express';
import { Client, Administrateur } from '../models/User.js';
import { Commande } from '../models/Commande.js';
import { PotConnecte } from '../models/PotConnecte.js';
import { Cours } from '../models/Cours.js';
import { Jeu } from '../models/Jeu.js';
import { Notification } from '../models/Notification.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply admin authentication to all routes
router.use(requireAuth, requireRole(['admin']));

// ==================== USERS MANAGEMENT ====================

// Get all users (clients)
router.get('/users', async (req, res) => {
  try {
    const { search, statut, sort = 'dateInscription', order = 'desc' } = req.query;
    
    const filter = {};
    if (statut) {
      filter.statut = statut;
    }
    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortOrder };

    const users = await Client.find(filter).sort(sortObj).select('-motDePasse');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Get user details
router.get('/users/:id', async (req, res) => {
  try {
    const user = await Client.findById(req.params.id).select('-motDePasse');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Get user statistics
    const [commandesCount, potsCount] = await Promise.all([
      Commande.countDocuments({ clientId: user._id }),
      PotConnecte.countDocuments({ clientId: user._id })
    ]);

    res.json({ ...user.toObject(), commandesCount, potsCount });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
  }
});

// Update user status
router.patch('/users/:id', async (req, res) => {
  try {
    const { statut, telephone } = req.body;
    const updateData = {};
    
    if (statut) updateData.statut = statut;
    if (telephone !== undefined) updateData.telephone = telephone;

    const user = await Client.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-motDePasse');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Send notification to user
    await Notification.create({
      clientId: user._id,
      type: 'compte',
      titre: 'Mise à jour de votre compte',
      message: 'Votre compte a été mis à jour par un administrateur.',
      priorite: 'normale'
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await Client.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Clean up user related data
    await Promise.all([
      PotConnecte.deleteMany({ clientId: user._id }),
      Notification.deleteMany({ clientId: user._id })
    ]);

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

// ==================== ORDERS MANAGEMENT ====================

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { statut, search, sort = 'dateCommande', order = 'desc' } = req.query;
    
    const filter = {};
    if (statut && statut !== 'tous') {
      filter.statut = statut;
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortOrder };

    let query = Commande.find(filter)
      .sort(sortObj)
      .populate('clientId', 'nom prenom email')
      .populate('lignesCommande.produitId', 'nom');

    if (search) {
      try {
        const users = await Client.find({
          $or: [
            { nom: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }).select('_id');
        
        if (users.length > 0) {
          filter.clientId = { $in: users.map(u => u._id) };
          query = Commande.find(filter)
            .sort(sortObj)
            .populate('clientId', 'nom prenom email')
            .populate('lignesCommande.produitId', 'nom');
        } else {
          // No users match search, return empty list
          return res.json([]);
        }
      } catch (searchError) {
        console.error('Error searching users:', searchError);
        return res.status(500).json({ message: 'Erreur lors de la recherche' });
      }
    }

    const orders = await query;
    
    // Ensure all orders have proper total and normalize status
    const processedOrders = (orders || []).map((order) => {
      const orderObj = order.toObject ? order.toObject() : order;
      
      // Normalize status values
      if (orderObj.statut === 'en_cours') {
        orderObj.statut = 'en cours';
      }
      
      if (!orderObj.total || orderObj.total === 0) {
        orderObj.total = (orderObj.lignesCommande || []).reduce((sum, ligne) => {
          return sum + (ligne.sousTotal || 0);
        }, 0);
      }
      return orderObj;
    });

    console.log(`Fetched ${processedOrders.length} orders with filter:`, filter);
    res.json(processedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error: error.message });
  }
});

// Get order details
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Commande.findById(req.params.id)
      .populate('clientId', 'nom prenom email telephone')
      .populate('lignesCommande.produitId');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la commande' });
  }
});

// Update order status (approve/reject/update)
router.patch('/orders/:id', async (req, res) => {
  try {
    const { statut, numeroSuivi, dateLivraison } = req.body;
    
    const order = await Commande.findById(req.params.id).populate('clientId', 'nom email');
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    const oldStatut = order.statut;
    
    if (statut) order.statut = statut;
    if (numeroSuivi) order.numeroSuivi = numeroSuivi;
    if (dateLivraison) order.dateLivraison = new Date(dateLivraison);

    await order.save();

    // Send notification to user based on status change
    let notificationMessage = '';
    let notificationTitre = '';
    let priorite = 'normale';

    if (statut && statut !== oldStatut) {
      switch (statut) {
        case 'en cours':
          notificationTitre = 'Commande en cours de traitement';
          notificationMessage = `Votre commande #${order._id.toString().slice(-8)} est maintenant en cours de préparation.`;
          priorite = 'normale';
          break;
        case 'livree':
          notificationTitre = 'Commande livrée';
          notificationMessage = `Votre commande #${order._id.toString().slice(-8)} a été livrée avec succès!`;
          priorite = 'haute';
          break;
        case 'annulee':
          notificationTitre = 'Commande annulée';
          notificationMessage = `Votre commande #${order._id.toString().slice(-8)} a été annulée. Contactez-nous pour plus d'informations.`;
          priorite = 'haute';
          break;
      }

      if (notificationMessage) {
        await Notification.create({
          clientId: order.clientId._id,
          type: 'commande',
          titre: notificationTitre,
          message: notificationMessage,
          lien: `/orders/${order._id}`,
          priorite
        });
      }
    }

    const updatedOrder = await Commande.findById(order._id)
      .populate('clientId', 'nom prenom email')
      .populate('lignesCommande.produitId');

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la commande' });
  }
});

// Delete order
router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Commande.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la commande' });
  }
});

// Get order statistics
router.get('/stats/orders', async (req, res) => {
  try {
    const [total, enAttente, enCours, livree, annulee] = await Promise.all([
      Commande.countDocuments(),
      Commande.countDocuments({ statut: 'en attente' }),
      Commande.countDocuments({ statut: 'en cours' }),
      Commande.countDocuments({ statut: 'livree' }),
      Commande.countDocuments({ statut: 'annulee' })
    ]);

    const totalRevenue = await Commande.aggregate([
      { $match: { statut: { $in: ['en cours', 'livree'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      total,
      enAttente,
      enCours,
      livree,
      annulee,
      revenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

// ==================== POTS MANAGEMENT ====================

// Get all pots
router.get('/pots', async (req, res) => {
  try {
    const { statut, search, sort = 'dateInstallation', order = 'desc' } = req.query;
    
    const filter = {};
    if (statut && statut !== 'tous') {
      filter.statut = statut;
    }
    if (search) {
      filter.$or = [
        { nomPot: { $regex: search, $options: 'i' } },
        { typePlante: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortOrder };

    const pots = await PotConnecte.find(filter)
      .sort(sortObj)
      .populate('clientId', 'nom prenom email');
    
    res.json(pots);
  } catch (error) {
    console.error('Error fetching pots:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des pots' });
  }
});

// Get pot details
router.get('/pots/:id', async (req, res) => {
  try {
    const pot = await PotConnecte.findById(req.params.id)
      .populate('clientId', 'nom prenom email telephone');
    
    if (!pot) {
      return res.status(404).json({ message: 'Pot non trouvé' });
    }

    res.json(pot);
  } catch (error) {
    console.error('Error fetching pot:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du pot' });
  }
});

// Update pot
router.patch('/pots/:id', async (req, res) => {
  try {
    const { statut, etatArrosage, seuilHumidite, frequenceArrosage } = req.body;
    
    const updateData = {};
    if (statut) updateData.statut = statut;
    if (etatArrosage) updateData.etatArrosage = etatArrosage;
    if (seuilHumidite !== undefined) updateData.seuilHumidite = seuilHumidite;
    if (frequenceArrosage !== undefined) updateData.frequenceArrosage = frequenceArrosage;

    const pot = await PotConnecte.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('clientId', 'nom prenom email');

    if (!pot) {
      return res.status(404).json({ message: 'Pot non trouvé' });
    }

    // Send notification to user
    if (statut === 'maintenance') {
      await Notification.create({
        clientId: pot.clientId._id,
        type: 'pot',
        titre: 'Pot en maintenance',
        message: `Votre pot "${pot.nomPot}" est actuellement en maintenance.`,
        priorite: 'haute'
      });
    }

    res.json(pot);
  } catch (error) {
    console.error('Error updating pot:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du pot' });
  }
});

// Delete pot
router.delete('/pots/:id', async (req, res) => {
  try {
    const pot = await PotConnecte.findByIdAndDelete(req.params.id);
    if (!pot) {
      return res.status(404).json({ message: 'Pot non trouvé' });
    }

    res.json({ message: 'Pot supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting pot:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du pot' });
  }
});

// ==================== COURSES MANAGEMENT ====================

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    const { statut, categorie, search, sort = 'dateCreation', order = 'desc' } = req.query;
    
    const filter = {};
    if (statut && statut !== 'tous') {
      filter.statut = statut;
    }
    if (categorie && categorie !== 'tous') {
      filter.categorie = categorie;
    }
    if (search) {
      filter.$or = [
        { titre: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortOrder };

    const courses = await Cours.find(filter).sort(sortObj);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des cours' });
  }
});

// Get course details
router.get('/courses/:id', async (req, res) => {
  try {
    const course = await Cours.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du cours' });
  }
});

// Create course
router.post('/courses', async (req, res) => {
  try {
    const courseData = req.body;
    const course = new Cours(courseData);
    await course.save();

    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Erreur lors de la création du cours' });
  }
});

// Update course
router.put('/courses/:id', async (req, res) => {
  try {
    const course = await Cours.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du cours' });
  }
});

// Delete course
router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Cours.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    res.json({ message: 'Cours supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du cours' });
  }
});

// ==================== GAMES MANAGEMENT ====================

// Get all games
router.get('/games', async (req, res) => {
  try {
    const { statut, search, sort = 'dateCreation', order = 'desc' } = req.query;
    
    const filter = {};
    if (statut && statut !== 'tous') {
      filter.statut = statut;
    }
    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortOrder };

    const games = await Jeu.find(filter).sort(sortObj);
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des jeux' });
  }
});

// Get game details
router.get('/games/:id', async (req, res) => {
  try {
    const game = await Jeu.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Jeu non trouvé' });
    }

    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du jeu' });
  }
});

// Create game
router.post('/games', async (req, res) => {
  try {
    const gameData = req.body;
    const game = new Jeu(gameData);
    await game.save();

    res.status(201).json(game);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ message: 'Erreur lors de la création du jeu' });
  }
});

// Update game
router.put('/games/:id', async (req, res) => {
  try {
    const game = await Jeu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!game) {
      return res.status(404).json({ message: 'Jeu non trouvé' });
    }

    res.json(game);
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du jeu' });
  }
});

// Delete game
router.delete('/games/:id', async (req, res) => {
  try {
    const game = await Jeu.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Jeu non trouvé' });
    }

    res.json({ message: 'Jeu supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du jeu' });
  }
});

// ==================== DASHBOARD STATS ====================

router.get('/stats/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalOrders,
      totalPots,
      totalCourses,
      totalGames,
      pendingOrders,
      activePots,
      recentOrders
    ] = await Promise.all([
      Client.countDocuments(),
      Commande.countDocuments(),
      PotConnecte.countDocuments(),
      Cours.countDocuments({ statut: 'publié' }),
      Jeu.countDocuments({ statut: 'actif' }),
      Commande.countDocuments({ statut: 'en attente' }),
      PotConnecte.countDocuments({ statut: 'en ligne' }),
      Commande.find().sort({ dateCommande: -1 }).limit(5)
        .populate('clientId', 'nom prenom email')
    ]);

    const revenue = await Commande.aggregate([
      { $match: { statut: { $in: ['en cours', 'livree'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalPots,
      totalCourses,
      totalGames,
      pendingOrders,
      activePots,
      totalRevenue: revenue[0]?.total || 0,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

export default router;
