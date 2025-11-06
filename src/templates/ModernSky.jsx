import React from "react";

/**
 * ModernSky — light sky aesthetic (A4 794 x 1123)
 *
 * Props:
 *  - data: {
 *      fullName, role, summary,
 *      contacts?: string[],
 *      skills?: (string | { name: string })[],
 *      experience?: { title, company, dates, location?, points: string[] }[],
 *      avatarUrl?: string,  // legacy
 *      photo?: string       // preferred (base64 or URL)
 *    }
 *  - options?: { accent?: string } // default "#38bdf8" (sky-400)
 *  - Avatar?: optional headshot renderer injected by TemplatePreview
 */
export default function ModernSky({ data = {}, options = {}, Avatar }) {
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

  const accent = options.accent || "#38bdf8";      // sky
  const deep = "#2563eb";                           // blue
  const textSub = "#334155";                        // slate-600
  const photoSrc = photo || avatarUrl;

  return (
    <div id="resume-root" style={{
      fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      width: "794px",
      minHeight: "1123px",
      background: "#f0f9ff",
      border: "1px solid #bae6fd",
      padding: "28px 36px",
      boxSizing: "border-box",
      color: "#0f172a"
    }}>
      {/* header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "end",
        gap: 16,
        borderBottom: `4px solid ${accent}`,
        paddingBottom: 12,
        marginBottom: 18
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32 }}>{fullName}</h1>
          <div style={{ color: deep, fontWeight: 600 }}>{role}</div>
        </div>

        {/* right stack: photo + contacts */}
        <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
          {/* Pretty profile picture (optional) */}
          {photoSrc ? (
            Avatar ? (
              <Avatar src={photoSrc} size={84} shape="circle" alt={`${fullName} photo`} />
            ) : (
              <div style={{
                width: 84, height: 84,
                borderRadius: 999, overflow: "hidden",
                background: "#e0f2fe",
                border: `2px solid ${accent}`,
                boxShadow: `0 0 0 4px rgba(56,189,248,0.18), 0 10px 22px rgba(2,132,199,0.18)`
              }}>
                <img
                  src={photoSrc}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            )
          ) : null}

          {contacts?.length > 0 && (
            <div style={{ textAlign: "right", color: "#0f172a", fontSize: 12 }}>
              {contacts.map((c, i) => <div key={i}>{c}</div>)}
            </div>
          )}
        </div>
      </div>

      {/* summary */}
      {summary && (
        <section style={{ marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 6px", color: deep }}>Summary</h3>
          <p style={{ margin: 0 }}>{summary}</p>
        </section>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* left */}
        <section>
          <h3 style={{ margin: "0 0 6px", color: deep }}>Experience</h3>
          {experience?.length > 0 ? experience.map((job, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <strong>{job.title}</strong> — {job.company}
              <div style={{ fontSize: 12, color: textSub }}>{job.dates}</div>
              {Array.isArray(job.points) && job.points.length > 0 && (
                <ul style={{ margin: "6px 0 0 16px" }}>
                  {job.points.map((p, j) => <li key={j}>{p}</li>)}
                </ul>
              )}
            </div>
          )) : <div style={{ fontSize: 13, color: textSub }}>Add your recent roles and achievements.</div>}
        </section>

        {/* right */}
        <section>
          <h3 style={{ margin: "0 0 6px", color: deep }}>Skills</h3>
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
