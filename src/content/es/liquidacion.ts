import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Caso de ejemplo : contrato indefinido, salario fijo, 15 días de vacaciones ya disfrutados. */
const ING = '2024-02-01', RET = '2026-09-30', SAL = 2500000, TOMADAS = 15;
const caso = (h: Helpers, despido: boolean) => h.M.liquidacion({ salario: SAL, ingreso: ING, retiro: RET, despido, contrato: 'indefinido', vacTomadas: TOMADAS });

export default defineText({
  slug: 'liquidacion-laboral',
  nav: 'Liquidación laboral',
  card: 'Cesantías, intereses, prima, vacaciones e indemnización al terminar el contrato, con las cifras de 2026.',
  title: 'Liquidación laboral 2026: calculadora con indemnización',
  description: 'Liquidación laboral 2026 en Colombia: cesantías, intereses, prima, vacaciones pendientes e indemnización del art. 64 del CST, para renuncia o despido.',
  h1: 'Liquidación laboral: cuánto le deben al terminar el contrato',
  intro: 'Escriba su salario y sus fechas, y vea cada concepto de la liquidación por separado.',
  resume: (h) => {
    const N = h.P.nomina, r = caso(h, false), d = caso(h, true);
    return `La liquidación laboral en Colombia reúne lo que se paga al terminar el contrato: las cesantías del año en curso (CST art. 249), sus intereses del ${h.pct(N.intereses_cesantias)} anual, la prima de servicios del semestre (CST art. 306), las vacaciones no disfrutadas compensadas en dinero (Ley 995 de 2005) y, solo si hubo despido sin justa causa, la indemnización del CST art. 64. En 2026 el salario mínimo es de ${h.cop(N.smmlv)} (Decreto 1469 de 2025) y el auxilio de transporte de ${h.cop(N.auxilio)} (Decreto 1470 de 2025); quien gana hasta ${N.auxilio_tope_smmlv} salarios mínimos suma ese auxilio a la base de cesantías, intereses y prima (Ley 1 de 1963, art. 7). Con salario de ${h.cop(SAL)}, contrato indefinido del ${h.date(ING)} al ${h.date(RET)} y ${TOMADAS} días de vacaciones tomados, la liquidación da ${h.cop(r.total)} por renuncia y ${h.cop(d.total)} por despido sin justa causa, porque la indemnización agrega ${h.num(d.indemDias, 1)} días de salario. Las fracciones se cuentan en año comercial de 360 días.`;
  },
  faqs: (h) => {
    const I = h.P.nomina.indemnizacion;
    return [
      { q: '¿Si renuncio, me pagan indemnización?', a: `No. La indemnización del artículo 64 del Código Sustantivo del Trabajo solo se debe cuando el empleador termina el contrato sin justa causa. Si usted renuncia, la liquidación incluye cesantías, intereses, prima proporcional y vacaciones pendientes, pero no la indemnización. Por eso la calculadora la muestra únicamente al elegir «Despido sin justa causa».` },
      { q: '¿Cómo se calcula la indemnización en un contrato a término fijo?', a: `Se pagan los salarios del tiempo que faltaba para cumplir el plazo pactado, según el CST art. 64. Si quedaban 60 días de contrato, la indemnización son 60 días de salario. En un contrato por obra o labor se paga el tiempo que faltaba de la obra, con un mínimo de ${I.obra_minimo} días. Escriba esos días en la casilla que aparece al elegir el despido.` },
      { q: '¿Por qué la liquidación no incluye las cesantías de años anteriores?', a: `Porque, según la Ley 50 de 1990, art. 99, las cesantías de cada año se consignan en el fondo antes del 15 de febrero del año siguiente. Al terminar el contrato el empleador solo liquida las del año en curso; las anteriores ya están en su fondo de cesantías. Si su empleador no las consignó, súmelas aparte: la calculadora supone que sí lo hizo.` },
    ];
  },
  body: (h) => {
    const N = h.P.nomina, I = N.indemnizacion, r = caso(h, false), d = caso(h, true);
    const fila = (c: string, a: number, b: number) => [c, h.cop(a), h.cop(b)];
    return `
<h2>Cómo usar la calculadora</h2>
<p>Escriba el salario mensual, las fechas de ingreso y de retiro, el tipo de contrato y el motivo; si elige despido en un contrato a término fijo o por obra, aparece la casilla de días que faltaban.</p>
<h2>Renuncia o despido: el mismo caso, dos resultados</h2>
${h.table(['Concepto', 'Renuncia', 'Despido sin justa causa'], [
  fila(`Cesantías (${r.diasAnio} días del año)`, r.cesantias, d.cesantias),
  fila('Intereses sobre cesantías', r.intereses, d.intereses),
  fila(`Prima (${r.diasSemestre} días del semestre)`, r.prima, d.prima),
  fila(`Vacaciones pendientes (${h.num(r.vacDias, 1)} días)`, r.vacaciones, d.vacaciones),
  [`Indemnización (${h.num(d.indemDias, 2)} días)`, 'No aplica', h.cop(d.indemnizacion)],
  [`<strong>Total</strong>`, `<strong>${h.cop(r.total)}</strong>`, `<strong>${h.cop(d.total)}</strong>`],
], `Salario de ${h.cop(SAL)}, contrato indefinido del ${h.date(ING)} al ${h.date(RET)}, ${TOMADAS} días de vacaciones disfrutados`, ['l', 'r', 'r'])}
<p>Como el salario no pasa de ${N.auxilio_tope_smmlv} salarios mínimos (${h.cop(N.auxilio_tope_smmlv * N.smmlv)}), entra el auxilio de transporte: la base de cesantías y prima es ${h.cop(r.base)}, mientras que las vacaciones se pagan sobre el salario sin auxilio, que es la práctica usual porque son descanso remunerado y no prestación. El detalle de cada concepto está en ${h.a('cesantias', 'cesantías')}, ${h.a('prima', 'prima de servicios')} y ${h.a('vacaciones', 'vacaciones')}.</p>
<h2>Indemnización según el tipo de contrato</h2>
<ul>
<li>Indefinido con salario inferior a ${I.umbral_smmlv} salarios mínimos (${h.cop(I.umbral_smmlv * N.smmlv)}): ${I.bajo.primer_anio} días por el primer año y ${I.bajo.adicional} por cada año siguiente, proporcionales por fracción.</li>
<li>Indefinido con ${I.umbral_smmlv} salarios mínimos o más: ${I.alto.primer_anio} días y ${I.alto.adicional} por cada año adicional.</li>
<li>Término fijo: los salarios del tiempo que faltaba del plazo.</li>
<li>Obra o labor: el tiempo que faltaba de la obra, con un mínimo de ${I.obra_minimo} días.</li>
</ul>
<p>Quien ya tenía diez o más años de servicio cuando entró en vigor la Ley 789 de 2002 conserva un régimen de transición que esta calculadora no aplica. Tampoco descuenta aportes ni retención (vea el ${h.a('salario-minimo', 'salario neto')}).</p>`;
  },
});
