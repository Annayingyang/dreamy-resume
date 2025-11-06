// src/pages/Templates.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Templates.css";

const LS_PREFS = "dreamy.cvPrefs.v1";
const LS_RECO  = "dreamy.cvReco.v1";

const asset = (p) => `${process.env.PUBLIC_URL}${p}`;

/** Category palette:

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
    categories: ["professional","minimal","elegant"] 
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
  const [cats, setCats] = useState([]); 

  // 1) Load user choices + recommendation from localStorage
 useEffect(() => {
  const savedPrefs = JSON.parse(localStorage.getItem(LS_PREFS) || "null");
  const savedReco  = JSON.parse(localStorage.getItem(LS_RECO)  || "null");
  setPrefs(savedPrefs);
  setReco(savedReco);

  // Only auto-set categories once
  if (savedPrefs?.tone) {
    const toneToCat = {
      professional: "professional",
      creative:     "fun",
      bold:         "unique",
      minimal:      "elegant",
    };
    const initial = toneToCat[savedPrefs.tone];
    if (initial) setCats([initial]);
  }
  
}, []);


  // toggle category chips
  const toggleCat = (id) =>
    setCats((prev) => (prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]));

  const clearFilters = () => setCats([]);

  // 2) apply search + filters + ordering by recommendation
  const templates = useMemo(() => {
    
    const term = q.trim().toLowerCase();
    let list = ALL_TEMPLATES.filter(t => {
      const hay = (t.name + " " + t.vibe + " " + (t.categories || []).join(" ")).toLowerCase();
      return term ? hay.includes(term) : true;
    });

    
    if (cats.length > 0) {
      list = list.filter(t => cats.every(cat => (t.categories || []).includes(cat)));
    }

    
    const order = reco?.ordered || ALL_TEMPLATES.map(t => t.id);
    const idx = (id) => {
      const i = order.indexOf(id);
      return i === -1 ? 999 : i;
    };
 // 1) normalise the colour value coming from CreateCV 
   const normalizeColor = (c) => {
     if (!c) return null;
     const x = String(c).trim().toLowerCase();
     const table = {
       
       mint: "mint", pink: "pink", lavender: "lavender", peach: "peach",
       coral: "coral", sky: "sky", charcoal: "charcoal", cream: "cream", slate: "slate",
       
       "#90ee90": "mint", "#98ff98": "mint",
       "#ffc0cb": "pink", "#ffb6c1": "pink",
       "#e6e6fa": "lavender",
       "#ffd5b7": "peach", "#ffb3a7": "peach", "#ff7f50": "coral",
       "#87ceeb": "sky", "#708090": "slate", "#2f2f2f": "charcoal", "#f5f5dc": "cream",
     };
     return table[x] || x; 
   };

   // 2) map normalised colour to a concrete template id
   const colorToTemplate = {
     mint: "mint", pink: "pastel", lavender: "lavender-glow", peach: "coral-warm",
     coral: "coral-warm", sky: "modern-sky", charcoal: "charcoal-pro",
     cream: "serif-cream", slate: "slate-columns",
   };
   const normColor = normalizeColor(prefs?.color);
   const colorPickId = colorToTemplate[normColor];

   // 3) find the first id from the recommender that survives filters
   const firstRecoInList = () => {
     for (const id of order) if (list.some(t => t.id === id)) return id;
     return null;
   };

   // 4) choose a SINGLE recommended id with clear priority:
   
   const recommendedId = (colorPickId && list.some(t => t.id === colorPickId))
     ? colorPickId
     : firstRecoInList();

   // 5) sort primarily by recommender order
   const sorted = list.slice().sort((a, b) => idx(a.id) - idx(b.id));
   if (recommendedId) {
     const i = sorted.findIndex(t => t.id === recommendedId);
     if (i > 0) {
       const [hit] = sorted.splice(i, 1);
       sorted.unshift(hit);
     }
   }

   return sorted.map(t => ({ ...t, recommended: t.id === recommendedId }));
    

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
          <article
  key={t.id}
  className={`tpl-card card ${t.recommended ? "recommended" : ""}`}
>

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
