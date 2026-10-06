import { chromium } from './node_modules/playwright/index.mjs';
const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
for (const path of ['/whats-next','/contact']) {
const page = await browser.newPage({viewport:{width:1440,height:900}});
await page.goto('http://127.0.0.1:4000' + path,{waitUntil:'networkidle'});
console.log(path, await page.locator('main').innerText());
console.log(await page.locator('main a').evaluateAll(anchors=>anchors.map(a=>({text:a.textContent, href:a.getAttribute('href'),disabled:a.getAttribute('aria-disabled')}))));
console.log(await page.evaluate(() => [...document.querySelectorAll('header,header > div,header nav, header button, #home, #home > .relative, #home h1, .home-chooser')].map(element=>({tag:element.tagName, cls:element.className,display:getComputedStyle(element).display,position:getComputedStyle(element).position,width:element.getBoundingClientRect().width, height:element.getBoundingClientRect().height}))));
await page.close();
}
await browser.close();
