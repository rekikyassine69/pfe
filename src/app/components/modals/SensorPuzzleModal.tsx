import { useState, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SensorPuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScore: (score: number, time: number) => void;
}

const SENSOR_COMPONENTS = [
  { id: 1, name: 'Capteur d\'humidité', emoji: '💧', order: 1 },
  { id: 2, name: 'Capteur de température', emoji: '🌡️', order: 2 },
  { id: 3, name: 'Arduino', emoji: '🔲', order: 3 },
  { id: 4, name: 'Module WiFi', emoji: '📡', order: 4 },
  { id: 5, name: 'Batterie', emoji: '🔋', order: 5 },
  { id: 6, name: 'Capteur de lumière', emoji: '☀️', order: 2 },
  { id: 7, name: 'Cloud Storage', emoji: '☁️', order: 4 },
  { id: 8, name: 'Écran', emoji: '📱', order: 5 },
];

export function SensorPuzzleModal({ isOpen, onClose, onScore }: SensorPuzzleModalProps) {
  const [level, setLevel] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [arranged, setArranged] = useState<typeof SENSOR_COMPONENTS>([]);
  const [available, setAvailable] = useState<typeof SENSOR_COMPONENTS>([]);
  const [startTime, setStartTime] = useState(0);
  const [score, setScore] = useState(0);

  const levelConfig = {
    1: [1, 2, 5],
    2: [1, 2, 3, 4, 5],
    3: [1, 2, 3, 4, 5, 6, 7, 8],
  };

  useEffect(() => {
    if (gameActive) {
      const components = SENSOR_COMPONENTS.filter((c) =>
        levelConfig[level as keyof typeof levelConfig].includes(c.id)
      );
      setAvailable(components.sort(() => Math.random() - 0.5));
      setArranged([]);
      setStartTime(Date.now());
      setScore(0);
    }
  }, [gameActive, level]);

  const handleDragStart = (
    event: any,
    component: typeof SENSOR_COMPONENTS[0],
    source: 'available' | 'arranged'
  ) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('component', JSON.stringify({ ...component, source }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('component'));
    const component = data as typeof SENSOR_COMPONENTS[0] & { source: 'available' | 'arranged' };

    if (component.source === 'available') {
      setArranged([...arranged, component]);
      setAvailable(available.filter((c) => c.id !== component.id));
    }
  };

  const removeComponent = (id: number) => {
    const component = arranged.find((c) => c.id === id);
    if (component) {
      setAvailable([...available, component].sort(() => Math.random() - 0.5));
      setArranged(arranged.filter((c) => c.id !== id));
    }
  };

  const checkCompletion = () => {
    const expectedComponents = levelConfig[level as keyof typeof levelConfig];
    const arrangedIds = arranged.map((c) => c.id).sort();
    const expectedIds = expectedComponents.sort();

    if (JSON.stringify(arrangedIds) === JSON.stringify(expectedIds)) {
      const time = Math.round((Date.now() - startTime) / 1000);
      const finalScore = Math.max(0, 500 - time);
      onScore(finalScore, time);
      setGameActive(false);
      return true;
    }
    return false;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-foreground">Puzzle des Capteurs</h2>
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
                    <div className="text-3xl mb-2">{l === 1 ? '🔧' : l === 2 ? '⚙️' : '🤖'}</div>
                    <p className="font-semibold text-foreground">Niveau {l}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {levelConfig[l as keyof typeof levelConfig].length} composants
                    </p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setGameActive(true)}
                className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold text-lg"
              >
                Commencer le Puzzle
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Available Components */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-border rounded-lg p-4 min-h-64 bg-secondary/20"
                >
                  <p className="text-sm font-semibold text-foreground mb-4">Disponibles</p>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {available.map((component) => (
                        <motion.div
                          key={component.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, component, 'available')}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-3 bg-card border border-border rounded-lg cursor-move hover:border-primary transition-all"
                        >
                          <span className="text-xl">{component.emoji}</span>
                          <span className="ml-2 text-foreground text-sm">{component.name}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {available.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Drag components here
                      </p>
                    )}
                  </div>
                </div>

                {/* Arranged Circuit */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-primary rounded-lg p-4 min-h-64 bg-primary/5"
                >
                  <p className="text-sm font-semibold text-foreground mb-4">Votre Circuit</p>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {arranged.map((component) => (
                        <motion.div
                          key={component.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-3 bg-primary/20 border border-primary rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{component.emoji}</span>
                            <span className="text-foreground text-sm">{component.name}</span>
                          </div>
                          <button
                            onClick={() => removeComponent(component.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            ✕
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {arranged.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Drop components here
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={checkCompletion}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Vérifier le puzzle
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
