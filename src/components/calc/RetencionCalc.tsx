/** Retención en la fuente sobre el salario de un mes (procedimiento 1, ET arts. 383 y 387). */
import NumberField from '../ui/NumberField';
import { T, cop, nr, Frame, ResultPanel, Botones, useParams, type L } from './kit';
import { retencion, UVT } from '../../lib/engine/nomina';

export default function RetencionCalc({ lang: l, methodHref }: { lang: L; methodHref?: string }) {
  const [v, set] = useParams({ s: 8000000, dep: 0, mp: 0 });
  const r = retencion({ ingreso: v.s, dependiente: v.dep === 1, prepagada: v.mp });
  const form = (
    <>
      <NumberField id="ret-s" label={T(l, 'Salario y demás pagos laborales del mes', 'Salary and other employment pay this month')} value={v.s} onChange={set('s')} unit="COP" max={500000000} lang={l} />
      <div className="grid grid-cols-2 gap-x-4">
        <Botones id="ret-dep" label={T(l, '¿Tiene dependientes?', 'Any dependants?')} value={v.dep} onChange={set('dep')} options={[{ value: 0, label: T(l, 'No', 'No') }, { value: 1, label: T(l, 'Sí', 'Yes') }]} />
        <NumberField id="ret-mp" label={T(l, 'Medicina prepagada al mes', 'Private health plan per month')} value={v.mp} onChange={set('mp')} unit="COP" max={20000000} lang={l} />
      </div>
    </>
  );
  const rows = [
    { label: T(l, 'Aportes a salud, pensión y FSP', 'Health, pension and solidarity fund'), value: `− ${cop(r.incr, l)}` },
    { label: T(l, 'Deducciones y renta exenta del 25 % (tope del 40 %)', 'Deductions and 25 % exempt income (40 % cap)'), value: `− ${cop(r.beneficios, l)}` },
    { label: T(l, 'Base sujeta a retención', 'Taxable base'), value: cop(r.base, l), strong: true },
    { label: T(l, 'Base en UVT', 'Base in UVT'), value: nr(r.baseUvt, l, 2) },
  ];
  const result = (
    <ResultPanel lang={l} head={T(l, 'Retención en la fuente del mes', 'Withholding tax this month')} value={cop(r.retencion, l)}
      sub={r.retencion > 0 ? T(l, `${nr(r.retencionUvt, l, 2)} UVT de ${cop(UVT, l)}`, `${nr(r.retencionUvt, l, 2)} UVT of ${cop(UVT, l)}`) : T(l, 'Base de 95 UVT o menos: sin retención', 'Base of 95 UVT or less: no withholding')}
      rows={rows} methodHref={methodHref}
      hyp={T(l, 'Procedimiento 1, un solo empleador, salario no integral. Los topes anuales de 790 UVT (renta exenta) y 1.340 UVT (límite del 40 %) se dividen entre 12. El empleador redondea según sus propias reglas.', 'Procedure 1, one employer, ordinary salary. The yearly caps of 790 UVT (exempt income) and 1,340 UVT (40 % limit) are divided by 12. Employers round under their own rules.')}
      copyText={`${T(l, 'Retención', 'Withholding')}: ${cop(r.retencion, l)}`} />
  );
  return <Frame form={form} result={result} />;
}
