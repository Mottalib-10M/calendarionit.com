/** ¿Debo declarar renta en 2026 (año gravable 2025)? Cinco topes en pesos de la DIAN + responsabilidad de IVA. */
import NumberField from '../ui/NumberField';
import { T, cop, Frame, ResultPanel, Botones, useParams, type L } from './kit';
import { obligadoDeclarar } from '../../lib/engine/nomina';
import { P } from '../../lib/engine/params';

export default function TopesCalc({ lang: l, methodHref }: { lang: L; methodHref?: string }) {
  const [v, set] = useParams({ pat: 150000000, ing: 60000000, tc: 0, com: 40000000, con: 50000000, iva: 0 });
  const R = P.renta;
  const r = obligadoDeclarar({ patrimonio: v.pat, ingresos: v.ing, tarjeta: v.tc, compras: v.com, consignaciones: v.con, iva: v.iva === 1 });
  const lab: Record<string, string> = {
    patrimonio: T(l, `Patrimonio bruto superior a ${cop(R.patrimonio_cop, l)}`, `Gross assets above ${cop(R.patrimonio_cop, l)}`),
    ingresos: T(l, `Ingresos brutos de ${cop(R.ingresos_cop, l)} o más`, `Gross income of ${cop(R.ingresos_cop, l)} or more`),
    tarjeta: T(l, `Consumos con tarjeta de crédito superiores a ${cop(R.tarjeta_cop, l)}`, `Credit-card spending above ${cop(R.tarjeta_cop, l)}`),
    compras: T(l, `Compras y consumos superiores a ${cop(R.compras_cop, l)}`, `Purchases above ${cop(R.compras_cop, l)}`),
    consignaciones: T(l, `Consignaciones e inversiones superiores a ${cop(R.consignaciones_cop, l)}`, `Deposits and investments above ${cop(R.consignaciones_cop, l)}`),
    iva: T(l, 'Responsable de IVA al 31 de diciembre de 2025', 'Registered for VAT on 31 December 2025'),
  };
  const form = (
    <>
      <div className="grid grid-cols-2 gap-x-4">
        <NumberField id="top-pat" label={T(l, 'Patrimonio bruto al 31-12-2025', 'Gross assets at 31-12-2025')} value={v.pat} onChange={set('pat')} unit="COP" max={100000000000} lang={l} />
        <NumberField id="top-ing" label={T(l, 'Ingresos brutos de 2025', 'Gross income in 2025')} value={v.ing} onChange={set('ing')} unit="COP" max={100000000000} lang={l} />
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <NumberField id="top-tc" label={T(l, 'Consumos con tarjeta de crédito', 'Credit-card spending')} value={v.tc} onChange={set('tc')} unit="COP" max={100000000000} lang={l} />
        <NumberField id="top-com" label={T(l, 'Compras y consumos totales', 'Total purchases')} value={v.com} onChange={set('com')} unit="COP" max={100000000000} lang={l} />
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <NumberField id="top-con" label={T(l, 'Consignaciones, depósitos, inversiones', 'Deposits and investments')} value={v.con} onChange={set('con')} unit="COP" max={100000000000} lang={l} />
        <Botones id="top-iva" label={T(l, '¿Responsable de IVA?', 'VAT-registered?')} value={v.iva} onChange={set('iva')} options={[{ value: 0, label: T(l, 'No', 'No') }, { value: 1, label: T(l, 'Sí', 'Yes') }]} />
      </div>
    </>
  );
  const result = (
    <ResultPanel lang={l} head={T(l, 'Declaración de renta 2026 (año gravable 2025)', '2026 income tax return (tax year 2025)')}
      value={r.obligado ? T(l, 'Debe declarar', 'You must file') : T(l, 'No está obligado', 'Not required')}
      sub={r.obligado ? T(l, `Cumple ${r.motivos.length} de las condiciones`, `You meet ${r.motivos.length} condition(s)`) : T(l, 'No supera ningún tope', 'Below every threshold')}
      rows={(r.obligado ? r.motivos : []).map((m) => ({ label: lab[m], value: '✓' }))}
      notes={[T(l, `Topes de la DIAN con la UVT de 2025 (${cop(P.uvt['2025'], l)}): 4.500 UVT de patrimonio y 1.400 UVT para los demás.`, `DIAN thresholds at the 2025 UVT (${cop(P.uvt['2025'], l)}): 4,500 UVT of assets and 1,400 UVT for the others.`)]}
      methodHref={methodHref} hyp={T(l, 'Persona natural residente. Basta con cumplir una sola condición.', 'Resident individual. Meeting any single condition means filing.')}
      copyText={r.obligado ? T(l, 'Debe declarar renta', 'Must file') : T(l, 'No obligado a declarar', 'Not required to file')} />
  );
  return <Frame form={form} result={result} />;
}
