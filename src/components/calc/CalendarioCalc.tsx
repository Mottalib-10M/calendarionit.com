/**
 * Calendario por NIT : últimos dígitos + tipo de contribuyente → todas las fechas del año, la próxima
 * en tête, export .ics fabriqué dans le navigateur. Premier rendu = valeurs par défaut et jour du build
 * (__BUILD_DAY__) ; le lien partagé et la date du jour s'appliquent ensuite (RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { T, Frame, Botones, type L } from './kit';
import { readParams, updateURL } from '../../lib/url-state';
import { vencimientos, proximo, nitBase, ics, CIUDADES, type Tipo, type Opciones } from '../../lib/engine/calendario';
import { titulo, fechaLarga, obligacion, accion, periodo } from '../../lib/etiquetas';
import { ciudadNombre, ciudad as ciudadDe } from '../../lib/engine/ica';

declare const __BUILD_DAY__: string;

interface Props {
  lang: L; methodHref?: string;
  /** Valeurs par défaut propres à la page (ex. page IVA : iva « bim »). */
  tipo?: Tipo; iva?: 'no' | 'bim' | 'cuat'; retenedor?: boolean; rst?: boolean; ciudad?: string; nit?: string; regimenIca?: string; reteica?: boolean; exogena?: boolean;
  /** Obligation mise en avant sur la page (filtre de départ du tableau). */
  foco?: string;
}

const B = (x: boolean) => (x ? '1' : '0');

