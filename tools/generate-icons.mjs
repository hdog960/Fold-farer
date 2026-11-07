/* Rasterize the original repo-owned FoldFarer SVG for iOS/Android icons.
   Run within GitHub Actions; requires sharp as an ephemeral dev dependency. */
import sharp from 'sharp';
import { readFileSync, statSync } from 'node:fs';

const source = readFileSync(new URL('../icon.svg', import.meta.url));
for (const [size, path] of [[180,'apple-touch-icon.png'],[192,'icon-192.png'],[512,'icon-512.png']]) {
  await sharp(source,{density:300}).resize(size,size).png({compressionLevel:9}).toFile(path);
  console.log('Generated',path,statSync(path).size,'bytes');
}
