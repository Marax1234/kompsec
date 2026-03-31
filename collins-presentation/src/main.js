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

        // ── Stage container for all cinematic elements ────────────────────
        const stage = document.createElement('div')
        stage.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9998;pointer-events:none;overflow:hidden;'
        document.body.appendChild(stage)

        // ── Plane ─────────────────────────────────────────────────────────
        const plane = document.createElement('div')
        plane.textContent = '✈'
        plane.style.cssText = 'position:absolute;font-size:80px;line-height:1;color:#fff;text-shadow:0 0 24px #fff,0 0 8px #ccc;'
        stage.appendChild(plane)

        // Enter from right side, fly left then nose-dive
        gsap.set(plane, { x: W + 80, y: H * 0.28, scaleX: -1, rotation: -8 })

        gsap.timeline()
          .to(plane, {
            x: W * 0.25, y: H * 0.40, rotation: -14, scaleX: -1,
            duration: 1.1, ease: 'power1.inOut',
          })
          .to(plane, {
            x: W * 0.07, y: H * 0.80, rotation: -70, scaleX: -1,
            duration: 0.5, ease: 'power3.in',
            onComplete() {
              plane.remove()
              avCrashExplosion(stage, W * 0.07, H * 0.80)

              // Red screen flash
              const overlay = document.createElement('div')
              overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#E63946;pointer-events:none;opacity:0;z-index:9999;'
              document.body.appendChild(overlay)
              gsap.timeline()
                .to(overlay, { opacity: 0.55, duration: 0.07 })
                .to(overlay, { opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => overlay.remove() })

              // Drop bombs with stagger
              ;[0.28, 0.46, 0.62, 0.38, 0.54].forEach((fx, i) => {
                gsap.delayedCall(0.2 + i * 0.22, () => avDropBomb(stage, fx * W, H))
              })

              // Shake fragment
              gsap.timeline({ delay: 0.15 })
                .to(fragment, { x: -11, duration: 0.05 })
                .to(fragment, { x:  11, duration: 0.05 })
                .to(fragment, { x:  -8, duration: 0.05 })
                .to(fragment, { x:   8, duration: 0.05 })
                .to(fragment, { x:  -4, duration: 0.05 })
                .to(fragment, { x:   0, duration: 0.05 })

              gsap.delayedCall(5, () => stage.remove())
            },
          })
      }
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
