// src/pages/TemplateDetails.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import TemplatePreview from "../components/TemplatePreview";
import "../style/TemplateDetails.css";

const LS_PREFS = "dreamy.cvPrefs.v1";
const draftKey = (tplId) => `dreamy.tplDraft.${tplId}.v1`;

const MONTHS = ["Month","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const YEARS  = ["Year", ...Array.from({ length: 51 }, (_, i) => String(2025 - i))];

const blankJob = (seedTitle = "") => ({
  id: crypto.randomUUID(),
  title: seedTitle || "",
  employer: "",
  location: "",
  startMonth: "Month",
  startYear: "Year",
  endMonth: "Month",
  endYear: "Year",
  current: false,
  bullets: ""
});

function splitName(full = "") {
  const parts = full.trim().split(/\s+/);
  if (!parts.length) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  const last = parts.pop();
  return { first: parts.join(" "), last };
}
function readPrefs() {
  try { return JSON.parse(localStorage.getItem(LS_PREFS) || "null") || {}; }
  catch { return {}; }
}
function hasMeaningfulData(obj) {
  if (!obj || typeof obj !== "object") return false;
  const pick = (x) => String(x ?? "").trim() !== "";
  const anyObj = (o) => o && Object.values(o).some(pick);
  return pick(obj?.skills) || pick(obj?.summary) || pick(obj?.photo) ||
         anyObj(obj?.heading) || anyObj(obj?.edu) || (Array.isArray(obj?.jobs) && obj.jobs.length);
}

export default function TemplateDetails() {
  const { id: tplId } = useParams();
  const location = useLocation();

  const initialPrefs = useMemo(() => {
    const viaState = location?.state?.prefs || null;
    return viaState ?? readPrefs();
  }, [location?.state]);

  const [hydrated, setHydrated] = useState(false);
  const [photo, setPhoto] = useState("");

  const [heading, setHeading] = useState({
    name: "", surname: "", role: "",
    city: "", province: "", postal: "",
    phone: "", email: "",
  });

  // NEW: jobs array (multi-role)
  const [jobs, setJobs] = useState([blankJob()]);

  const [edu, setEdu] = useState({
    institution: "", location: "",
    degree: "", field: "",
    gradMonth: "Nov", gradYear: "2022",
  });
  const [skills, setSkills] = useState("");
  const [summary, setSummary] = useState("");

  // hydrate (prefer non-empty draft, else seed from CreateCV)
  useEffect(() => {
    let draft = null;
    try { draft = JSON.parse(localStorage.getItem(draftKey(tplId)) || "null"); } catch {}
    if (hasMeaningfulData(draft)) {
      setHeading(draft.heading || {});
      setJobs(
        Array.isArray(draft.jobs) && draft.jobs.length
          ? draft.jobs
          // backward-compat: old single job -> jobs[0]
          : draft.job ? [{ ...blankJob(), ...draft.job }] : [blankJob()]
      );
      setEdu(draft.edu || {});
      setSkills(draft.skills || "");
      setSummary(draft.summary || "");
      setPhoto(draft.photo || "");
      setHydrated(true);
      return;
    }

    const prefs = initialPrefs || {};
    const { first, last } = splitName(prefs?.name || "");
    setHeading({
      name: first || "",
      surname: last || "",
      role: prefs?.role || "",
      city: prefs?.city || "",
      province: prefs?.province || "",
      postal: prefs?.postal || "",
      phone: prefs?.phone || "",
      email: prefs?.email || "",
    });

    // seed first job title from role
    setJobs([blankJob(prefs?.role || "Job Title")]);

    setSkills(prefs?.skills || "");
    setSummary(prefs?.summary || "");
    setHydrated(true);
  }, [tplId, initialPrefs]);

  // merge new prefs later without wiping user edits
  const mergeFromPrefs = (p) => {
    if (!p) return;
    const { first, last } = splitName(p.name || "");
    setHeading((h) => ({
      ...h,
      name: h.name || first || "",
      surname: h.surname || last || "",
      role: h.role || p.role || "",
      email: h.email || p.email || "",
      phone: h.phone || p.phone || "",
      city: h.city || p.city || "",
      province: h.province || p.province || "",
      postal: h.postal || p.postal || "",
    }));
    // only touch first job title if it's blank
    setJobs((arr) => {
      if (!arr.length) return [blankJob(p.role || "")];
      const copy = [...arr];
      if (!copy[0].title && p.role) copy[0] = { ...copy[0], title: p.role };
      return copy;
    });
    setSkills((s) => s || p.skills || s);
    setSummary((s) => s || p.summary || s);
  };

  useEffect(() => {
    const sync = () => mergeFromPrefs(readPrefs());
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // autosave draft (per template)
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!hydrated) return;
    const payload = { heading, jobs, edu, skills, summary, photo, tplId };
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(draftKey(tplId), JSON.stringify(payload)); } catch {}
    }, 200);
    return () => clearTimeout(saveTimer.current);
  }, [tplId, hydrated, heading, jobs, edu, skills, summary, photo]);

  // Handlers for jobs array
  const updateJob = (id, patch) => {
    setJobs((list) => list.map(j => j.id === id ? { ...j, ...patch } : j));
  };
  const addJob = () => setJobs((list) => [...list, blankJob()]);
  const duplicateJob = (id) => {
    setJobs((list) => {
      const idx = list.findIndex(j => j.id === id);
      if (idx === -1) return list;
      const dup = { ...list[idx], id: crypto.randomUUID() };
      return [...list.slice(0, idx + 1), dup, ...list.slice(idx + 1)];
    });
  };
  const removeJob = (id) => setJobs((list) => list.length > 1 ? list.filter(j => j.id !== id) : list);

  // preview data
  const templateData = useMemo(() => {
    const fullName = `${heading.name} ${heading.surname}`.trim();
    const contactLine = [heading.city, heading.province, heading.postal].filter(Boolean).join(", ");
    const skillList = skills.split(/[,|\n]/g).map(s => s.trim()).filter(Boolean);

    const experience = jobs.map(j => {
      const start = (j.startMonth !== "Month" && j.startYear !== "Year")
        ? `${j.startMonth} ${j.startYear}` : "";
      const end = j.current ? "Present"
        : (j.endMonth !== "Month" && j.endYear !== "Year") ? `${j.endMonth} ${j.endYear}` : "";
      const dates = [start, end].filter(Boolean).join(" – ");
      const points = j.bullets.split(/\n/g).map(s => s.trim()).filter(Boolean);

      return { title: j.title, company: j.employer, dates, location: j.location, points };
    });

    return {
      fullName,
      role: heading.role,
      summary,
      contacts: [heading.email, heading.phone, contactLine].filter(Boolean),
      skills: skillList,
      photo,
      experience,
      education: [{
        line: [edu.degree && `${edu.degree} • ${edu.field}`, edu.institution, edu.location]
          .filter(Boolean).join(" — ") +
          (edu.gradMonth && edu.gradYear ? ` (${edu.gradMonth} ${edu.gradYear})` : "")
      }]
    };
  }, [heading, jobs, edu, skills, summary, photo]);

  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  return (
    <section className="td-grid">
      <aside className="stepper">
        <h3>Dreamy</h3>

        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
          <button className="btn btn-outline" type="button"
            onClick={() => mergeFromPrefs(readPrefs())}>
            Sync from CreateCV
          </button>
          <button className="btn btn-outline" type="button"
            onClick={() => { localStorage.removeItem(draftKey(tplId)); window.location.reload(); }}>
            Clear draft for this template
          </button>
        </div>

        <ol>
          {["Heading","Work history","Education","Skills","Summary","Photo"].map((label,i)=>(
            <li key={label}><span>{i+1}</span><span>{label}</span></li>
          ))}
        </ol>
      </aside>

      <main className="card">
        <h1 style={{ marginTop: 0 }}>Edit details</h1>

        {/* HEADING */}
        <section>
          <h2>Heading</h2>
          <div className="grid-2">
            <label className="form-group">
              <span>First name</span>
              <input value={heading.name} onChange={e=>setHeading(p=>({ ...p, name:e.target.value }))}/>
            </label>
            <label className="form-group">
              <span>Surname</span>
              <input value={heading.surname} onChange={e=>setHeading(p=>({ ...p, surname:e.target.value }))}/>
            </label>
            <label className="form-group">
              <span>Role / Title</span>
              <input value={heading.role} onChange={e=>setHeading(p=>({ ...p, role:e.target.value }))}/>
            </label>
            <label className="form-group">
              <span>Email</span>
              <input type="email" value={heading.email} onChange={e=>setHeading(p=>({ ...p, email:e.target.value }))}/>
            </label>
            <label className="form-group">
              <span>Phone</span>
              <input value={heading.phone} onChange={e=>setHeading(p=>({ ...p, phone:e.target.value }))}/>
            </label>
            <div className="grid-3">
              <label className="form-group">
                <span>City</span>
                <input value={heading.city} onChange={e=>setHeading(p=>({ ...p, city:e.target.value }))}/>
              </label>
              <label className="form-group">
                <span>Province</span>
                <input value={heading.province} onChange={e=>setHeading(p=>({ ...p, province:e.target.value }))}/>
              </label>
              <label className="form-group">
                <span>Postal</span>
                <input value={heading.postal} onChange={e=>setHeading(p=>({ ...p, postal:e.target.value }))}/>
              </label>
            </div>
          </div>
        </section>

        {/* WORK – multiple entries */}
        <section>
          <h2>Work history</h2>

          {jobs.map((j, idx) => (
            <div key={j.id} className="card" style={{ padding: 16, marginBottom: 14 }}>
              <div className="grid-2">
                <label className="form-group">
                  <span>Title</span>
                  <input value={j.title} onChange={e=>updateJob(j.id, { title: e.target.value })}/>
                </label>
                <label className="form-group">
                  <span>Employer</span>
                  <input value={j.employer} onChange={e=>updateJob(j.id, { employer: e.target.value })}/>
                </label>
                <label className="form-group">
                  <span>Location</span>
                  <input value={j.location} onChange={e=>updateJob(j.id, { location: e.target.value })}/>
                </label>

                <div className="grid-2">
                  <label className="form-group">
                    <span>Start</span>
                    <div className="inline">
                      <select value={j.startMonth} onChange={e=>updateJob(j.id, { startMonth: e.target.value })}>
                        {MONTHS.map(m => <option key={m}>{m}</option>)}
                      </select>
                      <select value={j.startYear} onChange={e=>updateJob(j.id, { startYear: e.target.value })}>
                        {YEARS.map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                  </label>

                  <label className="form-group">
  <span>End</span>
  <div className="inline">
    <select
      value={j.endMonth}
      onChange={e=>updateJob(j.id, { endMonth: e.target.value })}
      disabled={j.current}
    >
      {MONTHS.map(m => <option key={m}>{m}</option>)}
    </select>
    <select
      value={j.endYear}
      onChange={e=>updateJob(j.id, { endYear: e.target.value })}
      disabled={j.current}
    >
      {YEARS.map(y => <option key={y}>{y}</option>)}
    </select>
  </div>
  <div className="current-checkbox">
    <input
      type="checkbox"
      id={`current-${j.id}`}
      checked={j.current}
      onChange={(e)=>updateJob(j.id, { current: e.target.checked })}
    />
    <label htmlFor={`current-${j.id}`}>I currently work here</label>
  </div>
</label>

                </div>

                <label className="form-group full">
                  <span>Key achievements (one per line)</span>
                  <textarea
                    rows={4}
                    value={j.bullets}
                    onChange={e=>updateJob(j.id, { bullets: e.target.value })}
                  />
                </label>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => duplicateJob(j.id)}>Duplicate</button>
                <button type="button" className="btn btn-outline" onClick={() => removeJob(j.id)} disabled={jobs.length===1}>Remove</button>
              </div>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="button" className="btn" onClick={addJob}>+ Add role</button>
          </div>
        </section>

        {/* EDUCATION */}
        <section>
          <h2>Education</h2>
          <div className="grid-2">
            <label className="form-group">
              <span>Institution</span>
              <input value={edu.institution} onChange={e=>setEdu(p=>({ ...p, institution:e.target.value }))}/>
            </label>
            <label className="form-group">
              <span>Location</span>
              <input value={edu.location} onChange={e=>setEdu(p=>({ ...p, location:e.target.value }))}/>
            </label>
            <label className="form-group">
              <span>Degree</span>
              <input value={edu.degree} onChange={e=>setEdu(p=>({ ...p, degree:e.target.value }))}/>
            </label>
            <label className="form-group">
              <span>Field</span>
              <input value={edu.field} onChange={e=>setEdu(p=>({ ...p, field:e.target.value }))}/>
            </label>
            <div className="grid-2">
              <label className="form-group">
                <span>Graduation</span>
                <div className="inline">
                  <select value={edu.gradMonth} onChange={e=>setEdu(p=>({ ...p, gradMonth:e.target.value }))}>
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                  <select value={edu.gradYear} onChange={e=>setEdu(p=>({ ...p, gradYear:e.target.value }))}>
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section>
          <h2>Skills</h2>
          <textarea className="form-control" rows={4}
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </section>

        {/* SUMMARY */}
        <section>
          <h2>Summary</h2>
          <textarea className="form-control" rows={5}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </section>

        {/* PHOTO */}
        <section>
          <h2>Photo</h2>
          <div className="photo-row">
            <input type="file" accept="image/*" onChange={onPhoto} />
            {photo && (
              <div className="photo-preview">
                <img src={photo} alt="Profile preview" />
                <button className="btn btn-outline" onClick={() => setPhoto("")}>Remove</button>
              </div>
            )}
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            Your photo is stored locally on this device and included in templates that support a profile image.
          </p>
        </section>

        {/* LIVE PREVIEW */}
        <section style={{ marginTop: 24 }}>
          <TemplatePreview data={templateData} initialTemplate={tplId} />
        </section>
      </main>
    </section>
  );
}
