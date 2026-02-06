# 📦 Synchronisation des Commandes - Guide Complet

## Vue d'ensemble

Vous avez désormais un système de synchronisation complète des commandes entre:
- **Interface Utilisateur** (OrdersPage) - Affichage en temps réel des commandes
- **Interface Admin** (AdminOrdersPage) - Gestion et mise à jour des commandes
- **Système de Notifications** - Notifications automatiques lors des changements de statut

---

## 🎯 Flux de Synchronisation

```
┌─────────────────────────────────────────────────────────────────┐
│                     UTILISATEUR (User Interface)                 │
├──────────────────────────────────────────────────────────────────┤
│ 1. Affiche ses commandes dans OrdersPage                         │
│ 2. Voit le statut avec timeline                                  │
│ 3. Reçoit notifications lors de mises à jour                      │
│ 4. Auto-refresh toutes les 30 secondes                           │
│ 5. Peut cliquer "Actualiser" manuellement                        │
└──────────────────────────────────────────────────────────────────┘
                               ↓
                    API (GET /api/shop/orders)
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│                    ADMINISTRATEUR (Admin Interface)              │
├──────────────────────────────────────────────────────────────────┤
│ 1. Voit toutes les commandes avec filtres                        │
│ 2. Peut modifier le statut                                        │
│ 3. Peut ajouter un numéro de suivi                               │
│ 4. Notifications auto-envoyées au client                         │
│ 5. Statistiques en temps réel                                    │
└──────────────────────────────────────────────────────────────────┘
                               ↓
                  API (PATCH /api/admin/orders/:id)
                               |
                    Créer notification en DB
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│                  UTILISATEUR (Reçoit notification)               │
├──────────────────────────────────────────────────────────────────┤
│ 1. Toast de notification (optionnel)                             │
│ 2. Badge de notification avec compteur                           │
│ 3. Voir détails dans le panel de notifications                   │
│ 4. OrdersPage se rafraîchit automatiquement                      │
│ 5. Peut voir le nouveau statut et le numéro de suivi            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📋 Statuts de Commande et Transitions

### États Disponibles

| Statut | Icône | Couleur | Description |
|--------|-------|--------|-------------|
| **en attente** | ⏱️ | Jaune | Nouvelle commande, en attente de traitement |
| **en cours** | 🚚 | Bleu | En préparation/expédition |
| **livree** | ✅ | Vert | Livrée avec succès |
| **annulee** | ❌ | Rouge | Annulée |

### Transitions Possibles

```
en attente → en cours → livree
    ↓           ↓          ↓
  (annulee)  (annulee)  (---)
```

- `en attente` peut aller à: `en cours` ou `annulee`
- `en cours` peut aller à: `livree` ou `annulee`
- `livree` ne peut pas être modifiée
- `annulee` ne peut pas être modifiée

---

## 🔄 Synchronisation en Temps Réel

### Côté Utilisateur (OrdersPage)

**Polling (Sondage)**
```typescript
// Refresh automatique toutes les 30 secondes
const interval = setInterval(loadOrders, 30000);

// Ou actualisation manuelle
<button onClick={handleRefresh}>Actualiser</button>
```

**Affichage en Temps Réel**
- Timeline de statut
- Numéro de suivi (si disponible)
- Dates de passage (commande, livraison)
- Estimation automatique

### Côté Admin (AdminOrdersPage)

**Chargement des Commandes**
```typescript
const [orders, setOrders] = useState<Order[]>([]);
const [stats, setStats] = useState<any>(null);

