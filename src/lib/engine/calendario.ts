/**
 * Calendario por NIT : a partir de los últimos dígitos del NIT (sin dígito de verificación) y del tipo de
 * contribuyente, todas las fechas del año, nacionales (calendario DIAN 2026, Decreto 2229 de 2023) y
 * municipales (ICA de la ciudad elegida). Datos : src/data/calendario-2026.json y src/data/ica-2026.json.
 */
import CAL from '../../data/calendario-2026.json';
import ICA from '../../data/ica-2026.json';
import type { ISO } from './fechas';

export type Tipo = 'pn' | 'pj' | 'gc';
export type ObligacionId = keyof typeof CAL.obligaciones | 'activos';
export interface Vencimiento { fecha: ISO; obligacion: string; periodo: string; accion: string; ciudad?: string; clave: string }
export interface Opciones {
  nit: string; tipo: Tipo;
  /** IVA : no responsable, bimestral o cuatrimestral. */
  iva: 'no' | 'bim' | 'cuat';
  retenedor: boolean; rst: boolean; activos: boolean; patrimonio: boolean; precios: boolean;
  /** Obligado a reportar información exógena (medios magnéticos). */
  exogena?: boolean;
  /** Identificador de ciudad para el ICA ('' = ninguna). */
  ciudad: string;
  /** Régimen ICA de la ciudad (por defecto el primero publicado). */
  regimenIca?: string;
  /** Agente de retención de ICA en esa ciudad (ReteICA). */
  reteica?: boolean;
}

/** Dígitos del NIT sin dígito de verificación : « 900.123.456-7 » → « 900123456 ». */
export function nitBase(nit: string): string {
  const sinDv = nit.includes('-') ? nit.slice(0, nit.indexOf('-')) : nit;
  return sinDv.replace(/\D/g, '');
}

/** ¿La clave de una tabla (« 7 », « 1-2 », « 9-0 », « 01-02 », « 99-00 », « 00-19 », « todos ») cubre este NIT ? */
export function cubre(clave: string, nit: string): boolean {
  const b = nitBase(nit);
  if (clave === 'todos') return true;
  if (!b) return false;
  const u1 = Number(b.slice(-1));
  const u2 = Number(b.slice(-2).padStart(2, '0'));
  const partes = clave.split('-');
  const ancho = partes[0].length;
  const v = ancho === 2 ? u2 : u1;
  if (partes.length === 1) return Number(partes[0]) === v;
  const a = Number(partes[0]), z = Number(partes[1]);
  return z >= a ? v >= a && v <= z : v >= a || v <= z; // « 9-0 », « 99-00 » : da la vuelta
}

const fechaDe = (fechas: Record<string, string>, nit: string): [string, string] | null => {
  for (const [k, f] of Object.entries(fechas)) if (cubre(k, nit)) return [k, f];
  return null;
};

type Fila = { periodo: string; accion: string; fechas: Record<string, string>; ob?: string };
const de = (id: keyof typeof CAL.obligaciones, nit: string, nombre = id as string): Vencimiento[] =>
  (CAL.obligaciones[id] as Fila[]).flatMap((r) => { const x = fechaDe(r.fechas, nit); return x ? [{ fecha: x[1], obligacion: nombre, periodo: r.periodo, accion: r.accion, clave: x[0] }] : []; });

type Txt = { es: string; en: string };
export interface Regimen { id: string; nombre: Txt; quien: Txt; filas: Fila[] }
export interface Ciudad {
  id: string; nombre: Txt; autoridad: Txt; acto: string; url: string; url_calendario?: string; por_nit: boolean;
  regimenes: Regimen[]; retencion: { nombre: Txt; filas: Fila[] } | null;
}
export const CIUDADES = (ICA as unknown as { ciudades: Ciudad[] }).ciudades;
export const ICA_RETRIEVED = (ICA as { retrieved_at: string }).retrieved_at;

