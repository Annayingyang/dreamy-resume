import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>© {new Date().getFullYear()} Works Limited. All Rights Reserved.</p>
        <nav className="footer-nav">
          <Link to="/faqs">Contact</Link>
          <Link to="/faqs">Privacy Policy</Link>
          <Link to="/faqs">Terms of Service</Link>
          <a href="tel:+000000000">Call us: 000-000-000</a>
        </nav>
      </div>
    </footer>
  );
}
