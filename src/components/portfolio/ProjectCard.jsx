import React, { useState, memo, useRef, useCallback } from 'react';

const ProjectCard = memo(({ project, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Intensity of the tilt
        const tiltX = (y - 0.5) * 12;
        const tiltY = (x - 0.5) * -12;

        setTilt({ x: tiltX, y: tiltY });
        
        // Update local hover light position
        const lightX = x * 100;
        const lightY = y * 100;
        cardRef.current.style.setProperty('--light-x', `${lightX}%`);
        cardRef.current.style.setProperty('--light-y', `${lightY}%`);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
    }, []);

    return (
        <div
            ref={cardRef}
            className="project-card"
            data-hoverable="true"
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => onClick(e, project)}
            style={{
                width: 'var(--card-width)',
                aspectRatio: '21 / 9',
                flexShrink: 0,
                margin: 'var(--card-margin)',
                position: 'relative',
                cursor: 'pointer',
                transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.8s ease',
                transformOrigin: 'center center',
                perspective: '1200px',
                transform: isHovered
                    ? `scale(1.06) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                    : 'scale(1) rotateX(0deg) rotateY(0deg)',
                boxShadow: isHovered
                    ? `0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(223, 255, 0, 0.5), 0 0 40px rgba(223, 255, 0, 0.15)`
                    : '0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                overflow: 'hidden',
                zIndex: isHovered ? 20 : 5,
                borderRadius: '12px',
                background: '#000'
            }}
        >
            {/* Dynamic Hover Light Beam - Increased Intensity */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at var(--light-x, 50%) var(--light-y, 50%), rgba(255,255,255,0.18) 0%, transparent 60%)`,
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none',
                zIndex: 3
            }} />

            <div style={{
                position: 'absolute',
                inset: '-15%', 
                transition: isHovered ? 'none' : 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isHovered
                    ? `translateX(${tilt.y * -0.8}%) translateY(${tilt.x * 0.8}%) scale(1.15)`
                    : 'translateX(0) translateY(0) scale(1)',
                zIndex: 0
            }}>
                <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        pointerEvents: 'none',
                        filter: isHovered
                            ? 'contrast(1.25) brightness(1.25) saturate(1.15)'
                            : 'contrast(1.1) brightness(0.95) saturate(0.9)',
                        transition: 'filter 0.6s cubic-bezier(0.7, 0, 0.3, 1)'
                    }}
                />
            </div>

            {/* Gradient Veil - Strengthened for better text readability */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 100%)',
                opacity: isHovered ? 1 : 0.85,
                transition: 'opacity 0.6s ease',
                zIndex: 1
            }} />

            {/* Project Title with Parallax */}
            <div style={{
                position: 'absolute',
                bottom: 'min(35px, 6vh)',
                left: 'min(35px, 6vw)',
                right: '20px', /* Added right padding to prevent long titles from hitting edge */
                color: '#fff',
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--card-title-size)',
                transform: isHovered
                    ? `translateY(0) translateX(${tilt.y * 0.3}px)`
                    : 'translateY(0) translateX(0)',
                opacity: isHovered ? 1 : 0.8,
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
                pointerEvents: 'none',
                zIndex: 4,
                textShadow: '0 4px 15px rgba(0,0,0,0.8)'
            }}>
                <div style={{ fontWeight: '500', letterSpacing: '0.5px' }}>{project.title}</div>
                <div style={{
                    fontSize: 'max(9px, 0.8rem)',
                    color: 'var(--acid-green)',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '5px',
                    marginTop: '8px',
                    opacity: isHovered ? 1 : 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'opacity 0.5s ease'
                }}>
                    <span style={{ 
                        width: isHovered ? '25px' : '15px', 
                        height: '1px', 
                        background: 'var(--acid-green)',
                        transition: 'width 0.5s ease' 
                    }}></span>
                    EXPLORE
                </div>
            </div>
        </div>
    );
});

export default ProjectCard;
