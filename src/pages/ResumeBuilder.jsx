import React, { useState } from "react";
import TemplatePreview from "../components/TemplatePreview";

export default function ResumeBuilder() {
  const [step, setStep] = useState(1);

  // all form fields go here
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    role: "",
    city: "",
    province: "",
    postal: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
      {/* === LEFT SIDEBAR === */}
      <aside style={{ background: "#0f172a", color: "#fff", padding: 20 }}>
        <h3>Steps</h3>
        <ol style={{ paddingLeft: 16 }}>
          <li style={{ fontWeight: step === 1 ? "bold" : "normal" }}>Heading</li>
          <li style={{ fontWeight: step === 2 ? "bold" : "normal" }}>Work history</li>
          <li style={{ fontWeight: step === 3 ? "bold" : "normal" }}>Education</li>
          <li style={{ fontWeight: step === 4 ? "bold" : "normal" }}>Skills</li>
          <li style={{ fontWeight: step === 5 ? "bold" : "normal" }}>Summary</li>
          <li style={{ fontWeight: step === 6 ? "bold" : "normal" }}>Finalize</li>
        </ol>
      </aside>

      {/* === MAIN FORM + PREVIEW === */}
      <section style={{ background: "#fff", padding: 24, borderRadius: 12 }}>
        {step === 1 && (
          <>
            <h2>Heading</h2>
            <div className="form-grid">
              <input
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                placeholder="Surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
              />
              <input
                placeholder="Profession"
                name="role"
                value={formData.role}
                onChange={handleChange}
              />
              <input
                placeholder="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              <input
                placeholder="Province"
                name="province"
                value={formData.province}
                onChange={handleChange}
              />
              <input
                placeholder="Postal Code"
                name="postal"
                value={formData.postal}
                onChange={handleChange}
              />
              <input
                placeholder="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {/* You’ll add Work History, Education, Skills, etc. as new steps */}

        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          {step > 1 && (
            <button className="btn btn-outline" onClick={prev}>
              Back
            </button>
          )}
          {step < 6 ? (
            <button className="btn btn-primary" onClick={next}>
              Next
            </button>
          ) : (
            <button className="btn btn-success">Finish</button>
          )}
        </div>

        {/* === LIVE TEMPLATE PREVIEW === */}
        <div style={{ marginTop: 32 }}>
          <TemplatePreview
            data={{
              fullName: `${formData.name} ${formData.surname}`,
              role: formData.role,
              summary: "",
              contacts: [
                formData.email,
                formData.phone,
                `${formData.city}, ${formData.province} ${formData.postal}`,
              ],
              skills: [],
              experience: [],
            }}
          />
        </div>
      </section>
    </div>
  );
}
