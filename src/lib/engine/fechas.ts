/**
 * Fechas : festivos de Colombia (Ley 51 de 1983, « Ley Emiliani », y Ley 35 de 1939), días hábiles,
 * aritmética de fechas ISO en UTC (jamais l'heure locale : le build et le navigateur doivent rendre la
 * même chose, RECETTE §17.5).
 */
export type ISO = string; // AAAA-MM-DD

export const toDate = (iso: ISO) => new Date(`${iso}T00:00:00Z`);
export const toISO = (d: Date): ISO => d.toISOString().slice(0, 10);
export const addDays = (iso: ISO, n: number): ISO => { const d = toDate(iso); d.setUTCDate(d.getUTCDate() + n); return toISO(d); };
export const weekday = (iso: ISO) => toDate(iso).getUTCDay(); // 0 = domingo
export const diffDays = (a: ISO, b: ISO) => Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86400000);

/** Domingo de Pascua (algoritmo de Meeus/Jones/Butcher, calendario gregoriano). */
export function pascua(y: number): ISO {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1;
  return `${y}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

/** Lunes siguiente (o el mismo día si ya es lunes) : traslado de la Ley 51 de 1983, art. 1. */
export const lunesSiguiente = (iso: ISO): ISO => { const w = weekday(iso); return w === 1 ? iso : addDays(iso, (8 - w) % 7); };

export type FestivoId =
  | 'anio_nuevo' | 'reyes' | 'san_jose' | 'jueves_santo' | 'viernes_santo' | 'trabajo' | 'ascension'
  | 'corpus' | 'sagrado_corazon' | 'san_pedro' | 'independencia' | 'boyaca' | 'asuncion' | 'raza'
  | 'todos_santos' | 'cartagena' | 'inmaculada' | 'navidad' | 'chiquinquira';
export interface Festivo { id: FestivoId; fecha: ISO; original: ISO; trasladado: boolean }

/**
 * Los festivos de un año : fijos, trasladables al lunes y ligados a la Pascua (18), más el Día de Nuestra
 * Señora del Rosario de Chiquinquirá (9 de julio, trasladable) desde la Ley 2578 del 1 de junio de 2026, art. 6.
 */
export function festivos(y: number): Festivo[] {
  const f = (id: FestivoId, m: number, d: number, mover: boolean): Festivo => {
    const o = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const fecha = mover ? lunesSiguiente(o) : o;
    return { id, fecha, original: o, trasladado: fecha !== o };
  };
  const p = pascua(y);
  const pas = (id: FestivoId, dias: number, mover: boolean): Festivo => {
    const o = addDays(p, dias);
    const fecha = mover ? lunesSiguiente(o) : o;
    return { id, fecha, original: o, trasladado: fecha !== o };
  };
  return [
    f('anio_nuevo', 1, 1, false), f('reyes', 1, 6, true), f('san_jose', 3, 19, true),
    pas('jueves_santo', -3, false), pas('viernes_santo', -2, false), f('trabajo', 5, 1, false),
    pas('ascension', 39, true), pas('corpus', 60, true), pas('sagrado_corazon', 68, true),
    f('san_pedro', 6, 29, true), f('independencia', 7, 20, false), f('boyaca', 8, 7, false),
    f('asuncion', 8, 15, true), f('raza', 10, 12, true), f('todos_santos', 11, 1, true),
    f('cartagena', 11, 11, true), f('inmaculada', 12, 8, false), f('navidad', 12, 25, false),
    ...(y >= 2026 ? [f('chiquinquira', 7, 9, true)] : []),
  ].sort((a, b) => a.fecha.localeCompare(b.fecha));
}

const cache = new Map<number, Set<ISO>>();
export const esFestivo = (iso: ISO) => {
  const y = Number(iso.slice(0, 4));
  if (!cache.has(y)) cache.set(y, new Set(festivos(y).map((x) => x.fecha)));
  return cache.get(y)!.has(iso);
};
/** Día hábil : ni sábado, ni domingo, ni festivo. `extra` : días no hábiles adicionales (día cívico). */
export const esHabil = (iso: ISO, extra: ISO[] = []) => { const w = weekday(iso); return w !== 0 && w !== 6 && !esFestivo(iso) && !extra.includes(iso); };

/** Días hábiles entre dos fechas, la de inicio excluida y la de fin incluida. */
export function habilesEntre(desde: ISO, hasta: ISO, extra: ISO[] = []): number {
  let n = 0, d = desde;
  if (hasta <= desde) return 0;
  while (d < hasta) { d = addDays(d, 1); if (esHabil(d, extra)) n++; }
  return n;
}
/** Fecha que cae `n` días hábiles después de `desde`. */
export function sumarHabiles(desde: ISO, n: number, extra: ISO[] = []): ISO {
  let d = desde, k = 0;
  while (k < n) { d = addDays(d, 1); if (esHabil(d, extra)) k++; }
  return d;
}
/** Domingos y festivos de un mes (para los recargos). */
export function domingosYFestivos(y: number, m: number): { domingos: number; festivos: number } {
  let dom = 0, fes = 0;
  for (let d = 1; d <= 31; d++) {
    const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (toDate(iso).getUTCMonth() !== m - 1) break;
    if (weekday(iso) === 0) dom++; else if (esFestivo(iso)) fes++;
  }
  return { domingos: dom, festivos: fes };
}
