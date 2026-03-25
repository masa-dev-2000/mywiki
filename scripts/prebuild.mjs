import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'content');
const publicContentDir = path.join(root, 'public', 'content');

// Read catalog
const catalog = JSON.parse(fs.readFileSync(path.join(contentDir, 'catalog.json'), 'utf-8'));

// Ensure public/content exists
fs.mkdirSync(publicContentDir, { recursive: true });

let copied = 0;
for (const entry of catalog.entries) {
  const src = path.join(contentDir, entry.path);
  const dest = path.join(publicContentDir, entry.path);

  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Missing: ${src}`);
    continue;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  copied++;
}

console.log(`✅ Prebuild: ${copied}/${catalog.entries.length} HTML files copied to public/content/`);
