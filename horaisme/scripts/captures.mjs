/**
 * Capture visuelle de toutes les routes.
 *
 * Pilote l'Edge déjà installé (aucun navigateur téléchargé). Le viewport est
 * réaliste — les `100vh` valent donc ce qu'ils valent sur un vrai écran — et la
 * capture déborde du viewport pour montrer la page entière.
 *
 * Usage : node scripts/captures.mjs [port]
 */
import { mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const PORT = process.argv[2] ?? '5184'
const BASE = `http://localhost:${PORT}`
const RACINE = dirname(dirname(fileURLToPath(import.meta.url)))
const SORTIE = join(RACINE, '.captures')

const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => existsSync(p))
if (!EDGE) throw new Error('Edge introuvable.')

const ROUTES = [
  ['00-seuil', '/'],
  ['01-aujourdhui', '/aujourdhui'],
  ['02-terrain', '/terrain'],
  ['03-missions', '/missions'],
  ['04-parcours', '/parcours'],
  ['05-decouvrir', '/decouvrir'],
  ['06-moi', '/moi'],
  ['07-operation', '/operation/angle-mort'],
]

const FORMATS = [
  ['desktop', { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false }],
  ['mobile', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
]

rmSync(SORTIE, { recursive: true, force: true })
mkdirSync(SORTIE, { recursive: true })

/* Edge est lancé à part puis piloté par CDP : lancé via puppeteer.launch, le
   lanceur d'Edge rend la main à une instance existante et le processus meurt. */
const PROFIL = join(tmpdir(), `horaisme-captures-${process.pid}`)
const PORT_CDP = 9333

const edge = spawn(
  EDGE,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT_CDP}`,
    `--user-data-dir=${PROFIL}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank',
  ],
  { stdio: 'ignore', detached: false },
)

async function attendreCdp() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT_CDP}/json/version`)
      if (r.ok) return (await r.json()).webSocketDebuggerUrl
    } catch {
      /* pas encore prêt */
    }
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error('Edge n’a pas ouvert son port de débogage.')
}

const wsUrl = await attendreCdp()
const navigateur = await puppeteer.connect({ browserWSEndpoint: wsUrl })

const problemes = []

for (const [nomFormat, viewport] of FORMATS) {
  const page = await navigateur.newPage()
  await page.setViewport(viewport)

  const journal = []
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') journal.push(`${m.type()}: ${m.text()}`)
  })
  page.on('pageerror', (e) => journal.push(`exception: ${e.message}`))
  page.on('requestfailed', (r) => journal.push(`requete: ${r.url()} — ${r.failure()?.errorText}`))

  for (const [nom, route] of ROUTES) {
    journal.length = 0
    await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 30_000 })
    /* Laisse les animations d'entrée se poser. */
    await new Promise((r) => setTimeout(r, 900))

    const mesures = await page.evaluate(() => {
      const debordent = [...document.querySelectorAll('*')]
        .filter((e) => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
        .slice(0, 5)
        .map((e) => `${e.tagName.toLowerCase()}.${(e.className || '').toString().slice(0, 60)}`)
      const petits = [...document.querySelectorAll('button, a[href]')]
        .filter((e) => {
          const r = e.getBoundingClientRect()
          return r.width > 0 && r.height > 0 && r.height < 32
        })
        .slice(0, 5)
        .map((e) => `${(e.textContent || '').trim().slice(0, 30)} (${Math.round(e.getBoundingClientRect().height)}px)`)
      return {
        titre: document.title,
        hauteur: document.documentElement.scrollHeight,
        largeurScroll: document.documentElement.scrollWidth,
        largeurVue: document.documentElement.clientWidth,
        h1: document.querySelector('h1')?.textContent?.trim() ?? null,
        texte: (document.body.innerText || '').replace(/\s+/g, ' ').trim().length,
        debordent,
        petits,
      }
    })

    await page.screenshot({
      path: join(SORTIE, `${nom}-${nomFormat}.png`),
      captureBeyondViewport: true,
      fullPage: true,
    })

    const ligne = {
      route,
      format: nomFormat,
      hauteur: mesures.hauteur,
      texte: mesures.texte,
      scrollH: mesures.largeurScroll > mesures.largeurVue,
      debordent: mesures.debordent,
      petits: mesures.petits,
      journal: [...journal],
    }
    if (ligne.scrollH || ligne.journal.length || mesures.texte < 80) problemes.push(ligne)

    console.log(
      `${ligne.scrollH || ligne.journal.length ? '!!' : 'ok'}  ${route.padEnd(22)} ${nomFormat.padEnd(8)} ` +
        `${String(mesures.hauteur).padStart(5)}px  ${String(mesures.texte).padStart(5)} car.` +
        `${ligne.scrollH ? '  SCROLL-H' : ''}${ligne.journal.length ? `  ${ligne.journal.length} msg` : ''}` +
        `${ligne.petits.length ? `  cibles<32px: ${ligne.petits.length}` : ''}`,
    )
  }

  await page.close()
}

await navigateur.disconnect()
edge.kill()
/* Le profil temporaire est jetable : Edge peut encore le tenir une seconde. */
setTimeout(() => rmSync(PROFIL, { recursive: true, force: true, maxRetries: 5 }), 1500).unref?.()

if (problemes.length) {
  console.log('\n--- détails ---')
  for (const p of problemes) {
    console.log(`\n${p.route} [${p.format}]`)
    if (p.scrollH) console.log('  débordement horizontal :', p.debordent.join(' | '))
    for (const m of p.journal) console.log('  ', m)
  }
} else {
  console.log('\nAucun débordement horizontal, aucune erreur console, aucune requête échouée.')
}
