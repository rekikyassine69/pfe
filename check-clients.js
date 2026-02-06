import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    console.log('Clients in database:');
    const clients = await db.collection('clients').find({}, { projection: { nom: 1, email: 1, _id: 1 } }).toArray();
    console.log(JSON.stringify(clients, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

test();
