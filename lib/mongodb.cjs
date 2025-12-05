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

// Get books with optional tag filter and pagination
async function getBooks(tag, page = 1, limit = 30) {
  const database = await connectDB();
  const filter = tag ? { "tags.value": tag } : {};
  const skip = (page - 1) * limit;
  
  const books = await database
    .collection("books")
    .find(filter)
    .skip(skip)
    .limit(limit)
    .toArray();
  
  // Convert ObjectIds to strings
  return books.map(book => ({
    ...book,
    _id: book._id.toString(),
    authorId: book.authorId ? book.authorId.toString() : null
  }));
}

// Get book count with optional tag filter
async function getBookCount(tag) {
  const database = await connectDB();
  const filter = tag ? { "tags.value": tag } : {};
  return await database.collection("books").countDocuments(filter);
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


// Get all tags aggregated from books collection (only tags that have matching books)
// Sorted alphabetically by tag value
async function getTags() {
  const database = await connectDB();
  
  const pipeline = [
    // Unwind the tags array so each tag becomes a separate document
    { $unwind: "$tags" },
    // Group by tag value to get unique tags with count
    {
      $group: {
        _id: "$tags.value",
        id: { $first: "$tags.id" },
        value: { $first: "$tags.value" },
        icon: { $first: "$tags.icon" },
        count: { $sum: 1 }
      }
    },
    // Sort alphabetically by tag value
    { $sort: { value: 1 } },
    // Project to final shape
    {
      $project: {
        _id: 0,
        id: 1,
        value: 1,
        icon: 1,
        count: 1
      }
    }
  ];
  
  return await database.collection("books").aggregate(pipeline).toArray();
}

// Export functions
module.exports = {
  connectDB,
  getBooks,
  getBookById,
  getBookCount,
  getUsers,
  getUserById,
  getAuthors,
  getReviewsByBookId,
  getWishlistByUserId,
  getTags,
  closeConnection
};