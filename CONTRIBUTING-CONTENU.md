# Contenu du site co-calendario-nomina

- Une page = une fiche dans `src/content/pages.ts` (outil et ses réglages, pages liées, sources)
  et un texte par langue : `src/content/es/<id>.ts` (Colombie) et `src/content/en/<id>.ts`
  (anglophones qui vivent, travaillent ou emploient en Colombie). Accueil : `<langue>/_home.ts` ;
  À propos et Méthode : `<langue>/_sitio.ts`.
- Aucun chiffre écrit à la main : dates via `h.M` (`vencimientos`, `tabla`, `CALENDARIO`,
  `CIUDADES`, `festivos`), valeurs légales via `h.P` (`src/data/params-2026.json`), montants via le
  moteur (`src/lib/engine/nomina.ts`). Chaque valeur cite son acte (décret, résolution, article).
- Contrôle des textes sans build : `npx vitest run src/content/textos.test.ts`.
  Contrôle du moteur : `npx vitest run src/lib/engine` (dont : toute date nationale tombe un jour ouvré).

## Données

| Fichier | Contenu | Source |
|---|---|---|
| `src/data/calendario-2026.json` | Échéances nationales par chiffre du NIT, exógena AG2025 | PDF DIAN « Calendario tributario 2026 » (Decreto 2229 de 2023) ; Res. DIAN 000227 de 2025, 000012 et 000021 de 2026 |
| `src/data/ica-2026.json` | ICA et ReteICA de Bogotá, Medellín, Cali, Barranquilla, Bucaramanga | Résolution de calendrier de chaque secrétariat des finances (voir `acto`, `url`) |
| `src/data/params-2026.json` | UVT, salaire minimum, auxilio, taux de paie, barème art. 383, seuils de déclaration, sources | Résolutions DIAN, décrets MinTrabajo, CST, ET, lois 50/1990, 100/1993, 2101/2021, 2466/2025 |
| `src/data/vigilancia.cache.json` | État des sources officielles (écrit par le script) | `scripts/update-data.mjs` |

Clés du NIT : `"7"` = dernier chiffre ; `"01-02"` = deux derniers chiffres (paire) ; `"9-0"`, `"99-00"`,
`"7-0"` font le tour ; `"todos"` = date unique. Toujours sans le chiffre de vérification.

## Veille et mise à jour

- `npm run datos` (= `node scripts/update-data.mjs`) sonde le PDF DIAN de l'année suivante, la page
  exógena de l'année gravable suivante, le PDF de l'année en cours (empreinte) et les pages ICA des villes.
  Il écrit `src/data/vigilancia.cache.json`. Avec `--strict`, il sort en erreur si quelque chose a paru ou changé.
- `.github/workflows/deploy.yml` : chaque jour à 11 h 30 UTC, job `vigilancia` (échec = courriel GitHub)
  et reconstruction du site (fenêtre « 45 prochains jours » de l'accueil, dates par défaut des calculateurs).
- Rien n'est recopié automatiquement : une date se relit dans la norme avant d'entrer dans le site.

## Calendrier de l'année suivante (fin décembre)

1. Quand la DIAN publie `Calendario_Tributario_2027.pdf` : créer `src/data/calendario-2027.json` sur le
   modèle de 2026 (lecture des tableaux par coordonnées, contrôle visuel des pages rendues), sans rien
   projeter. Basculer l'import dans `src/lib/engine/calendario.ts`.
2. Lancer `npx vitest run src/lib/engine` : chaque date doit tomber un jour ouvré (`fechas.ts` calcule
   les fériés par la loi 51 de 1983 et la loi 2578 de 2026).
3. ICA : une ville n'entre ou ne reste que si sa résolution 2027 est lue sur une source officielle.
   Cartagena (Decreto 2289 de 2025) est restée dehors en 2026 : PDF inaccessible (403).
4. Paie : salaire minimum et auxilio 2027 dès le décret (Ley 278 de 1996, art. 8 : commission avant
   le 15 décembre, sinon gouvernement avant le 30) ; UVT 2027 dès la résolution DIAN. D'ici là, les
   pages disent « por publicarse ».
5. Le recargo dominical passe à 100 % le 1er juillet 2027 (CST art. 179, Ley 2466 de 2025) : déjà
   dans `params-2026.json > nomina.dominical`.
6. Renommer les fichiers de l'année, mettre `retrieved_at` et `LAST_UPDATED` (site-config) au jour de
   la lecture, `npm run check` à 0, puis commit.
