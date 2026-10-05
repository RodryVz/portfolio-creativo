import React, { useEffect, useState } from 'react';

export default function FooterMeta() {
    const [time, setTime] = useState('');

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour12: false }) + ' (GMT-4)');
        };
        update();
        const int = setInterval(update, 1000);
        return () => clearInterval(int);
    }, []);

    return (
        <div style={{
            position: 'absolute',
            bottom: 'var(--footer-bottom)',
            left: '0',
            width: '100%',
            padding: 'var(--footer-padding)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 'var(--meta-font-size)',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '1px',
            zIndex: 20,
            pointerEvents: 'none',
            flexWrap: 'wrap',
            gap: '15px'
        }}>
            <style>{`
                @media (max-width: 640px) {
                    .footer-location-block { display: none; }
                    .footer-main-text { width: 100%; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px; }
                }
            `}</style>
            
            <div className="footer-main-text">© 2026 VALENZUELA RODRIGO STUDIO</div>
            
            <div style={{ display: 'flex', gap: '30px', textAlign: 'right' }}>
                <div>
                    <div style={{ opacity: 0.5, fontSize: '8px' }}>TIME</div>
                    <div style={{ color: '#fff' }}>{time}</div>
                </div>
                <div className="footer-location-block">
                    <div style={{ opacity: 0.5, fontSize: '8px' }}>LOCATION</div>
                    <div style={{ color: '#fff' }}>RESISTENCIA, CHACO / ARG</div>
                </div>
            </div>
        </div>
    );
}
