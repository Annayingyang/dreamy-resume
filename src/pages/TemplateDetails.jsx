import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import TemplatePreview from "../components/TemplatePreview";
import "../style/TemplateDetails.css"; // <<-- import your new CSS file

const MONTHS = ["Month","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const YEARS  = ["Year", ...Array.from({length: 51}, (_,i)=> String(2025 - i))];

export default function TemplateDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { addFavourite } = useApp();

  const initialStyle = location.state?.style || "pastel";
  const [template] = useState(initialStyle);

  const [loading, setLoading] = useState(true);
  const [tplName, setTplName] = useState("Template");
  const [step, setStep] = useState(1);

 
  const [heading, setHeading] = useState({
    name: "Nomvula",
    surname: "Dlamini",
    role: "Senior Sales Manager",
    city: "Durban",
    province: "Free State",
    postal: "4057",
    phone: "071 567 8901",
    email: "nomvula.dlamini@email.com",
  });

  const [job, setJob] = useState({
    title: "Sales Manager",
    employer: "Bloemfontein Agricultural Cooperative",
    location: "Bloemfontein",
    startMonth: "Jan",
    startYear: "2023",
    endMonth: "Dec",
    endYear: "2024",
    bullets: "Grew regional sales by 18%\nLed 6-person team\nClosed R3m+ per quarter"
  });

  const [edu, setEdu] = useState({
    institution: "Durban University of Technology",
    location: "Durban, South Africa",
    degree: "Bachelors",
    field: "Business Administration",
    gradMonth: "Nov",
    gradYear: "2019",
  });

  const [skills, setSkills] = useState(
    "Client Relations, CRM, Sales Strategy, Presentation, Negotiation"
  );
  const [summary, setSummary] = useState(
    "Dynamic sales leader with a track record of growth and client success. Blends data-driven decisions with empathetic leadership."
  );

  // fake fetch for template title
  useEffect(() => {
    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/photos/${id}`)
      .then(r=>r.json())
      .then(p=> setTplName((p?.title || "Template").slice(0,28)))
      .finally(()=>setLoading(false));
  }, [id]);

  // build preview data
  const templateData = useMemo(() => {
    const fullName = `${heading.name} ${heading.surname}`.trim();
    const contactLine = `${heading.city}, ${heading.province} ${heading.postal}`.trim();
    const skillList = skills.split(/[,|\n]/g).map(s => s.trim()).filter(Boolean);
    const jobPoints = job.bullets.split(/\n/g).map(s => s.trim()).filter(Boolean);
    const dates = `${job.startMonth} ${job.startYear} – ${job.endMonth} ${job.endYear}`;

    return {
      fullName,
      role: heading.role,
      summary,
      contacts: [heading.email, heading.phone, contactLine],
      skills: skillList,
      experience: [
        {
          title: job.title,
          company: job.employer,
          dates,
          points: jobPoints,
        },
      ],
      education: [
        {
          line: `${edu.degree} • ${edu.field} — ${edu.institution}, ${edu.location} (${edu.gradMonth} ${edu.gradYear})`
        }
      ]
    };
  }, [heading, job, edu, skills, summary]);

  const saveFav = () => {
    addFavourite({ id: Number(id), name: `${heading.name} ${heading.surname} – ${heading.role}` });
    alert("Saved to favourites!");
  };

  if (loading) return <section className="card"><div className="skeleton" style={{height:240}}/></section>;

  return (
    <section className="card" style={{padding:0}}>
      <div style={{display:"grid", gridTemplateColumns:"260px 1fr", minHeight:520}}>
        
        {/* ==== LEFT STEPPER ==== */}
        <aside className="stepper">
          <h3>Dreamy</h3>
          <ol>
            {["Heading","Work history","Education","Skills","Summary","Finalize"].map((label,i)=>(
              <li key={label} className={step===i+1 ? "active" : ""}>
                <span>{i+1}</span>
                <span>{label}</span>
              </li>
            ))}
          </ol>
        </aside>

        {/* ==== RIGHT: FORMS + PREVIEW ==== */}
        <div style={{padding:24}}>
          <h1>{tplName}</h1>

          {/* STEP 1 */}
          {step===1 && (
            <div>
              <h2>Heading</h2>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" className="form-control"
                  value={heading.name}
                  onChange={e=>setHeading(prev=>({...prev, name:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label htmlFor="surname">Surname</label>
                <input id="surname" className="form-control"
                  value={heading.surname}
                  onChange={e=>setHeading(prev=>({...prev, surname:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <input id="role" className="form-control"
                  value={heading.role}
                  onChange={e=>setHeading(prev=>({...prev, role:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input id="city" className="form-control"
                  value={heading.city}
                  onChange={e=>setHeading(prev=>({...prev, city:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label htmlFor="province">Province</label>
                <input id="province" className="form-control"
                  value={heading.province}
                  onChange={e=>setHeading(prev=>({...prev, province:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label htmlFor="postal">Postal</label>
                <input id="postal" className="form-control"
                  value={heading.postal}
                  onChange={e=>setHeading(prev=>({...prev, postal:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input id="phone" className="form-control"
                  value={heading.phone}
                  onChange={e=>setHeading(prev=>({...prev, phone:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" className="form-control"
                  value={heading.email}
                  onChange={e=>setHeading(prev=>({...prev, email:e.target.value}))}/>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step===2 && (
            <div>
              <h2>Work History</h2>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input id="title" className="form-control"
                  value={job.title}
                  onChange={e=>setJob(prev=>({...prev, title:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label htmlFor="employer">Employer</label>
                <input id="employer" className="form-control"
                  value={job.employer}
                  onChange={e=>setJob(prev=>({...prev, employer:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label htmlFor="jobLocation">Location</label>
                <input id="jobLocation" className="form-control"
                  value={job.location}
                  onChange={e=>setJob(prev=>({...prev, location:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label>Start</label>
                <select value={job.startMonth} onChange={e=>setJob(prev=>({...prev,startMonth:e.target.value}))}>
                  {MONTHS.map(m=><option key={m}>{m}</option>)}
                </select>
                <select value={job.startYear} onChange={e=>setJob(prev=>({...prev,startYear:e.target.value}))}>
                  {YEARS.map(y=><option key={y}>{y}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>End</label>
                <select value={job.endMonth} onChange={e=>setJob(prev=>({...prev,endMonth:e.target.value}))}>
                  {MONTHS.map(m=><option key={m}>{m}</option>)}
                </select>
                <select value={job.endYear} onChange={e=>setJob(prev=>({...prev,endYear:e.target.value}))}>
                  {YEARS.map(y=><option key={y}>{y}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="bullets">Key Achievements</label>
                <textarea id="bullets" className="form-control" rows={4}
                  value={job.bullets}
                  onChange={e=>setJob(prev=>({...prev, bullets:e.target.value}))}/>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step===3 && (
            <div>
              <h2>Education</h2>
              <div className="form-group">
                <label htmlFor="institution">Institution</label>
                <input id="institution" className="form-control"
                  value={edu.institution}
                  onChange={e=>setEdu(prev=>({...prev, institution:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label htmlFor="eduLocation">Location</label>
                <input id="eduLocation" className="form-control"
                  value={edu.location}
                  onChange={e=>setEdu(prev=>({...prev, location:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label htmlFor="degree">Degree</label>
                <input id="degree" className="form-control"
                  value={edu.degree}
                  onChange={e=>setEdu(prev=>({...prev, degree:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label htmlFor="field">Field</label>
                <input id="field" className="form-control"
                  value={edu.field}
                  onChange={e=>setEdu(prev=>({...prev, field:e.target.value}))}/>
              </div>
              <div className="form-group">
                <label>Graduation</label>
                <select value={edu.gradMonth} onChange={e=>setEdu(prev=>({...prev,gradMonth:e.target.value}))}>
                  {MONTHS.map(m=><option key={m}>{m}</option>)}
                </select>
                <select value={edu.gradYear} onChange={e=>setEdu(prev=>({...prev,gradYear:e.target.value}))}>
                  {YEARS.map(y=><option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step===4 && (
            <div>
              <h2>Skills</h2>
              <textarea className="form-control" rows={4}
                value={skills}
                onChange={e=>setSkills(e.target.value)}/>
            </div>
          )}

          {/* STEP 5 */}
          {step===5 && (
            <div>
              <h2>Summary</h2>
              <textarea className="form-control" rows={5}
                value={summary}
                onChange={e=>setSummary(e.target.value)}/>
            </div>
          )}

          {/* STEP 6 */}
          {step===6 && (
            <div>
              <h2>Finalize</h2>
              <button className="btn btn-outline" onClick={saveFav}>Save to favourites</button>
            </div>
          )}

          {/* NAVIGATION */}
          <div style={{display:"flex", gap:12, justifyContent:"flex-end", marginTop:16}}>
            {step>1 && <button className="btn btn-outline" onClick={()=>setStep(s=>s-1)}>Back</button>}
            {step<6 && <button className="btn btn-primary" onClick={()=>setStep(s=>s+1)}>Next</button>}
          </div>

          {/* PREVIEW */}
          <div style={{marginTop:24}}>
            <TemplatePreview data={templateData} initialTemplate={template} />
          </div>
        </div>
      </div>
    </section>
  );
}
