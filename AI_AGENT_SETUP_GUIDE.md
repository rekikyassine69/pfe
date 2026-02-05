# AI Plant Care Agent - Setup Guide

## Overview
I've successfully added an AI Agent feature to your website that:
1. Takes the plant name identified by the recognition AI
2. Queries a database of plant care information
3. Displays ideal humidity (%), luminosity (lux), and watering frequency on the site

## Files Created/Modified

### 1. **New Model** - `server/models/PlantInfo.js`
- Defines the schema for storing plant care information
- Includes fields for:
  - Humidity (min, max, ideal in %)
  - Luminosity (min, max, ideal in lux)
  - Watering frequency and interval days
  - Temperature requirements
  - Additional info (difficulty, toxicity, description)

### 2. **API Endpoints** - `server/routes/recognition.js` (Updated)
Added two new endpoints for the AI agent:

**GET `/api/recognition/plant-info/:plantName`**
- Retrieves plant care information by plant name
- Case-insensitive search
- Returns formatted care requirements

**POST `/api/recognition/plant-info`**
- Alternative POST endpoint for plant info queries
- Accepts plantName in request body
- Useful for batch requests or complex queries

### 3. **Frontend Service** - `src/app/services/api.ts` (Updated)
- Added `getPlantInfo(plantName: string)` function
- Calls the plant-info endpoint with proper URL encoding

### 4. **UI Component** - `src/app/components/pages/RecognitionPage.tsx` (Updated)
Enhanced the recognition page with:
- Automatic plant care info fetching after identification
- Three-column care requirements display:
  - **Humidity**: Shows ideal %, min-max range
  - **Luminosity**: Shows ideal lux, description, min-max range
  - **Watering**: Shows frequency, description, interval days
- Additional info section showing difficulty level and toxicity
- Beautiful UI with color-coded icons (blue for humidity, yellow for light, green for watering)

### 5. **Seed Script** - `server/scripts/seed-plants.mjs`
- Pre-populated database with 10 common plants:
  - Tomate (Tomato)
  - Basilic (Basil)
  - Menthe (Mint)
  - Rose
  - Orchidée (Orchid)
  - Pothos
  - Monstera
  - Cactus
  - Philodendron
  - Aloe Vera
- Each plant includes complete care requirements

## Setup Instructions

### Step 1: Seed the Plant Database
Run the seed script to populate your MongoDB database with plant care information:

```bash
node server/scripts/seed-plants.mjs
```

You should see output like:
```
Connected to MongoDB
Cleared existing plant data
Successfully inserted 10 plants
✓ Tomate (Solanum lycopersicum)
✓ Basilic (Ocimum basilicum)
... (more plants)
Seeding completed successfully!
```

### Step 2: Start Your Application
Make sure your server and client are running:

```bash
npm run dev:server   # Terminal 1
npm run dev          # Terminal 2
```

### Step 3: Test the Feature

1. Go to the "Reconnaissance par IA" (AI Recognition) page
2. Upload an image of a plant (or use the test images)
3. Once the plant is identified, the system will:
   - Show the plant name and confidence score
   - Fetch plant care information from the database
   - Display a beautiful "Conditions de soins idéales" (Ideal care conditions) section with:
     - **Humidité du sol** (Soil Humidity): Ideal % and min-max range
     - **Luminosité** (Luminosity): Ideal lux and description
     - **Arrosage** (Watering): Frequency and interval days
   - Show additional info like difficulty level and toxicity

## API Response Format

When the plant info is successfully fetched, you'll receive:

```json
{
  "success": true,
  "plant": {
    "commonNames": ["Tomate", "Tomato"],
    "scientificName": "Solanum lycopersicum",
    "description": "...",
    "difficulty": "Intermédiaire",
    "toxicity": "Non-toxique",
    "careRequirements": {
      "humidity": {
        "min": 50,
        "max": 70,
        "ideal": 60,
        "unit": "%"
      },
      "luminosity": {
        "min": 2000,
        "max": 5000,
        "ideal": 3500,
        "description": "Lumière directe du soleil...",
        "unit": "lux"
      },
      "watering": {
        "frequency": "Tous les 2-3 jours",
        "description": "...",
        "minIntervalDays": 2,
        "maxIntervalDays": 3
      },
      "temperature": {
        "min": 15,
        "max": 28,
        "ideal": 21,
        "unit": "°C"
      }
    }
  }
}
```

## Error Handling

If a plant is not found in the database:
- The page will still display the recognition results
- But the care information section won't appear
- An error will be logged to console but won't break the UI

## Adding More Plants

To add more plants to your database, edit `server/scripts/seed-plants.mjs` and add new entries to the `plantData` array. Each plant should have:

```javascript
{
  commonNames: ["Plant Name", "English Name"],
  scientificName: "Genus species",
  description: "Description...",
  difficulty: "Facile|Intermédiaire|Difficile",
  toxicity: "Non-toxique|...",
  origin: "...",
  careRequirements: {
    humidity: { min: X, max: Y, ideal: Z },
    luminosity: { min: X, max: Y, ideal: Z, description: "..." },
    watering: { 
      frequency: "...", 
      description: "...", 
      minIntervalDays: X, 
      maxIntervalDays: Y 
    },
    temperature: { min: X, max: Y, ideal: Z }
  }
}
```

Then run the seed script again to update the database.

## Features

✅ AI plant recognition with disease detection
✅ Automatic care information lookup by plant name
✅ Beautiful UI displaying:
  - Ideal soil humidity (%)
  - Ideal luminosity (lux)
  - Watering frequency
  - Temperature requirements
  - Difficulty level
  - Toxicity information
✅ Responsive design (works on mobile and desktop)
✅ French language support
✅ Error handling and fallbacks

## Troubleshooting

**Plant info not showing after identification:**
1. Check browser console for errors
2. Make sure the seed script has been run
3. Verify the plant name matches one in the database (case-insensitive search)
4. Check MongoDB connection in logs

**"Aucune information trouvée" error:**
- The plant identified might not be in the database
- Add the plant to the seed script and re-run

**API endpoint returning 404:**
- Make sure the server is running on the correct port (default: 4000)
- Verify the `VITE_API_URL` in your frontend config

## Next Steps

1. Expand the plant database with more species
2. Add plant images to each plant info entry
3. Create a management page for admins to add/edit plants
4. Add seasonal care tips
5. Integrate with IoT sensors from connected pots
6. Add plant identification history tracking

Enjoy your new AI Plant Care Agent! 🌱
