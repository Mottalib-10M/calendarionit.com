#!/usr/bin/env python3
"""Génère public/llms.txt à partir du build (RECETTE §21). Appel : npm run build (enchaîné)."""
import glob, html, os, re
SITE = re.search(r'SITE_URL = "([^"]+)"', open('src/data/site-config.ts').read()).group(1)
rows = {'es': [], 'en': []}
for f in sorted(glob.glob('dist/*/**/index.html', recursive=True)):
    d = open(f, encoding='utf-8').read()
    if 'noindex' in d[:3000] or '/embed/' in f: continue
    path = '/' + os.path.relpath(os.path.dirname(f), 'dist').replace(os.sep, '/') + '/'
    lang = path.split('/')[1]
    if lang not in rows: continue
    t = html.unescape(re.search(r'<title>(.*?)</title>', d, re.S).group(1))
    m = re.search(r'name="description" content="(.*?)"', d, re.S)
    rows[lang].append((path, t, html.unescape(m.group(1)) if m else ''))
out = ['# Vencimientos y Nómina CO · Colombia Tax Dates & Payroll', '',
       '> Sitio independiente de Radif Partners, en español e inglés, sobre los vencimientos tributarios de Colombia en 2026 por último dígito del NIT (renta, IVA, retención en la fuente, Régimen Simple, información exógena), el calendario de ICA de Bogotá, Medellín, Cali, Barranquilla y Bucaramanga, y calculadoras de nómina (liquidación, cesantías, prima, vacaciones, recargos, salario mínimo, retención sobre salarios).', '',
       'Datos: calendario tributario 2026 de la DIAN (Decreto 2229 de 2023), resoluciones de calendario de cada secretaría de hacienda municipal, decretos del Ministerio del Trabajo y texto del Código Sustantivo del Trabajo y del Estatuto Tributario. El calendario nacional de 2027 y el salario mínimo de 2027 están por publicarse. Los cálculos se hacen en el navegador, sin recoger datos. Los resultados son estimaciones.', '']
for lang, titel in (('es', '## Páginas en español'), ('en', '## Pages in English')):
    out.append(titel); out.append('')
    for p, t, d in rows[lang]: out.append(f'- [{t}]({SITE}{p}): {d}')
    out.append('')
open('public/llms.txt', 'w', encoding='utf-8').write('\n'.join(out))
print('llms.txt:', sum(len(v) for v in rows.values()), 'páginas')
