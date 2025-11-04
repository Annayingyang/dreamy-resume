// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import FAQs from "./pages/FAQs";
import InterviewTips from "./pages/InterviewTips";
import Account from "./pages/Account";


// NEW imports
import CreateCV from "./pages/CreateCV";
import Templates from "./pages/Templates";
import TemplateDetails from "./pages/TemplateDetails";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCV />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/:id" element={<TemplateDetails />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/interview" element={<InterviewTips />} />
          <Route path="/account" element={<Account />} />
          
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
