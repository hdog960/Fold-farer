# FoldFarer — live development status

## Aesthetic review build 0.1.0 (Milestone A, IN PROGRESS)

**GitHub repository:** https://github.com/hdog960/Fold-farer
**Candidate GitHub Pages URL:** https://hdog960.github.io/Fold-farer/

### Implemented in source
- Original layered SVG village illustration, near/far scenery, textured material palette, lighting, characters and shop details.
- Moveable Tavi with walk, scarf and arm animations in the landscape village, arrow controls, keyboard fallback, collision boundary at unrepaired bridge.
- Dialogue with Morrow and Mila, authored original opening scene, objective tracking.
- Authored Mend interaction: folded bridge animates, crossing collision changes.
- Deterministic first Paper Scrapper encounter, timing strike, Morrow Ink Needle, Fold Cover, Guard, retry and victory narrative.
- One localStorage preview checkpoint, in-world journal, restart confirmation.
- Manifest, installable static app shell candidate, service worker candidate for offline revisit.
- Reduced-motion CSS support, landscape orientation prompt.

### Not complete, not claimed
- This is not the 30–60 minute polished vertical slice in Phase 07.
- Art is code-drawn prototype artwork, NOT approved character turnaround/production atlas art, and has not passed the 90/100 visual gate.
- No dedicated finished character sprite atlases, multiple biomes/indoor scenes, extended quest graph, or full miniboss.
- No IndexedDB/manual save/export/migration, battle simulation test suite, recorded device performance, external licensing review, or Phaser/Vite/TypeScript pipeline.
- iPhone Safari/Home Screen behavior and accessibility are NOT yet physically verified.
- Pages URL and published availability must be verified separately, not inferred from a successful commit.

### Review rule
Milestone B remains LOCKED. The creator must personally assess the aesthetic of a real playable build. Fixes continue within Milestone A until accepted. Never substitute a static concept painting or this source check for actual on-device QA.

### Next checks
1. Confirm GitHub Pages build reaches the current committed index.html.
2. Open on real iPhone in landscape; inspect relative scale, texture quality, animation, z-order and text readability.
3. Play entire preview: Morrow -> seam -> Mila -> Scrapper -> ending; reload once during progress.
4. Capture real gameplay screenshots, establish device FPS/texture memory, record aesthetic acceptance/rejections.
5. Continue phases 00–07 to full scope before proposing Milestone B.

## Home Screen installation/update support
- Apple web-app metadata, PNG icon generation workflow, manifest icon sizes, and one stable Pages URL.
- Network-first service worker bypasses HTTP cache when online and keeps an offline fallback. Browser checks for worker updates when launched/resumed.
- iOS will load new published files when the app is next opened online; no reinstall is required. Background update while closed/offline is not guaranteed.
- iPhone on-device installation and actual cache/update behavior still need physical verification.

## First Fold 0.2.0 — walkable depth phase (Milestone A)

- Replaced left/right-only travel with an 8-way combined axis movement model, four-button iPhone D-pad, keyboard arrows/WASD, and tap-to-walk.
- Added a real 2D traversable ground footprint, house/propped garden collision, bridge-only crossing, diagonal normalization and directional animation poses.
- Authored original front, back, side Tavi SVG art. No more backwards moonwalking as the character moves away from camera.
- Player scale adjusts by distance to the camera; NPCs and paper props dynamically sort by projected foot depth, producing foreground occlusion.
- Added receding stitched flagstone courtyards, pop-up planter, notice board and bench to make paper scenery feel dimensional; the notice has optional interaction.
- Previous 0.1 local save key intentionally retained. Existing progress migrates the directional field and retains X/Y.
- GitHub Pages Home Screen URL and auto-update mechanism are unchanged; PWA cache bumped for updated scripts.
- Still NOT the visual acceptance target, and does not yet include interiors, free camera, camera-follow scrolling, polished sprite atlases, or the complete Milestone A vertical slice.
- Code automated tests and Playwright screenshots should be checked on latest run; physical iPhone testing remains outstanding.

## First Fold 0.3.0 — rooms, not only a corridor
- Added a separate navigable Threads workshop room, an authentic pop-up paper environment with back/side walls and a receding wood-plank floor.
- Actual entrance/exit interaction with scene transitions while preserving Tavi's quest and level state.
- The shared Tavi actor moves between scene layers, with per-room sorted occluders (loom, thread trolley, dye bench).
- Four-way traversable interior with its own collisions and a small original Mender's Loom discovery and optional collectible.
- The existing level remains a test scene and full 3D geometry is not used. Future rooms and world-map exploration will be developed during Milestone A. Visual acceptance still pending.

