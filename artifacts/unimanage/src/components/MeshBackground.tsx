import { useEffect, useRef } from 'react';

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

function randomRGB() {
  return `rgb(${rnd(40,220)}, ${rnd(30,220)}, ${rnd(40,220)})`;
}

function buildBackground(colors: string[]) {
  const layers = POINTS.map((pt, i) => {
    const c = colors[i % colors.length];
    return `radial-gradient(circle at ${pt.pos}, ${c} 0%, rgba(0,0,0,0) ${pt.size})`;
  });
  const shine = `radial-gradient(60% 40% at 50% 10%, rgba(255,255,255,0.02), rgba(255,255,255,0) 18%)`;
  return [...layers, shine].join(', ');
}

export default function MeshBackground() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const currentLayer  = useRef<HTMLDivElement | null>(null);
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null);

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
        filter:blur(32px) saturate(1.1) hue-rotate(${rnd(-20, 20)}deg);
        transform:scale(1.04);
        mix-blend-mode:screen;
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
        const cleanup = () => {
          if (prev.parentNode) prev.parentNode.removeChild(prev);
        };
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
      return Array.from({ length: POINTS.length }, () => randomRGB());
    }

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
      // clean up layers
      while (container.firstChild) container.removeChild(container.firstChild);
      currentLayer.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        opacity: 0.22,      // subtle — keeps text legible
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
