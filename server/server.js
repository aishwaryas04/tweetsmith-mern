require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const generateRoutes = require("./routes/generate");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    provider: process.env.LLM_PROVIDER || "anthropic",
    database: mongoose.connection.readyState === 1 ? "connected" : "off",
  });
});

app.use("/api", generateRoutes);

// Any unknown API route
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Route not found." });
});

async function start() {
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("MongoDB connected.");
    } catch (err) {
      console.warn("MongoDB not reachable. Running without history.");
      console.warn(err.message);
    }
  } else {
    console.log("No MONGO_URI set. Running without history.");
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
