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
        number: { value: 55, density: { enable: true } },
        color: { value: '#00C9A7' },
        opacity: { value: 0.18 },
        size: { value: { min: 1, max: 2.5 } },
        links: {
          enable: true,
          color: '#00C9A7',
          opacity: 0.07,
          distance: 160,
          width: 1,
        },
        move: { enable: true, speed: 0.6, outModes: 'bounce' },
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
    if (deck.getCurrentSlide()?.id !== 'attack-vector') return
    const step = fragment.dataset?.avStep
    if (step === undefined) return

    const node = fragment.querySelector('.av-node')
    const connector = fragment.querySelector('.av-connector')

    // Node pop-in with bounce
    gsap.fromTo(node,
      { scale: 0.3, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.7)', delay: 0.2,
        onComplete: () => node.classList.add('av-node-active'),
      }
    )

    // Connector draws itself downward
    if (connector) {
      gsap.to(connector, { scaleY: 1, duration: 0.55, ease: 'power2.out', delay: 0.55 })
    }

    // Step 4 – Ransomware: red flash + screen shake
    if (step === '3') {
      const overlay = document.createElement('div')
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#E63946;z-index:9999;pointer-events:none;opacity:0;'
      document.body.appendChild(overlay)
      gsap.timeline()
        .to(overlay, { opacity: 0.5, duration: 0.07 })
        .to(overlay, { opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => overlay.remove() })

      gsap.timeline({ delay: 0.35 })
        .to(fragment, { x: -11, duration: 0.05 })
        .to(fragment, { x:  11, duration: 0.05 })
        .to(fragment, { x:  -8, duration: 0.05 })
        .to(fragment, { x:   8, duration: 0.05 })
        .to(fragment, { x:  -4, duration: 0.05 })
        .to(fragment, { x:   0, duration: 0.05 })
    }
  })

  deck.on('fragmenthidden', ({ fragment }) => {
    if (deck.getCurrentSlide()?.id !== 'attack-vector') return
    if (fragment.dataset?.avStep === undefined) return

    const node = fragment.querySelector('.av-node')
    const connector = fragment.querySelector('.av-connector')
    if (node)      { node.classList.remove('av-node-active'); gsap.set(node, { scale: 0.3, opacity: 0 }) }
    if (connector) { gsap.set(connector, { scaleY: 0 }) }
  })
})
