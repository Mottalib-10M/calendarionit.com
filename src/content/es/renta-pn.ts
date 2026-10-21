import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Fechas de renta de personas naturales (año gravable 2025), por pareja de los dos últimos dígitos del NIT. */
const filas = (h: Helpers) => Object.entries(h.M.tabla('renta_pn')[0].fechas);
const corto = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
const EJ = '1020345678';

export default defineText({
  slug: 'calendario-renta-personas-naturales',
  nav: 'Renta personas naturales',
  card: 'La fecha límite de su declaración de renta según los dos últimos dígitos del NIT, del año gravable 2025.',
  title: 'Calendario de renta personas naturales 2026 por NIT',
  description: 'Calendario de renta personas naturales 2026: fecha límite según los dos últimos dígitos del NIT, del 12 de agosto al 26 de octubre, año gravable 2025.',
  h1: 'Calendario de renta de personas naturales 2026',
  intro: 'Escriba los dos últimos dígitos de su NIT y vea el día exacto en que vence su declaración de renta.',
  resume: (h) => {
    const f = filas(h), fechas = f.map((x) => x[1]).sort();
    const ej = h.M.vencimientos({ nit: EJ, tipo: 'pn', iva: 'no', retenedor: false, rst: false, activos: false, patrimonio: false, precios: false, ciudad: '' })[0];
    const R = h.P.renta;
    return `El calendario de renta de personas naturales 2026 fija el último día para declarar y pagar el año gravable 2025: del ${h.date(fechas[0])} al ${h.date(fechas[fechas.length - 1])}, según los dos últimos dígitos del NIT sin el dígito de verificación, en ${f.length} parejas que van de 01-02 a 99-00. Los plazos vienen del Decreto 2229 de 2023, que los fija en días hábiles, y del calendario DIAN 2026, ajustado por el día cívico del 17 de abril (Decreto 500 de 2024) y por el festivo del lunes 13 de julio (Ley 2578 de 2026). Un NIT terminado en ${EJ.slice(-2)} cae en la pareja ${ej.clave} y vence el ${h.date(ej.fecha)}. Declara quien superó en 2025 algún tope, como ${h.cop(R.ingresos_cop)} de ingresos brutos o ${h.cop(R.patrimonio_cop)} de patrimonio bruto. Las fechas del año gravable 2026, que se declarará en 2027, están por publicarse.`;
  },
  faqs: (h) => {
    const f = h.M.tabla('renta_pn')[0].fechas;
    return [
      { q: '¿Qué dígitos del NIT definen la fecha de renta de una persona natural?', a: `Los dos últimos, sin el dígito de verificación que va después del guion en el RUT. Con el NIT 1.020.345.678 cuentan el 7 y el 8: pareja 77-78, que vence el ${h.date(f['77-78'])}. Para la mayoría de personas naturales el NIT es el mismo número de la cédula, así que basta con mirar los dos últimos dígitos del documento.` },
      { q: '¿El festivo nuevo de julio cambió las fechas de renta de las personas naturales?', a: `El lunes 13 de julio de 2026 movió vencimientos de julio, como la segunda cuota de las sociedades, el IVA y la retención en la fuente. La ventana de las personas naturales empieza en agosto, el ${h.date(f['01-02'])}, y las fechas de esta página son las del calendario DIAN con todos los ajustes de 2026.` },
      { q: '¿Cuándo vence la declaración de renta que se presenta en 2027?', a: 'Corresponde al año gravable 2026 y sus fechas están por publicarse. El Decreto 2229 de 2023 mantiene sus reglas en días hábiles para los años siguientes, pero la DIAN todavía no ha publicado el calendario 2027 en fechas concretas, así que esta página no las anticipa. Se agregarán cuando el calendario oficial esté disponible.' },
    ];
  },
  body: (h) => {
    const f = filas(h);
    const mitad = Math.ceil(f.length / 2);
    const rows = f.slice(0, mitad).map(([k, d], i) => { const o = f[mitad + i]; return [k, corto(d), o ? o[0] : '', o ? corto(o[1]) : '']; });
    return `
<h2>Cómo encontrar su fecha</h2>
<p>Escriba en la calculadora los dos últimos dígitos de su NIT, sin el dígito de verificación. La lista ordena sus vencimientos, señala el próximo y se descarga en .ics para su agenda.</p>
<h2>Las ${f.length} fechas por pareja de dígitos</h2>
${h.table(['Dígitos', 'Vence', 'Dígitos', 'Vence'], rows, 'Día y mes de vencimiento, año gravable 2025 (calendario DIAN 2026)', ['l', 'l', 'l', 'l'])}
<p>No hay vencimientos en sábados, domingos ni festivos: por eso la pareja 79-80 vence el viernes ${h.date(f[39][1])} y la 81-82 pasa al martes ${h.date(f[40][1])}, después del lunes festivo del Día de la Raza.</p>
<h2>Antes de declarar</h2>
<p>Confirme antes si está obligado con los ${h.a('topes', 'topes para declarar renta')}. Lo que su empleador le retuvo en 2025 se descuenta del impuesto (vea ${h.a('retencion', 'retención en la fuente por salarios')}), y la DIAN ya conoce muchos de sus datos por la ${h.a('exogena', 'información exógena')} de bancos y empleadores.</p>
`;
  },
});
