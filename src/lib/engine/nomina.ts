/**
 * Nómina 2026 : prestaciones sociales (CST arts. 249, 306, Ley 52 de 1975), vacaciones (CST art. 186,
 * Ley 995 de 2005), indemnización (CST art. 64), recargos (CST arts. 168 y 179), aportes del trabajador
 * (Ley 100 de 1993) y retención en la fuente por salarios (ET arts. 383, 387, 206 y 336).
 * Todas las cifras vienen de src/data/params-2026.json.
 */
import { P } from './params';
import { toDate, type ISO } from './fechas';

const N = P.nomina;
const R = P.renta;
export const SMMLV = N.smmlv;
export const AUXILIO = N.auxilio;
export const UVT = P.uvt['2026'];

/**
 * Días laborados en año comercial de 360 días (meses de 30 días), fecha de inicio y de fin incluidas.
 * Convención de las nóminas colombianas para las fracciones de año; el día 31 cuenta como 30 y el último
 * día de febrero cierra el mes.
 */
export function dias360(desde: ISO, hasta: ISO): number {
  if (hasta < desde) return 0;
  const a = toDate(desde), b = toDate(hasta);
  let d1 = a.getUTCDate(), d2 = b.getUTCDate();
  const finFeb = (d: Date) => d.getUTCMonth() === 1 && new Date(Date.UTC(d.getUTCFullYear(), 2, 1) - 86400000).getUTCDate() === d.getUTCDate();
  if (d1 === 31 || finFeb(a)) d1 = 30;
  if (d2 === 31 || finFeb(b)) d2 = 30;
  return (b.getUTCFullYear() - a.getUTCFullYear()) * 360 + (b.getUTCMonth() - a.getUTCMonth()) * 30 + (d2 - d1) + 1;
}

/** Derecho al auxilio de transporte : salario de hasta dos salarios mínimos (Decreto 1470 de 2025). */
export const conAuxilio = (salario: number) => salario <= N.auxilio_tope_smmlv * SMMLV;
/** Base de cesantías, intereses y prima : salario + auxilio de transporte cuando aplica (Ley 1 de 1963, art. 7). */
export const basePrestaciones = (salario: number, auxilio = conAuxilio(salario)) => salario + (auxilio ? AUXILIO : 0);

export const cesantias = (base: number, dias: number) => (base * dias) / 360;
export const interesesCesantias = (ces: number, dias: number) => (ces * dias * N.intereses_cesantias) / 360;
export const prima = (base: number, dias: number) => (base * N.prima_dias * dias) / (30 * 360);
/** Vacaciones compensadas en dinero : 15 días de salario por 360 días trabajados, sin auxilio de transporte. */
export const vacacionesDias = (dias: number) => (dias * N.vacaciones_dias_habiles) / 360;
export const vacacionesValor = (salario: number, diasVac: number) => (salario / 30) * diasVac;

export type Contrato = 'indefinido' | 'fijo' | 'obra';
/** Días de salario de la indemnización por despido sin justa causa (CST art. 64). */
export function indemnizacionDias(o: { contrato: Contrato; salario: number; diasServicio: number; diasFaltantes?: number }): number {
  if (o.contrato === 'fijo') return Math.max(0, o.diasFaltantes ?? 0);
  if (o.contrato === 'obra') return Math.max(N.indemnizacion.obra_minimo, o.diasFaltantes ?? 0);
  const t = o.salario < N.indemnizacion.umbral_smmlv * SMMLV ? N.indemnizacion.bajo : N.indemnizacion.alto;
  return o.diasServicio <= 360 ? t.primer_anio : t.primer_anio + (t.adicional * (o.diasServicio - 360)) / 360;
}

