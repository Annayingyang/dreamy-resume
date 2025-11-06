// src/templates/SlateColumns.jsx
import React from "react";

/**
 * SlateColumns — ultra-modern, three-column slate/glass resume (A4 794 x 1123)
 *
 * Props:
 *  - data: {
 *      fullName, role, summary,
 *      contacts?: string[],
 *      skills?: (string | { name: string, level?: 1|2|3|4|5 })[],
 *      experience?: { title, company, dates, location?, points: string[] }[],
 *      education?: { line: string }[],
 *      tags?: string[],
 *      avatarUrl?: string,   // legacy support
 *      photo?: string        // preferred: base64 or URL
 *    }
 *  - options?: {
 *      accent?: string,      // default "#60a5fa" (blue-400)
 *      accent2?: string,     // default "#22d3ee" (cyan-400)
 *      slate?: string        // default "#0b1220" background base
 *    }
 *  - Avatar?: optional headshot renderer injected by TemplatePreview
 */
export default function SlateColumns({ data = {}, options = {}, Avatar }) {
  const {
    fullName = "Your Name",
    role = "Your Role Title",
    summary,
    contacts = [],
    skills = [],
    experience = [],
    education = [],
    tags = [],
    avatarUrl,
    photo,
  } = data;

  const accent  = options.accent  || "#60a5fa"; // blue 400
  const accent2 = options.accent2 || "#22d3ee"; // cyan 400
  const slate   = options.slate   || "#0b1220"; // deep slate
  const subInk  = "#9fb0d1";
  const ink     = "#e5edf9";
  const R       = 16;

  const photoSrc = photo || avatarUrl;

  return (
    <div style={pageWrap({ slate, accent, accent2 })}>
      {/* ambient beams */}
      <div style={beam({ accent, accent2, side: "left" })} />
      <div style={beam({ accent, accent2, side: "right" })} />

      {/* HERO HEADER */}
      <header style={heroWrap({ accent, accent2 })}>
        {/* Photo bubble (left) */}
        {photoSrc ? (
          <div style={heroLeft}>
            {Avatar ? (
              <Avatar src={photoSrc} size={104} shape="rounded" alt={`${fullName} photo`} />
            ) : (
              <div style={photoFrame({ accent, accent2 })}>
                <img
                  src={photoSrc}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            )}
          </div>
        ) : <div style={heroLeft} />}

        {/* Name + tags (center) */}
        <div style={heroCenter}>
          <h1 style={h1({ ink })}>{fullName}</h1>
          <div style={roleLine({ subInk })}>{role}</div>

          {tags?.length > 0 && (
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tags.slice(0, 14).map((t, i) => (
                <Tag key={i} accent={accent} accent2={accent2}>{t}</Tag>
              ))}
            </div>
          )}
        </div>

        {/* Contacts (right) */}
        <div style={heroRight}>
          {contacts?.length > 0 && (
            <div style={{ textAlign: "right", color: ink, fontSize: 12, display: "grid", gap: 4 }}>
              {contacts.map((c, i) => (
                <div key={i} style={{ opacity: .9 }}>{c}</div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* GRID: three columns */}
      <div style={columnsWrap}>
        {/* COLUMN A: Profile + Quick facts */}
        <div style={colA}>
          {summary && (
            <GlassCard accent={accent} title="Profile">
              <p style={{ margin: 0, color: ink, lineHeight: 1.6 }}>{summary}</p>
            </GlassCard>
          )}

          {education?.length > 0 && (
            <GlassCard accent={accent} title="Education">
              <ul style={{ margin: "4px 0 0 18px", padding: 0, color: ink, lineHeight: 1.55 }}>
                {education.map((ed, i) => <li key={i} style={{ marginBottom: 6 }}>{ed.line}</li>)}
              </ul>
            </GlassCard>
          )}
        </div>

        {/* COLUMN B: Experience timeline (dominant middle) */}
        <div style={colB}>
          <RailHeader accent={accent} accent2={accent2} title="Experience" />
          <div style={timelineWrap}>
            <div style={rail({ accent, accent2 })} />
            <div style={{ display: "grid", gap: R }}>
              {experience?.length > 0 ? (
                experience.map((job, i) => (
                  <TimelineItem
                    key={i}
                    job={job}
                    accent={accent}
                    accent2={accent2}
                    first={i === 0}
                    last={i === experience.length - 1}
                  />
                ))
              ) : (
                <GlassCard accent={accent}>
                  <div style={{ color: subInk, fontSize: 13 }}>Add your roles and highlights.</div>
                </GlassCard>
              )}
            </div>
          </div>
        </div>

        {/* COLUMN C: Skills */}
        <div style={colC}>
          {skills?.length > 0 && (
            <GlassCard accent={accent} title="Skills">
              <div style={{ display: "grid", gap: 10 }}>
                {skills.map((s, i) => {
                  const name = typeof s === "string" ? s : s?.name;
                  const lvl  = typeof s === "string" ? undefined : clamp(s?.level, 1, 5);
                  return <SkillBar key={i} name={name} level={lvl} accent={accent} accent2={accent2} />;
                })}
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* FOOTER LINE */}
      <div style={footerBeam({ accent, accent2 })} />
    </div>
  );
}

/* ====================== Subcomponents ====================== */

function GlassCard({ title, children, accent }) {
  return (
    <section style={cardBox(accent)}>
      {title ? <CardTitle accent={accent}>{title}</CardTitle> : null}
      <div>{children}</div>
    </section>
  );
}

function CardTitle({ children, accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <span style={{
        width: 10, height: 10, borderRadius: 999,
        background: accent, boxShadow: `0 0 12px ${rgba(accent,.45)}`
      }}/>
      <h3 style={{
        margin: 0, fontSize: 12, letterSpacing: 1.2,
        textTransform: "uppercase", color: "#b9c7e6"
      }}>{children}</h3>
    </div>
  );
}

function SkillBar({ name, level, accent, accent2 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 13, color: "#e5edf9" }}>{name}</span>
      {typeof level === "number" ? (
        <div style={{
          width: 140, height: 8, borderRadius: 999,
          background: "rgba(255,255,255,.06)", position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", inset: 0, width: `${(level/5)*100}%`,
            background: `linear-gradient(90deg, ${accent}, ${accent2})`,
            boxShadow: `0 0 14px ${rgba(accent2,.45)}`
          }}/>
        </div>
      ) : null}
    </div>
  );
}

function TimelineItem({ job, accent, accent2, first, last }) {
  return (
    <div style={{ position: "relative", paddingLeft: 34 }}>
      {/* node */}
      <div style={{
        position: "absolute", left: 10, top: 10,
        width: 14, height: 14, borderRadius: 999,
        background: `radial-gradient(circle at 30% 30%, ${accent2}, ${accent})`,
        boxShadow: `0 0 16px ${rgba(accent2,.5)}`
      }}/>
      {/* card */}
      <div style={timelineCard({ accent, accent2, first })}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline" }}>
          <strong style={{ color: "#e6eeff" }}>{job.title}</strong>
          <span style={{ color: "#6b7896" }}>•</span>
          <span style={{ color: "#b0bedc" }}>{job.company}</span>
          {job.location && (
            <>
              <span style={{ color: "#6b7896" }}>•</span>
              <span style={{ color: accent2 }}>{job.location}</span>
            </>
          )}
        </div>
        <div style={{ fontSize: 12, color: "#8aa0c6", marginTop: 2 }}>{job.dates}</div>
        {Array.isArray(job.points) && job.points.length > 0 && (
          <ul style={{ margin: "8px 0 0 18px", padding: 0, color: "#dbe7ff", lineHeight: 1.55 }}>
            {job.points.map((p, i) => <li key={i} style={{ marginBottom: 6 }}>{p}</li>)}
          </ul>
        )}
      </div>
      {/* rail */}
      {!last && <div style={{ position: "absolute", left: 16, top: 24, bottom: -12, width: 2, background: railGrad({ accent, accent2 }) }}/>}
    </div>
  );
}

function RailHeader({ title, accent, accent2 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 10, alignItems: "center", marginBottom: 8 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 10,
        background: `conic-gradient(from 0deg, ${accent}, ${accent2}, ${accent})`,
        boxShadow: `0 0 18px ${rgba(accent2,.45)}`
      }}/>
      <h2 style={{ margin: 0, fontSize: 16, letterSpacing: .2, color: "#eaf1ff" }}>{title}</h2>
    </div>
  );
}

