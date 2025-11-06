// src/pages/FAQs.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/FAQs.css";

const LS_FAQ_FEEDBACK = "dreamy.faq.feedback.v1";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "templates", label: "Templates" },
  { id: "create", label: "Create CV" },
  { id: "account", label: "Account" },
  { id: "billing", label: "Billing" },
];

const RAW_FAQS = [
  // GENERAL
  {
    id: "getting-started",
    cat: "general",
    q: "How do I get started?",
    a: "Head to Create and fill in your basics: name, role, tone, and colour vibe. We’ll auto-suggest templates and pre-fill sections like Summary and Skills. You can tweak everything live in the preview.",
  },
  {
    id: "export",
    cat: "general",
    q: "Can I export my CV as PDF or Word?",
    a: "Yes. Use the Export button on the Template Details page. PDF preserves layout perfectly; Word is better if you expect recruiters to copy-edit your text.",
  },
  {
    id: "ai-help",
    cat: "general",
    q: "Is there AI help for bullet points?",
    a: "Yep! In Create, use ‘Polish my answer’ or ‘Rewrite’ to tighten phrasing and tailor tone. In Interview Tips you can generate role-specific answers to common questions.",
  },

  // TEMPLATES
  {
    id: "recommendation",
    cat: "templates",
    q: "Why is a template marked ‘Recommended’?",
    a: "We blend your color vibe + tone + role to sort templates. Your color match is prioritized for the badge, then the top scorer wins if the color match isn’t available after filters.",
  },
  {
    id: "switch-template",
    cat: "templates",
    q: "Can I switch templates later without losing content?",
    a: "Absolutely. Your content is kept separate from the layout. Switch anytime—your data flows into the new template automatically.",
  },

  // CREATE
  {
    id: "colors-not-updating",
    cat: "create",
    q: "My color isn’t showing in the preview—what should I check?",
    a: "Ensure the Create color key exists in your template theme tokens. If you added a new color name, map it in both the recommender and the template’s CSS variables.",
  },
  {
    id: "tone-impact",
    cat: "create",
    q: "What does ‘Tone’ actually change?",
    a: "Tone nudges writing suggestions, section ordering, and which templates bubble up. ‘Professional’ pushes clean serif & slate; ‘Creative’ lifts fun pastel layouts.",
  },

  // ACCOUNT
  {
    id: "login-issues",
    cat: "account",
    q: "I can’t log in. Help?",
    a: "Reset your password from the login screen. If you used Google/Apple sign-in, make sure you’re using the same provider as when you registered.",
  },
  {
    id: "profile-reminder",
    cat: "account",
    q: "Why does my profile icon wiggle after login?",
    a: "We animate the icon if important profile fields (like name or weight) are missing—tap it to complete your profile. The nudge disappears once those key fields are filled.",
  },

  // BILLING
  {
    id: "billing-currency",
    cat: "billing",
    q: "What currency do you support?",
    a: "We show pricing in your local currency when possible. At checkout we bill in USD with real-time conversion by your bank or provider.",
  },
  {
    id: "refunds",
    cat: "billing",
    q: "What’s the refund policy?",
    a: "If export or core features don’t work for you after we’ve tried to fix it, we’ll refund within 7 days. Reach out with your receipt and a quick note describing the issue.",
  },
];

// ————————————————————————————————————————————————
// Utilities
// ————————————————————————————————————————————————
const normalize = (s) => (s || "").toLowerCase();
const highlightMatch = (text, term) => {
  if (!term) return text;
  const idx = normalize(text).indexOf(normalize(term));
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + term.length);
  const after = text.slice(idx + term.length);
  return (
    <>
      {before}
      <mark className="hl">{match}</mark>
      {after}
    </>
  );
};

