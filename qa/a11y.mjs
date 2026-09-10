import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--disable-background-networking'] });
const BASE = process.env.QA_BASE ?? 'http://localhost:3100';
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.route('**', r => r.request().url().startsWith('http://localhost') ? r.continue() : r.abort());
const out = [];
for (const path of ['/en','/en/contact','/en/start','/de/start','/en/start/call','/de/start/call','/en/packages','/en/services','/en/services/seo','/en/about','/en/insights','/en/legal','/en/legal/imprint','/en/legal/terms','/de']) {
  await p.goto(BASE+path, { waitUntil: 'load' });
  await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const issues = [];
    // images need alt
    document.querySelectorAll('img:not([alt])').forEach(() => issues.push('img without alt'));
    // form controls need a label
    document.querySelectorAll('input:not([type=hidden]), select, textarea').forEach(el => {
      const id = el.id;
      const labelled = (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.closest('label');
      if (!labelled) issues.push('unlabelled control: ' + (el.name || el.tagName));
    });
    // buttons/links need an accessible name
    document.querySelectorAll('a[href], button').forEach(el => {
      const name = (el.textContent || '').trim() || el.getAttribute('aria-label') || el.querySelector('[class*=sr-only]')?.textContent;
      if (!name) issues.push('nameless ' + el.tagName + ' ' + String(el.className).slice(0,30));
    });
    // heading order
    const hs = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => +h.tagName[1]);
    let prev = hs[0];
    for (const h of hs.slice(1)) { if (h > prev + 1) issues.push(`heading jump h${prev}→h${h}`); prev = h; }
    return issues;
  });
  out.push(`${path}: ${r.length ? r.slice(0,5).join(' | ') : 'clean'}`);
}
process.exitCode = out.some((line) => !line.endsWith(': clean')) ? 1 : 0;
console.log(out.join('\n'));
await b.close();
