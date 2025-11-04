import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/createCV.css";
import { useApp } from "../context/AppContext"; // optional, if present

const LS_FORM = "dreamy.createCV.intro.v1";
const LS_PREFS = "dreamy.cvPrefs.v1";
const LS_RECO  = "dreamy.cvReco.v1";

/* ---------- Intro-only fields ---------- */
const defaultData = {
  name: "",
  email: "",
  role: "",
  experience: "",
  job: "Design",      // “what is your job”
  color: "mint",      // “vibe / color”
  font: "Inter",
};

const stepsDef = [
  { id: "name",       title: "Your name",              required: true,  type: "text",     placeholder: "e.g. Anna Ying Yang" },
  { id: "email",      title: "Contact email",          required: true,  type: "email",    placeholder: "e.g. anna@email.com" },
  { id: "role",       title: "Target role / title",    required: true,  type: "text",     placeholder: "e.g. Junior Designer" },
  { id: "experience", title: "Years of experience",    required: true,  type: "number",   placeholder: "e.g. 2" },
  { id: "job",        title: "Your field",             required: true,  type: "select",   options: ["Design","Marketing","HR","Software","Admin","Sales","Finance","Education"] },
  { id: "style",      title: "Pick your vibe",         required: true,  type: "style"     }, // color + font
  { id: "review",     title: "Review & continue",      required: false, type: "review"    },
];

/* ---------- localStorage hook ---------- */
function useLocalState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? { ...initial, ...JSON.parse(raw) } : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

/* ---------- simple recommender by vibe + field ---------- */
function recommendTemplates(prefs) {
  // base list
  const all = ["pastel", "mint", "dark"];
  // vibe-weighted order
  let vibeFirst = all;
  if (prefs.color === "mint") vibeFirst = ["mint", "pastel", "dark"];
  if (prefs.color === "pink") vibeFirst = ["pastel", "mint", "dark"];
  if (prefs.color === "lavender") vibeFirst = ["pastel", "dark", "mint"];
  if (prefs.color === "peach") vibeFirst = ["pastel", "mint", "dark"];

  // field nuance (just a tiny nudge)
  let fieldBoost = [];
  switch ((prefs.job || "").toLowerCase()) {
    case "design":   fieldBoost = ["pastel","mint"]; break;
    case "marketing":fieldBoost = ["pastel","dark"]; break;
    case "hr":       fieldBoost = ["mint","pastel"]; break;
    case "software": fieldBoost = ["dark","mint"];   break;
    case "finance":  fieldBoost = ["dark","mint"];   break;
    default:         fieldBoost = [];
  }

  // merge with uniqueness
  const ordered = Array.from(new Set([...fieldBoost, ...vibeFirst, ...all]));
  return { ordered, all };
}

/* =======================================
   CreateCV — INTRO WIZARD (no template picking here)
   ======================================= */
