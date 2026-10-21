import { defineText } from '../../lib/define';

/** Segundo semestre de 2026 : del 1 de julio al 31 de diciembre. */
const INI = '2026-07-01', FIN = '2026-12-31';

export default defineText({
  slug: 'prima-de-servicios',
  nav: 'Prima de servicios',
  card: 'Prima de junio y de diciembre de 2026: valor proporcional a los días trabajados y fechas de pago.',
  title: 'Prima de servicios 2026: calculadora y fechas de pago',
  description: 'Prima de servicios 2026 en Colombia: 30 días de salario al año en dos pagos, junio y diciembre, con el auxilio de transporte en la base. Calculadora por días.',
  h1: 'Prima de servicios de junio y diciembre',
  intro: 'Medio mes de salario por semestre completo, y la parte proporcional si entró a mitad de camino.',
  resume: (h) => {
    const N = h.P.nomina;
    const base = h.M.basePrestaciones(N.smmlv);
    const sem = h.M.prima(base, h.M.dias360(INI, FIN));
    return `La prima de servicios del artículo 306 del Código Sustantivo del Trabajo, modificado por la Ley 1788 de 2016, equivale a ${N.prima_dias} días de salario por año trabajado y se paga en dos partes: la mitad a más tardar el 30 de junio y la otra mitad dentro de los primeros 20 días de diciembre. Cada pago cubre un semestre de 180 días en año comercial y se reduce en proporción si el trabajador no estuvo todo el semestre. La base es el salario más el auxilio de transporte para quien gana hasta ${N.auxilio_tope_smmlv} salarios mínimos (Ley 1 de 1963, art. 7). Con el salario mínimo de 2026, ${h.cop(N.smmlv)} (Decreto 1469 de 2025), y el auxilio de ${h.cop(N.auxilio)} (Decreto 1470 de 2025), la prima de un semestre completo es de ${h.cop(sem)}, que se paga dos veces en el año. Quien sale de la empresa antes de la fecha de pago recibe la prima proporcional del semestre en curso con su liquidación. El salario integral no genera prima aparte.`;
  },
  faqs: (h) => {
    const N = h.P.nomina;
    return [
      { q: '¿Me pagan prima si entré a trabajar en noviembre?', a: `Sí, en proporción a los días trabajados en el semestre. Quien entró el 1 de noviembre de 2026 tiene 60 días del segundo semestre al 31 de diciembre, así que su prima de diciembre es la tercera parte de la de un semestre completo. Escriba en la calculadora la fecha de ingreso como inicio y el 31 de diciembre como fin.` },
      { q: '¿Cuánto es la prima de junio de 2026 con el salario mínimo?', a: `Para un semestre completo, del 1 de enero al 30 de junio, la base es el salario mínimo de ${h.cop(N.smmlv)} más el auxilio de transporte de ${h.cop(N.auxilio)}, es decir ${h.cop(h.M.basePrestaciones(N.smmlv))}. La prima es esa base por 180 días dividida entre 360: ${h.cop(h.M.prima(h.M.basePrestaciones(N.smmlv), 180))}. Debía pagarse a más tardar el 30 de junio de 2026; la de diciembre tiene el mismo valor si el salario no cambia.` },
      { q: '¿Quién gana salario integral recibe prima de servicios?', a: `No por separado. El salario integral del CST art. 132 debe ser de al menos ${N.integral_smmlv} salarios mínimos más un factor prestacional del ${h.pct(N.integral_factor)}, es decir ${h.cop(N.integral_smmlv * N.smmlv * (1 + N.integral_factor))} en 2026, y ese factor ya compensa de antemano las prestaciones, prima incluida. Por eso la calculadora no sirve para un contrato con salario integral.` },
    ];
  },
  body: (h) => {
    const N = h.P.nomina;
    const casos: Array<[string, string]> = [['Todo el semestre', INI], ['Ingreso el 1 de septiembre', '2026-09-01'], ['Ingreso el 16 de noviembre', '2026-11-16']];
    const salarios = [N.smmlv, 3000000, 5000000];
    const filas = casos.map(([etq, d]) => { const dias = h.M.dias360(d, FIN); return [etq, String(dias), ...salarios.map((s) => h.cop(h.M.prima(h.M.basePrestaciones(s), dias)))]; });
    return `
<h2>Cómo usar la calculadora</h2>
<p>Escriba su salario y las fechas del período: del 1 de enero al 30 de junio para la prima de junio, del 1 de julio al 31 de diciembre para la de diciembre, o desde su fecha de ingreso si llegó después. El resultado es base × días ÷ 360.</p>
<h2>Prima de diciembre de 2026 según la fecha de ingreso</h2>
${h.table(['Situación', 'Días', h.cop(N.smmlv), h.cop(3000000), h.cop(5000000)], filas, 'Segundo semestre de 2026, hasta el 31 de diciembre. Las dos primeras columnas de salario incluyen el auxilio de transporte en la base', ['l', 'r', 'r', 'r', 'r'])}
<p>La columna de ${h.cop(5000000)} no lleva auxilio, porque ese salario supera ${N.auxilio_tope_smmlv} mínimos (${h.cop(N.auxilio_tope_smmlv * N.smmlv)}). Por eso la prima de quien gana algo menos del tope puede quedar cerca de la de quien gana algo más.</p>
<h2>Las dos fechas del año</h2>
<ul>
<li>Prima del primer semestre de 2026: a más tardar el ${h.dia('2026-06-30')}.</li>
<li>Prima del segundo semestre de 2026: dentro de los primeros 20 días de diciembre de 2026.</li>
<li>Retiro antes de esas fechas: la prima proporcional del semestre en curso entra en la ${h.a('liquidacion', 'liquidación del contrato')}.</li>
</ul>
<p>La prima no es lo mismo que las ${h.a('cesantias', 'cesantías')}, que van al fondo, ni que las ${h.a('vacaciones', 'vacaciones')}, que son descanso. Las tres se calculan sobre el año de 360 días, pero cada una tiene su propia base y su propia fecha.</p>`;
  },
});
