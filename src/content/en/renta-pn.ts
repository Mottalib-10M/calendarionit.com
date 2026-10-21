import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Individual income tax return (tax year 2025): one due date per pair of last two NIT digits. */
const filas = (h: Helpers) => Object.entries(h.M.tabla('renta_pn')[0].fechas);
const mes = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
const EJ = '1020345645';

export default defineText({
  slug: 'individual-income-tax-dates',
  nav: 'Individual income tax',
  card: 'Your last day to file the Colombian personal income tax return for tax year 2025, from the last two digits of your NIT.',
  title: 'Individual income tax deadlines Colombia 2026 by NIT',
  description: 'Individual income tax deadlines in Colombia for 2026: your filing day from the last two NIT digits, between August 12 and October 26, for tax year 2025.',
  h1: 'Individual income tax deadlines in Colombia, 2026',
  intro: 'Type the last two digits of your NIT and get the exact day your income tax return (declaración de renta) is due.',
  resume: (h) => {
    const f = filas(h), fechas = f.map((x) => x[1]).sort();
    const ej = h.M.vencimientos({ nit: EJ, tipo: 'pn', iva: 'no', retenedor: false, rst: false, activos: false, patrimonio: false, precios: false, ciudad: '' })[0];
    const R = h.P.renta;
    return `In 2026, individuals in Colombia file and pay their income tax return (declaración de renta) for tax year 2025 on a single day set by the last two digits of their NIT, ignoring the check digit after the hyphen. The window runs from ${h.date(fechas[0])} to ${h.date(fechas[fechas.length - 1])} and is split into ${f.length} pairs, from 01-02 to 99-00. The rules come from Decree 2229 of 2023, which counts deadlines in business days, and the dates from the DIAN 2026 calendar, already adjusted for the civic day of April 17 (Decree 500 of 2024) and the new holiday on Monday, July 13 (Law 2578 of 2026). A NIT ending in ${EJ.slice(-2)} belongs to pair ${ej.clave} and is due on ${h.date(ej.fecha)}. You must file if you crossed any 2025 threshold, such as ${h.cop(R.ingresos_cop)} of gross income or ${h.cop(R.patrimonio_cop)} of gross assets. Dates for tax year 2026, filed in 2027, are yet to be published.`;
  },
  faqs: (h) => {
    const f = h.M.tabla('renta_pn')[0].fechas;
    return [
      { q: 'Which NIT digits set my personal income tax deadline in Colombia?', a: `The last two digits before the hyphen. The single digit after the hyphen is the check digit (dígito de verificación) and does not count. With NIT 1.020.345.645 the pair is 45-46, due on ${h.date(f['45-46'])}. For most individuals the NIT is simply their ID number, so the RUT certificate shows it in full.` },
      { q: 'Did the July 2026 holiday move any individual filing dates?', a: `The new holiday on Monday, July 13, 2026 shifted July deadlines for companies, VAT and withholding returns. The individual filing window only opens on ${h.date(f['01-02'])}, and every date on this page is taken from the DIAN calendar after all the 2026 adjustments, so nothing needs correcting by hand.` },
      { q: 'When will the 2027 personal income tax dates be known?', a: 'They cover tax year 2026 and are yet to be published. Decree 2229 of 2023 keeps its business-day rules for later years, but DIAN has not released the 2027 calendar with actual dates, and this page does not project them. The table will be updated once the official calendar is out.' },
    ];
  },
  body: (h) => {
    const meses = new Map<string, string[]>();
    for (const [k, d] of filas(h)) { const m = mes(d); meses.set(m, [...(meses.get(m) ?? []), `${k} (${Number(d.slice(8))})`]); }
    const rows = [...meses].map(([m, xs]) => [m, xs.join(', ')]);
    return `
<h2>Using the date finder</h2>
<p>Enter the last two digits of your NIT in the box above, without the check digit. The list sorts your deadlines, highlights the next one and exports them as an .ics file for your calendar.</p>
<h2>Every pair and its day</h2>
${h.table(['Month', 'Digit pair (day of the month)'], rows, 'Filing and payment, tax year 2025, individuals (DIAN 2026 calendar)', ['l', 'l'])}
<p>No deadline falls on a weekend or a holiday. That is why pair 79-80 is due on Friday, ${h.date(h.M.tabla('renta_pn')[0].fechas['79-80'])} and pair 81-82 on Tuesday, ${h.date(h.M.tabla('renta_pn')[0].fechas['81-82'])}, after the Monday holiday of Día de la Raza.</p>
<h2>Before you file</h2>
<p>Check whether you must file at all with the ${h.a('topes', 'filing thresholds')}. If you are on a Colombian payroll, the tax your employer withheld in 2025 is credited against what you owe (see ${h.a('retencion', 'salary withholding')}), and DIAN already holds much of your data through the ${h.a('exogena', 'third-party information')} that banks and employers report.</p>
`;
  },
});
