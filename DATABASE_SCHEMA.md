# 🗄️ Database Schema Documentation

## Database: `plateformeDB`
**Total Collections:** 25  
**Total Documents:** 73  
**Connection String:** `mongodb://localhost:27017/plateformeDB`

---

## 📊 Database Tables (Collections) Overview

### 👥 User Management

#### 1. **clients** (3 documents)
**Purpose:** Store client/user information
```javascript
{
  _id: ObjectId,
  nom: String,              // Last name
  prenom: String,           // First name
  email: String (unique),   // Email address
  motDePasse: String,       // Hashed password
  telephone: String,        // Phone number
  dateInscription: Date,    // Registration date
  statut: String            // 'actif' | 'inactif'
}
```
**Relationships:**
- → `potsConnectes` (clientId)
- → `commandes` (clientId)
- → `progressionCours` (clientId)
- → `scores` (clientId)
- → `notifications` (clientId)

#### 2. **administrateurs** (1 document)
**Purpose:** Store administrator accounts
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

---

### 🌱 IoT Smart Pot System

#### 3. **potsConnectes** (3 documents)
**Purpose:** Connected smart pots for plant monitoring
```javascript
{
  _id: ObjectId,
  nomPot: String,           // Pot name
  typePlante: String,       // Plant type
  clientId: ObjectId,       // → clients
  dateInstallation: Date,
  etatArrosage: String,     // 'actif' | 'inactif'
  dernierArrosage: Date,
  seuilHumidite: Number,    // Humidity threshold (%)
  frequenceArrosage: Number, // Watering frequency (hours)
  localisation: String,
  statut: String            // 'en ligne' | 'hors ligne' | 'maintenance'
}
```
**Relationships:**
- ← `clients` (clientId)
- → `historiqueMesures` (potId)
- → `historiqueArrosage` (potId)
- → `alertes` (potId)

#### 4. **historiqueMesures** (5 documents)
**Purpose:** Sensor measurements history
```javascript
{
  _id: ObjectId,
  potId: ObjectId,          // → potsConnectes
  temperature: Number,      // °C
  humidite: Number,        // % humidity
  luminosite: Number,      // Lux
  niveauEau: Number,       // % water level
  dateMesure: Date
}
```
**Relationships:**
- ← `potsConnectes` (potId)

#### 5. **historiqueArrosage** (3 documents)
**Purpose:** Watering history log
```javascript
{
  _id: ObjectId,
  potId: ObjectId,          // → potsConnectes
  dateArrosage: Date,
  quantiteEau: Number,      // ml
  modeArrosage: String,     // 'automatique' | 'manuel'
  declenchePar: String,     // Who/what triggered
  duree: Number             // seconds
}
```
**Relationships:**
- ← `potsConnectes` (potId)

#### 6. **alertes** (1 document)
**Purpose:** System alerts and notifications
```javascript
{
  _id: ObjectId,
  potId: ObjectId,          // → potsConnectes
  clientId: ObjectId,       // → clients
  type: String,             // 'critique' | 'avertissement' | 'info'
  message: String,
  dateCreation: Date,
  statut: String,           // 'non lue' | 'lue' | 'résolue'
  severite: String          // 'haute' | 'moyenne' | 'basse'
}
```
**Relationships:**
- ← `potsConnectes` (potId)
- ← `clients` (clientId)

#### 7. **alarmes** (4 documents)
**Purpose:** Alarm configurations
```javascript
{
  _id: ObjectId,
  potId: ObjectId,
  type: String,
  seuil: Number,
  actif: Boolean
}
```

---

### 📚 Learning Management System

#### 8. **cours** (3 documents)
**Purpose:** Educational courses
```javascript
{
  _id: ObjectId,
  titre: String,            // Course title
  description: String,
  categorie: String,
  niveau: String,           // 'débutant' | 'intermédiaire' | 'avancé'
  duree: Number,           // minutes
  nombreLecons: Number,
  note: Number,            // 0-5 rating
  nombreEtudiants: Number,
  imageUrl: String,
  contenu: String,
  dateCreation: Date,
  statut: String           // 'publié' | 'brouillon' | 'archivé'
}
```
**Relationships:**
- → `progressionCours` (coursId)

