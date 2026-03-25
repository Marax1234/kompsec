 Plan: Collins Presentation — Cleaner, Less Overloaded

 Context

 The presentation is well-built but every slide shows all content at once, and several slides try to communicate 2-3
 ideas simultaneously. Goal: apply progressive disclosure (fragments), split overloaded slides, trim bullet density,
 and rewrite titles to active sentences — following kontext.md best practices.

 ---
 Critical Files

 - collins-presentation/index.html — all slides live here (~90% of changes)
 - collins-presentation/src/main.js — remove 5 now-redundant GSAP stagger cases
 - collins-presentation/src/style.css — add 3 small utility classes

 ---
 Changes by Priority

 1. main.js — Remove conflicting GSAP (do first to avoid fight with fragments)

 Delete cases timeline, attack-vector, mitre, threat-actors, lessons from animateSlide(). Keep impact (CountUp) and
 data-leak (Typed.js). Also remove const defaults and unused GSAP calls. The gsap import can stay (no harm, small
 bundle cost).

 Result: animateSlide shrinks to 2 cases only.

 ---
 2. index.html — Structural slide splits

 Slide 4: Collins/MUSE → split into 2 auto-animate slides (vertical stack)

 Wrap in <section class="stack"> with two children:
 - 4A id="collins-muse-overview" data-auto-animate: Title "170 Flughäfen — ein Single Point of Failure" + 2 info cards
 with data-id="card-collins" / data-id="card-muse"
 - 4B id="collins-muse-vulns" data-auto-animate class="slide-orange": Title "Drei Schwachstellen, die 2025 alles
 veränderten" + same 2 cards (dimmed via class="card card-dimmed") + vulnerability 3-column block with each column as
 class="fragment fade-up"

 Auto-animate morphs the shared data-id cards smoothly from full-size to dimmed context as the vuln block comes
 forward.

 Slide 8: Impact → split into 2 slides (vertical stack)

 - 8A id="impact" (keeps existing ID so CountUp still fires): title "29 Flüge gestrichen. 1,5 Millionen Datensätze
 weg." + stat boxes only
 - 8B id="impact-detail": title "BER, LHR, BRU, DUB, CRK — fünf Flughäfen, zehn Tage Chaos" + table with each <tr> as
 class="fragment fade-up"

 ---
 3. index.html — Fragment classes + title rewrites

 Slide ID: timeline
 New <h2> title: Ein gestohlenes Passwort von 2022 löst 2025 Chaos aus
 Fragment change: Each .timeline-item → class="fragment fade-up" (8 items, kept individual — pacing intentional on
   timeline)
 ────────────────────────────────────────
 Slide ID: attack-vector
 New <h2> title: Vier Schritte von FTP-Login zu Totalverschlüsselung
 Fragment change: Each .step-item → class="fragment fade-up" (4 items ✓)
 ────────────────────────────────────────
 Slide ID: mitre
 New <h2> title: Die Angriffskette systematisch: MITRE ATT&CK
 Fragment change: Each .mitre-row → class="fragment fade-up" (6 items, reference slide)
 ────────────────────────────────────────
 Slide ID: threat-actors
 New <h2> title: Zwei Täter, ein Ziel: Everest Group & HardBit
 Fragment change: HardBit card + blockquote → class="fragment fade-up"; Everest card visible first. Trim Everest
 bullets
   from 7→5 (remove "Insider-Rekrutierung" and "Tools: Cobalt Strike" — move to notes)
 ────────────────────────────────────────
 Slide ID: dual-incident
 New <h2> title: Everest verkaufte den Zugang. Jemand anderes drückte ab.
 Fragment change: Arrow div + HardBit card + blockquote → fragments. Italic muted paragraphs at bottom of each card →
   <aside class="notes">
 ────────────────────────────────────────
 Slide ID: legal
 New <h2> title: NIS2, DSGVO, SEC: Drei Rechtsräume, drei Fristen, eine Katastrophe
 Fragment change: Each .card → class="fragment fade-up" (4 items ✓). Trim 1 bullet per card: NIS2 remove supply-chain;
   DSGVO remove "Passagierdaten = personenbezogen"; SEC remove "Materielle Wesentlichkeit bewertet"
 ────────────────────────────────────────
 Slide ID: lessons
 New <h2> title: Was Collins Aerospace hätte wissen müssen
 Fragment change: Top 3 cards (Credential Hygiene, Patch Management, Supply-Chain) → class="lesson-card lesson-critical

   fragment fade-up". Add <p class="fragment fade-in ..."> divider label at grid-column:1/-1. Bottom 3 cards →
   class="lesson-card fragment fade-up"
 ────────────────────────────────────────
 Slide ID: data-leak
 New <h2> title: 1,5 Millionen Datensätze — und 23 GB im Darknet
 Fragment change: Title only; Typed.js terminal already provides progressive disclosure. Optional: top 3 cards →
   fragment fade-up
 ────────────────────────────────────────
 Slide ID: supply-chain
 New <h2> title: Ein Angriff. Fünf Flughäfen. Systemisches Versagen.
 Fragment change: Optional: 2 info cards below SVG → fragment fade-up
 ────────────────────────────────────────
 Slide ID: zusammenfassung
 New <h2> title: keep as-is
 Fragment change: 4 summary boxes → class="fragment fade-up"

 Agenda slide (slide 2)

 Wrap each left+right pair in a single fragment container:
 <div class="fragment fade-up" style="display:grid; grid-template-columns:1fr 1fr; gap:10px 36px; grid-column:1/-1;">
   <div class="agenda-item">01...</div>
   <div class="agenda-item">06...</div>
 </div>
 Parent grid becomes display:contents or restructured to accommodate. 5 fragment steps instead of 10 items dumped at
 once.

 ---
 4. style.css — 3 additions

 /* Card visually recedes on auto-animate transition (slide 4B context) */
 .card-dimmed {
   opacity: 0.45;
   filter: brightness(0.7);
   transition: opacity 0.3s, filter 0.3s;
 }

 /* Top-priority lesson card */
 .lesson-card.lesson-critical {
   border-left: 3px solid var(--red);
   background: rgba(230, 57, 70, 0.05);
 }

 /* Fragment performance hint */
 .reveal .slides section .fragment {
   will-change: opacity, transform;
 }

 ---
 Execution Order

 1. main.js — Remove 5 GSAP stagger cases (safe deletion, verify CountUp/Typed still fire)
 2. style.css — Add 3 classes
 3. Slide 3 (Timeline) — fragment + title
 4. Slide 5 (Attack Vector) — fragment + title
 5. Slide 6 (MITRE) — fragment + title
 6. Slide 2 (Agenda) — fragment pairs (most structural of the fragment-only changes)
 7. Slide 7 (Threat Actors) — fragment + title + trim bullets
 8. Slide 13 (Lessons Learned) — fragment + title + priority styling
 9. Slide 11 (Dual Incident) — fragment + title + move italic text to notes
 10. Slide 12 (Legal) — fragment + title + trim bullets
 11. Slide 4 (Collins/MUSE) — create stack + auto-animate + data-id (most complex)
 12. Slide 8 (Impact) — create stack + fragment table rows
 13. Slides 9, 10, 14 — title changes + light fragments

 ---
 Verification

 - npm run dev in collins-presentation/ — preview in browser at localhost:5173
 - Navigate each slide with arrow keys and spacebar to confirm fragments advance correctly
 - Verify auto-animate morphs cards on slide 4 (overview → vulns)
 - Verify CountUp fires on stat-boxes slide (8A)
 - Verify Typed.js fires on data-leak slide
 - Verify no console errors (GSAP trying to animate elements that are opacity:0 via fragments)