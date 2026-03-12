import React, { useState, useEffect, useRef } from 'react';
import './styles/index.css';

import BackgroundText from './components/layout/BackgroundText';
import HeaderMeta from './components/layout/HeaderMeta';
import FooterMeta from './components/layout/FooterMeta';
import Carousel from './components/portfolio/Carousel';
import LiquidExpansion from './components/portfolio/LiquidExpansion';
import Navigation from './components/layout/Navigation';
import FloatingParticles from './components/layout/FloatingParticles';
import { projects } from './data/projects';

function App() {
  const [activeProject, setActiveProject] = useState(null);
  const [revealOrigin, setRevealOrigin] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const appRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!appRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      appRef.current.style.setProperty('--mouse-x', `${x}%`);
      appRef.current.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCardClick = (e, project) => {
    setRevealOrigin({ x: e.clientX, y: e.clientY });
    setActiveProject(project);
  };

  const handleCloseDetail = () => {
    setActiveProject(null);
  };

  return (
    <div 
      ref={appRef}
      className="app-root-container" 
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#050505' }}
    >
      <Navigation isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
      
      <div className="viewport-frame">
        {/* Corner Accents */}
        <div className="frame-corner corner-tl" />
        <div className="frame-corner corner-tr" />
        <div className="frame-corner corner-bl" />
        <div className="frame-corner corner-br" />

        <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <FloatingParticles />
          <HeaderMeta onOpenNav={() => setIsNavOpen(true)} />
          
          <div style={{ width: '100%', height: '100%', position: 'absolute', pointerEvents: 'none', zIndex: 0 }}>
            <BackgroundText />
          </div>

          <Carousel projects={projects} onClick={handleCardClick} />

          <FooterMeta />
        </div>
      </div>

      {activeProject && (
        <LiquidExpansion
          project={activeProject}
          origin={revealOrigin}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}

export default App;