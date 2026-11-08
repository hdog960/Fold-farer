# FoldFarer: The Unfinished World

An original, iPhone-first papercraft storybook RPG in development.

## Install on iPhone — permanent Home Screen shortcut

1. Open **https://hdog960.github.io/Fold-farer/** in **Safari**.
2. Tap **Share** (square with upward arrow) → **Add to Home Screen** → **Add**. If prompted, leave **Open as Web App** enabled.
3. Tap the new **FoldFarer** icon on your Home Screen and rotate to **landscape**.

**Updates:** Keep the existing icon. When you open FoldFarer while connected to the internet, the application checks for the latest GitHub Pages files and downloads updates automatically. You never need to reinstall for ordinary game updates. If an update was published while you were playing, close and reopen the Home Screen app to load the updated version. Offline use continues with the last cached build; iOS controls when to wake apps, so updates cannot be guaranteed while the game stays closed/offline. Do not clear Safari website data if you want to retain the current local preview save.

**Current playable review:** [Open First Fold 0.14.0](https://hdog960.github.io/Fold-farer/) (GitHub Pages; availability depends on Pages publishing the main/root source).
**Creative source of truth:** FoldFarer Master Game Design Bible v1.0 (2026-11-06), retained separately by the creator.

## First Fold — what this build is
An **interactive aesthetic review preview**, not the completed Milestone A vertical slice. Open in iPhone Safari landscape. Tap **Open the Book**, speak to Morrow, Mend the broken bridge, meet Mila, and battle a Paper Scrapper using timed action commands. All stage scenery and characters are original vector artwork created directly for this game; there are no Nintendo assets.

**Enter the workshop:** approach the Threads shop door from the village's walkable back lane and tap ACT. Explore a second 2.5D room, inspect the stitch loom, then exit through its near-side door. Progress saves across rooms.

Movement: on-screen four-way D-pad (or WASD / arrow keys), including walking **into and out of the screen**. Tap a walkable spot in the village to walk there; the character stops at obstacles. Four-way authored character presentation, perspective scaling, dynamic depth sorting, environmental collision, and bridge-only river crossing have been implemented. Action: ACT or Space. Journal: ☰ or Escape.
The first-fold checkpoint is in browser localStorage. A full versioned IndexedDB save, backups and migration system remain planned.

## Strict milestone gate
**Milestone B is LOCKED** until Milestone A reaches full vertical-slice scope and the creator signs off on the real in-game aesthetic. A static picture cannot substitute for interactive capture and on-device testing. Target art rubric: at least 90/100, with no failed category.

## Working on the source locally
This static preview has no mandatory runtime dependency or subscription:
- Serve the repository root with any local HTTP server (e.g. python3 -m http.server 8080).
- Open http://localhost:8080; secure-origin service worker installation requires HTTPS or local trusted context.
- Run npm test for source/structure smoke checks (Node 22).
- On GitHub Pages, publish from the main branch root, using /Fold-farer/ as the repository base path.

## Project status and audit trail
See [docs/BUILD_STATUS.md](docs/BUILD_STATUS.md) for implemented, unverified, and missing features. Phase 00 and the larger Milestone A are incomplete. The full original narrative, approved sprite sheets, production art and all major RPG subsystems are yet to be built.

**No pay-to-win, mandatory ads, subscription, or Codex/Work/Vercel dependency.**

### Art standard remains locked
Build 0.4 adds original paper-fiber materials, roof shingles, layered hills, hand-veneered tree canopies, stitched village decoration, gentle petal animation, richer Threads workshop fabrics and Tavi coat embroidery. These are actual gameplay graphics. The production-quality character atlas and final visual rubric are not yet approved; Milestone B remains locked.

### Milestone A art integration — v0.5.0
Mila and the Paper Scrapper have individually authored papercraft character designs with animated details. The battle uses the same actor artwork as the traversable village, and dialogue speaker portraits use real game sprites. There are no isolated concept images or separate generic battle placeholders. **This is still an art prototype, not the approved release standard.**

### Milestone A direction art — 0.6.0
The main playable Tavi character now has **five separately authored paper-art poses** (front, back, side, front quarter, back quarter). Horizontal mirroring makes these face both left and right: diagonal movement uses real diagonally authored artwork instead of sliding a flat side view around the scene. Continue using the existing Home Screen icon.

### Living ink-bird companion — v0.7
After meeting Morrow, the real ink-bird game actor follows Tavi over the 2D field (not a fixed decoration). Morrow trails behind, changes scale with physical depth, sorts in front of and behind scenery, travels into the Threads workshop, and can still be spoken to when nothing else is closer. Its portrait now references stable local artwork even while moving. Older saves resume following immediately.

### Art checkpoint 0.8 — The stitched Foldline bridge
The river is a layered paper cutout with animated ink reflections, torn leaflet pieces, stitching and a multi-piece collapsible Mending bridge that unfolds into a solid 3D-looking paper footbridge. Repair it in the real playable scene; the logic and artwork share one saved Mending state. Milestone B remains locked pending creator visual inspection.

### Foldline animation 0.8.1
Needle Strike, Morrow's Ink Needle, Fold Cover, Guard, incoming hits and the Scrapper's paper-burst defeat now produce authored paper-diorama effects in battle. Perfect timed hits create a stronger glint. Reduced-motion settings suppress active animation without changing gameplay.

### Botanical material & walking animation pass — v0.9
The old repeated green-circle trees have been removed from the Folio's backdrop. There are now **eleven individually authored cut-paper trees across five distinct silhouette families**: layered maple, drooping willow, stepped ink pine, stitched blossom, and fruit-bearing broadleaf. Each has local material/leaf variants, split trunk and a subtly hinged paper crown; the garden remains decorative and does not add hidden collision. Tavi's walking cycle now alternates legs and shoulders, moves cloth hems, and releases faint paper dust. Ground taps animate Tavi correctly even before Morrow has joined the party. The art is still undergoing Milestone A approval.

### Milestone A architecture pass — First Fold 0.10.0
The **real playable Folio** now includes four individually hand-authored dimensional papercraft building overlays: book-binding ribs and shutters on the Folio house, tailored doorway and spool accents at Threads, bound cardboard roof and planter details at Post, and layered edge panels on the fourth house. This artwork is integrated in-game, behind physical characters and quest signs. SVG detail does not intercept interaction/collision and keeps existing saves/Home Screen install. This is **still not** the approved Milestone A aesthetic. The major character animation and scene-art acceptance gates remain open.

### First Fold 0.11.0 — A real second outdoor exploration level
The North Terrace is a third playable scene (beside the Folio village and Threads workshop). Access the visible **NORTH** paper arch between Threads and the river. It has a deep walkable 2D footprint from Y400 to Y770, an original layered paper skyline, folded side buildings, a physical archive bell, lantern, memory kiosk, and ribbon tree; the hero and Morrow scale and occlude by foot depth. Interact with the bell, kiosk, tree, or descend back to the Folio. Existing save progress works, the area is stored in the same save format, and the game remains free on GitHub Pages. This is Milestone A visual exploration, not a Milestone B release.

#### 0.11.1 visual acceptance follow-up
Reworked the left-facing far Tavi transform to mirror only the locally authored sprite, instead of reversing the entire projected game-world actor. The entrance/exit prompt and objective are shorter and use a terrace-specific layout on landscape iPhone screens. Added real-browser checks for remote hero visibility, 2D tap-to-walk and mobile prompt boundaries. This is still an unfinished artwork milestone.

#### 0.11.2: Character foot-anchor regression fix
A real screenshot test now ensures Tavi's feet align with the world position when he moves deeply into the North Terrace. The previous perspective CSS placed the far actor outside the scene despite correct saved coordinates. This fix is applied to all locations and has dedicated browser checks.

### 0.12.0 — North Terrace handmade art finish
The terrace is no longer two blank paper-walled buildings around a staircase. The **Ink Dyer's Nook** now has handmade fabric rolls, paper seams, dye-board signs and material trim; the **Vellum Conservatory** has layered vellum window glass, shutters, raised binding edges, plants, and an asymmetrical herbarium box. Perspective paving has individual carved emblems, paper tile nicks and planted corners rather than a generic repeating checker. Two original physical furnishings—the dyer's work bench and a cabinet of returned letters—are painted and placed on the real actor depth stage; they block only their base footprints and can be inspected without changing quest progress. Tavi blinks in actual walking poses, and the terrace lantern glows subtly. Reduced-motion accessibility remains supported, with no changed saves or Home Screen address.

### First Fold 0.13.0 — grounded, distance-driven movement and Mending
All five original directional Tavi illustrations now use four discrete illustrated sole-contact states. Strides advance from actual distance rather than independent time-based leg swinging, reducing sliding when collisions stop the actor. Arms, scarf, coat and ground impressions follow the moving pose. The mended river bridge now receives Tavi's on-stage needle-and-thread flourish, with progress saved before animation ends. The real-browser screenshot pipeline verifies a live Mending frame, completed gesture and save integrity. Same Home Screen icon, same old preview save key, no cost or new app.

**Visual acceptance:** Still in progress; not the approved production sprite atlas or the final Milestone A standard. Physical iPhone inspection is outstanding.

### First Fold 0.14.0 — The lived-in North Terrace (Milestone A illustration pass)
The actual playable North Terrace receives an original dimensional art pass: the Ink Dyer's Nook has a three-layer folded awning, three differently shaped hand-dyed silk samples and an individual bobbin shelf; the Vellum Conservatory gains pressed-flower glazing, plant silhouettes, glasspaper reflections and a botanical specimen ledge; and the far arch carries custom brass page-bolts, underside shading and carved edging. Warm, transparent afternoon bounce light responds slightly to stage parallax without moving collision or character positions. Every component is original SVG integrated into the real game, not an independent concept image. Automated real-browser captures are stored in screenshots/23-terrace-material-light.png. The iPhone Home Screen URL and original localStorage save key stay unchanged.

**Aesthetic verdict remains NOT APPROVED.** This gives the physical scene more material character but does not replace the eventual production-quality animated character atlas or the full Milestone A 90/100 acceptance check. Physical-device testing remains pending.

### First Fold 0.15.0 — Animated ink-bird silhouettes and foot grounding
The actual playable Morrow actor now has four complete original illustrated wing-pair frames, each with distinctive feathers and quill marks. A six-beat animation cycle selects one real frame at a time while preserving head, body, paper details and story portrait. In the field, the bird rises and settles above a separate stationary, depth-scaled shadow; Tavi also has a new unmirrored floor contact shadow. A movement correction prevents Tavi from playing walk frames when solid collision or map edges stop his coordinates. Phone controls, old saves, existing quests and Home Screen installation stay the same. A new real-browser snapshot of Morrow's alternate flight frame is generated by the screenshot workflow.

Art approval remains pending: these are improved original prototype flight frames, not the entire production-ready character atlas. Real-iPhone QA is not yet complete.

### First Fold 0.16.0 — Eight-frame Tavi movement atlas across all five views
The field character no longer relies on rotated copies of the same shoes while walking. The source SVG now contains **40 original individually drawn lower-body movement cels**: eight calf/shin/boot silhouettes each for front, rear, side, front-quarter, and rear-quarter walking. Every contact pose redraws bent shins, boots, highlights, bindings and both soles; the upper-body artwork retains the original silhouette and facial identity. The active cel advances from *real distance traveled* through the existing collision system, so feet stop when a wall stops movement. No image matte, opaque PNG background or stretched character scaling is introduced. The animated boots remain correctly attached to the world-space foot anchor and its perspective scaling in the actual playable world, while the static source sprite remains available to dialogue and combat portraits. Normal-motion browser QA captures the actual side, quarter-back and front walking poses; reduced-motion still provides a planted frame.

The visual goal is not complete: this is an illustrated **lower-body frame atlas**, not the final full-body professional animation sheet with expressive garment, hair and head poses. Milestone A still requires extensive artistry, environmental work, and your explicit approval before Milestone B.

### First Fold 0.17.0 — authored upper-body walking illustrations
The playable protagonist Tavi now has **40 additional authored SVG upper-body poses**, corresponding exactly to the eight discrete lower-body frames in each of five directional views. Every active pose includes its own coat fold silhouette, sleeve and hand positions, shoulder cuts, flowing scarf tail, stitched trim and subtle hairline accents. This deliberately **replaces** the old stationary coat and rotating sleeve groups while the player walks; the standing character art, facial identity, body proportions and battle/dialogue sprite reuse stay unchanged. The original 40 boot/leg cels from 0.16.0 remain and the same real-world movement-distance counter selects both halves synchronously—no CSS stretch of the entire actor, no isolated concept renders, no white pixel matting. Browser verification captures live side, front and rear-quarter movement in screens 28–30 and asserts that upper and lower frames advance together.

This is a substantial prototype animation improvement, **not** an artist-approved 40-frame full-body production atlas. Animation timing, turning, special interactions, multi-character acting and unified paper-material lighting still need work. Milestone A remains in progress; Milestone B remains locked until creator approval. iPhone physical-device verification is outstanding. No save schema or Home Screen URL changes.

### First Fold 0.18.0 — Expressive original world-character acting and paper pivot details
Tavi's actual field artwork now includes twelve new illustrated facial acting cels: curious, pleased, concerned and determined in front, side and front-three-quarter view. These are custom eye, eyebrow and mouth silhouettes—not a texture made to grow or rotate. Each expression has drawn open/closed speaking mouths, selected by explicit story cue or dialogue context in the running game. The original idle illustration and combat/dialogue artwork remain in place. Changing direction during actual movement also triggers three small hand-drawn paper-hinge/foot-pivot accent frames, attached to the world-space actor rather than the UI. The flourish ends automatically after ~156 ms, reduced-motion disables its motion, and the system preserves all collision and save state. These gestures improve the actual playable scene but are not full-body anatomical turning frames. Same iPhone Home Screen URL, no paid services.

**Milestone A artwork not yet approved.** This incremental acting pass does not meet the final production-animation standard. Remaining: complete between-angle character turns, richer companion expressions, lighting harmonization and physical iPhone validation. Milestone B stays locked.

### First Fold 0.19.0 — Full-figure turning studies and Morrow's expressive dialogue
Tavi now has six original, individually outlined transition frames (three frontward, three rearward) that replace the **entire** default body drawing while the player changes direction. Every intermediate cel paints both boots, legs, coat panels, scarf, hands, hair/head, and sewn satchel in anchored SVG space; the body itself is not globally rotated, stretched, or shifted away from its physical foot position. On turn completion the matching established five-direction walking/standing artwork returns. Turning is 156 ms and respects reduced motion. These are genuine new whole-character intermediate drawings, but do not yet constitute production-quality interpolation for all eight angular changes.

Morrow now has six additional facial cels: attentive, alarmed and delighted moods, each with closed/open beak artwork. The game chooses reactions from dialogue and animates the talking beak only while Morrow is speaking. The original eye/eyebrow/beak artwork is hidden while reactions are active, preventing double eyes and overlapping mouths. The resting face returns when dialogue ends. New browser acceptance checks verify actual full-body SVG rendering and in-world reactions, with screenshots `33-tavi-fullbody-direction-turn.png` and `34-morrow-live-dialogue-reaction.png` generated from gameplay. All quest, battle, saves, scenes and Home Screen URL are preserved; no additional paid tooling.

**Milestone A remains visually unapproved.** This is original in-game character art improvement, not the final quality gate. Detailed anatomically consistent rotations through every intermediate facing, broader companion acting, environmental lighting consistency and real-device iPhone QA remain to be completed.
