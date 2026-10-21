import { defineText } from '../../lib/define';

const TODAY = '2026-10-21';

export default defineText({
  slug: 'overtime-night-sunday-pay',
  nav: 'Overtime and premiums',
  card: 'Night, overtime, Sunday and holiday hourly rates under the 42-hour week and the 90 % Sunday premium.',
  title: 'Overtime pay 2026 in Colombia: night, Sunday, holiday',
  description: 'Overtime pay 2026 in Colombia: night work from 19:00, 90 % Sunday and holiday premium since July, 42-hour week, and an hourly calculator for recargos.',
  h1: 'Overtime, night and Sunday premiums (recargos)',
  intro: 'The labour reform and the shorter working week changed the value of an hour three times in a year.',
  resume: (h) => {
    const N = h.P.nomina;
    const w = h.M.jornadaSemanal(TODAY), hm = h.M.horasMes(w), hour = N.smmlv / hm;
    return `Pay premiums in Colombia, known as recargos, are worked out on the ordinary hourly rate: monthly salary divided by the hours in a month. Since July 15, 2026 the maximum working week has been ${w} hours (Law 2101 of 2021), so with the usual ${w} ÷ 6 × 30 convention a month has ${h.num(hm)} hours and an hour on the ${h.cop(N.smmlv)} minimum wage (Decree 1469 of 2025) is worth ${h.cop(hour)}. The Labour Code adds ${h.pct(N.recargo_nocturno)} for ordinary night hours (art. 168), ${h.pct(N.extra_diurna)} on top of the hour for daytime overtime and ${h.pct(N.extra_nocturna)} for night overtime. Law 2466 of 2025 moved the start of night work to ${N.nocturno_desde_hora}:00 from ${h.date(N.nocturno_desde_fecha)} (art. 160) and raises the Sunday and holiday premium in steps (art. 179): ${h.pct(N.dominical[0].pct)} from ${h.date(N.dominical[0].desde)}, ${h.pct(N.dominical[1].pct)} from ${h.date(N.dominical[1].desde)} and ${h.pct(N.dominical[2].pct)} from ${h.date(N.dominical[2].desde)}. Overtime is capped at ${N.extras_max_dia} hours a day and ${N.extras_max_semana} a week.`;
  },
  faqs: (h) => {
    const N = h.P.nomina;
    return [
      { q: 'When does night work start in Colombia in 2026?', a: `At ${N.nocturno_desde_hora}:00, running until 6:00. Law 2466 of 2025 rewrote article 160 of the Labour Code, which used to start night work at ${N.nocturno_antes_hora}:00, and the change has applied since ${h.date(N.nocturno_desde_fecha)}, six months after the law was signed. A 15:00 to 23:00 shift now includes four night hours, each carrying a ${h.pct(N.recargo_nocturno)} premium.` },
      { q: 'Why did my hourly rate rise in July when my salary stayed the same?', a: `Because on July 15, 2026 the maximum week fell from ${N.jornada[2].horas} to ${N.jornada[3].horas} hours (Law 2101 of 2021). The same salary spread over fewer hours makes each hour worth more, and the premiums and overtime calculated on it rise too. If your contract sets a shorter week, change the monthly hours in the calculator.` },
      { q: 'What will the Sunday premium be from July 2027?', a: `${h.pct(N.dominical[2].pct)}, under the transitional paragraph of Labour Code article 179 added by Law 2466 of 2025. From ${h.date(N.dominical[2].desde)} a daytime hour on a Sunday or public holiday will be paid at twice the ordinary rate. Employers may apply that rate earlier if they choose; the calculator uses the rate in force on the date you enter.` },
    ];
  },
  body: (h) => {
    const N = h.P.nomina;
    const row = (d: string) => {
      const hm = h.M.horasMes(h.M.jornadaSemanal(d));
      const r = h.M.recargos({ salario: N.smmlv, horasMes: hm, fecha: d, hNocturnas: 1, hExtraDiurna: 1, hExtraNocturna: 1, hDominical: 1 });
      return [h.date(d), `${h.M.jornadaSemanal(d)} h`, h.cop(r.hora), h.cop(r.nocturnas), h.cop(r.extraDiurna), h.cop(r.extraNocturna), h.cop(r.dominical)];
    };
    return `
<h2>Using the calculator</h2>
<p>Enter the salary, the date worked and how many night, overtime and Sunday or holiday hours were done in the month. The monthly hours fill in from the week in force on that date, and you can change them if your contract sets another.</p>
<h2>One hour on the minimum wage, before and after each change</h2>
${h.table(['Date', 'Week', 'Ordinary hour', 'Night premium', 'Day overtime', 'Night overtime', 'Sunday or holiday'], ['2026-06-15', '2026-07-01', TODAY].map(row), `Minimum wage of ${h.cop(N.smmlv)}. The night column is the premium alone; the others include the hour plus its premium`, ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Between June and October the Sunday hour on the minimum wage went up twice: on July 1, when the premium moved from ${h.pct(N.dominical[0].pct)} to ${h.pct(N.dominical[1].pct)}, and on July 15, when the shorter week raised the ordinary hour. Sundays and the ${h.a('festivos', '2026 public holidays')} are paid the same way.</p>
<h2>What the calculator assumes</h2>
<ul>
<li>Hour divisor: weekly hours ÷ 6 × 30. This is a payroll convention, not a legal rule, so adjust it if your employer uses another.</li>
<li>Sunday and holiday hours are treated as daytime; if some were at night, enter them in the night hours box as well.</li>
<li>Overtime cap of ${N.extras_max_dia} hours a day and ${N.extras_max_semana} a week (Labour Code art. 167A, Law 2466 of 2025); the tool does not block larger figures.</li>
</ul>
<p>The hour is based on salary alone, without the transport allowance. What is left of the ${h.a('salario-minimo', 'minimum wage')} after contributions has its own calculator.</p>`;
  },
});
