import React, { useState, useEffect } from 'react';
import { projects } from '../../data/projects';

/* ============================================================
   Preloader.jsx - Cinematic Brutalist Entrance with Real Asset Preloading
   Preloads & GPU-decodes all project textures before shutter reveal
   ============================================================ */

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let loadedAssets = 0;
    const totalAssets = Math.max(projects.length, 1);

    // Preload & GPU-decode all project assets
    projects.forEach((proj) => {
      if (!proj.image) {
        loadedAssets++;
        return;
      }
      const img = new Image();
      img.src = proj.image;
      if (img.decode) {
        img.decode()
          .then(() => { if (!isCancelled) loadedAssets++; })
          .catch(() => { if (!isCancelled) loadedAssets++; });
      } else {
        img.onload = () => { if (!isCancelled) loadedAssets++; };
        img.onerror = () => { if (!isCancelled) loadedAssets++; };
      }
    });

    const startTime = performance.now();
    const minDuration = 850; // Duración base cinematográfica elegante

    const tick = (now) => {
      if (isCancelled) return;
      const elapsed = now - startTime;
      const timeRatio = Math.min(elapsed / minDuration, 1);
      const assetRatio = Math.min(loadedAssets / totalAssets, 1);

      // El progreso combina el avance temporal y la carga real de texturas
      const rawProgress = Math.min(timeRatio, 0.4 + assetRatio * 0.6);
      const eased = Math.pow(rawProgress, 1.25);
      const current = Math.floor(eased * 100);

      setProgress(current);

      if (timeRatio >= 1 && assetRatio >= 1) {
        setProgress(100);
        setIsFinishing(true);
        setTimeout(() => {
          if (!isCancelled) {
            setIsComplete(true);
            onComplete?.();
          }
        }, 380);
      } else {
        requestAnimationFrame(tick);
      }
    };

    const frameId = requestAnimationFrame(tick);
    return () => {
      isCancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, [onComplete]);

  if (isComplete) return null;

  return (
    <div
      className={`preloader-overlay ${isFinishing ? 'is-finishing' : ''}`}
      aria-hidden="true"
    >
      <style>{`
        .preloader-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background-color: #050505;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          user-select: none;
          pointer-events: auto;
          transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.45s ease;
        }

        .preloader-overlay.is-finishing {
          opacity: 0;
          transform: scale(1.035);
          filter: blur(4px);
          pointer-events: none;
        }

        /* 4 corner brackets matching the portfolio frame */
        .preloader-corners {
          position: absolute;
          inset: 20px;
          pointer-events: none;
        }
        .preloader-corner {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: var(--acid-green);
          border-style: solid;
          opacity: 0.7;
        }
        .preloader-corner.tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
        .preloader-corner.tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
        .preloader-corner.bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
        .preloader-corner.br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

        .preloader-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: min(90vw, 440px);
          padding: 0 20px;
        }

        .preloader-tag {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--acid-green);
          margin-bottom: 18px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .preloader-tag-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--acid-green);
          box-shadow: 0 0 8px var(--acid-green);
          animation: preloader-pulse 1s infinite alternate ease-in-out;
        }

        @keyframes preloader-pulse {
          from { opacity: 0.3; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1.15); }
        }

        .preloader-number-wrapper {
          display: flex;
          align-items: baseline;
          justify-content: center;
          font-family: var(--font-serif);
          font-size: clamp(64px, 14vw, 110px);
          line-height: 0.95;
          color: #ffffff;
          font-weight: 300;
          letter-spacing: -2px;
          margin-bottom: 22px;
        }

        .preloader-percent {
          font-family: var(--font-mono);
          font-size: clamp(18px, 4vw, 28px);
          color: var(--acid-green);
          letter-spacing: 1px;
          margin-left: 6px;
        }

        /* Loading Progress Line */
        .preloader-bar-bg {
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
          position: relative;
          overflow: hidden;
          margin-bottom: 22px;
        }

        .preloader-bar-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: var(--acid-green);
          box-shadow: 0 0 10px rgba(223, 255, 0, 0.7);
          transition: width 0.06s linear;
        }

        .preloader-brand {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: 6px;
        }

        .preloader-sub {
          font-family: var(--font-mono);
          font-size: 8.5px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35);
        }

        @media (max-width: 640px) {
          .preloader-corners { inset: 10px; }
          .preloader-corner { width: 10px; height: 10px; }
          .preloader-tag { font-size: 8.5px; letter-spacing: 2px; }
        }
      `}</style>

      {/* Frame corners */}
      <div className="preloader-corners">
        <div className="preloader-corner tl" />
        <div className="preloader-corner tr" />
        <div className="preloader-corner bl" />
        <div className="preloader-corner br" />
      </div>

      <div className="preloader-center">
        <div className="preloader-tag">
          <span className="preloader-tag-dot" />
          <span>INITIALIZING DIGITAL SPACE</span>
        </div>

        <div className="preloader-number-wrapper">
          <span>{String(progress).padStart(2, '0')}</span>
          <span className="preloader-percent">%</span>
        </div>

        <div className="preloader-bar-bg">
          <div
            className="preloader-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="preloader-brand">
          RODRIGO VALENZUELA
        </div>
        <div className="preloader-sub">
          CREATIVE FRONTEND & ARCHITECTURE // 2026
        </div>
      </div>
    </div>
  );
}
