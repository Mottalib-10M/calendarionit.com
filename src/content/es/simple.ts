import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';
import { periodo } from '../../lib/etiquetas';

/** Régimen Simple de Tributación (RST): declaración anual, IVA anual consolidado y anticipos bimestrales. */
const corto = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', ...(iso.startsWith('2026') ? {} : { year: 'numeric' }), timeZone: 'UTC' }).replace(/ de /g, ' ').replace(/\./g, '');
const rango = (h: Helpers, f: Record<string, string>) => { const v = Object.values(f).sort(), a = v[0], z = v[v.length - 1]; return `del ${a.slice(0, 7) === z.slice(0, 7) ? Number(a.slice(8)) : h.date(a)} al ${h.date(z)}`; };

export default defineText({
  slug: 'regimen-simple',
  nav: 'Régimen Simple',
  card: 'Declaración anual, IVA anual consolidado y los seis anticipos bimestrales del SIMPLE en 2026, por dígito del NIT.',
  title: 'Régimen Simple 2026: anticipos y declaración por NIT',
  description: 'Régimen Simple 2026: fechas de la declaración anual, del IVA anual consolidado y de los seis anticipos bimestrales según el último dígito del NIT del inscrito.',
  h1: 'Régimen Simple de Tributación: fechas 2026',
  intro: 'Una declaración anual, un IVA anual y seis recibos de anticipo: estas son las fechas del inscrito en el SIMPLE.',
  resume: (h) => {
    const anual = h.M.tabla('rst_anual')[0], iva = h.M.tabla('rst_iva')[0], ant = h.M.tabla('rst_anticipo');
    return `El Régimen Simple de Tributación (SIMPLE) tiene en 2026 tres tipos de vencimiento, todos según el último dígito del NIT sin el dígito de verificación. La declaración anual consolidada del año gravable 2025 se presentó y pagó ${rango(h, anual.fechas)}, por parejas de dígitos (1-2, 3-4, 5-6, 7-8 y 9-0). Los inscritos responsables de IVA presentaron antes la declaración anual consolidada de IVA, ${rango(h, iva.fechas)}, con las mismas parejas. Además, el inscrito paga ${ant.length} anticipos bimestrales con el recibo electrónico: el de enero-febrero ${rango(h, ant[0].fechas)} y el último, de noviembre-diciembre, ${rango(h, ant[ant.length - 1].fechas)}. Los plazos salen del Decreto 2229 de 2023 y del calendario DIAN 2026, que incluye el corrimiento de julio por el festivo del lunes 13 (Ley 2578 de 2026). Las fechas de la declaración anual del año gravable 2026 están por publicarse.`;
  },
  faqs: (h) => {
    const ant = h.M.tabla('rst_anticipo'), anual = h.M.tabla('rst_anual')[0];
    return [
      { q: '¿Cuándo se paga el primer anticipo bimestral del Régimen Simple en 2026?', a: `El de enero-febrero vence ${rango(h, ant[0].fechas)}, después de la declaración anual de abril. Los siguientes llegan en junio, julio, septiembre y noviembre, y el de noviembre-diciembre en enero de 2027. Cada uno cae en el día que marca el último dígito del NIT, así que el orden de los dígitos se mantiene todo el año.` },
      { q: '¿Un inscrito en el SIMPLE presenta también la declaración de renta ordinaria?', a: `No por el mismo año. El impuesto unificado del SIMPLE sustituye el impuesto de renta del inscrito, y su declaración anual, que en 2026 venció ${rango(h, anual.fechas)}, ocupa el lugar de la de renta. Por eso, al marcar el SIMPLE en la calculadora, la renta ordinaria desaparece de la lista y aparecen los anticipos.` },
      { q: '¿Qué fechas del SIMPLE siguen por publicarse?', a: 'Las de 2027: la declaración anual consolidada y el IVA anual del año gravable 2026, y los anticipos de los bimestres de 2027. El Decreto 2229 de 2023 mantiene sus reglas en días hábiles, pero la DIAN aún no ha publicado esos días en su calendario. El anticipo de noviembre-diciembre de 2026, en cambio, ya tiene fecha oficial.' },
    ];
  },
  body: (h) => {
    const anual = h.M.tabla('rst_anual')[0], iva = h.M.tabla('rst_iva')[0], ant = h.M.tabla('rst_anticipo');
    const filasAnual = Object.keys(anual.fechas).map((k) => [k, corto(iva.fechas[k]), corto(anual.fechas[k])]);
    const filasAnt = ant.map((x) => [periodo(x.periodo, 'es'), corto(x.fechas['1']), corto(x.fechas['0'])]);
    return `
<h2>La calculadora en modo SIMPLE</h2>
<p>La herramienta ya tiene marcado el Régimen Simple con IVA. Escriba el último dígito de su NIT; si no es responsable de IVA, quite esa opción y la declaración anual de IVA saldrá de la lista.</p>
<h2>Declaraciones anuales del año gravable 2025</h2>
${h.table(['Último dígito', 'IVA anual consolidado', 'Declaración anual SIMPLE'], filasAnual, 'Vencimientos de 2026 por pareja de dígitos', ['l', 'l', 'l'])}
<h2>Anticipos bimestrales de 2026</h2>
${h.table(['Bimestre', 'Dígito 1', 'Dígito 0'], filasAnt, 'Recibo electrónico de anticipo; los dígitos 2 a 9 vencen en los días hábiles intermedios', ['l', 'l', 'l'])}
<p>Los anticipos vencen los mismos días que varias obligaciones del régimen ordinario, como el ${h.a('iva', 'IVA bimestral')}, lo que facilita comparar si ya conoce esas fechas. Quien sale del SIMPLE vuelve al calendario de ${h.a('renta-pn', 'renta de personas naturales')} o de sociedades. En Medellín, además, estar en el SIMPLE excluye del sistema preferencial del ICA (Acuerdo 093 de 2023, art. 62): vea ${h.a('ica-medellin', 'ICA en Medellín')}.</p>
`;
  },
});
