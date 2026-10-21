import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';
import type { FestivoId } from '../../lib/engine/fechas';

/** Colombian public holidays 2026 (Law 51 of 1983 and Law 2578 of 2026) and business days in the year. */
const NOMBRE: Record<FestivoId, string> = {
  anio_nuevo: 'New Year\'s Day', reyes: 'Epiphany (Reyes Magos)', san_jose: 'Saint Joseph', jueves_santo: 'Maundy Thursday', viernes_santo: 'Good Friday',
  trabajo: 'Labour Day', ascension: 'Ascension Day', corpus: 'Corpus Christi', sagrado_corazon: 'Sacred Heart',
  san_pedro: 'Saints Peter and Paul', chiquinquira: 'Our Lady of Chiquinquirá', independencia: 'Independence Day', boyaca: 'Battle of Boyacá',
  asuncion: 'Assumption Day', raza: 'Día de la Raza', todos_santos: 'All Saints\' Day', cartagena: 'Independence of Cartagena',
  inmaculada: 'Immaculate Conception', navidad: 'Christmas Day',
};
const corto = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
const habiles = (h: Helpers) => { let n = 0; for (let d = '2026-01-01'; d <= '2026-12-31'; d = h.M.addDays(d, 1)) if (h.M.esHabil(d)) n++; return n; };
const CIVICO = '2026-04-17';

export default defineText({
  slug: 'colombia-public-holidays',
  nav: 'Public holidays 2026',
  card: 'Every Colombian public holiday in 2026, which ones move to Monday, and how to count business days for a deadline.',
  title: 'Colombia public holidays 2026: all 19 days and business days',
  description: 'Colombia public holidays in 2026: every official day off with its Monday shift, the new July holiday under Law 2578 of 2026, and a business-day counter.',
  h1: 'Public holidays in Colombia, 2026',
  intro: 'The full list for the year, including the new July holiday, plus a business-day counter for any deadline.',
  resume: (h) => {
    const F = h.M.festivos(2026), chq = F.find((f) => f.id === 'chiquinquira')!;
    return `Colombia has ${F.length} public holidays (festivos) in 2026. Under Law 51 of 1983, known as the Ley Emiliani, many religious and civic holidays are observed on the following Monday: Epiphany, Saint Joseph, Saints Peter and Paul, the Assumption, Día de la Raza, All Saints' Day and the Independence of Cartagena, plus Ascension, Corpus Christi and Sacred Heart, which depend on Easter. Easter Sunday fell on ${h.date(h.M.pascua(2026))}. A new holiday joined the list this year: Law 2578 of 2026, art. 6, made July 9 the day of Our Lady of the Rosary of Chiquinquirá, observed on Monday, ${h.date(chq.fecha)}. With these holidays, 2026 has ${habiles(h)} business days from Monday to Friday. Friday, ${h.date(CIVICO)} was a civic day under Decree 500 of 2024: not a public holiday, but DIAN did not count it as a business day for the tax deadlines of Decree 2229 of 2023.`;
  },
  faqs: (h) => {
    const F = h.M.festivos(2026), chq = F.find((f) => f.id === 'chiquinquira')!;
    return [
      { q: 'What is the new public holiday in Colombia in 2026?', a: `Our Lady of the Rosary of Chiquinquirá, created by Law 2578 of June 1, 2026, art. 6. The date is July 9, but it follows the Monday rule of Law 51 of 1983, so in 2026 it was observed on ${h.date(chq.fecha)}. It took the yearly count from 18 to ${F.length} holidays.` },
      { q: 'Which Colombian holidays never move to a Monday?', a: 'New Year\'s Day on January 1, Labour Day on May 1, Independence Day on July 20, the Battle of Boyacá on August 7, the Immaculate Conception on December 8 and Christmas Day, plus Maundy Thursday and Good Friday. All the others are observed on the following Monday whenever they fall on another day of the week.' },
      { q: 'Was April 17, 2026 a day off in Colombia?', a: `It was a civic day under Decree 500 of 2024, not a public holiday. DIAN nevertheless treated it as a non-business day, so several April tax returns that fell on that Friday moved to Monday, ${h.date(h.M.sumarHabiles(CIVICO, 1))}. The counter on this page does not subtract it, so adjust by hand if your deadline crosses that day.` },
    ];
  },
  body: (h) => {
    const rows = h.M.festivos(2026).map((f) => [corto(f.fecha), NOMBRE[f.id], f.trasladado ? corto(f.original) : 'same day']);
    return `
<h2>Using the counter</h2>
<p>Pick a year to list its holidays. In “Deadline” mode, enter the notice date and a number of business days to see when the period ends; in “Count” mode, enter two dates to get the business days between them.</p>
<h2>The 2026 holidays</h2>
${h.table(['Day off', 'Holiday', 'Original date'], rows, 'National public holidays, 2026 (Law 51 of 1983 and Law 2578 of 2026)', ['l', 'l', 'l'])}
<h2>Why the list matters</h2>
<p>If you employ staff, holiday work carries the Sunday and holiday premium of ${h.pct(h.M.recargoDominical('2026-07-01'))} from July 1, 2026 (see ${h.a('recargos', 'pay premiums')}), and ${h.a('vacaciones', 'paid leave')} is counted in business days, so a holiday inside it extends the leave. Tax deadlines such as those in the ${h.a('renta-pn', 'individual income tax calendar')} skip weekends and holidays.</p>
`;
  },
});
