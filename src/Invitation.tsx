import React, { useEffect, useMemo, useState } from 'react';
import Lottie from 'lottie-react';

import ceremoniaAnim from '../public/lotties/church.json';
import celebracionAnim from '../public/lotties/confetti.json';
import dresscodeAnim from '../public/lotties/dress.json';

// === CONFIG ===
const INVITE = {
  nombreNina: 'Sofía Paz',
  titulo: 'Mi Primera Comunión',
  fechaISO: '2025-09-21T11:00:00-03:00',
  duracionMin: 60,
  portada: '/Bautismo Chofi-31.jpg',
  colores: {
    fondo: '#fff7f9', // rosa muy suave de fondo
    papel: '#fdeef3', // rosa pálido para las secciones
    primario: '#b56576', // rosado oscuro pastel (para textos principales)
    secundario: '#6d597a', // violeta apagado pastel (para contraste)
    rosa: '#f4a6b7', // para countdown circles
    rosaBtn: '#ec4899', // rosa sólido botones
    rosaBtnHover: '#db2777',
    gradCerFrom: '#f9a8d4',
    gradCerTo: '#ec4899',
    gradCelFrom: '#fbcfe8',
    gradCelTo: '#d946ef',
    gradDressFrom: '#c084fc',
    gradDressTo: '#7c3aed',
  },
  ceremonia: {
    titulo: 'Ceremonia',
    lugar: 'Iglesia San Fernando',
    fechaTexto: '11:30 A.M.',
    horaTexto: '11:00 A.M.',
    direccion: 'Gral.Ricchieri 1425 Hurlingham',
    mapsQuery: 'Iglesia Sagrado Corazón, Hurlingham',
  },
  celebracion: {
    titulo: 'Celebración',
    lugar: 'Salón Los Álamos',
    fechaTexto: '13:30 P.M.',
    horaTexto: '13:30 P.M.',
    direccion: 'Valentin Alsina 456, Hurlingham',
    mapsQuery: 'Salón Los Álamos, Av. Libertad 456, Buenos Aires',
  },
  dress: {
    titulo: 'Dress Code',
    texto: 'Lucí tu mejor Look',
  },
  whatsapp: '54911XXXXXXX',
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
  return { d, h, m };
}

