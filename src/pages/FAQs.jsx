import React from "react";

export default function FAQs() {
  return (
    <section className="prose card">
      <h1>Frequently Asked Questions</h1>
      <details open>
        <summary>Can I download my CV as PDF?</summary>
        <p>Yes — once you finish editing, click Export → PDF.</p>
      </details>
      <details>
        <summary>Is there a free trial?</summary>
        <p>You can try templates and preview for free.</p>
      </details>
      <details>
        <summary>How do favourites work?</summary>
        <p>Click “Add to favourites” on any template to save it globally.</p>
      </details>
    </section>
  );
}
