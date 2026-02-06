import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api } from '@/app/services/api';
import { toast } from 'sonner';

interface Notification {
  _id: string;
  clientId: string;
  type: string;
  titre: string;
  message: string;
  dateCreation: string;
  estLue: boolean;
  lien?: string;
  priorite: 'haute' | 'normale' | 'basse';
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  hasMore: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllRead: () => Promise<void>;
  loadMore: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const limit = 20;

  const fetchNotifications = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const currentSkip = reset ? 0 : skip;
      
      const data = await api.getNotifications({ 
        limit, 
        skip: currentSkip 
      });
      
      if (reset) {
        setNotifications(data.notifications);
        setSkip(limit);
      } else {
        setNotifications(prev => [...prev, ...data.notifications]);
        setSkip(currentSkip + limit);
      }
      
      setUnreadCount(data.unreadCount);
      setHasMore(data.hasMore);
    } catch (error: any) {
      if (!error.message?.includes('401')) {
        console.error('Error fetching notifications:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [skip]);

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications(true);
  }, [fetchNotifications]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchNotifications(false);
    }
  }, [loading, hasMore, fetchNotifications]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await api.getUnreadCount();
      setUnreadCount(data.count);
    } catch (error: any) {
      if (!error.message?.includes('401')) {
        console.error('Error fetching unread count:', error);
      }
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshNotifications, fetchUnreadCount]);

  const markAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === id ? { ...notif, estLue: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, estLue: true }))
      );
      setUnreadCount(0);
      toast.success('Toutes les notifications ont été marquées comme lues');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
      throw error;
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.deleteNotification(id);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
      const wasUnread = notifications.find(n => n._id === id)?.estLue === false;
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      toast.success('Notification supprimée');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
      throw error;
    }
  };

  const deleteAllRead = async () => {
    try {
      await api.deleteReadNotifications();
      setNotifications(prev => prev.filter(notif => !notif.estLue));
      toast.success('Notifications lues supprimées');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
      throw error;
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        hasMore,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllRead,
        loadMore,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
