import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { BookOpen, Clock, Users, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id?: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  enrolled?: number;
}

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onSave: (course: Course) => void;
  mode: 'add' | 'edit' | 'view';
}

export function CourseModal({ isOpen, onClose, course, onSave, mode }: CourseModalProps) {
  const [formData, setFormData] = useState<Course>({
    title: '',
    description: '',
    duration: '2h',
    level: 'Débutant',
    category: 'Plantation',
  });

  useEffect(() => {
    if (course && mode !== 'add') {
      setFormData(course);
    } else {
      setFormData({
        title: '',
        description: '',
        duration: '2h',
        level: 'Débutant',
        category: 'Plantation',
      });
    }
  }, [course, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success(mode === 'add' ? 'Cours créé avec succès !' : 'Cours mis à jour !');
    onClose();
  };

  const isViewMode = mode === 'view';
  const title = mode === 'add' ? 'Nouveau Cours' : mode === 'edit' ? 'Modifier le Cours' : course?.title || 'Détails du Cours';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <BookOpen className="w-4 h-4 inline mr-2" />
            Titre du cours *
          </label>
          <input
            type="text"
            required
            disabled={isViewMode}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Introduction au jardinage"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            required
            disabled={isViewMode}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Décrivez le contenu du cours..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Durée *
            </label>
            <select
              required
              disabled={isViewMode}
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="1h">1 heure</option>
              <option value="2h">2 heures</option>
              <option value="3h">3 heures</option>
              <option value="4h">4 heures</option>
              <option value="1j">1 jour</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Niveau *
            </label>
            <select
              required
              disabled={isViewMode}
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Catégorie *
          </label>
          <select
            required
            disabled={isViewMode}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="Plantation">Plantation</option>
            <option value="Entretien">Entretien</option>
            <option value="Récolte">Récolte</option>
            <option value="Maladies">Maladies & Parasites</option>
            <option value="Techniques">Techniques avancées</option>
          </select>
        </div>

        {/* View Mode: Show enrolled count */}
        {isViewMode && formData.enrolled !== undefined && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {formData.enrolled} participants inscrits
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {isViewMode ? 'Fermer' : 'Annuler'}
          </button>
          {!isViewMode && (
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {mode === 'add' ? 'Créer le cours' : 'Enregistrer'}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
