import { useState, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface MemoryGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScore: (score: number, time: number) => void;
}

export function MemoryGameModal({ isOpen, onClose, onScore }: MemoryGameModalProps) {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [gameStarted, setGameStarted] = useState(false);

  const plants = [
    { id: 1, name: 'Basilic', emoji: '🌿' },
    { id: 2, name: 'Menthe', emoji: '🍃' },
    { id: 3, name: 'Romarin', emoji: '🌱' },
    { id: 4, name: 'Thym', emoji: '🌾' },
    { id: 5, name: 'Persil', emoji: '🪴' },
    { id: 6, name: 'Ciboulette', emoji: '🌻' },
  ];

  const pairsCount = level === 1 ? 6 : level === 2 ? 8 : 12;

  useEffect(() => {
    if (isOpen) initializeGame();
  }, [isOpen, level]);

  const initializeGame = () => {
    const selectedPlants = plants.slice(0, pairsCount);
    const shuffled = [...selectedPlants, ...selectedPlants].sort(() => Math.random() - 0.5);
    setCards(shuffled.map((plant, i) => ({ ...plant, position: i })));
    setFlipped(new Set());
    setMatched(new Set());
    setMoves(0);
    setStartTime(Date.now());
    setGameStarted(true);
  };

  const handleCardClick = (index: number) => {
    if (matched.has(index) || flipped.has(index) || flipped.size >= 2) return;

    const newFlipped = new Set(flipped);
    newFlipped.add(index);
    setFlipped(newFlipped);

    if (newFlipped.size === 2) {
      const [first, second] = Array.from(newFlipped);
      setMoves(moves + 1);

      if (cards[first].id === cards[second].id) {
        const newMatched = new Set(matched);
        newMatched.add(first);
        newMatched.add(second);
        setMatched(newMatched);
        setFlipped(new Set());

        if (newMatched.size === pairsCount * 2) {
          const time = Math.round((Date.now() - startTime) / 1000);
          const score = Math.max(0, 1000 - moves * 10 - time);
          onScore(score, time);
        }
      } else {
        setTimeout(() => setFlipped(new Set()), 800);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Memory Plantes - Niveau {level}</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Coups</p>
              <p className="text-2xl font-bold text-foreground">{moves}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-muted-foreground">Trouvées</p>
              <p className="text-2xl font-bold text-chart-1">{matched.size / 2} / {pairsCount}</p>
            </div>
            <button
              onClick={initializeGame}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </button>
          </div>

          <div className={`grid gap-3 ${pairsCount === 6 ? 'grid-cols-4' : pairsCount === 8 ? 'grid-cols-5' : 'grid-cols-6'}`}>
            {cards.map((card, index) => (
              <motion.button
                key={index}
                onClick={() => handleCardClick(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-lg border-2 font-semibold text-2xl transition-all ${
                  matched.has(index)
                    ? 'bg-chart-1/20 border-chart-1 text-foreground'
                    : flipped.has(index)
                    ? 'bg-primary/20 border-primary text-foreground'
                    : 'bg-secondary border-border hover:bg-secondary/80 text-muted-foreground'
                }`}
              >
                {flipped.has(index) || matched.has(index) ? card.emoji : '?'}
              </motion.button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Niveaux de difficulté</p>
            <div className="flex gap-2">
              {[1, 2, 3].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    level === l
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  Niveau {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
