import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { Calendar, Download, Filter, RefreshCw } from 'lucide-react';

export function MonitoringPage() {
  const [selectedMetric, setSelectedMetric] = useState('humidity');
  const [timeRange, setTimeRange] = useState('24h');

  const humidityData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    pot1: 65 + Math.random() * 10,
    pot2: 70 + Math.random() * 8,
    pot3: 55 + Math.random() * 15,
  }));

  const temperatureData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    pot1: 20 + Math.random() * 5,
    pot2: 22 + Math.random() * 4,
    pot3: 24 + Math.random() * 3,
  }));

  const lightData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    pot1: i >= 6 && i <= 18 ? 8 + Math.random() * 2 : Math.random() * 2,
    pot2: i >= 6 && i <= 18 ? 7 + Math.random() * 2 : Math.random() * 1.5,
    pot3: i >= 6 && i <= 18 ? 6 + Math.random() * 2 : Math.random() * 1,
  }));

  const getCurrentData = () => {
    switch (selectedMetric) {
      case 'temperature':
        return temperatureData;
      case 'light':
        return lightData;
      default:
        return humidityData;
    }
  };

  const metrics = [
    { id: 'humidity', label: 'Humidité', unit: '%', color: '#2E7D32' },
    { id: 'temperature', label: 'Température', unit: '°C', color: '#FF6B35' },
    { id: 'light', label: 'Ensoleillement', unit: 'h', color: '#FFB800' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Surveillance en Temps Réel</h1>
          <p className="text-muted-foreground mt-1">
            Suivez l'évolution de vos plantes en direct
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-secondary transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm">Exporter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Actualiser</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Metric Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Métrique
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {metrics.map((metric) => (
                <option key={metric.id} value={metric.id}>
                  {metric.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Période
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="24h">Dernières 24h</option>
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="custom">Personnalisé</option>
            </select>
          </div>

          {/* Pot Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Pots</label>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm">
                Tomate
              </button>
              <button className="px-3 py-1.5 bg-chart-2 text-white rounded-lg text-sm">
                Basilic
              </button>
              <button className="px-3 py-1.5 bg-chart-3 text-white rounded-lg text-sm">
                Menthe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Évolution - {metrics.find(m => m.id === selectedMetric)?.label}
          </h3>
          <p className="text-sm text-muted-foreground">Données en temps réel</p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={getCurrentData()}>
            <defs>
              <linearGradient id="colorPot1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPot2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#66BB6A" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPot3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A5D6A7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#A5D6A7" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            <Legend />
            <Area 
              type="monotone" 
              dataKey="pot1" 
              stroke="#2E7D32" 
              fillOpacity={1} 
              fill="url(#colorPot1)"
              name="Tomate Cerise"
            />
            <Area 
              type="monotone" 
              dataKey="pot2" 
              stroke="#66BB6A" 
              fillOpacity={1} 
              fill="url(#colorPot2)"
              name="Basilic"
            />
            <Area 
              type="monotone" 
              dataKey="pot3" 
              stroke="#A5D6A7" 
              fillOpacity={1} 
              fill="url(#colorPot3)"
              name="Menthe"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Tomate Cerise', 'Basilic', 'Menthe Poivrée'].map((plant, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-6">
            <h4 className="font-semibold text-foreground mb-4">{plant}</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Humidité moyenne</span>
                <span className="text-sm font-semibold text-foreground">
                  {(65 + index * 5).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Température moyenne</span>
                <span className="text-sm font-semibold text-foreground">
                  {(22 + index).toFixed(1)}°C
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ensoleillement total</span>
                <span className="text-sm font-semibold text-foreground">
                  {(7 - index * 0.5).toFixed(1)}h
                </span>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">État général</span>
                  <span className="text-sm font-semibold text-chart-1">Excellent</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