#### 9. **progressionCours** (5 documents)
**Purpose:** Student course progress tracking
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,       // → clients
  coursId: ObjectId,        // → cours
  progression: Number,      // 0-100%
  dateDebut: Date,
  dateDernierAcces: Date,
  dateCompletion: Date,
  statut: String,           // 'en cours' | 'terminé' | 'abandonné'
  tempsEcoule: Number,      // minutes
  lectionsCompletees: [String]
}
```
**Relationships:**
- ← `clients` (clientId)
- ← `cours` (coursId)

#### 10. **examens** (1 document)
**Purpose:** Course examinations
```javascript
{
  _id: ObjectId,
  coursId: ObjectId,
  questions: Array,
  duree: Number,
  notePassage: Number
}
```

#### 11. **tentativesExamen** (2 documents)
**Purpose:** Exam attempts
```javascript
{
  _id: ObjectId,
  examenId: ObjectId,
  clientId: ObjectId,
  reponses: Array,
  score: Number,
  datePassage: Date
}
```

---

### 🎮 Gamification System

#### 12. **jeux** (3 documents)
**Purpose:** Educational games
```javascript
{
  _id: ObjectId,
  nom: String,              // Game name
  description: String,
  categorie: String,
  difficulte: String,       // 'facile' | 'moyen' | 'difficile'
  nombreJoueurs: Number,
  scoreMaximum: Number,
  dureeEstimee: Number,     // minutes
  imageUrl: String,
  regles: String,
  statut: String            // 'actif' | 'inactif'
}
```
**Relationships:**
- → `scores` (jeuId)

#### 13. **scores** (4 documents)
**Purpose:** Game scores and leaderboard
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,       // → clients
  jeuId: ObjectId,          // → jeux
  score: Number,
  dateObtention: Date,
  tempsJeu: Number,         // seconds
  niveau: Number,
  estRecord: Boolean
}
```
**Relationships:**
- ← `clients` (clientId)
- ← `jeux` (jeuId)

---

### 🛒 E-Commerce System

#### 14. **produits** (5 documents)
**Purpose:** Product catalog
```javascript
{
  _id: ObjectId,
  nom: String,              // Product name
  description: String,
  categorie: String,
  prix: Number,             // Price in currency
  stock: Number,
  imageUrl: String,
  specifications: Object,   // Flexible specs
  marque: String,           // Brand
  note: Number,             // 0-5 rating
  nombreVentes: Number,
  estBestseller: Boolean,
  statut: String            // 'disponible' | 'rupture' | 'bientôt'
}
```
**Relationships:**
- → `commandes.produits` (produitId)
- → `paniers` (produitId)

#### 15. **commandes** (3 documents)
**Purpose:** Customer orders
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,       // → clients
  produits: [{
    produitId: ObjectId,    // → produits
    nom: String,
    quantite: Number,
    prix: Number
  }],
  montantTotal: Number,
  statut: String,           // 'en attente' | 'en cours' | 'livree' | 'annulee'
  dateCommande: Date,
  dateLivraison: Date,
  adresseLivraison: Object,
  modePaiement: String,
  numeroSuivi: String
}
```
**Relationships:**
- ← `clients` (clientId)
- ← `produits` (produits.produitId)
- → `paiements` (commandeId)

#### 16. **paniers** (3 documents)
**Purpose:** Shopping carts
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  produits: Array,
  dateCreation: Date,
  dateModification: Date
}
```

#### 17. **paiements** (1 document)
**Purpose:** Payment transactions
```javascript
{
  _id: ObjectId,
  commandeId: ObjectId,
  montant: Number,
  methode: String,
  statut: String,
  dateTransaction: Date
}
```

#### 18. **adressesLivraison** (3 documents)
**Purpose:** Delivery addresses
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  adresse: String,
  ville: String,
  codePostal: String,
  pays: String,
  estPrincipale: Boolean
}
```

---

### 📱 System Features

#### 19. **notifications** (4 documents)
**Purpose:** User notifications
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,       // → clients
  type: String,
  titre: String,
  message: String,
  dateCreation: Date,
  estLue: Boolean,
  lien: String,
  priorite: String          // 'haute' | 'normale' | 'basse'
}
```
**Relationships:**
- ← `clients` (clientId)

