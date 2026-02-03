# Configuration Email avec Mailtrap pour Smart Plant Care

## ✅ Avantages de Mailtrap
- ✅ **Gratuit** (jusqu'à 500 emails/jour)
- ✅ **Pas besoin d'authentification 2FA**
- ✅ **Parfait pour tester** (emails interceptés dans une boîte de test)
- ✅ **Pas d'envoi réel** → Parfait pour le développement
- ✅ **Rapide** et facile à configurer

## 🚀 Setup en 5 minutes

### 1️⃣ Crée un compte Mailtrap
Visite https://mailtrap.io
- Clique "Sign up"
- Utilise ton email ou connecte-toi avec GitHub
- Valide ton email

### 2️⃣ Crée une "Inbox"
- Dashboard Mailtrap
- Clique "Create Inbox"
- Nomme-la : "Smart Plant Care" (ou ce que tu veux)
- Clique "Create"

### 3️⃣ Copie les identifiants
Dans ta nouvelle Inbox, clique l'onglet **"Integrations"** → **"Nodemailer"**

Tu verras :
```javascript
host: "sandbox.smtp.mailtrap.io"
port: 2525
auth: {
  user: "abc123def456",
  pass: "xyz789uvw012"
}
```

### 4️⃣ Mets à jour le .env
Ouvre `.env` et remplace :
```env
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=abc123def456
MAILTRAP_PASS=xyz789uvw012
MAILTRAP_FROM=noreply@smartplantcare.com
```

### 5️⃣ Redémarrer le serveur
```bash
npm run dev:server
```

## 📧 Tester l'envoi

1. Va sur http://localhost:5173/login
2. Clique "Mot de passe oublié ?"
3. Saisir l'email d'un utilisateur (ex: `yessin123rekik@gmail.com`)
4. Clique "Envoyer le lien"
5. Va sur https://mailtrap.io → Ouvre ta Inbox
6. **Vois l'email qui arrive en direct !** 🎉
7. Copie le lien de reset
8. Teste la réinitialisation

## 📍 Où voir les emails
- Dashboard Mailtrap → Ta Inbox → Les emails arrivent en direct
- Tu peux voir : sujet, body HTML, attachments, headers
- Parfait pour déboguer les emails

## 🚀 Passer à la production
Quand tu seras prêt pour la prod, remplace Mailtrap par :
- **SendGrid** (recommandé)
- **AWS SES**
- **Mailgun**
- Ou **Gmail/SMTP personnel**

Pour l'instant, Mailtrap est idéal pour développer ! 🌱

