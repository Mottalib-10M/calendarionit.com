/**
 * Fiches des pages de contenu : groupe, ordre, outil (et ses réglages), pages liées, sources.
 * Le texte de chaque page est dans `content/es/<id>.ts` et `content/en/<id>.ts`.
 * Une page n'est publiée que si ses deux textes existent (lib/guides.ts).
 */
import type { PageMeta } from '../lib/guide-types';

export const META: PageMeta[] = [
  // Impuestos DIAN
  { id: 'renta-pn', group: 'impuestos', order: 1, tool: 'calendario', toolProps: { tipo: 'pn', foco: 'renta' }, related: ['topes', 'retencion', 'exogena', 'festivos'], sources: ['dianCal', 'dec2229', 'rentaPN', 'uvt2026'] },
  { id: 'renta-pj', group: 'impuestos', order: 2, tool: 'calendario', toolProps: { tipo: 'pj', nit: '900123453', foco: 'renta' }, related: ['iva', 'retencion-dian', 'exogena', 'ica-bogota'], sources: ['dianCal', 'dec2229', 'dianCalPag'] },
  { id: 'iva', group: 'impuestos', order: 3, tool: 'calendario', toolProps: { tipo: 'pj', iva: 'bim', nit: '900123453', foco: 'iva_bim' }, related: ['renta-pj', 'retencion-dian', 'simple'], sources: ['dianCal', 'dec2229', 'dianCalPag'] },
  { id: 'retencion-dian', group: 'impuestos', order: 4, tool: 'calendario', toolProps: { tipo: 'pj', retenedor: true, nit: '900123453', foco: 'retencion' }, related: ['retencion', 'iva', 'renta-pj'], sources: ['dianCal', 'dec2229', 'dianCalPag'] },
  { id: 'simple', group: 'impuestos', order: 5, tool: 'calendario', toolProps: { tipo: 'pn', rst: true, iva: 'bim', foco: 'rst_anticipo' }, related: ['iva', 'renta-pn', 'ica-medellin'], sources: ['dianCal', 'dec2229', 'dianCalPag'] },
  { id: 'exogena', group: 'impuestos', order: 6, tool: 'calendario', toolProps: { tipo: 'pj', exogena: true, nit: '900123453', foco: 'exogena' }, related: ['renta-pj', 'renta-pn', 'festivos'], sources: ['exogena227', 'exogena12', 'exogena21', 'exogenaCal'] },
  { id: 'topes', group: 'impuestos', order: 7, tool: 'topes', related: ['renta-pn', 'retencion', 'exogena'], sources: ['rentaPN', 'uvt2025', 'uvt2026', 'dec2229'] },
  { id: 'retencion', group: 'impuestos', order: 8, tool: 'retencion', related: ['retencion-dian', 'salario-minimo', 'topes', 'liquidacion'], sources: ['et383', 'et206', 'et336', 'uvt2026', 'ley100'] },
  { id: 'festivos', group: 'impuestos', order: 9, tool: 'festivos', related: ['recargos', 'renta-pn', 'vacaciones'], sources: ['ley51', 'ley2578', 'dec2229'] },
  // ICA por ciudad
  { id: 'ica-bogota', group: 'ica', order: 10, tool: 'calendario', toolProps: { tipo: 'pj', ciudad: 'bogota', nit: '900123453', foco: 'ica' }, related: ['ica-medellin', 'ica-cali', 'renta-pj'], sources: ['icaBogota', 'icaBogotaCal', 'uvt2025'] },
  { id: 'ica-medellin', group: 'ica', order: 11, tool: 'calendario', toolProps: { tipo: 'pj', ciudad: 'medellin', nit: '900123453', foco: 'ica' }, related: ['ica-bogota', 'ica-cali', 'simple'], sources: ['icaMedellin', 'dianCal'] },
  { id: 'ica-cali', group: 'ica', order: 12, tool: 'calendario', toolProps: { tipo: 'pj', ciudad: 'cali', nit: '900123453', foco: 'ica' }, related: ['ica-bogota', 'ica-medellin', 'festivos'], sources: ['icaCali', 'icaCaliMod', 'ley2578'] },
  { id: 'ica-barranquilla', group: 'ica', order: 13, tool: 'calendario', toolProps: { tipo: 'pj', ciudad: 'barranquilla', nit: '900123453', foco: 'ica' }, related: ['ica-bogota', 'ica-bucaramanga', 'retencion-dian'], sources: ['icaBarranquilla', 'dianCal'] },
  { id: 'ica-bucaramanga', group: 'ica', order: 14, tool: 'calendario', toolProps: { tipo: 'pj', ciudad: 'bucaramanga', nit: '900123453', foco: 'ica' }, related: ['ica-barranquilla', 'ica-bogota', 'renta-pj'], sources: ['icaBucaramanga', 'icaBucaramangaMod'] },
  // Nómina y prestaciones
  { id: 'liquidacion', group: 'nomina', order: 15, tool: 'liquidacion', related: ['cesantias', 'prima', 'vacaciones', 'salario-minimo'], sources: ['cst64', 'cst249', 'cst306', 'ley995', 'ley1_1963'] },
  { id: 'cesantias', group: 'nomina', order: 16, tool: 'cesantias', related: ['liquidacion', 'prima', 'salario-minimo'], sources: ['cst249', 'ley50', 'dur1072', 'ley1_1963'] },
  { id: 'prima', group: 'nomina', order: 17, tool: 'prima', related: ['cesantias', 'liquidacion', 'vacaciones'], sources: ['cst306', 'ley1_1963', 'dec1470'] },
  { id: 'vacaciones', group: 'nomina', order: 18, tool: 'vacaciones', related: ['liquidacion', 'festivos', 'prima'], sources: ['cst186', 'ley995'] },
  { id: 'recargos', group: 'nomina', order: 19, tool: 'recargos', related: ['festivos', 'salario-minimo', 'liquidacion'], sources: ['cst160', 'cst168', 'cst179', 'ley2101', 'ley2466'] },
  { id: 'salario-minimo', group: 'nomina', order: 20, tool: 'minimo', related: ['liquidacion', 'recargos', 'retencion', 'cesantias'], sources: ['dec1469', 'dec0159', 'dec1470', 'ley278', 'ley100salud'] },
];
