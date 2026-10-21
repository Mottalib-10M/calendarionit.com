import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Un año completo de 2026 en año comercial : 360 días. */
const anio = (h: Helpers, salario: number) => {
  const dias = h.M.dias360('2026-01-01', '2026-12-31');
  const base = h.M.basePrestaciones(salario);
  const c = h.M.cesantias(base, dias);
  return { dias, base, c, i: h.M.interesesCesantias(c, dias) };
};

export default defineText({
  slug: 'cesantias',
  nav: 'Cesantías',
  card: 'Cesantías e intereses de 2026, con las fechas de consignación al fondo y de pago al trabajador.',
  title: 'Cesantías 2026: intereses, cálculo y fecha de consignación',
  description: 'Cesantías 2026 en Colombia: un mes de salario por año, intereses del 12 % pagados en enero y consignación al fondo antes del 15 de febrero (Ley 50 de 1990).',
  h1: 'Cesantías e intereses: cuánto y cuándo',
  intro: 'Calcule las cesantías de cualquier período y los intereses que se pagan aparte, en enero.',
  resume: (h) => {
    const N = h.P.nomina, m = anio(h, N.smmlv);
    return `Las cesantías son la prestación del artículo 249 del Código Sustantivo del Trabajo: un mes de salario por cada año de servicio, proporcional por fracción de año. Para quien gana hasta ${N.auxilio_tope_smmlv} salarios mínimos, la base incluye el auxilio de transporte (Ley 1 de 1963, art. 7). Con el salario mínimo de 2026, ${h.cop(N.smmlv)} según el Decreto 1469 de 2025, más el auxilio de ${h.cop(N.auxilio)} del Decreto 1470 de 2025, un año completo deja ${h.cop(m.c)} de cesantías y ${h.cop(m.i)} de intereses. Las cesantías de 2026 se consignan en el fondo que eligió el trabajador antes del 15 de febrero de 2027 (Ley 50 de 1990, art. 99); los intereses, del ${h.pct(N.intereses_cesantias)} anual sobre el saldo, se pagan directamente al trabajador en enero de 2027 (Decreto 1072 de 2015, art. 2.2.1.3.4). Si el contrato termina antes, ambos conceptos se pagan con la liquidación. El cálculo usa el año comercial de 360 días.`;
  },
  faqs: (h) => {
    const N = h.P.nomina;
    return [
      { q: '¿Qué pasa si el empleador consigna tarde las cesantías?', a: `La Ley 50 de 1990, art. 99, numeral 3, fija una sanción a cargo del empleador: un día de salario por cada día de retraso en la consignación al fondo. Corre desde el 15 de febrero hasta que el dinero llega a la cuenta individual del trabajador. Por eso conviene revisar el extracto del fondo en la segunda quincena de febrero.` },
      { q: '¿Los intereses de cesantías van al fondo?', a: `No. Los intereses del ${h.pct(N.intereses_cesantias)} anual los paga el empleador directamente al trabajador, en la nómina de enero, por el año anterior. Si no los paga, debe una suma adicional igual a los intereses (Decreto 1072 de 2015, art. 2.2.1.3.8). Cuando el trabajador estuvo solo una parte del año, el porcentaje se reduce en proporción a los días trabajados.` },
      { q: '¿Las cesantías se calculan con el auxilio de transporte si gano más de dos mínimos?', a: `No. El auxilio de transporte del Decreto 1470 de 2025 solo se paga a quien gana hasta ${N.auxilio_tope_smmlv} salarios mínimos, es decir, hasta ${h.cop(N.auxilio_tope_smmlv * N.smmlv)} en 2026. Si su salario es mayor, no recibe auxilio y la base de cesantías es el salario solo. La calculadora lo decide sola a partir del salario que escriba.` },
    ];
  },
  body: (h) => {
    const N = h.P.nomina;
    const sal = [N.smmlv, N.auxilio_tope_smmlv * N.smmlv, 3600000, 6000000];
    const filas = sal.map((s) => { const m = anio(h, s); return [h.cop(s), h.cop(m.base), h.cop(m.c), h.cop(m.i)]; });
    return `
<h2>Cómo usar la calculadora</h2>
<p>Escriba el salario mensual y las fechas de inicio y fin del período: un año calendario, el tiempo desde el ingreso o lo corrido hasta hoy. El resultado separa las cesantías de los intereses, porque se pagan por vías distintas.</p>
<h2>Un año completo de 2026, según el salario</h2>
${h.table(['Salario', 'Base', 'Cesantías', 'Intereses'], filas, `Año calendario 2026 completo (${anio(h, N.smmlv).dias} días). Auxilio de transporte de ${h.cop(N.auxilio)} incluido en la base hasta ${N.auxilio_tope_smmlv} salarios mínimos`, ['r', 'r', 'r', 'r'])}
<p>Entre la segunda y la tercera fila se ve el salto del auxilio: quien gana exactamente ${N.auxilio_tope_smmlv} mínimos todavía lo suma a la base, quien gana un peso más ya no. La calculadora supone un salario fijo durante todo el período.</p>
<h2>El calendario de las cesantías de 2026</h2>
<ul>
<li>Enero de 2027: el empleador paga al trabajador los intereses del ${h.pct(N.intereses_cesantias)} sobre las cesantías de 2026.</li>
<li>Antes del 15 de febrero de 2027: consigna las cesantías de 2026 en el fondo elegido por el trabajador.</li>
<li>Al terminar el contrato: cesantías e intereses del año en curso se pagan con la ${h.a('liquidacion', 'liquidación laboral')}, junto con la ${h.a('prima', 'prima de servicios')} proporcional.</li>
</ul>
<p>Los valores de 2027 dependen del salario mínimo de ese año, que está por publicarse; el auxilio y el tope de dos mínimos cambiarán con él. Vea el ${h.a('salario-minimo', 'salario mínimo vigente')} y cómo se fija.</p>`;
  },
});
