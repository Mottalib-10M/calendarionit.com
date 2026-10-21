import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';
import { periodo } from '../../lib/etiquetas';

/** Declaración mensual de retención en la fuente 2026 por último dígito del NIT. */
const corto = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', ...(iso.startsWith('2026') ? {} : { year: 'numeric' }), timeZone: 'UTC' }).replace(/ de /g, ' ').replace(/\./g, '');
const rango = (h: Helpers, f: Record<string, string>) => { const v = Object.values(f).sort(), a = v[0], z = v[v.length - 1]; return `del ${a.slice(0, 7) === z.slice(0, 7) ? Number(a.slice(8)) : h.date(a)} al ${h.date(z)}`; };
const mes = (h: Helpers, p: string) => h.M.tabla('retencion').find((x) => x.periodo === p)!;

export default defineText({
  slug: 'retencion-en-la-fuente-calendario',
  nav: 'Retención en la fuente',
  card: 'Las doce fechas de la declaración mensual de retención en la fuente en 2026, por último dígito del NIT.',
  title: 'Retención en la fuente 2026: calendario mensual por NIT',
  description: 'Retención en la fuente 2026: el día de cada declaración mensual según el último dígito del NIT, de febrero de 2026 a enero de 2027, con ajustes por festivos.',
  h1: 'Retención en la fuente: calendario mensual 2026',
  intro: 'Doce declaraciones al año para cada agente de retención, una por mes, en el día que marca su NIT.',
  resume: (h) => {
    const t = h.M.tabla('retencion'), mar = mes(h, '2026-03'), jun = mes(h, '2026-06');
    return `La retención en la fuente 2026 se declara y paga cada mes: el agente de retención presenta ${t.length} declaraciones, una por cada mes retenido, en un día que depende del último dígito del NIT sin el dígito de verificación. La retención de enero vence ${rango(h, t[0].fechas)} y la de diciembre ${rango(h, t[t.length - 1].fechas)}. Las reglas son las del Decreto 2229 de 2023, y las fechas, las del calendario DIAN 2026. Dos ajustes cambiaron el orden habitual: el día cívico del viernes 17 de abril (Decreto 500 de 2024) hizo que, para la retención de marzo, el dígito 4 venza el ${h.date(mar.fechas['4'])} y el 5 el ${h.date(mar.fechas['5'])}; y el festivo del lunes 13 de julio (Ley 2578 de 2026) llevó la retención de junio de los dígitos 3 a 6 ${rango(h, { a: jun.fechas['3'], b: jun.fechas['6'] })}. Las declaraciones de los meses de 2027 tienen fechas por publicarse.`;
  },
  faqs: (h) => {
    const mar = mes(h, '2026-03'), dic = mes(h, '2026-12');
    return [
      { q: '¿Qué día venció la retención de marzo de 2026 para un NIT terminado en 5?', a: `El ${h.date(mar.fechas['5'])}. El viernes 17 de abril fue día cívico por el Decreto 500 de 2024 y la DIAN no lo contó como hábil, así que el dígito 4 quedó el ${h.date(mar.fechas['4'])} y el 5 pasó al lunes siguiente. Los dígitos 5 a 0 se corrieron un día hábil.` },
      { q: '¿La retención en la fuente de diciembre de 2026 se declara en 2027?', a: `Sí, ${rango(h, dic.fechas)}, según el último dígito. Esas fechas forman parte del calendario tributario 2026 que la DIAN ya publicó, así que son definitivas. Lo que sigue por publicarse son los vencimientos de las retenciones practicadas durante 2027.` },
      { q: '¿Esta declaración es la misma retención que me descuentan del salario?', a: `Es la otra punta del mismo proceso. El empleador descuenta cada mes la retención del salario con la tabla del artículo 383 del Estatuto Tributario, que se explica en ${h.a('retencion', 'retención en la fuente por salarios')}, y luego la declara y la paga a la DIAN en la fecha de esta página, junto con las demás retenciones del mes.` },
    ];
  },
  body: (h) => {
    const t = h.M.tabla('retencion');
    const rows = t.map((x) => [periodo(x.periodo, 'es'), corto(x.fechas['1']), corto(x.fechas['5']), corto(x.fechas['0'])]);
    const sep = mes(h, '2026-09');
    return `
<h2>Cómo usar la calculadora</h2>
<p>La casilla de agente de retención ya está marcada, con un NIT de ejemplo terminado en 3. Escriba el último dígito de su NIT y la lista mostrará los doce vencimientos, el próximo resaltado; si además declara IVA, márquelo para ver ambas obligaciones juntas.</p>
<h2>Mes por mes</h2>
${h.table(['Mes retenido', 'Dígito 1', 'Dígito 5', 'Dígito 0'], rows, 'Declaración y pago mensual de retención en la fuente (calendario DIAN 2026)', ['l', 'l', 'l', 'l'])}
<p>El calendario reparte los diez dígitos en días hábiles seguidos. Cuando hay un lunes festivo en medio, el salto se nota: para la retención de septiembre, el dígito 1 vence el viernes ${h.date(sep.fechas['1'])} y el 2 el martes ${h.date(sep.fechas['2'])}, tras el festivo del 12 de octubre.</p>
<h2>Con qué otras fechas coincide</h2>
<p>La retención de cada mes par vence el mismo día que el ${h.a('iva', 'IVA bimestral')} del bimestre que cierra, y la de abril coincide con la declaración de ${h.a('renta-pj', 'renta de sociedades')}.</p>
`;
  },
});
