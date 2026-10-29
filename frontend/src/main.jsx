import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import "./styles.css";

function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Vivez le match en direct</p>
        <h1>Le prochain grand moment<br />commence ici.</h1>
        <p>Réservez vos places pour les plus belles affiches de football.</p>
      </section>
      <section className="match-list">
        <div className="section-heading">
          <div><p className="eyebrow">À ne pas manquer</p><h2>Prochains matchs</h2></div>
          <label className="search-field">
            <span className="sr-only">Rechercher un match</span>
            <input type="search" placeholder="Équipe ou compétition" />
          </label>
        </div>
        <div className="empty-state">Les prochains matchs seront bientôt disponibles.</div>
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<main className="page-shell"><h1>Page introuvable</h1></main>} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
