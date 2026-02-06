import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '@/app/hooks/useCart';

export function CartPage() {
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();

  const navigate = (page: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
  };

  const handleUpdateQuantity = async (itemId: string, newQuantite: number) => {
    if (newQuantite < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      await updateQuantity(itemId, newQuantite);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (confirm('Êtes-vous sûr de vouloir retirer cet article ?')) {
      await removeItem(itemId);
    }
  };

  const handleClearCart = async () => {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      await clearCart();
    }
  };

  if (loading && !cart) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('shop')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
              <ShoppingCart className="w-8 h-8" />
              Mon Panier
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEmpty ? 'Votre panier est vide' : `${cart.items.length} article${cart.items.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        {!isEmpty && (
          <button
            onClick={handleClearCart}
            className="px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Vider le panier
          </button>
        )}
      </div>

      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 space-y-4"
        >
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Votre panier est vide</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Explorez notre boutique et ajoutez des produits à votre panier
          </p>
          <button
            onClick={() => navigate('shop')}
            className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Découvrir la boutique
          </button>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 flex gap-4"
              >
                {/* Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200'}
                    alt={item.nom}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{item.nom}</h3>
                  <p className="text-xl font-semibold text-primary mb-4">{item.prix}€</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-secondary rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantite - 1)}
                        disabled={item.quantite <= 1 || updatingItems.has(item._id)}
                        className="p-2 hover:bg-secondary-foreground/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                        {item.quantite}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantite + 1)}
                        disabled={updatingItems.has(item._id)}
                        className="p-2 hover:bg-secondary-foreground/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Sous-total</p>
                  <p className="text-xl font-semibold text-foreground">
                    {(item.prix * item.quantite).toFixed(2)}€
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-card border border-border rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Résumé de la commande</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Sous-total</span>
                  <span className="font-medium">{cart.montantTotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Livraison</span>
                  <span className="font-medium text-green-600">Gratuite</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-foreground">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-semibold text-primary">
                      {cart.montantTotal.toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('checkout')}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold shadow-lg"
              >
                Passer commande
              </button>

              <button
                onClick={() => navigate('shop')}
                className="w-full mt-3 px-6 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                Continuer mes achats
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-border space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Livraison gratuite</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Retour sous 14 jours</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
