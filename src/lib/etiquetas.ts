/** Libellés des obligations, actions et périodes du calendrier (es / en). */
import { displayDate } from './format';
import { LOCALE_BY_LANG } from '../data/site-config';
import type { Vencimiento } from './engine/calendario';
type L = 'es' | 'en';
const T = <A,>(l: L, es: A, en: A) => (l === 'en' ? en : es);

export const OBLIGACION: Record<string, [string, string]> = {
  renta_gc: ['Renta grandes contribuyentes', 'Income tax, large taxpayers'],
  renta_pj: ['Renta personas jurídicas', 'Corporate income tax'],
  renta_pn: ['Renta personas naturales', 'Personal income tax return'],
  activos: ['Activos en el exterior', 'Foreign assets return'],
  iva_bim: ['IVA bimestral', 'VAT, two-month period'],
  iva_cuat: ['IVA cuatrimestral', 'VAT, four-month period'],
  retencion: ['Retención en la fuente', 'Withholding tax return'],
  rst_anual: ['Régimen Simple, declaración anual', 'Simple Tax Regime, annual return'],
  rst_anticipo: ['Régimen Simple, anticipo bimestral', 'Simple Tax Regime, two-month advance'],
  rst_iva: ['Régimen Simple, IVA anual consolidado', 'Simple Tax Regime, annual VAT return'],
  patrimonio: ['Impuesto al patrimonio', 'Wealth tax'],
  precios_transf: ['Precios de transferencia', 'Transfer pricing'],
  ica: ['ICA', 'ICA municipal tax'],
  reteica: ['ReteICA', 'ICA withholding'],
  autoreteica: ['Retención y autorretención de ICA', 'ICA withholding and self-withholding'],
  exogena: ['Información exógena', 'Third-party information return (exógena)'],
};
export const ACCION: Record<string, [string, string]> = {
  pago1: ['pago de la 1.ª cuota', 'first instalment'],
  pago2: ['pago de la 2.ª cuota', 'second instalment'],
  pago3: ['pago de la 3.ª cuota', 'third instalment'],
  decl_pago: ['declaración y pago', 'return and payment'],
  decl_pago1: ['declaración y pago de la 1.ª cuota', 'return and first instalment'],
  decl_pago2: ['declaración y pago de la 2.ª cuota', 'return and second instalment'],
  decl: ['declaración', 'return'],
  decl_iva: ['declaración anual de IVA', 'annual VAT return'],
  anticipo: ['recibo de anticipo', 'advance payment'],
  pago: ['pago', 'payment'],
  cobro: ['pago del documento de cobro', 'payment of the billing statement'],
  reporte: ['entrega de la información', 'filing of the information'],
  informativa: ['declaración informativa', 'information return'],
  documentacion: ['documentación comprobatoria', 'supporting documentation'],
};
const MES_B: Record<string, [string, string]> = {
  B1: ['enero-febrero', 'January-February'], B2: ['marzo-abril', 'March-April'], B3: ['mayo-junio', 'May-June'],
  B4: ['julio-agosto', 'July-August'], B5: ['septiembre-octubre', 'September-October'], B6: ['noviembre-diciembre', 'November-December'],
  C1: ['enero-abril', 'January-April'], C2: ['mayo-agosto', 'May-August'], C3: ['septiembre-diciembre', 'September-December'],
};
/** « AG2025 » → año gravable 2025 ; « 2026-B3 » → mayo-junio 2026 ; « 2026-04 » → abril de 2026. */
export function periodo(p: string, l: L): string {
  const ag = /^AG(\d{4})$/.exec(p); if (ag) return T(l, `año gravable ${ag[1]}`, `tax year ${ag[1]}`);
  const v = /^V(\d{4})$/.exec(p); if (v) return T(l, `vigencia ${v[1]}`, `fiscal year ${v[1]}`);
  const pp = /^(\d{4})-P(\d)$/.exec(p); if (pp) return T(l, `cobro bimestral n.º ${pp[2]} de ${pp[1]}`, `billing period ${pp[2]} of ${pp[1]}`);
  const b = /^(\d{4})-([BC]\d)$/.exec(p); if (b) return `${MES_B[b[2]][l === 'en' ? 1 : 0]} ${b[1]}`;
  const m = /^(\d{4})-(\d{2})$/.exec(p);
  if (m) return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, 15)).toLocaleDateString(LOCALE_BY_LANG[l], { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return p;
}
export const obligacion = (id: string, l: L) => (OBLIGACION[id] ?? [id, id])[l === 'en' ? 1 : 0];
export const accion = (id: string, l: L) => (ACCION[id] ?? [id, id])[l === 'en' ? 1 : 0];
export function titulo(v: Vencimiento, l: L, ciudad?: string): string {
  const ob = v.obligacion.includes('ica') && ciudad ? `${obligacion(v.obligacion, l)} ${ciudad}` : obligacion(v.obligacion, l);
  return `${ob}: ${accion(v.accion, l)} (${periodo(v.periodo, l)})`;
}
export const fechaLarga = (iso: string, l: L) => new Date(`${iso}T00:00:00Z`).toLocaleDateString(LOCALE_BY_LANG[l], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const fechaCorta = (iso: string, l: L) => displayDate(iso, LOCALE_BY_LANG[l]);
