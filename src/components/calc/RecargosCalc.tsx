/**
 * Recargos y horas extras : valor de la hora ordinaria, recargo nocturno, extras diurnas y nocturnas,
 * trabajo en domingo o festivo, con el porcentaje vigente en la fecha (Ley 2466 de 2025).
 */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import { T, cop, pct, nr, Frame, ResultPanel, type L } from './kit';
import { readParams, updateURL } from '../../lib/url-state';
import { recargos, jornadaSemanal, horasMes } from '../../lib/engine/nomina';

declare const __BUILD_DAY__: string;

export default function RecargosCalc({ lang: l, methodHref }: { lang: L; methodHref?: string }) {
  const [fecha, setFecha] = useState(__BUILD_DAY__);
  const [v, setV] = useState({ s: 2000000, hm: horasMes(jornadaSemanal(__BUILD_DAY__)), n: 0, ed: 4, en: 0, df: 8 });
  const [listo, setListo] = useState(false);
  useEffect(() => {
    const hoy = new Date().toISOString().slice(0, 10);
    const u = readParams(window.location.search);
    const f = u.get('f') ?? hoy;
    setFecha(f);
    setV((x) => ({ s: Number(u.get('s')) || x.s, hm: Number(u.get('hm')) || horasMes(jornadaSemanal(f)), n: Number(u.get('n') ?? x.n), ed: Number(u.get('ed') ?? x.ed), en: Number(u.get('en') ?? x.en), df: Number(u.get('df') ?? x.df) }));
    setListo(true);
  }, []);
  useEffect(() => { if (listo) updateURL({ f: fecha, ...v }); }, [fecha, v, listo]);
  const set = (k: keyof typeof v) => (x: number) => setV((o) => ({ ...o, [k]: x }));
  const r = recargos({ salario: v.s, horasMes: v.hm, fecha, hNocturnas: v.n, hExtraDiurna: v.ed, hExtraNocturna: v.en, hDominical: v.df });
  const inp = 'tabular-nums h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20';
  const form = (
    <>
      <div className="grid grid-cols-2 gap-x-4">
        <NumberField id="rec-s" label={T(l, 'Salario mensual', 'Monthly salary')} value={v.s} onChange={set('s')} unit="COP" max={200000000} lang={l} />
        <div><label htmlFor="rec-f" className="mb-1 block text-sm font-medium text-navy-700">{T(l, 'Fecha del trabajo', 'Date worked')}</label>
          <input id="rec-f" type="date" value={fecha} onChange={(e) => { setFecha(e.target.value); if (/^\d{4}-\d{2}-\d{2}$/.test(e.target.value)) set('hm')(horasMes(jornadaSemanal(e.target.value))); }} className={inp} /></div>
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <NumberField id="rec-hm" label={T(l, 'Horas ordinarias del mes', 'Ordinary hours per month')} value={v.hm} onChange={set('hm')} max={240} lang={l} help={T(l, `Jornada de ${jornadaSemanal(fecha)} h ÷ 6 × 30`, `${jornadaSemanal(fecha)}-hour week ÷ 6 × 30`)} />
        <NumberField id="rec-n" label={T(l, 'Horas nocturnas ordinarias', 'Ordinary night hours')} value={v.n} onChange={set('n')} max={300} lang={l} />
      </div>
      <div className="grid grid-cols-3 gap-x-4">
        <NumberField id="rec-ed" label={T(l, 'Extras diurnas', 'Day overtime')} value={v.ed} onChange={set('ed')} max={60} lang={l} />
        <NumberField id="rec-en" label={T(l, 'Extras nocturnas', 'Night overtime')} value={v.en} onChange={set('en')} max={60} lang={l} />
        <NumberField id="rec-df" label={T(l, 'Horas en domingo o festivo', 'Sunday or holiday hours')} value={v.df} onChange={set('df')} max={300} lang={l} />
      </div>
    </>
  );
  const rows = [
    { label: T(l, 'Valor de la hora ordinaria', 'Ordinary hourly rate'), value: cop(r.hora, l) },
    { label: T(l, `Recargo nocturno (35 %) × ${nr(v.n, l)} h`, `Night premium (35 %) × ${nr(v.n, l)} h`), value: cop(r.nocturnas, l) },
    { label: T(l, `Extras diurnas (125 %) × ${nr(v.ed, l)} h`, `Day overtime (125 %) × ${nr(v.ed, l)} h`), value: cop(r.extraDiurna, l) },
    { label: T(l, `Extras nocturnas (175 %) × ${nr(v.en, l)} h`, `Night overtime (175 %) × ${nr(v.en, l)} h`), value: cop(r.extraNocturna, l) },
    { label: T(l, `Domingo o festivo (${pct(1 + r.pctDominical, l)}) × ${nr(v.df, l)} h`, `Sunday or holiday (${pct(1 + r.pctDominical, l)}) × ${nr(v.df, l)} h`), value: cop(r.dominical, l) },
  ];
  const result = (
    <ResultPanel lang={l} head={T(l, 'Pago adicional del mes', 'Extra pay this month')} value={cop(r.total, l)}
      sub={T(l, `Recargo dominical y festivo vigente: ${pct(r.pctDominical, l)}`, `Sunday and holiday premium in force: ${pct(r.pctDominical, l)}`)}
      rows={rows} methodHref={methodHref}
      hyp={T(l, 'Horas en domingo o festivo diurnas, trabajo ocasional. El recargo nocturno se paga sobre horas ordinarias; las extras incluyen la hora y su recargo. El divisor de horas es una convención de nómina: ajústelo a su contrato.', 'Sunday or holiday hours worked during the day, occasional work. The night premium is paid on ordinary hours; overtime includes the hour and its premium. The hour divisor is a payroll convention: adjust it to your contract.')}
      copyText={`${T(l, 'Recargos', 'Premiums')}: ${cop(r.total, l)}`} />
  );
  return <Frame form={form} result={result} />;
}
