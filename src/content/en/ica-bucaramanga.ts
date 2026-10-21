import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

const data = (h: Helpers) => {
  const c = h.M.ciudad('bucaramanga')!;
  const ord = c.regimenes.find((r) => r.id === 'comun')!;
  const pref = c.regimenes.find((r) => r.id === 'preferencial')!;
  const f = (r: typeof ord, a: string) => r.filas.find((x) => x.accion === a)!.fechas;
  return { ret: f(ord, 'decl'), inst: ['pago1', 'pago2', 'pago3'].map((a) => f(ord, a).todos), pref: ['pago1', 'pago2'].map((a) => f(pref, a).todos), wh: c.retencion!.filas };
};
const DIG = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const GROUPS = ['1-3', '4-6', '7-0'];
/** Month name (« March ») taken from the date written by h.date. */
const month = (h: Helpers, iso: string) => h.date(iso).replace(/ \d+, \d{4}$/, '');

export default defineText({
  slug: 'bucaramanga-ica-tax',
  nav: 'ICA Bucaramanga',
  card: 'March return by digit, payment in three instalments, a fixed amount for the preferential regime and monthly withholding.',
  title: 'Bucaramanga ICA tax 2026: return, instalments, ReteICA',
  description: 'Bucaramanga ICA tax 2026: return due March 2 to 24 by last NIT digit, payment in three instalments up to September, and monthly ICA withholding by digit group.',
  h1: 'Bucaramanga ICA tax calendar for 2026',
  intro: 'Bucaramanga files in March and lets the annual tax be paid in three instalments.',
  resume: (h) => {
    const { ret, inst, pref, wh } = data(h);
    return `In Bucaramanga, Resolution 4-R--202512-00030019 of 2025 set the 2026 calendar for the industry and commerce tax (ICA), together with the signs-and-boards tax and the fire surcharge. Ordinary-regime taxpayers filed the return for the 2025 tax year between ${h.date(ret['1'])} (last digit 1) and ${h.date(ret['0'])} (digit 0). They can then pay in three instalments: ${h.date(inst[0])}, ${h.date(inst[1])} and ${h.date(inst[2])}. The preferential regime files no return and pays a fixed amount, either at once or in two parts, on ${h.date(pref[0])} and ${h.date(pref[1])}. ICA withholding and self-withholding are filed monthly, with three deadlines by last digit: 1 to 3, 4 to 6 and 7 to 0. Only one date moved during the year: Resolution 4-R-SdHM-202604-00003143 of 2026 shifted the March period for NITs ending in 7, 8, 9 and 0 to ${h.date(wh[2].fechas['7-0'])} because of a local civic day. There is no early-payment discount on ICA, and the 2027 calendar has not been published.`;
  },
  faqs: (h) => {
    const { inst, wh } = data(h);
    return [
      { q: 'When are the Bucaramanga ICA instalments due?', a: `For the ordinary regime, tax for the 2025 tax year is paid in three instalments due ${h.date(inst[0])}, ${h.date(inst[1])} and ${h.date(inst[2])}, under article 2 of Resolution 4-R--202512-00030019 of 2025. The return itself had its own March date by digit. The preferential regime has only two payment dates and files no annual return.` },
      { q: 'Do I file Bucaramanga ICA withholding for a month with no withholding?', a: `No. The resolution recalls that the withholding and self-withholding return is not required for periods with no transactions subject to withholding. If you did withhold in October 2026, the deadline depends on the last NIT digit: ${h.date(wh[9].fechas['1-3'])} for 1 to 3, ${h.date(wh[9].fechas['4-6'])} for 4 to 6 and ${h.date(wh[9].fechas['7-0'])} for 7 to 0.` },
      { q: 'Why did the March withholding deadline change in Bucaramanga?', a: `The original due date for NITs ending in 7, 8, 9 and 0 was declared a civic day in the city. The Treasury then issued Resolution 4-R-SdHM-202604-00003143 of 2026, dated in April, setting the new deadline at ${h.date(wh[2].fechas['7-0'])}. The other two digit groups kept their dates.` },
    ];
  },
  body: (h) => {
    const { ret, wh } = data(h);
    const rows = wh.map((f) => [month(h, `${f.periodo}-01`), month(h, f.fechas['1-3']), ...GROUPS.map((g) => String(Number(f.fechas[g].slice(8))))]);
    return `
<h2>Using the calculator</h2>
<p>The city is set to Bucaramanga. Enter the last digit of your NIT or ID number, pick ordinary or preferential regime, and turn on ReteICA if you withhold: you get the instalments, the return and the twelve monthly withholding dates.</p>
<h2>Annual return and instalments</h2>
${h.table(['Last digit', ...DIG], [['Day in March', ...DIG.map((d) => String(Number(ret[d].slice(8))))]], 'Return for the 2025 tax year, March 2026', ['l', ...DIG.map(() => 'r' as const)])}
<p>Unlike Medellín or Barranquilla, the order runs from 1 to 0, over just over three weeks.</p>
<h2>Monthly ICA withholding in 2026</h2>
${h.table(['Period', 'Due in', 'Digits 1 to 3', 'Digits 4 to 6', 'Digits 7 to 0'], rows, 'Day of the month. The December period falls due in January 2027', ['l', 'l', 'r', 'r', 'r'])}
<p>The March row already shows the change for digits 7 to 0. The site also covers ${h.a('ica-barranquilla', 'Barranquilla ICA')} and ${h.a('ica-bogota', 'Bogotá ICA')}; ${h.a('renta-pj', 'company income tax')} follows the national DIAN calendar.</p>`;
  },
});
