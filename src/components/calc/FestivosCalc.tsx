/**
 * Festivos de Colombia y días hábiles : lista del año (Ley 51 de 1983 y Ley 2578 de 2026) y cálculo de un
 * plazo en días hábiles. Premier rendu = jour du build ; le jour réel s'applique dans useEffect.
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { T, Frame, Botones, type L } from './kit';
import { readParams, updateURL } from '../../lib/url-state';
import { festivos, sumarHabiles, habilesEntre, weekday, type FestivoId } from '../../lib/engine/fechas';
import { fechaLarga } from '../../lib/etiquetas';

declare const __BUILD_DAY__: string;

export const NOMBRE_FESTIVO: Record<FestivoId, [string, string]> = {
  anio_nuevo: ['Año Nuevo', "New Year's Day"], reyes: ['Día de los Reyes Magos', 'Epiphany'], san_jose: ['Día de San José', "Saint Joseph's Day"],
  jueves_santo: ['Jueves Santo', 'Maundy Thursday'], viernes_santo: ['Viernes Santo', 'Good Friday'], trabajo: ['Día del Trabajo', 'Labour Day'],
  ascension: ['Ascensión del Señor', 'Ascension Day'], corpus: ['Corpus Christi', 'Corpus Christi'], sagrado_corazon: ['Sagrado Corazón', 'Sacred Heart'],
  san_pedro: ['San Pedro y San Pablo', 'Saints Peter and Paul'], chiquinquira: ['Nuestra Señora del Rosario de Chiquinquirá', 'Our Lady of the Rosary of Chiquinquirá'],
  independencia: ['Día de la Independencia', 'Independence Day'], boyaca: ['Batalla de Boyacá', 'Battle of Boyacá'], asuncion: ['Asunción de la Virgen', 'Assumption Day'],
  raza: ['Día de la Raza', 'Columbus Day (Día de la Raza)'], todos_santos: ['Todos los Santos', "All Saints' Day"], cartagena: ['Independencia de Cartagena', 'Independence of Cartagena'],
  inmaculada: ['Inmaculada Concepción', 'Immaculate Conception'], navidad: ['Navidad', 'Christmas Day'],
};

export default function FestivosCalc({ lang: l, methodHref }: { lang: L; methodHref?: string }) {
  const [hoy, setHoy] = useState(__BUILD_DAY__);
  const [anio, setAnio] = useState(Number(__BUILD_DAY__.slice(0, 4)));
  const [modo, setModo] = useState<'sumar' | 'contar'>('sumar');
  const [desde, setDesde] = useState(__BUILD_DAY__);
  const [hasta, setHasta] = useState(__BUILD_DAY__.slice(0, 4) + '-12-31');
  const [n, setN] = useState(10);
  useEffect(() => {
    const d = new Date().toISOString().slice(0, 10);
    setHoy(d);
    const u = readParams(window.location.search);
    setAnio(Number(u.get('a') ?? d.slice(0, 4)));
    setDesde(u.get('d') ?? d);
    if (u.get('h')) setHasta(u.get('h')!);
    if (u.get('n')) setN(Math.max(1, Math.min(365, Number(u.get('n')) || 10)));
    if (u.get('m') === 'contar') setModo('contar');
  }, []);
  useEffect(() => { updateURL({ a: anio, m: modo, d: desde, h: hasta, n }); }, [anio, modo, desde, hasta, n]);

  const lista = useMemo(() => festivos(anio), [anio]);
  const prox = festivos(Number(hoy.slice(0, 4))).concat(festivos(Number(hoy.slice(0, 4)) + 1)).find((f) => f.fecha >= hoy);
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(desde) && /^\d{4}-\d{2}-\d{2}$/.test(hasta);
  const resultado = ok ? (modo === 'sumar' ? sumarHabiles(desde, n) : String(habilesEntre(desde, hasta))) : '';
  const lunes = lista.filter((f) => weekday(f.fecha) === 1).length;
  const inp = 'tabular-nums h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20';
  const y0 = Number(__BUILD_DAY__.slice(0, 4));

  const form = (
    <>
      <div className="grid grid-cols-2 gap-x-4">
        <SelectField id="fes-anio" label={T(l, 'Año', 'Year')} value={String(anio)} onChange={(v) => setAnio(Number(v))}
          options={[y0 - 1, y0, y0 + 1].map((y) => ({ value: String(y), label: String(y) }))} />
        <Botones id="fes-modo" label={T(l, 'Calcular', 'Calculate')} value={modo} onChange={setModo}
          options={[{ value: 'sumar', label: T(l, 'Plazo', 'Deadline') }, { value: 'contar', label: T(l, 'Contar', 'Count') }]} />
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <div><label htmlFor="fes-desde" className="mb-1 block text-sm font-medium text-navy-700">{T(l, 'Desde (día de la notificación)', 'From (notice day)')}</label>
          <input id="fes-desde" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className={inp} /></div>
        {modo === 'sumar' ? (
          <div><label htmlFor="fes-n" className="mb-1 block text-sm font-medium text-navy-700">{T(l, 'Días hábiles', 'Business days')}</label>
            <input id="fes-n" type="number" min={1} max={365} value={n} onChange={(e) => setN(Math.max(1, Math.min(365, Number(e.target.value) || 1)))} className={`${inp} text-right`} /></div>
        ) : (
          <div><label htmlFor="fes-hasta" className="mb-1 block text-sm font-medium text-navy-700">{T(l, 'Hasta', 'Until')}</label>
            <input id="fes-hasta" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className={inp} /></div>
        )}
      </div>
      <p className="text-xs text-navy-500">{T(l, 'Día hábil: de lunes a viernes, sin festivos. El día de inicio no se cuenta.', 'Business day: Monday to Friday, excluding holidays. The start day is not counted.')}</p>
    </>
  );

  const result = (
    <div aria-live="polite" data-resultat className="mt-6 rounded-xl border border-accent-200 bg-accent-50/60 p-4 sm:p-5 lg:sticky lg:top-20 lg:mt-0">
      <div className="filete-bandera mb-3" aria-hidden="true" />
      <p className="text-sm font-medium text-navy-700">{modo === 'sumar' ? T(l, `El plazo de ${n} días hábiles vence el`, `${n} business days end on`) : T(l, 'Días hábiles en el intervalo', 'Business days in the range')}</p>
      <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{ok ? (modo === 'sumar' ? fechaLarga(resultado, l) : resultado) : '—'}</p>
      {prox && <p className="mt-3 text-navy-800">{T(l, 'Próximo festivo:', 'Next holiday:')} <strong>{fechaLarga(prox.fecha, l)}</strong>, {NOMBRE_FESTIVO[prox.id][l === 'en' ? 1 : 0]}</p>}
      <p className="mt-1 text-sm text-navy-600">{T(l, `${anio}: ${lista.length} festivos, ${lunes} de ellos en lunes.`, `${anio}: ${lista.length} public holidays, ${lunes} of them on a Monday.`)}</p>
      <div className="no-print mt-4 flex flex-wrap gap-2 text-sm">
        <button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)} className="rounded-lg border border-navy-300 bg-white px-3 py-2 font-medium text-navy-800 hover:bg-navy-50">{T(l, 'Enlace para compartir', 'Share link')}</button>
        <button type="button" onClick={() => window.print()} className="rounded-lg border border-navy-300 bg-white px-3 py-2 font-medium text-navy-800 hover:bg-navy-50">{T(l, 'Imprimir', 'Print')}</button>
      </div>
      {methodHref && <p className="mt-3 text-xs text-navy-600">{T(l, 'Ley 51 de 1983, Ley 35 de 1939 y Ley 2578 de 2026.', 'Law 51 of 1983, Law 35 of 1939 and Law 2578 of 2026.')} <a href={methodHref} className="underline">{T(l, 'Método y fuentes', 'Method and sources')}</a></p>}
    </div>
  );

  const after = (
    <div className="mt-6 overflow-x-auto">
      <table className="journal w-full text-sm">
        <caption className="mb-2 text-left font-medium text-navy-800">{T(l, `Festivos de Colombia en ${anio}`, `Colombian public holidays in ${anio}`)}</caption>
        <thead><tr><th scope="col" className="px-3 py-2 text-left">{T(l, 'Fecha', 'Date')}</th><th scope="col" className="px-3 py-2 text-left">{T(l, 'Festivo', 'Holiday')}</th><th scope="col" className="px-3 py-2 text-left">{T(l, 'Traslado', 'Moved')}</th></tr></thead>
        <tbody>{lista.map((f) => (
          <tr key={f.id} className={f.fecha < hoy ? 'text-navy-500' : 'text-navy-900'}>
            <td className="tabular-nums border-b border-navy-100 px-3 py-2">{fechaLarga(f.fecha, l)}</td>
            <td className="border-b border-navy-100 px-3 py-2">{NOMBRE_FESTIVO[f.id][l === 'en' ? 1 : 0]}</td>
            <td className="border-b border-navy-100 px-3 py-2">{f.trasladado ? T(l, `del ${f.original.slice(8)}/${f.original.slice(5, 7)}`, `from ${f.original.slice(5, 7)}/${f.original.slice(8)}`) : '—'}</td>
          </tr>))}</tbody>
      </table>
    </div>
  );
  return <Frame form={form} result={result} after={after} />;
}
