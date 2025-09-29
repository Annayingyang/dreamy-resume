// src/templates/PastelClassic.jsx
import React from "react";

export default function PastelClassic({ data }) {
  const { fullName, role, summary, contacts = [], skills = [], experience = [] } = data;

  return (
    <div id="resume-root" style={{
      fontFamily: "Inter, Arial, sans-serif",
      width: "794px",           // A4 width at 96dpi
      minHeight: "1123px",      // A4 height at 96dpi
      background: "#fff",
      border: "1px solid #ffd7ea",
      padding: "28px 36px",
      boxSizing: "border-box"
    }}>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                    borderBottom: "4px solid #F9A8D4", paddingBottom: 12, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32 }}>{fullName}</h1>
          <div style={{ color: "#666" }}>{role}</div>
        </div>
        <div style={{ textAlign: "right", color: "#444", fontSize: 12 }}>
          {contacts.map((c, i) => <div key={i}>{c}</div>)}
        </div>
      </div>

      {/* summary */}
      {summary && (
        <section style={{ marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 6px", color: "#ec4899" }}>Profile</h3>
          <p style={{ margin: 0, color: "#333" }}>{summary}</p>
        </section>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* left column */}
        <section>
          <h3 style={{ margin: "0 0 6px", color: "#ec4899" }}>Experience</h3>
          {experience.map((job, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <strong>{job.title}</strong> — {job.company}
              <div style={{ fontSize: 12, color: "#666" }}>{job.dates}</div>
              <ul style={{ margin: "6px 0 0 16px" }}>
                {job.points.map((p, j) => <li key={j}>{p}</li>)}
              </ul>
            </div>
          ))}
        </section>

        {/* right column */}
        <section>
          <h3 style={{ margin: "0 0 6px", color: "#ec4899" }}>Skills</h3>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {skills.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}
