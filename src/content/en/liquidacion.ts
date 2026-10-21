import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Worked case: open-ended contract, fixed salary, 15 holiday days already taken. */
const START = '2024-02-01', END = '2026-09-30', PAY = 2500000, TAKEN = 15;
const run = (h: Helpers, dismissed: boolean) => h.M.liquidacion({ salario: PAY, ingreso: START, retiro: END, despido: dismissed, contrato: 'indefinido', vacTomadas: TAKEN });

export default defineText({
  slug: 'final-settlement-calculator',
  nav: 'Final settlement',
  card: 'What an employer in Colombia owes when a job ends: severance, interest, bonus, holidays and dismissal pay.',
  title: 'Final settlement 2026 in Colombia: liquidación calculator',
  description: 'Final settlement 2026 in Colombia: the liquidación with severance, 12 % interest, service bonus, unused holidays and Labour Code art. 64 dismissal pay.',
  h1: 'Final settlement (liquidación) in Colombia',
  intro: 'Enter the salary and the dates, and see each item of the settlement on its own line.',
  resume: (h) => {
    const N = h.P.nomina, q = run(h, false), d = run(h, true);
    return `When an employment contract ends in Colombia, the employer pays a final settlement, the liquidación. It always includes the current year's severance (cesantías, Labour Code art. 249), ${h.pct(N.intereses_cesantias)} yearly interest on that severance, the pro rata service bonus for the half-year (prima, art. 306) and cash for holidays earned but not taken (Law 995 of 2005). Dismissal without just cause adds the compensation set by art. 64. In 2026 the minimum wage is ${h.cop(N.smmlv)} (Decree 1469 of 2025) and the transport allowance ${h.cop(N.auxilio)} (Decree 1470 of 2025); anyone earning up to ${N.auxilio_tope_smmlv} minimum wages has the allowance added to the base for severance, interest and bonus (Law 1 of 1963, art. 7). Take a salary of ${h.cop(PAY)}, an open-ended contract from ${h.date(START)} to ${h.date(END)} and ${TAKEN} holiday days already used: the settlement is ${h.cop(q.total)} after a resignation and ${h.cop(d.total)} after an unfair dismissal, which adds ${h.num(d.indemDias, 1)} days of pay. Part-years use the 360-day commercial year.`;
  },
  faqs: (h) => {
    const I = h.P.nomina.indemnizacion;
    return [
      { q: 'Do I get dismissal compensation if I resign?', a: `No. Article 64 of the Labour Code only applies when the employer ends the contract without just cause. After a resignation you still receive the current year's severance and interest, the pro rata bonus and any unused holidays, but no compensation. That is why the calculator shows the art. 64 line only when you pick unfair dismissal.` },
      { q: 'How is dismissal pay worked out on a fixed-term contract?', a: `You are owed the salary for the time left until the agreed end date. If 60 days remained, that is 60 days of pay. On a contract for a specific job (obra o labor) the rule is the time left to finish the job, with a floor of ${I.obra_minimo} days. Enter the remaining days in the extra box that appears once you choose dismissal.` },
      { q: 'Why are earlier years of severance missing from the settlement?', a: `Because each year's cesantías must already be in the employee's severance fund: Law 50 of 1990, art. 99, requires the deposit before February 15 of the following year. The settlement therefore covers only the current year. If your employer never made those deposits, add them yourself, since the calculator assumes they were made.` },
    ];
  },
  body: (h) => {
    const N = h.P.nomina, I = N.indemnizacion, q = run(h, false), d = run(h, true);
    const row = (c: string, a: number, b: number) => [c, h.cop(a), h.cop(b)];
    return `
<h2>Using the calculator</h2>
<p>Fill in the monthly salary, start and last day, contract type and reason for leaving. For a fixed-term or specific-job contract ended by dismissal, a box appears for the days that were left.</p>
<h2>Same job, two endings</h2>
${h.table(['Item', 'Resignation', 'Unfair dismissal'], [
  row(`Severance (${q.diasAnio} days this year)`, q.cesantias, d.cesantias),
  row('Interest on severance', q.intereses, d.intereses),
  row(`Service bonus (${q.diasSemestre} days this half)`, q.prima, d.prima),
  row(`Unused holidays (${h.num(q.vacDias, 1)} days)`, q.vacaciones, d.vacaciones),
  [`Art. 64 compensation (${h.num(d.indemDias, 2)} days)`, 'Not due', h.cop(d.indemnizacion)],
  ['<strong>Total</strong>', `<strong>${h.cop(q.total)}</strong>`, `<strong>${h.cop(d.total)}</strong>`],
], `Salary ${h.cop(PAY)}, open-ended contract from ${h.date(START)} to ${h.date(END)}, ${TAKEN} holiday days taken`, ['l', 'r', 'r'])}
<p>Because ${h.cop(PAY)} is below ${N.auxilio_tope_smmlv} minimum wages (${h.cop(N.auxilio_tope_smmlv * N.smmlv)}), the transport allowance lifts the base for severance and bonus to ${h.cop(q.base)}. Holiday pay uses the plain salary: the usual practice, since holidays are paid rest rather than a benefit. Each item has its own page: ${h.a('cesantias', 'severance')}, ${h.a('prima', 'service bonus')} and ${h.a('vacaciones', 'paid holidays')}.</p>
<h2>Dismissal pay by contract type</h2>
<ul>
<li>Open-ended, salary under ${I.umbral_smmlv} minimum wages (${h.cop(I.umbral_smmlv * N.smmlv)}): ${I.bajo.primer_anio} days for the first year plus ${I.bajo.adicional} for each further year, pro rata.</li>
<li>Open-ended, ${I.umbral_smmlv} minimum wages or more: ${I.alto.primer_anio} days, then ${I.alto.adicional} per further year.</li>
<li>Fixed-term: salary for the rest of the agreed term.</li>
<li>Specific job: the time left on the job, never less than ${I.obra_minimo} days.</li>
</ul>
<p>Staff who already had ten or more years of service when Law 789 of 2002 took effect keep a transitional regime that this tool does not apply. No social security or withholding is deducted; for take-home pay see the ${h.a('salario-minimo', 'minimum wage and net pay')} page.</p>`;
  },
});
