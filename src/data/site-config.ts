/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://calendarionit.com";
export const SITE_NAMES: Record<string, string> = {"es": "Calendario NIT", "en": "Calendario NIT"};
export const LANG_TAGS: Record<string, string> = {"es": "es-CO", "en": "en"};
export const OG_LOCALES: Record<string, string> = {"es": "es_CO", "en": "en_US"};
export const LOCALE_TAG = 'es-CO';
/** Locale de mise en forme par langue : l'espagnol de Colombie (1.750.905), l'anglais à l'américaine (1,750,905). */
export const LOCALE_BY_LANG: Record<string, string> = { es: 'es-CO', en: 'en-US' };
export const CURRENCY = 'COP';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-21';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"es": "Editor de calendarios tributarios por NIT y calculadoras de nómina para Colombia", "en": "Publisher of NIT-based tax calendars and payroll calculators for Colombia"};
export const AUTHOR_DESC: Record<string, string> = {"es": "Radif Partners arma esta web a partir de los textos que rigen en Colombia: el Decreto 2229 de 2023 y el calendario que la DIAN publica cada año para los vencimientos, el Código Sustantivo del Trabajo y los decretos de salario mínimo para la nómina. Usted escribe los últimos dígitos de su NIT y la página ordena sus fechas; nada de lo que digita sale de su navegador.", "en": "Radif Partners builds this site from the rules in force in Colombia: Decree 2229 of 2023 and the yearly DIAN calendar for tax due dates, the Labour Code and the minimum wage decrees for payroll. You type the last digits of your NIT and the page sorts your dates; nothing you enter leaves your browser."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"es": ["Calendario tributario DIAN", "Impuesto de industria y comercio (ICA)", "Retención en la fuente por salarios", "Prestaciones sociales del Código Sustantivo del Trabajo", "Recargos nocturnos, dominicales y festivos"], "en": ["DIAN tax calendar", "Municipal industry and commerce tax (ICA)", "Payroll withholding tax in Colombia", "Colombian statutory employee benefits", "Night, Sunday and holiday pay premiums"]};
export const CONTACT_EMAIL = "contacto@calendarionit.com";
export const THEME_COLOR = '#003893';
export const LOGO_SYMBOL = 'NIT';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = 'G-S50QXC7TM2';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'z260vtjwkq';
export const INDEXNOW_KEY = '5cbb6848f2f7486774e68af0d127239f';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "TVA",
  vatNumber: '',
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
