import './style.css'

import Reveal from 'reveal.js'
import RevealHighlight from 'reveal.js/plugin/highlight'
import RevealNotes from 'reveal.js/plugin/notes'
import { gsap } from 'gsap'
import Typed from 'typed.js'
import { CountUp } from 'countup.js'
import { tsParticles } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

// ─── tsParticles: network grid on title slide ────────────────────────────────
async function initParticles() {
  await loadSlim(tsParticles)
  await tsParticles.load({
    id: 'particles-bg',
    options: {
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      particles: {
        number: { value: 110, density: { enable: true } },
        color: { value: '#00C9A7' },
        opacity: { value: 0.55 },
        size: { value: { min: 1.5, max: 4 } },
        links: {
          enable: true,
          color: '#00C9A7',
          opacity: 0.25,
          distance: 180,
          width: 1.2,
        },
        move: { enable: true, speed: 1.1, outModes: 'bounce' },
      },
      detectRetina: true,
    },
  })
}
initParticles()

// ─── Decktape-Fix: fragments:false → GSAP-Elemente direkt sichtbar machen ────
// Decktape ruft Reveal.configure({ fragments: false }) auf, wodurch
// fragmentshown nie feuert und GSAP-Elemente unsichtbar bleiben.
// Lösung: configure() patchen und bei fragments:false alle Elemente sofort zeigen.
function showAllGSAPElements(slideEl) {
  if (!slideEl) return
  const show = (sel, styles) =>
    slideEl.querySelectorAll(sel).forEach(el => Object.assign(el.style, styles))
  const id = slideEl.id
  if (id === 'lessons') {
    show('.ll-item',    { opacity: '1', transform: 'translateX(0)' })
    show('.ll-num',     { opacity: '1', transform: 'scale(1)' })
    show('.ll-fix',     { opacity: '1' })
    show('.ll-verdict', { opacity: '1', transform: 'scale(1)' })
  }
  if (id === 'lessons-further') {
    show('.lf-step',      { opacity: '1', transform: 'translateX(0)' })
    show('.lf-reg-block', { opacity: '1' })
  }
  if (id === 'timeline' || id === 'timeline-2') {
    show('.tl-scene', { opacity: '1' })
    show('.tl-act:not(.tl-act-static)', { opacity: '1', transform: 'none' })
    show('.tl-line',  { transform: 'scaleY(1)' })
  }
  if (id === 'attack-vector') {
    show('.av-node',      { opacity: '1', transform: 'scale(1)' })
    show('.av-connector', { transform: 'scaleY(1)' })
  }
}

// ─── GSAP: stagger entrances per slide ───────────────────────────────────────
const animatedSlides = new Set()

function animateSlide(slideEl) {
  const id = slideEl?.id
  if (!id || animatedSlides.has(id)) return
  animatedSlides.add(id)

  switch (id) {
    case 'impact':
      startCountUps()
      break
    case 'data-leak':
      startTyped()
      break
  }
}

// ─── CountUp: animated numbers on impact slide ───────────────────────────────
let countUpDone = false
function startCountUps() {
  if (countUpDone) return
  countUpDone = true
  const opts = { duration: 2, useEasing: true }
  new CountUp('stat-airports',  5,    { ...opts, duration: 1.2 }).start()
  new CountUp('stat-flights',   29,   { ...opts, suffix: '+' }).start()
  new CountUp('stat-computers', 1000, { ...opts, duration: 2.5, separator: '.' }).start()
  new CountUp('stat-cyber',     600,  { ...opts, suffix: '%' }).start()
}

// ─── Typed.js: terminal typewriter on data-leak slide ────────────────────────
let typedDone = false
function startTyped() {
  if (typedDone) return
  typedDone = true
  new Typed('#leak-typed', {
    strings: [
      'passenger_data: ^600 1.533.900 records exfiltrated...',
      'employee_db: ^400 3.637 entries leaked...',
      'network_topology: ^400 50+ GB stolen...',
      'darknet_publish: ^600 23 GB released 11.11.2025...',
      'air_arabia_db: ^500 $2,000,000 asking price on forum...',
    ],
    typeSpeed: 38,
    backSpeed: 18,
    backDelay: 1400,
    loop: false,
    showCursor: true,
    cursorChar: '█',
  })
}

