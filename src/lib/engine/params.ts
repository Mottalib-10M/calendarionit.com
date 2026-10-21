/** Paramètres 2026 (src/data/params-2026.json) : UVT, salaire minimum, taux de paie et sources officielles. */
import raw from '../../data/params-2026.json';
export const P = raw;
export type Params = typeof raw;
export type SourceKey = keyof Params['sources'];
