export default function VoicePanel({ voice }) {
  return (
    <section className="panel">
      <h2>Brand voice: {voice.brandLabel}</h2>

      <div className="voice-grid">
        <div>
          <span className="label">Tone</span>
          <div className="tags">
            {voice.tone.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="label">Target audience</span>
          <p>{voice.audience}</p>
        </div>

        <div>
          <span className="label">Content themes</span>
          <div className="tags">
            {voice.themes.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <span className="label">Voice summary</span>
      <ul className="bullets">
        {voice.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </section>
  );
}
