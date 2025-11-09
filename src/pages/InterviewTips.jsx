import React, { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import "../style/InterviewTips.css";


const MOCK_TIPS = {
  stressed: [
    { title: "Reset Phrase", points: ["Say silently: “Pause. Breathe. I’ve prepared.”"] },
    { title: "Micro-grounding", points: ["Name 3 things you see", "2 you can touch", "1 sound you hear"] },
    { title: "Checklist", points: ["Water next to you", "Phone on silent", "Tabs trimmed", "CV & portfolio open"] },
  ],
  say: [
    { title: "Use STAR", points: ["Situation", "Task", "Action", "Result (+ metric)"] },
    { title: "If you don’t know", points: ["Be honest", "Explain how you’d find out", "Bridge to similar work"] },
    { title: "Close well", points: ["Summarise fit", "Re-state excitement", "Ask next-step timeline"] },
  ],
  wear: {
    design:  ["Smart-casual, neat sneakers ok", "1 subtle accent colour", "Minimal logos"],
    marketing:["Business-smart + 1 statement piece", "Tidy hair", "Neutral makeup if used"],
    hr:      ["Business-smart (classic)", "Minimal accessories", "Polished shoes"],
    software:["Smart-casual (clean)", "Avoid loud prints", "Neat hoodie ok if team is casual"],
    admin:   ["Business-smart", "Closed shoes", "Simple accessories"],
    sales:   ["Business formal", "Crisp shirt/blouse", "Polished shoes"],
    finance: ["Business formal", "Neutral palette", "Minimal accessories"],
    education:["Smart-casual", "Comfortable clean shoes", "Subtle colours"],
    default: ["Business-smart", "Clean shoes", "Wrinkle free layers", "Simple accessories"],
  },
  students: [
    { title: "Experience without jobs", points: ["Class projects → Outcomes", "Societies → Leadership", "Volunteering → Impact"] },
    { title: "Numbers still matter", points: ["Users tested", "Time saved", "Marks %, awards, hackathons"] },
    { title: "Show learning loop", points: ["What I tried", "What I learned", "What I’d do next"] },
  ],
};

const COMMON_QUESTIONS = [
  "Tell me about yourself",
  "What are your strengths?",
  "Describe a challenge and how you overcame it",
  "Why this company?",
  "Where do you see yourself in 2–3 years?",
  "Tell me about a time you worked in a team",
];

const INDUSTRY_QUESTIONS = {
  Design: [
    "Tell me about a time your design decision impacted a KPI",
    "How do you balance user needs vs business goals?",
    "Describe your handoff process to developers",
  ],
  Marketing: [
    "Walk me through a campaign you led and the results",
    "How do you decide channels and measure ROI?",
    "Describe a time an A/B test changed your approach",
  ],
  HR: [
    "How have you shortened time-to-hire?",
    "Describe a structured interview you implemented",
    "Tell me about a tricky stakeholder in hiring",
  ],
  Software: [
    "Describe a performance issue you solved",
    "Tell me about a system you designed and why",
    "How do you ensure code quality at scale?",
  ],
  Admin: [
    "How have you improved an operational process?",
    "Tell me about managing conflicting priorities",
    "What tools do you use to keep teams organised?",
  ],
  Sales: [
    "Walk me through your sales cycle",
    "Tell me about a time you salvaged a deal",
    "How do you handle objections effectively?",
  ],
  Finance: [
    "Describe a forecasting model you improved",
    "Tell me about a cost-saving you identified",
    "How do you ensure accuracy under deadlines?",
  ],
  Education: [
    "Tell me about improving learner outcomes",
    "How do you adapt content for different levels?",
    "Describe a time you handled a challenging parent",
  ],
};


function extractKeywords(text) {
  return Array.from(
    new Set(
      (text || "")
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3 && !["with","that","from","this","have","about","your","into","over","under","been","were","they","them","then","than","also","very","just","like"].includes(w))
    )
  ).slice(0, 12);
}

