// src/utils/calendar.ts
import { INVITE } from '@/config/invite';

const fmtUTC = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');

export function openGoogleCalendar() {
  const start = new Date(INVITE.fechaISO);
  const end = new Date(start.getTime() + INVITE.duracionMin * 60000);

  const url =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(`Primera Comunión de ${INVITE.nombreNina}`)}` +
    `&dates=${fmtUTC(start)}/${fmtUTC(end)}` +
    `&details=${encodeURIComponent(INVITE.ceremonia.lugar)}` +
    `&location=${encodeURIComponent(
      `${INVITE.ceremonia.lugar}, ${INVITE.ceremonia.direccion}`
    )}` +
    `&sf=true&output=xml`;

  window.open(url, '_blank', 'noopener,noreferrer');
}

export function openAppleCalendarWebcal() {
  const host = window.location.host;
  window.location.href = `webcal://${host}/evento.ics`;
}

export function downloadICS() {
  const start = new Date(INVITE.fechaISO);
  const end = new Date(start.getTime() + INVITE.duracionMin * 60000);
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Invite//ES
BEGIN:VEVENT
UID:${crypto.randomUUID()}
DTSTAMP:${fmtUTC(start)}
DTSTART:${fmtUTC(start)}
DTEND:${fmtUTC(end)}
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

export function addToCalendar() {
  const ua =
    navigator.userAgent ||
    (navigator as any).vendor ||
    (window as any).opera ||
    '';
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  if (isIOS) return openAppleCalendarWebcal();
  if (isAndroid) return openGoogleCalendar();

  try {
    openGoogleCalendar();
  } catch {
    downloadICS();
  }
}
