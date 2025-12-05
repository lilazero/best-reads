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

// Get all books with optional tag filter
async function getBooks(tag) {
  const database = await connectDB();
  const filter = tag ? { "tags.value": tag } : {};
  const books = await database.collection("books").find(filter).toArray();
  
  // Convert ObjectIds to strings
  return books.map(book => ({
    ...book,
    _id: book._id.toString(),
    authorId: book.authorId ? book.authorId.toString() : null
  }));
}

// Get a single book by ID
async function getBookById(id) {
  const database = await connectDB();
  return await database.collection("books").findOne({ _id: id });
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

// Get all genres
async function getGenres() {
  const database = await connectDB();
  const genres = await database.collection("genres").find({}).toArray();

  // Convert ObjectIds to strings
  return genres.map(genre => ({
    ...genre,
    _id: genre._id.toString()
  }));
}

// Get all tags (renamed from getGenres)
async function getTags() {
  const database = await connectDB();
  const tags = await database.collection("tags").find({}).toArray();
  
  // Convert ObjectIds to strings if they exist
  return tags.map(tag => ({
    ...tag,
    _id: tag._id ? tag._id.toString() : tag.id
  }));
}

// Export functions
module.exports = {
  connectDB,
  getBooks,
  getBookById,
  getUsers,
  getUserById,
  getAuthors,
  getReviewsByBookId,
  getWishlistByUserId,
  getTags, // renamed from getGenres
  closeConnection
};