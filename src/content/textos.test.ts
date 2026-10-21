/**
 * Contrôle des textes avant build (lancer : npx vitest run src/content/textos.test.ts).
 * Mêmes bornes que check-seo / check-trame : titre 50-60 caractères, description 150-160, bloc
 * citable ≥ 120 mots en un paragraphe, réponses FAQ 40-90 mots, questions uniques, pas de tiret long,
 * pas d'année dans le slug, longueur du texte selon le type de page (le build ajoute ~80 à 250 mots
 * de calculateur, d'encarts et de liens : les seuils ici sont un peu sous ceux de check-seo).
 */
import { describe, it, expect } from 'vitest';
import { META } from './pages';
import { helpers } from '../lib/helpers';
import type { PageText, HomeText, SitioText, Lang } from '../lib/guide-types';

const textos = import.meta.glob<{ default: PageText }>(['./es/*.ts', './en/*.ts', '!./*/_*.ts'], { eager: true });
const homes = import.meta.glob<{ default: HomeText }>('./*/_home.ts', { eager: true });
const sitios = import.meta.glob<{ default: SitioText }>('./*/_sitio.ts', { eager: true });
const palabras = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;
const LANGS: Lang[] = ['es', 'en'];

for (const lang of LANGS) {
  const H = helpers(lang);
  const preguntas = new Map<string, string>();
  const vistas = (id: string, qs: { q: string }[]) => { for (const { q } of qs) { const k = q.toLowerCase().replace(/[¿?¡!.\s]+/g, ' ').trim(); expect(preguntas.get(k), `FAQ repetida «${q}» (${id} y ${preguntas.get(k)})`).toBeUndefined(); preguntas.set(k, id); } };
  const comun = (id: string, t: { title: string; description: string; resume: (h: typeof H) => string; faqs: (h: typeof H) => { q: string; a: string }[]; body: (h: typeof H) => string }, minPal: number, faqMin: number, faqMax: number) => {
    expect(t.title.length, `${lang}/${id} título «${t.title}» ${t.title.length}`).toBeGreaterThanOrEqual(50);
    expect(t.title.length, `${lang}/${id} título «${t.title}» ${t.title.length}`).toBeLessThanOrEqual(60);
    expect(t.title, `${lang}/${id} título sin 2026`).toMatch(/2026/);
    expect(t.description.length, `${lang}/${id} descripción ${t.description.length}`).toBeGreaterThanOrEqual(150);
    expect(t.description.length, `${lang}/${id} descripción ${t.description.length}`).toBeLessThanOrEqual(160);
    const r = t.resume(H);
    expect(palabras(r), `${lang}/${id} bloque citable`).toBeGreaterThanOrEqual(125);
    expect(r, `${lang}/${id} bloque citable en un solo párrafo, sin HTML`).not.toMatch(/<\/?p|<br/);
    const f = t.faqs(H);
    expect(f.length, `${lang}/${id} número de FAQ`).toBeGreaterThanOrEqual(faqMin);
    expect(f.length, `${lang}/${id} número de FAQ`).toBeLessThanOrEqual(faqMax);
    for (const x of f) { const n = x.a.split(/\s+/).filter(Boolean).length; expect(n >= 40 && n <= 90, `${lang}/${id} FAQ «${x.q}» ${n} palabras`).toBe(true); }
    vistas(id, f);
    const b = t.body(H);
    const todo = `${t.title} ${t.description} ${t.intro ?? ''} ${r} ${b} ${f.map((x) => x.q + ' ' + x.a).join(' ')}`;
    expect(todo, `${lang}/${id} raya larga (—)`).not.toMatch(/—/);
    expect(todo, `${lang}/${id} NaN/undefined`).not.toMatch(/NaN|undefined|Infinity/);
    expect(todo, `${lang}/${id} fecha en formato máquina`).not.toMatch(/\b20\d\d-\d\d-\d\d\b/);
    const total = palabras(`${r} ${b} ${f.map((x) => x.q + ' ' + x.a).join(' ')}`);
    expect(total, `${lang}/${id} palabras de texto ${total}`).toBeGreaterThanOrEqual(minPal);
    return total;
  };
  if (Object.keys(textos).some((k) => k.startsWith(`./${lang}/`)) || homes[`./${lang}/_home.ts`]) describe(`textos ${lang}`, () => {
    for (const m of META) {
      const mod = textos[`./${lang}/${m.id}.ts`];
      if (!mod) continue;
      it(m.id, () => {
        const t = mod.default;
        expect(t.slug, `${lang}/${m.id} slug con año`).not.toMatch(/20\d\d/);
        const total = comun(m.id, t, m.tool ? 430 : 1120, 3, m.tool ? 5 : 8);
        if (m.tool) expect(total, `${lang}/${m.id} página herramienta: ${total} palabras, máx. 680`).toBeLessThanOrEqual(680);
      });
    }
    const h = homes[`./${lang}/_home.ts`];
    if (h) it('_home', () => { comun('home', { ...h.default }, 1750, 6, 8); });
    const s = sitios[`./${lang}/_sitio.ts`];
    if (s) it('_sitio', () => {
      const a = s.default.about, me = s.default.method;
      for (const [k, x] of [['about', a], ['method', me]] as const) {
        expect(x.title.length >= 50 && x.title.length <= 60, `${lang}/${k} título ${x.title.length}`).toBe(true);
        expect(x.description.length >= 150 && x.description.length <= 160, `${lang}/${k} descripción ${x.description.length}`).toBe(true);
        expect(x.body(H), `${lang}/${k} raya larga`).not.toMatch(/—/);
      }
      expect(a.body(H)).toContain('<!--identidad-->');
      for (const f of me.faqs(H)) { const n = f.a.split(/\s+/).length; expect(n >= 40 && n <= 90, `${lang}/method FAQ ${n}`).toBe(true); }
      vistas('method', me.faqs(H));
    });
  });
}