function buildStarSuggestions({ role, industry, summary, skills }) {
  const kws = extractKeywords(`${summary}\n${skills}`);
  const metric = (hint) =>
    [
      `↑ ${Math.floor(10 + Math.random() * 80)}% ${hint}`,
      `↓ ${Math.floor(5 + Math.random() * 30)}% time`,
      `+${Math.floor(2 + Math.random() * 15)}k users`,
      `Saved ${Math.floor(10 + Math.random() * 120)} hours`,
    ][Math.floor(Math.random() * 4)];

  const base = {
    Design:  {
      situation: "Design handoff lacked clarity, causing iteration loops",
      task:      "Create a reusable system to speed team delivery",
      action:    `Mapped flows, built tokens & components; ran reviews; aligned with dev in Figma/Storybook`,
      result:    metric("handoff clarity"),
    },
    Marketing:{
      situation: "Low engagement on a campaign landing",
      task:      "Revise messaging and funnel",
      action:    "A/B tested headlines, heat-mapped scroll, simplified CTA & form",
      result:    metric("CTR"),
    },
    HR:      {
      situation: "Long time-to-hire for interns",
      task:      "Streamline interview loop",
      action:    "Built scorecards, training pack, and scheduling guide",
      result:    metric("time-to-hire"),
    },
    Software:{
      situation: "Slow page loads due to heavy rendering",
      task:      "Improve performance budget",
      action:    "Profiled bundle, code-split, memoized hot paths, added CI checks",
      result:    metric("LCP"),
    },
    Default:{
      situation: "Team struggled to prioritise workload",
      task:      "Create simple planning rhythm",
      action:    "Introduced weekly stand ups, Kanban WIP limits, clear owners",
      result:    metric("throughput"),
    },
  };

  const kit = base[industry] || base.Default;
  return {
    ...kit,
    keywords: kws,
    role: role || "Candidate",
    industry,
  };
}


function validate(form) {
  const errors = {};
  if (!form.industry) errors.industry = "Please choose an industry.";
  if (!form.role?.trim()) errors.role = "Your target role is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email || "")) errors.email = "Enter a valid email.";
  return errors;
}


const LS_KEY = "interview_tips_form_v3";
const LS_ANSWER = "interview_tips_live_answer_v3";


function smartCap(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function tightenFiller(text) {
  const fillers = [
    /\bkind of\b/gi, /\bsort of\b/gi, /\bbasically\b/gi, /\breally\b/gi, /\bvery\b/gi,
    /\bjust\b/gi, /\bliterally\b/gi, /\bactually\b/gi, /\bi think\b/gi, /\bin order to\b/gi
  ];
  let s = text;
  fillers.forEach((re) => (s = s.replace(re, (m) => (m.toLowerCase() === "in order to" ? "to" : ""))));
  return s.replace(/\s{2,}/g, " ").trim();
}
function upgradeVerbs(text) {
  const swaps = [
    [/\bmake\b/gi, "craft"], [/\bmade\b/gi, "crafted"],
    [/\bdo\b/gi, "execute"], [/\bdid\b/gi, "executed"],
    [/\buse\b/gi, "leverage"], [/\bused\b/gi, "leveraged"],
    [/\bhelp\b/gi, "support"], [/\bhelped\b/gi, "supported"],
    [/\bfix\b/gi, "resolve"], [/\bfixed\b/gi, "resolved"],
    [/\bimprove\b/gi, "enhance"], [/\bimproved\b/gi, "enhanced"],
    [/\bincrease\b/gi, "elevate"], [/\bincreased\b/gi, "elevated"],
    [/\breduce\b/gi, "decrease"], [/\breduced\b/gi, "decreased"],
    [/\bshow\b/gi, "demonstrate"], [/\bshowed\b/gi, "demonstrated"],
    [/\bget\b/gi, "secure"], [/\bgot\b/gi, "secured"],
    [/\bwork(ed)? on\b/gi, "contribute$1 to"],
  ];
  let s = text;
  swaps.forEach(([a, b]) => (s = s.replace(a, b)));
  return s;
}
function clarifyWeI(text) {
  return text
    .replace(/\bwe (designed|built|created|made|did|fixed|improved|reduced|increased)\b/gi, (m, v) => `I ${v}`)
    .replace(/\bwe\b/gi, "we");
}
function punctuationNeaten(s) {
  let t = s.replace(/\s+([,.;:%!?])/g, "$1").replace(/\s{2,}/g, " ").trim();
  if (!/[.!?]$/.test(t)) t += ".";
  return smartCap(t);
}
function polishInline(original) {
  if (!original?.trim()) return original;
  const parts = original
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);

  const polished = parts.map((sent) => {
    let s = tightenFiller(sent);
    s = upgradeVerbs(s);
    s = clarifyWeI(s);
    s = punctuationNeaten(s);
    return s;
  });

  const out = polished.join(" ");
  const maxLen = Math.round(original.length * 1.15);
  return out.length > maxLen ? out.slice(0, maxLen).trimEnd() + "…" : out;
}

