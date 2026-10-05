import React, { useState, useEffect, useRef, memo } from 'react';
import { getAssistantResponse, QUICK_PROMPTS } from './archiveKnowledge';
import { playHoverTick, playSlideTick } from '../../utils/audioSystem';
import { RobotIcon } from './FloatingChatTrigger';

const INITIAL_MESSAGES = [
  {
    sender: 'system',
    id: 'msg-init',
    text: 'Hola. Bienvenido al **Archivo Interactivo de Rodrigo Valenzuela**.\n\nPuedo responder tus dudas sobre sus proyectos, stack de desarrollo, servicios freelance y disponibilidad para 2026.\n\n📩 **Contacto directo:** Rodry_valenzuela@hotmail.com',
    suggestions: ['¿Quién es Rodrigo?', 'Ver proyectos', 'Servicios & disponibilidad', 'Contacto & cotizaciones'],
    actions: [
      { label: 'EXPLORAR PROYECTOS', query: 'proyectos' },
      { label: 'RODRY_VALENZUELA@HOTMAIL.COM ✉', url: 'mailto:Rodry_valenzuela@hotmail.com' },
      { label: 'COPIAR CORREO', copyText: 'Rodry_valenzuela@hotmail.com' }
    ]
  }
];

const ArchiveAssistant = memo(({ isOpen, onClose }) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [copiedAction, setCopiedAction] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Bloquear scroll del body al abrir y enfocar el input
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'auto';
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, onClose]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    playSlideTick();

    const userMsg = {
      sender: 'user',
      id: `usr-${Date.now()}`,
      text: query,
    };

    const response = getAssistantResponse(query);
    const systemMsg = {
      sender: 'system',
      id: `sys-${Date.now() + 1}`,
      ...response
    };

    setMessages(prev => [...prev, userMsg, systemMsg]);
    setInputValue('');
  };

  const handleKeyDownInput = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleActionClick = (action) => {
    playHoverTick();
    if (action.query) {
      handleSend(action.query);
      return;
    }
    if (action.copyText) {
      navigator.clipboard?.writeText(action.copyText);
      setCopiedAction(action.label);
      setTimeout(() => setCopiedAction(null), 2000);
    }
  };

  const handleClearChat = () => {
    playHoverTick();
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div
      className="archive-assistant-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(5, 5, 5, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'aaFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both'
      }}
    >
      <style>{`
        @keyframes aaFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .archive-modal {
          width: 100%;
          max-width: 680px;
          height: 82vh;
          max-height: 720px;
          background-color: #080808;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.85), 0 0 1px rgba(223, 255, 0, 0.2);
          overflow: hidden;
        }
        .aa-corner {
          position: absolute;
          width: 8px;
          height: 8px;
          border-color: var(--acid-green);
          pointer-events: none;
          z-index: 10;
        }
        .aa-corner-tl { top: -1px; left: -1px; border-top: 2px solid var(--acid-green); border-left: 2px solid var(--acid-green); }
        .aa-corner-tr { top: -1px; right: -1px; border-top: 2px solid var(--acid-green); border-right: 2px solid var(--acid-green); }
        .aa-corner-bl { bottom: -1px; left: -1px; border-bottom: 2px solid var(--acid-green); border-left: 2px solid var(--acid-green); }
        .aa-corner-br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--acid-green); border-right: 2px solid var(--acid-green); }

        .aa-header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.02);
          gap: 12px;
        }
        .aa-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: var(--acid-green);
          box-shadow: 0 0 8px var(--acid-green);
          display: inline-block;
          animation: aaPulse 2s infinite ease-in-out;
        }
        @keyframes aaPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        .aa-btn-close {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #aaa;
          font-family: var(--font-mono);
          font-size: 10px;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 1px;
        }
        .aa-btn-close:hover {
          color: #fff;
          border-color: var(--acid-green);
          background: rgba(223, 255, 0, 0.08);
        }

        .aa-messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        .aa-messages-container::-webkit-scrollbar {
          width: 4px;
        }
        .aa-messages-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        .aa-msg-row {
          display: flex;
          flex-direction: column;
          max-width: 90%;
          animation: aaMsgIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes aaMsgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .aa-msg-row--user {
          align-self: flex-end;
          align-items: flex-end;
        }
        .aa-msg-row--system {
          align-self: flex-start;
          align-items: flex-start;
        }

        .aa-msg-sender-tag {
          font-size: 9px;
          font-family: var(--font-mono);
          letter-spacing: 1.5px;
          margin-bottom: 4px;
          text-transform: uppercase;
        }
        .aa-msg-sender-tag--user { color: #888; }
        .aa-msg-sender-tag--system { color: var(--acid-green); }

        .aa-bubble {
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 13px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .aa-bubble--user {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #fff;
          border-right: 2px solid var(--acid-green);
        }
        .aa-bubble--system {
          background: rgba(18, 18, 18, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ddd;
          border-left: 2px solid var(--acid-green);
        }
        .aa-bubble strong {
          color: #fff;
          font-weight: 600;
        }

        .aa-actions-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        .aa-action-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #eee;
          font-family: var(--font-mono);
          font-size: 10px;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          letter-spacing: 0.8px;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .aa-action-btn:hover {
          border-color: var(--acid-green);
          color: var(--acid-green);
          background: rgba(223, 255, 0, 0.08);
          transform: translateY(-1px);
        }

        .aa-quick-prompts-bar {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .aa-quick-prompts-bar::-webkit-scrollbar { display: none; }
        .aa-prompt-chip {
          white-space: nowrap;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #bbb;
          font-size: 10px;
          font-family: var(--font-mono);
          padding: 5px 11px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .aa-prompt-chip:hover {
          color: #fff;
          border-color: var(--acid-green);
          background: rgba(223, 255, 0, 0.06);
        }

        .aa-input-bar {
          padding: 14px 20px;
          background: #050505;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .aa-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 6px;
          padding: 10px 14px;
          color: #fff;
          font-family: var(--font-mono);
          font-size: 12px;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .aa-input:focus {
          border-color: var(--acid-green);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 12px rgba(223, 255, 0, 0.15);
        }
        .aa-input::placeholder {
          color: #666;
        }
        .aa-send-btn {
          background: var(--acid-green);
          border: none;
          color: #050505;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .aa-send-btn:hover {
          filter: brightness(1.1);
          box-shadow: 0 0 14px rgba(223, 255, 0, 0.4);
          transform: translateY(-1px);
        }
        .aa-send-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          .archive-modal {
            height: 90vh;
            max-height: none;
          }
          .aa-header {
            padding: 12px 14px;
          }
          .aa-messages-container {
            padding: 14px;
          }
          .aa-input-bar {
            padding: 10px 14px;
          }
        }
      `}</style>

      {/* Tarjeta / Modal */}
      <div className="archive-modal" onClick={e => e.stopPropagation()}>
        {/* Esquinas Brutalistas */}
        <div className="aa-corner aa-corner-tl" />
        <div className="aa-corner aa-corner-tr" />
        <div className="aa-corner aa-corner-bl" />
        <div className="aa-corner aa-corner-br" />

        {/* Header */}
        <div className="aa-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgba(223, 255, 0, 0.08)',
              border: '1px solid rgba(223, 255, 0, 0.25)',
              color: 'var(--acid-green)'
            }}>
              <RobotIcon size={18} color="var(--acid-green)" />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                color: '#fff',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>RODRIGO VALENZUELA // AI CHAT</span>
                <span className="aa-status-dot" />
              </div>
              <div style={{
                fontSize: '9px',
                color: 'rgba(255, 255, 255, 0.45)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexWrap: 'wrap'
              }}>
                <span>CONTACTO DIRECTO:</span>
                <a
                  href="mailto:Rodry_valenzuela@hotmail.com"
                  onClick={playHoverTick}
                  style={{
                    color: 'var(--acid-green)',
                    textDecoration: 'underline',
                    fontWeight: 600
                  }}
                >
                  Rodry_valenzuela@hotmail.com ✉
                </a>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="aa-btn-close"
              onClick={handleClearChat}
              title="Reiniciar conversación"
              onMouseEnter={playHoverTick}
            >
              RESET ⟲
            </button>
            <button
              type="button"
              className="aa-btn-close"
              onClick={onClose}
              title="Cerrar modal"
              onMouseEnter={playHoverTick}
            >
              [ESC] ✕
            </button>
          </div>
        </div>

        {/* Mensajes */}
        <div className="aa-messages-container">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`aa-msg-row aa-msg-row--${msg.sender}`}
            >
              <span className={`aa-msg-sender-tag aa-msg-sender-tag--${msg.sender}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                {msg.sender === 'user' ? (
                  'YOU // QUERY'
                ) : (
                  <>
                    <RobotIcon size={12} color="var(--acid-green)" />
                    <span>AI ASSISTANT // ARCHIVE</span>
                  </>
                )}
              </span>

              <div className={`aa-bubble aa-bubble--${msg.sender}`}>
                {msg.text.split('\n').map((line, lIdx) => {
                  if (!line) return <br key={lIdx} />;
                  // Parsear negritas (**texto**) y el correo electrónico como link directo
                  const parts = line.split(/(\*\*.*?\*\*|Rodry_valenzuela@hotmail\.com)/gi);
                  return (
                    <div key={lIdx}>
                      {parts.map((p, pIdx) => {
                        if (!p) return null;
                        if (p.toLowerCase() === 'rodry_valenzuela@hotmail.com') {
                          return (
                            <a
                              key={pIdx}
                              href="mailto:Rodry_valenzuela@hotmail.com"
                              style={{ color: 'var(--acid-green)', textDecoration: 'underline', fontWeight: 600 }}
                            >
                              {p}
                            </a>
                          );
                        }
                        if (p.startsWith('**') && p.endsWith('**')) {
                          const inner = p.slice(2, -2);
                          if (inner.toLowerCase() === 'rodry_valenzuela@hotmail.com') {
                            return (
                              <a
                                key={pIdx}
                                href="mailto:Rodry_valenzuela@hotmail.com"
                                style={{ color: 'var(--acid-green)', textDecoration: 'underline', fontWeight: 700 }}
                              >
                                {inner}
                              </a>
                            );
                          }
                          return <strong key={pIdx}>{inner}</strong>;
                        }
                        return p;
                      })}
                    </div>
                  );
                })}

                {/* Acciones directas (links, botones de query, copiar) */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="aa-actions-group">
                    {msg.actions.map((act, aIdx) =>
                      act.url ? (
                        <a
                          key={aIdx}
                          href={act.url}
                          target={act.external ? '_blank' : undefined}
                          rel={act.external ? 'noopener noreferrer' : undefined}
                          download={act.download || undefined}
                          className="aa-action-btn"
                          style={{ textDecoration: 'none' }}
                          onClick={playHoverTick}
                        >
                          {act.label}
                        </a>
                      ) : (
                        <button
                          key={aIdx}
                          type="button"
                          className="aa-action-btn"
                          onClick={() => handleActionClick(act)}
                        >
                          {copiedAction === act.label ? 'COPIADO ✓' : act.label}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Barra de Preguntas Rápidas */}
        <div className="aa-quick-prompts-bar">
          <span style={{
            fontSize: '9px',
            fontFamily: 'var(--font-mono)',
            color: 'rgba(255, 255, 255, 0.4)',
            alignSelf: 'center',
            letterSpacing: '1px'
          }}>
            SUGERENCIAS:
          </span>
          {QUICK_PROMPTS.map(p => (
            <button
              key={p.id}
              type="button"
              className="aa-prompt-chip"
              onClick={() => handleSend(p.query)}
              onMouseEnter={playHoverTick}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Barra de Entrada / Terminal */}
        <div className="aa-input-bar">
          <input
            ref={inputRef}
            type="text"
            className="aa-input"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDownInput}
            placeholder="Pregunta sobre proyectos, servicios, stack o contacto..."
            aria-label="Escribe tu consulta"
          />
          <button
            type="button"
            className="aa-send-btn"
            onClick={() => handleSend()}
            onMouseEnter={playHoverTick}
          >
            SEND ↵
          </button>
        </div>
      </div>
    </div>
  );
});

ArchiveAssistant.displayName = 'ArchiveAssistant';

export default ArchiveAssistant;
