import { useMemo } from 'react';
import { Users, Activity, ShoppingCart, TrendingUp, AlertCircle, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCollection } from '@/app/hooks/useCollection';

export function AdminPage() {
  const { data: clients } = useCollection<any>('clients');
  const { data: admins } = useCollection<any>('administrateurs');
  const { data: potsConnectes } = useCollection<any>('potsConnectes');
  const { data: commandes } = useCollection<any>('commandes');
  const { data: feedbacks } = useCollection<any>('feedbacks');
  const { data: alertes } = useCollection<any>('alertes');

  const stats = useMemo(() => {
    const totalUsers = clients.length + admins.length;
    const totalPots = potsConnectes.length;
    const totalSales = commandes.reduce((sum, order) => sum + (order.total || 0), 0);
    const avgRating = feedbacks.length
      ? feedbacks.reduce((sum, feedback) => sum + (feedback.note || 0), 0) / feedbacks.length
      : 0;

    return [
      {
        title: 'Utilisateurs actifs',
        value: String(totalUsers),
        change: '+0%',
        icon: Users,
        color: 'text-chart-1',
      },
      {
        title: 'Pots connectés',
        value: String(totalPots),
        change: '+0%',
        icon: Activity,
        color: 'text-chart-2',
      },
      {
        title: 'Ventes ce mois',
        value: `${totalSales.toFixed(2)}€`,
        change: '+0%',
        icon: ShoppingCart,
        color: 'text-chart-3',
      },
      {
        title: 'Taux de satisfaction',
        value: avgRating ? `${(avgRating * 20).toFixed(1)}%` : '—',
        change: '+0%',
        icon: TrendingUp,
        color: 'text-chart-1',
      },
    ];
  }, [admins.length, clients.length, commandes, feedbacks, potsConnectes.length]);

  const monthLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

  const userData = useMemo(() => {
    const counts = new Array(12).fill(0);
    clients.forEach((client) => {
      const date = client.dateInscription?.$date ? new Date(client.dateInscription.$date) : new Date(client.dateInscription);
      if (!Number.isNaN(date.getTime())) counts[date.getMonth()] += 1;
    });
    admins.forEach((admin) => {
      const date = admin.dateCreation?.$date ? new Date(admin.dateCreation.$date) : new Date(admin.dateCreation);
      if (!Number.isNaN(date.getTime())) counts[date.getMonth()] += 1;
    });
    return monthLabels.map((label, index) => ({ month: label, users: counts[index] }));
  }, [admins, clients]);

  const salesData = useMemo(() => {
    const totals = new Array(12).fill(0);
    commandes.forEach((order) => {
      const date = order.dateCommande?.$date ? new Date(order.dateCommande.$date) : new Date(order.dateCommande);
      if (!Number.isNaN(date.getTime())) totals[date.getMonth()] += order.total || 0;
    });
    return monthLabels.map((label, index) => ({ month: label, amount: Math.round(totals[index]) }));
  }, [commandes]);

  const recentOrders = useMemo(() => {
    const clientMap = new Map<string, any>();
    clients.forEach((client) => {
      const id = client._id?.$oid ?? client._id;
      clientMap.set(id, client);
    });

    const statusMap: Record<string, string> = {
      livree: 'Livré',
      'en cours': 'En cours',
      en_cours: 'En cours',
      confirmee: 'Confirmée',
      'en attente': 'En attente',
      en_attente: 'En attente',
      annulee: 'Annulé',
      annule: 'Annulé',
    };

    return [...commandes]
      .sort((a, b) => new Date(b.dateCommande?.$date || b.dateCommande).getTime() - new Date(a.dateCommande?.$date || a.dateCommande).getTime())
      .slice(0, 3)
      .map((order) => {
        const clientId = order.clientId?.$oid ?? order.clientId;
        const client = clientMap.get(clientId);
        const product = order.lignesCommande?.[0]?.nomProduit || 'Produit';
        const date = order.dateCommande?.$date ? new Date(order.dateCommande.$date) : new Date(order.dateCommande);
        return {
          id: `#ORD-${String(order.idCommande ?? '').padStart(4, '0')}`,
          customer: client?.nom || 'Client',
          product,
          amount: `${(order.total || 0).toFixed(2)}€`,
          status: statusMap[order.statut] || 'En cours',
          date: Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('fr-FR'),
        };
      });
  }, [commandes, clients]);

  const systemHealth = [
    { name: 'Serveurs API', status: 'ok', uptime: '99.98%' },
    { name: 'Base de données', status: 'ok', uptime: '99.95%' },
    { name: 'Service IoT', status: 'warning', uptime: '98.2%' },
    { name: 'Système IA', status: 'ok', uptime: '99.9%' },
  ];

  const recentAlerts = useMemo(() => {
    return [...alertes]
      .sort((a, b) => new Date(b.dateAlerte?.$date || b.dateAlerte).getTime() - new Date(a.dateAlerte?.$date || a.dateAlerte).getTime())
      .slice(0, 3)
      .map((alert) => ({
        type: 'warning',
        message: `${alert.type} - ${alert.valeurMesuree}`,
        time: new Date(alert.dateAlerte?.$date || alert.dateAlerte).toLocaleString('fr-FR'),
      }));
  }, [alertes]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Dashboard Administrateur</h1>
        <p className="text-muted-foreground mt-1">
          Vue d'ensemble du système et des opérations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-semibold text-foreground mt-2">{stat.value}</p>
                  <p className={`text-sm ${stat.color} mt-1`}>{stat.change}</p>
                </div>
                <Icon className={`w-10 h-10 ${stat.color} opacity-20`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Growth */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Croissance utilisateurs</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" />
              <XAxis dataKey="month" stroke="#558B2F" />
              <YAxis stroke="#558B2F" />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#2E7D32" 
                strokeWidth={3}
                dot={{ fill: '#2E7D32', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Growth */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Évolution des ventes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" />
              <XAxis dataKey="month" stroke="#558B2F" />
              <YAxis stroke="#558B2F" />
              <Tooltip />
              <Bar dataKey="amount" fill="#2E7D32" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Commandes récentes</h3>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground">{order.id}</p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Livré'
                          ? 'bg-chart-1/20 text-chart-1'
                          : order.status === 'En cours'
                          ? 'bg-yellow-500/20 text-yellow-600'
                          : 'bg-orange-500/20 text-orange-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{order.customer} - {order.product}</p>
                  <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
                </div>
                <p className="font-semibold text-foreground">{order.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">État du système</h3>
          <div className="space-y-4">
            {systemHealth.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  {service.status === 'ok' && (
                    <CheckCircle2 className="w-5 h-5 text-chart-1" />
                  )}
                  {service.status === 'warning' && (
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{service.name}</p>
                    <p className="text-xs text-muted-foreground">Uptime: {service.uptime}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    service.status === 'ok'
                      ? 'bg-chart-1/20 text-chart-1'
                      : 'bg-orange-500/20 text-orange-600'
                  }`}
                >
                  {service.status === 'ok' ? 'Opérationnel' : 'Attention'}
                </span>
              </div>
            ))}
          </div>

          {/* Alerts */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="font-semibold text-foreground mb-3">Alertes récentes</h4>
            <div className="space-y-2">
              {recentAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg text-sm"
                >
                  {alert.type === 'warning' && <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />}
                  {alert.type === 'success' && <CheckCircle2 className="w-4 h-4 text-chart-1 flex-shrink-0 mt-0.5" />}
                  {alert.type === 'info' && <Clock className="w-4 h-4 text-chart-2 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}