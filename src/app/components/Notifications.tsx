import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';

export function Notifications() {
  useEffect(() => {
    // Simulate welcome notification
    const timer = setTimeout(() => {
      toast.success('Bienvenue sur Smart Plant Care !', {
        description: 'Votre jardin intelligent vous attend.',
        duration: 3000,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return <Toaster position="top-right" richColors closeButton />;
}

export { toast };
