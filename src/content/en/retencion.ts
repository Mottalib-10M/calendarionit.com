import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Payroll withholding, procedure 1 (Tax Code art. 383), with the 2026 UVT. */
const EJEMPLOS = [6000000, 9000000, 14000000, 25000000];
const ret = (h: Helpers, ingreso: number, dependiente = false) => h.M.retencion({ ingreso, dependiente, prepagada: 0 });
/** First monthly salary (in steps of COP 10,000) with withholding, no dependants or private health plan. */
const umbral = (h: Helpers) => { let s = 1000000; while (ret(h, s).retencion <= 0) s += 10000; return s; };

export default defineText({
  slug: 'salary-withholding-tax',
  nav: 'Salary withholding',
  card: 'How much tax a Colombian employer withholds from your monthly pay in 2026, with the article 383 table.',
  title: 'Salary withholding tax Colombia 2026: article 383 table',
  description: 'Salary withholding tax in Colombia for 2026: the article 383 table in UVT and pesos, deductions, the 25 % exempt income and the monthly procedure 1 calculation.',
  h1: 'Salary withholding tax in Colombia, 2026',
  intro: 'Enter your monthly pay and see the taxable base, what reduces it and the withholding your employer applies.',
  resume: (h) => {
    const U = h.P.uvt['2026'], R = h.P.renta, T = R.art383, N = h.P.nomina;
    return `Employers in Colombia withhold income tax from salaries every month (retención en la fuente) using the article 383 table of the Tax Code and the 2026 UVT of ${h.cop(U)}, set by DIAN Resolution 000238 of 2025. Under procedure 1, a taxable base up to ${h.num(T[0].hasta!)} UVT (${h.cop(T[0].hasta! * U)}) carries no withholding; above it, marginal rates run from ${h.pct(T[1].marginal)} to ${h.pct(T[T.length - 1].marginal)}. Before the table applies, the employee's mandatory health (${h.pct(N.salud_empleado)}) and pension (${h.pct(N.pension_empleado)}) contributions are subtracted, plus the pension solidarity fund from ${N.fsp[0].desde} minimum wages. Then come deductions for dependants (${h.pct(R.dependientes_pct)} of income, at most ${R.dependientes_uvt_mes} UVT a month) and private health plans (at most ${R.prepagada_uvt_mes} UVT a month), and the ${h.pct(R.exenta25)} exempt income of article 206, capped at ${h.num(R.exenta25_uvt_anual)} UVT a year. Deductions and exempt income together cannot exceed ${h.pct(R.limite40)} or ${h.num(R.limite40_uvt_anual)} UVT a year (article 336). On a salary of ${h.cop(EJEMPLOS[2])}, monthly withholding is ${h.cop(ret(h, EJEMPLOS[2]).retencion)}.`;
  },
  faqs: (h) => {
    const R = h.P.renta, U = h.P.uvt['2026'], s = umbral(h), b = EJEMPLOS[2];
    return [
      { q: 'At what salary does withholding start in 2026?', a: `On our assumptions, with no dependants, no private health plan and a single employer, withholding starts at a monthly salary of about ${h.cop(s)}. Below that, after contributions and the ${h.pct(R.exenta25)} exempt income, the base stays under ${h.num(R.art383[0].hasta!)} UVT, or ${h.cop(R.art383[0].hasta! * U)}, where the rate is zero.` },
      { q: 'Why does the calculator divide the 790 and 1,340 UVT caps by 12?', a: `The law sets both caps per year, while withholding is worked out each month. We found no official text setting a monthly cap, so we spread the annual figure evenly: ${h.num(R.exenta25_uvt_anual / 12, 2)} UVT for exempt income and ${h.num(R.limite40_uvt_anual / 12, 2)} UVT for the overall limit. This is our assumption, and your payroll provider may round differently.` },
      { q: 'How much do dependants reduce my withholding?', a: `The deduction is ${h.pct(R.dependientes_pct)} of gross employment income, up to ${R.dependientes_uvt_mes} UVT a month (${h.cop(R.dependientes_uvt_mes * U)}). On a salary of ${h.cop(b)}, withholding drops from ${h.cop(ret(h, b).retencion)} to ${h.cop(ret(h, b, true).retencion)} a month. You need to give your employer proof of the dependant for it to apply.` },
      { q: 'Did the article 383 withholding table change for 2026?', a: `No. The UVT brackets and rates are those introduced by Law 2010 of 2019, still in force in October 2026. What changes each year is the UVT itself, which went from ${h.cop(h.P.uvt['2025'])} to ${h.cop(U)}, so the peso limits rise even though the table stays the same.` },
    ];
  },
  body: (h) => {
    const U = h.P.uvt['2026'], T = h.P.renta.art383;
    const tabla = T.map((r) => [h.num(r.desde), r.hasta === null ? 'and above' : h.num(r.hasta), h.pct(r.marginal), h.num(r.fijo), h.cop(r.desde * U)]);
    const ejemplos = EJEMPLOS.map((s) => { const r = ret(h, s); return [h.cop(s), h.cop(r.base), h.num(r.baseUvt, 2), h.cop(r.retencion)]; });
    return `
<h2>Using the calculator</h2>
<p>Enter your salary and other employment pay for the month, say whether you have dependants and what you pay for a private health plan. Each step from gross pay to the base is shown, with the month's withholding.</p>
<h2>The article 383 table in 2026</h2>
${h.table(['From (UVT)', 'To (UVT)', 'Marginal rate', 'Plus (UVT)', 'From (pesos)'], tabla, `Withholding = (base in UVT − lower limit) × rate + fixed UVT; UVT ${h.cop(U)}`, ['r', 'r', 'r', 'r', 'r'])}
<h2>Four sample salaries</h2>
${h.table(['Monthly salary', 'Taxable base', 'Base in UVT', 'Withholding'], ejemplos, 'No dependants or private health plan, one employer, ordinary salary', ['r', 'r', 'r', 'r'])}
<p>Withholding is an advance, not an extra cost: it is credited in your annual return if you are ${h.a('topes', 'required to file')}. Your employer files and pays it each month on its ${h.a('retencion-dian', 'withholding calendar')}. For take-home pay, see the ${h.a('salario-minimo', '2026 minimum wage')} page and the ${h.a('liquidacion', 'final settlement')} calculator.</p>
`;
  },
});
