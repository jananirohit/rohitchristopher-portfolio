import { readFile } from 'node:fs/promises';
const html = await readFile('.logen/reference-portfolio/original.html', 'utf8');
console.log('BODY START:', html.slice(html.indexOf('<body'), html.indexOf('<body') + 5500));
for (const id of ['home', 'expertise', 'projects', 'experience', 'next']) {
 const section = html.match(new RegExp(`<section\\b[^>]*id="${id}"[\\s\\S]*?<\\/section>`))?.[0] || '';
 const body = id === 'home' ? section.slice(section.indexOf('8+')) : id === 'next' ? section : (section.match(/<button\b[\s\S]*?<\/button>/)?.[0] || section);
 console.log(`SECTION ${id}:`, body);
}
console.log('BUNDLE LAST:', (await readFile('.logen/reference-portfolio/bundle-1.js','utf8')).slice(-1700));
