/**
 * Vérifications légères du content-reservoir (stub automation).
 * Sort toujours avec le code 0 pour l’instant.
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PELTIEZ_ROOT = path.resolve(__dirname, '..')
const INBOX = path.join(PELTIEZ_ROOT, 'content-reservoir', 'inbox')
const DRAFTS = path.join(PELTIEZ_ROOT, 'content-reservoir', 'drafts')
const SCHEMA = path.join(
  PELTIEZ_ROOT,
  'content-reservoir',
  'schemas',
  'nature-portal-entry.schema.json',
)

const CHAR_WARN = 200_000

function wordCount(text) {
  return text
    .trim()
    .split(/\s+/u)
    .filter((w) => w.length > 0).length
}

/** Validation minimale sans dépendance (required + types simples). */
function validateAgainstStubSchema(schema, data, fileLabel) {
  const issues = []
  if (schema.type !== 'object' || typeof data !== 'object' || data === null) {
    issues.push(`${fileLabel}: racine attendue object`)
    return issues
  }
  const req = schema.required
  if (Array.isArray(req)) {
    for (const key of req) {
      if (!(key in data)) issues.push(`${fileLabel}: champ requis manquant « ${key} »`)
    }
  }
  const props = schema.properties
  if (props && typeof props === 'object') {
    for (const [key, def] of Object.entries(props)) {
      if (!(key in data)) continue
      const val = data[key]
      const t = def && def.type
      if (t === 'string' && typeof val !== 'string')
        issues.push(`${fileLabel}: « ${key} » doit être une chaîne`)
      if (t === 'array' && !Array.isArray(val))
        issues.push(`${fileLabel}: « ${key} » doit être un tableau`)
    }
  }
  return issues
}

async function safeStat(p) {
  try {
    return await stat(p)
  } catch {
    return null
  }
}

async function main() {
  console.log('=== reservoir-check (stub) ===\n')

  const inboxStat = await safeStat(INBOX)
  if (!inboxStat || !inboxStat.isDirectory()) {
    console.log(`Inbox introuvable : ${INBOX}`)
    console.log('\nÉtapes suivantes : créer content-reservoir/inbox/ ou lancer depuis la racine peltiez/.')
    printFooter()
    return
  }

  const names = await readdir(INBOX)
  const mdFiles = names.filter((n) => n.endsWith('.md') && n !== 'README.md')

  if (mdFiles.length === 0) {
    console.log('Aucun fichier .md dans inbox/ (hors README.md).')
  } else {
    console.log(`Fichiers markdown dans inbox/ (${mdFiles.length}) :\n`)
    for (const name of mdFiles.sort()) {
      const fp = path.join(INBOX, name)
      const buf = await readFile(fp, 'utf8')
      const chars = buf.length
      const words = wordCount(buf)
      const warn = chars > CHAR_WARN ? `  ⚠ plus de ${CHAR_WARN.toLocaleString('fr-FR')} caractères` : ''
      console.log(`- ${name}`)
      console.log(`    mots ~ ${words.toLocaleString('fr-FR')} · caractères ${chars.toLocaleString('fr-FR')}${warn}`)
    }
  }

  const schemaStat = await safeStat(SCHEMA)
  let schema = null
  if (schemaStat?.isFile()) {
    try {
      schema = JSON.parse(await readFile(SCHEMA, 'utf8'))
      console.log(`\nSchéma présent : schemas/nature-portal-entry.schema.json`)
    } catch (e) {
      console.log(`\n⚠ Schéma illisible : ${e.message}`)
    }
  } else {
    console.log('\nPas de schéma nature-portal-entry.schema.json — validation JSON des brouillons ignorée.')
  }

  const draftsStat = await safeStat(DRAFTS)
  if (draftsStat?.isDirectory()) {
    const draftNames = (await readdir(DRAFTS)).filter((n) => n.endsWith('.json'))
    if (draftNames.length === 0) {
      console.log('\nAucun drafts/*.json à valider.')
    } else if (!schema) {
      console.log(`\nBrouillons JSON (${draftNames.length}) : schéma absent, validation ignorée.`)
    } else {
      console.log(`\nValidation des brouillons (${draftNames.length}) :\n`)
      for (const name of draftNames.sort()) {
        const fp = path.join(DRAFTS, name)
        let data
        try {
          data = JSON.parse(await readFile(fp, 'utf8'))
        } catch (e) {
          console.log(`- ${name} : JSON invalide — ${e.message}`)
          continue
        }
        const issues = validateAgainstStubSchema(schema, data, name)
        if (issues.length === 0) console.log(`- ${name} : OK (stub schéma)`)
        else issues.forEach((m) => console.log(`- ${m}`))
      }
    }
  }

  printFooter()
}

function printFooter() {
  console.log(`
--- Prochaines étapes (manuel) ---
1. Coller les sources dans inbox/ (ou private-*.md en local).
2. Structurer dans drafts/ puis revue (santé : pas de promesses médicales ; LoA : pas de garanties).
3. Promouvoir vers src/data/ quand c’est validé.
4. Brancher CI ou scripts plus stricts (codes de sortie non nuls, schémas complets) quand l’automation sera prête.
`)
}

main().catch((err) => {
  console.error(err)
  process.exit(0)
})
