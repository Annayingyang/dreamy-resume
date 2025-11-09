
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../style/account.css";


// A dictionary of users, keyed by email: { [email]: {name, email, passwordHash, avatarColor, createdAt} }
const LS_USERS    = "dreamy.auth.users.v1";

const LS_SESSION  = "dreamy.auth.session.v1";

const LS_PREFS    = "dreamy.cvPrefs.v1";
const LS_RECO     = "dreamy.cvReco.v1";
const DRAFT_PREFIX = "dreamy.tplDraft.";

/* JSON helpers */
const readJSON = (k, fallback = null) => {
  try { return JSON.parse(localStorage.getItem(k) || "null") ?? fallback; }
  catch { return fallback; }
};
const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

/* Crypto: hash passwords so we never store them raw */
async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

/* Users CRUD (local) */
function readUsers() { return readJSON(LS_USERS, {}); }
function writeUsers(users) { writeJSON(LS_USERS, users || {}); }
function getSessionEmail() { return localStorage.getItem(LS_SESSION) || ""; }
function setSessionEmail(email) {
  if (email) localStorage.setItem(LS_SESSION, email);
  else localStorage.removeItem(LS_SESSION);
}

/* Misc */
const TPL_META = {
  pastel: { name: "Pastel Classic", thumb: "/assets/home/templates/pastel.png" },
  mint: { name: "Minimal Mint", thumb: "/assets/home/templates/mint.png" },
  dark: { name: "Elegant Dark", thumb: "/assets/home/templates/dark.png" },
  "serif-cream": { name: "Serif Cream", thumb: "/assets/home/templates/serif-cream.png" },
  "modern-sky": { name: "Modern Sky", thumb: "/assets/home/templates/modern-sky.png" },
  "charcoal-pro": { name: "Charcoal Pro", thumb: "/assets/home/templates/charcoal-pro.png" },
  "lavender-glow": { name: "Lavender Glow", thumb: "/assets/home/templates/lavender-glow.png" },
  "coral-warm": { name: "Coral Warm", thumb: "/assets/home/templates/coral-warm.png" },
  "slate-columns": { name: "Slate Columns", thumb: "/assets/home/templates/slate-columns.png" },
  "photo-left": { name: "Photo Left", thumb: "/assets/home/templates/photo-left.png" },
  "notion-blocks": { name: "Notion Blocks", thumb: "/assets/home/templates/notion-blocks.png" },
};
const asset = (p) => `${process.env.PUBLIC_URL}${p}`;
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || "").trim());

