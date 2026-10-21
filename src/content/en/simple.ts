import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';
import { periodo } from '../../lib/etiquetas';

/** Simple Tax Regime (RST): annual return, annual consolidated VAT and two-month advances. */
const corto = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { day: 'numeric', month: 'short', ...(iso.startsWith('2026') ? {} : { year: 'numeric' }), timeZone: 'UTC' });
const rango = (h: Helpers, f: Record<string, string>) => { const v = Object.values(f).sort(); return `${h.date(v[0]).replace(/, \d{4}$/, '')} to ${h.date(v[v.length - 1])}`; };

export default defineText({
  slug: 'simple-tax-regime',
  nav: 'Simple Tax Regime',
  card: 'Annual return, annual consolidated VAT and the six two-month advance payments of the SIMPLE regime in 2026.',
  title: 'Simple Tax Regime Colombia 2026: advances and return dates',
  description: 'Simple Tax Regime in Colombia, 2026: dates for the annual return, the annual consolidated VAT return and the six two-month advance payments, by last NIT digit.',
  h1: 'Simple Tax Regime (SIMPLE): 2026 deadlines',
  intro: 'One annual return, one annual VAT return and six advance payments: the full calendar of a SIMPLE taxpayer.',
  resume: (h) => {
    const anual = h.M.tabla('rst_anual')[0], iva = h.M.tabla('rst_iva')[0], ant = h.M.tabla('rst_anticipo');
    return `Colombia's Simple Tax Regime (Régimen Simple de Tributación, or SIMPLE) is an optional regime for small businesses and freelancers, and in 2026 it has three kinds of deadline, all keyed to the last digit of the NIT without the check digit. The annual consolidated return for tax year 2025 was due ${rango(h, anual.fechas)}, by digit pairs 1-2, 3-4, 5-6, 7-8 and 9-0. Members registered for VAT filed their annual consolidated VAT return earlier, ${rango(h, iva.fechas)}, with the same pairs. On top of that come ${ant.length} two-month advance payments (anticipos): January-February is due ${rango(h, ant[0].fechas)} and the last one, for November-December, ${rango(h, ant[ant.length - 1].fechas)}. The rules come from Decree 2229 of 2023 and the dates from the DIAN 2026 calendar, including the July shift for the Monday, July 13 holiday (Law 2578 of 2026). The annual return dates for tax year 2026 are yet to be published.`;
  },
  faqs: (h) => {
    const ant = h.M.tabla('rst_anticipo'), anual = h.M.tabla('rst_anual')[0];
    return [
      { q: 'When is the first SIMPLE advance payment of 2026 due?', a: `The January-February advance is due ${rango(h, ant[0].fechas)}, after the annual return in April. The next ones follow in June, July, September and November, and the November-December advance in January 2027. Each falls on the day set by the last NIT digit, so your place in the order stays the same all year.` },
      { q: 'Does a SIMPLE member also file the ordinary income tax return?', a: `Not for the same year. The unified SIMPLE tax replaces income tax for its members, and the annual SIMPLE return, due ${rango(h, anual.fechas)} in 2026, takes the place of the ordinary return. That is why ticking SIMPLE in the tool removes the income tax deadline and adds the advances instead.` },
      { q: 'Which SIMPLE dates are still unpublished?', a: 'Those falling in 2027: the annual consolidated return and annual VAT return for tax year 2026, and the advances for the periods of 2027. Decree 2229 of 2023 keeps its business-day rules, but DIAN has not yet put those days in a calendar. The November-December 2026 advance, by contrast, already has an official date.' },
    ];
  },
  body: (h) => {
    const anual = h.M.tabla('rst_anual')[0], iva = h.M.tabla('rst_iva')[0], ant = h.M.tabla('rst_anticipo');
    const filasAnual = Object.keys(anual.fechas).map((k) => [k, corto(iva.fechas[k]), corto(anual.fechas[k])]);
    const filasAnt = ant.map((x) => [periodo(x.periodo, 'en'), corto(x.fechas['1']), corto(x.fechas['0'])]);
    return `
<h2>The tool in SIMPLE mode</h2>
<p>SIMPLE with VAT is already ticked. Enter your last NIT digit; if you are not registered for VAT, untick it and the annual VAT return leaves the list.</p>
<h2>Annual returns for tax year 2025</h2>
${h.table(['Last digit', 'Annual consolidated VAT', 'Annual SIMPLE return'], filasAnual, '2026 deadlines by digit pair', ['l', 'l', 'l'])}
<h2>Two-month advances in 2026</h2>
${h.table(['Period', 'Digit 1', 'Digit 0'], filasAnt, 'Electronic advance payment slip; digits 2 to 9 fall on the business days in between', ['l', 'l', 'l'])}
<p>The advances share their days with several ordinary-regime deadlines, such as the two-month ${h.a('iva', 'VAT return')}. A freelancer who leaves SIMPLE goes back to the ${h.a('renta-pn', 'individual income tax calendar')}. In Medellín, being in SIMPLE also rules out the preferential ICA system (Agreement 093 of 2023, art. 62): see ${h.a('ica-medellin', 'ICA in Medellín')}.</p>
`;
  },
});
