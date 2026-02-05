import { Router } from "express";
import RecognitionAnalysis from "../models/RecognitionAnalysis.js";
import Plant from "../models/Plant.js";
import PlantInfo from "../models/PlantInfo.js";

const router = Router();

const normalizeBaseUrl = (url) => url.replace(/\/+$/, "");

const extractBase64 = (image) => {
  if (typeof image !== "string") return null;
  const match = image.match(/^data:image\/[a-zA-Z0-9+.-]+;base64,(.+)$/);
  if (match) return match[1];
  return image;
};

const normalizeImages = (image, images) => {
  if (Array.isArray(images) && images.length > 0) {
    return images.map(extractBase64).filter(Boolean);
  }
  if (image) {
    const base64 = extractBase64(image);
    return base64 ? [base64] : [];
  }
  return [];
};

const normalizeConfidence = (value) => {
  if (value === undefined || value === null) return 0;
  if (value <= 1) return Math.round(value * 100);
  return Math.round(value);
};

const getFirstSuggestion = (data) => {
  const suggestions =
    data?.result?.classification?.suggestions ||
    data?.result?.classification?.predictions ||
    data?.result?.predictions ||
    data?.result?.suggestions ||
    data?.suggestions ||
    [];
  return Array.isArray(suggestions) ? suggestions[0] : null;
};

const buildSummary = (data, mode) => {
  const suggestion = getFirstSuggestion(data) || {};
  const name =
    suggestion?.name ||
    suggestion?.label ||
    suggestion?.species?.name ||
    suggestion?.taxon?.name ||
    suggestion?.scientific_name ||
    "Résultat inconnu";
  const scientificName =
    suggestion?.scientific_name ||
    suggestion?.species?.scientific_name ||
    suggestion?.taxon?.scientific_name ||
    "";
  const confidence = normalizeConfidence(
    suggestion?.probability || suggestion?.score || suggestion?.confidence || data?.result?.confidence
  );

  const diseaseSuggestions =
    data?.result?.disease?.suggestions ||
    data?.result?.health?.diseases ||
    data?.result?.health?.suggestions ||
    [];
  const diseases = Array.isArray(diseaseSuggestions)
    ? diseaseSuggestions
        .map((item) => item?.name || item?.label || item)
        .filter(Boolean)
    : [];

  const status = diseases.length > 0 ? "warning" : "healthy";

  return {
    name,
    scientificName,
    confidence,
    diseases,
    status,
    mode,
  };
};

