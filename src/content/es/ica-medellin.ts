import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

const datos = (h: Helpers) => {
  const c = h.M.ciudad('medellin')!;
  const ord = c.regimenes.find((r) => r.id === 'ordinario')!;
  const simp = c.regimenes.find((r) => r.id === 'simplificado')!;
  const decl = ord.filas.find((f) => f.accion === 'decl')!.fechas;
  const pago = ord.filas.find((f) => f.accion === 'pago')!.fechas.todos;
  return { c, ord, simp, decl, pago, rete: c.retencion!.filas };
};
const ORDEN = ['0', '9', '8', '7', '6', '5', '4', '3', '2', '1'];

export default defineText({
  slug: 'ica-medellin',
  nav: 'ICA Medellín',
  card: 'Declaración anual por último dígito en abril, pago hasta junio, cobro bimestral del régimen simplificado y ReteICA.',
  title: 'ICA Medellín 2026: fechas por dígito del NIT y ReteICA',
  description: 'ICA Medellín 2026: declaración del año gravable 2025 del 17 al 30 de abril según el último dígito, pago hasta el 25 de junio y ReteICA bimestral en fecha común.',
  h1: 'ICA de Medellín: calendario 2026',
  intro: 'En Medellín se declara en abril y se paga después, con la factura que emite el Distrito.',
  resume: (h) => {
    const { decl, pago, rete, simp } = datos(h);
    return `En Medellín, el impuesto de industria y comercio del año gravable 2025 se declaró en 2026 según la Resolución 202550100057 de 2025. El régimen ordinario presentó la declaración del ${h.date(decl['0'])} (NIT terminado en 0) al ${h.date(decl['1'])} (terminado en 1) según el último dígito del NIT o la cédula. Lo particular de Medellín es que declarar y pagar son pasos separados: el Distrito factura en mayo las declaraciones presentadas a tiempo y el pago vence el ${h.date(pago)}; autorretenedores y ocasionales pagan al presentar. El régimen simplificado, para personas naturales con un solo establecimiento e ingresos de hasta ${simp.quien.es.match(/[\d.]+ UVT/)![0]} (Acuerdo 093 de 2023), no declara: paga un documento de cobro cada bimestre. La retención de ICA (ReteICA) se declara y paga cada bimestre en una fecha única para todos; la del último bimestre de 2026 vence el ${h.date(rete[rete.length - 1].fechas.todos)}. La resolución no prevé descuento por pronto pago del ICA.`;
  },
  faqs: (h) => {
    const { pago, rete } = datos(h);
    return [
      { q: '¿Si declaré el ICA en Medellín a tiempo, cuándo tengo que pagarlo?', a: `Hasta el ${h.date(pago)}, con la factura que el Distrito genera en mayo a partir de su declaración, siempre que la Administración la haya procesado. Si al presentar eligió «Declarar y pagar», o si es autorretenedor u ocasional, el pago debía hacerse en el mismo momento de la presentación. Así lo dice el parágrafo 1 del artículo 3 de la Resolución 202550100057 de 2025.` },
      { q: '¿Debo presentar la declaración de ReteICA en Medellín si no retuve nada?', a: `No. La Resolución 202550100057 de 2025 dice que no es obligatorio presentar la declaración de retención en la fuente de industria y comercio en el bimestre en que no se practicaron retenciones. Si retuvo en el quinto bimestre de 2026, la fecha límite para declarar y pagar es el ${h.date(rete[4].fechas.todos)}, igual para todos los NIT.` },
      { q: '¿Cuándo sale el calendario del ICA de Medellín para 2027?', a: `Todavía no está publicado. El de 2026 se fijó con la ${datos(h).c.acto}. Mientras no se expida la resolución de 2027, esta página no muestra fechas para la declaración del año gravable 2026. Sí incluye el ReteICA de noviembre y diciembre de 2026, que vence en enero de 2027.` },
    ];
  },
  body: (h) => {
    const { c, decl, simp, rete } = datos(h);
    const filasDecl = ORDEN.map((d) => [d, h.date(decl[d])]);
    const filasBim = simp.filas.map((f, i) => [`${i + 1}`, h.date(f.fechas.todos), h.date(rete[i].fechas.todos)]);
    return `
<h2>Cómo usar la calculadora</h2>
<p>La herramienta ya está en Medellín: escriba el último dígito de su NIT, elija régimen ordinario o simplificado y marque ReteICA si retiene. El archivo .ics lleva las fechas a su agenda.</p>
<h2>Declaración anual del año gravable 2025, por último dígito</h2>
${h.table(['Último dígito', 'Fecha límite para declarar'], filasDecl, `${c.acto}, art. 1. El calendario empieza por el dígito 0`, ['l', 'l'])}
<p>El orden es inverso: el NIT terminado en 0 declaró primero y el terminado en 1, último. Después, todos pagan la factura en la misma fecha.</p>
<h2>Régimen simplificado y ReteICA: seis bimestres</h2>
${h.table(['Bimestre', 'Cobro régimen simplificado', 'ReteICA (declarar y pagar)'], filasBim, 'Fechas únicas, sin distinción por NIT', ['l', 'l', 'l'])}
<p>El Distrito liquida el impuesto del simplificado y envía el cobro. Quien está en el ${h.a('simple', 'Régimen Simple de Tributación')} no puede estar en este régimen municipal, según el Acuerdo 093 de 2023, art. 62. Compare con el ${h.a('ica-bogota', 'ICA de Bogotá')}.</p>`;
  },
});
