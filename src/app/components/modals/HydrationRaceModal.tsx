import { useState, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface HydrationRaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScore: (score: number, time: number) => void;
}

export function HydrationRaceModal({ isOpen, onClose, onScore }: HydrationRaceModalProps) {
  const [level, setLevel] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [plants, setPlants] = useState<any[]>([]);
  const [heldDrops, setHeldDrops] = useState(0);
  const [startTime, setStartTime] = useState(0);

  const levelConfig = {
    1: { duration: 60, plantCount: 5, speed: 3 },
    2: { duration: 90, plantCount: 8, speed: 5 },
    3: { duration: 120, plantCount: 12, speed: 7 },
  };

  const plantEmojis = ['🌿', '🌱', '🌾', '🪴', '🌻'];

  useEffect(() => {
    if (gameActive) {
      const config = levelConfig[level as keyof typeof levelConfig];
      setTimeLeft(config.duration);
      setScore(0);
      setHeldDrops(0);
      setStartTime(Date.now());

      const newPlants = Array.from({ length: config.plantCount }, (_, i) => ({
        id: i,
        health: 100,
        thirst: 0,
        emoji: plantEmojis[i % plantEmojis.length],
      }));
      setPlants(newPlants);
    }
  }, [gameActive, level]);

  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          const time = Math.round((Date.now() - startTime) / 1000);
          onScore(score, time);
          return 0;
        }
        return prev - 1;
      });

      setPlants((prev) =>
        prev.map((p) => ({
          ...p,
          thirst: Math.min(100, p.thirst + Math.random() * 5),
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, score]);

  const addDrop = () => {
    setHeldDrops((prev) => Math.min(5, prev + 1));
  };

  const waterPlant = (plantId: number) => {
    if (heldDrops === 0) return;

    setPlants((prev) =>
      prev.map((p) =>
        p.id === plantId ? { ...p, thirst: Math.max(0, p.thirst - 30), health: Math.min(100, p.health + 5) } : p
      )
    );
    setHeldDrops((prev) => prev - 1);
    setScore((prev) => prev + 10);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-xl max-w-4xl w-full"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Course contre la Déshydratation</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!gameActive ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      level === l
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 bg-secondary'
                    }`}
                  >
                    <div className="text-3xl mb-2">{l === 1 ? '🌱' : l === 2 ? '🌿' : '🌳'}</div>
                    <p className="font-semibold text-foreground">Niveau {l}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {levelConfig[l as keyof typeof levelConfig].duration}s
                    </p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setGameActive(true)}
                className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold text-lg"
              >
                Commencer le Jeu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Temps restant</p>
                  <p className="text-3xl font-bold text-primary">{timeLeft}s</p>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-3xl font-bold text-chart-1">{score}</p>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Gouttes</p>
                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full ${i < heldDrops ? 'bg-blue-500' : 'bg-muted'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={addDrop}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                💧 Collecter une goutte
              </button>

              <div className="grid grid-cols-4 gap-3">
                {plants.map((plant) => (
                  <motion.button
                    key={plant.id}
                    onClick={() => waterPlant(plant.id)}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 rounded-lg border-2 border-border hover:border-primary transition-all flex flex-col items-center gap-2"
                  >
                    <div className="text-4xl">{plant.emoji}</div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${100 - plant.thirst}%` }}
                        className="h-full bg-green-500"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(100 - plant.thirst)}%
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
