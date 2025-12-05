import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not set in environment variables");
}

const client = new MongoClient(uri);
let db: Db | null = null;

export const getDb = async (): Promise<Db> => {
  if (db) return db;
  await client.connect();
  db = client.db("best_reads");
  return db;
};
