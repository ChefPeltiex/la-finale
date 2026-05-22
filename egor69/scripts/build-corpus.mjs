// build-corpus.mjs — génère public/crystals.json depuis les corpus memories
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const MEM = resolve('C:\\Users\\CHEFP\\.verdent\\workspace\\749726656195067904\\memories')

function readJSON(path) {
  const raw = readFileSync(path, 'utf-8').replace(/^\uFEFF/, '') // strip BOM
  return JSON.parse(raw)
}

// ── strip {\\displaystyle ...} wrapper from raw MediaWiki LaTeX ──────────────
function cleanLatex(raw) {
  if (!raw) return undefined
  let s = raw.trim()
  // unwrap \displaystyle
  s = s.replace(/^\{\\displaystyle\s*/, '').replace(/\}$/, '').trim()
  // skip trivial single-char formulas (not useful)
  if (s.length < 4) return undefined
  return s
}

// ── summary trimmer ──────────────────────────────────────────────────────────
function trim(s, max = 220) {
  if (!s) return ''
  const clean = s.replace(/\n+/g, ' ').trim()
  return clean.length > max ? clean.slice(0, max - 1) + '…' : clean
}

const crystals = []
let id = 1

// ── 1. ÉQUATIONS (110 entrées) ───────────────────────────────────────────────
const equations = readJSON(join(MEM, 'wiki-equations-index.json'))
for (const eq of equations) {
  const formula = cleanLatex(eq.formula)
  crystals.push({
    id: id++,
    titre: eq.title,
    definition: trim(eq.summary),
    formule: formula,
    source: 'equations',
    discipline: eq.category || 'Mathématiques',
    url: eq.url,
  })
}

// ── 2. LOT CULTUREL (254 entrées) ────────────────────────────────────────────
const culturel = readJSON(join(MEM, 'lot-culturel-index.json'))
for (const c of culturel) {
  // skip entries with trivial summaries
  const def = trim(c.summary)
  if (!def || def.length < 15) continue
  crystals.push({
    id: id++,
    titre: c.title,
    definition: def,
    formule: undefined,
    source: 'culturel',
    discipline: c.category || 'Loisirs & Culture',
    url: c.url,
  })
}

// ── 3. MUSIQUE (130 articles) ─────────────────────────────────────────────────
const musiqueData = readJSON(join(MEM, 'musique-corpus.json'))
const articles = musiqueData.articles || []
for (const a of articles) {
  const def = trim(a.definition || a.summary || '')
  if (!def || def.length < 15) continue
  crystals.push({
    id: id++,
    titre: a.titre || a.title,
    definition: def,
    formule: undefined,
    source: 'musique',
    discipline: a.categorie_dominic || a.categorie || 'Musique',
    url: a.url,
    maitre: a.compositeur || undefined,
  })
}

// ── 4. DISCIPLINES (150 entrées) ──────────────────────────────────────────────
const disciplines = readJSON(join(MEM, 'disciplines-index.json'))
for (const d of disciplines) {
  const def = trim(d.summary || d.definition || d.description || '')
  if (!def || def.length < 10) continue
  crystals.push({
    id: id++,
    titre: d.title || d.titre || d.slug,
    definition: def,
    formule: undefined,
    source: 'discipline',
    discipline: d.category || d.discipline || 'Sciences',
    url: d.url || `https://fr.wikipedia.org/wiki/${encodeURIComponent(d.slug || d.title)}`,
  })
}

// ── OUTPUT ────────────────────────────────────────────────────────────────────
mkdirSync(join(ROOT, 'public'), { recursive: true })
const outPath = join(ROOT, 'public', 'crystals.json')
writeFileSync(outPath, JSON.stringify(crystals, null, 0), 'utf-8')
console.log(`✓ crystals.json généré : ${crystals.length} cristaux → ${outPath}`)
