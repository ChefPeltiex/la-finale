/**
 * Mesure les cibles tactiles trop petites sur mobile, route par route.
 * Usage : node scripts/mesure-cibles.mjs [port]
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { spawn } from 'node:child_process'
import puppeteer from 'puppeteer-core'

const PORT = process.argv[2] ?? '5184'
const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => existsSync(p))

const PROFIL = join(tmpdir(), `horaisme-cibles-${process.pid}`)
const edge = spawn(
  EDGE,
  [
    '--headless=new',
    '--remote-debugging-port=9335',
    `--user-data-dir=${PROFIL}`,
    '--no-first-run',
    '--disable-gpu',
    'about:blank',
  ],
  { stdio: 'ignore' },
)

let ws
for (let i = 0; i < 60; i++) {
  try {
    const r = await fetch('http://127.0.0.1:9335/json/version')
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
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })

const ROUTES = ['/', '/aujourdhui', '/terrain', '/missions', '/parcours', '/decouvrir', '/moi', '/operation/angle-mort', '/operation/trois-soleils', '/operation/le-sosie']

for (const route of ROUTES) {
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 500))
  const petits = await page.evaluate(() =>
    [...document.querySelectorAll('button, a[href], [role="switch"], input, select, summary')]
      .map((e) => {
        const r = e.getBoundingClientRect()
        return { t: (e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 34), h: Math.round(r.height), l: Math.round(r.width) }
      })
      .filter((x) => x.h > 0 && x.h < 44),
  )
  console.log(`${route.padEnd(22)} ${petits.length === 0 ? 'ok' : petits.map((p) => `${p.t} [${p.h}px]`).join(' · ')}`)
}

await page.close()
await nav.disconnect()
edge.kill()
