/** Formatage monétaire/numérique localisé (es-CO, en-US). */
import { LOCALE_TAG, LOCALE_BY_LANG, CURRENCY } from '../data/site-config';

export type Lang = 'es' | 'en';
const tagOf = (lang?: string) => (lang && LOCALE_BY_LANG[lang]) || LOCALE_TAG;

const cache = new Map<string, Intl.NumberFormat>();
function nf(opts: Intl.NumberFormatOptions, lang?: string): Intl.NumberFormat {
  const tag = tagOf(lang);
  const k = tag + JSON.stringify(opts);
  if (!cache.has(k)) cache.set(k, new Intl.NumberFormat(tag, opts));
  return cache.get(k)!;
}
export function formatMoney(value: number, decimals = 0, lang?: string): string {
  return nf({ style: 'currency', currency: CURRENCY, minimumFractionDigits: decimals, maximumFractionDigits: decimals }, lang).format(value);
}
export function formatNumber(value: number, decimals = 0, lang?: string): string {
  return nf({ minimumFractionDigits: decimals, maximumFractionDigits: decimals }, lang).format(value);
}
export function formatDecimal(value: number, max = 2, lang?: string): string {
  return nf({ maximumFractionDigits: max }, lang).format(value);
}
/** `value` est une fraction (0,05 → « 5,0 % »). */
export function formatPercent(value: number, decimals = 1, lang?: string): string {
  return nf({ style: 'percent', minimumFractionDigits: decimals, maximumFractionDigits: decimals }, lang).format(value).replace(/(\d)\s?%/, '$1 %');
}
/** Taux déjà exprimé en % (3,247 → « 3,247 % »), espace insécable dans toutes les langues. */
export function tasa(x: number, lang?: string, d = 3): string {
  return `${formatNumber(x, d, lang)} %`;
}
const PTS: Record<string, [string, string]> = { es: ['punto', 'puntos'], en: ['point', 'points'] };
/** Écart signé en points de pourcentage (« +0,293 puntos »). */
export function pts(x: number, lang = 'es', d = 3): string {
  const w = PTS[lang] ?? PTS.en;
  const s = x > 0 ? '+' : x < 0 ? '−' : '';
  return `${s}${formatNumber(Math.abs(x), d, lang)} ${Math.abs(x) === 1 ? w[0] : w[1]}`;
}
/** Mois AAAA-MM en toutes lettres : « septiembre de 2026 », « setembro de 2026 », « September 2026 ». */
export function mesLargo(ym: string, lang = 'es'): string {
  const [y, m] = ym.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString(tagOf(lang), { month: 'long', year: 'numeric', timeZone: 'UTC' });
}
/** Mois court pour les tableaux et axes : « sept. 2026 », « set. 2026 », « Sep 2026 ». */
export function mesCorto(ym: string, lang = 'es'): string {
  const [y, m] = ym.split('-').map(Number);
  const mm = new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString(tagOf(lang), { month: 'short', timeZone: 'UTC' });
  return `${mm} ${y}`;
}
export function parseLocaleNumber(input: string): number {
  const cleaned = input.replace(/[^\d.,-]/g, '');
  const lastComma = cleaned.lastIndexOf(','), lastDot = cleaned.lastIndexOf('.');
  let s = cleaned;
  if (lastComma > lastDot) s = cleaned.replace(/\./g, '').replace(',', '.');
  else if (/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(cleaned)) s = cleaned.replace(/\./g, '');
  else s = cleaned.replace(/,/g, '');
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}
/** Date écrite dans la langue de la page, fuseau UTC forcé. */
export function displayDate(iso: string, langTag: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(langTag, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