const forwardIdentification = async ({
  res,
  apiUrl,
  apiKey,
  payload,
  mode,
  imageForStorage,
}) => {
  if (!apiKey) {
    return res.status(500).json({ message: "Missing API key configuration." });
  }

  const response = await fetch(`${normalizeBaseUrl(apiUrl)}/identification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  if (!response.ok) {
    return res
      .status(response.status)
      .json({ message: text || "External API request failed" });
  }

  try {
    const data = JSON.parse(text);
    const summary = buildSummary(data, mode);
    const image =
      imageForStorage ??
      (Array.isArray(payload.images) ? payload.images[0] : payload.image);
    await RecognitionAnalysis.create({
      mode,
      image,
      ...summary,
      response: data,
    });

    if (mode === "plant") {
      try {
        const plantName = summary.name || "Plante identifiée";
        const plantSpecies = summary.scientificName || summary.name;
        
        // Check if plant already exists by name or species
        const existingPlant = await Plant.findOne({
          $or: [
            { name: { $regex: `^${plantName}$`, $options: "i" } },
            { species: { $regex: `^${plantSpecies}$`, $options: "i" } },
          ],
        });

        if (existingPlant) {
          console.log(`✓ Plant already exists: ${plantName} (ID: ${existingPlant._id})`);
        } else {
          const plantData = {
            name: plantName,
            species: plantSpecies,
            notes: `Analyse IA (${summary.confidence ?? "?"}%)`,
          };
          console.log("Creating new plant with data:", plantData);
          await Plant.create(plantData);
          console.log("✓ Plant saved successfully");
        }
      } catch (plantError) {
        console.error("Error saving plant to database:", plantError);
      }
    }

    return res.status(200).json(data);
  } catch {
    return res.status(200).send(text);
  }
};

router.post("/plant", async (req, res) => {
  const images = normalizeImages(req.body?.image, req.body?.images);
  if (!images.length) {
    return res.status(400).json({ message: "Image is required." });
  }

  const apiUrl = process.env.PLANT_ID_API_URL ?? "https://plant.id/api/v3";
  const apiKey = process.env.PLANT_ID_API_KEY;

  const { image, images: _images, ...rest } = req.body || {};
  const imageForStorage = image || (Array.isArray(_images) ? _images[0] : undefined);

  const payload = {
    images,
    ...rest,
  };

  return forwardIdentification({
    res,
    apiUrl,
    apiKey,
    payload,
    mode: "plant",
    imageForStorage,
  });
});

router.get("/recent", async (req, res) => {
  const limit = Number(req.query.limit ?? 6);
  const analyses = await RecognitionAnalysis.find()
    .sort({ createdAt: -1 })
    .limit(Number.isNaN(limit) ? 6 : limit);
  res.json(
    analyses.map((analysis) => ({
      id: analysis._id,
      mode: analysis.mode,
      image: analysis.image,
      name: analysis.name,
      scientificName: analysis.scientificName,
      confidence: analysis.confidence,
      diseases: analysis.diseases,
      status: analysis.status,
      createdAt: analysis.createdAt,
    }))
  );
});

// AI Agent endpoint: Get plant care information by plant name
router.get("/plant-info/:plantName", async (req, res) => {
  try {
    const { plantName } = req.params;

    if (!plantName || plantName.trim() === "") {
      return res.status(400).json({ message: "Plant name is required" });
    }

    // Normalize special characters (× to x, etc.) for better matching
    const normalizedPlantName = plantName
      .replace(/×/g, "x")
      .replace(/·/g, "")
      .replace(/\s+/g, " ")
      .trim();

    console.log(`🔍 Searching for plant: "${plantName}" (normalized: "${normalizedPlantName}")`);

    // Search for plant info by common name or scientific name (case-insensitive)
    // Try multiple search strategies
    let plantInfo = await PlantInfo.findOne({
      $or: [
        { commonNames: { $regex: normalizedPlantName, $options: "i" } },
        { scientificName: { $regex: normalizedPlantName, $options: "i" } },
      ],
    });

    // If not found, try with original plant name
    if (!plantInfo) {
      plantInfo = await PlantInfo.findOne({
        $or: [
          { commonNames: { $regex: plantName, $options: "i" } },
          { scientificName: { $regex: plantName, $options: "i" } },
        ],
      });
    }

    // If still not found, try partial matching on last few words
    if (!plantInfo) {
      const parts = normalizedPlantName.split(" ");
      if (parts.length > 1) {
        const lastWords = parts.slice(-2).join(" ");
        plantInfo = await PlantInfo.findOne({
          $or: [
            { commonNames: { $regex: lastWords, $options: "i" } },
            { scientificName: { $regex: lastWords, $options: "i" } },
          ],
        });
      }
    }

    if (!plantInfo) {
      console.log(`❌ Plant not found: ${plantName}`);
      return res.status(404).json({
        message: `Aucune information trouvée pour la plante: ${plantName}`,
        plantName,
      });
    }

    console.log(`✅ Found plant: ${plantInfo.commonNames[0]} (${plantInfo.scientificName})`);

    // Return formatted plant care information
    res.json({
      success: true,
      plant: {
        commonNames: plantInfo.commonNames,
        scientificName: plantInfo.scientificName,
        description: plantInfo.description,
        difficulty: plantInfo.difficulty,
        toxicity: plantInfo.toxicity,
        origin: plantInfo.origin,
        careRequirements: {
          humidity: {
            min: plantInfo.careRequirements.humidity.min,
            max: plantInfo.careRequirements.humidity.max,
            ideal: plantInfo.careRequirements.humidity.ideal,
            unit: "%",
          },
          luminosity: {
            min: plantInfo.careRequirements.luminosity.min,
            max: plantInfo.careRequirements.luminosity.max,
            ideal: plantInfo.careRequirements.luminosity.ideal,
            description: plantInfo.careRequirements.luminosity.description,
            unit: "lux",
          },
          watering: {
            frequency: plantInfo.careRequirements.watering.frequency,
            description: plantInfo.careRequirements.watering.description,
            minIntervalDays: plantInfo.careRequirements.watering.minIntervalDays,
            maxIntervalDays: plantInfo.careRequirements.watering.maxIntervalDays,
          },
          temperature: {
            min: plantInfo.careRequirements.temperature.min,
            max: plantInfo.careRequirements.temperature.max,
            ideal: plantInfo.careRequirements.temperature.ideal,
            unit: "°C",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching plant info:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des informations de la plante",
      error: error.message,
    });
  }
});

// Alternative: POST endpoint to get plant info (useful for batch requests or complex queries)
router.post("/plant-info", async (req, res) => {
  try {
    const { plantName } = req.body;

    if (!plantName || plantName.trim() === "") {
      return res.status(400).json({ message: "Plant name is required" });
    }

    // Search for plant info
    const plantInfo = await PlantInfo.findOne({
      $or: [
        { commonNames: { $regex: plantName, $options: "i" } },
        { scientificName: { $regex: plantName, $options: "i" } },
      ],
    });

    if (!plantInfo) {
      return res.status(404).json({
        message: `Aucune information trouvée pour la plante: ${plantName}`,
        plantName,
      });
    }

    res.json({
      success: true,
      plant: {
        commonNames: plantInfo.commonNames,
        scientificName: plantInfo.scientificName,
        description: plantInfo.description,
        difficulty: plantInfo.difficulty,
        toxicity: plantInfo.toxicity,
        origin: plantInfo.origin,
        careRequirements: {
          humidity: {
            min: plantInfo.careRequirements.humidity.min,
            max: plantInfo.careRequirements.humidity.max,
            ideal: plantInfo.careRequirements.humidity.ideal,
            unit: "%",
          },
          luminosity: {
            min: plantInfo.careRequirements.luminosity.min,
            max: plantInfo.careRequirements.luminosity.max,
            ideal: plantInfo.careRequirements.luminosity.ideal,
            description: plantInfo.careRequirements.luminosity.description,
            unit: "lux",
          },
          watering: {
            frequency: plantInfo.careRequirements.watering.frequency,
            description: plantInfo.careRequirements.watering.description,
            minIntervalDays: plantInfo.careRequirements.watering.minIntervalDays,
            maxIntervalDays: plantInfo.careRequirements.watering.maxIntervalDays,
          },
          temperature: {
            min: plantInfo.careRequirements.temperature.min,
            max: plantInfo.careRequirements.temperature.max,
            ideal: plantInfo.careRequirements.temperature.ideal,
            unit: "°C",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching plant info:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des informations de la plante",
      error: error.message,
    });
  }
});

export default router;
