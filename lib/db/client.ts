import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "best_reads";

if (!uri) {
  throw new Error("MONGODB_URI is not set in environment variables");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mongoDb: Db | undefined;
}

const client = new MongoClient(uri);

const clientPromise: Promise<MongoClient> =
  process.env.NODE_ENV === "development"
    ? (global._mongoClientPromise ||= client.connect())
    : client.connect();

/**
 * Get a connection to the MongoDB database. Caches the client/db during dev to
 * survive hot reloads.
 */
export const getDb = async (): Promise<Db> => {
  if (process.env.NODE_ENV === "development" && global._mongoDb) {
    return global._mongoDb;
  }

  const connectedClient = await clientPromise;
  const database = connectedClient.db(dbName);

  if (process.env.NODE_ENV === "development") {
    global._mongoDb = database;
  }

  return database;
};

/**
 * Close the MongoDB connection (typically for tests or shutdowns).
 */
export const closeConnection = async (): Promise<void> => {
  await client.close();
  if (process.env.NODE_ENV === "development") {
    global._mongoDb = undefined;
    global._mongoClientPromise = undefined;
  }
};