function downloadICS() {
  const start = new Date(INVITE.fechaISO);
  const end = new Date(start.getTime() + INVITE.duracionMin * 60000);
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Invite//ES\nBEGIN:VEVENT\nUID:${crypto.randomUUID()}\nDTSTAMP:${
    start.toISOString().replace(/[-:]/g, '').split('.')[0]
  }Z\nDTSTART:${
    start.toISOString().replace(/[-:]/g, '').split('.')[0]
  }Z\nDTEND:${
    end.toISOString().replace(/[-:]/g, '').split('.')[0]
  }Z\nSUMMARY:Primera Comunión de ${INVITE.nombreNina}\nDESCRIPTION:${
    INVITE.ceremonia.lugar
  }\nLOCATION:${INVITE.ceremonia.lugar}\nEND:VEVENT\nEND:VCALENDAR`;
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `Primera-Comunion-${INVITE.nombreNina.replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const CountdownCircles: React.FC<{ date: Date }> = ({ date }) => {
  const { d, h, m } = useCountdown(date);
  const items = [
    { v: d, label: 'Días' },
    { v: h, label: 'Horas' },
    { v: m, label: 'Minutos' },
  ];
  return (
    <div className="flex justify-center gap-5 mt-6">
      {items.map(({ v, label }) => (
        <div
          key={label}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center shadow-md"
          style={{ backgroundColor: INVITE.colores.rosa }}
        >
          <span className="text-2xl sm:text-3xl font-bold text-white">
            {String(v).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wide text-white">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

const IconLottieBubble: React.FC<{
  anim?: any;
  from: string;
  to: string;
  title: string;
}> = ({ anim, from, to, title }) => (
  <div
    className="w-28 h-28 rounded-full overflow-hidden shadow-md mx-auto"
    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    title={title}
  >
    {anim ? (
      <Lottie
        animationData={anim}
        loop
        style={{ width: '100%', height: '100%' }}
      />
    ) : (
      <div className="w-full h-full grid place-items-center text-white/80 text-xs px-3 text-center">
        Animación {title}
      </div>
    )}
  </div>
);

const Divider: React.FC = () => (
  <div className="my-10 flex items-center justify-center">
    <div className="h-px w-24 bg-gradient-to-r from-transparent via-rose-300/50 to-transparent" />
    <div className="mx-2 w-1.5 h-1.5 rounded-full bg-rose-300/60" />
    <div className="h-px w-24 bg-gradient-to-r from-transparent via-rose-300/50 to-transparent" />
  </div>
);

export default function Invitation() {
  const fecha = useMemo(() => new Date(INVITE.fechaISO), []);

  // Función para renderizar horas con AM/PM más chico
  const renderHora = (horaTexto: string) => {
    // admite formatos "11:00 A.M." o "13:30 P.M."
    const match = horaTexto.match(/^(\d{1,2}:\d{2})\s*([AP]\.?M\.?)$/i);
    if (!match) return <span>{horaTexto}</span>;
    const [, hhmm, ampm] = match;
    return (
      <span style={{ color: INVITE.colores.secundario }}>
        {hhmm}
        <span className="text-xs ml-1 opacity-60">{ampm.toUpperCase()}</span>
      </span>
    );
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: INVITE.colores.fondo,
        color: INVITE.colores.primario,
      }}
    >
      <div className="grid lg:grid-cols-2 h-auto lg:h-screen max-w-[1200px] mx-auto bg-white shadow-xl">
        {/* PORTADA */}
        <section
          className="relative grid place-items-center h-[100svh] min-h-[560px] lg:min-h-0"
          style={{
            background: `url('${INVITE.portada}') center/cover no-repeat`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-black/15 to-black/55" />
          <div className="relative z-10 text-center text-white px-6 py-8">
            <h1
              className="text-6xl"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              {INVITE.titulo}
            </h1>
            <p
              className="text-3xl tracking-wide"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Sofía
            </p>
          </div>
          <div
            className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 text-white/90 animate-bounce lg:hidden"
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

        {/* CONTENIDO */}
        <section
          className="flex flex-col h-full"
          style={{
            backgroundColor: INVITE.colores.papel,
            backgroundImage: 'radial-gradient(#f5a9b8 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        >
          <div className="flex-1 overflow-y-auto px-6 py-6 lg:py-10">
            <div className="max-w-[620px] mx-auto text-center">
              <h2 className="text-3xl font-bold">¡Estás invitado!</h2>
              <p
                className="mt-2 text-lg sm:text-xl font-medium"
                style={{ color: INVITE.colores.secundario }}
              >
                Me encantaría que seas parte de este momento tan especial para
                mí. ¡Falta poco!
              </p>

              <CountdownCircles date={fecha} />

              <div className="mt-6">
                <button
                  onClick={downloadICS}
                  className="px-6 py-3 rounded-xl font-semibold text-white transition"
                  style={{ backgroundColor: INVITE.colores.rosaBtn }}
                >
                  Agendar fecha
                </button>
              </div>
              <Divider />

              {/* CEREMONIA */}
              <div className="mt-12 text-center">
                <IconLottieBubble
                  anim={ceremoniaAnim}
                  from={INVITE.colores.gradCerFrom}
                  to={INVITE.colores.gradCerTo}
                  title="Ceremonia"
                />
                <h3 className="mt-3 text-2xl font-bold">
                  {INVITE.ceremonia.titulo}
                </h3>
                <p className="mt-2 text-lg">{INVITE.ceremonia.lugar}</p>
                <p className="mt-1">{INVITE.celebracion.direccion}</p>
                <p className="mt-1">{INVITE.celebracion.fechaTexto}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    INVITE.ceremonia.mapsQuery
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block px-6 py-3 rounded-xl font-semibold text-white"
                  style={{ backgroundColor: INVITE.colores.rosaBtn }}
                >
                  Ver Mapa
                </a>
              </div>
              <Divider />
              {/* CELEBRACIÓN */}
              <div className="mt-12 text-center">
                <IconLottieBubble
                  anim={celebracionAnim}
                  from={INVITE.colores.gradCelFrom}
                  to={INVITE.colores.gradCelTo}
                  title="Celebración"
                />
                <h3 className="mt-3 text-2xl font-bold">
                  {INVITE.celebracion.titulo}
                </h3>
                <p className="mt-2 text-lg">{INVITE.celebracion.lugar}</p>
                <p className="mt-1">{INVITE.celebracion.direccion}</p>
                <p className="mt-1">{INVITE.celebracion.fechaTexto}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    INVITE.celebracion.mapsQuery
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block px-6 py-3 rounded-xl font-semibold text-white"
                  style={{ backgroundColor: INVITE.colores.rosaBtn }}
                >
                  Ver Mapa
                </a>
              </div>
              <Divider />
              {/* DRESS CODE */}
              <div className="mt-12 text-center">
                <IconLottieBubble
                  anim={dresscodeAnim}
                  from={INVITE.colores.gradDressFrom}
                  to={INVITE.colores.gradDressTo}
                  title="Dress Code"
                />
                <h3 className="mt-3 text-2xl font-bold">
                  {INVITE.dress.titulo}
                </h3>
                <p className="mt-2">{INVITE.dress.texto}</p>
              </div>
              {/* SECCIÓN FINAL EN NEGATIVO */}
              <section
                className="mt-16 text-center py-12 rounded-2xl shadow-md"
                style={{
                  backgroundColor: 'rgba(181, 101, 118, 0.85)',
                  color: INVITE.colores.fondo,
                  backgroundImage:
                    'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }}
              >
                <h3 className="text-4xl font-semibold">¡Te espero!</h3>
                <p className="mt-2 opacity-90">
                  Confirmá tu asistencia por WhatsApp
                </p>

                <a
                  href={`https://wa.me/${
                    INVITE.whatsapp
                  }?text=${encodeURIComponent(
                    `Confirmo asistencia a la Primera Comunión de ${INVITE.nombreNina}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition"
                  style={{
                    backgroundColor: INVITE.colores.fondo, // botón clarito
                    color: INVITE.colores.primario, // texto en color fuerte
                  }}
                >
                  {/* Ícono WhatsApp */}
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.5.04.18 5.36.22 11.92c.02 2.09.56 4.1 1.58 5.89L0 24l6.35-1.66a11.86 11.86 0 0 0 5.71 1.46h.05c6.56-.03 11.88-5.36 11.92-11.92a11.9 11.9 0 0 0-3.53-8.4ZM12.1 21.33h-.04a9.8 9.8 0 0 1-4.99-1.36l-.36-.21-3.77.99 1.01-3.67-.24-.38a9.77 9.77 0 0 1-1.5-5.19C2.17 6.5 6.55 2.12 12.07 2.1h.04c5.5 0 9.97 4.47 9.95 9.97-.02 5.5-4.49 9.96-9.97 9.96Zm5.68-7.35c-.31-.16-1.84-.91-2.12-1.02-.28-.1-.49-.16-.7.16-.2.31-.8 1.02-.98 1.22-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.5-1.53-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.13-.64.14-.14.31-.36.46-.54.15-.18.2-.31.31-.51.1-.2.05-.38-.03-.54-.08-.16-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53l-.6-.01c-.2 0-.54.08-.82.38-.28.31-1.08 1.06-1.08 2.6s1.11 3.02 1.26 3.23c.16.2 2.19 3.34 5.31 4.68.74.32 1.33.51 1.78.65.75.24 1.43.21 1.97.13.6-.09 1.84-.75 2.1-1.47.26-.72.26-1.35.18-1.49-.08-.14-.28-.23-.59-.39Z" />
                  </svg>
                  Confirmar por WhatsApp
                </a>
              </section>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
