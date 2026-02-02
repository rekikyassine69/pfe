import { Flower2, Wifi, Brain, BookOpen, Gamepad2, ShoppingCart, ArrowRight, CheckCircle2, Zap, Shield, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: Wifi,
      title: 'Pots Connectés IoT',
      description: 'Surveillez vos plantes en temps réel avec nos capteurs intelligents',
    },
    {
      icon: Brain,
      title: 'Reconnaissance IA',
      description: 'Identifiez vos plantes et détectez les maladies grâce à l\'IA',
    },
    {
      icon: BookOpen,
      title: 'Cours en Ligne',
      description: 'Apprenez l\'agriculture intelligente avec nos experts',
    },
    {
      icon: Gamepad2,
      title: 'Jeux Éducatifs',
      description: 'Apprenez en s\'amusant avec nos mini-jeux interactifs',
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Économisez l\'eau',
      description: 'Jusqu\'à 40% d\'économie d\'eau grâce à l\'arrosage intelligent',
    },
    {
      icon: CheckCircle2,
      title: 'Plantes en Santé',
      description: 'Surveillance 24/7 pour des plantes toujours en parfaite santé',
    },
    {
      icon: Shield,
      title: 'Sécurisé & Fiable',
      description: 'Plateforme sécurisée avec protection des données',
    },
    {
      icon: Users,
      title: 'Communauté Active',
      description: 'Rejoignez 2847+ passionnés de plantes et d\'IoT',
    },
  ];

  const products = [
    {
      name: 'Smart Pot Basic',
      price: '49.99€',
      features: ['Capteur d\'humidité', 'Notifications mobile', 'Données en temps réel'],
    },
    {
      name: 'Smart Pot Pro',
      price: '89.99€',
      features: ['Tous les capteurs', 'Arrosage automatique', 'Reconnaissance IA', 'Cours inclus'],
      popular: true,
    },
    {
      name: 'Kit Démarrage IoT',
      price: '199.99€',
      features: ['3 Smart Pots Pro', 'Station météo', 'Formation complète', 'Support prioritaire'],
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                Cultivez l'avenir avec l'
                <span className="text-primary">IoT</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Smart Plant Care Platform : La plateforme éducative qui révolutionne 
                la culture des plantes avec l'intelligence artificielle et l'Internet des objets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Commencer Gratuitement
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('plant-care')}
                  className="px-8 py-4 bg-card text-foreground border-2 border-border rounded-lg font-medium text-lg hover:bg-secondary transition-colors"
                >
                  En Savoir Plus
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1744230673231-865d54a0aba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHBsYW50JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjkyNzQwODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Smart Plant Technology"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              Fonctionnalités Principales
            </h2>
            <p className="text-xl text-muted-foreground">
              Tout ce dont vous avez besoin pour cultiver intelligemment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              Pourquoi Nous Choisir ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Des avantages concrets pour vos plantes et votre apprentissage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 text-center"
                >
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              Nos Produits
            </h2>
            <p className="text-xl text-muted-foreground">
              Choisissez le kit qui vous convient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-card border-2 rounded-xl p-8 relative ${
                  product.popular
                    ? 'border-primary shadow-xl scale-105'
                    : 'border-border'
                }`}
              >
                {product.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    Plus Populaire
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {product.name}
                  </h3>
                  <div className="text-4xl font-bold text-primary mb-4">
                    {product.price}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onNavigate('signup')}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    product.popular
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  Commencer
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Prêt à commencer votre voyage IoT ?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Rejoignez notre communauté de passionnés et transformez votre façon de cultiver
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('signup')}
                className="px-8 py-4 bg-background text-foreground rounded-lg font-medium text-lg hover:opacity-90 transition-opacity"
              >
                Créer un Compte Gratuit
              </button>
              <button
                onClick={() => onNavigate('games-demo')}
                className="px-8 py-4 bg-primary-foreground/10 text-primary-foreground border-2 border-primary-foreground/20 rounded-lg font-medium text-lg hover:bg-primary-foreground/20 transition-colors"
              >
                Essayer les Jeux
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
