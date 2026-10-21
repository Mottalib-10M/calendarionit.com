import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

const data = (h: Helpers) => {
  const c = h.M.ciudad('cali')!;
  const reg = (id: string) => c.regimenes.find((r) => r.id === id)!;
  return { c, bim: reg('bimestral'), high: reg('anual_alto'), mid: reg('anual_medio'), low: reg('anual_bajo') };
};
const PAIRS = ['1-2', '3-4', '5-6', '7-8', '9-0'];
/** First UVT figure in the regime name (« ... 131,952 UVT ... »). */
const uvt = (s: string) => `${s.match(/\d[\d,]+/)![0]} UVT`;
/** « March 2 to 6, 2026 » when both dates fall in the same month. */
const span = (h: Helpers, a: string, b: string) => (a.slice(0, 7) === b.slice(0, 7) ? `${h.date(a).replace(/, \d{4}$/, '')} to ${Number(b.slice(8))}, ${b.slice(0, 4)}` : `${h.date(a)} to ${h.date(b)}`);
const short = (h: Helpers, d: string) => h.date(d).replace(/, \d{4}$/, '');

export default defineText({
  slug: 'cali-ica-tax',
  nav: 'ICA Cali',
  card: 'Three annual calendars by income, two-month filing for large taxpayers and the two periods Cali moved in 2026.',
  title: 'Cali ICA tax 2026: deadlines by income, NIT and period',
  description: 'Cali ICA tax 2026: three annual filing windows by income in UVT, two-month returns for large taxpayers and withholding, and periods 3 and 4 moved during 2026.',
  h1: 'Cali ICA tax: 2026 calendar and this year’s changes',
  intro: 'In Cali, your annual ICA deadline depends first on how much you earned in the city, then on your NIT.',
  resume: (h) => {
    const { high, mid, low, bim } = data(h);
    const p3 = bim.filas[2].fechas, p4 = bim.filas[3].fechas;
    return `Cali's industry and commerce tax (ICA) for the 2025 tax year was filed and paid in 2026 in three windows, chosen by net income earned in the city (Resolution 4131.010.21.0607 of 2025, art. 2). Businesses with ${uvt(high.nombre.en)} or more filed ${span(h, high.filas[0].fechas['1-2'], high.filas[0].fechas['9-0'])}; from ${uvt(mid.nombre.en)}, ${span(h, mid.filas[0].fechas['1-2'], mid.filas[0].fechas['9-0'])}; below that, ${span(h, low.filas[0].fechas['1'], low.filas[0].fechas['0'])}. Large district taxpayers (Agreement 0541 of 2022) instead file the 2026 tax every two months, on the same dates as ICA withholding. Two of those periods moved. Resolution 0692 of 2026 pushed the third to ${span(h, p3['1-2'], p3['9-0'])} because of the new Monday July 13 holiday (Law 2578 of 2026). After the earthquake of August 10, Resolution 0785 of 2026 moved the fourth to ${span(h, p4['1-2'], p4['9-0'])}. Cali offers no early-payment discount on ICA.`;
  },
  faqs: (h) => {
    const { c, bim } = data(h);
    const p6 = bim.filas[5].fechas;
    return [
      { q: 'Which UVT value sets the income bands for Cali ICA?', a: `The 2025 UVT, ${h.cop(h.P.uvt['2025'])} under DIAN Resolution 000193 of 2024, as stated in the first paragraph of article 2 of Resolution 0607 of 2025. Only net income earned in Cali during 2025 counts, not income from the whole country: divide it by that UVT and compare the result with the two thresholds.` },
      { q: 'Where can I read Cali Resolution 0785 of 2026?', a: `It has not been posted on the Treasury's website. The change to the fourth period is known from the city's official bulletin of August 27, 2026 and from the official calendar updated in September, both showing October 5 to 9. This page takes the dates from those two official publications; if anything differs, the ${c.autoridad.en} has the final word.` },
      { q: 'When is the last 2026 period due in Cali?', a: `The sixth period, November and December 2026, falls due from ${h.date(p6['1-2'])} for NITs ending in 1 and 2 to ${h.date(p6['9-0'])} for those ending in 9 and 0. It applies to large taxpayers and to ICA withholding agents. The 2027 calendar has not been issued yet.` },
    ];
  },
  body: (h) => {
    const { high, mid, low, bim } = data(h);
    const annual = PAIRS.map((p) => { const [x, y] = p.split('-'); return [p.replace('-', ' and '), short(h, high.filas[0].fechas[p]), short(h, mid.filas[0].fechas[p]), `${short(h, low.filas[0].fechas[x])} and ${Number(low.filas[0].fechas[y].slice(8))}`]; });
    const months = ['Jan to Feb', 'Mar to Apr', 'May to Jun', 'Jul to Aug', 'Sep to Oct', 'Nov to Dec'];
    const note = ['', '', 'Res. 0692 of 2026', 'Res. 0785 of 2026', '', ''];
    const periods = bim.filas.map((f, i) => [months[i], span(h, f.fechas['1-2'], f.fechas['9-0']), note[i]]);
    return `
<h2>Using the calculator</h2>
<p>With Cali preselected, choose your annual income band or the two-month large-taxpayer regime and enter the last digit of your NIT; the ReteICA box adds the withholding dates.</p>
<h2>Annual return for the 2025 tax year, by income</h2>
${h.table(['Digits', high.nombre.en.replace('Annual, ', ''), mid.nombre.en.replace('Annual, ', ''), low.nombre.en.replace('Annual, ', '')], annual, '2026 dates (Resolution 4131.010.21.0607 of 2025, art. 2). In the lowest band each digit has its own day', ['l', 'l', 'l', 'l'])}
<p>The biggest earners file first. Filing and payment share the same deadline.</p>
<h2>Two-month periods in 2026: large taxpayers and withholding</h2>
${h.table(['Period', 'From NIT 1 and 2 to 9 and 0', 'Changed by'], periods, 'Resolution 0607 of 2025, arts. 3 and 4, as amended', ['l', 'l', 'l'])}
<p>The third period originally fell in the week of the holiday created by Law 2578 of 2026 (see the ${h.a('festivos', '2026 public holidays')}); the fourth fell in September. Compare with ${h.a('ica-medellin', 'Medellín ICA')}.</p>`;
  },
});
