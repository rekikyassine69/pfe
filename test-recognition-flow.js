import mongoose from "mongoose";
import PlantInfo from "./server/models/PlantInfo.js";
import dotenv from "dotenv";

dotenv.config();

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env file");
  process.exit(1);
}

async function testFlow() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Test 1: Count total plants in database
    const totalPlants = await PlantInfo.countDocuments();
    console.log(`✅ Total plants in database: ${totalPlants}`);

    // Test 2: Search by common name (what AI might return)
    const byCommonName = await PlantInfo.findOne({
      commonNames: { $regex: "Tomate", $options: "i" }
    });
    console.log(`✅ Found by common name "Tomate":`, {
      commonNames: byCommonName?.commonNames,
      scientificName: byCommonName?.scientificName,
      difficulty: byCommonName?.difficulty,
      careRequirements: !!byCommonName?.careRequirements,
    });

    // Test 3: Search by scientific name (what AI might also return)
    const byScientific = await PlantInfo.findOne({
      scientificName: { $regex: "Solanum lycopersicum", $options: "i" }
    });
    console.log(`✅ Found by scientific name "Solanum lycopersicum":`, {
      commonNames: byScientific?.commonNames,
      difficulty: byScientific?.difficulty,
    });

    // Test 4: Check if plant has all care data
    const fullCareData = byCommonName?.careRequirements;
    console.log(`✅ Plant care requirements:`, {
      humidity: !!fullCareData?.humidity,
      luminosity: !!fullCareData?.luminosity,
      watering: !!fullCareData?.watering,
      temperature: !!fullCareData?.temperature,
      humidityIdeal: fullCareData?.humidity?.ideal,
      luminosityDesc: fullCareData?.luminosity?.description,
      wateringFreq: fullCareData?.watering?.frequency,
      temperatureIdeal: fullCareData?.temperature?.ideal,
    });

    // Test 5: Get a plant with all fields
    const plant = await PlantInfo.findOne({ commonNames: { $regex: "Orchid", $options: "i" } });
    if (plant) {
      console.log(`✅ Found plant with all data:`, {
        name: plant.commonNames?.[0],
        scientific: plant.scientificName,
        description: plant.description ? "✓" : "✗",
        difficulty: plant.difficulty ? "✓" : "✗",
        toxicity: plant.toxicity ? "✓" : "✗",
        origin: plant.origin ? "✓" : "✗",
        humidity: plant.careRequirements?.humidity ? "✓" : "✗",
        luminosity: plant.careRequirements?.luminosity ? "✓" : "✗",
        watering: plant.careRequirements?.watering ? "✓" : "✗",
        temperature: plant.careRequirements?.temperature ? "✓" : "✗",
      });
    }

    console.log("\n✅ All tests passed! Database is ready for recommendations.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

testFlow();
