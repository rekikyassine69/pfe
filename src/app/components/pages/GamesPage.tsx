import { useEffect, useMemo, useState } from 'react';
import { Trophy, Gift, TrendingUp, Star, Zap } from 'lucide-react';
import { useCollection } from '@/app/hooks/useCollection';
import { MemoryGameModal } from '../modals/MemoryGameModal';
import { ImagePuzzleModal } from '../modals/ImagePuzzleModal';
import { QuizGameModal } from '../modals/QuizGameModal';
import { HydrationRaceModal } from '../modals/HydrationRaceModal';
import { SensorPuzzleModal } from '../modals/SensorPuzzleModal';
import { VirtualGardenModal } from '../modals/VirtualGardenModal';

export function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [playerScores, setPlayerScores] = useState<any[]>([]);
  const { data: jeux } = useCollection<any>('jeux');
  const { data: scores } = useCollection<any>('scores');
  const { data: clients } = useCollection<any>('clients');

  const clientsById = useMemo(() => {
    const map = new Map<string, any>();
    clients.forEach((client) => {
      const id = client._id?.$oid ?? client._id;
      map.set(id, client);
    });
    return map;
  }, [clients]);

  const scoresByGame = useMemo(() => {
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
    const colors = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4'];
    const gameEmojis = ['🧠', '🎯', '🎨', '🔧', '🏡'];

    const mapped = jeux.map((game, index) => {
      const gameId = game._id?.$oid ?? game._id;
      const gameScores = scoresByGame.get(gameId) || [];
      const highScore = gameScores.length ? Math.max(...gameScores) : 0;
      return {
        id: game.idJeu ?? game._id,
        title: game.nomJeu,
        description: game.description,
        color: colors[index % colors.length],
        emoji: gameEmojis[index % gameEmojis.length],
        players: gameScores.length,
        highScore,
        played: highScore > 0,
        type: game.type,
        difficulty: game.difficulte || 'moyen',
      };
    });

    if (mapped.length) setGames(mapped);
  }, [jeux, scoresByGame]);

  useEffect(() => {
    const topScores = [...scores]
      .sort((a, b) => (b.valeur || 0) - (a.valeur || 0))
      .slice(0, 6)
      .map((score, index) => {
        const clientId = score.clientId?.$oid ?? score.clientId;
        const client = clientsById.get(clientId);
        return {
          rank: index + 1,
          name: client?.nom || 'Joueur',
          score: score.valeur || 0,
          avatar: index === 0 ? '🌟' : index === 1 ? '🌱' : index === 2 ? '🌿' : '🌻',
          isUser: false,
        };
      });

    if (topScores.length) setLeaderboard(topScores);
  }, [scores, clientsById]);

  const handleGameScore = (gameType: string, score: number, time: number) => {
    const newScore = {
      gameType,
      score,
      time,
      date: new Date(),
    };
    setPlayerScores([...playerScores, newScore]);
    setActiveGame(null);
  };

  const handlePlayGame = (game: any) => {
    if (game.type === 'memory') setActiveGame('memory');
    else if (game.type === 'quiz') setActiveGame('quiz');
    else if (game.type === 'runner') setActiveGame('hydration');
    else if (game.type === 'puzzle' && game.id === 4) setActiveGame('sensor-puzzle');
    else if (game.type === 'puzzle') setActiveGame('image-puzzle');
    else if (game.type === 'strategy') setActiveGame('virtual-garden');
  };

  const achievements = [
    { id: 1, title: 'Premier pas', description: 'Jouer à votre premier jeu', unlocked: true, icon: '🎮' },
    { id: 2, title: 'Expert IoT', description: 'Réussir tous les niveaux de Puzzle des Capteurs', unlocked: true, icon: '🎯' },
    { id: 3, title: 'Botaniste', description: 'Identifier 50 plantes correctement', unlocked: true, icon: '🌿' },
    { id: 4, title: 'Maître Jardinier', description: 'Atteindre un score de 1000 au Jardin Virtuel', unlocked: false, icon: '🏆' },
    { id: 5, title: 'Ingénieur', description: 'Créer 20 systèmes IoT fonctionnels', unlocked: false, icon: '⚡' },
    { id: 6, title: 'Champion', description: 'Entrer dans le top 3 du classement global', unlocked: false, icon: '👑' },
  ];

  const dailyChallenge = {
    title: 'Défi du jour: Quiz Botanique',
    description: 'Répondez correctement à 5 questions consécutives',
    reward: '+250 points',
    timeLeft: '18h 45min',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Jeux Éducatifs</h1>
          <p className="text-muted-foreground mt-1">
            Apprenez en vous amusant avec nos jeux interactifs et gagnez des points
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Points totaux</p>
              <p className="text-3xl font-semibold text-foreground mt-2">
                {playerScores.reduce((sum, s) => sum + s.score, 0)}
              </p>
            </div>
            <Star className="w-10 h-10 text-yellow-500 opacity-20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Jeux joues</p>
              <p className="text-3xl font-semibold text-chart-1 mt-2">{games.length}</p>
            </div>
            <Trophy className="w-10 h-10 text-chart-1 opacity-20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Succes debloques</p>
              <p className="text-3xl font-semibold text-foreground mt-2">3/6</p>
            </div>
            <Gift className="w-10 h-10 text-chart-3 opacity-20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sessions</p>
              <p className="text-3xl font-semibold text-foreground mt-2">{playerScores.length}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-chart-2 opacity-20" />
          </div>
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6" />
              <h3 className="text-xl font-semibold">{dailyChallenge.title}</h3>
            </div>
            <p className="text-white/90">{dailyChallenge.description}</p>
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <p className="text-sm">
                  Recompense: <span className="font-semibold">{dailyChallenge.reward}</span>
                </p>
              </div>
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <p className="text-sm">
                  Expire dans: <span className="font-semibold">{dailyChallenge.timeLeft}</span>
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveGame('quiz')}
            className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            Jouer maintenant
          </button>
        </div>
      </div>

      {/* Games Grid */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Tous les jeux ({games.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-xl hover:border-primary transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`w-16 h-16 ${game.color} bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <span className="text-4xl">{game.emoji}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      game.difficulty === 'facile'
                        ? 'bg-green-500/20 text-green-600'
                        : game.difficulty === 'moyen'
                        ? 'bg-yellow-500/20 text-yellow-600'
                        : 'bg-red-500/20 text-red-600'
                    }`}
                  >
                    {game.difficulty?.charAt(0).toUpperCase() + game.difficulty?.slice(1) || 'Moyen'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{game.title}</h3>
                  <p className="text-sm text-muted-foreground">{game.description}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="w-4 h-4" />
                  <span>{game.players} joueurs</span>
                  {game.played && (
                    <>
                      <span className="text-border">•</span>
                      <Star className="w-4 h-4 fill-chart-1 text-chart-1" />
                      <span className="text-chart-1">Meilleur: {game.highScore}</span>
                    </>
                  )}
                </div>

                <button
                  onClick={() => handlePlayGame(game)}
                  className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  {game.played ? 'Rejouer' : 'Jouer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Classement Global
          </h3>
          <div className="space-y-3">
            {leaderboard.length > 0 ? (
              leaderboard.map((player) => (
                <div
                  key={player.rank}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    player.rank === 1
                      ? 'bg-yellow-500/10 border border-yellow-500/30'
                      : player.rank === 2
                      ? 'bg-gray-400/10 border border-gray-400/30'
                      : player.rank === 3
                      ? 'bg-orange-600/10 border border-orange-600/30'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        player.rank === 1
                          ? 'bg-yellow-500 text-white'
                          : player.rank === 2
                          ? 'bg-gray-400 text-white'
                          : player.rank === 3
                          ? 'bg-orange-600 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {player.rank}
                    </div>
                    <span className="text-2xl">{player.avatar}</span>
                    <span className="font-medium text-foreground">{player.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{player.score} pts</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Pas de scores actuellement</p>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-chart-3" />
            Succes ({achievements.filter((a) => a.unlocked).length}/{achievements.length})
          </h3>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  achievement.unlocked
                    ? 'bg-chart-1/10 border border-chart-1/30'
                    : 'bg-secondary opacity-60'
                }`}
              >
                <span className="text-3xl flex-shrink-0">{achievement.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {achievement.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <div className="w-6 h-6 bg-chart-1 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Modals */}
      <MemoryGameModal
        isOpen={activeGame === 'memory'}
        onClose={() => setActiveGame(null)}
        onScore={(score, time) => handleGameScore('memory', score, time)}
      />
      <QuizGameModal
        isOpen={activeGame === 'quiz'}
        onClose={() => setActiveGame(null)}
        onScore={(score, time) => handleGameScore('quiz', score, time)}
      />
      <HydrationRaceModal
        isOpen={activeGame === 'hydration'}
        onClose={() => setActiveGame(null)}
        onScore={(score, time) => handleGameScore('hydration', score, time)}
      />
      <SensorPuzzleModal
        isOpen={activeGame === 'sensor-puzzle'}
        onClose={() => setActiveGame(null)}
        onScore={(score, time) => handleGameScore('sensor-puzzle', score, time)}
      />
      <ImagePuzzleModal
        isOpen={activeGame === 'image-puzzle'}
        onClose={() => setActiveGame(null)}
        onScore={(score, time) => handleGameScore('image-puzzle', score, time)}
      />
      <VirtualGardenModal
        isOpen={activeGame === 'virtual-garden'}
        onClose={() => setActiveGame(null)}
        onScore={(score, time) => handleGameScore('virtual-garden', score, time)}
      />
    </div>
  );
}