## First Fold 0.4.0 — original papercraft art pass
- Scalable hand-authored patterns for paper fibers, roof scales, leaf veins, cloth weave and wood grain applied to actual game geometry; no static concept art substituted.
- More layered distant ridges, varied canopy cutouts, house shutters, stitched roof edging and warm hanging lanterns; courtyard etchings, stones, tiny leaves and drifting motes.
- Improved the Threads workshop with hanging fabric, textile floor, painted lantern glows and a relocated sign; added Tavi coat/satchel details.
- No changes to game saves, original quest or movement; previous Home Screen icon URL maintained and service worker cache bumped.
- ART GATE NOT MET: character atlases, environment richness and animation remain significantly below the envisioned final visual standard; not approved for Milestone B.

## First Fold 0.4.1 — Morrow silhouette correction
- Replaced earlier ear-shaped blue creature with distinct original dark-ink feathered archivist bird: quill-like feather crest, beak, layered wings, stitched feather contours, feet, brass clasp and scroll.
- Separate subtle wing motions with reduced-motion support; retains Morrow actor ID, story, interaction zone and depth sorting.
- New versioned PWA cache, old save key unchanged. Artwork is still prototype quality; visual approval gate not met.

## First Fold 0.5.0 — cast and battle-art consistency
- Replaced the initial one-piece cartoon courier with more detailed original folded-paper Mila: postman's cap, realistic mail pouch, envelope prop, stitched uniform markings, layered hair and blinking.
- Replaced the initial primitive triangle with an asymmetrical folded-card Paper Scrapper sentry with origami helmet, multi-plane body, letter-opener sword and breathing arm.
- Battle presentation reuses the **actual live in-world Tavi and Scrapper artwork** rather than placeholder letter avatar and CSS paper triangle. Dialogue speaker portrait reuses the actual game actors Tavi/Morrow/Mila (with a symbol fallback for non-sprite speakers), avoiding divergent concept/static assets.
- Subtle speaker-specific expression, letter gestures, sword idle and body walk bounce added; reduced-motion mode preserves comfort.
- All previous movement, quest, saves, combat mechanics and iPhone Home Screen location retained. Versioned offline cache bumped.
- Quality gate remains **NOT APPROVED**. These are still vector prototype sprites, with insufficient animation frames, 3D structural depth, character variation and scene complexity relative to target.

## 0.5.1 correctness follow-up — screenshot finding
- Playwright image review revealed Tavi's world translation was leaking into the battle sprite, visibly placing both opponents on the same side. This was a visual failure despite passing gameplay tests.
- Wrapped Tavi directional art in a stable local SVG group and changed battle/dialogue art references to it; the fixed actor anchor is independent of any position or save state.
- Replaced translucent combat backdrop with a fully opaque, authored multi-layer cut-paper battle diorama, hand-cut borders, lantern glow and perspective seams.
- Added regression tests checking the Tavi actor link and local geometry bounds in actual Chromium screenshots, preserving the gameplay and saves.
- The 90/100 creator visual approval gate is still NOT MET.

## 0.6.0 — Three-quarter directional art (Milestone A)
- Authored **two distinct, fully illustrated diagonal-direction Tavi poses** directly in the playable SVG: an approaching/front three-quarter pose and a walking-away/back three-quarter pose. They feature asymmetrical hair and eyes, patchwork vermilion coat, shaped scarf, leather mender bag, seams, a needle, distinct foreground/background layering and independently animated limbs. Left/right mirrors are used only for handedness, not to simulate walking backward.
- Eight-way movement selection recognizes vertical, diagonal and horizontal input, with stronger directional visual fidelity and correct left/right handedness. Existing directional saves remain valid.
- Added automated tests for opposite-direction diagonal movement, combined-axis return, and screenshot capture of the real diagonal art in action.
- GitHub Pages Home Screen URL stays the same; PWA shell cache bumped. No Save Key changes; original progress retained.
- Art gate NOT YET READY: more illustrated camera layers, individual frame atlases, expressive battle animation and visual acceptance review are still required.

### 0.6.0 screenshot and spawn audit
- Moved the **new-game-only** default field spawn to X355, away from the left touch D-pad, keeping existing local saves and player progress unchanged.
- Added automated real browser art captures for both front and back diagonal Tavi poses at visible in-world positions where normal depth occlusion does not hide the character.
- Corrected boot version display from older 0.5 label and bumped offline cache.

## 0.7.0 — Live depth-following paper companion (Milestone A)
- Replaced static post-recruitment Morrow with the same ink-bird actor following Tavi in real time in the Folio and workshop; original fixed spot preserved before recruitment.
- Original Morrow SVG art separated from world transform so portrait remains correct while actor follows. Actor stays depth-sorted relative to props and hero, and scales with walk plane depth.
- Faster subtle feather movement while flying alongside Tavi. Enters/exits workshop with hero, and old save data with Morrow already recruited resumes following automatically. No extra save keys or cloned characters.
- Interactions prioritize real objects and NPCs before optional nearby companion conversation to keep quest flow intact.
- Regression tests assert follower motion, indoor/outdoor scene transfer, real actor portrait, eight-way movement and quest continuity; new Playwright screenshot captures a following ink-bird.
- Aesthetic gate still NOT MET; creator inspection, production animation sheets and more intricate material art are required.

