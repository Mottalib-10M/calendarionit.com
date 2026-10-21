import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';
import { periodo } from '../../lib/etiquetas';

/** VAT (IVA) 2026, two-month and four-month periods, by last NIT digit. */
const corto = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { day: 'numeric', month: 'short', ...(iso.startsWith('2026') ? {} : { year: 'numeric' }), timeZone: 'UTC' });
const rango = (h: Helpers, f: Record<string, string>) => { const v = Object.values(f).sort(); return `${h.date(v[0]).replace(/, \d{4}$/, '')} to ${h.date(v[v.length - 1])}`; };
const mismaFecha = (h: Helpers) => h.M.tabla('iva_bim').filter((b) => h.M.tabla('retencion').some((r) => JSON.stringify(r.fechas) === JSON.stringify(b.fechas))).length;

export default defineText({
  slug: 'vat-return-dates',
  nav: 'VAT (IVA) returns',
  card: 'The six two-month and three four-month VAT deadlines in Colombia for 2026, by the last NIT digit.',
  title: 'VAT return dates Colombia 2026: two-month IVA by NIT',
  description: 'VAT return dates in Colombia for 2026: the six two-month IVA deadlines by last NIT digit, the three four-month ones, and the July shift due to the new holiday.',
  h1: 'Colombian VAT (IVA) return dates for 2026',
  intro: 'Six two-month periods, one day per NIT digit, including the January 2027 dates already published.',
  resume: (h) => {
    const b = h.M.tabla('iva_bim'), c = h.M.tabla('iva_cuat');
    const lista = b.map((x) => `${periodo(x.periodo, 'en')}: ${rango(h, x.fechas)}`).join('; ');
    return `Businesses registered for VAT (IVA) in Colombia on a two-month cycle file and pay six times in 2026, on a day set by the last digit of the NIT, check digit excluded. The windows are: ${lista}. Taxpayers on the four-month cycle have ${c.length} deadlines, which match the March-April, July-August and November-December windows. The rules come from Decree 2229 of 2023 and the dates from the DIAN 2026 calendar. In July, the new holiday on Monday, July 13 (Law 2578 of 2026) pushed digits 3 to 6 back to ${h.date(b[2].fechas['3'])} and the following days. The January 2027 deadlines belong to the 2026 calendar and are official; the 2027 periods are yet to be published.`;
  },
  faqs: (h) => {
    const b = h.M.tabla('iva_bim');
    return [
      { q: 'How do I know whether my company files VAT every two or four months?', a: 'The cycle depends on gross income in the previous year, under the Tax Code, and it is recorded with your VAT responsibility in the RUT. The tool does not infer it: pick two-month or four-month in the VAT selector and the list adjusts. If you are unsure, ask whoever keeps your RUT up to date before the first deadline.' },
      { q: 'When is the November-December 2026 VAT return due?', a: `In January 2027, ${rango(h, b[5].fechas)}, depending on the last NIT digit. Although they fall in 2027, these dates are part of the 2026 calendar DIAN has already published, so they are final. What remains to be published are the periods of 2027 itself.` },
      { q: 'Do VAT and withholding returns share a due date?', a: `${mismaFecha(h) === b.length ? 'Yes, for all six periods of 2026' : `Yes, for ${mismaFecha(h)} of the ${b.length} periods of 2026`}: the VAT return is due on the same day as the withholding return for the month that closes the period. January-February VAT and February withholding, for example, are both due ${rango(h, b[0].fechas)}. It is simpler to prepare both together.` },
    ];
  },
  body: (h) => {
    const b = h.M.tabla('iva_bim'), c = h.M.tabla('iva_cuat');
    const rows = b.map((x) => { const q = c.find((y) => y.fechas['1'] === x.fechas['1']); return [periodo(x.periodo, 'en'), corto(x.fechas['1']), corto(x.fechas['0']), q ? periodo(q.periodo, 'en') : '']; });
    return `
<h2>Reading your date</h2>
<p>The tool opens on two-month VAT with a sample NIT ending in 3. Replace the digit with yours, and switch the VAT selector to four-month if that is your cycle.</p>
<h2>Two-month and four-month periods</h2>
${h.table(['Period', 'Digit 1', 'Digit 0', 'Four-month period, same dates'], rows, 'First and last day of each window; digits 2 to 9 fall on the business days in between', ['l', 'l', 'l', 'l'])}
<p>The May-June window is the longest: digit 1 is due on ${h.date(b[2].fechas['1'])} and digit 0 only on ${h.date(b[2].fechas['0'])}, because the July 13 and July 20 holidays sit in between.</p>
<h2>Deadlines nearby</h2>
<p>The second ${h.a('renta-pj', 'corporate income tax')} instalment falls on the same day as the May-June VAT, and the monthly ${h.a('retencion-dian', 'withholding return')} shares a day with each period. Businesses in the ${h.a('simple', 'Simple Tax Regime')} do not follow this table: they file one consolidated annual VAT return.</p>
`;
  },
});
