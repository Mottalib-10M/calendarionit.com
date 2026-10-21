import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';
import { periodo } from '../../lib/etiquetas';

/** IVA bimestral y cuatrimestral 2026 por último dígito del NIT. */
const corto = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', ...(iso.startsWith('2026') ? {} : { year: 'numeric' }), timeZone: 'UTC' }).replace(/ de /g, ' ').replace(/\./g, '');
const rango = (h: Helpers, f: Record<string, string>) => { const v = Object.values(f).sort(), a = v[0], z = v[v.length - 1]; return `del ${a.slice(0, 7) === z.slice(0, 7) ? Number(a.slice(8)) : h.date(a)} al ${h.date(z)}`; };
/** Mes de la retención que vence el mismo día que cada bimestre de IVA (comprobado sobre los datos). */
const mismaFecha = (h: Helpers) => h.M.tabla('iva_bim').filter((b) => h.M.tabla('retencion').some((r) => JSON.stringify(r.fechas) === JSON.stringify(b.fechas))).length;

export default defineText({
  slug: 'iva-bimestral',
  nav: 'IVA bimestral',
  card: 'Las seis fechas del IVA bimestral y las tres del cuatrimestral en 2026, según el último dígito del NIT.',
  title: 'IVA bimestral 2026: fechas de declaración según su NIT',
  description: 'IVA bimestral 2026: seis fechas de declaración y pago por último dígito del NIT, las tres del IVA cuatrimestral y los cambios de julio por el nuevo festivo.',
  h1: 'IVA bimestral y cuatrimestral: fechas 2026',
  intro: 'Seis bimestres, un día por dígito: aquí están todos, con los de enero de 2027 ya publicados.',
  resume: (h) => {
    const b = h.M.tabla('iva_bim'), c = h.M.tabla('iva_cuat');
    const lista = b.map((x) => `${periodo(x.periodo, 'es')}, ${rango(h, x.fechas)}`).join('; ');
    return `El IVA bimestral 2026 se declara y se paga seis veces en el año, en un día que depende del último dígito del NIT, sin el dígito de verificación: ${lista}. Quien declara IVA cuatrimestral tiene ${c.length} fechas, que coinciden con las de los bimestres de marzo-abril, julio-agosto y noviembre-diciembre. Todo sale del Decreto 2229 de 2023 y del calendario DIAN 2026. En julio, el festivo del lunes 13 creado por la Ley 2578 de 2026 desplazó los dígitos 3 a 6 al ${h.date(b[2].fechas['3'])} y siguientes. Los vencimientos de enero de 2027 pertenecen al calendario 2026 y ya son oficiales; los periodos de 2027 están por publicarse.`;
  },
  faqs: (h) => {
    const b = h.M.tabla('iva_bim');
    return [
      { q: '¿Cómo sé si declaro IVA bimestral o cuatrimestral?', a: 'La periodicidad depende de los ingresos brutos del año anterior, según el Estatuto Tributario, y queda registrada con su responsabilidad de IVA en el RUT. La calculadora no la deduce: elija bimestral o cuatrimestral en el selector de IVA y la lista se ajusta. Si duda, revise su RUT antes del primer vencimiento del año.' },
      { q: '¿Cuándo se declara el IVA de noviembre-diciembre de 2026?', a: `En enero de 2027, ${rango(h, b[5].fechas)}, según el último dígito del NIT. Aunque caen en 2027, esas fechas forman parte del calendario tributario 2026 que la DIAN ya publicó, así que son definitivas. Lo que sigue por publicarse son los bimestres del año 2027.` },
      { q: '¿El IVA y la retención en la fuente vencen el mismo día?', a: `${mismaFecha(h) === b.length ? 'En los seis bimestres de 2026, sí' : `En ${mismaFecha(h)} de los ${b.length} bimestres de 2026, sí`}: la declaración de IVA vence el mismo día que la de retención del mes que cierra el bimestre. Por ejemplo, el IVA de enero-febrero y la retención de febrero vencen juntos, ${rango(h, b[0].fechas)}. Conviene preparar ambas a la vez.` },
    ];
  },
  body: (h) => {
    const b = h.M.tabla('iva_bim'), c = h.M.tabla('iva_cuat');
    const rows = b.map((x) => { const q = c.find((y) => y.fechas['1'] === x.fechas['1']); return [periodo(x.periodo, 'es'), corto(x.fechas['1']), corto(x.fechas['0']), q ? periodo(q.periodo, 'es') : '']; });
    return `
<h2>Cómo leer su fecha</h2>
<p>La calculadora viene con IVA bimestral y un NIT de ejemplo terminado en 3. Cambie el dígito por el suyo; si su periodicidad es cuatrimestral, cámbiela en el selector de IVA.</p>
<h2>Bimestres y cuatrimestres</h2>
${h.table(['Periodo', 'Dígito 1', 'Dígito 0', 'Cuatrimestre con la misma fecha'], rows, 'Primer y último día de cada periodo; los dígitos 2 a 9 vencen en los días hábiles intermedios', ['l', 'l', 'l', 'l'])}
<p>El bimestre de mayo-junio es el que más se estira: el ${h.date(b[2].fechas['1'])} vence el dígito 1, y el 0 llega al ${h.date(b[2].fechas['0'])}, porque en medio están el festivo del 13 de julio y el del 20 de julio.</p>
<h2>Fechas cercanas</h2>
<p>La segunda cuota de ${h.a('renta-pj', 'renta de sociedades')} cae el mismo día que el IVA de mayo-junio, y la ${h.a('retencion-dian', 'retención en la fuente')} mensual comparte día con cada bimestre. Los inscritos en el ${h.a('simple', 'Régimen Simple')} no siguen esta tabla: declaran un IVA anual consolidado.</p>
`;
  },
});
