import React, { useEffect, useMemo, useRef, useState } from 'react';
import Lottie from 'lottie-react';

import ceremoniaAnim from '../public/lotties/church.json';
import celebracionAnim from '../public/lotties/confetti2.json';
import dresscodeAnim from '../public/lotties/dress.json';

/* =========================================================
   CONFIG BÁSICA
   ========================================================= */
const INVITE = {
  nombreNina: 'Sofía Paz',
  titulo: 'Mi Primera Comunión',
  fechaISO: '2025-09-13T12:00:00-03:00',
  duracionMin: 60,
  portada: '/Bautismo Chofi-31.jpg',
  colores: {
    fondo: '#fff7f9',
    papel: '#fdeef3',
    primario: '#b56576',
    secundario: '#6d597a',
    rosa: '#f4a6b7',
    gradCerFrom: '#f9a8d4',
    gradCerTo: '#ec4899',
    gradCelFrom: '#fbcfe8',
    gradCelTo: '#d946ef',
    gradDressFrom: '#c084fc',
    gradDressTo: '#7c3aed',
    pastelBorder: 'rgba(0,0,0,0.06)',
  },
  ceremonia: {
    titulo: 'Ceremonia',
    lugar: 'Colegio San Fernando',
    fechaTexto: '12:00 P.M.',
    direccion: 'Gral. Ricchieri 1425, Hurlingham',
    mapsQuery: 'Colegio San Fernando, Hurlingham',
  },
  celebracion: {
    titulo: 'Celebración',
    lugar: "Jano's Puerto Madero",
    fechaTexto: '14:30 P.M.',
    direccion: 'Av. Libertad 456, Hurlingham',
    mapsQuery: "Jano's Puerto Madero, Olga Cossettini 1031, CABA",
  },
  dress: { titulo: 'Dress Code', texto: 'Lucí tu mejor Look' },
  whatsapp: '5491164312028',
};

/* =========================================================
   STORAGE KEYS
   ========================================================= */
const COUNTDOWN_STYLE_KEY = 'countdownStyle';
const COUNTDOWN_COLOR_KEY = 'countdownColor';

const FONT_TITLE_KEY = 'font:title';
const FONT_BODY_KEY = 'font:body';

const PORTADA_IMG_KEY = 'portadaImg';

const BG_COLOR_KEY = 'bg:color';
const BG_TEXTURE_KEY = 'bg:texture';
const BG_TEXTURE_COLOR_KEY = 'bg:textureColor';

const TITLE_COLOR_KEY = 'color:title';
const BODY_COLOR_KEY = 'color:body';

const SEC_CER_COLOR_KEY = 'sec:cer:color';
const SEC_CER_ALPHA_KEY = 'sec:cer:alpha';
const SEC_CEL_COLOR_KEY = 'sec:cel:color';
const SEC_CEL_ALPHA_KEY = 'sec:cel:alpha';
const SEC_DRS_COLOR_KEY = 'sec:drs:color';
const SEC_DRS_ALPHA_KEY = 'sec:drs:alpha';

const FINAL_BG_COLOR_KEY = 'final:bg:color';
const FINAL_BG_ALPHA_KEY = 'final:bg:alpha';

// colores por botón (edición por botón)
const BTN_AGENDAR_BG_KEY = 'btn:agendar:bg';
const BTN_CER_BG_KEY = 'btn:cer:bg';
const BTN_CEL_BG_KEY = 'btn:cel:bg';
const BTN_FINAL_BG_KEY = 'btn:final:bg';

// paleta seleccionada
const PALETTE_SELECTED_KEY = 'palette:selected';

/* =========================================================
   UTILS
   ========================================================= */
function safeGet<T>(k: string, fb: T): T {
  try {
    const v = localStorage.getItem(k);
    return v == null ? fb : JSON.parse(v);
  } catch {
    return fb;
  }
}
function safeSet<T>(k: string, v: T) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  const H =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  return {
    r: parseInt(H.slice(0, 2), 16),
    g: parseInt(H.slice(2, 4), 16),
    b: parseInt(H.slice(4, 6), 16),
  };
}
function rgba(hex: string, a: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

/* =========================================================
   TIPOGRAFÍAS
   ========================================================= */
const FONTS_TITLES = [
  { name: 'Great Vibes', css: "'Great Vibes', cursive" },
  { name: 'Parisienne', css: "'Parisienne', cursive" },
  { name: 'Dancing Script', css: "'Dancing Script', cursive" },
] as const;
const FONTS_BODY = [
  { name: 'Poppins', css: "'Poppins', sans-serif" },
  { name: 'Quicksand', css: "'Quicksand', sans-serif" },
  { name: 'Montserrat', css: "'Montserrat', sans-serif" },
] as const;

const TITLE_FONT_VAR = 'var(--font-titles)';
const BODY_FONT_VAR = 'var(--font-body)';
const TITLE_COLOR_VAR = 'var(--color-title)';
const BODY_COLOR_VAR = 'var(--color-body)';

/* =========================================================
   ICONOS (gris suave)
   ========================================================= */
const IconPencil = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={
      className + ' text-gray-500 hover:text-gray-700 transition-colors'
    }
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);
const IconSave = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={
      className + ' text-gray-500 hover:text-gray-700 transition-colors'
    }
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <path d="M17 21v-8H7v8M7 3v5h8" />
  </svg>
);
const IconUpload = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    className={
      className + ' text-gray-200/90 hover:text-white transition-colors'
    }
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 16V3" />
    <path d="M6 9l6-6 6 6" />
    <path d="M5 21h14a2 2 0 0 0 2-2v-4" />
    <path d="M19 21H5a2 2 0 0 1-2-2v-4" />
  </svg>
);
const IconFonts = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className + ' text-gray-500 hover:text-gray-700'}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 20h16" />
    <path d="M6 20 12 4l6 16" />
    <path d="M8 16h8" />
  </svg>
);
const IconPalette = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className + ' text-gray-500 hover:text-gray-700'}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 22a10 10 0 1 1 10-10c0 3-2 3-4 3-1 0-2 1-2 2s1 2 2 2" />
    <circle cx="7.5" cy="10.5" r="1" />
    <circle cx="12" cy="7.5" r="1" />
    <circle cx="16.5" cy="10.5" r="1" />
  </svg>
);
const IconPattern = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className + ' text-gray-500 hover:text-gray-700'}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="6" height="6" />
    <rect x="15" y="3" width="6" height="6" />
    <rect x="3" y="15" width="6" height="6" />
    <rect x="15" y="15" width="6" height="6" />
  </svg>
);

