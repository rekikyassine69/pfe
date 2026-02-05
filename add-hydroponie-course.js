import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const courseData = {
  idCours: 2,
  titre: "Hydroponie - Culture sans sol",
  description: "Cours complet sur l'hydroponie couvrant les fondements biologiques, l'ingénierie des systèmes, la nutrition végétale et l'analyse opérationnelle",
  contenu: "Ce cours explore la culture hydroponique en profondeur avec 4 modules couvrant tous les aspects de cette technologie agricole innovante.",
  duree: 240,
  niveau: "debutant",
  nombreLecons: 4,
  chapitres: [
    {
      numero: 1,
      titre: "MODULE 1 : Fondements et Mécanismes Biologiques",
      contenu: `MODULE 1 : Fondements et Mécanismes Biologiques
1.1 Qu'est-ce que l'hydroponie ?
L'hydroponie est une méthode de culture où les plantes ne sont pas cultivées dans un sol conventionnel. À la place, les racines sont soit submergées dans un milieu de culture inorganique, soit directement exposées à une eau riche en nutriments.
1.2 Le rôle substitutif du sol
Pour comprendre l'hydroponie, il faut comprendre les fonctions du sol qu'elle remplace :
• Rétention et fourniture : Le sol sert de réservoir d'eau et de nutriments.
• Supports inertes : En hydroponie, on utilise des substrats comme la perlite, la vermiculite, la laine de roche ou les billes d'argile expansée pour assurer le maintien physique de la plante.
• Efficience racinaire : Les racines en hydroponie restent compactes, car elles n'ont pas besoin de se développer de manière extensive pour chercher de la nourriture ; celle-ci leur est apportée directement.`,
      videoUrl: "/videos/module-1.mp4"
    },
    {
      numero: 2,
      titre: "MODULE 2 : Ingénierie des Systèmes Hydroponiques",
      contenu: `MODULE 2 : Ingénierie des Systèmes Hydroponiques
Ce module explore les principes fondamentaux de la culture sans sol et la conception technique des différents types d'installations.
1.1. Principes de base et milieux de culture
L'hydroponie repose sur la culture de plantes sans sol conventionnel. À la place, les racines sont soit immergées dans l'eau, soit soutenues par un substrat de culture inorganique tel que :
• La vermiculite.
• La perlite.
• La laine de roche (rockwool).
• Les billes d'argile expansée.
L'objectif principal est de fournir directement aux racines une solution nutritive riche pour compenser l'absence de terre.
1.2. Typologie des systèmes de culture
Les sources identifient six configurations d'ingénierie majeures, allant du plus simple au plus complexe :
1. Technique de la pellicule nutritive (NFT) : Les plantes sont placées dans des canaux ou des tuyaux en pente. Une pompe fait circuler l'eau nutrifiée en continu sur le système racinaire. C'est un système fermé qui recycle l'eau.
2. Systèmes à mèche (Wick Systems) : Le plus simple pour les débutants. L'eau remonte du réservoir vers le substrat par action capillaire via une mèche.
3. Table à marée (Ebb and Flow) : Le système inonde périodiquement la zone des racines avant de laisser l'eau s'écouler lentement vers le réservoir.
4. Culture en eau profonde (DWC) : Les plantes flottent sur une plateforme à la surface de l'eau, les racines plongées directement dans la solution. Une pompe à air est indispensable pour oxygéner l'eau.
5. Systèmes de goutte-à-goutte : Des lignes de goutte-à-goutte transportent l'eau vers chaque plante, permettant un réglage précis de l'intensité de l'arrosage et des nutriments.
6. Aéroponie : Les racines sont suspendues dans l'air (verticalement ou horizontalement) et reçoivent une brumisation de nutriments à intervalles réguliers. C'est le système le plus avancé technologiquement.`,
      videoUrl: null
    },
    {
      numero: 3,
      titre: "MODULE 3 : Nutrition Végétale et Variantes Écologiques",
      contenu: `MODULE 3 : Nutrition Végétale et Variantes Écologiques
3.1 La triade NPK et les oligo-éléments
La plante a besoin de trois éléments majeurs pour prospérer :
• Azote (N) : Stimule la croissance des parties aériennes (tiges et feuilles).
• Phosphore (P) : Vital pour le développement racinaire et le renforcement des défenses immunitaires.
• Potassium (K) : Essentiel pour la floraison et la production de fruits.
Pour éviter le jaunissement des feuilles et renforcer le système immunitaire, l'apport d'oligo-éléments comme le magnésium et le calcium est indispensable.
3.2 Bioponie et Aquaponie
• Bioponie : Utilise une solution organique (souvent à base de fientes) qui favorise le développement d'une vie microbienne dans le système. Ces micro-organismes génèrent naturellement les nutriments.
• Aquaponie : Un écosystème en circuit fermé où les déchets des poissons sont transformés par des bactéries en nutriments pour les plantes, lesquelles filtrent l'eau pour les poissons.`,
      videoUrl: "/videos/module-3.mp4"
    },
    {
      numero: 4,
      titre: "MODULE 4 : Analyse Opérationnelle : Avantages et Risques",
      contenu: `MODULE 4 : Analyse Opérationnelle : Avantages et Risques
Ce module examine la viabilité économique et les défis de gestion liés à l'exploitation d'un système hydroponique.
2.1. Avantages Opérationnels
L'hydroponie offre des gains d'efficacité significatifs par rapport à l'agriculture traditionnelle :
• Optimisation de l'espace et du rendement : Les racines restant compactes (car elles n'ont pas besoin de chercher les nutriments), on peut cultiver plus de plantes dans un espace réduit.
• Économies de ressources : Contrairement à l'agriculture conventionnelle où l'eau se perd par drainage ou évaporation, l'hydroponie applique la quantité exacte nécessaire. Les systèmes circulatoires permettent de recycler l'eau indéfiniment.
• Contrôle climatique et saisonnier : En contrôlant la température et l'éclairage, on peut produire des cultures hors saison, ce qui permet d'obtenir des prix de vente plus élevés.
• Santé des plantes : L'absence de sol élimine les maladies telluriques et les mauvaises herbes, réduisant ainsi les coûts de main-d'œuvre et de pesticides.
2.2. Analyse des Risques et Obstacles
Malgré ses avantages, plusieurs facteurs de risque doivent être pris en compte :
• Coûts initiaux élevés : Si une petite installation domestique est abordable, le démarrage d'une exploitation commerciale nécessite un investissement initial important.
• Dépendance technologique : Les pannes de courant ou d'eau représentent un risque critique. Sans sol pour retenir l'humidité, une interruption prolongée peut entraîner des pertes de récolte massives très rapidement.
• Besoin d'expertise : Une exploitation commerciale exige des connaissances techniques approfondies pour éviter des erreurs coûteuses.
Note : Selon les sources, les producteurs commerciaux devraient systématiquement investir dans des générateurs et des forages pour pallier les risques d'interruption de service.`,
      videoUrl: null
    }
  ],
  examen: {
    nombreQuestions: 30,
    dureeMinutes: 15,
    scoreMinimum: 60,
    questions: [
      { id: 1, question: "Quel est l'élément principal absent de l'hydroponie ?", type: "choix_multiple", options: ["Eau", "Terre", "Oxygène"], reponseCorrecte: 1, points: 1 },
      { id: 2, question: "Quel rôle le sol remplit-il pour la plante ?", type: "choix_multiple", options: ["Rétention d'eau/nutriments", "Photosynthèse", "Production de CO2"], reponseCorrecte: 0, points: 1 },
      { id: 3, question: "Citez un substrat inorganique courant.", type: "choix_multiple", options: ["Terreau", "Laine de roche", "Écorce de pin"], reponseCorrecte: 1, points: 1 },
      { id: 4, question: "Pourquoi les racines hydroponiques sont-elles plus compactes ?", type: "choix_multiple", options: ["Accès direct aux nutriments", "Manque d'espace", "Absence de gravité"], reponseCorrecte: 0, points: 1 },
      { id: 5, question: "L'hydroponie permet-elle de cultiver à l'intérieur ?", type: "choix_multiple", options: ["Oui", "Non"], reponseCorrecte: 0, points: 1 },
      { id: 6, question: "Quel système fonctionne par capillarité ?", type: "choix_multiple", options: ["NFT", "Système à mèche", "Aéroponie"], reponseCorrecte: 1, points: 1 },
      { id: 7, question: "Le système NFT nécessite-t-il beaucoup de substrat ?", type: "choix_multiple", options: ["Oui", "Non"], reponseCorrecte: 1, points: 1 },
      { id: 8, question: "Comment appelle-t-on le système où les racines flottent ?", type: "choix_multiple", options: ["DWC", "Goutte-à-goutte", "Table à marée"], reponseCorrecte: 0, points: 1 },
      { id: 9, question: "Quel système est conseillé uniquement aux experts ?", type: "choix_multiple", options: ["DWC", "Mèche", "Aéroponie"], reponseCorrecte: 2, points: 1 },
      { id: 10, question: "Qu'est-ce qu'une table à marée ?", type: "choix_multiple", options: ["Un cycle inondation/drainage", "Un système de brumisation", "Une tour verticale"], reponseCorrecte: 0, points: 1 },
      { id: 11, question: "Quel système permet un réglage individuel pour chaque plante ?", type: "choix_multiple", options: ["NFT", "Goutte-à-goutte", "Aquaponie"], reponseCorrecte: 1, points: 1 },
      { id: 12, question: "Dans une tour verticale, quel outil déclenche la pompe ?", type: "choix_multiple", options: ["Un baromètre", "Un programmateur", "Un thermomètre"], reponseCorrecte: 1, points: 1 },
      { id: 13, question: "Quel est l'avantage principal des tours verticales ?", type: "choix_multiple", options: ["Gain de place", "Moins de nutriments", "Pas besoin d'eau"], reponseCorrecte: 0, points: 1 },
      { id: 14, question: "L'eau en hydroponie est-elle généralement :", type: "choix_multiple", options: ["Recirculée", "Évaporée", "Jetée"], reponseCorrecte: 0, points: 1 },
      { id: 15, question: "L'aéroponie utilise :", type: "choix_multiple", options: ["Des mèches", "Des brumisateurs", "Des poissons"], reponseCorrecte: 1, points: 1 },
      { id: 16, question: "Que signifie le 'N' ?", type: "choix_multiple", options: ["Azote", "Natrium", "Nickel"], reponseCorrecte: 0, points: 1 },
      { id: 17, question: "Quel élément booste la croissance des feuilles ?", type: "choix_multiple", options: ["Azote", "Phosphore", "Potassium"], reponseCorrecte: 0, points: 1 },
      { id: 18, question: "Quel élément est crucial pour les racines ?", type: "choix_multiple", options: ["Azote", "Phosphore", "Potassium"], reponseCorrecte: 1, points: 1 },
      { id: 19, question: "Le Potassium (K) agit sur :", type: "choix_multiple", options: ["Les racines", "La tige", "Les fruits/fleurs"], reponseCorrecte: 2, points: 1 },
      { id: 20, question: "Quel symptôme indique une carence en calcium/magnésium ?", type: "choix_multiple", options: ["Jaunissement des feuilles", "Racines rouges", "Tiges bleues"], reponseCorrecte: 0, points: 1 },
      { id: 21, question: "Pourquoi préfère-t-on l'engrais liquide ?", type: "choix_multiple", options: ["Assimilation rapide", "Moins d'odeur", "Moins cher"], reponseCorrecte: 0, points: 1 },
      { id: 22, question: "La bioponie repose sur :", type: "choix_multiple", options: ["Les poissons", "La vie microbienne", "L'eau pure"], reponseCorrecte: 1, points: 1 },
      { id: 23, question: "D'où viennent souvent les nutriments en bioponie ?", type: "choix_multiple", options: ["De l'air", "De fientes d'animaux", "De sable"], reponseCorrecte: 1, points: 1 },
      { id: 24, question: "En aquaponie, qui nourrit les plantes ?", type: "choix_multiple", options: ["L'agriculteur", "Les déchets de poissons", "Les bactéries seules"], reponseCorrecte: 1, points: 1 },
      { id: 25, question: "Quel est le rôle des bactéries en aquaponie ?", type: "choix_multiple", options: ["Transformer les déchets en nutriments", "Nettoyer les feuilles", "Tuer les insectes"], reponseCorrecte: 0, points: 1 },
      { id: 26, question: "Quel système nécessite de nourrir des poissons ?", type: "choix_multiple", options: ["Aquaponie", "Bioponie", "Hydroponie classique"], reponseCorrecte: 0, points: 1 },
      { id: 27, question: "Quelle est l'économie d'eau moyenne ?", type: "choix_multiple", options: ["50%", "75%", "90%"], reponseCorrecte: 2, points: 1 },
      { id: 28, question: "Quel est le risque majeur en cas de panne de courant ?", type: "choix_multiple", options: ["Mort des plantes", "Croissance lente", "Invasion d'insectes"], reponseCorrecte: 0, points: 1 },
      { id: 29, question: "Pourquoi l'hydroponie est-elle rentable commercialement ?", type: "choix_multiple", options: ["Récoltes hors saison et croissance rapide", "Aucun besoin d'électricité", "Engrais gratuits"], reponseCorrecte: 0, points: 1 },
      { id: 30, question: "L'hydroponie est-elle exempte de maladies du sol ?", type: "choix_multiple", options: ["Oui", "Non"], reponseCorrecte: 0, points: 1 }
    ]
  },
  dateCreation: new Date(),
  statut: "publié"
};

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('cours');
    
    const result = await collection.insertOne(courseData);
    console.log('✓ Course "Hydroponie - Culture sans sol" added successfully!');
    console.log(`  Course ID: ${result.insertedId}`);
    console.log(`  Modules: 4`);
    console.log(`  Exam questions: 30`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error adding course:', error.message);
    process.exit(1);
  }
};

main();