function Tag({ children, accent, accent2 }) {
  return (
    <span style={{
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 11,
      color: "#0e1423",
      background: `linear-gradient(180deg, rgba(255,255,255,.95), rgba(255,255,255,.8))`,
      border: `1px solid ${rgba(accent,.35)}`,
      boxShadow: `0 2px 10px ${rgba(accent2,.2)}, inset 0 0 0 1px rgba(255,255,255,.6)`
    }}>{children}</span>
  );
}

/* ====================== Styles & Helpers ====================== */

function pageWrap({ slate, accent, accent2 }) {
  return {
    width: 794,
    minHeight: 1123,
    boxSizing: "border-box",
    padding: 18,
    background: `
      radial-gradient(860px 340px at 110% -10%, ${rgba(accent2,.16)} 0%, transparent 60%),
      radial-gradient(700px 300px at -10% 20%, ${rgba(accent,.14)} 0%, transparent 65%),
      linear-gradient(180deg, #0a1426, ${slate})
    `,
    borderRadius: 20,
    boxShadow: "0 16px 40px rgba(2,6,23,.38)",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    color: "#e5edf9",
    position: "relative",
    overflow: "hidden"
  };
}

function beam({ accent, accent2, side }) {
  const base = side === "left"
    ? { left: -60, top: -40, rotate: "-8deg" }
    : { right: -60, top: -30, rotate: "8deg" };
  return {
    position: "absolute",
    width: 280,
    height: 160,
    ...base,
    background: `linear-gradient(90deg, ${rgba(accent2,.18)}, ${rgba(accent,.08)}, transparent)`,
    filter: "blur(12px)",
    pointerEvents: "none"
  };
}

