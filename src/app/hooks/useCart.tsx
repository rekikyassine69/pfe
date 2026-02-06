import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/app/services/api';
import { toast } from 'sonner';

interface CartItem {
  _id: string;
  produitId: any;
  nom: string;
  prix: number;
  imageUrl?: string;
  quantite: number;
}

interface Cart {
  _id: string;
  clientId: string;
  items: CartItem[];
  montantTotal: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  addToCart: (produitId: string, quantite?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantite: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    try {
      const data = await api.getCart();
      setCart(data);
    } catch (error: any) {
      // Si l'utilisateur n'est pas connecté, on ne fait rien
      if (!error.message?.includes('401')) {
        console.error('Error fetching cart:', error);
      }
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (produitId: string, quantite: number = 1) => {
    try {
      setLoading(true);
      const data = await api.addToCart(produitId, quantite);
      setCart(data);
      toast.success('Produit ajouté au panier');
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de l\'ajout au panier';
      
      // Vérifier si c'est une erreur d'authentification
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || errorMessage.includes('token')) {
        toast.error('Veuillez vous connecter pour ajouter des produits au panier', {
          description: 'Connectez-vous ou créez un compte pour continuer'
        });
      } else {
        toast.error(errorMessage);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantite: number) => {
    try {
      setLoading(true);
      const data = await api.updateCartItem(itemId, quantite);
      setCart(data);
      toast.success('Quantité mise à jour');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setLoading(true);
      const data = await api.removeFromCart(itemId);
      setCart(data);
      toast.success('Article retiré du panier');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const data = await api.clearCart();
      setCart(data);
      toast.success('Panier vidé');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression du panier');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantite, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
