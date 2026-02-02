import { BookOpen, Clock, Users, Star, Lock, Play, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface CoursesPreviewPageProps {
  onNavigate: (page: string) => void;
}

export function CoursesPreviewPage({ onNavigate }: CoursesPreviewPageProps) {
  const courses = [
    {
      title: 'Introduction à l\'IoT pour l\'Agriculture',
      description: 'Découvrez les bases de l\'Internet des objets appliqué à l\'agriculture urbaine',
      instructor: 'Dr. Marie Dubois',
      duration: '4 heures',
      students: 1247,
      rating: 4.8,
      level: 'Débutant',
      lessons: 12,
      preview: true,
      image: '🌱',
    },
    {
      title: 'Capteurs et Arduino pour Plantes',
      description: 'Apprenez à construire vos propres capteurs de surveillance des plantes',
      instructor: 'Jean Martin',
      duration: '6 heures',
      students: 892,
      rating: 4.9,
      level: 'Intermédiaire',
      lessons: 18,
      preview: false,
      image: '🔧',
    },
    {
      title: 'Intelligence Artificielle et Botanique',
      description: 'Utilisez l\'IA pour identifier et diagnostiquer vos plantes',
      instructor: 'Sophie Laurent',
      duration: '8 heures',
      students: 645,
      rating: 4.7,
      level: 'Avancé',
      lessons: 24,
      preview: false,
      image: '🤖',
    },
    {
      title: 'Hydroponie et Systèmes Automatisés',
      description: 'Créez votre propre système hydroponique intelligent',
      instructor: 'Pierre Durand',
      duration: '10 heures',
      students: 523,
      rating: 4.9,
      level: 'Avancé',
      lessons: 30,
      preview: false,
      image: '💧',
    },
  ];

  const freeLessons = [
    {
      title: 'Qu\'est-ce que l\'IoT ?',
      duration: '12 min',
      type: 'Vidéo',
      completed: false,
    },
    {
      title: 'Les capteurs de base',
      duration: '15 min',
      type: 'Vidéo',
      completed: false,
    },
    {
      title: 'Premier projet Arduino',
      duration: '20 min',
      type: 'Pratique',
      completed: false,
    },
  ];

  const skills = [
    'Programmation Arduino',
    'Installation de capteurs',
    'Analyse de données',
    'Machine Learning',
    'Systèmes automatisés',
    'Optimisation énergétique',
  ];

  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Cours en Ligne
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Apprenez l'agriculture intelligente avec nos experts
        </p>
      </motion.div>

      {/* Preview Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center"
      >
        <BookOpen className="w-12 h-12 text-primary mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Aperçu des Cours
        </h3>
        <p className="text-muted-foreground mb-4">
          Découvrez nos cours et accédez à quelques leçons gratuites. Créez un compte pour débloquer l'accès complet !
        </p>
        <button
          onClick={() => onNavigate('signup')}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          S'inscrire gratuitement
        </button>
      </motion.div>

      {/* Courses Grid */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Nos Cours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Course Image/Icon */}
              <div className="bg-gradient-to-br from-primary/20 to-secondary p-12 text-center relative">
                <div className="text-7xl mb-4">{course.image}</div>
                {!course.preview && (
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-2">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                {course.preview && (
                  <div className="absolute top-4 right-4 bg-primary rounded-full px-3 py-1">
                    <span className="text-xs font-medium text-primary-foreground">Aperçu gratuit</span>
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.level === 'Débutant'
                      ? 'bg-green-500/20 text-green-600'
                      : course.level === 'Intermédiaire'
                      ? 'bg-yellow-500/20 text-yellow-600'
                      : 'bg-orange-500/20 text-orange-600'
                  }`}>
                    {course.level}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Instructeur</p>
                      <p className="font-medium text-foreground">{course.instructor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Leçons</p>
                      <p className="font-medium text-foreground">{course.lessons}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Free Preview Section */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary to-muted rounded-2xl p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Play className="w-12 h-12 text-primary mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Leçons Gratuites
            </h2>
            <p className="text-muted-foreground">
              Commencez votre apprentissage dès maintenant avec ces leçons gratuites
            </p>
          </div>

          <div className="space-y-3">
            {freeLessons.map((lesson, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {lesson.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{lesson.type}</span>
                      <span>•</span>
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                </div>
                {lesson.completed && (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('signup')}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Débloquer tous les cours
            </button>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Compétences que vous allez acquérir
          </h2>
          <p className="text-muted-foreground">
            Développez des compétences recherchées en agriculture intelligente et IoT
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="px-4 py-2 bg-card border border-border rounded-full"
            >
              <span className="text-foreground font-medium">{skill}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary rounded-2xl p-8 text-center"
      >
        <h3 className="text-2xl font-bold text-primary-foreground mb-4">
          Prêt à commencer votre formation ?
        </h3>
        <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
          Rejoignez plus de 3000 étudiants et maîtrisez l'agriculture intelligente
        </p>
        <button
          onClick={() => onNavigate('signup')}
          className="px-8 py-3 bg-background text-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Commencer gratuitement
        </button>
      </motion.div>
    </div>
  );
}
