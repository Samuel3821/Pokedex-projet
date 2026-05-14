import React from 'react';
import './Footer.css';
 // Affichage du lien API + Boutton haut de la page
export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWebsite = () => {
    window.open('https://Tyradex.app/', '_blank');
  };

  return (
    <footer className="footer">
      <button className="website-button" onClick={openWebsite}>
        Lien API
      </button>
      <button className="scroll-to-top" onClick={scrollToTop}>
        Haut de la page ↑
      </button>
    </footer>
  );
}