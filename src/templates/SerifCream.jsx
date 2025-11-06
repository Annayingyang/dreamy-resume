import React from "react";

/**
 * SerifCream — warm editorial cream (A4 794 x 1123)
 *
 * Props:
 *  - data: {
 *      fullName, role, summary,
 *      contacts?: string[],
 *      skills?: (string | { name: string })[],
 *      experience?: { title, company, dates, location?, points: string[] }[],
 *      avatarUrl?: string,  // legacy support
 *      photo?: string       // NEW: base64/URL
 *    }
 *  - options?: { accent?: string } // default "#c08b5c"
 *  - Avatar?: optional headshot renderer injected by TemplatePreview
 */
export default function SerifCream({ data = {}, options = {}, Avatar }) {
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

  const accent = options.accent || "#c08b5c";
  const borderSoft = "#f3e7d3";
  const cream = "#fffdf7";
  const textMain = "#2b2b2b";
  const textSub = "#5c5c5c";

  const photoSrc = photo || avatarUrl;

  return (
    <div
      id="resume-root"
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        width: "794px",
        minHeight: "1123px",
        background: cream,
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
          <h1 style={{ margin: 0, fontSize: 34 }}>{fullName}</h1>
          <div style={{ color: "#8c5b33", fontWeight: 600 }}>{role}</div>
        </div>

        {/* right stack: photo + contacts */}
        <div style={{ display: "grid", gap: 10, justifyItems: "end" }}>
          {/* Pretty profile picture (optional) */}
          {photoSrc ? (
            Avatar ? (
              <Avatar src={photoSrc} size={86} shape="rounded" alt={`${fullName} photo`} />
            ) : (
              <div
                style={{
                  width: 86,
                  height: 86,
                  borderRadius: 18,
                  overflow: "hidden",
                  background: "#fff",
                  border: `1px solid ${borderSoft}`,
                  boxShadow: `0 0 0 4px rgba(192,139,92,0.10), 0 10px 22px rgba(192,139,92,0.16)`,
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

          {contacts?.length > 0 && (
            <div style={{ textAlign: "right", color: textSub, fontSize: 12 }}>
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
          <p style={{ margin: 0 }}>{summary}</p>
        </section>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* left */}
        <section>
          <h3 style={{ margin: "0 0 6px", color: accent }}>Experience</h3>
          {experience?.length > 0 ? (
            experience.map((job, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline" }}>
                  <strong>{job.title}</strong>
                  <span style={{ color: "#9b8a7c" }}>—</span>
                  <span>{job.company}</span>
                  {job.location && (
                    <>
                      <span style={{ color: "#9b8a7c" }}>•</span>
                      <span style={{ color: accent }}>{job.location}</span>
                    </>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#6b6b6b" }}>{job.dates}</div>
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
            <div style={{ color: "#6b6b6b", fontSize: 13 }}>Add your recent roles and achievements.</div>
          )}
        </section>

        {/* right */}
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
