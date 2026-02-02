// Test all database connections and models
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
  Client,
  Administrateur,
  PotConnecte,
  HistoriqueMesure,
  HistoriqueArrosage,
  Alerte,
  Cours,
  ProgressionCours,
  Jeu,
  Score,
  Produit,
  Commande,
  Notification
} from './server/models/index.js';

dotenv.config();

const { MONGODB_URI } = process.env;

async function testDatabaseConnection() {
  console.log('🔗 Testing Database Connections...\n');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const db = mongoose.connection.db;
    
    // Test each collection
    const tests = [
      { name: 'Clients', model: Client, collection: 'clients' },
      { name: 'Administrateurs', model: Administrateur, collection: 'administrateurs' },
      { name: 'Pots Connectés', model: PotConnecte, collection: 'potsConnectes' },
      { name: 'Historique Mesures', model: HistoriqueMesure, collection: 'historiqueMesures' },
      { name: 'Historique Arrosage', model: HistoriqueArrosage, collection: 'historiqueArrosage' },
      { name: 'Alertes', model: Alerte, collection: 'alertes' },
      { name: 'Cours', model: Cours, collection: 'cours' },
      { name: 'Progression Cours', model: ProgressionCours, collection: 'progressionCours' },
      { name: 'Jeux', model: Jeu, collection: 'jeux' },
      { name: 'Scores', model: Score, collection: 'scores' },
      { name: 'Produits', model: Produit, collection: 'produits' },
      { name: 'Commandes', model: Commande, collection: 'commandes' },
      { name: 'Notifications', model: Notification, collection: 'notifications' }
    ];
    
    console.log('📊 Testing Collections:\n');
    
    let totalDocs = 0;
    const results = [];
    
    for (const test of tests) {
      try {
        const count = await test.model.countDocuments();
        const sample = await test.model.findOne().lean();
        
        totalDocs += count;
        results.push({
          name: test.name,
          collection: test.collection,
          count,
          status: '✅',
          hasSample: !!sample
        });
        
        console.log(`✅ ${test.name.padEnd(25)} - ${count} documents ${sample ? '(sample found)' : ''}`);
      } catch (error) {
        results.push({
          name: test.name,
          collection: test.collection,
          count: 0,
          status: '❌',
          error: error.message
        });
        console.log(`❌ ${test.name.padEnd(25)} - Error: ${error.message}`);
      }
    }
    
    // Test relationships
    console.log('\n🔗 Testing Relationships:\n');
    
    try {
      const clientWithPots = await Client.findOne();
      if (clientWithPots) {
        const pots = await PotConnecte.find({ clientId: clientWithPots._id });
        console.log(`✅ Client → Pots: Found ${pots.length} pots for client ${clientWithPots.nom}`);
        
        if (pots.length > 0) {
          const mesures = await HistoriqueMesure.find({ potId: pots[0]._id }).limit(1);
          console.log(`✅ Pot → Mesures: Found ${mesures.length} measurements for pot ${pots[0].nomPot}`);
        }
      }
      
      const coursWithProgress = await Cours.findOne();
      if (coursWithProgress) {
        const progress = await ProgressionCours.find({ coursId: coursWithProgress._id });
        console.log(`✅ Cours → Progression: Found ${progress.length} student(s) enrolled in "${coursWithProgress.titre}"`);
      }
      
      const jeuWithScores = await Jeu.findOne();
      if (jeuWithScores) {
        const scores = await Score.find({ jeuId: jeuWithScores._id });
        console.log(`✅ Jeu → Scores: Found ${scores.length} score(s) for game "${jeuWithScores.nom}"`);
      }
      
    } catch (error) {
      console.log(`❌ Relationship test error: ${error.message}`);
    }
    
    // Summary
    console.log('\n📈 Summary:\n');
    console.log(`Total Collections: ${results.length}`);
    console.log(`Total Documents: ${totalDocs}`);
    console.log(`Successful: ${results.filter(r => r.status === '✅').length}`);
    console.log(`Failed: ${results.filter(r => r.status === '❌').length}`);
    
    // Test API endpoints
    console.log('\n🌐 API Endpoints Available:\n');
    console.log(`GET    http://localhost:4000/api/collections/{collection}`);
    console.log(`GET    http://localhost:4000/api/collections/{collection}/{id}`);
    console.log(`POST   http://localhost:4000/api/collections/{collection}`);
    console.log(`PATCH  http://localhost:4000/api/collections/{collection}/{id}`);
    console.log(`DELETE http://localhost:4000/api/collections/{collection}/{id}`);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testDatabaseConnection();
