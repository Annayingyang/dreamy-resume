
import React, { useRef, useState } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PastelClassic from "../templates/PastelClassic";
import MinimalMint from "../templates/MinimalMint";
import ElegantDark from "../templates/ElegantDark";

export default function TemplatePreview({ data, initialTemplate = "pastel" }) {
  const [template, setTemplate] = useState(initialTemplate);
  const printRef = useRef(null);


  const handlePdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${(data.fullName || "resume").replace(/\s+/g, "_")}.pdf`);
  };


  const renderTemplate = () => {
    if (template === "mint") return <MinimalMint data={data} />;
    if (template === "dark") return <ElegantDark data={data} />;
    return <PastelClassic data={data} />;
  };

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Choose Template:</label>
        <select value={template} onChange={e => setTemplate(e.target.value)}>
          <option value="pastel">Pastel Classic</option>
          <option value="mint">Minimal Mint</option>
          <option value="dark">Elegant Dark</option>
        </select>
      </div>

      <div ref={printRef} style={{ display: "grid", placeItems: "center" }}>
        {renderTemplate()}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button className="btn btn-primary" onClick={handlePdf}>Download PDF</button>
        
      </div>
    </>
  );
}
