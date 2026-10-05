import React, { memo, useEffect, useState } from 'react';
import HeaderMeta from './HeaderMeta';
import FooterMeta from './FooterMeta';

const Navigation = memo(({ isOpen, onClose }) => {
    const [copiedEmail, setCopiedEmail] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = 'auto';
            };
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const navLinks = [
        { label: 'LINKEDIN', tag: '↗ NETWORK', url: 'https://www.linkedin.com/in/rodrigo-gabriel-valenzuela', external: true },
        { label: 'CURRICULUM VITAE', tag: '↓ PDF (EN/ES)', url: '/CV_Rodrigo_Valenzuela.pdf', external: true, download: 'CV_Rodrigo_Valenzuela.pdf' },
        { label: 'GITHUB', tag: '↗ REPOSITORIES', url: 'https://github.com/RodryVz', external: true },
        { label: 'PORTFOLIO BASE', tag: '↗ ARCHIVE', url: 'https://porfolio-rodri.netlify.app/', external: true },
    ];

    const handleCopyEmail = (e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText('Rodry_valenzuela@hotmail.com');
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    return (
        <div
            className="app-root-container nav-overlay-wrapper"
            style={{ 
                position: 'fixed', 
                inset: 0, 
                zIndex: 1000, 
                backgroundColor: 'rgba(5, 5, 5, 0.98)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                animation: 'navFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both'
            }}
            onClick={onClose}
        >
            <style>{`
                @keyframes navFadeIn {
                    from { opacity: 0; transform: scale(0.99); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes navLinkIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 0.55; transform: translateX(0); }
                }
                .nav-link-item {
                    will-change: transform, opacity;
                }
                .nav-link-item:hover {
                    opacity: 1 !important;
                    transform: translateX(16px) !important;
                    color: var(--acid-green) !important;
                }
            `}</style>
            <div
                className="viewport-frame"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Corner Accents */}
                <div className="frame-corner corner-tl" />
                <div className="frame-corner corner-tr" />
                <div className="frame-corner corner-bl" />
                <div className="frame-corner corner-br" />

                <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
                    {/* HeaderMeta con isOpen=true mostrando [CLOSE] */}
                    <HeaderMeta onOpenNav={onClose} isOpen={true} />
                    
                    <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        padding: 'var(--header-padding)',
                        zIndex: 10,
                        position: 'relative'
                    }}>
                        {/* Eyebrow de contexto */}
                        <div style={{
                            fontSize: '10px',
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '2px',
                            color: 'var(--acid-green)',
                            marginBottom: '2vh',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <span>01 // DIRECTORY & PROFILE</span>
                            <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>
                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>PRESS [ESC] TO RETURN</span>
                        </div>

                        <nav style={{ width: '100%', maxWidth: '950px' }}>
                            {navLinks.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target={link.external ? "_blank" : "_self"}
                                    rel={link.external ? "noopener noreferrer" : ""}
                                    download={link.download || false}
                                    className="nav-link nav-link-item"
                                    style={{
                                        fontFamily: 'var(--font-serif)',
                                        fontSize: 'clamp(28px, 6.5vw, 68px)',
                                        color: '#fff',
                                        textDecoration: 'none',
                                        margin: '1.2vh 0',
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        gap: '20px',
                                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, color 0.3s ease',
                                        letterSpacing: '-1px',
                                        animation: `navLinkIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both`,
                                        animationDelay: `${80 + idx * 50}ms`
                                    }}
                                >
                                    <span>{link.label}</span>
                                    <span style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '10px',
                                        letterSpacing: '1px',
                                        color: '#888',
                                        transform: 'translateY(-4px)'
                                    }}>
                                        {link.tag}
                                    </span>
                                </a>
                            ))}
                        </nav>

                        {/* Quick Contact Pill */}
                        <div style={{ marginTop: '4vh', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={handleCopyEmail}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    borderRadius: '999px',
                                    padding: '8px 18px',
                                    color: copiedEmail ? 'var(--acid-green)' : '#ddd',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '11px',
                                    letterSpacing: '1px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--acid-green)';
                                    e.currentTarget.style.background = 'rgba(223, 255, 0, 0.08)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = copiedEmail ? 'var(--acid-green)' : 'rgba(255, 255, 255, 0.15)';
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                                }}
                            >
                                <span style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: copiedEmail ? 'var(--acid-green)' : '#888',
                                    boxShadow: copiedEmail ? '0 0 8px var(--acid-green)' : 'none',
                                    transition: 'all 0.3s ease'
                                }} />
                                <span>{copiedEmail ? 'EMAIL COPIED TO CLIPBOARD' : 'RODRY_VALENZUELA@HOTMAIL.COM'}</span>
                            </button>

                            <a
                                href="mailto:Rodry_valenzuela@hotmail.com"
                                style={{
                                    background: 'rgba(223, 255, 0, 0.08)',
                                    border: '1px solid rgba(223, 255, 0, 0.35)',
                                    borderRadius: '999px',
                                    padding: '8px 18px',
                                    color: 'var(--acid-green)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '11px',
                                    letterSpacing: '1px',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--acid-green)';
                                    e.currentTarget.style.background = 'rgba(223, 255, 0, 0.18)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(223, 255, 0, 0.35)';
                                    e.currentTarget.style.background = 'rgba(223, 255, 0, 0.08)';
                                }}
                            >
                                <span>ENVIAR CORREO ✉</span>
                            </a>
                        </div>
                    </div>

                    <FooterMeta />
                </div>
            </div>
        </div>
    );
});

Navigation.displayName = 'Navigation';

export default Navigation;
