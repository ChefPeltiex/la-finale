const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const src = process.argv[2];
if (!src) {
  console.error('Usage: node decode-file.cjs <image.jpg|image.b64>');
  process.exit(1);
}

const outDir = path.join(__dirname);
let buf;
const raw = fs.readFileSync(src, 'utf8').trim();
if (raw.startsWith('data:image') || /^[A-Za-z0-9+/=\s]+$/.test(raw.slice(0, 80))) {
  const b64 = raw.replace(/^data:image\/\w+;base64,/, '').replace(/\s/g, '');
  buf = Buffer.from(b64, 'base64');
} else {
  buf = fs.readFileSync(src);
}

const h = crypto.createHash('md5').update(buf).digest('hex');
const existing = fs.readdirSync(outDir).filter((f) => f.endsWith('.jpeg') || f.endsWith('.jpg'));
for (const f of existing) {
  const b = fs.readFileSync(path.join(outDir, f));
  if (crypto.createHash('md5').update(b).digest('hex') === h) {
    console.log('DUPLICATE', f, 'md5', h, 'bytes', buf.length);
    process.exit(0);
  }
}

const nums = existing
  .map((f) => /^page-(\d+)\.jpeg$/.exec(f))
  .filter(Boolean)
  .map((m) => parseInt(m[1], 10));
const n = (nums.length ? Math.max(...nums) : 0) + 1;
const out = path.join(outDir, `page-${String(n).padStart(2, '0')}.jpeg`);
fs.writeFileSync(out, buf);
console.log('NEW', out, 'md5', h, 'bytes', buf.length);
