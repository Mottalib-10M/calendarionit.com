import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/* 2027 : festivos calculados por el motor (Ley 51 de 1983, Ley 2578 de 2026), recargo dominical de la Ley 2466 de 2025
   (params nomina.dominical). Calendario DIAN, UVT y salario mínimo 2027 sin publicar al 22/11/2026 : la página lo dice. */
const habiles = (h: Helpers, y: number) => { let n = 0; for (let d = `${y}-01-01`; d <= `${y}-12-31`; d = h.M.addDays(d, 1)) if (h.M.esHabil(d)) n++; return n; };
const lunes = (h: Helpers, y: number) => h.M.festivos(y).filter((f) => new Date(`${f.fecha}T00:00:00Z`).getUTCDay() === 1).length;
const pascua27 = (h: Helpers) => h.M.addDays(h.M.festivos(2027).find((f) => f.id === 'viernes_santo')!.fecha, 2);

export default defineText({
  slug: 'calendario-proximo-ano',
  nav: 'Calendario 2027',
  card: 'Festivos, días hábiles y recargo dominical de 2027, y lo que la DIAN aún no publica.',
  title: 'Calendario 2027 vs 2026 en Colombia: festivos y recargos',
  description: 'Calendario 2027 vs 2026 en Colombia: los 19 festivos de 2027 con su lunes, días hábiles, recargo dominical del 100 % desde julio y lo que falta de la DIAN.',
  h1: 'Calendario 2027 en Colombia: lo que ya se sabe',
  intro: 'Elija 2027 en el contador para ver los festivos y contar días hábiles; abajo, lo que cambia frente a 2026 y lo que aún no se publica.',
  resume: (h) => `El calendario de 2027 en Colombia ya tiene una parte fija por ley y otra que falta. Lo fijo son los festivos: la Ley 51 de 1983 y la Ley 2578 de 2026 dan ${h.M.festivos(2027).length} días, ${lunes(h, 2027)} de ellos en lunes, con el Domingo de Pascua el ${h.date(pascua27(h))}; quedan ${habiles(h, 2027)} días hábiles, frente a ${habiles(h, 2026)} en 2026. También es fijo el recargo dominical y festivo: la Ley 2466 de 2025 lo lleva del ${h.pct(h.M.recargoDominical('2027-06-30'))} al ${h.pct(h.M.recargoDominical('2027-07-01'))} el 1 de julio de 2027, mientras la jornada se queda en ${h.M.jornadaSemanal('2027-01-01')} horas. Lo que falta, al 22 de noviembre de 2026: el calendario tributario de la DIAN, la UVT y el salario mínimo de 2027, que se publican en diciembre. Esta página no proyecta esas cifras.`,
  faqs: (h) => [
    { q: '¿Cuántos festivos tiene Colombia en 2027?', a: `${h.M.festivos(2027).length}, los mismos de 2026: los dieciocho de la Ley 51 de 1983 y el de la Virgen de Chiquinquirá de la Ley 2578 de 2026. ${lunes(h, 2027)} caen en lunes, por el traslado de la Ley Emiliani o por el calendario. El contador de arriba los lista con su fecha original.` },
    { q: '¿Cuánto es el recargo dominical en 2027?', a: `Del ${h.pct(h.M.recargoDominical('2027-06-30'))} hasta el 30 de junio de 2027 y del ${h.pct(h.M.recargoDominical('2027-07-01'))} desde el 1 de julio de 2027, según la Ley 2466 de 2025. Se aplica a la hora ordinaria por cada hora trabajada en domingo o festivo, sin contar los recargos nocturnos o de horas extras que se sumen.` },
    { q: '¿Cuándo sale el calendario tributario 2027 de la DIAN?', a: 'Normalmente en diciembre, con la resolución o el decreto que fija los plazos del año. El Decreto 2229 de 2023 mantiene sus reglas en días hábiles para los años siguientes, así que la forma del calendario no cambia, pero las fechas exactas solo valen cuando la DIAN las publica. Esta web las cargará ese día.' },
    { q: '¿Ya se conoce la UVT de 2027?', a: 'No al 22 de noviembre de 2026. La DIAN la fija cada año por resolución antes del 1 de enero, con la variación del índice de precios que exige el artículo 868 del Estatuto Tributario. Las cifras que circulan son cálculos de terceros; aquí se usará la de la resolución, no una estimación.' },
  ],
  body: (h) => `
<h2>Calendario 2027 frente a 2026</h2>
${h.table(['', '2026', '2027'], [
  ['Festivos nacionales', String(h.M.festivos(2026).length), String(h.M.festivos(2027).length)],
  ['Festivos en lunes', String(lunes(h, 2026)), String(lunes(h, 2027))],
  ['Días hábiles (lunes a viernes sin festivos)', String(habiles(h, 2026)), String(habiles(h, 2027))],
  ['Recargo dominical y festivo', `${h.pct(h.M.recargoDominical('2026-01-01'))}, ${h.pct(h.M.recargoDominical('2026-07-01'))} desde julio`, `${h.pct(h.M.recargoDominical('2027-01-01'))}, ${h.pct(h.M.recargoDominical('2027-07-01'))} desde julio`],
  ['Jornada máxima semanal', `${h.M.jornadaSemanal('2026-01-01')} h, ${h.M.jornadaSemanal('2026-07-15')} h desde el 15 de julio`, `${h.M.jornadaSemanal('2027-01-01')} h`],
  ['Calendario DIAN, UVT, salario mínimo', 'publicados', 'por publicarse'],
], 'Festivos y días hábiles calculados con la Ley 51 de 1983 y la Ley 2578 de 2026; recargo y jornada según la Ley 2466 de 2025 y la Ley 2101 de 2021.', ['l', 'r', 'r'])}
<h2>Qué cambia en la nómina</h2>
<p>El salto del recargo dominical es el cambio de 2027 que ya se puede calcular. Quien trabaja un domingo de julio de 2027 cobra un recargo del ${h.pct(h.M.recargoDominical('2027-07-01'))} sobre su hora ordinaria, el doble de esa hora, frente al ${h.pct(h.M.recargoDominical('2027-06-30'))} en junio. La calculadora de ${h.a('recargos', 'recargos y horas extras')} aplica la tasa que corresponde a la fecha que usted elija. La jornada de ${h.M.jornadaSemanal('2027-01-01')} horas termina la reducción de la Ley 2101 de 2021: no hay otro escalón en 2027.</p>
<h2>Qué falta de la DIAN y de las alcaldías</h2>
<p>Las fechas de ${h.a('renta-pn', 'renta')}, IVA y retención de 2027 dependen del calendario que la DIAN publique, y el ICA de cada ciudad de su propia resolución de diciembre. El salario mínimo y el auxilio de transporte de 2027 salen por decreto a fin de año; con ellos cambian las cesantías, la prima y los topes. Hasta entonces, las tablas de esta web siguen en 2026 y lo dicen.</p>
`,
});
