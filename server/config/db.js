import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/form2login_db';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout for fast fallback diagnostic
    });

    console.log(`🍃 [MongoDB] Connected successfully to Host: ${conn.connection.host}, DB: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`⚠️ [MongoDB Connection Warning]: ${error.message}`);
    console.warn(`💡 [MongoDB Diagnostics]: Could not connect to live MongoDB at ${mongoURI}.`);
    console.warn(`💡 [Fallback Mode]: Operating with fallback memory data store for instant testing. Start MongoDB service for persistence.`);
    return false;
  }
};
