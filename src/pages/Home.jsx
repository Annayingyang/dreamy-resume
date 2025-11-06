
import React, { useEffect, useMemo, useRef, useState, useId } from "react";
import { Link } from "react-router-dom";
import "../style/Home.css";

const asset = (p) => `${process.env.PUBLIC_URL}${p}`;


function PageLoader() {
  return (
    <div className="page-loader" role="alert" aria-live="assertive" aria-busy="true">
      <div className="loader-mark">Dreamy</div>
      <div className="loader-dots" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
      <p className="loader-text">Loading your dreamy home…</p>
    </div>
  );
}

/* eature carousel */
function FeatureCarousel() {
  const slides = useMemo(
    () => [
      { src: asset("/assets/home/templates/pastel.png"), alt: "Pastel Classic template" },
      { src: asset("/assets/home/templates/mint.png"), alt: "Minimal Mint template" },
      { src: asset("/assets/home/templates/dark.png"), alt: "Elegant Dark template" },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const total = slides.length;
  const regionId = useId();
  const imgId = `${regionId}-img`;
  const trackRef = useRef(null);

  // Touch swipe (no extra CSS)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let startX = 0, dx = 0;
    const onStart = (e) => { startX = e.touches[0].clientX; };
    const onMove  = (e) => { dx = e.touches[0].clientX - startX; };
    const onEnd   = () => {
      if (dx > 50) setIndex((p) => (p - 1 + total) % total);
      if (dx < -50) setIndex((p) => (p + 1) % total);
      dx = 0;
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove,  { passive: true });
    el.addEventListener("touchend", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove",  onMove);
      el.removeEventListener("touchend",   onEnd);
    };
  }, [total]);

  const onKeyTabs = (e) => {
    if (e.key === "ArrowLeft") { setIndex((p) => (p - 1 + total) % total); }
    if (e.key === "ArrowRight"){ setIndex((p) => (p + 1) % total); }
    if (e.key === "Home")      { setIndex(0); }
    if (e.key === "End")       { setIndex(total - 1); }
  };

  return (
    <div
      className="carousel-region"
      role="region"
      aria-roledescription="carousel"
      aria-label="Template previews"
      aria-describedby={`${regionId}-status`}
    >
      <div ref={trackRef} className="feature-illus">
        <img id={imgId} src={slides[index].src} alt={slides[index].alt} />
      </div>

      <div className="carousel-dots" role="tablist" aria-label="Slides">
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-controls={imgId}
            aria-selected={index === i}
            tabIndex={index === i ? 0 : -1}
            className={`btn btn-sm ${index === i ? "is-active" : ""}`}
            onClick={() => setIndex(i)}
            onKeyDown={onKeyTabs}
          >
            {index === i ? "●" : "○"}
          </button>
        ))}
      </div>

      {/* SR-only live status for screen readers */}
      <p id={`${regionId}-status`} className="sr-only" aria-live="polite">
        Slide {index + 1} of {total}
      </p>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Whole-page loader (splash) for initial mount
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {loading && <PageLoader />}

      <div className="home" role="main" aria-busy={loading} aria-hidden={loading}>
        {/* === HERO === */}
        <section className="hero card" aria-labelledby="hero-title">
          <div className="hero-left">
            <p className="eyebrow">Fast. Easy. Effective.</p>
            <h1 id="hero-title">
              Dreamy. <span className="accent">The Best CV Maker Online.</span>
            </h1>
            <p className="lead">
              Whether you want to build a new CV from scratch or improve an
              existing one, let Dreamy help you present your work life, personality,
              and skills on a CV that stands out.
            </p>

            <div className="cta-row" aria-label="Primary actions">
              <Link className="btn btn-primary" to="/create">Create new CV</Link>
              <Link className="btn btn-outline" to="/account">Improve my CV</Link>
            </div>
          </div>

          {/* right side preview image */}
          <div className="hero-right">
            <img
              src={asset("/assets/home/hero-cv.png")}
              alt="Live CV preview"
              className="hero-cv"
              width="520"
              height="400"
              loading="eager"
            />
            <img
              src={asset("/assets/home/hero-shapes.png")}
              alt=""
              aria-hidden="true"
              className="hero-shapes"
              loading="lazy"
            />
          </div>
        </section>

        {/* === FEATURE STRIP (carousel with dots) === */}
        <section className="feature card" aria-labelledby="feature-title">
          <div className="feature-illus">
            <FeatureCarousel />
          </div>

          <div className="feature-listbox">
            <h2 id="feature-title" className="sr-only">Key features</h2>
            <ol className="feature-list">
              <li>
                <span className="num">1</span>{" "}
                <strong>Enhance your CV with our expert content</strong>
                <p>Choose from thousands of top-rated phrases and insert them directly.</p>
              </li>
              <li><span className="num">2</span> CV and cover letter in one place</li>
              <li><span className="num">3</span> Professionally designed templates</li>
              <li><span className="num">4</span> Expert tips &amp; guidance</li>
              <li><span className="num">5</span> Apply for jobs with confidence</li>
            </ol>

            <div className="cta-row">
              <Link className="btn btn-primary" to="/create">Create new CV</Link>
              <Link className="btn btn-outline" to="/templates">Browse templates</Link>
            </div>
          </div>
        </section>

        {/* === THREE STEPS === */}
        <section className="steps" aria-labelledby="steps-title">
          <h2 id="steps-title" className="sr-only">How it works</h2>

          <div className="step card">
            <img
              src={asset("/assets/home/step1.png")}
              alt="Choose a template"
              className="step-img"
              loading="lazy"
              width="400"
              height="200"
            />
            <h3>Pick a CV template.</h3>
            <p>Choose a sleek design and layout to get started.</p>
          </div>

          <div className="step card">
            <img
              src={asset("/assets/home/step2.png")}
              alt="Fill in the blanks"
              className="step-img"
              loading="lazy"
              width="400"
              height="200"
            />
            <h3>Fill in the blanks.</h3>
            <p>Type a few words. Let our wizard fill the rest.</p>
          </div>

          <div className="step card">
            <img
              src={asset("/assets/home/step3.png")}
              alt="Customize your document"
              className="step-img"
              loading="lazy"
              width="400"
              height="200"
            />
            <h3>Customize your document.</h3>
            <p>Make it truly yours in a few clicks.</p>
          </div>
        </section>

        {/* === BOTTOM CTAs === */}
        <div className="center bottom-ctas" aria-label="Secondary actions">
          <Link className="btn btn-primary" to="/create">Create new CV</Link>
          <Link className="btn btn-outline" to="/account">Improve my CV</Link>
        </div>
      </div>
    </>
  );
}
