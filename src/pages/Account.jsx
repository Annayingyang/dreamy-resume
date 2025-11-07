// src/pages/Account.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../style/account.css";

/* ==== LocalStorage keys  ==== */
const LS_USER   = "dreamy.auth.user.v1";    
const LS_PREFS  = "dreamy.cvPrefs.v1";      
const LS_RECO   = "dreamy.cvReco.v1";       
const DRAFT_PREFIX = "dreamy.tplDraft.";   

/* ---- utilities ---- */
const readJSON = (k, fallback = null) => {
  try { return JSON.parse(localStorage.getItem(k) || "null") ?? fallback; }
  catch { return fallback; }
};
const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

/* TemplateDetails */
function listTemplateDrafts() {
  const drafts = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) || "";
    if (key.startsWith(DRAFT_PREFIX)) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "null");
        if (data && data.tplId) {
          drafts.push({
            id: data.tplId,
            key,
            summary: {
              name: data?.heading?.name || "",
              surname: data?.heading?.surname || "",
              role: data?.heading?.role || "",
            },
          });
        }
      } catch {}
    }
  }
  // de-dup by tplId (last write wins)
  const byId = new Map();
  drafts.forEach(d => byId.set(d.id, d));
  return Array.from(byId.values());
}

/* Templates.jsx ids */
const TPL_META = {
  "pastel":         { name: "Pastel Classic",      thumb: "/assets/home/templates/pastel.png" },
  "mint":           { name: "Minimal Mint",        thumb: "/assets/home/templates/mint.png" },
  "dark":           { name: "Elegant Dark",        thumb: "/assets/home/templates/dark.png" },
  "serif-cream":    { name: "Serif Cream",         thumb: "/assets/home/templates/serif-cream.png" },
  "modern-sky":     { name: "Modern Sky",          thumb: "/assets/home/templates/modern-sky.png" },
  "charcoal-pro":   { name: "Charcoal Pro",        thumb: "/assets/home/templates/charcoal-pro.png" },
  "lavender-glow":  { name: "Lavender Glow",       thumb: "/assets/home/templates/lavender-glow.png" },
  "coral-warm":     { name: "Coral Warm",          thumb: "/assets/home/templates/coral-warm.png" },
  "slate-columns":  { name: "Slate Columns",       thumb: "/assets/home/templates/slate-columns.png" },
  "photo-left":     { name: "Photo Left",          thumb: "/assets/home/templates/photo-left.png" },
  "notion-blocks":  { name: "Notion Blocks",       thumb: "/assets/home/templates/notion-blocks.png" },
};
const asset = (p) => `${process.env.PUBLIC_URL}${p}`;

/* e-mail check */
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || "").trim());

