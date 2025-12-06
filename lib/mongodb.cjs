const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "best_reads";

let db = null;

// Connect once and reuse the connection
async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  }
  return db;
}

// Get all users
async function getUsers() {
  const database = await connectDB();
  return await database.collection("users").find({}).toArray();
}

// Get user by ID
async function getUserById(id) {
  const database = await connectDB();
  return await database.collection("users").findOne({ _id: id });
}

// Get all authors
async function getAuthors() {
  const database = await connectDB();
  return await database.collection("authors").find({}).toArray();
}

// Get reviews for a specific book
async function getReviewsByBookId(bookId) {
  const database = await connectDB();
  return await database.collection("reviews").find({ bookId }).toArray();
}

// Get wishlist for a specific user
async function getWishlistByUserId(userId) {
  const database = await connectDB();
  return await database.collection("wishlists").findOne({ userId });
}

// Close connection when done
async function closeConnection() {
  if (client) {
    await client.close();
    db = null;
    console.log("Connection closed");
  }
}

// Export functions
// Note: Book-related functions (getBooks, getBookById, getBookCount, getTags) 
// have been moved to lib/db/books.ts
module.exports = {
  connectDB,
  getUsers,
  getUserById,
  getAuthors,
  getReviewsByBookId,
  getWishlistByUserId,
  closeConnection
};