export default function CreateCV() {
  const navigate = useNavigate();

  // ✅ if you have AppContext, this works
  // make sure AppContext provides a default value with setCvPrefs: () => {}
  const { setCvPrefs } = useApp();

  // rest of your states
  const [data, setData] = useLocalState(LS_FORM, defaultData);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState("forward");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const current = stepsDef[index];


  // tiny loader on mount
  useEffect(() => {
    const t = setTimeout(() => setBusy(false), 280);
    return () => clearTimeout(t);
  }, []);

  // focus title on step change (a11y)
  const focusRef = useRef(null);
  useEffect(() => { focusRef.current?.focus(); }, [index]);

  const onInput = (id, value) => setData((p) => ({ ...p, [id]: value }));

  // validation per step
  const validate = useMemo(() => {
    return (s = current, d = data) => {
      setError("");
      if (!s.required) return true;
      if (s.id === "email") {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((d.email || "").trim());
        if (!ok) { setError("Please enter a valid email address."); return false; }
        return true;
      }
      if (s.id === "experience") {
        const n = Number(d.experience);
        if (!Number.isFinite(n) || n < 0) { setError("Enter a non-negative number."); return false; }
        return true;
      }
      const val = s.id === "style" ? d.color && d.font : d[s.id];
      if (!val || (typeof val === "string" && !val.trim())) {
        setError("This field is required.");
        return false;
      }
      return true;
    };
  }, [current, data]);

  const go = (nextIndex) => { setDir(nextIndex > index ? "forward" : "back"); setIndex(nextIndex); };
  const onNext = () => { if (!validate()) return; if (index < stepsDef.length - 1) go(index + 1); };
  const onPrev = () => { if (index > 0) go(index - 1); };

  const onFinish = () => {
    // last real validation is style
    if (!validate(stepsDef[stepsDef.length - 2], data)) return;

    // Build compact prefs to share with Templates page
    const prefs = {
      name: data.name.trim(),
      email: data.email.trim(),
      role: data.role.trim(),
      experience: String(data.experience).trim(),
      job: data.job,
      color: data.color,
      font: data.font,
    };

    // Compute template recommendations (order)
    const reco = recommendTemplates(prefs);

    // Persist
    try { localStorage.setItem(LS_PREFS, JSON.stringify(prefs)); } catch {}
    try { localStorage.setItem(LS_RECO, JSON.stringify(reco)); } catch {}
    setCvPrefs?.(prefs); // optional: put into global Context if available

    // Go to Templates — it will read LS_PREFS + LS_RECO to prefill & tag “Recommended”
    navigate("/templates", { state: { fromCreate: true } });
  };

  return (
    <section className="createcv" aria-labelledby="cv-title">
      <h1 id="cv-title" className="page-title">Create your dreamy CV</h1>

      {/* progress dots */}
      <div className="progress" aria-label="Progress">
        {stepsDef.map((s, i) => (
          <button
            key={s.id}
            className={`dot ${i === index ? "is-active" : i < index ? "is-done" : ""}`}
            aria-label={`Step ${i + 1}: ${s.title}`}
            onClick={() => go(i)}
          />
        ))}
      </div>

      {/* step card */}
      {busy ? (
        <div className="card step-card loading">
          <div className="shimmer" />
        </div>
      ) : (
        <div className={`card step-card slide-${dir}`} key={current.id} aria-live="polite">
          <h2 ref={focusRef} className="step-title" tabIndex={-1}>
            {index + 1}. {current.title}
          </h2>

          <StepContent step={current} data={data} onInput={onInput} />

          {/* validation message */}
          <p className="error" role="alert" aria-live="assertive">{error}</p>

          <div className="nav-row">
            <button className="btn" onClick={onPrev} disabled={index === 0}>← Back</button>
            {index < stepsDef.length - 1 ? (
              <button className="btn btn-primary" onClick={onNext}>Next →</button>
            ) : (
              <button className="btn btn-primary" onClick={onFinish}>Continue to templates</button>
            )}
          </div>
        </div>
      )}

      {/* Live mini preview */}
      <aside className="mini-preview card" aria-label="Live preview">
        <h3>Live preview</h3>
        <div className={`preview-doc theme-${data.color} font-${(data.font || "Inter").toLowerCase()}`}>
          <header>
            <strong>{data.name || "Your Name"}</strong>
            <span>{data.role || "Target role"}</span>
          </header>
          <p className="muted">{data.email || "email@example.com"}</p>
          <p className="muted">Experience: {data.experience || "0"} yrs — {data.job || "Field"}</p>
          <ul className="pill-list">
            <li>Vibe: {data.color}</li>
            <li>Font: {data.font}</li>
          </ul>
        </div>
      </aside>
    </section>
  );
}

/* ---------- Step renderer ---------- */
function StepContent({ step, data, onInput }) {
  if (step.type === "text" || step.type === "email" || step.type === "number") {
    return (
      <label className="field">
        <span className="label">{step.title}</span>
        <input
          type={step.type}
          required={step.required}
          placeholder={step.placeholder}
          value={data[step.id]}
          onChange={(e) => onInput(step.id, e.target.value)}
        />
      </label>
    );
  }

  if (step.type === "select") {
    return (
      <label className="field">
        <span className="label">{step.title}</span>
        <select
          value={data.job}
          onChange={(e) => onInput("job", e.target.value)}
        >
          {step.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </label>
    );
  }

  if (step.type === "style") {
    const colors = ["mint", "pink", "lavender", "peach"];
    const fonts  = ["Inter", "Poppins", "OpenSans", "Merriweather"];
    return (
      <div className="style-grid">
        <fieldset className="seg">
          <legend className="label">Accent color</legend>
          <div className="swatch-row">
            {colors.map(c => (
              <label key={c} className={`swatch sw-${c} ${data.color === c ? "is-selected" : ""}`}>
                <input
                  type="radio"
                  name="color"
                  value={c}
                  checked={data.color === c}
                  onChange={() => onInput("color", c)}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <label className="field">
          <span className="label">Font family</span>
          <select
            value={data.font}
            onChange={(e) => onInput("font", e.target.value)}
          >
            {fonts.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
      </div>
    );
  }

  if (step.type === "review") {
    return (
      <div className="review">
        <p>
          We’ll carry your answers to the Templates page and mark the <strong>Recommended</strong> options based on your vibe and field.
          You can still choose any design you like.
        </p>
        <ul className="review-list">
          <li><span>Name</span><b>{data.name || "—"}</b></li>
          <li><span>Email</span><b>{data.email || "—"}</b></li>
          <li><span>Role</span><b>{data.role || "—"}</b></li>
          <li><span>Experience</span><b>{data.experience || "—"} yrs</b></li>
          <li><span>Field</span><b>{data.job || "—"}</b></li>
          <li><span>Vibe</span><b>{data.color || "—"}</b></li>
          <li><span>Font</span><b>{data.font || "—"}</b></li>
        </ul>
      </div>
    );
  }

  return null;
}
