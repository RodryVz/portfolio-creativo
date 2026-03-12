import React, { useState, memo } from 'react';

const MinimalistText = memo(({ text, isTop }) => {
    const [isHovered, setIsHovered] = useState(false);

    const textStyleBase = {
        fontFamily: 'var(--font-serif)',
        fontSize: 'var(--bg-text-size)',
        lineHeight: '1',
        fontWeight: '300',
        letterSpacing: 'var(--bg-text-spacing)',
        position: 'absolute',
        whiteSpace: 'nowrap',
        pointerEvents: 'auto',
        color: 'transparent',
        WebkitTextStroke: isHovered ? '2px rgba(216, 248, 8, 0.8)' : '2px rgba(255, 255, 255, 0.15)',
        transition: 'all 0.5s cubic-bezier(0.7, 0, 0.3, 1)',
        cursor: 'default',
        zIndex: 1,
    };

    const positioning = isTop ? {
        top: '11vh',
        left: '5vw',
    } : {
        bottom: '16vh',
        right: '5vw',
    };

    return (
        <div
            style={{ ...textStyleBase, ...positioning }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {text}
        </div>
    );
});

const BackgroundText = memo(() => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <MinimalistText text="FRONTEND" isTop={true} />
            <MinimalistText text="DEVELOPER" isTop={false} />
        </div>
    );
});

export default BackgroundText;
