const fs = require('fs');
const crypto = require('crypto');

const raw = fs.readFileSync(process.argv[2], 'utf8');
const m = raw.match(/data:image\/jpeg;base64,([A-Za-z0-9+/=]+)/);
if (!m) {
  console.error('No jpeg data URL in file');
  process.exit(1);
}
const buf = Buffer.from(m[1], 'base64');
const h = crypto.createHash('md5').update(buf).digest('hex');
console.log('bytes', buf.length, 'md5', h);
console.log('sig', buf.toString('base64').slice(600, 680));

const pagesDir = __dirname + '/pages';
const known = {
  '3eb18fc2b4c4d03ae26ad5b322492a28': 'page-01 microlearning/murs',
  '1f69605dd6122b92d0d283475cfc5dae': 'page-02 passion/panoramix',
  '652399857bdf503459fed8a337b01aae': 'page-03 message Bob',
  '095a7e420e634763005dfe4acd5a0d9c': 'page-04 Gémeaux/cassure',
  '5720740043ecb59b581e42585b073e88': 'page-05 imperfection/miroir',
  '7b50c80de852e124d0f289224cb6a59e': 'page-06 spiritual dualités',
  '93f45f8c236c063535a738da0ab1e07f': 'page-07 essence/carte',
  '6c9ffe968cba00aeb353001eba028a50': 'page-08 Père Noël',
  '6301e9512eb2bb3a90969bbf3ebe3ffb': 'page-09 diamant/Jedi',
  '90f5854a55ea774741b35b454eaec650': 'page-10 solitude/oiseau CirculAI',
  'ccc20b605756b4179a511b61f291a7e6': 'page-11 relativité existentielle',
};

if (known[h]) {
  console.log('DUPLICATE', known[h]);
} else {
  console.log('NEW (not in 11 archived pages)');
}

if (fs.existsSync(pagesDir)) {
  for (const f of fs.readdirSync(pagesDir)) {
    const b = fs.readFileSync(pagesDir + '/' + f);
    const eh = crypto.createHash('md5').update(b).digest('hex');
    if (eh === h) console.log('MATCH file', f);
  }
}