// ─── Attack-Vector: plane crash + bomb drop helpers ──────────────────────────
function avCrashExplosion(container, x, y) {
  // Fireball
  const ball = document.createElement('div')
  ball.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:12px;height:12px;
    background:radial-gradient(circle,#fff 0%,#FFAA00 30%,#E63946 65%,transparent 100%);
    border-radius:50%;transform:translate(-50%,-50%);`
  container.appendChild(ball)
  gsap.fromTo(ball,
    { scale: 0, opacity: 1 },
    { scale: 22, opacity: 0, duration: 1.0, ease: 'power2.out', onComplete: () => ball.remove() }
  )
  // Shockwave ring
  const ring = document.createElement('div')
  ring.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:12px;height:12px;
    border:3px solid #FF8C00;border-radius:50%;transform:translate(-50%,-50%);`
  container.appendChild(ring)
  gsap.fromTo(ring,
    { scale: 0, opacity: 0.9 },
    { scale: 20, opacity: 0, duration: 1.1, ease: 'power1.out', onComplete: () => ring.remove() }
  )
}

function avDropBomb(container, x, H) {
  const bomb = document.createElement('div')
  bomb.textContent = '💣'
  bomb.style.cssText = `position:absolute;font-size:38px;line-height:1;left:${x}px;top:-50px;transform:translateX(-50%);`
  container.appendChild(bomb)
  const landY = H * 0.75 + (Math.random() * 50 - 25)
  gsap.to(bomb, {
    y: landY + 55,
    rotation: Math.random() * 80 - 40,
    duration: 0.85 + Math.random() * 0.3,
    ease: 'power2.in',
    onComplete() {
      bomb.remove()
      avCrashExplosion(container, x, landY)
    },
  })
}

// ─── Audio helpers (Web Audio API) ──────────────────────────────────────────
function avAudioCtx() {
  try { return new (window.AudioContext || window.webkitAudioContext)() } catch { return null }
}

function avSoundExplosion() {
  const ctx = avAudioCtx(); if (!ctx) return
  // Sub-bass thump
  const bass = ctx.createOscillator()
  const bassG = ctx.createGain()
  bass.type = 'sine'
  bass.frequency.setValueAtTime(100, ctx.currentTime)
  bass.frequency.exponentialRampToValueAtTime(22, ctx.currentTime + 0.45)
  bassG.gain.setValueAtTime(1.1, ctx.currentTime)
  bassG.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45)
  bass.connect(bassG); bassG.connect(ctx.destination)
  bass.start(); bass.stop(ctx.currentTime + 0.45)
  // Noise burst
  const len = ctx.sampleRate * 0.65
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.4)
  const noise = ctx.createBufferSource(); noise.buffer = buf
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'
  lp.frequency.setValueAtTime(1400, ctx.currentTime)
  lp.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.35)
  const ng = ctx.createGain()
  ng.gain.setValueAtTime(0.7, ctx.currentTime)
  ng.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65)
  noise.connect(lp); lp.connect(ng); ng.connect(ctx.destination)
  noise.start()
}

function avSoundSiren() {
  const ctx = avAudioCtx(); if (!ctx) return ctx
  const osc = ctx.createOscillator()
  const g   = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(320, ctx.currentTime)
  osc.frequency.linearRampToValueAtTime(720, ctx.currentTime + 0.55)
  osc.frequency.linearRampToValueAtTime(320, ctx.currentTime + 1.1)
  osc.frequency.linearRampToValueAtTime(720, ctx.currentTime + 1.65)
  osc.frequency.linearRampToValueAtTime(320, ctx.currentTime + 2.2)
  g.gain.setValueAtTime(0, ctx.currentTime)
  g.gain.linearRampToValueAtTime(0.13, ctx.currentTime + 0.15)
  g.gain.setValueAtTime(0.13, ctx.currentTime + 2.0)
  g.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.2)
  osc.connect(g); g.connect(ctx.destination)
  osc.start(); osc.stop(ctx.currentTime + 2.2)
  return ctx
}

