const fs = require('fs');
const crypto = require('crypto');

const fp =
  'C:/Users/CHEFP/.cursor/projects/c-Users-CHEFP-OneDrive-Desktop-la-finale/agent-transcripts/c1517be3-db47-4e18-924e-f43d077595ef/c1517be3-db47-4e18-924e-f43d077595ef.jsonl';
const lineNo = parseInt(process.argv[2] || '195', 10);
const lines = fs.readFileSync(fp, 'utf8').split(/\r?\n/).filter(Boolean);
const o = JSON.parse(lines[lineNo - 1]);
const t = (o.message?.content || []).find((x) => x.type === 'text')?.text || '';
const m = t.match(/data:image\/jpeg;base64,([A-Za-z0-9+/=]+)/);
if (!m) {
  console.log('No image on line', lineNo);
  process.exit(1);
}
const buf = Buffer.from(m[1], 'base64');
const h = crypto.createHash('md5').update(buf).digest('hex');
const sig = buf.toString('base64').slice(600, 720);
console.log('line', lineNo, 'bytes', buf.length, 'md5', h);
console.log('sig', sig);

const pagesDir = __dirname + '/pages';
if (fs.existsSync(pagesDir)) {
  for (const f of fs.readdirSync(pagesDir)) {
    const b = fs.readFileSync(pagesDir + '/' + f);
    const eh = crypto.createHash('md5').update(b).digest('hex');
    if (eh === h) console.log('MATCH', f);
  }
}
