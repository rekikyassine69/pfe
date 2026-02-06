# 📋 RAPPORT COMPLET DU PROJET - SMART PLANT CARE PLATFORM

**Date:** 6 Février 2026  
**Type de Projet:** Plateforme Éducative IoT pour Soin des Plantes  
**Technologies:** React + TypeScript, Node.js + Express, MongoDB

---

## 📖 TABLE DES MATIÈRES

1. [Vue d'Ensemble du Projet](#vue-densemble-du-projet)
2. [Architecture Technique](#architecture-technique)
3. [Base de Données](#base-de-données)
4. [Backend - API Routes](#backend---api-routes)
5. [Frontend - Pages et Fonctionnalités](#frontend---pages-et-fonctionnalités)
6. [Fonctionnalités Principales](#fonctionnalités-principales)
7. [Système d'Authentification](#système-dauthentification)
8. [Intégration IoT](#intégration-iot)
9. [Intelligence Artificielle](#intelligence-artificielle)

---

## 🎯 VUE D'ENSEMBLE DU PROJET

### Description
**Smart Plant Care Platform** est une plateforme éducative complète qui combine l'Internet des Objets (IoT), l'Intelligence Artificielle, et des fonctionnalités e-learning pour révolutionner la culture des plantes. La plateforme s'adresse aux étudiants, jardiniers amateurs et professionnels souhaitant maîtriser l'agriculture intelligente.

### Objectifs Principaux
- 🌱 **Surveillance en temps réel** des plantes via des pots connectés IoT
- 🤖 **Reconnaissance intelligente** des plantes et détection de maladies par IA
- 📚 **Formation en ligne** avec cours structurés sur l'agriculture intelligente
- 🎮 **Gamification** pour apprentissage ludique
- 🛒 **E-commerce** de matériel IoT et équipements

### Utilisateurs Cibles
- **Étudiants** en agriculture, IoT, ou sciences environnementales
- **Jardiniers amateurs** souhaitant moderniser leurs pratiques
- **Professionnels** désirant adopter des solutions IoT
- **Administrateurs** pour gérer la plateforme

---

## 🏗️ ARCHITECTURE TECHNIQUE

### Stack Technologique

#### **Frontend**
- **Framework:** React 18 avec TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + PostCSS
- **Animations:** Motion (Framer Motion)
- **Charts:** Recharts
- **Notifications:** Sonner (Toast)
- **Icons:** Lucide React

#### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de données:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Email Service:** Nodemailer

#### **Infrastructure**
- **Containerisation:** Docker + Docker Compose
- **API REST:** Express Router
- **Port Frontend:** 5173 (dev)
- **Port Backend:** 4000 (prod)
- **Database:** MongoDB sur port 27017

### Structure du Projet

```
pfe/
├── server/                      # Backend Node.js/Express
│   ├── index.js                 # Point d'entrée serveur
│   ├── models/                  # Schémas MongoDB
│   │   ├── User.js
│   │   ├── PlantInfo.js
│   │   ├── PotConnecte.js
│   │   ├── Cours.js
│   │   └── ...
│   ├── routes/                  # API Endpoints
│   │   ├── auth.js              # Authentification
│   │   ├── plants.js            # Gestion plantes
│   │   ├── recognition.js       # Reconnaissance IA
│   │   └── collections.js       # CRUD générique
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   └── utils/
│       └── email.js             # Service email
│
├── src/                         # Frontend React
│   ├── app/
│   │   ├── App.tsx              # Application principale
│   │   ├── components/
│   │   │   ├── pages/           # Pages de l'application
│   │   │   ├── modals/          # Modales réutilisables
│   │   │   └── ui/              # Composants UI
│   │   ├── services/
│   │   │   └── api.ts           # Service API client
│   │   └── hooks/
│   │       └── useCollection.ts # Hook MongoDB
│   └── main.tsx
│
├── data/json/                   # Données JSON d'import
├── public/                      # Fichiers statiques
├── docker-compose.yml           # Configuration Docker
└── package.json
```

---

## 💾 BASE DE DONNÉES

### MongoDB Collections (25 collections)

#### **1. GESTION DES UTILISATEURS**

##### **clients** (3 documents)
Stocke les informations des utilisateurs clients
```javascript
{
  _id: ObjectId,
  nom: String,              // Nom de famille
  prenom: String,           // Prénom
  email: String (unique),   // Email (login)
  motDePasse: String,       // Mot de passe hashé (bcrypt)
  telephone: String,
  dateInscription: Date,
  statut: 'actif' | 'inactif'
}
```

##### **administrateurs** (1 document)
Comptes administrateurs avec privilèges élevés
```javascript
{
  _id: ObjectId,
  nom: String,
  prenom: String,
  email: String (unique),
  motDePasse: String,
  role: 'admin',
  dateInscription: Date
}
```

##### **sessions** 
Gestion des sessions JWT
```javascript
{
  _id: ObjectId,
  userId: ObjectId,         // → clients ou administrateurs
  userType: 'client' | 'admin',
  token: String,            // JWT token
  createdAt: Date,
  expiresAt: Date
}
```

---

#### **2. SYSTÈME IoT - POTS CONNECTÉS**

##### **potsConnectes** (3 documents)
Pots intelligents avec capteurs
```javascript
{
  _id: ObjectId,
  nomPot: String,           // Ex: "Pot de Basilic"
  typePlante: String,       // Ex: "Basilic"
  clientId: ObjectId,       // → clients
  dateInstallation: Date,
  etatArrosage: 'actif' | 'inactif',
  dernierArrosage: Date,
  seuilHumidite: Number,    // Seuil d'arrosage (%)
  frequenceArrosage: Number, // Heures entre arrosages
  localisation: String,     // Ex: "Salon"
  statut: 'en ligne' | 'hors ligne' | 'maintenance'
}
```

##### **historiqueMesures** (5 documents)
Mesures des capteurs en temps réel
```javascript
{
  _id: ObjectId,
  potId: ObjectId,          // → potsConnectes
  temperature: Number,      // °C
  humidite: Number,        // % d'humidité du sol
  luminosite: Number,      // Lux (lumière)
  niveauEau: Number,       // % niveau réservoir
  dateMesure: Date         // Timestamp de la mesure
}
```

##### **historiqueArrosage** (3 documents)
Historique d'arrosage
```javascript
{
  _id: ObjectId,
  potId: ObjectId,
  dateArrosage: Date,
  quantiteEau: Number,      // ml d'eau distribués
  modeArrosage: 'automatique' | 'manuel',
  declenchePar: String,     // User ID ou "système"
  duree: Number             // Secondes
}
```

##### **alertes** (1 document)
Alertes système (humidité basse, etc.)
```javascript
{
  _id: ObjectId,
  potId: ObjectId,
  clientId: ObjectId,
  type: 'critique' | 'avertissement' | 'info',
  message: String,
  dateCreation: Date,
  statut: 'non lue' | 'lue' | 'résolue',
  severite: 'haute' | 'moyenne' | 'basse'
}
```

##### **alarmes** (4 documents)
Configuration des alarmes
```javascript
{
  _id: ObjectId,
  potId: ObjectId,
  type: String,             // Ex: "humidite_basse"
  seuil: Number,
  actif: Boolean
}
```

---

#### **3. SYSTÈME D'APPRENTISSAGE (LMS)**

##### **cours** (3 documents)
Cours en ligne sur l'agriculture intelligente
```javascript
{
  _id: ObjectId,
  titre: String,
  description: String,
  categorie: String,        // Ex: "IoT", "Hydroponie"
  niveau: 'débutant' | 'intermédiaire' | 'avancé',
  duree: Number,           // Minutes
  nombreLecons: Number,
  note: Number,            // Note moyenne (0-5)
  nombreEtudiants: Number,
  imageUrl: String,
  contenu: String,         // Contenu du cours
  chapitres: Array,        // Liste des chapitres
  dateCreation: Date,
  statut: 'publié' | 'brouillon' | 'archivé'
}
```

##### **progressionCours** (5 documents)
Suivi de progression des étudiants
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,       // → clients
  coursId: ObjectId,        // → cours
  progression: Number,      // 0-100%
  dateDebut: Date,
  dateDernierAcces: Date,
  dateCompletion: Date,
  statut: 'en cours' | 'terminé' | 'abandonné',
  tempsEcoule: Number,      // Minutes passées
  lectionsCompletees: [String]
}
```

##### **examens** (1 document)
Examens des cours
```javascript
{
  _id: ObjectId,
  coursId: ObjectId,
  questions: Array,         // Questions de l'examen
  duree: Number,           // Minutes
  notePassage: Number      // Score minimum (%)
}
```

##### **tentativesExamen** (2 documents)
Historique des tentatives d'examen
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  examenId: ObjectId,
  dateExamen: Date,
  score: Number,           // Score obtenu
  reponses: Array,
  reussi: Boolean
}
```

---

#### **4. GAMIFICATION**

##### **jeux** (4 documents)
Mini-jeux éducatifs
```javascript
{
  _id: ObjectId,
  nomJeu: String,          // Ex: "Sensor Challenge"
  description: String,
  categorie: String,
  difficulte: 'facile' | 'moyen' | 'difficile',
  points: Number,          // Points attribués
  tempsLimite: Number      // Secondes
}
```

##### **scores** (6 documents)
Scores des joueurs
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  jeuId: ObjectId,
  valeur: Number,          // Score obtenu
  dateScore: Date,
  classement: Number       // Position au classement
}
```

---

#### **5. E-COMMERCE**

##### **produits** (6 documents)
Catalogue de produits IoT
```javascript
{
  _id: ObjectId,
  nom: String,
  description: String,
  prix: Number,            // Prix en €
  categorie: 'pots_connectes' | 'capteurs' | 'accessoires',
  quantiteStock: Number,
  images: [String],        // URLs des images
  specifications: {
    capteurs: [String],    // Liste des capteurs
    connectivite: String,  // Ex: "WiFi, Bluetooth"
    batterie: String
  },
  note: Number,           // 0-5
  nombreAvis: Number
}
```

##### **commandes** (2 documents)
Commandes des clients
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  dateCommande: Date,
  statut: 'en_attente' | 'en_cours' | 'livree' | 'annulee',
  lignesCommande: [{
    produitId: ObjectId,
    quantity: Number,
    prixUnitaire: Number
  }],
  total: Number,
  adresseLivraisonId: ObjectId,
  modePaiement: String
}
```

##### **paniers**
Paniers d'achat temporaires
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  produits: [{
    produitId: ObjectId,
    quantite: Number
  }],
  dateCreation: Date,
  dateMaj: Date
}
```

##### **paiements**
Historique des paiements
```javascript
{
  _id: ObjectId,
  commandeId: ObjectId,
  montant: Number,
  methode: 'carte' | 'paypal' | 'virement',
  statut: 'en_attente' | 'reussi' | 'echoue',
  datePaiement: Date
}
```

##### **adressesLivraison**
Adresses de livraison des clients
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  rue: String,
  ville: String,
  codePostal: String,
  pays: String,
  telephone: String
}
```

---

#### **6. RECONNAISSANCE IA**

##### **identificationsPlantes**
Résultats de reconnaissance de plantes
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  imageUrl: String,
  planteName: String,
  scientificName: String,
  confidence: Number,       // 0-100%
  health: String,          // "healthy", "diseased"
  recommendations: [String],
  diseases: [String],
  dateRecognition: Date
}
```

##### **PlantInfo** (10 plantes pré-chargées)
Base de données d'informations de soins des plantes
```javascript
{
  _id: ObjectId,
  commonNames: [String],    // Ex: ["Tomate", "Tomato"]
  scientificName: String,   // Ex: "Solanum lycopersicum"
  description: String,
  difficulty: String,       // "Facile", "Intermédiaire", "Difficile"
  toxicity: String,        // "Non-toxique", "Toxique"
  origin: String,
  bloomingSeason: String,
  careRequirements: {
    humidity: {
      min: Number,         // % minimum
      max: Number,         // % maximum
      ideal: Number        // % idéal
    },
    luminosity: {
      min: Number,         // Lux minimum
      max: Number,         // Lux maximum
      ideal: Number,       // Lux idéal
      description: String
    },
    watering: {
      frequency: String,   // "Tous les 2-3 jours"
      minIntervalDays: Number,
      maxIntervalDays: Number,
      description: String
    },
    temperature: {
      min: Number,         // °C minimum
      max: Number,         // °C maximum
      ideal: Number        // °C idéal
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Plantes Pré-chargées:**
1. 🍅 Tomate
2. 🌿 Basilic
3. 🥒 Concombre
4. 🌶️ Poivron
5. 🥬 Laitue
6. 🍓 Fraise
7. 🥕 Carotte
8. 🌱 Menthe
9. 🌿 Persil
10. 🌻 Tournesol

---

#### **7. AUTRES COLLECTIONS**

##### **notifications**
Notifications utilisateur
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  titre: String,
  message: String,
  type: 'info' | 'alerte' | 'succes',
  lue: Boolean,
  dateCreation: Date
}
```

##### **reclamations**
Réclamations et support
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  sujet: String,
  description: String,
  statut: 'ouverte' | 'en_cours' | 'resolue' | 'fermee',
  dateCreation: Date,
  dateResolution: Date
}
```

##### **feedbacks**
Avis et commentaires
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  type: 'cours' | 'produit' | 'plateforme',
  referenceId: ObjectId,
  note: Number,            // 1-5
  commentaire: String,
  dateCreation: Date
}
```

##### **recommandations**
Recommandations personnalisées IA
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  typePlante: String,
  recommandation: String,
  dateCreation: Date
}
```

##### **etapesDevPlante**
Suivi du développement des plantes
```javascript
{
  _id: ObjectId,
  potId: ObjectId,
  etape: String,           // "Germination", "Croissance", etc.
  dateEtape: Date,
  description: String,
  photos: [String]
}
```

---

## 🔌 BACKEND - API ROUTES

### Base URL
- **Development:** `http://localhost:4000/api`
- **Production:** Configuré via Docker

### 1. AUTHENTICATION ROUTES (`/api/auth`)

#### **POST /api/auth/login**
Connexion utilisateur (client ou admin)
```javascript
// Request Body
{
  email: string,
  password: string,
  userType?: 'client' | 'admin'  // Optionnel
}

// Response (200 OK)
{
  token: string,              // JWT token
  user: {
    id: string,
    email: string,
    nom: string,
    role: 'client' | 'admin'
  }
}

// Response (401 Unauthorized)
{
  message: "Invalid credentials"
}
```

**Fonctionnalité:**
- Vérifie les identifiants dans les collections `clients` ou `administrateurs`
- Compare le mot de passe avec bcrypt
- Génère un JWT token valable 2 heures
- Crée une session dans la collection `sessions`

---

#### **POST /api/auth/register**
Inscription nouveau client
```javascript
// Request Body
{
  nom: string,
  email: string,
  password: string
}

// Response (201 Created)
{
  message: "User created successfully",
  userId: string
}

// Response (400 Bad Request)
{
  message: "Email already exists"
}
```

**Fonctionnalité:**
- Crée un nouveau compte client
- Hash le mot de passe avec bcrypt
- Envoie un email de bienvenue (optionnel)
- Stocke dans la collection `clients`

---

#### **GET /api/auth/me**
Récupère les informations de l'utilisateur connecté
```javascript
// Headers
Authorization: Bearer <token>

// Response (200 OK)
{
  id: string,
  email: string,
  nom: string,
  role: 'client' | 'admin'
}
```

**Fonctionnalité:**
- Décode le JWT token
- Retourne les infos utilisateur
- Utilisé pour restaurer la session au chargement de l'app

---

#### **POST /api/auth/logout**
Déconnexion
```javascript
// Headers
Authorization: Bearer <token>

// Response (200 OK)
{
  message: "Logged out successfully"
}
```

**Fonctionnalité:**
- Supprime la session de la base de données
- Invalide le token côté serveur

---

#### **POST /api/auth/forgot-password**
Demande de réinitialisation de mot de passe
```javascript
// Request Body
{
  email: string
}

// Response (200 OK)
{
  message: "Password reset email sent"
}
```

**Fonctionnalité:**
- Génère un token de réinitialisation (valide 15 min)
- Envoie un email avec lien de réinitialisation
- Stocke le token hashé dans la base

---

#### **POST /api/auth/reset-password**
Réinitialisation du mot de passe
```javascript
// Request Body
{
  token: string,
  newPassword: string
}

// Response (200 OK)
{
  message: "Password reset successful"
}
```

**Fonctionnalité:**
- Vérifie le token de réinitialisation
- Hash le nouveau mot de passe
- Met à jour dans la base de données

---

### 2. PLANTS ROUTES (`/api/plants`)

#### **GET /api/plants**
Récupère toutes les plantes
```javascript
// Response (200 OK)
[
  {
    _id: string,
    name: string,
    species: string,
    lastWatered: Date,
    notes: string,
    createdAt: Date
  }
]
```

---

#### **POST /api/plants**
Crée une nouvelle plante
```javascript
// Request Body
{
  name: string,
  species: string,
  lastWatered: Date,
  notes?: string
}

// Response (201 Created)
{
  _id: string,
  name: string,
  species: string,
  ...
}
```

---

### 3. RECOGNITION ROUTES (`/api/recognition`)

#### **POST /api/recognition/plant**
Reconnaissance de plante par image
```javascript
// Request Body
{
  image: string,           // Base64 encoded image
  images?: string[],       // Multiple images (optionnel)
  organs?: string[]        // Parties de la plante (optionnel)
}

// Response (200 OK)
{
  plantName: string,
  scientificName: string,
  confidence: number,      // 0-100
  health: 'healthy' | 'diseased',
  recommendations: string[],
  diseases: string[],
  careLevel: string,
  careInfo: {
    humidity: { min, max, ideal, unit },
    luminosity: { min, max, ideal, description, unit },
    watering: { frequency, description },
    temperature: { min, max, ideal, unit }
  }
}
```

**Fonctionnalité:**
1. Reçoit l'image encodée en base64
2. Appelle l'API Plant.id pour reconnaissance
3. Recherche les informations de soins dans `PlantInfo`
4. Sauvegarde le résultat dans `identificationsPlantes`
5. Retourne les données complètes (nom, santé, conseils, soins)

---

#### **GET /api/recognition/recent**
Récupère les scans récents de l'utilisateur
```javascript
// Headers
Authorization: Bearer <token>

// Query Parameters
?limit=10

// Response (200 OK)
[
  {
    id: string,
    plantName: string,
    confidence: number,
    dateRecognition: Date,
    imageUrl: string,
    health: string
  }
]
```

---

#### **GET /api/recognition/plant-info/:plantName**
Récupère les infos de soins pour une plante
```javascript
// Response (200 OK)
{
  commonNames: string[],
  scientificName: string,
  description: string,
  difficulty: string,
  toxicity: string,
  careRequirements: { ... }
}

// Response (404 Not Found)
{
  message: "Plant information not found"
}
```

**Fonctionnalité:**
- Recherche dans `PlantInfo` par nom (insensible à la casse)
- Utilise regex pour correspondances partielles
- Retourne informations complètes de soins

---

### 4. COLLECTIONS ROUTES (`/api/collections/:collection`)

API CRUD générique pour toutes les collections MongoDB

#### **GET /api/collections/:collection**
Liste tous les documents d'une collection
```javascript
// Example: GET /api/collections/potsConnectes
// Headers
Authorization: Bearer <token>

// Response (200 OK)
[
  { _id, ... },
  { _id, ... }
]
```

---

#### **GET /api/collections/:collection/:id**
Récupère un document par ID
```javascript
// Example: GET /api/collections/cours/507f1f77bcf86cd799439011
// Response (200 OK)
{
  _id: "507f1f77bcf86cd799439011",
  titre: "...",
  ...
}
```

---

#### **POST /api/collections/:collection**
Crée un nouveau document
```javascript
// Request Body
{
  // Champs selon le schéma de la collection
}

// Response (201 Created)
{
  _id: string,
  ...
}
```

---

#### **PATCH /api/collections/:collection/:id**
Met à jour un document
```javascript
// Request Body
{
  // Champs à mettre à jour
}

// Response (200 OK)
{
  _id: string,
  // Document mis à jour
}
```

---

#### **DELETE /api/collections/:collection/:id**
Supprime un document
```javascript
// Response (200 OK)
{
  message: "Document deleted successfully"
}
```

---

### 5. ADMIN ROUTES (`/api/admin/collections/:collection`)

Identiques aux routes collections mais **réservées aux administrateurs**

**Middleware:** `requireAuth` + `requireRole(['admin'])`

---

### 6. HEALTH CHECK (`/api/health`)

#### **GET /api/health**
Vérifie l'état du serveur
```javascript
// Response (200 OK)
{
  status: "ok"
}
```

---

## 🎨 FRONTEND - PAGES ET FONCTIONNALITÉS

L'application dispose de **3 interfaces utilisateur distinctes:**
1. **Interface Publique** (Visiteurs non connectés)
2. **Interface Client** (Utilisateurs connectés)
3. **Interface Admin** (Administrateurs)

---

## 🌐 INTERFACE PUBLIQUE (Visiteurs)

### 1. PAGE D'ACCUEIL (`/` - LandingPage)

**Fonctionnalité:** Page d'atterrissage marketing et présentation

**Sections:**

#### **Hero Section**
- Titre principal avec animation
- Description de la plateforme
- CTA "Commencer Gratuitement" → Inscription
- CTA "Essayer la démo" → Démonstration

#### **Section Fonctionnalités**
Présente les 4 piliers de la plateforme:
- 🔌 **Pots Connectés IoT** - Surveillance temps réel
- 🧠 **Reconnaissance IA** - Identification plantes et maladies
- 📚 **Cours en Ligne** - Formation agriculture intelligente
- 🎮 **Jeux Éducatifs** - Apprentissage ludique

#### **Section Avantages**
- ⚡ Économie d'eau jusqu'à 40%
- ✅ Plantes en santé 24/7
- 🛡️ Plateforme sécurisée
- 👥 Communauté de 2847+ membres

#### **Tarifs & Produits**
Affiche 3 offres:
- **Smart Pot Basic** - 49.99€
  - Capteur d'humidité
  - Notifications mobile
  - Données temps réel

- **Smart Pot Pro** - 89.99€ (Populaire)
  - Tous les capteurs
  - Arrosage automatique
  - Reconnaissance IA
  - Cours inclus

- **Kit Démarrage IoT** - 199.99€
  - 3 Smart Pots Pro
  - Station météo
  - Formation complète
  - Support prioritaire

#### **Témoignages**
Avis clients avec notes 5⭐

#### **Call-to-Action Final**
"Prêt à commencer?" avec bouton inscription

**Navigation:**
- Connexion
- Inscription
- Voir les cours
- Essayer la démo
- Reconnaissance IA démo

---

### 2. PAGE CONNEXION (`/login` - LoginPage)

**Fonctionnalité:** Authentification utilisateur

**Formulaire:**
```
Email: _________________
Mot de passe: __________
[x] Se souvenir de moi

[ Se Connecter ]
```

**Options:**
- Lien "Mot de passe oublié?"
- Lien "Créer un compte" → Inscription
- Séparation Client / Admin automatique

**Comportement:**
- Valide les identifiants via `/api/auth/login`
- Stocke le JWT token dans `localStorage`
- Redirige vers Dashboard (client) ou Admin Dashboard
- Affiche toast de succès/erreur

---

### 3. PAGE INSCRIPTION (`/signup` - SignupPage)

**Fonctionnalité:** Création de compte client

**Formulaire:**
```
Nom complet: ___________
Email: _________________
Mot de passe: __________
Confirmer mdp: _________

[ ] J'accepte les conditions

[ S'Inscrire ]
```

**Validation:**
- Email valide
- Mot de passe ≥ 8 caractères
- Mots de passe correspondent
- Conditions acceptées

**Comportement:**
- Crée compte via `/api/auth/register`
- Connexion automatique
- Email de bienvenue (optionnel)
- Redirige vers Dashboard

---

### 4. MOT DE PASSE OUBLIÉ (`/forgot-password` - ForgotPasswordPage)

**Fonctionnalité:** Demande de réinitialisation

**Formulaire:**
```
Email: _________________

[ Envoyer le lien ]
```

**Comportement:**
- Envoie email avec token unique (valide 15 min)
- Affiche message de confirmation
- Lien de réinitialisation: `/reset-password?token=xxx`

---

### 5. RÉINITIALISATION MOT DE PASSE (`/reset-password` - ResetPasswordPage)

**Fonctionnalité:** Changement de mot de passe

**Formulaire:**
```
Nouveau mot de passe: __________
Confirmer: ____________________

[ Réinitialiser ]
```

**Comportement:**
- Vérifie validité du token
- Change le mot de passe
- Redirige vers connexion

---

### 6. APERÇU SOINS DES PLANTES (`/plant-care` - PlantCarePage)

**Fonctionnalité:** Démonstration publique du système de soins

**Affichage:**
- Exemples de plantes avec infos de soins
- Simulations de tableaux de bord IoT
- Graphiques de démonstration
- CTA vers inscription

---

### 7. DÉMO JEUX (`/games-demo` - GamesDemoPage)

**Fonctionnalité:** Présentation des jeux éducatifs

**Contenu:**
- Aperçu des jeux disponibles
- Captures d'écran
- Descriptions
- Scores de démonstration
- CTA "Créer un compte pour jouer"

---

### 8. APERÇU COURS (`/courses-preview` - CoursesPreviewPage)

**Fonctionnalité:** Catalogue des cours sans connexion

**Affichage:**
- Liste des cours avec:
  - Titre et description
  - Niveau (Débutant/Intermédiaire/Avancé)
  - Durée estimée
  - Nombre de leçons
  - Image de couverture
- Filtre par niveau
- CTA "S'inscrire pour accéder"

---

## 👤 INTERFACE CLIENT (Utilisateurs Connectés)

**Navigation:** Sidebar gauche avec menu

**Menu Principal:**
- 🏠 Tableau de bord
- 🪴 Mes Pots
- 📊 Surveillance
- 🤖 Reconnaissance IA
- 📚 Cours
- 🎮 Jeux
- 🛒 Boutique
- 📞 Contact
- ⚙️ Paramètres
- 🚪 Déconnexion

---

### 1. TABLEAU DE BORD (`/dashboard` - DashboardPage)

**Fonctionnalité:** Vue d'ensemble de l'activité utilisateur

#### **Cartes de Statistiques (4 cartes)**

**Pots Actifs**
- Icône: 🌺
- Nombre total de pots connectés
- Evolution: "+0 ce mois"

**Humidité Moyenne**
- Icône: 💧
- Moyenne d'humidité de tous les pots
- Status: "Optimal" si 40-70%

**Ensoleillement**
- Icône: ☀️
- Heures moyennes de lumière
- Calculé depuis capteurs luminosité

**Qualité de l'Air**
- Icône: 💨
- Status général: "Bonne"

#### **Graphique: Évolution Humidité**
- Type: Courbe (LineChart)
- Axe X: Heures (00h à 20h)
- Axe Y: Humidité (%)
- Données: 6 dernières mesures
- Couleur: Vert (#2E7D32)

#### **Graphique: État des Plantes**
- Type: Camembert (PieChart)
- Catégories:
  - 🟢 Excellente (>60% humidité)
  - 🟡 Bonne (40-60%)
  - 🟠 Attention (<40%)
- Affiche pourcentages

#### **Graphique: Activité Hebdomadaire**
- Type: Barres (BarChart)
- Axe X: Jours (Lun-Dim)
- Données:
  - Arrosages (bleu)
  - Nutriments (vert)
- Source: `historiqueArrosage`

#### **Alertes Récentes**
Liste des 3 dernières alertes:
- Icône selon type (⚠️ warning, ℹ️ info)
- Message d'alerte
- Pot concerné
- Temps relatif ("Il y a 2h")
- Boutons: "Ignorer" / "Voir"

**Données Sources:**
- `potsConnectes` - Informations pots
- `historiqueMesures` - Capteurs
- `historiqueArrosage` - Arrosages
- `alertes` - Notifications

---

### 2. MES POTS (`/pots` - PotsPage)

**Fonctionnalité:** Gestion et visualisation des pots connectés

#### **Statistiques Vue d'Ensemble**
4 cartes métriques:
- Total de pots
- Pots actifs (en ligne)
- Pots nécessitant attention
- Taux de santé global

#### **Grille de Pots**
Affichage en cartes (grid layout responsive)

**Chaque Carte de Pot:**
- 📷 Image de la plante
- 🏷️ Badge status:
  - 🟢 Sain (humidité > 35%)
  - 🟡 Attention (humidité 20-35%)
  - 🔴 Critique (humidité < 20%)
- Nom du pot
- Type de plante
- 💧 Humidité actuelle (%)
- 🌡️ Température (°C)
- 💡 Luminosité (heures)
- 🌫️ Qualité air
- ⏰ Dernier arrosage ("Il y a 2h")

**Actions:**
- Bouton ⚙️ "Paramètres" → Modal configuration pot
  - Modifier nom
  - Changer seuils d'alerte
  - Régler fréquence arrosage
  - Activer/désactiver arrosage auto
- Bouton 📊 "Détails" → Vue détaillée
- Bouton 📥 "Exporter" → Exporter données CSV

#### **Barre d'Actions Globale**
- 🔄 Rafraîchir données
- ➕ Ajouter un pot
- 📥 Exporter tout
- 🔍 Rechercher

**Modal Ajout de Pot:**
```
Nom du pot: ___________
Type de plante: _______
Localisation: _________
Seuil humidité: [  ] %
Fréquence arrosage: [  ] h

[ Annuler ]  [ Ajouter ]
```

**Données Sources:**
- `potsConnectes` - Pots de l'utilisateur
- `historiqueMesures` - Dernières mesures
- `historiqueArrosage` - Dernier arrosage

---

### 3. SURVEILLANCE (`/monitoring` - MonitoringPage)

**Fonctionnalité:** Monitoring temps réel avancé

#### **Header avec Filtres**
- Sélecteur de métrique:
  - 💧 Humidité (%)
  - 🌡️ Température (°C)
  - ☀️ Ensoleillement (h)
- Sélecteur de période:
  - 24h (par défaut)
  - 7 jours
  - 30 jours
- Boutons:
  - 📥 Exporter
  - 🔄 Actualiser

#### **Graphique Principal**
- Type: Aire (AreaChart) avec dégradé
- Multi-séries: Pot 1, Pot 2, Pot 3
- Axe X: Temps (heures)
- Axe Y: Valeur métrique
- Légende interactive
- Tooltip au survol
- Responsive

**Exemple Humidité:**
```
80% |                    /‾‾\
    |          /‾‾\    /      \
60% |    /‾‾\/      \/          \
    |  /                          \
40% |/                              \__
    |________________________________
      00h  04h  08h  12h  16h  20h
```

#### **Cartes Métriques Temps Réel**
3 cartes avec valeurs actuelles:

**Humidité Moyenne**
- Valeur: 62%
- Indicateur de tendance (↑↓→)
- Mini graphique sparkline
- Zone optimale: 40-70%

**Température Moyenne**
- Valeur: 22°C
- Tendance
- Mini graphique
- Zone optimale: 18-25°C

**Luminosité Moyenne**
- Valeur: 6.5h
- Tendance
- Mini graphique
- Optimal: 6-8h

#### **Alertes Actives**
Liste des alertes non résolues:
- Pot concerné
- Type d'alerte
- Valeur mesurée
- Seuil dépassé
- Actions: "Résoudre" / "Voir"

#### **Historique Récent**
Table des 10 dernières mesures:
| Pot | Heure | Humidité | Temp | Lumière |
|-----|-------|----------|------|---------|
| Basilic | 14:30 | 58% | 22°C | 450 lux |
| ... | ... | ... | ... | ... |

**Données Sources:**
- `historiqueMesures` - Données capteurs
- `alertes` - Alertes actives
- Rafraîchissement: Temps réel (WebSocket possible)

---

### 4. RECONNAISSANCE IA (`/recognition` - RecognitionPage)

**Fonctionnalité:** Identification de plantes par image avec IA

#### **Zone d'Upload Central**
```
┌─────────────────────────────┐
│       📸 🖼️                 │
│                             │
│   Glissez une image ici     │
│   ou cliquez pour parcourir │
│                             │
│   [ Parcourir fichiers ]    │
│   [ Prendre une photo ]     │
└─────────────────────────────┘
```

**Formats acceptés:** JPG, PNG, WebP
**Taille max:** 10 MB
**Méthodes upload:**
- Drag & drop
- Sélection fichier
- Capture webcam (mobile)

#### **Résultats de Reconnaissance**

Après analyse (3-5 secondes):

**Section 1: Identification**
```
┌─────────────────────────────────────┐
│  [Photo uploadée]                   │
│                                     │
│  🌱 Nom: Basilic                    │
│  🔬 Nom scientifique: Ocimum basilicum
│  ✓ Confiance: 95%                   │
│  💚 Santé: Healthy                  │
│  📊 Niveau de soin: Facile          │
└─────────────────────────────────────┘
```

**Section 2: Recommandations**
Liste des conseils personnalisés:
- ✅ "Arrosez régulièrement, gardez le sol humide"
- ✅ "Placez en plein soleil (6-8h/jour)"
- ✅ "Température idéale: 20-25°C"
- ⚠️ "Attention aux pucerons en été"

**Section 3: Conditions de Soin Optimales** ⭐ (NOUVELLE FONCTIONNALITÉ IA)

Affichage en 3 colonnes:

| 💧 HUMIDITÉ | ☀️ LUMINOSITÉ | 🚰 ARROSAGE |
|-------------|---------------|-------------|
| **Idéal: 50%** | **Idéal: 2500 lux** | **Tous les 2-3 jours** |
| Plage: 40-60% | Plage: 2000-3500 lux | Min: 2 jours |
| | Lumière directe du soleil | Max: 3 jours |

**Température:**
- 🌡️ Idéale: 21°C
- Plage: 15-28°C

**Autres Infos:**
- 🌍 Origine: Asie tropicale
- ⚠️ Toxicité: Non-toxique (safe pour animaux)
- 🌸 Floraison: Été
- 📊 Difficulté: Facile

**Section 4: Maladies Détectées**
Si maladies trouvées:
- Liste des maladies
- Niveau de sévérité
- Traitements recommandés

#### **Scans Récents**
Grille des 6 derniers scans:
- Miniature image
- Nom plante
- Confiance %
- Date ("Il y a 2j")
- Badge santé
- Clic → Revoir résultats

**Boutons Actions:**
- 📥 Télécharger rapport PDF
- 💾 Sauvegarder dans mes plantes
- 🔗 Partager
- 🔄 Nouvelle analyse

**API Utilisée:**
- **Plant.id API** pour reconnaissance
- **Base PlantInfo** pour conseils de soin
- Sauvegarde dans `identificationsPlantes`

**Technologies:**
- Upload: HTML5 FileReader
- Image processing: Canvas API
- Affichage: React components
- Animation: Framer Motion

---

### 5. COURS EN LIGNE (`/courses` - CoursesPage)

**Fonctionnalité:** Plateforme e-learning

#### **Statistiques Personnelles**
4 cartes:
- 📚 Cours inscrits (X/Y)
- ⏱️ Temps d'apprentissage total
- ✅ Cours terminés
- 📖 Leçons totales disponibles

#### **Filtres de Cours**
Tags cliquables:
- 📌 Tous les cours (15)
- 🟢 Débutant (8)
- 🟡 Intermédiaire (5)
- 🔴 Avancé (2)

**Autres filtres:**
- 🔍 Barre de recherche
- 📊 Trier par: Popularité, Durée, Note

#### **Grille de Cours**
Cartes de cours (3 colonnes)

**Chaque Carte:**
```
┌───────────────────────────┐
│  [Image de couverture]    │
│  🏷️ Badge niveau          │
│  🔥 Populaire (si top)    │
├───────────────────────────┤
│  Titre du Cours           │
│  ⭐⭐⭐⭐⭐ 4.8 (234)      │
│                           │
│  👤 Instructeur           │
│  ⏱️ 4h 30min             │
│  📖 12 leçons            │
│                           │
│  Progress bar: ▓▓▓▓▓░░░░░ 50%
│                           │
│  [ Continuer ] ou [ Commencer ]
└───────────────────────────┘
```

**Status Badges:**
- ✅ Terminé (100%)
- 🚀 En cours (1-99%)
- 🔒 Verrouillé (non inscrit)

#### **Clic sur Cours → CourseDetailPage**

---

### 6. DÉTAIL COURS (`/course/:id` - CourseDetailPage)

**Fonctionnalité:** Vue détaillée d'un cours

#### **Header du Cours**
- Titre
- Instructeur + avatar
- Note moyenne ⭐
- Nombre d'étudiants
- Niveau
- Durée totale
- Dernière mise à jour

#### **Onglets:**

**📖 Contenu**
Liste des chapitres et leçons:
```
Chapitre 1: Introduction à l'IoT
  ✅ Leçon 1.1: Qu'est-ce que l'IoT? (12 min)
  ✅ Leçon 1.2: Applications en agriculture (18 min)
  ▶️ Leçon 1.3: Composants IoT (25 min)  ← En cours
  🔒 Leçon 1.4: Quiz (5 min)

Chapitre 2: Capteurs
  🔒 Leçon 2.1: Types de capteurs (20 min)
  ...
```

**Lecteur de Leçon:**
- Vidéo ou contenu texte/markdown
- Barre de progression
- Boutons: ⏮️ Précédent | ⏸️ Pause | ⏭️ Suivant
- Notes personnelles
- Ressources téléchargeables

**📝 À propos**
- Description complète
- Objectifs d'apprentissage
- Prérequis
- Ce que vous apprendrez

**💬 Discussions**
Forum du cours:
- Poser une question
- Voir Q&A
- Upvote/downvote
- Réponses instructeur

**📜 Certificat**
Si cours terminé:
- Télécharger certificat PDF
- Badge de complétion
- Partager sur LinkedIn

**Données Sources:**
- `cours` - Informations cours
- `progressionCours` - Progression utilisateur
- Auto-save progression toutes les 30s

---

### 7. JEUX ÉDUCATIFS (`/games` - GamesPage)

**Fonctionnalité:** Mini-jeux gamifiés pour apprendre

#### **Statistiques Joueur**
```
┌─────────────────────────────────────┐
│  🏆 Score Total: 2,450 points      │
│  🎯 Jeux joués: 24                 │
│  👑 Classement: #15                │
│  🔥 Série actuelle: 5 jours        │
└─────────────────────────────────────┘
```

#### **Défi du Jour**
Carte mise en avant:
```
⭐ DÉFI DU JOUR ⭐
"Identifiez 10 plantes en moins de 3 minutes"
Récompense: +250 points
⏰ Plus que: 18h 45min
[ Jouer Maintenant ]
```

#### **Liste des Jeux**

**1. 🎯 Sensor Challenge**
- **Description:** Configurez les capteurs IoT pour maintenir les conditions optimales
- **Joueurs:** 1,234
- **Votre meilleur score:** 850
- **Difficulté:** ⭐⭐
- `[ Jouer ]`

**2. ⚡ IoT Circuit Builder**
- **Description:** Créez des circuits IoT fonctionnels
- **Joueurs:** 987
- **Votre meilleur score:** 620
- **Difficulté:** ⭐⭐⭐
- `[ Jouer ]`

**3. 👑 Garden Manager**
- **Description:** Gérez un jardin virtuel avec ressources limitées
- **Joueurs:** 2,456
- **Votre meilleur score:** 1,120
- **Difficulté:** ⭐⭐
- `[ Jouer ]`

**4. 🏆 Plant Quiz Master**
- **Description:** Quiz rapide sur les plantes et leurs soins
- **Joueurs:** 3,021
- **Votre meilleur score:** 450
- **Difficulté:** ⭐
- `[ Jouer ]`

#### **Classement Global**
Top 10 joueurs:
| # | Joueur | Score | Badge |
|---|--------|-------|-------|
| 1 | 🌟 Alice Dubois | 5,420 | 👑 |
| 2 | 🌱 Marc Laurent | 4,980 | 🥈 |
| 3 | 🌿 Sophie M. | 4,650 | 🥉 |
| ... | ... | ... | ... |
| 15 | ➡️ Vous | 2,450 | ⭐ |

#### **Succès Débloqués**
Grille de badges:
- ✅ 🎮 Premier pas - "Jouer à votre premier jeu"
- ✅ 🎯 Expert IoT - "Réussir tous les niveaux Sensor Challenge"
- ✅ 🌿 Botaniste - "Identifier 50 plantes"
- 🔒 🏆 Maître Jardinier - "Atteindre niveau 10"
- 🔒 ⚡ Ingénieur - "Créer 20 systèmes IoT"
- 🔒 👑 Champion - "Top 3 classement"

**Récompenses:**
- Points échangeables contre:
  - 🎁 Réductions boutique
  - 🔓 Cours exclusifs
  - 👕 Avatars et badges

**Données Sources:**
- `jeux` - Liste des jeux
- `scores` - Scores utilisateur
- Mise à jour temps réel du classement

---

### 8. BOUTIQUE (`/shop` - ShopPage)

**Fonctionnalité:** E-commerce de matériel IoT

#### **Bannière Promotionnelle**
```
🎉 OFFRE LIMITÉE 🎉
Pack Étudiant -30%
Sur tous les kits de démarrage
[ Voir l'offre ]
```

#### **Filtres**
- 🏷️ Tous les produits
- 🪴 Pots connectés
- 📡 Capteurs
- 📦 Kits complets
- 🔌 Accessoires

**Tri:**
- Prix croissant/décroissant
- Popularité
- Nouveautés
- Meilleures notes

#### **Grille de Produits**
Cartes produits (3-4 colonnes)

**Exemple de Carte:**
```
┌───────────────────────────┐
│  [Photo produit]          │
│  🔥 BEST-SELLER           │
├───────────────────────────┤
│  Smart Pot Pro V2         │
│  ⭐⭐⭐⭐⭐ 4.7 (89 avis) │
│                           │
│  ✓ Capteur humidité       │
│  ✓ Capteur température    │
│  ✓ Arrosage automatique   │
│  ✓ Connectivité WiFi      │
│                           │
│  89.99€                   │
│  ✅ En stock (12)         │
│                           │
│  [ 🛒 Ajouter au panier ] │
│  [ 👁️ Détails ]          │
└───────────────────────────┘
```

#### **Panier (Header)**
Icône panier avec badge:
```
🛒 (3)  ← 3 articles
```

Clic → Modal panier:
- Liste articles
- Quantités modifiables
- Sous-total
- `[ Passer commande ]`

#### **Page Détail Produit**
- Carousel d'images
- Description complète
- Spécifications techniques
- Avis clients
- Produits similaires
- Add to cart

**Tunnel de Commande:**
1. Panier
2. Coordonnées livraison
3. Mode de paiement
4. Confirmation

**Données Sources:**
- `produits` - Catalogue
- `paniers` - Panier utilisateur
- `commandes` - Historique commandes

---

### 9. CONTACT (`/contact` - ContactPage)

**Fonctionnalité:** Support et contact

#### **Formulaire de Contact**
```
Nom: _________________
Email: _______________
Sujet: [ Dropdown ]  ▼
  - Question technique
  - Problème de commande
  - Suggestion
  - Réclamation
  - Autre

Message:
┌─────────────────────┐
│                     │
│                     │
│                     │
└─────────────────────┘

[ Envoyer ]
```

#### **FAQ Rapide**
Accordéon de questions fréquentes:
- ❓ Comment connecter un pot?
- ❓ L'IA ne reconnaît pas ma plante
- ❓ Modifier mon abonnement
- ❓ Retourner un produit
- ... (10 questions)

#### **Coordonnées**
- 📧 Email: support@smartplantcare.com
- 📞 Téléphone: +33 1 23 45 67 89
- 💬 Chat en direct (si disponible)
- 🕐 Horaires: Lun-Ven 9h-18h

**Enregistrement:**
Sauvegarde dans `reclamations` collection

---

### 10. PARAMÈTRES (`/settings` - SettingsPage)

**Fonctionnalité:** Configuration du compte

#### **Onglets:**

**👤 Profil**
```
Nom: _________________
Prénom: ______________
Email: _______________
Téléphone: ___________

[ Modifier le mot de passe ]

[ Sauvegarder ]
```

**🔔 Notifications**
```
[x] Alertes de plantes par email
[x] Alertes de plantes push
[x] Newsletter hebdomadaire
[ ] Offres promotionnelles
[x] Rappels d'arrosage
```

**🎨 Préférences**
```
Thème: ( ) Clair  (•) Sombre  ( ) Auto
Langue: [ Français  ▼ ]
Unités:
  Température: (•) Celsius  ( ) Fahrenheit
  Distance: (•) Métrique  ( ) Impérial
```

**🔐 Sécurité**
- Changer mot de passe
- Authentification deux facteurs (2FA)
- Sessions actives
- Historique de connexion

**💳 Abonnement**
- Plan actuel: Free / Pro / Premium
- Upgrade / Downgrade
- Historique de paiements
- Factures

**⚠️ Danger Zone**
```
[ Désactiver le compte ]
[ Supprimer le compte ]
```

---

## 👨‍💼 INTERFACE ADMIN (Administrateurs)

**Accès:** Compte avec `role: 'admin'`

**Navigation:** Sidebar admin avec menu

**Menu Admin:**
- 📊 Dashboard Admin
- 👥 Gestion Utilisateurs
- 🪴 Gestion Pots
- 📦 Gestion Commandes
- 📚 Gestion Cours
- 🎮 Gestion Jeux
- 📈 Analytics
- ⚙️ Paramètres Système

---

### 1. DASHBOARD ADMIN (`/admin-dashboard` - AdminPage)

**Fonctionnalité:** Vue d'ensemble plateforme

#### **KPIs Principaux**
```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ 👥 Utilisateurs │ │ 🪴 Pots         │ │ 💰 Ventes       │ │ 😊 Satisfaction │
│                 │ │                 │ │                 │ │                 │
│     124         │ │     38          │ │   1,245.50€     │ │     92%         │
│   +12% ce mois  │ │   +5% ce mois   │ │   +18% ce mois  │ │   +3%          │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

#### **Graphique: Croissance Utilisateurs**
- Type: Courbe
- Période: 12 derniers mois
- Séries: Nouveaux users/mois
- Source: `clients` + `administrateurs`

#### **Graphique: Revenus Mensuels**
- Type: Barres
- Données: Ventes par mois
- Source: `commandes`

#### **Commandes Récentes**
Table des 10 dernières commandes:
| ID | Client | Produit | Montant | Status | Date |
|----|--------|---------|---------|--------|------|
| #1234 | Alice D. | Smart Pot Pro | 89.99€ | ✅ Livré | 5 fév |
| ... | ... | ... | ... | ... | ... |

**Actions rapides:**
- `[ Voir détail ]`
- `[ Changer status ]`

#### **Alertes Système**
- ⚠️ 3 pots hors ligne
- 💬 12 réclamations en attente
- 📦 5 commandes à traiter

---

### 2. GESTION UTILISATEURS (`/admin/users` - AdminUsersPage)

**Fonctionnalité:** CRUD complet utilisateurs

#### **Statistiques**
- Total utilisateurs
- Actifs ce mois
- Nouveaux (30j)
- Inactifs

#### **Barre d'Actions**
- 🔍 Recherche par nom/email
- 🔽 Filtre par rôle (Client/Admin)
- 🔽 Filtre par statut (Actif/Inactif)
- ➕ Ajouter utilisateur

#### **Table Utilisateurs**
| Avatar | Nom | Email | Rôle | Pots | Inscription | Status | Actions |
|--------|-----|-------|------|------|-------------|--------|---------|
| 👤 | Alice Dubois | alice@... | Client | 3 | 12 jan 2026 | ✅ Actif | ⚙️ ✏️ 🗑️ |
| 👤 | Bob Martin | bob@... | Admin | 0 | 5 déc 2025 | ✅ Actif | ⚙️ ✏️ 🗑️ |
| ... | ... | ... | ... | ... | ... | ... | ... |

**Actions:**
- ⚙️ Voir détails
- ✏️ Modifier
- 🗑️ Supprimer
- 🔒 Suspendre compte

#### **Modal Ajout Utilisateur**
```
Type: ( ) Client  ( ) Admin

Nom: _________________
Email: _______________
Mot de passe: ________

[ Annuler ]  [ Créer ]
```

#### **Modal Modification**
- Tous les champs éditables
- Réinitialiser mot de passe
- Changer rôle

#### **Modal Suppression**
```
⚠️ Supprimer l'utilisateur "Alice Dubois"?

Cette action est irréversible.
- Pots: 3 (seront désassignés)
- Commandes: 5 (seront conservées)

[ Annuler ]  [ ❌ Supprimer ]
```

**API:**
- GET/POST/PATCH/DELETE `/api/admin/collections/clients`
- GET/POST/PATCH/DELETE `/api/admin/collections/administrateurs`

---

### 3. GESTION POTS (`/admin/pots` - AdminPotsPage)

**Fonctionnalité:** Supervision tous les pots

#### **Vue d'Ensemble**
- Total pots plateforme
- Pots en ligne / hors ligne
- Pots nécessitant maintenance
- Avg mesures par pot

#### **Filtres**
- Par statut (En ligne/Hors ligne/Maintenance)
- Par client
- Par type de plante
- Date installation

#### **Table Pots**
| ID | Nom Pot | Type Plante | Client | Status | Dernière Mesure | Actions |
|----|---------|-------------|--------|--------|-----------------|---------|
| #001 | Pot Basilic | Basilic | Alice D. | 🟢 En ligne | Il y a 5 min | 👁️ 🔧 🗑️ |
| #002 | Monstera | Monstera | Bob M. | 🔴 Hors ligne | Il y a 2j | 👁️ 🔧 🗑️ |
| ... | ... | ... | ... | ... | ... | ... |

**Actions:**
- 👁️ Voir historique complet
- 🔧 Maintenance
- 🗑️ Désactiver

#### **Détail Pot (Modal)**
- Infos pot
- Propriétaire
- Graphiques mesures (7j)
- Historique arrosage
- Alertes liées
- Configuration capteurs

**Maintenance:**
- Marquer comme "En maintenance"
- Ajouter notes technicien
- Planifier intervention

---

### 4. GESTION COMMANDES (`/admin/orders` - AdminOrdersPage)

**Fonctionnalité:** Gestion des commandes

#### **Statistiques**
- Total commandes
- En attente
- En cours
- Livrées ce mois

#### **Filtres**
- Par statut
- Par client
- Par période
- Par montant

#### **Table Commandes**
| N° | Client | Produits | Total | Statut | Date | Actions |
|----|--------|----------|-------|--------|------|---------|
| #5678 | Alice D. | Smart Pot Pro x2 | 179.98€ | 🟡 En cours | 4 fév | 👁️ ✏️ 📄 |
| ... | ... | ... | ... | ... | ... | ... |

**Status:**
- 🔵 En attente
- 🟡 En cours
- 🟢 Livrée
- 🔴 Annulée

**Actions:**
- 👁️ Voir détail
- ✏️ Changer statut
- 📄 Générer facture
- 📧 Contacter client

#### **Détail Commande**
- Infos client
- Adresse livraison
- Liste produits
- Historique statuts
- Suivi colis (tracking)
- Notes internes

**Changer Statut:**
```
Statut actuel: En attente

Nouveau statut: [ En cours  ▼ ]

Note: ___________________

[ Mettre à jour ]
```

---

### 5. GESTION COURS (`/admin/courses` - AdminCoursesPage)

**Fonctionnalité:** CRUD cours

#### **Statistiques**
- Total cours
- Cours publiés
- Brouillons
- Total étudiants inscrits

#### **Barre d'Actions**
- 🔍 Recherche
- 🔽 Filtre par catégorie
- 🔽 Filtre par niveau
- 🔽 Filtre par statut
- ➕ Créer un cours

#### **Grille Cours**
Mode carte similaire à liste cours, avec infos admin:
- Nombre d'inscrits
- Taux de complétion moyen
- Date de création
- Dernier edit

**Actions:**
- ✏️ Modifier
- 👁️ Prévisualiser
- 📊 Voir stats
- 🗑️ Supprimer

#### **Éditeur de Cours**
```
Titre: _________________
Description: ___________

Catégorie: [ IoT  ▼ ]
Niveau: [ Débutant  ▼ ]
Durée estimée: [___] min

Image de couverture: [ Upload ]

Chapitres:
  Chapitre 1: _________
    Leçon 1.1: _______
      Contenu: [ Rich Text Editor ]
      Vidéo: [ Upload / URL ]
      Durée: [__] min
    [+ Ajouter leçon]
  [+ Ajouter chapitre]

Examen final: [ Configurer ]

Status: ( ) Brouillon  ( ) Publié

[ Sauvegarder ]  [ Publier ]
```

#### **Statistiques Cours**
- Graphique inscriptions/temps
- Taux de complétion
- Notes moyennes
- Temps moyen passé
- Leçons les plus vues
- Feedbacks étudiants

---

### 6. GESTION JEUX (`/admin/games` - AdminGamesPage)

**Fonctionnalité:** Gestion des jeux éducatifs

#### **Statistiques**
- Total jeux
- Jeux actifs
- Total parties jouées
- Joueurs actifs

#### **Table Jeux**
| ID | Nom Jeu | Catégorie | Parties | Joueurs | Avg Score | Actions |
|----|---------|-----------|---------|---------|-----------|---------|
| #1 | Sensor Challenge | IoT | 1,234 | 456 | 780 | 👁️ ✏️ 📊 |
| #2 | Garden Manager | Gestion | 987 | 321 | 650 | 👁️ ✏️ 📊 |
| ... | ... | ... | ... | ... | ... | ... |

**Actions:**
- 👁️ Jouer/Tester
- ✏️ Modifier paramètres
- 📊 Voir statistiques
- 🗑️ Désactiver

#### **Configuration Jeu**
```
Nom du jeu: _____________
Description: ____________
Catégorie: [ IoT  ▼ ]
Difficulté: [ Moyen  ▼ ]

Points par victoire: [___]
Temps limite: [___] sec
Nombre de niveaux: [___]

Assets:
  Images: [ Upload ]
  Sons: [ Upload ]

[ Sauvegarder ]
```

#### **Statistiques Jeu**
- Graphique parties/jour
- Distribution des scores
- Temps moyen de jeu
- Taux de complétion
- Top 10 joueurs

---

### 7. ANALYTICS (`/admin/analytics`)

**Fonctionnalité:** Analytics avancées

#### **Données Temps Réel**
- Utilisateurs en ligne actuellement
- Activité dernières 24h
- Pics d'utilisation

#### **Métriques Engagement**
- DAU (Daily Active Users)
- MAU (Monthly Active Users)
- Taux de rétention
- Churn rate

#### **Graphiques:**

**Trafic:**
- Visites/jour
- Pages vues
- Durée moyenne session
- Taux de rebond

**Conversion:**
- Funnel inscription
- Taux de conversion visiteur→client
- Abandons de panier
- ROI publicitaire

**IoT:**
- Nombre de mesures/jour
- Pots actifs/inactifs
- Alertes générées
- Taux d'arrosage automatique

**E-learning:**
- Cours les plus populaires
- Taux de complétion par cours
- Temps moyen par cours
- Résultats examens

**E-commerce:**
- Revenus par période
- Produits bestsellers
- Panier moyen
- Taux de conversion checkout

**Export de données:**
- CSV
- Excel
- PDF Reports

---

## ⭐ FONCTIONNALITÉS PRINCIPALES

### 1. SYSTÈME IoT - POTS CONNECTÉS

**Capteurs Intégrés:**
- 💧 **Humidité du sol** (%)
- 🌡️ **Température** (°C)
- ☀️ **Luminosité** (Lux)
- 💧 **Niveau réservoir d'eau** (%)

**Arrosage Automatique:**
- Déclenchement par seuil d'humidité
- Fréquence configurable
- Mode manuel / automatique
- Historique complet

**Alertes:**
- Humidité critique (<20%)
- Température anormale
- Réservoir vide
- Pot hors ligne

**Historique:**
- Mesures stockées dans `historiqueMesures`
- Arrosages dans `historiqueArrosage`
- Rétention: illimitée
- Export CSV possible

---

### 2. RECONNAISSANCE PAR IA

**Capacités:**
- Identification de +10,000 espèces
- Détection de maladies
- Analyse de santé
- Recommandations personnalisées
- **Informations de soins optimales** ⭐

**API Externe:** Plant.id
- Endpoint: `https://plant.id/api/v3/`
- Précision: 90-98% selon plantes
- Temps de réponse: 3-5 secondes

**Base de Données Locale:** PlantInfo
- 10 plantes pré-chargées
- Informations de soins détaillées:
  - Humidité (min/max/idéale)
  - Luminosité (lux + description)
  - Fréquence d'arrosage
  - Température optimale
  - Niveau de difficulté
  - Toxicité
  - Origine
- Extensible (ajouter plus de plantes)

**Workflow:**
1. User upload image
2. API reconnaissance → Nom plante
3. Lookup dans PlantInfo
4. Affichage complet:
   - Identification
   - Santé
   - Recommandations
   - **Conditions de soin optimales** (NEW)

---

### 3. LEARNING MANAGEMENT SYSTEM (LMS)

**Format Cours:**
- Vidéos HD
- Textes markdown
- Quiz interactifs
- Ressources téléchargeables
- Certificats de complétion

**Suivi de Progression:**
- % de complétion
- Temps passé
- Leçons complétées
- Scores examens
- Historique activité

**Thématiques:**
- Introduction IoT
- Agriculture intelligente
- Capteurs et électronique
- Programmation Arduino/Raspberry Pi
- Analyse de données
- Hydroponie
- Permaculture

**Examens:**
- QCM
- Questions ouvertes
- Exercices pratiques
- Note de passage configurable
- Tentatives illimitées

---

### 4. GAMIFICATION

**Types de Jeux:**

**Sensor Challenge**
- Configurez capteurs pour conditions optimales
- Plusieurs niveaux de difficulté
- Points selon rapidité et précision

**Garden Manager**
- Simulation de gestion de jardin
- Ressources limitées (eau, engrais)
- Stratégie et planification

**Plant Quiz**
- Identification rapide de plantes
- Mode contre-la-montre
- Questions variées

**IoT Circuit Builder**
- Créez circuits IoT fonctionnels
- Puzzle électronique
- Validation en temps réel

**Système de Récompenses:**
- Points par victoire
- Succès débloquables
- Classement global
- Badges de profil
- Réductions boutique

---

### 5. E-COMMERCE

**Catalogue Produits:**
- Pots connectés (3 modèles)
- Capteurs individuels
- Kits complets
- Accessoires
- Abonnements services

**Fonctionnalités:**
- Panier persistant
- Wishlist
- Comparaison produits
- Avis clients
- Programme fidélité

**Paiement:**
- Carte bancaire
- PayPal
- Virement
- Paiement en 3x (optionnel)

**Livraison:**
- Multiple adresses
- Suivi de colis
- Options express
- Retours gratuits 30j

---

### 6. SYSTÈME DE NOTIFICATIONS

**Types:**
- 🔔 Push notifications (Web)
- 📧 Email
- 📱 SMS (optionnel)
- 🔔 In-app

**Événements:**
- Alerte pot (humidité, etc.)
- Rappel arrosage
- Cours disponible
- Commande expédiée
- Nouveau jeu
- Message admin

**Configuration:**
- Préférences par type
- Fréquence
- Horaires silencieux
- Désactivation sélective

---

### 7. AUTHENTIFICATION & SÉCURITÉ

**Méthodes d'Auth:**
- Email + Mot de passe
- 2FA (optionnel)
- Social login (future)

**Sécurité:**
- JWT tokens (2h expiration)
- Refresh tokens
- Mots de passe hashés (bcrypt, 10 rounds)
- HTTPS uniquement
- Rate limiting API
- CORS configuré

**Rôles:**
- **Visitor** - Non connecté (accès public)
- **Client** - Utilisateur standard
- **Admin** - Accès complet

**Permissions:**
- Client: Gère ses pots, cours, commandes
- Admin: Accès admin panel, CRUD global

---

## 🔄 FLUX DE DONNÉES CLÉS

### Flux 1: Mesure IoT → Dashboard
```
Pot Connecté (Capteurs)
    ↓
Mesure (température, humidité, etc.)
    ↓
POST /api/historiqueMesures (via IoT device)
    ↓
MongoDB: Collection historiqueMesures
    ↓
GET /api/collections/historiqueMesures (Frontend)
    ↓
React Hook: useCollection('historiqueMesures')
    ↓
Dashboard affiche graphiques temps réel
```

### Flux 2: Upload Image → Reconnaissance
```
User selects image
    ↓
FileReader encodes to base64
    ↓
POST /api/recognition/plant
    ↓
Server → Plant.id API
    ↓
Server récupère: nom, confidence, santé
    ↓
Server → Lookup PlantInfo (MongoDB)
    ↓
Server combine données
    ↓
Response complète au client
    ↓
RecognitionPage affiche résultats
```

### Flux 3: Inscription → Login → Dashboard
```
User fills signup form
    ↓
POST /api/auth/register
    ↓
Server creates client in DB
    ↓
Auto POST /api/auth/login
    ↓
Server generates JWT token
    ↓
Client stores token in localStorage
    ↓
setUserRole('client')
    ↓
Navigate to /dashboard
    ↓
All subsequent API calls include:
  Authorization: Bearer <token>
```

### Flux 4: Arrosage Automatique
```
Pot measure humidity
    ↓
Humidity < seuilHumidite (ex: 30%)
    ↓
Trigger arrosage
    ↓
POST /api/historiqueArrosage
    ↓
Save record: {potId, dateArrosage, quantiteEau, mode: 'automatique'}
    ↓
POST /api/alertes (optionnel)
    ↓
User receives notification
```

---

## 📊 SCHÉMA RELATIONNEL

```
clients (👤 Users)
  ├─→ potsConnectes (1:N)
  │     ├─→ historiqueMesures (1:N)
  │     ├─→ historiqueArrosage (1:N)
  │     ├─→ alertes (1:N)
  │     └─→ etapesDevPlante (1:N)
  ├─→ commandes (1:N)
  │     ├─→ lignesCommande (1:N)
  │     └─→ paiements (1:1)
  ├─→ paniers (1:1)
  ├─→ adressesLivraison (1:N)
  ├─→ progressionCours (1:N)
  │     └─→ cours (N:1)
  ├─→ scores (1:N)
  │     └─→ jeux (N:1)
  ├─→ identificationsPlantes (1:N)
  ├─→ notifications (1:N)
  ├─→ reclamations (1:N)
  ├─→ feedbacks (1:N)
  └─→ sessions (1:N)

administrateurs (👨‍💼 Admins)
  └─→ sessions (1:N)

produits
  ├─→ lignesCommande (1:N)
  └─→ paniers (N:M)

cours
  ├─→ progressionCours (1:N)
  ├─→ examens (1:1)
  └─→ feedbacks (1:N)

jeux
  └─→ scores (1:N)

PlantInfo (🌱 Plant Care Database)
  └─→ identificationsPlantes (1:N) [référence informelle]
```

---

## 🚀 DÉPLOIEMENT & CONFIGURATION

### Variables d'Environnement (.env)

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/plateformeDB

# JWT
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=2h

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Smart Plant Care <noreply@smartplantcare.com>

# Plant.id API
PLANT_ID_API_KEY=your-plant-id-api-key

# Server
PORT=4000
NODE_ENV=production

# Frontend (build)
VITE_API_URL=http://localhost:4000/api

# Password Reset
PASSWORD_RESET_TOKEN_TTL_MINUTES=15

# Database Import
IMPORT_DB=plateformeDB
IMPORT_DROP=false
```

### Docker Compose

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    build: .
    ports:
      - "4000:4000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/plateformeDB
    depends_on:
      - mongodb

volumes:
  mongo_data:
```

### Scripts NPM

```json
{
  "scripts": {
    "dev": "vite",                    // Frontend dev server
    "dev:server": "node server/index.js",  // Backend dev
    "build": "tsc && vite build",     // Production build
    "preview": "vite preview",        // Preview build
    "import:json": "node server/scripts/import-json.mjs",  // Import DB
    "seed:plants": "node server/scripts/seed-plants.mjs"   // Seed PlantInfo
  }
}
```

### Installation & Démarrage

```bash
# 1. Installation
npm install

# 2. Configuration
cp .env.example .env
# Éditer .env avec vos credentials

# 3. Base de données
npm run import:json      # Importer collections JSON
npm run seed:plants      # Charger PlantInfo

# 4. Développement
npm run dev:server       # Terminal 1 - Backend (port 4000)
npm run dev              # Terminal 2 - Frontend (port 5173)

# 5. Production (Docker)
docker compose up --build
# App disponible: http://localhost:4000
```

---

## 📈 STATISTIQUES DU PROJET

### Nombre de Fichiers
- **Backend:** ~25 fichiers
- **Frontend:** ~92 fichiers
- **Total:** ~117 fichiers

### Lignes de Code (estimé)
- **Backend:** ~2,500 lignes
- **Frontend:** ~8,000 lignes
- **Total:** ~10,500 lignes

### Collections MongoDB: 25
### API Endpoints: ~30+
### Pages Frontend: 32 pages
### Composants React: ~50+

---

## 🎓 TECHNOLOGIES DÉTAILLÉES

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations fluides
- **Recharts** - Graphiques interactifs
- **Sonner** - Toast notifications
- **Lucide React** - Icons modernes
- **Radix UI** - Components accessibles

### Backend
- **Node.js 18+** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB 7** - Base NoSQL
- **Mongoose** - ODM MongoDB
- **JWT** - Authentification stateless
- **bcryptjs** - Hashing passwords
- **Nodemailer** - Service email
- **Axios** - HTTP client

### DevOps
- **Docker** - Containerisation
- **Docker Compose** - Orchestration
- **Git** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 🔮 FONCTIONNALITÉS FUTURES (Roadmap)

### Phase 2
- [ ] Application mobile (React Native)
- [ ] Notifications push mobiles
- [ ] Mode hors-ligne (PWA)
- [ ] WebSockets pour temps réel
- [ ] Chat en direct

### Phase 3
- [ ] Support multi-langues (i18n)
- [ ] API publique pour développeurs
- [ ] Intégration Home Assistant
- [ ] Alexa / Google Home
- [ ] Marketplace de plugins

### Phase 4
- [ ] Machine Learning prédictif
- [ ] Recommandations personnalisées IA
- [ ] Communauté et forums
- [ ] Streaming vidéo live
- [ ] Réseau social de jardiniers

---

## 🐛 PROBLÈMES CONNUS

### Backend
- Sessions ne sont pas nettoyées automatiquement (expiration)
- Pas de rate limiting sur API
- Upload d'images limité à 12MB
- Emails peuvent finir en spam

### Frontend
- Performance sur mobile avec beaucoup de graphiques
- Refresh manuel nécessaire pour données temps réel
- Pas de skeleton loaders sur certaines pages

---

## 📞 SUPPORT & DOCUMENTATION

### Documentation Disponible
- ✅ `README.md` - Guide de démarrage
- ✅ `DATABASE_SCHEMA.md` - Schéma de la base
- ✅ `ARCHITECTURE_GUIDE.md` - Architecture système
- ✅ `AI_AGENT_SETUP_GUIDE.md` - Guide agent IA
- ✅ `USER_EXPERIENCE_GUIDE.md` - Guide UX
- ✅ `QUICK_START.md` - Démarrage rapide
- ✅ `PROJECT_FULL_RAPPORT.md` - Ce document

### Ressources Utiles
- Figma Design: [Smart Plant Care Platform UI/UX](https://www.figma.com/design/yODciSNeplHB9nTqfJZN71/)
- Plant.id API Docs: https://plant.id/docs
- MongoDB Docs: https://docs.mongodb.com
- React Docs: https://react.dev

---

## 📝 CONCLUSION

**Smart Plant Care Platform** est une solution complète et moderne qui combine:
- 🔌 **IoT** - Monitoring temps réel des plantes
- 🤖 **IA** - Reconnaissance intelligente
- 📚 **E-learning** - Formation en ligne
- 🎮 **Gamification** - Apprentissage ludique
- 🛒 **E-commerce** - Boutique intégrée

**Points Forts:**
- Architecture modulaire et scalable
- Interface utilisateur moderne et responsive
- Base de données bien structurée (25 collections)
- API RESTful complète et documentée
- Système d'authentification robuste
- Fonctionnalités IA avancées avec PlantInfo
- UX soignée avec animations fluides

**Cas d'Usage:**
- Étudiants en IoT/Agriculture
- Écoles et universités
- Jardiniers amateurs
- Professionnels de l'horticulture
- Centres de recherche
- Particuliers passionnés

**Impact:**
- Apprentissage facilité de l'IoT
- Économies d'eau et ressources
- Sensibilisation environnementale
- Démocratisation de la technologie
- Création d'une communauté active

---

**🌱 Cultivez l'avenir avec l'IoT! 🌱**

---

*Rapport généré le 6 février 2026*  
*Version: 1.0.0*  
*Auteur: Smart Plant Care Platform Team*
