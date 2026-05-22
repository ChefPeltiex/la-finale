const fs = require('fs');
const crypto = require('crypto');

const fp =
  'C:/Users/CHEFP/.cursor/projects/c-Users-CHEFP-OneDrive-Desktop-la-finale/agent-transcripts/c1517be3-db47-4e18-924e-f43d077595ef/c1517be3-db47-4e18-924e-f43d077595ef.jsonl';
const outDir = 'C:/Users/CHEFP/OneDrive/Desktop/la finale/pensees-decode/pages';
fs.mkdirSync(outDir, { recursive: true });

const lines = fs.readFileSync(fp, 'utf8').split(/\r?\n/).filter(Boolean);
const seen = new Map();
let n = 0;

for (const line of lines) {
  try {
    const o = JSON.parse(line);
    if (o.role !== 'user') continue;
    const t = (o.message?.content || []).find((x) => x.type === 'text')?.text || '';
    const m = t.match(/data:image\/jpeg;base64,([A-Za-z0-9+/=]+)/);
    if (!m) continue;
    const buf = Buffer.from(m[1], 'base64');
    const h = crypto.createHash('md5').update(buf).digest('hex');
    if (seen.has(h)) continue;
    seen.set(h, true);
    n++;
    fs.writeFileSync(`${outDir}/page-${String(n).padStart(2, '0')}-${h.slice(0, 8)}.jpeg`, buf);
  } catch (_) {}
}
console.log('Exported', n, 'unique pages to', outDir);
