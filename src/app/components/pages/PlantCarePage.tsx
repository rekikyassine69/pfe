import { Droplets, Sun, Wind, ThermometerSun, Sprout, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export function PlantCarePage() {
  const careGuides = [
    {
      icon: Droplets,
      title: 'Arrosage',
      description: 'L\'arrosage est crucial pour la santé de vos plantes',
      tips: [
        'Vérifiez l\'humidité du sol avant d\'arroser',
        'Arrosez tôt le matin ou en fin de journée',
        'Évitez de mouiller les feuilles',
        'Adaptez la fréquence selon la saison',
      ],
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Sun,
      title: 'Lumière',
      description: 'Chaque plante a ses besoins en lumière',
      tips: [
        'Identifiez les besoins de votre plante',
        'Évitez la lumière directe pour les plantes sensibles',
        'Tournez régulièrement vos pots',
        'Utilisez des lampes LED si nécessaire',
      ],
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: ThermometerSun,
      title: 'Température',
      description: 'Maintenez une température optimale',
      tips: [
        'Température idéale: 18-24°C pour la plupart des plantes',
        'Évitez les courants d\'air froid',
        'Protégez du gel en hiver',
        'Ventilez en été pour éviter la surchauffe',
      ],
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Wind,
      title: 'Humidité de l\'air',
      description: 'L\'humidité ambiante est importante',
      tips: [
        'Brumisez régulièrement les plantes tropicales',
        'Groupez vos plantes ensemble',
        'Utilisez un humidificateur si nécessaire',
        'Placez des bacs d\'eau à proximité',
      ],
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
  ];

  const commonPlants = [
    {
      name: 'Monstera Deliciosa',
      difficulty: 'Facile',
      water: 'Modéré',
      light: 'Indirecte',
      tips: 'Arrosez quand le sol est sec sur 5cm',
    },
    {
      name: 'Ficus Lyrata',
      difficulty: 'Intermédiaire',
      water: 'Modéré',
      light: 'Lumineuse',
      tips: 'Évitez les déplacements fréquents',
    },
    {
      name: 'Pothos',
      difficulty: 'Facile',
      water: 'Faible',
      light: 'Faible à moyenne',
      tips: 'Parfait pour les débutants',
    },
    {
      name: 'Sansevieria',
      difficulty: 'Très facile',
      water: 'Très faible',
      light: 'Faible à forte',
      tips: 'Résiste à la négligence',
    },
  ];

  const problems = [
    {
      symptom: 'Feuilles jaunes',
      causes: ['Sur-arrosage', 'Manque de nutriments', 'Drainage insuffisant'],
      solution: 'Vérifiez l\'humidité du sol et ajustez l\'arrosage',
    },
    {
      symptom: 'Feuilles brunes',
      causes: ['Sous-arrosage', 'Air trop sec', 'Brûlure du soleil'],
      solution: 'Augmentez l\'humidité et éloignez de la lumière directe',
    },
    {
      symptom: 'Croissance lente',
      causes: ['Manque de lumière', 'Pot trop petit', 'Manque de nutriments'],
      solution: 'Déplacez vers un endroit plus lumineux ou rempotez',
    },
  ];

  const calendar = [
    { month: 'Printemps', tasks: ['Rempotage', 'Fertilisation', 'Taille légère'] },
    { month: 'Été', tasks: ['Arrosage fréquent', 'Fertilisation régulière', 'Surveillance parasites'] },
    { month: 'Automne', tasks: ['Réduire arrosage', 'Dernier rempotage', 'Préparation hivernale'] },
    { month: 'Hiver', tasks: ['Arrosage minimal', 'Repos végétatif', 'Protection du froid'] },
  ];

  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Guide des Soins des Plantes
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Tout ce que vous devez savoir pour cultiver des plantes saines et heureuses
        </p>
      </motion.div>

      {/* Care Guides */}
      <section>
        <h2 className="text-3xl font-bold text-foreground mb-8">Principes de Base</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {careGuides.map((guide, index) => {
            const Icon = guide.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className={`w-12 h-12 ${guide.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${guide.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {guide.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {guide.description}
                </p>
                <ul className="space-y-2">
                  {guide.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Common Plants */}
      <section className="bg-secondary/30 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">Plantes Populaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {commonPlants.map((plant, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="mb-4">
                <Sprout className="w-10 h-10 text-primary mb-2" />
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {plant.name}
                </h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  plant.difficulty === 'Très facile' || plant.difficulty === 'Facile'
                    ? 'bg-green-500/20 text-green-600'
                    : 'bg-yellow-500/20 text-yellow-600'
                }`}>
                  {plant.difficulty}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Arrosage:</span>
                  <span className="text-foreground font-medium">{plant.water}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lumière:</span>
                  <span className="text-foreground font-medium">{plant.light}</span>
                </div>
                <p className="text-muted-foreground italic pt-2 border-t border-border">
                  {plant.tips}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Problems & Solutions */}
      <section>
        <h2 className="text-3xl font-bold text-foreground mb-8">Problèmes Courants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {problem.symptom}
                  </h3>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Causes possibles:</p>
                <ul className="space-y-1">
                  {problem.causes.map((cause, idx) => (
                    <li key={idx} className="text-sm text-foreground ml-4">
                      • {cause}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-primary mb-1">Solution:</p>
                <p className="text-sm text-foreground">{problem.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Seasonal Calendar */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary to-muted rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Calendrier Saisonnier
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {calendar.map((season, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {season.month}
                </h3>
              </div>
              <ul className="space-y-2">
                {season.tasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{task}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary rounded-2xl p-8 text-center"
      >
        <h3 className="text-2xl font-bold text-primary-foreground mb-4">
          Envie d'aller plus loin ?
        </h3>
        <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
          Créez un compte pour accéder à nos pots connectés IoT et surveiller vos plantes en temps réel avec nos capteurs intelligents
        </p>
      </motion.div>
    </div>
  );
}
