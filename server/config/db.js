import mongoose from 'mongoose';

let isConnected = false;

export default async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pentasset';

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined. Please set it in your environment.');
  }

  if (isConnected) {
    return mongoose.connection;
  }

  mongoose.set('strictQuery', false);

  await mongoose.connect(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  isConnected = true;
  return mongoose.connection;
}


