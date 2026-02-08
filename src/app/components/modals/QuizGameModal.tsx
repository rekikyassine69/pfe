import { useState, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface QuizGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScore: (score: number, time: number) => void;
}

const QUIZ_QUESTIONS = [
  {
    question: 'Quelle est la fréquence d\'arrosage idéale pour une plante d\'intérieur typique ?',
    answers: ['Tous les jours', 'Quand le sol est sec sur 2-3 cm', 'Une fois par mois', 'Jamais'],
    correct: 1,
  },
  {
    question: 'Quelle plante est la plus facile à entretenir pour un débutant ?',
    answers: ['Orchidée', 'Bonsaï', 'Pothos', 'Venus Flytrap'],
    correct: 2,
  },
  {
    question: 'Quel est le pH idéal du sol pour la plupart des plantes ?',
    answers: ['4.0-5.0', '6.0-7.0', '8.0-9.0', '10.0-11.0'],
    correct: 1,
  },
  {
    question: 'Combien de temps peut survivre un cactus sans eau ?',
    answers: ['1 semaine', '1 mois', '6 mois', 'Plusieurs années'],
    correct: 3,
  },
  {
    question: 'Quelle plante purifie le mieux l\'air intérieur ?',
    answers: ['Cactus', 'Aloe Vera', 'Spathiphyllum', 'Ficus'],
    correct: 2,
  },
];

export function QuizGameModal({ isOpen, onClose, onScore }: QuizGameModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!isOpen) {
      setCurrentQuestion(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [isOpen]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === QUIZ_QUESTIONS[currentQuestion].correct) {
      setScore(score + 10);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const time = Math.round((Date.now() - startTime) / 1000);
      onScore(score * 10, time);
    }
  };

  if (!isOpen) return null;

  const question = QUIZ_QUESTIONS[currentQuestion];
  const completed = currentQuestion === QUIZ_QUESTIONS.length - 1 && showResult;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-xl max-w-2xl w-full"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Quiz Botanique</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1}/{QUIZ_QUESTIONS.length}</span>
              <span>Score: {score}/50</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                className="h-full bg-primary"
              />
            </div>
          </div>

          {!completed ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={currentQuestion}>
              <h3 className="text-lg font-semibold text-foreground mb-6">{question.question}</h3>
              <div className="space-y-3">
                {question.answers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      showResult
                        ? index === question.correct
                          ? 'border-green-500 bg-green-500/10'
                          : selectedAnswer === index
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-border opacity-50'
                        : 'border-border hover:border-primary hover:bg-secondary'
                    }`}
                  >
                    <span className="text-foreground font-medium">{answer}</span>
                  </button>
                ))}
              </div>

              {showResult && (
                <button
                  onClick={handleNext}
                  className="w-full mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  {completed ? 'Terminer' : 'Suivant'}
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h3 className="text-2xl font-bold text-foreground">Quiz Terminé!</h3>
              <p className="text-lg text-muted-foreground">
                Score final: <span className="text-2xl font-bold text-primary">{score}/50</span>
              </p>
              <button
                onClick={onClose}
                className="w-full mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Fermer
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
