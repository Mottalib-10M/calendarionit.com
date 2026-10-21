import { defineText } from '../../lib/define';

export default defineText({
  slug: 'minimum-wage',
  nav: 'Minimum wage',
  card: 'The 2026 minimum wage and transport allowance, where the decree stands in court, and take-home pay.',
  title: 'Minimum wage 2026 in Colombia: amount, net pay, allowance',
  description: 'Minimum wage 2026 in Colombia: COP 1,750,905 plus a COP 249,095 transport allowance, take-home pay after health and pension, and the decree’s court status.',
  h1: 'Colombia’s 2026 minimum wage, allowance and net pay',
  intro: 'The amount has not changed all year, even though the decree behind it went before the Council of State.',
  resume: (h) => {
    const N = h.P.nomina, n = h.M.neto(N.smmlv);
    return `Colombia's monthly minimum wage for 2026, the salario mínimo mensual legal vigente, is ${h.cop(N.smmlv)}. It was set by Decree 1469 of 2025, a rise of ${h.pct(N.smmlv / N.smmlv_2025 - 1)} on the ${h.cop(N.smmlv_2025)} of 2025. The transport allowance is ${h.cop(N.auxilio)} (Decree 1470 of 2025) and is owed to employees earning up to ${N.auxilio_tope_smmlv} minimum wages, or ${h.cop(N.auxilio_tope_smmlv * N.smmlv)}. In February 2026 the Council of State (Consejo de Estado) provisionally suspended Decree 1469; the Government then issued Decree 0159 of 2026, setting the same amount on an interim basis, and in July 2026 the court lifted the suspension. The amount never changed, and the final ruling is still pending. A worker on the minimum wage pays ${h.pct(N.salud_empleado)} for health and ${h.pct(N.pension_empleado)} for pension on the salary without the allowance, taking home ${h.cop(n.neto)} a month. The 2027 minimum wage is yet to be published: under Law 278 of 1996, art. 8, the wage commission decides by December 15 and, failing agreement, the Government sets it by December 30.`;
  },
  faqs: (h) => {
    const N = h.P.nomina;
    return [
      { q: 'Did the court suspension mean employers had to claw back pay?', a: `No. While Decree 1469 of 2025 was suspended, Decree 0159 of 2026 kept the minimum wage at the same ${h.cop(N.smmlv)}, and since July 2026 Decree 1469 applies again. At no point was there a different minimum wage, so there is nothing to recalculate. What remains open is the Council of State's ruling on the merits.` },
      { q: 'What is one day of minimum wage worth in 2026?', a: `The monthly minimum divided by 30: ${h.cop(N.smmlv / 30)} a day, without the transport allowance. That daily figure is the unit for dismissal pay under Labour Code art. 64 and for paid-out holidays. For an hourly figure, divide again by the daily hours, which depend on the maximum working week in force.` },
      { q: 'When will the 2027 minimum wage be known?', a: `It is yet to be published. Law 278 of 1996, art. 8, gives the standing wage commission (Comisión Permanente de Concertación de Políticas Salariales y Laborales) until December 15 to agree on it. Without consensus, the Government sets it by decree no later than December 30, and it applies from January 1, 2027. This page will be updated when the decree is out.` },
    ];
  },
  body: (h) => {
    const N = h.P.nomina, SM = N.smmlv;
    const rows: Array<[string, number, string]> = [
      ['Monthly minimum wage', SM, 'Decree 1469 of 2025'],
      ['Transport allowance', N.auxilio, 'Decree 1470 of 2025'],
      [`Allowance cut-off (${N.auxilio_tope_smmlv} minimum wages)`, N.auxilio_tope_smmlv * SM, 'Decree 1470 of 2025'],
      [`Pension solidarity fund from ${N.fsp[0].desde} minimum wages`, N.fsp[0].desde * SM, 'Law 100 of 1993, art. 27'],
      [`Lowest all-inclusive salary (${N.integral_smmlv} minimum wages + ${h.pct(N.integral_factor)})`, N.integral_smmlv * SM * (1 + N.integral_factor), 'Labour Code art. 132'],
      [`Contribution ceiling (${N.ibc_max_smmlv} minimum wages)`, N.ibc_max_smmlv * SM, 'Law 100 of 1993'],
    ];
    const n = h.M.neto(SM);
    return `
<h2>Using the calculator</h2>
<p>Type a monthly salary to see the transport allowance where it applies, the health, pension and solidarity fund deductions, and the net pay. A figure below the minimum triggers a warning.</p>
<h2>2026 figures that follow from the minimum wage</h2>
${h.table(['Item', '2026 value', 'Legal basis'], rows.map(([c, v, a]) => [c, h.cop(v), a]), 'Derived from the 2026 minimum wage; all of them change once the 2027 figure is published', ['l', 'r', 'l'])}
<p>On the minimum wage, an employee receives ${h.cop(n.devengado)} in salary and allowance, minus ${h.cop(n.salud)} for health and ${h.cop(n.pension)} for pension: ${h.cop(n.neto)} lands in the account. The employer pays its own, larger share of contributions on top, which does not show on the employee's payslip.</p>
<h2>Why the minimum wage matters beyond the lowest salaries</h2>
<p>Many other thresholds are multiples of it: the art. 64 dismissal scale, the right to the allowance, and the ordinary hour used for ${h.a('recargos', 'overtime and premiums')}. A ${h.a('liquidacion', 'final settlement')} in 2026 uses the current figure even while the decree is still being litigated. Payroll ${h.a('retencion', 'withholding tax')} does not touch a minimum-wage earner, whose base stays below the first band of the table.</p>`;
  },
});
