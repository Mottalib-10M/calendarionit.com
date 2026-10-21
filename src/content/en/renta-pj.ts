import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Corporate income tax (tax year 2025): two instalments by last NIT digit; three for large taxpayers. */
const corto = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const rango = (h: Helpers, f: Record<string, string>) => { const v = Object.values(f).sort(); return `from ${h.date(v[0]).replace(/, \d{4}$/, '')} to ${h.date(v[v.length - 1])}`; };

export default defineText({
  slug: 'corporate-income-tax-dates',
  nav: 'Corporate income tax',
  card: 'Return and instalment dates for Colombian companies and large taxpayers, tax year 2025, by the last NIT digit.',
  title: 'Corporate income tax deadlines Colombia 2026 by NIT',
  description: 'Corporate income tax deadlines in Colombia for 2026: return and first instalment in May, second in July by the last NIT digit, plus large taxpayer dates.',
  h1: 'Corporate income tax deadlines in Colombia, 2026',
  intro: 'The last digit of the company NIT sets the day of the return and of each instalment.',
  resume: (h) => {
    const [d1, c2] = h.M.tabla('renta_pj'), [g1, g2, g3] = h.M.tabla('renta_gc');
    return `Colombian companies file their 2026 corporate income tax return for tax year 2025 and pay it in instalments set by the last digit of the NIT, leaving out the check digit. Companies that are not large taxpayers (grandes contribuyentes) file and pay the first instalment ${rango(h, d1.fechas)}, then pay the second ${rango(h, c2.fechas)}. Large taxpayers pay three times: the first instalment ${rango(h, g1.fechas)}, the return with the second ${rango(h, g2.fechas)}, and the third ${rango(h, g3.fechas)}. The rules come from Decree 2229 of 2023 and the dates from the DIAN 2026 calendar. In July, the new holiday on Monday, July 13 (Law 2578 of 2026) pushed the second instalment back, so NITs ending in 3 to 6 pay ${rango(h, { a: c2.fechas['3'], b: c2.fechas['6'] })}. A company with NIT 900.123.453 files on ${h.date(d1.fechas['3'])}. Dates for tax year 2026 are yet to be published.`;
  },
  faqs: (h) => {
    const [d1, c2] = h.M.tabla('renta_pj');
    return [
      { q: 'Which digit of a company NIT sets its corporate tax deadline?', a: `Only the last digit before the hyphen. For NIT 900.123.453 followed by its check digit, the digit that counts is 3: return and first instalment on ${h.date(d1.fechas['3'])}, second instalment on ${h.date(c2.fechas['3'])}. Individuals use two digits for their own return, but companies use one.` },
      { q: 'Why did some second instalments move to July 14, 2026?', a: `Law 2578 of 2026 created a national holiday on July 9, which in 2026 moved to Monday, July 13. DIAN shifted the deadlines: digit 3 went to ${h.date(c2.fechas['3'])}, and digits 7 to 0 fall ${rango(h, { a: c2.fechas['7'], b: c2.fechas['0'] })}, after the Independence Day holiday of July 20.` },
      { q: 'Are the 2027 corporate tax dates already known?', a: 'No. The return for tax year 2026 is due in 2027, and those dates are yet to be published. Decree 2229 of 2023 keeps its business-day rules for later years, but DIAN has not released a 2027 calendar with actual days, so this page does not guess them. It will be updated when the official calendar appears.' },
    ];
  },
  body: (h) => {
    const [d1, c2] = h.M.tabla('renta_pj');
    const rows = Object.keys(d1.fechas).map((k) => [k, corto(d1.fechas[k]), corto(c2.fechas[k])]);
    return `
<h2>Setting up the finder for your company</h2>
<p>The tool opens as a company with a sample NIT ending in 3: replace it with your own last digit. If the entity also files VAT, withholds tax or pays ICA, tick those boxes to see every deadline in a single list.</p>
<h2>Dates by last digit</h2>
${h.table(['Last digit', 'Return and 1st instalment', '2nd instalment'], rows, 'Companies that are not large taxpayers, tax year 2025 (DIAN 2026 calendar)', ['l', 'l', 'l'])}
<h2>Days that stack up</h2>
<p>For each digit, the May return falls on the same day as the March-April ${h.a('iva', 'VAT return')} and the April ${h.a('retencion-dian', 'withholding return')}. The July instalment lands with the May-June VAT. Between May and June the company also files its ${h.a('exogena', 'third-party information report')}, and a branch or subsidiary operating in the capital follows the separate ${h.a('ica-bogota', 'Bogotá ICA calendar')}.</p>
`;
  },
});
