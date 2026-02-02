import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Gamepad2, Trophy, Star, Users, BarChart } from 'lucide-react';
import { toast } from 'sonner';

interface Game {
  id?: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  points: number;
  players?: number;
}

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  onSave: (game: Game) => void;
  mode: 'add' | 'edit' | 'view' | 'stats';
}

export function GameModal({ isOpen, onClose, game, onSave, mode }: GameModalProps) {
  const [formData, setFormData] = useState<Game>({
    title: '',
    description: '',
    difficulty: 'Facile',
    category: 'Quiz',
    points: 100,
  });

  useEffect(() => {
    if (game && mode !== 'add') {
      setFormData(game);
    } else {
      setFormData({
        title: '',
        description: '',
        difficulty: 'Facile',
        category: 'Quiz',
        points: 100,
      });
    }
  }, [game, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success(mode === 'add' ? 'Jeu créé avec succès !' : 'Jeu mis à jour !');
    onClose();
  };

  const isViewMode = mode === 'view' || mode === 'stats';
  const title = mode === 'add' 
    ? 'Nouveau Jeu' 
    : mode === 'edit' 
    ? 'Modifier le Jeu' 
    : mode === 'stats'
    ? `Statistiques - ${game?.title || ''}`
    : game?.title || 'Détails du Jeu';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="lg">
      {mode === 'stats' ? (
        // Statistics View
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Joueurs</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {game?.players || 1234}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Score moyen</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {Math.floor(Math.random() * 500 + 500)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Note moyenne</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    4.{Math.floor(Math.random() * 10)}/5
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <BarChart className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="text-sm text-orange-600 dark:text-orange-400">Taux de réussite</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {Math.floor(Math.random() * 20 + 70)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Players */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Top 5 Joueurs
            </h3>
            <div className="space-y-2">
              {[
                { name: 'Marie D.', score: 950, rank: 1 },
                { name: 'Jean M.', score: 920, rank: 2 },
                { name: 'Sophie L.', score: 890, rank: 3 },
                { name: 'Pierre D.', score: 850, rank: 4 },
                { name: 'Camille B.', score: 820, rank: 5 },
              ].map((player) => (
                <div
                  key={player.rank}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      player.rank === 1 
                        ? 'bg-yellow-500 text-white' 
                        : player.rank === 2 
                        ? 'bg-gray-400 text-white'
                        : player.rank === 3
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}>
                      {player.rank}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{player.name}</span>
                  </div>
                  <span className="font-bold text-green-600">{player.score} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      ) : (
        // Form View
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Gamepad2 className="w-4 h-4 inline mr-2" />
              Titre du jeu *
            </label>
            <input
              type="text"
              required
              disabled={isViewMode}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Quiz des Plantes"
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
              placeholder="Décrivez le jeu..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="Quiz">Quiz</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Simulation">Simulation</option>
                <option value="Mémoire">Mémoire</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulté *
              </label>
              <select
                required
                disabled={isViewMode}
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>

            {/* Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Trophy className="w-4 h-4 inline mr-2" />
                Points *
              </label>
              <input
                type="number"
                required
                disabled={isViewMode}
                min="10"
                max="1000"
                step="10"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* View Mode: Show players count */}
          {isViewMode && formData.players !== undefined && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {formData.players} joueurs actifs
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
                {mode === 'add' ? 'Créer le jeu' : 'Enregistrer'}
              </button>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
}
