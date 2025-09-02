// src/components/MapButton.tsx
import { INVITE } from '@/config/invite';

export function MapButton({ query }: { query: string }) {
  const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-block px-6 py-3 mt-4 text-base font-semibold text-white rounded-xl
                 transition-transform duration-200 lg:hover:-translate-y-[1px]"
      style={{ backgroundColor: INVITE.colores.rosaBtn }}
    >
      Ver Mapa
    </a>
  );
}
