// src/pages/Home.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Home.css";

/* ========= Accessibility: motion prefs ========= */
function useReducedMotion() {
  const [pref, setPref] = useState(false);
  useEffect(() => {
    const mm = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mm) return;
    const update = () => setPref(!!mm.matches);
    update();
    mm.addEventListener?.("change", update);
    return () => mm.removeEventListener?.("change", update);
  }, []);
  return pref;
}

/* ========= Cursor halo spotlight ========= */
function useCursorHalo(enabled = true) {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!enabled || reduced) return;
    const halo = document.querySelector(".cursor-halo");
    if (!halo) return;

    let raf = 0;
    const state = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: state.x, y: state.y };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!raf) tick();
    };

    const tick = () => {
      state.x += (target.x - state.x) * 0.18;
      state.y += (target.y - state.y) * 0.18;
      halo.style.transform = `translate(${state.x - 150}px, ${state.y - 150}px)`;
      if (Math.hypot(target.x - state.x, target.y - state.y) < 0.5) raf = 0;
      else raf = requestAnimationFrame(tick);
    };

    document.documentElement.classList.add("has-cursor");
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("has-cursor");
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, reduced]);
}

/* ========= Inline SVGs (no assets needed) ========= */
const HeroPreview = () => (
  <svg className="hero-cv" viewBox="0 0 520 400" role="img" aria-label="Pastel resume preview">
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopOpacity="1" stopColor="#ffe5f0"/>
        <stop offset="100%" stopOpacity="1" stopColor="#f3e9ff"/>
      </linearGradient>
      <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ec4899"/>
        <stop offset="100%" stopColor="#f59e0b"/>
      </linearGradient>
      <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6"/>
      </filter>
    </defs>
    <rect x="0" y="0" width="520" height="400" fill="url(#g1)"/>
    <rect x="36" y="36" width="448" height="328" rx="16" fill="#fff" stroke="#f0d7ff"/>
    <rect x="60" y="60" width="90" height="90" rx="12" fill="#ffe1ef" filter="url(#blur)"/>
    <rect x="170" y="72" width="250" height="18" rx="9" fill="url(#g2)"/>
    <rect x="170" y="100" width="210" height="10" rx="5" fill="#e8e7ff"/>
    <rect x="170" y="118" width="230" height="10" rx="5" fill="#ffe6f2"/>
    <rect x="60" y="170" width="380" height="10" rx="5" fill="#eadfff"/>
    <rect x="60" y="188" width="300" height="10" rx="5" fill="#ffecec"/>
    <rect x="60" y="206" width="350" height="10" rx="5" fill="#eaf7ff"/>
    <rect x="60" y="242" width="380" height="10" rx="5" fill="#eadfff"/>
    <rect x="60" y="260" width="320" height="10" rx="5" fill="#ffecec"/>
    <rect x="60" y="278" width="280" height="10" rx="5" fill="#eaf7ff"/>
  </svg>
);

