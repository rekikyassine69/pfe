import { useEffect, useState } from 'react';
import { Upload, Camera, Search, Sparkles, CheckCircle2, AlertCircle, Info, Droplets, Sun, Leaf } from 'lucide-react';
import { api } from '../../services/api';

type PlantCareInfo = {
  humidity: {
    min: number;
    max: number;
    ideal?: number;
    unit: string;
  };
  luminosity: {
    min?: number;
    max?: number;
    ideal?: number;
    description?: string;
    unit: string;
  };
  watering: {
    frequency: string;
    description?: string;
    minIntervalDays?: number;
    maxIntervalDays?: number;
  };
  temperature?: {
    min?: number;
    max?: number;
    ideal?: number;
    unit?: string;
  };
};

type PlantInfoData = {
  commonNames?: string[];
  scientificName?: string;
  description?: string;
  difficulty?: string;
  toxicity?: string;
  origin?: string;
  careRequirements?: PlantCareInfo;
};

type RecognitionResult = {
  plantName: string;
  scientificName?: string;
  confidence: number;
  health: string;
  recommendations: string[];
  diseases: string[];
  careLevel: string;
  careInfo?: PlantInfoData;
};

type RecentScan = {
  id: string;
  name: string;
  createdAt: string;
  confidence: number;
  status: 'healthy' | 'warning';
  image: string;
};

const MAX_RECENT_SCANS = 6;

