import { useEffect, useState } from 'react';
import { Play, CheckCircle2, Lock, AlarmClock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCollection } from '@/app/hooks/useCollection';

interface Module {
  numero: number;
  titre: string;
  contenu: string;
  videoUrl: string | null;
  obligatoire?: boolean;
}

interface Course {
  _id: any;
  titre: string;
  description: string;
  duree: number;
  chapitres: Module[];
  examen: any;
}

interface CourseDetailPageProps {
  courseId: string;
  onBack?: () => void;
}

export function CourseDetailPage({ courseId, onBack }: CourseDetailPageProps) {
  const { data: courses } = useCollection<any>('cours');
  const { data: progressions } = useCollection<any>('progressionCours');
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [showExam, setShowExam] = useState(false);

  useEffect(() => {
    const found = courses.find((c: any) => {
      const id = c._id?.$oid ?? c._id;
      return id === courseId;
    });
    if (found) setCourse(found as Course);
  }, [courses, courseId]);

  useEffect(() => {
    const userProgressions = progressions.filter((p: any) => {
      const cId = p.coursId?.$oid ?? p.coursId;
      return cId === courseId;
    });
    
    const completed = userProgressions
      .map((p: any) => p.moduloNumero)
      .filter((n: any) => n !== undefined);
    setCompletedModules(completed);
  }, [progressions, courseId]);

  if (!course) {
    return <div className="text-center py-8">Cours non trouvé</div>;
  }

  const totalModules = course.chapitres.length;
  const allModulesCompleted = completedModules.length === totalModules;
  const module = course.chapitres[currentModule - 1];

  const handleModuleComplete = () => {
    if (!completedModules.includes(currentModule)) {
      setCompletedModules([...completedModules, currentModule]);
    }
    
    if (currentModule < totalModules) {
      setCurrentModule(currentModule + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        )}
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{course.titre}</h1>
          <p className="text-muted-foreground mt-2">{course.description}</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Modules complétés</p>
            <p className="text-3xl font-semibold text-foreground mt-2">
              {completedModules.length} / {totalModules}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Progression globale</p>
            <div className="mt-3 w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedModules.length / totalModules) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Durée totale</p>
            <p className="text-3xl font-semibold text-foreground mt-2">
              {course.duree} <span className="text-sm">min</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module List */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-foreground mb-4">Modules</h2>
          <div className="space-y-3">
            {course.chapitres.map((m: Module) => (
              <button
                key={m.numero}
                onClick={() => setCurrentModule(m.numero)}
                disabled={m.numero > completedModules.length + 1}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  currentModule === m.numero
                    ? 'bg-primary/10 border-primary'
                    : m.numero <= completedModules.length + 1
                    ? 'bg-card border-border hover:border-muted-foreground/50'
                    : 'bg-muted border-border opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start gap-3">
                  {completedModules.includes(m.numero) ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  ) : m.numero > completedModules.length + 1 ? (
                    <Lock className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-primary mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">Module {m.numero}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{m.titre}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Exam Button */}
          <button
            disabled={!allModulesCompleted}
            onClick={() => setShowExam(true)}
            className={`w-full mt-6 p-4 rounded-lg border transition-all font-medium flex items-center justify-center gap-2 ${
              allModulesCompleted
                ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600 cursor-pointer'
                : 'bg-muted text-muted-foreground border-border opacity-50 cursor-not-allowed'
            }`}
          >
            <AlarmClock className="w-4 h-4" />
            Passer l'Examen
          </button>
        </div>

        {/* Module Content */}
        <div className="lg:col-span-2">
          {!showExam ? (
            <div className="space-y-6">
              {/* Module Header */}
              <div className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-sm font-medium">
                    Module {module.numero}
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">{module.titre}</h2>

                {/* Video Player */}
                {module.videoUrl && (
                  <div className="rounded-lg overflow-hidden bg-black mb-6">
                    <video
                      key={module.videoUrl ?? `module-${module.numero}`}
                      className="w-full aspect-video"
                      controls
                      onEnded={handleModuleComplete}
                    >
                      <source src={module.videoUrl} type="video/mp4" />
                      Votre navigateur ne supporte pas le tag vidéo.
                    </video>
                  </div>
                )}
              </div>

              {/* Module Content */}
              <div className="bg-card border border-border rounded-xl p-8 space-y-4">
                <div className="prose prose-sm max-w-none dark:prose-invert text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
                  {module.contenu}
                </div>
              </div>

              {/* Complete Module Button */}
              {!completedModules.includes(module.numero) && !module.videoUrl && (
                <button
                  onClick={handleModuleComplete}
                  className="w-full bg-green-500 text-white p-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Marquer comme complété
                </button>
              )}

              {/* Navigation */}
              {currentModule < totalModules && completedModules.includes(module.numero) && (
                <button
                  onClick={() => setCurrentModule(currentModule + 1)}
                  className="w-full bg-primary text-white p-4 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  Module suivant
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <ExamComponent
              course={course}
              onComplete={() => setShowExam(false)}
              courseId={courseId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ExamComponent({ course, onComplete, courseId }: any) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(course.examen.questions.length).fill(null)
  );
  const examDuration = (course.examen?.dureeMinutes || 15) * 60;
  const [timeRemaining, setTimeRemaining] = useState(examDuration);
  const [submitted, setSubmitted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [score, setScore] = useState(0);

  // Define these early
  const questions = course?.examen?.questions || [];
  const q = questions[currentQuestion];

  // Timer
  useEffect(() => {
    if (submitted || timedOut || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setTimedOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, timedOut, timeRemaining]);

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    answers.forEach((answer, idx) => {
      if (answer === questions[idx]?.reponseCorrecte) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
  };

  const handleRetakeExam = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(null));
    setTimeRemaining(examDuration);
    setSubmitted(false);
    setTimedOut(false);
    setScore(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timeout screen
  if (timedOut && !submitted) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center space-y-6">
        <div className="text-5xl">⏰</div>
        <div className="text-2xl font-bold text-red-500">Temps écoulé !</div>
        <p className="text-muted-foreground text-lg">
          Vous n'avez pas complété l'examen dans le délai de 15 minutes.
        </p>
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-left">
          <p className="font-semibold text-yellow-600 mb-2">📚 Recommandation :</p>
          <p className="text-sm text-foreground">
            Retournez étudier les modules pour mieux comprendre le contenu, puis réessayez l'examen.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onComplete}
            className="px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors font-medium"
          >
            Retour au cours
          </button>
          <button
            onClick={handleRetakeExam}
            className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            Réessayer l'examen
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    const passed = score >= (course.examen?.scoreMinimum || 60);
    
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center space-y-6">
        <div className="text-5xl font-bold text-foreground">{score}%</div>
        <div className="text-xl font-semibold">
          {passed ? (
            <span className="text-green-500">✓ Examen réussi !</span>
          ) : (
            <span className="text-red-500">✗ Examen échoué</span>
          )}
        </div>
        <p className="text-muted-foreground">
          Vous avez obtenu {answers.filter((a, i) => a === questions[i].reponseCorrecte).length} / {questions.length} bonnes réponses.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onComplete}
            className="px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors font-medium"
          >
            Retour au cours
          </button>
          {!passed && (
            <button
              onClick={handleRetakeExam}
              className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              Réessayer l'examen
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Exam Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Examen QCM - 15 minutes</h3>
          <div className={`text-lg font-mono font-bold ${timeRemaining < 300 ? 'text-red-500 animate-pulse' : 'text-foreground'}`}>
            {formatTime(timeRemaining)}
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${timeRemaining < 300 ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Question {currentQuestion + 1} sur {questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <h2 className="text-xl font-semibold text-foreground">{q.question}</h2>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((option: string, idx: number) => (
            <button
              key={idx}
              onClick={() => handleSelectAnswer(idx)}
              className={`w-full p-4 rounded-lg border transition-all text-left ${
                answers[currentQuestion] === idx
                  ? 'bg-blue-500/10 border-blue-500'
                  : 'bg-muted border-border hover:border-muted-foreground/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    answers[currentQuestion] === idx
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-muted-foreground'
                  }`}
                >
                  {answers[currentQuestion] === idx && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-foreground">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-3 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Précédent
        </button>
        
        <button
          onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
          disabled={currentQuestion === questions.length - 1}
          className="px-6 py-3 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Suivant
        </button>

        {currentQuestion === questions.length - 1 && (
          <button
            onClick={handleSubmit}
            className="ml-auto px-6 py-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Soumettre l'examen
          </button>
        )}
      </div>

      {/* Question Progress */}
      <div className="grid grid-cols-6 gap-2">
        {questions.map((_: any, idx: number) => (
          <button
            key={idx}
            onClick={() => setCurrentQuestion(idx)}
            className={`aspect-square rounded-lg border font-medium text-sm transition-all ${
              idx === currentQuestion
                ? 'bg-blue-500 text-white border-blue-600'
                : answers[idx] !== null
                ? 'bg-green-500/20 text-green-600 border-green-500'
                : 'bg-muted border-border hover:border-muted-foreground/50'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
