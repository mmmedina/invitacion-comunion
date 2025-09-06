import { useEffect, useMemo, useState } from 'react';
import { ICON_SETS, type IconKey } from '../config/icons.config'; // ajustá la ruta

/** Lee el set activo desde <html data-iconset="..."> */
const getIconsetName = () =>
  document.documentElement.getAttribute('data-iconset') || 'dulce';

/** Hook que reacciona cuando cambia data-iconset en <html> */
const useIconsetName = () => {
  const [name, setName] = useState(getIconsetName());
  useEffect(() => {
    const html = document.documentElement;
    const obs = new MutationObserver(() => setName(getIconsetName()));
    obs.observe(html, { attributes: true, attributeFilter: ['data-iconset'] });
    return () => obs.disconnect();
  }, []);
  return name;
};

/* =======================
   Helpers de sanitización
   ======================= */

/** #FFFFFF o #ffffff */
const isWhiteHex = (sc?: string) =>
  typeof sc === 'string' && /^#?f{6}$/i.test(sc.replace('#', ''));

/** Color Lottie como [r,g,b,(a?)] en 0..1, muy cercano a blanco */
const isNearWhite = (arr: any) => {
  if (!Array.isArray(arr)) return false;
  const [r, g, b] = arr;
  const near = (v: number) => typeof v === 'number' && v >= 0.98;
  return near(r) && near(g) && near(b);
};

/** Elimina capas/fills que suelen ser el "fondo blanco" dentro del JSON */
function sanitizeLottie(data: any) {
  if (!data || !Array.isArray(data.layers)) return data;

  // 1) Filtrar capas con nombre típico de fondo, o sólidos blancos
  data.layers = data.layers.filter((ly: any) => {
    const nm = (ly?.nm || '').toLowerCase();

    // nombres comunes de fondo
    if (/\b(bg|background|fondo)\b/.test(nm)) return false;

    // capa sólida (ty:1) con color blanco en sc
    if (ly?.ty === 1 && isWhiteHex(ly.sc)) return false;

    // capa imagen (ty:2) llamada background/bg/fondo → descartar
    if (ly?.ty === 2 && /\b(bg|background|fondo)\b/.test(nm)) return false;

    // capa shape (ty:4): eliminar fills blancos; si queda vacía, descartar
    if (ly?.ty === 4 && Array.isArray(ly.shapes)) {
      ly.shapes = ly.shapes.filter((sh: any) => {
        // fill normal
        if (sh?.ty === 'fl' && isNearWhite(sh?.c?.k)) return false;
        // grad fill muy claro (opcional, conservador)
        if (sh?.ty === 'gf' && Array.isArray(sh?.g?.k?.k)) {
          try {
            // k: [nStops*4?] estructura variable; chequeo heurístico de blancos
            const cols = sh.g.k.k.filter((_: any, i: number) => i % 4 !== 0);
            const allNearWhite = cols.every(
              (v: number) => typeof v === 'number' && v >= 0.98
            );
            if (allNearWhite) return false;
          } catch {}
        }
        return true;
      });
      if (!ly.shapes.length) return false;
    }

    return true;
  });

  // 2) (Opcional) si hay "assets" con imágenes etiquetadas como fondo, filtrarlas
  if (Array.isArray(data.assets)) {
    data.assets = data.assets.filter((as: any) => {
      const nm = (as?.nm || '').toLowerCase?.() || '';
      if (/\b(bg|background|fondo)\b/.test(nm)) return false;
      return true;
    });
  }

  return data;
}

/**
 * Devuelve el objeto JSON de Lottie para la clave indicada (según el set activo),
 * sanitizado para remover fondos blancos internos.
 */
export const useIcon = (key: IconKey) => {
  const setName = useIconsetName();

  // ruta/URL del JSON según el set
  const src = useMemo(() => {
    const set = ICON_SETS[setName] || ICON_SETS.dulce;
    return set?.[key];
  }, [setName, key]);

  const [json, setJson] = useState<any>(null);

  useEffect(() => {
    let cancel = false;
    if (!src) {
      setJson(null);
      return;
    }

    fetch(src)
      .then((r) => r.json())
      .then((data) => {
        if (cancel) return;
        const clean = sanitizeLottie(data);
        setJson(clean);
      })
      .catch(() => {
        if (!cancel) setJson(null);
      });

    return () => {
      cancel = true;
    };
  }, [src]);

  return json; // pásalo directo a <SectionCard iconAnim={json} />
};
