// View all clients from database
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function viewAllClients() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    
    console.log('\n👥 === ALL CLIENTS IN DATABASE ===\n');
    
    const clients = await db.collection('clients').find({}).toArray();
    
    console.log(`Total Clients: ${clients.length}\n`);
    console.log('='.repeat(80));
    
    clients.forEach((client, index) => {
      console.log(`\nClient ${index + 1}:`);
      console.log('─'.repeat(80));
      console.log(JSON.stringify(client, null, 2));
      console.log('─'.repeat(80));
    });
    
    console.log(`\n✅ Found ${clients.length} clients\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

viewAllClients();
