import { defineHome } from '../../lib/define';
import type { Helpers } from '../../lib/guide-types';

/** First and last date of a national obligation in the 2026 calendar. */
const rango = (h: Helpers, id: string) => {
  const fs = (h.M.CALENDARIO.obligaciones as Record<string, Array<{ fechas: Record<string, string> }>>)[id].flatMap((f) => Object.values(f.fechas)).sort();
  return [fs[0], fs[fs.length - 1]] as const;
};

export default defineHome({
  title: 'Colombia tax calendar 2026 by NIT: DIAN, ICA and payroll',
  description: 'Colombia tax calendar 2026 by last NIT digit: income tax, VAT, withholding and city ICA dates in order, next one first, with a calendar file to import.',
  h1: 'Colombia tax calendar 2026 by NIT',
  intro: 'Type the last digits of your NIT and see every date of the year, the next one first.',
  resume: (h) => {
    const pn = rango(h, 'renta_pn'), pj = rango(h, 'renta_pj'), gc = rango(h, 'renta_gc');
    return `Colombia's 2026 tax calendar, published by the national tax office (DIAN), applies Decree 2229 of 2023, which sets deadlines in business days for 2024 onwards and assigns each date by the last digit of the taxpayer's NIT, or the last two digits for individuals' income tax returns, always leaving out the check digit after the hyphen. Individuals file their return for tax year 2025 between ${h.date(pn[0])} and ${h.date(pn[1])}; companies pay in two instalments between ${h.date(pj[0])} and ${h.date(pj[1])}; large taxpayers in three, between ${h.date(gc[0])} and ${h.date(gc[1])}. VAT, monthly withholding, the Simple Tax Regime and third-party information returns follow the same digit logic. DIAN has already shifted its dates for the civic day of 17 April and the new public holiday on Monday 13 July 2026 (Law 2578 of 2026), while the municipal ICA tax follows each city's own resolution: this page brings five cities together and sorts everything for your NIT.`;
  },
  faqs: (h) => [
    { q: 'Which digit of my NIT sets my Colombian tax deadlines?', a: 'The last digit before the hyphen, so without the check digit. In NIT 900.123.453-7 the digit that counts is 3. For individuals’ income tax returns DIAN uses the last two digits of the ID number or NIT, in pairs: 01 and 02 share a date, 03 and 04 the next one, up to 99 and 00. Some cities set ICA on a single date for everyone.' },
    { q: 'When will DIAN publish the 2027 tax calendar?', a: `As of our last check on ${h.date(h.P.retrieved_at)} it has not been published: the 2027 PDF path on the DIAN website does not respond. Decree 2229 of 2023 set permanent business-day rules, but exact dates depend on holidays and on DIAN’s adjustments. This site shows them as yet to be published until the official document is out.` },
    { q: 'Do these dates include the 13 July 2026 holiday?', a: 'Yes. Law 2578 of 1 June 2026 made 9 July, the feast of Our Lady of the Rosary of Chiquinquirá, a national holiday, observed on Monday 13 July under Law 51 of 1983. DIAN moved its July dates: the second corporate income tax instalment, VAT, withholding and the Simple regime advance for NITs ending in 3 to 6 now fall from 14 July onwards.' },
    { q: 'Can I add my Colombian tax dates to Google Calendar or Outlook?', a: 'Yes. Once you have typed your NIT and ticked your obligations, the “Add to my calendar” button downloads an .ics file with one all-day event per deadline. Open it with Google Calendar, Outlook or your phone’s calendar to import it. The file is built inside your browser, so your NIT never reaches a server.' },
    { q: 'Do foreign-owned companies follow the same calendar?', a: 'Yes. A Colombian branch or subsidiary of a foreign group has its own NIT and follows the same DIAN calendar as any other company, by its last digit: income tax in two instalments, or three if DIAN has classified it as a large taxpayer, plus VAT, withholding and ICA in the city where it operates. Transfer pricing returns have their own September dates.' },
    { q: 'Why does my city’s ICA not follow the DIAN dates?', a: 'Because the industry and commerce tax (ICA) is municipal: each city hall sets its own calendar by a treasury resolution. Bogotá uses single dates for everyone, Medellín staggers the annual return by digit in April, Cali splits it by income bracket and Bucaramanga collects ICA withholding monthly. Pick your city in the calendar to add its dates to the national ones.' },
    { q: 'Is this an official DIAN website?', a: 'No. It is an independent site published by Radif Partners, with no link to DIAN, the Ministry of Labour or any city hall. We copy dates from the official calendar and each city’s resolution, quote the act number and the date we read it, and update when the authority publishes a change. To file or pay, always use the official online services.' },
  ],
  body: (h) => {
    const filas = [
      ['Individuals’ income tax return (tax year 2025)', 'last two digits', ...rango(h, 'renta_pn').map(h.date)],
      ['Corporate income tax, two instalments', 'last digit', ...rango(h, 'renta_pj').map(h.date)],
      ['Large taxpayers, three instalments', 'last digit', ...rango(h, 'renta_gc').map(h.date)],
      ['VAT, two-month periods', 'last digit', ...rango(h, 'iva_bim').map(h.date)],
      ['VAT, four-month periods', 'last digit', ...rango(h, 'iva_cuat').map(h.date)],
      ['Monthly withholding tax return', 'last digit', ...rango(h, 'retencion').map(h.date)],
      ['Simple Tax Regime, two-month advances', 'last digit', ...rango(h, 'rst_anticipo').map(h.date)],
      ['Third-party information (exógena)', 'last two digits', ...rango(h, 'exogena').map(h.date)],
    ];
    const ej = h.M.vencimientos({ nit: '900123453', tipo: 'pj', iva: 'bim', retenedor: true, rst: false, activos: false, patrimonio: false, precios: false, ciudad: 'bogota', reteica: true });
    const ejPn = h.M.vencimientos({ nit: '1020304056', tipo: 'pn', iva: 'no', retenedor: false, rst: false, activos: false, patrimonio: false, precios: false, ciudad: '' });
    const fes = h.M.festivos(2026);
    return `
<h2>Reading your NIT before looking for a date</h2>
<p>Colombia’s tax ID, the NIT, ends with a check digit after a hyphen, and that digit plays no part in the calendar. For a company with NIT 900.123.453-7, the digit that decides is 3. For individuals filing an income tax return, DIAN uses the last two digits of the ID document: with cédula 1.020.304.056 the pair is 55-56, and the filing deadline for tax year 2025 is ${h.dia(ejPn[0].fecha)}. Whatever your situation, the number to use is the one printed on your RUT, the tax registration document.</p>
<p>The calculator above does this reading for you. It accepts the NIT with dots, with a hyphen or as a plain number, drops the check digit and finds the matching key in each table. It then merges the obligations you tick, sorts them by date and puts the next one at the top, with the number of days left.</p>
<h2>The 2026 national calendar at a glance</h2>
${h.table(['Obligation', 'Assigned by', 'First date', 'Last date'], filas, 'DIAN 2026 tax calendar, Decree 2229 of 2023; earliest and latest date across every NIT ending', ['l', 'l', 'l', 'l'])}
<p>Each row has its full table on its own page: ${h.a('renta-pn', 'individual income tax')}, ${h.a('renta-pj', 'corporate income tax')}, ${h.a('iva', 'VAT')}, ${h.a('retencion-dian', 'withholding tax returns')}, ${h.a('simple', 'the Simple Tax Regime')} and ${h.a('exogena', 'third-party information')}. Dates in January 2027 in the table belong to 2026 periods, such as the sixth VAT period or December withholding, and are already part of the published calendar.</p>
<h2>A worked example: a company in Bogotá</h2>
<p>A company whose NIT ends in 3, registered for two-month VAT, acting as withholding agent and paying ICA every two months in Bogotá, where it also withholds ICA, has ${ej.length} deadlines in 2026. The first one is ${h.date(ej[0].fecha)} and the last ${h.date(ej[ej.length - 1].fecha)}. In a single month it can face three different deadlines, some from DIAN and some from the Bogotá treasury, under rules that look nothing alike: DIAN goes by the NIT, Bogotá sets one date for everyone. That is exactly where a sorted list saves more time than the official PDF.</p>
<h2>The two adjustments of 2026</h2>
<p>This year’s calendar was corrected twice after its first version. First, for the civic day on Friday 17 April 2026, created for the third Friday of April by Decree 500 of 2024: DIAN treated it as a non-business day and shifted the April dates. Second, for the new national holiday on 9 July, feast of Our Lady of the Rosary of Chiquinquirá, created by article 6 of Law 2578 of 1 June 2026 and observed on Monday 13 July under Law 51 of 1983. Colombia therefore has ${fes.length} public holidays in 2026, and the July dates for the second corporate instalment, VAT, withholding and the Simple regime moved by one business day from NIT ending 3. The dates on this site already include both changes; the full list of non-business days is on the ${h.a('festivos', 'Colombian holidays')} page.</p>
<p>City halls did the same on their side. Cali moved its third ICA and ICA withholding period to 27 to 31 July with Resolution 0692 of 2026. Others, such as Medellín or Bucaramanga, had no deadline that week and changed nothing.</p>
<h2>ICA: five cities, five sets of rules</h2>
<p>The industry and commerce tax is not collected by DIAN but by each municipality. This site only includes cities whose 2026 calendar resolution we could read from an official source: ${h.a('ica-bogota', 'Bogotá')}, ${h.a('ica-medellin', 'Medellín')}, ${h.a('ica-cali', 'Cali')}, ${h.a('ica-barranquilla', 'Barranquilla')} and ${h.a('ica-bucaramanga', 'Bucaramanga')}. Cartagena issued Decree 2289 of 2025, but the document could not be opened on the official site, so the city stays out until it can be read. In the calendar, choose your city and regime and the municipal dates join the national ones in the same list.</p>
<p>The differences are large. Bogotá splits two-month and annual filers by the previous year’s tax due and ignores the NIT. Medellín takes the annual return between 17 and 30 April by last digit and lets you pay until June. Cali has three income brackets with dates in March, April and May. Barranquilla asks for an annual return in February plus monthly or two-month withholding returns. Bucaramanga takes the annual return in March and the tax in three instalments.</p>
<h2>What about 2027?</h2>
<p>The 2027 national tax calendar is yet to be published. Decree 2229 of 2023 states that its business-day deadlines “remain in force from the 2024 tax calendar onwards”, so the rules stay the same unless a new decree changes them, but exact dates depend on that year’s holidays and on DIAN’s adjustments. That is why we do not project 2027 dates: when DIAN publishes its document at the end of the year, the tables are updated from it. The same goes for ICA, since each city issues its resolution in December.</p>
<h2>Payroll: the 2026 figures in one place</h2>
<p>The other half of the site serves anyone who pays or earns a salary in Colombia. The 2026 minimum wage is ${h.cop(h.P.nomina.smmlv)} (Decree 1469 of 2025) and the transport allowance ${h.cop(h.P.nomina.auxilio)} (Decree 1470 of 2025) for anyone earning up to two minimum wages. The calculators for ${h.a('liquidacion', 'final settlement')}, ${h.a('cesantias', 'severance and interest')}, ${h.a('prima', 'service bonus')}, ${h.a('vacaciones', 'paid holidays')} and ${h.a('recargos', 'overtime and premiums')} already apply the ${h.M.jornadaSemanal('2026-07-15')}-hour maximum week in force since 15 July 2026 (Law 2101 of 2021) and the ${h.pct(h.M.recargoDominical('2026-07-01'))} Sunday and holiday premium in force since 1 July (Law 2466 of 2025). The ${h.a('retencion', 'payroll withholding calculator')} uses the ${h.cop(h.P.uvt['2026'])} UVT set by DIAN Resolution 000238 of 2025.</p>
<h2>What this site does and does not do</h2>
<ul>
<li>It sorts official dates for your NIT and exports them to your calendar as an .ics file.</li>
<li>Every page quotes the decree or resolution behind each date, with the date we read it.</li>
<li>It does not file returns, compute penalties or replace the DIAN and city hall online services.</li>
<li>It does not store your NIT: everything runs in your browser and the share link only carries what is on your screen.</li>
</ul>
<p>If a date does not match the legal text, write to us from the contact page with your NIT ending and a link to the source; the fix applies to every page at once. How each table is built is explained in ${h.a('method', 'method and sources')}.</p>
`;
  },
});
