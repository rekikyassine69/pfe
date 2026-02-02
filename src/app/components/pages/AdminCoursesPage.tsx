import { useState } from 'react';
import { BookOpen, Search, Plus, Edit2, Trash2, Users, Clock, Star, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { CourseModal } from '@/app/components/modals/CourseModal';
import { DeleteConfirmModal } from '@/app/components/modals/DeleteConfirmModal';

export function AdminCoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Introduction à l\'IoT pour l\'Agriculture',
      instructor: 'Dr. Marie Dubois',
      duration: '4 heures',
      lessons: 12,
      students: 1247,
      rating: 4.8,
      reviews: 234,
      status: 'Publié',
      category: 'Débutant',
      lastUpdated: '15 Jan 2024',
    },
    {
      id: 2,
      title: 'Capteurs et Arduino pour Plantes',
      instructor: 'Jean Martin',
      duration: '6 heures',
      lessons: 18,
      students: 892,
      rating: 4.9,
      reviews: 156,
      status: 'Publié',
      category: 'Intermédiaire',
      lastUpdated: '10 Jan 2024',
    },
    {
      id: 3,
      title: 'Intelligence Artificielle et Botanique',
      instructor: 'Sophie Laurent',
      duration: '8 heures',
      lessons: 24,
      students: 645,
      rating: 4.7,
      reviews: 98,
      status: 'Publié',
      category: 'Avancé',
      lastUpdated: '05 Jan 2024',
    },
    {
      id: 4,
      title: 'Hydroponie et Systèmes Automatisés',
      instructor: 'Pierre Durand',
      duration: '10 heures',
      lessons: 30,
      students: 523,
      rating: 4.9,
      reviews: 87,
      status: 'Brouillon',
      category: 'Avancé',
      lastUpdated: '20 Jan 2024',
    },
  ]);

  const stats = [
    { label: 'Total Cours', value: '42', icon: BookOpen, color: 'text-chart-1' },
    { label: 'Étudiants', value: '3,307', icon: Users, color: 'text-chart-2' },
    { label: 'Heures de contenu', value: '156h', icon: Clock, color: 'text-chart-3' },
    { label: 'Note moyenne', value: '4.8', icon: Star, color: 'text-yellow-500' },
  ];

  const handleAdd = () => {
    setSelectedCourse(null);
    setModalMode('add');
    setShowCourseModal(true);
  };

  const handleView = (course: any) => {
    setSelectedCourse({
      id: course.id.toString(),
      title: course.title,
      description: `Cours complet sur ${course.title.toLowerCase()}`,
      duration: course.duration,
      level: course.category,
      category: 'Plantation',
      enrolled: course.students,
    });
    setModalMode('view');
    setShowCourseModal(true);
  };

  const handleEdit = (course: any) => {
    setSelectedCourse({
      id: course.id.toString(),
      title: course.title,
      description: `Cours complet sur ${course.title.toLowerCase()}`,
      duration: course.duration,
      level: course.category,
      category: 'Plantation',
      enrolled: course.students,
    });
    setModalMode('edit');
    setShowCourseModal(true);
  };

  const handleSaveCourse = (courseData: any) => {
    if (modalMode === 'add') {
      const newCourse = {
        id: courses.length + 1,
        title: courseData.title,
        instructor: 'Nouvel Instructeur',
        duration: courseData.duration,
        lessons: 12,
        students: 0,
        rating: 0,
        reviews: 0,
        status: 'Brouillon',
        category: courseData.level,
        lastUpdated: new Date().toLocaleDateString('fr-FR'),
      };
      setCourses([...courses, newCourse]);
    } else if (modalMode === 'edit') {
      setCourses(courses.map(c => 
        c.id.toString() === courseData.id 
          ? { ...c, title: courseData.title, duration: courseData.duration, category: courseData.level }
          : c
      ));
    }
  };

  const handleDeleteClick = (course: any) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCourse) {
      setCourses(courses.filter(c => c.id !== selectedCourse.id));
      toast.success(`Cours "${selectedCourse.title}" supprimé !`);
      setSelectedCourse(null);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Gestion des Cours</h1>
        <p className="text-muted-foreground mt-1">
          Gérez le catalogue de cours en ligne
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-semibold text-foreground mt-2">{stat.value}</p>
                </div>
                <Icon className={`w-10 h-10 ${stat.color} opacity-20`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouveau Cours
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.category === 'Débutant'
                      ? 'bg-green-500/20 text-green-600'
                      : course.category === 'Intermédiaire'
                      ? 'bg-yellow-500/20 text-yellow-600'
                      : 'bg-orange-500/20 text-orange-600'
                  }`}>
                    {course.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === 'Publié'
                      ? 'bg-green-500/20 text-green-600'
                      : 'bg-gray-500/20 text-gray-600'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Par {course.instructor}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-border">
              <div className="text-center">
                <Users className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-sm font-semibold text-foreground">{course.students.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Étudiants</p>
              </div>
              <div className="text-center">
                <BookOpen className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-sm font-semibold text-foreground">{course.lessons}</p>
                <p className="text-xs text-muted-foreground">Leçons</p>
              </div>
              <div className="text-center">
                <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-sm font-semibold text-foreground">{course.duration}</p>
                <p className="text-xs text-muted-foreground">Durée</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                <span className="font-semibold text-foreground">{course.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({course.reviews} avis)
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Mis à jour: {course.lastUpdated}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleView(course)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  title="Aperçu"
                >
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleEdit(course)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  title="Éditer"
                >
                  <Edit2 className="w-4 h-4 text-primary" />
                </button>
                <button
                  onClick={() => handleDeleteClick(course)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Course Modal */}
      <CourseModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        course={selectedCourse}
        mode={modalMode}
        onSave={handleSaveCourse}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le cours"
        message="Êtes-vous sûr de vouloir supprimer ce cours ?"
        itemName={selectedCourse?.title}
      />
    </div>
  );
}