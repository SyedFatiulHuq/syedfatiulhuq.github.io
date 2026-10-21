import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (file: string) => readFileSync(join(process.cwd(), 'content', file), 'utf8');
const lines = (file: string) =>
  read(file).split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const rows = (file: string, n: number) =>
  lines(file).map((l) => {
    const p = l.split('|').map((s) => s.trim());
    while (p.length < n) p.push('');
    return p;
  });

export const paragraphs = (file: string) =>
  read(file).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
export const text = (file: string) => read(file).trim();
export const list = lines;

export const education = () =>
  rows('education.txt', 4).map(([degree, school, detail, advisor]) => ({ degree, school, detail, advisor }));
export const threads = () =>
  rows('research-threads.txt', 2).map(([title, text]) => ({ title, text }));
export const teaching = () =>
  rows('teaching.txt', 4).map(([period, role, place, detail]) => ({ period, role, place, detail }));
export const yearItems = (file: string) =>
  rows(file, 2).map(([year, text]) => ({ year, text }));

export const publications = () => {
  const groups: { group: string; items: Record<string, string>[] }[] = [];
  for (const line of lines('publications.txt')) {
    const m = line.match(/^\[(.+)\]$/);
    if (m) { groups.push({ group: m[1], items: [] }); continue; }
    const featured = line.startsWith('*');
    const [authors, title, venue, note, link] = (featured ? line.slice(1) : line)
      .split('|').map((s) => s.trim());
    groups.at(-1)?.items.push({
      authors, title, venue, note: note ?? '', link: link ?? '', featured: featured ? 'yes' : '',
    });
  }
  return groups;
};
