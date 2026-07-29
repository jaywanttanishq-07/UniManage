import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;
    const timeout = setTimeout(() => {
      function step(ts: number) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        // ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) raf.current = requestAnimationFrame(step);
      }
      raf.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf.current);
    };
  }, [target, duration, delay]);

  return value;
}
