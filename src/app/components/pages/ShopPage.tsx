import { useEffect, useState } from 'react';
import { ShoppingCart, Star, TrendingUp, Package, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { useCollection } from '@/app/hooks/useCollection';
import { useCart } from '@/app/hooks/useCart';

export function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const { data: produits } = useCollection<any>('produits');
  const { addToCart, itemCount } = useCart();
  const [addingProduct, setAddingProduct] = useState<string | null>(null);

  const navigate = (page: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
  };

  useEffect(() => {
    const defaultImages = [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
      'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400',
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400',
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400',
    ];

    const mapped = produits.map((product, index) => {
      const features = [] as string[];
      if (product.specifications?.capteurs && Array.isArray(product.specifications.capteurs)) {
        features.push(...product.specifications.capteurs.map((capteur: string) => `Capteur ${capteur}`));
      }
      if (product.specifications?.connectivite) {
        features.push(product.specifications.connectivite);
      }
      
      return {
        id: product._id || product.idProduit,
        name: product.nom,
        description: product.description,
        price: product.prix,
        rating: product.note || 4.5,
        reviews: 0,
        stock: product.quantiteStock ?? product.stock ?? 0,
        statut: product.statut || 'disponible',
        category: product.categorie?.replace('_', ' ') || 'Produits',
        image: product.imageUrl ? product.imageUrl : defaultImages[index % defaultImages.length],
        features: features.length ? features : ['Accessoire IoT', 'Compatible mobile'],
        bestseller: product.estBestseller === true,
        marque: product.marque,
      };
    });

    if (mapped.length) setProducts(mapped);
  }, [produits]);

  const categories = [
    { name: 'Tous', count: products.length, active: true },
    { name: 'Pots connectés', count: products.filter((p) => p.category.includes('pots')).length, active: false },
    { name: 'Capteurs', count: products.filter((p) => p.category.includes('capteur')).length, active: false },
    { name: 'Kits', count: products.filter((p) => p.category.includes('kit')).length, active: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Boutique</h1>
          <p className="text-muted-foreground mt-1">
            Équipez-vous pour votre jardin intelligent
          </p>
        </div>
        <button 
          onClick={() => navigate('cart')}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg relative"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Panier ({itemCount})</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-accent text-white text-xs rounded-full flex items-center justify-center font-semibold">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Featured Banner */}
      <div className="bg-gradient-to-r from-primary via-accent to-primary/80 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                Offre limitée
              </span>
            </div>
            <h2 className="text-3xl font-semibold">Pack Étudiant -30%</h2>
            <p className="text-white/90 max-w-xl">
              Profitez de notre offre spéciale étudiants sur tous les kits de démarrage
            </p>
            <button className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors">
              Voir l'offre
            </button>
          </div>
          <div className="hidden lg:block">
            <Package className="w-32 h-32 text-white/30" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtrer:</span>
        </div>
        {categories.map((category, index) => (
          <button
            key={index}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category.active
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:bg-secondary'
            }`}
          >
            {category.name} {category.count > 0 && `(${category.count})`}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ y: -8 }}
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all group"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {product.bestseller && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="absolute top-3 left-3"
                >
                  <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3 fill-white" />
                    Best-seller
                  </span>
                </motion.div>
              )}
              {product.stock === 0 || product.statut === 'rupture' ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="absolute top-3 right-3"
                >
                  <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium shadow-lg">
                    Rupture de stock
                  </span>
                </motion.div>
              ) : product.stock < 20 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="absolute top-3 right-3"
                >
                  <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-medium shadow-lg">
                    Stock limité
                  </span>
                </motion.div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-2">
                <span className="text-xs text-muted-foreground">{product.category}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.features.slice(0, 2).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-secondary rounded-md text-xs text-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} avis)
                </span>
              </div>

              {/* Price & Add to Cart */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {product.price}€
                  </p>
                  <p className={`text-xs ${product.stock === 0 || product.statut === 'rupture' ? 'text-red-500 font-semibold' : 'text-muted-foreground'}`}>
                    {product.stock === 0 || product.statut === 'rupture' ? 'Rupture' : `${product.stock} en stock`}
                  </p>
                </div>
                <motion.button 
                  whileHover={product.stock > 0 && product.statut !== 'rupture' ? { scale: 1.05 } : {}}
                  whileTap={product.stock > 0 && product.statut !== 'rupture' ? { scale: 0.95 } : {}}
                  onClick={async () => {
                    if (product.stock > 0 && product.statut !== 'rupture') {
                      setAddingProduct(product.id);
                      try {
                        await addToCart(product.id, 1);
                      } finally {
                        setAddingProduct(null);
                      }
                    }
                  }}
                  disabled={product.stock === 0 || product.statut === 'rupture' || addingProduct === product.id}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg transition-opacity ${
                    product.stock === 0 || product.statut === 'rupture'
                      ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                      : 'bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{addingProduct === product.id ? 'Ajout...' : product.stock === 0 || product.statut === 'rupture' ? 'Rupture' : 'Ajouter'}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}