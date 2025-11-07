// src/App.jsx
import React, { useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import FAQs from "./pages/FAQs";
import InterviewTips from "./pages/InterviewTips";
import Account from "./pages/Account";
import CreateCV from "./pages/CreateCV";
import Templates from "./pages/Templates";
import TemplateDetails from "./pages/TemplateDetails";

import "./App.css";


function GlobalSparkles() {
  const layerRef = useRef(null);
  const lastTimeRef = useRef(0);
  const reducedRef = useRef(false);
  const poolRef = useRef([]);

  useEffect(() => {
    const mm = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    reducedRef.current = !!mm?.matches;
    const onChange = () => (reducedRef.current = !!mm.matches);
    mm?.addEventListener?.("change", onChange);

    const layer = layerRef.current;
    if (!layer) return;

    const MAX_SPARKLES = 120;
    const MIN_INTERVAL_MS = 18;

    const makeSparkle = (x, y) => {
      let s = poolRef.current.pop();
      if (!s) s = document.createElement("span");
      s.className = "app-sparkle-dot";           // ← matches your CSS
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.setProperty("--r", (Math.random() * 360).toFixed(0));
      s.style.setProperty("--dx", `${(Math.random() - 0.5) * 30}px`);
      s.style.setProperty("--dy", `${(Math.random() - 0.5) * 30}px`);
      const size = 6 + Math.random() * 6;
      s.style.setProperty("--size", `${size}px`);
      s.style.setProperty("--h", `${Math.floor(300 + Math.random() * 60)}`); // pink-lavender hue
      layer.appendChild(s);
      setTimeout(() => {
        if (s.parentNode) {
          layer.removeChild(s);
          if (poolRef.current.length < MAX_SPARKLES) poolRef.current.push(s);
        }
      }, 700);
    };

    let raf = 0;
    let pending = null;
    const onMove = (e) => {
      if (reducedRef.current) return;
      const now = performance.now();
      if (now - lastTimeRef.current < MIN_INTERVAL_MS) return;
      lastTimeRef.current = now;

      const x = e.clientX ?? (e.touches?.[0]?.clientX || 0);
      const y = e.clientY ?? (e.touches?.[0]?.clientY || 0);
      pending = { x, y };
      if (!raf) {
        raf = requestAnimationFrame(() => {
          if (pending) makeSparkle(pending.x, pending.y);
          pending = null;
          raf = 0;
        });
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });

    return () => {
      mm?.removeEventListener?.("change", onChange);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={layerRef} className="app-sparkle-layer" aria-hidden="true" />;
}


export default function App() {
  return (
    <div className="app-shell">
      {/* (on all pages) */}
      <GlobalSparkles />

      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCV />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/:id" element={<TemplateDetails />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/interview" element={<InterviewTips />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
