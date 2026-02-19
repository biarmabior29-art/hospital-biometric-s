import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI; // use the correct env variable

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI); // no extra options needed in Mongoose v7+
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // exit process with failure
  }
};

export default connectDB;