// ————————————————————————————————————————————————
// FAQ Item (accordion)
// ————————————————————————————————————————————————
function FAQItem({ faq, term, expanded, onToggle, onCopyLink, feedback, onFeedback }) {
  const contentRef = useRef(null);

  // smooth height animation without layout thrash
  const currentHeight = expanded ? (contentRef.current?.scrollHeight || 0) : 0;

  return (
    <article className={`faq-card ${expanded ? "is-open" : ""}`} id={`q-${faq.id}`}>
      <button
        className="faq-head"
        aria-expanded={expanded}
        aria-controls={`panel-${faq.id}`}
        onClick={onToggle}
      >
        <span className="q">
          {highlightMatch(faq.q, term)}
        </span>
        <span className="chev" aria-hidden>{/* css draws chevron */}</span>
      </button>

      <div
        id={`panel-${faq.id}`}
        className="faq-panel"
        style={{ height: currentHeight }}
        role="region"
        aria-labelledby={`q-${faq.id}`}
      >
        <div ref={contentRef} className="faq-body">
          <p>{highlightMatch(faq.a, term)}</p>

          <div className="faq-actions">
            <button className="mini-btn" onClick={onCopyLink} title="Copy link to this question">
              🔗 Copy link
            </button>
            <div className="fb" role="group" aria-label="Was this helpful?">
              <span>Helpful?</span>
              <button
                className={`mini-btn ${feedback === "up" ? "is-active" : ""}`}
                onClick={() => onFeedback("up")}
                title="Yes"
              >
                👍
              </button>
              <button
                className={`mini-btn ${feedback === "down" ? "is-active" : ""}`}
                onClick={() => onFeedback("down")}
                title="No"
              >
                👎
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// ————————————————————————————————————————————————
// Main Component
// ————————————————————————————————————————————————
export default function FAQs() {
  const nav = useNavigate();
  const location = useLocation();

  const [cat, setCat] = useState("all");
  const [term, setTerm] = useState("");
  const [openId, setOpenId] = useState(null);
  const [feedbackMap, setFeedbackMap] = useState({}); // { [id]: 'up'|'down' }

  // Load saved feedback + handle deep links (#q-<id>)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_FAQ_FEEDBACK) || "{}");
      setFeedbackMap(saved);
    } catch {
      setFeedbackMap({});
    }
    // open if location has a hash like #q-getting-started
    if (location.hash?.startsWith("#q-")) {
      const id = location.hash.replace("#q-", "");
      setOpenId(id);
      // smooth scroll into view
      setTimeout(() => {
        document.getElementById(`q-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtered list
  const faqs = useMemo(() => {
    const pool = cat === "all" ? RAW_FAQS : RAW_FAQS.filter(f => f.cat === cat);
    if (!term) return pool;
    const t = normalize(term);
    return pool.filter(f => normalize(f.q + " " + f.a).includes(t));
  }, [cat, term]);

  const randomize = () => {
    if (faqs.length === 0) return;
    const pick = faqs[Math.floor(Math.random() * faqs.length)];
    setOpenId(pick.id);
    // flash a sparkle class on the container for fun
    const root = document.querySelector(".faqs");
    root?.classList.add("sparkle");
    setTimeout(() => root?.classList.remove("sparkle"), 900);
  };

  const onCopyLink = (id) => {
    const url = `${window.location.origin}${window.location.pathname}#q-${id}`;
    navigator.clipboard.writeText(url);
    const btn = document.querySelector(`#q-${id} .faq-actions .mini-btn`);
    btn?.classList.add("copied");
    setTimeout(() => btn?.classList.remove("copied"), 1200);
  };

  const setFeedback = (id, v) => {
    const next = { ...feedbackMap, [id]: v };
    setFeedbackMap(next);
    localStorage.setItem(LS_FAQ_FEEDBACK, JSON.stringify(next));
  };

  // cute CTA destinations (adjust if you have these routes)
  const goCreate = () => nav("/create");
  const goTemplates = () => nav("/templates");
  const goAccount = () => nav("/account");

  return (
    <section className="faqs">
      <header className="faqs-hero">
        <div className="hero-wrap">
          <h1>FAQs</h1>
          <p>Quick answers, pastel vibes, and a sprinkle of ✨magic.</p>

          <div className="search-row">
            <input
              className="input search"
              placeholder="Search anything… e.g. export, color, login"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              aria-label="Search FAQs"
            />
            <button className="btn btn-primary" onClick={randomize} title="Surprise me">
              I’m feeling lucky ✨
            </button>
          </div>

          <div className="chip-row">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className={`chip ${cat === c.id ? "is-active" : ""}`}
                onClick={() => setCat(c.id)}
                aria-pressed={cat === c.id}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="faqs-grid">
        {faqs.map(f => (
          <FAQItem
            key={f.id}
            faq={f}
            term={term}
            expanded={openId === f.id}
            onToggle={() => setOpenId(openId === f.id ? null : f.id)}
            onCopyLink={() => onCopyLink(f.id)}
            feedback={feedbackMap[f.id]}
            onFeedback={(v) => setFeedback(f.id, v)}
          />
        ))}

        {faqs.length === 0 && (
          <div className="empty">
            <p>No results for “{term}”. Try <button className="link" onClick={() => setTerm("")}>clearing search</button> or exploring:</p>
            <div className="pill-row">
              <button className="pill" onClick={goCreate}>Go to Create</button>
              <button className="pill" onClick={goTemplates}>Browse Templates</button>
              <button className="pill" onClick={goAccount}>Open Account</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
