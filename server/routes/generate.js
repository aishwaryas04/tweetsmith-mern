const express = require("express");
const mongoose = require("mongoose");
const Generation = require("../models/Generation");
const { buildPrompt } = require("../utils/prompt");
const { askModel, parseJsonReply } = require("../utils/llm");
const { normalizeResult } = require("../utils/normalize");

const router = express.Router();

const OBJECTIVES = [
  "Engagement",
  "Promotion",
  "Awareness",
  "Product launch",
  "Community building",
];

const dbReady = () => mongoose.connection.readyState === 1;

// POST /api/generate  -> voice summary + 10 tweets
router.post("/generate", async (req, res) => {
  const body = req.body || {};
  const brief = {
    brand: String(body.brand || "").trim().slice(0, 100),
    industry: String(body.industry || "").trim().slice(0, 100),
    objective: OBJECTIVES.includes(body.objective) ? body.objective : "Engagement",
    products: String(body.products || "").trim().slice(0, 1500),
  };

  if (!brief.brand && !brief.industry && !brief.products) {
    return res
      .status(400)
      .json({ error: "Add a brand name or a few product details first." });
  }

  try {
    const reply = await askModel(buildPrompt(brief));
    const result = normalizeResult(parseJsonReply(reply), brief);

    if (!result) {
      return res
        .status(502)
        .json({ error: "The AI reply was not usable. Please try again." });
    }

    let id = null;
    if (dbReady()) {
      try {
        const saved = await Generation.create({ brief, ...result });
        id = saved._id;
      } catch (err) {
        console.warn("Could not save to MongoDB:", err.message);
      }
    }

    res.json({ id, brief, ...result });
  } catch (err) {
    console.error("Generate failed:", err.message);
    res.status(500).json({ error: err.message || "Generation failed." });
  }
});

// GET /api/history  -> last 10 saved generations
router.get("/history", async (req, res) => {
  if (!dbReady()) {
    return res.json({ enabled: false, items: [] });
  }
  try {
    const items = await Generation.find().sort({ createdAt: -1 }).limit(10).lean();
    res.json({ enabled: true, items });
  } catch (err) {
    res.status(500).json({ error: "Could not load history." });
  }
});

module.exports = router;
