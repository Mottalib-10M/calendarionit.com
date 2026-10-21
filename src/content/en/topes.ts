import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Income tax filing thresholds for tax year 2025 (2025 UVT, pesos as rounded by DIAN). */
const filas = (h: Helpers) => {
  const R = h.P.renta, u = R.uvt_ag;
  return [
    ['Gross assets on December 31, 2025, above', R.patrimonio_uvt, R.patrimonio_cop, R.patrimonio_uvt * u],
    ['Gross income in 2025, equal to or above', R.ingresos_uvt, R.ingresos_cop, R.ingresos_uvt * u],
    ['Credit card spending, above', R.ingresos_uvt, R.tarjeta_cop, R.ingresos_uvt * u],
    ['Total purchases and consumption, above', R.ingresos_uvt, R.compras_cop, R.ingresos_uvt * u],
    ['Bank deposits and financial investments, above', R.ingresos_uvt, R.consignaciones_cop, R.ingresos_uvt * u],
  ] as const;
};

export default defineText({
  slug: 'income-tax-filing-thresholds',
  nav: 'Filing thresholds',
  card: 'The five peso thresholds and the VAT condition that make an individual file an income tax return in 2026.',
  title: 'Income tax filing thresholds Colombia 2026 in pesos',
  description: 'Income tax filing thresholds in Colombia for 2026: gross assets, income, card spending, purchases and deposits for tax year 2025, in UVT and DIAN pesos.',
  h1: 'Do you have to file a Colombian tax return in 2026?',
  intro: 'Enter your 2025 figures and see at once whether you must file the income tax return this year.',
  resume: (h) => {
    const R = h.P.renta;
    return `Whether an individual must file a Colombian income tax return in 2026 depends on tax year 2025 figures measured with the 2025 UVT of ${h.cop(R.uvt_ag)}, set by DIAN Resolution 000193 of 2024. A resident individual must file if any one of these applies: gross assets on December 31, 2025 above ${h.num(R.patrimonio_uvt)} UVT (${h.cop(R.patrimonio_cop)}); gross income equal to or above ${h.num(R.ingresos_uvt)} UVT (${h.cop(R.ingresos_cop)}); credit card spending, total purchases and consumption, or bank deposits and financial investments each above ${h.cop(R.tarjeta_cop)}; or being registered for VAT at the end of 2025. The legal basis is articles 592, 593 and 594-3 of the Tax Code (Estatuto Tributario) and article 1.6.1.13.2.7 of Decree 1625 of 2016, as replaced by Decree 2229 of 2023. The peso amounts are DIAN's, rounded to the nearest thousand under article 868 of the Tax Code. Those who must file do so between August and October 2026, by the last two digits of their NIT.`;
  },
  faqs: (h) => {
    const R = h.P.renta;
    return [
      { q: `If my 2025 income was exactly ${h.cop(R.ingresos_cop)}, do I have to file?`, a: `Yes. For gross income the test is equal to or above ${h.num(R.ingresos_uvt)} UVT, so reaching the figure exactly is enough. The other thresholds require going above the amount: gross assets of exactly ${h.cop(R.patrimonio_cop)} do not, on their own, trigger a return.` },
      { q: 'Why are the DIAN threshold amounts round numbers?', a: `Article 868 of the Tax Code rounds peso amounts derived from UVT to the nearest thousand once they exceed ${h.cop(10000)}. So ${h.num(R.patrimonio_uvt)} UVT works out at ${h.cop(R.patrimonio_uvt * R.uvt_ag)} exactly but appears as ${h.cop(R.patrimonio_cop)} in the official figures. The tool applies the rounded amounts.` },
      { q: 'Which UVT applies to the thresholds for the return filed in 2027?', a: `The 2026 UVT of ${h.cop(h.P.uvt['2026'])}, set by DIAN Resolution 000238 of 2025, because that return covers tax year 2026. The number of UVT for each threshold comes from the law, but DIAN has yet to publish the peso amounts and the 2027 filing dates.` },
    ];
  },
  body: (h) => {
    const rows = filas(h).map(([c, u, p, x]) => [c, h.num(u), h.cop(p), h.cop(x)]);
    rows.push(['Registered for VAT on December 31, 2025', 'n/a', 'always files', 'n/a']);
    return `
<h2>Using the checker</h2>
<p>Enter your 2025 figures in each box and tick VAT if you were registered. The result says whether you must file and which condition applies; one is enough.</p>
<h2>Thresholds in UVT and pesos</h2>
${h.table(['Tax year 2025 condition', 'UVT', 'Pesos (DIAN)', 'Exact product'], rows, `2025 UVT: ${h.cop(h.P.renta.uvt_ag)}`, ['l', 'r', 'r', 'r'])}
<h2>Points newcomers miss</h2>
<ul>
<li>The tool assumes a tax resident. Whether you are resident is a separate question this page does not cover.</li>
<li>Deposits are the total paid in during the year, not the balance left on December 31.</li>
<li>Credit card spending can trigger a return even when income stays below the threshold.</li>
<li>Gross assets means before subtracting debts.</li>
</ul>
<p>If you must file, find your day in the ${h.a('renta-pn', 'individual income tax calendar')}. Tax withheld from your salary, explained under ${h.a('retencion', 'salary withholding')}, is credited against the bill, and the ${h.a('exogena', 'third-party reports')} from banks and employers already show DIAN many of these figures.</p>
`;
  },
});