export default function Account() {
  const nav = useNavigate();
  const location = useLocation();
  const { user, setUser, favourites = [] } = useApp();

  // if CreateCV already filled in, pre-seed name/email here
  const seedPrefs = readJSON(LS_PREFS, {});
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({
    name: (seedPrefs?.name || user?.name || "").trim(),
    email: (seedPrefs?.email || "").trim(),
    password: "", // purely local demo
  });
  const [err, setErr] = useState("");
  const [helloPulse, setHelloPulse] = useState(false);

  // restore existing session
  useEffect(() => {
    const saved = readJSON(LS_USER);
    if (saved?.email) {
      setUser?.(saved);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // friendly pulse when we have a name
  useEffect(() => {
    if ((user?.name || form.name)) {
      setHelloPulse(true);
      const t = setTimeout(() => setHelloPulse(false), 1200);
      return () => clearTimeout(t);
    }
  }, [user?.name, form.name]);

  // drafts + preferences + recommendation
  const drafts = useMemo(() => listTemplateDrafts(), []);
  const prefs  = useMemo(() => readJSON(LS_PREFS, {}), []);
  const reco   = useMemo(() => readJSON(LS_RECO, {}), []);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const switchMode = () => { setErr(""); setMode((m) => (m === "login" ? "signup" : "login")); };

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");

    // very lightweight demo logic (no backend):
    if (!isEmail(form.email)) return setErr("Please enter a valid email.");
    if (mode === "signup" && !form.name.trim()) return setErr("Please add your name.");

    // read any existing "account" we may have persisted
    const current = readJSON(LS_USER, null);

    if (mode === "signup") {
      const profile = {
        name: form.name.trim(),
        email: form.email.trim(),
        // DO NOT store real passwords in production—this is demo-only
        password: form.password || "",
        createdAt: new Date().toISOString(),
      };
      writeJSON(LS_USER, profile);
      setUser?.(profile);
      // tiny confetti tap by navigating back to the page the user came from
      if (location.state?.from) nav(location.state.from);
      return;
    }

    // login:
    if (!current || current.email !== form.email.trim()) {
      // first-time login without prior signup: treat as "soft signup"
      const soft = {
        name: form.name.trim() || "Guest",
        email: form.email.trim(),
        password: form.password || "",
        createdAt: new Date().toISOString(),
      };
      writeJSON(LS_USER, soft);
      setUser?.(soft);
    } else {
      // "authenticate" (demo)
      if ((current.password || "") !== (form.password || "")) {
        return setErr("Email found, but the password doesn’t match.");
      }
      setUser?.(current);
    }
  };

  const onLogout = () => {
    
    localStorage.removeItem(LS_USER);
    setUser?.(null);
    setForm((p) => ({ ...p, password: "" }));
    nav("/", { replace: true });
  };

  
  const displayName = (user?.name || prefs?.name || "there").trim();

  
  const recommendedId = useMemo(() => {
    const order = Array.isArray(reco?.ordered) ? reco.ordered : [];
    return order.length ? order[0] : null;
  }, [reco]);

  
  const profileRef = useRef(null);
  useEffect(() => {
    if (location.hash === "#me" && profileRef.current) {
      setTimeout(() => profileRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  }, [location.hash]);

  
  const LoggedOut = (
    <section className="account card auth">
      <header className="auth-head">
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="muted">
          Sign {mode === "login" ? "in" : "up"} to save templates, auto-fill details, and sync your pastel vibes.
        </p>
      </header>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        {mode === "signup" && (
          <label className="fg">
            <span>Name</span>
            <input
              placeholder="e.g. Anna Ying Yang"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </label>
        )}

        <label className="fg">
          <span>Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </label>

        <label className="fg">
          <span>Password</span>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />
        </label>

        {err && <p className="err" role="alert">{err}</p>}

        <div className="row">
          <button className="btn btn-primary" type="submit">
            {mode === "login" ? "Login" : "Sign up"}
          </button>
          <button className="btn" type="button" onClick={switchMode}>
            {mode === "login" ? "New here? Create account" : "Have an account? Login"}
          </button>
        </div>

        {/* shortcut  */}
        {(seedPrefs?.name || seedPrefs?.email) && (
          <p className="tiny muted" style={{ marginTop: 8 }}>
            Tip: we prefilled your details from CreateCV.
          </p>
        )}
      </form>

      <div className="auth-links">
        <Link className="pill" to="/create">← Back to Create</Link>
        <Link className="pill" to="/templates">Browse Templates</Link>
        <Link className="pill" to="/interview">Interview Tips</Link>
      </div>
    </section>
  );

  const LoggedIn = (
    <section className="account card profile" ref={profileRef}>
      <header className={`profile-head ${helloPulse ? "pulse" : ""}`}>
        <div className="avatar" aria-hidden="true" />
        <div>
          <h1>Hi, {displayName}</h1>
          <p className="muted">
            Your dashboard keeps your details, recommendations, and drafts together.
          </p>
          <div className="chip-row">
            {prefs?.job && <span className="chip">{prefs.job}</span>}
            {prefs?.role && <span className="chip">{prefs.role}</span>}
            {prefs?.color && <span className="chip">vibe: {prefs.color}</span>}
            {prefs?.tone && <span className="chip">tone: {prefs.tone}</span>}
          </div>
        </div>
        <div className="head-actions">
          <button className="btn" onClick={() => nav("/create")}>Edit details</button>
          <button className="btn btn-primary" onClick={() => nav("/templates")}>Pick a template</button>
          <button className="btn danger" onClick={onLogout}>Log out</button>
        </div>
      </header>

      {/* Recommended card */}
      <section className="recos">
        <h2>Recommended</h2>
        {recommendedId ? (
          <article className="reco-card">
            <div className="thumb">
              <img src={asset(TPL_META[recommendedId]?.thumb || "/assets/home/templates/pastel.png")}
                   alt="Recommended template preview" />
              <span className="badge">Recommended</span>
            </div>
            <div className="reco-meta">
              <h3>{TPL_META[recommendedId]?.name || "Pastel Classic"}</h3>
              <p className="muted">Based on your field, tone and vibe.</p>
              <div className="row">
                <button className="btn btn-primary" onClick={() => nav(`/templates/${recommendedId}`)}>
                  Use this
                </button>
                <button className="btn" onClick={() => nav("/templates")}>
                  See all
                </button>
              </div>
            </div>
          </article>
        ) : (
          <p className="muted">We’ll show a pick here after you finish CreateCV.</p>
        )}
      </section>

      {/* Saved templates  */}
      <section className="saves">
        <h2>Saved templates</h2>
        {!favourites.length ? (
          <p className="muted">No favourites yet. Explore and tap “Use this” to start.</p>
        ) : (
          <div className="grid">
            {favourites.map((t) => (
              <article key={t.id} className="tpl-mini">
                <img src={t.thumb} alt={`${t.name} preview`} />
                <div className="meta">
                  <strong>{t.name}</strong>
                  <button className="btn btn-sm" onClick={() => nav(`/templates/${t.id}`)}>
                    Open
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Drafts saved per template (TemplateDetails autosave) */}
      <section className="drafts">
        <h2>Drafts</h2>
        {!drafts.length ? (
          <p className="muted">No drafts yet. Start editing any template to see it here.</p>
        ) : (
          <div className="grid">
            {drafts.map((d) => {
              const meta = TPL_META[d.id] || {};
              const person = [d.summary?.name, d.summary?.surname].filter(Boolean).join(" ").trim();
              return (
                <article key={d.key} className="tpl-mini">
                  <img src={asset(meta.thumb || "/assets/home/templates/pastel.png")} alt={`${meta.name || d.id} preview`} />
                  <div className="meta">
                    <strong>{meta.name || d.id}</strong>
                    <p className="tiny muted">
                      {person ? `for ${person}` : (prefs?.name || "—")}
                    </p>
                    <div className="row">
                      <button className="btn btn-sm" onClick={() => nav(`/templates/${d.id}`)}>Continue</button>
                      <button
                        className="btn btn-sm danger"
                        onClick={() => {
                          localStorage.removeItem(d.key);
                          window.location.reload();
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );

  return user?.email ? LoggedIn : LoggedOut;
}
