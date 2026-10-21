#!/usr/bin/env node
/**
 * Veille des publications officielles (sans dépendance). Le site ne copie jamais une date sans l'avoir
 * relue : ce script ne réécrit donc pas les calendriers, il détecte qu'une source a paru ou changé et
 * fait échouer le job (GitHub prévient par courriel) pour que la mise à jour soit faite à la main,
 * testée (vitest vérifie que chaque date tombe un jour ouvré) puis publiée.
 *
 * Ce qu'il surveille :
 *  1. DIAN : le PDF du calendrier de l'année suivante, au même chemin que celui de l'année en cours
 *     (https://www.dian.gov.co/Calendarios/Calendario_Tributario_<année>.pdf). Absent = « por publicarse ».
 *     Il paraît d'ordinaire fin décembre.
 *  2. DIAN : la page du calendrier d'exógena de l'année gravable suivante (vigencia-<année>.aspx).
 *  3. Les pages officielles de calendrier ICA des villes couvertes (empreinte SHA-256 du contenu
 *     texte, scripts retirés) : un changement signale une nouvelle résolution ou une modification.
 *  4. Le PDF actuel de la DIAN : son empreinte, pour repérer une version corrigée (comme celles qui ont
 *     intégré le 17 avril et le 13 juillet 2026).
 *
 * Écrit : src/data/vigilancia.cache.json (état de chaque source, date du contrôle).
 * Usage : node scripts/update-data.mjs [--strict]  (--strict : code de sortie 2 si quelque chose a changé)
 * Lancé chaque jour par .github/workflows/deploy.yml. Mise à jour annuelle du calendrier 2027 :
 * voir CONTRIBUTING-CONTENU.md, section « Calendrier de l'année suivante ».
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const FILE = 'src/data/vigilancia.cache.json';
const CAL = JSON.parse(readFileSync('src/data/calendario-2026.json', 'utf8'));
const ICA = JSON.parse(readFileSync('src/data/ica-2026.json', 'utf8'));
const anio = CAL.anio;
const prev = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : { fuentes: {} };
const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; vigilancia-calendario/1.0)' };

async function sonda(url, { texto = false } = {}) {
  try {
    const r = await fetch(url, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(30000) });
    if (!r.ok) return { estado: r.status };
    const buf = Buffer.from(await r.arrayBuffer());
    const cuerpo = texto ? buf.toString('utf8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ') : buf;
    return { estado: r.status, huella: createHash('sha256').update(cuerpo).digest('hex').slice(0, 16), bytes: buf.length };
  } catch (e) {
    return { estado: 'error', detalle: String(e.message || e).slice(0, 120) };
  }
}

const fuentes = {
  [`dian_calendario_${anio + 1}`]: { url: `https://www.dian.gov.co/Calendarios/Calendario_Tributario_${anio + 1}.pdf` },
  [`dian_calendario_${anio}`]: { url: CAL.fuente_url },
  [`dian_exogena_ag${anio}`]: { url: `https://www.dian.gov.co/impuestos/sociedades/ExogenaTributaria/CalendarioExogena/Paginas/vigencia-${anio}.aspx`, texto: true },
  ...Object.fromEntries(ICA.ciudades.map((c) => [`ica_${c.id}`, { url: c.url_calendario && !c.url_calendario.includes('web.archive.org') ? c.url_calendario : c.url, texto: !/\.pdf$/i.test(c.url) }])),
};

const hoy = new Date().toISOString().slice(0, 10);
const out = { revisado: hoy, fuentes: {} };
const cambios = [];
for (const [k, f] of Object.entries(fuentes)) {
  const r = await sonda(f.url, { texto: f.texto });
  const antes = prev.fuentes?.[k];
  out.fuentes[k] = { url: f.url, ...r, desde: antes && antes.huella === r.huella && antes.estado === r.estado ? antes.desde : hoy };
  if (k === `dian_calendario_${anio + 1}` && r.estado === 200) cambios.push(`La DIAN publicó el calendario ${anio + 1}: ${f.url}`);
  else if (antes && antes.estado === 200 && r.estado === 200 && antes.huella !== r.huella) cambios.push(`Cambió ${k}: ${f.url}`);
  console.log(`${k.padEnd(28)} ${String(r.estado).padEnd(6)} ${r.huella ?? r.detalle ?? ''}`);
}
writeFileSync(FILE, JSON.stringify(out, null, 1) + '\n');
if (cambios.length) {
  console.log('\nA revisar a mano (no se publica nada sin leer la norma):\n- ' + cambios.join('\n- '));
  if (process.argv.includes('--strict')) process.exit(2);
}
