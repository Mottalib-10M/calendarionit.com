import { defineSitio } from '../../lib/define';
import { CONTACT_EMAIL } from '../../data/site-config';

export default defineSitio({
  about: {
    title: 'Colombia Tax Dates & Payroll 2026: who publishes it',
    description: 'About us: Radif Partners publishes Colombia Tax Dates & Payroll from official DIAN and city hall calendars, with no software to sell and no contact form.',
    h1: 'About us',
    body: (h) => `
<p>Colombia Tax Dates & Payroll is published by Radif Partners, a publisher of calculators and practical guides. The site answers the question every accountant, business owner and income tax filer in Colombia asks: with my NIT, when is my next deadline? The official answer exists, but it is a PDF with dozens of tables to scan by hand, and the municipal tax sits in another resolution on another website. Here you type your digits once and every date appears in order.</p>
<h2>What we do better than the first Google result</h2>
<p>We instantly sort every date of the year for a NIT, with no email or sign-up: income tax, VAT, withholding, the Simple Tax Regime, third-party information and ICA for five cities, with the next deadline on top and a file for your calendar. Every page quotes the decree or resolution behind each date and the day we read it. The payroll calculators all share one table of 2026 figures.</p>
<h2>Funding and independence</h2>
<p>The site does not sell accounting software, takes no commissions, links to no vendors and collects no contact details. It is not an official website, has no link with DIAN, the Ministry of Labour or any city hall, and uses none of their logos.</p>
<h2>How we work</h2>
<p>Dates and figures live in data files, each with its legal act and the day it was read (${h.date(h.P.retrieved_at)} for this version). A date we cannot read from an official source is not published; anything the authority has not yet published, such as the 2027 calendar, is shown as yet to be published. Details are in ${h.a('method', 'method and sources')}.</p>
<!--identidad-->
<h2>Contact</h2>
<p>To report an error: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>. We do not give individual advice or file returns.</p>
`,
  },
  method: {
    title: 'Method and sources 2026: how each tax calendar is built',
    description: 'Method and sources: where each date of the 2026 Colombian tax calendar by NIT comes from, how ICA resolutions are read and how settlements are computed.',
    h1: 'Method and sources',
    body: (h) => `
<h2>National calendar</h2>
<p>National dates were copied from DIAN’s “Calendario tributario 2026” PDF, which applies Decree 2229 of 2023 (compiled in Single Regulatory Decree 1625 of 2016). Each table was read by its coordinates and checked against the rendered page, then an automated test confirms that every date falls on a business day, using the ${h.M.festivos(2026).length} holidays of 2026, including Monday 13 July (Law 2578 of 2026). Third-party information dates come from DIAN Resolution 000227 of 2025, as amended by Resolutions 000012 and 000021 of 2026.</p>
<h2>Reading the NIT</h2>
<p>Everything after the hyphen (the check digit) is dropped, then the last digit or the last two are used, depending on the table. Range keys such as “9-0” or “99-00” wrap around: they include 9 and 0, or 99 and 00.</p>
<h2>Municipal ICA</h2>
<p>Each city has its own file with its treasury resolution, regimes and the year’s amendments. Only cities whose rule could be read from an official source are included: Bogotá (Resolution SDH-000195 of 2025), Medellín (Resolution 202550100057 of 2025), Cali (Resolution 4131.010.21.0607 of 2025 and amendments), Barranquilla (Resolution DSH 003 of 2025, read on the official calendar page) and Bucaramanga (Resolution 4-R--202512-00030019 of 2025).</p>
<h2>Payroll</h2>
<p>The calculators use the 2026 minimum wage and transport allowance, the Labour Code and Laws 2101 of 2021 and 2466 of 2025. Fractions of a year use the 360-day commercial year that Colombian payrolls use; the transport allowance is part of the base for severance, interest and the service bonus, not for paid holidays. Payroll withholding applies the article 383 Tax Code table with the ${h.cop(h.P.uvt['2026'])} UVT. These are estimates: your employer’s settlement may include items these calculators do not know about.</p>
<h2>Updates</h2>
<p>A script checks every day whether DIAN has published next year’s calendar; when it appears, the dates are copied, tested and published with a new review date. Payroll figures change when the relevant decree is issued, usually at the end of December.</p>
`,
    faqs: (h) => [
      { q: 'How do you check that a calendar date is right?', a: 'Every date is copied from the official document and goes through two checks: it is compared with the rendered DIAN PDF or city resolution, and an automated test confirms it falls on a business day given that year’s holidays. A date that fails is not published until the difference with the source is resolved.' },
      { q: 'Why are some cities missing from the ICA calendar?', a: 'Because we only publish a city’s ICA dates once we have read its resolution from an official source. If the city hall website blocks access or the document is not published, we would rather leave the city out than copy dates from a blog or an accounting software vendor that may be outdated or mistyped.' },
      { q: 'How often are the payroll figures reviewed?', a: `Whenever a rule that changes them is published and, at the least, every December, when next year’s minimum wage and transport allowance are set. This version was last reviewed on ${h.date(h.P.retrieved_at)}. The 2027 figures will show as yet to be published until the decree exists.` },
    ],
  },
});
