import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

export function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@smartplantcare.com',
      description: 'Réponse sous 24h',
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+33 1 23 45 67 89',
      description: 'Lun-Ven 9h-18h',
    },
    {
      icon: MapPin,
      title: 'Adresse',
      value: 'Université de Paris',
      description: 'Campus IoT, Bâtiment A',
    },
  ];

  const faqs = [
    {
      question: 'Comment configurer mon premier pot connecté ?',
      answer: 'Connectez le pot via Bluetooth, suivez les instructions dans l\'application et calibrez les capteurs.',
    },
    {
      question: 'Les capteurs sont-ils compatibles avec toutes les plantes ?',
      answer: 'Oui, nos capteurs s\'adaptent à tous types de plantes grâce à des profils personnalisables.',
    },
    {
      question: 'Puis-je utiliser le système sans connexion internet ?',
      answer: 'Le système fonctionne localement mais nécessite une connexion pour les mises à jour et l\'IA.',
    },
  ];

  const recentTickets = [
    {
      id: '001',
      subject: 'Problème de connexion capteur',
      status: 'Résolu',
      date: 'Il y a 2j',
      priority: 'Normale',
    },
    {
      id: '002',
      subject: 'Question sur l\'arrosage automatique',
      status: 'En cours',
      date: 'Il y a 1j',
      priority: 'Normale',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Contact & Support</h1>
        <p className="text-muted-foreground mt-1">
          Nous sommes là pour vous aider
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <div key={index} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{method.title}</h3>
              <p className="text-foreground font-medium mb-1">{method.value}</p>
              <p className="text-sm text-muted-foreground">{method.description}</p>
            </div>
          );
        })}
      </div>

      {/* Contact Form & Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Envoyer une réclamation</h2>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nom complet</label>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  placeholder="vous@exemple.com"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sujet</label>
              <input
                type="text"
                placeholder="De quoi s'agit-il ?"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Catégorie</label>
              <select className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Problème technique</option>
                <option>Question générale</option>
                <option>Réclamation produit</option>
                <option>Suggestion</option>
                <option>Autre</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Message</label>
              <textarea
                rows={6}
                placeholder="Décrivez votre demande en détail..."
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Pièces jointes (optionnel)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <p className="text-sm text-muted-foreground">
                  Cliquez ou glissez des fichiers ici
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, PDF jusqu'à 5MB
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <Send className="w-5 h-5" />
              <span>Envoyer le message</span>
            </button>
          </form>
        </div>

        {/* Recent Tickets */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Tickets récents</h3>
            </div>
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">#{ticket.id}</p>
                      <p className="text-sm text-foreground mt-1">{ticket.subject}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'Résolu'
                          ? 'bg-chart-1/20 text-chart-1'
                          : 'bg-yellow-500/20 text-yellow-600'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{ticket.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-2">Temps de réponse moyen</h3>
            <p className="text-3xl font-bold mb-4">2-4 heures</p>
            <p className="text-sm text-white/80">
              Notre équipe s'efforce de vous répondre dans les plus brefs délais
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Questions fréquentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group">
              <summary className="flex items-center justify-between cursor-pointer p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                <span className="font-medium text-foreground">{faq.question}</span>
                <CheckCircle2 className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 mt-2 bg-muted rounded-lg">
                <p className="text-sm text-foreground">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