/* =========================================================
   PALETA PASTEL ÚNICA (9 colores bien diferenciados)
   ========================================================= */
const PASTELS: string[] = [
  '#F8B4B4', // coral suave
  '#FCD5B5', // damasco
  '#FDF3C4', // manteca
  '#BEE3DB', // menta
  '#AEECEF', // aqua
  '#BEE3F8', // celeste
  '#C7D2FE', // periwinkle
  '#E9D5FF', // lavanda
  '#E8D1E7', // malva
];

/* =========================================================
   COUNTDOWN + FORMAS
   ========================================================= */
type Shape = 'none' | 'round' | 'square' | 'heart' | 'star';

function useCountdown(target: Date) {
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
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}
function useSwipeX(onLeft: () => void, onRight: () => void, threshold = 40) {
  const startX = React.useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx <= -threshold) onLeft();
    if (dx >= threshold) onRight();
    startX.current = null;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') onRight();
    if (e.key === 'ArrowRight') onLeft();
  };
  return { onTouchStart, onTouchEnd, onKeyDown, tabIndex: 0 };
}

// contenedores especiales para corazón/estrella
function HeartBox({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path fill='${color}' d='M50 86s-35-19.6-35-47.2C15 26.2 25.4 16 38 16c7.3 0 12.4 3.8 12 3.5.4.3 4.7-3.5 12-3.5 12.6 0 23 10.2 23 22.8C85 66.4 50 86 50 86z'/></svg>`;
  return (
    <div
      className="relative w-16 h-16 shadow-md sm:w-24 sm:h-24"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
          svg
        )}")`,
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
function StarBox({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path fill='${color}' d='M50 5l12.9 26.1L92 35.7 71 56.2l4.6 27.9L50 72.6 24.4 84.1 29 56.2 8 35.7l29.1-4.6L50 5z'/></svg>`;
  return (
    <div
      className="relative w-16 h-16 shadow-md sm:w-24 sm:h-24"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
          svg
        )}")`,
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function Badge({
  value,
  label,
  shape,
  bg,
  textColor,
}: {
  value: number;
  label: string;
  shape: Shape;
  bg: string;
  textColor: string;
}) {
  const content = (
    <>
      <span
        className="font-bold"
        style={{ fontSize: 'clamp(1rem,3.2vw,1.875rem)', color: textColor }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span
        className="tracking-wide uppercase"
        style={{ fontSize: 'clamp(0.55rem,1.8vw,0.75rem)', color: textColor }}
      >
        {label}
      </span>
    </>
  );
  if (shape === 'none') {
    return (
      <div className="flex flex-col items-center justify-center w-16 h-16 sm:w-24 sm:h-24">
        {content}
      </div>
    );
  }
  if (shape === 'heart')
    return (
      <HeartBox color={bg}>
        <div className="flex flex-col items-center justify-center -translate-y-[6%]">
          {content}
        </div>
      </HeartBox>
    );
  if (shape === 'star')
    return (
      <StarBox color={bg}>
        <div className="flex flex-col items-center justify-center">
          {content}
        </div>
      </StarBox>
    );
  const base =
    'w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center shadow-md';
  const shapeCls = shape === 'round' ? 'rounded-full' : 'rounded-xl';
  return (
    <div className={`${base} ${shapeCls}`} style={{ background: bg }}>
      <div className="flex flex-col items-center justify-center">{content}</div>
    </div>
  );
}

const COUNTDOWN_VARIANTS: { key: Shape; label: string }[] = [
  { key: 'none', label: 'Sin marco' },
  { key: 'round', label: 'Redondo' },
  { key: 'square', label: 'Cuadrado' },
  { key: 'heart', label: 'Corazón' },
  { key: 'star', label: 'Estrella' },
];

function CountdownGallery({
  date,
  color,
  shapeIndex,
}: {
  date: Date;
  color: string;
  shapeIndex: number;
}) {
  const { d, h, m, s } = useCountdown(date);
  const items = [
    { v: d, label: 'Días' },
    { v: h, label: 'Horas' },
    { v: m, label: 'Minutos' },
    { v: s, label: 'Segundos' },
  ];
  const shape = COUNTDOWN_VARIANTS[shapeIndex].key;
  return (
    <div className="flex justify-center gap-3 mt-4 sm:gap-5 flex-nowrap">
      {items.map(({ v, label }) => (
        <Badge
          key={label}
          value={v}
          label={label}
          shape={shape}
          bg={color}
          textColor={shape === 'none' ? 'var(--color-body)' : '#ffffff'}
        />
      ))}
    </div>
  );
}

/* =========================================================
   TEXTURAS (usa misma paleta pastel)
   ========================================================= */
type Texture = 'circulos' | 'corazones' | 'estrellas' | 'triangulos';
const TEX_ALPHA = 0.18;
function textureCSS(tex: Texture, color: string) {
  const { r, g, b } = hexToRgb(color);
  const fill = `rgba(${r},${g},${b},${TEX_ALPHA})`;
  if (tex === 'circulos')
    return {
      image: `radial-gradient(${fill} 1px, transparent 1px)`,
      size: '22px 22px',
    };
  const svg = (path: string) =>
    `url("data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22' fill='${color}' fill-opacity='${TEX_ALPHA}'>${path}</svg>`
    )}")`;
  if (tex === 'corazones') {
    const p = `<path d="M11 18s-6-3.35-6-8a3.5 3.5 0 0 1 6-2.3A3.5 3.5 0 0 1 17 10c0 4.65-6 8-6 8Z"/>`;
    return { image: svg(p), size: '22px 22px' };
  }
  if (tex === 'estrellas') {
    const p = `<path d="M11 2l2.06 4.18 4.62.67-3.34 3.26.79 4.59L11 12.98 5.87 14.7l.79-4.59L3.32 6.85l4.62-.67L11 2z"/>`;
    return { image: svg(p), size: '22px 22px' };
  }
  const p = `<path d="M11 3l8 14H3l8-14z"/>`;
  return { image: svg(p), size: '22px 22px' };
}

/* =========================================================
   EDITORES (Tipografías / Textura / **Paleta de colores**)
   ========================================================= */
function TypographyEditor({
  open,
  onClose,
  titleIdx,
  setTitleIdx,
  bodyIdx,
  setBodyIdx,
}: {
  open: boolean;
  onClose: () => void;
  titleIdx: number;
  setTitleIdx: (n: number) => void;
  bodyIdx: number;
  setBodyIdx: (n: number) => void;
}) {
  if (!open) return null;
  const Chip = ({
    name,
    css,
    selected,
    onClick,
  }: {
    name: string;
    css: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md border text-sm transition ${
        selected
          ? 'bg-gray-900 text-white'
          : 'bg-white text-gray-800 hover:bg-gray-900 hover:text-white'
      }`}
      style={{ borderColor: '#000', fontFamily: css as any }}
    >
      {name}
    </button>
  );
  return (
    <div className="grid gap-4 mt-3">
      <div>
        <div
          className="mb-2 text-sm"
          style={{ fontFamily: BODY_FONT_VAR as any }}
        >
          Títulos
        </div>
        <div className="flex flex-wrap gap-2">
          {FONTS_TITLES.map((f, i) => (
            <Chip
              key={f.name}
              name={f.name}
              css={f.css}
              selected={i === titleIdx}
              onClick={() => setTitleIdx(i)}
            />
          ))}
        </div>
      </div>
      <div>
        <div
          className="mb-2 text-sm"
          style={{ fontFamily: BODY_FONT_VAR as any }}
        >
          Textos
        </div>
        <div className="flex flex-wrap gap-2">
          {FONTS_BODY.map((f, i) => (
            <Chip
              key={f.name}
              name={f.name}
              css={f.css}
              selected={i === bodyIdx}
              onClick={() => setBodyIdx(i)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-600 underline hover:text-gray-800"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

function TextureEditor({
  open,
  onClose,
  texture,
  setTexture,
  color,
  setColor,
}: {
  open: boolean;
  onClose: () => void;
  texture: Texture;
  setTexture: (t: Texture) => void;
  color: string;
  setColor: (c: string) => void;
}) {
  if (!open) return null;
  const label = (t: Texture) => t[0].toUpperCase() + t.slice(1);
  return (
    <div className="grid gap-3 mt-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {(
          ['circulos', 'corazones', 'estrellas', 'triangulos'] as Texture[]
        ).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTexture(t)}
            className={`px-3 py-1.5 rounded-md border text-sm transition ${
              texture === t
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-900 hover:text-white'
            }`}
            style={{ borderColor: '#000' }}
          >
            {label(t)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {PASTELS.map((hex) => (
          <button
            key={hex}
            onClick={() => setColor(hex)}
            className="w-6 h-6 border rounded-full border-black/20"
            style={{ backgroundColor: hex }}
            aria-label={hex}
            title={hex}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-600 underline hover:text-gray-800"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   **PALETAS DE COLORES** (8 opciones coordinadas)
   Cada paleta define colores coherentes y legibles.
   ========================================================= */

type Palette = {
  id: string;
  nombre: string;
  // fondo general y textura
  bgColor: string;
  textureColor: string;
  // tipografía
  titleColor: string;
  bodyColor: string;
  // secciones
  secCer: { color: string; alpha: number };
  secCel: { color: string; alpha: number };
  secDrs: { color: string; alpha: number };
  // botones (texto siempre blanco)
  btnAgendar: string;
  btnCer: string;
  btnCel: string;
  btnFinal: string;
  // final
  finalBg: string;
  finalAlpha: number;
  // countdown
  countdownColor: string;
};

const PALETTES: Palette[] = [
  {
    id: 'dulce-rosa',
    nombre: 'Dulce Rosa',
    bgColor: '#FFF6F9',
    textureColor: '#E8D1E7',
    titleColor: '#2A2A2A',
    bodyColor: '#4B4B4B',
    secCer: { color: '#F8B4B4', alpha: 0.22 },
    secCel: { color: '#BEE3F8', alpha: 0.22 },
    secDrs: { color: '#E9D5FF', alpha: 0.22 },
    btnAgendar: '#C7D2FE',
    btnCer: '#AEECEF',
    btnCel: '#BEE3F8',
    btnFinal: '#F8B4B4',
    finalBg: '#B56576',
    finalAlpha: 0.85,
    countdownColor: '#C7D2FE',
  },
  {
    id: 'clásico-dorado',
    nombre: 'Clásico Dorado',
    bgColor: '#FFFDF6',
    textureColor: '#FDF3C4',
    titleColor: '#1F2937',
    bodyColor: '#374151',
    secCer: { color: '#FDF3C4', alpha: 0.26 },
    secCel: { color: '#FCD5B5', alpha: 0.22 },
    secDrs: { color: '#E8D1E7', alpha: 0.22 },
    btnAgendar: '#C7D2FE',
    btnCer: '#F59E0B',
    btnCel: '#FBBF24',
    btnFinal: '#F59E0B',
    finalBg: '#92400E',
    finalAlpha: 0.92,
    countdownColor: '#F59E0B',
  },
  {
    id: 'menta-aqua',
    nombre: 'Menta Aqua',
    bgColor: '#F6FFFE',
    textureColor: '#AEECEF',
    titleColor: '#0F172A',
    bodyColor: '#334155',
    secCer: { color: '#BEE3DB', alpha: 0.24 },
    secCel: { color: '#AEECEF', alpha: 0.22 },
    secDrs: { color: '#C7D2FE', alpha: 0.22 },
    btnAgendar: '#0EA5E9',
    btnCer: '#10B981',
    btnCel: '#06B6D4',
    btnFinal: '#22C55E',
    finalBg: '#0EA5E9',
    finalAlpha: 0.88,
    countdownColor: '#06B6D4',
  },
  {
    id: 'lavanda-suave',
    nombre: 'Lavanda Suave',
    bgColor: '#F9F6FF',
    textureColor: '#E9D5FF',
    titleColor: '#1F1147',
    bodyColor: '#3F2F66',
    secCer: { color: '#E9D5FF', alpha: 0.26 },
    secCel: { color: '#C7D2FE', alpha: 0.24 },
    secDrs: { color: '#E8D1E7', alpha: 0.22 },
    btnAgendar: '#7C3AED',
    btnCer: '#6366F1',
    btnCel: '#8B5CF6',
    btnFinal: '#7C3AED',
    finalBg: '#6D28D9',
    finalAlpha: 0.9,
    countdownColor: '#8B5CF6',
  },
  {
    id: 'marina',
    nombre: 'Marina',
    bgColor: '#F3FAFF',
    textureColor: '#BEE3F8',
    titleColor: '#0B132B',
    bodyColor: '#1C2541',
    secCer: { color: '#BEE3F8', alpha: 0.23 },
    secCel: { color: '#AEECEF', alpha: 0.22 },
    secDrs: { color: '#C7D2FE', alpha: 0.22 },
    btnAgendar: '#1D4ED8',
    btnCer: '#2563EB',
    btnCel: '#0EA5E9',
    btnFinal: '#1D4ED8',
    finalBg: '#1E40AF',
    finalAlpha: 0.9,
    countdownColor: '#2563EB',
  },
  {
    id: 'frutilla-crema',
    nombre: 'Frutilla & Crema',
    bgColor: '#FFF5F7',
    textureColor: '#F8B4B4',
    titleColor: '#2C1810',
    bodyColor: '#4A2E22',
    secCer: { color: '#F8B4B4', alpha: 0.22 },
    secCel: { color: '#FDF3C4', alpha: 0.23 },
    secDrs: { color: '#FCD5B5', alpha: 0.23 },
    btnAgendar: '#EF4444',
    btnCer: '#DC2626',
    btnCel: '#EA580C',
    btnFinal: '#BE123C',
    finalBg: '#B91C1C',
    finalAlpha: 0.88,
    countdownColor: '#EF4444',
  },
  {
    id: 'bosque-pastel',
    nombre: 'Bosque Pastel',
    bgColor: '#F5FFF9',
    textureColor: '#BEE3DB',
    titleColor: '#052E2B',
    bodyColor: '#1F504D',
    secCer: { color: '#BEE3DB', alpha: 0.24 },
    secCel: { color: '#E9D5FF', alpha: 0.22 },
    secDrs: { color: '#FDF3C4', alpha: 0.22 },
    btnAgendar: '#16A34A',
    btnCer: '#10B981',
    btnCel: '#84CC16',
    btnFinal: '#16A34A',
    finalBg: '#065F46',
    finalAlpha: 0.9,
    countdownColor: '#10B981',
  },
  {
    id: 'atardecer',
    nombre: 'Atardecer',
    bgColor: '#FFF7F5',
    textureColor: '#FCD5B5',
    titleColor: '#3D0C02',
    bodyColor: '#5C2C1E',
    secCer: { color: '#FCD5B5', alpha: 0.24 },
    secCel: { color: '#E8D1E7', alpha: 0.22 },
    secDrs: { color: '#E9D5FF', alpha: 0.22 },
    btnAgendar: '#F97316',
    btnCer: '#EA580C',
    btnCel: '#FB923C',
    btnFinal: '#C2410C',
    finalBg: '#7C2D12',
    finalAlpha: 0.92,
    countdownColor: '#F97316',
  },
];

function PaletteEditor({
  open,
  onClose,
  applyPalette,
  selectedId,
}: {
  open: boolean;
  onClose: () => void;
  applyPalette: (p: Palette) => void;
  selectedId: string | null;
}) {
  if (!open) return null;

  return (
    <div className="grid gap-4 mt-3">
      <div className="text-sm opacity-80">Paletas coordinadas (8 opciones)</div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PALETTES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPalette(p)}
            className={`text-left p-3 rounded-xl border transition ${
              selectedId === p.id
                ? 'ring-2 ring-gray-900 border-gray-900'
                : 'hover:shadow-md border-black/10'
            }`}
            aria-label={`Aplicar paleta ${p.nombre}`}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{p.nombre}</div>
              <div className="flex -space-x-1">
                {[p.btnAgendar, p.btnCer, p.btnCel, p.btnFinal].map((c) => (
                  <span
                    key={c}
                    className="w-4 h-4 border rounded-full border-black/10"
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-6 gap-1 mt-2">
              {[
                p.bgColor,
                p.textureColor,
                p.secCer.color,
                p.secCel.color,
                p.secDrs.color,
                p.finalBg,
              ].map((c, i) => (
                <div
                  key={i}
                  className="h-6 border rounded border-black/10"
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>
            <div className="mt-2 text-xs opacity-70">
              Texto: <span style={{ color: p.titleColor }}>Títulos</span> /{' '}
              <span style={{ color: p.bodyColor }}>Cuerpo</span>
            </div>
          </button>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-600 underline hover:text-gray-800"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   EditableText con bloqueo y color forzado
   ========================================================= */
type EditableTextProps = {
  id: string;
  initial: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  multiline?: boolean;
  useTitleFont?: boolean;
  alignCenter?: boolean;
  maxWords?: number;
  locked?: boolean; // <- si true, no muestra lápiz
  colorOverride?: string; // <- forzar color (p.ej. #fff en botones)
};
function EditableText({
  id,
  initial,
  as = 'span',
  className = '',
  multiline = false,
  useTitleFont = false,
  alignCenter = true,
  maxWords,
  locked = false,
  colorOverride,
}: EditableTextProps) {
  const k = `txt:${id}`;
  const [value, setValue] = useState<string>(
    () => safeGet<string | null>(k, null) ?? initial
  );
  const [editing, setEdit] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const Element: any = as;

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      const r = document.createRange();
      r.selectNodeContents(ref.current);
      r.collapse(false);
      const s = window.getSelection();
      s?.removeAllRanges();
      s?.addRange(r);
    }
  }, [editing]);

  const fontVar = useTitleFont ? TITLE_FONT_VAR : BODY_FONT_VAR;
  const baseColor = useTitleFont ? TITLE_COLOR_VAR : BODY_COLOR_VAR;
  const color = colorOverride ?? (baseColor as any);

  const applyLimit = (text: string) => {
    if (!maxWords) return text;
    const words = text.trim().split(/\s+/);
    return words.length <= maxWords ? text : words.slice(0, maxWords).join(' ');
  };
  const save = () => {
    const t = ref.current?.innerText ?? value;
    const capped = applyLimit(t);
    setValue(capped);
    safeSet(k, capped);
    setEdit(false);
  };

  return (
    <div
      className="relative inline-block"
      style={{ fontFamily: fontVar as any, color }}
    >
      {!editing ? (
        <>
          <Element className={className + (alignCenter ? ' text-center' : '')}>
            {value}
          </Element>
          {!locked && (
            <button
              type="button"
              onClick={() => setEdit(true)}
              className="absolute p-0 m-0 bg-transparent -top-3 -right-6 sm:-right-7"
              aria-label="Editar"
            >
              <IconPencil />
            </button>
          )}
        </>
      ) : (
        <>
          <div
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
              const t = (e.target as HTMLDivElement).innerText;
              const capped = applyLimit(t);
              if (capped !== t) {
                (e.target as HTMLDivElement).innerText = capped;
              }
            }}
            className={className + ' outline-none border-none bg-transparent'}
            style={{ display: 'inline-block' }}
          >
            {value}
          </div>
          <button
            type="button"
            onClick={save}
            className="absolute p-0 bg-transparent -top-3 -right-6 sm:-right-7"
            aria-label="Guardar"
          >
            <IconSave />
          </button>
        </>
      )}
    </div>
  );
}

/* =========================================================
   FECHA LARGA (con iniciales capitalizadas)
   ========================================================= */
function fechaLargaEs(date: Date, capMes = true) {
  const parts = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).formatToParts(date);
  const cap = (s: string) => {
    const [f, ...r] = [...s];
    return (f ? f.toLocaleUpperCase('es-AR') : '') + r.join('');
  };
  return parts
    .map((p) => {
      if (p.type === 'weekday') return cap(p.value);
      if (p.type === 'month') return capMes ? cap(p.value) : p.value;
      return p.value;
    })
    .join('');
}

/* =========================================================
   EDITOR INLINE POR SECCIÓN (color + alpha del encuadre)
   ========================================================= */
function SectionEditorInline({
  color,
  alpha,
  onPickColor,
  onChangeAlpha,
  onClose,
}: {
  color: string;
  alpha: number;
  onPickColor: (c: string) => void;
  onChangeAlpha: (a: number) => void;
  onClose: () => void;
}) {
  const Range = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (n: number) => void;
  }) => (
    <input
      type="range"
      min={0}
      max={1}
      step={0.01}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
    />
  );
  return (
    <div className="p-3 mt-3 border rounded-lg bg-white/70 backdrop-blur">
      <div className="mb-1 text-sm">Color del encuadre</div>
      <div className="flex flex-wrap gap-2">
        {PASTELS.map((hex) => (
          <button
            key={hex}
            onClick={() => onPickColor(hex)}
            className={`w-6 h-6 rounded-full border ${
              color === hex ? 'ring-2 ring-gray-800' : ''
            }`}
            style={{ backgroundColor: hex, borderColor: 'rgba(0,0,0,0.2)' }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-sm">Transparencia</span>
        <Range value={alpha} onChange={onChangeAlpha} />
      </div>
      <div className="flex justify-center mt-2">
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-600 underline hover:text-gray-800"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   BOTÓN EDITABLE POR BOTÓN (texto + color, texto siempre blanco)
   ========================================================= */
function ButtonWithEditor({
  id,
  initialLabel,
  bgKey,
  defaultBg = '#C7D2FE', // periwinkle suave
  className = '',
}: {
  id: string;
  initialLabel: string;
  bgKey: string;
  defaultBg?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [bg, setBg] = useState<string>(() => safeGet<string>(bgKey, defaultBg));
  useEffect(() => safeSet(bgKey, bg), [bg]);

  return (
    <div className="relative inline-block">
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        aria-disabled="true"
        className={`inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold transition cursor-not-allowed rounded-xl opacity-90 ${className}`}
        style={{ background: bg, color: '#ffffff' }}
        title="Desactivado en modo edición"
      >
        <EditableText
          id={id}
          initial={initialLabel}
          as="span"
          alignCenter={false}
          maxWords={3}
          locked={!open}
          colorOverride="#ffffff"
        />
      </a>

      {/* lápiz (no afecta layout) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="absolute p-0 bg-transparent -top-3 -right-3"
        aria-label="Editar botón"
      >
        <IconPencil />
      </button>

      {open && (
        <div className="p-3 mt-2 border rounded-lg bg-white/70 backdrop-blur">
          <div className="mb-1 text-sm">Color del botón</div>
          <div className="flex flex-wrap gap-2">
            {PASTELS.map((hex) => (
              <button
                key={hex}
                onClick={() => setBg(hex)}
                className={`w-6 h-6 rounded-full border ${
                  bg === hex ? 'ring-2 ring-gray-800' : ''
                }`}
                style={{ backgroundColor: hex, borderColor: 'rgba(0,0,0,0.2)' }}
              />
            ))}
          </div>
          <div className="mt-2 text-xs opacity-70">
            El texto del botón siempre es blanco.
          </div>
          <div className="flex justify-center mt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-gray-600 underline hover:text-gray-800"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   TARJETA SECCIÓN
   ========================================================= */
const SectionCard: React.FC<{
  bgHex: string;
  alpha: number;
  title: string;
  iconAnim: unknown;
  gradFrom: string;
  gradTo: string;
  children: React.ReactNode;
  iconStyle?: React.CSSProperties;
  titleId: string;
  // edición inline por sección
  onChangeColor: (hex: string) => void;
  onChangeAlpha: (a: number) => void;
}> = ({
  bgHex,
  alpha,
  title,
  iconAnim,
  gradFrom,
  gradTo,
  children,
  iconStyle,
  titleId,
  onChangeColor,
  onChangeAlpha,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative p-6 mt-10 text-center border sm:mt-12 rounded-2xl sm:p-8"
      style={{
        background: rgba(bgHex, alpha),
        borderColor: INVITE.colores.pastelBorder,
      }}
    >
      {/* botón editar sección */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="absolute p-0 bg-transparent top-3 right-3"
        aria-label="Editar sección"
      >
        <IconPencil />
      </button>

      <EditableText
        id={titleId}
        initial={title}
        as="h3"
        className="text-5xl font-normal sm:text-6xl"
        useTitleFont
        maxWords={6}
      />
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
            Animación
          </div>
        )}
      </div>
      <div
        className="mt-4"
        style={{
          fontFamily: BODY_FONT_VAR as any,
          color: BODY_COLOR_VAR as any,
        }}
      >
        {children}
      </div>

      {open && (
        <SectionEditorInline
          color={bgHex}
          alpha={alpha}
          onPickColor={onChangeColor}
          onChangeAlpha={onChangeAlpha}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

const Divider: React.FC = () => (
  <div className="flex items-center justify-center my-10">
    <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-300/50 to-transparent" />
    <div className="mx-2 w-1.5 h-1.5 rounded-full bg-rose-300/60" />
    <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-300/50 to-transparent" />
  </div>
);

/* =========================================================
   PÁGINA
   ========================================================= */
export default function Invitation() {
  const fecha = useMemo(() => new Date(INVITE.fechaISO), []);
  const fechaBonita = useMemo(() => fechaLargaEs(fecha), [fecha]);

  // tipografías
  const [titleIdx, setTitleIdx] = useState<number>(() =>
    safeGet<number>(FONT_TITLE_KEY, 0)
  );
  const [bodyIdx, setBodyIdx] = useState<number>(() =>
    safeGet<number>(FONT_BODY_KEY, 0)
  );
  useEffect(() => safeSet(FONT_TITLE_KEY, titleIdx), [titleIdx]);
  useEffect(() => safeSet(FONT_BODY_KEY, bodyIdx), [bodyIdx]);

  // colores de texto
  const [titleColor, setTitleColor] = useState<string>(() =>
    safeGet<string>(TITLE_COLOR_KEY, '#3b3b3b')
  );
  const [bodyColor, setBodyColor] = useState<string>(() =>
    safeGet<string>(BODY_COLOR_KEY, '#4b4b4b')
  );
  useEffect(() => safeSet(TITLE_COLOR_KEY, titleColor), [titleColor]);
  useEffect(() => safeSet(BODY_COLOR_KEY, bodyColor), [bodyColor]);

  // fondo + textura (paleta pastel)
  const [bgColor, setBgColor] = useState<string>(() =>
    safeGet<string>(BG_COLOR_KEY, INVITE.colores.fondo)
  );
  const [bgTexture, setBgTexture] = useState<Texture>(() =>
    safeGet<Texture>(BG_TEXTURE_KEY, 'circulos')
  );
  const [textureColor, setTextureColor] = useState<string>(() =>
    safeGet<string>(BG_TEXTURE_COLOR_KEY, PASTELS[5])
  ); // celeste por defecto
  useEffect(() => safeSet(BG_COLOR_KEY, bgColor), [bgColor]);
  useEffect(() => safeSet(BG_TEXTURE_KEY, bgTexture), [bgTexture]);
  useEffect(() => safeSet(BG_TEXTURE_COLOR_KEY, textureColor), [textureColor]);
  const tex = textureCSS(bgTexture, textureColor);

  // secciones (color + alpha)
  const [sections, setSections] = useState({
    cer: {
      color: safeGet<string>(SEC_CER_COLOR_KEY, PASTELS[0]),
      alpha: safeGet<number>(SEC_CER_ALPHA_KEY, 0.2),
    },
    cel: {
      color: safeGet<string>(SEC_CEL_COLOR_KEY, PASTELS[5]),
      alpha: safeGet<number>(SEC_CEL_ALPHA_KEY, 0.2),
    },
    drs: {
      color: safeGet<string>(SEC_DRS_COLOR_KEY, PASTELS[8]),
      alpha: safeGet<number>(SEC_DRS_ALPHA_KEY, 0.2),
    },
  });
  useEffect(() => {
    safeSet(SEC_CER_COLOR_KEY, sections.cer.color);
    safeSet(SEC_CER_ALPHA_KEY, sections.cer.alpha);
  }, [sections.cer]);
  useEffect(() => {
    safeSet(SEC_CEL_COLOR_KEY, sections.cel.color);
    safeSet(SEC_CEL_ALPHA_KEY, sections.cel.alpha);
  }, [sections.cel]);
  useEffect(() => {
    safeSet(SEC_DRS_COLOR_KEY, sections.drs.color);
    safeSet(SEC_DRS_ALPHA_KEY, sections.drs.alpha);
  }, [sections.drs]);

  // portada
  const [coverUrl, setCoverUrl] = useState<string>(
    () => safeGet<string | null>(PORTADA_IMG_KEY, null) ?? INVITE.portada
  );
  useEffect(() => {
    safeSet(PORTADA_IMG_KEY, coverUrl === INVITE.portada ? null : coverUrl);
  }, [coverUrl]);
  const onCoverChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setCoverUrl(String(r.result));
    r.readAsDataURL(f);
  };

  // countdown
  const [cdIndex, setCdIndex] = useState<number>(() =>
    safeGet<number>(COUNTDOWN_STYLE_KEY, 0)
  );
  const [cdColor, setCdColor] = useState<string>(
    () => safeGet<string | null>(COUNTDOWN_COLOR_KEY, null) ?? PASTELS[6]
  );
  useEffect(() => safeSet(COUNTDOWN_STYLE_KEY, cdIndex), [cdIndex]);
  useEffect(() => safeSet(COUNTDOWN_COLOR_KEY, cdColor), [cdColor]);
  const nextCD = () => setCdIndex((i) => (i + 1) % COUNTDOWN_VARIANTS.length);
  const prevCD = () =>
    setCdIndex(
      (i) => (i - 1 + COUNTDOWN_VARIANTS.length) % COUNTDOWN_VARIANTS.length
    );
  const swipeCD = useSwipeX(nextCD, prevCD);

  // botones (texto blanco)
  const [btnAgendarBg, setBtnAgendarBg] = useState<string>(() =>
    safeGet<string>(BTN_AGENDAR_BG_KEY, PASTELS[6])
  );
  const [btnCerBg, setBtnCerBg] = useState<string>(() =>
    safeGet<string>(BTN_CER_BG_KEY, PASTELS[4])
  );
  const [btnCelBg, setBtnCelBg] = useState<string>(() =>
    safeGet<string>(BTN_CEL_BG_KEY, PASTELS[5])
  );
  const [btnFinalBg, setBtnFinalBg] = useState<string>(() =>
    safeGet<string>(BTN_FINAL_BG_KEY, PASTELS[0])
  );
  useEffect(() => safeSet(BTN_AGENDAR_BG_KEY, btnAgendarBg), [btnAgendarBg]);
  useEffect(() => safeSet(BTN_CER_BG_KEY, btnCerBg), [btnCerBg]);
  useEffect(() => safeSet(BTN_CEL_BG_KEY, btnCelBg), [btnCelBg]);
  useEffect(() => safeSet(BTN_FINAL_BG_KEY, btnFinalBg), [btnFinalBg]);

  // sección final
  const [finalBgColor, setFinalBgColor] = useState<string>(() =>
    safeGet<string>(FINAL_BG_COLOR_KEY, '#b56576')
  );
  const [finalBgAlpha, setFinalBgAlpha] = useState<number>(() =>
    safeGet<number>(FINAL_BG_ALPHA_KEY, 0.85)
  );
  useEffect(() => safeSet(FINAL_BG_COLOR_KEY, finalBgColor), [finalBgColor]);
  useEffect(() => safeSet(FINAL_BG_ALPHA_KEY, finalBgAlpha), [finalBgAlpha]);

  // paneles
  const [openFonts, setOpenFonts] = useState(false);
  const [openPalette, setOpenPalette] = useState(false); // reemplaza ThemeEditor
  const [openTexture, setOpenTexture] = useState(false);

  // paleta seleccionada
  const [selectedPaletteId, setSelectedPaletteId] = useState<string | null>(
    () => safeGet<string | null>(PALETTE_SELECTED_KEY, null)
  );

  // aplicar paleta (actualiza estados + persiste)
  const applyPalette = (p: Palette) => {
    setSelectedPaletteId(p.id);
    safeSet(PALETTE_SELECTED_KEY, p.id);

    setBgColor(p.bgColor);
    setTextureColor(p.textureColor);

    setTitleColor(p.titleColor);
    setBodyColor(p.bodyColor);

    setSections({
      cer: { color: p.secCer.color, alpha: p.secCer.alpha },
      cel: { color: p.secCel.color, alpha: p.secCel.alpha },
      drs: { color: p.secDrs.color, alpha: p.secDrs.alpha },
    });

    setBtnAgendarBg(p.btnAgendar);
    setBtnCerBg(p.btnCer);
    setBtnCelBg(p.btnCel);
    setBtnFinalBg(p.btnFinal);

    setFinalBgColor(p.finalBg);
    setFinalBgAlpha(p.finalAlpha);

    setCdColor(p.countdownColor);
  };

  // Restaurar paleta seleccionada al cargar (si coincide con alguna)
  useEffect(() => {
    if (!selectedPaletteId) return;
    const p = PALETTES.find((x) => x.id === selectedPaletteId);
    if (p) applyPalette(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // estilos raíz
  const rootStyle: React.CSSProperties = {
    background: bgColor,
    ['--font-titles' as any]: FONTS_TITLES[titleIdx].css,
    ['--font-body' as any]: FONTS_BODY[bodyIdx].css,
    ['--color-title' as any]: titleColor,
    ['--color-body' as any]: bodyColor,
    fontFamily: BODY_FONT_VAR as any,
  };

  return (
    <div className="min-h-screen" style={rootStyle}>
      <div className="grid lg:grid-cols-2 h-auto lg:h-screen max-w-[1200px] mx-auto bg-white shadow-xl">
        {/* ===== PORTADA ===== */}
        <section
          className="relative grid place-items-center h-[100svh] min-h-[560px] lg:min-h-0"
          style={{ background: `url('${coverUrl}') center/cover no-repeat` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-black/15 to-black/55" />

          {/* subir portada */}
          <label
            className="absolute z-20 cursor-pointer top-4 right-4"
            title="Subir imagen de portada"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onCoverChange}
            />
            <IconUpload />
          </label>

          <div className="relative z-10 px-6 py-8 text-center text-white">
            <div
              style={{
                fontFamily: TITLE_FONT_VAR as any,
                color: TITLE_COLOR_VAR as any,
              }}
            >
              <EditableText
                id="portada.titulo"
                initial={INVITE.titulo}
                as="h1"
                className="text-6xl"
                useTitleFont
                maxWords={6}
              />
            </div>
            <EditableText
              id="portada.nombre"
              initial={INVITE.nombreNina}
              as="p"
              className="text-3xl tracking-wide"
              maxWords={5}
            />
          </div>

          <div
            className="absolute z-10 -translate-x-1/2 bottom-7 left-1/2 text-white/90 animate-bounce lg:hidden"
            aria-hidden="true"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 rounded-t-[18px]"
            style={{ background: INVITE.colores.papel }}
          />
        </section>

        {/* ===== CONTENIDO (fondo + textura) ===== */}
        <section
          className="flex flex-col h-full"
          style={{
            backgroundColor: bgColor,
            backgroundImage: tex.image,
            backgroundSize: tex.size,
          }}
        >
          <div className="flex-1 px-6 py-6 overflow-y-auto lg:py-10">
            <div className="max-w-[620px] mx-auto text-center text-[18px] sm:text-[19px] leading-relaxed">
              {/* barra de iconos superiores */}
              <div className="flex items-center justify-center gap-4 mb-4 opacity-85">
                <button
                  type="button"
                  onClick={() => {
                    setOpenFonts((v) => !v);
                    setOpenPalette(false);
                    setOpenTexture(false);
                  }}
                  className="p-0 bg-transparent"
                  aria-label="Editar tipografías"
                >
                  <IconFonts />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpenPalette((v) => !v);
                    setOpenFonts(false);
                    setOpenTexture(false);
                  }}
                  className="p-0 bg-transparent"
                  aria-label="Paleta de colores"
                  title="Paleta de colores"
                >
                  <IconPalette />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpenTexture((v) => !v);
                    setOpenFonts(false);
                    setOpenPalette(false);
                  }}
                  className="p-0 bg-transparent"
                  aria-label="Textura de fondo"
                >
                  <IconPattern />
                </button>
              </div>

              {/* paneles */}
              <TypographyEditor
                open={openFonts}
                onClose={() => setOpenFonts(false)}
                titleIdx={titleIdx}
                setTitleIdx={setTitleIdx}
                bodyIdx={bodyIdx}
                setBodyIdx={setBodyIdx}
              />

              {/* NUEVO: Paleta de colores */}
              <PaletteEditor
                open={openPalette}
                onClose={() => setOpenPalette(false)}
                applyPalette={applyPalette}
                selectedId={selectedPaletteId}
              />

              {/* (opcional) editor de textura */}
              <TextureEditor
                open={openTexture}
                onClose={() => setOpenTexture(false)}
                texture={bgTexture}
                setTexture={setBgTexture}
                color={textureColor}
                setColor={setTextureColor}
              />

              {/* intro */}
              <EditableText
                id="intro.h2"
                initial="¡Estás invitado!"
                as="h2"
                className="text-5xl font-normal sm:text-6xl"
                useTitleFont
                maxWords={6}
              />
              <EditableText
                id="intro.p1"
                initial="Me encantaría que seas parte de este momento tan especial para mí. ¡Falta poco!"
                as="p"
                className="mt-3 sm:mt-4 text-[18px] sm:text-[20px] font-medium"
                multiline
                maxWords={50}
              />

              {/* encabezados + countdown */}
              <div className="relative mt-8" {...swipeCD}>
                <div
                  style={{
                    fontFamily: TITLE_FONT_VAR as any,
                    color: TITLE_COLOR_VAR as any,
                  }}
                >
                  <EditableText
                    id="count.h1"
                    initial="Te espero el"
                    as="div"
                    className="text-4xl sm:text-5xl"
                    useTitleFont
                    maxWords={5}
                  />
                </div>
                <div
                  className="mt-2 text-2xl font-semibold sm:text-3xl"
                  style={{ color: BODY_COLOR_VAR as any }}
                >
                  {fechaBonita}
                </div>
                <EditableText
                  id="count.h2"
                  initial="Solo faltan"
                  as="div"
                  className="mt-4 text-lg sm:text-xl opacity-80"
                  maxWords={4}
                />

                {/* countdown + mini editor inline */}
                <div className="relative mt-2 select-none">
                  <CountdownGallery
                    date={fecha}
                    color={cdColor}
                    shapeIndex={cdIndex}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById('cd-panel')
                        ?.classList.toggle('hidden')
                    }
                    className="absolute right-0 p-0 bg-transparent -top-6"
                    aria-label="Editar countdown"
                  >
                    <IconPencil />
                  </button>
                  <div id="cd-panel" className="hidden mt-3">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={prevCD}
                        className="text-sm text-gray-700 hover:text-gray-900"
                        aria-label="Anterior"
                      >
                        ◀
                      </button>
                      <div className="text-sm opacity-80">
                        {COUNTDOWN_VARIANTS[cdIndex].label}
                      </div>
                      <button
                        onClick={nextCD}
                        className="text-sm text-gray-700 hover:text-gray-900"
                        aria-label="Siguiente"
                      >
                        ▶
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                      {PASTELS.map((hex) => (
                        <button
                          key={hex}
                          onClick={() => setCdColor(hex)}
                          className={`w-6 h-6 border rounded-full ${
                            cdColor === hex ? 'ring-2 ring-gray-800' : ''
                          }`}
                          style={{
                            backgroundColor: hex,
                            borderColor: 'rgba(0,0,0,0.2)',
                          }}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById('cd-panel')
                            ?.classList.add('hidden')
                        }
                        className="p-0 ml-2 bg-transparent"
                        aria-label="Guardar"
                      >
                        <IconSave />
                      </button>
                    </div>
                    <div className="mt-1 text-xs text-center opacity-70">
                      Deslizá con ◀ ▶ o cambiá el color.
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón Agendar (texto blanco, color desde paleta aplicada) */}
              <div className="mt-7">
                <ButtonWithEditor
                  id="btn.agendar"
                  initialLabel="Agendar fecha"
                  bgKey={BTN_AGENDAR_BG_KEY}
                  defaultBg={btnAgendarBg}
                />
              </div>

              <Divider />

              {/* SECCIONES */}
              <SectionCard
                bgHex={sections.cer.color}
                alpha={sections.cer.alpha}
                title={INVITE.ceremonia.titulo}
                titleId="ceremonia.titulo"
                iconAnim={ceremoniaAnim}
                gradFrom={INVITE.colores.gradCerFrom}
                gradTo={INVITE.colores.gradCerTo}
                onChangeColor={(hex) =>
                  setSections((s) => ({ ...s, cer: { ...s.cer, color: hex } }))
                }
                onChangeAlpha={(a) =>
                  setSections((s) => ({ ...s, cer: { ...s.cer, alpha: a } }))
                }
              >
                <EditableText
                  id="ceremonia.hora"
                  initial={INVITE.ceremonia.fechaTexto}
                  as="p"
                  className="mt-1"
                  maxWords={5}
                />
                <EditableText
                  id="ceremonia.lugar"
                  initial={INVITE.ceremonia.lugar}
                  as="p"
                  className="mt-2 text-lg sm:text-xl"
                  maxWords={8}
                />
                <EditableText
                  id="ceremonia.dir"
                  initial={INVITE.ceremonia.direccion}
                  as="p"
                  className="mt-1"
                  maxWords={12}
                />
                <div className="mt-4">
                  <ButtonWithEditor
                    id="ceremonia.mapBtn"
                    initialLabel="Ver Mapa"
                    bgKey={BTN_CER_BG_KEY}
                    defaultBg={btnCerBg}
                  />
                </div>
              </SectionCard>

              <SectionCard
                bgHex={sections.cel.color}
                alpha={sections.cel.alpha}
                title={INVITE.celebracion.titulo}
                titleId="celebracion.titulo"
                iconAnim={celebracionAnim}
                gradFrom={INVITE.colores.gradCelFrom}
                gradTo={INVITE.colores.gradCelTo}
                iconStyle={{
                  transform: 'translateY(-6%) scale(0.86)',
                  transformOrigin: 'center',
                }}
                onChangeColor={(hex) =>
                  setSections((s) => ({ ...s, cel: { ...s.cel, color: hex } }))
                }
                onChangeAlpha={(a) =>
                  setSections((s) => ({ ...s, cel: { ...s.cel, alpha: a } }))
                }
              >
                <EditableText
                  id="celebracion.hora"
                  initial={INVITE.celebracion.fechaTexto}
                  as="p"
                  className="mt-1"
                  maxWords={5}
                />
                <EditableText
                  id="celebracion.lugar"
                  initial={INVITE.celebracion.lugar}
                  as="p"
                  className="mt-2 text-lg sm:text-xl"
                  maxWords={8}
                />
                <EditableText
                  id="celebracion.dir"
                  initial={INVITE.celebracion.direccion}
                  as="p"
                  className="mt-1"
                  maxWords={12}
                />
                <div className="mt-4">
                  <ButtonWithEditor
                    id="celebracion.mapBtn"
                    initialLabel="Ver Mapa"
                    bgKey={BTN_CEL_BG_KEY}
                    defaultBg={btnCelBg}
                  />
                </div>
              </SectionCard>

              <SectionCard
                bgHex={sections.drs.color}
                alpha={sections.drs.alpha}
                title={INVITE.dress.titulo}
                titleId="dress.titulo"
                iconAnim={dresscodeAnim}
                gradFrom={INVITE.colores.gradDressFrom}
                gradTo={INVITE.colores.gradDressTo}
                onChangeColor={(hex) =>
                  setSections((s) => ({ ...s, drs: { ...s.drs, color: hex } }))
                }
                onChangeAlpha={(a) =>
                  setSections((s) => ({ ...s, drs: { ...s.drs, alpha: a } }))
                }
              >
                <EditableText
                  id="dress.texto"
                  initial={INVITE.dress.texto}
                  as="p"
                  className="mt-2"
                  maxWords={8}
                />
              </SectionCard>
            </div>

            {/* FINAL (full-bleed, respeta textura y colores de la paleta) */}
            <section
              className="mt-16 text-center py-12 px-6 rounded-none shadow-none mx-[-1.5rem]"
              style={{
                backgroundColor: rgba(finalBgColor, finalBgAlpha),
                color: '#ffffff',
                backgroundImage: tex.image,
                backgroundSize: tex.size,
              }}
            >
              <div
                style={{
                  fontFamily: TITLE_FONT_VAR as any,
                  color: TITLE_COLOR_VAR as any,
                }}
              >
                <EditableText
                  id="final.h1"
                  initial="¡Te espero!"
                  as="h3"
                  className="text-5xl font-normal sm:text-6xl"
                  useTitleFont
                  maxWords={4}
                />
              </div>
              <EditableText
                id="final.p1"
                initial="Confirmá tu asistencia por WhatsApp"
                as="p"
                className="mt-2 opacity-90"
                maxWords={8}
              />
              <div className="mt-6">
                <ButtonWithEditor
                  id="final.btn"
                  initialLabel="Confirmar Asistencia"
                  bgKey={BTN_FINAL_BG_KEY}
                  defaultBg={btnFinalBg}
                />
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
