// src/templates/PastelClassic.jsx
import React from "react";

/**
 * PastelClassic — soft pink classic (A4 794 x 1123)
 *
 * Props:
 *  - data: {
 *      fullName, role, summary,
 *      contacts?: string[],
 *      skills?: (string | { name: string })[],
 *      experience?: { title, company, dates, location?, points: string[] }[],
 *      avatarUrl?: string,  // legacy support
 *      photo?: string       // NEW: base64 or URL
 *    }
 *  - options?: { accent?: string } // default "#ec4899" (pink-500)
 *  - Avatar?: optional headshot renderer injected by TemplatePreview
 */
export default function PastelClassic({ data = {}, options = {}, Avatar }) {
  const {
    fullName = "Your Name",
    role = "Your Role Title",
    summary,
    contacts = [],
    skills = [],
    experience = [],
    avatarUrl,
    photo,
  } = data;

  const accent = options.accent || "#ec4899"; // pink
  const borderSoft = "#ffd7ea";
  const textMain = "#333";
  const textSub = "#666";

  const photoSrc = photo || avatarUrl;

  return (
    <div
      id="resume-root"
      style={{
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        width: "794px",           // A4 width at ~96dpi
        minHeight: "1123px",      // A4 height at ~96dpi
        background: "#fff",
        border: `1px solid ${borderSoft}`,
        padding: "28px 36px",
        boxSizing: "border-box",
        color: textMain,
      }}
    >
      {/* header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 16,
          alignItems: "end",
          borderBottom: `4px solid ${accent}`,
          paddingBottom: 12,
          marginBottom: 18,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 32 }}>{fullName}</h1>
          <div style={{ color: textSub }}>{role}</div>
        </div>

        {/* right stack: photo + contacts */}
        <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
          {/* Pretty profile picture (optional) */}
          {photoSrc ? (
            Avatar ? (
              <Avatar src={photoSrc} size={82} shape="rounded" alt={`${fullName} photo`} />
            ) : (
              <div
                style={{
                  width: 82,
                  height: 82,
                  borderRadius: 18,
                  overflow: "hidden",
                  background: "#fff",
                  border: `1px solid ${borderSoft}`,
                  boxShadow: `0 0 0 4px rgba(236,72,153,0.10), 0 8px 18px rgba(236,72,153,0.12)`,
                }}
              >
                <img
                  src={photoSrc}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            )
          ) : null}

          {contacts?.length > 0 && (
            <div style={{ textAlign: "right", color: "#444", fontSize: 12 }}>
              {contacts.map((c, i) => (
                <div key={i}>{c}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* summary */}
      {summary && (
        <section style={{ marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 6px", color: accent }}>Profile</h3>
          <p style={{ margin: 0, color: textMain }}>{summary}</p>
        </section>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* left column */}
        <section>
          <h3 style={{ margin: "0 0 6px", color: accent }}>Experience</h3>
          {experience?.length > 0 ? (
            experience.map((job, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline" }}>
                  <strong>{job.title}</strong>
                  <span style={{ color: "#aaa" }}>—</span>
                  <span>{job.company}</span>
                  {job.location && (
                    <>
                      <span style={{ color: "#aaa" }}>•</span>
                      <span style={{ color: accent }}>{job.location}</span>
                    </>
                  )}
                </div>
                <div style={{ fontSize: 12, color: textSub }}>{job.dates}</div>
                {Array.isArray(job.points) && job.points.length > 0 && (
                  <ul style={{ margin: "6px 0 0 16px" }}>
                    {job.points.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <div style={{ color: textSub, fontSize: 13 }}>Add your recent roles and achievements.</div>
          )}
        </section>

        {/* right column */}
        <section>
          <h3 style={{ margin: "0 0 6px", color: accent }}>Skills</h3>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {skills?.map((s, i) => {
              const label = typeof s === "string" ? s : s?.name;
              return <li key={i}>{label}</li>;
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
