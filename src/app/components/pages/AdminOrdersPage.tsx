import { useEffect, useState, useCallback } from 'react';
import { api } from '@/app/services/api';
import { toast } from 'sonner';
import { Search, Eye, Clock, Truck, CheckCircle2, XCircle, Edit2, Trash2, Loader, RefreshCw } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'motion/react';

interface Order {
  _id: string;
  clientId?: { _id: string; nom: string; prenom: string; email: string; };
  lignesCommande: Array<{
    idLigne: number;
    produitId?: any;
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
}

const statutConfig = {
  'en attente': { label: 'En attente', icon: Clock, color: 'bg-yellow-100 text-yellow-800', badge: 'bg-yellow-500' },
  'en_cours': { label: 'En cours', icon: Truck, color: 'bg-blue-100 text-blue-800', badge: 'bg-blue-500' },
  'en cours': { label: 'En cours', icon: Truck, color: 'bg-blue-100 text-blue-800', badge: 'bg-blue-500' },
  'confirmee': { label: 'Confirmée', icon: CheckCircle2, color: 'bg-blue-100 text-blue-800', badge: 'bg-blue-500' },
  'livree': { label: 'Livrée', icon: CheckCircle2, color: 'bg-green-100 text-green-800', badge: 'bg-green-500' },
  'annulee': { label: 'Annulée', icon: XCircle, color: 'bg-red-100 text-red-800', badge: 'bg-red-500' },
};

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [stats, setStats] = useState<any>(null);

