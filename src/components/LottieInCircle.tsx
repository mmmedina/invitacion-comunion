import React, { useMemo } from 'react';
import Lottie from 'react-lottie-player';

type Props = {
  iconAnim: any | null; // JSON Lottie (sanitizado por useIcon)
  diameter?: number; // diámetro del círculo (px). default 112
  padding?: number; // margen interno para que “respire”. default 8
  bg?: string; // color de fondo del círculo (CSS var o color)
  className?: string; // clases extra para el wrapper del círculo
  style?: React.CSSProperties;
  loop?: boolean;
  autoplay?: boolean;
  shadow?: boolean; // si querés sombra
};

export default function LottieInCircle({
  iconAnim,
  diameter = 112,
  padding = 8,
  bg = 'var(--c-rosa)',
  className,
  style,
  loop = true,
  autoplay = true,
  shadow = true,
}: Props) {
  // calcular escala solo si hace falta (nunca ampliar)
  const scale = useMemo(() => {
    const w = iconAnim?.w ?? 0;
    const h = iconAnim?.h ?? 0;
    if (!w || !h) return 1;
    const maxInner = diameter - padding * 2;
    return Math.min(1, maxInner / Math.max(w, h));
  }, [iconAnim, diameter, padding]);

  if (!iconAnim) return null;

  const w = iconAnim?.w ?? '100%';
  const h = iconAnim?.h ?? '100%';

  return (
    <div
      className={className}
      style={{
        width: diameter,
        height: diameter,
        borderRadius: '50%',
        background: bg,
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        boxShadow: shadow ? '0 6px 18px rgba(0,0,0,.08)' : undefined,
        ...style,
      }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
        <Lottie
          loop={loop}
          play={autoplay}
          animationData={iconAnim}
          style={{ width: w, height: h }}
        />
      </div>
    </div>
  );
}
