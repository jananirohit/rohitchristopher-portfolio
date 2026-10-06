import { readFile } from 'node:fs/promises';
const html = await readFile('.logen/reference-portfolio/original.html', 'utf8');
console.log('BODY TAIL:', html.slice(-8500));
const bundle = await readFile('.logen/reference-portfolio/bundle-1.js', 'utf8');
console.log('BUNDLE TAIL:', bundle.slice(-5500));
console.log('TOOLS SECTION:', html.match(/<section\s+aria-label="Tools and technology"[\s\S]*?<\/section>/)?.[0]);
console.log('ABOUT SECTION:', html.match(/<section\b[^>]*id="about"[\s\S]*?<\/section>/)?.[0]);