const loadOrders = async () => {
  const [orderData, statsData] = await Promise.all([
    api.adminGetOrders({ statut, search }),
    api.adminGetOrderStats()
  ]);
  setOrders(orderData);
  setStats(statsData);
};
```

**Mise à Jour de Statut**
```typescript
const handleUpdateOrderStatus = async (
  orderId: string,
  newStatus: string,
  trackingNumber?: string
) => {
  await api.adminUpdateOrder(orderId, {
    statut: newStatus,
    numeroSuivi: trackingNumber
  });
  // Notification auto-créée + OrdersPage se mettra à jour
};
```

---

## 🔔 Système de Notifications

### Type de Notifications Envoyées

#### Lors d'une mise à jour en "en cours":
```json
{
  "type": "commande",
  "titre": "Commande en cours de traitement",
  "message": "Votre commande #XXXXX est maintenant en cours de préparation.",
  "priorite": "normale"
}
```

#### Lors d'une mise à jour en "livree":
```json
{
  "type": "commande",
  "titre": "Commande livrée",
  "message": "Votre commande #XXXXX a été livrée avec succès!",
  "priorite": "haute"
}
```

#### Lors d'une mise à jour en "annulee":
```json
{
  "type": "commande",
  "titre": "Commande annulée",
  "message": "Votre commande #XXXXX a été annulée. Contactez-nous pour plus d'informations.",
  "priorite": "haute"
}
```

### Affichage des Notifications

Les notifications s'affichent dans le **NotificationBell**:
- Badge rouge avec compteur
- Panel déroulant avec liste des notifications
- Actions: marquer comme lu, supprimer

---

## 📊 Statistiques Admin

### Disponibles dans le Dashboard

```typescript
GET /api/admin/stats/dashboard

Retourne:
- totalUsers: Nombre de clients
- totalOrders: Nombre total de commandes
- totalPots: Nombre de pots connectés
- totalCourses: Nombre de cours publiés
- totalGames: Nombre de jeux actifs
- pendingOrders: Commandes en attente
- activePots: Pots en ligne
- totalRevenue: Revenu total
- recentOrders: Dernières 5 commandes

GET /api/admin/stats/orders

Retourne:
- total: Total des commandes
- enAttente: Nombre en attente
- enCours: Nombre en cours
- livree: Nombre livrées
- annulee: Nombre annulées
- revenue: Revenu généré
```

---

## 🛠️ Implémentation dans l'App

### 1. Ajouter les Providers

Dans `App.tsx` ou `main.tsx`:

```tsx
import { NotificationsProvider } from '@/app/hooks/useNotifications';

function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <CartProvider>
          {/* Routes */}
        </CartProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}
```

### 2. Ajouter NotificationBell dans la Navigation

```tsx
import { NotificationBell } from '@/app/components/NotificationBell';

function Header() {
  const { user } = useAuth();
  
  return (
    <header>
      {/* Autres éléments */}
      {user && <NotificationBell />}
    </header>
  );
}
```

### 3. Utiliser OrdersPage dans les Routes

```tsx
import { OrdersPage } from '@/app/components/pages/OrdersPage';

// Dans votre router:
<Route path="/commandes" element={
  <RequireAuth>
    <OrdersPage />
  </RequireAuth>
} />
```

### 4. Utiliser AdminOrdersPage dans les Routes Admin

```tsx
import { AdminOrdersPage } from '@/app/components/pages/AdminOrdersPage';

