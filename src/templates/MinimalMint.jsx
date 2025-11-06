import React from "react";

/**
 * MinimalMint — crisp white + mint A4 (794 x 1123)
 *
 * Props:
 *  - data: {
 *      fullName, role, summary,
 *      contacts?: string[],
 *      skills?: (string | { name: string })[],
 *      experience?: { title, company, dates, location?, points: string[] }[],
 *      education?: { line: string }[],
 *      avatarUrl?: string,  // legacy support
 *      photo?: string       // NEW: base64/URL
 *    }
 *  - options?: { accent?: string } // default "#10b981" (emerald/mint)
 *  - Avatar?: optional renderer injected by TemplatePreview
 */
export default function MinimalMint({ data = {}, options = {}, Avatar }) {
  const {
    fullName = "Your Name",
    role = "Your Role Title",
    summary,
    contacts = [],
    skills = [],
    experience = [],
    education = [],
    avatarUrl,
    photo,
  } = data;

  const accent = options.accent || "#10b981"; // mint/emerald
  const dark = "#065f46";
  const mid = "#047857";
  const textSub = "#444";

  const photoSrc = photo || avatarUrl;

  return (
    <div style={{
      fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      width: "794px", minHeight: "1123px",
      background: "#ffffff",
      border: `2px solid ${accent}`,
      padding: "36px 44px",
      boxSizing: "border-box"
    }}>
      {/* Header: name/role/contact + optional photo */}
      <header style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 16,
        borderBottom: `3px solid ${accent}`,
        paddingBottom: 12,
        marginBottom: 20
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 34, color: dark }}>{fullName}</h1>
          <div style={{ fontSize: 18, color: mid }}>{role}</div>
          {contacts?.length > 0 && (
            <div style={{ fontSize: 12, color: textSub, marginTop: 8, display: "grid", gap: 2 }}>
              {contacts.map((c, i) => <div key={i}>{c}</div>)}
            </div>
          )}
        </div>

        {/* Pretty profile picture (optional) */}
        {photoSrc ? (
          Avatar ? (
            <Avatar src={photoSrc} size={84} shape="circle" alt={`${fullName} photo`} />
          ) : (
            <div style={{
              width: 84, height: 84,
              borderRadius: 999, overflow: "hidden",
              background: "#fff",
              border: `2px solid ${accent}`,
              boxShadow: `0 0 0 4px rgba(16,185,129,0.12)`
            }}>
              <img
                src={photoSrc}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          )
        ) : null}
      </header>

      {summary && (
        <section style={{ marginBottom: 20 }}>
          <h3 style={{ margin: 0, marginBottom: 6, color: mid, fontSize: 14, letterSpacing: .3, textTransform: "uppercase" }}>
            Profile
          </h3>
          <p style={{ margin: 0, color: "#111827", lineHeight: 1.55 }}>{summary}</p>
        </section>
      )}

      <section style={{ marginBottom: 20 }}>
        <h3 style={{ margin: 0, marginBottom: 6, color: mid, fontSize: 14, letterSpacing: .3, textTransform: "uppercase" }}>
          Experience
        </h3>
        {experience?.length > 0 ? experience.map((job, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline" }}>
              <strong style={{ color: "#111827" }}>{job.title}</strong>
              <span style={{ color: "#6b7280" }}>•</span>
              <span style={{ color: "#374151" }}>{job.company}</span>
              {job.location && (<><span style={{ color: "#6b7280" }}>•</span><span style={{ color: mid }}>{job.location}</span></>)}
            </div>
            <div style={{ fontSize: 12, color: "#555" }}>{job.dates}</div>
            {Array.isArray(job.points) && job.points.length > 0 && (
              <ul style={{ margin: "6px 0 0 18px", color: "#111827", lineHeight: 1.5 }}>
                {job.points.map((p, j) => <li key={j} style={{ marginBottom: 4 }}>{p}</li>)}
              </ul>
            )}
          </div>
        )) : <div style={{ color: "#6b7280", fontSize: 13 }}>Add your recent roles and achievements.</div>}
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3 style={{ margin: 0, marginBottom: 6, color: mid, fontSize: 14, letterSpacing: .3, textTransform: "uppercase" }}>
          Education
        </h3>
        {education?.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 18, color: "#111827", lineHeight: 1.5 }}>
            {education.map((ed, i) => <li key={i} style={{ marginBottom: 6 }}>{ed.line}</li>)}
          </ul>
        ) : <div style={{ color: "#6b7280", fontSize: 13 }}>Add your education.</div>}
      </section>

      <section>
        <h3 style={{ margin: 0, marginBottom: 6, color: mid, fontSize: 14, letterSpacing: .3, textTransform: "uppercase" }}>
          Skills
        </h3>
        <ul style={{
          margin: 0, paddingLeft: 18,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, color: "#111827"
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
