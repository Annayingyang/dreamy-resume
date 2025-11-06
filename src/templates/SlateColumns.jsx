import React from "react";

export default function SerifCream({ data }) {
  const { fullName, role, summary, contacts = [], skills = [], experience = [] } = data;

  return (
    <div id="resume-root" style={{
      fontFamily: "Georgia, 'Times New Roman', serif",
      width: "794px",
      minHeight: "1123px",
      background: "#fffdf7",            // cream
      border: "1px solid #f3e7d3",
      padding: "28px 36px",
      boxSizing: "border-box",
      color: "#2b2b2b"
    }}>
      {/* header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        borderBottom: "4px solid #c08b5c", paddingBottom: 12, marginBottom: 18
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 34 }}>{fullName}</h1>
          <div style={{ color: "#8c5b33", fontWeight: 600 }}>{role}</div>
        </div>
        <div style={{ textAlign: "right", color: "#5c5c5c", fontSize: 12 }}>
          {contacts.map((c, i) => <div key={i}>{c}</div>)}
        </div>
      </div>

      {/* summary */}
      {summary && (
        <section style={{ marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 6px", color: "#c08b5c" }}>Profile</h3>
          <p style={{ margin: 0 }}>{summary}</p>
        </section>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* left */}
        <section>
          <h3 style={{ margin: "0 0 6px", color: "#c08b5c" }}>Experience</h3>
          {experience.map((job, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <strong>{job.title}</strong> — {job.company}
              <div style={{ fontSize: 12, color: "#6b6b6b" }}>{job.dates}</div>
              <ul style={{ margin: "6px 0 0 16px" }}>
                {job.points.map((p, j) => <li key={j}>{p}</li>)}
              </ul>
            </div>
          ))}
        </section>

        {/* right */}
        <section>
          <h3 style={{ margin: "0 0 6px", color: "#c08b5c" }}>Skills</h3>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {skills.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}
