import { Activity, Droplets, Sun, Wind, TrendingUp, Flower2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'motion/react';

export function DashboardPage() {
  const statsCards = [
    {
      title: 'Pots Actifs',
      value: '12',
      change: '+2 ce mois',
      icon: Flower2,
      color: 'bg-chart-1',
      trend: 'up'
    },
    {
      title: 'Humidité Moyenne',
      value: '68%',
      change: 'Optimal',
      icon: Droplets,
      color: 'bg-chart-2',
      trend: 'stable'
    },
    {
      title: 'Ensoleillement',
      value: '7.2h',
      change: '+0.5h',
      icon: Sun,
      color: 'bg-chart-3',
      trend: 'up'
    },
    {
      title: 'Qualité de l\'air',
      value: 'Excellente',
      change: 'CO2: 420 ppm',
      icon: Wind,
      color: 'bg-chart-4',
      trend: 'stable'
    },
  ];

  const humidityData = [
    { time: '00h', value: 65 },
    { time: '04h', value: 68 },
    { time: '08h', value: 62 },
    { time: '12h', value: 58 },
    { time: '16h', value: 55 },
    { time: '20h', value: 70 },
  ];

  const plantStatusData = [
    { name: 'Excellente', value: 8, color: '#66BB6A' },
    { name: 'Bonne', value: 3, color: '#81C784' },
    { name: 'Attention', value: 1, color: '#FFA726' },
  ];

  const weeklyActivity = [
    { day: 'Lun', arrosage: 8, nutriments: 3 },
    { day: 'Mar', arrosage: 6, nutriments: 2 },
    { day: 'Mer', arrosage: 10, nutriments: 4 },
    { day: 'Jeu', arrosage: 7, nutriments: 3 },
    { day: 'Ven', arrosage: 9, nutriments: 5 },
    { day: 'Sam', arrosage: 11, nutriments: 4 },
    { day: 'Dim', arrosage: 8, nutriments: 2 },
  ];

  const recentAlerts = [
    { id: 1, type: 'warning', plant: 'Tomate Cerise', message: 'Niveau d\'eau faible', time: 'Il y a 2h' },
    { id: 2, type: 'success', plant: 'Basilic', message: 'Arrosage automatique effectué', time: 'Il y a 4h' },
    { id: 3, type: 'info', plant: 'Menthe', message: 'Croissance optimale détectée', time: 'Il y a 6h' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble de votre jardin intelligent
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-card border border-border rounded-lg">
            <p className="text-xs text-muted-foreground">Dernière mise à jour</p>
            <p className="text-sm font-medium">Il y a 2 minutes</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                  <div className="flex items-center gap-1 text-xs">
                    {stat.trend === 'up' && <TrendingUp className="w-3 h-3 text-chart-1" />}
                    <span className={stat.trend === 'up' ? 'text-chart-1' : 'text-muted-foreground'}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Humidity Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Évolution de l'humidité</h3>
            <p className="text-sm text-muted-foreground">Dernières 24 heures</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={humidityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" />
              <XAxis dataKey="time" stroke="#558B2F" />
              <YAxis stroke="#558B2F" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E8F5E9',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2E7D32" 
                strokeWidth={3}
                dot={{ fill: '#2E7D32', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Plant Status Pie */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">État des plantes</h3>
            <p className="text-sm text-muted-foreground">12 pots surveillés</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={plantStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {plantStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {plantStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Activité de la semaine</h3>
            <p className="text-sm text-muted-foreground">Arrosage et nutriments</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" />
              <XAxis dataKey="day" stroke="#558B2F" />
              <YAxis stroke="#558B2F" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E8F5E9',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Bar dataKey="arrosage" fill="#2E7D32" radius={[8, 8, 0, 0]} />
              <Bar dataKey="nutriments" fill="#66BB6A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Alerts */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Alertes récentes</h3>
            <p className="text-sm text-muted-foreground">Notifications importantes</p>
          </div>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="flex items-start gap-3 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />}
                {alert.type === 'success' && <CheckCircle2 className="w-5 h-5 text-chart-1 flex-shrink-0 mt-0.5" />}
                {alert.type === 'info' && <Activity className="w-5 h-5 text-chart-2 flex-shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{alert.plant}</p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}