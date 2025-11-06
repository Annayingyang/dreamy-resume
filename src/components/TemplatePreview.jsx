import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Templates
import PastelClassic from "../templates/PastelClassic";
import MinimalMint from "../templates/MinimalMint";
import ElegantDark from "../templates/ElegantDark";
import SerifCream from "../templates/SerifCream";
import ModernSky from "../templates/ModernSky";
import CharcoalPro from "../templates/CharcoalPro";
import LavenderGlow from "../templates/LavenderGlow";
import CoralWarm from "../templates/CoralWarm";
import SlateColumns from "../templates/SlateColumns";
import PhotoLeft from "../templates/PhotoLeft";
import NotionBlocks from "../templates/NotionBlocks";

// --- Reusable avatar for all templates ---
function Avatar({ src, size = 96, shape = "circle", alt = "Profile photo" }) {
  if (!src) return null;
  const radius = shape === "circle" ? "999px" : shape === "rounded" ? "16px" : "0px";
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        objectFit: "cover",
        display: "block",
        border: "2px solid rgba(197,182,245,0.45)",
        boxShadow: "0 4px 12px rgba(197,182,245,0.25)",
        background: "#fff",
      }}
    />
  );
}

// Map template ids to components
const TEMPLATE_MAP = {
  pastel: PastelClassic,
  mint: MinimalMint,
  dark: ElegantDark,
  "serif-cream": SerifCream,
  "modern-sky": ModernSky,
  "charcoal-pro": CharcoalPro,
  "lavender-glow": LavenderGlow,
  "coral-warm": CoralWarm,
  "slate-columns": SlateColumns,
  "photo-left": PhotoLeft,
  "notion-blocks": NotionBlocks,
};

const TEMPLATE_OPTIONS = [
  { value: "pastel", label: "Pastel Classic" },
  { value: "mint", label: "Minimal Mint" },
  { value: "dark", label: "Elegant Dark" },
  { value: "serif-cream", label: "Serif Cream" },
  { value: "modern-sky", label: "Modern Sky" },
  { value: "charcoal-pro", label: "Charcoal Pro" },
  { value: "lavender-glow", label: "Lavender Glow" },
  { value: "coral-warm", label: "Coral Warm" },
  { value: "slate-columns", label: "Slate Columns" },
  { value: "photo-left", label: "Photo Left" },
  { value: "notion-blocks", label: "Notion Blocks" },
];

export default function TemplatePreview({ data, initialTemplate = "pastel", hideSelector = false }) {
  const [template, setTemplate] = useState(initialTemplate);
  const printRef = useRef(null);

  // keep in sync if parent changes the initial template (e.g., via URL)
  useEffect(() => setTemplate(initialTemplate), [initialTemplate]);

  const handlePdf = async () => {
    const element = printRef.current;
    if (!element) return;

    // ensure capture at good quality
    const canvas = await html2canvas(element, {
      scale: 2,           // bump to 2x for sharper PDF
      backgroundColor: null,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${(data.fullName || "resume").replace(/\s+/g, "_")}.pdf`);
  };

  const Comp = TEMPLATE_MAP[template] || PastelClassic;

  return (
    <>
      {!hideSelector && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ marginRight: 8 }}>Choose Template:</label>
          <select value={template} onChange={(e) => setTemplate(e.target.value)}>
            {TEMPLATE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* A4 content area — keep width stable for clean PDF */}
      <div ref={printRef} style={{ display: "grid", placeItems: "center", width: "100%" }}>
        {/* Pass Avatar so templates can render data.photo */}
        <Comp data={data} Avatar={Avatar} />
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button className="btn btn-primary" onClick={handlePdf}>Download PDF</button>
      </div>
    </>
  );
}