/** Todas las fechas del año para un contribuyente, ordenadas. */
export function vencimientos(o: Opciones): Vencimiento[] {
  const out: Vencimiento[] = [];
  if (!nitBase(o.nit)) return out;
  if (o.rst) {
    out.push(...de('rst_anual', o.nit), ...de('rst_anticipo', o.nit));
    if (o.iva !== 'no') out.push(...de('rst_iva', o.nit));
  } else {
    const renta = o.tipo === 'gc' ? 'renta_gc' : o.tipo === 'pj' ? 'renta_pj' : 'renta_pn';
    const r = de(renta, o.nit);
    out.push(...r);
    if (o.activos) {
      // Activos en el exterior : mismas fechas que la declaración de renta del contribuyente.
      const decl = r.find((x) => x.accion.startsWith('decl'));
      if (decl) out.push({ ...decl, obligacion: 'activos', accion: 'decl' });
    }
    if (o.iva === 'bim') out.push(...de('iva_bim', o.nit));
    if (o.iva === 'cuat') out.push(...de('iva_cuat', o.nit));
  }
  if (o.retenedor) out.push(...de('retencion', o.nit));
  if (o.patrimonio) out.push(...de('patrimonio', o.nit));
  if (o.precios && o.tipo !== 'pn') out.push(...de('precios_transf', o.nit));
  if (o.exogena) out.push(...(o.tipo === 'gc' ? de('exogena_gc', o.nit, 'exogena') : de('exogena', o.nit)));
  const c = CIUDADES.find((x) => x.id === o.ciudad);
  if (c) {
    const reg = c.regimenes.find((x) => x.id === o.regimenIca) ?? c.regimenes[0];
    for (const r of reg?.filas ?? []) { const x = fechaDe(r.fechas, o.nit); if (x) out.push({ fecha: x[1], obligacion: r.ob ?? 'ica', periodo: r.periodo, accion: r.accion, ciudad: c.id, clave: x[0] }); }
    if (o.reteica && c.retencion) for (const r of c.retencion.filas) { const x = fechaDe(r.fechas, o.nit); if (x) out.push({ fecha: x[1], obligacion: 'reteica', periodo: r.periodo, accion: r.accion, ciudad: c.id, clave: x[0] }); }
  }
  return out.sort((a, b) => a.fecha.localeCompare(b.fecha) || a.obligacion.localeCompare(b.obligacion));
}

/** Índice del primer vencimiento a partir de `hoy` (−1 si todos pasaron). */
export const proximo = (v: Vencimiento[], hoy: ISO) => v.findIndex((x) => x.fecha >= hoy);

/** Fechas de una obligación nacional para cada clave (tablas de las páginas). */
export const tabla = (id: keyof typeof CAL.obligaciones) => CAL.obligaciones[id] as Fila[];
export const CALENDARIO = CAL;

/** Archivo .ics (RFC 5545) generado en el navegador : un evento de día completo por fecha. */
export function ics(v: Vencimiento[], titulo: (x: Vencimiento) => string, producto = 'co-calendario-nomina'): string {
  const esc = (s: string) => s.replace(/[\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
  const d = (iso: string) => iso.replace(/-/g, '');
  const sig = (iso: string) => { const t = new Date(`${iso}T00:00:00Z`); t.setUTCDate(t.getUTCDate() + 1); return t.toISOString().slice(0, 10); };
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//${producto}//ES`, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  v.forEach((x, i) => {
    lines.push('BEGIN:VEVENT', `UID:${d(x.fecha)}-${x.obligacion}-${x.periodo}-${i}@${producto}`, 'DTSTAMP:20260101T000000Z',
      `DTSTART;VALUE=DATE:${d(x.fecha)}`, `DTEND;VALUE=DATE:${d(sig(x.fecha))}`, `SUMMARY:${esc(titulo(x))}`, 'TRANSP:TRANSPARENT', 'END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}
