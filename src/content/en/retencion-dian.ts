import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';
import { periodo } from '../../lib/etiquetas';

/** Monthly withholding tax return 2026, by last NIT digit. */
const corto = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { day: 'numeric', month: 'short', ...(iso.startsWith('2026') ? {} : { year: 'numeric' }), timeZone: 'UTC' });
const rango = (h: Helpers, f: Record<string, string>) => { const v = Object.values(f).sort(); return `${h.date(v[0]).replace(/, \d{4}$/, '')} to ${h.date(v[v.length - 1])}`; };
const mes = (h: Helpers, p: string) => h.M.tabla('retencion').find((x) => x.periodo === p)!;

export default defineText({
  slug: 'withholding-tax-return-dates',
  nav: 'Withholding tax returns',
  card: 'The twelve monthly withholding tax return deadlines in Colombia for 2026, by the last NIT digit.',
  title: 'Withholding tax return dates Colombia 2026, monthly by NIT',
  description: 'Withholding tax return dates in Colombia for 2026: the monthly filing day by last NIT digit, from February 2026 to January 2027, with every holiday adjustment.',
  h1: 'Monthly withholding tax return dates in Colombia, 2026',
  intro: 'Every withholding agent files twelve returns a year, one per month, on the day its NIT dictates.',
  resume: (h) => {
    const t = h.M.tabla('retencion'), mar = mes(h, '2026-03'), jun = mes(h, '2026-06');
    return `Any company or person registered as a withholding agent (agente de retención) in Colombia files and pays a withholding tax return (retención en la fuente) every month: ${t.length} returns for 2026, each on a day set by the last digit of the NIT, check digit excluded. January withholding is due ${rango(h, t[0].fechas)}, and December withholding ${rango(h, t[t.length - 1].fechas)}. The rules are those of Decree 2229 of 2023 and the dates come from the DIAN 2026 calendar. Two adjustments broke the usual pattern. The civic day of Friday, April 17 (Decree 500 of 2024) left March withholding for digit 4 on ${h.date(mar.fechas['4'])} and pushed digit 5 to ${h.date(mar.fechas['5'])}. The new holiday on Monday, July 13 (Law 2578 of 2026) moved June withholding for digits 3 to 6 to ${rango(h, { a: jun.fechas['3'], b: jun.fechas['6'] })}. Returns for months of 2027 have dates yet to be published.`;
  },
  faqs: (h) => {
    const mar = mes(h, '2026-03'), dic = mes(h, '2026-12');
    return [
      { q: 'Why was the March 2026 withholding return for digit 5 due on April 20?', a: `Friday, April 17, 2026 was a civic day under Decree 500 of 2024, and DIAN did not count it as a business day. Digit 4 stayed on ${h.date(mar.fechas['4'])}, digit 5 moved to Monday, ${h.date(mar.fechas['5'])}, and digits 6 to 0 each moved one business day later.` },
      { q: 'Is the December 2026 withholding return filed in 2027?', a: `Yes, ${rango(h, dic.fechas)}, by last NIT digit. Those days belong to the 2026 tax calendar that DIAN has already published, so they are final. The deadlines for withholding made during 2027 are the ones still to be published.` },
      { q: 'Is this the same withholding taken from my salary?', a: `It is the other end of the same process. Each month your employer deducts withholding from your pay using the article 383 table of the Tax Code, explained in ${h.a('retencion', 'salary withholding')}, and then files and pays it to DIAN on the date shown here, together with any other withholding made that month.` },
    ];
  },
  body: (h) => {
    const t = h.M.tabla('retencion');
    const rows = t.map((x) => [periodo(x.periodo, 'en'), corto(x.fechas['1']), corto(x.fechas['5']), corto(x.fechas['0'])]);
    const sep = mes(h, '2026-09');
    return `
<h2>Using the tool</h2>
<p>The withholding agent box is already ticked, with a sample NIT ending in 3. Type your own last digit to list the twelve deadlines with the next one highlighted; tick VAT as well if your company files it.</p>
<h2>Month by month</h2>
${h.table(['Month withheld', 'Digit 1', 'Digit 5', 'Digit 0'], rows, 'Monthly withholding return and payment (DIAN 2026 calendar)', ['l', 'l', 'l', 'l'])}
<p>The ten digits are spread over consecutive business days, so a Monday holiday shows up as a gap. For September withholding, digit 1 is due on Friday, ${h.date(sep.fechas['1'])} and digit 2 on Tuesday, ${h.date(sep.fechas['2'])}, after the October 12 holiday.</p>
<h2>Shared deadlines</h2>
<p>Withholding for each even month is due on the same day as the two-month ${h.a('iva', 'VAT return')} that the month closes, and April withholding coincides with the ${h.a('renta-pj', 'corporate income tax')} return.</p>
`;
  },
});
