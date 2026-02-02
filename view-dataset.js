// View sample data from all collections
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGODB_URI } = process.env;

async function viewDataset() {
  console.log('\n📊 === VIEWING DATASET ===\n');
  
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    const collections = await db.listCollections().toArray();
    
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📁 ${collectionName.toUpperCase()} (${count} documents)`);
      console.log(`${'='.repeat(60)}\n`);
      
      if (count > 0) {
        // Get sample documents (max 3)
        const samples = await collection.find({}).limit(3).toArray();
        
        samples.forEach((doc, index) => {
          console.log(`Document ${index + 1}:`);
          console.log(JSON.stringify(doc, null, 2));
          console.log('');
        });
        
        if (count > 3) {
          console.log(`... and ${count - 3} more documents\n`);
        }
      } else {
        console.log('(Empty collection)\n');
      }
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('📈 SUMMARY');
    console.log(`${'='.repeat(60)}`);
    console.log(`Total Collections: ${collections.length}`);
    
    let totalDocs = 0;
    for (const collectionInfo of collections) {
      const count = await db.collection(collectionInfo.name).countDocuments();
      totalDocs += count;
    }
    console.log(`Total Documents: ${totalDocs}`);
    console.log(`\n✅ Dataset view complete!\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

viewDataset();