export default function InterviewTips() {
  const { user, cvPrefs } = useApp();

 
  const [form, setForm] = useState({
    name: cvPrefs?.name || user?.name || "",
    email: cvPrefs?.email || "",
    role: cvPrefs?.role || "",
    industry: cvPrefs?.job || "",
    seniority: (Number(cvPrefs?.experience) || 0) <= 1 ? "Student/Graduate" : "Experienced",
    resumeSummary: "",
    skills: "",
  });

  const [activeTab, setActiveTab] = useState("coach"); 
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [coach, setCoach] = useState(null);
  const answerInputRef = useRef(null);
  const [liveQuestion, setLiveQuestion] = useState(COMMON_QUESTIONS[0]);
  const [liveTyped, setLiveTyped] = useState("");
  const [showIntro, setShowIntro] = useState(true);

  
  const [breathing, setBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Ready"); 
  const [breathCount, setBreathCount] = useState(4);
  const countdownRef = useRef(null);
  const phaseTimeoutRef = useRef(null);

  const clearBreathTimers = () => {
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
    if (phaseTimeoutRef.current) { clearTimeout(phaseTimeoutRef.current); phaseTimeoutRef.current = null; }
  };

  const startPhase = (phaseName, nextPhaseName) => {
    setBreathPhase(phaseName);
    setBreathCount(4);

    clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setBreathCount((c) => (c > 1 ? c - 1 : c));
    }, 1000);

    clearTimeout(phaseTimeoutRef.current);
    phaseTimeoutRef.current = setTimeout(() => {
      if (!breathing) return;
      runCycle(nextPhaseName);
    }, 4000);
  };

  const runCycle = (phase) => {
    switch (phase) {
      case "Inhale":   return startPhase("Inhale", "Hold1");
      case "Hold1":    return startPhase("Hold",   "Exhale");
      case "Exhale":   return startPhase("Exhale", "Hold2");
      case "Hold2":    return startPhase("Hold",   "Inhale");
      default:         return startPhase("Inhale", "Hold1");
    }
  };

  useEffect(() => {
    if (breathing) {
      runCycle("Inhale");
    } else {
      clearBreathTimers();
      setBreathPhase("Ready");
      setBreathCount(4);
    }
    return clearBreathTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breathing]);

  
  
