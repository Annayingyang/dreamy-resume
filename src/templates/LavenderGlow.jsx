import React from "react";

/**
 * OrchidMagazine — editorial lilac aesthetic, A4 (794x1123)
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
 *  - options?: { accent?: string }  // override accent color
 */
export default function OrchidMagazine({ data = {}, options = {} }) {
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

  const accent = options.accent || "#b794f4"; // orchid lavender
  const ink = "#261447";
  const sub = "#5b4a8f";
  const R = 16; // rhythm unit for consistent spacing

  const SectionTitle = ({ children }) => (
    <h3 style={{
      margin: 0,
      fontSize: 12,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      color: sub,
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
    }}>
      <span style={{
        display: "inline-block",
        width: 10, height: 10, borderRadius: 12,
        background: accent, boxShadow: `0 0 12px ${hexToRgba(accent, .45)}`
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
      background: `linear-gradient(180deg, #ffffff, #faf7ff)`,
      border: `1px solid ${hexToRgba("#c7b7ff", .7)}`,
      marginRight: 8, marginBottom: 8
    }}>{children}</span>
  );

  const SkillRow = ({ item }) => {
    const name = typeof item === "string" ? item : item?.name;
    const level = typeof item === "string" ? undefined : clamp(item?.level, 1, 5);
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: ink }}>{name}</span>
        {level ? (
          <div style={{ display: "flex", gap: 4 }}>
            {[1,2,3,4,5].map(n => (
              <span key={n} style={{
                width: 12, height: 12, borderRadius: 12,
                background: n <= level ? accent : "#eadffd",
                border: `1px solid ${n <= level ? shade(accent,-12) : "#e6e0ff"}`
              }}/>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  const Card = ({ children, pad = R }) => (
    <section style={{
      background: "#ffffff",
      borderRadius: 18,
      padding: pad,
      border: "1px solid #ede9fe",
      boxShadow:
        "0 10px 30px rgba(80, 52, 150, 0.08), inset 0 0 0 1px rgba(255,255,255,0.6)",
      // gradient top edge (ribbon)
      position: "relative",
    }}>
      <div style={{
        content: '""',
        position: "absolute",
        left: 0, right: 0, top: -1, height: 3, borderTopLeftRadius: 18, borderTopRightRadius: 18,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`
      }}/>
      {children}
    </section>
  );

  return (
    <div style={{
      width: 794, minHeight: 1123, boxSizing: "border-box",
      background: `
        radial-gradient(700px 260px at -10% 0%, ${hexToRgba("#c4b5fd", .18)} 0%, transparent 60%),
        radial-gradient(620px 300px at 110% 20%, ${hexToRgba("#f0abfc", .18)} 0%, transparent 70%),
        #f9f7ff
      `,
      padding: R * 1.5,
      fontFamily:
        "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      color: ink
    }}>
      {/* Grid: nameplate left, content right */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: R * 1.25,
        alignItems: "start"
      }}>
        {/* Left nameplate column */}
        <aside>
          <div style={{
            background: `linear-gradient(180deg, #ffffff, #fcfbff)`,
            border: `1px solid #ede9fe`,
            borderRadius: 20,
            padding: R,
            boxShadow: "0 12px 34px rgba(67,56,202,.08)"
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: R/2, alignItems: "center" }}>
              <div>
                <h1 style={{
                  margin: 0, fontSize: 30, lineHeight: 1.15,
                  letterSpacing: .2, color: "#1b1140"
                }}>{fullName}</h1>
                <div style={{ marginTop: 6, color: sub, fontSize: 14 }}>{role}</div>
              </div>
              {avatarUrl ? (
                <div style={{
                  width: 64, height: 64, borderRadius: 16, overflow: "hidden",
                  border: `1px solid ${hexToRgba("#c7b7ff", .7)}`, background: "#fff"
                }}>
                  <img src={avatarUrl} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                </div>
              ) : null}
            </div>

            {tags?.length > 0 && (
              <div style={{ marginTop: R/1.25 }}>
                {tags.slice(0, 10).map((t,i) => <Chip key={i}>{t}</Chip>)}
              </div>
            )}

            {/* Contact */}
            {contacts?.length > 0 && (
              <div style={{ marginTop: R }}>
                <SectionTitle>Contact</SectionTitle>
                <div style={{ marginTop: 10, display: "grid", gap: 8, fontSize: 13 }}>
                  {contacts.map((c,i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: 10, background: accent
                      }}/>
                      <span style={{ color: sub }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills?.length > 0 && (
              <div style={{ marginTop: R }}>
                <SectionTitle>Skills</SectionTitle>
                <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                  {skills.map((s,i) => <SkillRow key={i} item={s} />)}
                </div>
              </div>
            )}

            {/* Education */}
            {education?.length > 0 && (
              <div style={{ marginTop: R }}>
                <SectionTitle>Education</SectionTitle>
                <ul style={{ margin: "10px 0 0 18px", padding: 0, color: sub, lineHeight: 1.5 }}>
                  {education.map((ed, i) => <li key={i} style={{ marginBottom: 6 }}>{ed.line}</li>)}
                </ul>
              </div>
            )}
          </div>
        </aside>

        {/* Right editorial column */}
        <main style={{ display: "grid", gap: R }}>
          {/* Profile */}
          {summary && (
            <Card>
              <SectionTitle>Profile</SectionTitle>
              <p style={{
                margin: `${R/1.5}px 0 0 0`,
                color: "#3b2f73",
                lineHeight: 1.55
              }}>{summary}</p>
            </Card>
          )}

          {/* Experience */}
          <Card>
            <SectionTitle>Experience</SectionTitle>
            <div style={{ display: "grid", gap: R }}>
              {experience?.length > 0 ? (
                experience.map((job, i) => (
                  <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: "140px 1fr",
                    gap: 14,
                    alignItems: "start",
                    paddingTop: i === 0 ? R/2 : 0
                  }}>
                    {/* Dates column with vertical rule */}
                    <div style={{ position: "relative", color: sub, fontSize: 12 }}>
                      <div style={{
                        position: "absolute", right: -12, top: 4, bottom: 4, width: 2,
                        background: `linear-gradient(180deg, ${hexToRgba(accent,.7)}, transparent)`
                      }}/>
                      <div>{job.dates}</div>
                      {job.location && <div style={{ marginTop: 4, color: "#7c3aed" }}>{job.location}</div>}
                    </div>

                    {/* Content */}
                    <div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline" }}>
                        <strong style={{ color: ink }}>{job.title}</strong>
                        <span style={{ color: "#9a8bd6" }}>•</span>
                        <span style={{ color: sub }}>{job.company}</span>
                      </div>
                      {Array.isArray(job.points) && job.points.length > 0 && (
                        <ul style={{ margin: "8px 0 0 18px", padding: 0, color: "#4a3a8a", lineHeight: 1.55 }}>
                          {job.points.map((p,j) => <li key={j} style={{ marginBottom: 6 }}>{p}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: "#9a8bd6", fontSize: 13 }}>Add your roles and impact.</div>
              )}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
function clamp(v, min, max){ return typeof v === "number" ? Math.max(min, Math.min(max, v)) : undefined; }
function hexToRgba(hex, a = 1){
  const h = hex.replace("#","");
  const bigint = parseInt(h.length===3 ? h.split("").map(c=>c+c).join("") : h, 16);
  const r = (bigint>>16)&255, g=(bigint>>8)&255, b=bigint&255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function shade(hex, percent){
  const h = hex.replace("#",""); const n=parseInt(h.length===3?h.split("").map(c=>c+c).join(""):h,16);
  let r=(n>>16)&255, g=(n>>8)&255, b=n&255;
  r=Math.max(0,Math.min(255, Math.round(r + (percent/100)*255)));
  g=Math.max(0,Math.min(255, Math.round(g + (percent/100)*255)));
  b=Math.max(0,Math.min(255, Math.round(b + (percent/100)*255)));
  return `#${[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("")}`;
}
