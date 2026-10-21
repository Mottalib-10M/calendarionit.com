/** Cesantías + intereses, prima de servicios o vacaciones : un salario, un período, un resultado. */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import { T, cop, nr, Frame, ResultPanel, type L } from './kit';
import { readParams, updateURL } from '../../lib/url-state';
import { dias360, basePrestaciones, conAuxilio, cesantias, interesesCesantias, prima, vacacionesDias, vacacionesValor, AUXILIO } from '../../lib/engine/nomina';

declare const __BUILD_DAY__: string;
type Tipo = 'cesantias' | 'prima' | 'vacaciones';

export default function PrestacionCalc({ lang: l, methodHref, tipo }: { lang: L; methodHref?: string; tipo: Tipo }) {
  const y = __BUILD_DAY__.slice(0, 4);
  const defDesde = tipo === 'prima' ? `${y}-07-01` : tipo === 'vacaciones' ? `${Number(y) - 1}-${__BUILD_DAY__.slice(5)}` : `${y}-01-01`;
  const defHasta = tipo === 'prima' ? `${y}-12-31` : tipo === 'vacaciones' ? __BUILD_DAY__ : `${y}-12-31`;
  const [s, setS] = useState(2000000);
  const [desde, setDesde] = useState(defDesde);
  const [hasta, setHasta] = useState(defHasta);
  const [listo, setListo] = useState(false);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (u.get('s')) setS(Number(u.get('s')) || 2000000);
    if (u.get('a')) setDesde(u.get('a')!);
    if (u.get('b')) setHasta(u.get('b')!);
    setListo(true);
  }, []);
  useEffect(() => { if (listo) updateURL({ s, a: desde, b: hasta }); }, [s, desde, hasta, listo]);
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(desde) && /^\d{4}-\d{2}-\d{2}$/.test(hasta) && hasta >= desde;
  const dias = ok ? dias360(desde, hasta) : 0;
  const aux = conAuxilio(s);
  const base = basePrestaciones(s, aux);
  const inp = 'tabular-nums h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20';
  let head = '', value = 0, rows: Array<{ label: string; value: string; strong?: boolean; note?: boolean }> = [], hyp = '';
  if (tipo === 'cesantias') {
    const c = cesantias(base, dias), i = interesesCesantias(c, dias);
    head = T(l, 'Cesantías del período', 'Severance for the period'); value = c;
    rows = [{ label: T(l, 'Intereses sobre cesantías (12 % anual)', 'Interest on severance (12 % a year)'), value: cop(i, l) }, { label: T(l, 'Cesantías + intereses', 'Severance + interest'), value: cop(c + i, l), strong: true }, { label: T(l, 'Base (salario + auxilio)', 'Base (salary + allowance)'), value: cop(base, l), note: true }];
    hyp = T(l, 'Salario fijo durante el período. Intereses proporcionales a los días del período.', 'Fixed salary over the period. Interest prorated to the days in the period.');
  } else if (tipo === 'prima') {
    const p = prima(base, dias);
    head = T(l, 'Prima de servicios del período', 'Service bonus for the period'); value = p;
    rows = [{ label: T(l, 'Base (salario + auxilio)', 'Base (salary + allowance)'), value: cop(base, l) }, { label: T(l, 'Días del período', 'Days in the period'), value: nr(dias, l) }];
    hyp = T(l, 'Un semestre completo son 180 días; la prima es base × días ÷ 360.', 'A full half-year is 180 days; the bonus is base × days ÷ 360.');
  } else {
    const d = vacacionesDias(dias), v = vacacionesValor(s, d);
    head = T(l, 'Valor de las vacaciones causadas', 'Value of the holidays earned'); value = v;
    rows = [{ label: T(l, 'Días de vacaciones causados', 'Holiday days earned'), value: nr(d, l, 2) }, { label: T(l, 'Salario diario (sin auxilio)', 'Daily salary (no allowance)'), value: cop(s / 30, l) }];
    hyp = T(l, '15 días hábiles por 360 días trabajados, pagados con el salario ordinario, sin auxilio de transporte.', '15 working days per 360 days worked, paid at the ordinary salary, without the transport allowance.');
  }
  const form = (
    <>
      <NumberField id="pre-s" label={T(l, 'Salario mensual', 'Monthly salary')} value={s} onChange={setS} unit="COP" max={200000000} lang={l} help={aux ? T(l, `Con auxilio de transporte de ${cop(AUXILIO, l)}`, `With transport allowance of ${cop(AUXILIO, l)}`) : undefined} />
      <div className="grid grid-cols-2 gap-x-4">
        <div><label htmlFor="pre-a" className="mb-1 block text-sm font-medium text-navy-700">{T(l, 'Desde', 'From')}</label><input id="pre-a" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className={inp} /></div>
        <div><label htmlFor="pre-b" className="mb-1 block text-sm font-medium text-navy-700">{T(l, 'Hasta', 'To')}</label><input id="pre-b" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className={inp} /></div>
      </div>
    </>
  );
  const result = (
    <ResultPanel lang={l} head={head} value={ok ? cop(value, l) : '—'} sub={ok ? T(l, `${nr(dias, l)} días (año de 360 días)`, `${nr(dias, l)} days (360-day year)`) : T(l, 'Revise las fechas', 'Check the dates')}
      rows={ok ? rows : []} hyp={hyp} methodHref={methodHref} copyText={`${head}: ${cop(value, l)}`} />
  );
  return <Frame form={form} result={result} />;
}
