import { describe, it, expect } from 'vitest';
import { festivos, esHabil, sumarHabiles, pascua } from './fechas';
import { vencimientos, cubre, nitBase, proximo, ics } from './calendario';
import { dias360, liquidacion, retencion, tabla383, neto, recargoDominical, jornadaSemanal, indemnizacionDias, SMMLV, obligadoDeclarar } from './nomina';

describe('festivos', () => {
  it('2026 : 19 festivos, la lista oficial', () => {
    expect(festivos(2026).map((f) => f.fecha)).toEqual(['2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03', '2026-05-01', '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29', '2026-07-13', '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02', '2026-11-16', '2026-12-08', '2026-12-25']);
  });
  it('2027 calculado con la Ley 51 de 1983', () => {
    expect(pascua(2027)).toBe('2027-03-28');
    expect(festivos(2027).map((f) => f.fecha)).toEqual(['2027-01-01', '2027-01-11', '2027-03-22', '2027-03-25', '2027-03-26', '2027-05-01', '2027-05-10', '2027-05-31', '2027-06-07', '2027-07-05', '2027-07-12', '2027-07-20', '2027-08-07', '2027-08-16', '2027-10-18', '2027-11-01', '2027-11-15', '2027-12-08', '2027-12-25']);
  });
  it('días hábiles', () => {
    expect(esHabil('2026-07-13')).toBe(false);
    expect(sumarHabiles('2026-07-08', 3)).toBe('2026-07-14');
  });
});

describe('calendario por NIT', () => {
  it('claves', () => {
    expect(nitBase('900.123.456-7')).toBe('900123456');
    expect(cubre('9-0', '30')).toBe(true);
    expect(cubre('99-00', '1200')).toBe(true);
    expect(cubre('01-02', '1203')).toBe(false);
    expect(cubre('7-0', '19')).toBe(true);
  });
  it('persona natural NIT terminado en 56 : renta el 2026-10-01 (pareja 55-56)', () => {
    const v = vencimientos({ nit: '1020304056', tipo: 'pn', iva: 'no', retenedor: false, rst: false, activos: false, patrimonio: false, precios: false, ciudad: '' });
    expect(v).toHaveLength(1);
    expect(v[0].obligacion).toBe('renta_pn');
  });
  it('empresa con IVA bimestral, retención e ICA de Bogotá', () => {
    const v = vencimientos({ nit: '900123453', tipo: 'pj', iva: 'bim', retenedor: true, rst: false, activos: false, patrimonio: false, precios: false, ciudad: 'bogota', reteica: true });
    expect(v.filter((x) => x.obligacion === 'renta_pj').map((x) => x.fecha)).toEqual(['2026-05-14', '2026-07-14']);
    expect(v.filter((x) => x.obligacion === 'retencion')).toHaveLength(12);
    expect(v.filter((x) => x.obligacion === 'ica')).toHaveLength(6);
    expect(v.filter((x) => x.obligacion === 'reteica')).toHaveLength(6);
    expect([...v].sort((a, b) => a.fecha.localeCompare(b.fecha))).toEqual(v);
    expect(proximo(v, '2026-10-21')).toBeGreaterThan(0);
  });
  it('todas las fechas nacionales caen en día hábil', () => {
    for (const tipo of ['pn', 'pj', 'gc'] as const) for (let d = 0; d < 100; d++) {
      const v = vencimientos({ nit: String(d).padStart(2, '0'), tipo, iva: 'bim', retenedor: true, rst: false, activos: true, patrimonio: true, precios: true, ciudad: '', exogena: true });
      for (const x of v) expect(esHabil(x.fecha), `${tipo} ${d} ${x.obligacion} ${x.fecha}`).toBe(true);
    }
  });
  it('fichero .ics', () => {
    const v = vencimientos({ nit: '7', tipo: 'gc', iva: 'no', retenedor: false, rst: false, activos: false, patrimonio: false, precios: false, ciudad: '' });
    const s = ics(v, (x) => x.obligacion);
    expect(s.match(/BEGIN:VEVENT/g)).toHaveLength(3);
    expect(s).toContain('DTSTART;VALUE=DATE:20260218');
  });
});

describe('nómina', () => {
  it('días 360', () => {
    expect(dias360('2026-01-01', '2026-12-31')).toBe(360);
    expect(dias360('2026-01-01', '2026-06-30')).toBe(180);
    expect(dias360('2026-02-01', '2026-02-28')).toBe(30);
  });
  it('liquidación de un año completo con salario mínimo', () => {
    const r = liquidacion({ salario: SMMLV, ingreso: '2026-01-01', retiro: '2026-12-31', despido: false, contrato: 'indefinido', vacTomadas: 0 });
    expect(r.cesantias).toBeCloseTo(2000000, 0);
    expect(r.intereses).toBeCloseTo(240000, 0);
    expect(r.prima).toBeCloseTo(1000000, 0);
    expect(r.vacDias).toBe(15);
  });
  it('indemnización art. 64', () => {
    expect(indemnizacionDias({ contrato: 'indefinido', salario: 3000000, diasServicio: 360 })).toBe(30);
    expect(indemnizacionDias({ contrato: 'indefinido', salario: 3000000, diasServicio: 720 })).toBe(50);
    expect(indemnizacionDias({ contrato: 'indefinido', salario: 10 * SMMLV, diasServicio: 1080 })).toBe(50);
    expect(indemnizacionDias({ contrato: 'obra', salario: 3000000, diasServicio: 100, diasFaltantes: 5 })).toBe(15);
  });
  it('tabla 383', () => {
    expect(tabla383(95)).toBe(0);
    expect(tabla383(150)).toBeCloseTo(10.45, 6);
    expect(tabla383(360)).toBeCloseTo(68.8, 6);
  });
  it('retención : salario mínimo sin retención', () => {
    expect(retencion({ ingreso: SMMLV, dependiente: false, prepagada: 0 }).retencion).toBe(0);
    expect(retencion({ ingreso: 15000000, dependiente: false, prepagada: 0 }).retencion).toBeGreaterThan(0);
  });
  it('neto del mínimo', () => {
    const n = neto(SMMLV);
    expect(n.auxilio).toBe(249095);
    expect(n.neto).toBeCloseTo(SMMLV + 249095 - 0.08 * SMMLV, 6);
  });
  it('recargo dominical y jornada por fecha', () => {
    expect(recargoDominical('2026-06-30')).toBe(0.8);
    expect(recargoDominical('2026-07-01')).toBe(0.9);
    expect(jornadaSemanal('2026-07-14')).toBe(44);
    expect(jornadaSemanal('2026-07-15')).toBe(42);
  });
  it('topes de renta', () => {
    expect(obligadoDeclarar({ patrimonio: 0, ingresos: 69719000, tarjeta: 0, compras: 0, consignaciones: 0, iva: false }).obligado).toBe(true);
    expect(obligadoDeclarar({ patrimonio: 224096000, ingresos: 0, tarjeta: 0, compras: 0, consignaciones: 0, iva: false }).obligado).toBe(false);
  });
});
