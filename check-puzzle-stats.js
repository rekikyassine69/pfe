import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les données JSON
const jeuxPath = path.join(__dirname, 'data', 'json', 'plateformeDB.jeux.json');
const scoresPath = path.join(__dirname, 'data', 'json', 'plateformeDB.scores.json');
const clientsPath = path.join(__dirname, 'data', 'json', 'plateformeDB.clients.json');

const jeux = JSON.parse(fs.readFileSync(jeuxPath, 'utf8'));
const scores = JSON.parse(fs.readFileSync(scoresPath, 'utf8'));
const clients = JSON.parse(fs.readFileSync(clientsPath, 'utf8'));

// Trouver le jeu "Puzzle Jardin"
const puzzleJardin = jeux.find(jeu => jeu.nomJeu === 'Puzzle Jardin');

if (!puzzleJardin) {
  console.log('❌ Jeu "Puzzle Jardin" non trouvé');
  process.exit(1);
}

const puzzleJardinId = puzzleJardin._id.$oid;
console.log('\n🎮 ===== STATISTIQUES PUZZLE JARDIN =====\n');
console.log(`📦 ID du jeu: ${puzzleJardinId}`);
console.log(`📝 Description: ${puzzleJardin.description}`);
console.log(`🎯 Niveaux disponibles: ${puzzleJardin.niveaux.length}`);
puzzleJardin.niveaux.forEach((niveau, index) => {
  console.log(`   Niveau ${niveau.niveau}: Grille ${niveau.grille || 'N/A'}`);
});

// Filtrer les scores pour ce jeu
const puzzleScores = scores.filter(score => {
  const jeuId = score.jeuId.$oid || score.jeuId;
  return jeuId === puzzleJardinId;
});

console.log(`\n👥 Nombre total de joueurs: ${puzzleScores.length} parties jouées`);

// Trouver les joueurs uniques
const uniquePlayers = new Set();
puzzleScores.forEach(score => {
  const clientId = score.clientId.$oid || score.clientId;
  uniquePlayers.add(clientId);
});

console.log(`👤 Nombre de joueurs uniques: ${uniquePlayers.size}`);

// Statistiques des scores
if (puzzleScores.length > 0) {
  const scoreValues = puzzleScores.map(s => s.valeur);
  const totalScore = scoreValues.reduce((sum, val) => sum + val, 0);
  const avgScore = Math.round(totalScore / scoreValues.length);
  const maxScore = Math.max(...scoreValues);
  const minScore = Math.min(...scoreValues);

  console.log(`\n📊 STATISTIQUES DES SCORES:`);
  console.log(`   Score total cumulé: ${totalScore}`);
  console.log(`   Score moyen: ${avgScore}`);
  console.log(`   Record (meilleur score): ${maxScore}`);
  console.log(`   Score minimum: ${minScore}`);

  // Détail par niveau
  console.log(`\n🎯 SCORES PAR NIVEAU:`);
  [1, 2, 3].forEach(niveau => {
    const niveauScores = puzzleScores.filter(s => s.niveau === niveau);
    if (niveauScores.length > 0) {
      const maxNiveau = Math.max(...niveauScores.map(s => s.valeur));
      const avgNiveau = Math.round(
        niveauScores.reduce((sum, s) => sum + s.valeur, 0) / niveauScores.length
      );
      console.log(`   Niveau ${niveau} (${niveauScores.length} parties)`);
      console.log(`      Record: ${maxNiveau} points`);
      console.log(`      Moyenne: ${avgNiveau} points`);
    }
  });

  // Classement des joueurs
  console.log(`\n🏆 TOP 3 JOUEURS:`);
  const playerStats = {};
  
  puzzleScores.forEach(score => {
    const clientId = score.clientId.$oid || score.clientId;
    if (!playerStats[clientId]) {
      playerStats[clientId] = {
        totalScore: 0,
        gamesPlayed: 0,
        bestScore: 0
      };
    }
    playerStats[clientId].totalScore += score.valeur;
    playerStats[clientId].gamesPlayed += 1;
    playerStats[clientId].bestScore = Math.max(playerStats[clientId].bestScore, score.valeur);
  });

  const rankedPlayers = Object.entries(playerStats)
    .map(([clientId, stats]) => {
      const client = clients.find(c => (c._id.$oid || c._id) === clientId);
      return {
        name: client?.nom || 'Joueur inconnu',
        ...stats
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  rankedPlayers.slice(0, 3).forEach((player, index) => {
    const medal = ['🥇', '🥈', '🥉'][index];
    console.log(`   ${medal} ${player.name}`);
    console.log(`      Score total: ${player.totalScore} pts`);
    console.log(`      Parties jouées: ${player.gamesPlayed}`);
    console.log(`      Meilleur score: ${player.bestScore} pts`);
  });

  // Calcul des points par difficulté
  console.log(`\n💡 SYSTÈME DE POINTS:`);
  console.log(`   Niveau 1 (3×3): Base 1000 pts - (coups × 10) - (temps × 2)`);
  console.log(`   Niveau 2 (4×4): Base 2000 pts - (coups × 10) - (temps × 2)`);
  console.log(`   Niveau 3 (5×5): Base 3000 pts - (coups × 10) - (temps × 2)`);
  
} else {
  console.log('\n⚠️  Aucun score enregistré pour ce jeu');
}

console.log('\n========================================\n');
