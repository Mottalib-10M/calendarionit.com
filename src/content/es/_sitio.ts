import { defineSitio } from '../../lib/define';
import { CONTACT_EMAIL } from '../../data/site-config';

export default defineSitio({
  about: {
    title: 'Calendario NIT 2026: quién publica esta web y por qué',
    description: 'Quiénes somos: Radif Partners publica Calendario NIT con las fechas oficiales de la DIAN y las alcaldías, sin vender software ni pedir datos personales.',
    h1: 'Quiénes somos',
    body: (h) => `
<p>Calendario NIT lo publica Radif Partners, una empresa editora de calculadoras y guías prácticas. La web responde a la pregunta que se hace cada contador, cada empresario y cada persona que declara renta en Colombia: con mi NIT, ¿cuándo vence lo mío? El documento oficial existe, pero es un PDF con decenas de tablas que hay que recorrer a mano, y el impuesto municipal está en otra resolución, en otro portal. Aquí se escriben los dígitos una vez y aparecen todas las fechas en orden.</p>
<h2>Lo que hacemos mejor que la primera página de Google</h2>
<p>Ordenamos al momento, sin correo ni registro, todas las fechas del año para un NIT: renta, IVA, retención, Régimen Simple, información exógena e ICA de cinco ciudades, con la próxima fecha arriba y un archivo para la agenda. Cada página cita el decreto o la resolución de donde sale cada fecha, con la fecha en que la leímos. Las calculadoras de nómina usan una sola tabla de valores de 2026, la misma en todas las páginas.</p>
<h2>Financiación e independencia</h2>
<p>La web no vende software contable, no cobra comisiones, no enlaza a proveedores y no recoge datos de contacto. No es una web oficial ni tiene relación con la DIAN, el Ministerio del Trabajo ni ninguna alcaldía, y no usa sus logotipos.</p>
<h2>Cómo trabajamos</h2>
<p>Las fechas y los valores están en ficheros de datos, cada uno con su norma y el día en que se leyó (${h.date(h.P.retrieved_at)} en esta versión). Una fecha que no podemos leer en una fuente oficial no se publica; lo que la autoridad no ha publicado, como el calendario de 2027, aparece «por publicarse». El detalle está en ${h.a('method', 'método y fuentes')}.</p>
<!--identidad-->
<h2>Contacto</h2>
<p>Para señalar un error: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>. No damos asesoría individual ni presentamos declaraciones.</p>
`,
  },
  method: {
    title: 'Método y fuentes 2026: así armamos cada calendario',
    description: 'Método y fuentes: de dónde sale cada fecha del calendario tributario 2026 por NIT, cómo se leen las resoluciones de ICA y cómo se calcula la liquidación.',
    h1: 'Método y fuentes',
    body: (h) => `
<h2>Calendario nacional</h2>
<p>Las fechas nacionales se copiaron del PDF «Calendario tributario 2026» de la DIAN, que aplica el Decreto 2229 de 2023 (compilado en el Decreto Único Reglamentario 1625 de 2016). Cada tabla se leyó por coordenadas y se comprobó contra la imagen del documento, y luego una prueba automática verifica que todas las fechas caen en día hábil, con los ${h.M.festivos(2026).length} festivos de 2026, incluido el del lunes 13 de julio (Ley 2578 de 2026). La información exógena sale de la Resolución DIAN 000227 de 2025, con sus cambios de las Resoluciones 000012 y 000021 de 2026.</p>
<h2>Lectura del NIT</h2>
<p>Se descarta todo lo que va después del guion (dígito de verificación) y se toman el último dígito o los dos últimos, según la tabla. Las claves por rangos, como «9-0» o «99-00», dan la vuelta: incluyen el 9 y el 0, o el 99 y el 00.</p>
<h2>ICA municipal</h2>
<p>Cada ciudad tiene su fichero con la resolución de su secretaría de hacienda, sus regímenes y sus modificaciones del año. Solo entran ciudades cuya norma se pudo leer en una fuente oficial: Bogotá (Resolución SDH-000195 de 2025), Medellín (Resolución 202550100057 de 2025), Cali (Resolución 4131.010.21.0607 de 2025 y sus modificaciones), Barranquilla (Resolución DSH 003 de 2025, leída en la página oficial del calendario) y Bucaramanga (Resolución 4-R--202512-00030019 de 2025).</p>
<h2>Nómina</h2>
<p>Las calculadoras usan el salario mínimo y el auxilio de transporte de 2026, el Código Sustantivo del Trabajo y las Leyes 2101 de 2021 y 2466 de 2025. Las fracciones de año se cuentan en año comercial de 360 días, como hacen las nóminas; el auxilio de transporte entra en la base de cesantías, intereses y prima, no en la de vacaciones. La retención sobre salarios aplica la tabla del artículo 383 del Estatuto Tributario con la UVT de ${h.cop(h.P.uvt['2026'])}. Son estimaciones: la liquidación de su empleador puede incluir conceptos que estas calculadoras no conocen.</p>
<h2>Actualización</h2>
<p>Un script revisa cada día si la DIAN publicó el calendario del año siguiente; cuando aparece, las fechas se copian, se prueban y se publican con la nueva fecha de revisión. Los valores de nómina se cambian cuando sale el decreto correspondiente, normalmente a fin de diciembre.</p>
`,
    faqs: (h) => [
      { q: '¿Cómo se comprueba que una fecha del calendario es correcta?', a: 'Cada fecha se copia del documento oficial y pasa dos controles: se compara con la imagen del PDF de la DIAN o de la resolución municipal, y una prueba automática verifica que cae en día hábil según los festivos del año. Si una fecha no pasa, no se publica hasta resolver la diferencia con la fuente.' },
      { q: '¿Por qué algunas ciudades no tienen calendario de ICA en la web?', a: 'Porque solo publicamos el ICA de una ciudad cuando leemos su resolución en una fuente oficial. Si el portal de la alcaldía bloquea la consulta o el documento no está publicado, preferimos dejarla fuera antes que copiar fechas de un blog o de un software contable que pueden estar desactualizadas o mal transcritas.' },
      { q: '¿Con qué frecuencia se revisan los valores de nómina?', a: `Cada vez que se publica una norma que los cambia y, como mínimo, cada diciembre, cuando salen el salario mínimo y el auxilio de transporte del año siguiente. La última revisión de esta versión es del ${h.date(h.P.retrieved_at)}. Los valores de 2027 aparecerán «por publicarse» hasta que exista el decreto.` },
    ],
  },
});
