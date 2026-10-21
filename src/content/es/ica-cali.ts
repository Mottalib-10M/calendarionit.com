import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

const datos = (h: Helpers) => {
  const c = h.M.ciudad('cali')!;
  const reg = (id: string) => c.regimenes.find((r) => r.id === id)!;
  return { c, bim: reg('bimestral'), alto: reg('anual_alto'), medio: reg('anual_medio'), bajo: reg('anual_bajo') };
};
const PARES = ['1-2', '3-4', '5-6', '7-8', '9-0'];
/** Umbral en UVT leído del nombre del régimen (« ... 131.952 UVT ... ») : primera cifra. */
const uvt = (s: string) => `${s.match(/\d[\d.]+/)![0]} UVT`;
/** « 2 al 6 de marzo de 2026 » cuando las dos fechas caen en el mismo mes. */
const rango = (h: Helpers, a: string, b: string) => (a.slice(0, 7) === b.slice(0, 7) ? `${Number(a.slice(8))} al ${h.date(b)}` : `${h.date(a)} al ${h.date(b)}`);
const corto = (h: Helpers, d: string) => h.date(d).replace(/ de 20\d\d$/, '');

export default defineText({
  slug: 'ica-cali',
  nav: 'ICA Cali',
  card: 'Tres calendarios anuales según los ingresos, grandes contribuyentes bimestrales y los dos plazos que Cali movió en 2026.',
  title: 'ICA Cali 2026: plazos por ingresos, NIT y bimestre',
  description: 'ICA Cali 2026: tres fechas anuales según los ingresos en UVT, grandes contribuyentes y ReteICA bimestrales, y los bimestres 3 y 4 reprogramados en 2026.',
  h1: 'ICA de Cali: calendario 2026 y cambios del año',
  intro: 'En Cali la fecha del ICA anual depende primero de cuánto facturó y después de su NIT.',
  resume: (h) => {
    const { alto, medio, bajo, bim } = datos(h);
    const b3 = bim.filas[2].fechas, b4 = bim.filas[3].fechas;
    return `En Cali, el impuesto de industria y comercio del año gravable 2025 se declaró y pagó en 2026 en tres ventanas según los ingresos netos obtenidos en el Distrito (Resolución 4131.010.21.0607 de 2025, art. 2). Con ${uvt(alto.nombre.es)} o más, el plazo fue del ${rango(h, alto.filas[0].fechas['1-2'], alto.filas[0].fechas['9-0'])}; desde ${uvt(medio.nombre.es)}, del ${rango(h, medio.filas[0].fechas['1-2'], medio.filas[0].fechas['9-0'])}; por debajo, del ${rango(h, bajo.filas[0].fechas['1'], bajo.filas[0].fechas['0'])}. Los grandes contribuyentes distritales (Acuerdo 0541 de 2022) declaran cada bimestre, en las fechas de la retención de ICA. Dos bimestres cambiaron: la Resolución 0692 de 2026 pasó el tercero a los días del ${rango(h, b3['1-2'], b3['9-0'])} por el nuevo festivo del lunes 13 de julio (Ley 2578 de 2026), y la Resolución 0785 de 2026, tras el sismo del 10 de agosto, llevó el cuarto a los días del ${rango(h, b4['1-2'], b4['9-0'])}. No hay descuento por pronto pago del ICA.`;
  },
  faqs: (h) => {
    const { c, bim } = datos(h);
    const b6 = bim.filas[5].fechas;
    return [
      { q: '¿Con qué UVT se mide el rango de ingresos del ICA en Cali?', a: `Con la UVT del año gravable 2025, que fue de ${h.cop(h.P.uvt['2025'])} (${h.P.uvt.acto2025}), según el parágrafo primero del artículo 2 de la Resolución 0607 de 2025. Cuentan solo los ingresos netos obtenidos en Cali durante 2025, no los de todo el país: divídalos entre esa UVT y compárelos con los dos umbrales.` },
      { q: '¿Dónde está el texto de la Resolución 0785 de 2026 de Cali?', a: `No está publicado en la página del Departamento Administrativo de Hacienda. El cambio del cuarto bimestre se conoce por el boletín oficial de la Alcaldía del 27 de agosto de 2026 y por el calendario oficial actualizado en septiembre, que muestran las fechas del 5 al 9 de octubre. Esta página las toma de esas dos publicaciones oficiales; si surge una diferencia, prima lo que diga el ${c.autoridad.es}.` },
      { q: '¿Cuándo vence el último bimestre de 2026 en Cali?', a: `El sexto bimestre, noviembre y diciembre de 2026, vence entre el ${h.date(b6['1-2'])} para los NIT terminados en 1 y 2 y el ${h.date(b6['9-0'])} para los terminados en 9 y 0. Aplica a grandes contribuyentes y agentes de retención. El calendario de 2027 aún no se ha expedido.` },
    ];
  },
  body: (h) => {
    const { alto, medio, bajo, bim } = datos(h);
    const filasAnual = PARES.map((p) => { const [x, y] = p.split('-'); return [p.replace('-', ' y '), corto(h, alto.filas[0].fechas[p]), corto(h, medio.filas[0].fechas[p]), `${Number(bajo.filas[0].fechas[x].slice(8))} y ${corto(h, bajo.filas[0].fechas[y])}`]; });
    const meses = ['enero-febrero', 'marzo-abril', 'mayo-junio', 'julio-agosto', 'septiembre-octubre', 'noviembre-diciembre'];
    const nota = ['', '', 'Res. 0692 de 2026', 'Res. 0785 de 2026', '', ''];
    const filasBim = bim.filas.map((f, i) => [meses[i], rango(h, f.fechas['1-2'], f.fechas['9-0']), nota[i]]);
    return `
<h2>Cómo usar la calculadora</h2>
<p>Con Cali ya elegida, escoja su rango anual o el bimestral de grandes contribuyentes y escriba el último dígito del NIT; la casilla ReteICA añade las fechas de retención.</p>
<h2>Declaración anual del año gravable 2025, según ingresos</h2>
${h.table(['Dígitos', alto.nombre.es.replace('Anual, ', ''), medio.nombre.es.replace('Anual, ', ''), bajo.nombre.es.replace('Anual, ', '')], filasAnual, 'Fechas de 2026 (Resolución 4131.010.21.0607 de 2025, art. 2). En el rango bajo cada dígito tiene su propia fecha', ['l', 'l', 'l', 'l'])}
<p>Quien más factura declara primero; declaración y pago van en la misma fecha.</p>
<h2>Bimestres de 2026: grandes contribuyentes y ReteICA</h2>
${h.table(['Bimestre', 'Del NIT 1 y 2 al 9 y 0', 'Modificado por'], filasBim, 'Resolución 0607 de 2025, arts. 3 y 4, con sus modificaciones', ['l', 'l', 'l'])}
<p>El tercer bimestre caía en la semana del festivo de la Ley 2578 de 2026 (vea los ${h.a('festivos', 'festivos de 2026')}); el cuarto, en septiembre. Compare con el ${h.a('ica-medellin', 'ICA de Medellín')}.</p>`;
  },
});
