import { defineText } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';
import type { FestivoId } from '../../lib/engine/fechas';

/** Festivos de Colombia 2026 (Ley 51 de 1983 y Ley 2578 de 2026) y días hábiles del año. */
const NOMBRE: Record<FestivoId, string> = {
  anio_nuevo: 'Año Nuevo', reyes: 'Reyes Magos', san_jose: 'San José', jueves_santo: 'Jueves Santo', viernes_santo: 'Viernes Santo',
  trabajo: 'Día del Trabajo', ascension: 'Ascensión del Señor', corpus: 'Corpus Christi', sagrado_corazon: 'Sagrado Corazón',
  san_pedro: 'San Pedro y San Pablo', chiquinquira: 'Virgen de Chiquinquirá', independencia: 'Independencia', boyaca: 'Batalla de Boyacá',
  asuncion: 'Asunción de la Virgen', raza: 'Día de la Raza', todos_santos: 'Todos los Santos', cartagena: 'Independencia de Cartagena',
  inmaculada: 'Inmaculada Concepción', navidad: 'Navidad',
};
const corto = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).replace(/ de /g, ' ').replace(/\./g, '');
const habiles = (h: Helpers) => { let n = 0; for (let d = '2026-01-01'; d <= '2026-12-31'; d = h.M.addDays(d, 1)) if (h.M.esHabil(d)) n++; return n; };
const CIVICO = '2026-04-17';

export default defineText({
  slug: 'festivos-colombia',
  nav: 'Festivos 2026',
  card: 'Los festivos de Colombia en 2026, cuáles se trasladan al lunes y cómo contar días hábiles para plazos.',
  title: 'Festivos en Colombia 2026: los 19 días y días hábiles',
  description: 'Festivos en Colombia 2026: los días oficiales con su fecha trasladada al lunes, el nuevo festivo de julio por la Ley 2578 de 2026 y un contador de días hábiles.',
  h1: 'Festivos de Colombia en 2026',
  intro: 'La lista completa del año, con el festivo nuevo de julio, y un contador de días hábiles para cualquier plazo.',
  resume: (h) => {
    const F = h.M.festivos(2026), chq = F.find((f) => f.id === 'chiquinquira')!;
    return `Colombia tiene ${F.length} festivos en 2026. La Ley 51 de 1983, conocida como Ley Emiliani, traslada al lunes siguiente los Reyes Magos, San José, San Pedro y San Pablo, la Asunción, el Día de la Raza, Todos los Santos y la Independencia de Cartagena, además de la Ascensión, el Corpus Christi y el Sagrado Corazón, que dependen de la Pascua; en 2026 el Domingo de Pascua cayó el ${h.date(h.M.pascua(2026))}. El año suma un festivo nuevo: la Ley 2578 de 2026, art. 6, declaró el ${h.date(chq.original).replace(/ de \d{4}$/, '')} Día de Nuestra Señora del Rosario de Chiquinquirá, que se descansó el lunes ${h.date(chq.fecha)}. Con esos festivos, 2026 tiene ${habiles(h)} días hábiles de lunes a viernes. El ${h.date(CIVICO)} fue día cívico por el Decreto 500 de 2024: no fue festivo, pero la DIAN no lo contó como hábil para los plazos del Decreto 2229 de 2023.`;
  },
  faqs: (h) => {
    const F = h.M.festivos(2026), chq = F.find((f) => f.id === 'chiquinquira')!;
    return [
      { q: '¿Cuál es el festivo nuevo de Colombia en 2026?', a: `El Día de Nuestra Señora del Rosario de Chiquinquirá, creado por la Ley 2578 del 1 de junio de 2026, art. 6. Su fecha es el 9 de julio, pero como se rige por la Ley 51 de 1983 se descansa el lunes siguiente: en 2026 fue el ${h.date(chq.fecha)}. Con él, el año pasó de 18 a ${F.length} festivos.` },
      { q: '¿El 17 de abril de 2026 fue festivo en Colombia?', a: `No. Fue un día cívico decretado por el Decreto 500 de 2024, que no tiene el carácter de festivo nacional. Sin embargo, la DIAN no lo trató como día hábil en su calendario: por eso varias declaraciones de abril que caían ese viernes pasaron al lunes ${h.date(h.M.sumarHabiles(CIVICO, 1))}. El contador de esta página no lo resta: hágalo a mano si su plazo pasa por ese día.` },
      { q: '¿Cuántos días hábiles tiene 2026 en Colombia?', a: `${habiles(h)}, contando de lunes a viernes y restando los ${F.length} festivos que caen entre semana. Si además se descuenta el día cívico del 17 de abril, quedan ${habiles(h) - 1}. Es la cuenta que importa para plazos legales y tributarios, que en Colombia se expresan casi siempre en días hábiles.` },
    ];
  },
  body: (h) => {
    const rows = h.M.festivos(2026).map((f) => [corto(f.fecha), NOMBRE[f.id], f.trasladado ? corto(f.original) : 'misma fecha']);
    return `
<h2>Cómo usar el contador</h2>
<p>Elija el año para ver su lista de festivos. En «Plazo», escriba el día de la notificación y el número de días hábiles para saber cuándo vence; en «Contar», ponga dos fechas y verá los días hábiles entre ellas.</p>
<h2>Los festivos de 2026</h2>
${h.table(['Se descansa', 'Festivo', 'Fecha original'], rows, 'Festivos nacionales de 2026 (Ley 51 de 1983 y Ley 2578 de 2026)', ['l', 'l', 'l'])}
<h2>Dónde pesan los festivos</h2>
<p>En la nómina, trabajar un festivo se paga con el recargo dominical y festivo, del ${h.pct(h.M.recargoDominical('2026-07-01'))} desde el 1 de julio de 2026 (vea ${h.a('recargos', 'recargos')}), y las ${h.a('vacaciones', 'vacaciones')} se cuentan en días hábiles, así que un festivo dentro de ellas las alarga. En impuestos, cada vencimiento del ${h.a('renta-pn', 'calendario de renta')} salta sábados, domingos y festivos.</p>
`;
  },
});
