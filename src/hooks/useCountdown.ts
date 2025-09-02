// src/hooks/useCountdown.ts
import { useEffect, useState } from 'react';

export function useCountdown(target: Date) {
  const [diff, setDiff] = useState(() =>
    Math.max(0, target.getTime() - Date.now())
  );

  useEffect(() => {
    const id = setInterval(
      () => setDiff(Math.max(0, target.getTime() - Date.now())),
      1000
    );
    return () => clearInterval(id);
  }, [target]);

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  return { d, h, m, s };
}
