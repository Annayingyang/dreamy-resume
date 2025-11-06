import React from "react";

/**
 * NotionBlocks — lavender block aesthetic, A4 (794x1123)
 *
 * Props:
 *  - data: {
 *      fullName, role, summary,
 *      contacts?: string[],
 *      skills?: (string | { name: string, level?: 1|2|3|4|5 })[],
 *      experience?: { title, company, dates, location?, points: string[] }[],
 *      education?: { line: string }[],
 *      tags?: string[],
 *      avatarUrl?: string,  // legacy
 *      photo?: string       // NEW: base64/URL
 *    }
 *  - options?: { accent?: string }  // override accent color
 *  - Avatar?: optional headshot renderer injected by TemplatePreview
 */
export default function NotionBlocks({ data = {}, options = {}, Avatar }) {
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

  const accent = options.accent || "#a78bfa"; // lavender
  const sub = "#5b4e8f";
  const ink = "#1a103c";
  const R = 16;

  const photoSrc = photo || avatarUrl; // prefer new photo

  return (
    <div style={pageWrap(accent)}>
      {/* soft glow frame */}
      <div style={frameGlow(accent)} />

      {/* header */}
      <header style={headerBox(accent)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
          <div>
            <h1 style={h1}>{fullName}</h1>
            <div style={{ marginTop: 4, color: sub, fontSize: 15 }}>{role}</div>
            {tags?.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {tags.slice(0, 10).map((t, i) => (
                  <Badge key={i} accent={accent}>{t}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* Pretty profile picture (optional) */}
          {photoSrc ? (
            Avatar ? (
              <Avatar src={photoSrc} size={86} shape="rounded" alt={`${fullName} photo`} />
            ) : (
              <div style={avatarRing(accent)}>
                <img
                  alt=""
                  src={photoSrc}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            )
          ) : null}
        </div>
      </header>

      {/* body grid */}
      <div style={{ display: "grid", gridTemplateColumns: "270px 1fr", gap: R, marginTop: R, alignItems: "start" }}>
        {/* left column */}
        <aside style={{ display: "grid", gap: R }}>
          {contacts?.length > 0 && (
            <Card accent={accent} title="Contact">
              <div style={{ display: "grid", gap: 8, fontSize: 13, color: sub }}>
                {contacts.map((c, i) => (
                  <Row key={i} dotColor={accent}>{c}</Row>
                ))}
              </div>
            </Card>
          )}

          {skills?.length > 0 && (
            <Card accent={accent} title="Skills">
              <div style={{ display: "grid", gap: 10 }}>
                {skills.map((s, i) => {
                  const name = typeof s === "string" ? s : s?.name;
                  const lvl = typeof s === "string" ? undefined : clamp(s?.level, 1, 5);
                  return <Skill key={i} name={name} level={lvl} accent={accent} />;
                })}
              </div>
            </Card>
          )}

          {education?.length > 0 && (
            <Card accent={accent} title="Education">
              <ul style={{ margin: "0 0 0 18px", padding: 0, color: sub, lineHeight: 1.55 }}>
                {education.map((ed, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{ed.line}</li>
                ))}
              </ul>
            </Card>
          )}
        </aside>

        {/* right column */}
        <main style={{ display: "grid", gap: R }}>
          {summary && (
            <Card accent={accent} title="Profile" highlight>
              <p style={{ margin: 0, color: ink, lineHeight: 1.6 }}>{summary}</p>
            </Card>
          )}

          <RailHeader title="Experience" accent={accent} />

          <div style={timelineWrap}>
            <div style={rail(accent)} />
            <div style={{ display: "grid", gap: R }}>
              {experience?.length > 0 ? (
                experience.map((job, i) => (
                  <TimelineItem
                    key={i}
                    job={job}
                    accent={accent}
                    last={i === experience.length - 1}
                  />
                ))
              ) : (
                <Card accent={accent}>
                  <div style={{ color: sub, fontSize: 13 }}>Add your roles and highlights.</div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* footer flourish */}
      <div style={{ marginTop: R, height: 6, borderRadius: 999, background: footerGrad(accent) }} />
    </div>
  );
}

/* ============== subcomponents ============== */

function Badge({ children, accent }) {
  return (
    <span style={{
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 11,
      color: "#261447",
      background: "linear-gradient(180deg, rgba(255,255,255,.95), rgba(255,255,255,.8))",
      border: `1px solid ${rgba(accent, .35)}`,
      boxShadow: `0 2px 10px ${rgba(accent, .16)}, inset 0 0 0 1px rgba(255,255,255,.6)`
    }}>{children}</span>
  );
}

function Card({ title, children, accent, highlight = false }) {
  return (
    <section style={cardBox(accent, highlight)}>
      {title ? <CardTitle accent={accent}>{title}</CardTitle> : null}
      {children}
    </section>
  );
}

function CardTitle({ children, accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{
        width: 10, height: 10, borderRadius: 999,
        background: accent, boxShadow: `0 0 12px ${rgba(accent,.45)}`
      }}/>
      <h3 style={{ margin: 0, fontSize: 12, letterSpacing: 1.1, textTransform: "uppercase", color: "#6b63a8" }}>
        {children}
      </h3>
    </div>
  );
}

function Row({ children, dotColor }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 6, height: 6, borderRadius: 8, background: dotColor }} />
      <span>{children}</span>
    </div>
  );
}

function Skill({ name, level, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 13, color: "#2b1f62" }}>{name}</span>
      {typeof level === "number" ? (
        <div style={{ width: 120, height: 8, borderRadius: 999, background: "#ece9ff", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${(level / 5) * 100}%`,
            background: `linear-gradient(90deg, ${rgba(accent,.95)}, ${rgba(accent,.4)})`
          }}/>
        </div>
      ) : null}
    </div>
  );
}

function RailHeader({ title, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 8, alignItems: "center" }}>
      <div style={{ width: 24, height: 24, borderRadius: 8, background: accent, boxShadow: `0 0 16px ${rgba(accent,.45)}` }} />
      <h2 style={{ margin: 0, fontSize: 16, letterSpacing: .2, color: "#1a103c" }}>{title}</h2>
    </div>
  );
}

function TimelineItem({ job, accent, last }) {
  return (
    <div style={{ position: "relative", paddingLeft: 32 }}>
      <div style={{
        position: "absolute", left: 8, top: 10,
        width: 12, height: 12, borderRadius: 999,
        background: accent, boxShadow: `0 0 12px ${rgba(accent,.5)}`
      }}/>
      <div style={timelineCard(accent)}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline" }}>
          <strong style={{ color: "#1a103c" }}>{job.title}</strong>
          <span style={{ color: "#9da3c7" }}>•</span>
          <span style={{ color: "#4a4570" }}>{job.company}</span>
          {job.location && (<><span style={{ color: "#9da3c7" }}>•</span><span style={{ color: accent }}>{job.location}</span></>)}
        </div>
        <div style={{ fontSize: 12, color: "#746db1", marginTop: 2 }}>{job.dates}</div>
        {Array.isArray(job.points) && job.points.length > 0 && (
          <ul style={{ margin: "8px 0 0 18px", padding: 0, color: "#2b1f62", lineHeight: 1.55 }}>
            {job.points.map((p, i) => <li key={i} style={{ marginBottom: 6 }}>{p}</li>)}
          </ul>
        )}
      </div>
      {!last && <div style={{ position: "absolute", left: 13, top: 22 + 12, bottom: -12, width: 2, background: railGrad(accent) }}/>}
    </div>
  );
}

/* ============== styles ============== */

function pageWrap(accent) {
  return {
    width: 794,
    minHeight: 1123,
    boxSizing: "border-box",
    padding: 18,
    background: `
      radial-gradient(820px 320px at 105% -10%, ${rgba(accent,.22)} 0%, transparent 60%),
      radial-gradient(700px 300px at -10% 20%, rgba(240, 171, 252, .18) 0%, transparent 65%),
      linear-gradient(180deg, #f8f7ff, #ffffff)
    `,
    borderRadius: 20,
    boxShadow: "0 16px 40px rgba(18,16,56,.08)",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    color: "#1a103c",
    position: "relative",
    overflow: "hidden"
  };
}

function frameGlow(accent) {
  return {
    position: "absolute",
    inset: 10,
    borderRadius: 16,
    pointerEvents: "none",
    boxShadow: `0 0 0 2px rgba(233, 213, 255, 0.7), 0 0 60px ${rgba(accent,.35)} inset`
  };
}

function headerBox(accent) {
  return {
    borderRadius: 16,
    padding: 16,
    background: "linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.7))",
    border: "1px solid rgba(226,232,240,.95)",
    boxShadow: "0 12px 28px rgba(20,18,58,.06), inset 0 0 0 1px rgba(255,255,255,.6)"
  };
}

const h1 = { margin: 0, fontSize: 32, letterSpacing: 0.2, color: "#1a103c" };

function avatarRing(accent) {
  return {
    width: 86, height: 86, borderRadius: 20, overflow: "hidden",
    background: "#fff",
    border: `1px solid rgba(219, 234, 254, .9)`,
    boxShadow: `0 16px 30px ${rgba(accent,.18)}, inset 0 0 0 1px rgba(255,255,255,.6)`
  };
}

function cardBox(accent, highlight = false) {
  return {
    position: "relative",
    background: "linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,.86))",
    borderRadius: 16,
    padding: 12,
    border: "1px solid rgba(226,232,240,.95)",
    boxShadow: "0 12px 30px rgba(20,18,58,.06), inset 0 0 0 1px rgba(255,255,255,.6)",
    outline: highlight ? `2px solid ${rgba("#c4b5fd", .25)}` : "none"
  };
}

const timelineWrap = { position: "relative", paddingLeft: 6 };

function rail(accent) {
  return {
    position: "absolute",
    left: 16, top: -6, bottom: -6, width: 2,
    background: railGrad(accent)
  };
}
function railGrad(accent) {
  return `linear-gradient(180deg, ${rgba(accent,.75)}, ${rgba(accent,.15)})`;
}

function timelineCard(accent) {
  return {
    background: "#ffffff",
    border: `1px solid rgba(226,232,240,.95)`,
    borderRadius: 16,
    padding: 12,
    boxShadow: "0 10px 26px rgba(20,18,58,.06), inset 0 0 0 1px rgba(255,255,255,.6)"
  };
}

function footerGrad(accent) {
  return `linear-gradient(90deg, transparent, ${rgba(accent,1)}, transparent)`;
}

/* ============== utils ============== */

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