useEffect(() => {
  const ac = new AbortController();
  async function run() {
    try {
      setLoading(true);
      
      const r = await fetch("/interview-tips.json", { signal: ac.signal });
      
      await r.json();
      
      setShowIntro(true);
      setTimeout(() => setShowIntro(false), 900);
    } catch (err) {
      if (err.name !== "AbortError") {
        
        console.warn("Tips prefetch failed:", err);
      }
    } finally {
      setLoading(false); 
    }
  }
  run();
  return () => ac.abort();
}, []);


  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      if (saved) setForm((p) => ({ ...p, ...saved }));
      const ans = localStorage.getItem(LS_ANSWER);
      if (ans) setLiveTyped(ans);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(form)); } catch {}
  }, [form]);
  useEffect(() => {
    try { localStorage.setItem(LS_ANSWER, liveTyped || ""); } catch {}
  }, [liveTyped]);

 
  useEffect(() => {
    if (activeTab !== "coach") return;
    setLoadingCoach(true);
    const t = setTimeout(() => {
      const kit = buildStarSuggestions({
        role: form.role,
        industry: form.industry,
        summary: form.resumeSummary,
        skills: form.skills,
      });
      setCoach(kit);
      setLoadingCoach(false);
    }, 380);
    return () => clearTimeout(t);
  }, [form.role, form.industry, form.resumeSummary, form.skills, activeTab]);

  /** Form handlers */
  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const onSubmit = (e) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;
    setActiveTab("coach");
    setTimeout(() => answerInputRef.current?.focus(), 50);
  };

  
  const wearCatalog = useMemo(() => {
    const base = MOCK_TIPS.wear;
    return [
      { key: "design", label: "Design", tips: base.design },
      { key: "marketing", label: "Marketing", tips: base.marketing },
      { key: "hr", label: "HR", tips: base.hr },
      { key: "software", label: "Software", tips: base.software },
      { key: "admin", label: "Admin", tips: base.admin || base.default },
      { key: "sales", label: "Sales", tips: base.sales || base.default },
      { key: "finance", label: "Finance", tips: base.finance || base.default },
      { key: "education", label: "Education", tips: base.education || base.default },
    ];
  }, []);
  const recommendedKey = (form.industry || "").toLowerCase();

 
  const liveHint = useMemo(() => {
    if (!liveTyped.trim()) return "Tip: Start with the S in STAR (Situation) in one crisp line.";
    if (liveTyped.length < 60) return "Add your ACTION—what exactly did you do?";
    if (!/\d/.test(liveTyped)) return "Try quantifying the RESULT with a number or %.";
    if (!/(?:\bI\b|\bwe\b)/i.test(liveTyped)) return "Use active voice: 'I designed...' or 'We shipped...'";
    return "Looks strong—close with impact and tie it to this role.";
  }, [liveTyped]);

 
  const prevAnswerRef = useRef("");
  const polishAnswer = () => {
    const base = (liveTyped || "").trim();
    if (!base) return;
    prevAnswerRef.current = base;
    const improved = polishInline(base);
    setLiveTyped(improved);
  };
  const undoPolish = () => {
    if (prevAnswerRef.current) {
      setLiveTyped(prevAnswerRef.current);
      prevAnswerRef.current = "";
    }
  };

 
  const industryKey = (form.industry || "").trim();
  const questionBank =
    industryKey && INDUSTRY_QUESTIONS[industryKey]
      ? [...INDUSTRY_QUESTIONS[industryKey], ...COMMON_QUESTIONS]
      : COMMON_QUESTIONS;

  return (
    <section className="tips card">
      <header className="tips-header">
        <div className="title">
          <h1>Interview Coach</h1>
          <p className="muted">
            {showIntro
              ? "Let’s make your interview your next win 💪"
              : <>Hi {form.name || user?.name || "there"} — breathe. We’ll prep answers, calm nerves, and dress the part.</>}
          </p>
          {(form.name || user?.name) ? (
            <div className="context-chip" aria-live="polite">
              <span className="dot" /> {form.name || user?.name}
            </div>
          ) : null}
          {industryKey ? (
            <div className="context-chip" aria-live="polite">
              <span className="dot" /> {industryKey}
            </div>
          ) : null}
        </div>

        <nav className="tabs" role="tablist" aria-label="Interview sections">
          {[
            ["coach","Coach"],
            ["stressed","I’m Stressed"],
            ["say","What to Say"],
            ["wear","What to Wear"],
            ["students","New Students"],
          ].map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              className={`tab ${activeTab === id ? "is-active" : ""}`}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* LOADING  */}
      {loading ? (
        <div className="skeleton">
          <div className="line w60"></div>
          <div className="line w90"></div>
          <div className="line w75"></div>
          <div className="grid">
            <div className="block" />
            <div className="block" />
            <div className="block" />
          </div>
        </div>
      ) : (
        <>
          {/*  COACH TAB  */}
          {activeTab === "coach" && (
            <div className="panel">
              <form className="coach-form" onSubmit={onSubmit} noValidate>
                <div className="grid-2">
                  <label className="fg">
                    <span>Name</span>
                    <input
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Your name"
                    />
                  </label>

                  <label className="fg">
                    <span>Target role *</span>
                    <input
                      value={form.role}
                      onChange={(e) => update("role", e.target.value)}
                      placeholder="e.g. Junior Designer"
                      aria-invalid={!!errors.role}
                    />
                    {errors.role && <em className="err">{errors.role}</em>}
                  </label>

                  <label className="fg">
                    <span>Industry *</span>
                    <select
                      value={form.industry}
                      onChange={(e) => update("industry", e.target.value)}
                      aria-invalid={!!errors.industry}
                    >
                      <option value="">Choose…</option>
                      {["Design","Marketing","HR","Software","Admin","Sales","Finance","Education"].map((i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                    {errors.industry && <em className="err">{errors.industry}</em>}
                  </label>

                  <label className="fg">
                    <span>Email *</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && <em className="err">{errors.email}</em>}
                  </label>

                  <label className="fg">
                    <span>Seniority</span>
                    <select
                      value={form.seniority}
                      onChange={(e) => update("seniority", e.target.value)}
                    >
                      <option>Student/Graduate</option>
                      <option>Experienced</option>
                    </select>
                  </label>

                  <label className="fg full">
                    <span>Resume summary (paste 2–5 lines)</span>
                    <textarea
                      rows={3}
                      value={form.resumeSummary}
                      onChange={(e) => update("resumeSummary", e.target.value)}
                      placeholder="I’m a BA Digital Arts honours student with projects in UI, admin and marketing..."
                    />
                  </label>

                  <label className="fg full">
                    <span>Key skills (comma or newline)</span>
                    <textarea
                      rows={2}
                      value={form.skills}
                      onChange={(e) => update("skills", e.target.value)}
                      placeholder="Figma, user research, CSS, copywriting, Excel, Canva"
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary" type="submit">Generate tips</button>
                </div>
              </form>

              {/* live suggestions */}
              <div className="coach-suggestions">
                {loadingCoach ? (
                  <div className="mini-skeleton">
                    <div className="line w40"></div>
                    <div className="line w80"></div>
                    <div className="line w65"></div>
                  </div>
                ) : coach ? (
                  <div className="coach-cards">
                    <article className="coach-card">
                      <h3>Use this STAR frame</h3>
                      <ul className="tight">
                        <li><strong>S:</strong> {coach.situation}</li>
                        <li><strong>T:</strong> {coach.task}</li>
                        <li><strong>A:</strong> {coach.action}</li>
                        <li><strong>R:</strong> {coach.result}</li>
                      </ul>
                    </article>

                    <article className="coach-card">
                      <h3>Keywords I’d weave in</h3>
                      <div className="chips">
                        {coach.keywords.length ? coach.keywords.map((k) => <span key={k} className="chip">{k}</span>) :
                          <span className="muted">Type your summary/skills to see keyword chips.</span>}
                      </div>
                    </article>

                    <article className="coach-card">
                      <h3>Practice a question</h3>
                      <label className="fg">
                        <span>Question</span>
                        <select value={liveQuestion} onChange={(e) => setLiveQuestion(e.target.value)}>
                          {questionBank.map((q) => <option key={q}>{q}</option>)}
                        </select>
                      </label>
                      <label className="fg">
                        <span>Your answer (live tips appear below)</span>
                        <textarea
                          ref={answerInputRef}
                          rows={4}
                          value={liveTyped}
                          onChange={(e) => setLiveTyped(e.target.value)}
                          placeholder="Start with the Situation in one line…"
                        />
                      </label>

                      {/* Floating live-coach bubble */}
                      <div className="live-coach-bubble" aria-live="polite">{liveHint}</div>

                      <div className="coach-actions">
                        <button type="button" className="btn" onClick={polishAnswer}>Polish my answer ✨</button>
                        <button type="button" className="btn" onClick={undoPolish} disabled={!prevAnswerRef.current}>Undo</button>
                      </div>

                      <details className="expandable">
                        <summary>Show a sample opener</summary>
                        <p className="muted">
                          “In my {form.industry || "recent"} work as a {form.role || "candidate"}, I faced {coach.situation}.
                          My responsibility was to {coach.task.toLowerCase()}. I {coach.action.toLowerCase()} 
                          resulting in {coach.result}. That’s why I’m excited about doing similar impact here.”
                        </p>
                      </details>
                    </article>
                  </div>
                ) : (
                  <p className="muted">Fill the form and click <em>Generate tips</em> to get personalised suggestions.</p>
                )}
              </div>
            </div>
          )}

          {/*  STRESSED TAB  */}
          {activeTab === "stressed" && (
            <div className="panel grid-3">
              {/* Breathing trainer */}
              <article className="tool card-soft cute breathing">
                <h3>Box Breathing (4–4–4–4)</h3>
                <div className={`breath-stage ${breathing ? "running" : ""}`} aria-live="polite">
                  <div className={`orb ${breathPhase.toLowerCase()}`} />
                  <div className="breath-labels">
                    <span className={`phase ${breathPhase === "Inhale" ? "on" : ""}`}>Inhale</span>
                    <span className={`phase ${breathPhase === "Hold" ? "on" : ""}`}>Hold</span>
                    <span className={`phase ${breathPhase === "Exhale" ? "on" : ""}`}>Exhale</span>
                    <span className={`phase ${(breathPhase === "Hold" && breathing) ? "on" : ""}`}>Hold</span>
                  </div>
                  <div className="breath-count">{breathing ? breathCount : "Ready"}</div>
                </div>
                <div className="breath-actions">
                  <button className="btn btn-primary" onClick={() => setBreathing((b) => !b)}>
                    {breathing ? "Pause" : "Start"}
                  </button>
                  <button
                    className="btn"
                    onClick={() => { setBreathing(false); setBreathPhase("Ready"); }}
                  >
                    Reset
                  </button>
                </div>
                <p className="muted tiny">
                  Inhale 4 • Hold 4 • Exhale 4 • Hold 4. Repeat 3–4 cycles before your interview starts.
                </p>
              </article>

              {/* Other stress tools */}
              {MOCK_TIPS.stressed.map((b, i) => (
                <article key={i} className="tool card-soft">
                  <h3>{b.title}</h3>
                  <ul className="tight">{b.points.map((p) => <li key={p}>{p}</li>)}</ul>
                </article>
              ))}
            </div>
          )}

          {/* WHAT TO SA */}
          {activeTab === "say" && (
            <div className="panel grid-3">
              {MOCK_TIPS.say.map((b, i) => (
                <article key={i} className="tool card-soft">
                  <h3>{b.title}</h3>
                  <ul className="tight">{b.points.map((p) => <li key={p}>{p}</li>)}</ul>
                </article>
              ))}
              <article className="tool card-soft">
                <h3>Common traps</h3>
                <ul className="tight">
                  <li>Story with no result</li>
                  <li>Over-long context</li>
                  <li>We vs I unclear</li>
                  <li>No numbers</li>
                </ul>
              </article>
            </div>
          )}

          {/*  WHAT TO WEAR */}
          {activeTab === "wear" && (
            <div className="panel wear">
              <p className="muted">
                Based on your selection, we’ll mark one as <strong>Recommended</strong>, but you can read all.
              </p>

              <div className="wear-grid">
                {wearCatalog.map((cat) => {
                  const isRec = cat.key === (recommendedKey || "default");
                  return (
                    <article key={cat.key} className={`wear-card ${isRec ? "is-recommended" : ""}`}>
                      <header className="wear-head">
                        <h3>{cat.label}</h3>
                        {isRec && <span className="badge">Recommended</span>}
                      </header>
                      <ul className="tight">
                        {cat.tips.map((t) => <li key={t}>{t}</li>)}
                      </ul>
                    </article>
                  );
                })}
              </div>

              <div className="wear-illus" aria-hidden="true">
                <div className="avatar" />
              </div>
            </div>
          )}

          {/*NEW */}
          {activeTab === "students" && (
            <div className="panel grid-3">
              {MOCK_TIPS.students.map((b, i) => (
                <article key={i} className="tool card-soft">
                  <h3>{b.title}</h3>
                  <ul className="tight">{b.points.map((p) => <li key={p}>{p}</li>)}</ul>
                </article>
              ))}
              <article className="tool card-soft cute">
                <h3>Portfolio checklist</h3>
                <ul className="tight">
                  <li>3 projects max: problem → process → result</li>
                  <li>1-page PDF resume linked</li>
                  <li>Contact & LinkedIn visible</li>
                </ul>
              </article>
            </div>
          )}
        </>
      )}
    </section>
  );
}
