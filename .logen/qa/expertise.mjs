import { chromium } from './node_modules/playwright/index.mjs';
import { readFile, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({headless:true, executablePath:'/usr/bin/chromium', args:['--no-sandbox']});
const checks = [], errors = [];
const assert = (passed, message) => { checks.push({passed:Boolean(passed), message}); if (!passed) errors.push(message); };
const source = await readFile('frontend/src/components/Expertise.tsx','utf8');
const capabilities = [...source.matchAll(/capabilities: \[([^\]]+)\]/g)].map(match=>[...match[1].matchAll(/'([^']+)'/g)].map(m=>m[1]));
const labels = ['PEOPLE','OPERATIONS','PROCESS','QUALITY','DATA','AI & TRANSFORMATION'];
const titles = ['PEOPLE & LEADERSHIP','OPERATIONS','PROCESS EXCELLENCE','QUALITY & COMPLIANCE','DATA & ANALYTICS','AI, AUTOMATION & DIGITAL TRANSFORMATION'];
const tools = ['Power BI','Microsoft Lists','SharePoint','Power Automate','Excel','Salesforce','Redshift','Microsoft Teams','Generative AI','AI Productivity Tools','Cloud Platforms','Cloud-based Business Applications'];
for (const width of [1440,1024,768,390,320]) {
 const page = await browser.newPage({viewport:{width,height:900}, reducedMotion:'reduce'});
 const runtimeErrors = [];
 page.on('pageerror', e=>runtimeErrors.push(e.message));
 const warnings=[]; page.on('console',m=>{if(m.type()==='error'||m.type()==='warning') warnings.push(m.text());});
 await page.goto('http://127.0.0.1:4000/expertise',{waitUntil:'networkidle'});
 await page.waitForSelector('.expertise-card');
 assert(await page.locator('main h1').innerText()==='EXPERTISE', `Correct heading ${width}`);
 assert(await page.getByText('Where people, process, technology and performance come together.', {exact:true}).isVisible(), `Exact support line ${width}`);
 assert(await page.locator('.expertise-card').count()===6, `Six capability cards ${width}`);
 assert(await page.locator('.technology-pill').count()===12, `Separate twelve technology tools ${width}`);
 assert(await page.locator('.expertise-capabilities:visible').count()===0, `Details hidden until requested ${width}`);
 assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1), `No page overflow ${width}`);
 for (let i=0;i<labels.length;i++) {
   const trigger=page.getByRole('button',{name:`Explore ${labels[i]} capabilities`,exact:true});
   await trigger.scrollIntoViewIfNeeded(); await trigger.focus(); await page.keyboard.press(i%2?'Space':'Enter');
   const dialog=page.getByRole('dialog'); await dialog.waitFor();
   assert(await dialog.getByRole('heading',{name:titles[i],exact:true}).isVisible(), `Correct ${labels[i]} detail title ${width}`);
   assert(JSON.stringify(await dialog.locator('li span').allTextContents())===JSON.stringify(capabilities[i]), `All supplied ${labels[i]} capabilities exact ${width}`);
   assert(await dialog.locator('li').count()===(i===5?7:6), `Complete ${labels[i]} list ${width}`);
   assert(await page.evaluate(()=>Boolean(document.activeElement?.closest('[role="dialog"]'))), `Focus enters ${labels[i]} ${width}`);
   for(let n=0;n<4;n++) await page.keyboard.press('Tab');
   assert(await page.evaluate(()=>Boolean(document.activeElement?.closest('[role="dialog"]'))), `Focus trapped ${labels[i]} ${width}`);
   assert(!await dialog.evaluate(el=>el.getBoundingClientRect().left<0||el.getBoundingClientRect().right>innerWidth), `Dialog fits ${labels[i]} ${width}`);
   if(i===5) assert((await dialog.innerText()).includes('not specialist AI engineering'), `AI credibility disclaimer ${width}`);
   await page.keyboard.press('Escape'); await dialog.waitFor({state:'hidden'});
   assert(await trigger.evaluate(el=>document.activeElement===el), `Focus restored ${labels[i]} ${width}`);
 }
 for(const tool of tools) {
   const trigger=page.getByRole('button',{name:tool,exact:true});
   await trigger.click(); const dialog=page.getByRole('dialog'); await dialog.waitFor();
   assert(await dialog.getByRole('heading',{name:tool,exact:true}).isVisible(), `Tool detail ${tool} ${width}`);
   assert((await dialog.innerText()).includes('not a claim of specialist engineering expertise'), `Tool credibility ${tool} ${width}`);
   await dialog.getByRole('button',{name:'Back to tools & technology'}).click(); await dialog.waitFor({state:'hidden'});
   assert(await trigger.evaluate(el=>document.activeElement===el), `Tool focus returns ${tool} ${width}`);
 }
 assert(await page.locator('#expertise').innerText().then(t=>!/%|stars|certified|architect/i.test(t)), `No invented ratings or credentials ${width}`);
 assert(runtimeErrors.length===0, `No runtime errors ${width}: ${runtimeErrors.join(',')}`);
 assert(warnings.length===0, `No accessibility console warnings ${width}: ${warnings.join(',')}`);
 await page.screenshot({path:`.logen/qa/screenshots/expertise-${width}.png`,fullPage:true});
 await page.close();
}
const motion = await browser.newPage({viewport:{width:1440,height:900}});
await motion.goto('http://127.0.0.1:4000/expertise',{waitUntil:'networkidle'});
await motion.getByRole('button',{name:'Explore PEOPLE capabilities'}).click();
await motion.emulateMedia({reducedMotion:'reduce'});
assert(await motion.getByRole('dialog').evaluate(el=>getComputedStyle(el).animationName==='none'), 'Dialog respects reduced motion');
await browser.close();
await writeFile('.logen/qa/expertise-results.json', JSON.stringify({checks,errors},null,2));
console.log(`${checks.filter(c=>c.passed).length}/${checks.length} expertise checks passed`);
if(errors.length) throw new Error(errors.join('\n'));
