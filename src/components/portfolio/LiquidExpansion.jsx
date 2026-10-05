import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import { playCloseBlip, playHoverTick } from '../../utils/audioSystem';

/* ============================================================
   LiquidExpansion - Detalle del Proyecto (Ultra-Polished & Zero-Lag Cursor)
   ============================================================ */

const COLS = 8;
const ROWS = 5;
const CLOSE_DURATION = 900;

function getDelay(col, row, originCol, originRow, isClose) {
    const dist = Math.sqrt(Math.pow(col - originCol, 2) + Math.pow(row - originRow, 2));
    const maxDist = Math.sqrt(Math.pow(COLS, 2) + Math.pow(ROWS, 2));
    const normalized = dist / maxDist;
    return isClose ? (1 - normalized) * 380 : normalized * 360;
}

const LiquidExpansion = memo(({ project, origin, onClose }) => {
    const [phase, setPhase] = useState('idle');
    const [uiIn, setUiIn] = useState(false);
    const [mounted, setMounted] = useState(true);

    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const labelRef = useRef(null);
    const posRef = useRef({ x: -100, y: -100, ringX: -100, ringY: -100, isOverImage: false, isOverInteractive: false });

    const originCol = origin ? Math.floor((origin.x / window.innerWidth) * COLS) : Math.floor(COLS / 2);
    const originRow = origin ? Math.floor((origin.y / window.innerHeight) * ROWS) : Math.floor(ROWS / 2);

    const handleClose = useCallback((e) => {
        if (e) e.stopPropagation();
        if (phase !== 'open') return;
        playCloseBlip();
        setUiIn(false);
        setPhase('closing');
        setTimeout(() => setMounted(false), CLOSE_DURATION);
        setTimeout(onClose, CLOSE_DURATION);
    }, [phase, onClose]);

    // Entrada progresiva coordinada con la animación de celdas
    useEffect(() => {
        if (!project || !origin) return;
        const t0 = setTimeout(() => setPhase('open'), 20);
        const t1 = setTimeout(() => setUiIn(true), 400);
        return () => { clearTimeout(t0); clearTimeout(t1); };
    }, [project, origin]);

    // Tecla ESC para cerrar rápidamente
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && phase === 'open') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [phase, handleClose]);

    // Cursor personalizado de ALTO RENDIMIENTO (60/120fps rAF + Cero Lag)
    useEffect(() => {
        const p = posRef.current;
        let rafId = null;

        const onMouseMove = (e) => {
            p.x = e.clientX;
            p.y = e.clientY;
            // El punto central se mueve INSTANTÁNEAMENTE sin lag
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
            }
        };

        const tick = () => {
            // El anillo exterior sigue con inercia suave (lerp fluido sin trabas)
            const dx = p.x - p.ringX;
            const dy = p.y - p.ringY;
            p.ringX += dx * 0.24;
            p.ringY += dy * 0.24;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${p.ringX}px, ${p.ringY}px, 0)`;
            }

            rafId = requestAnimationFrame(tick);
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        rafId = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    const handleVisit = () => {
        if (phase !== 'open' || !project.url) return;
        const a = document.createElement('a');
        a.href = project.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.click();
    };

    const setCursorHoverState = (isImage) => {
        posRef.current.isOverImage = isImage;
        if (ringRef.current) {
            if (isImage) {
                ringRef.current.classList.add('is-hovering-image');
            } else {
                ringRef.current.classList.remove('is-hovering-image');
            }
        }
        if (labelRef.current) {
            labelRef.current.textContent = isImage && project.url ? 'VISIT ↗' : isImage ? 'VIEW _' : '';
        }
    };

    if (!project || !origin || !mounted) return null;

    const isClosing = phase === 'closing';
    const isOpen = phase === 'open';

    const cells = [];
    for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
            cells.push({ col: c, row: r });

    return (
        <>
            <style>{`
            .le-root {
                position: fixed; 
                inset: 0;
                z-index: 100;
                pointer-events: none;
                cursor: default;
                background-color: #050505;
                overflow: hidden;
            }
            .le-root.is-open { 
                pointer-events: auto; 
            }

            /* ── Cursors Fluidos Hardware-Accelerated (Zero Lag) ── */
            .le-cursor-dot {
                position: fixed;
                top: -3px;
                left: -3px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #ffffff;
                pointer-events: none;
                z-index: 500;
                will-change: transform;
                box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
                transition: opacity 0.2s ease;
            }

            .le-cursor-ring {
                position: fixed;
                top: -20px;
                left: -20px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 1px solid rgba(223, 255, 0, 0.4);
                background: rgba(223, 255, 0, 0.04);
                pointer-events: none;
                z-index: 499;
                will-change: transform;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                            height 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                            border-color 0.25s ease, 
                            background 0.25s ease,
                            border-radius 0.25s ease;
            }

            .le-cursor-ring.is-hovering-image {
                width: 100px;
                height: 38px;
                border-radius: 999px;
                top: -19px;
                left: -50px;
                background: rgba(10, 10, 10, 0.88);
                border: 1px solid var(--acid-green);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7), 0 0 16px rgba(223, 255, 0, 0.3);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
            }

            .le-cursor-label {
                font-family: var(--font-mono);
                font-size: 10px;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                color: var(--acid-green);
                font-weight: 600;
                opacity: 0;
                transform: scale(0.85);
                transition: opacity 0.2s ease, transform 0.2s ease;
                white-space: nowrap;
                user-select: none;
            }

            .le-cursor-ring.is-hovering-image .le-cursor-label {
                opacity: 1;
                transform: scale(1);
            }

            /* ── Ambient Glow Background ── */
            .le-ambient-glow {
                position: absolute;
                inset: 0;
                pointer-events: none;
                background: radial-gradient(circle at 50% 45%, rgba(223, 255, 0, 0.045) 0%, rgba(5, 5, 5, 0.8) 55%, #050505 100%);
                z-index: 1;
            }

            /* ── Outer Viewport Frame (Coherente con la pantalla principal) ── */
            .le-frame-corners {
                position: absolute;
                inset: 20px;
                pointer-events: none;
                z-index: 40;
                border: 1px solid rgba(255, 255, 255, 0.06);
            }
            .le-corner {
                position: absolute;
                width: 12px;
                height: 12px;
                border-color: var(--acid-green);
                border-style: solid;
                opacity: 0.65;
            }
            .le-corner-tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
            .le-corner-tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
            .le-corner-bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
            .le-corner-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

            /* ── Top Header Navigation Bar ── */
            .le-top-bar {
                position: absolute;
                top: 36px;
                left: 45px;
                right: 45px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                z-index: 60;
                pointer-events: auto;
                opacity: 0;
                transform: translateY(-12px);
                transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
            }
            .le-top-bar.in {
                opacity: 1;
                transform: translateY(0);
            }

            .le-top-meta {
                display: flex;
                align-items: center;
                gap: 16px;
                font-family: var(--font-mono);
                font-size: 10px;
                letter-spacing: 2px;
                color: rgba(255, 255, 255, 0.5);
            }
            .le-top-tag {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                color: var(--acid-green);
                background: rgba(223, 255, 0, 0.08);
                border: 1px solid rgba(223, 255, 0, 0.2);
                border-radius: 999px;
                padding: 4px 12px;
                font-weight: 500;
            }
            .le-top-tag-dot {
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: var(--acid-green);
                box-shadow: 0 0 6px var(--acid-green);
                animation: le-pulse 2s infinite ease-in-out;
            }
            @keyframes le-pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.4; transform: scale(0.8); }
            }

            .le-close-btn {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 8px 18px;
                background: rgba(20, 20, 20, 0.7);
                backdrop-filter: blur(14px);
                -webkit-backdrop-filter: blur(14px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 999px;
                color: #ffffff;
                font-family: var(--font-mono);
                font-size: 10px;
                letter-spacing: 2px;
                cursor: pointer;
                transition: all 0.25s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            }
            .le-close-btn:hover {
                background: var(--acid-green);
                border-color: var(--acid-green);
                color: #000000;
                transform: translateY(-1px) scale(1.03);
                box-shadow: 0 0 20px rgba(223, 255, 0, 0.4);
            }
            .le-close-btn:hover .le-close-icon {
                color: #000000;
            }
            .le-close-btn:hover .le-close-esc {
                background: rgba(0, 0, 0, 0.2);
                color: #000000;
                border-color: rgba(0, 0, 0, 0.3);
            }
            .le-close-icon {
                font-size: 13px;
                line-height: 1;
                color: var(--acid-green);
                transition: color 0.25s ease;
            }
            .le-close-esc {
                font-size: 8px;
                padding: 1px 5px;
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                color: rgba(255, 255, 255, 0.5);
                letter-spacing: 1px;
                transition: all 0.25s ease;
            }

            /* ── Main Content Container & Image Stage ── */
            .le-content-container {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 11vh 8vw 20vh;
                z-index: 10;
            }

            .le-img-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                max-width: 1300px;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 30px 90px rgba(0, 0, 0, 0.95), 0 0 1px rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: #0d0d0d;
                cursor: pointer;
                transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), 
                            border-color 0.3s ease, 
                            box-shadow 0.4s ease;
            }
            .le-img-wrapper:hover {
                border-color: rgba(223, 255, 0, 0.4);
                box-shadow: 0 40px 100px rgba(0, 0, 0, 0.95), 0 0 25px rgba(223, 255, 0, 0.2);
            }

            .le-image-layer {
                width: 100%;
                height: 100%;
                position: relative;
                overflow: hidden;
            }
            .le-image-layer img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease;
            }
            .le-img-wrapper:hover .le-image-layer img {
                transform: scale(1.025);
                filter: brightness(1.05);
            }

            /* Technical HUD badge on image */
            .le-img-hud-badge {
                position: absolute;
                top: 18px;
                left: 20px;
                padding: 4px 10px;
                background: rgba(0, 0, 0, 0.65);
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 6px;
                font-family: var(--font-mono);
                font-size: 9px;
                letter-spacing: 1.5px;
                color: rgba(255, 255, 255, 0.8);
                pointer-events: none;
                z-index: 2;
            }

            /* ── Bottom Info Bar (Luxury Frosted Glass HUD) ── */
            .le-bottom-hud {
                position: absolute;
                bottom: 30px;
                left: 45px;
                right: 45px;
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 30px;
                padding: 22px 32px;
                background: rgba(12, 12, 12, 0.82);
                backdrop-filter: blur(24px);
                -webkit-backdrop-filter: blur(24px);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 18px;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.08);
                z-index: 60;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
            }
            .le-bottom-hud.in {
                opacity: 1;
                transform: translateY(0);
            }

            .le-left {
                display: flex;
                flex-direction: column;
                gap: 6px;
                max-width: 65%;
            }

            .le-category-row {
                display: flex;
                align-items: center;
                gap: 12px;
                font-family: var(--font-mono);
                font-size: 9.5px;
                letter-spacing: 3px;
                text-transform: uppercase;
                color: var(--acid-green);
                font-weight: 500;
            }
            .le-category-divider {
                width: 24px;
                height: 1px;
                background: rgba(223, 255, 0, 0.35);
            }

            .le-title {
                font-family: var(--font-serif);
                font-size: clamp(26px, 4.2vw, 52px);
                font-weight: 400;
                color: #ffffff;
                line-height: 1.1;
                letter-spacing: -0.5px;
                margin: 2px 0 6px;
            }

            .le-description {
                color: rgba(255, 255, 255, 0.65);
                font-size: 11.5px;
                line-height: 1.65;
                font-family: var(--font-mono);
                max-width: 680px;
                font-weight: 300;
            }

            .le-right {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 12px;
                flex-shrink: 0;
            }

            .le-specs-pill {
                display: flex;
                align-items: center;
                gap: 14px;
                font-family: var(--font-mono);
                font-size: 9px;
                letter-spacing: 1.5px;
                color: rgba(255, 255, 255, 0.45);
            }
            .le-specs-pill span {
                color: #ffffff;
            }

            .le-action-cta {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 10px 24px;
                background: var(--acid-green);
                border: 1px solid var(--acid-green);
                border-radius: 999px;
                color: #000000;
                font-family: var(--font-mono);
                font-size: 10.5px;
                letter-spacing: 1.8px;
                font-weight: 700;
                text-decoration: none;
                cursor: pointer;
                transition: all 0.25s ease;
                box-shadow: 0 0 16px rgba(223, 255, 0, 0.3);
            }
            .le-action-cta:hover {
                background: #ffffff;
                border-color: #ffffff;
                color: #000000;
                transform: translateY(-2px);
                box-shadow: 0 0 24px rgba(255, 255, 255, 0.5);
            }

            .le-action-cta--disabled {
                background: rgba(255, 255, 255, 0.05);
                border-color: rgba(255, 255, 255, 0.15);
                color: rgba(255, 255, 255, 0.4);
                cursor: default;
                box-shadow: none;
            }

            /* ── Grid Transition System ── */
            .le-grid {
                position: absolute;
                inset: 0;
                display: grid;
                grid-template-columns: repeat(${COLS}, 1fr);
                grid-template-rows: repeat(${ROWS}, 1fr);
                pointer-events: none;
                z-index: 80;
            }
            .le-cell {
                background: #050505;
                transform: scale(1.02);
                will-change: transform, opacity;
            }
            .le-cell.animating-in {
                animation: le-cell-open var(--dur) cubic-bezier(0.76, 0, 0.24, 1) var(--delay) forwards;
            }
            .le-cell.animating-out {
                animation: le-cell-close var(--dur) cubic-bezier(0.76, 0, 0.24, 1) var(--delay) forwards;
            }
            @keyframes le-cell-open { 
                to { transform: scale(0); opacity: 0; } 
            }
            @keyframes le-cell-close { 
                from { transform: scale(0); opacity: 0; } 
                to { transform: scale(1.02); opacity: 1; } 
            }

            /* ── Responsive Tablet & Mobile ── */
            @media (max-width: 1024px) {
                .le-content-container { padding: 12vh 6vw 22vh; }
                .le-top-bar { left: 30px; right: 30px; top: 28px; }
                .le-bottom-hud { left: 30px; right: 30px; bottom: 25px; padding: 18px 24px; }
                .le-left { max-width: 60%; }
            }

            @media (max-width: 768px) {
                .le-content-container { padding: 10vh 5vw 32vh; }
                .le-top-bar { left: 20px; right: 20px; top: 20px; }
                .le-top-meta { display: none; }
                .le-frame-corners { inset: 10px; }
                
                .le-bottom-hud {
                    left: 16px;
                    right: 16px;
                    bottom: 16px;
                    flex-direction: column;
                    align-items: stretch;
                    gap: 16px;
                    padding: 18px 20px;
                }
                .le-left { max-width: 100%; }
                .le-title { font-size: 26px; }
                .le-description { font-size: 10.5px; line-height: 1.5; }
                .le-right {
                    align-items: stretch;
                    width: 100%;
                    padding-top: 12px;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }
                .le-specs-pill { justify-content: space-between; }
                .le-action-cta { justify-content: center; }
                
                /* En móvil deshabilitamos el cursor custom para usar touch nativo */
                .le-cursor-dot, .le-cursor-ring { display: none !important; }
            }

            @media (max-width: 480px) {
                .le-content-container { padding: 8vh 3vw 36vh; }
                .le-title { font-size: 22px; }
                .le-description { 
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            }
            `}</style>

            {/* Custom Fluid Cursor (Hardware Accelerated) */}
            <div ref={dotRef} className="le-cursor-dot" />
            <div ref={ringRef} className="le-cursor-ring">
                <span ref={labelRef} className="le-cursor-label" />
            </div>

            <div className={`le-root${isOpen ? ' is-open' : ''}`}>
                {/* Background Ambient Glow */}
                <div className="le-ambient-glow" />

                {/* Viewport Framing Corner Brackets */}
                <div className="le-frame-corners">
                    <div className="le-corner le-corner-tl" />
                    <div className="le-corner le-corner-tr" />
                    <div className="le-corner le-corner-bl" />
                    <div className="le-corner le-corner-br" />
                </div>

                {/* Top Navigation Bar */}
                <div className={`le-top-bar${uiIn ? ' in' : ''}`}>
                    <div className="le-top-meta">
                        <span className="le-top-tag">
                            <span className="le-top-tag-dot" />
                            PROJECT ARCHIVE // {String(project.id || 1).padStart(2, '0')}
                        </span>
                        <span>{project.year || '2026'} © RODRIGO PORTFOLIO</span>
                    </div>

                    <button 
                        type="button" 
                        className="le-close-btn" 
                        onClick={handleClose}
                        onMouseEnter={playHoverTick}
                        aria-label="Close Project Detail"
                    >
                        <span className="le-close-icon">✕</span>
                        <span>CLOSE</span>
                        <span className="le-close-esc">ESC</span>
                    </button>
                </div>

                {/* Hero Image Showcase */}
                <div className="le-content-container">
                    <div 
                        className="le-img-wrapper" 
                        onClick={handleVisit}
                        onMouseEnter={() => setCursorHoverState(true)}
                        onMouseLeave={() => setCursorHoverState(false)}
                    >
                        <div className="le-img-hud-badge">
                            ARCHIVE // {String(project.id || 1).padStart(2, '0')} · {project.year || '2026'}
                        </div>
                        <div className="le-image-layer">
                            <img
                                src={project.image}
                                alt={project.title}
                            />
                        </div>
                    </div>
                </div>

                {/* Liquid Grid Reveal Transition */}
                <div className="le-grid">
                    {cells.map(({ col, row }) => (
                        <div
                            key={`${col}-${row}`}
                            className={`le-cell ${isOpen && !isClosing ? 'animating-in' : isClosing ? 'animating-out' : ''}`}
                            style={{
                                '--delay': `${getDelay(col, row, originCol, originRow, isClosing)}ms`,
                                '--dur': isClosing ? '0.5s' : '0.45s'
                            }}
                        />
                    ))}
                </div>

                {/* Bottom Editorial HUD Panel */}
                <div className={`le-bottom-hud${uiIn ? ' in' : ''}`}>
                    <div className="le-left">
                        <div className="le-category-row">
                            <span>{project.category}</span>
                            <div className="le-category-divider" />
                            <span>INDEX #{String(project.id || 1).padStart(2, '0')}</span>
                        </div>
                        <h2 className="le-title">{project.title}</h2>
                        <p className="le-description">{project.description}</p>
                    </div>

                    <div className="le-right">
                        <div className="le-specs-pill">
                            <div>YEAR: <span>{project.year || '2026'}</span></div>
                            <div>•</div>
                            <div>STACK: <span>FRONTEND ARCHITECTURE</span></div>
                        </div>

                        {project.url ? (
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="le-action-cta"
                                onClick={e => e.stopPropagation()}
                                onMouseEnter={playHoverTick}
                            >
                                <span>VISIT LIVE EXPERIENCE</span>
                                <span>↗</span>
                            </a>
                        ) : (
                            <div className="le-action-cta le-action-cta--disabled">
                                <span>IN ACTIVE DEVELOPMENT</span>
                                <span>_</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
});

LiquidExpansion.displayName = 'LiquidExpansion';

export default LiquidExpansion;
