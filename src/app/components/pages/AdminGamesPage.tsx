import { useEffect, useMemo, useState } from 'react';
import { Gamepad2, Search, Plus, Edit2, Trash2, Users, Trophy, BarChart3, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { GameModal } from '@/app/components/modals/GameModal';
import { DeleteConfirmModal } from '@/app/components/modals/DeleteConfirmModal';
import { useCollection } from '@/app/hooks/useCollection';

export function AdminGamesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showGameModal, setShowGameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view' | 'stats'>('add');

  const [games, setGames] = useState<any[]>([]);
  const { data: jeux } = useCollection<any>('jeux');
  const { data: scores } = useCollection<any>('scores');

  const scoreByGame = useMemo(() => {
    const map = new Map<string, number[]>();
    scores.forEach((score) => {
      const gameId = score.jeuId?.$oid ?? score.jeuId;
      if (!gameId) return;
      const list = map.get(gameId) || [];
      list.push(score.valeur || 0);
      map.set(gameId, list);
    });
    return map;
  }, [scores]);

  useEffect(() => {
    const difficultyFromType = (type: string) => {
      if (type === 'memory') return 'Facile';
      if (type === 'quiz') return 'Moyen';
      return 'Avancé';
    };

    const mapped = jeux.map((game) => {
      const gameId = game._id?.$oid ?? game._id;
      const scoresList = scoreByGame.get(gameId) || [];
      const avgScore = scoresList.length
        ? Math.round(scoresList.reduce((sum, v) => sum + v, 0) / scoresList.length)
        : 0;
      return {
        id: game.idJeu ?? game._id,
        title: game.nomJeu,
        description: game.description,
        icon: '🎮',
        difficulty: difficultyFromType(game.type),
        status: 'Actif',
        players: new Set(scoresList).size || scoresList.length,
        completions: scoresList.length,
        avgScore,
        lastPlayed: 'Récemment',
      };
    });

    if (mapped.length) setGames(mapped);
  }, [jeux, scoreByGame]);

  const totalGames = games.length;
  const totalPlays = games.reduce((sum, game) => sum + (game.completions || 0), 0);
  const avgScore = games.length
    ? Math.round(games.reduce((sum, game) => sum + (game.avgScore || 0), 0) / games.length)
    : 0;

  const stats = [
    { label: 'Total Jeux', value: String(totalGames), icon: Gamepad2, color: 'text-chart-1' },
    { label: 'Joueurs Actifs', value: String(totalPlays), icon: Users, color: 'text-chart-2' },
    { label: 'Parties Jouées', value: String(totalPlays), icon: Trophy, color: 'text-chart-3' },
    { label: 'Score Moyen', value: `${avgScore}%`, icon: BarChart3, color: 'text-yellow-500' },
  ];

  const handleAdd = () => {
    setSelectedGame(null);
    setModalMode('add');
    setShowGameModal(true);
  };

  const handleView = (game: any) => {
    setSelectedGame({
      id: game.id.toString(),
      title: game.title,
      description: game.description,
      difficulty: game.difficulty,
      category: 'Quiz',
      points: 100,
      players: game.players,
    });
    setModalMode('view');
    setShowGameModal(true);
  };

  const handleStats = (game: any) => {
    setSelectedGame({
      id: game.id.toString(),
      title: game.title,
      description: game.description,
      difficulty: game.difficulty,
      category: 'Quiz',
      points: 100,
      players: game.players,
    });
    setModalMode('stats');
    setShowGameModal(true);
  };

  const handleEdit = (game: any) => {
    setSelectedGame({
      id: game.id.toString(),
      title: game.title,
      description: game.description,
      difficulty: game.difficulty,
      category: 'Quiz',
      points: 100,
      players: game.players,
    });
    setModalMode('edit');
    setShowGameModal(true);
  };

  const handleSaveGame = (gameData: any) => {
    if (modalMode === 'add') {
      const newGame = {
        id: games.length + 1,
        title: gameData.title,
        description: gameData.description,
        icon: '🎮',
        difficulty: gameData.difficulty,
        status: 'Actif',
        players: 0,
        completions: 0,
        avgScore: 0,
        lastPlayed: 'Jamais',
      };
      setGames([...games, newGame]);
    } else if (modalMode === 'edit') {
      setGames(games.map(g => 
        g.id.toString() === gameData.id 
          ? { ...g, title: gameData.title, description: gameData.description, difficulty: gameData.difficulty }
          : g
      ));
    }
  };

  const handleDeleteClick = (game: any) => {
    setSelectedGame(game);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedGame) {
      setGames(games.filter(g => g.id !== selectedGame.id));
      toast.success(`Jeu "${selectedGame.title}" supprimé !`);
      setSelectedGame(null);
    }
  };

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-500/20 text-green-600';
      case 'Beta':
        return 'bg-yellow-500/20 text-yellow-600';
      case 'Maintenance':
        return 'bg-orange-500/20 text-orange-600';
      default:
        return 'bg-gray-500/20 text-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile':
        return 'bg-green-500/20 text-green-600';
      case 'Moyen':
        return 'bg-yellow-500/20 text-yellow-600';
      case 'Avancé':
        return 'bg-orange-500/20 text-orange-600';
      default:
        return 'bg-gray-500/20 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Gestion des Jeux Éducatifs</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les jeux et suivez les statistiques de jeu
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
            placeholder="Rechercher un jeu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouveau Jeu
        </button>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGames.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="text-5xl">{game.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
                    {game.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {game.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {game.description}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-border">
              <div className="text-center">
                <Users className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-sm font-semibold text-foreground">{game.players.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Joueurs</p>
              </div>
              <div className="text-center">
                <Trophy className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-sm font-semibold text-foreground">{game.completions.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Complété</p>
              </div>
              <div className="text-center">
                <BarChart3 className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-sm font-semibold text-foreground">{game.avgScore}%</p>
                <p className="text-xs text-muted-foreground">Score moy.</p>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Taux de complétion</span>
                <span className="font-medium text-foreground">
                  {Math.round((game.completions / game.players) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(game.completions / game.players) * 100}%` }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Dernière partie: {game.lastPlayed}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStats(game)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  title="Statistiques"
                >
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleEdit(game)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  title="Éditer"
                >
                  <Edit2 className="w-4 h-4 text-primary" />
                </button>
                <button
                  onClick={() => handleDeleteClick(game)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      <GameModal
        isOpen={showGameModal}
        onClose={() => setShowGameModal(false)}
        game={selectedGame}
        mode={modalMode}
        onSave={handleSaveGame}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le jeu"
        message="Êtes-vous sûr de vouloir supprimer ce jeu ?"
        itemName={selectedGame?.title}
      />
    </div>
  );
}