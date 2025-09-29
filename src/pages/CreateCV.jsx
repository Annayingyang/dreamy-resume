import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const EXPERIENCE = ["No Experience", "Less Than 3 Years", "3–5 Years", "5–10 Years", "10+ Years"];
const STUDENT = ["Yes", "No"];
const EDUCATION = [
  "Post-Secondary / High School",
  "Technical or Vocational",
  "Related Courses",
  "Certificates or Diplomas",
  "Associates",
  "Bachelors",
  "Masters or Specialized",
  "Doctoral / J.D.",
  "Prefer not to answer"
];

export default function CreateCV() {
  const { cvPrefs, setCvPrefs } = useApp();
  const [experience, setExperience] = useState(cvPrefs.experience);
  const [student, setStudent] = useState(cvPrefs.student);
  const [education, setEducation] = useState(cvPrefs.education);
  const [touched, setTouched] = useState(false);
  const nav = useNavigate();

  const valid = useMemo(() => Boolean(experience && student && education), [experience, student, education]);

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    setCvPrefs({ experience, student, education });
    nav("/templates"); // go to templates after choosing everything
  };

  const Chip = ({ value, current, onChange }) => (
    <button
      type="button"
      className={`btn btn-sm ${current === value ? "btn-primary" : "btn-outline"}`}
      onClick={() => onChange(value)}
      style={{ minWidth: 150 }}
    >
      {value}
    </button>
  );

  const Field = ({ label, hint, options, current, onChange }) => (
    <div className="card" style={{ marginTop: 14 }}>
      <h2 style={{ marginTop: 0 }}>{label}</h2>
      {hint && <p style={{ color: "var(--muted)", marginTop: 4 }}>{hint}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
        {options.map((opt) => (
          <Chip key={opt} value={opt} current={current} onChange={onChange} />
        ))}
      </div>
      {touched && !current && (
        <div className="error" style={{ marginTop: 8 }}>Please choose one option.</div>
      )}
    </div>
  );

  return (
    <form className="container" onSubmit={submit} style={{ display: "grid", gap: 12 }}>
      <section className="card">
        <h1 style={{ marginTop: 0, marginBottom: 6 }}>How long have you been working?</h1>
        <p className="lead">We’ll find the best templates for your experience level.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
          {EXPERIENCE.map((opt) => (
            <Chip key={opt} value={opt} current={experience} onChange={setExperience} />
          ))}
        </div>
        {touched && !experience && <div className="error" style={{ marginTop: 8 }}>Please choose one option.</div>}
      </section>

      <Field
        label="Are you a student?"
        options={STUDENT}
        current={student}
        onChange={setStudent}
      />

      <Field
        label="Select the option that best describes your education level."
        hint="Your education background can help us guide you through relevant sections."
        options={EDUCATION}
        current={education}
        onChange={setEducation}
      />

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button type="submit" className="btn btn-primary" disabled={!valid}>Continue</button>
      </div>
    </form>
  );
}
