// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../style/Home.css";

export default function Home() {
  return (
    <div className="home">

      {/* === HERO === */}
      <section className="hero card">
        <div className="hero-left">
          <p className="eyebrow">Fast. Easy. Effective.</p>
          <h1>
            Dreamy. <span className="accent">The Best CV Maker Online.</span>
          </h1>
          <p className="lead">
            Whether you want to build a new CV from scratch or improve an
            existing one, let Dreamy help you present your work life, personality,
            and skills on a CV that stands out.
          </p>

          <div className="cta-row">
            <Link className="btn btn-primary" to="/create">Create new CV</Link>

            <Link className="btn btn-outline" to="/account">
              Improve my CV
            </Link>
          </div>

          {/* “As seen in” logos */}
          <div className="as-seen">
            <img src="/assets/home/brands.png" alt="As seen in logos" />
          </div>
        </div>

        {/* right side preview image */}
        <div className="hero-right">
          
            <img src={process.env.PUBLIC_URL + "/assets/home/hero-cv.png"} alt="CV preview" className="hero-cv" />

          
          {/* optional background shapes */}
          <img
            src="/assets/home/hero-shapes.png"
            alt=""
            aria-hidden
            className="hero-shapes"
          />
        </div>
      </section>

      {/* === FEATURE STRIP === */}
      <section className="feature card">
        <div className="feature-illus">
          <img
            src="/home/feature-illus.png"
            alt="Editor suggestions"
          />
        </div>
        <div className="feature-listbox">
          <ol className="feature-list">
            <li>
              <span className="num">1</span>{" "}
              <strong>Enhance your CV with our expert content</strong>
              <p>
                Choose from thousands of top-rated phrases for your CV. Click to
                insert them directly.
              </p>
            </li>
            <li>
              <span className="num">2</span> CV and cover letter in one place
            </li>
            <li>
              <span className="num">3</span> Professionally designed templates
            </li>
            <li>
              <span className="num">4</span> Expert tips &amp; guidance
            </li>
            <li>
              <span className="num">5</span> Apply for jobs with confidence
            </li>
          </ol>

          <div className="cta-row">
            <Link className="btn btn-primary" to="/create">Create new CV</Link>

            <Link className="btn btn-outline" to="/account">
              Improve my CV
            </Link>
          </div>
        </div>
      </section>

     

      {/* === THREE STEPS === */}
      <section className="steps">
        <div className="step card">
          <img
            src="/home/step1.png"
            alt="Choose a template"
            className="step-img"
          />
          <h3>Pick a CV template.</h3>
          <p>Choose a sleek design and layout to get started.</p>
        </div>
        <div className="step card">
          <img
            src="/home/step2.png"
            alt="Fill in the blanks"
            className="step-img"
          />
          <h3>Fill in the blanks.</h3>
          <p>Type in a few words. Let our wizard fill the rest.</p>
        </div>
        <div className="step card">
          <img
            src="/home/step3.png"
            alt="Customize your document"
            className="step-img"
          />
          <h3>Customize your document.</h3>
          <p>Make it truly yours. Uniqueness in a few clicks.</p>
        </div>
      </section>

      {/* === BOTTOM CTAs === */}
      <div className="center bottom-ctas">
        <Link className="btn btn-primary" to="/create">Create new CV</Link>

        <Link className="btn btn-outline" to="/account">
          Improve my CV
        </Link>
      </div>
    </div>
  );
}
