import { chromium } from './node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const report = [];
const errors = [];
const assert = (condition, message) => { report.push({ passed: Boolean(condition), message }); if (!condition) errors.push(message); };
await mkdir('.logen/qa/screenshots', { recursive: true });
for (const width of [1440, 1024, 768, 390, 320]) {
 const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
 const jsErrors = [];
 page.on('pageerror', error => jsErrors.push(error.message));
 await page.goto('http://127.0.0.1:4000', { waitUntil: 'networkidle' });
 await page.waitForSelector('.hero-sculpture');
 await page.screenshot({ path: `.logen/qa/screenshots/portfolio-${width}.png`, fullPage: true });
 const geometry = await page.evaluate(() => {
  const h1 = document.querySelector('#home h1');
  const h1Rect = h1.getBoundingClientRect();
  const ranges = [...h1.querySelectorAll('span')].map(span => {
   const range = document.createRange(); range.selectNodeContents(span); return range.getBoundingClientRect();
  });
  const clipped = ranges.some(r => r.right > window.innerWidth + 1 || r.left < -1);
  return {
   width: window.innerWidth,
   pageWidth: document.documentElement.scrollWidth,
   nameClipped: clipped,
   headerBottom: document.querySelector('header').getBoundingClientRect().bottom,
   heroTitleTop: h1Rect.top,
   sections: document.querySelectorAll('main section').length,
   tools: [...document.querySelectorAll('#tools .animate-marquee span')].map(x=>x.textContent),
   metrics: [...document.querySelectorAll('#impact .font-display')].map(x=>x.textContent),
   invalidLinks: [...document.querySelectorAll('a[href]')].filter(a => ['#','mailto:hello@example.com','https://www.linkedin.com/'].includes(a.getAttribute('href'))).length,
   motion: getComputedStyle(document.querySelector('#home > .hero-mesh')).animationName,
  };
 });
 console.log(width, JSON.stringify(geometry));
 assert(geometry.pageWidth <= width + 1, `No horizontal overflow at ${width}px`);
 assert(!geometry.nameClipped, `Name fits at ${width}px`);
 assert(geometry.headerBottom < geometry.heroTitleTop, `Navigation does not cover name at ${width}px`);
 assert(geometry.sections === 10, `All ten original sections retained at ${width}px`);
 assert(geometry.tools.length === 8, `All eight tools visible once at ${width}px`);
 assert(JSON.stringify(geometry.metrics) === JSON.stringify(['8+','5','<1%']), `Verified metrics display at ${width}px`);
 assert(geometry.invalidLinks === 0, `No fake personal links at ${width}px`);
 assert(geometry.motion === 'none', `Reduced motion disables atmosphere at ${width}px`);
 if (width < 1101) {
  const menu = page.getByRole('button', {name:'Open navigation'});
  await menu.click();
  assert(await menu.getAttribute('aria-expanded') === 'true', `Mobile menu opens at ${width}px`);
  await page.keyboard.press('Escape');
  assert(await menu.getAttribute('aria-expanded') === 'false', `Escape closes mobile menu at ${width}px`);
  await menu.click();
  await page.locator('header nav a[href="#journey"]').click();
  assert(await menu.getAttribute('aria-expanded') === 'false', `Navigation closes menu at ${width}px`);
 }
 const milestone = page.locator('#journey button').first();
 await milestone.scrollIntoViewIfNeeded();
 await milestone.focus();
 await page.keyboard.press('Enter');
 assert(await milestone.getAttribute('aria-expanded') === 'true', `Keyboard opens milestone at ${width}px`);
 const panelId = await milestone.getAttribute('aria-controls');
 assert(await page.locator(`#${panelId}`).isVisible(), `Milestone description shown at ${width}px`);
 await page.keyboard.press('Enter');
 assert(!(await page.locator(`#${panelId}`).isVisible()), `Milestone closes at ${width}px`);
 for (const button of await page.locator('#projects button').all()) {
  await button.click();
  const id = await button.getAttribute('aria-controls');
  assert(await page.locator(`#${id}`).isVisible(), `Case study opens at ${width}px`);
  const body = await page.locator(`#${id}`).innerText();
  assert(/challenge/i.test(body) && /approach/i.test(body) && /impact/i.test(body), `Complete case study retained at ${width}px`);
  await button.click();
 }
 const experience = page.locator('#experience button').last();
 await experience.click();
 assert(await experience.getAttribute('aria-expanded') === 'true', `Experience entry opens at ${width}px`);
 await page.locator('#contact h2').scrollIntoViewIfNeeded();
 await page.waitForTimeout(250);
 assert(await page.locator('header nav a[href="#contact"]').getAttribute('aria-current') === 'location', `Scroll updates active section at ${width}px`);
 assert(jsErrors.length === 0, `No browser errors at ${width}px: ${jsErrors.join(',')}`);
 await page.close();
}
await browser.close();
await writeFile('.logen/qa/results.json', JSON.stringify({ report, errors }, null, 2));
console.log(`${report.filter(item => item.passed).length}/${report.length} checks passed`);
if (errors.length) throw new Error(errors.join('\n'));
