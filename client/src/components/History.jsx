export default function History({ history, onOpen }) {
  // Hidden when MongoDB is not connected.
  if (!history.enabled) return null;

  return (
    <section className="panel history">
      <h2>Recent generations</h2>
      {history.items.length === 0 ? (
        <p className="hint">Nothing saved yet. Your last 10 runs will show up here.</p>
      ) : (
        <ul>
          {history.items.map((item) => (
            <li key={item._id}>
              <button type="button" className="history-item" onClick={() => onOpen(item)}>
                <b>{item.voice?.brandLabel || item.brief?.brand || "Untitled"}</b>
                <span>
                  {item.brief?.objective} · {new Date(item.createdAt).toLocaleString()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
