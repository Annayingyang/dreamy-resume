import React, { useMemo, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../style/Header.css";

const LS_PREFS = "dreamy.cvPrefs.v1";

export default function Header() {
  const { user } = useApp();
  const [open, setOpen] = useState(false);


  const prefs = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_PREFS) || "null") || {};
    } catch {
      return {};
    }
  }, []);

  const displayName = (user?.name || prefs?.name || "").trim();
  const isIncomplete = !displayName; 

  const linkClass = ({ isActive }) =>
    "nav-link" + (isActive ? " active" : "");

  return (
    <header className={"site-header" + (open ? " is-open" : "")}>
      <div className="header-inner">
        {/* Logo */}
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">✨</span>
          <span className="brand-name">Dreamy Resume</span>
        </Link>

        {/* Burger */}
        <button
          className={"burger" + (open ? " x" : "")}
          aria-label="Toggle navigation"
          aria-expanded={open ? "true" : "false"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Nav */}
        <nav className="nav">
          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/create" className={linkClass} onClick={() => setOpen(false)}>
            Create
          </NavLink>
          <NavLink to="/templates" className={linkClass} onClick={() => setOpen(false)}>
            Templates
          </NavLink>
          <NavLink to="/interview" className={linkClass} onClick={() => setOpen(false)}>
            Interview
          </NavLink>
          <NavLink to="/faqs" className={linkClass} onClick={() => setOpen(false)}>
            FAQs
          </NavLink>
        </nav>

        {/* Right bits */}
        <div className="account-zone">
          {user?.email ? (
            <>
              <span className="hello">
                <span
                  className={"avatar" + (isIncomplete ? " needs-attention" : "")}
                  aria-hidden="true"
                >
                  {displayName ? displayName[0]?.toUpperCase() : "?"}
                </span>
                <span className="hello-text">
                  Hi{displayName ? `, ${displayName}` : " there"}
                </span>
              </span>
              <NavLink
                to="/account#me"
                className="btn-pill"
                onClick={() => setOpen(false)}
              >
                My Account
              </NavLink>
            </>
          ) : (
            <NavLink
              to="/account"
              className="btn-pill"
              onClick={() => setOpen(false)}
            >
              Login
            </NavLink>
          )}
        </div>
      </div>

      {/* cute gradient bar */}
      <div className="halo" aria-hidden="true" />
    </header>
  );
}