## 0.8.0 — Physically constructed Foldline bridge and paper-water art (Milestone A)
- Replaced primitive blue rectangular river/bridge visuals with multiple paper side faces, inked water layers, stitched bank edges, moving reflected ink, hand-cut scrap pieces and a six-panel 3D-looking bridge with rails, paper hinges, nailheads and patterned deck.
- The repaired bridge still respects the original narrative and deterministic collision: before mending Tavi cannot cross; afterward only the actual deck band permits traversing the river. Fade-and-unfold animation activates when mending; reduced-motion support is preserved.
- The existing iPhone Home Screen URL, checkpoint save schema, story and combat remain untouched; service worker cache bumped.
- ART STANDARD: Not approved. This is a real game-scene art improvement; finished character sprite animation and 90/100 visual rubric remain incomplete.

### 0.8.0 — Walk-plane parallax and bridge correctness checks
- Introduced interpolated parallax on distant folded hill cards tied to Tavi's horizontal/vertical position without dislodging foreground props or changing collision footprints.
- On Mending, the open seam's light pulse fades; the illustrated bridge and gameplay crossing share the same saved state.
- Simulation verifies Tavi cannot cross before repair, can cross after repair at the deck height, and that the seam pulse recedes. Screenshot automation captures both actual torn and repaired game states.
- Browser screenshot tests, not concept art, support the visual audit; physical iPhone QA remains necessary.

## 0.8.1 — Foldline action art, actual gameplay (Milestone A)
- Added original SVG strike arcs, inky feather projectiles, hinged paper cover, guard crest, impact glints and physical paper fragments for defeat to the in-engine Foldline arena.
- Real battle turn actions set corresponding animation states; perfect timed Needle Strikes have stronger impact presentation; incoming enemy action reacts physically, not just as a text/HP update.
- Existing battle mechanics/numeric damage/guards unchanged, and every action remains keyboard and touch usable. Accessibility reduced motion suppresses dynamic sweeps, not gameplay.
- Source tests assert action-state activation, Fold Cover, Guard and defeat effects in addition to original combat outcomes.
- Artwork acceptance still NOT READY. This is a focused real-in-game VFX pass, not a full sprite atlas or final art standard.

## First Fold 0.9.0 — Botanical variety and physical footfall pass (Milestone A)
- Replaced the ten repeated circular garden-tree blobs with eleven individually rendered paper sculptures: five hand-authored silhouette families, each in multiple hand-selected palette/size configurations with unique strokes, vein marks, blossoms or fruit details, folded paper hems and thread seams.
- Paper crowns hinge independently with per-tree staggered motion and no non-deterministic runtime draws. Existing trees are **background decorations only**: they cannot mysteriously block Tavi or shift underlying navigation geometry.
- Introduced independent alternating foot and counter-swinging shoulder animation, coat-hem oscillation, step bounce and paper-dust bursts to the actual Tavi game actor. Accessibility disables movement animations under prefers-reduced-motion.
- Fixed the camera-tap path: Tavi's original in-game SVG transform now updates when moving toward a tapped target even before Morrow has been recruited. Original keyboard/D-pad controls and save schema unchanged.
- Milestone B remains locked. This is still NOT a 90/100 art-quality acceptance: too many world surfaces and animation sheets remain incomplete.

### 0.9.0 real-browser art and touch review
- Capture pipeline verifies eleven authored tree SVGs across five silhouette families.
- With normal motion, tapping ground before recruiting Morrow visibly moves Tavi and activates the articulated farerFootForward leg animation, capturing an actual frame.
- QA also renders 844×390 in Chromium at devicePixelRatio=2 with touch emulation, checks D-pad and ACT stay inside the viewport, and saves a clearly labeled screenshot. Browser emulation is not a physical iPhone test.

## First Fold 0.9.1 — mobile landscape art/UI acceptance fix
- Actual Chromium 844×390 screenshot exposed an objective/logo overlap, oversized on-screen D-pad and action button, and a prompt covering character faces. This was an independently observed **visual QA failure** even though game mechanics and the desktop capture passed.
- Added a height-aware landscape treatment (rather than assuming all iPhones have width below 820 CSS px): hide the chapter chip, move the objective alongside rather than beneath the title mark, reduce the D-pad's visual footprint while keeping 40px touch buttons, tuck ACT into the bottom-right corner, and move interaction prompts above Tavi and Morrow.
- The automated browser now checks the logo and objective do not overlap, as well as whether all touch targets remain inside the mobile viewport. A fresh 844×390 browser capture is required before claiming success. Physical iPhone testing still outstanding.