export interface Liquidacion {
  dias: number; diasAnio: number; diasSemestre: number; base: number; auxilio: boolean;
  cesantias: number; intereses: number; prima: number; vacDias: number; vacaciones: number;
  indemDias: number; indemnizacion: number; total: number;
}
/**
 * Liquidación final del contrato. Supone cesantías de años anteriores ya consignadas en el fondo, prima
 * del semestre anterior ya pagada y vacaciones pendientes acumuladas desde el ingreso, menos las disfrutadas.
 */
export function liquidacion(o: { salario: number; ingreso: ISO; retiro: ISO; despido: boolean; contrato: Contrato; diasFaltantes?: number; vacTomadas: number }): Liquidacion {
  const y = o.retiro.slice(0, 4);
  const iniAnio = o.ingreso > `${y}-01-01` ? o.ingreso : `${y}-01-01`;
  const sem = o.retiro.slice(5, 7) <= '06' ? `${y}-01-01` : `${y}-07-01`;
  const iniSem = o.ingreso > sem ? o.ingreso : sem;
  const dias = dias360(o.ingreso, o.retiro), diasAnio = dias360(iniAnio, o.retiro), diasSemestre = dias360(iniSem, o.retiro);
  const auxilio = conAuxilio(o.salario);
  const base = basePrestaciones(o.salario, auxilio);
  const ces = cesantias(base, diasAnio);
  const int = interesesCesantias(ces, diasAnio);
  const pri = prima(base, diasSemestre);
  const vacDias = Math.max(0, vacacionesDias(dias) - o.vacTomadas);
  const vac = vacacionesValor(o.salario, vacDias);
  const indemDias = o.despido ? indemnizacionDias({ contrato: o.contrato, salario: o.salario, diasServicio: dias, diasFaltantes: o.diasFaltantes }) : 0;
  const indem = (o.salario / 30) * indemDias;
  return { dias, diasAnio, diasSemestre, base, auxilio, cesantias: ces, intereses: int, prima: pri, vacDias, vacaciones: vac, indemDias, indemnizacion: indem, total: ces + int + pri + vac + indem };
}

/** Recargo dominical y festivo vigente en una fecha (CST art. 179, parágrafo transitorio, Ley 2466 de 2025). */
export const recargoDominical = (fecha: ISO) => [...N.dominical].reverse().find((x) => fecha >= x.desde)?.pct ?? N.dominical[0].pct;
/** Jornada máxima semanal vigente en una fecha (Ley 2101 de 2021). */
export const jornadaSemanal = (fecha: ISO) => [...N.jornada].reverse().find((x) => fecha >= x.desde)?.horas ?? 48;
/** Horas ordinarias del mes : jornada semanal ÷ 6 días × 30 días (convención de nómina, modificable). */
export const horasMes = (semanal: number) => (semanal / 6) * 30;

export interface Recargos { hora: number; nocturnas: number; extraDiurna: number; extraNocturna: number; dominical: number; total: number; pctDominical: number }
export function recargos(o: { salario: number; horasMes: number; fecha: ISO; hNocturnas: number; hExtraDiurna: number; hExtraNocturna: number; hDominical: number }): Recargos {
  const hora = o.horasMes > 0 ? o.salario / o.horasMes : 0;
  const pctDominical = recargoDominical(o.fecha);
  const nocturnas = hora * N.recargo_nocturno * o.hNocturnas;
  const extraDiurna = hora * (1 + N.extra_diurna) * o.hExtraDiurna;
  const extraNocturna = hora * (1 + N.extra_nocturna) * o.hExtraNocturna;
  const dominical = hora * (1 + pctDominical) * o.hDominical;
  return { hora, nocturnas, extraDiurna, extraNocturna, dominical, total: nocturnas + extraDiurna + extraNocturna + dominical, pctDominical };
}

