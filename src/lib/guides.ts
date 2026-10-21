/** Registre des pages de contenu : fiches de `content/pages.ts` + un texte par langue (`content/<langue>/<id>.ts`). */
import type { PageDef, PageText, Group, Lang, HomeText, SitioText } from './guide-types';
import { META } from '../content/pages';

const textos = import.meta.glob<{ default: PageText }>(['../content/es/*.ts', '../content/en/*.ts', '!../content/*/_*.ts'], { eager: true });
const texto = (lang: Lang, id: string): PageText => {
  const m = textos[`../content/${lang}/${id}.ts`];
  if (!m) throw new Error(`Texte manquant : src/content/${lang}/${id}.ts`);
  return m.default;
};

/** Une page n'est publiée que si ses deux textes existent (es et en). */
export const PAGES: PageDef[] = META
  .filter((m) => (['es', 'en'] as Lang[]).every((l) => textos[`../content/${l}/${m.id}.ts`]))
  .map((m) => ({ ...m, es: texto('es', m.id), en: texto('en', m.id) }))
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

export const GROUPS: Group[] = ['impuestos', 'ica', 'nomina'];
export const pageById = (id: string) => PAGES.find((p) => p.id === id);

const homes = import.meta.glob<{ default: HomeText }>('../content/*/_home.ts', { eager: true });
const sitios = import.meta.glob<{ default: SitioText }>('../content/*/_sitio.ts', { eager: true });
export const homeText = (lang: Lang): HomeText => { const m = homes[`../content/${lang}/_home.ts`]; if (!m) throw new Error(`Texte manquant : src/content/${lang}/_home.ts`); return m.default; };
export const sitioText = (lang: Lang): SitioText => { const m = sitios[`../content/${lang}/_sitio.ts`]; if (!m) throw new Error(`Texte manquant : src/content/${lang}/_sitio.ts`); return m.default; };