  const loadOrders = useCallback(async () => {
    try {
      // Build clean params object
      const params: any = {};
      if (statusFilter && statusFilter !== 'tous') {
        params.statut = statusFilter;
      }
      if (search && search.trim()) {
        params.search = search.trim();
      }
      
      const [orderData, statsData] = await Promise.all([
        api.adminGetOrders(Object.keys(params).length > 0 ? params : undefined),
        api.adminGetOrderStats()
      ]);
      
      // Ensure all orders have proper total value and unique IDs
      const processedOrders = (Array.isArray(orderData) ? orderData : [])
        .filter((order: any) => order && order._id) // Filter out orders without _id
        .map((order: any, idx: number) => {
          if (!order.total || order.total === undefined || order.total === null) {
            const calculatedTotal = order.lignesCommande?.reduce((sum: number, ligne: any) => {
              return sum + (ligne.sousTotal || 0);
            }, 0) || 0;
            return { ...order, total: calculatedTotal };
          }
          return order;
        });
      
      // Check for duplicate IDs
      const ids = processedOrders.map((o: any) => o._id);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        console.warn('Warning: Duplicate order IDs detected', ids);
      }
      
      setOrders(processedOrders);
      setStats(statsData);
      console.log('Orders loaded:', processedOrders.length, 'orders from query:', params);
    } catch (error: any) {
      console.error('Error loading orders:', error);
      toast.error('Erreur: ' + (error.message || 'Impossible de charger les commandes'));
      setOrders([]);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    loadOrders().then(() => setLoading(false));

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
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

  const handleUpdateOrderStatus = async (orderId: string, newStat: string, tracking?: string) => {
    try {
      setUpdatingOrder(orderId);
      
      const updateData: any = { statut: newStat };
      if (tracking) {
        updateData.numeroSuivi = tracking;
      }

      await api.adminUpdateOrder(orderId, updateData);
      
      toast.success(`Commande mise à jour - Notification envoyée au client`);
      
      setSelectedOrder(null);
      setEditingStatus(false);
      setTrackingNumber('');
      
      await loadOrders();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande?')) {
      try {
        await api.adminDeleteOrder(orderId);
        toast.success('Commande supprimée');
        await loadOrders();
      } catch (error: any) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Gestion des Commandes</h1>
          <p className="text-muted-foreground mt-1">Gérez et suivez toutes les commandes clients</p>
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

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">En attente</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.enAttente}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">En cours</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.enCours}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Livrées</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.livree}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Revenu</p>
            <p className="text-2xl font-bold text-primary mt-1">{stats.revenue?.toFixed(2)}€</p>
          </motion.div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par client ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="tous">Tous les statuts</option>
          <option value="en attente">En attente</option>
          <option value="en cours">En cours</option>
          <option value="livree">Livrée</option>
          <option value="annulee">Annulée</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">Aucune commande trouvée</p>
          </div>
        ) : (
          orders.map((order, index) => {
            const config = statutConfig[order.statut] || statutConfig['en attente'];
            const Icon = config.icon;

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        Commande #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${config.color}`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {order.clientId?.nom} {order.clientId?.prenom}
                      </span>
                      <span>{order.clientId?.email}</span>
                      <span>
                        {formatDistanceToNow(new Date(order.dateCommande), { locale: fr, addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-primary">{(order.total || 0).toFixed(2)}€</p>
                    <p className="text-sm text-muted-foreground">{order.lignesCommande.length} article{order.lignesCommande.length > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    {selectedOrder?._id === order._id ? 'Masquer' : 'Voir'}
                  </button>
                  {order.statut !== 'livree' && order.statut !== 'annulee' && (
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setEditingStatus(!editingStatus);
                      }}
                      className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      Modifier
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>

                {/* Expanded Details */}
                {selectedOrder?._id === order._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t border-border space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {/* Products */}
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Articles</h4>
                          <div className="space-y-2">
                            {order.lignesCommande.map((prod, idx) => (
                              <div key={`${order._id}-ligne-${prod.idLigne || idx}`} className="flex justify-between text-sm p-2 bg-secondary/30 rounded">
                                <span className="text-foreground font-medium">{prod.nomProduit}</span>
                                <div className="flex gap-4">
                                  <span className="text-muted-foreground">x{prod.quantite}</span>
                                  <span className="text-foreground font-semibold">{(prod.prixUnitaire * prod.quantite).toFixed(2)}€</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Adresse de Livraison</h4>
                          <div className="text-sm text-muted-foreground space-y-1 bg-secondary/30 rounded p-3">
                            <p>{order.adresseLivraison.adresse}</p>
                            <p>{order.adresseLivraison.codePostal} {order.adresseLivraison.ville}</p>
                            <p>{order.adresseLivraison.pays}</p>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Status Management */}
                      <div className="space-y-4">
                        {!editingStatus ? (
                          <>
                            {/* Current Status */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">Statut Actuel</h4>
                              <div className={`p-3 rounded-lg ${config.color}`}>
                                <p className="text-sm">{config.label}</p>
                              </div>
                            </div>

                            {/* Tracking Number */}
                            {order.numeroSuivi && (
                              <div>
                                <h4 className="font-semibold text-foreground mb-2">Numéro de Suivi</h4>
                                <p className="text-sm font-mono bg-secondary/30 rounded p-3">{order.numeroSuivi}</p>
                              </div>
                            )}

                            {/* Timeline */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">Chronologie</h4>
                              <div className="text-sm space-y-1 bg-secondary/30 rounded p-3">
                                <p className="text-muted-foreground">
                                  Passée: {format(new Date(order.dateCommande), 'dd MMM yyyy HH:mm', { locale: fr })}
                                </p>
                                {order.dateLivraison && (
                                  <p className="text-muted-foreground">
                                    Livrée: {format(new Date(order.dateLivraison), 'dd MMM yyyy HH:mm', { locale: fr })}
                                  </p>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                            <div>
                              <label className="text-sm font-medium text-foreground">Nouveau Statut</label>
                              <select
                                value={newStatus || order.statut}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                <option value="en attente">En attente</option>
                                <option value="en cours">En cours</option>
                                <option value="livree">Livrée</option>
                                <option value="annulee">Annulée</option>
                              </select>
                            </div>

                            {(newStatus || order.statut) === 'en cours' && (
                              <div>
                                <label className="text-sm font-medium text-foreground">N° de Suivi (optionnel)</label>
                                <input
                                  type="text"
                                  value={trackingNumber}
                                  onChange={(e) => setTrackingNumber(e.target.value)}
                                  placeholder="Ex: TRACK123456"
                                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>
                            )}

                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  handleUpdateOrderStatus(order._id, newStatus || order.statut, trackingNumber);
                                }}
                                disabled={updatingOrder === order._id}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                {updatingOrder === order._id ? (
                                  <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Mise à jour...
                                  </>
                                ) : (
                                  'Valider'
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingStatus(false);
                                  setNewStatus('');
                                  setTrackingNumber('');
                                }}
                                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}