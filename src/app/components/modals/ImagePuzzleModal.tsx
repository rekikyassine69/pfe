import { useEffect, useState } from 'react';
import { X, RotateCcw, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

interface ImagePuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScore: (score: number, time: number) => void;
}

type Difficulty = 3 | 4 | 5;

const IMAGE_URL = '/images/puzzle-plants.png';

export function ImagePuzzleModal({ isOpen, onClose, onScore }: ImagePuzzleModalProps) {
  const [gridSize, setGridSize] = useState<Difficulty>(3);
  const [tiles, setTiles] = useState<number[]>([]);
  const [emptyIndex, setEmptyIndex] = useState<number>(0);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [solved, setSolved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const totalTiles = gridSize * gridSize;

  const isSolved = (arr: number[], empty: number) => {
    // Check if all tiles are in correct position (empty tile should be last)
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] !== i) return false;
    }
    return empty === arr.length - 1;
  };

  const isSolvable = (arr: number[], size: number) => {
    let inversions = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] > arr[j] && arr[i] !== totalTiles - 1 && arr[j] !== totalTiles - 1) {
          inversions++;
        }
      }
    }

    if (size % 2 !== 0) {
      return inversions % 2 === 0;
    } else {
      const emptyRow = Math.floor(arr.indexOf(totalTiles - 1) / size);
      return (inversions + emptyRow) % 2 !== 0;
    }
  };

  const shuffleTiles = () => {
    const base = Array.from({ length: totalTiles }, (_, i) => i);
    let shuffled: number[];
    
    do {
      shuffled = [...base].sort(() => Math.random() - 0.5);
    } while (isSolved(shuffled, shuffled.indexOf(totalTiles - 1)) || !isSolvable(shuffled, gridSize));

    const empty = shuffled.indexOf(totalTiles - 1);
    setTiles(shuffled);
    setEmptyIndex(empty);
    setMoves(0);
    setTime(0);
    setSolved(false);
  };

  useEffect(() => {
    if (isOpen) {
      shuffleTiles();
      // Preload image
      const img = new Image();
      img.src = IMAGE_URL;
      img.onload = () => {
        console.log('Image loaded successfully');
        setImageLoaded(true);
      };
      img.onerror = () => {
        console.error('Failed to load image:', IMAGE_URL);
        setImageLoaded(false);
      };
    }
  }, [isOpen, gridSize]);

  useEffect(() => {
    if (!isOpen || solved) return;

    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, solved]);

  useEffect(() => {
    if (tiles.length && isSolved(tiles, emptyIndex)) {
      setSolved(true);
      const baseScore = gridSize === 3 ? 1000 : gridSize === 4 ? 2000 : 3000;
      const finalScore = Math.max(0, baseScore - moves * 10 - time * 2);
      onScore(finalScore, time);
    }
  }, [tiles, emptyIndex, moves, time, onScore, gridSize]);

  const getAdjacentIndices = (index: number): number[] => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const adjacent: number[] = [];

    if (row > 0) adjacent.push(index - gridSize); // top
    if (row < gridSize - 1) adjacent.push(index + gridSize); // bottom
    if (col > 0) adjacent.push(index - 1); // left
    if (col < gridSize - 1) adjacent.push(index + 1); // right

    return adjacent;
  };

  const handleTileClick = (index: number) => {
    if (solved || index === emptyIndex) return;

    const adjacentIndices = getAdjacentIndices(emptyIndex);
    if (!adjacentIndices.includes(index)) return;

    const nextTiles = [...tiles];
    [nextTiles[index], nextTiles[emptyIndex]] = [nextTiles[emptyIndex], nextTiles[index]];
    setTiles(nextTiles);
    setEmptyIndex(index);
    setMoves((prev) => prev + 1);
  };

  const changeDifficulty = (newSize: Difficulty) => {
    setGridSize(newSize);
    setSolved(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Puzzle Plantes Glissant</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Difficulty Selection */}
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm text-muted-foreground font-medium">Difficulté:</span>
            <div className="flex gap-2">
              {([3, 4, 5] as Difficulty[]).map((size) => (
                <button
                  key={size}
                  onClick={() => changeDifficulty(size)}
                  className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                    gridSize === size
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {size}×{size}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Coups</p>
              <p className="text-2xl font-bold text-foreground">{moves}</p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm text-muted-foreground">Temps</p>
              <p className="text-2xl font-bold text-chart-1">{time}s</p>
            </div>
            <button
              onClick={shuffleTiles}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Recommencer
            </button>
          </div>

          {/* Puzzle Grid */}
          <div className="flex justify-center w-full">
            <div
              className="grid gap-2 bg-gray-800 p-4 rounded-lg w-full"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                maxWidth: '600px',
                width: '100%',
              }}
            >
              {tiles.map((tile, index) => {
                const isEmpty = tile === totalTiles - 1;
                const tileRow = Math.floor(tile / gridSize);
                const tileCol = tile % gridSize;
                
                // Calcul correct pour le positionnement de l'image
                // Pour une grille NxN, chaque tuile représente 1/N de l'image
                const bgPosX = gridSize > 1 ? (tileCol / (gridSize - 1)) * 100 : 0;
                const bgPosY = gridSize > 1 ? (tileRow / (gridSize - 1)) * 100 : 0;
                
                const isAdjacent = getAdjacentIndices(emptyIndex).includes(index);

                // Couleurs de fallback
                const colors = [
                  '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
                  '#14b8a6', '#6366f1', '#a855f7', '#f43f5e', '#eab308',
                  '#059669', '#2563eb', '#7c3aed', '#db2777', '#d97706',
                  '#0d9488', '#4f46e5', '#9333ea', '#be123c', '#ca8a04',
                  '#047857', '#1d4ed8', '#6d28d9', '#9f1239', '#a16207'
                ];

                return (
                  <motion.button
                    key={`${tile}-${index}`}
                    onClick={() => handleTileClick(index)}
                    className={`relative rounded-md ${
                      isEmpty
                        ? 'bg-gray-600/50 cursor-default'
                        : isAdjacent
                        ? 'border-4 border-green-500 hover:border-green-400 cursor-pointer shadow-lg'
                        : 'border-4 border-gray-500 cursor-not-allowed'
                    }`}
                    style={{
                      width: '100%',
                      paddingBottom: '100%',
                      overflow: 'hidden',
                      ...(isEmpty
                        ? {}
                        : imageLoaded
                        ? {
                            backgroundImage: `url(${IMAGE_URL})`,
                            backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                            backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                            backgroundRepeat: 'no-repeat',
                          }
                        : {
                            backgroundColor: colors[tile % colors.length],
                          }
                      )
                    }}
                    whileHover={isAdjacent && !solved ? { scale: 1.05 } : {}}
                    whileTap={isAdjacent && !solved ? { scale: 0.95 } : {}}
                    aria-label={isEmpty ? 'Empty tile' : `Tile ${tile + 1}`}
                    disabled={isEmpty || solved}
                  >
                    {!isEmpty && (
                      <>
                        <div 
                          className="absolute inset-0 flex items-center justify-center text-white font-bold drop-shadow-lg" 
                          style={{ 
                            fontSize: gridSize === 3 ? '3rem' : gridSize === 4 ? '2.5rem' : '2rem',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
                            WebkitTextStroke: '2px black',
                            paintOrder: 'stroke fill'
                          }}
                        >
                          {tile + 1}
                        </div>
                        {/* Debug info */}
                        <div className="absolute top-1 left-1 text-xs bg-black/70 text-white px-1 rounded">
                          ({tileCol},{tileRow})
                        </div>
                      </>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-secondary/60 rounded-lg p-4 text-sm text-muted-foreground text-center">
            {solved ? (
              <div className="flex items-center justify-center gap-2 text-chart-2 font-semibold">
                <Trophy className="w-5 h-5" />
                Puzzle résolu en {moves} coups et {time} secondes!
              </div>
            ) : (
              "Cliquez sur une pièce adjacente à l'espace vide pour la faire glisser. Reconstruisez l'image complète!"
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
