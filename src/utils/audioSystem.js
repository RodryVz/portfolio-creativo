/* ============================================================
   audioSystem.js - Synthetic Haptic Sound Engine (Web Audio API)
   Zero external assets, 100% native synthesis, lightweight & elegant
   ============================================================ */

let audioCtx = null;
let soundEnabled = false;
const listeners = new Set();

// Cargar preferencia guardada (por defecto silencio para no invadir)
try {
  soundEnabled = localStorage.getItem('rv_portfolio_sound') === 'true';
} catch {
  soundEnabled = false;
}

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function subscribeSoundState(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyListeners() {
  listeners.forEach(cb => {
    try { cb(soundEnabled); } catch { /* ignore */ }
  });
}

export function toggleSound() {
  const next = !soundEnabled;
  soundEnabled = next;
  try {
    localStorage.setItem('rv_portfolio_sound', String(next));
  } catch { /* ignore */ }

  if (soundEnabled) {
    const ctx = getAudioContext();
    if (ctx) {
      playChime(ctx, 580, 880);
    }
  }
  notifyListeners();
  return soundEnabled;
}

function playChime(ctx, freq1, freq2) {
  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc2.type = 'sine';
  osc1.frequency.setValueAtTime(freq1, now);
  osc2.frequency.setValueAtTime(freq2, now + 0.05);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now + 0.05);
  osc1.stop(now + 0.25);
  osc2.stop(now + 0.25);
}

/**
 * Click mecánico háptico para el cambio de diapositiva en el carrusel
 */
export function playSlideTick() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate(8); } catch { /* ignore */ }
  }
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Caída de frecuencia rápida estilo golpe mecánico suave
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(35, now + 0.028);

  gain.gain.setValueAtTime(0.07, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.032);
}

/**
 * Micro-blip sutil al posar el cursor sobre elementos interactivos
 */
export function playHoverTick() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(840, now);
  osc.frequency.exponentialRampToValueAtTime(1100, now + 0.016);

  gain.gain.setValueAtTime(0.025, now);
  gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.02);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.022);
}

/**
 * Resonancia futurista al abrir la vista de detalles o menú
 */
export function playOpenSwell() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const sub = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  sub.type = 'sine';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(540, now + 0.16);
  sub.frequency.setValueAtTime(160, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.07, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

  osc.connect(gain);
  sub.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  sub.start(now);
  osc.stop(now + 0.23);
  sub.stop(now + 0.23);
}

/**
 * Blip sutil descendente al cerrar modal o menú
 */
export function playCloseBlip() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(420, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.14);
}
