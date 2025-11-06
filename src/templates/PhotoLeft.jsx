import React from "react";

/**
 * NeonRiot — riot of color (A4 794x1123)
 * Now with photo-left layout and Avatar injection support.
 *
 * data = {
 *   fullName, role, summary,
 *   contacts?: string[],
 *   skills?: (string | { name: string, level?: 1|2|3|4|5 })[],
 *   experience?: { title, company, dates, location?, points: string[] }[],
 *   education?: { line: string }[],
 *   tags?: string[],
 *   avatarUrl?: string,  // legacy
 *   photo?: string       // NEW (base64 or URL)
 * }
 * options = { palette?: number } // 0..3 (choose a palette)
 * Avatar?: optional headshot renderer injected by TemplatePreview
 */
export default function NeonRiot({ data = {}, options = {}, Avatar }) {
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
    photo, // NEW
  } = data;

  const palettes = [
    { a: "#ff1d8e", b: "#00f0ff", c: "#ffd300", d: "#7cff00", ink: "#0a0a0a", sub: "#2b2b2b" },
    { a: "#00ff94", b: "#ff6b6b", c: "#845ef7", d: "#ffe066", ink: "#0a0a0a", sub: "#2b2b2b" },
    { a: "#ff9f1c", b: "#2ec4b6", c: "#e71d36", d: "#9b5de5", ink: "#0a0a0a", sub: "#2b2b2b" },
    { a: "#22d3ee", b: "#f472b6", c: "#a3e635", d: "#fb923c", ink: "#0a0a0a", sub: "#2b2b2b" },
  ];
  const palette = palettes[Math.max(0, Math.min(palettes.length - 1, Number.isFinite(options.palette) ? options.palette : 0))];

  const R = 16; // spacing rhythm
  const photoSrc = photo || avatarUrl; // prefer new photo

  return (
    <div style={pageWrap(palette)}>
      {/* neon frame */}
      <div style={frameGlow(palette)} />

      {/* header — PHOTO LEFT */}
      <header style={headerBox(palette)}>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "center" }}>
          {/* Photo left (optional) */}
          {photoSrc ? (
            Avatar ? (
              <Avatar src={photoSrc} size={88} shape="rounded" alt={`${fullName} photo`} />
            ) : (
              <div style={avatarRing(palette)}>
                <img alt="" src={photoSrc} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            )
          ) : (
            <div style={{ width: 0, height: 0 }} /> // keeps grid alignment if no photo
          )}

          {/* Name, role, tags */}
          <div>
            <h1 style={h1(palette)}>{fullName}</h1>
            <div style={{ marginTop: 4, color: palette.sub, fontSize: 15 }}>{role}</div>
            {tags?.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {tags.slice(0, 10).map((t, i) => (
                  <TagBadge key={i} palette={palette}>{t}</TagBadge>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* body grid */}
      <div style={{ display: "grid", gridTemplateColumns: "270px 1fr", gap: R, marginTop: R, alignItems: "start" }}>
        {/* left column */}
        <aside style={{ display: "grid", gap: R }}>
          {contacts?.length > 0 && (
            <StickerCard palette={palette} title="Contact" pattern="dots">
              <div style={{ display: "grid", gap: 8, fontSize: 13, color: palette.sub }}>
                {contacts.map((c, i) => (
                  <Row key={i} color={palette.a}>{c}</Row>
                ))}
              </div>
            </StickerCard>
          )}

          {skills?.length > 0 && (
            <StickerCard palette={palette} title="Skills" pattern="stripes">
              <div style={{ display: "grid", gap: 10 }}>
                {skills.map((s, i) => {
                  const name = typeof s === "string" ? s : s?.name;
                  const lvl = typeof s === "string" ? undefined : clamp(s?.level, 1, 5);
                  return <SkillMeter key={i} name={name} level={lvl} palette={palette} />;
                })}
              </div>
            </StickerCard>
          )}

          {education?.length > 0 && (
            <StickerCard palette={palette} title="Education" pattern="grid">
              <ul style={{ margin: "0 0 0 18px", padding: 0, color: palette.sub, lineHeight: 1.55 }}>
                {education.map((ed, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{ed.line}</li>
                ))}
              </ul>
            </StickerCard>
          )}
        </aside>

        {/* right column */}
        <main style={{ display: "grid", gap: R }}>
          {summary && (
            <StickerCard palette={palette} title="Profile" pattern="burst" highlight>
              <p style={{ margin: 0, color: palette.ink, lineHeight: 1.6 }}>{summary}</p>
            </StickerCard>
          )}

          <RailHeader title="Experience" palette={palette} />

          <div style={timelineWrap}>
            <div style={rail(palette)} />
            <div style={{ display: "grid", gap: R }}>
              {experience?.length > 0 ? (
                experience.map((job, i) => (
                  <TimelineItem key={i} job={job} palette={palette} last={i === experience.length - 1} first={i === 0} />
                ))
              ) : (
                <StickerCard palette={palette} pattern="dots">
                  <div style={{ color: palette.sub, fontSize: 13 }}>Add your roles and highlights.</div>
                </StickerCard>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* footer beam */}
      <div style={{ marginTop: R, height: 8, borderRadius: 999, background: footerGrad(palette) }} />
    </div>
  );
}

/* ================= Components ================= */

function TagBadge({ children, palette }) {
  return (
    <span style={{
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 11,
      color: palette.ink,
      background: `linear-gradient(180deg, #ffffff, rgba(255,255,255,.8))`,
      border: `1px solid ${rgba(palette.b, .45)}`,
      boxShadow: `0 2px 10px ${rgba(palette.b, .2)}, inset 0 0 0 1px rgba(255,255,255,.6)`
    }}>{children}</span>
  );
}

function StickerCard({ title, children, palette, pattern = "dots", highlight = false }) {
  return (
    <section style={stickerBox(palette, pattern, highlight)}>
      {title ? <CardTitle palette={palette}>{title}</CardTitle> : null}
      {children}
    </section>
  );
}

function CardTitle({ children, palette }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ width: 12, height: 12, borderRadius: 999, background: palette.a, boxShadow: `0 0 12px ${rgba(palette.a,.55)}` }}/>
      <h3 style={{ margin: 0, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", color: palette.sub }}>
        {children}
      </h3>
    </div>
  );
}

function Row({ children, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 7, height: 7, borderRadius: 10, background: color }} />
      <span>{children}</span>
    </div>
  );
}

