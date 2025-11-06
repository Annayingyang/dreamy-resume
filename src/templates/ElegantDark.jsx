import React from "react";

/**
 * ElegantDark — indigo-on-slate A4 (794 x 1123)
 *
 * Props:
 *  - data: {
 *      fullName, role, summary,
 *      contacts?: string[],
 *      skills?: (string | { name: string })[],
 *      experience?: { title, company, dates, location?, points: string[] }[],
 *      education?: { line: string }[],
 *      avatarUrl?: string,  // legacy support
 *      photo?: string       // NEW: base64 or URL
 *    }
 *  - options?: {
 *      accent?: string      // default "#6366f1" (indigo-500/600)
 *    }
 *  - Avatar?: optional renderer injected by TemplatePreview
 */
export default function ElegantDark({ data = {}, options = {}, Avatar }) {
  const {
    fullName = "Your Name",
    role = "Your Role Title",
    summary,
    contacts = [],
    skills = [],
    experience = [],
    education = [],
    avatarUrl, // legacy
    photo,     // preferred
  } = data;

  const accent = options.accent || "#6366f1";        // indigo
  const accentGlow = "rgba(99,102,241,0.35)";
  const photoSrc = photo || avatarUrl;

  return (
    <div style={{
      fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Georgia, serif",
      width: "794px", minHeight: "1123px",
      background: "#0f172a", // slate-900
      color: "#f8fafc",
      padding: "36px 44px",
      boxSizing: "border-box",
      boxShadow: "inset 0 0 0 1px rgba(148,163,184,0.18)"
    }}>
      {/* Header: name/role/contacts + optional photo */}
      <header style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 16,
        borderBottom: `3px solid ${accent}`,
        paddingBottom: 14,
        marginBottom: 22
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: 36,
            lineHeight: 1.1,
            color: "#c7d2fe",
            textShadow: `0 0 18px ${accentGlow}`
          }}>{fullName}</h1>
          <div style={{ fontSize: 18, color: "#a5b4fc", marginTop: 4 }}>{role}</div>

          {contacts?.length > 0 && (
            <div style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 10, display: "grid", gap: 2 }}>
              {contacts.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: 999, background: accent,
                    boxShadow: `0 0 8px ${accentGlow}`
                  }} />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pretty profile picture (optional) */}
        {photoSrc ? (
          Avatar ? (
            <Avatar src={photoSrc} size={92} shape="circle" alt={`${fullName} photo`} />
          ) : (
            <div
              style={{
                width: 92, height: 92,
                borderRadius: 999,
                overflow: "hidden",
                background: "#0b1220",
                border: `2px solid ${accent}`,
                boxShadow: `0 0 0 3px rgba(99,102,241,0.15), 0 0 26px ${accentGlow}`
              }}
            >
              <img
                src={photoSrc}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          )
        ) : null}
      </header>

      {/* Profile */}
      {summary && (
        <section style={{ marginBottom: 22 }}>
          <h3 style={{
            margin: "0 0 8px 0",
            color: "#c7d2fe",
            fontSize: 14,
            letterSpacing: 0.6,
            textTransform: "uppercase"
          }}>Profile</h3>
          <p style={{ margin: 0, color: "#e2e8f0", lineHeight: 1.55 }}>{summary}</p>
        </section>
      )}

      {/* Experience */}
      <section style={{ marginBottom: 22 }}>
        <h3 style={{
          margin: "0 0 8px 0",
          color: "#c7d2fe",
          fontSize: 14,
          letterSpacing: 0.6,
          textTransform: "uppercase"
        }}>Experience</h3>
        {experience?.length > 0 ? experience.map((job, i) => (
          <div key={i} style={{
            marginBottom: 14,
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(2,6,23,0.45)",
            border: "1px solid rgba(99,102,241,0.18)",
            boxShadow: "0 8px 18px rgba(0,0,0,0.25)"
          }}>
            <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
              <strong style={{ color: "#f1f5f9" }}>{job.title}</strong>
              <span style={{ color: "#64748b" }}>•</span>
              <span style={{ color: "#cbd5e1" }}>{job.company}</span>
              {job.location && (<><span style={{ color: "#64748b" }}>•</span><span style={{ color: "#93c5fd" }}>{job.location}</span></>)}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{job.dates}</div>
            {Array.isArray(job.points) && job.points.length > 0 && (
              <ul style={{ margin: "8px 0 0 18px", color: "#e2e8f0", lineHeight: 1.5 }}>
                {job.points.map((p, j) => <li key={j} style={{ marginBottom: 4 }}>{p}</li>)}
              </ul>
            )}
          </div>
        )) : <div style={{ color: "#94a3b8", fontSize: 13 }}>Add your recent roles and achievements.</div>}
      </section>

      {/* Education */}
      <section style={{ marginBottom: 22 }}>
        <h3 style={{
          margin: "0 0 8px 0",
          color: "#c7d2fe",
          fontSize: 14,
          letterSpacing: 0.6,
          textTransform: "uppercase"
        }}>Education</h3>
        {education?.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 18, color: "#e2e8f0", lineHeight: 1.5 }}>
            {education.map((ed, i) => <li key={i} style={{ marginBottom: 6 }}>{ed.line}</li>)}
          </ul>
        ) : <div style={{ color: "#94a3b8", fontSize: 13 }}>Add your education.</div>}
      </section>

      {/* Skills */}
      <section>
        <h3 style={{
          margin: "0 0 8px 0",
          color: "#c7d2fe",
          fontSize: 14,
          letterSpacing: 0.6,
          textTransform: "uppercase"
        }}>Skills</h3>
        <ul style={{
          margin: 0, paddingLeft: 18,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, color: "#e2e8f0"
        }}>
          {skills?.map((s, i) => {
            const label = typeof s === "string" ? s : s?.name;
            return <li key={i}>{label}</li>;
          })}
        </ul>
      </section>
    </div>
  );
}
