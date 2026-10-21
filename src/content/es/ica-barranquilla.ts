import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

const datos = (h: Helpers) => {
  const c = h.M.ciudad('barranquilla')!;
  const reg = (id: string) => c.regimenes.find((r) => r.id === id)!;
  const gran = reg('gran'), comun = reg('comun'), pref = reg('preferencial');
  const anual = (p: string) => gran.filas.find((f) => f.periodo === p)!.fechas;
  const fila = (r: typeof gran, p: string) => r.filas.find((f) => f.periodo === p)!.fechas;
  return { c, gran, comun, pref, ag25: anual('AG2025'), ag26: anual('AG2026'), fila };
};
const ORDEN = ['0', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
const rango = (h: Helpers, a: string, b: string) => (a.slice(0, 7) === b.slice(0, 7) ? `${Number(a.slice(8))} al ${h.date(b)}` : `${h.date(a)} al ${h.date(b)}`);

export default defineText({
  slug: 'ica-barranquilla',
  nav: 'ICA Barranquilla',
  card: 'Declaración anual en febrero, retenciones mensuales o bimestrales según el régimen y pago fijo del preferencial.',
  title: 'ICA Barranquilla 2026: declaración anual y retenciones',
  description: 'ICA Barranquilla 2026: declaración anual en febrero por último dígito del NIT, retenciones mensuales o bimestrales según el régimen y fechas publicadas de 2027.',
  h1: 'ICA de Barranquilla: plazos 2026 y febrero de 2027',
  intro: 'Barranquilla publica en un mismo calendario la declaración anual de febrero y las retenciones del año.',
  resume: (h) => {
    const { ag25, ag26, fila, gran, comun, pref } = datos(h);
    const oct = fila(gran, '2026-10'), b5 = fila(comun, '2026-B5');
    return `En Barranquilla, todos los contribuyentes del impuesto de industria y comercio presentan una declaración anual en febrero, por el último dígito del NIT. La del año gravable 2025 venció del ${rango(h, ag25['0'], ag25['1'])}, según la Resolución DSH 001 de 2024; la del año gravable 2026 vencerá del ${rango(h, ag26['0'], ag26['1'])}, según la Resolución DSH 003 de 2025. Lo que cambia según el régimen son las retenciones y autorretenciones de ICA: los grandes contribuyentes las declaran cada mes, el régimen común cada bimestre y el régimen simplificado preferencial paga su autorretención cada bimestre en una fecha única. Así, el mes de octubre de 2026 de un gran contribuyente vence del ${rango(h, oct['0'], oct['1'])} y el quinto bimestre del régimen común, del ${rango(h, b5['0'], b5['1'])}; el preferencial paga hasta el ${h.date(fila(pref, '2026-B5').todos)}. Las fechas vienen de la página oficial del calendario; el PDF de la resolución no se pudo leer. No hay descuento por pronto pago del ICA.`;
  },
  faqs: (h) => {
    const { fila, gran, comun } = datos(h);
    const dic = fila(gran, '2026-12'), b6 = fila(comun, '2026-B6');
    return [
      { q: '¿Por qué los NIT terminados en 9 y en 8 tienen la misma fecha en enero de 2027?', a: `Porque así aparece en la tabla publicada por la Secretaría Distrital de Hacienda: para diciembre de 2026 (grandes contribuyentes) y para noviembre y diciembre de 2026 (régimen común), los dígitos 9 y 8 vencen ambos el ${h.date(dic['9'])}, y el 0 el ${h.date(b6['0'])}. Ninguna publicación oficial lo ha modificado, así que esta página lo reproduce tal cual. Presentar un día antes evita cualquier duda.` },
      { q: '¿El régimen simplificado preferencial de Barranquilla declara ICA?', a: `Sí presenta la declaración anual en febrero, con las mismas fechas por dígito que los demás. Lo que lo distingue es la autorretención: no la declara mes a mes, sino que la paga cada bimestre en una fecha común para todos los NIT, por ejemplo el ${h.date(datos(h).fila(datos(h).pref, '2026-B6').todos)} para noviembre y diciembre de 2026. La calculadora muestra ambas obligaciones al elegir ese régimen.` },
      { q: '¿El sitio tiene el calendario del ICA de Cartagena?', a: `Todavía no. El decreto oficial con los plazos de Cartagena no se pudo leer en una fuente oficial, y esta web solo publica fechas copiadas del acto que las fija. Por ahora el sitio cubre Bogotá, Medellín, Cali, Barranquilla y Bucaramanga, además del calendario nacional de la DIAN.` },
    ];
  },
  body: (h) => {
    const { ag25, ag26 } = datos(h);
    const corto = (d: string) => h.date(d).replace(/ de 20\d\d$/, '');
    const filas = ORDEN.map((d) => [d, corto(ag25[d]), corto(ag26[d])]);
    return `
<h2>Cómo usar la calculadora</h2>
<p>Barranquilla ya viene seleccionada: escriba el último dígito del NIT y elija entre grandes contribuyentes, régimen común o simplificado preferencial. Cada régimen trae su propio ritmo de retenciones; el botón de calendario descarga todas las fechas.</p>
<h2>Declaración anual: febrero de 2026 y febrero de 2027</h2>
${h.table(['Último dígito', 'Año gravable 2025 (vence en 2026)', 'Año gravable 2026 (vence en 2027)'], filas, 'Resolución DSH 001 de 2024 y Resolución DSH 003 de 2025, según la página oficial del calendario tributario', ['l', 'l', 'l'])}
<p>El calendario de Barranquilla ya fija la declaración del año gravable 2026, algo que Medellín, Cali y Bucaramanga todavía no han fijado. El dígito 0 abre la ventana y el 1 la cierra.</p>
<h2>Tres ritmos de retención</h2>
<ul>
<li>Grandes contribuyentes: declaración mensual de retenciones y autorretenciones, por último dígito.</li>
<li>Régimen común: declaración bimestral de retenciones y autorretenciones, por último dígito.</li>
<li>Simplificado preferencial: pago bimestral de la autorretención, en fecha única.</li>
</ul>
<p>Las condiciones para pertenecer a cada régimen están en el Estatuto Tributario Distrital, que esta página no reproduce. Si su empresa también practica retención en la fuente nacional, vea el ${h.a('retencion-dian', 'calendario de retención de la DIAN')}, y para otras capitales, el ${h.a('ica-bucaramanga', 'ICA de Bucaramanga')} o el ${h.a('ica-bogota', 'ICA de Bogotá')}.</p>`;
  },
});
