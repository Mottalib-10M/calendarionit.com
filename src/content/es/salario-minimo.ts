import { defineText } from '../../lib/define';

export default defineText({
  slug: 'salario-minimo',
  nav: 'Salario mínimo',
  card: 'Salario mínimo y auxilio de transporte de 2026, situación judicial del decreto y pago neto del mes.',
  title: 'Salario mínimo 2026 en Colombia: valor, neto y auxilio',
  description: 'Salario mínimo 2026 en Colombia: $1.750.905 y $249.095 de auxilio de transporte, el neto tras salud y pensión y el estado del decreto ante el Consejo de Estado.',
  h1: 'Salario mínimo 2026: valor, auxilio y pago neto',
  intro: 'El monto no ha cambiado en todo el año, aunque el decreto que lo fijó pasó por el Consejo de Estado.',
  resume: (h) => {
    const N = h.P.nomina, n = h.M.neto(N.smmlv);
    return `El salario mínimo mensual legal vigente de 2026 en Colombia es de ${h.cop(N.smmlv)}, fijado por el Decreto 1469 de 2025 con un aumento del ${h.pct(N.smmlv / N.smmlv_2025 - 1)} sobre los ${h.cop(N.smmlv_2025)} de 2025. El auxilio de transporte es de ${h.cop(N.auxilio)} (Decreto 1470 de 2025) y se paga a quien gana hasta ${N.auxilio_tope_smmlv} salarios mínimos, es decir ${h.cop(N.auxilio_tope_smmlv * N.smmlv)}. En febrero de 2026 el Consejo de Estado suspendió provisionalmente el Decreto 1469; el Gobierno expidió entonces el Decreto 0159 de 2026, que fijó transitoriamente el mismo valor, y en julio de 2026 el Consejo de Estado revocó la suspensión. El monto nunca cambió y el fallo de fondo sigue pendiente. Un trabajador con el mínimo aporta ${h.pct(N.salud_empleado)} a salud y ${h.pct(N.pension_empleado)} a pensión sobre el salario sin auxilio, y recibe ${h.cop(n.neto)} netos al mes. El mínimo de 2027 está por publicarse: según la Ley 278 de 1996, art. 8, la Comisión de Concertación decide a más tardar el 15 de diciembre y, sin acuerdo, el Gobierno lo fija antes del 30 de diciembre.`;
  },
  faqs: (h) => {
    const N = h.P.nomina;
    return [
      { q: '¿La suspensión del decreto del salario mínimo obliga a devolver dinero?', a: `No. Durante la suspensión rigió el Decreto 0159 de 2026, que fijó transitoriamente el mismo valor de ${h.cop(N.smmlv)}, y desde julio de 2026 el Decreto 1469 de 2025 volvió a aplicarse. En ningún momento hubo un salario mínimo distinto, así que no hay diferencias que reliquidar. Lo que queda pendiente es la sentencia de fondo del Consejo de Estado.` },
      { q: '¿Cuánto vale un día de salario mínimo en 2026?', a: `El salario mínimo dividido entre 30: ${h.cop(N.smmlv / 30)} por día, sin auxilio de transporte. Ese valor diario es la unidad de la indemnización del CST art. 64, de las vacaciones compensadas y de los descuentos por días no laborados. Para la hora se divide además entre las horas del día, que dependen de la jornada semanal vigente.` },
      { q: '¿Cuándo se conoce el salario mínimo de 2027?', a: `Todavía está por publicarse. La Ley 278 de 1996, art. 8, da a la Comisión Permanente de Concertación de Políticas Salariales y Laborales hasta el 15 de diciembre para acordarlo. Si no hay consenso, el Gobierno lo fija por decreto a más tardar el 30 de diciembre, y rige desde el 1 de enero de 2027. Esta página se actualizará cuando salga el decreto.` },
    ];
  },
  body: (h) => {
    const N = h.P.nomina, SM = N.smmlv;
    const filas: Array<[string, number, string]> = [
      ['Salario mínimo mensual', SM, 'Decreto 1469 de 2025'],
      ['Auxilio de transporte', N.auxilio, 'Decreto 1470 de 2025'],
      [`Tope del auxilio (${N.auxilio_tope_smmlv} mínimos)`, N.auxilio_tope_smmlv * SM, 'Decreto 1470 de 2025'],
      [`Fondo de Solidaridad Pensional desde ${N.fsp[0].desde} mínimos`, N.fsp[0].desde * SM, 'Ley 100 de 1993, art. 27'],
      [`Salario integral mínimo (${N.integral_smmlv} mínimos + ${h.pct(N.integral_factor)})`, N.integral_smmlv * SM * (1 + N.integral_factor), 'CST art. 132'],
      [`Tope de cotización (${N.ibc_max_smmlv} mínimos)`, N.ibc_max_smmlv * SM, 'Ley 100 de 1993'],
    ];
    const n = h.M.neto(SM);
    return `
<h2>Cómo usar la calculadora</h2>
<p>Escriba un salario mensual y verá el auxilio de transporte si le corresponde, los descuentos de salud, pensión y Fondo de Solidaridad, y el pago neto. Si escribe menos del mínimo, la calculadora lo advierte.</p>
<h2>Cifras de 2026 que se calculan a partir del mínimo</h2>
${h.table(['Concepto', 'Valor 2026', 'Norma'], filas.map(([c, v, a]) => [c, h.cop(v), a]), 'Valores derivados del salario mínimo de 2026; cambian todos cuando se publique el de 2027', ['l', 'r', 'l'])}
<p>Con el mínimo, el trabajador recibe ${h.cop(n.devengado)} entre salario y auxilio, y le descuentan ${h.cop(n.salud)} de salud y ${h.cop(n.pension)} de pensión: quedan ${h.cop(n.neto)}. El empleador paga además su parte de los aportes, que no aparece en el desprendible del trabajador.</p>
<h2>Por qué importa la fecha del decreto</h2>
<p>El mínimo es la base de muchas otras cifras: el umbral de la indemnización del CST art. 64, el derecho al auxilio y la hora ordinaria que sirve para los ${h.a('recargos', 'recargos y horas extras')}. Una ${h.a('liquidacion', 'liquidación laboral')} calculada en 2026 usa el mínimo vigente aunque el decreto siga en discusión judicial. La ${h.a('retencion', 'retención en la fuente')} no toca a quien gana el mínimo, porque su base queda por debajo del primer tramo de la tabla.</p>`;
  },
});
