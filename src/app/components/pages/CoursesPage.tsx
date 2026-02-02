import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Clock, Users, Star, Play, CheckCircle2, Lock } from 'lucide-react';
import { useCollection } from '@/app/hooks/useCollection';

export function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const { data: cours } = useCollection<any>('cours');
  const { data: progressions } = useCollection<any>('progressionCours');

  const progressByCourse = useMemo(() => {
    const map = new Map<string, number>();
    progressions.forEach((entry) => {
      const courseId = entry.coursId?.$oid ?? entry.coursId;
      if (!courseId) return;
      map.set(courseId, Math.max(map.get(courseId) || 0, entry.progression || 0));
    });
    return map;
  }, [progressions]);

  useEffect(() => {
    const formatDuration = (minutes: number) => {
      if (!minutes && minutes !== 0) return '—';
      if (minutes < 60) return `${minutes}min`;
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return m ? `${h}h ${m}min` : `${h}h`;
    };

    const mapped = cours.map((course, index) => {
      const courseId = course._id?.$oid ?? course._id;
      const progress = progressByCourse.get(courseId) || 0;
      return {
        id: course.idCours ?? course._id,
        title: course.titre,
        description: course.description,
        instructor: 'Équipe Smart Plant Care',
        duration: formatDuration(course.duree),
        durationMinutes: course.duree || 0,
        students: 0,
        rating: 4.7,
        progress,
        level: course.niveau ? course.niveau.charAt(0).toUpperCase() + course.niveau.slice(1) : 'Débutant',
        lessons: course.chapitres?.length || 0,
        image: course.image || [
          'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400',
          'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400',
          'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400',
          'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400',
        ][index % 4],
        enrolled: progress > 0,
      };
    });

    if (mapped.length) setCourses(mapped);
  }, [cours, progressByCourse]);

  const enrolledCount = courses.filter((course) => course.enrolled).length;
  const totalMinutes = courses.reduce((sum, course) => sum + (course.durationMinutes || 0), 0);
  const totalLessons = courses.reduce((sum, course) => sum + (course.lessons || 0), 0);

  const categories = [
    { name: 'Tous les cours', count: courses.length, active: true },
    { name: 'Débutant', count: courses.filter((c) => c.level === 'Débutant').length, active: false },
    { name: 'Intermédiaire', count: courses.filter((c) => c.level === 'Intermédiaire').length, active: false },
    { name: 'Avancé', count: courses.filter((c) => c.level === 'Avancé').length, active: false },
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
              <p className="text-3xl font-semibold text-foreground mt-2">{enrolledCount}</p>
            </div>
            <BookOpen className="w-10 h-10 text-primary opacity-20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Heures d'apprentissage</p>
              <p className="text-3xl font-semibold text-foreground mt-2">{(totalMinutes / 60).toFixed(1)}</p>
            </div>
            <Clock className="w-10 h-10 text-chart-2 opacity-20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Leçons complétées</p>
              <p className="text-3xl font-semibold text-foreground mt-2">{totalLessons}</p>
            </div>
            <CheckCircle2 className="w-10 h-10 text-chart-1 opacity-20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Certificats obtenus</p>
              <p className="text-3xl font-semibold text-foreground mt-2">{progressions.filter((p) => p.examenPasse).length}</p>
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
