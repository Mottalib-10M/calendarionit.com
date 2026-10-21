/** ICA por ciudad : nombres, régimen y filas (datos : src/data/ica-2026.json). */
import { CIUDADES, type Ciudad } from './calendario';
export const ciudad = (id: string): Ciudad | undefined => CIUDADES.find((c) => c.id === id);
export const ciudadNombre = (id: string | undefined, l: 'es' | 'en') => (id ? ciudad(id)?.nombre[l] ?? id : '');
