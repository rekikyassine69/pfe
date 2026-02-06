import { useEffect, useState, useCallback } from 'react';
import { Package, Clock, CheckCircle2, XCircle, ChevronRight, RefreshCw, Truck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '@/app/services/api';
import { useNotifications } from '@/app/hooks/useNotifications';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface Order {
  _id: string;
  clientId?: any;
  lignesCommande: Array<{
    idLigne: number;
    produitId: any;
    nomProduit: string;
    quantite: number;
    prixUnitaire: number;
    sousTotal: number;
  }>;
  total: number;
  statut: 'en attente' | 'en cours' | 'confirmee' | 'livree' | 'annulee';
  dateCommande: string;
  dateLivraison?: string;
  adresseLivraison: any;
  modePaiement: string;
  numeroSuivi?: string;
  updatedAt?: string;
}

const statutConfig = {
  'en attente': {
    icon: Clock,
    label: 'En attente',
    color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
    description: 'Votre commande est en attente de traitement',
    lineColor: 'from-yellow-500 to-blue-500',
  },
  'en cours': {
    icon: Truck,
    label: 'En cours',
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
    description: 'Votre commande est en préparation et en route',
    lineColor: 'from-blue-500 to-green-500',
  },
  'confirmee': {
    icon: CheckCircle2,
    label: 'Confirmée',
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
    description: 'Votre commande a été confirmée',
    lineColor: 'from-blue-500 to-green-500',
  },
  'livree': {
    icon: CheckCircle2,
    label: 'Livrée',
    color: 'text-green-600 bg-green-100 dark:bg-green-900/20',
    description: 'Votre commande a été livrée avec succès',
    lineColor: 'from-green-500 to-green-500',
  },
  'annulee': {
    icon: XCircle,
    label: 'Annulée',
    color: 'text-red-600 bg-red-100 dark:bg-red-900/20',
    description: 'Votre commande a été annulée',
    lineColor: 'from-red-500 to-red-500',
  },
};

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const { notifications } = useNotifications();

  const loadOrders = useCallback(async () => {
    try {
      const data = await api.getOrders();
      
      // Ensure all orders have a total value (calculate from lines if missing)
      const processedOrders = data.map((order: any) => {
        if (!order.total || order.total === undefined || order.total === null) {
          const calculatedTotal = order.lignesCommande?.reduce((sum: number, ligne: any) => {
            return sum + (ligne.sousTotal || 0);
          }, 0) || 0;
          return { ...order, total: calculatedTotal };
        }
        return order;
      });
      
      // Check if any order status has changed
      const oldOrders = orders.reduce((acc, o) => ({ ...acc, [o._id]: o }), {});
      
      processedOrders.forEach((newOrder: Order) => {
        const oldOrder = oldOrders[newOrder._id];
        if (oldOrder && oldOrder.statut !== newOrder.statut) {
          // Status changed - notification should already be shown from server
          console.log(`Commande ${newOrder._id.slice(-8)} status changed: ${oldOrder.statut} → ${newOrder.statut}`);
        }
      });
      
      setOrders(processedOrders);
      setLastRefresh(new Date());
    } catch (error: any) {
      console.error('Error loading orders:', error);
      if (!error.message?.includes('401')) {
        toast.error('Erreur lors du chargement des commandes');
      }
    }
  }, [orders]);

  useEffect(() => {
    loadOrders().then(() => setLoading(false));

    // Poll for updates every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    
    // Also refresh when notifications are updated (new notification received)
    const notificationTimer = setInterval(loadOrders, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(notificationTimer);
    };
  }, [loadOrders]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadOrders();
      toast.success('Commandes mises à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusTimeline = (order: Order) => {
    const timeline = [
      {
        step: 'Commande passée',
        date: order.dateCommande,
        icon: Package,
        completed: true,
      },
      {
        step: 'En cours de traitement',
        date: null,
        icon: Clock,
        completed: ['en cours', 'livree'].includes(order.statut),
      },
      {
        step: 'Livrée',
        date: order.dateLivraison,
        icon: CheckCircle2,
        completed: order.statut === 'livree',
      },
    ];

    if (order.statut === 'annulee') {
      return [
        {
          step: 'Commande passée',
          date: order.dateCommande,
          icon: Package,
          completed: true,
        },
        {
          step: 'Annulée',
          date: order.updatedAt,
          icon: XCircle,
          completed: true,
        },
      ];
    }

    return timeline;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Mes commandes</h1>
          <p className="text-muted-foreground mt-1">
            Suivez l'état de vos commandes
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 space-y-4"
        >
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Aucune commande</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Vous n'avez pas encore passé de commande
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Mes commandes</h1>
          <p className="text-muted-foreground mt-1">
            {orders.length} commande{orders.length > 1 ? 's' : ''}
            {lastRefresh && (
              <span className="text-xs ml-2">
                Mis à jour {formatDistanceToNow(lastRefresh, { locale: fr, addSuffix: true })}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Actualisation...' : 'Actualiser'}
        </button>
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {orders.map((order, index) => {
          const config = statutConfig[order.statut] || statutConfig['en attente'];
          const Icon = config.icon;
          const timeline = getStatusTimeline(order);

          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              {/* Order Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      Commande #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {formatDistanceToNow(new Date(order.dateCommande), { locale: fr, addSuffix: true })}
                    </span>
                    {order.numeroSuivi && (
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        Suivi: {order.numeroSuivi}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-primary">{(order.total || 0).toFixed(2)}€</p>
                  <p className="text-sm text-muted-foreground">{order.lignesCommande.length} article{order.lignesCommande.length > 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Status Description */}
              <div className={`mb-4 p-3 rounded-lg bg-opacity-10 border border-current text-sm ${config.color}`}>
                {config.description}
              </div>

              {/* Order Products Preview */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {order.lignesCommande.slice(0, 3).map((produit, idx) => (
                  <div key={idx} className="px-3 py-1 bg-secondary rounded-lg text-sm text-foreground">
                    {produit.nomProduit} × {produit.quantite}
                  </div>
                ))}
                {order.lignesCommande.length > 3 && (
                  <div className="px-3 py-1 bg-secondary rounded-lg text-sm text-muted-foreground">
                    +{order.lignesCommande.length - 3} autre{order.lignesCommande.length - 3 > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Expand Button */}
              <button 
                onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <span>
                  {selectedOrder?._id === order._id ? 'Masquer les détails' : 'Voir les détails'}
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedOrder?._id === order._id ? 'rotate-90' : ''}`} />
              </button>

              {/* Order Details (Expanded) */}
              {selectedOrder?._id === order._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-border space-y-6"
                >
                  {/* Timeline */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">Suivi de la commande</h4>
                    <div className="space-y-3">
                      {timeline.map((event, idx) => {
                        const TimelineIcon = event.icon;
                        return (
                          <div key={idx} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                event.completed 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-300 text-gray-500'
                              }`}>
                                <TimelineIcon className="w-4 h-4" />
                              </div>
                              {idx < timeline.length - 1 && (
                                <div className={`w-0.5 h-12 ${event.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                              )}
                            </div>
                            <div className="pb-3">
                              <p className={`text-sm font-medium ${event.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {event.step}
                              </p>
                              {event.date && (
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(event.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tracking Info */}
                  {order.numeroSuivi && order.statut === 'en cours' && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Truck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Suivi de livraison</h5>
                          <p className="text-sm text-blue-700 dark:text-blue-200">
                            Numéro de suivi: <span className="font-mono font-semibold">{order.numeroSuivi}</span>
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                            Votre colis est en route et sera livré très bientôt. Vous pouvez suivre votre livraison avec le numéro ci-dessus.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Products List */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Articles commandés</h4>
                    <div className="space-y-2 bg-secondary/30 rounded-lg p-4">
                      {order.lignesCommande.map((produit, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm pb-2 last:pb-0 border-b last:border-0 border-border">
                          <div>
                            <p className="text-foreground font-medium">{produit.nomProduit}</p>
                            <p className="text-xs text-muted-foreground">Quantité: {produit.quantite}</p>
                          </div>
                          <span className="font-semibold text-foreground">
                            {(produit.prixUnitaire * produit.quantite).toFixed(2)}€
                          </span>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-border mt-3 flex justify-between items-center text-base font-semibold">
                        <span>Total</span>
                        <span>{(order.total || 0).toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Adresse de livraison</h4>
                    <div className="text-sm text-muted-foreground space-y-1 bg-secondary/30 rounded-lg p-4">
                      <p className="font-medium text-foreground">{order.adresseLivraison.nom} {order.adresseLivraison.prenom}</p>
                      <p>{order.adresseLivraison.adresse}</p>
                      <p>{order.adresseLivraison.codePostal} {order.adresseLivraison.ville}</p>
                      <p>{order.adresseLivraison.pays}</p>
                      <div className="pt-3 border-t border-border mt-3 space-y-1">
                        <p>
                          <span className="font-medium">Email:</span> {order.adresseLivraison.email}
                        </p>
                        <p>
                          <span className="font-medium">Téléphone:</span> {order.adresseLivraison.telephone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Mode de paiement</h4>
                    <p className="text-sm text-muted-foreground capitalize bg-secondary/30 rounded-lg p-3">
                      {order.modePaiement}
                    </p>
                  </div>

                  {/* Help Section */}
                  {order.statut !== 'livree' && order.statut !== 'annulee' && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">Besoin d'aide?</h5>
                          <p className="text-sm text-amber-700 dark:text-amber-200">
                            Si vous avez des questions sur votre commande, n'hésitez pas à nous contacter via le formulaire de contact ou l'email de support.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
