import React, { memo, useEffect } from 'react';
import HeaderMeta from './HeaderMeta';
import FooterMeta from './FooterMeta';

const Navigation = memo(({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const navLinks = [
        { label: 'LINKEDIN', url: 'https://www.linkedin.com/in/rodrigo-gabriel-valenzuela', external: true },
        { label: 'CURRICULUM VITAE', url: '/CV_Rodrigo_Valenzuela.pdf', external: true, download: 'CV_Rodrigo_Valenzuela.pdf' },
        { label: 'GITHUB', url: 'https://github.com/RodryVz', external: true },
        { label: 'PORTFOLIO BASE', url: 'https://porfolio-rodri.netlify.app/', external: true },
    ];

    return (
        <div className="app-root-container" style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: 1000, 
            backgroundColor: '#050505',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden'
        }}>
            <div className="viewport-frame">
                {/* Corner Accents */}
                <div className="frame-corner corner-tl" />
                <div className="frame-corner corner-tr" />
                <div className="frame-corner corner-bl" />
                <div className="frame-corner corner-br" />

                <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
                    {/* Reuse HeaderMeta for structure, with a custom click to close */}
                    <HeaderMeta onOpenNav={onClose} />
                    
                    <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: 'var(--header-padding)',
                        zIndex: 10,
                        position: 'relative'
                    }}>
                        <nav style={{ width: '100%', maxWidth: '900px' }}>
                            {navLinks.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target={link.external ? "_blank" : "_self"}
                                    rel={link.external ? "noopener noreferrer" : ""}
                                    download={link.download || false}
                                    className="nav-link"
                                    style={{
                                        fontFamily: 'var(--font-serif)',
                                        fontSize: 'clamp(28px, 10vw, 80px)',
                                        color: '#fff',
                                        textDecoration: 'none',
                                        margin: '1.5vh 0',
                                        display: 'block',
                                        opacity: 0.4,
                                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                        letterSpacing: '-1px'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (window.matchMedia('(hover: hover)').matches) {
                                            e.target.style.opacity = '1';
                                            e.target.style.transform = 'translateX(20px)';
                                            e.target.style.color = 'var(--acid-green)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (window.matchMedia('(hover: hover)').matches) {
                                            e.target.style.opacity = '0.4';
                                            e.target.style.transform = 'translateX(0)';
                                            e.target.style.color = '#fff';
                                        }
                                    }}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    <FooterMeta />
                </div>
            </div>
            
            <style>{`
                @media (max-width: 480px) {
                    .nav-link { opacity: 0.8 !important; }
                }
            `}</style>
        </div>
    );
});

export default Navigation;

