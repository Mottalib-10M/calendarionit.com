import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

const data = (h: Helpers) => {
  const c = h.M.ciudad('medellin')!;
  const ord = c.regimenes.find((r) => r.id === 'ordinario')!;
  const simp = c.regimenes.find((r) => r.id === 'simplificado')!;
  return { c, simp, ret: ord.filas.find((f) => f.accion === 'decl')!.fechas, pay: ord.filas.find((f) => f.accion === 'pago')!.fechas.todos, wh: c.retencion!.filas };
};
const ORDER = ['0', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
const short = (h: Helpers, d: string) => h.date(d).replace(/, \d{4}$/, '');

export default defineText({
  slug: 'medellin-ica-tax',
  nav: 'ICA Medellín',
  card: 'Annual return in April by last NIT digit, payment by June, two-month billing for small taxpayers and ICA withholding.',
  title: 'Medellín ICA tax 2026: due dates by NIT digit and ReteICA',
  description: 'Medellín ICA tax 2026: annual return for 2025 due April 17 to 30 by last NIT digit, payment by June 25, and two-month ICA withholding returns on a shared date.',
  h1: 'Medellín ICA tax calendar for 2026',
  intro: 'In Medellín you file in April and pay later, against a bill issued by the city.',
  resume: (h) => {
    const { ret, pay, wh, simp } = data(h);
    return `Medellín's industry and commerce tax (impuesto de industria y comercio, ICA) for the 2025 tax year was filed in 2026 under Resolution 202550100057 of 2025, issued by the city's revenue office. Businesses in the ordinary regime filed between ${h.date(ret['0'])} for NITs ending in 0 and ${h.date(ret['1'])} for those ending in 1, by the last digit of the NIT or ID number, ignoring the check digit. What sets Medellín apart is that filing and paying are two steps: the city bills returns filed on time in May, and payment is due by ${h.date(pay)}; self-withholders and occasional taxpayers pay when they file. The simplified regime, for individuals with a single establishment and income up to ${simp.quien.en.match(/[\d,]+ UVT/)![0]} (Agreement 093 of 2023), files no return and pays a city-issued bill every two months. ICA withholding (ReteICA) is filed and paid every two months on a date shared by all NITs; the last 2026 period is due ${h.date(wh[wh.length - 1].fechas.todos)}. The resolution offers no early-payment discount on ICA.`;
  },
  faqs: (h) => {
    const { pay, wh } = data(h);
    return [
      { q: 'I filed my Medellín ICA return on time. When do I pay?', a: `By ${h.date(pay)}, using the bill the city issues in May from your return, as long as the tax office has processed it. If you chose "declarar y pagar" when filing, or you are a self-withholder or occasional taxpayer, payment was due at the moment of filing. This comes from paragraph 1 of article 3 of Resolution 202550100057 of 2025.` },
      { q: 'Must I file a Medellín withholding return if I withheld nothing?', a: `No. Resolution 202550100057 of 2025 states that the ICA withholding return is not required for a two-month period in which no withholding took place. If you did withhold in September and October 2026, the return and payment are due ${h.date(wh[4].fechas.todos)}, the same date whatever your NIT ends in.` },
      { q: 'Is the 2027 Medellín ICA calendar out yet?', a: `Not yet. The 2026 calendar came from Resolution 202550100057 of 2025, signed in December 2025. Until the 2027 resolution is issued, this page shows no dates for the return covering the 2026 tax year. It does include the withholding return for November and December 2026, which falls due in January 2027.` },
    ];
  },
  body: (h) => {
    const { ret, simp, wh } = data(h);
    const rows = ORDER.map((d) => [d, short(h, ret[d])]);
    const months = ['Jan to Feb', 'Mar to Apr', 'May to Jun', 'Jul to Aug', 'Sep to Oct', 'Nov to Dec'];
    const two = simp.filas.map((f, i) => [months[i], h.date(f.fechas.todos), h.date(wh[i].fechas.todos)]);
    return `
<h2>Using the calculator</h2>
<p>The tool is already set to Medellín. Enter the last digit of your NIT, pick ordinary or simplified regime and tick ReteICA if you withhold; the .ics button puts the dates in your calendar.</p>
<h2>Annual return for the 2025 tax year, April 2026</h2>
${h.table(['Last digit', 'Filing deadline'], rows, 'Resolution 202550100057 of 2025, art. 1. The calendar starts with digit 0', ['l', 'l'])}
<p>The order runs backwards: NITs ending in 0 filed first and those ending in 1 last. After that, everyone pays the bill by the same date.</p>
<h2>Two-month periods: simplified regime and withholding</h2>
${h.table(['Period (2026)', 'Simplified regime bill', 'ReteICA return and payment'], two, 'One date for every NIT', ['l', 'l', 'l'])}
<p>The city works out the simplified regime's tax and sends the bill. Under Agreement 093 of 2023, art. 62, anyone in the national ${h.a('simple', 'Régimen Simple')} cannot use this municipal regime. Compare with ${h.a('ica-bogota', 'Bogotá ICA')}.</p>`;
  },
});
