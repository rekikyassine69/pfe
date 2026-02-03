import { useMemo, useState } from 'react';
import { Lock, ArrowRight, Flower2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ResetPasswordPageProps {
  token?: string | null;
  onReset: (token: string, newPassword: string) => void;
  onNavigate: (page: string) => void;
}

export function ResetPasswordPage({ token, onReset, onNavigate }: ResetPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const tokenValue = useMemo(() => token?.trim() || '', [token]);
  const canSubmit = tokenValue && password && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenValue) return;
    if (password !== confirmPassword) return;
    onReset(tokenValue, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Flower2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Smart Plant Care</h1>
            <p className="text-muted-foreground text-sm">Plateforme IoT</p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-semibold text-foreground mb-2">Nouveau mot de passe</h2>
          <p className="text-muted-foreground">
            Définissez un nouveau mot de passe pour votre compte.
          </p>
        </div>

        {!tokenValue && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 text-sm">
            Token manquant ou invalide. Vérifiez le lien reçu par email.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nouveau mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Confirmer le mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Réinitialiser
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => onNavigate('login')}
            className="text-sm text-primary hover:underline"
          >
            Retour à la connexion
          </button>
        </div>
      </motion.div>
    </div>
  );
}
