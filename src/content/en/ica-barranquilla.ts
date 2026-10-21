import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

const data = (h: Helpers) => {
  const c = h.M.ciudad('barranquilla')!;
  const reg = (id: string) => c.regimenes.find((r) => r.id === id)!;
  const large = reg('gran'), ordinary = reg('comun'), pref = reg('preferencial');
  const row = (r: typeof large, p: string) => r.filas.find((f) => f.periodo === p)!.fechas;
  return { large, ordinary, pref, row, y25: row(large, 'AG2025'), y26: row(large, 'AG2026') };
};
const ORDER = ['0', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
const span = (h: Helpers, a: string, b: string) => (a.slice(0, 7) === b.slice(0, 7) ? `${h.date(a).replace(/, \d{4}$/, '')} to ${Number(b.slice(8))}, ${b.slice(0, 4)}` : `${h.date(a)} to ${h.date(b)}`);

export default defineText({
  slug: 'barranquilla-ica-tax',
  nav: 'ICA Barranquilla',
  card: 'Annual return in February, monthly or two-month withholding depending on the regime, and fixed-date payments for the preferential regime.',
  title: 'Barranquilla ICA tax 2026: annual return and withholding',
  description: 'Barranquilla ICA tax 2026: annual return in February by last NIT digit, monthly or two-month withholding returns by regime, and 2027 dates already published.',
  h1: 'Barranquilla ICA tax: 2026 deadlines and February 2027',
  intro: 'Barranquilla puts the February annual return and the whole year of withholding in a single calendar.',
  resume: (h) => {
    const { y25, y26, row, large, ordinary, pref } = data(h);
    const oct = row(large, '2026-10'), p5 = row(ordinary, '2026-B5');
    return `In Barranquilla, every industry and commerce tax (ICA) payer files one annual return in February, scheduled by the last digit of the NIT. The return for the 2025 tax year was due ${span(h, y25['0'], y25['1'])}, under Resolution DSH 001 of 2024; the one for the 2026 tax year is due ${span(h, y26['0'], y26['1'])}, under Resolution DSH 003 of 2025 from the District Treasury. What varies by regime is ICA withholding and self-withholding. Large taxpayers file it monthly, the ordinary regime (régimen común) every two months, and the simplified preferential regime pays its self-withholding every two months on a single date for everyone. For example, a large taxpayer's October 2026 return is due ${span(h, oct['0'], oct['1'])}, the ordinary regime's fifth period ${span(h, p5['0'], p5['1'])}, and the preferential payment by ${h.date(row(pref, '2026-B5').todos)}. The dates were read from the official calendar web page, because the resolution PDF could not be opened. There is no early-payment discount on ICA.`;
  },
  faqs: (h) => {
    const { row, large, ordinary, pref } = data(h);
    const dec = row(large, '2026-12'), p6 = row(ordinary, '2026-B6');
    return [
      { q: 'Why do NITs ending in 9 and 8 share a January 2027 deadline?', a: `Because that is how the District Treasury's published table reads. For December 2026 (large taxpayers) and for November and December 2026 (ordinary regime), digits 9 and 8 are both due ${h.date(dec['9'])}, while 0 is due ${h.date(p6['0'])}. No official publication has changed it, so this page shows it as published. Filing a day early removes any doubt.` },
      { q: 'Does the simplified preferential regime file an ICA return in Barranquilla?', a: `Yes, it files the annual return in February on the same digit schedule as everyone else. The difference is self-withholding: instead of a monthly or two-month return, it pays every two months on one date for all NITs, such as ${h.date(row(pref, '2026-B6').todos)} for November and December 2026. Choosing that regime in the calculator shows both obligations.` },
      { q: 'Does this site cover ICA in Cartagena?', a: `Not yet. The official decree setting Cartagena's deadlines could not be read from an official source, and this site only publishes dates copied from the act that sets them. For now it covers Bogotá, Medellín, Cali, Barranquilla and Bucaramanga, plus the national DIAN calendar.` },
    ];
  },
  body: (h) => {
    const { y25, y26 } = data(h);
    const short = (d: string) => h.date(d).replace(/, \d{4}$/, '');
    const rows = ORDER.map((d) => [d, short(y25[d]), short(y26[d])]);
    return `
<h2>Using the calculator</h2>
<p>Barranquilla is already selected: enter the last digit of your NIT and choose large taxpayer, ordinary or simplified preferential regime. Each comes with its own withholding rhythm, and the calendar button downloads every date.</p>
<h2>Annual return: February 2026 and February 2027</h2>
${h.table(['Last digit', '2025 tax year (due 2026)', '2026 tax year (due 2027)'], rows, 'Resolutions DSH 001 of 2024 and DSH 003 of 2025, as shown on the official tax calendar page', ['l', 'l', 'l'])}
<p>Barranquilla has already fixed the return for the 2026 tax year, which Medellín, Cali and Bucaramanga have not. Digit 0 opens the window and digit 1 closes it.</p>
<h2>Three withholding rhythms</h2>
<ul>
<li>Large taxpayers: monthly return for withholding and self-withholding, by last digit.</li>
<li>Ordinary regime: two-month return for withholding and self-withholding, by last digit.</li>
<li>Simplified preferential: two-month payment of self-withholding, on one date.</li>
</ul>
<p>Who belongs to each regime is set by the District Tax Statute, which this page does not reproduce. For national withholding see the ${h.a('retencion-dian', 'DIAN withholding calendar')}, and for other cities ${h.a('ica-bucaramanga', 'Bucaramanga ICA')} or ${h.a('ica-bogota', 'Bogotá ICA')}.</p>`;
  },
});
