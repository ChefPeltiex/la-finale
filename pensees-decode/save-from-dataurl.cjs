const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const src = process.argv[2];
if (!src) {
  console.error('Usage: node save-from-dataurl.cjs <file-with-data-url-or-b64>');
  process.exit(1);
}

const outDir = __dirname;
const raw = fs.readFileSync(src, 'utf8').trim();
const b64 = raw.replace(/^data:image\/\w+;base64,/, '').replace(/\s/g, '');
const buf = Buffer.from(b64, 'base64');
if (!buf.length) {
  console.error('Empty or invalid base64');
  process.exit(1);
}

const h = crypto.createHash('md5').update(buf).digest('hex');
const existing = fs.readdirSync(outDir).filter((f) => /\.(jpe?g|jpg)$/i.test(f));
for (const f of existing) {
  const b = fs.readFileSync(path.join(outDir, f));
  if (crypto.createHash('md5').update(b).digest('hex') === h) {
    console.log('DUPLICATE', f, 'md5', h, 'bytes', buf.length);
    process.exit(0);
  }
}

const nums = existing
  .map((f) => /^page-(\d+)\.jpeg$/i.exec(f))
  .filter(Boolean)
  .map((m) => parseInt(m[1], 10));
const n = (nums.length ? Math.max(...nums) : 0) + 1;
const out = path.join(outDir, `page-${String(n).padStart(2, '0')}.jpeg`);
fs.writeFileSync(out, buf);
console.log('NEW', out, 'md5', h, 'bytes', buf.length);
