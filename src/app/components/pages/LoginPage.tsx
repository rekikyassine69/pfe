import { useState } from 'react';
import { Flower2, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onNavigate: (page: string) => void;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-accent to-primary/80 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-white">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Flower2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Smart Plant Care</h1>
              <p className="text-white/80 text-sm">Plateforme IoT Éducative</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-semibold text-white mb-4">
              Cultivez l'avenir avec l'intelligence artificielle
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Surveillez vos plantes en temps réel, apprenez l'agriculture intelligente 
              et découvrez le pouvoir de l'IoT dans le jardinage moderne.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="grid grid-cols-3 gap-4 text-white"
          >
            <div className="text-center">
              <div className="text-4xl font-bold">500+</div>
              <div className="text-sm text-white/70">Pots connectés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">50+</div>
              <div className="text-sm text-white/70">Cours disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">98%</div>
              <div className="text-sm text-white/70">Taux de réussite</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center p-8 bg-background"
      >
        <div className="w-full max-w-md space-y-8">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Flower2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Smart Plant Care</h1>
              <p className="text-muted-foreground text-sm">Plateforme IoT</p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-semibold text-foreground mb-2">
              {isSignup ? 'Créer un compte' : 'Bienvenue'}
            </h2>
            <p className="text-muted-foreground">
              {isSignup 
                ? 'Rejoignez notre communauté de jardiniers connectés'
                : 'Connectez-vous pour accéder à votre jardin intelligent'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignup && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Jean Dupont"
                    required={isSignup}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="vous@exemple.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isSignup && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-sm text-muted-foreground">Se souvenir de moi</span>
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-sm text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg"
            >
              {isSignup ? 'S\'inscrire' : 'Se connecter'}
            </button>
          </form>

          <div className="text-center text-xs text-muted-foreground">
            <p>Projet universitaire IoT • Smart Agriculture</p>
            <p className="mt-1">© 2026 Smart Plant Care Platform</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}