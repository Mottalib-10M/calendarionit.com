import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/* 2027: holidays computed by the engine (Law 51 of 1983, Law 2578 of 2026), Sunday premium of Law 2466 of 2025
   (params nomina.dominical). DIAN calendar, UVT and 2027 minimum wage not published on 22/11/2026: the page says so. */
const habiles = (h: Helpers, y: number) => { let n = 0; for (let d = `${y}-01-01`; d <= `${y}-12-31`; d = h.M.addDays(d, 1)) if (h.M.esHabil(d)) n++; return n; };
const lunes = (h: Helpers, y: number) => h.M.festivos(y).filter((f) => new Date(`${f.fecha}T00:00:00Z`).getUTCDay() === 1).length;
const pascua27 = (h: Helpers) => h.M.addDays(h.M.festivos(2027).find((f) => f.id === 'viernes_santo')!.fecha, 2);

export default defineText({
  slug: 'next-year-calendar-colombia',
  nav: '2027 calendar',
  card: 'Public holidays, business days and the Sunday premium of 2027, and what DIAN has not published yet.',
  title: 'Colombia 2027 vs 2026 calendar: holidays and pay premiums',
  description: 'Colombia 2027 vs 2026 calendar: the 19 public holidays of 2027 with their Monday shifts, business days, the 100% Sunday premium from July and what DIAN owes.',
  h1: 'Colombia in 2027: the calendar already known',
  intro: 'Pick 2027 in the counter to list the holidays and count business days; below, what changes from 2026 and what is still unpublished.',
  resume: (h) => `Part of Colombia's 2027 calendar is already fixed by law and part is missing. The fixed part is the public holidays: Law 51 of 1983 and Law 2578 of 2026 give ${h.M.festivos(2027).length} days, ${lunes(h, 2027)} of them on a Monday, with Easter Sunday on ${h.date(pascua27(h))}, which leaves ${habiles(h, 2027)} business days against ${habiles(h, 2026)} in 2026. The Sunday and holiday premium is fixed too: Law 2466 of 2025 raises it from ${h.pct(h.M.recargoDominical('2027-06-30'))} to ${h.pct(h.M.recargoDominical('2027-07-01'))} on 1 July 2027, while the working week stays at ${h.M.jornadaSemanal('2027-01-01')} hours. What is missing, as of 22 November 2026, is DIAN's 2027 tax calendar, the 2027 UVT and the 2027 minimum wage, all published in December. This page does not project those figures; it will switch to them the day they appear in an official text.`,
  faqs: (h) => [
    { q: 'How many public holidays does Colombia have in 2027?', a: `${h.M.festivos(2027).length}, the same as in 2026: the eighteen of Law 51 of 1983 plus the Virgin of Chiquinquirá holiday created by Law 2578 of 2026. ${lunes(h, 2027)} fall on a Monday, either moved there by the Emiliani law or by the calendar itself. The counter above lists them with their original date.` },
    { q: 'What is the Sunday premium in Colombia in 2027?', a: `${h.pct(h.M.recargoDominical('2027-06-30'))} until 30 June 2027 and ${h.pct(h.M.recargoDominical('2027-07-01'))} from 1 July 2027, under Law 2466 of 2025. It is added to the ordinary hourly rate for each hour worked on a Sunday or public holiday, before any night or overtime premium that also applies to the same hours.` },
    { q: 'When does DIAN publish the 2027 tax calendar?', a: 'Usually in December, in the decree or resolution that sets the deadlines of the year. Decree 2229 of 2023 keeps its business-day rules for the following years, so the shape of the calendar does not change, but the exact dates only count once DIAN publishes them. This site will load them that day.' },
    { q: 'Is the 2027 UVT known yet?', a: 'Not as of 22 November 2026. DIAN sets it each year by resolution before 1 January, using the price index variation that article 868 of the Tax Statute requires. The figures going around are third-party calculations; this site will use the one in the resolution, not an estimate of it.' },
  ],
  body: (h) => `
<h2>The 2027 calendar next to 2026</h2>
${h.table(['', '2026', '2027'], [
  ['Public holidays', String(h.M.festivos(2026).length), String(h.M.festivos(2027).length)],
  ['Holidays on a Monday', String(lunes(h, 2026)), String(lunes(h, 2027))],
  ['Business days (Monday to Friday, holidays excluded)', String(habiles(h, 2026)), String(habiles(h, 2027))],
  ['Sunday and holiday premium', `${h.pct(h.M.recargoDominical('2026-01-01'))}, ${h.pct(h.M.recargoDominical('2026-07-01'))} from July`, `${h.pct(h.M.recargoDominical('2027-01-01'))}, ${h.pct(h.M.recargoDominical('2027-07-01'))} from July`],
  ['Maximum working week', `${h.M.jornadaSemanal('2026-01-01')} h, ${h.M.jornadaSemanal('2026-07-15')} h from 15 July`, `${h.M.jornadaSemanal('2027-01-01')} h`],
  ['DIAN calendar, UVT, minimum wage', 'published', 'not yet published'],
], 'Holidays and business days computed under Law 51 of 1983 and Law 2578 of 2026; premium and working week under Law 2466 of 2025 and Law 2101 of 2021.', ['l', 'r', 'r'])}
<h2>What changes in payroll</h2>
<p>The jump in the Sunday premium is the 2027 change that can already be worked out. Someone who works a Sunday in July 2027 earns a premium of ${h.pct(h.M.recargoDominical('2027-07-01'))} on top of the ordinary hour, twice that hour in total, against ${h.pct(h.M.recargoDominical('2027-06-30'))} in June. The ${h.a('recargos', 'premiums and overtime calculator')} applies the rate for the date you choose. The ${h.M.jornadaSemanal('2027-01-01')}-hour week completes the reduction of Law 2101 of 2021: there is no further step in 2027.</p>
<h2>What DIAN and the cities still owe</h2>
<p>The 2027 dates for ${h.a('renta-pn', 'income tax')}, VAT and withholding depend on the calendar DIAN publishes, and each city's ICA on its own December resolution. The 2027 minimum wage and transport allowance come by decree at the end of the year; severance, the service bonus and the filing thresholds move with them. Until then the tables of this site stay on 2026 and say so.</p>
`,
});
