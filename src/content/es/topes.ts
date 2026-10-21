import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Topes para declarar renta del año gravable 2025 (UVT 2025, pesos redondeados por la DIAN). */
const filas = (h: Helpers) => {
  const R = h.P.renta, u = R.uvt_ag;
  return [
    ['Patrimonio bruto al 31 de diciembre de 2025, superior a', R.patrimonio_uvt, R.patrimonio_cop, R.patrimonio_uvt * u],
    ['Ingresos brutos de 2025, iguales o superiores a', R.ingresos_uvt, R.ingresos_cop, R.ingresos_uvt * u],
    ['Consumos con tarjeta de crédito, superiores a', R.ingresos_uvt, R.tarjeta_cop, R.ingresos_uvt * u],
    ['Compras y consumos totales, superiores a', R.ingresos_uvt, R.compras_cop, R.ingresos_uvt * u],
    ['Consignaciones, depósitos o inversiones, superiores a', R.ingresos_uvt, R.consignaciones_cop, R.ingresos_uvt * u],
  ] as const;
};

export default defineText({
  slug: 'topes-declarar-renta',
  nav: 'Topes para declarar renta',
  card: 'Los cinco topes en pesos y la condición de IVA que obligan a declarar renta en 2026 por el año gravable 2025.',
  title: 'Topes para declarar renta 2026: año gravable 2025 en pesos',
  description: 'Topes para declarar renta en 2026: patrimonio, ingresos, tarjeta, compras y consignaciones del año gravable 2025, en UVT y en pesos de la DIAN. Basta con uno.',
  h1: 'Topes para declarar renta en 2026',
  intro: 'Marque sus cifras de 2025 y sepa en segundos si debe presentar la declaración de renta este año.',
  resume: (h) => {
    const R = h.P.renta;
    return `Los topes para declarar renta en 2026 se miden sobre el año gravable 2025 con la UVT de ${h.cop(R.uvt_ag)}, fijada por la Resolución DIAN 000193 de 2024. Una persona natural residente debe declarar si cumple al menos una de estas condiciones: patrimonio bruto al 31 de diciembre de 2025 superior a ${h.num(R.patrimonio_uvt)} UVT (${h.cop(R.patrimonio_cop)}); ingresos brutos iguales o superiores a ${h.num(R.ingresos_uvt)} UVT (${h.cop(R.ingresos_cop)}); consumos con tarjeta de crédito, compras y consumos totales o consignaciones, depósitos e inversiones superiores a ${h.cop(R.tarjeta_cop)} cada uno; o ser responsable de IVA al cierre de 2025. La base legal está en los artículos 592, 593 y 594-3 del Estatuto Tributario y en el artículo 1.6.1.13.2.7 del Decreto 1625 de 2016, sustituido por el Decreto 2229 de 2023. Los pesos son los que publica la DIAN, redondeados al millar según el artículo 868 del Estatuto. Quien está obligado presenta la declaración entre agosto y octubre de 2026, según los dos últimos dígitos de su NIT.`;
  },
  faqs: (h) => {
    const R = h.P.renta;
    return [
      { q: `¿Si mis ingresos de 2025 fueron exactamente ${h.cop(R.ingresos_cop)}, debo declarar renta?`, a: `Sí. Para los ingresos brutos la condición es que sean iguales o superiores a ${h.num(R.ingresos_uvt)} UVT, así que llegar justo a la cifra ya obliga. Para el patrimonio y los demás topes, en cambio, la norma exige superar el valor: un patrimonio bruto de exactamente ${h.cop(R.patrimonio_cop)} no obliga por sí solo.` },
      { q: '¿Por qué la DIAN publica topes de renta redondeados?', a: `Porque el artículo 868 del Estatuto Tributario manda redondear al millar más cercano los valores en pesos que resultan de multiplicar UVT, cuando superan ${h.cop(10000)}. Por eso ${h.num(R.patrimonio_uvt)} UVT dan ${h.cop(R.patrimonio_uvt * R.uvt_ag)} en la cuenta exacta y ${h.cop(R.patrimonio_cop)} en la cifra oficial. La calculadora usa la cifra redondeada.` },
      { q: '¿Qué UVT se usa para los topes de la declaración que se presenta en 2027?', a: `La de 2026, que es de ${h.cop(h.P.uvt['2026'])} según la Resolución DIAN 000238 de 2025, porque esa declaración corresponde al año gravable 2026. Las cantidades de UVT de cada tope vienen de la ley, pero los valores en pesos y las fechas de 2027 los publicará la DIAN: por ahora están por publicarse.` },
    ];
  },
  body: (h) => {
    const rows = filas(h).map(([c, u, p, x]) => [c, h.num(u), h.cop(p), h.cop(x)]);
    rows.push(['Responsable de IVA al 31 de diciembre de 2025', 'no aplica', 'siempre declara', 'no aplica']);
    return `
<h2>Cómo usar la calculadora</h2>
<p>Escriba sus cifras de 2025 en cada casilla y marque si era responsable de IVA. El resultado dice si debe declarar y qué condición lo obliga; basta una sola.</p>
<h2>Los topes en UVT y en pesos</h2>
${h.table(['Condición del año gravable 2025', 'UVT', 'Pesos (DIAN)', 'Cuenta exacta'], rows, `UVT 2025: ${h.cop(h.P.renta.uvt_ag)}`, ['l', 'r', 'r', 'r'])}
<h2>Errores frecuentes</h2>
<ul>
<li>Mirar el saldo de la cuenta y no lo consignado: el tope de consignaciones suma los depósitos del año, no lo que quedaba el 31 de diciembre.</li>
<li>Olvidar la tarjeta de crédito: aunque los ingresos no lleguen al tope, los consumos con tarjeta pueden obligar por sí solos.</li>
<li>Restar deudas al patrimonio: el tope es de patrimonio bruto, antes de restar lo que se debe.</li>
</ul>
<p>Si resulta obligado, busque su día en el ${h.a('renta-pn', 'calendario de renta de personas naturales')}. Lo que le retuvieron en el año, explicado en ${h.a('retencion', 'retención por salarios')}, se descuenta del impuesto, y la ${h.a('exogena', 'exógena')} de bancos y empleadores muestra a la DIAN buena parte de estas cifras.</p>
`;
  },
});
