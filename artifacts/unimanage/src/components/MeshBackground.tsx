import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const POINTS = [
  { pos: '10% 20%', size: '38%' },
  { pos: '30% 80%', size: '42%' },
  { pos: '50% 30%', size: '28%' },
  { pos: '70% 70%', size: '36%' },
  { pos: '85% 25%', size: '34%' },
  { pos: '20% 40%', size: '46%' },
];
const CROSSFADE = 1400;
const INTERVAL  = 2200;

function rnd(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// Dark mode: random vivid colors
function randomRGB() {
  return `rgb(${rnd(40, 220)}, ${rnd(30, 220)}, ${rnd(40, 220)})`;
}

// Light mode: gold and blue family — shuffled each call so animation is visible
const LIGHT_PALETTE = [
  'rgb(212,175,55)',   // gold
  'rgb(178,135,37)',   // gold dark
  'rgb(26,86,219)',    // blue
  'rgb(59,130,246)',   // blue light
  'rgb(234,200,80)',   // pale gold
  'rgb(99,157,245)',   // soft blue
  'rgb(255,215,0)',    // bright gold
  'rgb(37,99,235)',    // deep blue
];

function lightColors() {
  // Shuffle a copy of the palette so each crossfade picks a different arrangement
  const shuffled = [...LIGHT_PALETTE].sort(() => Math.random() - 0.5);
  return Array.from({ length: POINTS.length }, (_, i) => shuffled[i % shuffled.length]);
}

function buildBackground(colors: string[]) {
  const layers = POINTS.map((pt, i) => {
    const c = colors[i % colors.length];
    return `radial-gradient(circle at ${pt.pos}, ${c} 0%, rgba(0,0,0,0) ${pt.size})`;
  });
  const shine = `radial-gradient(60% 40% at 50% 10%, rgba(255,255,255,0.04), rgba(255,255,255,0) 18%)`;
  return [...layers, shine].join(', ');
}

export default function MeshBackground() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const currentLayer  = useRef<HTMLDivElement | null>(null);
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const { theme }     = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function createLayer(colors: string[]) {
      const el = document.createElement('div');
      el.style.cssText = `
        position:absolute; inset:0; width:100%; height:100%;
        background-repeat:no-repeat; background-size:cover;
        opacity:0; pointer-events:none; will-change:opacity;
        filter:blur(34px) saturate(1.2) hue-rotate(${rnd(-15, 15)}deg);
        transform:scale(1.04);
        mix-blend-mode:${theme === 'light' ? 'multiply' : 'screen'};
        transition:opacity ${CROSSFADE}ms ease;
      `;
      el.style.backgroundImage = buildBackground(colors);
      return el;
    }

    function crossfadeTo(colors: string[]) {
      if (!container) return;
      const newLayer = createLayer(colors);
      container.insertBefore(newLayer, container.firstChild);
      void newLayer.offsetHeight;
      newLayer.style.opacity = '1';

      const prev = currentLayer.current;
      if (prev) {
        prev.style.opacity = '0';
        const cleanup = () => { if (prev.parentNode) prev.parentNode.removeChild(prev); };
        prev.addEventListener('transitionend', function onEnd(e) {
          if ((e as TransitionEvent).propertyName === 'opacity') {
            cleanup();
            prev.removeEventListener('transitionend', onEnd);
          }
        });
        setTimeout(cleanup, CROSSFADE + 100);
      }
      currentLayer.current = newLayer;
    }

    function randomColors() {
      return theme === 'light' ? lightColors() : Array.from({ length: POINTS.length }, () => randomRGB());
    }

    // Clear old layers on theme switch
    while (container.firstChild) container.removeChild(container.firstChild);
    currentLayer.current = null;

    if (reduced) {
      const el = createLayer(randomColors());
      el.style.transition = 'none';
      el.style.opacity = '1';
      container.appendChild(el);
      return;
    }

    crossfadeTo(randomColors());
    timerRef.current = setInterval(() => crossfadeTo(randomColors()), INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      while (container.firstChild) container.removeChild(container.firstChild);
      currentLayer.current = null;
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        opacity: theme === 'light' ? 0.35 : 0.22,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