/* Draft discovery (unchanged) */
function listTemplateDrafts() {
  const drafts = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) || "";
    if (key.startsWith(DRAFT_PREFIX)) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "null");
        if (data && data.tplId) {
          drafts.push({
            id: data.tplId, key,
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
  const byId = new Map();
  drafts.forEach(d => byId.set(d.id, d));
  return Array.from(byId.values());
}


const AVATAR_VIBES = [
  { key: "rose",     label: "Rose" },
  { key: "mint",     label: "Mint" },
  { key: "lavender", label: "Lavender" },
  { key: "sky",      label: "Sky" },
  { key: "coral",    label: "Coral" },
  { key: "dark",     label: "Dark" },
];

export default function Account() {
  const nav = useNavigate();
  const location = useLocation();
  const { user, setUser, favourites = [] } = useApp();

  const seedPrefs = readJSON(LS_PREFS, {});
  const [mode, setMode] = useState("login"); 
  const [form, setForm] = useState({
    name: (seedPrefs?.name || user?.name || "").trim(),
    email: (seedPrefs?.email || "").trim(),
    password: "",
  });
  const [err, setErr] = useState("");
  const [helloPulse, setHelloPulse] = useState(false);

  // UI/UX toggles
  const [remember, setRemember] = useState(true); 
  const [authLoading, setAuthLoading] = useState(false);

  
  const [pageLoading, setPageLoading] = useState(true);
  const [pageHint, setPageHint] = useState("");

 
  useEffect(() => {
    const email = getSessionEmail();
    if (!email) return;
    const users = readUsers();
    const existing = users[email];
    if (existing) setUser?.(existing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    setPageLoading(true);
    setPageHint("");
    fetch("https://jsonplaceholder.typicode.com/todos/1", { signal: ac.signal })
      .then(r => r.json())
      .then(() => setPageHint("Synced ✓"))
      .catch((e) => { if (e.name !== "AbortError") setPageHint("Offline — using local data"); })
      .finally(() => setPageLoading(false));
    return () => ac.abort();
  }, []);

  useEffect(() => {
    if ((user?.name || form.name)) {
      setHelloPulse(true);
      const t = setTimeout(() => setHelloPulse(false), 1200);
      return () => clearTimeout(t);
    }
  }, [user?.name, form.name]);

  const drafts = useMemo(() => listTemplateDrafts(), []);
  const prefs  = useMemo(() => readJSON(LS_PREFS, {}), []);
  const reco   = useMemo(() => readJSON(LS_RECO, {}), []);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const switchMode = () => { setErr(""); setMode((m) => (m === "login" ? "signup" : "login")); };


  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const email = form.email.trim();
    const name  = form.name.trim();
    const password = form.password;

    if (!isEmail(email)) return setErr("Please enter a valid email.");
    if (!password) return setErr("Please enter your password.");
    if (mode === "signup" && !name) return setErr("Please add your name.");

    setAuthLoading(true);
    try {
      
      await fetch(`https://jsonplaceholder.typicode.com/users?email=${encodeURIComponent(email)}`).then(r => r.json());

      const users = readUsers();
      const enteredHash = await sha256(password);

      if (mode === "signup") {
        if (users[email]) {
          return setErr("An account with this email already exists. Try logging in.");
        }
        const profile = {
          name,
          email,
          passwordHash: enteredHash,        
          avatarColor: "rose",
          createdAt: new Date().toISOString(),
        };
        users[email] = profile;
        writeUsers(users);

        
        setSessionEmail(email);
        setUser?.(profile);
        if (location.state?.from) nav(location.state.from);
        return;
      }

      // LOGIN: must already exist
      const existing = users[email];
      if (!existing) {
        return setErr("No account found for this email. Please sign up first.");
      }
      if (!existing.passwordHash) {
      
        return setErr("This account needs a password set. Please sign up again to set a password.");
      }
      if (existing.passwordHash !== enteredHash) {
        return setErr("Email found, but the password doesn’t match.");
      }

     
      if (remember) setSessionEmail(email);
      else setSessionEmail(email); 

      setUser?.(existing);
    } catch {
      setErr("Network hiccup — try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const onLogout = () => {
    setSessionEmail(""); 
    setUser?.(null);
    setForm((p) => ({ ...p, password: "" }));
    nav("/", { replace: true });
  };

 
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef(null);
  const theme = (user?.avatarColor || prefs?.color || "rose").toLowerCase();

  useEffect(() => {
    if (!pickerOpen) return;
    const onDocClick = (e) => {
      if (!pickerRef.current) return;
      if (!pickerRef.current.contains(e.target)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [pickerOpen]);

  const setAvatarColor = (key) => {
    const email = getSessionEmail();
    if (!email) return; 
    const users = readUsers();
    const existing = users[email];
    if (!existing) return;

    const next = { ...existing, avatarColor: key };
    users[email] = next;
    writeUsers(users);
    setUser?.(next);
    setPickerOpen(false);
  };

  
  const PageSkeleton = (
    <section className="account card" aria-busy="true">
      <header className="auth-head">
        <div className="skeleton-line w40" role="heading" aria-level="1"></div>
        <div className="skeleton-line w90"></div>
      </header>
      <div className="skeleton-grid">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
      <p className="tiny muted" style={{ marginTop: 8 }}>{pageHint || "Loading…"}</p>
    </section>
  );


  const LoggedOut = (
    <section className="account card auth" aria-busy={authLoading}>
      <header className="auth-head">
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="muted">Sign {mode === "login" ? "in" : "up"} to save templates, auto-fill details, and sync your pastel vibes.</p>
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

        {/* Remember me */}
        <label className="fg row" style={{ alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            aria-label="Keep me signed in on this device"
          />
          <span className="tiny muted">Keep me signed in on this device</span>
        </label>

        {err && <p className="err" role="alert">{err}</p>}

        <div className="row">
          <button className="btn btn-primary" type="submit" disabled={authLoading}>
            {authLoading ? "Please wait…" : (mode === "login" ? "Login" : "Sign up")}
          </button>
          <button className="btn" type="button" onClick={switchMode} disabled={authLoading}>
            {mode === "login" ? "New here? Create account" : "Have an account? Login"}
          </button>
        </div>
      </form>

      <div className="auth-links">
        <Link className="pill" to="/create">← Back to Create</Link>
        <Link className="pill" to="/templates">Browse Templates</Link>
        <Link className="pill" to="/interview">Interview Tips</Link>
      </div>
    </section>
  );

  const displayName = (user?.name || seedPrefs?.name || "there").trim();
  const recommendedId = useMemo(() => {
    const order = Array.isArray(reco?.ordered) ? reco.ordered : [];
    return order.length ? order[0] : null;
  }, [reco]);

  const LoggedIn = (
    <section className="account card profile" id="me">
      <header className={`profile-head ${helloPulse ? "pulse" : ""}`}>
        {/* AVATAR + PICKER */}
        <div className="avatar-wrap" ref={pickerRef}>
          <button
            className={`avatar is-clickable vibe-${theme}`}
            aria-label="Change avatar color"
            onClick={() => setPickerOpen((v) => !v)}
            type="button"
            title="Change color"
          />
          {pickerOpen && (
            <div className="avatar-picker">
              <div className="picker-head">Choose avatar color</div>
              <div className="swatches">
                {AVATAR_VIBES.map(v => (
                  <button
                    key={v.key}
                    type="button"
                    className={`swatch vibe-${v.key}${theme === v.key ? " active" : ""}`}
                    aria-label={v.label}
                    onClick={() => setAvatarColor(v.key)}
                    title={v.label}
                  />
                ))}
              </div>
              <div className="picker-actions">
                <button className="btn btn-sm" type="button" onClick={() => setPickerOpen(false)}>Close</button>
              </div>
            </div>
          )}
        </div>

        <div>
          <h1>Hi, {displayName}</h1>
          <p className="muted">Your dashboard keeps your details, recommendations, and drafts together.</p>
          <div className="chip-row">
            {seedPrefs?.job && <span className="chip">{seedPrefs.job}</span>}
            {seedPrefs?.role && <span className="chip">{seedPrefs.role}</span>}
            {seedPrefs?.color && <span className="chip">vibe: {seedPrefs.color}</span>}
            {seedPrefs?.tone && <span className="chip">tone: {seedPrefs.tone}</span>}
          </div>
        </div>

        <div className="head-actions">
          <button className="btn" onClick={() => nav("/create")}>Edit details</button>
          <button className="btn btn-primary" onClick={() => nav("/templates")}>Pick a template</button>
          <button className="btn danger" onClick={onLogout}>Log out</button>
        </div>
      </header>

      {/* Recommended */}
      <section className="recos">
        <h2>Recommended</h2>
        {recommendedId ? (
          <article className="reco-card">
            <div className="thumb">
              <img src={asset(TPL_META[recommendedId]?.thumb || "/assets/home/templates/pastel.png")} alt="Recommended template preview" />
              <span className="badge">Recommended</span>
            </div>
            <div className="reco-meta">
              <h3>{TPL_META[recommendedId]?.name || "Pastel Classic"}</h3>
              <p className="muted">Based on your field, tone and vibe.</p>
              <div className="row">
                <button className="btn btn-primary" onClick={() => nav(`/templates/${recommendedId}`)}>Use this</button>
                <button className="btn" onClick={() => nav("/templates")}>See all</button>
              </div>
            </div>
          </article>
        ) : (
          <p className="muted">We’ll show a pick here after you finish CreateCV.</p>
        )}
      </section>

      {/* Saved */}
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
                  <button className="btn btn-sm" onClick={() => nav(`/templates/${t.id}`)}>Open</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Drafts */}
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
                    <p className="tiny muted">{person ? `for ${person}` : (seedPrefs?.name || "—")}</p>
                    <div className="row">
                      <button className="btn btn-sm" onClick={() => nav(`/templates/${d.id}`)}>Continue</button>
                      <button
                        className="btn btn-sm danger"
                        onClick={() => { localStorage.removeItem(d.key); window.location.reload(); }}
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

  if (pageLoading) return PageSkeleton;
  return user?.email ? LoggedIn : LoggedOut;
}
