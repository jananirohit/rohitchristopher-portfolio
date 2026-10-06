import { readFile } from 'node:fs/promises';
const html = await readFile('frontend/src/portfolio.original.html', 'utf8');
const tools = html.match(/<section\s+aria-label="Tools and technology"[\s\S]*?<\/section>/)?.[0] || '';
console.log('TOOLS MARKUP:', tools);
const sectionIds = [...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map(x => x[1]);
console.log('ORIGINAL SECTIONS:', sectionIds);
console.log('Total expandable buttons:', [...html.matchAll(/aria-expanded/g)].length);
console.log('Original case studies:', ['Process Standardisation','Quality Transformation','Operational Reporting','Team Development'].every(name => html.includes(name)));
