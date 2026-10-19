
 // Talks to the AI provider. Switch provider with LLM_PROVIDER in .env.

async function callAnthropic(prompt) {
  const key = process.env.ANTHROPIC_API_KEY;

  if (!key || key.startsWith("paste-")) {
    throw new Error("ANTHROPIC_API_KEY is missing. Add it to server/.env.");
  }

  const Anthropic = require("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: key });

  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
    max_tokens: 2500,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
}

async function callOpenAI(prompt) {
  const key = process.env.OPENAI_API_KEY;

  if (!key) {
    throw new Error("OPENAI_API_KEY is missing. Add it to server/.env.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${detail}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    throw new Error("GEMINI_API_KEY is missing. Add it to server/.env.");
  }

  const { GoogleGenAI } = require("@google/genai");
  const client = new GoogleGenAI({ apiKey: key });

  const response = await client.models.generateContent({
    // model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    contents: prompt,
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response. Please try again.");
  }

  return response.text;
}

async function askModel(prompt) {
  const provider = (process.env.LLM_PROVIDER || "anthropic").toLowerCase();

  if (provider === "openai") {
    return callOpenAI(prompt);
  }

  if (provider === "gemini") {
    return callGemini(prompt);
  }

  return callAnthropic(prompt);
}

// Pulls the JSON object out of the model's reply, even if it adds extra text.
function parseJsonReply(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end < start) {
    throw new Error("The AI reply did not contain JSON.");
  }

  return JSON.parse(text.slice(start, end + 1));
}

module.exports = { askModel, parseJsonReply };
