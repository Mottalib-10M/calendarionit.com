/**
 * Une page de contenu = une fiche dans `src/content/pages.ts` (outil, pages liées, sources)
 * et un fichier de texte par langue : `src/content/es/<id>.ts` (Colombie, espagnol) et
 * `src/content/en/<id>.ts` (anglophone qui vit ou travaille en Colombie).
 * Notice : CONTRIBUTING-CONTENU.md à la racine.
 */
import type { SourceKey, Params } from './engine/params';

export type Lang = 'es' | 'en';
export type Group = 'impuestos' | 'ica' | 'nomina';
export interface FAQ { q: string; a: string }

/** Outils fournis pour écrire le corps : liens internes, nombres au format de la langue, paramètres officiels. */
export interface Helpers {
  lang: Lang;
  /** Lien interne vers une autre page du site, par son identifiant. */
  a: (id: string, text: string) => string;
  /** Montant en pesos (« $ 1.750.905 » en espagnol, « COP 1,750,905 » en anglais). */
  cop: (n: number, decimals?: number) => string;
  /** Nombre au format de la langue. */
  num: (n: number, decimals?: number) => string;
  /** Taux en pour cent depuis une fraction (0,12 → « 12 % »). */
  pct: (x: number, decimals?: number) => string;
  /** Date ISO écrite en toutes lettres dans la langue. */
  date: (iso: string) => string;
  /** Date ISO avec le jour de la semaine (« miércoles, 12 de agosto »). */
  dia: (iso: string) => string;
  /** Tableau de style journal. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Lien vers une source du fichier de paramètres (texte officiel). */
  src: (key: SourceKey, text?: string) => string;
  /** Paramètres 2026 : toute valeur réglementaire se lit ici, jamais en dur. */
  P: Params;
  /** Moteur de calcul et données (calendrier, ICA, festivos), pour les exemples chiffrés. */
  M: typeof import('./engine/index');
}

export interface PageText {
  /** Segment d'URL, sans barre. Ni année, ni chiffre en tête. */
  slug: string;
  /** Libellé court pour les menus et le fil d'Ariane. */
  nav: string;
  /** Une phrase pour les cartes « pages associées ». */
  card: string;
  /** 50 à 60 caractères, terme-clé en tête, année comprise (RECETTE §11). */
  title: string;
  /** 150 à 160 caractères, année comprise. */
  description: string;
  h1: string;
  /** Chapeau d'une phrase, sous le H1. */
  intro: string;
  /** Bloc citable : UN paragraphe d'au moins 120 mots, avec les chiffres (RECETTE §21). */
  resume: (h: Helpers) => string;
  /** 3 à 5 questions propres à la page, réponses de 40 à 90 mots (RECETTE §7). */
  faqs: (h: Helpers) => FAQ[];
  /** Corps HTML (h2, h3, p, ul, ol, table via h.table). */
  body: (h: Helpers) => string;
}

export type ToolKind =
  | 'calendario' | 'festivos' | 'retencion' | 'topes'
  | 'liquidacion' | 'cesantias' | 'prima' | 'vacaciones' | 'recargos' | 'minimo';

export interface PageMeta {
  id: string;
  group: Group;
  order: number;
  /** Outil complet de la page. */
  tool: ToolKind;
  /** Réglages par défaut de l'outil propres à la page (obligation, ville…). */
  toolProps?: Record<string, string | number | boolean>;
  /** Identifiants des pages liées en fin de page (3 à 6). */
  related: string[];
  /** Clés de `params-2026.json > sources` citées par la page (2 au moins). */
  sources: SourceKey[];
}

export interface PageDef extends PageMeta { es: PageText; en: PageText }

/** Accueil d'une langue (page pilier) : `src/content/<langue>/_home.ts`. */
export interface HomeText {
  title: string; description: string; h1: string; intro: string;
  /** Bloc citable (≥ 120 mots, un paragraphe), replié à sa première phrase. */
  resume: (h: Helpers) => string;
  /** 6 à 8 questions propres à l'accueil, réponses de 40 à 90 mots. */
  faqs: (h: Helpers) => FAQ[];
  /** Corps de l'accueil, sous le calculateur (HTML). */
  body: (h: Helpers) => string;
}
/** Pages de confiance d'une langue : `src/content/<langue>/_sitio.ts`. */
export interface SitioText {
  about: { title: string; description: string; h1: string; body: (h: Helpers) => string };
  method: { title: string; description: string; h1: string; body: (h: Helpers) => string; faqs: (h: Helpers) => FAQ[] };
}
