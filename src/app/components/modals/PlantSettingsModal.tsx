import { useState } from 'react';
import { Modal } from './Modal';
import { Flower2, Droplet, Sun, Thermometer, MapPin, Bell, Wifi } from 'lucide-react';
import { toast } from 'sonner';

interface Plant {
  id: string;
  name: string;
  type: string;
  location: string;
  wateringFrequency: number;
  lightLevel: string;
  temperatureRange: string;
}

interface PlantSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plant: Plant | null;
  onUpdate: (id: string, updatedPlant: Partial<Plant>) => void;
}

export function PlantSettingsModal({ isOpen, onClose, plant, onUpdate }: PlantSettingsModalProps) {
  const [formData, setFormData] = useState({
    name: plant?.name || '',
    type: plant?.type || 'Tomate',
    location: plant?.location || 'Intérieur',
    wateringFrequency: plant?.wateringFrequency.toString() || '2',
    lightLevel: plant?.lightLevel || 'Moyenne',
    temperatureRange: plant?.temperatureRange || '18-25',
    notifications: true,
    autoWatering: false,
  });

  const plantTypes = ['Tomate', 'Basilic', 'Menthe', 'Laitue', 'Fraise', 'Persil', 'Cactus', 'Fougère'];
  const locations = ['Intérieur', 'Extérieur', 'Balcon', 'Jardin', 'Serre'];
  const lightLevels = ['Faible', 'Moyenne', 'Forte'];

  // Update formData when plant changes
  useState(() => {
    if (plant) {
      setFormData({
        name: plant.name,
        type: plant.type,
        location: plant.location,
        wateringFrequency: plant.wateringFrequency.toString(),
        lightLevel: plant.lightLevel,
        temperatureRange: plant.temperatureRange,
        notifications: true,
        autoWatering: false,
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plant) return;

    const updatedData = {
      name: formData.name,
      type: formData.type,
      location: formData.location,
      wateringFrequency: parseInt(formData.wateringFrequency),
      lightLevel: formData.lightLevel,
      temperatureRange: formData.temperatureRange,
    };

    onUpdate(plant.id, updatedData);
    toast.success(`Paramètres de "${formData.name}" mis à jour !`);
    onClose();
  };

  if (!plant) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Paramètres - ${plant.name}`} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations générales */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
            Informations générales
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom du pot *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Flower2 className="w-4 h-4 inline mr-2" />
                Type de plante *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {plantTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Emplacement *
              </label>
              <select
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Paramètres de culture */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
            Paramètres de culture
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Droplet className="w-4 h-4 inline mr-2" />
                Arrosage (jours) *
              </label>
              <input
                type="number"
                required
                min="1"
                max="30"
                value={formData.wateringFrequency}
                onChange={(e) => setFormData({ ...formData, wateringFrequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Sun className="w-4 h-4 inline mr-2" />
                Niveau de lumière *
              </label>
              <select
                required
                value={formData.lightLevel}
                onChange={(e) => setFormData({ ...formData, lightLevel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {lightLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Thermometer className="w-4 h-4 inline mr-2" />
              Température optimale (°C)
            </label>
            <input
              type="text"
              value={formData.temperatureRange}
              onChange={(e) => setFormData({ ...formData, temperatureRange: e.target.value })}
              placeholder="Ex: 18-25"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Préférences */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
            Préférences
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Notifications</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Recevoir des alertes pour ce pot</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Arrosage automatique</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Activer l'arrosage automatisé</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.autoWatering}
                onChange={(e) => setFormData({ ...formData, autoWatering: e.target.checked })}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </Modal>
  );
}
