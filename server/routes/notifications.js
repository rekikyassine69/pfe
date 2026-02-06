import express from 'express';
import { Notification } from '../models/Notification.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get user notifications
router.get('/', async (req, res) => {
  try {
    const { estLue, type, limit = 20, skip = 0 } = req.query;
    
    const filter = { clientId: req.user.sub };
    
    if (estLue !== undefined) {
      filter.estLue = estLue === 'true';
    }
    
    if (type && type !== 'tous') {
      filter.type = type;
    }

    const notifications = await Notification.find(filter)
      .sort({ dateCreation: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const totalCount = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ 
      clientId: req.user.sub, 
      estLue: false 
    });

    res.json({
      notifications,
      totalCount,
      unreadCount,
      hasMore: totalCount > parseInt(skip) + parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications' });
  }
});

// Get unread notifications count
router.get('/unread-count', async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      clientId: req.user.sub, 
      estLue: false 
    });
    
    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du nombre de notifications' });
  }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, clientId: req.user.sub },
      { estLue: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la notification' });
  }
});

// Mark all notifications as read
router.post('/mark-all-read', async (req, res) => {
  try {
    await Notification.updateMany(
      { clientId: req.user.sub, estLue: false },
      { estLue: true }
    );

    res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour des notifications' });
  }
});

// Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      clientId: req.user.sub
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    res.json({ message: 'Notification supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la notification' });
  }
});

// Delete all read notifications
router.delete('/read/all', async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      clientId: req.user.sub,
      estLue: true
    });

    res.json({ 
      message: 'Notifications lues supprimées avec succès',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting read notifications:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression des notifications' });
  }
});

export default router;
