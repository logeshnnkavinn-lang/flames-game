const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve frontend
app.use(express.static("public"));

// --- MONGODB CONNECTION ---
const uri = process.env.MONGODB_URI || "mongodb+srv://logeshnnkavinn_db_user:Logeshnnkavinn7@cluster0.z9yk07k.mongodb.net/majab?appName=Cluster0";

mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB (majab database)"))
  .catch(err => console.log("❌ DB Error:", err));

const flamesSchema = new mongoose.Schema({
  name1: String,
  name2: String,
  result: String,
  date: { type: Date, default: Date.now }
});

const Flames = mongoose.model("maja", flamesSchema,"maja");

// --- FLAMES LOGIC ---
function calculateFlames(name1, name2) {
  let n1 = name1.toLowerCase().replace(/\s/g, "").split("");
  let n2 = name2.toLowerCase().replace(/\s/g, "").split("");

  for (let i = 0; i < n1.length; i++) {
    const char = n1[i];
    const idx = n2.indexOf(char);
    if (idx !== -1) {
      n2.splice(idx, 1);
      n1.splice(i, 1);
      i--; // Adjust index since n1 shifted
    }
  }

  const count = n1.length + n2.length;
  const flames = ["Friends", "Love", "Affection", "Marriage", "Enemy", "Siblings"];
  return flames[(count % flames.length)];
}

// --- API ROUTE ---
app.post("/calculate", async (req, res) => {
  const { name1, name2 } = req.body;
  const result = calculateFlames(name1, name2);

  const entry = new Flames({ name1, name2, result });
  await entry.save();

  res.json({ result });
});

// --- VIEW STORED DATA ---
app.get("/view", async (req, res) => {
  const data = await Flames.find().sort({ date: -1 });
  res.json(data);
});

// Start server
app.listen(3000, () => console.log("🚀 Server running on port 3000"));
