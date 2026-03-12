import React, { memo, useRef, useState, useCallback } from 'react';

const HeaderMeta = memo(({ onOpenNav }) => {
    const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 });
    const triggerRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();

        // Calculate distance from center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        const maxDist = 80; // Distance of influence

        if (dist < maxDist) {
            const pull = (1 - dist / maxDist) * 15; // Max 15px pull
            const moveX = (e.clientX - centerX) * (pull / maxDist);
            const moveY = (e.clientY - centerY) * (pull / maxDist);
            setMagneticPos({ x: moveX, y: moveY });
        } else {
            setMagneticPos({ x: 0, y: 0 });
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        setMagneticPos({ x: 0, y: 0 });
    }, []);

    return (
        <div
            style={{
                position: 'absolute',
                top: 'var(--header-top)',
                left: '0',
                width: '100%',
                padding: 'var(--header-padding)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 'var(--meta-font-size)',
                textTransform: 'uppercase',
                color: '#888',
                fontFamily: 'var(--font-mono)',
                zIndex: 20,
                pointerEvents: 'none',
                letterSpacing: '2px'
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={triggerRef}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    transform: `translate(${magneticPos.x}px, ${magneticPos.y}px)`,
                    transition: magneticPos.x === 0 ? 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none'
                }}
                onClick={onOpenNav}
                data-hoverable="true"
            >
                <div style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: 'var(--acid-green)',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px var(--acid-green)',
                    transition: 'transform 0.3s ease'
                }}></div>
                <div>MENU / <span style={{ color: '#fff' }}>INDEX</span></div>
            </div>

            <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--acid-green)', marginBottom: '4px' }}>AVAILABLE FOR FREELANCE</div>
                <div style={{ color: '#fff' }}>2026 COLLECTION</div>
            </div>
        </div>
    );
});

export default HeaderMeta;
