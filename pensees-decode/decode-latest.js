const fs = require('fs');
const crypto = require('crypto');

const fp =
  'C:/Users/CHEFP/.cursor/projects/c-Users-CHEFP-OneDrive-Desktop-la-finale/agent-transcripts/c1517be3-db47-4e18-924e-f43d077595ef/c1517be3-db47-4e18-924e-f43d077595ef.jsonl';
const outDir = 'C:/Users/CHEFP/OneDrive/Desktop/la finale/pensees-decode';

const lines = fs.readFileSync(fp, 'utf8').split(/\r?\n/).filter(Boolean);
let last = '';
for (const line of lines) {
  try {
    const o = JSON.parse(line);
    if (o.role !== 'user') continue;
    const t = (o.message?.content || []).find((x) => x.type === 'text')?.text || '';
    const m = t.match(/data:image\/jpeg;base64,([A-Za-z0-9+/=]+)/);
    if (m) last = m[1];
  } catch (_) {}
}

if (!last) {
  console.log('NO_IMAGE');
  process.exit(1);
}

const buf = Buffer.from(last, 'utf8');
const h = crypto.createHash('md5').update(buf).digest('hex');
const b64h = crypto.createHash('md5').update(last).digest('hex').slice(0, 12);

const existing = fs.readdirSync(outDir).filter((f) => f.endsWith('.jpeg'));
let dup = null;
for (const f of existing) {
  const b = fs.readFileSync(`${outDir}/${f}`);
  if (crypto.createHash('md5').update(b).digest('hex') === h) dup = f;
}

let file;
if (dup) {
  file = dup;
  console.log('DUPLICATE', dup, 'bytes', buf.length, 'md5', h);
} else {
  const nums = existing
    .map((f) => /^page-(\d+)\.jpeg$/.exec(f))
    .filter(Boolean)
    .map((m) => parseInt(m[1], 10));
  const n = (nums.length ? Math.max(...nums) : 0) + 1;
  file = `${outDir}/page-${String(n).padStart(2, '0')}.jpeg`;
  fs.writeFileSync(file, buf);
  console.log('NEW', file, 'bytes', buf.length, 'md5', h, 'b64id', b64h);
}
