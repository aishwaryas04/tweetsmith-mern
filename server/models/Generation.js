const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema(
  {
    style: {
      type: String,
      enum: ["conversational", "promotional", "witty", "informative"],
      required: true,
    },
    text: { type: String, required: true },
  },
  { _id: false }
);

const generationSchema = new mongoose.Schema(
  {
    brief: {
      brand: { type: String, default: "" },
      industry: { type: String, default: "" },
      objective: { type: String, default: "Engagement" },
      products: { type: String, default: "" },
    },
    voice: {
      brandLabel: String,
      tone: [String],
      audience: String,
      themes: [String],
      bullets: [String],
    },
    tweets: [tweetSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Generation", generationSchema);
