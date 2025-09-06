import React, { useEffect, useMemo, useState } from 'react';
import Lottie from 'lottie-react';

import { useIcon } from './hooks/useIcon';
import './App.css';

const cssVar = (name: string) => {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v;
};

// === CONFIG ===
const INVITE = {
  nombreNina: 'Sofía Paz',
  titulo: 'Mi Primera Comunión',
  fechaISO: '2025-09-13T12:00:00-03:00',
  duracionMin: 60,
  portada: '/Bautismo Chofi-31.jpg',
  colores: {
    fondo: cssVar('--c-fondo'),
    papel: cssVar('--c-papel'),
    primario: cssVar('--c-primario'),
    secundario: cssVar('--c-secundario'),
    rosa: cssVar('--c-rosa'),
    rosaBtn: cssVar('--c-rosa-btn'),
    rosaBtnHover: cssVar('--c-rosa-btn-hover'),
    gradCerFrom: cssVar('--c-grad-cer-from'),
    gradCerTo: cssVar('--c-grad-cer-to'),
    gradCelFrom: cssVar('--c-grad-cel-from'),
    gradCelTo: cssVar('--c-grad-cel-to'),
    gradDressFrom: cssVar('--c-grad-dress-from'),
    gradDressTo: cssVar('--c-grad-dress-to'),
    pastelCer: cssVar('--c-pastel-cer'),
    pastelCel: cssVar('--c-pastel-cel'),
    pastelDress: cssVar('--c-pastel-dress'),
    pastelBorder: cssVar('--c-pastel-border'),
    darkSection: cssVar('--c-dark-section'),
  },
  ceremonia: {
    titulo: 'Ceremonia',
    lugar: 'Colegio San Fernando',
    fechaTexto: '12:00 P.M.',
    horaTexto: '12:00 P.M.',
    direccion: 'Gral. Ricchieri 1425, Hurlingham',
    mapsQuery:
      'Colegio San Fernando, Tte. Gral. Pablo Ricchieri 1425, B1686 Hurlingham, Provincia de Buenos Aires',
  },
  celebracion: {
    titulo: 'Celebración',
    fechaTexto: '14:30 P.M.',
    horaTexto: '14:30 P.M.',
    direccion: 'Valentín Alsina 2834, Hurlingham',
    mapsQuery:
      'Valentín Alsina 2834, B1686 Hurlingham, Provincia de Buenos Aires',
  },
  dress: { titulo: 'Dress Code', texto: 'Lucí tu mejor Look' },
  whatsapp: '5491169214849',
};

// ===== helpers =====
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

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

// Google Calendar (Android & web)
// Google Calendar (Android & web)
function openGoogleCalendar() {
  const start = new Date(INVITE.fechaISO);
  const end = new Date(start.getTime() + INVITE.duracionMin * 60000);
  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, 'Z'); // yyyymmddThhmmssZ

  const url =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(`Primera Comunión de ${INVITE.nombreNina}`)}` +
    `&dates=${fmt(start)}/${fmt(end)}` +
    `&details=${encodeURIComponent(INVITE.ceremonia.lugar)}` +
    `&location=${encodeURIComponent(
      `${INVITE.ceremonia.lugar}, ${INVITE.ceremonia.direccion}`
    )}` +
    `&sf=true&output=xml`;

  window.open(url, '_blank', 'noopener,noreferrer');
}

// Abre el .ics hospedado usando webcal:// (iOS abre Calendario nativo)
function openAppleCalendarWebcal() {
  const host = window.location.host; // incluye puerto si hay
  const webcalUrl = `webcal://${host}/evento.ics`; // el .ics que pusiste en /public
  window.location.href = webcalUrl;
}