export default function CalendarioCalc({ lang: l, methodHref, tipo = 'pn', iva = 'no', retenedor = false, rst = false, ciudad = '', nit = '56', foco = '', regimenIca = '', reteica = false, exogena = false }: Props) {
  const [o, setO] = useState<Opciones>({ nit, tipo, iva, retenedor, rst, activos: false, patrimonio: false, precios: false, ciudad, regimenIca, reteica, exogena });
  const [hoy, setHoy] = useState(__BUILD_DAY__);
  const [solo, setSolo] = useState(foco);
  useEffect(() => {
    setHoy(new Date().toISOString().slice(0, 10));
    const u = readParams(window.location.search);
    if (![...u.keys()].length) return;
    setO((x) => ({
      ...x, nit: u.get('nit') ?? x.nit, tipo: (u.get('t') as Tipo) || x.tipo, iva: (u.get('iva') as Opciones['iva']) || x.iva,
      retenedor: u.has('ret') ? u.get('ret') === '1' : x.retenedor, rst: u.has('rst') ? u.get('rst') === '1' : x.rst,
      activos: u.get('ext') === '1', patrimonio: u.get('pat') === '1', precios: u.get('pt') === '1', ciudad: u.get('c') ?? x.ciudad, regimenIca: u.get('r') ?? x.regimenIca, reteica: u.has('ri') ? u.get('ri') === '1' : x.reteica, exogena: u.has('ex') ? u.get('ex') === '1' : x.exogena,
    }));
  }, []);
  useEffect(() => { updateURL({ nit: o.nit, t: o.tipo, iva: o.iva, ret: B(o.retenedor), rst: B(o.rst), ext: B(o.activos), pat: B(o.patrimonio), pt: B(o.precios), c: o.ciudad, r: o.regimenIca ?? '', ri: B(!!o.reteica), ex: B(!!o.exogena) }); }, [o]);
  const set = <K extends keyof Opciones>(k: K) => (v: Opciones[K]) => setO((x) => ({ ...x, [k]: v }));

  const lista = useMemo(() => vencimientos(o), [o]);
  const visibles = solo ? lista.filter((x) => x.obligacion === solo || (solo === 'renta' && x.obligacion.startsWith('renta')) || (solo === 'ica' && x.obligacion.includes('ica'))) : lista;
  const i = proximo(lista, hoy);
  const prox = i >= 0 ? lista[i] : null;
  const base = nitBase(o.nit);
  const nombreCiudad = (id?: string) => (id ? ciudadNombre(id, l) : '');
  const tit = (x: (typeof lista)[number]) => titulo(x, l, nombreCiudad(x.ciudad));
  const descargar = () => {
    const blob = new Blob([ics(lista, tit)], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = T(l, `vencimientos-nit-${base.slice(-2) || 'x'}.ics`, `colombia-tax-dates-${base.slice(-2) || 'x'}.ics`);
    document.body.appendChild(a); a.click(); a.remove();
  };
  const dias = prox ? Math.round((Date.parse(`${prox.fecha}T00:00:00Z`) - Date.parse(`${hoy}T00:00:00Z`)) / 86400000) : 0;
  const cd = o.ciudad ? ciudadDe(o.ciudad) : undefined;
  const chk = 'h-5 w-5 rounded border-navy-300 text-accent-700';
  const obligacionesPresentes = [...new Set(lista.map((x) => (x.obligacion.startsWith('renta') ? 'renta' : x.obligacion.includes('ica') ? 'ica' : x.obligacion)))];

  const form = (
    <>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
          <label htmlFor="cal-nit" className="mb-1 block text-sm font-medium text-navy-700">{T(l, 'NIT o cédula (últimos dígitos)', 'NIT or ID number (last digits)')}</label>
          <input id="cal-nit" type="text" inputMode="numeric" autoComplete="off" value={o.nit} onChange={(e) => set('nit')(e.target.value.replace(/[^\d.\-\s]/g, '').slice(0, 15))}
            aria-describedby="cal-nit-help" className="tabular-nums h-12 w-full rounded-lg border border-navy-300 bg-white px-4 text-right text-lg text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
          <p id="cal-nit-help" className="mt-1 text-xs text-navy-500">{T(l, 'Sin el dígito de verificación (el que va después del guion).', 'Without the check digit (the one after the hyphen).')}</p>
        </div>
        <SelectField id="cal-iva" label={T(l, 'IVA', 'VAT (IVA)')} value={o.iva} onChange={(v) => set('iva')(v as Opciones['iva'])}
          options={[{ value: 'no', label: T(l, 'No responsable', 'Not registered') }, { value: 'bim', label: T(l, 'Bimestral', 'Two-month') }, { value: 'cuat', label: T(l, 'Cuatrimestral', 'Four-month') }]} />
      </div>
      <Botones id="cal-tipo" label={T(l, 'Tipo de contribuyente', 'Type of taxpayer')} value={o.tipo} onChange={set('tipo')}
        options={[{ value: 'pn', label: T(l, 'Persona natural', 'Individual') }, { value: 'pj', label: T(l, 'Persona jurídica', 'Company') }, { value: 'gc', label: T(l, 'Gran contribuyente', 'Large taxpayer') }]} />
      <div className="grid grid-cols-2 gap-x-4">
        <SelectField id="cal-ciudad" label={T(l, 'ICA de su ciudad', 'ICA city')} value={o.ciudad} onChange={(v) => setO((x) => ({ ...x, ciudad: v, regimenIca: '' }))}
          options={[{ value: '', label: T(l, 'Sin ICA', 'No ICA') }, ...CIUDADES.map((c) => ({ value: c.id, label: nombreCiudad(c.id) }))]} />
        <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
          <span className="mb-1 block text-sm font-medium text-navy-700">{T(l, 'Retención en la fuente', 'Withholding agent')}</span>
          <label className="flex h-12 items-center gap-3 rounded-lg border border-navy-300 bg-white px-3 text-sm text-navy-800"><input type="checkbox" className={chk} checked={o.retenedor} onChange={(e) => set('retenedor')(e.target.checked)} />{T(l, 'Soy agente de retención', 'I withhold tax')}</label>
        </div>
      </div>
      {cd && (
        <div className="grid grid-cols-2 gap-x-4">
          <SelectField id="cal-regimen" label={T(l, `Régimen ICA en ${cd.nombre.es}`, `ICA regime in ${cd.nombre.en}`)} value={o.regimenIca || cd.regimenes[0].id} onChange={set('regimenIca')}
            options={cd.regimenes.map((r) => ({ value: r.id, label: r.nombre[l] }))} />
          {cd.retencion && <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
            <span className="mb-1 block text-sm font-medium text-navy-700">ReteICA</span>
            <label className="flex h-12 items-center gap-3 rounded-lg border border-navy-300 bg-white px-3 text-sm text-navy-800"><input type="checkbox" className={chk} checked={!!o.reteica} onChange={(e) => set('reteica')(e.target.checked)} />{T(l, 'Agente de retención de ICA', 'ICA withholding agent')}</label>
          </div>}
        </div>
      )}
      <details className="rounded-lg border border-navy-200 px-3 py-2 text-sm">
        <summary className="cursor-pointer font-medium text-navy-800">{T(l, 'Otras obligaciones', 'Other obligations')}</summary>
        <div className="mt-2 space-y-2 text-navy-800">
          <label className="flex items-center gap-3"><input type="checkbox" className={chk} checked={!!o.exogena} onChange={(e) => set('exogena')(e.target.checked)} />{T(l, 'Obligado a reportar información exógena', 'Required to file third-party information (exógena)')}</label>
          <label className="flex items-center gap-3"><input type="checkbox" className={chk} checked={o.rst} onChange={(e) => set('rst')(e.target.checked)} />{T(l, 'Inscrito en el Régimen Simple (RST)', 'Registered in the Simple Tax Regime (RST)')}</label>
          <label className="flex items-center gap-3"><input type="checkbox" className={chk} checked={o.activos} onChange={(e) => set('activos')(e.target.checked)} />{T(l, 'Declaración de activos en el exterior', 'Foreign assets return')}</label>
          <label className="flex items-center gap-3"><input type="checkbox" className={chk} checked={o.patrimonio} onChange={(e) => set('patrimonio')(e.target.checked)} />{T(l, 'Impuesto al patrimonio', 'Wealth tax')}</label>
          <label className="flex items-center gap-3"><input type="checkbox" className={chk} checked={o.precios} onChange={(e) => set('precios')(e.target.checked)} />{T(l, 'Precios de transferencia (empresas)', 'Transfer pricing (companies)')}</label>
        </div>
      </details>
    </>
  );

  const result = (
    <div aria-live="polite" data-resultat className="mt-6 rounded-xl border border-accent-200 bg-accent-50/60 p-4 sm:p-5 lg:sticky lg:top-20 lg:mt-0">
      <div className="filete-bandera mb-3" aria-hidden="true" />
      {!base && <p className="text-navy-800">{T(l, 'Escriba al menos el último dígito de su NIT.', 'Type at least the last digit of your NIT.')}</p>}
      {base && prox && (<>
        <p className="text-sm font-medium text-navy-700">{T(l, 'Su próximo vencimiento', 'Your next due date')}</p>
        <p className="mt-1 text-3xl font-bold text-navy-900">{fechaLarga(prox.fecha, l)}</p>
        <p className="mt-1 text-navy-800">{tit(prox)}</p>
        <p className="mt-1 text-sm text-navy-600">{dias === 0 ? T(l, 'Vence hoy.', 'Due today.') : T(l, `Faltan ${dias} días.`, `${dias} days to go.`)}</p>
      </>)}
      {base && !prox && <p className="text-navy-800">{T(l, 'Las fechas publicadas para este NIT ya pasaron. El calendario 2027 está por publicarse.', 'All published dates for this NIT have passed. The 2027 calendar is yet to be published.')}</p>}
      {base && (<table className="mt-4 w-full text-sm"><tbody className="divide-y divide-navy-200">
        {lista.slice(Math.max(i, 0) + 1, Math.max(i, 0) + 5).map((x, k) => <tr key={k}><td className="py-1.5 pr-3 text-navy-700">{obligacion(x.obligacion, l)}{x.ciudad ? ` ${nombreCiudad(x.ciudad)}` : ''}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{fechaLarga(x.fecha, l).replace(/,? de \d{4}$|, \d{4}$/, '')}</td></tr>)}
      </tbody></table>)}
      <div className="no-print mt-4 flex flex-wrap gap-2 text-sm">
        <button type="button" onClick={descargar} disabled={!lista.length} className="rounded-lg bg-accent-700 px-3 py-2 font-medium text-white hover:bg-accent-800 disabled:opacity-50">{T(l, 'Agregar a mi calendario (.ics)', 'Add to my calendar (.ics)')}</button>
        <button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)} className="rounded-lg border border-navy-300 bg-white px-3 py-2 font-medium text-navy-800 hover:bg-navy-50">{T(l, 'Enlace para compartir', 'Share link')}</button>
      </div>
      {methodHref && <p className="mt-3 text-xs text-navy-600">{T(l, 'Fechas del calendario DIAN 2026 (Decreto 2229 de 2023)', 'Dates from the DIAN 2026 calendar (Decree 2229 of 2023)')}{cd ? T(l, ` y de la ${cd.acto}`, ` and ${cd.nombre.en}: ${cd.acto}`) : ''}. <a href={methodHref} className="underline">{T(l, 'Método y fuentes', 'Method and sources')}</a></p>}
    </div>
  );

  const after = base ? (
    <div className="mt-6">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium text-navy-800">{T(l, `Las ${lista.length} fechas de su NIT`, `All ${lista.length} dates for your NIT`)}</span>
        <span className="relative inline-block"><select id="cal-filtro" aria-label={T(l, 'Filtrar por obligación', 'Filter by obligation')} value={solo} onChange={(e) => setSolo(e.target.value)} className="h-9 appearance-none rounded-lg border border-navy-300 bg-white pl-2 pr-9 text-sm text-navy-900">
          <option value="">{T(l, 'Todas', 'All')}</option>
          {obligacionesPresentes.map((k) => <option key={k} value={k}>{k === 'renta' ? T(l, 'Renta', 'Income tax') : k === 'ica' ? T(l, 'ICA y ReteICA', 'ICA and ICA withholding') : obligacion(k, l)}</option>)}
        </select><svg className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      </div>
      <div className="overflow-x-auto"><table className="journal w-full text-sm">
        <thead><tr><th scope="col" className="px-3 py-2 text-left">{T(l, 'Fecha límite', 'Deadline')}</th><th scope="col" className="px-3 py-2 text-left">{T(l, 'Obligación', 'Obligation')}</th><th scope="col" className="px-3 py-2 text-left">{T(l, 'Período', 'Period')}</th></tr></thead>
        <tbody>{visibles.map((x, k) => (
          <tr key={k} className={x.fecha < hoy ? 'text-navy-500' : 'text-navy-900'}>
            <td className="tabular-nums border-b border-navy-100 px-3 py-2">{fechaLarga(x.fecha, l)}</td>
            <td className="border-b border-navy-100 px-3 py-2">{x.ciudad ? `${obligacion(x.obligacion, l)} ${nombreCiudad(x.ciudad)}` : obligacion(x.obligacion, l)}: {accion(x.accion, l)}</td>
            <td className="border-b border-navy-100 px-3 py-2">{periodo(x.periodo, l)}</td>
          </tr>))}</tbody>
      </table></div>
    </div>
  ) : null;

  return <Frame form={form} result={result} after={after} />;
}
