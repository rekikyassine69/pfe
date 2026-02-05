# 🚀 Quick Start - AI Plant Care Agent

## 30-Second Setup

### 1️⃣ Seed the Database
```bash
node server/scripts/seed-plants.mjs
```

### 2️⃣ Start Your App
```bash
# Terminal 1
npm run dev:server

# Terminal 2  
npm run dev
```

### 3️⃣ Test It
- Go to "Reconnaissance par IA" page
- Upload a plant image
- See plant care info appear! ✨

---

## What You Get

After uploading a plant image, you'll see:

```
┌──────────────────────────────────────┐
│  Plant Name: Tomate                  │
│  Confidence: 95%                     │
│                                      │
│  IDEAL CARE CONDITIONS               │
│  ┌────────────────────────────────┐ │
│  │ 💧 Humidité    🌞 Luminosité  │ │
│  │  60% ideal      3500 lux       │ │
│  │  50-70%         Full sun       │ │
│  │                 2000-5000 lux  │ │
│  │                                │ │
│  │ 💧 Arrosage                    │ │
│  │  Tous les 2-3 jours           │ │
│  │  Garder le sol humide         │ │
│  └────────────────────────────────┘ │
│                                      │
│  Difficulty: Intermédiaire           │
│  Toxicity: Non-toxique               │
└──────────────────────────────────────┘
```

---

## The 5 New Components

| File | What It Does |
|------|-------------|
| `PlantInfo.js` | Database model for plant care |
| `seed-plants.mjs` | Populates DB with 10 plants |
| `recognition.js` | Added 2 new API endpoints |
| `api.ts` | Added `getPlantInfo()` function |
| `RecognitionPage.tsx` | Displays care info in UI |

---

## Endpoints

```
GET  /api/recognition/plant-info/Tomate
POST /api/recognition/plant-info
```

Both return humidity, luminosity, watering, and more!

---

## Pre-Seeded Plants

✅ Tomate (Tomato)
✅ Basilic (Basil)
✅ Menthe (Mint)
✅ Rose
✅ Orchidée (Orchid)
✅ Pothos
✅ Monstera
✅ Cactus
✅ Philodendron
✅ Aloe Vera

---

## Want to Add More Plants?

1. Edit `server/scripts/seed-plants.mjs`
2. Add your plant to the `plantData` array
3. Run `node server/scripts/seed-plants.mjs` again

---

## Error? Check:

- ✅ Did you run the seed script?
- ✅ Is MongoDB connected?
- ✅ Is the plant name in the database?
- ✅ Browser console for errors?

---

That's it! Your AI Plant Care Agent is live! 🌿
