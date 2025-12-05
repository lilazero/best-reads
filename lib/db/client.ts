import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not set in environment variables");
}

const client = new MongoClient(uri);
let db: Db | null = null;

/**
 * Get a connection to the MongoDB database.
 * Uses singleton pattern to reuse the connection.
 */
export const getDb = async (): Promise<Db> => {
  if (db) return db;
  await client.connect();
  db = client.db("best_reads");
  console.log("Connected to MongoDB");
  return db;
};

/**
 * Close the MongoDB connection.
 */
export const closeConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
    db = null;
    console.log("Connection closed");
  }
};
