import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Retención en la fuente por salarios, procedimiento 1 (ET art. 383), con la UVT de 2026. */
const EJEMPLOS = [6000000, 9000000, 14000000, 25000000];
const ret = (h: Helpers, ingreso: number, dependiente = false) => h.M.retencion({ ingreso, dependiente, prepagada: 0 });
/** Primer salario mensual (en múltiplos de $10.000) con retención, sin dependientes ni medicina prepagada. */
const umbral = (h: Helpers) => { let s = 1000000; while (ret(h, s).retencion <= 0) s += 10000; return s; };

export default defineText({
  slug: 'retencion-en-la-fuente-salarios',
  nav: 'Retención por salarios',
  card: 'Cuánto le retienen cada mes sobre el salario en 2026, con la tabla del artículo 383 y la UVT vigente.',
  title: 'Retención en la fuente por salarios 2026: tabla art. 383',
  description: 'Retención en la fuente por salarios 2026: la tabla del artículo 383 en UVT y pesos, deducciones, renta exenta del 25 % y cálculo mensual del procedimiento 1.',
  h1: 'Retención en la fuente por salarios en 2026',
  intro: 'Escriba su salario del mes y vea la base, los descuentos que la reducen y la retención que aplica su empleador.',
  resume: (h) => {
    const U = h.P.uvt['2026'], R = h.P.renta, T = R.art383, N = h.P.nomina;
    return `La retención en la fuente por salarios en 2026 se calcula cada mes con la tabla del artículo 383 del Estatuto Tributario y la UVT de ${h.cop(U)}, fijada por la Resolución DIAN 000238 de 2025. Con el procedimiento 1, la base hasta ${h.num(T[0].hasta!)} UVT (${h.cop(T[0].hasta! * U)}) no tiene retención; por encima, las tarifas marginales van del ${h.pct(T[1].marginal)} al ${h.pct(T[T.length - 1].marginal)}. Antes de aplicar la tabla se restan los aportes obligatorios del trabajador a salud (${h.pct(N.salud_empleado)}), pensión (${h.pct(N.pension_empleado)}) y, desde ${N.fsp[0].desde} salarios mínimos, al fondo de solidaridad pensional; luego las deducciones por dependientes (${h.pct(R.dependientes_pct)} del ingreso, máximo ${R.dependientes_uvt_mes} UVT al mes) y medicina prepagada (máximo ${R.prepagada_uvt_mes} UVT al mes), y la renta exenta del ${h.pct(R.exenta25)} del artículo 206, con tope de ${h.num(R.exenta25_uvt_anual)} UVT al año. Deducciones y renta exenta no pueden superar el ${h.pct(R.limite40)} ni ${h.num(R.limite40_uvt_anual)} UVT anuales (artículo 336). Con un salario de ${h.cop(EJEMPLOS[2])}, la retención mensual es de ${h.cop(ret(h, EJEMPLOS[2]).retencion)}.`;
  },
  faqs: (h) => {
    const R = h.P.renta, U = h.P.uvt['2026'], s = umbral(h), b = EJEMPLOS[2];
    return [
      { q: '¿Desde qué salario hay retención en la fuente en 2026?', a: `Con nuestros supuestos, sin dependientes ni medicina prepagada y con un solo empleador, la retención aparece desde un salario mensual de unos ${h.cop(s)}. Por debajo, después de restar aportes y la renta exenta del ${h.pct(R.exenta25)}, la base no pasa de ${h.num(R.art383[0].hasta!)} UVT, es decir ${h.cop(R.art383[0].hasta! * U)}, y la tarifa es cero.` },
      { q: '¿Por qué la calculadora divide entre 12 los topes de 790 y 1.340 UVT?', a: `Porque la ley los fija por año y la retención se calcula por mes. No encontramos un texto oficial que fije un tope mensual, así que repartimos el anual en doce partes iguales: ${h.num(R.exenta25_uvt_anual / 12, 2)} UVT para la renta exenta y ${h.num(R.limite40_uvt_anual / 12, 2)} UVT para el límite global. Es una hipótesis nuestra; su empleador puede aplicar otro criterio.` },
      { q: '¿Cuánto baja la retención si tengo dependientes?', a: `La deducción es el ${h.pct(R.dependientes_pct)} del ingreso bruto laboral, hasta ${R.dependientes_uvt_mes} UVT al mes (${h.cop(R.dependientes_uvt_mes * U)}). Con un salario de ${h.cop(b)}, la retención pasa de ${h.cop(ret(h, b).retencion)} a ${h.cop(ret(h, b, true).retencion)} al mes. Debe acreditar al dependiente ante su empleador para que la aplique.` },
      { q: '¿La tabla de retención del artículo 383 cambió en 2026?', a: `No. Los rangos y tarifas en UVT son los de la modificación de la Ley 2010 de 2019, vigentes en octubre de 2026. Lo que cambia cada año es el valor de la UVT, que pasó de ${h.cop(h.P.uvt['2025'])} a ${h.cop(U)}; por eso los límites en pesos suben aunque la tabla sea la misma.` },
    ];
  },
  body: (h) => {
    const U = h.P.uvt['2026'], T = h.P.renta.art383;
    const tabla = T.map((r) => [h.num(r.desde), r.hasta === null ? 'en adelante' : h.num(r.hasta), h.pct(r.marginal), h.num(r.fijo), h.cop(r.desde * U)]);
    const ejemplos = EJEMPLOS.map((s) => { const r = ret(h, s); return [h.cop(s), h.cop(r.base), h.num(r.baseUvt, 2), h.cop(r.retencion)]; });
    return `
<h2>Cómo usar la calculadora</h2>
<p>Escriba el salario y los demás pagos laborales del mes, indique si tiene dependientes y cuánto paga de medicina prepagada. Verá cada resta hasta la base y la retención del mes.</p>
<h2>Tabla del artículo 383 en 2026</h2>
${h.table(['Desde (UVT)', 'Hasta (UVT)', 'Tarifa marginal', 'Más (UVT)', 'Desde (pesos)'], tabla, `Retención = (base en UVT − límite inferior) × tarifa + UVT fijas; UVT ${h.cop(U)}`, ['r', 'r', 'r', 'r', 'r'])}
<h2>Cuatro salarios de ejemplo</h2>
${h.table(['Salario mensual', 'Base sujeta', 'Base en UVT', 'Retención'], ejemplos, 'Sin dependientes ni medicina prepagada, un solo empleador, salario no integral', ['r', 'r', 'r', 'r'])}
<p>Lo retenido no es un costo adicional: se descuenta en la declaración de renta del año, si está ${h.a('topes', 'obligado a declarar')}. El empleador declara y paga esas sumas cada mes según su ${h.a('retencion-dian', 'calendario de retención')}. Para el salario neto, vea el ${h.a('salario-minimo', 'salario mínimo 2026')} y la ${h.a('liquidacion', 'liquidación laboral')}.</p>
`;
  },
});
