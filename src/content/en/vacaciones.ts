import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Last day off and return day, Monday to Friday, national holidays excluded. */
const leave = (h: Helpers, first: string) => {
  const n = h.P.nomina.vacaciones_dias_habiles;
  const last = h.M.sumarHabiles(h.M.addDays(first, -1), n);
  return { last, back: h.M.sumarHabiles(last, 1), span: h.M.diffDays(first, last) + 1 };
};

export default defineText({
  slug: 'paid-holidays-vacaciones',
  nav: 'Paid holidays',
  card: 'Fifteen working days a year: when you are back given the 2026 holidays, and what unused days are worth.',
  title: 'Paid holidays 2026 in Colombia: vacaciones and payout',
  description: 'Paid holidays 2026 in Colombia: 15 working days per year (Labour Code art. 186), the return date given holidays, and cash for unused days when the job ends.',
  h1: 'Paid holidays (vacaciones): working days, return date and payout',
  intro: 'Fifteen working days are not fifteen calendar days: Colombia’s public holidays stretch the break.',
  resume: (h) => {
    const N = h.P.nomina;
    const p = leave(h, '2026-12-14');
    const v = h.M.vacacionesValor(N.smmlv, h.M.vacacionesDias(180));
    return `Employees in Colombia are entitled to ${N.vacaciones_dias_habiles} consecutive working days of paid holiday for each year of service, under article 186 of the Labour Code. Because the count is in working days, Sundays and the ${h.M.festivos(2026).length} public holidays of 2026 do not eat into the break; the list grew this year with Monday July 13, added by Law 2578 of 2026. On a Monday-to-Friday schedule, leave starting ${h.dia('2026-12-14')} runs to ${h.dia(p.last)}, with the return on ${h.dia(p.back)}: ${p.span} calendar days. Holiday pay is the ordinary salary; the transport allowance is left out, which is the usual practice because no travel to work takes place. When the job ends, Law 995 of 2005 requires cash for days earned and not taken, pro rata to the time served: six months on the ${h.cop(N.smmlv)} minimum wage (Decree 1469 of 2025) earn ${h.num(h.M.vacacionesDias(180), 1)} days, worth ${h.cop(v)}, on the 360-day commercial year.`;
  },
  faqs: (h) => {
    const N = h.P.nomina;
    return [
      { q: 'Is Saturday counted as a working day of holiday?', a: `It depends on how your working week is spread, and there is no single rule for every schedule. The table on this page assumes a Monday-to-Friday week. If your contract or the company's internal rules make Saturday a working day, the return date may come sooner, so check with payroll before booking travel.` },
      { q: 'What are unused holidays worth when I resign?', a: `Fifteen days of salary for every 360 days worked, pro rata, minus the days already taken (Law 995 of 2005). With a salary of ${h.cop(3000000)} and 270 days since your last holiday, you have earned ${h.num(h.M.vacacionesDias(270), 2)} days, worth ${h.cop(h.M.vacacionesValor(3000000, h.M.vacacionesDias(270)))}. The amount is the same whether you resign or are dismissed.` },
      { q: 'Is the transport allowance added to holiday pay?', a: `Usually not. The ${h.cop(N.auxilio)} allowance (Decree 1470 of 2025) covers the commute, and there is no commute while on holiday. Law 1 of 1963 adds it to the base of statutory benefits, but holidays are paid rest rather than a benefit. This is a widespread reading, not a written rule, and the calculator follows it.` },
    ];
  },
  body: (h) => {
    const starts = ['2026-03-30', '2026-07-06', '2026-09-07', '2026-11-09', '2026-12-14'];
    const rows = starts.map((d) => { const p = leave(h, d); return [h.dia(d), h.dia(p.last), h.dia(p.back), String(p.span)]; });
    return `
<h2>Using the calculator</h2>
<p>Enter your salary and the period worked since your last holiday. You get the days earned and their cash value, without the transport allowance.</p>
<h2>Return date by first day off</h2>
${h.table(['First day off', 'Last day off', 'Back at work', 'Calendar days'], rows, `${h.P.nomina.vacaciones_dias_habiles} working days, Monday-to-Friday week, national public holidays`, ['l', 'l', 'l', 'r'])}
<p>With no holiday in the way, as in September, fifteen working days take ${leave(h, '2026-09-07').span} calendar days. Holy Week, July and December stretch further because the public holidays are added to the break. The full list is on the ${h.a('festivos', '2026 public holidays')} page.</p>
<h2>Cash for unused days when the job ends</h2>
<p>Under Law 995 of 2005, pending days are paid out at ${h.P.nomina.vacaciones_dias_habiles} days per 360 worked, pro rata, each valued at salary ÷ 30. The amount is part of the ${h.a('liquidacion', 'final settlement')}, alongside the ${h.a('prima', 'service bonus')} and severance.</p>
<ul>
<li>Base: the ordinary salary, without the transport allowance.</li>
<li>Days: those earned since the start date, minus those already taken.</li>
</ul>`;
  },
});
