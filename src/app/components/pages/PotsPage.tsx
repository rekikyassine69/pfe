import { useState, useEffect } from 'react';
import { Flower2, Droplets, Sun, Thermometer, Wind, Plus, Settings, TrendingUp, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { AddPlantModal } from '@/app/components/modals/AddPlantModal';
import { PlantSettingsModal } from '@/app/components/modals/PlantSettingsModal';
import { ExportDataModal } from '@/app/components/modals/ExportDataModal';
import { toast } from 'sonner';

export function PotsPage() {
  const [selectedPot, setSelectedPot] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedPlantForSettings, setSelectedPlantForSettings] = useState<any>(null);
  const [selectedPlantForExport, setSelectedPlantForExport] = useState<string | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [pots, setPots] = useState<any[]>([]);
  const [loadingPots, setLoadingPots] = useState(false);

  // Load pots from API
  useEffect(() => {
    let mounted = true;
    setLoadingPots(true);
    (async () => {
      try {
        const api = await import('@/lib/api');
        const list = await api.getPots();
        if (mounted) setPots(list);
      } catch (err) {
        console.error('Failed to fetch pots', err);
      } finally {
        if (mounted) setLoadingPots(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-chart-1 bg-chart-1/10';
      case 'warning':
        return 'text-orange-500 bg-orange-500/10';
      case 'critical':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'Excellente santé';
      case 'warning':
        return 'Attention requise';
      case 'critical':
        return 'Critique';
      default:
        return 'Inconnue';
    }
  };

  const handleAddPlant = async (plant: any) => {
    try {
      const api = await import('@/lib/api');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const payload = { ...plant, ownerId: user?.id };
      const created = await api.addPot(payload);
      setPots(prev => [...prev, created]);
      toast.success(`Pot "${created.name}" ajouté !`);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'ajout du pot');
    }
  };

  const handleUpdatePlant = async (id: string, updatedData: any) => {
    try {
      const api = await import('@/lib/api');
      const updated = await api.updatePot(id, updatedData);
      setPots(prev => prev.map(p => p.id.toString() === id ? { ...p, ...updated } : p));
      toast.success(`Pot "${updated.name}" mis à jour !`);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la mise à jour du pot');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.success('Données actualisées !');
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleOpenSettings = (pot: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlantForSettings({
      id: pot.id.toString(),
      name: pot.name,
      type: pot.plant,
      location: 'Intérieur',
      wateringFrequency: 2,
      lightLevel: 'Moyenne',
      temperatureRange: '18-25',
    });
    setShowSettingsModal(true);
  };

  const handleExport = (potName?: string) => {
    setSelectedPlantForExport(potName);
    setShowExportModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Mes Pots Connectés</h1>
          <p className="text-muted-foreground mt-1">
            Gérez et surveillez tous vos pots intelligents
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRefresh}
            className={`flex items-center gap-2 px-4 py-3 bg-card border border-border text-foreground rounded-lg hover:bg-secondary transition-colors ${isRefreshing ? 'animate-pulse' : ''}`}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
          <button 
            onClick={() => handleExport()}
            className="flex items-center gap-2 px-4 py-3 bg-card border border-border text-foreground rounded-lg hover:bg-secondary transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Exporter</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter un pot</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de pots</p>
              <p className="text-3xl font-semibold text-foreground mt-2">{pots.length}</p>
            </div>
            <Flower2 className="w-12 h-12 text-primary opacity-20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pots en santé</p>
              <p className="text-3xl font-semibold text-chart-1 mt-2">
                {pots.filter(p => p.status === 'healthy').length}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-chart-1 opacity-20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Attention requise</p>
              <p className="text-3xl font-semibold text-orange-500 mt-2">
                {pots.filter(p => p.status === 'warning').length}
              </p>
            </div>
            <AlertCircle className="w-12 h-12 text-orange-500 opacity-20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Humidité moy.</p>
              <p className="text-3xl font-semibold text-foreground mt-2">
                {Math.round(pots.reduce((acc, p) => acc + p.humidity, 0) / pots.length)}%
              </p>
            </div>
            <Droplets className="w-12 h-12 text-chart-2 opacity-20" />
          </div>
        </div>
      </div>

      {/* Pots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pots.map((pot) => (
          <div
            key={pot.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
            onClick={() => setSelectedPot(pot.id)}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-muted">
              <img
                src={pot.image}
                alt={pot.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pot.status)}`}>
                  {getStatusText(pot.status)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{pot.name}</h3>
                  <p className="text-sm text-muted-foreground italic">{pot.plant}</p>
                </div>
                <button 
                  onClick={(e) => handleOpenSettings(pot, e)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-chart-2/20 rounded-lg flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Humidité</p>
                    <p className="text-sm font-semibold text-foreground">{pot.humidity}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Temp.</p>
                    <p className="text-sm font-semibold text-foreground">{pot.temperature}°C</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Sun className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lumière</p>
                    <p className="text-sm font-semibold text-foreground">{pot.light}h</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Wind className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Air</p>
                    <p className="text-sm font-semibold text-foreground">{pot.airQuality}%</p>
                  </div>
                </div>
              </div>

              {/* Last Watered */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Dernier arrosage: <span className="text-foreground font-medium">{pot.lastWatered}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddPlantModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddPlant}
      />
      <PlantSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        plant={selectedPlantForSettings}
        onUpdate={handleUpdatePlant}
      />
      <ExportDataModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        plantName={selectedPlantForExport}
      />
    </div>
  );
}