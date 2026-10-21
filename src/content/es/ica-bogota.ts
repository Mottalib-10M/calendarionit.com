import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';
import { periodo } from '../../lib/etiquetas';

/** ICA y ReteICA de Bogotá 2026 (Resolución SDH-000195 de 2025): fechas únicas, sin dígito del NIT. */
const B = (h: Helpers) => h.M.ciudad('bogota')!;
const reg = (h: Helpers, id: string) => B(h).regimenes.find((r) => r.id === id)!;
const una = (r: { fechas: Record<string, string> }) => r.fechas.todos;
/** 391 UVT, leído del texto del régimen bimestral en ica-2026.json. */
const umbral = (h: Helpers) => Number(/(\d+) UVT/.exec(reg(h, 'bimestral').quien.es)![1]);
const corto = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', ...(iso.startsWith('2026') ? {} : { year: 'numeric' }), timeZone: 'UTC' }).replace(/ de /g, ' ').replace(/\./g, '');
/** Sobretasa bomberil anual: la resolución (art. 2) dice 27 de febrero de 2027; el calendario oficial, el plazo del régimen anual. */
const BOMBERIL_RES = '2027-02-27';

export default defineText({
  slug: 'ica-bogota',
  nav: 'ICA Bogotá',
  card: 'Fechas del ICA bimestral, anual y preferencial y del ReteICA en Bogotá para 2026, iguales para todos los NIT.',
  title: 'ICA Bogotá 2026: fechas bimestrales, anual y ReteICA',
  description: 'ICA Bogotá 2026: las seis fechas bimestrales, la declaración anual y preferencial de febrero de 2027 y el ReteICA, según la Resolución SDH-000195 de 2025.',
  h1: 'ICA en Bogotá: calendario 2026',
  intro: 'En Bogotá el ICA no depende del NIT: todos los contribuyentes de un mismo régimen tienen la misma fecha.',
  resume: (h) => {
    const bim = reg(h, 'bimestral').filas, anual = una(reg(h, 'anual').filas[0]), rete = B(h).retencion!.filas;
    return `El impuesto de industria y comercio (ICA) de Bogotá se declara en 2026 con las fechas de la Resolución SDH-000195 de 2025 de la Secretaría Distrital de Hacienda, que no dependen del último dígito del NIT: cada régimen tiene una fecha única. Declaran bimestralmente los contribuyentes del régimen común cuyo impuesto a cargo del año gravable 2025 superó ${umbral(h)} UVT, es decir ${h.cop(umbral(h) * h.P.uvt['2025'])}; sus seis vencimientos van del ${h.date(una(bim[0]))} al ${h.date(una(bim[bim.length - 1]))}. Quien no superó ese tope presenta una sola declaración anual del año gravable 2026 el ${h.date(anual)}, la misma fecha del régimen preferencial. Los agentes de retención declaran el ReteICA cada bimestre, del ${h.date(una(rete[0]))} al ${h.date(una(rete[rete.length - 1]))}. El ICA no tiene descuento por pronto pago. La versión del calendario oficial del 28 de julio de 2026 no cambió ninguna fecha de ICA por el festivo del 13 de julio.`;
  },
  faqs: (h) => {
    const anual = una(reg(h, 'anual').filas[0]);
    return [
      { q: '¿El ICA de Bogotá depende del último dígito del NIT?', a: 'No. A diferencia del calendario nacional de la DIAN, la Resolución SDH-000195 de 2025 fija una sola fecha por periodo para todos los contribuyentes del mismo régimen, sin importar el NIT. Lo mismo ocurre con el ReteICA. Por eso la calculadora muestra las fechas de Bogotá iguales con cualquier dígito que escriba.' },
      { q: '¿Quién declara ICA anual en Bogotá y no bimestral?', a: `El contribuyente del régimen común cuyo impuesto a cargo de todo el año gravable 2025 no superó ${umbral(h)} UVT (${h.cop(umbral(h) * h.P.uvt['2025'])}). Presenta una única declaración del año gravable 2026 a más tardar el ${h.date(anual)}. Los pequeños contribuyentes del régimen preferencial tienen esa misma fecha.` },
      { q: '¿Hay descuento por pronto pago en el ICA de Bogotá?', a: 'No. Los descuentos por pronto pago de la resolución de plazos de 2026 se aplican al impuesto predial y al de vehículos, no al ICA. El calendario distrital menciona un aporte voluntario para el ICA, pero es una contribución adicional que decide el contribuyente, no una rebaja del impuesto.' },
      { q: '¿Cuándo se declara la sobretasa bomberil anual en Bogotá?', a: `Hay dos fechas publicadas. El artículo 2 de la Resolución SDH-000195 de 2025 dice ${h.date(BOMBERIL_RES)}, mientras que el calendario oficial remite al plazo del régimen común anual, el ${h.date(anual)}. Por prudencia, conviene presentarla a más tardar el ${h.date(anual)}. Quien declara bimestralmente usa las mismas fechas bimestrales del ICA.` },
    ];
  },
  body: (h) => {
    const bim = reg(h, 'bimestral').filas, rete = B(h).retencion!.filas, anual = una(reg(h, 'anual').filas[0]);
    const rows = bim.map((r, i) => [periodo(r.periodo, 'es'), corto(una(r)), corto(una(rete[i]))]);
    rows.push(['Año gravable 2026, anual y preferencial', corto(anual), 'no aplica']);
    return `
<h2>Cómo usar la calculadora</h2>
<p>Bogotá ya viene seleccionada: elija su régimen de ICA (bimestral, anual o preferencial) y marque ReteICA si es agente de retención. Las fechas distritales se suman a las de la DIAN en la misma lista.</p>
<h2>Fechas de 2026</h2>
${h.table(['Periodo', 'ICA bimestral', 'ReteICA'], rows, 'Declaración y pago, Resolución SDH-000195 de 2025', ['l', 'l', 'l'])}
<p>El ReteICA vence antes que el ICA del mismo bimestre: el de enero-febrero, por ejemplo, el ${h.date(una(rete[0]))}, frente al ${h.date(una(bim[0]))} del impuesto. El sexto bimestre de 2026 se declara en 2027, con fechas ya fijadas por la misma resolución.</p>
<p>Si su empresa opera en otras ciudades, cada una tiene su calendario: compare con ${h.a('ica-medellin', 'ICA Medellín')} y ${h.a('ica-cali', 'ICA Cali')}. Las obligaciones nacionales, como la ${h.a('renta-pj', 'renta de sociedades')}, siguen el NIT.</p>
`;
  },
});
