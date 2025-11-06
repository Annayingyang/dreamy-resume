import React from "react";

/**
 * Charcoal Pro — A4 portrait (794 x 1123), print-friendly.
 * Props:
 *  - data: {
 *      fullName, role, summary,
 *      contacts?: string[],
 *      skills?: (string | { name: string, level?: 1|2|3|4|5 })[],
 *      experience?: { title, company, dates, location?, points: string[] }[],
 *      education?: { line: string }[],
 *      tags?: string[],
 *      avatarUrl?: string, // legacy support
 *      photo?: string      // NEW: base64 from TemplateDetails
 *    }
 *  - options?: { accent?: string, subtleAccent?: string }
 *  - Avatar?: (from TemplatePreview) helper to render a styled headshot
 */
export default function CharcoalPro({ data, options = {}, Avatar }) {
  const {
    fullName = "Your Name",
    role = "Your Role Title",
    summary,
    contacts = [],
    skills = [],
    experience = [],
    education = [],
    tags = [],
    avatarUrl, // legacy
    photo,     // new
  } = data || {};

  const accent = options.accent || "#22d3ee";       // cyan
  const subtle = options.subtleAccent || "rgba(34, 211, 238, 0.25)";
  const photoSrc = photo || avatarUrl; // prefer new photo

  // Helpers
  function clamp(v, min, max){ if(typeof v!=="number") return undefined; return Math.max(min, Math.min(max, v)); }

  const Dots = ({ level, accent }) => (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map(n => (
        <span
          key={n}
          style={{
            width: 8, height: 8, borderRadius: 999,
            background: n <= level ? accent : "#374151",
            boxShadow: n <= level ? `0 0 6px ${subtle}` : "none"
          }}
        />
      ))}
    </div>
  );

  const SkillItem = ({ item }) => {
    const name = typeof item === "string" ? item : item?.name;
    const level = typeof item === "string" ? undefined : clamp(item?.level, 1, 5);
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 13, color: "#e5e7eb" }}>{name}</span>
        {level ? <Dots level={level} accent={accent} /> : null}
      </div>
    );
  };

  const Badge = ({ children }) => (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        letterSpacing: 0.3,
        color: "#0b1220",
        background: accent,
        boxShadow: `0 0 0 1px ${accent}, 0 0 18px ${subtle}`,
        marginRight: 6,
        marginBottom: 6,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );

  const TimelineItem = ({ job, isLast }) => (
    <div style={{ display: "grid", gridTemplateColumns: "18px 1fr", columnGap: 14, position: "relative" }}>
      {/* Rail */}
      <div style={{ position: "relative" }}>
        <span style={{
          position: "absolute",
          left: 0, top: 4,
          width: 14, height: 14, borderRadius: 999,
          background: accent, boxShadow: `0 0 10px ${subtle}`,
        }}/>
        {!isLast && (
          <span style={{
            position: "absolute", left: 6, top: 22, bottom: -6, width: 2,
            background: `linear-gradient(to bottom, ${accent}, transparent 80%)`, opacity: 0.5
          }}/>
        )}
      </div>

      {/* Content */}
      <div style={{ paddingBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <strong style={{ fontSize: 15, color: "#f9fafb" }}>{job.title}</strong>
          <span style={{ color: "#9ca3af" }}>&middot;</span>
          <span style={{ color: "#cbd5e1" }}>{job.company}</span>
          {job.location ? (
            <>
              <span style={{ color: "#9ca3af" }}>&middot;</span>
              <span style={{ color: "#93c5fd" }}>{job.location}</span>
            </>
          ) : null}
        </div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{job.dates}</div>
        {Array.isArray(job.points) && job.points.length > 0 && (
          <ul style={{ margin: "8px 0 0 16px", padding: 0, color: "#e5e7eb", lineHeight: 1.45 }}>
            {job.points.map((p, i) => <li key={i} style={{ marginBottom: 4 }}>{p}</li>)}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: "794px",
        minHeight: "1123px",
        background: "#0b0f16",
        color: "#e5e7eb",
        boxSizing: "border-box",
        padding: 32,
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji','Segoe UI Emoji'",
        boxShadow: `inset 0 0 0 1px #1f2937, 0 0 24px rgba(0,0,0,.35)`,
        position: "relative",
      }}
    >
      {/* Neon ribbon */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(120deg, transparent 20%, ${subtle} 50%, transparent 80%)`,
          maskImage: "linear-gradient(#000, transparent 30%)",
          opacity: 0.3,
        }}
      />

      {/* Header */}
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          paddingBottom: 18,
          borderBottom: `2.5px solid ${accent}`,
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 34,
              letterSpacing: 0.2,
              color: "#f8fafc",
              textShadow: `0 0 12px ${subtle}`,
            }}
          >
            {fullName}
          </h1>
          <div style={{ color: "#c7d2fe", marginTop: 4, fontSize: 16 }}>{role}</div>

          {/* Tags */}
          {tags?.length > 0 && (
            <div style={{ marginTop: 10 }}>
              {tags.slice(0, 12).map((t, i) => <Badge key={i}>{t}</Badge>)}
            </div>
          )}
        </div>

        {/* Avatar (optional) */}
        {photoSrc ? (
          Avatar ? (
            <Avatar src={photoSrc} size={84} shape="circle" alt={`${fullName} photo`} />
          ) : (
            <div
              style={{
                width: 84, height: 84, borderRadius: 999, overflow: "hidden",
                border: `2px solid ${accent}`, boxShadow: `0 0 22px ${subtle}`,
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

      {/* Body: 2 columns */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "250px 1fr",
        gap: 22,
        alignItems: "start",
      }}>
        {/* Sidebar */}
        <aside
          style={{
            background: "linear-gradient(180deg, #0f1521 0%, #0b0f16 60%)",
            border: "1px solid #1f2937",
            borderRadius: 14,
            padding: 14,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.02), 0 8px 18px rgba(0,0,0,0.35)`,
          }}
        >
          {/* Contacts */}
          {contacts?.length > 0 && (
            <section style={{ marginBottom: 16 }}>
              <h3 style={sectionTitleStyle(accent)}>Contact</h3>
              <div style={{ fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.6 }}>
                {contacts.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ width: 6, height: 6, background: accent, borderRadius: 999, boxShadow: `0 0 6px ${subtle}` }} />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills?.length > 0 && (
            <section style={{ marginBottom: 16 }}>
              <h3 style={sectionTitleStyle(accent)}>Skills</h3>
              <div style={{ display: "grid", gap: 8 }}>
                {skills.map((s, i) => <SkillItem key={i} item={s} />)}
              </div>
            </section>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <section>
              <h3 style={sectionTitleStyle(accent)}>Education</h3>
              <ul style={{ margin: "6px 0 0 16px", padding: 0, color: "#e5e7eb", lineHeight: 1.45 }}>
                {education.map((ed, i) => <li key={i} style={{ marginBottom: 6 }}>{ed.line}</li>)}
              </ul>
            </section>
          )}
        </aside>

        {/* Main content */}
        <main>
          {/* Summary */}
          {summary ? (
            <section
              style={{
                background: "linear-gradient(180deg, rgba(34,211,238,0.06), rgba(34,211,238,0.03))",
                border: `1px solid rgba(34,211,238,0.22)`,
                borderRadius: 14,
                padding: 14,
                marginBottom: 18,
              }}
            >
              <h3 style={sectionTitleStyle(accent)}>Profile</h3>
              <p style={{ margin: 0, color: "#e5e7eb", lineHeight: 1.55 }}>
                {summary}
              </p>
            </section>
          ) : null}

          {/* Experience timeline */}
          <section>
            <h3 style={sectionTitleStyle(accent)}>Experience</h3>
            <div style={{
              display: "grid",
              gap: 10,
              paddingLeft: 2,
              paddingTop: 4,
            }}>
              {experience?.length > 0 ? (
                experience.map((job, i) => (
                  <TimelineItem key={i} job={job} isLast={i === experience.length - 1} />
                ))
              ) : (
                <div style={{ color: "#9ca3af", fontSize: 13 }}>Add your recent roles and achievements.</div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Footer bar */}
      <div style={{
        marginTop: 20,
        height: 4,
        borderRadius: 999,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        boxShadow: `0 0 18px ${subtle}`,
        opacity: 0.8,
      }}/>
    </div>
  );
}

function sectionTitleStyle(accent){
  return {
    margin: 0,
    marginBottom: 8,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#93c5fd",
    position: "relative",
    paddingLeft: 10,
    fontWeight: 700,
    textShadow: "0 0 1px rgba(0,0,0,.4)",
    borderLeft: `3px solid ${accent}`,
  };
}
