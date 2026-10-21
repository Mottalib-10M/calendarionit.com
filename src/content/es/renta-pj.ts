import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Renta de personas jurídicas (año gravable 2025): dos cuotas por último dígito; grandes contribuyentes, tres. */
const corto = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', timeZone: 'UTC' }).replace(' de ', ' ').replace(/\./g, '');
const rango = (h: Helpers, f: Record<string, string>) => { const v = Object.values(f).sort(), a = v[0], z = v[v.length - 1]; return `del ${a.slice(0, 7) === z.slice(0, 7) ? Number(a.slice(8)) : h.date(a)} al ${h.date(z)}`; };

export default defineText({
  slug: 'calendario-renta-personas-juridicas',
  nav: 'Renta personas jurídicas',
  card: 'Declaración y cuotas de renta de sociedades y grandes contribuyentes, año gravable 2025, por último dígito del NIT.',
  title: 'Renta personas jurídicas 2026: fechas por dígito del NIT',
  description: 'Renta personas jurídicas 2026: declaración y primera cuota en mayo, segunda en julio según el último dígito del NIT, y las 3 cuotas de grandes contribuyentes.',
  h1: 'Renta de personas jurídicas: calendario 2026',
  intro: 'El último dígito del NIT de la sociedad fija el día de la declaración y de cada cuota.',
  resume: (h) => {
    const [d1, c2] = h.M.tabla('renta_pj'), [g1, g2, g3] = h.M.tabla('renta_gc');
    return `La renta de personas jurídicas 2026 corresponde al año gravable 2025 y se paga en cuotas según el último dígito del NIT, sin el dígito de verificación. Las sociedades que no son grandes contribuyentes presentan la declaración y pagan la primera cuota ${rango(h, d1.fechas)}, y pagan la segunda ${rango(h, c2.fechas)}. Los grandes contribuyentes pagan tres cuotas: la primera ${rango(h, g1.fechas)}, la declaración con la segunda ${rango(h, g2.fechas)} y la tercera ${rango(h, g3.fechas)}. Los plazos salen del Decreto 2229 de 2023 y del calendario DIAN 2026. En julio, el festivo del lunes 13 creado por la Ley 2578 de 2026 corrió la segunda cuota: los NIT terminados en 3 a 6 pagan del ${Number(c2.fechas['3'].slice(8))} al ${h.date(c2.fechas['6'])}. Una sociedad con NIT 900.123.453 declara el ${h.date(d1.fechas['3'])}. Las fechas del año gravable 2026 están por publicarse.`;
  },
  faqs: (h) => {
    const [d1, c2] = h.M.tabla('renta_pj');
    return [
      { q: '¿Qué dígito del NIT usa una sociedad para su fecha de renta?', a: `Solo el último antes del guion. En un NIT 900.123.453 seguido del dígito de verificación, el que cuenta es el 3: declaración y primera cuota el ${h.date(d1.fechas['3'])}, segunda cuota el ${h.date(c2.fechas['3'])}. A diferencia de las personas naturales, las sociedades no usan dos dígitos para la renta.` },
      { q: '¿Por qué la segunda cuota de renta de algunas sociedades pasó al 14 de julio?', a: `Porque la Ley 2578 de 2026 creó el festivo del 9 de julio, que en 2026 se trasladó al lunes 13. La DIAN corrió los vencimientos: el dígito 3 pasó al ${h.date(c2.fechas['3'])} y los dígitos 7 a 0 quedaron entre el ${h.date(c2.fechas['7'])} y el ${h.date(c2.fechas['0'])}, después del festivo del 20 de julio.` },
      { q: '¿Cuándo vence la renta de sociedades del año gravable 2026?', a: 'En 2027, pero esas fechas están por publicarse. El Decreto 2229 de 2023 conserva sus reglas en días hábiles para los años siguientes, aunque la DIAN todavía no ha publicado el calendario 2027 con días concretos. Esta página no los proyecta: se actualizará cuando salga el calendario oficial.' },
    ];
  },
  body: (h) => {
    const [d1, c2] = h.M.tabla('renta_pj');
    const rows = Object.keys(d1.fechas).map((k) => [k, corto(d1.fechas[k]), corto(c2.fechas[k])]);
    return `
<h2>Cómo usar el calendario de la sociedad</h2>
<p>La calculadora viene como persona jurídica con un NIT de ejemplo terminado en 3: cambie el dígito por el de su empresa. Si además declara IVA, retiene en la fuente o paga ICA, marque esas casillas y verá todas sus fechas en una sola lista.</p>
<h2>Fechas por último dígito</h2>
${h.table(['Último dígito', 'Declaración y 1.ª cuota', '2.ª cuota'], rows, 'Sociedades que no son grandes contribuyentes, año gravable 2025 (calendario DIAN 2026)', ['l', 'l', 'l'])}
<h2>Días que se juntan</h2>
<p>La declaración de mayo vence el mismo día que el ${h.a('iva', 'IVA bimestral')} de marzo-abril y que la ${h.a('retencion-dian', 'retención en la fuente')} de abril, para cada dígito. La segunda cuota de julio coincide con el IVA de mayo-junio. En paralelo, entre mayo y junio, la sociedad reporta la ${h.a('exogena', 'información exógena')}, y si opera en la capital tiene además su propio calendario de ${h.a('ica-bogota', 'ICA en Bogotá')}.</p>
`;
  },
});