const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return 'À l’instant';
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays} j`;
};

const normalizeConfidence = (value?: number) => {
  if (!value && value !== 0) return 0;
  if (value <= 1) return Math.round(value * 100);
  return Math.round(value);
};

const getFirstSuggestion = (data: any) => {
  const suggestions =
    data?.result?.classification?.suggestions ||
    data?.result?.classification?.predictions ||
    data?.result?.predictions ||
    data?.result?.suggestions ||
    data?.suggestions ||
    [];
  return Array.isArray(suggestions) ? suggestions[0] : null;
};

const parseRecognitionResponse = (data: any): RecognitionResult => {
  const suggestion = getFirstSuggestion(data) || {};
  const primarySuggestion = data?.result?.classification?.suggestions?.[0] ?? suggestion ?? {};
  const name =
    primarySuggestion?.name ||
    primarySuggestion?.label ||
    primarySuggestion?.species?.name ||
    primarySuggestion?.taxon?.name ||
    primarySuggestion?.scientific_name ||
    primarySuggestion?.common_name ||
    suggestion?.name ||
    suggestion?.label ||
    suggestion?.species?.name ||
    suggestion?.taxon?.name ||
    suggestion?.scientific_name ||
    'Résultat inconnu';
  const scientificName =
    primarySuggestion?.scientific_name ||
    primarySuggestion?.species?.scientific_name ||
    primarySuggestion?.taxon?.scientific_name ||
    suggestion?.scientific_name ||
    suggestion?.species?.scientific_name ||
    suggestion?.taxon?.scientific_name ||
    '';
  const confidence = normalizeConfidence(
    primarySuggestion?.probability ||
      suggestion?.probability ||
      suggestion?.score ||
      suggestion?.confidence ||
      data?.result?.confidence,
  );

  const diseaseSuggestions =
    data?.result?.disease?.suggestions ||
    data?.result?.health?.diseases ||
    data?.result?.health?.suggestions ||
    data?.disease?.suggestions ||
    data?.health?.diseases ||
    data?.result?.disease ||
    data?.result?.diseases ||
    data?.disease ||
    data?.diseases ||
    [];
  const diseases = Array.isArray(diseaseSuggestions)
    ? diseaseSuggestions
        .map((item: any) => {
          if (typeof item === 'string') return item;
          return item?.name || item?.label || item?.disease || item?.common_name || String(item);
        })
        .filter(Boolean)
    : [];

  const health =
    data?.result?.health?.status ||
    data?.health?.status ||
    data?.result?.health ||
    (diseases.length > 0 ? 'À vérifier' : 'Saine');

  const recommendations: string[] = [];
  const watering = data?.result?.plant_details?.watering?.min || data?.result?.plant_details?.watering;
  if (watering) {
    recommendations.push(`Arrosage: ${watering}`);
  }

  recommendations.push('Assurez-vous d’une lumière adaptée à la plante identifiée.');
  recommendations.push('Surveillez régulièrement l’état des feuilles.');
  if (diseases.length > 0) {
    recommendations.push("Inspectez régulièrement pour détecter l'évolution des problèmes.");
    recommendations.push('Considérez un traitement adapté si nécessaire.');
  }

  return {
    plantName: name,
    scientificName,
    confidence,
    health,
    recommendations,
    diseases,
    careLevel: 'Intermédiaire',
  };
};

// Generate dynamic recommendations based on plant care info
const generateDynamicRecommendations = (careInfo: PlantInfoData): string[] => {
  const recs: string[] = [];

  if (careInfo?.careRequirements) {
    const care = careInfo.careRequirements;

    // Humidity recommendations
    if (care.humidity) {
      recs.push(
        `💧 Maintenir une humidité de ${care.humidity.ideal || care.humidity.min}-${care.humidity.max}%`
      );
    }

    // Luminosity recommendations
    if (care.luminosity) {
      if (care.luminosity.description) {
        recs.push(`☀️ ${care.luminosity.description}`);
      } else {
        const lux = care.luminosity.ideal || care.luminosity.min;
        if (lux) {
          recs.push(`☀️ Luminosité: environ ${lux} lux`);
        }
      }
    }

    // Watering recommendations
    if (care.watering) {
      recs.push(`🚰 Arrosage: ${care.watering.frequency}`);
      if (care.watering.description) {
        recs.push(`   ${care.watering.description}`);
      }
    }

    // Temperature recommendations
    if (care.temperature) {
      recs.push(
        `🌡️ Température idéale: ${care.temperature.ideal || care.temperature.min}-${care.temperature.max}°C`
      );
    }
  }

  // Difficulty-based recommendations
  if (careInfo?.difficulty) {
    const difficultyTips: Record<string, string> = {
      Facile: "Cette plante est facile à entretenir, parfaite pour les débutants.",
      Intermédiaire: "Cette plante nécessite un entretien régulier et une attention particulière.",
      Difficile: "Cette plante est exigeante. Une surveillance constante est recommandée.",
    };
    if (difficultyTips[careInfo.difficulty]) {
      recs.push(`📌 Niveau: ${difficultyTips[careInfo.difficulty]}`);
    }
  }

  // Toxicity warning
  if (careInfo?.toxicity && careInfo.toxicity.toLowerCase() !== "non-toxique") {
    recs.push(
      `⚠️ ATTENTION: ${careInfo.toxicity}. Gardez hors de portée des enfants et animaux.`
    );
  }

  return recs;
};

export function RecognitionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);

  const loadRecentScans = async () => {
    try {
      const data = await api.fetchRecentRecognitions(MAX_RECENT_SCANS);
      if (Array.isArray(data)) {
        setRecentScans(
          data.map((scan: any) => ({
            id: scan.id,
            name: scan.name,
            createdAt: scan.createdAt,
            confidence: scan.confidence ?? 0,
            status: scan.status ?? 'healthy',
            image: scan.image,
          }))
        );
      } else {
        setRecentScans([]);
      }
    } catch {
      setRecentScans([]);
    }
  };

  useEffect(() => {
    loadRecentScans();
  }, []);

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    try {
      const response = await api.identifyPlant(imageData);
      const parsed = parseRecognitionResponse(response);
      
      // Fetch plant care information - try with common name first, then scientific name
      let careResponse = null;
      const searchNames = [
        parsed.plantName,
        parsed.scientificName,
        // Also try normalized versions (replace × with x)
        parsed.plantName?.replace(/×/g, "x"),
        parsed.scientificName?.replace(/×/g, "x"),
      ].filter(Boolean);

      for (const name of searchNames) {
        if (!name) continue;
        try {
          console.log(`🔍 Attempting to fetch care info for: "${name}"`);
          careResponse = await api.getPlantInfo(name);
          if (careResponse?.plant) {
            console.log(`✅ Found plant care info for: "${name}"`);
            break;
          }
        } catch (err) {
          console.log(`⚠️ Not found with "${name}", trying next...`);
        }
      }
      
      if (careResponse?.plant) {
        parsed.careInfo = careResponse.plant;
        // Add dynamic recommendations based on care info
        const dynamicRecs = generateDynamicRecommendations(careResponse.plant);
        parsed.recommendations = [...parsed.recommendations, ...dynamicRecs];
        console.log('✅ Plant info found! Displaying', dynamicRecs.length, 'dynamic recommendations');
      } else {
        console.warn('⚠️ No plant care info found for any search variant');
      }
      
      setResult(parsed);
      if (selectedImage) {
        await loadRecentScans();
      }
    } catch (err: any) {
      setError(err?.message || "Erreur lors de l'analyse");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setSelectedImage(imageData);
        analyzeImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecentClick = (scan: RecentScan) => {
    setSelectedImage(scan.image);
    analyzeImage(scan.image);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Reconnaissance par IA</h1>
        <p className="text-muted-foreground mt-1">
          Identifiez vos plantes et détectez les maladies avec l'intelligence artificielle
        </p>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div className="bg-card border border-border rounded-xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Analysez votre plante
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Téléchargez une photo pour une identification instantanée
            </p>

            {!selectedImage ? (
              <div className="border-2 border-dashed border-border rounded-xl p-12 hover:border-primary transition-colors">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="text-primary font-medium hover:underline">
                    Cliquez pour télécharger
                  </span>
                  <span className="text-muted-foreground"> ou glissez-déposez</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG jusqu'à 10MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={selectedImage}
                    alt="Uploaded plant"
                    className="w-full h-64 object-cover"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p>Analyse en cours...</p>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setResult(null);
                    setError(null);
                  }}
                  className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Nouvelle analyse
                </button>
                <button
                  onClick={() => selectedImage && analyzeImage(selectedImage)}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  type="button"
                >
                  Relancer l'analyse
                </button>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                <Camera className="w-4 h-4" />
                <span className="text-sm">Prendre une photo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-card border border-border rounded-xl p-6">
          {error ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <AlertCircle className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Erreur</h3>
              <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Nom de la plante
                    </p>
                    <h3 className="text-2xl font-semibold text-foreground">{result.plantName}</h3>
                    <p className="text-sm text-muted-foreground italic">{result.scientificName}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-chart-1/10 text-chart-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">{result.confidence}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">État de santé</p>
                    <p className="text-lg font-semibold text-chart-1">{result.health}</p>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Niveau de soin</p>
                    <p className="text-lg font-semibold text-foreground">{result.careLevel}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Recommandations complètes ({result.recommendations.length} recommandations)
                </h4>
                {result.recommendations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune recommandation disponible.</p>
                ) : (
                  <div className="space-y-2">
                    {result.recommendations.map((rec: string, index: number) => {
                        return (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border ${
                              rec.includes("💧")
                                ? "bg-blue-500/10 border-blue-500/20"
                                : rec.includes("☀️")
                                ? "bg-yellow-500/10 border-yellow-500/20"
                                : rec.includes("🚰")
                                ? "bg-cyan-500/10 border-cyan-500/20"
                                : rec.includes("🌡️")
                                ? "bg-red-500/10 border-red-500/20"
                                : rec.includes("⚠️")
                                ? "bg-orange-500/10 border-orange-500/20"
                                : rec.includes("📌")
                                ? "bg-purple-500/10 border-purple-500/20"
                                : "bg-green-500/10 border-green-500/20"
                            }`}
                          >
                            <p className="text-sm font-medium text-foreground leading-relaxed">
                              {rec}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {result.diseases.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Maladies détectées
                  </h4>
                  <ul className="space-y-2">
                    {result.diseases.map((disease: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{disease}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Plant Care Requirements */}
              {result.careInfo?.careRequirements && (
                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-500" />
                    Conditions de soins idéales
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Humidity */}
                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Humidité du sol</p>
                      </div>
                      <div className="space-y-1">
                        {result.careInfo.careRequirements.humidity.ideal && (
                          <p className="text-lg font-bold text-blue-600">
                            {result.careInfo.careRequirements.humidity.ideal}%
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Min: {result.careInfo.careRequirements.humidity.min}% - Max: {result.careInfo.careRequirements.humidity.max}%
                        </p>
                      </div>
                    </div>

                    {/* Luminosity */}
                    <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="w-4 h-4 text-yellow-500" />
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Luminosité</p>
                      </div>
                      <div className="space-y-1">
                        {result.careInfo.careRequirements.luminosity.ideal && (
                          <p className="text-lg font-bold text-yellow-600">
                            {result.careInfo.careRequirements.luminosity.ideal} lux
                          </p>
                        )}
                        {result.careInfo.careRequirements.luminosity.description && (
                          <p className="text-xs text-muted-foreground">
                            {result.careInfo.careRequirements.luminosity.description}
                          </p>
                        )}
                        {result.careInfo.careRequirements.luminosity.min && result.careInfo.careRequirements.luminosity.max && (
                          <p className="text-xs text-muted-foreground">
                            {result.careInfo.careRequirements.luminosity.min} - {result.careInfo.careRequirements.luminosity.max} lux
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Watering Frequency */}
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-4 h-4 text-green-500" />
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Arrosage</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-green-600">
                          {result.careInfo.careRequirements.watering.frequency}
                        </p>
                        {result.careInfo.careRequirements.watering.description && (
                          <p className="text-xs text-muted-foreground">
                            {result.careInfo.careRequirements.watering.description}
                          </p>
                        )}
                        {result.careInfo.careRequirements.watering.minIntervalDays && result.careInfo.careRequirements.watering.maxIntervalDays && (
                          <p className="text-xs text-muted-foreground">
                            Tous les {result.careInfo.careRequirements.watering.minIntervalDays}-{result.careInfo.careRequirements.watering.maxIntervalDays} jours
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(result.careInfo.difficulty || result.careInfo.toxicity || result.careInfo.origin || result.careInfo.description || result.careInfo.careRequirements?.temperature) && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      {result.careInfo.description && (
                        <p className="text-sm text-muted-foreground italic">
                          📖 {result.careInfo.description}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {result.careInfo.difficulty && (
                          <div className="p-3 bg-secondary rounded-lg">
                            <p className="text-xs text-muted-foreground font-semibold mb-1">DIFFICULTÉ</p>
                            <p className="text-sm font-semibold text-foreground">{result.careInfo.difficulty}</p>
                          </div>
                        )}
                        
                        {result.careInfo.toxicity && (
                          <div className="p-3 bg-secondary rounded-lg">
                            <p className="text-xs text-muted-foreground font-semibold mb-1">TOXICITÉ</p>
                            <p className="text-sm font-semibold text-foreground">{result.careInfo.toxicity}</p>
                          </div>
                        )}
                        
                        {result.careInfo.origin && (
                          <div className="p-3 bg-secondary rounded-lg">
                            <p className="text-xs text-muted-foreground font-semibold mb-1">ORIGINE</p>
                            <p className="text-sm font-semibold text-foreground">{result.careInfo.origin}</p>
                          </div>
                        )}
                      </div>

                      {/* Temperature */}
                      {result.careInfo.careRequirements?.temperature && (
                        <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-base">🌡️</span>
                            <p className="text-xs text-muted-foreground font-semibold uppercase">Température</p>
                          </div>
                          <div className="space-y-1">
                            {result.careInfo.careRequirements.temperature.ideal && (
                              <p className="text-lg font-bold text-red-600">
                                {result.careInfo.careRequirements.temperature.ideal}°C
                              </p>
                            )}
                            {result.careInfo.careRequirements.temperature.min && result.careInfo.careRequirements.temperature.max && (
                              <p className="text-xs text-muted-foreground">
                                Min: {result.careInfo.careRequirements.temperature.min}°C - Max: {result.careInfo.careRequirements.temperature.max}°C
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Search className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                En attente d'analyse
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Téléchargez une photo de votre plante pour obtenir une analyse détaillée
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Scans */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Analyses récentes</h3>
        {recentScans.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune analyse récente pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentScans.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center gap-4 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer"
                onClick={() => handleRecentClick(scan)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleRecentClick(scan);
                  }
                }}
              >
                <img
                  src={scan.image}
                  alt={scan.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{scan.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(scan.createdAt)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          scan.status === 'warning' ? 'bg-orange-500' : 'bg-chart-1'
                        }`}
                        style={{ width: `${scan.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{scan.confidence}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
