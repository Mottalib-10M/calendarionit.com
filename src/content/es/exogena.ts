import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Información exógena del año gravable 2025 (presentada en 2026): Res. DIAN 000227 de 2025, 000012 y 000021 de 2026. */
const corto = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', timeZone: 'UTC' }).replace(/ de /g, ' ').replace(/\./g, '');
const rango = (h: Helpers, f: Record<string, string>) => { const v = Object.values(f).sort(), a = v[0], z = v[v.length - 1]; return `del ${a.slice(0, 7) === z.slice(0, 7) ? Number(a.slice(8)) : h.date(a)} al ${h.date(z)}`; };
const PJ = (h: Helpers) => h.M.tabla('exogena')[0].fechas;
const GC = (h: Helpers) => h.M.tabla('exogena_gc')[0].fechas;
const OTROS = (h: Helpers) => h.M.CALENDARIO.exogena.otros;
/** Res. 000021 de 2026, art. 9.2: formato 2820 de quienes lo presentaron sin instrumento de firma electrónica. */
const F2820_SIN_FIRMA = '2026-07-31';

export default defineText({
  slug: 'informacion-exogena',
  nav: 'Información exógena',
  card: 'Plazos de la exógena del año gravable 2025 por dígitos del NIT, con los cambios de las resoluciones de 2026.',
  title: 'Información exógena 2026: plazos por NIT, año gravable 2025',
  description: 'Información exógena 2026: plazos del año gravable 2025 por NIT para personas jurídicas, naturales y grandes contribuyentes, con las resoluciones DIAN de 2026.',
  h1: 'Información exógena: plazos de 2026 por NIT',
  intro: 'Los plazos para reportar a la DIAN la información de terceros del año gravable 2025, con sus dos modificaciones.',
  resume: (h) => {
    const pj = PJ(h), gc = GC(h), [f2839, f1034] = OTROS(h);
    return `La información exógena del año gravable 2025 se reportó a la DIAN en 2026 según la Resolución DIAN 000227 de 2025, art. 1.3.9.1.3, que fija los plazos en días hábiles. Las personas jurídicas y las personas naturales usan los dos últimos dígitos del NIT, sin el dígito de verificación, en ${Object.keys(pj).length} bloques de cinco: 01-05 vencía el ${h.date(pj['01-05'])} y 96-00 el ${h.date(pj['96-00'])}. Los grandes contribuyentes usan el último dígito y reportaron ${rango(h, gc)}; la Resolución 000012 de 2026, art. 4, movió los dígitos 1, 2 y 3 al ${Number(gc['1'].slice(8))}, ${Number(gc['2'].slice(8))} y ${h.date(gc['3'])}. La Resolución 000021 de 2026, art. 9, llevó los formatos 2839, 2840, 2823 a 2829, 2833 a 2835 y 2820 hasta el ${h.date(f2839.fecha)}, salvo el 2820 presentado sin firma electrónica, que tuvo hasta el ${h.date(F2820_SIN_FIRMA)}. El formato 1034 de estados financieros consolidados venció el ${h.date(f1034.fecha)}. Los plazos del año gravable 2026 están por publicarse.`;
  },
  faqs: (h) => {
    const gc = GC(h), [f2839] = OTROS(h);
    return [
      { q: '¿Qué cambió la Resolución 000012 de 2026 en la exógena de los grandes contribuyentes?', a: `Su artículo 4 corrió los plazos de los grandes contribuyentes con NIT terminado en 1, 2 o 3, que según la Resolución 000227 de 2025 caían a finales de abril y comienzos de mayo. Quedaron así: dígito 1, ${h.date(gc['1'])}; dígito 2, ${h.date(gc['2'])}; dígito 3, ${h.date(gc['3'])}. Los dígitos 4 a 0 conservaron sus fechas.` },
      { q: '¿Hasta cuándo se podían presentar los formatos 2820 a 2840 de la exógena?', a: `Hasta el ${h.date(f2839.fecha)}, por el artículo 9 de la Resolución 000021 de 2026, para los formatos 2839 y 2840, del 2823 al 2829, del 2833 al 2835 y el 2820. La excepción fue el formato 2820 de quienes lo habían presentado sin instrumento de firma electrónica: su plazo terminó el ${h.date(F2820_SIN_FIRMA)}.` },
      { q: '¿Cuándo vence la exógena del año gravable 2026?', a: 'Se reportará en 2027 y sus fechas están por publicarse. La DIAN suele fijar los plazos de cada año gravable por resolución y luego los convierte en días concretos en su página de calendario de exógena; mientras eso no ocurra, esta página no anticipa ninguna fecha y mantiene solo las del año gravable 2025.' },
    ];
  },
  body: (h) => {
    const pj = Object.entries(PJ(h)), gc = GC(h);
    const mitad = pj.length / 2;
    const filas = pj.slice(0, mitad).map(([k, d], i) => [k, corto(d), pj[mitad + i][0], corto(pj[mitad + i][1])]);
    const orden = Object.entries(gc).sort((a, b) => a[1].localeCompare(b[1]));
    const ej = Object.entries(PJ(h)).find(([k]) => h.M.cubre(k, '900123453'))!;
    const fechas = Object.values(PJ(h)).sort();
    const fes = h.M.festivos(2026).filter((f) => f.fecha > fechas[0] && f.fecha < fechas[fechas.length - 1]).map((f) => h.date(f.fecha));
    return `
<h2>Cómo ver su plazo</h2>
<p>La calculadora ya tiene marcada la exógena para una persona jurídica con NIT 900.123.453: sus dos últimos dígitos, 53, caen en el bloque ${ej[0]}, que vencía el ${h.date(ej[1])}. Si su entidad es gran contribuyente, cámbiela en «Tipo de contribuyente».</p>
<h2>Personas jurídicas y naturales</h2>
${h.table(['Dígitos', 'Vence', 'Dígitos', 'Vence'], filas, 'Exógena del año gravable 2025, dos últimos dígitos del NIT', ['l', 'l', 'l', 'l'])}
<h2>Grandes contribuyentes</h2>
<p>Por el cambio de 2026, el orden ya no sigue los dígitos: ${orden.map(([k, d]) => `${k} (${corto(d)})`).join(', ')}.</p>
<p>Los datos que la exógena entrega a la DIAN alimentan el cruce con la ${h.a('renta-pj', 'renta de sociedades')} y con la ${h.a('renta-pn', 'renta de personas naturales')}. Los plazos en días hábiles saltan los ${h.a('festivos', 'festivos')}: por eso no hubo vencimientos el ${fes.join(' ni el ')}.</p>
`;
  },
});
