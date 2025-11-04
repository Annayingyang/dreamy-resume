import React from "react";

/**
 * CoralWarm — artsy coral/peach aesthetic (A4 794x1123)
 * Props:
 *  - data: {
 *      fullName, role, summary,
 *      contacts?: string[],
 *      skills?: (string | { name: string, level?: 1|2|3|4|5 })[],
 *      experience?: { title, company, dates, location?, points: string[] }[],
 *      education?: { line: string }[],
 *      tags?: string[],
 *      avatarUrl?: string
 *    }
 *  - options?: {
 *      coral?: string,   // main accent (default "#fb7185")
 *      peach?: string,   // secondary accent (default "#fdba74")
 *      sun?: string,     // highlight glow (default "#fde047")
 *    }
 */
export default function CoralWarm({ data = {}, options = {} }) {
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
  } = data;

  const coral = options.coral || "#fb7185"; // rose-coral
  const peach = options.peach || "#fdba74"; // peach
  const sun   = options.sun   || "#fde047"; // sunny yellow
  const ink   = "#3a1d1d";
  const sub   = "#6b3b3b";

  const R = 16; // spacing rhythm
  const glass = "rgba(255,255,255,0.75)";

  const clamp = (v, min, max) => typeof v === "number" ? Math.max(min, Math.min(max, v)) : undefined;

  const Section = ({ title, children, pad = R }) => (
    <section style={cardStyle({ coral, peach, sun, pad })}>
      <Title>{title}</Title>
      <div style={{ marginTop: 10 }}>{children}</div>
    </section>
  );

  const Title = ({ children }) => (
    <h3 style={{
      margin: 0, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.4,
      color: ink, display: "inline-flex", alignItems: "center", gap: 10
    }}>
      <span style={{
        width: 10, height: 10, borderRadius: 12,
        background: `radial-gradient(circle at 30% 30%, ${sun}, ${peach})`,
        boxShadow: `0 0 12px ${hexToRgba(peach, .6)}`
      }}/>
      {children}
    </h3>
  );

  const Chip = ({ children }) => (
    <span style={{
      display: "inline-block",
      fontSize: 11, letterSpacing: .2, color: ink,
      padding: "4px 10px",
      borderRadius: 999,
      background: `linear-gradient(180deg, #fff, ${hexToRgba("#fff2ee", .9)})`,
      border: `1px dashed ${hexToRgba(coral, .65)}`,
      boxShadow: `0 3px 10px ${hexToRgba(coral, .18)}`,
      transform: "rotate(-0.5deg)",
      marginRight: 8, marginBottom: 8
    }}>{children}</span>
  );

  const SkillBeads = ({ item }) => {
    const name = typeof item === "string" ? item : item?.name;
    const level = typeof item === "string" ? undefined : clamp(item?.level, 1, 5);
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: ink }}>{name}</span>
        {level ? (
          <div style={{ display: "flex", gap: 6 }}>
            {[1,2,3,4,5].map(n => (
              <span key={n} style={{
                width: 12, height: 12, borderRadius: 999,
                background: n <= level
                  ? `radial-gradient(circle at 30% 30%, ${sun}, ${coral})`
                  : "#ffe9e4",
                boxShadow: n <= level ? `0 0 10px ${hexToRgba(coral,.45)}` : "none",
                border: `1px solid ${n <= level ? shade(coral,-10) : "#ffd6cd"}`
              }}/>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  const Tape = ({ color = peach, rotate = -4, top = -10, right = -10 }) => (
    <div style={{
      position: "absolute", top, right, width: 56, height: 18,
      background: `linear-gradient(180deg, ${hexToRgba("#fff", .75)}, ${hexToRgba("#fff", .55)})`,
      border: `1px solid ${hexToRgba("#000", .06)}`,
      transform: `rotate(${rotate}deg)`,
      boxShadow: `0 6px 14px ${hexToRgba(color,.35)}`,
    }}/>
  );

  const ExperienceCard = ({ item, first }) => (
    <div style={{
      position: "relative",
      background: glass,
      borderRadius: 18,
      padding: R,
      border: `1px solid ${hexToRgba("#ffedd5", .9)}`,
      boxShadow: `0 12px 30px ${hexToRgba(peach,.18)}, inset 0 0 0 1px ${hexToRgba("#fff", .5)}`,
      overflow: "hidden"
    }}>
      {/* corner blob */}
      <div style={{
        position: "absolute", left: -40, top: -40, width: 160, height: 160,
        background: `radial-gradient(60% 60% at 50% 50%, ${hexToRgba(peach,.8)} 0%, ${hexToRgba(coral,.55)} 60%, transparent 70%)`,
        filter: "blur(6px)", opacity: .5
      }}/>
      {/* sticker tape */}
      <Tape rotate={first ? -3 : 3} color={coral} top={-8} right={-8} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline" }}>
        <strong style={{ color: ink, fontSize: 15 }}>{item.title}</strong>
        <span style={{ color: sub }}>•</span>
        <span style={{ color: sub }}>{item.company}</span>
        {item.location && (<><span style={{ color: sub }}>•</span><span style={{ color: coral }}>{item.location}</span></>)}
      </div>
      <div style={{ fontSize: 12, color: sub, marginTop: 2 }}>{item.dates}</div>
      {Array.isArray(item.points) && item.points.length > 0 && (
        <ul style={{ margin: "8px 0 0 18px", padding: 0, color: "#572b2b", lineHeight: 1.55 }}>
          {item.points.map((p, i) => <li key={i} style={{ marginBottom: 6 }}>{p}</li>)}
        </ul>
      )}
    </div>
  );

  return (
    <div style={{
      width: 794, minHeight: 1123, boxSizing: "border-box",
      padding: R * 1.25,
      fontFamily:
        "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      color: ink,
      // playful warm canvas
      background: `
        radial-gradient(700px 300px at 100% -10%, ${hexToRgba(sun,.22)} 0%, transparent 60%),
        radial-gradient(680px 320px at -10% 10%, ${hexToRgba(peach,.24)} 0%, transparent 60%),
        radial-gradient(620px 300px at 50% 100%, ${hexToRgba(coral,.22)} 0%, transparent 60%),
        #fffaf6
      `,
      borderRadius: 20,
      boxShadow: "0 15px 40px rgba(250, 160, 120, .15)"
    }}>
      {/* top paint swash */}
      <div style={{
        height: 10, borderRadius: 10,
        background: `repeating-linear-gradient(90deg, ${coral}, ${coral} 20px, ${peach} 20px, ${peach} 40px, ${sun} 40px, ${sun} 60px)`,
        opacity: .75, boxShadow: `0 6px 16px ${hexToRgba(coral,.25)}`
      }}/>

      {/* Header row */}
      <header style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: R,
        alignItems: "center",
        paddingTop: R, paddingBottom: R,
        borderBottom: `2px dotted ${hexToRgba(coral,.6)}`
      }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 34, letterSpacing: .3,
            color: "#2b1111",
            textShadow: `0 1px 0 ${hexToRgba("#fff", .8)}, 0 8px 24px ${hexToRgba(peach,.35)}`
          }}>{fullName}</h1>
          <div style={{ fontSize: 16, color: sub, marginTop: 4 }}>{role}</div>
          {tags?.length > 0 && (
            <div style={{ marginTop: 10 }}>
              {tags.slice(0, 12).map((t, i) => <Chip key={i}>{t}</Chip>)}
            </div>
          )}
        </div>
        {avatarUrl ? (
          <div style={{
            width: 88, height: 88, borderRadius: 24, overflow: "hidden",
            background: "#fff",
            border: `2px solid ${hexToRgba(peach,.8)}`,
            boxShadow: `0 12px 28px ${hexToRgba(sun,.25)}`
          }}>
            <img src={avatarUrl} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
          </div>
        ) : null}
      </header>

      {/* Body grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "270px 1fr",
        gap: R,
        marginTop: R,
        alignItems: "start"
      }}>
        {/* Left column (stickers) */}
        <aside style={{ display: "grid", gap: R }}>
          {contacts?.length > 0 && (
            <Section title="Contact">
              <div style={{ display: "grid", gap: 8, fontSize: 13, color: sub }}>
                {contacts.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: 999,
                      background: `radial-gradient(circle at 35% 35%, ${sun}, ${peach})`,
                      boxShadow: `0 0 8px ${hexToRgba(sun,.5)}`
                    }}/>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {skills?.length > 0 && (
            <Section title="Skills">
              <div style={{ display: "grid", gap: 10 }}>
                {skills.map((s, i) => <SkillBeads key={i} item={s} />)}
              </div>
            </Section>
          )}

          {education?.length > 0 && (
            <Section title="Education">
              <ul style={{ margin: "0 0 0 18px", padding: 0, color: sub, lineHeight: 1.55 }}>
                {education.map((ed, i) => <li key={i} style={{ marginBottom: 6 }}>{ed.line}</li>)}
              </ul>
            </Section>
          )}
        </aside>

        {/* Right column */}
        <main style={{ display: "grid", gap: R }}>
          {summary && (
            <section style={noteStyle({ coral, peach, sun, pad: R })}>
              <div style={{ transform: "rotate(-1.2deg)" }}>
                <Title>Profile</Title>
                <p style={{ margin: "10px 0 0 0", color: "#4a2222", lineHeight: 1.6 }}>{summary}</p>
              </div>
              <Tape color={sun} rotate={-7} top={-12} right={-12} />
            </section>
          )}

          <Section title="Experience">
            <div style={{ display: "grid", gap: R }}>
              {experience?.length > 0 ? (
                experience.map((e, i) => <ExperienceCard key={i} item={e} first={i===0} />)
              ) : (
                <div style={{ color: sub, fontSize: 13 }}>Add your roles and highlights.</div>
              )}
            </div>
          </Section>
        </main>
      </div>

      {/* footer squiggle */}
      <div style={{
        marginTop: R, height: 8, borderRadius: 999,
        background: `linear-gradient(90deg, ${coral}, ${peach}, ${sun}, ${peach}, ${coral})`,
        filter: "blur(.2px)", opacity: .9
      }}/>
    </div>
  );
}

/* ---------- styles & helpers ---------- */

function cardStyle({ coral, peach, sun, pad = 16 }) {
  return {
    position: "relative",
    background: `linear-gradient(180deg, rgba(255,255,255,.9), ${hexToRgba("#fff6f1", .95)})`,
    borderRadius: 18,
    padding: pad,
    border: `1px solid ${hexToRgba("#ffd7c2", .95)}`,
    boxShadow: `
      0 12px 30px ${hexToRgba(peach,.18)},
      inset 0 0 0 1px rgba(255,255,255,.6)
    `,
    overflow: "hidden",
    // wavy edge illusion at bottom
    backgroundImage: `
      radial-gradient(12px 6px at 10% 100%, ${hexToRgba(coral,.08)} 40%, transparent 41%),
      radial-gradient(12px 6px at 30% 100%, ${hexToRgba(coral,.08)} 40%, transparent 41%),
      radial-gradient(12px 6px at 50% 100%, ${hexToRgba(coral,.08)} 40%, transparent 41%),
      radial-gradient(12px 6px at 70% 100%, ${hexToRgba(coral,.08)} 40%, transparent 41%),
      radial-gradient(12px 6px at 90% 100%, ${hexToRgba(coral,.08)} 40%, transparent 41%)
    `,
    backgroundRepeat: "no-repeat",
  };
}

function noteStyle({ coral, peach, sun, pad = 16 }) {
  return {
    position: "relative",
    padding: pad,
    background: `repeating-linear-gradient(
      -8deg,
      ${hexToRgba("#fff", .92)} 0px,
      ${hexToRgba("#fff", .92)} 22px,
      ${hexToRgba("#fff5f0", .95)} 22px,
      ${hexToRgba("#fff5f0", .95)} 44px
    )`,
    borderRadius: 18,
    border: `1px solid ${hexToRgba(peach,.8)}`,
    boxShadow: `0 10px 24px ${hexToRgba(peach,.18)}, inset 0 0 0 1px rgba(255,255,255,.6)`,
  };
}

function hexToRgba(hex, a = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function shade(hex, percent) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.round(r + (percent / 100) * 255);
  g = Math.round(g + (percent / 100) * 255);
  b = Math.round(b + (percent / 100) * 255);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  const toHex = (v) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
