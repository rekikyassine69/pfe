import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { api, clearAuth, getToken, setAuth } from '@/app/services/api';
import { Sidebar } from '@/app/components/Sidebar';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import { PublicNavbar } from '@/app/components/PublicNavbar';
import { ToastProvider } from '@/app/components/ToastProvider';
import { DashboardPage } from '@/app/components/pages/DashboardPage';
import { PotsPage } from '@/app/components/pages/PotsPage';
import { MonitoringPage } from '@/app/components/pages/MonitoringPage';
import { RecognitionPage } from '@/app/components/pages/RecognitionPage';
import { CoursesPage } from '@/app/components/pages/CoursesPage';
import { CourseDetailPage } from '@/app/components/pages/CourseDetailPage';
import { GamesPage } from '@/app/components/pages/GamesPage';
import { ShopPage } from '@/app/components/pages/ShopPage';
import { CartPage } from '@/app/components/pages/CartPage';
import { CheckoutPage } from '@/app/components/pages/CheckoutPage';
import { OrdersPage } from '@/app/components/pages/OrdersPage';
import { ContactPage } from '@/app/components/pages/ContactPage';
import { AdminPage } from '@/app/components/pages/AdminPage';
import { AdminUsersPage } from '@/app/components/pages/AdminUsersPage';
import { AdminPotsPage } from '@/app/components/pages/AdminPotsPage';
import { AdminShopPage } from '@/app/components/pages/AdminShopPage';
import { AdminOrdersPage } from '@/app/components/pages/AdminOrdersPage';
import { AdminCoursesPage } from '@/app/components/pages/AdminCoursesPage';
import { AdminGamesPage } from '@/app/components/pages/AdminGamesPage';
import { LoginPage } from '@/app/components/pages/LoginPage';
import { SignupPage } from '@/app/components/pages/SignupPage';
import { ForgotPasswordPage } from '@/app/components/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/app/components/pages/ResetPasswordPage';
import { LandingPage } from '@/app/components/pages/LandingPage';
import { PlantCarePage } from '@/app/components/pages/PlantCarePage';
import { GamesDemoPage } from '@/app/components/pages/GamesDemoPage';
import { CoursesPreviewPage } from '@/app/components/pages/CoursesPreviewPage';
import { SettingsPage } from '@/app/components/pages/SettingsPage';
import { CartProvider } from '@/app/hooks/useCart';
import { NotificationsProvider } from '@/app/hooks/useNotifications';

