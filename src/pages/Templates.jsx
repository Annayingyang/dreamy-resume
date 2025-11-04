// src/pages/Templates.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Templates.css";
// import "../style/Templates.css"; // optional later

const LS_PREFS = "dreamy.cvPrefs.v1";
const LS_RECO  = "dreamy.cvReco.v1";

const asset = (p) => `${process.env.PUBLIC_URL}${p}`;

const ALL_TEMPLATES = [
  { id: "pastel", name: "Pastel Classic",  thumb: asset("/assets/home/templates/pastel.png"),  vibe: "pink/lavender" },
  { id: "mint",   name: "Minimal Mint",    thumb: asset("/assets/home/templates/mint.png"),    vibe: "mint/green" },
  { id: "dark",   name: "Elegant Dark",    thumb: asset("/assets/home/templates/dark.png"),    vibe: "navy/gray" },
  { id: "serif-cream",   name: "Serif Cream",   thumb: asset("/assets/home/templates/serif-cream.png"),   vibe: "ivory/coffee" },
 { id: "modern-sky",    name: "Modern Sky",    thumb: asset("/assets/home/templates/modern-sky.png"),    vibe: "sky/white" },
 { id: "charcoal-pro",  name: "Charcoal Pro",  thumb: asset("/assets/home/templates/charcoal-pro.png"),  vibe: "charcoal/blue" },
{ id: "lavender-glow", name: "Lavender Glow", thumb: asset("/assets/home/templates/lavender-glow.png"), vibe: "lavender/silver" },
{ id: "coral-warm",    name: "Coral Warm",    thumb: asset("/assets/home/templates/coral-warm.png"),    vibe: "coral/sand" },
 { id: "slate-columns", name: "Slate Columns", thumb: asset("/assets/home/templates/slate-columns.png"), vibe: "slate/columns" },
 { id: "photo-left",    name: "Photo Left",    thumb: asset("/assets/home/templates/photo-left.png"),    vibe: "avatar/airy" },
{ id: "notion-blocks", name: "Notion Blocks", thumb: asset("/assets/home/templates/notion-blocks.png"), vibe: "neutral/blocks" },
];

export default function Templates() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(null);
  const [reco, setReco] = useState(null);
  const [q, setQ] = useState("");

  // 1) load user choices + recommendation from localStorage
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(LS_PREFS) || "null");
      const r = JSON.parse(localStorage.getItem(LS_RECO)  || "null");
      setPrefs(p);
      setReco(r);
    } catch {
      setPrefs(null);
      setReco(null);
    }
  }, []);

  // 2) apply search (optional) and ordering by recommendation
  const templates = useMemo(() => {
    let list = ALL_TEMPLATES;

    // simple search
    if (q.trim()) {
      const term = q.trim().toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(term) ||
        t.vibe.toLowerCase().includes(term)
      );
    }

    // ordering by reco.ordered if present
    const order = reco?.ordered || ALL_TEMPLATES.map(t => t.id);
    const idx = (id) => {
      const i = order.indexOf(id);
      return i === -1 ? 999 : i;
    };

    // build with a recommended flag
    const topId = order[0]; // strongest recommendation
    return list
      .slice()
      .sort((a, b) => idx(a.id) - idx(b.id))
      .map(t => ({
        ...t,
        recommended: t.id === topId || (prefs?.color === "mint" && t.id === "mint"),
      }));
  }, [q, reco, prefs]);

  const onUse = (tpl) => {
    // forward prefs + template selection
    navigate(`/templates/${tpl.id}`, { state: { prefs, from: "templates" } });
  };

  return (
    <section className="templates container">
      <header className="templates-header">
        <h1>Choose a template</h1>

        {/* tiny recap from CreateCV */}
        {prefs ? (
         <p className="profile-intro">
   <strong>{prefs.name || "Your Name"}</strong> — aspiring <em>{prefs.role || "Professional"}</em> <br />
  {prefs.experience || "0"} years of experience in {prefs.job || "your field"}<br />
  <span className="subtle">
    Dreamy vibe: <span className="pill">{prefs.color || "mint"}</span> · Font: <span className="pill">{prefs.font || "Inter"}</span>
  </span>
</p>

        ) : (
          <p className="muted">Tip: Start at Create to get personalized picks.</p>
        )}

        <div className="templates-actions">
          <input
            className="input"
            placeholder="Search templates…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
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
