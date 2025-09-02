// src/utils/date.ts
export function fechaLargaEs(date: Date, capitalizarMes = true) {
  const parts = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).formatToParts(date);

  const capPrimera = (s: string) => {
    const [first, ...rest] = [...s];
    return (first ? first.toLocaleUpperCase('es-AR') : '') + rest.join('');
  };

  return parts
    .map((p) => {
      if (p.type === 'weekday') return capPrimera(p.value);
      if (p.type === 'month')
        return capitalizarMes ? capPrimera(p.value) : p.value;
      return p.value;
    })
    .join('');
}
