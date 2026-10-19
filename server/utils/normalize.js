const STYLES = ["conversational", "promotional", "witty", "informative"];

// Cleans the AI output so the frontend and database always get the same shape.
function normalizeResult(raw, brief) {
  if (!raw || !Array.isArray(raw.tweets)) return null;

  const tweets = raw.tweets
    .filter((t) => t && typeof t.text === "string" && t.text.trim())
    .map((t) => {
      const style = String(t.style || "").toLowerCase();
      return {
        style: STYLES.includes(style) ? style : "conversational",
        text: t.text.trim(),
      };
    })
    .slice(0, 10);

  if (tweets.length === 0) return null;

  const list = (value, max) =>
    Array.isArray(value) ? value.map(String).slice(0, max) : [];

  return {
    voice: {
      brandLabel: String(raw.brand_label || brief.brand || "Your brand"),
      tone: list(raw.tone, 5),
      audience: String(raw.audience || ""),
      themes: list(raw.themes, 6),
      bullets: list(raw.bullets, 4),
    },
    tweets,
  };
}

module.exports = { normalizeResult };