function SkillMeter({ name, level, palette }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 13, color: palette.ink }}>{name}</span>
      {typeof level === "number" ? (
        <div style={{ width: 130, height: 10, borderRadius: 999, background: "#eee", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${(level / 5) * 100}%`,
            background: `linear-gradient(90deg, ${palette.a}, ${palette.b}, ${palette.c}, ${palette.d})`
          }}/>
        </div>
      ) : null}
    </div>
  );
}

function RailHeader({ title, palette }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "26px 1fr", gap: 8, alignItems: "center" }}>
      <div style={{
        width: 26, height: 26, borderRadius: 8,
        background: `conic-gradient(from 0deg, ${palette.a}, ${palette.b}, ${palette.c}, ${palette.d}, ${palette.a})`,
        boxShadow: `0 0 16px ${rgba(palette.c,.45)}`
      }}/>
      <h2 style={{ margin: 0, fontSize: 16, letterSpacing: .2, color: palette.ink }}>{title}</h2>
    </div>
  );
}

function TimelineItem({ job, palette, last, first }) {
  return (
    <div style={{ position: "relative", paddingLeft: 34 }}>
      {/* node */}
      <div style={{
        position: "absolute", left: 10, top: 10,
        width: 14, height: 14, borderRadius: 999,
        background: `radial-gradient(circle at 30% 30%, ${palette.d}, ${palette.a})`,
        boxShadow: `0 0 14px ${rgba(palette.d,.5)}`
      }}/>
      {/* card */}
      <div style={timelineCard(palette, first)}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline" }}>
          <strong style={{ color: palette.ink }}>{job.title}</strong>
          <span style={{ color: "#9aa3b5" }}>•</span>
          <span style={{ color: "#3b3f5b" }}>{job.company}</span>
          {job.location && (<><span style={{ color: "#9aa3b5" }}>•</span><span style={{ color: palette.b }}>{job.location}</span></>)}
        </div>
        <div style={{ fontSize: 12, color: "#616783", marginTop: 2 }}>{job.dates}</div>
        {Array.isArray(job.points) && job.points.length > 0 && (
          <ul style={{ margin: "8px 0 0 18px", padding: 0, color: "#1d2139", lineHeight: 1.55 }}>
            {job.points.map((p, i) => <li key={i} style={{ marginBottom: 6 }}>{p}</li>)}
          </ul>
        )}
      </div>
      {/* rail seg */}
      {!last && <div style={{ position: "absolute", left: 16, top: 24, bottom: -12, width: 2, background: railGrad(palette) }}/>}
    </div>
  );
}

/* ================= Styles ================= */

function pageWrap(p) {
  return {
    width: 794,
    minHeight: 1123,
    boxSizing: "border-box",
    padding: 18,
    background: `
      radial-gradient(880px 340px at 105% -10%, ${rgba(p.a,.22)} 0%, transparent 60%),
      radial-gradient(760px 320px at -10% 15%, ${rgba(p.b,.20)} 0%, transparent 65%),
      radial-gradient(560px 260px at 50% 110%, ${rgba(p.c,.18)} 0%, transparent 70%),
      #ffffff
    `,
    borderRadius: 20,
    boxShadow: "0 16px 40px rgba(5,10,40,.08)",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    color: p.ink,
    position: "relative",
    overflow: "hidden"
  };
}

function frameGlow(p) {
  return {
    position: "absolute",
    inset: 10,
    borderRadius: 16,
    pointerEvents: "none",
    boxShadow: `0 0 0 2px ${rgba(p.d,.6)}, 0 0 60px ${rgba(p.b,.35)} inset`
  };
}

function headerBox(p) {
  return {
    borderRadius: 16,
    padding: 16,
    background: "linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,.78))",
    border: "1px solid rgba(226,232,240,.95)",
    boxShadow: "0 12px 28px rgba(20,18,58,.06), inset 0 0 0 1px rgba(255,255,255,.6)"
  };
}

function h1(p) {
  return {
    margin: 0,
    fontSize: 32,
    letterSpacing: 0.2,
    color: p.ink,
    textShadow: `0 1px 0 rgba(255,255,255,.7), 0 10px 24px ${rgba(p.a,.35)}`
  };
}

function avatarRing(p) {
  return {
    width: 88, height: 88, borderRadius: 22, overflow: "hidden",
    background: "#fff",
    border: `2px solid ${rgba(p.c,.8)}`,
    boxShadow: `0 16px 30px ${rgba(p.b,.2)}, inset 0 0 0 1px rgba(255,255,255,.6)`
  };
}

function stickerBox(p, pattern, highlight) {
  const patternBg =
    pattern === "stripes"
      ? `repeating-linear-gradient(135deg, ${rgba(p.a,.10)} 0px, ${rgba(p.a,.10)} 8px, transparent 8px, transparent 16px)`
      : pattern === "grid"
      ? `linear-gradient(${rgba(p.b,.12)} 1px, transparent 1px), linear-gradient(90deg, ${rgba(p.b,.12)} 1px, transparent 1px)`
      : pattern === "burst"
      ? `radial-gradient(circle at 20% 10%, ${rgba(p.d,.18)} 0%, transparent 45%), radial-gradient(circle at 80% 30%, ${rgba(p.b,.18)} 0%, transparent 50%)`
      : `radial-gradient(${rgba(p.c,.12)} 1px, transparent 1px)`;
  const patternSize = pattern === "grid" ? "16px 16px" : "10px 10px";
  return {
    position: "relative",
    background: `linear-gradient(180deg, rgba(255,255,255,.95), rgba(255,255,255,.86))`,
    borderRadius: 16,
    padding: 12,
    border: "1px solid rgba(226,232,240,.95)",
    boxShadow: "0 12px 30px rgba(20,18,58,.06), inset 0 0 0 1px rgba(255,255,255,.6)",
    outline: highlight ? `2px solid ${rgba(p.a,.25)}` : "none",
    backgroundImage: patternBg,
    backgroundSize: pattern === "grid" ? patternSize : undefined
  };
}

const timelineWrap = { position: "relative", paddingLeft: 6 };

function rail(p) {
  return {
    position: "absolute",
    left: 18, top: -6, bottom: -6, width: 3,
    background: railGrad(p)
  };
}
function railGrad(p) {
  return `linear-gradient(180deg, ${rgba(p.a,.9)}, ${rgba(p.d,.5)}, ${rgba(p.b,.25)})`;
}

function timelineCard(p, first) {
  return {
    background: "#ffffff",
    border: `2px solid ${first ? rgba(p.a,.5) : "rgba(226,232,240,.95)"}`,
    borderRadius: 16,
    padding: 12,
    boxShadow: "0 10px 26px rgba(20,18,58,.06), inset 0 0 0 1px rgba(255,255,255,.6)"
  };
}

function footerGrad(p) {
  return `linear-gradient(90deg, ${p.a}, ${p.b}, ${p.c}, ${p.d}, ${p.a})`;
}

/* ================= Utils ================= */

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
