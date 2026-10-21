import { defineText } from '../../lib/define';

const HOY = '2026-10-21';

export default defineText({
  slug: 'recargos-horas-extras',
  nav: 'Recargos y horas extras',
  card: 'Valor de la hora nocturna, extra, dominical y festiva con la jornada de 42 horas y el recargo del 90 %.',
  title: 'Recargos y horas extras 2026: nocturno, dominical y festivo',
  description: 'Recargos y horas extras 2026 en Colombia: nocturno desde las 19:00, dominical y festivo al 90 % desde julio, jornada de 42 horas. Calculadora por horas.',
  h1: 'Recargos nocturnos, dominicales y horas extras',
  intro: 'La reforma laboral y la reducción de jornada cambiaron el valor de la hora tres veces en un año.',
  resume: (h) => {
    const N = h.P.nomina;
    const j = h.M.jornadaSemanal(HOY), hm = h.M.horasMes(j), hora = N.smmlv / hm;
    return `Los recargos de 2026 en Colombia se calculan sobre la hora ordinaria, que es el salario mensual dividido entre las horas del mes. Desde el 15 de julio de 2026 la jornada máxima es de ${j} horas semanales (Ley 2101 de 2021), así que con la convención de ${j} ÷ 6 × 30 el mes tiene ${h.num(hm)} horas y la hora del salario mínimo de ${h.cop(N.smmlv)} (Decreto 1469 de 2025) vale ${h.cop(hora)}. Sobre ella, el Código Sustantivo del Trabajo fija: recargo nocturno del ${h.pct(N.recargo_nocturno)} (art. 168), hora extra diurna con ${h.pct(N.extra_diurna)} adicional y extra nocturna con ${h.pct(N.extra_nocturna)}. La Ley 2466 de 2025 movió el inicio del trabajo nocturno a las ${N.nocturno_desde_hora}:00 desde el ${h.date(N.nocturno_desde_fecha)} (art. 160) y sube por etapas el recargo dominical y festivo (art. 179): ${h.pct(N.dominical[0].pct)} desde el ${h.date(N.dominical[0].desde)}, ${h.pct(N.dominical[1].pct)} desde el ${h.date(N.dominical[1].desde)} y ${h.pct(N.dominical[2].pct)} desde el ${h.date(N.dominical[2].desde)}.`;
  },
  faqs: (h) => {
    const N = h.P.nomina;
    return [
      { q: '¿Desde qué hora se paga recargo nocturno en 2026?', a: `Desde las ${N.nocturno_desde_hora}:00 y hasta las 6:00. La Ley 2466 de 2025 cambió el artículo 160 del Código Sustantivo del Trabajo, que antes fijaba el inicio a las ${N.nocturno_antes_hora}:00, y el cambio rige desde el ${h.date(N.nocturno_desde_fecha)}, seis meses después de la sanción de la ley. Un turno de 15:00 a 23:00 tiene hoy cuatro horas nocturnas, con un recargo del ${h.pct(N.recargo_nocturno)} cada una.` },
      { q: '¿Por qué subió el valor de mi hora en julio si el salario no cambió?', a: `Porque el 15 de julio de 2026 la jornada máxima bajó de ${N.jornada[2].horas} a ${N.jornada[3].horas} horas semanales (Ley 2101 de 2021). Con el mismo salario y menos horas en el mes, cada hora vale más, y los recargos y extras, que se calculan sobre ella, también suben. Si su contrato fija otra jornada menor, ajuste las horas del mes en la calculadora.` },
      { q: '¿Cuánto será el recargo dominical en julio de 2027?', a: `El ${h.pct(N.dominical[2].pct)}, según el parágrafo transitorio del artículo 179 del Código Sustantivo del Trabajo, agregado por la Ley 2466 de 2025. Desde el ${h.date(N.dominical[2].desde)} una hora diurna en domingo o festivo se pagará al doble de la hora ordinaria. El empleador puede aplicar ese porcentaje antes si quiere; la calculadora toma el vigente en la fecha que usted escriba.` },
    ];
  },
  body: (h) => {
    const N = h.P.nomina;
    const fila = (fecha: string) => {
      const hm = h.M.horasMes(h.M.jornadaSemanal(fecha));
      const r = h.M.recargos({ salario: N.smmlv, horasMes: hm, fecha, hNocturnas: 1, hExtraDiurna: 1, hExtraNocturna: 1, hDominical: 1 });
      return [h.date(fecha), `${h.M.jornadaSemanal(fecha)} h`, h.cop(r.hora), h.cop(r.nocturnas), h.cop(r.extraDiurna), h.cop(r.extraNocturna), h.cop(r.dominical)];
    };
    return `
<h2>Cómo usar la calculadora</h2>
<p>Escriba el salario, la fecha del trabajo y cuántas horas nocturnas, extras y dominicales o festivas hizo en el mes; las horas ordinarias del mes se llenan solas con la jornada vigente en esa fecha y puede cambiarlas si su contrato pacta otra.</p>
<h2>Una hora con el salario mínimo, antes y después de cada cambio</h2>
${h.table(['Fecha', 'Jornada', 'Hora ordinaria', 'Recargo nocturno', 'Extra diurna', 'Extra nocturna', 'Dominical o festiva'], ['2026-06-15', '2026-07-01', HOY].map(fila), `Salario mínimo de ${h.cop(N.smmlv)}. El recargo nocturno es solo el adicional; las demás columnas incluyen la hora y su recargo`, ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Entre junio y octubre la hora dominical del salario mínimo subió dos veces: el 1 de julio por el paso del ${h.pct(N.dominical[0].pct)} al ${h.pct(N.dominical[1].pct)}, y el 15 de julio porque la hora ordinaria creció al bajar la jornada. Los domingos y los ${h.a('festivos', 'festivos de 2026')} se pagan igual.</p>
<h2>Supuestos de la calculadora</h2>
<ul>
<li>Divisor de horas: jornada semanal ÷ 6 × 30. Es una convención de nómina, no una regla legal; ajústela si su empresa usa otra.</li>
<li>Las horas en domingo o festivo se toman como diurnas; si fueron nocturnas, súmelas también en la casilla de horas nocturnas.</li>
<li>Tope de horas extras: ${N.extras_max_dia} al día y ${N.extras_max_semana} a la semana (CST art. 167A, Ley 2466 de 2025). La calculadora no bloquea cifras mayores.</li>
</ul>
<p>La hora se calcula sobre el salario, sin el auxilio de transporte. Lo que queda del ${h.a('salario-minimo', 'salario mínimo')} después de aportes está en su propia calculadora.</p>`;
  },
});
