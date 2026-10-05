import React, { memo, useRef, useState, useCallback, useEffect } from 'react';
import { isSoundEnabled, toggleSound, subscribeSoundState, playOpenSwell, playCloseBlip, playHoverTick } from '../../utils/audioSystem';

const HeaderMeta = memo(({ onOpenNav, isOpen = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
    const triggerRef = useRef(null);
    const cachedRectRef = useRef(null);

    useEffect(() => {
        return subscribeSoundState(setSoundOn);
    }, []);

    const updateCachedRect = useCallback(() => {
        if (triggerRef.current) {
            cachedRectRef.current = triggerRef.current.getBoundingClientRect();
        }
    }, []);

    useEffect(() => {
        updateCachedRect();
        window.addEventListener('resize', updateCachedRect, { passive: true });
        return () => window.removeEventListener('resize', updateCachedRect);
    }, [updateCachedRect]);

    const handleMouseMove = useCallback((e) => {
        if (!triggerRef.current) return;
        const rect = cachedRectRef.current || triggerRef.current.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        const maxDist = 80;

        if (dist < maxDist) {
            const pull = (1 - dist / maxDist) * 12;
            const moveX = (e.clientX - centerX) * (pull / maxDist);
            const moveY = (e.clientY - centerY) * (pull / maxDist);
            triggerRef.current.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0)`;
        } else {
            triggerRef.current.style.transform = 'translate3d(0, 0, 0)';
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (triggerRef.current) {
            triggerRef.current.style.transform = 'translate3d(0, 0, 0)';
        }
        setIsHovered(false);
    }, []);

    const handleMenuClick = (e) => {
        if (isOpen) {
            playCloseBlip();
        } else {
            playOpenSwell();
        }
        onOpenNav?.(e);
    };

    const handleSoundToggle = (e) => {
        e.stopPropagation();
        toggleSound();
    };

    return (
        <header
            className="header-meta-bar"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <style>{`
                .header-meta-bar {
                    position: absolute;
                    top: var(--header-top);
                    left: 0;
                    width: 100%;
                    padding: var(--header-padding);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: var(--meta-font-size);
                    text-transform: uppercase;
                    color: #888;
                    font-family: var(--font-mono);
                    z-index: 20;
                    pointer-events: none;
                    letter-spacing: 2px;
                }

                .header-left-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    pointer-events: auto;
                }

                .header-right-group {
                    display: flex;
                    align-items: center;
                    pointer-events: auto;
                }

                .header-sound-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 999px;
                    color: rgba(255, 255, 255, 0.45);
                    font-family: var(--font-mono);
                    font-size: 9.5px;
                    letter-spacing: 1.5px;
                    cursor: pointer;
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    transition: all 0.25s ease;
                }

                .header-sound-btn.is-active {
                    background: rgba(223, 255, 0, 0.1);
                    border-color: rgba(223, 255, 0, 0.4);
                    color: var(--acid-green);
                    box-shadow: 0 0 12px rgba(223, 255, 0, 0.2);
                }

                /* En escritorio el botón de sonido va a la izquierda junto a MENU */
                .header-sound-btn--desktop {
                    display: inline-flex;
                }
                .header-sound-btn--mobile {
                    display: none;
                }

                .header-right-text {
                    text-align: right;
                }

                .header-menu-label-sub {
                    display: inline;
                }

                /* 📱 REGLAS EXCLUSIVAS PARA MODO MÓVIL (<= 768px) */
                @media (max-width: 768px) {
                    .header-meta-bar {
                        padding: 0 16px;
                    }

                    /* Ocultamos el botón de sonido de la izquierda para no amontonarlo con MENU */
                    .header-sound-btn--desktop {
                        display: none !important;
                    }

                    /* Activamos el botón de sonido en la esquina superior DERECHA */
                    .header-sound-btn--mobile {
                        display: inline-flex !important;
                        padding: 5px 11px;
                        font-size: 9px;
                        letter-spacing: 1px;
                    }

                    /* Ocultamos el texto largo de freelance que causaba el choque visual */
                    .header-right-text {
                        display: none !important;
                    }

                    /* En móvil simplificamos 'MENU / ABOUT' a 'MENU' */
                    .header-menu-label-sub {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Bloque Izquierdo: Botón Menú (+ Botón Sonido en escritorio) */}
            <div className="header-left-group">
                <button
                    ref={triggerRef}
                    type="button"
                    aria-label={isOpen ? "Cerrar menú" : "Abrir menú de navegación y contacto"}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        background: isOpen
                            ? 'rgba(223, 255, 0, 0.15)'
                            : isHovered
                                ? 'rgba(223, 255, 0, 0.08)'
                                : 'rgba(255, 255, 255, 0.05)',
                        border: isOpen
                            ? '1px solid var(--acid-green)'
                            : isHovered
                                ? '1px solid var(--acid-green)'
                                : '1px solid rgba(255, 255, 255, 0.22)',
                        borderRadius: '999px',
                        padding: '7px 16px 7px 12px',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        color: isOpen || isHovered ? '#fff' : '#aaa',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        letterSpacing: '2px',
                        boxShadow: isOpen || isHovered ? '0 0 16px rgba(223, 255, 0, 0.25)' : '0 2px 8px rgba(0,0,0,0.4)',
                        transition: 'background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s',
                        outline: 'none',
                    }}
                    onClick={handleMenuClick}
                    onMouseEnter={() => {
                        updateCachedRect();
                        setIsHovered(true);
                        playHoverTick();
                    }}
                    data-hoverable="true"
                >
                    {/* Icono interactivo: Líneas de menú que se transforman en Cruz [✕] */}
                    <div style={{
                        width: '14px',
                        height: '14px',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <span style={{
                            position: 'absolute',
                            width: '13px',
                            height: '1.5px',
                            backgroundColor: isOpen || isHovered ? 'var(--acid-green)' : '#fff',
                            borderRadius: '1px',
                            transform: isOpen ? 'rotate(45deg)' : 'translateY(-3px)',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        }} />
                        <span style={{
                            position: 'absolute',
                            width: '13px',
                            height: '1.5px',
                            backgroundColor: isOpen || isHovered ? 'var(--acid-green)' : '#fff',
                            borderRadius: '1px',
                            transform: isOpen ? 'rotate(-45deg)' : 'translateY(3px)',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isOpen ? (
                            <span style={{ color: 'var(--acid-green)', fontWeight: 'bold' }}>CLOSE</span>
                        ) : (
                            <>
                                <span>MENU</span>
                                <span className="header-menu-label-sub" style={{ opacity: 0.4 }}>/</span>
                                <span className="header-menu-label-sub" style={{ color: '#fff', fontWeight: 'bold' }}>ABOUT</span>
                            </>
                        )}
                    </div>
                </button>

                {/* Botón de Sonido en ESCRITORIO (junto a MENU) */}
                <button
                    type="button"
                    onClick={handleSoundToggle}
                    aria-label={`Toggle Sound, currently ${soundOn ? 'ON' : 'OFF'}`}
                    className={`header-sound-btn header-sound-btn--desktop ${soundOn ? 'is-active' : ''}`}
                    onMouseEnter={playHoverTick}
                >
                    <span style={{ fontSize: '10px' }}>{soundOn ? '♫' : '♪'}</span>
                    <span>SOUND: {soundOn ? 'ON' : 'OFF'}</span>
                </button>
            </div>

            {/* Bloque Derecho: Botón de Sonido en MÓVIL + Texto en Escritorio */}
            <div className="header-right-group">
                {/* Botón de Sonido en MÓVIL (perfectamente balanceado en la esquina derecha) */}
                <button
                    type="button"
                    onClick={handleSoundToggle}
                    aria-label={`Toggle Sound, currently ${soundOn ? 'ON' : 'OFF'}`}
                    className={`header-sound-btn header-sound-btn--mobile ${soundOn ? 'is-active' : ''}`}
                >
                    <span style={{ fontSize: '10px' }}>{soundOn ? '♫' : '♪'}</span>
                    <span>SOUND: {soundOn ? 'ON' : 'OFF'}</span>
                </button>

                {/* Texto de Disponibilidad en ESCRITORIO */}
                <div className="header-right-text">
                    <div style={{ color: 'var(--acid-green)', marginBottom: '4px', fontSize: '10px' }}>AVAILABLE FOR FREELANCE</div>
                    <div style={{ color: '#fff' }}>2026 COLLECTION</div>
                </div>
            </div>
        </header>
    );
});

HeaderMeta.displayName = 'HeaderMeta';

export default HeaderMeta;
