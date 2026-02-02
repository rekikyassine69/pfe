import { ShoppingCart, Star, TrendingUp, Package, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function ShopPage() {
  const products = [
    {
      id: 1,
      name: 'Smart Pot Pro',
      description: 'Pot intelligent avec capteurs intégrés et arrosage automatique',
      price: 89.99,
      rating: 4.8,
      reviews: 234,
      stock: 15,
      category: 'Pots connectés',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400',
      features: ['Capteur d\'humidité', 'Arrosage auto', 'Application mobile'],
      bestseller: true,
    },
    {
      id: 2,
      name: 'Capteur Humidité v2',
      description: 'Capteur de haute précision pour mesurer l\'humidité du sol',
      price: 24.99,
      rating: 4.6,
      reviews: 156,
      stock: 42,
      category: 'Capteurs',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
      features: ['Précision ±2%', 'Bluetooth 5.0', 'Batterie 6 mois'],
      bestseller: false,
    },
    {
      id: 3,
      name: 'Station Météo IoT',
      description: 'Station complète pour surveiller les conditions environnementales',
      price: 149.99,
      rating: 4.9,
      reviews: 89,
      stock: 8,
      category: 'Stations',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
      features: ['Temp, humidité, lumière', 'Analyse IA', 'Alertes intelligentes'],
      bestseller: true,
    },
    {
      id: 4,
      name: 'Kit Démarrage IoT',
      description: 'Tout le nécessaire pour débuter en agriculture connectée',
      price: 199.99,
      rating: 4.7,
      reviews: 312,
      stock: 23,
      category: 'Kits',
      image: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400',
      features: ['3 pots smart', '6 capteurs', 'Guide complet'],
      bestseller: true,
    },
    {
      id: 5,
      name: 'Lampe LED Croissance',
      description: 'Lampe LED optimisée pour la croissance des plantes',
      price: 69.99,
      rating: 4.5,
      reviews: 178,
      stock: 31,
      category: 'Éclairage',
      image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400',
      features: ['Spectre complet', 'Timer intégré', 'Contrôle app'],
      bestseller: false,
    },
    {
      id: 6,
      name: 'Système Arrosage Auto',
      description: 'Système d\'arrosage intelligent programmable',
      price: 129.99,
      rating: 4.8,
      reviews: 201,
      stock: 19,
      category: 'Arrosage',
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400',
      features: ['Programmation app', '8 sorties', 'Capteur pluie'],
      bestseller: false,
    },
  ];

  const categories = [
    { name: 'Tous', count: 24, active: true },
    { name: 'Pots connectés', count: 8, active: false },
    { name: 'Capteurs', count: 12, active: false },
    { name: 'Kits', count: 4, active: false },
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
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg">
          <ShoppingCart className="w-5 h-5" />
          <span>Panier (0)</span>
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
              {product.stock < 20 && (
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
                  <p className="text-xs text-muted-foreground">
                    {product.stock} en stock
                  </p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    toast.success('Produit ajouté au panier!', {
                      description: `${product.name} - ${product.price}€`,
                    });
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center gap-2 shadow-lg"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Ajouter</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}