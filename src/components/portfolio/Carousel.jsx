import React, { memo, useMemo } from 'react';
import ProjectCard from './ProjectCard';

/**
 * 🎡 CAROUSEL COMPONENT
 * Handles the infinite horizontal scroll of projects.
 * Uses a multiplication of the project list to ensure the loop is seamless.
 */
const Carousel = memo(({ onClick, projects }) => {
    // We duplicate the project list to create a seamless infinite loop illusion.
    // 4x is usually enough to cover the screen width during transition.
    const extendedProjects = useMemo(() => {
        if (!projects || projects.length === 0) return [];
        return [...projects, ...projects, ...projects, ...projects];
    }, [projects]);

    return (
        <div
            className="carousel-container"
            style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '100vw',
                overflow: 'hidden',
                pointerEvents: 'auto',
                zIndex: 10,
            }}
        >
            <div className="carousel-track">
                {extendedProjects.map((proj, idx) => (
                    <ProjectCard
                        key={`${proj.id}-${idx}`}
                        project={proj}
                        onClick={onClick}
                    />
                ))}
            </div>
        </div>
    );
});

export default Carousel;
