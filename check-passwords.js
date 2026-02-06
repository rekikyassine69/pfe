import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    console.log('Clients in database with passwords:');
    const clients = await db.collection('clients').find({}).toArray();
    clients.forEach(client => {
      console.log(`Email: ${client.email}, Has password: ${'motDePasse' in client}`);
      console.log(`  Password: ${client.motDePasse ? client.motDePasse.substring(0, 30) : 'none'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

test();
