import React, { useState, useEffect, useRef, useCallback } from 'react';
import './styles/index.css';

import BackgroundText from './components/layout/BackgroundText';
import HeaderMeta from './components/layout/HeaderMeta';
import FooterMeta from './components/layout/FooterMeta';
import Carousel from './components/portfolio/Carousel';
import LiquidExpansion from './components/portfolio/LiquidExpansion';
import Navigation from './components/layout/Navigation';
import DotField from './components/layout/DotField';
import Preloader from './components/layout/Preloader';
import ArchiveAssistant from './components/assistant/ArchiveAssistant';
import FloatingChatTrigger from './components/assistant/FloatingChatTrigger';
import { projects } from './data/projects';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const [revealOrigin, setRevealOrigin] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const viewportRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // CMD+K / Ctrl+K abre el asistente interactivo
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAssistantOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let rafId = null;
    const handleMouseMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!viewportRef.current) return;
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        viewportRef.current.style.setProperty('--mouse-x', `${x.toFixed(1)}%`);
        viewportRef.current.style.setProperty('--mouse-y', `${y.toFixed(1)}%`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleOpenNav = useCallback(() => {
    setIsNavOpen(true);
  }, []);

  const handleCloseNav = useCallback(() => {
    setIsNavOpen(false);
  }, []);

  const handleOpenAssistant = useCallback(() => {
    setIsAssistantOpen(true);
  }, []);

  const handleCloseAssistant = useCallback(() => {
    setIsAssistantOpen(false);
  }, []);

  const handleCardClick = useCallback((e, project) => {
    setRevealOrigin({ x: e.clientX, y: e.clientY });
    setActiveProject(project);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setActiveProject(null);
  }, []);

  return (
    <div 
      className="app-root-container" 
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#050505' }}
    >
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      <Navigation
        isOpen={isNavOpen}
        onClose={handleCloseNav}
      />
      
      <div ref={viewportRef} className="viewport-frame">
        {/* Corner Accents */}
        <div className="frame-corner corner-tl" />
        <div className="frame-corner corner-tr" />
        <div className="frame-corner corner-bl" />
        <div className="frame-corner corner-br" />

        {/* Fondo interactivo DotField dentro del marco de las 4 esquinas */}
        <DotField
          dotRadius={1.2}
          dotSpacing={22}
          bulgeStrength={75}
          glowRadius={150}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          gradientFrom="rgba(223, 255, 0, 0.16)"
          gradientTo="rgba(255, 255, 255, 0.05)"
          glowColor="rgba(223, 255, 0, 0.06)"
        />

        <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <HeaderMeta
            onOpenNav={handleOpenNav}
            isOpen={isNavOpen}
          />
          
          <div style={{ width: '100%', height: '100%', position: 'absolute', pointerEvents: 'none', zIndex: 0 }}>
            <BackgroundText />
          </div>

          <Carousel projects={projects} onClick={handleCardClick} />

          <FooterMeta />
        </div>
      </div>

      {/* Botón Flotante Interactivo del Asistente (Único disparador minimalista) */}
      <FloatingChatTrigger
        onClick={handleOpenAssistant}
        isVisible={!activeProject && !isNavOpen && !isAssistantOpen}
      />

      {/* Asistente interactivo del archivo Q&A */}
      <ArchiveAssistant
        isOpen={isAssistantOpen}
        onClose={handleCloseAssistant}
      />

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