// Quick script to view MongoDB collections
import mongoose from 'mongoose';

const uri = 'mongodb://localhost:27017/plateformeDB';

try {
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB\n');

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  
  console.log(`📦 Database: plateformeDB`);
  console.log(`📚 Total Collections: ${collections.length}\n`);
  
  for (const collection of collections) {
    const count = await db.collection(collection.name).countDocuments();
    console.log(`  📁 ${collection.name.padEnd(25)} - ${count} documents`);
  }
  
  console.log('\n✅ Database check complete!');
  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
