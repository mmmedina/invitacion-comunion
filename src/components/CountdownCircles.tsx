// src/components/CountdownCircles.tsx
import { useCountdown } from '@/hooks/useCountdown';
import { INVITE } from '@/config/invite';

export function CountdownCircles({ date }: { date: Date }) {
  const { d, h, m, s } = useCountdown(date);
  const items = [
    { v: d, label: 'Días' },
    { v: h, label: 'Horas' },
    { v: m, label: 'Minutos' },
    { v: s, label: 'Segundos' },
  ];
  return (
    <div className="flex justify-center gap-3 mt-6 sm:gap-5 flex-nowrap">
      {items.map(({ v, label }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-md sm:w-24 sm:h-24"
          style={{ backgroundColor: INVITE.colores.rosa }}
        >
          <span className="text-xl font-bold text-white sm:text-3xl">
            {String(v).padStart(2, '0')}
          </span>
          <span className="text-[9px] sm:text-xs uppercase tracking-wide text-white">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
