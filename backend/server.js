const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your actual connection string
const uri = "mongodb+srv://Ayesha:56best@cluster0.tbuil2v.mongodb.net/?appName=Cluster0";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
    insertSampleData(); // Insert data automatically once connected
  })
  .catch((err) => console.log("MongoDB connection failed:", err.message));

// Schema
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
});

const MenuItem = mongoose.model("MenuItem", menuSchema);

// Function to insert sample data (only if empty)
async function insertSampleData() {
  const count = await MenuItem.countDocuments();
  if (count === 0) {
    await MenuItem.insertMany([
      { name: "Espresso", category: "Hot Drinks", price: 800.5 },
      { name: "Cappuccino", category: "Hot Drinks", price: 550.5 },
      { name: "Latte", category: "Hot Drinks", price: 900.0 },
      { name: "Iced Coffee", category: "Cold Drinks", price: 800.0 },
      { name: "Croissant", category: "Pastries", price: 700.5 },
      { name: "Muffin", category: "Pastries", price: 400.0, inStock: false },
    ]);
    console.log("? Server connected to MongoDB!");
  } else {
    console.log("? Data already exists — skipping sample insert.");
  }
}

// --- Endpoints ---
app.get("/menu", async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to get menu" });
  }
});

app.get("/menu/random", async (req, res) => {
  try {
    const items = await MenuItem.find({ inStock: true });
    const random = items[Math.floor(Math.random() * items.length)];
    res.json(random);
  } catch (err) {
    res.status(500).json({ error: "Failed to get random item" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Coffee shop server running on port 3000");
});
