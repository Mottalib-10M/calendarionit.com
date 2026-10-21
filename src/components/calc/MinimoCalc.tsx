/** Salario mínimo 2026 : lo que recibe el trabajador (auxilio de transporte, aportes) para un salario dado. */
import NumberField from '../ui/NumberField';
import { T, cop, nr, Frame, ResultPanel, useParams, type L } from './kit';
import { neto, SMMLV, AUXILIO } from '../../lib/engine/nomina';
import { P } from '../../lib/engine/params';

export default function MinimoCalc({ lang: l, methodHref }: { lang: L; methodHref?: string }) {
  const [v, set] = useParams({ s: SMMLV });
  const n = neto(v.s);
  const veces = v.s / SMMLV;
  const form = (
    <>
      <NumberField id="min-s" label={T(l, 'Salario mensual', 'Monthly salary')} value={v.s} onChange={set('s')} unit="COP" max={200000000} lang={l}
        help={T(l, `Mínimo 2026: ${cop(SMMLV, l)}. 2027: por publicarse.`, `2026 minimum: ${cop(SMMLV, l)}. 2027: yet to be published.`)} />
      {v.s > 0 && v.s < SMMLV && <p role="status" className="text-sm font-medium text-amber-700">{T(l, 'Por debajo del salario mínimo para jornada completa.', 'Below the full-time minimum wage.')}</p>}
    </>
  );
  const rows = [
    { label: T(l, 'Salario', 'Salary'), value: cop(n.salario, l) },
    { label: T(l, 'Auxilio de transporte', 'Transport allowance'), value: n.auxilio ? cop(n.auxilio, l) : T(l, 'No aplica (más de 2 mínimos)', 'Not due (above 2 minimum wages)') },
    { label: T(l, 'Salud (4 %)', 'Health (4 %)'), value: `− ${cop(n.salud, l)}` },
    { label: T(l, 'Pensión (4 %)', 'Pension (4 %)'), value: `− ${cop(n.pension, l)}` },
    ...(n.fsp > 0 ? [{ label: T(l, 'Fondo de Solidaridad Pensional', 'Pension solidarity fund'), value: `− ${cop(n.fsp, l)}` }] : []),
  ];
  const result = (
    <ResultPanel lang={l} head={T(l, 'Pago neto del mes', 'Net monthly pay')} value={cop(n.neto, l)}
      sub={T(l, `${nr(veces, l, 2)} salarios mínimos`, `${nr(veces, l, 2)} minimum wages`)}
      rows={rows} methodHref={methodHref}
      notes={[T(l, `Mínimo 2026 ${cop(SMMLV, l)} (${P.nomina.smmlv_acto}) y auxilio ${cop(AUXILIO, l)} (${P.nomina.auxilio_acto}).`, `2026 minimum ${cop(SMMLV, l)} (${P.nomina.smmlv_acto}) and allowance ${cop(AUXILIO, l)} (${P.nomina.auxilio_acto}).`)]}
      hyp={T(l, 'Salario ordinario de jornada completa, antes de retención en la fuente y de otros descuentos pactados.', 'Ordinary full-time salary, before withholding tax and other agreed deductions.')}
      copyText={`${T(l, 'Neto', 'Net')}: ${cop(n.neto, l)}`} />
  );
  return <Frame form={form} result={result} />;
}
