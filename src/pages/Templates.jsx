import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Templates() {
  const { addFavourite, favourites } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  // Static demo templates (with style for TemplateDetails)
  const demoTemplates = [
    { id: 1, name: "Pastel Classic", thumb: "/assets/templates/pastel.png", style: "pastel" },
    { id: 2, name: "Minimal Mint", thumb: "/assets/templates/mint.png", style: "mint" },
    { id: 3, name: "Elegant Dark", thumb: "/assets/templates/dark.png", style: "dark" }
  ];

  // Fetch extra mock templates (optional, from JSONPlaceholder)
  useEffect(() => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/photos?_limit=9")
      .then(r => r.json())
      .then(data => {
        const mapped = data.map(p => ({
          id: p.id + 100, // offset IDs to avoid conflict with demo
          name: (p.title || "Template").slice(0, 24),
          thumb: p.thumbnailUrl,
          style: "pastel" // fallback style
        }));
        setItems(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return [...demoTemplates, ...items].filter(i =>
      i.name.toLowerCase().includes(term)
    );
  }, [items, q]);

  return (
    <section className="container">
      <h1>Choose a Template</h1>

      {/* search bar */}
      <div className="card" style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr auto", marginBottom: 20 }}>
        <input
          placeholder="Search templates…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-sm" onClick={() => setQ("")}>
          Clear
        </button>
      </div>

      {/* template grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {loading && items.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card skeleton" style={{ height: 180 }} />
            ))
          : filtered.map((t) => (
              <Link
                key={t.id}
                to={`/templates/${t.id}`}
                state={{ style: t.style }}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="card" style={{ padding: "12px", borderRadius: "12px", textAlign: "center" }}>
                  <img
                    src={t.thumb}
                    alt={t.name}
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid var(--ring)",
                    }}
                  />
                  <h3 style={{ marginTop: "12px" }}>{t.name}</h3>
                  <button
                    className="btn btn-sm"
                    style={{ marginTop: 8 }}
                    onClick={(e) => {
                      e.preventDefault(); // prevent link navigation
                      addFavourite(t);
                    }}
                  >
                    {favourites.some((f) => f.id === t.id) ? "Added" : "Add"}
                  </button>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}
