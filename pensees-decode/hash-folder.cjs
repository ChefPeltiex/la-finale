const fs = require('fs');
const crypto = require('crypto');
const path = process.argv[2] || 'C:\\Users\\CHEFP\\OneDrive\\Desktop\\Nouveau dossier';

const known = {
  '3eb18fc2b4c4d03ae26ad5b322492a28': 'page-01',
  '1f69605dd6122b92d0d283475cfc5dae': 'page-02',
  '652399857bdf503459fed8a337b01aae': 'page-03',
  '095a7e420e634763005dfe4acd5a0d9c': 'page-04',
  '5720740043ecb59b581e42585b073e88': 'page-05',
  '7b50c80de852e124d0f289224cb6a59e': 'page-06',
  '93f45f8c236c063535a738da0ab1e07f': 'page-07',
  '6c9ffe968cba00aeb353001eba028a50': 'page-08',
  '6301e9512eb2bb3a90969bbf3ebe3ffb': 'page-09',
  '90f5854a55ea774741b35b454eaec650': 'page-10',
  'ccc20b605756b4179a511b61f291a7e6': 'page-11',
};

const files = fs.readdirSync(path).filter((f) => /\.(jpe?g|jpg)$/i.test(f));
const byHash = new Map();
for (const f of files) {
  const buf = fs.readFileSync(`${path}\\${f}`);
  const h = crypto.createHash('md5').update(buf).digest('hex');
  if (!byHash.has(h)) byHash.set(h, []);
  byHash.get(h).push(f);
}

console.log('Dossier:', path);
console.log('Fichiers JPEG:', files.length);
console.log('Uniques (MD5):', byHash.size);

let newCount = 0;
for (const [h, list] of byHash) {
  const label = known[h] || 'NOUVEAU';
  if (!known[h]) newCount++;
  console.log(h.slice(0, 12), list.length > 1 ? ` (${list.length} copies)` : '', '->', label);
}

console.log('\nNouvelles pages (hors des 11 connues):', newCount);