import { useState } from "react";

const STYLE_LABEL = {
  conversational: "Engaging",
  promotional: "Promotional",
  witty: "Witty",
  informative: "Informative",
};

function handleFor(name) {
  const h = String(name || "brand").toLowerCase().replace(/[^a-z0-9]/g, "");
  return "@" + (h || "brand");
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function TweetCard({ tweet, brandName }) {
  const [copied, setCopied] = useState(false);
  const length = tweet.text.length;

  async function handleCopy() {
    const ok = await copyToClipboard(tweet.text);
    setCopied(ok);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <article className="tweet">
      <div className="tweet-top">
        <div className="avatar">{(brandName || "B").charAt(0).toUpperCase()}</div>
        <div className="who">
          <b>{brandName}</b>
          <span>{handleFor(brandName)}</span>
        </div>
        <span className={`style ${tweet.style}`}>
          <i />
          {STYLE_LABEL[tweet.style]}
        </span>
      </div>

      <p className="tweet-text">{tweet.text}</p>

      <div className="tweet-foot">
        <span className={`count ${length > 280 ? "over" : ""}`}>{length} / 280</span>
        <button type="button" onClick={handleCopy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </article>
  );
}

export default function TweetList({ tweets, brandName, onRegenerate }) {
  const [copiedAll, setCopiedAll] = useState(false);

  async function handleCopyAll() {
    const text = tweets.map((t, i) => `${i + 1}. ${t.text}`).join("\n\n");
    const ok = await copyToClipboard(text);
    setCopiedAll(ok);
    setTimeout(() => setCopiedAll(false), 1400);
  }

  return (
    <>
      <div className="tweets-head">
        <h2>{tweets.length} tweets</h2>
        <div className="row">
          <button type="button" onClick={onRegenerate}>
            Regenerate
          </button>
          <button type="button" onClick={handleCopyAll}>
            {copiedAll ? "Copied" : "Copy all"}
          </button>
        </div>
      </div>

      <div className="tweet-list">
        {tweets.map((tweet, i) => (
          <TweetCard key={i} tweet={tweet} brandName={brandName} />
        ))}
      </div>
    </>
  );
}
