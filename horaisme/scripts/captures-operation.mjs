/**
 * Capture les cinq étapes de « L'angle mort », plus le mode poche et la clôture.
 * Le fragment seul ne prouve rien : c'est le Pendant et l'Après qu'il faut voir.
 *
 * Usage : node scripts/captures-operation.mjs [port]
 */
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const PORT = process.argv[2] ?? '5184'
const RACINE = dirname(dirname(fileURLToPath(import.meta.url)))
const SORTIE = join(RACINE, '.captures', 'operation')
const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => existsSync(p))

rmSync(SORTIE, { recursive: true, force: true })
mkdirSync(SORTIE, { recursive: true })

const PROFIL = join(tmpdir(), `horaisme-op-${process.pid}`)
const edge = spawn(
  EDGE,
  [
    '--headless=new',
    '--remote-debugging-port=9336',
    `--user-data-dir=${PROFIL}`,
    '--no-first-run',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank',
  ],
  { stdio: 'ignore' },
)

let ws
for (let i = 0; i < 60; i++) {
  try {
    const r = await fetch('http://127.0.0.1:9336/json/version')
    if (r.ok) {
      ws = (await r.json()).webSocketDebuggerUrl
      break
    }
  } catch {
    /* pas encore prêt */
  }
  await new Promise((r) => setTimeout(r, 250))
}

const nav = await puppeteer.connect({ browserWSEndpoint: ws })
const page = await nav.newPage()
const journal = []
page.on('pageerror', (e) => journal.push(`exception: ${e.message}`))
page.on('console', (m) => {
  if (m.type() === 'error') journal.push(`console: ${m.text()}`)
})

const format = process.argv[3] === 'mobile'
await page.setViewport(
  format
    ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { width: 1440, height: 900, deviceScaleFactor: 1 },
)

const pause = (ms) => new Promise((r) => setTimeout(r, ms))

async function cliquerTexte(texte) {
  const ok = await page.evaluate((t) => {
    const cible = [...document.querySelectorAll('button, a[href]')].find(
      (e) => e.textContent.replace(/\s+/g, ' ').trim() === t && !e.disabled,
    )
    if (!cible) return false
    cible.click()
    return true
  }, texte)
  if (!ok) throw new Error(`Bouton introuvable ou désactivé : « ${texte} »`)
  await pause(650)
}

async function taper(selecteur, texte) {
  await page.click(selecteur)
  await page.type(selecteur, texte, { delay: 4 })
}

let n = 0
async function capturer(nom) {
  const f = join(SORTIE, `${String(++n).padStart(2, '0')}-${nom}.png`)
  await page.screenshot({ path: f, fullPage: true, captureBeyondViewport: true })
  const h1 = await page.evaluate(
    () => document.querySelector('h1, h2')?.textContent?.trim() ?? '(sans titre)',
  )
  console.log(`${String(n).padStart(2, '0')}  ${nom.padEnd(18)} ${h1}`)
}

await page.goto(`http://localhost:${PORT}/operation/angle-mort`, { waitUntil: 'networkidle0' })
/* Edge peut recycler un profil : on repart d'une mémoire vide à chaque passage. */
await page.evaluate(() => window.localStorage.clear())
await page.reload({ waitUntil: 'networkidle0' })
await pause(800)
await capturer('fragment')

await cliquerTexte('J’en ai assez vu')
await capturer('inventaire-vide')

await taper('#hypothese', 'La façade de pierre à l’angle de la rue Saint-Paul')
await cliquerTexte('Poser')
await taper('#hypothese', 'Le mur arrière du marché, côté livraison')
await cliquerTexte('Poser')
await capturer('inventaire-rempli')

await cliquerTexte('Emporter l’inventaire')
await capturer('sortie')

await cliquerTexte('Mettre en poche')
await capturer('mode-poche')

await cliquerTexte('Je suis revenu')
await capturer('constat')

await cliquerTexte('Il est là, mais quelque chose a changé.')
await page.evaluate(() => {
  const t = document.querySelector('textarea')
  if (t) t.focus()
})
await page.type(
  'textarea',
  'La pierre sculptée est toujours là, mais le cadre bleu a été repeint en gris.',
  { delay: 4 },
)
await capturer('constat-rempli')

await cliquerTexte('Ancrer le résultat')
await capturer('ancrage')

await cliquerTexte('Clore l’opération')
await capturer('cloture')

/* Après la clôture, la trace doit exister ailleurs que dans l'opération. */
for (const [nom, route] of [
  ['parcours-apres', '/parcours'],
  ['terrain-apres', '/terrain'],
  ['moi-apres', '/moi'],
]) {
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0' })
  await pause(600)
  await capturer(nom)
}

console.log(journal.length ? `\nMessages : ${journal.join(' | ')}` : '\nAucune erreur console.')

await page.close()
await nav.disconnect()
edge.kill()
setTimeout(() => rmSync(PROFIL, { recursive: true, force: true, maxRetries: 5 }), 1500).unref?.()