const FeatureImage = ({ variant = 1 }) => (
  <svg viewBox="0 0 520 300" className="feature-img" role="img" aria-label={`Feature visual ${variant}`}>
    <defs>
      <linearGradient id={`f${variant}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={variant === 1 ? "#ffd6ec" : variant === 2 ? "#d7c6ff" : "#cfe8ff"}/>
        <stop offset="100%" stopColor="#ffffff"/>
      </linearGradient>
    </defs>
    <rect width="520" height="300" rx="16" fill={`url(#f${variant})`}/>
    <g opacity=".65">
      <circle cx="90" cy="210" r="50" fill="#fff"/>
      <rect x="170" y="70" width="270" height="20" rx="10" fill="#fff"/>
      <rect x="170" y="104" width="210" height="12" rx="6" fill="#fff"/>
      <rect x="170" y="126" width="240" height="12" rx="6" fill="#fff"/>
      <rect x="170" y="160" width="300" height="12" rx="6" fill="#fff"/>
      <rect x="170" y="182" width="200" height="12" rx="6" fill="#fff"/>
    </g>
  </svg>
);

const StepImage = ({ i }) => (
  <svg viewBox="0 0 520 260" className="step-img" role="img" aria-label={`Step ${i}`}>
    <defs>
      <linearGradient id={`s${i}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={i === 1 ? "#fff1f7" : i === 2 ? "#eef2ff" : "#f0fff8"}/>
        <stop offset="100%" stopColor="#ffffff"/>
      </linearGradient>
    </defs>
    <rect width="520" height="260" rx="12" fill={`url(#s${i})`}/>
    <rect x="40" y="48" width="440" height="14" rx="7" fill="#f5d0fe"/>
    <rect x="40" y="72" width="300" height="10" rx="5" fill="#fde68a"/>
    <rect x="40" y="96" width="380" height="10" rx="5" fill="#bae6fd"/>
    <rect x="40" y="132" width="430" height="10" rx="5" fill="#e9d5ff"/>
    <rect x="40" y="154" width="260" height="10" rx="5" fill="#fecaca"/>
  </svg>
);

/* ========= Feature carousel (inline SVGs) ========= */
function FeatureCarousel() {
  const slides = useMemo(() => [1, 2, 3], []);
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (reduced) return;
    const start = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => setIndex((p) => (p + 1) % total), 3500);
    };
    const stop = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
    const onVis = () => (document.visibilityState === "visible" ? start() : stop());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [total, reduced]);

  return (
    <div className="feature-illus fade-in">
      <FeatureImage variant={slides[index]} />
      <div className="carousel-dots" role="tablist" aria-label="Feature slides">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`btn btn-sm ${i === index ? "is-active" : ""}`}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === index}
            role="tab"
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ========= Page ========= */
export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useCursorHalo(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="page-loader" aria-live="assertive" aria-busy="true">
        <div className="loader-mark">Dreamy Resume</div>
        <div className="loader-dots" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <p className="loader-text">polishing your pastel vibes…</p>
      </div>
    );
  }

  return (
    <main className="home" aria-label="Dreamy Resume home">
      {/* Ambient spotlight follows cursor */}
      <div className="cursor-halo" aria-hidden="true" />

      {/* ===== HERO ===== */}
      <section className="hero card" aria-labelledby="hero-title">
        <div className="hero-left fade-up">
          <p className="eyebrow">Dreamy Resume • built for calm</p>
          <h1 id="hero-title">
            Design a <span className="accent">pastel-perfect</span> CV in minutes
          </h1>
          <p className="lead">
            Create an elegant resume, get AI suggestions, and prep for interviews—
            all in one soft, focused workspace.
          </p>
          <div className="cta-row">
            <button className="btn btn-primary magnet" onClick={() => navigate("/create")}>
              Create new CV
            </button>
            <button className="btn magnet" onClick={() => navigate("/templates")}>
              Explore templates
            </button>
          </div>
        </div>

        <div className="hero-right fade-up delay-1">
          <HeroPreview />
          <svg className="hero-shapes" viewBox="0 0 600 120" aria-hidden="true">
            <defs>
              <linearGradient id="stripe" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffd6ec"/>
                <stop offset="100%" stopColor="#d7c6ff"/>
              </linearGradient>
            </defs>
            <path d="M0 100 C 150 20, 300 160, 600 60" fill="none" stroke="url(#stripe)" strokeWidth="16" opacity=".55"/>
            <path d="M0 90 C 150 10, 300 150, 600 50" fill="none" stroke="url(#stripe)" strokeWidth="4" opacity=".35"/>
          </svg>
        </div>
      </section>

      {/* ===== FEATURE STRIP ===== */}
      <section className="feature card" aria-labelledby="feature-title">
        <h2 id="feature-title" className="sr-only">Highlights</h2>
        <FeatureCarousel />

        <div className="feature-listbox fade-up delay-1">
          <ul className="feature-list">
            <li>
              <strong><span className="num">1</span> Smart suggestions</strong>
              <p>Tailored bullet points that match your industry and tone.</p>
            </li>
            <li>
              <strong><span className="num">2</span> Pastel-perfect templates</strong>
              <p>Curated designs that feel calm, modern, and professional.</p>
            </li>
            <li>
              <strong><span className="num">3</span> Interview prep that helps</strong>
              <p>Guided practice + breathing to steady your voice and mind.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* ===== STEPS ===== */}
      <section className="steps" aria-labelledby="steps-title">
        <h2 id="steps-title" className="sr-only">How it works</h2>

        <div className="step card fade-up">
          <StepImage i={1} />
          <h3>Pick your vibe</h3>
          <p className="lead">Choose a template that fits your aesthetic—soft, elegant, or bold.</p>
        </div>

        <div className="step card fade-up delay-1">
          <StepImage i={2} />
          <h3>Tell your story</h3>
          <p className="lead">Add your details; get AI polish that keeps your voice intact.</p>
        </div>

        <div className="step card fade-up delay-2">
          <StepImage i={3} />
          <h3>Export & shine</h3>
          <p className="lead">One-click export to PDF—ready for applications and portfolios.</p>
        </div>
      </section>

      {/* ===== BOTTOM CTAS ===== */}
      <div className="bottom-ctas fade-up" aria-label="Secondary actions">
  <button
    className="btn magnet"
    onClick={() => navigate("/interview")}
  >
    Prep for interviews
  </button>
  <button
    className="btn magnet"
    onClick={() => navigate("/faqs")}
  >
    Read FAQs
  </button>
</div>

    </main>
  );
}