// Fallback .ics (descarga) para casos raros
function downloadICS() {
  const start = new Date(INVITE.fechaISO);
  const end = new Date(start.getTime() + INVITE.duracionMin * 60000);
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Invite//ES
BEGIN:VEVENT
UID:${crypto.randomUUID()}
DTSTAMP:${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:Primera Comunión de ${INVITE.nombreNina}
DESCRIPTION:${INVITE.ceremonia.lugar}
LOCATION:${INVITE.ceremonia.lugar}
END:VEVENT
END:VCALENDAR`;

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `Primera-Comunion-${INVITE.nombreNina.replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Detecta dispositivo y abre el calendario nativo
function addToCalendar() {
  const ua =
    navigator.userAgent ||
    (navigator as any).vendor ||
    (window as any).opera ||
    '';
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  if (isIOS) {
    // iOS: abrir Calendario nativo con webcal://
    openAppleCalendarWebcal();
    return;
  }

  if (isAndroid) {
    // Android: Google Calendar
    openGoogleCalendar();
    return;
  }

  // Escritorio/otros: intentar GCal y, si no, .ics
  try {
    openGoogleCalendar();
  } catch {
    downloadICS();
  }
}

// Formatea "Martes 13 de Septiembre"
function fechaLargaEs(date: Date, capitalizarMes = true) {
  const parts = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).formatToParts(date);

  const capPrimera = (s: string) => {
    const [first, ...rest] = [...s]; // respeta tildes/emoji
    return (first ? first.toLocaleUpperCase('es-AR') : '') + rest.join('');
  };

  return parts
    .map((p) => {
      if (p.type === 'weekday') return capPrimera(p.value); // Sábado
      if (p.type === 'month')
        return capitalizarMes ? capPrimera(p.value) : p.value; // Septiembre o septiembre
      return p.value; // incluye el " de " tal cual
    })
    .join('');
}

const CountdownCircles: React.FC<{ date: Date }> = ({ date }) => {
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
};

const SectionCard: React.FC<{
  bg: string;
  title: string;
  iconAnim: unknown;
  gradFrom: string;
  gradTo: string;
  children: React.ReactNode;
  iconStyle?: React.CSSProperties; // <-- nuevo (opcional)
}> = ({ bg, title, iconAnim, gradFrom, gradTo, children, iconStyle }) => (
  <div
    className="p-6 mt-10 text-center border sm:mt-12 rounded-2xl sm:p-8
             transition-all duration-300 lg:hover:shadow-lg lg:hover:-translate-y-0.5"
    style={{ background: bg, borderColor: INVITE.colores.pastelBorder }}
  >
    <h3
      className="mb-4 text-5xl font-normal sm:text-6xl"
      style={{ fontFamily: cssVar('--font-title') }}
    >
      {title}
    </h3>

    <div
      className="w-32 h-32 mx-auto overflow-hidden rounded-full shadow-md sm:w-36 sm:h-36"
      style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
      title={title}
    >
      {iconAnim ? (
        <Lottie
          animationData={iconAnim}
          loop
          style={{ width: '100%', height: '100%', ...iconStyle }} // <-- se aplica sólo si lo pasás
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

const Divider: React.FC = () => (
  <div className="flex items-center justify-center my-10">
    <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-300/50 to-transparent" />
    <div className="mx-2 w-1.5 h-1.5 rounded-full bg-rose-300/60" />
    <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-300/50 to-transparent" />
  </div>
);

export default function Invitation() {
  const fecha = useMemo(() => new Date(INVITE.fechaISO), []);
  const fechaBonita = useMemo(() => fechaLargaEs(fecha), [fecha]);

  return (
    <div
      className="min-h-screen"
      style={{
        background: INVITE.colores.fondo,
        color: INVITE.colores.primario,
      }}
    >
      <div className="grid w-full h-auto bg-white shadow-xl lg:grid-cols-2 lg:h-screen">
        {/* PORTADA (sin cambios de tamaño) */}
        <section
          className="relative grid place-items-center h-[100svh] min-h-[560px] lg:min-h-0
             lg:sticky lg:top-0 lg:h-screen overflow-hidden"
          style={{
            background: `url('${INVITE.portada}') center/cover no-repeat`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-black/15 to-black/55" />
          <div className="relative z-10 px-6 py-8 text-center text-white">
            <h1
              className="text-6xl"
              style={{ fontFamily: cssVar('--font-title') }}
            >
              {INVITE.titulo}
            </h1>
            <p
              className="text-3xl tracking-wide"
              style={{ fontFamily: cssVar('--font-body') }}
            >
              Sofía
            </p>
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
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 rounded-t-[18px] lg:hidden"
            style={{ background: INVITE.colores.papel }}
          />
        </section>

        {/* CONTENIDO */}
        <section
          className="flex flex-col h-full lg:overflow-y-auto lg:rounded-r-2xl"
          style={{
            backgroundColor: INVITE.colores.papel,
            backgroundImage: 'radial-gradient(#f5a9b8 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        >
          <div className="flex-1 px-6 py-6 lg:px-10 lg:py-10">
            {/* Contenido con ancho limitado */}
            <div
              className="max-w-[620px] mx-auto text-center
             text-[18px] sm:text-[19px] lg:text-[20px] leading-relaxed"
              style={{ fontFamily: cssVar('--font-body') }}
            >
              <h2
                className="text-5xl font-normal sm:text-6xl"
                style={{ fontFamily: cssVar('--font-title') }}
              >
                ¡Estás invitado!
              </h2>

              <p
                className="mt-3 sm:mt-4 text-[18px] sm:text-[20px] font-medium"
                style={{ color: INVITE.colores.secundario }}
              >
                Me encantaría que seas parte de este momento tan especial para
                mí. ¡Falta poco!
              </p>

              {/* Encabezados del countdown (más grandes) */}
              <div className="mt-8">
                <div
                  className="text-4xl sm:text-5xl"
                  style={{ fontFamily: cssVar('--font-title') }}
                >
                  Te espero el
                </div>
                <div className="mt-2 text-2xl font-semibold sm:text-3xl">
                  {fechaBonita}
                </div>
                <div className="mt-4 text-lg sm:text-xl opacity-80">
                  Solo faltan
                </div>

                <CountdownCircles date={fecha} />
              </div>

              {/* Botón (abre calendario del teléfono) */}
              <div className="mt-7">
                <button
                  onClick={addToCalendar}
                  className="px-6 py-3 text-base font-semibold text-white rounded-xl"
                  style={{ backgroundColor: INVITE.colores.rosaBtn }}
                >
                  Agendar fecha
                </button>
              </div>

              <Divider />

              {/* CEREMONIA */}
              <SectionCard
                bg={INVITE.colores.pastelCer}
                title={INVITE.ceremonia.titulo}
                iconAnim={useIcon('ceremonia')}
                gradFrom={INVITE.colores.gradCerFrom}
                gradTo={INVITE.colores.gradCerTo}
              >
                <p className="mt-1">{INVITE.ceremonia.fechaTexto}</p>
                <p className="mt-2 text-lg sm:text-xl">
                  {INVITE.ceremonia.lugar}
                </p>
                <p className="mt-1 whitespace-nowrap">
                  {INVITE.ceremonia.direccion}
                </p>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    INVITE.ceremonia.mapsQuery
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-6 py-3 mt-4 text-base font-semibold text-white rounded-xl
           transition-transform duration-200 lg:hover:-translate-y-[1px]"
                  style={{ backgroundColor: INVITE.colores.rosaBtn }}
                >
                  Ver Mapa
                </a>
              </SectionCard>
              {/* CELEBRACIÓN */}
              <SectionCard
                bg={INVITE.colores.pastelCel}
                title={INVITE.celebracion.titulo}
                iconAnim={useIcon('celebracion')}
                gradFrom={INVITE.colores.gradCelFrom}
                gradTo={INVITE.colores.gradCelTo}
                iconStyle={{
                  transform: 'translateY(-6%) scale(0.86)', // sube un poquito y reduce apenas
                  transformOrigin: 'center',
                }}
              >
                <p className="mt-1">{INVITE.celebracion.fechaTexto}</p>
                <p className="mt-1 whitespace-nowrap">
                  {INVITE.celebracion.direccion}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    INVITE.celebracion.mapsQuery
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-6 py-3 mt-4 text-base font-semibold text-white rounded-xl"
                  style={{ backgroundColor: INVITE.colores.rosaBtn }}
                >
                  Ver Mapa
                </a>
              </SectionCard>
              {/* DRESS CODE */}
              <SectionCard
                bg={INVITE.colores.pastelDress}
                title={INVITE.dress.titulo}
                iconAnim={useIcon('dress')}
                gradFrom={INVITE.colores.gradDressFrom}
                gradTo={INVITE.colores.gradDressTo}
              >
                <p className="mt-2">{INVITE.dress.texto}</p>
              </SectionCard>
            </div>

            {/* ==== SECCIÓN FINAL EN NEGATIVO FULL-BLEED ==== */}
            <section
              className="mt-16 text-center py-12 px-6 rounded-none shadow-none mx-[-1.5rem]"
              style={{
                backgroundColor: INVITE.colores.darkSection,
                color: INVITE.colores.fondo,
              }}
            >
              <h3
                className="text-5xl font-normal sm:text-6xl"
                style={{ fontFamily: cssVar('--font-title') }}
              >
                ¡Te espero!
              </h3>
              <p className="mt-2 opacity-90">
                Confirmá tu asistencia por WhatsApp
              </p>
              <a
                href={`https://wa.me/${
                  INVITE.whatsapp
                }?text=${encodeURIComponent(
                  'Hola Sofi! Confirmo mi asistencia a tu Comunión!. Gracias por la invitación!.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 mt-6 text-base font-semibold transition rounded-xl"
                style={{
                  backgroundColor: INVITE.colores.fondo,
                  color: INVITE.colores.primario,
                }}
              >
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.5.04.18 5.36.22 11.92c.02 2.09.56 4.1 1.58 5.89L0 24l6.35-1.66a11.86 11.86 0 0 0 5.71 1.46h.05c6.56-.03 11.88-5.36 11.92-11.92a11.9 11.9 0 0 0-3.53-8.4ZM12.1 21.33h-.04a9.8 9.8 0 0 1-4.99-1.36l-.36-.21-3.77.99 1.01-3.67-.24-.38a9.77 9.77 0 0 1-1.5-5.19C2.17 6.5 6.55 2.12 12.07 2.1h.04c5.5 0 9.97 4.47 9.95 9.97-.02 5.5-4.49 9.96-9.97 9.96Zm5.68-7.35c-.31-.16-1.84-.91-2.12-1.02-.28-.1-.49-.16-.7.16-.2.31-.8 1.02-.98 1.22-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.5-1.53-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.13-.64.14-.14.31-.36.46-.54.15-.18.2-.31.31-.51.1-.2.05-.38-.03-.54-.08-.16-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53l-.6-.01c-.2 0-.54.08-.82.38-.28.31-1.08 1.06-1.08 2.6s1.11 3.02 1.26 3.23c.16.2 2.19 3.34 5.31 4.68.74.32 1.33.51 1.78.65.75.24 1.43.21 1.97.13.6-.09 1.84-.75 2.1-1.47.26-.72.26-1.35.18-1.49-.08-.14-.28-.23-.59-.39Z" />
                </svg>
                Confirmar Asistencia
              </a>
            </section>
            {/* ==== /FULL-BLEED ==== */}
          </div>
        </section>
      </div>
    </div>
  );
}
