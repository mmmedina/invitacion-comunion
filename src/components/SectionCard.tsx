// src/components/SectionCard.tsx
import React from 'react';
import Lottie from 'lottie-react';
import { INVITE } from '@/config/invite';

type Props = {
  bg: string;
  title: string;
  iconAnim?: unknown;
  gradFrom: string;
  gradTo: string;
  children: React.ReactNode;
  iconStyle?: React.CSSProperties;
};

export function SectionCard({
  bg,
  title,
  iconAnim,
  gradFrom,
  gradTo,
  children,
  iconStyle,
}: Props) {
  return (
    <div
      className="p-6 mt-10 text-center border sm:mt-12 rounded-2xl sm:p-8
                 transition-all duration-300 lg:hover:shadow-lg lg:hover:-translate-y-0.5"
      style={{ background: bg, borderColor: INVITE.colores.pastelBorder }}
    >
      <h3
        className="mb-4 text-5xl font-normal sm:text-6xl"
        style={{ fontFamily: "'Great Vibes', cursive" }}
      >
        {title}
      </h3>

      <div
        className="w-32 h-32 mx-auto overflow-hidden rounded-full shadow-md sm:w-36 sm:h-36"
        style={{
          background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
        }}
        title={title}
      >
        {iconAnim ? (
          <Lottie
            animationData={iconAnim}
            loop
            style={{ width: '100%', height: '100%', ...iconStyle }}
          />
        ) : (
          <div className="grid w-full h-full px-3 text-sm text-center place-items-center text-white/80">
            Animación {title}
          </div>
        )}
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}
