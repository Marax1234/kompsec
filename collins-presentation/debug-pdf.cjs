#!/usr/bin/env node
/**
 * debug-pdf.cjs — Simuliert exakt den decktape-Ablauf:
 *   1. Reveal.configure({ fragments: false, transition: 'none', autoAnimate: false })
 *   2. Reveal.next() zum Durchlaufen aller Slides
 *   3. Screenshot + Opacity-Check pro problematischem Slide
 */

const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

const PORT = 5175
const BASE = `http://localhost:${PORT}`
const OUT  = path.join(__dirname, 'debug-screenshots')

const TARGET_SLIDES = ['lessons', 'lessons-further', 'timeline', 'timeline-2']

fs.mkdirSync(OUT, { recursive: true })

async function waitForReveal(page) {
  await page.waitForFunction(() => window.Reveal && window.Reveal.isReady(), { timeout: 15000 })
}

async function captureState(page, slideId, label) {
  const file = path.join(OUT, `decktape_${slideId}_${label}.png`)
  await page.screenshot({ path: file })

  const info = await page.evaluate((id) => {
    const slide = document.getElementById(id)
    if (!slide) return { error: 'slide not found' }
    const getOpacities = (sel) =>
      [...slide.querySelectorAll(sel)].map(el => ({
        computed: getComputedStyle(el).opacity,
        inline:   el.style.opacity || '–',
      }))
    return {
      '.ll-item':        getOpacities('.ll-item'),
      '.lf-step':        getOpacities('.lf-step'),
      '.tl-scene':       getOpacities('.tl-scene'),
      '.tl-act (non-static)': getOpacities('.tl-act:not(.tl-act-static)'),
      'fragments config': window.Reveal?.getConfig?.()?.fragments,
    }
  }, slideId)

  console.log(`  [${label}] screenshot: ${path.basename(file)}`)
  console.log(`  opacity state:`, JSON.stringify(info, null, 4))
  return info
}

;(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  page.setViewport({ width: 1280, height: 720 })

  page.on('console', msg => console.log(`  [browser] ${msg.text()}`))
  page.on('pageerror', err => console.error(`  [page error] ${err.message}`))

  console.log(`Loading ${BASE} ...`)
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 })
  await waitForReveal(page)
  await new Promise(r => setTimeout(r, 3000))

  // ── Step 1: Simulate exactly what decktape does ─────────────────────────
  console.log('\n── Simulating decktape: Reveal.configure({ fragments:false, ... }) ──')
  await page.evaluate(() => {
    Reveal.configure({
      controls:    false,
      fragments:   false,
      transition:  'none',
      autoAnimate: false,
    })
  })
  await new Promise(r => setTimeout(r, 500))

  // ── Step 2: Walk through all slides with Reveal.next() ──────────────────
  // First navigate to slide 1
  await page.evaluate(() => Reveal.slide(0, 0, -1))
  await new Promise(r => setTimeout(r, 1000))

  const totalSlides = await page.evaluate(() => Reveal.getTotalSlides?.() ?? 30)
  console.log(`Total slides: ${totalSlides}`)

  for (let i = 0; i < totalSlides; i++) {
    await page.evaluate(() => Reveal.next())
    await new Promise(r => setTimeout(r, 2000)) // decktape --pause 2000

    const slideId = await page.evaluate(() => {
      const sl = Reveal.getCurrentSlide()
      return sl?.id || `slide_${Reveal.getIndices().h}`
    })

    if (TARGET_SLIDES.includes(slideId)) {
      await captureState(page, slideId, `next_${i}`)
    }

    const isLast = await page.evaluate(() => Reveal.isLastSlide())
    if (isLast) break
  }

  await browser.close()
  console.log(`\n✓ Screenshots in: ${OUT}`)
})().catch(err => { console.error(err); process.exit(1) })
