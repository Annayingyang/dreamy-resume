// src/pages/FAQs.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/FAQs.css";

const LS_FAQ_FB = "dreamy.faq.feedback.v2";


const CATS = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "templates", label: "Templates" },
  { id: "create", label: "Create CV" },
  { id: "interview", label: "Interview Tips" },
  { id: "troubleshoot", label: "Troubleshooting" },
];

/** FAQ content */
const FAQS = [
  
  {
    id: "start",
    cat: "general",
    q: "How do I get started quickly?",
    a: "Go to Create → fill in name, role, tone and colour vibe. We’ll suggest a template, prefill sections and you can fine tune everything in the live preview.",
  },
  {
    id: "export",
    cat: "general",
    q: "Can I export my CV as PDF or Word?",
    a: "Yes. Use Export on the Template Details page. PDF locks layout for perfect visuals.",
  },

  // TEMPLATES
  {
    id: "reco-badge",
    cat: "templates",
    q: "Why is a template marked ‘Recommended’?",
    a: "Your colour pick gets first priority for the badge. If that template is filtered out, we fall back to the top scorer from your role + tone. (So colour wins unless you hide it.)",
  },
  {
    id: "switching",
    cat: "templates",
    q: "Can I switch templates without losing my content?",
    a: "Absolutely. Your content is independent from layout. Switch templates anytime your data flows with you.",
  },

  // CREATE CV
  {
    id: "color-not-updating",
    cat: "create",
    q: "My colour isn’t updating the highlight blocks what should I check?",
    a: "Confirm that the chosen colour key exists in both the recommender and the templates . Please reload the page, Thank You.",
  },
  {
    id: "tone-effects",
    cat: "create",
    q: "What does ‘Tone’ change?",
    a: "It nudges writing style, section prominence, and recommendation weights. ‘Professional’ surfaces serif/slate; ‘Creative’ brings fun pastels and dynamic layouts.",
  },

 
  {
    id: "breathing",
    cat: "interview",
    q: "Can I practice breathing to calm nerves?",
    a: "Yes. On Interview Tips, the ‘I’m stressed’ tab includes inhale/hold/exhale cycles with correct timing. Increase duration as you get comfortable.",
  },
  {
    id: "outfit",
    cat: "interview",
    q: "How do outfits change per industry?",
    a: "Your industry pick suggests outfits (and marks a recommended look) while still showing all options. Subtle changes in fabric, structure, and colour signal fit.",
  },

  // TROUBLESHOOTING
  {
    id: "reco-stuck",
    cat: "troubleshoot",
    q: "The recommendation looks wrong or ‘stuck’.",
    a: "Clear local preference caches: open Templates and press ‘Clear filters’.",
  },
  {
    id: "white-screen",
    cat: "troubleshoot",
    q: "I see a white screen after editing CSS.",
    a: "Check for internet connect and reload the page",
  },
];


const norm = (s) => (s || "").toLowerCase();
const hi = (text, term) => {
  if (!term) return text;
  const i = norm(text).indexOf(norm(term));
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="hl">{text.slice(i, i + term.length)}</mark>
      {text.slice(i + term.length)}
    </>
  );
};


function popConfetti(x = window.innerWidth / 2, y = window.innerHeight / 2) {
  const root = document.body;
  const N = 18;
  for (let i = 0; i < N; i++) {
    const dot = document.createElement("i");
    dot.className = "confetti";
    const angle = (Math.PI * 2 * i) / N;
    const dist = 80 + Math.random() * 40;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    dot.style.setProperty("--tx", `${tx}px`);
    dot.style.setProperty("--ty", `${ty}px`);
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    root.appendChild(dot);
    setTimeout(() => dot.remove(), 900);
  }
}


function useParallax() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * 6;
      const ry = (0.5 - px) * 6;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const onLeave = () => {
      el.style.transform = "";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return ref;
}