/** Aporte al Fondo de Solidaridad Pensional a cargo del trabajador (Ley 100 de 1993, arts. 20 y 27). */
export const fsp = (ibc: number) => [...N.fsp].reverse().find((x) => ibc >= x.desde * SMMLV)?.pct ?? 0;
export interface Neto { salario: number; auxilio: number; devengado: number; salud: number; pension: number; fsp: number; deducciones: number; neto: number; ibc: number }
/** Salario neto del trabajador antes de retención en la fuente. */
export function neto(salario: number, integral = false): Neto {
  const ibc = Math.min(integral ? salario * N.integral_ibc : salario, N.ibc_max_smmlv * SMMLV);
  const aux = !integral && conAuxilio(salario) ? AUXILIO : 0;
  const salud = ibc * N.salud_empleado, pension = ibc * N.pension_empleado, f = ibc * fsp(ibc);
  const ded = salud + pension + f;
  return { salario, auxilio: aux, devengado: salario + aux, salud, pension, fsp: f, deducciones: ded, neto: salario + aux - ded, ibc };
}

/** Tabla del art. 383 ET aplicada a una base mensual en UVT : retención en UVT. */
export function tabla383(baseUvt: number): number {
  const t = R.art383.find((r) => baseUvt > r.desde && (r.hasta === null || baseUvt <= r.hasta));
  return t ? (baseUvt - t.desde) * t.marginal + t.fijo : 0;
}
export interface Retencion {
  ingreso: number; incr: number; neto: number; dependientes: number; prepagada: number; deducciones: number;
  exenta25: number; limite40: number; beneficios: number; base: number; baseUvt: number; retencionUvt: number; retencion: number;
}
/**
 * Retención en la fuente por salarios, procedimiento 1 (un mes). INCR = aportes obligatorios del
 * trabajador a salud, pensión y FSP. Topes anuales de 790 UVT (renta exenta) y 1.340 UVT (límite global)
 * llevados a un mes dividiéndolos entre 12.
 */
export function retencion(o: { ingreso: number; dependiente: boolean; prepagada: number; integral?: boolean }): Retencion {
  const n = neto(o.ingreso, o.integral);
  const incr = n.salud + n.pension + n.fsp;
  const netoIncr = o.ingreso - incr;
  const dependientes = o.dependiente ? Math.min(o.ingreso * R.dependientes_pct, R.dependientes_uvt_mes * UVT) : 0;
  const prepagada = Math.min(Math.max(0, o.prepagada), R.prepagada_uvt_mes * UVT);
  const deducciones = dependientes + prepagada;
  const exenta25 = Math.min((netoIncr - deducciones) * R.exenta25, (R.exenta25_uvt_anual / 12) * UVT);
  const limite40 = Math.min(netoIncr * R.limite40, (R.limite40_uvt_anual / 12) * UVT);
  const beneficios = Math.min(deducciones + exenta25, limite40);
  const base = Math.max(0, netoIncr - beneficios);
  const baseUvt = base / UVT;
  const retencionUvt = tabla383(baseUvt);
  return { ingreso: o.ingreso, incr, neto: netoIncr, dependientes, prepagada, deducciones, exenta25, limite40, beneficios, base, baseUvt, retencionUvt, retencion: retencionUvt * UVT };
}

/** Topes para declarar renta del año gravable 2025 (valores en pesos publicados por la DIAN). */
export interface Topes { patrimonio: number; ingresos: number; tarjeta: number; compras: number; consignaciones: number; iva: boolean }
export function obligadoDeclarar(t: Topes): { obligado: boolean; motivos: Array<keyof Topes> } {
  const m: Array<keyof Topes> = [];
  if (t.patrimonio > R.patrimonio_cop) m.push('patrimonio');
  if (t.ingresos >= R.ingresos_cop) m.push('ingresos');
  if (t.tarjeta > R.tarjeta_cop) m.push('tarjeta');
  if (t.compras > R.compras_cop) m.push('compras');
  if (t.consignaciones > R.consignaciones_cop) m.push('consignaciones');
  if (t.iva) m.push('iva');
  return { obligado: m.length > 0, motivos: m };
}
