# 📊 AI Plant Care Agent - Architecture

## System Architecture

```
FRONTEND (React/TypeScript)
│
├─ RecognitionPage.tsx
│  ├─ Upload plant image
│  ├─ Call api.identifyPlant()
│  ├─ Get plant name from AI
│  ├─ Call api.getPlantInfo(plantName) ◄── NEW!
│  └─ Display care requirements
│
└─ services/api.ts
   └─ getPlantInfo(plantName) ◄── NEW FUNCTION!
      └─ Calls /api/recognition/plant-info/:plantName

         │
         │ HTTP GET Request
         ▼

BACKEND (Express/Node.js)
│
├─ recognition.js
│  ├─ /api/recognition/plant ◄── EXISTING
│  ├─ /api/recognition/recent ◄── EXISTING
│  ├─ /api/recognition/plant-info/:plantName ◄── NEW!
│  └─ POST /api/recognition/plant-info ◄── NEW!
│
├─ routes/
│  └─ recognition.js
│     └─ Queries PlantInfo.findOne({commonNames: ...})

         │
         │ Database Query
         ▼

DATABASE (MongoDB)
│
└─ collections/PlantInfo ◄── NEW COLLECTION!
   ├─ commonNames: ["Tomate", "Tomato"]
   ├─ scientificName: "Solanum lycopersicum"
   ├─ careRequirements: {
   │   ├─ humidity: { min, max, ideal } ◄── KEY!
   │   ├─ luminosity: { min, max, ideal, lux } ◄── KEY!
   │   ├─ watering: { frequency, minDays, maxDays } ◄── KEY!
   │   └─ temperature: { min, max, ideal }
   ├─ difficulty: "Intermédiaire"
   └─ toxicity: "Non-toxique"
```

## Data Flow

```
1. USER ACTION
   └─ Upload plant image

2. RECOGNITION
   └─ AI identifies plant → "Tomate"

3. LOOKUP (NEW!)
   └─ Query: db.PlantInfo.findOne({commonNames: /Tomate/i})
   └─ Returns: Complete care requirements

4. DISPLAY (NEW!)
   └─ Show:
      • Humidity: 60% (50-70%)
      • Luminosity: 3500 lux (2000-5000)
      • Watering: Every 2-3 days
      • Temperature: 21°C (15-28°C)
      • Difficulty: Intermédiaire
      • Toxicity: Non-toxique

5. USER BENEFIT
   └─ Knows exactly how to care for their plant! 🌱
```

## Database Schema

```javascript
PlantInfo {
  _id: ObjectId,
  commonNames: ["Tomate", "Tomato"],
  scientificName: "Solanum lycopersicum",
  description: "...",
  difficulty: "Intermédiaire",
  toxicity: "Non-toxique",
  origin: "Amérique du Sud",
  bloomingSeason: "Été",
  
  careRequirements: {
    humidity: {
      min: 50,        // ← MINIMUM %
      max: 70,        // ← MAXIMUM %
      ideal: 60       // ← IDEAL %
    },
    luminosity: {
      min: 2000,      // ← MINIMUM lux
      max: 5000,      // ← MAXIMUM lux
      ideal: 3500,    // ← IDEAL lux
      description: "Lumière directe du soleil..."
    },
    watering: {
      frequency: "Tous les 2-3 jours",
      minIntervalDays: 2,    // ← MIN DAYS
      maxIntervalDays: 3,    // ← MAX DAYS
      description: "Gardez le sol humide..."
    },
    temperature: {
      min: 15,        // ← MINIMUM °C
      max: 28,        // ← MAXIMUM °C
      ideal: 21       // ← IDEAL °C
    }
  },
  
  createdAt: ISODate(...),
  updatedAt: ISODate(...)
}
```

## UI Component Flow

```
RECOGNITION RESULTS
│
├─ Plant Name & Confidence
│
├─ Health Status & Care Level
│
├─ Recommendations (existing)
│
├─ Diseases (if any) (existing)
│
└─ NEW: PLANT CARE CONDITIONS
   │
   ├─ Column 1: HUMIDITY
   │  ├─ Icon: 💧 (blue)
   │  ├─ Ideal: 60%
   │  └─ Range: 50%-70%
   │
   ├─ Column 2: LUMINOSITY
   │  ├─ Icon: 🌞 (yellow)
   │  ├─ Ideal: 3500 lux
   │  ├─ Description: Full sun
   │  └─ Range: 2000-5000 lux
   │
   └─ Column 3: WATERING
      ├─ Icon: 💧 (green)
      ├─ Frequency: Every 2-3 days
      ├─ Description: Keep soil moist
      └─ Interval: 2-3 days
```

## Key Features

```
✅ Smart Search
   └─ Case-insensitive matching on plant names
   └─ Searches commonNames AND scientificName

✅ Responsive Design
   └─ 3 columns on desktop
   └─ Stacks on mobile
   └─ Beautiful color-coded sections

✅ Graceful Degradation
   └─ If plant not in DB, care section just doesn't show
   └─ No errors, UI still works perfectly

✅ Easy to Extend
   └─ Add temperature? Just add to schema
   └─ Add more plants? Just run seed script
   └─ Add more fields? Modify PlantInfo model

✅ Performance
   └─ MongoDB indexes on commonNames & scientificName
   └─ Fast lookups even with 1000+ plants
```

## File Relationships

```
src/app/components/pages/
└─ RecognitionPage.tsx
   ├─ Imports api.ts
   ├─ Calls api.identifyPlant()
   └─ Calls api.getPlantInfo() ◄── NEW

src/app/services/
└─ api.ts
   └─ getPlantInfo(plantName) ◄── NEW FUNCTION

server/routes/
└─ recognition.js
   ├─ Imports PlantInfo model
   ├─ GET /api/recognition/plant-info/:plantName ◄── NEW
   └─ POST /api/recognition/plant-info ◄── NEW

server/models/
├─ PlantInfo.js ◄── NEW MODEL
├─ Plant.js (existing)
└─ RecognitionAnalysis.js (existing)

server/scripts/
└─ seed-plants.mjs ◄── NEW SEEDER
   └─ Populates PlantInfo with initial data
```

## Environment & Configuration

```
Required:
├─ MongoDB URI
├─ PLANT_ID_API_KEY (for recognition)
└─ PLANT_ID_API_URL (for recognition)

Node Modules:
├─ mongoose (already installed)
├─ express (already installed)
└─ (all dependencies already in package.json)

No Additional Installs Needed! ✅
```

---

**The AI Plant Care Agent is fully integrated and ready to use!** 🚀
