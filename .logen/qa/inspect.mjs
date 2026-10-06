import { chromium } from './node_modules/playwright/index.mjs';
const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
for (const width of [1440,1024,768,390,320]) {
const page = await browser.newPage({viewport:{width,height:900}});
await page.goto('http://127.0.0.1:4000',{waitUntil:'networkidle'});
if (width <= 1100) await page.getByRole('button',{name:'Open navigation'}).click();
console.log('WIDTH',width,await page.locator('header button').getAttribute('aria-controls'),await page.locator('header button').getAttribute('aria-expanded'),await page.locator('.hero-footnote').count());
console.log(await page.evaluate(() => [...document.querySelectorAll('header,header > div,header nav, header button, #home, #home > .relative, #home h1, .home-chooser')].map(element=>({tag:element.tagName, cls:element.className,display:getComputedStyle(element).display,position:getComputedStyle(element).position,width:element.getBoundingClientRect().width, height:element.getBoundingClientRect().height}))));
await page.close();
}
await browser.close();