function avSoundBeeps(ctx) {
  if (!ctx) return
  try {
    const freqs = [1600, 1000, 1600, 1000, 1600, 1000]
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator()
      const g   = ctx.createGain()
      const t   = ctx.currentTime + i * 0.16
      osc.type = 'square'; osc.frequency.value = f
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.07, t + 0.02)
      g.gain.setValueAtTime(0.07, t + 0.13)
      g.gain.linearRampToValueAtTime(0, t + 0.15)
      osc.connect(g); g.connect(ctx.destination)
      osc.start(t); osc.stop(t + 0.15)
    })
  } catch { /* noop */ }
}

function avStaticCanvas(durationMs) {
  const c = document.createElement('canvas')
  c.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:10001;pointer-events:none;image-rendering:pixelated;'
  c.width = 240; c.height = 135
  document.body.appendChild(c)
  const cx = c.getContext('2d')
  const end = performance.now() + durationMs
  ;(function draw() {
    if (performance.now() > end) { c.remove(); return }
    const id = cx.createImageData(240, 135)
    for (let i = 0; i < id.data.length; i += 4) {
      const v = Math.random() * 255 | 0
      id.data[i] = id.data[i + 1] = id.data[i + 2] = v
      id.data[i + 3] = 200
    }
    cx.putImageData(id, 0, 0)
    requestAnimationFrame(draw)
  })()
}

// ─── Reveal.js ───────────────────────────────────────────────────────────────
const deck = new Reveal({
  width: 1280,
  height: 720,
  margin: 0,
  controls: true,
  progress: true,
  slideNumber: 'c/t',
  hash: true,
  transition: 'fade',
  transitionSpeed: 'fast',
  backgroundTransition: 'fade',
  autoAnimate: true,
  autoAnimateEasing: 'ease-out',
  autoAnimateDuration: 0.8,
  center: false,
  plugins: [RevealHighlight, RevealNotes],
})

