import mongoose, { Mongoose } from "mongoose";
import logger from "./logger";

// Get the MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI as string;

// If no URI is defined, crash early
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

// Define the shape of a cache object to store the connection and promise
interface MongooseCache {
  conn: Mongoose | null;               // The actual connected Mongoose instance
  promise: Promise<Mongoose> | null;   // A promise that resolves to a Mongoose connection
}

// Make the `mongoose` variable globally accessible across hot reloads (for dev mode)
declare global {
  var mongoose: MongooseCache;
}

// Try to reuse the existing global cache, if it exists
let cached = global.mongoose;

// If not cached yet, initialize the global mongoose cache
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Connect to the database (only once across reloads)
const dbConnect = async (): Promise<Mongoose> => {
  // If already connected, return the existing connection
  if (cached.conn) {
    logger.info("Using existing mongoose connection")
    return cached.conn;
  }

  // If there's no ongoing connection attempt, start one
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "devflow", // Optional: specify database name
      })
      .then((result) => {
        logger.info("Connected to MongoDB")
        return result; // Mongoose instance
      })
      .catch((error) => {
        logger.error("Error connecting to MongoDB", error);
        throw error; // Rethrow so the caller knows it failed
      });
  }

  // Wait for the promise to resolve, then cache and return the connection
  cached.conn = await cached.promise;

  return cached.conn;
};

// Export the dbConnect function for use in your app
export default dbConnect;