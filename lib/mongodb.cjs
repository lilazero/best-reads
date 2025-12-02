const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config({ path: "./db.env" });

async function main() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("Connected to MongoDB");
    const collection = await client.db("best_reads").collection("books");
    // collections.forEach((collection) => {
    //   console.log("Collection:", collection.s.namespace.collection);
    // });
    console.log("Collection:", await collection.findOne());
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
