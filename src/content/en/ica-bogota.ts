import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';
import { periodo } from '../../lib/etiquetas';

/** Bogotá ICA and ICA withholding 2026 (Resolution SDH-000195 of 2025): single dates, no NIT digit. */
const B = (h: Helpers) => h.M.ciudad('bogota')!;
const reg = (h: Helpers, id: string) => B(h).regimenes.find((r) => r.id === id)!;
const una = (r: { fechas: Record<string, string> }) => r.fechas.todos;
/** 391 UVT, read from the two-month regime text in ica-2026.json. */
const umbral = (h: Helpers) => Number(/(\d+) UVT/.exec(reg(h, 'bimestral').quien.es)![1]);
const corto = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { day: 'numeric', month: 'short', ...(iso.startsWith('2026') ? {} : { year: 'numeric' }), timeZone: 'UTC' });
/** Annual fire surcharge: the resolution (art. 2) says February 27, 2027; the official calendar points to the annual regime date. */
const BOMBERIL_RES = '2027-02-27';

export default defineText({
  slug: 'bogota-ica-tax',
  nav: 'Bogotá ICA',
  card: 'Bogotá ICA dates for 2026: two-month, annual and preferential returns plus ICA withholding, the same for every NIT.',
  title: 'Bogotá ICA tax 2026: two-month, annual and withholding dates',
  description: 'Bogotá ICA tax 2026: the six two-month deadlines, the annual and preferential return in February 2027 and ICA withholding under Resolution SDH-000195 of 2025.',
  h1: 'Bogotá ICA tax: the 2026 calendar',
  intro: 'In Bogotá, ICA does not depend on your NIT: every business in the same regime shares the same date.',
  resume: (h) => {
    const bim = reg(h, 'bimestral').filas, anual = una(reg(h, 'anual').filas[0]), rete = B(h).retencion!.filas;
    return `ICA (impuesto de industria y comercio) is the municipal tax on business activity, and in Bogotá its 2026 deadlines come from Resolution SDH-000195 of 2025 of the District Treasury (Secretaría Distrital de Hacienda). Unlike national DIAN deadlines, they do not depend on the last NIT digit: each regime has a single date. Businesses in the ordinary regime whose ICA due for tax year 2025 exceeded ${umbral(h)} UVT, or ${h.cop(umbral(h) * h.P.uvt['2025'])}, file every two months, from ${h.date(una(bim[0]))} to ${h.date(una(bim[bim.length - 1]))}. Those below that line file one annual return for tax year 2026 on ${h.date(anual)}, the same date as the preferential regime. Withholding agents file ICA withholding (ReteICA) every two months, from ${h.date(una(rete[0]))} to ${h.date(una(rete[rete.length - 1]))}. There is no early-payment discount on ICA. The official calendar version of July 28, 2026 changed no ICA date for the July 13 holiday.`;
  },
  faqs: (h) => {
    const anual = una(reg(h, 'anual').filas[0]);
    return [
      { q: 'Does the last NIT digit change my Bogotá ICA deadline?', a: 'No. Unlike the national DIAN calendar, Resolution SDH-000195 of 2025 sets one date per period for every business in the same regime, whatever the NIT. ICA withholding works the same way. That is why the tool shows identical Bogotá dates whichever digit you type, while national deadlines in the same list still move with it.' },
      { q: 'Which Bogotá businesses file ICA once a year?', a: `Ordinary-regime businesses whose ICA due for the whole of tax year 2025 did not exceed ${umbral(h)} UVT (${h.cop(umbral(h) * h.P.uvt['2025'])}). They file a single return for tax year 2026 no later than ${h.date(anual)}. Small taxpayers in the preferential regime share that date.` },
      { q: 'Does Bogotá offer an early-payment discount on ICA?', a: 'No. The early-payment discounts in the 2026 deadlines resolution apply to property tax and vehicle tax, not to ICA. The district calendar mentions a voluntary contribution with the ICA payment, but that is an optional extra amount chosen by the taxpayer, not a reduction of the tax.' },
      { q: 'When is the annual fire surcharge (sobretasa bomberil) due in Bogotá?', a: `Two dates have been published. Article 2 of Resolution SDH-000195 of 2025 says ${h.date(BOMBERIL_RES)}, while the official calendar refers to the annual ordinary regime date, ${h.date(anual)}. To be safe, file it by ${h.date(anual)}. Businesses on the two-month cycle use the same two-month ICA dates.` },
    ];
  },
  body: (h) => {
    const bim = reg(h, 'bimestral').filas, rete = B(h).retencion!.filas, anual = una(reg(h, 'anual').filas[0]);
    const rows = bim.map((r, i) => [periodo(r.periodo, 'en'), corto(una(r)), corto(una(rete[i]))]);
    rows.push(['Tax year 2026, annual and preferential', corto(anual), 'n/a']);
    return `
<h2>Using the tool</h2>
<p>Bogotá is preselected: choose your ICA regime (two-month, annual or preferential) and tick ICA withholding if you are an agent. District dates join the DIAN deadlines in one list.</p>
<h2>2026 dates</h2>
${h.table(['Period', 'Two-month ICA', 'ICA withholding'], rows, 'Filing and payment, Resolution SDH-000195 of 2025', ['l', 'l', 'l'])}
<p>ICA withholding comes due before ICA for the same period: for January-February, ${h.date(una(rete[0]))} against ${h.date(una(bim[0]))} for the tax itself. The sixth 2026 period is filed in 2027, on dates already set by the same resolution.</p>
<p>A foreign company with offices in several cities deals with one calendar per city: compare ${h.a('ica-medellin', 'Medellín ICA')} and ${h.a('ica-cali', 'Cali ICA')}. National obligations such as ${h.a('renta-pj', 'corporate income tax')} still follow the NIT.</p>
`;
  },
});
