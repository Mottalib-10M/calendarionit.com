import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** A full calendar year 2026 on the 360-day commercial year. */
const year = (h: Helpers, salary: number) => {
  const dias = h.M.dias360('2026-01-01', '2026-12-31');
  const base = h.M.basePrestaciones(salary);
  const c = h.M.cesantias(base, dias);
  return { dias, base, c, i: h.M.interesesCesantias(c, dias) };
};

export default defineText({
  slug: 'severance-cesantias',
  nav: 'Severance (cesantías)',
  card: 'Severance and its interest for 2026, with the fund deposit deadline and the January interest payment.',
  title: 'Severance pay 2026 in Colombia: cesantías and interest',
  description: 'Severance pay 2026 in Colombia: one month of salary per year, 12 % interest paid in January and the fund deposit due before February 15 (Law 50 of 1990).',
  h1: 'Severance (cesantías) and interest on it',
  intro: 'Work out the cesantías for any period, plus the interest that the employer pays separately.',
  resume: (h) => {
    const N = h.P.nomina, m = year(h, N.smmlv);
    return `Cesantías are Colombia's statutory severance savings, set by article 249 of the Labour Code: one month of salary for each year worked, pro rata for part of a year. Unlike severance in many countries, they build up every year whether or not the job ends. For employees earning up to ${N.auxilio_tope_smmlv} minimum wages, the transport allowance is part of the base (Law 1 of 1963, art. 7). On the 2026 minimum wage of ${h.cop(N.smmlv)} (Decree 1469 of 2025) plus the ${h.cop(N.auxilio)} allowance (Decree 1470 of 2025), a full year produces ${h.cop(m.c)} of severance and ${h.cop(m.i)} of interest. The 2026 cesantías go into the severance fund chosen by the employee before February 15, 2027 (Law 50 of 1990, art. 99). The ${h.pct(N.intereses_cesantias)} interest is paid to the employee directly in January 2027 (Decree 1072 of 2015, art. 2.2.1.3.4). If the job ends earlier, both are paid with the final settlement. Part-years use the 360-day commercial year.`;
  },
  faqs: (h) => {
    const N = h.P.nomina;
    return [
      { q: 'What happens if the employer deposits the cesantías late?', a: `Law 50 of 1990, art. 99, number 3, makes the employer pay one day of salary for every day of delay. The penalty runs from February 15 until the money reaches the employee's account in the fund. Employees can check this by looking at their fund statement in the second half of February.` },
      { q: 'Does the interest on severance go into the fund?', a: `No. The ${h.pct(N.intereses_cesantias)} yearly interest goes straight to the employee with January's payroll, for the previous year. An employer who fails to pay it owes an extra amount equal to the interest (Decree 1072 of 2015, art. 2.2.1.3.8). For someone who worked only part of the year, the rate shrinks in proportion to the days worked.` },
      { q: 'Is the transport allowance in the base above two minimum wages?', a: `No. The allowance under Decree 1470 of 2025 is only paid to employees earning up to ${N.auxilio_tope_smmlv} minimum wages, which is ${h.cop(N.auxilio_tope_smmlv * N.smmlv)} a month in 2026. Above that, there is no allowance and the severance base is the salary alone. The calculator applies the cut-off automatically from the salary you enter.` },
    ];
  },
  body: (h) => {
    const N = h.P.nomina;
    const pays = [N.smmlv, N.auxilio_tope_smmlv * N.smmlv, 3600000, 6000000];
    const rows = pays.map((s) => { const m = year(h, s); return [h.cop(s), h.cop(m.base), h.cop(m.c), h.cop(m.i)]; });
    return `
<h2>Using the calculator</h2>
<p>Enter the monthly salary and the first and last day of the period: a calendar year, the time since the start date, or the year so far. The result shows severance and interest apart, because they are paid in different ways.</p>
<h2>A full year of 2026 at four salaries</h2>
${h.table(['Monthly salary', 'Base', 'Severance', 'Interest'], rows, `Whole of 2026 (${year(h, N.smmlv).dias} days). Transport allowance of ${h.cop(N.auxilio)} in the base up to ${N.auxilio_tope_smmlv} minimum wages`, ['r', 'r', 'r', 'r'])}
<p>The jump between the second and third rows is the allowance cliff: at exactly ${N.auxilio_tope_smmlv} minimum wages the allowance still counts, one peso more and it no longer does. The calculator assumes the salary stayed the same for the whole period.</p>
<h2>Key dates for the 2026 cesantías</h2>
<ul>
<li>January 2027: the employer pays the employee ${h.pct(N.intereses_cesantias)} interest on the 2026 severance.</li>
<li>Before February 15, 2027: the 2026 severance is deposited in the employee's chosen fund.</li>
<li>If the job ends first: severance and interest for the current year are part of the ${h.a('liquidacion', 'final settlement')}, along with the pro rata ${h.a('prima', 'service bonus')}.</li>
</ul>
<p>The 2027 amounts depend on next year's minimum wage, which is yet to be published; the allowance and its cap will move with it. See the ${h.a('salario-minimo', 'current minimum wage')} and how it is set.</p>`;
  },
});
