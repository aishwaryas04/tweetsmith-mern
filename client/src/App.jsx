import { useEffect, useState } from "react";
import BriefForm from "./components/BriefForm.jsx";
import VoicePanel from "./components/VoicePanel.jsx";
import TweetList from "./components/TweetList.jsx";
import History from "./components/History.jsx";
import { generateTweets, getHistory } from "./api.js";

const EMPTY_BRIEF = {
  brand: "",
  industry: "",
  objective: "Engagement",
  products: "",
};

const EXAMPLES = [
  {
    label: "Zomato",
    brief: {
      brand: "Zomato",
      industry: "Food delivery",
      objective: "Engagement",
      products:
        "Restaurant discovery and food delivery app for urban India. Late-night cravings, group orders, quick delivery, lots of cuisines.",
    },
  },
  {
    label: "Tanishq",
    brief: {
      brand: "Tanishq",
      industry: "Jewellery",
      objective: "Promotion",
      products:
        "Gold and diamond jewellery for weddings, festivals and gifting. Bridal collections, everyday wear, hallmarked gold.",
    },
  },
];

export default function App() {
  const [brief, setBrief] = useState(EMPTY_BRIEF);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState({ enabled: false, items: [] });

  const loadHistory = () =>
    getHistory()
      .then(setHistory)
      .catch(() => setHistory({ enabled: false, items: [] }));

  useEffect(() => {
    loadHistory();
  }, []);

  async function handleGenerate() {
    if (!brief.brand.trim() && !brief.industry.trim() && !brief.products.trim()) {
      setError("Add a brand name or a few product details first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await generateTweets(brief);
      setResult(data);
      loadHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openFromHistory(item) {
    setBrief(item.brief);
    setResult({
      brief: item.brief,
      voice: item.voice,
      tweets: item.tweets,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app">
      <header>
        <h1>Tweetsmith</h1>
        <p>Describe a brand. Get a read on its voice and ten tweets that sound like it.</p>
      </header>

      <div className="grid">
        <aside className="sidebar">
          <BriefForm
            brief={brief}
            setBrief={setBrief}
            onSubmit={handleGenerate}
            loading={loading}
            error={error}
            examples={EXAMPLES}
          />
          <History history={history} onOpen={openFromHistory} />
        </aside>

        <main className="results">
          {loading && (
            <section className="panel loading">
              Reading the brand voice and writing tweets. This takes up to a minute.
            </section>
          )}

          {!loading && result && (
            <>
              <VoicePanel voice={result.voice} />
              <TweetList
                tweets={result.tweets}
                brandName={result.voice.brandLabel}
                onRegenerate={handleGenerate}
              />
            </>
          )}

          {!loading && !result && (
            <section className="panel empty">
              <h2>Your tweets will appear here</h2>
              <p>
                Fill in the brief and press Generate, or load one of the examples to
                see how the tone changes from brand to brand.
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
