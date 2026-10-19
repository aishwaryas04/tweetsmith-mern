const OBJECTIVES = [
  "Engagement",
  "Promotion",
  "Awareness",
  "Product launch",
  "Community building",
];

export default function BriefForm({ brief, setBrief, onSubmit, loading, error, examples }) {
  const update = (field) => (e) => setBrief({ ...brief, [field]: e.target.value });

  return (
    <form
      className="panel form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2>Brand brief</h2>

      <div className="field">
        <label htmlFor="brand">
          Brand name <span className="opt">optional</span>
        </label>
        <input
          id="brand"
          type="text"
          placeholder="e.g. Zomato"
          value={brief.brand}
          onChange={update("brand")}
          maxLength={100}
        />
      </div>

      <div className="field">
        <label htmlFor="industry">
          Industry / category <span className="opt">optional</span>
        </label>
        <input
          id="industry"
          type="text"
          placeholder="e.g. Food delivery"
          value={brief.industry}
          onChange={update("industry")}
          maxLength={100}
        />
      </div>

      <div className="field">
        <label htmlFor="objective">Campaign objective</label>
        <select id="objective" value={brief.objective} onChange={update("objective")}>
          {OBJECTIVES.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="products">About the brand's products</label>
        <textarea
          id="products"
          placeholder="What does the brand sell, who is it for, anything the tweets should mention?"
          value={brief.products}
          onChange={update("products")}
          maxLength={1500}
        />
      </div>

      <button type="submit" className="primary" disabled={loading}>
        {loading ? "Generating..." : "Generate 10 tweets"}
      </button>

      {error && <p className="status err">{error}</p>}

      <div className="field">
        <span className="label">Load an example</span>
        <div className="row">
          {examples.map((ex) => (
            <button
              key={ex.label}
              type="button"
              className="chip-btn"
              onClick={() => setBrief(ex.brief)}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      <p className="hint">Brand name or product details are enough. Add both for sharper results.</p>
    </form>
  );
}
