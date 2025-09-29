import React from "react";

export default function MinimalMint({ data }) {
  const { fullName, role, summary, contacts = [], skills = [], experience = [], education = [] } = data;

  return (
    <div style={{
      fontFamily: "Helvetica, Arial, sans-serif",
      width: "794px", minHeight: "1123px",
      background: "#fff", border: "2px solid #10b981",
      padding: "36px 44px", boxSizing: "border-box"
    }}>
      <header style={{ borderBottom: "3px solid #10b981", paddingBottom: 12, marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 34, color: "#065f46" }}>{fullName}</h1>
        <div style={{ fontSize: 18, color: "#047857" }}>{role}</div>
        <div style={{ fontSize: 12, color: "#444", marginTop: 8 }}>
          {contacts.map((c, i) => <div key={i}>{c}</div>)}
        </div>
      </header>

      {summary && (
        <section style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 6, color: "#047857" }}>Profile</h3>
          <p>{summary}</p>
        </section>
      )}

      <section style={{ marginBottom: 20 }}>
        <h3 style={{ color: "#047857" }}>Experience</h3>
        {experience.map((job, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <strong>{job.title}</strong>, {job.company}
            <div style={{ fontSize: 12, color: "#555" }}>{job.dates}</div>
            <ul>{job.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
          </div>
        ))}
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3 style={{ color: "#047857" }}>Education</h3>
        {education.map((ed, i) => (
          <div key={i}>{ed.line}</div>
        ))}
      </section>

      <section>
        <h3 style={{ color: "#047857" }}>Skills</h3>
        <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
          {skills.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </section>
    </div>
  );
}
