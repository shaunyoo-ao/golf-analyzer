import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = resolve(__dirname, '../public/icon.svg');
const out = resolve(__dirname, '../public');

await sharp(src).resize(192, 192).png().toFile(`${out}/icon-192.png`);
await sharp(src).resize(512, 512).png().toFile(`${out}/icon-512.png`);
console.log('✓ icon-192.png, icon-512.png generated');
