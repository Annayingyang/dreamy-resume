import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/footer.css";

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const [open, setOpen] = useState(null);
  const dialogRef = useRef(null);

  
  useEffect(() => {
    const onKey = (e) => (e.key === "Escape" ? setOpen(null) : null);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const openModal = (which) => setOpen(which);
  const closeModal = () => setOpen(null);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="brand-col">
          <div className="logo-mark" aria-hidden="true">✨</div>
          <h3 className="brand-name">Dreamy Resume</h3>
          <p className="tagline">Crafted with calm & creativity </p>
        </div>

        {/* simple navigation buttons */}
        <nav className="footer-links">
          <button onClick={() => navigate("/faqs")}>FAQs</button>
          <button onClick={() => navigate("/interview")}>Interview Tips</button>
          <button onClick={() => navigate("/templates")}>Templates</button>
          <button onClick={() => navigate("/account")}>Account</button>
        </nav>

        <div className="contact-col">
          <a href="tel:+000000000" className="contact-item">📞 +27 83 424 9269</a>
          <a href="mailto:hello@dreamyresume.com" className="contact-item">📧 hello@dreamyresume.com</a>
        </div>
      </div>

      <div className="footer-bar">
        <p>© {year} Dreamy Works Limited — All Rights Reserved.</p>
        <div className="policy-links">
          <button type="button" className="policy-link" onClick={() => openModal("privacy")}>
            Privacy Policy
          </button>
          <button type="button" className="policy-link" onClick={() => openModal("terms")}>
            Terms of Service
          </button>
        </div>
      </div>

      <div className="footer-halo" aria-hidden="true" />

      {/* Modal */}
      {open && (
        <div className="policy-overlay" onClick={closeModal} role="presentation">
          <section
            className="policy-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            ref={dialogRef}
          >
            <header className="policy-head">
              <h3 id="policy-title">
                {open === "privacy" ? "Privacy Policy" : "Terms of Service"}
              </h3>
              <button className="policy-close" onClick={closeModal} aria-label="Close">✕</button>
            </header>

            <div className="policy-content">
              {open === "privacy" ? (
                <>
                  <p><strong>What we store</strong>: your profile (name, email), template choices, and drafts in your browser’s localStorage — nothing is sent to a server.</p>
                  <p><strong>Why</strong>: to remember your preferences, show recommendations, and restore your in-progress CV drafts.</p>
                  <p><strong>Control</strong>: you can clear your account in Account → Log out, and remove drafts individually. You can also clear browser storage anytime.</p>
                  <p><strong>Cookies</strong>: we don’t use tracking cookies. Local-only storage powers your experience.</p>
                  <p><strong>Contact</strong>: hello@dreamyresume.com</p>
                  <p className="tiny muted">Last updated: {year}-11-05</p>
                </>
              ) : (
                <>
                  <p><strong>Use of the tool</strong>: Dreamy Resume is provided “as-is” for personal CV creation. You own your content.</p>
                  <p><strong>No warranties</strong>: we don’t guarantee job outcomes or uninterrupted access.</p>
                  <p><strong>Local data</strong>: your data lives in your browser; clearing storage removes it.</p>
                  <p><strong>Templates & assets</strong>: for personal use unless otherwise agreed in writing.</p>
                  <p><strong>Changes</strong>: we may update these terms and will reflect the effective date below.</p>
                  <p className="tiny muted">Effective date: {year}-10-08</p>
                </>
              )}
            </div>

            <footer className="policy-foot">
              <button className="btn btn-primary" onClick={closeModal}>Okay</button>
            </footer>
          </section>
        </div>
      )}
    </footer>
  );
}
