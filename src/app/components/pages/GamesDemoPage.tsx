import { useState } from 'react';
import { Gamepad2, Trophy, Lock, Play, Star, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface GamesDemoPageProps {
  onNavigate: (page: string) => void;
}

export function GamesDemoPage({ onNavigate }: GamesDemoPageProps) {
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const quizQuestions = [
    {
      question: 'Quelle est la fréquence d\'arrosage idéale pour une plante d\'intérieur typique ?',
      answers: [
        'Tous les jours',
        'Quand le sol est sec sur 2-3 cm',
        'Une fois par mois',
        'Jamais',
      ],
      correct: 1,
    },
    {
      question: 'Quelle plante est la plus facile à entretenir pour un débutant ?',
      answers: [
        'Orchidée',
        'Bonsaï',
        'Pothos',
        'Venus Flytrap',
      ],
      correct: 2,
    },
    {
      question: 'Que signifie IoT dans le contexte de l\'agriculture intelligente ?',
      answers: [
        'Internet of Things',
        'International Organic Trade',
        'Indoor Outdoor Technology',
        'Irrigation Optimization Tool',
      ],
      correct: 0,
    },
  ];

  const games = [
    {
      title: 'Quiz Botanique',
      description: 'Testez vos connaissances sur les plantes',
      icon: '🌿',
      difficulty: 'Facile',
      demo: true,
      locked: false,
    },
    {
      title: 'Puzzle des Capteurs',
      description: 'Assemblez les composants IoT',
      icon: '🔧',
      difficulty: 'Moyen',
      demo: false,
      locked: true,
    },
    {
      title: 'Course contre la Déshydratation',
      description: 'Arrosez vos plantes à temps !',
      icon: '💧',
      difficulty: 'Facile',
      demo: false,
      locked: true,
    },
    {
      title: 'Jardin Virtuel',
      description: 'Créez et gérez votre propre jardin',
      icon: '🏡',
      difficulty: 'Avancé',
      demo: false,
      locked: true,
    },
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === quizQuestions[currentQuestion].correct) {
      setQuizScore(quizScore + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setQuizScore(0);
    setCurrentQuestion(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Jeux Éducatifs
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Apprenez en vous amusant avec nos mini-jeux interactifs
        </p>
      </motion.div>

      {/* Demo Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 text-center"
      >
        <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Mode Démo
        </h3>
        <p className="text-muted-foreground mb-4">
          Vous accédez à une version limitée des jeux. Créez un compte pour débloquer tous les jeux et sauvegarder votre progression !
        </p>
        <button
          onClick={() => onNavigate('signup')}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Créer un compte gratuit
        </button>
      </motion.div>

      {/* Games Grid */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Nos Jeux</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`bg-card border border-border rounded-xl p-6 relative ${
                game.locked ? 'opacity-60' : 'cursor-pointer hover:shadow-lg'
              } transition-all`}
            >
              {game.locked && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              
              <div className="text-5xl mb-4">{game.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {game.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {game.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  game.difficulty === 'Facile'
                    ? 'bg-green-500/20 text-green-600'
                    : game.difficulty === 'Moyen'
                    ? 'bg-yellow-500/20 text-yellow-600'
                    : 'bg-orange-500/20 text-orange-600'
                }`}>
                  {game.difficulty}
                </span>
                
                {game.demo && (
                  <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                    Démo
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quiz Demo */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary to-muted rounded-2xl p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Gamepad2 className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Quiz Botanique - Mode Démo
            </h2>
          </div>

          {!showResult ? (
            <div className="bg-card border border-border rounded-xl p-8">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Question {currentQuestion + 1} / {quizQuestions.length}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    Score: {quizScore}
                  </span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>

              {/* Question */}
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6"
              >
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  {quizQuestions[currentQuestion].question}
                </h3>

                <div className="space-y-3">
                  {quizQuestions[currentQuestion].answers.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedAnswer === null
                          ? 'border-border hover:border-primary hover:bg-secondary'
                          : selectedAnswer === index
                          ? index === quizQuestions[currentQuestion].correct
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-red-500 bg-red-500/10'
                          : index === quizQuestions[currentQuestion].correct
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-border opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-foreground font-medium">{answer}</span>
                        {selectedAnswer !== null && (
                          <>
                            {index === quizQuestions[currentQuestion].correct && (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            )}
                            {selectedAnswer === index && index !== quizQuestions[currentQuestion].correct && (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                          </>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-xl p-8 text-center"
            >
              <div className="mb-6">
                {quizScore === quizQuestions.length ? (
                  <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                ) : (
                  <Star className="w-20 h-20 text-primary mx-auto mb-4" />
                )}
                <h3 className="text-3xl font-bold text-foreground mb-2">
                  Quiz Terminé !
                </h3>
                <p className="text-xl text-muted-foreground">
                  Votre score: {quizScore} / {quizQuestions.length}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={resetQuiz}
                  className="w-full px-6 py-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                >
                  Rejouer
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Créer un compte pour plus de jeux
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Locked Games CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary rounded-2xl p-8 text-center"
      >
        <Lock className="w-12 h-12 text-primary-foreground mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-primary-foreground mb-4">
          Débloquez tous les jeux
        </h3>
        <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
          Créez un compte gratuit pour accéder à tous nos jeux éducatifs, sauvegarder votre progression et défier la communauté !
        </p>
        <button
          onClick={() => onNavigate('signup')}
          className="px-8 py-3 bg-background text-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Créer un compte gratuit
        </button>
      </motion.div>
    </div>
  );
}
