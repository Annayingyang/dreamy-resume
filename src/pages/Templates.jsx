// src/pages/Templates.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Templates.css";

const LS_PREFS = "dreamy.cvPrefs.v1";
const LS_RECO  = "dreamy.cvReco.v1";

const asset = (p) => `${process.env.PUBLIC_URL}${p}`;

/** Category palette:
 * "professional" | "fun" | "elegant" | "unique"
 */
const ALL_TEMPLATES = [
  {
    id: "pastel",
    name: "Pastel Classic",
    thumb: asset("/assets/home/templates/pastel.png"),
    vibe: "pink/lavender",
    categories: ["fun","elegant"]
  },
  {
    id: "mint",
    name: "Minimal Mint",
    thumb: asset("/assets/home/templates/mint.png"),
    vibe: "mint/green",
    categories: ["professional","minimal","elegant"] // minimal is optional tag
  },
  {
    id: "dark",
    name: "Elegant Dark",
    thumb: asset("/assets/home/templates/dark.png"),
    vibe: "navy/gray",
    categories: ["elegant","professional"]
  },
  {
    id: "serif-cream",
    name: "Serif Cream",
    thumb: asset("/assets/home/templates/serif-cream.png"),
    vibe: "ivory/coffee",
    categories: ["professional","elegant"]
  },
  {
    id: "modern-sky",
    name: "Modern Sky",
    thumb: asset("/assets/home/templates/modern-sky.png"),
    vibe: "sky/white",
    categories: ["professional","unique"]
  },
  {
    id: "charcoal-pro",
    name: "Charcoal Pro",
    thumb: asset("/assets/home/templates/charcoal-pro.png"),
    vibe: "charcoal/blue",
    categories: ["professional","bold"]
  },
  {
    id: "lavender-glow",
    name: "Lavender Glow",
    thumb: asset("/assets/home/templates/lavender-glow.png"),
    vibe: "lavender/silver",
    categories: ["fun","unique","elegant"]
  },
  {
    id: "coral-warm",
    name: "Coral Warm",
    thumb: asset("/assets/home/templates/coral-warm.png"),
    vibe: "coral/sand",
    categories: ["fun","bold"]
  },
  {
    id: "slate-columns",
    name: "Slate Columns",
    thumb: asset("/assets/home/templates/slate-columns.png"),
    vibe: "slate/columns",
    categories: ["professional","elegant"]
  },
  {
    id: "photo-left",
    name: "Photo Left",
    thumb: asset("/assets/home/templates/photo-left.png"),
    vibe: "avatar/airy",
    categories: ["unique","fun"]
  },
  {
    id: "notion-blocks",
    name: "Notion Blocks",
    thumb: asset("/assets/home/templates/notion-blocks.png"),
    vibe: "neutral/blocks",
    categories: ["unique","minimal"]
  },
];

const CATEGORY_FILTERS = [
  { id: "professional", label: "Professional" },
  { id: "fun",         label: "Fun" },
  { id: "elegant",     label: "Elegant" },
  { id: "unique",      label: "Unique" },
];

export default function Templates() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(null);
  const [reco, setReco] = useState(null);

  const [q, setQ] = useState("");
  const [cats, setCats] = useState([]); // selected category ids

  // 1) Load user choices + recommendation from localStorage
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(LS_PREFS) || "null");
      const r = JSON.parse(localStorage.getItem(LS_RECO)  || "null");
      setPrefs(p);
      setReco(r);

      // Auto-preselect category by tone for convenience
      if (p?.tone) {
        const toneToCat = {
          professional: "professional",
          creative:     "fun",
          bold:         "unique",
          minimal:      "elegant", // or leave none if you prefer
        };
        const initial = toneToCat[p.tone];
        if (initial && !cats.includes(initial)) {
          setCats([initial]);
        }
      }
    } catch {
      setPrefs(null);
      setReco(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // toggle category chips
  const toggleCat = (id) =>
    setCats((prev) => (prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]));

  const clearFilters = () => setCats([]);

  // 2) apply search + filters + ordering by recommendation
  const templates = useMemo(() => {
    // text search first
    const term = q.trim().toLowerCase();
    let list = ALL_TEMPLATES.filter(t => {
      const hay = (t.name + " " + t.vibe + " " + (t.categories || []).join(" ")).toLowerCase();
      return term ? hay.includes(term) : true;
    });

    // category filters (AND across selected categories, or choose OR by changing 'every' to 'some')
    if (cats.length > 0) {
      list = list.filter(t => cats.every(cat => (t.categories || []).includes(cat)));
    }

    // order by recommendation if present
    const order = reco?.ordered || ALL_TEMPLATES.map(t => t.id);
    const idx = (id) => {
      const i = order.indexOf(id);
      return i === -1 ? 999 : i;
    };

    // recommended flag
    const topId = order[0];
    const preferredColorId = prefs?.color === "mint" ? "mint" : null;

    return list
      .slice()
      .sort((a, b) => idx(a.id) - idx(b.id))
      .map(t => ({
        ...t,
        recommended:
          t.id === topId ||
          (preferredColorId && t.id === preferredColorId)
      }));
  }, [q, cats, reco, prefs]);

  const onUse = (tpl) => {
    navigate(`/templates/${tpl.id}`, { state: { prefs, from: "templates" } });
  };

  return (
    <section className="templates container">
      <header className="templates-header">
        <h1>Choose a template</h1>

        {/* tiny recap from CreateCV */}
        {prefs ? (
          <p className="profile-intro">
            <strong>{prefs.name || "Your Name"}</strong> — aspiring <em>{prefs.role || "Professional"}</em><br />
            {prefs.experience || "0"} years in {prefs.job || "your field"}<br />
            <span className="subtle">
              Vibe: <span className="pill">{prefs.color || "mint"}</span>
              {prefs.tone && <> · Tone: <span className="pill">{prefs.tone}</span></>}
            </span>
          </p>
        ) : (
          <p className="muted">Tip: Start at Create to get personalized picks.</p>
        )}

        {/* Actions: search + category chips */}
        <div className="templates-actions">
          <input
            className="input"
            placeholder="Search templates…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="chip-row" role="group" aria-label="Filter by category">
            {CATEGORY_FILTERS.map(f => (
              <button
                key={f.id}
                type="button"
                className={`chip ${cats.includes(f.id) ? "is-active" : ""}`}
                aria-pressed={cats.includes(f.id)}
                onClick={() => toggleCat(f.id)}
                title={`Filter: ${f.label}`}
              >
                {f.label}
              </button>
            ))}
            {cats.length > 0 && (
              <button className="chip chip-clear" onClick={clearFilters} title="Clear filters">
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* grid */}
      <div className="tpl-grid">
        {templates.map(t => (
          <article key={t.id} className="tpl-card card">
            <div className="thumb-wrap">
              <img src={t.thumb} alt={`${t.name} preview`} />
              {t.recommended && <span className="badge-reco">Recommended</span>}
            </div>

            <div className="tpl-meta">
              <h3>{t.name}</h3>
              <p className="muted">{t.vibe}</p>
              <div className="mini-tags">
                {(t.categories || []).filter(c => ["professional","fun","elegant","unique"].includes(c)).map(c => (
                  <span key={c} className={`mini-pill cat-${c}`}>{c}</span>
                ))}
              </div>
            </div>

            <div className="tpl-actions">
              <button className="btn btn-primary" onClick={() => onUse(t)}>
                Use this
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
