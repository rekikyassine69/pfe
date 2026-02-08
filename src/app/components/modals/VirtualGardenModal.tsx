import { useState, useEffect } from 'react';
import { X, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VirtualGardenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScore: (score: number, time: number) => void;
}

const AVAILABLE_PLANTS = [
  { id: 1, name: 'Tomate', emoji: '🍅', cost: 100, value: 150 },
  { id: 2, name: 'Laitue', emoji: '🥬', cost: 50, value: 80 },
  { id: 3, name: 'Carotte', emoji: '🥕', cost: 75, value: 120 },
  { id: 4, name: 'Courge', emoji: '🎃', cost: 120, value: 180 },
  { id: 5, name: 'Chou', emoji: '🥦', cost: 60, value: 100 },
  { id: 6, name: 'Fleur', emoji: '🌸', cost: 40, value: 60 },
];

export function VirtualGardenModal({ isOpen, onClose, onScore }: VirtualGardenModalProps) {
  const [level, setLevel] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [budget, setBudget] = useState(0);
  const [plants, setPlants] = useState<any[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const levelConfig = {
    1: { budget: 1000, slots: 9, duration: 300 },
    2: { budget: 1500, slots: 16, duration: 450 },
    3: { budget: 2000, slots: 25, duration: 600 },
  };

  useEffect(() => {
    if (gameActive) {
      const config = levelConfig[level as keyof typeof levelConfig];
      setBudget(config.budget);
      setPlants([]);
      setScore(0);
      setTimeLeft(config.duration);
      setStartTime(Date.now());
    }
  }, [gameActive, level]);

  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          const time = Math.round((Date.now() - startTime) / 1000);
          const gardenValue = plants.reduce((sum, p) => sum + (p.data.value * p.health) / 100, 0);
          const finalScore = Math.round(gardenValue);
          onScore(finalScore, time);
          return 0;
        }
        return prev - 1;
      });

      // Decrease plant health over time
      setPlants((prev) =>
        prev.map((p) => ({
          ...p,
          health: Math.max(20, p.health - 0.5),
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, plants]);

  const Config = levelConfig[level as keyof typeof levelConfig];

  const addPlant = (plantData: typeof AVAILABLE_PLANTS[0]) => {
    if (budget >= plantData.cost && plants.length < Config.slots) {
      setPlants([
        ...plants,
        {
          id: Date.now(),
          data: plantData,
          health: 100,
          position: plants.length,
        },
      ]);
      setBudget(budget - plantData.cost);
      setScore(score + 50);
    }
  };

  const waterPlant = (id: number) => {
    setPlants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, health: Math.min(100, p.health + 15) } : p
      )
    );
  };

  const removePlant = (id: number) => {
    setPlants(plants.filter((p) => p.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-foreground">Jardin Virtuel Manager</h2>
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
                    <div className="text-3xl mb-2">{l === 1 ? '🌱' : l === 2 ? '🌿' : '🏡'}</div>
                    <p className="font-semibold text-foreground">Niveau {l}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      💰 ${levelConfig[l as keyof typeof levelConfig].budget}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      📍 {levelConfig[l as keyof typeof levelConfig].slots} cases
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
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Budget Restant</p>
                  <p className="text-3xl font-bold text-primary">${budget}</p>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Temps</p>
                  <p className="text-3xl font-bold text-chart-1">{timeLeft}s</p>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Plantes</p>
                  <p className="text-3xl font-bold text-chart-2">
                    {plants.length}/{Config.slots}
                  </p>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-3xl font-bold text-chart-3">{score}</p>
                </div>
              </div>

              {/* Plant Shop */}
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm font-semibold text-foreground mb-3">Magasin</p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {AVAILABLE_PLANTS.map((plant) => (
                    <button
                      key={plant.id}
                      onClick={() => addPlant(plant)}
                      disabled={budget < plant.cost || plants.length >= Config.slots}
                      className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                        budget >= plant.cost && plants.length < Config.slots
                          ? 'border-border hover:border-primary hover:bg-secondary cursor-pointer'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <span className="text-2xl">{plant.emoji}</span>
                      <span className="text-xs font-medium">${plant.cost}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Garden Grid */}
              <div className="bg-green-900/10 border-2 border-dashed border-green-500/30 rounded-lg p-6">
                <div className="grid gap-3" style={{
                  gridTemplateColumns: `repeat(${Math.sqrt(Config.slots)}, minmax(0, 1fr))`
                }}>
                  <AnimatePresence>
                    {plants.map((plant) => (
                      <motion.div
                        key={plant.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="bg-green-500/20 border-2 border-green-500/50 rounded-lg p-3 flex flex-col items-center justify-center gap-2"
                        onClick={() => waterPlant(plant.id)}
                      >
                        <div className="text-3xl">{plant.data.emoji}</div>
                        <div className="w-full h-2 bg-green-500/30 rounded-full overflow-hidden">
                          <motion.div
                            animate={{ width: `${plant.health}%` }}
                            className="h-full bg-green-500"
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(plant.health)}%
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePlant(plant.id);
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Empty Slots */}
                  {Array.from({ length: Config.slots - plants.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="bg-secondary/30 border-2 border-dashed border-border rounded-lg p-3 flex items-center justify-center text-muted-foreground text-2xl"
                    >
                      +
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
