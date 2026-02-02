import { Trophy, Target, Zap, Crown, Gift, TrendingUp, Star } from 'lucide-react';

export function GamesPage() {
  const games = [
    {
      id: 1,
      title: 'PlantQuiz',
      description: 'Testez vos connaissances sur les plantes et leurs besoins',
      icon: Target,
      color: 'bg-chart-1',
      players: 2341,
      highScore: 1250,
      played: true,
    },
    {
      id: 2,
      title: 'Sensor Challenge',
      description: 'Placez les capteurs au bon endroit pour optimiser la croissance',
      icon: Zap,
      color: 'bg-chart-2',
      players: 1876,
      highScore: 850,
      played: true,
    },
    {
      id: 3,
      title: 'Garden Manager',
      description: 'Gérez votre jardin virtuel et atteignez le niveau expert',
      icon: Crown,
      color: 'bg-chart-3',
      players: 3205,
      highScore: 0,
      played: false,
    },
    {
      id: 4,
      title: 'IoT Builder',
      description: 'Construisez votre système IoT et résolvez des défis',
      icon: Trophy,
      color: 'bg-chart-4',
      players: 1567,
      highScore: 650,
      played: true,
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Alexandre M.', score: 2850, avatar: '🌟' },
    { rank: 2, name: 'Sophie L.', score: 2720, avatar: '🌱' },
    { rank: 3, name: 'Thomas D.', score: 2580, avatar: '🌿' },
    { rank: 4, name: 'Marie B.', score: 2450, avatar: '🌻' },
    { rank: 5, name: 'Lucas R.', score: 2320, avatar: '🌺' },
    { rank: 6, name: 'Vous', score: 2180, avatar: '🍀', isUser: true },
  ];

  const achievements = [
    { id: 1, title: 'Premier pas', description: 'Jouer à votre premier jeu', unlocked: true, icon: '🎮' },
    { id: 2, title: 'Expert IoT', description: 'Réussir tous les niveaux de Sensor Challenge', unlocked: true, icon: '🎯' },
    { id: 3, title: 'Botaniste', description: 'Identifier 50 plantes correctement', unlocked: true, icon: '🌿' },
    { id: 4, title: 'Maître Jardinier', description: 'Atteindre le niveau 10 dans Garden Manager', unlocked: false, icon: '🏆' },
    { id: 5, title: 'Ingénieur', description: 'Créer 20 systèmes IoT fonctionnels', unlocked: false, icon: '⚡' },
    { id: 6, title: 'Champion', description: 'Entrer dans le top 3 du classement global', unlocked: false, icon: '👑' },
  ];

  const dailyChallenge = {
    title: 'Défi du jour',
    description: 'Identifiez 10 plantes en moins de 3 minutes',
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
            Apprenez en vous amusant avec nos jeux interactifs
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Points totaux</p>
              <p className="text-3xl font-semibold text-foreground mt-2">2,180</p>
            </div>
            <Star className="w-10 h-10 text-yellow-500 opacity-20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Classement</p>
              <p className="text-3xl font-semibold text-chart-1 mt-2">#6</p>
            </div>
            <Trophy className="w-10 h-10 text-chart-1 opacity-20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Succès débloqués</p>
              <p className="text-3xl font-semibold text-foreground mt-2">3/6</p>
            </div>
            <Gift className="w-10 h-10 text-chart-3 opacity-20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Niveau</p>
              <p className="text-3xl font-semibold text-foreground mt-2">7</p>
            </div>
            <TrendingUp className="w-10 h-10 text-chart-2 opacity-20" />
          </div>
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6" />
              <h3 className="text-xl font-semibold">{dailyChallenge.title}</h3>
            </div>
            <p className="text-white/90">{dailyChallenge.description}</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <p className="text-sm">Récompense: <span className="font-semibold">{dailyChallenge.reward}</span></p>
              </div>
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <p className="text-sm">Expire dans: <span className="font-semibold">{dailyChallenge.timeLeft}</span></p>
              </div>
            </div>
          </div>
          <button className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors">
            Jouer maintenant
          </button>
        </div>
      </div>

      {/* Games Grid */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Tous les jeux</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 ${game.color} bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{game.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Trophy className="w-4 h-4" />
                        <span>{game.players} joueurs</span>
                      </div>
                      {game.played && (
                        <div className="flex items-center gap-1 text-chart-1">
                          <Star className="w-4 h-4 fill-chart-1" />
                          <span>Meilleur: {game.highScore}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
                    {game.played ? 'Rejouer' : 'Jouer'}
                  </button>
                </div>
              </div>
            );
          })}
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
            {leaderboard.map((player) => (
              <div
                key={player.rank}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  player.isUser
                    ? 'bg-primary/10 border border-primary/30'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    player.rank === 1 ? 'bg-yellow-500 text-white' :
                    player.rank === 2 ? 'bg-gray-400 text-white' :
                    player.rank === 3 ? 'bg-orange-600 text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {player.rank}
                  </div>
                  <span className="text-2xl">{player.avatar}</span>
                  <span className={`font-medium ${player.isUser ? 'text-primary' : 'text-foreground'}`}>
                    {player.name}
                  </span>
                </div>
                <span className="font-semibold text-foreground">{player.score} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-chart-3" />
            Succès
          </h3>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  achievement.unlocked
                    ? 'bg-chart-1/10 border border-chart-1/30'
                    : 'bg-secondary opacity-60'
                }`}
              >
                <span className="text-3xl">{achievement.icon}</span>
                <div className="flex-1">
                  <p className={`font-medium ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {achievement.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <div className="w-8 h-8 bg-chart-1 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
