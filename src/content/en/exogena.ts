import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Third-party information (exógena) for tax year 2025, filed in 2026: DIAN Res. 000227 of 2025, 000012 and 000021 of 2026. */
const corto = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const rango = (h: Helpers, f: Record<string, string>) => { const v = Object.values(f).sort(); return `${h.date(v[0]).replace(/, \d{4}$/, '')} to ${h.date(v[v.length - 1])}`; };
const PJ = (h: Helpers) => h.M.tabla('exogena')[0].fechas;
const GC = (h: Helpers) => h.M.tabla('exogena_gc')[0].fechas;
const OTROS = (h: Helpers) => h.M.CALENDARIO.exogena.otros;
/** Res. 000021 of 2026, art. 9.2: format 2820 for filers who had used no electronic signature instrument. */
const F2820_SIN_FIRMA = '2026-07-31';

export default defineText({
  slug: 'exogena-information-return',
  nav: 'Exógena reporting',
  card: 'Tax year 2025 third-party information deadlines by NIT digits, with the 2026 amending resolutions.',
  title: 'Exógena information return 2026: deadlines by NIT digits',
  description: 'Exógena information return in Colombia, 2026: tax year 2025 deadlines by NIT digits for companies, individuals and large taxpayers, with the 2026 DIAN changes.',
  h1: 'Exógena: 2026 reporting deadlines by NIT',
  intro: 'When third-party information for tax year 2025 had to reach DIAN, including the two amendments of 2026.',
  resume: (h) => {
    const pj = PJ(h), gc = GC(h), [f2839, f1034] = OTROS(h);
    return `Información exógena is the annual bulk report in which companies, many individuals and other filers tell DIAN about payments, withholdings, balances and other dealings with third parties. For tax year 2025 it was filed in 2026 under DIAN Resolution 000227 of 2025, art. 1.3.9.1.3, which sets the deadlines in business days. Companies and individuals use the last two NIT digits, check digit excluded, in ${Object.keys(pj).length} blocks of five: 01-05 was due on ${h.date(pj['01-05'])} and 96-00 on ${h.date(pj['96-00'])}. Large taxpayers use the last digit and reported ${rango(h, gc)}; Resolution 000012 of 2026, art. 4, moved digits 1, 2 and 3 to May ${Number(gc['1'].slice(8))}, ${Number(gc['2'].slice(8))} and ${Number(gc['3'].slice(8))}. Resolution 000021 of 2026, art. 9, extended formats 2839, 2840, 2823 to 2829, 2833 to 2835 and 2820 to ${h.date(f2839.fecha)}, except format 2820 filed without an electronic signature, due ${h.date(F2820_SIN_FIRMA)}. Format 1034 was due ${h.date(f1034.fecha)}. Tax year 2026 deadlines are yet to be published.`;
  },
  faqs: (h) => {
    const gc = GC(h), [f2839] = OTROS(h);
    return [
      { q: 'What did Resolution 000012 of 2026 change for large taxpayers?', a: `Article 4 moved the exógena deadlines of large taxpayers whose NIT ends in 1, 2 or 3, which under Resolution 000227 of 2025 fell in late April and early May. They became: digit 1, ${h.date(gc['1'])}; digit 2, ${h.date(gc['2'])}; digit 3, ${h.date(gc['3'])}. Digits 4 to 0 kept their original dates.` },
      { q: 'How long did filers have for exógena formats 2820 to 2840?', a: `Until ${h.date(f2839.fecha)}, under article 9 of Resolution 000021 of 2026, for formats 2839 and 2840, 2823 to 2829, 2833 to 2835 and 2820. The exception was format 2820 for filers who had submitted it without an electronic signature instrument: their window closed on ${h.date(F2820_SIN_FIRMA)}.` },
      { q: 'When is exógena for tax year 2026 due?', a: 'It will be filed in 2027 and its dates are yet to be published. DIAN usually sets each tax year\'s deadlines by resolution and then turns them into calendar days on its exógena page. Until that happens, this page does not guess any date and keeps only the tax year 2025 schedule.' },
    ];
  },
  body: (h) => {
    const pj = Object.entries(PJ(h)), gc = GC(h);
    const mitad = pj.length / 2;
    const filas = pj.slice(0, mitad).map(([k, d], i) => [k, corto(d), pj[mitad + i][0], corto(pj[mitad + i][1])]);
    const orden = Object.entries(gc).sort((a, b) => a[1].localeCompare(b[1]));
    const ej = pj.find(([k]) => h.M.cubre(k, '900123453'))!;
    return `
<h2>Finding your deadline</h2>
<p>The tool opens with exógena ticked for a company with NIT 900.123.453: its last two digits, 53, fall in block ${ej[0]}, due on ${h.date(ej[1])}. For a large taxpayer, change the type of taxpayer.</p>
<h2>Companies and individuals</h2>
${h.table(['Digits', 'Due', 'Digits', 'Due'], filas, 'Exógena for tax year 2025, last two NIT digits', ['l', 'l', 'l', 'l'])}
<h2>Large taxpayers</h2>
<p>Since the 2026 change, the order no longer follows the digits: ${orden.map(([k, d]) => `${k} (${corto(d)})`).join(', ')}.</p>
<p>For a foreign-owned subsidiary, the exógena window overlaps with the ${h.a('renta-pj', 'corporate income tax')} return in May. Individuals who must report should keep the ${h.a('renta-pn', 'individual income tax')} window in mind, and the business-day count skips every ${h.a('festivos', 'Colombian holiday')}.</p>
`;
  },
});
