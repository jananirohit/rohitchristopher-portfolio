import { chromium } from './node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
const report = [];
const errors = [];
const assert = (condition, message) => { report.push({ passed: Boolean(condition), message }); if (!condition) errors.push(message); };
await mkdir('.logen/qa/screenshots', { recursive: true });
const destinations = [['/','home'],['/about','about'],['/journey','journey'],['/impact','impact'],['/expertise','expertise'],['/projects','projects'],['/experience','experience'],['/whats-next','next'],['/contact','contact']];
for (const width of [1440, 1024, 768, 390, 320]) {
 const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
 const jsErrors = [];
 page.on('pageerror', error => jsErrors.push(error.message));
 await page.goto('http://127.0.0.1:4000', { waitUntil: 'networkidle' });
 await page.waitForSelector('.home-chooser');
 assert(await page.locator('main section[id]').count() === 1, `Home is not a long document at ${width}px`);
 assert(await page.locator('.portrait-mask, .hero-portrait, .hero-visual, img, [aria-label*="Portrait"]').count() === 0, `No portrait, placeholder or image at ${width}px`);
 assert(await page.locator('.discovery-grid a').count() === 8, `Eight exploration destinations at ${width}px`);
 const clipped = await page.evaluate(() => {
  const ranges = [...document.querySelectorAll('#home h1 span')].map(span => { const range = document.createRange(); range.selectNodeContents(span); return range.getBoundingClientRect(); });
  return ranges.some(r => r.right > window.innerWidth + 1 || r.left < -1);
 });
 assert(!clipped, `Home name fits at ${width}px`);
 await page.screenshot({ path: `.logen/qa/screenshots/home-${width}.png`, fullPage: true });
 const go = async path => {
  if (width <= 1100) {
   await page.getByRole('button', { name: 'Open navigation' }).click();
  }
  await page.locator(`header nav a[href="${path}"]`).click();
  await page.waitForURL(`**${path}`);
  await page.waitForTimeout(60);
 };
 for (const [path, id] of destinations) {
  if (path !== '/') await go(path);
  assert(new URL(page.url()).pathname === path, `Real URL ${path} at ${width}px`);
  assert(await page.locator(`main #${id}`).count() === 1, `Destination ${id} renders at ${width}px`);
  const sections = await page.locator('main section[id]').count();
  assert(sections === (id === 'expertise' ? 2 : 1), `Only chosen chapter mounted for ${id} at ${width}px`);
  assert(await page.locator(`header nav a[href="${path}"]`).getAttribute('aria-current') === 'page', `Active page ${id} at ${width}px`);
  assert(await page.locator('main h1').count() === 1, `Semantic heading for ${id} at ${width}px`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  assert(!overflow, `No horizontal overflow for ${id} at ${width}px`);
  if (width <= 1100) assert(await page.locator('header button').getAttribute('aria-expanded') === 'false', `Mobile menu closes for ${id} at ${width}px`);
  if (id === 'journey') {
   const milestone = page.locator('#journey button').first();
   await milestone.scrollIntoViewIfNeeded(); await milestone.focus(); await page.keyboard.press('Enter');
   assert(await milestone.getAttribute('aria-expanded') === 'true', `Keyboard milestone opens at ${width}px`);
   const panel = await milestone.getAttribute('aria-controls');
   assert(await page.locator(`#${panel}`).isVisible(), `Milestone description retained at ${width}px`);
   await page.keyboard.press('Enter');
   assert(!(await page.locator(`#${panel}`).isVisible()), `Milestone closes at ${width}px`);
   assert(await page.locator('.timeline-continuation').getAttribute('href') === '/whats-next', `Timeline connects next chapter at ${width}px`);
  }
  if (id === 'impact') {
   const values = await page.locator('#impact .font-display').allTextContents();
   assert(JSON.stringify(values) === JSON.stringify(['8+','5','<1%']), `Verified metrics at ${width}px`);
  }
  if (id === 'expertise') {
   assert(await page.locator('#expertise .expertise-card').count() === 6, `Six expertise areas at ${width}px`);
   assert(await page.locator('#tools .technology-pill').count() === 10, `Ten technology tools at ${width}px`);
  }
  if (id === 'projects') {
   for (const button of await page.locator('#projects button').all()) {
    await button.click(); const panel = await button.getAttribute('aria-controls');
    assert(await page.locator(`#${panel}`).isVisible(), `Case study opens at ${width}px`);
    const body = await page.locator(`#${panel}`).innerText();
    assert(/challenge/i.test(body) && /approach/i.test(body) && /impact/i.test(body), `Original full case study at ${width}px`);
    await button.click();
   }
  }
  if (id === 'experience') {
   const entry = page.locator('#experience button').last(); await entry.click();
   assert(await entry.getAttribute('aria-expanded') === 'true', `Experience expands at ${width}px`);
   assert(!(await page.locator('#experience').innerText()).includes('— Now'), `2025 experience not presented as current role at ${width}px`);
  }
  if (id === 'next') {
   const body = await page.locator('#next').innerText();
   assert(/2026 → present/i.test(body) && body.includes('Some things are better revealed'), `Undisclosed chapter preserved at ${width}px`);
  }
  if (id === 'contact') {
   assert(await page.locator('#contact a[aria-disabled="true"]').count() === 3, `Missing contact details are honest at ${width}px`);
  }
 }
 await page.goBack();
 assert(new URL(page.url()).pathname === '/whats-next', `Browser back returns previous destination at ${width}px`);
 await page.goForward();
 assert(new URL(page.url()).pathname === '/contact', `Browser forward works at ${width}px`);
 await page.reload({ waitUntil: 'networkidle' });
 assert(await page.locator('main #contact').count() === 1, `Direct route reload works at ${width}px`);
 if (width <= 1100) {
  const menu = page.getByRole('button', {name:'Open navigation'}); await menu.click(); await page.keyboard.press('Escape');
  assert(await menu.getAttribute('aria-expanded') === 'false', `Escape closes navigation at ${width}px`);
 }
 assert(jsErrors.length === 0, `No browser errors at ${width}px: ${jsErrors.join(',')}`);
 await page.close();
}
const motionPage = await browser.newPage({ viewport: {width:1440,height:900}, reducedMotion:'no-preference' });
await motionPage.goto('http://127.0.0.1:4000', {waitUntil:'networkidle'});
const animation = await motionPage.locator('#home > .hero-mesh').evaluate(element => getComputedStyle(element).animationName);
assert(animation === 'atmosphere', 'Animated gradient retained with normal motion');
await motionPage.emulateMedia({reducedMotion:'reduce'});
assert(await motionPage.locator('#home > .hero-mesh').evaluate(element => getComputedStyle(element).animationName) === 'none', 'Live reduced-motion preference disables motion');
await browser.close();
await writeFile('.logen/qa/results.json', JSON.stringify({report, errors},null,2));
console.log(`${report.filter(item=>item.passed).length}/${report.length} checks passed`);
if (errors.length) throw new Error(errors.join('\n'));