function heroWrap({ accent, accent2 }) {
  return {
    position: "relative",
    borderRadius: 16,
    padding: 16,
    background: "linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03))",
    border: "1px solid rgba(148, 163, 184, .25)",
    boxShadow: "0 12px 28px rgba(3, 7, 18, .45), inset 0 0 0 1px rgba(255,255,255,.08)",
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: 16,
    overflow: "hidden",
    // neon diagonal
    backgroundImage: `
      linear-gradient(120deg, transparent 35%, ${rgba(accent2,.18)} 50%, transparent 65%)
    `,
    backgroundRepeat: "no-repeat"
  };
}

const heroLeft = { display: "grid", alignItems: "center", justifyItems: "start" };
const heroCenter = { minWidth: 0 };
const heroRight = { display: "grid", alignItems: "end", justifyItems: "end" };

function h1({ ink }) {
  return {
    margin: 0,
    fontSize: 34,
    letterSpacing: 0.4,
    color: ink,
    textShadow: "0 1px 0 rgba(0,0,0,.4), 0 12px 40px rgba(34, 211, 238, .25)"
  };
}
function roleLine({ subInk }) {
  return { marginTop: 4, color: subInk, fontSize: 15 };
}

function photoFrame({ accent, accent2 }) {
  return {
    width: 104, height: 104, borderRadius: 24, overflow: "hidden",
    background: "#0e1b33",
    border: `2px solid ${rgba(accent,.6)}`,
    boxShadow: `
      0 0 0 4px ${rgba(accent2,.12)},
      0 12px 26px ${rgba(accent,.22)},
      inset 0 0 0 1px rgba(255,255,255,.12)
    `
  };
}

const columnsWrap = {
  display: "grid",
  gridTemplateColumns: "240px 1fr 220px",
  gap: 16,
  alignItems: "start",
  marginTop: 16
};
const colA = { display: "grid", gap: 16 };
const colB = { display: "grid", gap: 12 };
const colC = { display: "grid", gap: 16 };

function cardBox(accent) {
  return {
    position: "relative",
    background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03))",
    borderRadius: 16,
    padding: 12,
    border: "1px solid rgba(148, 163, 184, .25)",
    boxShadow: "0 12px 26px rgba(2, 6, 23, .35), inset 0 0 0 1px rgba(255,255,255,.06)"
  };
}

const timelineWrap = { position: "relative", paddingLeft: 8 };

function rail({ accent, accent2 }) {
  return {
    position: "absolute",
    left: 16, top: -6, bottom: -6, width: 2,
    background: railGrad({ accent, accent2 })
  };
}
function railGrad({ accent, accent2 }) {
  return `linear-gradient(180deg, ${rgba(accent,.9)}, ${rgba(accent2,.5)}, ${rgba(accent,.2)})`;
}

function timelineCard({ accent, accent2, first }) {
  return {
    background: "rgba(7,12,24,.6)",
    border: `1px solid ${first ? rgba(accent,.5) : "rgba(148, 163, 184, .25)"}`,
    borderRadius: 16,
    padding: 12,
    boxShadow: "0 10px 26px rgba(2, 6, 23, .35), inset 0 0 0 1px rgba(255,255,255,.06)"
  };
}

function footerBeam({ accent, accent2 }) {
  return {
    marginTop: 16,
    height: 8,
    borderRadius: 999,
    background: `linear-gradient(90deg, ${accent}, ${accent2}, ${accent})`,
    boxShadow: `0 0 22px ${rgba(accent2,.35)}`
  };
}

/* ====================== Utils ====================== */

function clamp(v, min, max) {
  return typeof v === "number" ? Math.max(min, Math.min(max, v)) : undefined;
}
function rgba(hex, a = 1) {
  if (!hex) return `rgba(0,0,0,${a})`;
  if (hex.startsWith("rgba(") || hex.startsWith("rgb(")) {
    const parts = hex.replace(/[rgba()\s]/g, "").split(",");
    const r = +parts[0] || 0;
    const g = +parts[1] || 0;
    const b = +parts[2] || 0;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  const h = hex.replace("#", "");
  const HH = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(HH, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
