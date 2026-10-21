import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Último día de vacaciones y día de regreso, de lunes a viernes, sin festivos (Ley 51 de 1983, Ley 2578 de 2026). */
const periodo = (h: Helpers, inicio: string) => {
  const n = h.P.nomina.vacaciones_dias_habiles;
  const ultimo = h.M.sumarHabiles(h.M.addDays(inicio, -1), n);
  return { ultimo, regreso: h.M.sumarHabiles(ultimo, 1), corridos: h.M.diffDays(inicio, ultimo) + 1 };
};

export default defineText({
  slug: 'vacaciones',
  nav: 'Vacaciones',
  card: 'Quince días hábiles por año: cuándo regresa según los festivos de 2026 y cuánto vale compensarlas al salir.',
  title: 'Vacaciones 2026: días hábiles, regreso y compensación',
  description: 'Vacaciones 2026 en Colombia: 15 días hábiles por año trabajado (CST art. 186), fecha de regreso según los festivos y valor en dinero al terminar el contrato.',
  h1: 'Vacaciones: días hábiles, fecha de regreso y valor',
  intro: 'Quince días hábiles no son quince días de calendario: los festivos de 2026 alargan el descanso.',
  resume: (h) => {
    const N = h.P.nomina;
    const p = periodo(h, '2026-12-14');
    const v = h.M.vacacionesValor(N.smmlv, h.M.vacacionesDias(180));
    return `El artículo 186 del Código Sustantivo del Trabajo da ${N.vacaciones_dias_habiles} días hábiles consecutivos de vacaciones remuneradas por cada año de servicio. Como se cuentan en días hábiles, los domingos y los ${h.M.festivos(2026).length} festivos de 2026 no se descuentan del descanso; este año se añadió el lunes 13 de julio por la Ley 2578 de 2026. Quien trabaja de lunes a viernes y sale el ${h.dia('2026-12-14')}, disfruta hasta el ${h.dia(p.ultimo)} y regresa el ${h.dia(p.regreso)}: ${p.corridos} días de calendario. Las vacaciones se pagan con el salario ordinario; el auxilio de transporte no entra, que es la práctica usual porque no es tiempo trabajado. Al terminar el contrato, la Ley 995 de 2005 obliga a compensar en dinero los días causados y no disfrutados, en proporción al tiempo servido: seis meses con el salario mínimo de ${h.cop(N.smmlv)} (Decreto 1469 de 2025) dan ${h.num(h.M.vacacionesDias(180), 1)} días, es decir ${h.cop(v)}, sobre un año comercial de 360 días.`;
  },
  faqs: (h) => {
    const N = h.P.nomina;
    return [
      { q: '¿El sábado cuenta como día hábil de vacaciones?', a: `Depende de cómo esté distribuida su jornada, y la ley no lo resuelve con una regla única para todos los horarios. La tabla de esta página supone una semana de lunes a viernes, sin sábados. Si su contrato o el reglamento interno incluye el sábado como día laboral, la fecha de regreso puede llegar antes: confírmela con el área de nómina antes de reservar el viaje.` },
      { q: '¿Cuánto me pagan por vacaciones no disfrutadas al renunciar?', a: `Quince días de salario por cada 360 días trabajados, en proporción al tiempo, menos los días que ya disfrutó (Ley 995 de 2005). Con un salario de ${h.cop(3000000)} y 270 días desde el último periodo de vacaciones, se causan ${h.num(h.M.vacacionesDias(270), 2)} días, que valen ${h.cop(h.M.vacacionesValor(3000000, h.M.vacacionesDias(270)))}. El monto es el mismo si usted renuncia o si lo despiden.` },
      { q: '¿Las vacaciones se pagan con el auxilio de transporte?', a: `En la práctica usual, no. El auxilio de transporte de ${h.cop(N.auxilio)} (Decreto 1470 de 2025) cubre el desplazamiento al trabajo, y durante las vacaciones no hay desplazamiento. La Ley 1 de 1963 lo suma a la base de las prestaciones, pero las vacaciones son descanso remunerado. Es una interpretación extendida, no una regla escrita; la calculadora la sigue.` },
    ];
  },
  body: (h) => {
    const inicios = ['2026-03-30', '2026-07-06', '2026-09-07', '2026-11-09', '2026-12-14'];
    const filas = inicios.map((d) => { const p = periodo(h, d); return [h.dia(d), h.dia(p.ultimo), h.dia(p.regreso), String(p.corridos)]; });
    return `
<h2>Cómo usar la calculadora</h2>
<p>Escriba su salario y el período trabajado desde las últimas vacaciones que disfrutó. Verá los días causados y su valor en dinero, sin el auxilio de transporte.</p>
<h2>Fecha de regreso según el día de salida</h2>
${h.table(['Primer día', 'Último día', 'Regreso', 'Días de calendario'], filas, `${h.P.nomina.vacaciones_dias_habiles} días hábiles, semana de lunes a viernes, festivos nacionales`, ['l', 'l', 'l', 'r'])}
<p>Sin festivos de por medio, como en septiembre, quince días hábiles ocupan ${periodo(h, '2026-09-07').corridos} días de calendario. Salir en Semana Santa, en julio o en diciembre rinde más: los festivos se suman al descanso sin gastar días. La lista completa está en los ${h.a('festivos', 'festivos de 2026')}.</p>
<h2>Vacaciones en dinero al terminar el contrato</h2>
<p>Al terminar el contrato, los días pendientes se pagan en dinero según la Ley 995 de 2005: ${h.P.nomina.vacaciones_dias_habiles} días por cada 360 trabajados, en proporción, valorados a salario ÷ 30 por día. Ese valor entra en la ${h.a('liquidacion', 'liquidación laboral')}, junto a la ${h.a('prima', 'prima')} y las cesantías.</p>
<ul>
<li>Base: el salario ordinario, sin auxilio de transporte.</li>
<li>Días: los causados desde el ingreso menos los ya disfrutados.</li>
</ul>`;
  },
});
