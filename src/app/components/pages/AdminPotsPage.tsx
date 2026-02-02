import { useState } from 'react';
import { Flower2, Search, Plus, Edit2, Trash2, Wifi, WifiOff, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { AddPlantModal } from '@/app/components/modals/AddPlantModal';
import { PlantSettingsModal } from '@/app/components/modals/PlantSettingsModal';
import { DeleteConfirmModal } from '@/app/components/modals/DeleteConfirmModal';

export function AdminPotsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPot, setSelectedPot] = useState<any>(null);

  const [pots, setPots] = useState([
    {
      id: 'POT-001',
      name: 'Monstera Deliciosa',
      owner: 'Marie Dupont',
      location: 'Salon',
      status: 'En ligne',
      humidity: 68,
      temperature: 22,
      light: 7500,
      battery: 85,
      lastUpdate: 'Il y a 5 min',
    },
    {
      id: 'POT-002',
      name: 'Ficus Lyrata',
      owner: 'Jean Martin',
      location: 'Bureau',
      status: 'En ligne',
      humidity: 72,
      temperature: 21,
      light: 6200,
      battery: 92,
      lastUpdate: 'Il y a 2 min',
    },
    {
      id: 'POT-003',
      name: 'Pothos',
      owner: 'Sophie Laurent',
      location: 'Cuisine',
      status: 'Hors ligne',
      humidity: 45,
      temperature: 20,
      light: 4100,
      battery: 12,
      lastUpdate: 'Il y a 2h',
    },
    {
      id: 'POT-004',
      name: 'Sansevieria',
      owner: 'Camille Bernard',
      location: 'Chambre',
      status: 'En ligne',
      humidity: 55,
      temperature: 23,
      light: 3500,
      battery: 78,
      lastUpdate: 'Il y a 1 min',
    },
  ]);

  const stats = [
    { label: 'Total Pots', value: '8,432', icon: Flower2, color: 'text-chart-1' },
    { label: 'En ligne', value: '7,891', icon: Wifi, color: 'text-green-500' },
    { label: 'Hors ligne', value: '541', icon: WifiOff, color: 'text-orange-500' },
    { label: 'Alertes Actives', value: '23', icon: Activity, color: 'text-red-500' },
  ];

  const handleAddPot = (pot: any) => {
    const newPot = {
      ...pot,
      id: `POT-${String(pots.length + 1).padStart(3, '0')}`,
      owner: 'Non assigné',
      location: pot.location || 'Non défini',
      status: 'En ligne',
      humidity: pot.humidity || 65,
      temperature: pot.temperature || 22,
      light: 7500,
      battery: 100,
      lastUpdate: 'Il y a quelques secondes',
    };
    setPots([...pots, newPot]);
  };

  const handleEdit = (pot: any) => {
    setSelectedPot({
      id: pot.id,
      name: pot.name,
      type: pot.name,
      location: pot.location,
      wateringFrequency: 2,
      lightLevel: 'Moyenne',
      temperatureRange: '18-25',
    });
    setShowEditModal(true);
  };

  const handleUpdatePot = (id: string, updatedData: any) => {
    setPots(pots.map(pot => 
      pot.id === id ? { ...pot, name: updatedData.name, location: updatedData.location } : pot
    ));
  };

  const handleDeleteClick = (pot: any) => {
    setSelectedPot(pot);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPot) {
      setPots(pots.filter(pot => pot.id !== selectedPot.id));
      toast.success(`Pot "${selectedPot.name}" supprimé !`);
      setSelectedPot(null);
    }
  };

  const filteredPots = pots.filter(pot =>
    pot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pot.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pot.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Gestion des Pots Connectés</h1>
        <p className="text-muted-foreground mt-1">
          Surveillez et gérez tous les pots intelligents de la plateforme
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

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un pot..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter Pot
        </button>
      </div>

      {/* Pots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPots.map((pot, index) => (
          <motion.div
            key={pot.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Flower2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{pot.name}</h3>
                  <p className="text-xs text-muted-foreground">{pot.id}</p>
                </div>
              </div>
              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                pot.status === 'En ligne'
                  ? 'bg-green-500/20 text-green-600'
                  : 'bg-orange-500/20 text-orange-600'
              }`}>
                {pot.status === 'En ligne' ? (
                  <Wifi className="w-3 h-3" />
                ) : (
                  <WifiOff className="w-3 h-3" />
                )}
                {pot.status}
              </span>
            </div>

            {/* Owner */}
            <div className="mb-4 pb-4 border-b border-border">
              <p className="text-sm text-muted-foreground">Propriétaire</p>
              <p className="text-sm font-medium text-foreground">{pot.owner}</p>
              <p className="text-xs text-muted-foreground">{pot.location}</p>
            </div>

            {/* Sensors */}
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Humidité</span>
                  <span className="font-medium text-foreground">{pot.humidity}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${pot.humidity}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Batterie</span>
                  <span className="font-medium text-foreground">{pot.battery}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      pot.battery > 50 ? 'bg-green-500' : pot.battery > 20 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${pot.battery}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Température</p>
                  <p className="font-medium text-foreground">{pot.temperature}°C</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Lumière</p>
                  <p className="font-medium text-foreground">{pot.light} lux</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">
                Mis à jour: {pot.lastUpdate}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(pot)}
                  className="flex-1 px-3 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Éditer
                </button>
                <button
                  onClick={() => handleDeleteClick(pot)}
                  className="px-3 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      <AddPlantModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddPot}
      />
      <PlantSettingsModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        plant={selectedPot}
        onUpdate={handleUpdatePot}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le pot"
        message="Êtes-vous sûr de vouloir supprimer ce pot ?"
        itemName={selectedPot?.name}
      />
    </div>
  );
}