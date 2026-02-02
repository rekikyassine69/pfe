import { BookOpen, Clock, Users, Star, Play, CheckCircle2, Lock } from 'lucide-react';

export function CoursesPage() {
  const courses = [
    {
      id: 1,
      title: 'Introduction à l\'Agriculture IoT',
      description: 'Découvrez les bases de l\'agriculture connectée et intelligente',
      instructor: 'Dr. Marie Dubois',
      duration: '4h 30min',
      students: 1234,
      rating: 4.8,
      progress: 65,
      level: 'Débutant',
      lessons: 12,
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400',
      enrolled: true,
    },
    {
      id: 2,
      title: 'Capteurs IoT pour Plantes',
      description: 'Apprenez à utiliser et configurer différents types de capteurs',
      instructor: 'Prof. Jean Martin',
      duration: '3h 45min',
      students: 892,
      rating: 4.9,
      progress: 0,
      level: 'Intermédiaire',
      lessons: 10,
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400',
      enrolled: false,
    },
    {
      id: 3,
      title: 'Intelligence Artificielle en Agriculture',
      description: 'Maîtrisez les algorithmes d\'IA pour l\'agriculture de précision',
      instructor: 'Dr. Sophie Laurent',
      duration: '6h 15min',
      students: 567,
      rating: 4.7,
      progress: 30,
      level: 'Avancé',
      lessons: 15,
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400',
      enrolled: true,
    },
    {
      id: 4,
      title: 'Hydroponie et Technologie',
      description: 'Culture hydroponique assistée par IoT',
      instructor: 'Marc Rousseau',
      duration: '5h 00min',
      students: 734,
      rating: 4.6,
      progress: 0,
      level: 'Intermédiaire',
      lessons: 11,
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400',
      enrolled: false,
    },
  ];

  const categories = [
    { name: 'Tous les cours', count: 24, active: true },
    { name: 'IoT & Capteurs', count: 8, active: false },
    { name: 'Intelligence Artificielle', count: 6, active: false },
    { name: 'Agriculture Urbaine', count: 5, active: false },
    { name: 'Hydroponie', count: 5, active: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Cours en Ligne</h1>
        <p className="text-muted-foreground mt-1">
          Développez vos compétences en agriculture intelligente
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cours inscrits</p>
              <p className="text-3xl font-semibold text-foreground mt-2">2</p>
            </div>
            <BookOpen className="w-10 h-10 text-primary opacity-20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Heures d\'apprentissage</p>
              <p className="text-3xl font-semibold text-foreground mt-2">12.5</p>
            </div>
            <Clock className="w-10 h-10 text-chart-2 opacity-20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Leçons complétées</p>
              <p className="text-3xl font-semibold text-foreground mt-2">18</p>
            </div>
            <CheckCircle2 className="w-10 h-10 text-chart-1 opacity-20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Certificats obtenus</p>
              <p className="text-3xl font-semibold text-foreground mt-2">1</p>
            </div>
            <Star className="w-10 h-10 text-yellow-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category.active
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:bg-secondary'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-shadow group"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                  {course.level}
                </span>
              </div>
              {course.enrolled && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent flex items-end p-4">
                  <div className="w-full">
                    <div className="flex items-center justify-between text-white text-sm mb-2">
                      <span>Progression</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessons} leçons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-foreground">{course.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{course.instructor}</p>
                </div>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    course.enrolled
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {course.enrolled ? (
                    <>
                      <Play className="w-4 h-4" />
                      <span className="text-sm">Continuer</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">S'inscrire</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
