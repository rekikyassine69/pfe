import { Users, Activity, ShoppingCart, TrendingUp, AlertCircle, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminPage() {
  const stats = [
    {
      title: 'Utilisateurs actifs',
      value: '2,847',
      change: '+12.5%',
      icon: Users,
      color: 'text-chart-1',
    },
    {
      title: 'Pots connectés',
      value: '8,432',
      change: '+8.3%',
      icon: Activity,
      color: 'text-chart-2',
    },
    {
      title: 'Ventes ce mois',
      value: '24,567€',
      change: '+18.2%',
      icon: ShoppingCart,
      color: 'text-chart-3',
    },
    {
      title: 'Taux de satisfaction',
      value: '98.2%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-chart-1',
    },
  ];

  const userData = [
    { month: 'Jan', users: 1200 },
    { month: 'Fév', users: 1450 },
    { month: 'Mar', users: 1680 },
    { month: 'Avr', users: 1920 },
    { month: 'Mai', users: 2340 },
    { month: 'Juin', users: 2847 },
  ];

  const salesData = [
    { month: 'Jan', amount: 12000 },
    { month: 'Fév', amount: 15400 },
    { month: 'Mar', amount: 18200 },
    { month: 'Avr', amount: 19800 },
    { month: 'Mai', amount: 22100 },
    { month: 'Juin', amount: 24567 },
  ];

  const recentOrders = [
    {
      id: '#ORD-1234',
      customer: 'Marie Dupont',
      product: 'Smart Pot Pro',
      amount: '89.99€',
      status: 'Livré',
      date: 'Il y a 2h',
    },
    {
      id: '#ORD-1235',
      customer: 'Jean Martin',
      product: 'Kit Démarrage IoT',
      amount: '199.99€',
      status: 'En cours',
      date: 'Il y a 4h',
    },
    {
      id: '#ORD-1236',
      customer: 'Sophie Laurent',
      product: 'Station Météo IoT',
      amount: '149.99€',
      status: 'En attente',
      date: 'Il y a 6h',
    },
  ];

  const systemHealth = [
    { name: 'Serveurs API', status: 'ok', uptime: '99.98%' },
    { name: 'Base de données', status: 'ok', uptime: '99.95%' },
    { name: 'Service IoT', status: 'warning', uptime: '98.2%' },
    { name: 'Système IA', status: 'ok', uptime: '99.9%' },
  ];

  const recentAlerts = [
    {
      type: 'warning',
      message: 'Service IoT: Latence élevée détectée',
      time: 'Il y a 15min',
    },
    {
      type: 'success',
      message: 'Mise à jour système déployée avec succès',
      time: 'Il y a 1h',
    },
    {
      type: 'info',
      message: 'Nouveau batch de 50 utilisateurs enregistrés',
      time: 'Il y a 2h',
    },
  ];

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