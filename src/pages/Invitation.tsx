// src/pages/Invitation.tsx
import React, { useMemo } from 'react';
import ceremoniaAnim from '@/assets/lotties/church.json';
import celebracionAnim from '@/assets/lotties/confetti2.json';
import dresscodeAnim from '@/assets/lotties/dress.json';

import { INVITE } from '@/config/invite';
import { fechaLargaEs } from '@/utils/date';
import { addToCalendar } from '@/utils/calendar';

import { CountdownCircles } from '@/components/CountdownCircles';
import { SectionCard } from '@/components/SectionCard';
import { MapButton } from '@/components/MapButton';
import { Reveal } from '@/components/Reveal';

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

  // === Data-driven sections (evita repetición) ===
  const sections = [
    {
      key: 'ceremonia',
      cfg: INVITE.ceremonia,
      bg: INVITE.colores.pastelCer,
      gradFrom: INVITE.colores.gradCerFrom,
      gradTo: INVITE.colores.gradCerTo,
      icon: ceremoniaAnim,
      body: (
        <>
          <p className="mt-1">{INVITE.ceremonia.fechaTexto}</p>
          <p className="mt-2 text-lg sm:text-xl">{INVITE.ceremonia.lugar}</p>
          <p className="mt-1 whitespace-nowrap">{INVITE.ceremonia.direccion}</p>
          <MapButton query={INVITE.ceremonia.mapsQuery} />
        </>
      ),
      reveal: { variant: 'fadeUp' as const, delay: 0 },
    },
    {
      key: 'celebracion',
      cfg: INVITE.celebracion,
      bg: INVITE.colores.pastelCel,
      gradFrom: INVITE.colores.gradCelFrom,
      gradTo: INVITE.colores.gradCelTo,
      icon: celebracionAnim,
      body: (
        <>
          <p className="mt-1">{INVITE.celebracion.fechaTexto}</p>
          <p className="mt-1 whitespace-nowrap">
            {INVITE.celebracion.direccion}
          </p>
          <MapButton query={INVITE.celebracion.mapsQuery} />
        </>
      ),
      reveal: { variant: 'zoomIn' as const, delay: 120 },
    },
    {
      key: 'dress',
      cfg: INVITE.dress,
      bg: INVITE.colores.pastelDress,
      gradFrom: INVITE.colores.gradDressFrom,
      gradTo: INVITE.colores.gradDressTo,
      icon: dresscodeAnim,
      body: <p className="mt-2">{INVITE.dress.texto}</p>,
      reveal: { variant: 'blurRise' as const, delay: 240 },
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: INVITE.colores.fondo,
        color: INVITE.colores.primario,
      }}
    >
      <div className="grid w-full h-auto bg-white shadow-xl lg:grid-cols-2 lg:h-screen">
        {/* PORTADA */}
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

          {/* Flecha scroll solo mobile */}
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

          {/* Pestaña curva solo mobile */}
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
            <div
              className="max-w-[620px] mx-auto text-center text-[18px] sm:text-[19px] lg:text-[20px] leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <h2
                className="text-5xl font-normal sm:text-6xl"
                style={{ fontFamily: "'Great Vibes', cursive" }}
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

              {/* Fecha + countdown */}
              <div className="mt-8">
                <div
                  className="text-4xl sm:text-5xl"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
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

              {/* Botón calendario */}
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

              {/* Secciones mapeadas */}
              {sections.map((s) => (
                <Reveal
                  key={s.key}
                  variant={s.reveal.variant}
                  delay={s.reveal.delay}
                >
                  <SectionCard
                    bg={s.bg}
                    title={(INVITE as any)[s.key]?.titulo ?? s.cfg.titulo}
                    iconAnim={s.icon}
                    gradFrom={s.gradFrom}
                    gradTo={s.gradTo}
                    iconStyle={
                      s.key === 'celebracion'
                        ? {
                            transform: 'translateY(-6%) scale(0.86)',
                            transformOrigin: 'center',
                          }
                        : undefined
                    }
                  >
                    {s.body}
                  </SectionCard>
                </Reveal>
              ))}

              {/* Footer negativo */}
              <section
                className="mt-16 text-center py-12 px-6 rounded-none shadow-none mx-[-1.5rem]"
                style={{
                  backgroundColor: 'rgba(181, 101, 118, 0.85)',
                  color: INVITE.colores.fondo,
                  backgroundImage:
                    'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }}
              >
                <h3
                  className="text-5xl font-normal sm:text-6xl"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
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
                  {/* ícono WhatsApp */}
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.5.04.18 5.36.22 11.92c.02 2.09.56 4.1 1.58 5.89L0 24l6.35-1.66a11.86 11.86 0 0 0 5.71 1.46h.05c6.56-.03 11.88-5.36 11.92-11.92a11.9 11.9 0 0 0-3.53-8.4Z..." />
                  </svg>
                  Confirmar Asistencia
                </a>
              </section>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
