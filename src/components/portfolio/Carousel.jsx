import React, { memo, useMemo } from 'react';
import FlexCarousel from './FlexCarousel';

/**
 * 🎡 CAROUSEL COMPONENT
 * Replaced with <FlexCarousel /> from React Bits (WebGL liquid distortion).
 */
const Carousel = memo(({ projects, onClick, onSelect, onOpenDetail }) => {
    const items = useMemo(() => {
        if (!projects || projects.length === 0) return [];
        return projects.map((p) => ({
            src: p.image,
            alt: p.title,
            title: p.title,
            subtitle: p.category,
            ...p,
        }));
    }, [projects]);

    return (
        <div
            className="carousel-container"
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                zIndex: 10,
            }}
        >
            <FlexCarousel
                items={items}
                preset="liquid"
                intro="rise"
                cardHeight={0.42}
                gap={16}
                radius={8}
                squeeze={0.2}
                captureWheel
                focusOnClick
                captions
                onSelect={onSelect}
                onOpenDetail={onOpenDetail || ((proj, e) => onClick && onClick(e, proj))}
            />
        </div>
    );
});

export default Carousel;
