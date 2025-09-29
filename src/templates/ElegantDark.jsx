import React from "react";

export default function ElegantDark({ data }) {
  const { fullName, role, summary, contacts = [], skills = [], experience = [], education = [] } = data;

  return (
    <div style={{
      fontFamily: "Georgia, serif",
      width: "794px", minHeight: "1123px",
      background: "#111827", color: "#f9fafb",
      padding: "36px 44px", boxSizing: "border-box"
    }}>
      <header style={{ borderBottom: "3px solid #6366f1", paddingBottom: 12, marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 36, color: "#a5b4fc" }}>{fullName}</h1>
        <div style={{ fontSize: 18, color: "#c7d2fe" }}>{role}</div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
          {contacts.map((c, i) => <div key={i}>{c}</div>)}
        </div>
      </header>

      {summary && (
        <section style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 6, color: "#c7d2fe" }}>Profile</h3>
          <p>{summary}</p>
        </section>
      )}

      <section style={{ marginBottom: 20 }}>
        <h3 style={{ color: "#c7d2fe" }}>Experience</h3>
        {experience.map((job, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <strong>{job.title}</strong>, {job.company}
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{job.dates}</div>
            <ul>{job.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
          </div>
        ))}
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3 style={{ color: "#c7d2fe" }}>Education</h3>
        {education.map((ed, i) => (
          <div key={i}>{ed.line}</div>
        ))}
      </section>

      <section>
        <h3 style={{ color: "#c7d2fe" }}>Skills</h3>
        <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
          {skills.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </section>
    </div>
  );
}
