import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Header() {
  const { user } = useApp();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <img src="/assets/home/brands.png" alt="Dreamy logo" className="brand-logo" />
          <span className="brand-name">Dreamy Resume</span>
        </Link>

        <nav className="nav">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/create" className="nav-link">Create CV</NavLink>
          <NavLink to="/templates" className="nav-link">Templates</NavLink>
          <NavLink to="/interview" className="nav-link">Interview Tips</NavLink>
          <NavLink to="/faqs" className="nav-link">FAQs</NavLink>
          <NavLink to="/account" className="nav-link account">My Account</NavLink>
        </nav>

        <div className="greet">Hi, {user?.name ?? "Guest"}</div>
      </div>
    </header>
  );
}
