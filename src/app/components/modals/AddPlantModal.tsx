import { useState } from 'react';
import { Modal } from './Modal';
import { Flower2, Droplet, Sun, Thermometer } from 'lucide-react';
import { toast } from 'sonner';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plant: any) => void;
}

export function AddPlantModal({ isOpen, onClose, onAdd }: AddPlantModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Tomate',
    location: 'Intérieur',
    wateringFrequency: '2',
    lightLevel: 'Moyenne',
    temperatureRange: '18-25',
  });

  const plantTypes = ['Tomate', 'Basilic', 'Menthe', 'Laitue', 'Fraise', 'Persil', 'Cactus', 'Fougère'];
  const locations = ['Intérieur', 'Extérieur', 'Balcon', 'Jardin', 'Serre'];
  const lightLevels = ['Faible', 'Moyenne', 'Forte'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPlant = {
      name: formData.name,
      plant: formData.type,
      location: formData.location,
      status: 'healthy' as const,
      humidity: 65,
      temperature: 22,
      light: 75,
      lastWatered: new Date().toISOString(),
      wateringFrequency: parseInt(formData.wateringFrequency),
      lightLevel: formData.lightLevel,
      temperatureRange: formData.temperatureRange,
      isConnected: true,
    };

    onAdd(newPlant);
    toast.success(`Pot "${formData.name}" ajouté avec succès !`);
    setFormData({
      name: '',
      type: 'Tomate',
      location: 'Intérieur',
      wateringFrequency: '2',
      lightLevel: 'Moyenne',
      temperatureRange: '18-25',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un nouveau pot" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom du pot */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nom du pot *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Mon Basilic"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Type de plante */}
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

        {/* Emplacement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fréquence d'arrosage */}
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

          {/* Niveau de lumière */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Sun className="w-4 h-4 inline mr-2" />
              Lumière *
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

        {/* Plage de température */}
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
            Ajouter le pot
          </button>
        </div>
      </form>
    </Modal>
  );
}
