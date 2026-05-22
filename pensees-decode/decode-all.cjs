const fs = require('fs');
const crypto = require('crypto');

const fp =
  'C:/Users/CHEFP/.cursor/projects/c-Users-CHEFP-OneDrive-Desktop-la-finale/agent-transcripts/c1517be3-db47-4e18-924e-f43d077595ef/c1517be3-db47-4e18-924e-f43d077595ef.jsonl';
const outDir = 'C:/Users/CHEFP/OneDrive/Desktop/la finale/pensees-decode';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const lines = fs.readFileSync(fp, 'utf8').split(/\r?\n/).filter(Boolean);
const hashes = new Map();
let last = null;
let lastLine = 0;

for (let i = 0; i < lines.length; i++) {
  try {
    const o = JSON.parse(lines[i]);
    if (o.role !== 'user') continue;
    const t = (o.message?.content || []).find((x) => x.type === 'text')?.text || '';
    const m = t.match(/data:image\/jpeg;base64,([A-Za-z0-9+/=]+)/);
    if (m) {
      const buf = Buffer.from(m[1], 'base64');
      const h = crypto.createHash('md5').update(buf).digest('hex');
      if (!hashes.has(h)) hashes.set(h, { bytes: buf.length, count: 0 });
      hashes.get(h).count++;
      last = { buf, h, line: i + 1 };
      lastLine = i + 1;
    }
  } catch (_) {}
}

console.log('Unique images:', hashes.size);
for (const [h, info] of hashes) {
  console.log(`  md5=${h} bytes=${info.bytes} occurrences=${info.count}`);
}
console.log('Last image at line', lastLine, 'md5', last?.h);

if (last) {
  const known = 'ccc20b605756b4179a511b61f291a7e6';
  const name = last.h === known ? 'duplicate-relativite.jpeg' : `page-new-${last.h.slice(0, 8)}.jpeg`;
  const file = `${outDir}/${name}`;
  fs.writeFileSync(file, last.buf);
  console.log('Wrote', file);
}
