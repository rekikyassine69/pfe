import { Router } from "express";
import RecognitionAnalysis from "../models/RecognitionAnalysis.js";
import Plant from "../models/Plant.js";

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
        const plantData = {
          name: summary.name || "Plante identifiée",
          species: summary.scientificName || summary.name,
          notes: `Analyse IA (${summary.confidence ?? "?"}%)`,
        };
        console.log("Creating plant with data:", plantData);
        await Plant.create(plantData);
        console.log("Plant saved successfully");
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

export default router;