function FAQCard({ item, term, expanded, onToggle, onCopy, feedback, onFeedback }) {
  const innerRef = useRef(null);
  const tiltRef = useParallax();

  const h = expanded ? innerRef.current?.scrollHeight || 0 : 0;

  const onThumb = (dir, e) => {
    onFeedback(dir);
    if (dir === "up" && e && e.clientX != null && e.clientY != null) {
      popConfetti(e.clientX, e.clientY);
    }
  };

  return (
    <article
      className={`faq-card ${expanded ? "is-open" : ""}`}
      id={`q-${item.id}`}
      ref={tiltRef}
    >
      <button
        className="faq-head ripple"
        aria-expanded={expanded}
        aria-controls={`panel-${item.id}`}
        onClick={onToggle}
      >
        <span className="q">{hi(item.q, term)}</span>
        <span className="chev" aria-hidden />
      </button>

      <div
        id={`panel-${item.id}`}
        className="faq-panel"
        style={{ height: h }}
        role="region"
        aria-labelledby={`q-${item.id}`}
      >
        <div className="faq-body" ref={innerRef}>
          <p>{hi(item.a, term)}</p>

          <div className="faq-actions">
           
            <div className="fb" role="group" aria-label="Was this helpful?">
              <span>Helpful?</span>
              <button
                className={`mini-btn ${feedback === "up" ? "is-active" : ""} ripple`}
                onClick={(e) => onThumb("up", e)}
                title="Yes"
              >
                👍
              </button>
              <button
                className={`mini-btn ${feedback === "down" ? "is-active" : ""} ripple`}
                onClick={(e) => onThumb("down", e)}
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

/*  main - */
export default function FAQs() {
  const nav = useNavigate();
  const location = useLocation();

  const [cat, setCat] = useState("all");
  const [term, setTerm] = useState("");
  const [openId, setOpenId] = useState(null);
  const [fb, setFb] = useState({}); 

  
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_FAQ_FB) || "{}");
      setFb(saved);
    } catch {
      setFb({});
    }
    if (location.hash && location.hash.startsWith("#q-")) {
      const id = location.hash.replace("#q-", "");
      setOpenId(id);
      setTimeout(() => {
        const el = document.getElementById(`q-${id}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const list = useMemo(() => {
    const pool = cat === "all" ? FAQS : FAQS.filter((f) => f.cat === cat);
    if (!term) return pool;
    const t = norm(term);
    return pool.filter((f) => norm(f.q + " " + f.a).includes(t));
  }, [cat, term]);

  
  const randomize = () => {
    if (!list.length) return;
    const pick = list[Math.floor(Math.random() * list.length)];
    setOpenId(pick.id);
    const root = document.querySelector(".faqs");
    if (root) {
      root.classList.add("sparkle");
      setTimeout(() => root.classList.remove("sparkle"), 900);
    }
  };

  
  const copyLink = (id) => {
    const url = `${window.location.origin}${window.location.pathname}#q-${id}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    }
  };

  // Save 
  const setFeedback = (id, v) => {
    const next = { ...fb, [id]: v };
    setFb(next);
    localStorage.setItem(LS_FAQ_FB, JSON.stringify(next));
  };

  return (
    <section className="faqs">
      <header className="faqs-hero">
        <div className="hero-wrap">
          <h1>FAQs</h1>
          <p>Quick answers, pastel vibes, real animations.</p>

          <div className="search-row">
            <input
              className="input search"
              placeholder="Search… e.g. export, colour, template"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              aria-label="Search FAQs"
            />
            <button className="btn btn-primary ripple" onClick={randomize}>
              I’m feeling lucky ✨
            </button>
          </div>

          <div className="chip-row" role="tablist" aria-label="Filter FAQs by category">
            {CATS.map((c) => (
              <button
  key={c.id}
  className={`chip ${cat === c.id ? "is-active" : ""}`}
  onClick={() => setCat(c.id)}
  role="tab"
  aria-selected={cat === c.id}
>
  {c.label}
</button>

            ))}
          </div>
        </div>
      </header>

      <div className="faqs-grid">
        {list.map((it) => (
          <FAQCard
            key={it.id}
            item={it}
            term={term}
            expanded={openId === it.id}
            onToggle={() => setOpenId(openId === it.id ? null : it.id)}
            onCopy={() => copyLink(it.id)}
            feedback={fb[it.id]}
            onFeedback={(v) => setFeedback(it.id, v)}
          />
        ))}

        {!list.length && (
          <div className="empty">
            <p>
              No results for “{term}”. Try{" "}
              <button className="link" onClick={() => setTerm("")}>
                clearing search
              </button>
              .
            </p>
            <div className="pill-row">
              <button className="pill ripple" onClick={() => nav("/create")}>
                Go to Create
              </button>
              <button className="pill ripple" onClick={() => nav("/templates")}>
                Browse Templates
              </button>
              <button className="pill ripple" onClick={() => nav("/interview-tips")}>
                Interview Tips
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
