import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

const datos = (h: Helpers) => {
  const c = h.M.ciudad('bucaramanga')!;
  const comun = c.regimenes.find((r) => r.id === 'comun')!;
  const pref = c.regimenes.find((r) => r.id === 'preferencial')!;
  const f = (r: typeof comun, a: string) => r.filas.find((x) => x.accion === a)!.fechas;
  return { c, decl: f(comun, 'decl'), cuotas: ['pago1', 'pago2', 'pago3'].map((a) => f(comun, a).todos), pref: ['pago1', 'pago2'].map((a) => f(pref, a).todos), rete: c.retencion!.filas };
};
const DIG = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const GRUPOS = ['1-3', '4-6', '7-0'];
/** Nombre del mes en minúsculas (« marzo »), sacado de la fecha escrita por h.date. */
const mes = (h: Helpers, iso: string) => h.date(iso).replace(/^\d+ de /, '').replace(/ de \d{4}$/, '');

export default defineText({
  slug: 'ica-bucaramanga',
  nav: 'ICA Bucaramanga',
  card: 'Declaración en marzo por dígito, pago en tres cuotas, cuantía fija del régimen preferencial y ReteICA mensual.',
  title: 'ICA Bucaramanga 2026: declaración, cuotas y ReteICA',
  description: 'ICA Bucaramanga 2026: declaración del 2 al 24 de marzo según el último dígito del NIT, pago en tres cuotas hasta septiembre y ReteICA mensual por grupos.',
  h1: 'ICA de Bucaramanga: calendario 2026',
  intro: 'En Bucaramanga se declara en marzo y el impuesto anual se paga en tres cuotas.',
  resume: (h) => {
    const { decl, cuotas, pref, rete } = datos(h);
    return `En Bucaramanga, la Resolución 4-R--202512-00030019 de 2025 fijó el calendario 2026 del impuesto de industria y comercio, con avisos y tableros y sobretasa bomberil. Los contribuyentes del régimen común presentaron la declaración del año gravable 2025 entre el ${h.date(decl['1'])} (último dígito 1) y el ${h.date(decl['0'])} (dígito 0), y pueden pagar el impuesto en tres cuotas: ${h.date(cuotas[0])}, ${h.date(cuotas[1])} y ${h.date(cuotas[2])}. El régimen preferencial no declara: paga una cuantía fija en una cuota o en dos, el ${h.date(pref[0])} y el ${h.date(pref[1])}. La retención y autorretención de ICA se declaran cada mes, con tres fechas según el último dígito: 1 a 3, 4 a 6 y 7 a 0. Solo hubo un cambio: la Resolución 4-R-SdHM-202604-00003143 de 2026 movió el periodo de marzo de los NIT terminados en 7, 8, 9 y 0 al ${h.date(rete[2].fechas['7-0'])}, por un día cívico. La resolución no contempla descuento por pronto pago del ICA, y el calendario de 2027 aún no se ha publicado.`;
  },
  faqs: (h) => {
    const { cuotas, rete } = datos(h);
    return [
      { q: '¿Cuándo vencen las cuotas del ICA de Bucaramanga?', a: `Para el régimen común, el impuesto del año gravable 2025 se paga en tres cuotas que vencen el ${h.date(cuotas[0])}, el ${h.date(cuotas[1])} y el ${h.date(cuotas[2])}, según el artículo 2 de la Resolución 4-R--202512-00030019 de 2025. La declaración, en cambio, tenía fecha propia en marzo según el dígito. El régimen preferencial tiene solo dos fechas de pago y no presenta declaración anual.` },
      { q: '¿Tengo que declarar ReteICA en Bucaramanga si en el mes no retuve?', a: `No. La misma resolución recuerda que la declaración de retención y autorretención de ICA no es obligatoria en los periodos en que no hubo operaciones sujetas a retención. Si retuvo en octubre de 2026, la fecha depende del último dígito del NIT: ${h.date(rete[9].fechas['1-3'])} para 1 a 3, ${h.date(rete[9].fechas['4-6'])} para 4 a 6 y ${h.date(rete[9].fechas['7-0'])} para 7 a 0.` },
      { q: '¿Por qué cambió la fecha de ReteICA de marzo en Bucaramanga?', a: `Porque el día en que vencía el grupo de NIT terminados en 7, 8, 9 y 0 se declaró día cívico en el municipio. La Secretaría de Hacienda expidió la Resolución 4-R-SdHM-202604-00003143 del 16 de abril de 2026 y fijó la nueva fecha en el ${h.date(rete[2].fechas['7-0'])}. Los otros dos grupos de dígitos conservaron sus fechas.` },
    ];
  },
  body: (h) => {
    const { decl, rete } = datos(h);
    const filas = rete.map((f) => [mes(h, `${f.periodo}-01`), mes(h, f.fechas['1-3']), ...GRUPOS.map((g) => String(Number(f.fechas[g].slice(8))))]);
    return `
<h2>Cómo usar la calculadora</h2>
<p>La ciudad ya está fijada en Bucaramanga. Indique el último dígito del NIT o de la cédula, elija régimen común o preferencial y active ReteICA si es agente retenedor: verá las cuotas, la declaración y las doce retenciones del año.</p>
<h2>Declaración anual y cuotas</h2>
${h.table(['Último dígito', ...DIG], [['Día de marzo', ...DIG.map((d) => String(Number(decl[d].slice(8))))]], 'Declaración del año gravable 2025, marzo de 2026', ['l', ...DIG.map(() => 'r' as const)])}
<p>A diferencia de Medellín o Barranquilla, aquí el orden va del 1 al 0, repartido en poco más de tres semanas.</p>
<h2>ReteICA mensual de 2026</h2>
${h.table(['Periodo', 'Vence en', 'Dígitos 1 a 3', 'Dígitos 4 a 6', 'Dígitos 7 a 0'], filas, 'Día del mes de vencimiento. El periodo de diciembre vence en enero de 2027', ['l', 'l', 'r', 'r', 'r'])}
<p>El periodo de marzo ya incluye el cambio de los dígitos 7 a 0. En el sitio también están el ${h.a('ica-barranquilla', 'ICA de Barranquilla')} y el ${h.a('ica-bogota', 'ICA de Bogotá')}; la ${h.a('renta-pj', 'renta de las empresas')} sigue el calendario nacional de la DIAN.</p>`;
  },
});
