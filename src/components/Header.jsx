// src/components/Header.jsx
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../style/Header.css"; // ⬅️ add this

export default function Header() {
  const { currentUser } = useApp();

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""}`;

  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <Link to="/" className="brand">
          <img
            src={`${process.env.PUBLIC_URL}/assets/logo-dreamy.png`}
            alt="Dreamy logo"
            className="brand-logo"
          />
          <span className="brand-name">Dreamy Resume</span>
        </Link>

        <nav className="nav" aria-label="Main navigation">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/create" className={linkClass}>Create CV</NavLink>
          <NavLink to="/templates" className={linkClass}>Templates</NavLink>
          <NavLink to="/interview" className={linkClass}>Interview Tips</NavLink>
          <NavLink to="/faqs" className={linkClass}>FAQs</NavLink>
          {currentUser ? (
            <NavLink to="/account" className={linkClass}>My Account</NavLink>
          ) : (
            <NavLink to="/auth" className={linkClass}>Login</NavLink>
          )}
        </nav>

        <div className="header-right" aria-live="polite">
          {currentUser ? `Hi, ${currentUser.name}` : "Hi, Guest"}
        </div>
      </div>
    </header>
  );
}
