import { useState } from 'react';
import { 
  Home, 
  Flower2, 
  Activity, 
  Brain, 
  BookOpen, 
  Gamepad2, 
  ShoppingCart, 
  Package,
  Settings, 
  MessageSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { ThemeToggle } from '@/app/components/ThemeToggle';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  isAdmin?: boolean;
}

export function Sidebar({ currentPage, onNavigate, onLogout, isAdmin = false }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'pots', label: 'Mes Pots', icon: Flower2 },
    { id: 'monitoring', label: 'Surveillance', icon: Activity },
    { id: 'recognition', label: 'Reconnaissance IA', icon: Brain },
    { id: 'courses', label: 'Cours en ligne', icon: BookOpen },
    { id: 'games', label: 'Jeux Éducatifs', icon: Gamepad2 },
    { id: 'shop', label: 'Boutique', icon: ShoppingCart },
    { id: 'orders', label: 'Mes Commandes', icon: Package },
    { id: 'contact', label: 'Contact', icon: MessageSquare },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'admin', label: 'Administration', icon: LayoutDashboard });
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-primary text-primary-foreground p-2 rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-card border-r border-border z-40
        w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Flower2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Smart Plant Care</h1>
                <p className="text-xs text-muted-foreground">Plateforme IoT</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-foreground hover:bg-secondary'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="pt-4 border-t border-border mt-4 space-y-2">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm font-medium text-muted-foreground">Thème</span>
              <ThemeToggle />
            </div>
            <button 
              onClick={() => {
                onNavigate('settings');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Paramètres</span>
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}