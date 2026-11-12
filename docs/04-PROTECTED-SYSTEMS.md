# FoldFarer — Technical preservation and safe integration

Baseline from verified main as of 2026-11-12: `game.js`, `index.html`, `styles.css`, `sw.js`; Node smoke and simulation; GitHub Pages.

## Protected contracts
- **Save:** `foldfarer.firstfold.0.1` localStorage key; preserve old booleans and coordinates, region migration/fallback, journal and quest checkpoints. Before schema extensions, add roundtrip + migration tests; do not wipe saves for convenience.
- **Locations:** existing Folio, atelier and terrace, their bounds, door/arch crossings, collision props, depth sorting and character Y-scale. Keep touch-control movement and tap-to-walk interactions responsive.
- **Characters:** Tavi five view families, idle/walk/turn/speech/mend, original actor layering and Morrow physical follow/wing/expression and combat involvement. Do not replace with concept art/static sprites.
- **Combat:** working battle action timing, attack/ink/cover/guard, enemy HP, victory/retry and modal control ownership.
- **Mobile UI:** landscape viewport, unobstructed two-thumb grips, readable prompts/dialogue/journal, reduced-motion support, no page scroll during battle.
- **PWA:** existing GitHub Pages base URL, Home Screen install and network-first service-worker offline fallback; cache bump when deployed runtime assets change, check offline regressions. Never tell user to clear Safari site data as a routine update step.

## Standing performance budget
The original SVG scene contained >5,000 path elements with numerous full-group filters/animations and was reported to lag severely on iPhone. The 0.56–0.59 mitigation suppresses redundant frame paint updates and decorative effects on touch devices. Do not undo its coarse-pointer rendering limits inadvertently.

For new content: prefer reusable, efficient markup and reuse appropriate existing layers; avoid per-frame DOM traversal, unconditional large-group transforms, multiple costly SVG group filters, animation across enormous trees, and repeated write-only style mutations. Profile in real browser when possible, compare frame behavior and visibility, maintain character motion.

The official runtime is currently plain JS + inline SVG, not strict TypeScript. Test with the **actual** configured suite rather than claiming a TypeScript build already exists; TS migration is a distinct approved technical decision if proposed later.
