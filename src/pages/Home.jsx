
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Home.css";


const asset = (p) => `${process.env.PUBLIC_URL}${p}`;


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




const HeroImage = () => (
  <img
    className="hero-cv"
    src={asset("/assets/home/hero-girl.png")}
    alt="Illustration of a girl building her CV on a laptop"
    width={520}
    height={400}
    loading="eager"
    decoding="async"
  />
);


const FeatureImage = ({ index }) => (
  <img
    className="feature-img"
    src={asset(`/assets/home/feature-${index + 1}.png`)}
    alt={["Smart suggestions", "Pastel templates", "Interview prep"][index] || "Feature"}
    width={520}
    height={300}
    loading="lazy"
    decoding="async"
  />
);


const StepImage = ({ i }) => (
  <img
    className="step-img"
    src={asset(`/assets/home/step-${i}.png`)}
    alt={
      i === 1
        ? "Pick your vibe"
        : i === 2
        ? "Tell your story"
        : "Export and shine"
    }
    width={520}
    height={260}
    loading="lazy"
    decoding="async"
  />
);


function FeatureCarousel() {
  const slides = useMemo(() => [0, 1, 2], []);
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (reduced) return;
    const start = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => setIndex((p) => (p + 1) % slides.length), 3500);
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
  }, [slides.length, reduced]);

  return (
    <div className="feature-illus fade-in">
      <FeatureImage index={index} />
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
      {/* cursor */}
      <div className="cursor-halo" aria-hidden="true" />

      {/* HER*/}
      <section className="hero card" aria-labelledby="hero-title">
        <div className="hero-left fade-up">
          <p className="eyebrow">Dreamy Resume • built for calm</p>
          <h1 id="hero-title">
            Design a <span className="accent">pastel-perfect</span> CV in minutes
          </h1>
          <p className="lead">
            Create an elegant resume, get AI suggestions and prep for interviews
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
          <HeroImage />
          {/* decorative lines */}
          <svg className="hero-shapes" viewBox="0 0 600 120" aria-hidden="true">
            <defs>
              <linearGradient id="stripe" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffd6ec" />
                <stop offset="100%" stopColor="#d7c6ff" />
              </linearGradient>
            </defs>
            <path d="M0 100 C 150 20, 300 160, 600 60" fill="none" stroke="url(#stripe)" strokeWidth="16" opacity=".55" />
            <path d="M0 90 C 150 10, 300 150, 600 50" fill="none" stroke="url(#stripe)" strokeWidth="4" opacity=".35" />
          </svg>
        </div>
      </section>

      {/* FEATURE */}
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
              <p>Curated designs that feel calm, modern and professional.</p>
            </li>
            <li>
              <strong><span className="num">3</span> Interview prep that helps</strong>
              <p>Guided practice + breathing to steady your voice and mind.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* STEPS  */}
      <section className="steps" aria-labelledby="steps-title">
        <h2 id="steps-title" className="sr-only">How it works</h2>

        <div className="step card fade-up">
          <StepImage i={1} />
          <h3>Pick your vibe</h3>
          <p className="lead">Choose a template that fits your aesthetic soft, elegant or bold.</p>
        </div>

        <div className="step card fade-up delay-1">
          <StepImage i={2} />
          <h3>Tell your story</h3>
          <p className="lead">Add your details; get AI polish that keeps your voice intact.</p>
        </div>

        <div className="step card fade-up delay-2">
          <StepImage i={3} />
          <h3>Export & shine</h3>
          <p className="lead">One click export to PDF ready for applications and portfolios.</p>
        </div>
      </section>

      {/*  BOTTOM CTAS*/}
      <div className="bottom-ctas fade-up" aria-label="Secondary actions">
        <button className="btn magnet" onClick={() => navigate("/interview")}>
          Prep for interviews
        </button>
        <button className="btn magnet" onClick={() => navigate("/faqs")}>
          Read FAQs
        </button>
      </div>
    </main>
  );
}
