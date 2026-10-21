import { defineText } from '../../lib/define';

/** Second half of 2026: July 1 to December 31. */
const FROM = '2026-07-01', TO = '2026-12-31';

export default defineText({
  slug: 'service-bonus-prima',
  nav: 'Service bonus (prima)',
  card: 'The June and December 2026 bonus: pro rata amount for the days worked and the payment deadlines.',
  title: 'Service bonus 2026 in Colombia: prima de servicios',
  description: 'Service bonus 2026 in Colombia: the prima de servicios, 30 days of pay a year in June and December, with the transport allowance in the base. Calculator.',
  h1: 'Service bonus (prima de servicios), June and December',
  intro: 'Half a month of pay for each full half-year, and a pro rata share for anyone who joined midway.',
  resume: (h) => {
    const N = h.P.nomina;
    const half = h.M.prima(h.M.basePrestaciones(N.smmlv), h.M.dias360(FROM, TO));
    return `The prima de servicios is a statutory bonus that every employer in Colombia owes its employees under article 306 of the Labour Code, as amended by Law 1788 of 2016. It equals ${N.prima_dias} days of salary per year worked and is paid in two halves: the first by June 30 and the second within the first 20 days of December. Each half covers a 180-day half-year on the commercial calendar and is reduced pro rata for anyone who did not work the whole half. The base is salary plus the transport allowance for employees earning up to ${N.auxilio_tope_smmlv} minimum wages (Law 1 of 1963, art. 7). On the 2026 minimum wage of ${h.cop(N.smmlv)} (Decree 1469 of 2025) with the ${h.cop(N.auxilio)} allowance (Decree 1470 of 2025), a full half-year gives ${h.cop(half)}, paid twice a year. An employee who leaves before a payment date gets the pro rata bonus in the final settlement. An all-inclusive salary (salario integral) carries no separate bonus.`;
  },
  faqs: (h) => {
    const N = h.P.nomina;
    const base = h.M.basePrestaciones(N.smmlv);
    return [
      { q: 'I started work in November. Do I get a December bonus?', a: `Yes, in proportion to the days worked in the half-year. Someone who started on November 1, 2026 has 60 days of the second half by December 31, so the December bonus is one third of a full half's bonus. In the calculator, put the start date as the first day and December 31 as the last.` },
      { q: 'How much was the June 2026 bonus on the minimum wage?', a: `For a full first half, January 1 to June 30, the base is the ${h.cop(N.smmlv)} minimum wage plus the ${h.cop(N.auxilio)} allowance, or ${h.cop(base)}. The bonus is that base times 180 days divided by 360: ${h.cop(h.M.prima(base, 180))}. It was due by June 30, 2026, and the December payment is the same if the salary does not change.` },
      { q: 'Does an all-inclusive salary earn a service bonus?', a: `Not separately. A salario integral under Labour Code art. 132 must be at least ${N.integral_smmlv} minimum wages plus a ${h.pct(N.integral_factor)} benefits factor, which is ${h.cop(N.integral_smmlv * N.smmlv * (1 + N.integral_factor))} in 2026. That factor already pays the benefits in advance, the bonus included, so this calculator does not apply to such contracts.` },
    ];
  },
  body: (h) => {
    const N = h.P.nomina;
    const cases: Array<[string, string]> = [['Whole half-year', FROM], ['Joined September 1', '2026-09-01'], ['Joined November 16', '2026-11-16']];
    const pays = [N.smmlv, 3000000, 5000000];
    const rows = cases.map(([label, d]) => { const days = h.M.dias360(d, TO); return [label, String(days), ...pays.map((s) => h.cop(h.M.prima(h.M.basePrestaciones(s), days)))]; });
    return `
<h2>Using the calculator</h2>
<p>Enter the salary and the period: January 1 to June 30 for the June bonus, July 1 to December 31 for December, or from your start date if you joined later. The result is base × days ÷ 360.</p>
<h2>December 2026 bonus by start date</h2>
${h.table(['Situation', 'Days', h.cop(N.smmlv), h.cop(3000000), h.cop(5000000)], rows, 'Second half of 2026, to December 31. The first two salary columns include the transport allowance in the base', ['l', 'r', 'r', 'r', 'r'])}
<p>The ${h.cop(5000000)} column has no allowance because that salary is above ${N.auxilio_tope_smmlv} minimum wages (${h.cop(N.auxilio_tope_smmlv * N.smmlv)}). Someone just under the cap can therefore end up with a bonus close to someone just over it.</p>
<h2>The two deadlines</h2>
<ul>
<li>First half of 2026: by ${h.dia('2026-06-30')}.</li>
<li>Second half of 2026: within the first 20 days of December 2026.</li>
<li>Leaving before either date: the pro rata bonus goes into the ${h.a('liquidacion', 'final settlement')}.</li>
</ul>
<p>The bonus is separate from ${h.a('cesantias', 'severance')}, which goes to a fund, and from ${h.a('vacaciones', 'paid holidays')}, which are time off. All three use the 360-day year, each with its own base and date.</p>`;
  },
});