type UserRole = 'visitor' | 'client' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [userRole, setUserRole] = useState<UserRole>('visitor');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const data = await api.me();
        const role = data?.role === 'admin' ? 'admin' : 'client';
        setUserRole(role);
        setCurrentPage(role === 'admin' ? 'admin-dashboard' : 'dashboard');
      } catch {
        clearAuth();
      }
    };

    restoreSession();

    // Listen for custom navigation events
    const handleCustomNavigate = (event: any) => {
      handleNavigate(event.detail);
    };
    window.addEventListener('navigate', handleCustomNavigate);
    return () => window.removeEventListener('navigate', handleCustomNavigate);
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const routeToPage: Record<string, string> = {
      '/': 'landing',
      '/login': 'login',
      '/signup': 'signup',
      '/plant-care': 'plant-care',
      '/games-demo': 'games-demo',
      '/courses-preview': 'courses-preview',
      '/forgot-password': 'forgot-password',
      '/reset-password': 'reset-password',
    };

    const page = routeToPage[path];
    if (page) {
      setCurrentPage(page);
    }

    if (path === '/reset-password') {
      setResetToken(params.get('token'));
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      const role = response?.role === 'admin' ? 'admin' : 'client';
      setAuth(response.token, role);
      setUserRole(role);
      toast.success(role === 'admin' ? 'Connexion administrateur réussie!' : 'Connexion réussie!', {
        description: role === 'admin'
          ? 'Bienvenue dans le panneau d\'administration'
          : 'Bienvenue sur Smart Plant Care Platform',
      });
      setCurrentPage(role === 'admin' ? 'admin-dashboard' : 'dashboard');
    } catch (error) {
      toast.error('Connexion échouée', {
        description: (error as Error).message || 'Vérifiez vos identifiants',
      });
    }
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      await api.register(name, email, password);
      const login = await api.login(email, password, 'client');
      setAuth(login.token, 'client');
      setUserRole('client');
      toast.success('Compte créé avec succès!', {
        description: `Bienvenue ${name} !`,
      });
      setCurrentPage('dashboard');
    } catch (error) {
      toast.error('Inscription échouée', {
        description: (error as Error).message || 'Veuillez réessayer',
      });
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await api.forgotPassword(email);
      toast.success('Email envoyé', {
        description: 'Si cet email existe, un lien vous a été envoyé.',
      });
      setCurrentPage('login');
      window.history.pushState({}, '', '/login');
    } catch (error) {
      toast.error('Erreur', {
        description: (error as Error).message || 'Veuillez réessayer',
      });
    }
  };

  const handleResetPassword = async (token: string, newPassword: string) => {
    try {
      await api.resetPassword(token, newPassword);
      toast.success('Mot de passe réinitialisé', {
        description: 'Vous pouvez maintenant vous connecter.',
      });
      setCurrentPage('login');
      window.history.pushState({}, '', '/login');
    } catch (error) {
      toast.error('Réinitialisation échouée', {
        description: (error as Error).message || 'Veuillez réessayer',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore logout errors
    }
    clearAuth();
    setUserRole('visitor');
    setCurrentPage('landing');
    toast.info('Déconnexion réussie', {
      description: 'À bientôt !',
    });
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (userRole !== 'visitor') return;

    const routeMap: Record<string, string> = {
      landing: '/',
      login: '/login',
      signup: '/signup',
      'forgot-password': '/forgot-password',
      'reset-password': '/reset-password',
      'plant-care': '/plant-care',
      'games-demo': '/games-demo',
      'courses-preview': '/courses-preview',
    };

    const path = routeMap[page];
    if (path) {
      window.history.pushState({}, '', path);
    }
  };

  // Visitor pages (public)
  const renderVisitorPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'plant-care':
        return <PlantCarePage />;
      case 'games-demo':
        return <GamesDemoPage onNavigate={handleNavigate} />;
      case 'courses-preview':
        return <CoursesPreviewPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'signup':
        return <SignupPage onSignup={handleSignup} onNavigate={handleNavigate} />;
      case 'forgot-password':
        return <ForgotPasswordPage onSubmit={handleForgotPassword} onNavigate={handleNavigate} />;
      case 'reset-password':
        return (
          <ResetPasswordPage
            token={resetToken}
            onReset={handleResetPassword}
            onNavigate={handleNavigate}
          />
        );
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  // Client pages (authenticated user)
  const renderClientPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'pots':
        return <PotsPage />;
      case 'monitoring':
        return <MonitoringPage />;
      case 'recognition':
        return <RecognitionPage />;
      case 'courses':
        return <CoursesPage onSelectCourse={(id: string) => {
          setCourseId(id);
          setCurrentPage('course-detail');
        }} />;
      case 'course-detail':
        return courseId ? (
          <CourseDetailPage 
            courseId={courseId}
            onBack={() => setCurrentPage('courses')}
          />
        ) : (
          <CoursesPage onSelectCourse={(id: string) => {
            setCourseId(id);
            setCurrentPage('course-detail');
          }} />
        );
        return <CoursesPage />;
      case 'games':
        return <GamesPage />;
      case 'shop':
        return <ShopPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'orders':
        return <OrdersPage />;
      case 'contact':
        return <ContactPage />;
      case 'settings':
        return <SettingsPage userRole="client" />;
      default:
        return <DashboardPage />;
    }
  };

  // Admin pages
  const renderAdminPage = () => {
    switch (currentPage) {
      case 'admin-dashboard':
        return <AdminPage />;
      case 'admin-users':
        return <AdminUsersPage />;
      case 'admin-pots':
        return <AdminPotsPage />;
      case 'admin-shop':
        return <AdminShopPage />;
      case 'admin-orders':
        return <AdminOrdersPage />;
      case 'admin-courses':
        return <AdminCoursesPage />;
      case 'admin-games':
        return <AdminGamesPage />;
      case 'admin-analytics':
        return <AdminPage />; // Reuse dashboard for now
      case 'admin-settings':
        return <SettingsPage userRole="admin" />;
      default:
        return <AdminPage />;
    }
  };

  // Visitor interface (public)
  if (userRole === 'visitor') {
    return (
      <>
        <ToastProvider />
        <div className="min-h-screen bg-background">
          <PublicNavbar currentPage={currentPage} onNavigate={handleNavigate} />
          <main className="pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {renderVisitorPage()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </>
    );
  }

  // Admin interface
  if (userRole === 'admin') {
    return (
      <>
        <ToastProvider />
        <NotificationsProvider>
          <div className="flex min-h-screen bg-background">
            <AdminSidebar 
              currentPage={currentPage} 
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
            <main className="flex-1 lg:ml-64 p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    {renderAdminPage()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
        </NotificationsProvider>
      </>
    );
  }

  // Client interface (authenticated user)
  return (
    <>
      <ToastProvider />
      <NotificationsProvider>
        <CartProvider>
          <div className="flex min-h-screen bg-background">
            <Sidebar 
              currentPage={currentPage} 
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              isAdmin={false}
            />
            <main className="flex-1 lg:ml-64 p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    {renderClientPage()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
        </CartProvider>
      </NotificationsProvider>
    </>
  );
}