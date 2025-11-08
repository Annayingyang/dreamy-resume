
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/createCV.css";
import { useApp } from "../context/AppContext"; 

const LS_FORM = "dreamy.createCV.intro.v1";
const LS_PREFS = "dreamy.cvPrefs.v1";
const LS_RECO  = "dreamy.cvReco.v1";


const defaultData = {
  name: "",
  email: "",
  role: "",
  experience: "",
  job: "Design",      
  color: "mint",      
  tone: "professional"
};

const stepsDef = [
  { id: "name",       title: "Your name",              required: true,  type: "text",     placeholder: "e.g. Anna Ying Yang" },
  { id: "email",      title: "Contact email",          required: true,  type: "email",    placeholder: "e.g. anna@email.com" },
  { id: "role",       title: "Target role / title",    required: true,  type: "text",     placeholder: "e.g. Junior Designer" },
  { id: "experience", title: "Years of experience",    required: true,  type: "number",   placeholder: "e.g. 2" },
  { id: "job",        title: "Your field",             required: true,  type: "select",   options: ["Design","Marketing","HR","Software","Admin","Sales","Finance","Education"] },
  { id: "style",      title: "Pick your vibe & tone",  required: true,  type: "style"     }, 
  { id: "review",     title: "Review & continue",      required: false, type: "review"    },
];


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


function recommendTemplates(prefs) {
  
  const all = [
    "pastel", "mint", "dark", "serif-cream", "modern-sky",
    "charcoal-pro", "lavender-glow", "coral-warm", "slate-columns",
    "photo-left", "notion-blocks"
  ];

  
  const colorOrder = {
    mint:          ["mint","modern-sky","serif-cream","pastel","slate-columns","charcoal-pro","dark","lavender-glow","coral-warm","notion-blocks","photo-left"],
    pink:          ["pastel","lavender-glow","coral-warm","serif-cream","modern-sky","mint","notion-blocks","slate-columns","photo-left","charcoal-pro","dark"],
    lavender:      ["lavender-glow","pastel","serif-cream","modern-sky","mint","notion-blocks","slate-columns","photo-left","coral-warm","charcoal-pro","dark"],
    peach:         ["coral-warm","pastel","serif-cream","mint","modern-sky","notion-blocks","slate-columns","photo-left","lavender-glow","charcoal-pro","dark"],
   coral:         ["coral-warm","pastel","serif-cream","mint","modern-sky","notion-blocks","slate-columns","photo-left","lavender-glow","charcoal-pro","dark"],
    sky:           ["modern-sky","mint","serif-cream","slate-columns","pastel","photo-left","notion-blocks","lavender-glow","coral-warm","charcoal-pro","dark"],
    charcoal:      ["charcoal-pro","dark","slate-columns","modern-sky","notion-blocks","serif-cream","mint","pastel","photo-left","coral-warm","lavender-glow"],
    cream:         ["serif-cream","slate-columns","notion-blocks","modern-sky","mint","pastel","photo-left","charcoal-pro","dark","lavender-glow","coral-warm"],
    slate:         ["slate-columns","serif-cream","charcoal-pro","notion-blocks","modern-sky","mint","dark","photo-left","pastel","lavender-glow","coral-warm"]
  };

 
  const toneOrder = {
    professional: ["slate-columns","serif-cream","charcoal-pro","dark","modern-sky","mint","notion-blocks","photo-left","pastel","coral-warm","lavender-glow"],
    creative:     ["pastel","lavender-glow","notion-blocks","photo-left","modern-sky","mint","coral-warm","serif-cream","slate-columns","charcoal-pro","dark"],
    bold:         ["charcoal-pro","dark","modern-sky","slate-columns","mint","photo-left","notion-blocks","pastel","serif-cream","coral-warm","lavender-glow"],
    minimal:      ["serif-cream","slate-columns","mint","modern-sky","notion-blocks","dark","charcoal-pro","photo-left","pastel","lavender-glow","coral-warm"]
  };


  let fieldBoost = [];
  switch ((prefs.job || "").toLowerCase()) {
    case "design":    fieldBoost = ["pastel","modern-sky","notion-blocks","photo-left","lavender-glow"]; break;
    case "marketing": fieldBoost = ["pastel","coral-warm","modern-sky","notion-blocks"]; break;
    case "software":  fieldBoost = ["slate-columns","charcoal-pro","dark","modern-sky"]; break;
    case "finance":   fieldBoost = ["slate-columns","serif-cream","charcoal-pro","dark"]; break;
    case "hr":        fieldBoost = ["serif-cream","mint","slate-columns"]; break;
    case "education": fieldBoost = ["serif-cream","mint","modern-sky"]; break;
    default:          fieldBoost = [];
  }

  const byColor = colorOrder[prefs.color] || all;
  const byTone  = toneOrder[prefs.tone]   || all;

  
  const ordered = Array.from(new Set([...fieldBoost, ...byTone, ...byColor, ...all]));
  return { ordered, all };
}


