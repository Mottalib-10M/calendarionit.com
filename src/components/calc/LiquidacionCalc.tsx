/**
 * Liquidación de contrato de trabajo : cesantías, intereses, prima, vacaciones e indemnización (CST art. 64).
 * Premier rendu = dates du build ; le lien partagé s'applique dans useEffect (RECETTE §17.5).
 */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import { T, cop, nr, Frame, ResultPanel, Botones, type L } from './kit';
import { readParams, updateURL } from '../../lib/url-state';
import { liquidacion, AUXILIO, type Contrato } from '../../lib/engine/nomina';

declare const __BUILD_DAY__: string;
const hace = (iso: string, anios: number) => `${Number(iso.slice(0, 4)) - anios}${iso.slice(4)}`;

export default function LiquidacionCalc({ lang: l, methodHref }: { lang: L; methodHref?: string }) {
  const [s, setS] = useState(2500000);
  const [ingreso, setIngreso] = useState(hace(__BUILD_DAY__, 3));
  const [retiro, setRetiro] = useState(__BUILD_DAY__);
  const [despido, setDespido] = useState(0);
  const [contrato, setContrato] = useState<Contrato>('indefinido');
  const [falta, setFalta] = useState(60);
  const [vac, setVac] = useState(0);
  const [listo, setListo] = useState(false);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (u.get('s')) setS(Number(u.get('s')) || 2500000);
    if (u.get('i')) setIngreso(u.get('i')!);
    if (u.get('r')) setRetiro(u.get('r')!);
    if (u.get('d')) setDespido(u.get('d') === '1' ? 1 : 0);
    if (u.get('c')) setContrato(u.get('c') as Contrato);
    if (u.get('f')) setFalta(Number(u.get('f')) || 0);
    if (u.get('v')) setVac(Number(u.get('v')) || 0);
    setListo(true);
  }, []);
  useEffect(() => { if (listo) updateURL({ s, i: ingreso, r: retiro, d: despido, c: contrato, f: falta, v: vac }); }, [s, ingreso, retiro, despido, contrato, falta, vac, listo]);

  const ok = /^\d{4}-\d{2}-\d{2}$/.test(ingreso) && /^\d{4}-\d{2}-\d{2}$/.test(retiro) && retiro >= ingreso;
  const r = ok ? liquidacion({ salario: s, ingreso, retiro, despido: despido === 1, contrato, diasFaltantes: falta, vacTomadas: vac }) : null;
  const inp = 'tabular-nums h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20';
  const form = (
    <>
      <NumberField id="liq-s" label={T(l, 'Salario mensual', 'Monthly salary')} value={s} onChange={setS} unit="COP" max={50000000} lang={l} />
      <div className="grid grid-cols-2 gap-x-4">
        <div><label htmlFor="liq-i" className="mb-1 block text-sm font-medium text-navy-700">{T(l, 'Fecha de ingreso', 'Start date')}</label><input id="liq-i" type="date" value={ingreso} onChange={(e) => setIngreso(e.target.value)} className={inp} /></div>
        <div><label htmlFor="liq-r" className="mb-1 block text-sm font-medium text-navy-700">{T(l, 'Fecha de retiro', 'Last day')}</label><input id="liq-r" type="date" value={retiro} onChange={(e) => setRetiro(e.target.value)} className={inp} /></div>
      </div>
      <Botones id="liq-c" label={T(l, 'Contrato', 'Contract')} value={contrato} onChange={setContrato}
        options={[{ value: 'indefinido', label: T(l, 'Indefinido', 'Open-ended') }, { value: 'fijo', label: T(l, 'Término fijo', 'Fixed-term') }, { value: 'obra', label: T(l, 'Obra o labor', 'Specific job') }]} />
      <div className="grid grid-cols-2 gap-x-4">
        <Botones id="liq-d" label={T(l, 'Motivo del retiro', 'Reason')} value={despido} onChange={setDespido}
          options={[{ value: 0, label: T(l, 'Renuncia', 'Resignation') }, { value: 1, label: T(l, 'Despido sin justa causa', 'Unfair dismissal') }]} />
        <NumberField id="liq-v" label={T(l, 'Días de vacaciones ya disfrutados', 'Holiday days already taken')} value={vac} onChange={setVac} max={400} lang={l} />
      </div>
      {despido === 1 && contrato !== 'indefinido' && (
        <NumberField id="liq-f" label={T(l, 'Días que faltaban del contrato u obra', 'Days left on the contract or job')} value={falta} onChange={setFalta} max={3600} lang={l} />
      )}
    </>
  );
  const rows = r ? [
    { label: T(l, `Cesantías (${nr(r.diasAnio, l)} días del año)`, `Severance (${nr(r.diasAnio, l)} days this year)`), value: cop(r.cesantias, l) },
    { label: T(l, 'Intereses sobre cesantías (12 % anual)', 'Interest on severance (12 % a year)'), value: cop(r.intereses, l) },
    { label: T(l, `Prima de servicios (${nr(r.diasSemestre, l)} días del semestre)`, `Service bonus (${nr(r.diasSemestre, l)} days this half-year)`), value: cop(r.prima, l) },
    { label: T(l, `Vacaciones pendientes (${nr(r.vacDias, l, 2)} días)`, `Unused holidays (${nr(r.vacDias, l, 2)} days)`), value: cop(r.vacaciones, l) },
    ...(despido === 1 ? [{ label: T(l, `Indemnización art. 64 (${nr(r.indemDias, l, 2)} días)`, `Art. 64 compensation (${nr(r.indemDias, l, 2)} days)`), value: cop(r.indemnizacion, l) }] : []),
    { label: T(l, 'Base de prestaciones', 'Benefits base'), value: cop(r.base, l), note: true },
  ] : [];
  const result = (
    <ResultPanel lang={l} head={T(l, 'Total de la liquidación', 'Final settlement')} value={r ? cop(r.total, l) : '—'}
      sub={r ? T(l, `${nr(r.dias, l)} días trabajados (año de 360 días)`, `${nr(r.dias, l)} days worked (360-day year)`) : T(l, 'Revise las fechas', 'Check the dates')}
      rows={rows} methodHref={methodHref}
      notes={r?.auxilio ? [T(l, `Incluye el auxilio de transporte (${cop(AUXILIO, l)}) en la base de cesantías, intereses y prima.`, `Includes the transport allowance (${cop(AUXILIO, l)}) in the base for severance, interest and bonus.`)] : []}
      hyp={T(l, 'Salario fijo. Cesantías de años anteriores ya consignadas en el fondo y prima del semestre anterior ya pagada. Sin descontar aportes ni retención.', 'Fixed salary. Earlier years of severance already paid into the fund and last half-year bonus already paid. No deductions or withholding.')}
      copyText={r ? `${T(l, 'Liquidación', 'Settlement')}: ${cop(r.total, l)}` : ''} />
  );
  return <Frame form={form} result={result} />;
}
