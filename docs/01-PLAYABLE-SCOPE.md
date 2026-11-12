# FoldFarer — Implemented scope, gaps, and preservation inventory

Status: Milestone A interactive review preview | Evidence baseline: main `74c2afd572541aa9f9ca1d74b31eed9a1511e3af`, 2026-11-12

## Actually playable in current source
- Three interactive 2.5D areas: **Folio village**, **Threads atelier/workshop**, and **North Terrace**. There is a genuine walkable X/Y foot plane, perspective scaling, collision footprints, occlusion ordering, area transitions, keyboard and landscape touch controls.
- **Tavi**: five illustrated facing families (front, back, side, both three-quarter facings), independent eight-phase walking cels, expressions, turning and interaction art. **Morrow**: follow behavior, illustrated flight/bank/wing cels, reactions, dialogue and combat action.
- Introductory fixed quest chain: meet Morrow, Mend the paper bridge, meet Mila, fight a Paper Scrapper, see victory and journal/checkpoint. Workshop exploration and several contextual prop interactions are available.
- A compact deterministic turn-based battle: timed attack, Morrow Ink Needle, Fold Cover, Guard, win/retry sequence. It is **not** yet a scalable campaign battle/party framework.
- Local preview save under `foldfarer.firstfold.0.1`; static GitHub Pages app and updateable/offline-capable service worker, cache currently 0.59. Working test simulations cover core progression.

## Not yet a finished RPG
- The complete chapter story, long-form exploration, distinct biomes/dungeons, bosses, varied enemies, substantial quests, character growth, companion recruitment arcs, inventory, equipment, economy, rewards and balancing are not implemented at game scale.
- No robust versioned save migration/backup system yet; no proven physical-iPhone FPS, touch QA, memory consumption, or full user acceptance of the Milestone A slice.
- The current loop is an **introductory demonstration**, not a complete 30–60 minute polished vertical slice and not a full game.
- Art style direction is creator-approved as pleasing, **not** necessarily final quality certification in every scene or explicit authorization to advance phases.

## Preservation inventory
Do not regress: Tavi's five directions/animated atlas, Morrow's artwork and follow/flight, the 3 original traversable scenes, bridge-only crossing, script/dialogue choices and interactions, timing/fold/guard/ink battle actions, landscape controls and two-thumb access, reduced motion, journal, local save key/schema, service worker base path `/Fold-farer/`, Github Pages install URL.

Any new system must be integrated into actual gameplay, not merely described, and should enhance a complete First Fold encounter or narrative beat. Progression beyond this preview requires the correct gate approval.
