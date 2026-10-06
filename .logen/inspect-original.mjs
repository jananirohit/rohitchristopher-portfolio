import { mkdir, writeFile } from 'node:fs/promises';
const origin = 'https://visual-clone-virtuoso.lovable.app';
const dir = '.logen/reference-portfolio';
await mkdir(dir, { recursive: true });
const response = await fetch(origin);
if (!response.ok) throw new Error(`Website returned ${response.status}`);
const html = await response.text();
await writeFile(`${dir}/original.html`, html);
console.log(html);
const sources = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(match => match[1]);
for (const [index, src] of sources.entries()) {
  const url = new URL(src, origin);
  const asset = await fetch(url);
  if (!asset.ok) throw new Error(`Script returned ${asset.status}: ${url}`);
  const text = await asset.text();
  await writeFile(`${dir}/bundle-${index}.js`, text);
  console.log(`Saved bundle-${index}.js (${text.length} characters) from ${url}`);
}
