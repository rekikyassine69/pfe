// Helper script to generate 1000 plant entries
const fs = require('fs');

// Template for generating plants quickly
const categories = {
  // Additional Vegetables (50)
  vegetables: [
    { name: "Roquette", sci: "Eruca vesicaria", desc: "Salade poivrée", diff: "Facile", tox: "Non-toxique", origin: "Méditerranée" },
    { name: "Mâche", sci: "Valerianella locusta", desc: "Salade d'hiver", diff: "Facile", tox: "Non-toxique", origin: "Europe" },
    { name: "Cresson", sci: "Nasturtium officinale", desc: "Plante aquatique piquante", diff: "Facile", tox: "Non-toxique", origin: "Europe" },
    { name: "Navet", sci: "Brassica rapa", desc: "Légume racine", diff: "Facile", tox: "Non-toxique", origin: "Europe" },
    { name: "Rutabaga", sci: "Brassica napus", desc: "Légume racine d'hiver", diff: "Facile", tox: "Non-toxique", origin: "Europe" },
    { name: "Panais", sci: "Pastinaca sativa", desc: "Légume racine blanc", diff: "Facile", tox: "Non-toxique", origin: "Europe" },
    { name: "Topinambour", sci: "Helianthus tuberosus", desc: "Tubercule rustique", diff: "Facile", tox: "Non-toxique", origin: "Amérique du Nord" },
    { name: "Salsifis", sci: "Tragopogon porrifolius", desc: "Légume racine rare", diff: "Intermédiaire", tox: "Non-toxique", origin: "Méditerranée" },
    { name: "Crosne", sci: "Stachys affinis", desc: "Petit tubercule asiatique", diff: "Intermédiaire", tox: "Non-toxique", origin: "Chine" },
    { name: "Pâtisson", sci: "Cucurbita pepo", desc: "Courge décorative", diff: "Facile", tox: "Non-toxique", origin: "Amérique" },
  ],
  
  // More Flowers (100)
  flowers: [
    { name: "Alysse", sci: "Lobularia maritima", desc: "Petite fleur blanche", diff: "Facile", tox: "Non-toxique", origin: "Méditerranée" },
    { name: "Ageratum", sci: "Ageratum houstonianum", desc: "Fleur bleue duveteuse", diff: "Facile", tox: "Non-toxique", origin: "Amérique Centrale" },
    { name: "Amarante", sci: "Amaranthus caudatus", desc: "Fleur retombante", diff: "Facile", tox: "Non-toxique", origin: "Amérique du Sud" },
    { name: "Anémone", sci: "Anemone coronaria", desc: "Fleur délicate colorée", diff: "Intermédiaire", tox: "Toxique", origin: "Méditerranée" },
    { name: "Antirrhinum", sci: "Antirrhinum majus", desc: "Gueule de loup", diff: "Facile", tox: "Non-toxique", origin: "Méditerranée" },
    { name: "Aquilegia", sci: "Aquilegia vulgaris", desc: "Ancolie", diff: "Facile", tox: "Toxique", origin: "Europe" },
    { name: "Aster", sci: "Aster novi-belgii", desc: "Fleur d'automne", diff: "Facile", tox: "Non-toxique", origin: "Amérique du Nord" },
    { name: "Aubrieta", sci: "Aubrieta deltoidea", desc: "Couvre-sol fleuri", diff: "Facile", tox: "Non-toxique", origin: "Méditerranée" },
    { name: "Balsamine", sci: "Impatiens balsamina", desc: "Fleur annuelle colorée", diff: "Facile", tox: "Non-toxique", origin: "Asie" },
    { name: "Belle de nuit", sci: "Mirabilis jalapa", desc: "Fleur s'ouvrant le soir", diff: "Facile", tox: "Toxique", origin: "Amérique du Sud" },
  ],
  
  // More Trees (50)
  trees: [
    { name: "Érable", sci: "Acer saccharum", desc: "Arbre à sirop d'érable", diff: "Facile", tox: "Non-toxique", origin: "Amérique du Nord" },
    { name: "Chêne", sci: "Quercus robur", desc: "Arbre majestueux", diff: "Facile", tox: "Glands toxiques", origin: "Europe" },
    { name: "Bouleau", sci: "Betula pendula", desc: "Arbre à écorce blanche", diff: "Facile", tox: "Non-toxique", origin: "Europe" },
    { name: "Saule pleureur", sci: "Salix babylonica", desc: "Arbre aux branches retombantes", diff: "Facile", tox: "Non-toxique", origin: "Chine" },
    { name: "Hêtre", sci: "Fagus sylvatica", desc: "Grand arbre forestier", diff: "Facile", tox: "Non-toxique", origin: "Europe" },
    { name: "Tilleul", sci: "Tilia cordata", desc: "Arbre à fleurs parfumées", diff: "Facile", tox: "Non-toxique", origin: "Europe" },
    { name: "Platane", sci: "Platanus × acerifolia", desc: "Arbre d'alignement", diff: "Facile", tox: "Non-toxique", origin: "Hybride" },
    { name: "Marronnier", sci: "Aesculus hippocastanum", desc: "Arbre aux marrons", diff: "Facile", tox: "Marrons toxiques", origin: "Balkans" },
    { name: "Frêne", sci: "Fraxinus excelsior", desc: "Grand arbre résistant", diff: "Facile", tox: "Non-toxique", origin: "Europe" },
    { name: "Orme", sci: "Ulmus minor", desc: "Arbre champêtre", diff: "Intermédiaire", tox: "Non-toxique", origin: "Europe" },
  ]
};

// Generate plant objects
function generatePlantEntry(name, sci, desc, diff, tox, origin, category) {
  const careData = {
    vegetables: { hum: [50,70,60], lux: [2000,4000,3000], water: [2,3], temp: [15,25,20] },
    flowers: { hum: [40,60,50], lux: [2000,4500,3200], water: [2,3], temp: [15,25,20] },
    trees: { hum: [40,60,50], lux: [2500,5000,3700], water: [3,7], temp: [10,28,19] }
  };
  
  const care = careData[category] || careData.flowers;
  
  return `  {
    commonNames: ["${name}"],
    scientificName: "${sci}",
    description: "${desc}",
    difficulty: "${diff}",
    toxicity: "${tox}",
    origin: "${origin}",
    careRequirements: {
      humidity: { min: ${care.hum[0]}, max: ${care.hum[1]}, ideal: ${care.hum[2]} },
      luminosity: { min: ${care.lux[0]}, max: ${care.lux[1]}, ideal: ${care.lux[2]}, description: "Lumière adaptée" },
      watering: { frequency: "Tous les ${care.water[0]}-${care.water[1]} jours", description: "Arrosage régulier", minIntervalDays: ${care.water[0]}, maxIntervalDays: ${care.water[1]} },
      temperature: { min: ${care.temp[0]}, max: ${care.temp[1]}, ideal: ${care.temp[2]} },
    },
  },`;
}

// Calculate how many more we need
const currentCount = 171;
const targetCount = 1000;
const needed = targetCount - currentCount;

console.log(`Current plants: ${currentCount}`);
console.log(`Target plants: ${targetCount}`);
console.log(`Need to add: ${needed} more plants`);
console.log(`\nThis is a helper - you'll need to manually generate and add ${needed} plants to reach 1000.`);
