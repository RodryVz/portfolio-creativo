import React, { memo, useMemo } from 'react';

/**
 * ✨ FLOATING PARTICLES
 * Pure CSS particles that float gently in the background.
 * Zero dependencies, zero performance impact on interactions.
 */
const FloatingParticles = memo(() => {
    const particles = useMemo(() => {
        const count = 35;
        return Array.from({ length: count }, (_, i) => {
            const size = Math.random() * 2.5 + 0.5; // 0.5px - 3px
            const isGreen = Math.random() > 0.75; // 25% acid-green, rest white
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const duration = Math.random() * 40 + 30; // 30s - 70s
            const delay = Math.random() * -40; // stagger start
            const driftX = (Math.random() - 0.5) * 60; // horizontal drift range
            const opacity = Math.random() * 0.25 + 0.03; // 0.03 - 0.28

            return {
                id: i,
                size,
                isGreen,
                startX,
                startY,
                duration,
                delay,
                driftX,
                opacity,
            };
        });
    }, []);

    return (
        <>
            <style>{`
                @keyframes particleFloat {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: var(--p-opacity);
                    }
                    25% {
                        transform: translate(calc(var(--drift-x) * 0.5), -25vh) scale(1.2);
                        opacity: calc(var(--p-opacity) * 1.5);
                    }
                    50% {
                        transform: translate(var(--drift-x), -50vh) scale(0.8);
                        opacity: var(--p-opacity);
                    }
                    75% {
                        transform: translate(calc(var(--drift-x) * 0.3), -75vh) scale(1.1);
                        opacity: calc(var(--p-opacity) * 0.6);
                    }
                    100% {
                        transform: translate(0, -100vh) scale(1);
                        opacity: 0;
                    }
                }

                .floating-particle {
                    position: absolute;
                    border-radius: 50%;
                    pointer-events: none;
                    will-change: transform, opacity;
                    animation: particleFloat var(--p-duration) var(--p-delay) ease-in-out infinite;
                }
            `}</style>

            <div style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 0,
            }}>
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="floating-particle"
                        style={{
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            left: `${p.startX}%`,
                            top: `${p.startY}%`,
                            backgroundColor: p.isGreen
                                ? 'rgba(223, 255, 0, 0.6)'
                                : 'rgba(255, 255, 255, 0.5)',
                            boxShadow: p.isGreen
                                ? `0 0 ${p.size * 3}px rgba(223, 255, 0, 0.3)`
                                : 'none',
                            '--p-opacity': p.opacity,
                            '--p-duration': `${p.duration}s`,
                            '--p-delay': `${p.delay}s`,
                            '--drift-x': `${p.driftX}px`,
                        }}
                    />
                ))}
            </div>
        </>
    );
});

export default FloatingParticles;
