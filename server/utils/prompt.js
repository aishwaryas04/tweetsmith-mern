// Builds the single prompt that does both steps:
// 1) infer the brand voice, 2) write 10 tweets in that voice.

function buildPrompt(brief) {
  const { brand, industry, objective, products } = brief;

  return [
    "You are a senior social media strategist who writes tweets for brands.",
    "",
    "BRAND BRIEF",
    `Brand name: ${brand || "(not given)"}`,
    `Industry / category: ${industry || "(not given)"}`,
    `Campaign objective: ${objective}`,
    `About the products: ${products || "(not given)"}`,
    "",
    "STEP 1, VOICE ANALYSIS",
    "Infer the brand's voice. If the brand is a real, well-known one, use what you know about how it actually communicates on Twitter/X. If it is unknown or not given, infer the voice from the industry, products and objective. Decide the tone (2 to 4 adjectives), the target audience, and 3 to 5 content themes. Then write exactly 4 short bullets that sum up the voice: how it sounds, how it writes, what it jokes about or avoids, how it handles offers.",
    "",
    "STEP 2, TWEETS",
    'Write exactly 10 tweets in that voice, shaped by the campaign objective. Use this mix: 3 "conversational" (questions, polls, replies-bait), 2 "promotional" (product or offer led), 3 "witty" (meme-style, relatable humour, in the brand\'s own kind of humour), 2 "informative" (tips, facts, value-driven).',
    "Rules:",
    "- Each tweet is 270 characters or fewer.",
    "- Every tweet must sound like this one brand wrote it. A reader should be able to guess the brand from the voice.",
    "- Vary openings and sentence shapes. No two tweets use the same joke structure.",
    "- Hashtags: at most 2 tweets use one, and never more than 2 in a tweet. Emoji only if the brand's voice uses them, at most 2 per tweet.",
    "- Do not invent facts: no made-up prices, discounts, coupon codes, dates or statistics. Only mention an offer if the brief mentions one. Otherwise keep promotional tweets about the product and the moment.",
    "- Use line breaks inside a tweet only when the format needs it (for example a two-line setup and punchline).",
    "- Do not quote or imitate real people.",
    "",
    "OUTPUT",
    "Reply with only one JSON object, no other text, in this shape:",
    '{"brand_label": string (the brand name, or a short descriptive label if none was given), "tone": [string], "audience": string, "themes": [string], "bullets": [string, string, string, string], "tweets": [{"style": "conversational" | "promotional" | "witty" | "informative", "text": string}]}',
  ].join("\n");
}

module.exports = { buildPrompt };
