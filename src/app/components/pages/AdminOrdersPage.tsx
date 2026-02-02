import { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, Search, Eye, CheckCircle2, Clock, XCircle, TrendingUp, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { OrderDetailsModal } from '@/app/components/modals/OrderDetailsModal';
import { useCollection } from '@/app/hooks/useCollection';

export function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [orders, setOrders] = useState<any[]>([]);
  const { data: commandes } = useCollection<any>('commandes');
  const { data: clients } = useCollection<any>('clients');

  const clientsById = useMemo(() => {
    const map = new Map<string, any>();
    clients.forEach((client) => {
      const id = client._id?.$oid ?? client._id;
      map.set(id, client);
    });
    return map;
  }, [clients]);

  useEffect(() => {
    const formatDate = (value: any) => {
      const date = value?.$date ? new Date(value.$date) : new Date(value);
      if (Number.isNaN(date.getTime())) return '—';
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const statusMap: Record<string, string> = {
      livree: 'Livré',
      en_cours: 'En cours',
      en_attente: 'En attente',
      annulee: 'Annulé',
      annule: 'Annulé',
    };

    const mapped = commandes.map((order) => {
      const clientId = order.clientId?.$oid ?? order.clientId;
      const client = clientsById.get(clientId);
      return {
        id: `#ORD-${String(order.idCommande ?? '').padStart(4, '0')}`,
        customer: client?.nom || 'Client',
        email: client?.email || '—',
        products: (order.lignesCommande || []).map((line: any) => ({
          name: line.nomProduit,
          quantity: line.quantite,
          price: line.prixUnitaire,
        })),
        total: order.total || 0,
        status: statusMap[order.statut] || 'En cours',
        date: formatDate(order.dateCommande),
        time: formatDate(order.dateCommande),
      };
    });

    if (mapped.length) setOrders(mapped);
  }, [commandes, clientsById]);

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((order) => order.status === 'Livré').length;
  const inProgressOrders = orders.filter((order) => order.status === 'En cours').length;
  const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  const stats = [
    { label: 'Total Commandes', value: String(totalOrders), icon: ShoppingCart, color: 'text-chart-1' },
    { label: 'Livrées', value: String(deliveredOrders), icon: CheckCircle2, color: 'text-green-500' },
    { label: 'En cours', value: String(inProgressOrders), icon: Clock, color: 'text-yellow-500' },
    { label: 'Revenus', value: `${revenue.toFixed(2)}€`, icon: TrendingUp, color: 'text-primary' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Livré':
        return 'bg-green-500/20 text-green-600';
      case 'En cours':
        return 'bg-yellow-500/20 text-yellow-600';
      case 'En attente':
        return 'bg-orange-500/20 text-orange-600';
      case 'Annulé':
        return 'bg-red-500/20 text-red-600';
      default:
        return 'bg-gray-500/20 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Livré':
        return CheckCircle2;
      case 'En cours':
        return Clock;
      case 'En attente':
        return Package;
      case 'Annulé':
        return XCircle;
      default:
        return Clock;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: any) => {
    setSelectedOrder({
      id: order.id,
      customer: order.customer,
      email: order.email,
      items: order.products.map((p: any) => p.name).join(', '),
      total: `${order.total.toFixed(2)}€`,
      status: order.status,
      date: order.date,
    });
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Gestion des Commandes</h1>
        <p className="text-muted-foreground mt-1">
          Suivez et gérez toutes les commandes de la boutique
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-semibold text-foreground mt-2">{stat.value}</p>
                </div>
                <Icon className={`w-10 h-10 ${stat.color} opacity-20`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une commande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Tous les statuts</option>
          <option value="Livré">Livré</option>
          <option value="En cours">En cours</option>
          <option value="En attente">En attente</option>
          <option value="Annulé">Annulé</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order, index) => {
          const StatusIcon = getStatusIcon(order.status);
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{order.id}</h3>
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.customer} • {order.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">{order.date} • {order.time}</p>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="space-y-2 mb-4">
                    {order.products.map((product, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm bg-secondary/30 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{product.name}</span>
                          <span className="text-muted-foreground">x{product.quantity}</span>
                        </div>
                        <span className="font-medium text-foreground">{product.price.toFixed(2)}€</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-48 flex flex-col gap-3">
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total</p>
                    <p className="text-2xl font-bold text-foreground">{order.total.toFixed(2)}€</p>
                  </div>
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Voir Détails
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Affichage de {filteredOrders.length} sur {orders.length} commandes
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-secondary transition-colors">
            Précédent
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            1
          </button>
          <button className="px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-secondary transition-colors">
            2
          </button>
          <button className="px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-secondary transition-colors">
            Suivant
          </button>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        order={selectedOrder}
      />
    </div>
  );
}