#### 20. **feedbacks** (1 document)
**Purpose:** User feedback
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  type: String,
  message: String,
  note: Number,
  dateCreation: Date
}
```

#### 21. **reclamations** (3 documents)
**Purpose:** Customer complaints
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  sujet: String,
  description: String,
  statut: String,
  dateCreation: Date
}
```

#### 22. **recommandations** (4 documents)
**Purpose:** System recommendations
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  type: String,
  contenu: String,
  dateCreation: Date
}
```

#### 23. **sessions** (3 documents)
**Purpose:** User sessions
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  token: String,
  dateDebut: Date,
  dateExpiration: Date
}
```

#### 24. **identificationsPlantes** (2 documents)
**Purpose:** Plant identification records
```javascript
{
  _id: ObjectId,
  clientId: ObjectId,
  image: String,
  resultat: String,
  confiance: Number,
  dateIdentification: Date
}
```

#### 25. **etapesDevPlante** (3 documents)
**Purpose:** Plant development stages
```javascript
{
  _id: ObjectId,
  potId: ObjectId,
  etape: String,
  description: String,
  date: Date
}
```

---

## 🔗 Database Relationships Diagram

```
clients (Users)
├── potsConnectes (IoT Pots)
│   ├── historiqueMesures (Sensor Data)
│   ├── historiqueArrosage (Watering History)
│   ├── alertes (Alerts)
│   └── etapesDevPlante (Growth Stages)
├── commandes (Orders)
│   └── produits (Products)
├── progressionCours (Course Progress)
│   └── cours (Courses)
├── scores (Game Scores)
│   └── jeux (Games)
├── notifications (Notifications)
├── paniers (Shopping Carts)
├── identificationsPlantes (Plant ID)
└── sessions (User Sessions)

administrateurs (Admins)
└── Full system access
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user

### Collections (All require authentication)
- `GET /api/collections/:collection` - Get all documents
- `GET /api/collections/:collection/:id` - Get single document
- `POST /api/collections/:collection` - Create document
- `PATCH /api/collections/:collection/:id` - Update document
- `DELETE /api/collections/:collection/:id` - Delete document

### Available Collections
```
administrateurs, adressesLivraison, alarmes, alertes, clients,
commandes, cours, etapesDevPlante, examens, feedbacks,
historiqueArrosage, historiqueMesures, identificationsPlantes,
jeux, notifications, paiements, paniers, potsConnectes,
produits, progressionCours, reclamations, recommandations,
scores, sessions, tentativesExamen
```

---

## 🚀 Connection Status

✅ **Backend Server:** http://localhost:4000  
✅ **Frontend App:** http://localhost:5173  
✅ **MongoDB:** mongodb://localhost:27017/plateformeDB  
✅ **All Models:** 13 Mongoose schemas created  
✅ **All Collections:** 25 collections imported  
✅ **Total Documents:** 73 documents loaded  

---

## 📝 Testing Commands

```bash
# Test database connection
node test-db-connection.js

# Test API endpoints (requires running server)
node test-api.js

# Check database contents
node check-db.js

# Import/Re-import data
npm run import:json

# Start development servers
npm run dev:server  # Backend on port 4000
npm run dev        # Frontend on port 5173
```

---

## 🔐 Security Notes

- All collection endpoints require JWT authentication
- Passwords are hashed using bcryptjs
- JWT tokens expire after 2 hours
- Admin routes require `requireRole(['admin'])` middleware

---

## 📊 Data Summary

| Category | Collections | Documents |
|----------|-------------|-----------|
| User Management | 2 | 4 |
| IoT System | 5 | 16 |
| Learning | 4 | 11 |
| Gamification | 2 | 7 |
| E-Commerce | 5 | 12 |
| System Features | 7 | 17 |
| **TOTAL** | **25** | **73** |

---

Generated: February 2, 2026  
Database: plateformeDB  
Environment: Development
