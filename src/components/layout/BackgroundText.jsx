import React, { useState, useEffect, useRef, memo } from 'react';

const BackgroundText = memo(() => {
    // Estado individual: sólo la palabra sobre la que está el cursor se ilumina
    const [hoveredWord, setHoveredWord] = useState(null); // 'frontend' | 'developer' | null
    const topRef = useRef(null);
    const bottomRef = useRef(null);
    const topRectRef = useRef(null);
    const botRectRef = useRef(null);
    const currentHoveredRef = useRef(null);

    useEffect(() => {
        // Cache geometry once to prevent layout thrashing (forced reflow) on every mousemove
        const updateRects = () => {
            if (topRef.current) topRectRef.current = topRef.current.getBoundingClientRect();
            if (bottomRef.current) botRectRef.current = bottomRef.current.getBoundingClientRect();
        };

        updateRects();
        window.addEventListener('resize', updateRects, { passive: true });

        let rafId = null;

        const handleMouseMove = (e) => {
            if (rafId) return;
            if (document.hidden || document.body.style.overflow === 'hidden') {
                if (currentHoveredRef.current !== null) {
                    currentHoveredRef.current = null;
                    setHoveredWord(null);
                }
                return;
            }

            const clientX = e.clientX;
            const clientY = e.clientY;

            rafId = requestAnimationFrame(() => {
                rafId = null;

                // 1. Si el cursor está sobre cualquier card del carrusel o botones del mismo, NUNCA iluminar
                if (window.__isOverFlexCard && window.__isOverFlexCard(clientX, clientY)) {
                    if (currentHoveredRef.current !== null) {
                        currentHoveredRef.current = null;
                        setHoveredWord(null);
                    }
                    return;
                }

                const rTop = topRectRef.current;
                const rBot = botRectRef.current;
                let next = null;

                // 2. Detección precisa para FRONTEND
                if (rTop) {
                    const minY = rTop.top + rTop.height * 0.12;
                    const maxY = rTop.bottom - rTop.height * 0.14;
                    if (clientX >= rTop.left && clientX <= rTop.right && clientY >= minY && clientY <= maxY) {
                        next = 'frontend';
                    }
                }

                // 3. Detección precisa para DEVELOPER
                if (!next && rBot) {
                    const minY = rBot.top + rBot.height * 0.12;
                    const maxY = rBot.bottom - rBot.height * 0.14;
                    if (clientX >= rBot.left && clientX <= rBot.right && clientY >= minY && clientY <= maxY) {
                        next = 'developer';
                    }
                }

                if (currentHoveredRef.current !== next) {
                    currentHoveredRef.current = next;
                    setHoveredWord(next);
                }
            });
        };

        const handleMouseLeave = () => {
            if (currentHoveredRef.current !== null) {
                currentHoveredRef.current = null;
                setHoveredWord(null);
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            window.removeEventListener('resize', updateRects);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    const getDynamicStyle = (isHovered) => ({
        WebkitTextStroke: isHovered ? '2px var(--acid-green)' : '1.8px rgba(255, 255, 255, 0.40)',
        filter: isHovered
            ? 'drop-shadow(0 0 12px rgba(223, 255, 0, 0.75)) drop-shadow(0 0 25px rgba(223, 255, 0, 0.35))'
            : 'none',
        opacity: isHovered ? 0.95 : 0.65,
    });

    const isTopHovered = hoveredWord === 'frontend';
    const isBottomHovered = hoveredWord === 'developer';

    return (
        <div className="bg-text-wrapper">
            <style>{`
                .bg-text-wrapper {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                    pointer-events: none;
                    overflow: hidden;
                }

                .bg-text-word {
                    position: absolute;
                    white-space: nowrap;
                    pointer-events: none;
                    user-select: none;
                    -webkit-user-select: none;
                    font-family: var(--font-serif);
                    line-height: 1;
                    font-weight: 300;
                    color: transparent;
                    transition: opacity 0.35s ease, filter 0.35s ease, -webkit-text-stroke 0.35s ease;
                    z-index: 0;
                }

                /* Desktop: FRONTEND subido un poco y DEVELOPER bajado un poco */
                .bg-text-top {
                    top: 7.5vh;
                    left: 5vw;
                    font-size: var(--bg-text-size);
                    letter-spacing: var(--bg-text-spacing);
                }

                .bg-text-bottom {
                    bottom: 11vh;
                    right: 5vw;
                    top: auto;
                    font-size: var(--bg-text-size);
                    letter-spacing: var(--bg-text-spacing);
                }

                /* Tablet: espaciado vertical armónico y ajustado */
                @media (max-width: 1024px) {
                    .bg-text-top {
                        top: 11vh;
                        left: 4vw;
                    }
                    .bg-text-bottom {
                        top: 21vh;
                        right: 4vw;
                        bottom: auto;
                    }
                }

                /* Móvil: Centradas horizontalmente, formando un bloque tipográfico de portada */
                @media (max-width: 768px) {
                    .bg-text-top {
                        top: 11vh;
                        left: 0;
                        right: 0;
                        text-align: center;
                        font-size: clamp(38px, 12vw, 56px);
                        letter-spacing: 2px;
                    }
                    .bg-text-bottom {
                        top: 18.5vh;
                        bottom: auto;
                        left: 0;
                        right: 0;
                        text-align: center;
                        font-size: clamp(38px, 12vw, 56px);
                        letter-spacing: 2px;
                    }
                }

                @media (max-width: 480px) {
                    .bg-text-top {
                        top: 10.5vh;
                        font-size: clamp(32px, 11vw, 46px);
                        letter-spacing: 1.5px;
                    }
                    .bg-text-bottom {
                        top: 16.5vh;
                        font-size: clamp(32px, 11vw, 46px);
                        letter-spacing: 1.5px;
                    }
                }
            `}</style>

            <div
                ref={topRef}
                className="bg-text-word bg-text-top"
                style={getDynamicStyle(isTopHovered)}
            >
                FRONTEND
            </div>
            <div
                ref={bottomRef}
                className="bg-text-word bg-text-bottom"
                style={getDynamicStyle(isBottomHovered)}
            >
                DEVELOPER
            </div>
        </div>
    );
});

export default BackgroundText;