// Dans votre router:
<Route path="/admin/commandes" element={
  <RequireAuth>
    <RequireAdmin>
      <AdminOrdersPage />
    </RequireAdmin>
  </RequireAuth>
} />
```

---

## 🎨 Fonctionnalités de la Page Commandes Utilisateur

### Vue Liste
- ✅ Affichage de toutes les commandes
- ✅ Statut avec icône et couleur
- ✅ Prix total en évidence
- ✅ Nombre d'articles
- ✅ Date relative ("il y a 2 jours")
- ✅ Bouton d'actualisation

### Vue Détails (Expansion)
- ✅ Timeline de suivi avec icônes
- ✅ Statut de chaque étape
- ✅ Numéro de suivi (si disponible)
- ✅ Liste détaillée des produits
- ✅ Adresse de livraison complète
- ✅ Mode de paiement
- ✅ Section d'aide

---

## 🎨 Fonctionnalités de la Page Admin

### Vue Liste
- ✅ Tableau avec colonnes:
  - Numéro de commande
  - Client (nom + email)
  - Montant
  - Statut
  - Date relative
- ✅ Filtres: statut, recherche client
- ✅ Actions rapides: Voir, Modifier, Supprimer

### Vue Détails (Expansion)
- ✅ Informations client
- ✅ Adresse de livraison
- ✅ Liste détaillée des articles avec prix
- ✅ **Gestion du statut**:
  - Dropdown pour sélectionner nouveau statut
  - Champ optionnel de numéro de suivi (si "en cours")
  - Boutons Valider/Annuler
- ✅ Numéro de suivi actuel (lecture seule)
- ✅ Chronologie (dates de création/livraison)

### Statistiques
- ✅ Cartes affichant:
  - Total commandes
  - Nombre en attente
  - Nombre en cours
  - Nombre livrées
  - Revenu total

### Synchronisation
- ✅ Auto-refresh toutes les 30 secondes
- ✅ Bouton d'actualisation manuel
- ✅ Les changements se voient immédiatement
- ✅ L'utilisateur reçoit une notification

---

## 🔐 Sécurité

### Permissions

| Route | Authentification | Rôle |
|-------|------------------|------|
| `GET /api/shop/orders` | ✅ Requise | Client |
| `GET /api/admin/orders` | ✅ Requise | Admin |
| `PATCH /api/admin/orders/:id` | ✅ Requise | Admin |
| `DELETE /api/admin/orders/:id` | ✅ Requise | Admin |
| `GET /api/notifications` | ✅ Requise | Client |

### Validation

- L'admin peut seulement modifier les commandes "en attente" ou "en cours"
- Les commandes "livrées" ou "annulées" sont en lecture seule
- Les utilisateurs ne voient que leurs propres commandes
- Les admins voient toutes les commandes

---

## 🧪 Tests

### Tester le Flux Complet

1. **En tant qu'utilisateur:**
   - Naviguer vers `/commandes`
   - Vérifier que les commandes s'affichent
   - Cliquer "Actualiser"
   - Vérifier l'update de la liste

2. **En tant qu'admin:**
   - Naviguer vers `/admin/commandes`
   - Vérifier que toutes les commandes s'affichent
   - Cliquer "Voir" sur une commande
   - Cliquer "Modifier"
   - Changer le statut (ex: "en attente" → "en cours")
   - Ajouter un numéro de suivi
   - Cliquer "Valider"

3. **Vérifier la notification:**
   - En tant que client, aller à la cloche de notification
   - Vérifier l'apparition d'une nouvelle notification
   - Elle devrait dire "Commande en cours de traitement"
   - Le compteur de notifications augmente

4. **Vérifier la synchronisation:**
   - Rafraîchir la page commandes du client
   - Le statut doit être mis à jour
   - Le numéro de suivi doit s'afficher
   - La timeline doit changer

---

## 🚀 Optimisations Futures

### WebSockets (Pour du temps réel vrai)

```typescript
// À implémenter avec Socket.io
io.on('connection', (socket) => {
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
  });
});

// Émettre quand une commande change
io.to(`user-${clientId}`).emit('order-updated', updatedOrder);
```

### Cache et Données Hors Ligne

```typescript
// Utiliser localforage pour caching
const ordersCache = await localforage.getItem('orders');
```

### Notifications Push (Service Worker)

```typescript
// Enregistrer le service worker
navigator.serviceWorker.register('/sw.js');

// Envoyer des notifications push
serviceWorkerRegistration.showNotification('Commande mise à jour', {
  body: 'Votre commande est en route!'
});
```

---

## 📞 Support

Pour des questions ou des améliorations, consulter la documentation complète dans `ADMIN_USER_SYNC_GUIDE.md`.

---

## ✅ Checklist d'Intégration

- [ ] NotificationsProvider ajouté dans App.tsx
- [ ] NotificationBell ajouté dans la navigation
- [ ] Routes pour OrdersPage créées
- [ ] Routes pour AdminOrdersPage créées
- [ ] Routes protégées avec authentification
- [ ] Routes admin protégées avec rôle
- [ ] Tests manuels du flux complet
- [ ] Vérification des notifications
- [ ] Vérification de la synchronisation
- [ ] Vérification des permissions
- [ ] Tests sur mobile/responsive
- [ ] Performance (30s polling acceptable?)

---

**Prêt pour la production!** 🚀
