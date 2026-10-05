import React, { memo, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { playHoverTick, playSlideTick } from '../../utils/audioSystem';

const MotionDiv = motion.div;

export const RobotIcon = ({ size = 22, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
  >
    {/* Antena superior con nodo receptor iluminado */}
    <path d="M12 2V5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="2.2" r="1.4" fill="var(--acid-green)" />

    {/* Estructura geométrica de la cabeza */}
    <rect x="4.2" y="5.2" width="15.6" height="13.6" rx="3.8" stroke={color} strokeWidth="1.6" />

    {/* Visor digital cibernético */}
    <rect x="6.8" y="8.2" width="10.4" height="4.4" rx="1.6" fill="rgba(223, 255, 0, 0.16)" stroke={color} strokeWidth="1.2" />

    {/* Ojos ópticos en verde ácido con brillo */}
    <circle cx="9.4" cy="10.4" r="1.3" fill="var(--acid-green)" />
    <circle cx="14.6" cy="10.4" r="1.3" fill="var(--acid-green)" />

    {/* Rejilla de comunicación / síntesis de voz */}
    <path d="M8.8 15.6H15.2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />

    {/* Sensores laterales / pernos */}
    <path d="M2.2 10.4H4.2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M19.8 10.4H21.8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const FloatingChatTrigger = memo(({ onClick, isVisible = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dragBounds, setDragBounds] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const isDraggingRef = useRef(false);
  const dragDistanceRef = useRef(0);

  // Calcular límites de arrastre en base al tamaño de la ventana
  useEffect(() => {
    const updateBounds = () => {
      const orbSize = 54;
      const margin = 16;
      const isMobile = window.innerWidth <= 768;
      const initialRight = isMobile ? 20 : 42;
      const initialBottom = isMobile ? 56 : 78;

      setDragBounds({
        left: -(window.innerWidth - initialRight - orbSize - margin),
        right: initialRight - margin,
        top: -(window.innerHeight - initialBottom - orbSize - margin),
        bottom: initialBottom - margin,
      });
    };

    updateBounds();
    window.addEventListener('resize', updateBounds, { passive: true });
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  const handlePointerDown = () => {
    dragDistanceRef.current = 0;
    isDraggingRef.current = false;
  };

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDrag = (_event, info) => {
    dragDistanceRef.current += Math.hypot(info.delta.x, info.delta.y);
    if (dragDistanceRef.current > 5) {
      isDraggingRef.current = true;
    }
  };

  const handleDragEnd = () => {
    // Si fue un arrastre real, evitar el click momentáneamente
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 80);
  };

  const handleClick = (e) => {
    if (isDraggingRef.current || dragDistanceRef.current > 6) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    playSlideTick();
    onClick?.();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHoverTick();
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--floating-chat-bottom, 78px)',
        right: 'var(--floating-chat-right, 42px)',
        zIndex: 85,
        pointerEvents: isVisible ? 'auto' : 'none',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>{`
        :root {
          --floating-chat-bottom: 78px;
          --floating-chat-right: 42px;
        }

        @media (max-width: 768px) {
          :root {
            --floating-chat-bottom: 56px;
            --floating-chat-right: 20px;
          }
        }

        /* Anillo orbital rotativo de radar */
        @keyframes radarSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Pulso de onda de energía */
        @keyframes cyberPulse {
          0% {
            transform: scale(0.96);
            opacity: 0.65;
          }
          70% {
            transform: scale(1.32);
            opacity: 0;
          }
          100% {
            transform: scale(1.32);
            opacity: 0;
          }
        }

        /* Leve respiración gravitacional en reposo */
        @keyframes idleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .floating-orb-wrapper {
          position: relative;
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
          user-select: none;
          touch-action: none;
          will-change: transform;
          animation: idleFloat 3.8s ease-in-out infinite;
        }

        .floating-orb-wrapper:active {
          cursor: grabbing;
        }

        /* Onda expansiva de señal */
        .cyber-wave-ring {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1px solid var(--acid-green);
          pointer-events: none;
          will-change: transform, opacity;
          animation: cyberPulse 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }

        /* Anillo orbital exterior punteado */
        .cyber-orbital-track {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px dashed rgba(223, 255, 0, 0.3);
          pointer-events: none;
          will-change: transform;
          animation: radarSpin 16s linear infinite;
        }

        /* Cuerpo principal de la burbuja */
        .floating-orb-button {
          position: relative;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, rgba(28, 28, 28, 0.96) 0%, rgba(6, 6, 6, 0.98) 100%);
          border: 1.5px solid rgba(223, 255, 0, 0.42);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 10px 26px rgba(0, 0, 0, 0.8),
            0 0 14px rgba(223, 255, 0, 0.16),
            inset 0 0 10px rgba(223, 255, 0, 0.1);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          padding: 0;
          outline: none;
          cursor: inherit;
        }

        .floating-orb-button:hover {
          border-color: var(--acid-green);
          box-shadow: 
            0 14px 34px rgba(0, 0, 0, 0.9),
            0 0 24px rgba(223, 255, 0, 0.4),
            inset 0 0 14px rgba(223, 255, 0, 0.22);
        }

        /* Luz LED de estado cibernético */
        .cyber-status-led {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--acid-green);
          box-shadow: 0 0 8px var(--acid-green);
          border: 1.5px solid #050505;
        }
      `}</style>

      <MotionDiv
        drag
        dragConstraints={dragBounds}
        dragElastic={0.12}
        dragMomentum={false}
        onPointerDown={handlePointerDown}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: 1.08 }}
        whileDrag={{ scale: 1.14, cursor: 'grabbing' }}
        className="floating-orb-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Onda expansiva de señal continua */}
        <div className="cyber-wave-ring" />

        {/* Anillo de rastreo orbital radar */}
        <div className="cyber-orbital-track" />

        {/* Botón Orb con Icono de Robot Únicamente */}
        <button
          type="button"
          className="floating-orb-button"
          onClick={handleClick}
          aria-label="Abrir asistente de chat interactivo"
        >
          {/* LED de estado activo */}
          <span className="cyber-status-led" />

          {/* Icono del Robot exclusivo */}
          <RobotIcon
            size={25}
            color={isHovered ? 'var(--acid-green)' : '#ffffff'}
          />
        </button>
      </MotionDiv>
    </div>
  );
});

FloatingChatTrigger.displayName = 'FloatingChatTrigger';

export default FloatingChatTrigger;
