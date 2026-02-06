import { useEffect, useState } from "react";
import { api } from "@/app/services/api";

export interface User {
  _id?: string;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  bio?: string;
  preferences?: {
    langue?: string;
    fuseau?: string;
    unites?: string;
    theme?: string;
    notifications?: {
      alertes?: boolean;
      cours?: boolean;
      promotions?: boolean;
      newsletter?: boolean;
    };
  };
  dateInscription?: string;
  statut?: string;
  role?: string;
}

interface UseUserOptions {
  enabled?: boolean;
}

export const useUser = (options: UseUserOptions = {}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (options.enabled === false) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.me();
        if (active) {
          setUser(data.user || null);
        }
      } catch (err) {
        if (active) {
          setError(err as Error);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [options.enabled]);

  const updateUser = async (updates: Partial<User>) => {
    try {
      const data = await api.updateProfile({
        nom: updates.nom,
        prenom: updates.prenom,
        telephone: updates.telephone,
        bio: updates.bio,
        preferences: updates.preferences,
      });
      if (data.user) {
        setUser(data.user);
      }
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const data = await api.changePassword(currentPassword, newPassword);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { user, loading, error, setUser, updateUser, changePassword };
};
