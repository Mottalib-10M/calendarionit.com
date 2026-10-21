import { defineHome } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** Primera y última fecha de una obligación nacional en el calendario 2026. */
const rango = (h: Helpers, id: string) => {
  const fs = (h.M.CALENDARIO.obligaciones as Record<string, Array<{ fechas: Record<string, string> }>>)[id].flatMap((f) => Object.values(f.fechas)).sort();
  return [fs[0], fs[fs.length - 1]] as const;
};

export default defineHome({
  title: 'Calendario tributario 2026 por NIT: DIAN, ICA y nómina',
  description: 'Calendario tributario 2026 por último dígito del NIT: renta, IVA, retención e ICA de su ciudad en orden, la próxima fecha primero y exportable a su agenda.',
  h1: 'Calendario tributario 2026 por NIT',
  intro: 'Escriba los últimos dígitos de su NIT y vea todas sus fechas del año, la próxima primero.',
  resume: (h) => {
    const pn = rango(h, 'renta_pn'), pj = rango(h, 'renta_pj'), gc = rango(h, 'renta_gc');
    return `El calendario tributario 2026 de la DIAN aplica el Decreto 2229 de 2023, que fija los plazos en días hábiles para 2024 y los años siguientes, y asigna cada fecha según el último dígito del NIT, o los dos últimos en la renta de personas naturales, siempre sin el dígito de verificación. Las personas naturales declaran renta del año gravable 2025 entre el ${h.date(pn[0])} y el ${h.date(pn[1])}; las personas jurídicas pagan en dos cuotas entre el ${h.date(pj[0])} y el ${h.date(pj[1])}; los grandes contribuyentes, en tres cuotas entre el ${h.date(gc[0])} y el ${h.date(gc[1])}. El IVA bimestral, la retención en la fuente mensual, el Régimen Simple y la información exógena siguen la misma lógica por dígito. La DIAN ya movió sus fechas por el día cívico del 17 de abril y por el nuevo festivo del lunes 13 de julio de 2026 (Ley 2578 de 2026), y el ICA depende de la resolución de cada ciudad: esta página reúne cinco de ellas y lo ordena todo para su NIT.`;
  },
  faqs: (h) => [
    { q: '¿Qué dígito del NIT cuenta para el calendario tributario?', a: 'El último dígito antes del guion, es decir, sin el dígito de verificación. En el NIT 900.123.453-7 cuenta el 3. Para la declaración de renta de personas naturales se usan los dos últimos dígitos de la cédula o del NIT, en parejas: 01 y 02 comparten fecha, 03 y 04 la siguiente, hasta 99 y 00. Algunas ciudades fijan el ICA en una fecha única para todos.' },
    { q: '¿Cuándo publica la DIAN el calendario tributario de 2027?', a: `Al cierre de esta revisión, el ${h.date(h.P.retrieved_at)}, no está publicado: la ruta del PDF de 2027 en el portal de la DIAN no responde. El Decreto 2229 de 2023 dejó reglas permanentes en días hábiles, pero las fechas exactas dependen de los festivos y de los ajustes que la DIAN haga. Aquí aparecerán como «por publicarse» hasta que salga el documento oficial.` },
    { q: '¿Las fechas de esta página tienen en cuenta el festivo del 13 de julio?', a: 'Sí. La Ley 2578 del 1 de junio de 2026 declaró festivo nacional el 9 de julio, Día de Nuestra Señora del Rosario de Chiquinquirá, y por la Ley 51 de 1983 se celebró el lunes 13. La DIAN corrió las fechas de julio: la cuota de renta de empresas, el IVA, la retención y el anticipo del Simple de los NIT terminados en 3 a 6 pasaron del 13 al 14 de julio en adelante.' },
    { q: '¿Puedo pasar mis vencimientos a Google Calendar o a Outlook?', a: 'Sí. Tras escribir su NIT y marcar sus obligaciones, el botón «Agregar a mi calendario» descarga un archivo .ics con un evento de día completo por cada fecha. Ábralo con Google Calendar, Outlook o el calendario del teléfono para importarlo. El archivo se crea en su navegador: el NIT no viaja a ningún servidor.' },
    { q: '¿Qué pasa si declaro un día después de mi fecha?', a: 'La declaración es extemporánea y genera sanción e intereses según el Estatuto Tributario, que la DIAN liquida sobre su caso. Esta página no calcula sanciones: solo ordena las fechas límite. Si ya venció su plazo, revise su situación con un contador público antes de presentar, porque la sanción depende del impuesto a cargo, de los ingresos y del tiempo transcurrido.' },
    { q: '¿Por qué el ICA de mi ciudad no sigue las fechas de la DIAN?', a: 'Porque el impuesto de industria y comercio es municipal: cada alcaldía fija su propio calendario por resolución de su secretaría de hacienda. Bogotá usa fechas únicas para todos, Medellín escalona la declaración anual por dígito en abril, Cali la separa por tramos de ingresos y Bucaramanga cobra la retención de ICA cada mes. Elija su ciudad en el calendario para sumarlas.' },
    { q: '¿Esta página es de la DIAN?', a: 'No. Es un sitio independiente publicado por Radif Partners, sin vínculo con la DIAN, el Ministerio del Trabajo ni ninguna alcaldía. Copiamos las fechas del calendario oficial y de cada resolución municipal, citamos el número de la norma y la fecha en que la leímos, y corregimos cuando la autoridad publica un cambio. Para presentar o pagar, use siempre los servicios en línea oficiales.' },
  ],
  body: (h) => {
    const C = h.M.CALENDARIO.obligaciones as Record<string, Array<{ fechas: Record<string, string> }>>;
    const fila = (id: string, quien: string, clave: string) => { const r = rango(h, id); return [quien, h.M.CALENDARIO && C[id] ? clave : '', h.date(r[0]), h.date(r[1])]; };
    const filas = [
      fila('renta_pn', 'Renta de personas naturales (año gravable 2025)', 'dos últimos dígitos'),
      fila('renta_pj', 'Renta de personas jurídicas, dos cuotas', 'último dígito'),
      fila('renta_gc', 'Renta de grandes contribuyentes, tres cuotas', 'último dígito'),
      fila('iva_bim', 'IVA bimestral', 'último dígito'),
      fila('iva_cuat', 'IVA cuatrimestral', 'último dígito'),
      fila('retencion', 'Retención en la fuente, cada mes', 'último dígito'),
      fila('rst_anticipo', 'Régimen Simple, anticipos bimestrales', 'último dígito'),
      fila('exogena', 'Información exógena, personas naturales y jurídicas', 'dos últimos dígitos'),
    ];
    const ej = h.M.vencimientos({ nit: '900123453', tipo: 'pj', iva: 'bim', retenedor: true, rst: false, activos: false, patrimonio: false, precios: false, ciudad: 'bogota', reteica: true });
    const ejPn = h.M.vencimientos({ nit: '1020304056', tipo: 'pn', iva: 'no', retenedor: false, rst: false, activos: false, patrimonio: false, precios: false, ciudad: '' });
    const fes = h.M.festivos(2026);
    return `
<h2>Cómo leer su NIT antes de buscar la fecha</h2>
<p>El Número de Identificación Tributaria tiene un dígito de verificación separado por un guion. Ese dígito no cuenta para el calendario. En el NIT 900.123.453-7 de una empresa, el número que manda es el 3. Para una persona natural que declara renta, la DIAN usa los dos últimos dígitos del documento: con la cédula 1.020.304.056, la pareja es 55-56, y su fecha de renta del año gravable 2025 es el ${h.dia(ejPn[0].fecha)}. Si su NIT termina en 0, la tabla lo ubica al final del rango; si termina en 00, en la última pareja, 99-00.</p>
<p>La calculadora de arriba hace esa lectura por usted: acepta el NIT con puntos, con guion o sin nada, descarta el dígito de verificación y busca en cada tabla la clave que le corresponde. Luego une las obligaciones que usted marque, las ordena por fecha y deja la próxima arriba, con los días que faltan.</p>
<h2>El calendario nacional de 2026 de un vistazo</h2>
${h.table(['Obligación', 'Se asigna por', 'Primera fecha', 'Última fecha'], filas, 'Calendario tributario 2026 de la DIAN, Decreto 2229 de 2023; fechas extremas de todas las terminaciones de NIT', ['l', 'l', 'l', 'l'])}
<p>Cada fila tiene su tabla completa en una página propia: ${h.a('renta-pn', 'renta de personas naturales')}, ${h.a('renta-pj', 'renta de empresas')}, ${h.a('iva', 'IVA')}, ${h.a('retencion-dian', 'retención en la fuente')}, ${h.a('simple', 'Régimen Simple')} e ${h.a('exogena', 'información exógena')}. Las fechas de enero de 2027 que aparecen en la tabla corresponden a períodos de 2026 (el sexto bimestre de IVA o la retención de diciembre) y ya están en el calendario publicado.</p>
<h2>Un ejemplo completo: una empresa en Bogotá</h2>
<p>Una sociedad con NIT terminado en 3, responsable de IVA bimestral, agente de retención en la fuente y contribuyente bimestral de ICA en Bogotá, que además practica retención de ICA, acumula ${ej.length} fechas en 2026. La primera es el ${h.date(ej[0].fecha)} y la última el ${h.date(ej[ej.length - 1].fecha)}. En un mes cualquiera puede tener tres vencimientos distintos, unos de la DIAN y otros de la Secretaría Distrital de Hacienda, con reglas que no se parecen: la DIAN mira el NIT, Bogotá pone una sola fecha para todos. Es el caso en que una lista ordenada ahorra más tiempo que el PDF.</p>
<h2>Los dos ajustes de 2026</h2>
<p>El calendario de este año tuvo dos correcciones después de su primera versión. La primera, por el día cívico del viernes 17 de abril de 2026, que el Decreto 500 de 2024 creó para el tercer viernes de abril: la DIAN lo trató como día no hábil y corrió las fechas de abril. La segunda, por el nuevo festivo nacional del 9 de julio, Día de Nuestra Señora del Rosario de Chiquinquirá, creado por el artículo 6 de la Ley 2578 del 1 de junio de 2026 y celebrado el lunes 13 de julio por la Ley 51 de 1983. Con él, Colombia pasa a ${fes.length} festivos en 2026, y las fechas de julio de la segunda cuota de renta de empresas, del IVA, de la retención y del Simple se movieron un día hábil desde el NIT terminado en 3. Las fechas de esta página ya incluyen ambos ajustes; la lista completa de días no hábiles está en ${h.a('festivos', 'festivos de Colombia')}.</p>
<p>Las alcaldías hicieron lo mismo por su lado. Cali, por ejemplo, corrió el tercer bimestre de ICA y de retención de ICA al 27 a 31 de julio con su Resolución 0692 de 2026. Otras, como Medellín o Bucaramanga, no tenían fechas en esa semana y no cambiaron nada.</p>
<h2>ICA: cinco ciudades, cinco reglas</h2>
<p>El impuesto de industria y comercio no lo cobra la DIAN sino cada municipio. Esta web solo incluye las ciudades cuya resolución de calendario 2026 pudimos leer en una fuente oficial: ${h.a('ica-bogota', 'Bogotá')}, ${h.a('ica-medellin', 'Medellín')}, ${h.a('ica-cali', 'Cali')}, ${h.a('ica-barranquilla', 'Barranquilla')} y ${h.a('ica-bucaramanga', 'Bucaramanga')}. Cartagena publicó su Decreto 2289 de 2025, pero su documento no se pudo consultar en el portal oficial, así que no aparece hasta poder leerlo. En el calendario, elija la ciudad y su régimen: las fechas municipales se suman a las nacionales en la misma lista.</p>
<p>Las diferencias son grandes. Bogotá separa a los contribuyentes bimestrales de los anuales según el impuesto a cargo del año anterior y no mira el NIT. Medellín recibe la declaración anual entre el 17 y el 30 de abril según el último dígito y deja pagar hasta junio. Cali tiene tres tramos de ingresos con fechas en marzo, abril y mayo. Barranquilla pide declaración anual en febrero y retenciones mensuales o bimestrales. Bucaramanga cobra la declaración anual en marzo y el impuesto en tres cuotas.</p>
<h2>¿Y 2027?</h2>
<p>El calendario tributario nacional de 2027 está por publicarse. El Decreto 2229 de 2023 dice que sus plazos en días hábiles «conservarán su vigencia a partir del calendario tributario 2024 y siguientes», así que las reglas no cambian salvo un nuevo decreto, pero las fechas exactas dependen de los festivos del año y de los ajustes de la DIAN. Por eso no proyectamos fechas de 2027: cuando la DIAN publique su documento a fin de año, las tablas de esta web se actualizan con él. Lo mismo vale para el ICA: cada ciudad expide su resolución en diciembre.</p>
<h2>Nómina: los valores de 2026 en un solo lugar</h2>
<p>La otra mitad del sitio sirve a quien paga o recibe un salario. El salario mínimo de 2026 es ${h.cop(h.P.nomina.smmlv)} (Decreto 1469 de 2025) y el auxilio de transporte ${h.cop(h.P.nomina.auxilio)} (Decreto 1470 de 2025) para quien gana hasta dos mínimos. Con ellos funcionan las calculadoras de ${h.a('liquidacion', 'liquidación laboral')}, ${h.a('cesantias', 'cesantías e intereses')}, ${h.a('prima', 'prima de servicios')}, ${h.a('vacaciones', 'vacaciones')} y ${h.a('recargos', 'recargos y horas extras')}, que ya aplican la jornada máxima de ${h.M.jornadaSemanal('2026-07-15')} horas semanales desde el 15 de julio de 2026 (Ley 2101 de 2021) y el recargo dominical y festivo del ${h.pct(h.M.recargoDominical('2026-07-01'))} vigente desde el 1 de julio (Ley 2466 de 2025). La ${h.a('retencion', 'retención en la fuente sobre salarios')} usa la UVT de ${h.cop(h.P.uvt['2026'])} fijada por la Resolución DIAN 000238 de 2025.</p>
<h2>Lo que hace y lo que no hace esta página</h2>
<ul>
<li>Ordena fechas oficiales para su NIT y las exporta a su agenda en un archivo .ics.</li>
<li>Cita en cada página el decreto o la resolución de donde sale cada fecha, con la fecha en que se leyó.</li>
<li>No presenta declaraciones, no calcula sanciones y no reemplaza los servicios en línea de la DIAN ni de su alcaldía.</li>
<li>No guarda su NIT: el cálculo corre en su navegador y el enlace para compartir solo lleva lo que usted ve en la pantalla.</li>
</ul>
<p>Si encuentra una fecha que no coincide con la norma, escríbanos desde la página de contacto con su terminación de NIT y el enlace a la fuente: la corrección se aplica en todas las páginas a la vez. El detalle de cómo se arma cada tabla está en ${h.a('method', 'método y fuentes')}.</p>
`;
  },
});
