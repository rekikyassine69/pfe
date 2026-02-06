import { useState } from 'react';
import { Modal } from './Modal';
import { Package, Tag, Image, DollarSign, Boxes, Bookmark } from 'lucide-react';

interface ProductFormData {
  nom: string;
  description: string;
  categorie: string;
  prix: string;
  quantiteStock: string;
  imageUrl: string;
  statut: 'disponible' | 'rupture' | 'bientôt';
  marque: string;
  estBestseller: boolean;
  note: string;
  capteurs: string;
  connectivite: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: {
    nom: string;
    description: string;
    categorie: string;
    prix: number;
    quantiteStock: number;
    imageUrl?: string;
    statut: 'disponible' | 'rupture' | 'bientôt';
    marque?: string;
    estBestseller: boolean;
    note?: number;
    specifications?: {
      capteurs?: string[];
      connectivite?: string;
    };
  }) => void;
}

export function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    nom: '',
    description: '',
    categorie: '',
    prix: '',
    quantiteStock: '',
    imageUrl: '',
    statut: 'disponible',
    marque: '',
    estBestseller: false,
    note: '',
    capteurs: '',
    connectivite: '',
  });

  const handleImageUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setFormData((prev) => ({ ...prev, imageUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAdd({
      nom: formData.nom.trim(),
      description: formData.description.trim(),
      categorie: formData.categorie.trim(),
      prix: Number(formData.prix) || 0,
      quantiteStock: Number(formData.quantiteStock) || 0,
      imageUrl: formData.imageUrl.trim() || undefined,
      statut: formData.statut,
      marque: formData.marque.trim() || undefined,
      estBestseller: formData.estBestseller,
      note: formData.note ? Number(formData.note) : undefined,
      specifications: {
        capteurs: formData.capteurs
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        connectivite: formData.connectivite.trim() || undefined,
      },
    });

    setFormData({
      nom: '',
      description: '',
      categorie: '',
      prix: '',
      quantiteStock: '',
      imageUrl: '',
      statut: 'disponible',
      marque: '',
      estBestseller: false,
      note: '',
      capteurs: '',
      connectivite: '',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un produit" maxWidth="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Package className="w-4 h-4 inline mr-2" />
              Nom du produit *
            </label>
            <input
              type="text"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Ex: Engrais bio universel 500ml"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Catégorie *
            </label>
            <input
              type="text"
              required
              value={formData.categorie}
              onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
              placeholder="Ex: engrais, capteurs, kits"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Bookmark className="w-4 h-4 inline mr-2" />
            Marque
          </label>
          <input
            type="text"
            value={formData.marque}
            onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
            placeholder="Ex: SmartPlant"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Prix *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.prix}
              onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Boxes className="w-4 h-4 inline mr-2" />
              Stock *
            </label>
            <input
              type="number"
              required
              min="0"
              step="1"
              value={formData.quantiteStock}
              onChange={(e) => setFormData({ ...formData, quantiteStock: e.target.value })}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Statut *
            </label>
            <select
              required
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value as ProductFormData['statut'] })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="disponible">Disponible</option>
              <option value="rupture">Rupture</option>
              <option value="bientôt">Bientot</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Image className="w-4 h-4 inline mr-2" />
              Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Importer une image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              L'image est enregistree dans la base en data URL.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Note (0-5)
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="4.5"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Capteurs (liste separee par virgules)
            </label>
            <input
              type="text"
              value={formData.capteurs}
              onChange={(e) => setFormData({ ...formData, capteurs: e.target.value })}
              placeholder="Humidite, Temperature, Lumiere"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Connectivite
          </label>
          <input
            type="text"
            value={formData.connectivite}
            onChange={(e) => setFormData({ ...formData, connectivite: e.target.value })}
            placeholder="Wi-Fi, Bluetooth"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={formData.estBestseller}
            onChange={(e) => setFormData({ ...formData, estBestseller: e.target.checked })}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          Best-seller
        </label>

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
            Ajouter le produit
          </button>
        </div>
      </form>
    </Modal>
  );
}
