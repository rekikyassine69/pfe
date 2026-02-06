import { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Bell, Globe, Shield, Database, Palette, Save, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useUser } from '@/app/hooks/useUser';

interface SettingsPageProps {
  userRole: 'client' | 'admin';
}

export function SettingsPage({ userRole }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, loading, updateUser, changePassword } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    bio: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preferences, setPreferences] = useState({
    langue: 'fr',
    fuseau: 'Europe/Paris',
    unites: 'metric',
    theme: 'auto',
    notifications: {
      alertes: true,
      cours: true,
      promotions: false,
      newsletter: true,
    },
  });

  // Update form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        bio: user.bio || '',
      });
      if (user.preferences) {
        setPreferences({
          langue: user.preferences.langue || 'fr',
          fuseau: user.preferences.fuseau || 'Europe/Paris',
          unites: user.preferences.unites || 'metric',
          theme: user.preferences.theme || 'auto',
          notifications: user.preferences.notifications || {
            alertes: true,
            cours: true,
            promotions: false,
            newsletter: true,
          },
        });
      }
    }
  }, [user]);

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'preferences', label: 'Préférences', icon: Palette },
    ...(userRole === 'admin' ? [
      { id: 'system', label: 'Système', icon: Database },
      { id: 'platform', label: 'Plateforme', icon: Globe },
    ] : []),
  ];

  const handleSaveProfile = async () => {
    if (!formData.nom || !formData.prenom) {
      toast.error('Veuillez remplir les champs requis');
      return;
    }
    
    try {
      setIsSaving(true);
      await updateUser(formData);
      toast.success('Profil mis à jour avec succès', {
        description: 'Vos modifications ont été enregistrées',
      });
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour', {
        description: error.message || 'Une erreur s\'est produite',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setIsSaving(true);
      await updateUser({
        preferences,
      });
      toast.success('Préférences mises à jour', {
        description: 'Vos préférences ont été enregistrées',
      });
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour', {
        description: error.message || 'Une erreur s\'est produite',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Veuillez remplir les champs requis');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setIsSaving(true);
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Mot de passe changé avec succès');
    } catch (error: any) {
      toast.error('Erreur lors du changement de mot de passe', {
        description: error.message || 'Une erreur s\'est produite',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Informations Personnelles</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary opacity-50"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Adresse email non modifiable</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Préférences de Notification</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Alertes des capteurs</p>
              <p className="text-sm text-muted-foreground">Recevoir des alertes pour vos plantes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences.notifications.alertes}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    notifications: { ...preferences.notifications, alertes: e.target.checked },
                  })
                }
              />
              <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Nouveaux cours</p>
              <p className="text-sm text-muted-foreground">Être notifié des nouveaux cours</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences.notifications.cours}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    notifications: { ...preferences.notifications, cours: e.target.checked },
                  })
                }
              />
              <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Promotions boutique</p>
              <p className="text-sm text-muted-foreground">Offres et promotions spéciales</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences.notifications.promotions}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    notifications: { ...preferences.notifications, promotions: e.target.checked },
                  })
                }
              />
              <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Newsletter hebdomadaire</p>
              <p className="text-sm text-muted-foreground">Résumé hebdomadaire de vos plantes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences.notifications.newsletter}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    notifications: { ...preferences.notifications, newsletter: e.target.checked },
                  })
                }
              />
              <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Sécurité du Compte</h3>
        <div className="space-y-4">
          <div className="p-4 bg-card border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-4">Changer le mot de passe</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mot de passe actuel
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <button
                onClick={handleChangePassword}
                disabled={isSaving}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {isSaving ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Authentification à deux facteurs</p>
              <p className="text-sm text-muted-foreground">Sécurisez votre compte avec 2FA</p>
            </div>
            <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors">
              Activer
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Sessions actives</p>
              <p className="text-sm text-muted-foreground">Gérer vos connexions actives</p>
            </div>
            <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors">
              Voir (3)
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Préférences d'Affichage</h3>
        <div className="space-y-4">
          <div className="p-4 bg-card border border-border rounded-lg">
            <label className="block text-sm font-medium text-foreground mb-2">
              Langue
            </label>
            <select
              value={preferences.langue}
              onChange={(e) => setPreferences({ ...preferences, langue: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <label className="block text-sm font-medium text-foreground mb-2">
              Fuseau horaire
            </label>
            <select
              value={preferences.fuseau}
              onChange={(e) => setPreferences({ ...preferences, fuseau: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
            </select>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <label className="block text-sm font-medium text-foreground mb-2">
              Unités de mesure
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="metric"
                  name="units"
                  value="metric"
                  checked={preferences.unites === 'metric'}
                  onChange={(e) => setPreferences({ ...preferences, unites: e.target.value })}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="metric" className="text-foreground">Métrique (°C, cm)</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="imperial"
                  name="units"
                  value="imperial"
                  checked={preferences.unites === 'imperial'}
                  onChange={(e) => setPreferences({ ...preferences, unites: e.target.value })}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="imperial" className="text-foreground">Impérial (°F, inch)</label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Configuration Système</h3>
        <div className="space-y-4">
          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">Base de données</h4>
              <span className="px-2 py-1 bg-green-500/20 text-green-600 rounded-full text-xs">
                Connectée
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="text-foreground font-medium">MongoDB</p>
              </div>
              <div>
                <p className="text-muted-foreground">Version</p>
                <p className="text-foreground font-medium">6.0+</p>
              </div>
              <div>
                <p className="text-muted-foreground">Collections</p>
                <p className="text-foreground font-medium">30+</p>
              </div>
              <div>
                <p className="text-muted-foreground">Documents</p>
                <p className="text-foreground font-medium">~1000+</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-3">Actions Système</h4>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                Vérifier la santé
              </button>
              <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                Optimiser les index
              </button>
              <button className="px-4 py-2 bg-red-600/10 text-red-600 rounded-lg hover:bg-red-600/20 transition-colors">
                Sauvegarde de sécurité
              </button>
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <h4 className="font-medium text-foreground mb-3">Logs Système</h4>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                Voir les logs
              </button>
              <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                Télécharger
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlatformTab = () => {
    const [platformSettings, setPlatformSettings] = useState({
      platformName: 'Smart Plant Care Platform',
      contactEmail: 'contact@smartplantcare.com',
      allowPublicSignup: true,
      maintenanceMode: false,
    });

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Configuration de la Plateforme</h3>
          <div className="space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg">
              <label className="block text-sm font-medium text-foreground mb-2">
                Nom de la plateforme
              </label>
              <input
                type="text"
                value={platformSettings.platformName}
                onChange={(e) =>
                  setPlatformSettings({ ...platformSettings, platformName: e.target.value })
                }
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <label className="block text-sm font-medium text-foreground mb-2">
                Email de contact
              </label>
              <input
                type="email"
                value={platformSettings.contactEmail}
                onChange={(e) =>
                  setPlatformSettings({ ...platformSettings, contactEmail: e.target.value })
                }
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">Inscriptions publiques</p>
                <p className="text-sm text-muted-foreground">Autoriser les nouvelles inscriptions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={platformSettings.allowPublicSignup}
                  onChange={(e) =>
                    setPlatformSettings({
                      ...platformSettings,
                      allowPublicSignup: e.target.checked,
                    })
                  }
                />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">Mode maintenance</p>
                <p className="text-sm text-muted-foreground">Afficher la page de maintenance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={platformSettings.maintenanceMode}
                  onChange={(e) =>
                    setPlatformSettings({
                      ...platformSettings,
                      maintenanceMode: e.target.checked,
                    })
                  }
                />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos préférences et paramètres {userRole === 'admin' ? 'administrateur' : 'personnels'}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-xl p-2 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'preferences' && renderPreferencesTab()}
        {activeTab === 'system' && renderSystemTab()}
        {activeTab === 'platform' && renderPlatformTab()}
      </motion.div>
    </div>
  );
}
