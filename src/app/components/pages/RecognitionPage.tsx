import { useState } from 'react';
import { Upload, Camera, Search, Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function RecognitionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        // Simulate AI analysis
        setIsAnalyzing(true);
        setTimeout(() => {
          setResult({
            plantName: 'Tomate Cerise',
            scientificName: 'Solanum lycopersicum var. cerasiforme',
            confidence: 96,
            health: 'Excellente',
            recommendations: [
              'Arrosage régulier recommandé',
              'Exposition au soleil: 6-8h par jour',
              'Température idéale: 20-25°C',
              'Fertilisation toutes les 2 semaines',
            ],
            diseases: [],
            careLevel: 'Intermédiaire',
          });
          setIsAnalyzing(false);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const recentScans = [
    {
      id: 1,
      name: 'Basilic',
      date: 'Il y a 2h',
      confidence: 94,
      status: 'healthy',
      image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=100',
    },
    {
      id: 2,
      name: 'Menthe',
      date: 'Hier',
      confidence: 89,
      status: 'healthy',
      image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=100',
    },
    {
      id: 3,
      name: 'Lavande',
      date: 'Il y a 3j',
      confidence: 97,
      status: 'healthy',
      image: 'https://images.unsplash.com/photo-1611251133334-cb2e8e9df5ec?w=100',
    },
  ];

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
                  }}
                  className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Nouvelle analyse
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
          {result ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
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
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Recommandations
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-chart-1 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentScans.map((scan) => (
            <div
              key={scan.id}
              className="flex items-center gap-4 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              <img
                src={scan.image}
                alt={scan.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{scan.name}</h4>
                <p className="text-xs text-muted-foreground">{scan.date}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-chart-1 rounded-full"
                      style={{ width: `${scan.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{scan.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