deck.initialize().then(() => {
  // Expose instance for headless export tools (e.g. decktape)
  window.Reveal = deck

  // ── Decktape-Patch: configure({fragments:false}) abfangen ────────────────
  const _origConfigure = deck.configure.bind(deck)
  deck.configure = function (config) {
    _origConfigure(config)
    if (config.fragments === false) {
      // Decktape hat Fragmente deaktiviert → alle GSAP-Elemente sofort zeigen
      showAllGSAPElements(deck.getCurrentSlide())
      deck.on('slidechanged', ({ currentSlide }) => showAllGSAPElements(currentSlide))
    }
  }

  // Animate the first visible slide
  animateSlide(deck.getCurrentSlide())

  deck.on('slidechanged', ({ currentSlide }) => animateSlide(currentSlide))

  // ─── Attack-Vector: per-fragment GSAP animations ───────────────────────
  deck.on('fragmentshown', ({ fragment }) => {
    const slideId = deck.getCurrentSlide()?.id

    // ── Attack-Vector ───────────────────────────────────────────────────────
    if (slideId === 'attack-vector') {
      const step = fragment.dataset?.avStep
      if (step === undefined) return

      const node = fragment.querySelector('.av-node')
      const connector = fragment.querySelector('.av-connector')

      gsap.fromTo(node,
        { scale: 0.3, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.7)', delay: 0.2,
          onComplete: () => node.classList.add('av-node-active'),
        }
      )

      if (connector) {
        gsap.to(connector, { scaleY: 1, duration: 0.55, ease: 'power2.out', delay: 0.55 })
      }

      if (step === '3') {
        const W = window.innerWidth
        const H = window.innerHeight

        // ── Stage ─────────────────────────────────────────────────────────
        const stage = document.createElement('div')
        stage.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9998;pointer-events:none;overflow:hidden;'
        document.body.appendChild(stage)

        // ── Siren begins immediately ───────────────────────────────────────
        const sirenCtx = avSoundSiren()

        // ── Plane: bigger, glowing, with vapour trail dots ─────────────────
        const plane = document.createElement('div')
        plane.textContent = '✈'
        plane.style.cssText = 'position:absolute;font-size:110px;line-height:1;color:#fff;text-shadow:0 0 40px #fff,0 0 14px #aaa,0 0 60px rgba(255,140,0,0.5);'
        stage.appendChild(plane)
        gsap.set(plane, { x: W + 110, y: H * 0.20, scaleX: -1, rotation: -6 })

        gsap.timeline()
          .to(plane, {
            x: W * 0.26, y: H * 0.36, rotation: -13, scaleX: -1,
            duration: 1.05, ease: 'power1.inOut',
          })
          .to(plane, {
            x: W * 0.06, y: H * 0.79, rotation: -78, scaleX: -1,
            duration: 0.42, ease: 'power3.in',
            onComplete() {
              plane.remove()

              // ── BOOM ─────────────────────────────────────────────────────
              avSoundExplosion()
              avCrashExplosion(stage, W * 0.06, H * 0.79)
              gsap.delayedCall(0.07, () => avCrashExplosion(stage, W * 0.06 + 35, H * 0.79 - 25))
              gsap.delayedCall(0.14, () => avCrashExplosion(stage, W * 0.06 - 25, H * 0.79 + 35))

              // ── Violent red double-flash ────────────────────────────────
              const flash = document.createElement('div')
              flash.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#E63946;pointer-events:none;opacity:0;z-index:9999;'
              document.body.appendChild(flash)
              gsap.timeline()
                .to(flash, { opacity: 0.85, duration: 0.04 })
                .to(flash, { opacity: 0.15, duration: 0.07 })
                .to(flash, { opacity: 0.65, duration: 0.04 })
                .to(flash, { opacity: 0,    duration: 0.25, onComplete: () => flash.remove() })

              // ── Violent shake (whole slide) ─────────────────────────────
              const slide = deck.getCurrentSlide()
              gsap.timeline({ delay: 0.02 })
                .to(slide, { x: -18, duration: 0.04 })
                .to(slide, { x:  18, duration: 0.04 })
                .to(slide, { x: -14, duration: 0.04 })
                .to(slide, { x:  14, duration: 0.04 })
                .to(slide, { x:  -9, duration: 0.04 })
                .to(slide, { x:   9, duration: 0.04 })
                .to(slide, { x:  -5, duration: 0.04 })
                .to(slide, { x:   5, duration: 0.04 })
                .to(slide, { x:   0, duration: 0.03 })

              // ── Bomb wave ───────────────────────────────────────────────
              ;[0.18, 0.33, 0.50, 0.66, 0.80, 0.42, 0.60, 0.28, 0.72].forEach((fx, i) => {
                gsap.delayedCall(0.1 + i * 0.17, () => avDropBomb(stage, fx * W, H))
              })

              // ── Brief signal-loss: blackout + static ────────────────────
              gsap.delayedCall(0.32, () => {
                const black = document.createElement('div')
                black.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;pointer-events:none;opacity:0;z-index:10000;'
                document.body.appendChild(black)
                gsap.timeline()
                  .to(black, { opacity: 1, duration: 0.06 })
                  .call(() => avStaticCanvas(160))
                  .to(black, { opacity: 0, duration: 0.07, delay: 0.14, onComplete: () => black.remove() })
              })

              // ── HARDBIT TAKEOVER OVERLAY ─────────────────────────────────
              gsap.delayedCall(0.68, () => {
                avSoundBeeps(sirenCtx)

                const hb = document.createElement('div')
                hb.className = 'hb-takeover'
                hb.innerHTML = `
                  <div class="hb-frame"></div>
                  <div class="hb-corner hb-tl">HARDBIT v4.0 &nbsp;·&nbsp; ENCRYPTION ACTIVE</div>
                  <div class="hb-corner hb-tr">SYS://MUSE_CORE &nbsp;·&nbsp; COMPROMISED</div>
                  <div class="hb-corner hb-bl">UTC 2025-09-20 &nbsp;·&nbsp; 00:47:13</div>
                  <div class="hb-corner hb-br">TARGET: COLLINS AEROSPACE / ARINC</div>
                  <p class="hb-alert-label">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    &nbsp;CRITICAL SYSTEM FAILURE&nbsp;
                    <i class="fa-solid fa-triangle-exclamation"></i>
                  </p>
                  <h2 class="hb-main-title">RANSOMWARE<br>DETECTED</h2>
                  <p class="hb-sub">HARDBIT — ENCRYPTING CORE DATABASES</p>
                  <div class="hb-progress-wrap">
                    <div class="hb-progress-meta">
                      <span>ENCRYPTION PROGRESS</span><span id="hb-pct">0%</span>
                    </div>
                    <div class="hb-track"><div class="hb-fill" id="hb-fill"></div></div>
                  </div>
                  <div class="hb-stats">
                    <div class="hb-stat">FILES ENCRYPTED <span id="hb-files">0</span></div>
                    <div class="hb-stat">SYSTEMS OFFLINE <span>MUSE_CORE.exe</span></div>
                    <div class="hb-stat">AIRPORTS AFFECTED <span>5</span></div>
                    <div class="hb-stat">RANSOM KEY <span>HB-2025-█████</span></div>
                  </div>`
                hb.style.opacity = '0'
                document.body.appendChild(hb)

                // Glitch entrance
                gsap.timeline()
                  .set(hb, { skewX: 12, opacity: 1 })
                  .to(hb, { skewX: 0, duration: 0.28, ease: 'power3.out' })

                // Progress bar + counters
                let prog = 0
                const ticker = setInterval(() => {
                  prog = Math.min(100, prog + Math.random() * 7 + 3)
                  const fill = document.getElementById('hb-fill')
                  const pct  = document.getElementById('hb-pct')
                  const fc   = document.getElementById('hb-files')
                  if (fill) fill.style.width = prog + '%'
                  if (pct)  pct.textContent  = Math.floor(prog) + '%'
                  if (fc)   fc.textContent   = Math.floor(prog / 100 * 1847293).toLocaleString('de-DE')
                  if (prog >= 100) clearInterval(ticker)
                }, 75)

                // Fade out + cleanup
                gsap.delayedCall(3.8, () => {
                  gsap.to(hb, {
                    opacity: 0, skewX: -8, duration: 0.5, ease: 'power2.in',
                    onComplete: () => { clearInterval(ticker); hb.remove() }
                  })
                })
              })

              // ── Red ambient tint lingers on slide ───────────────────────
              const tint = document.createElement('div')
              tint.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#E63946;pointer-events:none;opacity:0;z-index:9996;'
              document.body.appendChild(tint)
              gsap.to(tint, { opacity: 0.07, duration: 0.6 })
              gsap.delayedCall(5.5, () => gsap.to(tint, { opacity: 0, duration: 1.2, onComplete: () => tint.remove() }))

              gsap.delayedCall(6.5, () => stage.remove())
            },
          })
      }
    }

    // ── Timeline: theatrical stage (both slides) ─────────────────────────────
    if (slideId === 'timeline' || slideId === 'timeline-2') {
      const step = fragment.dataset?.tlStep
      if (!step) return

      // ── Act dividers + first event ──────────────────────────────────────────
      if (step.startsWith('act')) {
        const act = fragment.querySelector('.tl-act')
        if (act) {
          gsap.fromTo(act,
            { opacity: 0, scaleX: 0.45 },
            { opacity: 1, scaleX: 1, duration: 0.55, ease: 'power3.out' }
          )
        }
        // Animate the bundled first scene with a slight delay
        const firstScene = fragment.querySelector('.tl-scene')
        if (firstScene) {
          const xl = firstScene.classList.contains('tl-attacker') ? -38 : firstScene.classList.contains('tl-victim') ? 38 : 0
          const yl = xl === 0 ? 16 : 0
          gsap.fromTo(firstScene,
            { opacity: 0, x: xl, y: yl },
            { opacity: 1, x: 0, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.2 }
          )
          const dot  = firstScene.querySelector('.tl-dot')
          const line = firstScene.querySelector('.tl-line')
          if (dot) gsap.delayedCall(0.42, () => { dot.classList.remove('tl-dot-pulse'); void dot.offsetWidth; dot.classList.add('tl-dot-pulse') })
          if (line) gsap.to(line, { scaleY: 1, duration: 0.55, ease: 'power2.inOut', delay: 0.5 })
        }
        return
      }

      const scene   = fragment.querySelector('.tl-scene')
      const dot     = scene?.querySelector('.tl-dot')
      const line    = scene?.querySelector('.tl-line')
      const isCrit  = fragment.dataset?.tlCritical === 'true'
      const isArrest = fragment.dataset?.tlArrest === 'true'
      const isLeft  = scene?.classList.contains('tl-attacker')
      const isRight = scene?.classList.contains('tl-victim')

      const xFrom = isLeft ? -38 : isRight ? 38 : 0
      const yFrom = (!isLeft && !isRight) ? 16 : 0

      if (isCrit) {
        // ── Red screen flash ──────────────────────────────────────────────────
        const overlay = document.createElement('div')
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#E63946;pointer-events:none;opacity:0;z-index:9999;'
        document.body.appendChild(overlay)
        gsap.timeline()
          .to(overlay, { opacity: 0.5,  duration: 0.05 })
          .to(overlay, { opacity: 0.08, duration: 0.12 })
          .to(overlay, { opacity: 0.38, duration: 0.04 })
          .to(overlay, { opacity: 0,    duration: 1.1, ease: 'power2.out', onComplete: () => overlay.remove() })

        // ── Screen shake ──────────────────────────────────────────────────────
        const slide = deck.getCurrentSlide()
        gsap.timeline({ delay: 0.02 })
          .to(slide, { x: -12, duration: 0.05 })
          .to(slide, { x:  12, duration: 0.05 })
          .to(slide, { x:  -9, duration: 0.05 })
          .to(slide, { x:   9, duration: 0.05 })
          .to(slide, { x:  -5, duration: 0.05 })
          .to(slide, { x:   5, duration: 0.05 })
          .to(slide, { x:   0, duration: 0.04 })

        // ── Glitch entrance ───────────────────────────────────────────────────
        if (scene) {
          gsap.set(scene, { opacity: 1 })
          scene.classList.add('tl-critical-glitch')
          setTimeout(() => scene.classList.remove('tl-critical-glitch'), 420)
        }
      } else if (isArrest) {
        // ── Spotlight / relief flash ──────────────────────────────────────────
        const overlay = document.createElement('div')
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#00C9A7;pointer-events:none;opacity:0;z-index:9999;'
        document.body.appendChild(overlay)
        gsap.timeline()
          .to(overlay, { opacity: 0.12, duration: 0.08 })
          .to(overlay, { opacity: 0,    duration: 0.7, ease: 'power2.out', onComplete: () => overlay.remove() })

        if (scene) {
          scene.classList.add('tl-arrest-glow')
          gsap.fromTo(scene, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        }
      } else {
        // ── Standard directional entrance ─────────────────────────────────────
        if (scene) {
          gsap.fromTo(scene,
            { opacity: 0, x: xFrom, y: yFrom },
            { opacity: 1, x: 0, y: 0, duration: 0.5, ease: 'power3.out' }
          )
        }
      }

      // ── Dot ring pulse ────────────────────────────────────────────────────
      if (dot) {
        gsap.delayedCall(isCrit ? 0.42 : 0.22, () => {
          dot.classList.remove('tl-dot-pulse')
          void dot.offsetWidth // reflow to restart animation
          dot.classList.add('tl-dot-pulse')
        })
      }

      // ── Line grows to next event ──────────────────────────────────────────
      if (line) {
        gsap.to(line, { scaleY: 1, duration: 0.55, ease: 'power2.inOut', delay: isCrit ? 0.5 : 0.3 })
      }
      return
    }

    // ── Lessons Learned ──────────────────────────────────────────────────────
    if (slideId === 'lessons') {
      if (fragment.dataset?.llStep === undefined) return

      const item    = fragment.querySelector('.ll-item')
      const verdict = fragment.querySelector('.ll-verdict')

      if (item) {
        gsap.to(item, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', delay: 0.05 })
        gsap.fromTo(
          item.querySelector('.ll-num'),
          { scale: 0.5, opacity: 0.25 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.2)', delay: 0.18 }
        )
        gsap.to(item.querySelector('.ll-fix'), {
          opacity: 1, duration: 0.35, ease: 'power2.out', delay: 0.42,
        })
      }

      if (verdict) {
        gsap.to(verdict, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out', delay: 0.08 })
      }
    }

    // ── Lessons Further: Prevention Measures ────────────────────────────────
    if (slideId === 'lessons-further') {
      if (fragment.dataset?.lfStep === undefined) return

      const stepEl = fragment.querySelector('.lf-step')
      const reg    = fragment.querySelector('.lf-reg-block')

      if (stepEl) {
        gsap.to(stepEl, { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out', delay: 0.05 })
        gsap.fromTo(
          stepEl.querySelector('.lf-indicator'),
          { scale: 0.35 },
          { scale: 1, duration: 0.45, ease: 'back.out(2.2)', delay: 0.2 }
        )
      }

      if (reg) {
        gsap.to(reg, { opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.05 })
        gsap.from(reg.querySelectorAll('.lf-reg-item'), {
          opacity: 0, x: -18, stagger: 0.1, duration: 0.38, ease: 'power2.out', delay: 0.28,
        })
      }
    }
  })

  deck.on('fragmenthidden', ({ fragment }) => {
    const slideId = deck.getCurrentSlide()?.id

    // ── Timeline reset ────────────────────────────────────────────────────────
    if (slideId === 'timeline' || slideId === 'timeline-2') {
      const step = fragment.dataset?.tlStep
      if (!step) return
      if (step.startsWith('act')) {
        const act = fragment.querySelector('.tl-act')
        if (act) gsap.set(act, { opacity: 0, scaleX: 0.45 })
        const firstScene = fragment.querySelector('.tl-scene')
        if (firstScene) {
          gsap.set(firstScene, { opacity: 0, x: 0, y: 0 })
          const dot  = firstScene.querySelector('.tl-dot')
          const line = firstScene.querySelector('.tl-line')
          if (dot)  dot.classList.remove('tl-dot-pulse')
          if (line) gsap.set(line, { scaleY: 0 })
        }
      } else {
        const scene = fragment.querySelector('.tl-scene')
        const dot   = scene?.querySelector('.tl-dot')
        const line  = scene?.querySelector('.tl-line')
        if (scene) gsap.set(scene, { opacity: 0, x: 0, y: 0 })
        if (dot)   dot.classList.remove('tl-dot-pulse')
        if (line)  gsap.set(line, { scaleY: 0 })
      }
      return
    }

    if (slideId === 'attack-vector') {
      if (fragment.dataset?.avStep === undefined) return
      const node = fragment.querySelector('.av-node')
      const connector = fragment.querySelector('.av-connector')
      if (node)      { node.classList.remove('av-node-active'); gsap.set(node, { scale: 0.3, opacity: 0 }) }
      if (connector) { gsap.set(connector, { scaleY: 0 }) }
      return
    }

    if (slideId === 'lessons') {
      const item    = fragment.querySelector('.ll-item')
      const verdict = fragment.querySelector('.ll-verdict')
      if (item) {
        gsap.set(item, { opacity: 0, x: 32 })
        gsap.set(item.querySelector('.ll-num'), { scale: 0.5, opacity: 0.25 })
        gsap.set(item.querySelector('.ll-fix'), { opacity: 0 })
      }
      if (verdict) gsap.set(verdict, { opacity: 0, scale: 0.97 })
    }

    if (slideId === 'lessons-further') {
      const stepEl = fragment.querySelector('.lf-step')
      const reg    = fragment.querySelector('.lf-reg-block')
      if (stepEl) gsap.set(stepEl, { opacity: 0, x: -32 })
      if (reg)    gsap.set(reg, { opacity: 0 })
    }
  })
})
