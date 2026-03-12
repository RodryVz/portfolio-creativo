import React, { useEffect, useState, memo } from 'react';

/* ============================================================
   LiquidExpansion - Detalle del Proyecto (Responsive Optimized)
   ============================================================ */

const COLS = 8;
const ROWS = 5;
const CLOSE_DURATION = 1400;

function getDelay(col, row, originCol, originRow, isClose) {
    const dist = Math.sqrt(Math.pow(col - originCol, 2) + Math.pow(row - originRow, 2));
    const maxDist = Math.sqrt(Math.pow(COLS, 2) + Math.pow(ROWS, 2));
    const normalized = dist / maxDist;
    return isClose ? (1 - normalized) * 500 : normalized * 480;
}

const LiquidExpansion = memo(({ project, origin, onClose }) => {
    const [phase, setPhase] = useState('idle');
    const [uiIn, setUiIn] = useState(false);
    const [mounted, setMounted] = useState(true);
    const [cursor, setCursor] = useState({ x: -200, y: -200 });
    const [cursorLabel, setCursorLabel] = useState('');

    const originCol = origin ? Math.floor((origin.x / window.innerWidth) * COLS) : 0;
    const originRow = origin ? Math.floor((origin.y / window.innerHeight) * ROWS) : 0;

    useEffect(() => {
        if (!project || !origin) return;
        const t0 = setTimeout(() => setPhase('open'), 20);
        const t1 = setTimeout(() => setUiIn(true), 900);
        return () => { clearTimeout(t0); clearTimeout(t1); };
    }, [project, origin]);

    useEffect(() => {
        const onMove = (e) => setCursor({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    const handleClose = (e) => {
        e.stopPropagation();
        if (phase !== 'open') return;
        setUiIn(false);
        setPhase('closing');
        setTimeout(() => setMounted(false), CLOSE_DURATION);
        setTimeout(onClose, CLOSE_DURATION);
    };

    const handleVisit = () => {
        if (phase !== 'open') return;
        if (project.url) window.open(project.url, '_blank', 'noopener,noreferrer');
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
                position: fixed; inset: 0;
                z-index: 100;
                pointer-events: none;
                cursor: none;
                background-color: #050505;
            }
            .le-root.is-open { pointer-events: auto; }

            .le-cursor {
                position: fixed;
                pointer-events: none;
                z-index: 300;
                display: flex;
                align-items: center;
                gap: 12px;
                transform: translate(-50%, -50%);
                mix-blend-mode: difference;
                will-change: transform;
                transition: opacity 0.3s ease;
            }
            .le-cursor-dot {
                width: 6px; height: 6px;
                border-radius: 50%;
                background: #fff;
                flex-shrink: 0;
                transition: transform 0.2s ease;
            }
            .le-cursor.on-image .le-cursor-dot { transform: scale(3); background: var(--acid-green); }
            
            .le-cursor-text {
                font-family: var(--font-mono);
                font-size: 10px; letter-spacing: 2px;
                text-transform: uppercase;
                color: #fff;
                opacity: 0;
                transform: translateX(-10px);
                transition: opacity 0.25s ease, transform 0.25s ease;
                white-space: nowrap;
            }
            .le-cursor.on-image .le-cursor-text { opacity: 1; transform: translateX(0); }

            /* ── Image Container ── */
            .le-content-container {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #000;
                padding: 10vh 8vw 20vh;
                transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .le-img-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                max-width: 1400px;
                overflow: hidden;
                border-radius: 4px;
                box-shadow: 0 40px 100px rgba(0,0,0,0.8);
            }
            .le-image-layer {
                width: 100%; height: 100%;
                cursor: none;
                transition: transform 1s ease;
            }
            .le-root.is-open .le-image-layer img {
                animation: le-drift 20s ease-in-out infinite alternate;
            }
            @keyframes le-drift {
                from { transform: scale(1.02); }
                to   { transform: scale(1.1) translate(-2%, -1%); }
            }

            /* ── Grid ── */
            .le-grid {
                position: absolute; inset: 0;
                display: grid;
                grid-template-columns: repeat(${COLS}, 1fr);
                grid-template-rows: repeat(${ROWS}, 1fr);
                pointer-events: none;
                z-index: 10;
            }
            .le-cell {
                background: #050505;
                transform: scale(1.02);
            }
            .le-cell.animating-in {
                animation: le-cell-open var(--dur) cubic-bezier(0.76, 0, 0.24, 1) var(--delay) forwards;
            }
            .le-cell.animating-out {
               animation: le-cell-close var(--dur) cubic-bezier(0.76, 0, 0.24, 1) var(--delay) forwards;
            }
            @keyframes le-cell-open { to { transform: scale(0); opacity: 0; } }
            @keyframes le-cell-close { from { transform: scale(0); opacity: 0; } to { transform: scale(1.02); opacity: 1; } }

            /* ── Bottom Info ── */
            .le-bottom {
                position: absolute; bottom: 0; left: 0; right: 0;
                padding: min(5vh, 40px) min(8vw, 60px);
                display: flex; align-items: flex-end; justify-content: space-between;
                background: linear-gradient(to top, #000 0%, transparent 100%);
                z-index: 20;
                opacity: 0; transform: translateY(20px);
                transition: all 0.8s cubic-bezier(0.16,1,0.3,1);
            }
            .le-bottom.in { opacity: 1; transform: translateY(0); }

            .le-category { color: var(--acid-green); font-size: 10px; letter-spacing: 4px; margin-bottom: 8px; font-family: var(--font-mono); }
            .le-title { font-family: var(--font-serif); font-size: clamp(28px, 5vw, 64px); color: #fff; line-height: 1; margin-bottom: 12px; }
            .le-description { color: rgba(255,255,255,0.4); font-size: 11px; max-width: 500px; line-height: 1.6; font-family: var(--font-mono); }

            /* ── Button Close ── */
            .le-close {
                position: absolute; top: 40px; right: 40px;
                z-index: 400;
                display: flex; align-items: center; justify-content: center;
                gap: 12px;
                padding: 10px 20px;
                background: rgba(255,255,255,0.05);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 40px;
                cursor: pointer;
                opacity: 0; transform: scale(0.8);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .le-root.is-open .le-close { opacity: 1; transform: scale(1); }
            .le-close:hover {
                background: var(--acid-green);
                border-color: var(--acid-green);
                transform: scale(1.05);
            }
            .le-close:hover span { color: #000; }

            @media (max-width: 768px) {
                .le-content-container { padding: 12vh 6vw 28vh; }
                .le-bottom { 
                    flex-direction: column; 
                    align-items: flex-start; 
                    gap: 15px;
                    padding: 30px 25px;
                    background: linear-gradient(to top, #000 70%, transparent 100%);
                }
                .le-title { font-size: 32px; }
                .le-description { font-size: 10px; max-width: 100%; opacity: 0.6; }
                .le-right { text-align: left !important; width: 100%; border-top: 1px solid rgba(255,255,255,0.1); pt: 10px; padding-top: 15px; }
                .le-close { top: 20px; right: 20px; padding: 8px 15px; }
                .le-cursor { display: none; } /* Hide custom cursor on touch */
            }

            @media (max-width: 480px) {
                .le-content-container { padding: 8vh 4vw 35vh; }
                .le-title { font-size: 28px; }
                .le-description { -webkit-line-clamp: 3; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
                .le-close { font-size: 9px; padding: 6px 12px; top: 15px; right: 15px; }
            }
        `}</style>

            <div
                className={`le-cursor${cursorLabel === 'Visit' ? ' on-image' : ''}`}
                style={{ left: cursor.x, top: cursor.y }}
            >
                <div className="le-cursor-dot" />
                <span className="le-cursor-text">{cursorLabel}</span>
            </div>

            <div className={`le-root${isOpen ? ' is-open' : ''}`}>
                <div className="le-content-container">
                    <div className="le-img-wrapper" onClick={handleVisit} onMouseEnter={() => setCursorLabel('Visit')} onMouseLeave={() => setCursorLabel('')}>
                        <div className="le-image-layer">
                            <img
                                src={project.image}
                                alt={project.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="le-grid">
                    {cells.map(({ col, row }) => (
                        <div
                            key={`${col}-${row}`}
                            className={`le-cell ${isOpen && !isClosing ? 'animating-in' : isClosing ? 'animating-out' : ''}`}
                            style={{
                                '--delay': `${getDelay(col, row, originCol, originRow, isClosing)}ms`,
                                '--dur': isClosing ? '0.7s' : '0.6s'
                            }}
                        />
                    ))}
                </div>

                <div className={`le-bottom${uiIn ? ' in' : ''}`}>
                    <div className="le-left">
                        <div className="le-category">{project.category}</div>
                        <div className="le-title">{project.title}</div>
                        <div className="le-description">{project.description}</div>
                    </div>
                    <div className="le-right" style={{ textAlign: 'right' }}>
                        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '9px', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>{project.year} © PROJECTS</div>
                        {project.url && <div style={{ color: 'var(--acid-green)', fontSize: '9px', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>LAUNCH PROJECT_</div>}
                    </div>
                </div>

                <div className="le-close" onClick={handleClose}>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', color: '#fff', transition: 'color 0.3s' }}>CLOSE</span>
                </div>
            </div>
        </>
    );
});

export default LiquidExpansion;