export default function CreateCV() {
  const navigate = useNavigate();
  const { setCvPrefs } = useApp(); 

 
  const [data, setData] = useLocalState(LS_FORM, defaultData);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState("forward");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const current = stepsDef[index];

  
useEffect(() => {
  const t = setTimeout(() => {
    const prefs = {
      name: (data.name || "").trim(),
      email: (data.email || "").trim(),
      role: (data.role || "").trim(),
      experience: String(data.experience ?? "").trim(),
      job: data.job,
      color: data.color,
      tone: data.tone,
    };
    try { localStorage.setItem(LS_PREFS, JSON.stringify(prefs)); } catch {}
    setCvPrefs?.(prefs);
  }, 200); 
  return () => clearTimeout(t);
}, [data.name, data.email, data.role, data.experience, data.job, data.color, data.tone, setCvPrefs]);


  // tiny loader
  useEffect(() => {
    const t = setTimeout(() => setBusy(false), 280);
    return () => clearTimeout(t);
  }, []);

  // a11y focus 
  const focusRef = useRef(null);
  useEffect(() => { focusRef.current?.focus(); }, [index]);

  const onInput = (id, value) => setData((p) => ({ ...p, [id]: value }));

  // validatio
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
      if (s.id === "style") {
        if (!d.color || !d.tone) { setError("Please pick a color and a tone."); return false; }
        return true;
      }
      const val = d[s.id];
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
    if (!validate(stepsDef[stepsDef.length - 2], data)) return;

    const prefs = {
      name: data.name.trim(),
      email: data.email.trim(),
      role: data.role.trim(),
      experience: String(data.experience).trim(),
      job: data.job,
      color: data.color,
      tone: data.tone, 
      
    };

    const reco = recommendTemplates(prefs);

    try { localStorage.setItem(LS_PREFS, JSON.stringify(prefs)); } catch {}
    try { localStorage.setItem(LS_RECO, JSON.stringify(reco)); } catch {}
    setCvPrefs?.(prefs);

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
        <div className={`preview-doc theme-${data.color}`}>
          <header>
            <strong>{data.name || "Your Name"}</strong>
            <span>{data.role || "Target role"}</span>
          </header>
          <p className="muted">{data.email || "email@example.com"}</p>
          <p className="muted">Experience: {data.experience || "0"} yrs — {data.job || "Field"}</p>
          <ul className="pill-list">
            <li>Vibe: {data.color}</li>
            <li>Tone: {data.tone}</li>
          </ul>
        </div>
      </aside>
    </section>
  );
}


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
    const colors = ["mint","pink","lavender","peach","sky","charcoal","cream","slate","coral"];
    const tones  = [
      { id: "professional", label: "Professional" },
      { id: "creative",     label: "Creative" },
      { id: "bold",         label: "Bold" },
      { id: "minimal",      label: "Minimal" },
    ];
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

        <fieldset className="seg">
          <legend className="label">Tone</legend>
          <div className="tone-row">
            {tones.map(t => (
              <label key={t.id} className={`tone ${data.tone === t.id ? "is-selected" : ""}`}>
                <input
                  type="radio"
                  name="tone"
                  value={t.id}
                  checked={data.tone === t.id}
                  onChange={() => onInput("tone", t.id)}
                />
                <span>{t.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    );
  }

  if (step.type === "review") {
    return (
      <div className="review">
        <p>
          We’ll carry your answers to the Templates page and mark the <strong>Recommended</strong> options
          based on your vibe, tone and field. You can still choose any design you like.
        </p>
        <ul className="review-list">
          <li><span>Name：</span><b>{data.name || "—"}</b></li>
          <li><span>Email：</span><b>{data.email || "—"}</b></li>
          <li><span>Role：</span><b>{data.role || "—"}</b></li>
          <li><span>Experience：</span><b>{data.experience || "—"} yrs</b></li>
          <li><span>Field：</span><b>{data.job || "—"}</b></li>
          <li><span>Vibe：</span><b>{data.color || "—"}</b></li>
          <li><span>Tone：</span><b>{data.tone || "—"}</b></li>
        </ul>
      </div>
    );
  }

  return null;
}
