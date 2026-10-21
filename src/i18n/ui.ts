import type { Locale } from './routes';
const es = {
  updatedOn: 'Actualizado el', editorialPolicy: 'Política editorial', contactLabel: 'Contacto', reviewedBy: 'Revisado por',
  skipToContent: 'Ir al contenido', mainNav: 'Menú principal', breadcrumbLabel: 'Ruta de navegación', breadcrumbHome: 'Inicio', menuOpen: 'Abrir el menú',
  faqTitle: 'Preguntas frecuentes', relatedCalculators: 'Páginas y calculadoras relacionadas', sourcesTitle: 'Fuentes', writtenBy: 'Escrito por',
  asOf: 'Fechas y valores oficiales', lastUpdated: 'revisados el',
  footerValidated: 'Fuentes: DIAN, Decreto 2229 de 2023, secretarías de hacienda municipales, Código Sustantivo del Trabajo',
  footerBrowser: 'Se calcula en su navegador · ningún dato sale de su equipo · gratis · sin registro ni teléfono',
  footerDisclaimer: 'Sitio independiente publicado por Radif Partners, sin vínculo con la DIAN, el Ministerio del Trabajo, las alcaldías ni ninguna empresa de software contable. Las fechas se toman del calendario oficial y se citan con su norma; los cálculos de nómina son estimaciones orientativas que no sustituyen la liquidación de su empleador ni la asesoría de un contador o abogado.',
  footerPopular: '', notFound: 'Esta página no existe.', readMore: 'Leer más',
};
const en: typeof es = {
  updatedOn: 'Updated', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Checked by',
  skipToContent: 'Skip to content', mainNav: 'Main menu', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Frequently asked questions', relatedCalculators: 'Related pages and calculators', sourcesTitle: 'Sources', writtenBy: 'Written by',
  asOf: 'Official dates and values', lastUpdated: 'checked on',
  footerValidated: 'Sources: DIAN, Decree 2229 of 2023, municipal treasury offices, Colombian Labour Code',
  footerBrowser: 'Calculated in your browser · nothing leaves your device · free · no sign-up, no phone number',
  footerDisclaimer: 'Independent website published by Radif Partners, with no link to DIAN, the Ministry of Labour, any city hall or any accounting software company. Dates come from the official calendars and are quoted with their legal basis; payroll figures are estimates only and do not replace your employer’s settlement or advice from an accountant or lawyer.',
  footerPopular: '', notFound: 'This page does not exist.', readMore: 'Read more',
};
const ALL = { es, en };
export function t(lang: Locale) { return ALL[lang] ?? es; }
