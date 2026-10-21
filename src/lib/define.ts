/** Fonctions d'aide à l'écriture des textes (fichier sans dépendance : évite l'import circulaire avec lib/guides.ts). */
import type { PageText, HomeText, SitioText } from './guide-types';
export const defineText = (t: PageText): PageText => t;
export const defineHome = (t: HomeText): HomeText => t;
export const defineSitio = (t: SitioText): SitioText => t;
