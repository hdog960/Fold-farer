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

## First Fold 0.10.0 — Physical Folio architecture (Milestone A)
- Added real constructed paper cut edges, roof card thickness, fold tabs, window shutters and hand-bound side faces to all four original buildings in the playable village.
- Individual details: Folio's spine ribs, loft window and binding steps; Threads' fabric lintel, inset shutters, spool ornaments and entry step; Post's raised roof edge, mailbox awning, window planter and paper arch; fourth building's folded fascia and side binding.
- Art appears behind actual characters/NPCs and scenery signs, and uses SVG vector graphics with pointer-events disabled; no new collision, movement, quest state, storage key or service dependencies.
- PWA cache bumped so the existing iPhone Home Screen icon retrieves latest art when reopened online. Browser capture pipeline checks that all four building groups have nonempty rendered bounds and records the full actual village stage.
- Milestone A approval: **NOT READY.** This is incremental environmental sculpture, not a complete 90/100 visual standard or production-grade animation atlas. Physical iPhone test not performed.

## First Fold 0.11.0 — A genuinely deeper walkable RPG scene (Milestone A)
- Added a connected third stage, the North Terrace, with a physical entrance in the Folio village; exits descend back and maintain original position/state when returning.
- New original 2.5D pop-up scene: three depth-separated mountain cards, a high arched gate with roof paper edges, two visibly three-dimensional side-house facades, floor tiles and steps converging into the distance, clipped stitched ground, hanging pennants, lantern, archive bell, memory kiosk, ribbon tree, and near-edge paper silhouette.
- Unlike the former shallow 216-unit Folio foreground, the North Terrace navigates a 370-unit deep footprint with real X/Y collision and authored elliptical prop footprints. Tavi and Morrow projectively scale and dynamically sort against four handcrafted props; the distant ridge card uses slower parallax and there are no invisible blockers.
- Optional Tavi/Morrow dialogues at the bell, kiosk, tree, and exit. No additional quest progress gates, combat or currencies; main prologue remains unchanged.
- Added save compatibility for the new area (existing saved data defaults safely to Folio), multiroom companion follow, tap-to-walk bounds and automated journey/scale regression checks.
- Milestone B remains locked. The art still awaits creator inspection and production-quality sprite/animation upgrades, so visual acceptance is NOT YET READY.

## First Fold 0.11.1 — Terrace screenshot correction
- Reviewed actual near, far and 844×390 mobile-browser terrace screenshots. The near view has strong visible depth, but the far-left-facing actor was absent from a capture and objective/prompt bubbles covered the gateway.
- Split local art mirroring from Tavi's positive parent translate/scale; battle and dialogue reference the same unmirrored sprite, and both right- and left-facing forms remain grounded to the same foot anchor.
- Shortened the terrace objective and return prompt; assigned the terrace prompt its own right-side panel, out of the central archway. Restored pointer events on the full-screen terrace background to ensure tapping anywhere walkable reaches the world's touch controller.
- Added active browser checks: left-facing hero bounding box, foreground bell ordering, tap-to-walk movement, and mobile objective/logo separation.
- No progress/saves lost; major 90/100 artwork approval gate still NOT MET.

## First Fold 0.11.2 — Visual spatial anchor correction
- Screenshot-based QA identified why Tavi disappeared at the back of the North Terrace: CSS transform-origin:center bottom incorrectly used the whole SVG viewport as the scaling reference, displacing a .59-scaled actor hundreds of screen pixels from its physical location.
- Corrected the Tavi actor to use the SVG viewBox origin (0,0), already the authored foot anchor, with mirroring inside a separate local-art group. Scene depth scaling now preserves coordinates for both left/right movement.
- Added Playwright visual-geometry checks at near and far coordinates using SVG getScreenCTM(). Player's painted feet must remain within measured tolerance of the true physics coordinates, not merely have a positive bounding rectangle.
- Existing saves, inventory, battles and Home Screen URL remain unchanged. Aesthetic approval remains pending.

## First Fold 0.11.3 — No vertically inverted characters
- The new screen-space foot-anchor test exposed an additional SVG bug: using a one-argument `scale(-1)` inverted both X and Y, so a left-facing actor's paper art extended downward, appearing outside the playable scene.
- Switched to `scale(-1 1)`: horizontal character mirroring only, with a positive parent perspective transform at the true foot anchor.
- The automated screenshot must now validate horizontal alignment, vertical foot alignment, and original character visibility at deep distance. This fixes a **rendering defect**, not just a changed screenshot threshold.
- All quest/save systems remain unmodified. Artwork is still not at the user-approved finish target.

## First Fold 0.12.0 — Art-polished North Terrace (still Milestone A)
- Authored two distinctive, asymmetrical building elevations: dyer's fabric-looms, rolled bolt stacks and painted trim to the left; layered vellum greenhouse glazing, paper-bound herbarium, decorative trellis and herb window garden to the right.
- New original carved page-stone paths and embroidered tile motifs respect the existing receding ground perspective; entirely decorative, no extra navigation blockers.
- Added two physical world props with proper elliptical collisions, Y-sort occlusion and original optional story dialogue: Ink Dyer's bench and Lost-Letter cabinet. Existing Morrow/quest loop preserved, with no new save flags.
- Tavi now has discrete closed-eyelid SVG artwork for front/side/three-quarter-forward poses, timed blinking separately from his walking gait; the paper lantern gets independent warm light flutter, both disabled in reduced motion.
- Automated gameplay tests verify new prop collision and open central navigation. Real browser checks verify all major SVG groups have rendered bounds, near hero draws in front of nearby props, far hero behind them, and create distinct original gameplay art captures. No claim of physical iPhone testing.
- **Art approval remains LOCKED** until the creator inspects a production-quality 90/100 in-game scene; Milestone B must not begin.

## First Fold 0.13.0 — Grounded stride/contact and real needle Mending animation (Milestone A)
- Added four discrete, illustrated contact/weight-transfer states to all five existing directional Tavi poses. Actual player displacement selects each step; blocked movement, stops and dialogue cannot trigger autonomous foot sliding.
- Separate hand-drawn left/right sole impressions, coat/shoulder/arm response and dust are coupled to this distance-driven gait. No character art or actor is cloned, and the physics foot-anchor remains unchanged at all scene depths.
- Bridge Mending now animates Tavi's needle and thread in the same live world actor, synchronized to the bridge's unfolding. Quest state saves at the beginning of the flourish, so an iPhone suspend/reopen cannot roll it back. Reduced-motion players get the same state without moving effects.
- Added simulation assertions for illustrated walk frames and gesture completion, plus structural art checks and a real-browser gait check. PWA cache advanced without changing save key, area geometry, combat or progress.
- **Artwork approval not yet earned:** the full production-quality animation atlas, richer environmental illustration, lighting and real-device iPhone validation remain outstanding. Milestone B remains LOCKED.

## First Fold 0.14.0 — Detailed North Terrace sculptural material and lighting (Milestone A)
- Individually painted a projecting dyed-silk awning, three nonidentical hanging silk cuts, bobbin shelf, paper edge details, detailed greenhouse foliage and specimen shelf, custom arch engraving/underside, and broad amber light shafts integrated into the existing playable North Terrace.
- Environmental glass reflections and dye gradients use original SVG material masks. All additions are static facade veneers with pointer-events disabled and **no new collision**; central traversal, world camera, original bridge/quest/battle flags and Home Screen save compatibility remain unchanged.
- Sunlight reacts only modestly to the already smooth distant-card parallax. Its transform is independent of the physical actor and obstacle footprints. No browser-only default widgets or external media are introduced.
- Structural and simulation tests assert illustration IDs, non-blocking CSS, material definitions and light transform. A browser screenshot check verifies nonempty rendered bounds and captures the real stage. Platform/iPhone frame measurements are not yet available.
- **Art acceptance NOT MET:** More detailed character acting, hand-drawn animation atlas, unified light/contact shadows, polished town inhabitants and creator's 90/100 visual approval still required. Milestone B remains locked.

## First Fold 0.15.0 — Character motion and physical-world ground contact (Milestone A)
- Replaced the old single wing shape rotating back and forth with four complete, hand-authored Morrow wing-pair silhouettes and individually drawn feather marks. The running animation loop selects exactly one pair at a time, with a quicker cadence while following or talking. Reduced-motion freezes the original resting pose.
- The airborne body bob is now separate from its grounded shadow. Tavi gained a dedicated world-space, unmirrored shadow anchored under the foot position across all scene perspective scales.
- Corrected map-edge movement reporting to require a genuine XY displacement before a walking stride can continue. Existing collision footprints remain untouched.
- Expanded structural and behavior tests plus an in-browser live flight-pose capture. Same save schema, story state, battle, and GitHub Pages Home Screen URL. PWA cache version incremented.
- Artwork still below the acceptance gate: production-quality hero atlas, environment art and lighting coherence, expressive acting and physical iPhone performance review remain required. Milestone B stays locked until creator approval.

## First Fold 0.16.0 — Original 40-cel Tavi walking atlas (Milestone A)
- Painted **eight distinct complete lower-leg and boot cels in each of five existing directional body artworks**, totaling forty in-world SVG walking poses (front/back/side/forward quarter/rear quarter). Each contains its own shin bend, separate silhouette of each boot, material highlights, footwear seam details and distinctive contact/lift shapes. This replaces old single-leg rotations for active field walking rather than reusing a static sprite.
- Runtime selects the cel by physical distance traveled (15 world units per step, eight-index cycle), not an independent animation timer; all existing ground anchors, mirror separation, perspective transforms, and foot shadows are unchanged. No modifications to battle portrait sprite reuse or saved game schema.
- iPhone reduced-motion users see a stable drawn frame instead of moving limbs. Original field stop/obstacle controls continue to halt steps. Scenery, quests and battles are preserved.
- Extended smoke/regression checks to require eight frames per all five directions and physically grounded source art; browser QA verifies visible cel, proportions and no missing boots for side, diagonal rear and forward scenes. New gameplay screenshots stored under 25, 26, 27 when browser capture passes.
- **NOT VISUALLY APPROVED:** body/garment/hair and turn transitions still need full-frame authored animation, along with lighting and environmental art; physical iPhone device testing remains outstanding. Milestone B stays locked until aesthetic approval.

## First Fold 0.17.0 — Complete moving costume illustration pass (Milestone A)
- Illustrated eight distinct upper-body costume/arm/scarf/hairline frames for each of the five established directional Tavi poses, totaling 40 new upper-body cels. These pair with the 40 physical leg/boot cels from 0.16.0 to form synchronized movement sequences, driven by actual traveled distance.
- The original idle costume and portrait are retained separately; when walking, the static coat, sleeves and scarf are hidden and only one animated upper cel and one lower cel render. Custom mender kit and folded scarf details remain view-specific, with no character-wide scaling, detached shadows or opaque matte image backgrounds.
- Screenshot QA tests 3 real active gameplay views (side/front/back-quarter), verifies upper/lower frame indexes synchronously and tests that standing art returns when movement ends. Structural tests require all 40 upper-body cels and unique costume/sleeve/cloth outlines.
- Same GitHub Pages address and original persistent save format. Incremented offline Home Screen cache revision so existing installs refresh.
- Milestone A **NOT VISUALLY APPROVED**: richer production-quality upper-body acting, turn transitions, distinct expressions, anti-aliasing/art polish, consistent environment lighting and a physical iPhone test remain open. Milestone B remains locked.

## First Fold 0.18.0 — Expressive character acting and articulated paper turn cues (Milestone A)
- Added twelve original facial drawings across Tavi's three visible-face directions, including four distinct eyebrows/eyes/mouth styles per facing: curious, pleased, concerned and determined. Each expression has separate lips-open/lips-closed authored drawings. The live conversation selects a mood from optional authored line metadata or contextual text and resets to normal when the speaker changes or dialogue closes.
- Added three small original paper-hinge and planted-foot pivot accents, selected by game loop time only after actual direction/facing changes. The actual Tavi character retains original shape and world anchoring, with no texture stretching or whole-body spin. A 156 ms pivot ends automatically; reduced motion suppresses it.
- All existing directional walk cels, Morrow wing sprites, saves, fight mechanics, quest flags and world geometry remain intact. Service-worker cache revision increased for the existing Home Screen icon.
- Simulation tests validate expression state, speaker handoff and pivot lifetime. Browser capture checks actual stage expression visibility and non-blocking pivot art; real physical iPhone testing still outstanding.
- Art acceptance **NOT MET**. These are useful acting cels and paper turn accents, not a finished between-angle full-body turning atlas. Milestone B remains locked until creator approval.

## First Fold 0.19.0 — Full-character in-between directions, Morrow dialogue reactions (Milestone A)
- Added six independently drawn Tavi **whole-body** turn cels, three frontward and three rearward. These are newly authored complete character silhouettes, including head/hair, coat layers, scarf, both hands, satchel, independently positioned boots and legs; the prior five directional poses and distance-keyed walking atlases resume immediately when the 156 ms turn finishes.
- Added six original Morrow reaction cels (attentive, alarmed, delighted, each in open/closed beak variants), tied directly to authored game dialogue with clean actor state restoration at speaker handoff and close. No static-wing tricks or cloned portrait overlays.
- Reduced-motion users retain instant authored direction switching without extra turn motion and a stable mouth pose. Collision, 2.5D depth, NPC presence, battle, saves and offline installed Home Screen address are untouched. Service-worker cache revision increments to 0.29.
- Static and simulated tests assert six full-body source frames, six bird acting frames, runtime selection and no overlapping base artwork. Browser gameplay captures verify one visible Tavi turn cel, grounded proportions, Morrow face replacement, and visibility above the dialogue panel. The images are saved as screenshot files 33 and 34.
- **Approval gate not reached:** six intermediate poses are a genuine progression, not a complete professional-grade turn atlas for all eight angles; physical iPhone testing and the remaining visual rubric categories are still pending. Milestone B is locked until creator approval.

## First Fold 0.20.0 — North Terrace constructed folio steps (Milestone A)
- Painted six different full-width paper risers onto the central North Terrace plaza's existing receding walkway: deep exposed cardstock face, recessed shadow, glancing top lip, multi-layer inner fibers/stitch marks, tiny unequal edge tabs and lower shadow. Each tier has individually varying material thickness, lip waviness and hand-placed seam positions.
- Added a restrained golden raking-light layer in the existing parallax-light group. Architectural edges remain fixed on their original walkable world plane; only the lighting drifts slightly. Dynamic characters, sorting, interaction points and physics code are untouched.
- Structural checks verify the six separate physical cut-paper profiles, gradient/material definitions, world paint order and the complete absence of pointer capture. Browser assertions verify large rendered page geometry, true scene participation and a gameplay screenshot at near camera depth; the previously existing far/mid camera and route tests still run.
- Version changed to First Fold 0.20.0 and offline Home Screen cache to 0.30. Same save schema, battles, quest routes and iPhone icon.
- **Art gate not met:** This reduces flatness but does not meet our full environment illustration, visual cohesion, character lighting or real-device iPhone acceptance target. Milestone B stays locked until explicit approval.


## First Fold 0.21.0 — physically built façade edges, ground flora and contact light (Milestone A)
- The North Terrace now has asymmetric, multi-ply cardstock roof edges, explicit roof undersides, shaded cavity/sidewall panels, raised structural ribs, carved window reveals, paper sill thickness and small brass binding points on BOTH actual playable buildings. Original vector paths are grouped as `terracePaperArchitecture`; no external sprites or still images substitute for gameplay graphics.
- Three independently authored ground-art groups (`terraceDyerHerbs`, `terraceConservatorySpores`, `terracePressedPetals`) add pressed plants and scattered paper details directly to the world floor, drawn behind the walls and dynamic actor depth stage. All are pointer-transparent and add zero collision objects.
- Tavi and Morrow now own local SVG ground-bounce illustrations within their original shadow groups. Light strength varies by physical distance from the North Terrace lantern (plus a soft ambient floor baseline), while all character transforms, foot anchors, depth sorting, chase behavior and saves are unchanged. Morrow's airborne contact remains deliberately weaker.
- Added static assertions and real-browser acceptance checks for geometry, paint order, pointer passthrough, and in-stage character contact light. The screenshot pipeline captures `screenshots/36-terrace-architectural-contact-light.png` only from actual running gameplay.
- Version 0.21.0, offline cache 0.31, existing GitHub Pages URL and Home Screen icon unchanged; preview save key `foldfarer.firstfold.0.1` remains stable. No paid dependencies or battle, quest, movement, or save-schema rewrites.
- **Still NOT approved:** These art features reduce illustrative flatness but do not qualify as the full polished, 90/100 Milestone A environment or a device-tested performance pass. Await real iPhone inspection and creator acceptance before Milestone B.


## First Fold 0.22.0 — illustrative landscape art and separate physical depth cards (Milestone A)
- Replaced the North Terrace's repeating triangular mountain strip and floating box houses with original hand-contoured distant paper mountains, shaded curved valley landforms, brush-ink seams, cut-card exposed edges, and two asymmetric hillside landmarks: the bound Bellhouse and a glasspaper conservatory.
- Added a separate `terraceMidgroundCards` plane with a curved retainer wall, original willow/bookleaf trees, cypress leaves, stitched route and hand-detailed side greenery. The middle plane shifts by only part of the far card's perspective parallax, while the real gate, character anchors, collisions and walking floor remain fixed. Background bounds extend past the viewport to prevent card-edge leaks on mobile.
- Redesigned the North Terrace letterpress arch plaque to actually contain its entire name, instead of the previous text overflowing a narrow banner. All new geometry uses original authored SVG directly in-game and catches no touch events.
- Added structural and real Chromium browser verification for group rendering, parallax separation, gate/floor paint order, zero pointer interception, label fit, and a new true-play screenshot `screenshots/37-terrace-illustrated-valley.png`.
- No changes to existing quests, combat, localStorage save key, companion follow, traversal or Home Screen icon. Version 0.22.0; PWA offline shell 0.32.
- **Art quality still pending creator acceptance**: these changes improve scenery composition but are not a substitute for a comprehensive animation/material redesign or physical iPhone testing. Milestone B stays locked.


## First Fold 0.23.0 — two unmistakably different North Terrace façades (Milestone A)
- Added original roof-mounted, woodbound dye-wheel tower to the Ink Dyer's Nook; a physically recessed tinted silk display, hand-cut window reveals, three separately hung animated cloth strips, and a small readable sewn shop tag.
- Added a distinct glasspaper cupola and a broad, arched vellum greenhouse bay to the Vellum Conservatory. Its glazing has individually drawn leaves, pressed flowers, structural paper ribs, specular slits and physical sill layers. A separate herbarium plaque and three individual specimen cards replace lookalike decorations.
- Architecture occupies one original static in-game SVG layer behind depth-sorted characters, with no collision/quest/save changes. Tiny cloth and specimen movement is disabled under reduced-motion preferences. The old Folio and North Terrace controls remain usable.
- New source and real-Chromium tests verify eight nonempty rendered architecture groups, structural order, labels, zero pointer capture, stable geometry and the same character foot positions. Actual screenshot: `screenshots/38-terrace-distinct-shopfronts.png`.
- New First Fold 0.23.0 version and service-worker shell 0.33. Existing iPhone Home Screen icon, GitHub Pages URL and preview save key retained; no paid dependencies.
- **Milestone A remains unapproved** until the creator sees and approves the overall visual quality. These shopfronts deepen the physical scene, but the full 90/100 animation/environment standard and physical iPhone QA remain open. Milestone B is locked.


### First Fold 0.23.1 — unobstructed signage on iPhone
- Reviewed the actual 0.23.0 screenshot and caught the Ink Dyer sign sitting underneath the on-screen movement pad. Moved the entire in-world hanging sign to the clear lane with original illustrated suspension hardware.
- New live Chromium regression compares screen rectangles of shop sign and D-pad, rejecting actual overlap rather than merely ensuring SVG geometry exists. Game logic, collision, saves, and icon untouched. Version 0.23.1, offline cache 0.34.
- Art is still pending 90/100 creator visual acceptance and physical iPhone testing; Milestone B remains locked.


## First Fold 0.24.0 — central world-space composition and open conservatory view (Milestone A)
- The ribbon tree now has a new asymmetrical, windswept cut-paper crown and articulated leaf highlights, shifted northwest **visually only**. Its trunk, collision coordinate (1177,591), depth order and player walking footprint stay entirely unchanged. The purpose is to reveal the conservatory's actual glazed façade instead of layering a generic balloon canopy over it.
- Added `terraceBookbinderWalkway` to the real walk plane after the paving and before the wall/actor layers: perspective-projected long ink shadows for the original lantern, archive bell, dyer's bench, letter cabinet, ribbon tree and gate; two layered gateway cardstock footings; one unique, embossed feather-and-needle folio insignia; and four irregular hand-sutured floor edges. No new hitboxes.
- Reduced the high-contrast repeating paving dashes to make materials and focal architecture more legible. Original assets are SVG physically rendered in game; no concept-art substitution, external textures or new dependencies.
- Source checks and live Chromium geometry checks cover layer bounds, proper paint order, touch passthrough, constant ground and tree anchors, and screen-space canopy obstruction of the conservatory. Screenshot: `screenshots/39-terrace-engraving-and-shadow.png` from actual running gameplay.
- First Fold 0.24.0; Home Screen cache 0.35; existing save key, gameplay, controls, companion animation and GitHub Pages URL preserved.
- **Visual quality and real-iPhone acceptance remain pending.** Milestone B stays locked until explicit creator approval.


### First Fold 0.24.1 — release screenshot composition correction
- The full 0.24.0 real-game screenshot showed a remaining composition issue despite passing geometry: the tree canopy had swung left over the central archive kiosk. Changed its visual subassembly only from a large offset blob to a smaller, higher, coherent canopy, leaving the original tree trunk and solid world-space foot exactly where they were.
- Added a second in-browser, screen-space occlusion gate that checks **both** conservatory glazing and central kiosk remain visually accessible on the actual North Terrace camera. This is not just source checking.
- Version 0.24.1, service-worker cache 0.36, preserving the existing Home Screen icon and all localStorage data. Milestone A stays pending creator art approval and physical iPhone QA.


## First Fold 0.25.0 — paper-material actors, world-ground contact, coherent illumination (Milestone A)
- Inspected the live actor source and discovered Tavi's walking-bounce animation was applied to the entire world-space actor—including its ground shadow—so shadow and figure could float together. The body bob now applies ONLY to `#taviFlip`, while `#taviGroundShadow` stays fixed at the gameplay world foot anchor. Morrow's independently bobbing feather body and fixed shadow remain intact.
- Authored **40 subtle coat-card binding details**, one inside every pre-existing animated upper-body cel across all five authentic walking facings (front, rear, side, three-quarter-front, three-quarter-rear). Separate asymmetric cut-edge highlights, shadowed fold edges, and little needle stitches follow the original per-pose coat shape and animation cels; neither sprite is replaced by a static sticker. Tavi's six full-figure turn cels and Morrow's mood/wing frames remain selectable.
- Morrow now has a handmade inner-feather paper contour and stitched chest/neck highlights placed within his existing real sprite, plus an organically inked floor occlusion. Tavi has two small low-profile boot-contact silhouettes beneath the actual shoes. Both are local authored SVG geometry, not world-sized glows.
- Nearby North Terrace lantern light changes the intensity of subtle coat and feather edge glints, following the same physical distance equation as the existing contact bounce. Alternate Folio and Atelier scenes use appropriate lower ambient values. No collision or saved state changes.
- New smoke and real-Chromium checks cover all 40 exact coat rim instances, five facing families, no globally bouncing shadow, stable world-space parent order, live actor material values, and physical geometry. Real game capture: `screenshots/40-terrace-character-cardstock-contact.png`.
- Package version 0.25.0, service-worker cache 0.37. Existing free GitHub Pages URL, iPhone Home Screen installation, save key and gameplay unchanged.
- **Artwork verdict still pending inspection/creator approval**; real physical iPhone validation remains outstanding. Milestone B remains locked.


## First Fold 0.26.0 — fully integrated watercolor character materials (Milestone A)
- Material overhaul inside existing in-game SVG characters, not a static picture. Tavi's **40 original upper-body walking cels** (five directions, eight frames each) now shade their actual coat shell and inset panel with view-specific, three-stop watercolor gradients; all 40 original frame-indexed scarf components use coherent warm fabric shading. Idle/rest coat panels now match these animated materials so stopping does not reveal a flat old design.
- Tavi's previously circular back-of-head is reshaped into a handmade cut-paper hair crown with three nested inked sections. The front, side, quarter-front, and quarter-rear head artwork receive a consistent painted base plus different local hair outlines; none displaces the true foot anchor, portraits or face-expression frames.
- Morrow's original body and chest now feature indigo and sage tonal volume; all four genuine wing animation poses (left/right wings each) have original wing-paper shading. No CSS wing flipping or static texture substitutions.
- Recolored the existing North Terrace portal's actual outer arch with parchment/wood watercolor; added narrow exposed cardboard cross-sections and hand-drawn ink edges, entirely within the original passable arch footprint. No new collision or overlay intercepts taps.
- Expanded source and real Chromium tests verify 40/40 frame materials, five views, all cloth and wing animation surfaces, correct rear hair shape and physical arch bounds. The generated real-game review capture is `screenshots/41-terrace-watercolor-characters-and-arch.png`.
- Version 0.26.0, offline shell 0.38, existing free GitHub Pages deployment, same iPhone Home Screen icon, saved progress and collision logic. No new dependencies.
- **Milestone A still awaiting the creator's art approval and physical iPhone performance verification. Milestone B remains locked.**


### First Fold 0.26.1 — correct busy hair on actual gameplay screenshot
- Inspected the real in-game 0.26.0 screenshot and rejected the rear hair's thick overlapping stripe pattern: it made Tavi's head resemble a fingerprint instead of a folded-paper hairstyle.
- Re-drew the back-facing crown as an asymmetric cut-card contour with a broken forelock and tapered nape. Removed the two original heavy crossing hair arcs, simplified the overlaid artwork to three restrained hand-inked accents, and kept Tavi's real skull proportions, world foot anchor, 40 upper-body walk frames and all orientation transition art intact.
- Added static and headless-Chromium tests on the actual physical hair bounds, exact 3-strand contour, opacity/edge weights, actor parentage, and pointer transparency. Real-world screenshot `screenshots/42-terrace-refined-hair-and-watercolor.png`.
- First Fold 0.26.1, offline shell 0.39. Current iPhone Home Screen, user save key, collision and combat unchanged. Milestone A visual acceptance and physical device testing remain open; Milestone B remains locked.


## First Fold 0.27.0 — central papercraft construction overhaul (Milestone A)
- Replaced the real North Terrace archive bell prop with a physically assembled open pavilion: dimensional three-face plinth, uneven roof stock, shadowed side columns, suspended copper bell, visible bell mouth, separate clapper and hand-engraved paper seams. Preserved the exact existing bell world origin (719,484), proximity dialogue, collision and painter sorting.
- Rebuilt the existing memory kiosk as an intentionally asymmetrical open-book display with separate curved spine roof, hinged left/right page walls, front/back cover thickness, removable paper tabs and two facing written folio pages. Preserved kiosk world origin (1022,660), lore dialogue and physics.
- Reconstructed the tree's trunk as shaded exposed cardboard with two true branch faces, visible grain, exposed roots and binding stitches. Its original animated foliage assembly, collision anchor (1177,591) and controlled greenhouse/kiosk visual overlap stay fixed.
- Source verification and real-Chromium screenshot audit cover geometry, original anchor positions, layer membership, touch passthrough and surviving Tavi world-space foot anchor. Gameplay capture: `screenshots/43-terrace-archive-papercraft.png`.
- Game version 0.27.0 and offline cache 0.40. Existing iPhone Home Screen URL, save key, quests, interactions and battle systems remain unchanged; no paid dependency.
- **Milestone A visual gate and real physical iPhone QA remain open. Milestone B stays locked until creator inspection and approval.**


## First Fold 0.28.0 — original illustrated North Terrace material pass (Milestone A)
- Replaced the North Terrace ribbon tree's earlier continuous foliage balloon with irregular, layered cut-paper leaf silhouettes, painted feathered vein detail, pressed-petal motifs, recessed darker paper stock and visible lower card edge. Reuses the existing sway animation and unchanged world-space tree foot (1177,591), physical collision and depth painter.
- Re-illustrated the Ink Dyer's deep window with three distinct silhouette-based painted silk folds, hand-ink creases and layered edge shadows, instead of repeating plain strokes.
- Added hand-painted botanical etching and original flowers inside the actual Vellum Conservatory greenhouse bay. Atmospheric watercolor veils live on the original far parallax stage instead of a static background picture.
- Smoke tests confirm all four authored SVG scene groups, no duplicate IDs, fixed original anchors, no altered save key and PWA shell 0.41. Browser screenshot QA can inspect the real scene on every push.
- No new dependencies, charges, touch/collision shapes, save fields or changed gameplay. Package 0.28.0, same GitHub Pages / Home Screen URL.
- Visual quality remains IN PROGRESS; creator aesthetic approval, additional production-grade art and physical iPhone QA are outstanding. Milestone B stays locked.


## First Fold 0.29.0 — rebuilt paper-roof silhouettes and Tavi rear silhouette (Milestone A)
- Reconstructed the Ink Dyer's actual tower geometry into a crooked hand-bound dye-wheel structure: asymmetric high roof with cut-card thickness, recessed circular wheel, deep side wall, individual page-binding ribs and staggered plinth. This replaces the original blocky tower SVG, rather than hanging embellishments on it.
- Replaced the old plain dome conservatory cupola with a distinct articulated glasspaper lantern: split steep paper roof, separate paper-stock side faces, leaded inner glazing, layered foliage silhouettes, patinated metal fittings and a slender asymmetrical botanical finial. Both architectural identities are genuine existing scene elements and remain behind actor depth stage.
- Authored two broad roof-construction layers with distinct physically overlapping paper edges and material shadow: irregular sloped layered dyer roof and curling conservatory eaves; they sit inside the original static paper architecture stage, behind shopfronts and in front of distant cards.
- Improved Tavi's actual rear-facing character art with a quiet, cut-card hair fringe, warm layered highlight and shaded back/nape shapes. It is drawn with the current animated actor, not a UI or screenshot overlay. Existing 40 upper/lower walking poses, direction switches and the foot-ground anchor are preserved.
- Expanded source integrity tests and Chromium geometry/touch screenshot checks; added gameplay screenshot 45 from the actual game. No changed collisions, scene coordinates, story logic, localStorage checkpoint, control zones, Home Screen URL or paid assets. Package 0.29.0, offline cache 0.42.
- Artistic approval is still required; character atlas production, illustration harmony, remaining scene artwork, and real iPhone device QA are incomplete. Milestone B stays LOCKED.


## First Fold 0.30.0 — cohesive Tavi proportions across field, dialogue and turns (Milestone A)
- Corrected Tavi's oversized head-to-body ratio in **all five true field art facings**, at the artwork-group level, around a fixed neck location. The updated SVG proportions share the same 0.88 head scale and -12 unit head translation, without scaling any torso, boot, floor shadow, outer actor anchor or world-position transform.
- Registered the original twelve expressive face drawings across the three visible-face directions to the new physical head volume (rather than letting eyes and lips drift after a silhouette correction).
- Updated the head sections of all six complete hand-authored full-body turn cels (three facing front and three facing rear). They retain their individual poses and current direction-selection timings; turning no longer flashes the old oversized head.
- Brought in-motion hair-detail etchings from all 40 existing upper-body walking cels into alignment with the corrected illustration without replacing or duplicating cels. The 40 original leg/boot cels remain intact.
- Expanded static tests and the true Chromium in-game capture to reject missing directional head groups, mismatched expression transforms, incorrect scale ratios, altered foot transforms, or input interception. Capture: screenshots/46-tavi-proportion-audit.png.
- No altered collision footprints, save schema/key, combat systems, Morrow AI, quest flags, or Home Screen URL. Version 0.30.0; offline cache 0.43.
- **Artwork is still in progress:** This is a proportion and continuity correction, not full-production portrait atlases, animated hair/garment paint, or final character signoff. iPhone on-device QA remains outstanding. Milestone B stays locked.


## First Fold 0.31.0 — authored head motion integrated into all original walking cels (Milestone A)
- Identified and addressed a real animation continuity gap: the already-authored 40 lower-body and 40 upper-body source cels previously moved while Tavi's original head illustration did not have a matching stride-indexed source.
- Added 40 physical in-world head-and-face source cels, **8 distinct poses for each of front/rear/side/quarter-front/quarter-rear**. Each uses the existing proportions and neck reference with small, frame-specific paper offsets and separately shaped crested hair/scalp ink, under a new real SVG atlas. Every cel remains fixed to the same grounded actor as the legs.
- The original five 0.30 static heads, three emotional face atlases and six full-body turning poses are preserved for idle, speech and direction changes. Old 40 per-frame hair-detail overlays are suppressed during walking so they cannot create duplicate linework.
- Sprite choice uses the exact pre-existing distance-driven stride index, not a wall-clock interval. Only one matching head, upper body and leg cel should be visible per stride; reduced-motion users get the consistent zero-stride pose.
- Extend actual Chromium scene test to audit 5x8 combinations and reduced-motion behavior, and capture in-engine moving screenshot 47. Test that input remains touch-transparent, head ratios remain stable, and existing save / movement / collision invariants hold.
- Game version 0.31.0 / PWA cache 0.44. Original URL, saved progress, controls, story, geometry and navigation are unchanged.
- **Not a final art signoff:** 40 new head cels remain simplified hand-authored SVG; high-fidelity full character painting, full ensemble consistency and physical iPhone QA are still required. Milestone B remains LOCKED.


## First Fold 0.32.0 — genuine hand-shaped costume material per walking cel (Milestone A)
- Reworked **each of the existing 40 independently authored upper-body gait cels** with matching custom-drawn and original material relief, not a floating global effect or extra frame count. Five view-specific arrangements and eight stride-specific fold states produce 40 unique paint geometries.
- Every outer coat is now a physically clipped cardstock silhouette, with a dark side ply, softly blended dye-glaze, paper fiber grain, warm inner-facing edge, curved hem, multiple fine hand-ink creases and asymmetrical sewing accents. The clip uses the **exact original coat-outline path for that cel**, ensuring folded wash and edge paint cannot extend outside the body.
- Material layers are ordered between the base coat and its foreground cut-card panels; high-contrast fold accents sit within the coat stage. The actual upper arm, scarf, satchel, ink and head assets remain distinct from those clothes materials.
- Original 40 eight-directionally-indexed (5×8) leg frames, upper torso cels, and head cels retain the exact movement-driven gait clock. Preserves all five idle head facings, facial-expression atlas, turning cels, foot collision and world actor transform.
- Added static per-source tests and real Chromium on-screen 5×8 paint registration/clip/pointer checking, with screenshot 48 and a real character close-up 49. Build 0.32.0, cache 0.45, unchanged save key/Home Screen URL.
- Still not a final production-quality art signoff. Paper material detail, anatomy coherence, true animation fluidity and environment-wide illustration harmony require further work. Physical iPhone Safari tests and author approval outstanding. **Milestone B locked.**


## First Fold 0.33.0 — original sculpted face-and-hand anatomy (Milestone A)
- Actual character foundation redraw targeting the previously identified simplified face, triangular protruding nose and circular mitten fists. This is real in-world SVG art, not a static concept or duplicate overlaid sprite.
- Replaced three forward-facing anatomical skin geometry paths (front/side/quarter-front) in the five independent original idle facings and all corresponding gait-indexed head cels (27 visibly sculpted faces). Faces now have asymmetrical cheek and tapered jaw construction, layered paper-like skin pigment, integrated cheek paint, proper eye lids and softened separately illustrated noses. The rear-view hairstyle remains physically sculpted from earlier art.
- Replaced 80 circular walking hands at the end of each physically animated arm, 10 idle fists and all 12 hands in six authored transitional turning frames with original shaped palms, angled thumbs, separate knuckle contours and inked edge highlights. Each replacement keeps its actual arm endpoint, as well as the game's ground/foot collision.
- Updated the three forward transitional turn-face shapes to match the non-oval portrait silhouette and prevent animation state pops. Preserved six original turn frames, the 5×8 full-body cels, blinking, expressions, cloak and head proportions.
- Source regression tests reject any missing original face variant, wrist silhouette, body/leg frame, duplicated SVG id, old idle or turn fist, or PWA update regression. Actual Chromium browser checks compare visible idle and gait hand anatomy, per-view face bounding boxes and live gameplay close-up, screenshots 50 and 51.
- Version 0.33.0, offline cache 0.46, unchanged free hosting, save schema, touch controls, movement, companion and battle.
- Still **not** visual approval: further character illustration style, complex hair/cloth animation, scenery coherence and on-device iPhone testing remain required. Milestone A continues; Milestone B LOCKED.


## First Fold 0.34.0 — major cut-paper hair and costume cohesion pass (Milestone A)
- Addressed 0.33 close-up's remaining smooth helmet-like hair: rebuilt the *physical source SVG hair silhouette* in front/side/quarter-front/quarter-rear facings and painted new overlapping cards with asymmetric forelocks, independently shaded top ply, edge thickness and slightly different contour per viewpoint. The original corrected rear hair cut remains locked but gains distinct paper locks and split nape contour. Subdued the older redundant in-motion filled hair balloon so it cannot cover the redrawn locks.
- Repeated the actual source-level illustration in five idle poses and 40 stride-indexed directional head cels, with artwork registered to the already existing, grounded body rather than global transforms. Reintegrated the same paper layering in all six original turning head frames (51 character hair art groups total).
- Added 45 tailored layered collar-and-neckline drawings to the original five idle coats and 40 animated torso cels, using sewn-paper edge highlights and asymmetric folds following existing gait offsets. Scarf, mender satchel and hand art are preserved.
- Regression checks verify all physical groups, counts, unique ids, original active cels, untouched world anchor and cache refresh. New Chromium scene test checks on-screen visibility, touch transparency and frame alignment. Screenshots 52 and 53 are generated from the real playable game.
- Build 0.34.0, PWA cache 0.47, same free Pages/Home Screen URL, old localStorage checkpoint, and all working gameplay. Milestone A still requires visual cohesion, professional-level asset quality and real iPhone hardware QA. Milestone B stays LOCKED until creator artwork signoff.


## First Fold 0.35.0 — Morrow companion illustration overhaul (Milestone A)
- Reviewed the actual 0.34 North Terrace capture: Tavi's character has dimensional cut-card details but companion Morrow still appeared flat and owl-like. This round specifically improves visual cohesion between both main characters, without adding decorative map clutter.
- Rebuilt the living Morrow silhouette in its true actor SVG: physical irregular paper-feather body edge, distinct light-facing and shadow-facing cardstock planes, layered watercolor breast plumage, individually inked feather seams, an asymmetrical multi-feather crest rather than ear points, and a dimensionally cut split tail.
- Recut the illuminated paper around both eyes in all seven face treatments: rest plus 6 existing expressive, open-/closed-beak animation cels. Original eye expressions, iris locations, reaction state selection and beak timing stay functional.
- Authored eight new stage-matched paper feather panel constructions within the **actual four left- and four right-wing motion shapes** (three individually drawn feathers each). Existing eight cut-paper wing base shapes, world-follow behavior and wing-cycle animation survive unchanged.
- Added source checks to assert all real physical components and original animation counts. Chromium live geometry QA checks that no paper plate intercepts touch, wings remain in the body and have genuine dimensions, reaction faces remain present, and the original Morrow world anchor is stable. The current real game can generate screenshots 54/55 for creator inspection.
- Package 0.35.0; installed iPhone Home Screen cache 0.48; no changes to save keys, combat, movement, collision, accessibility, or hosting payments. **Artwork not yet accepted. Milestone B remains locked.**
- **Creator's development response rule:** At the end of every FoldFarer development loop, present two actual clickable controls in the response: **Play updated FoldFarer** opening https://hdog960.github.io/Fold-farer/ and **Continue development** sending a new development instruction. The game must actually be updated, tested and pushed each loop unless explicitly instructed otherwise. This preference was reinforced November 8, 2026.


## First Fold 0.36.0 — Morrow silhouette harmony + midground woodland composition (Milestone A)
- Reviewed actual 0.35 Morrow close-up: cartoonish large eyeballs and jagged triangular head crown continued to jar with our illustrated tactile storybook style. Replaced the original crown silhouette with five sweeping, individually shaped ink-paper feathers including colored feather stock, nested depth, paper-edge ink, and painted central shafts.
- All seven Morrow face states (rest + three dialogue reactions with two beak stages each) now use two different asymmetric, feather-masked parchment eye shapes with torn-paper lower contours, nested highlights and individually integrated pupils. This is a physical change *inside each existing animated face*, not a separate non-reactive mask.
- Composed two asymmetric bookleaf groves into the playable North Terrace *true parallax midground plane*, as irregular multi-tone cut-card trees with internal ink/branch and lit-leaf work. These provide a more organic transition from the distant paper hills without changing any walkable geometry or on-screen controls.
- Added static art integration checks and Chromium tests for all seven live facial modes, 14 correct eye masks, preserved wing atlas and geometry, true touch transparency, and in-world placement of both orchard cards. Capture 56 is a complete real game screenshot, 57 is the physical actor close-up.
- Package 0.36.0 / offline cache 0.49. No changing world transform, story, Morrow follower logic, save keys/schema, collision, original sprite atlas, Home Screen URL or paid dependencies.
- Milestone A aesthetics remain in progress; full production-quality painted asset system, depth and physical iPhone QA are still outstanding. Milestone B is LOCKED. Keep end-of-loop controls: Play updated FoldFarer / Continue development.


## First Fold 0.38 — terrace paper contact-light pass (2026-11-08)
- **Actual source edit:** styles.css; added directional contact-shadow separation to the four existing SVG escarpment/woodland groups: terraceEscarpmentBase37, terraceEscarpmentPages37, terraceEscarpmentWildEdges37 and terraceHandcutOrchard36 foliage. Light treatment follows the physical cut-paper layers instead of adding a flat viewport overlay. High-contrast preference disables the new filters.
- **Code commit:** 815de671bfab6c017e3a0ece368ac4a51d444b4c. CSS re-fetched from GitHub after write; four referenced SVG IDs verified in index.html before edit. Existing rules were preserved, and no game.js, collision, save, service worker or manifest changes were made.
- **Not verified:** Node smoke/simulation tests, browser rendering/performance, actual GitHub Pages publishing, and iPhone installation. GitHub combined commit status returned no status checks. Avoid presenting this pass as visually approved or deployed.
- **Next:** Run npm test and capture real village/terrace screenshots; inspect whether filter effects cost too much GPU time on iPhone, especially during scrolling. If costly, replace with authored SVG contact-ink strokes rather than piling on filters. Milestone A and its 90/100 creator art gate remain OPEN; Milestone B LOCKED.


## First Fold 0.38.1 — orchard contact-ink animation performance safeguard (2026-11-08)
- **Actual playable CSS edit:** moved the 0.38 drop-shadow filter from every animated terrace foliage element to its parent #terraceHandcutOrchard36 paper-card group. The original hinged-leaf keyframes remain intact, but the browser no longer has to apply the CSS drop-shadow to each animated leaf. Added a high-contrast override for the parent. No character, input, save, collision, or story logic changed.
- **Code commit:** c7e831a3edebba80683dbf17fdd2d54f2f51b2fe. GitHub source was re-fetched and the exact new selectors and overrides checked after commit.
- **Not verified:** browser frame timings, actual rendered screenshots, npm test, GitHub Pages publication, and physical iPhone performance. This is a code-level optimization hypothesis, not a measured FPS improvement.
- **Next:** run Node smoke/simulation and browser screenshot comparison, then replace any visually heavy terrace shadows with hand-authored ink edges if needed. Milestone A art acceptance is still OPEN; Milestone B remains LOCKED.


## First Fold 0.38.2 — ink-pressed terrace card edges (2026-11-08)
- **Actual integrated art change:** `styles.css` adds subtle rounded ink-press outlines to the existing `terraceEscarpmentPages37` and `terraceEscarpmentWildEdges37` direct SVG paper paths. The existing watercolor fills remain foregrounded via `paint-order:stroke fill`; no new artwork overlays, world geometry, collisions, save state, input targets or animation cycles were added.
- **Source commit:** f42f30c28fbceeba2f3fad5af82d68629d30394a. Re-fetched committed CSS SHA 958d8ef963a586cab7b8c1c0a049bcc164afab27 and verified both target SVG IDs and directly nested paths exist in the playable `index.html`. A deterministic in-memory patch assertion confirmed all previous CSS was preserved byte-for-byte.
- **Not verified:** actual browser appearance, Node smoke/simulation results, physical iPhone performance, or GitHub Pages deployment. Do not claim the artwork is visually accepted based on this CSS source check.
- **Next:** run `npm test`, capture and compare real North Terrace gameplay on desktop and mobile emulation, and review edge ink at different perspective depths. If acceptable, pursue a more substantial illustrated environment/character pass. Milestone A remains OPEN; creator's 90/100 art gate and Milestone B LOCK remain unchanged.

## First Fold 0.39 — original hanging herbarium escarpment cards (2026-11-08; Milestone A)
- **Real playable SVG art:** added `terraceWallHerbarium39` inside the existing `terraceMidgroundCards` paper-plane in `index.html`, ahead of the wild copse. Three distinct west/center/east wall-root hanging botanical compositions use hand-authored curved stems, layered leaf cutouts, ink veins, tiny painted flowers and parchment edge lines; each is separately composed, not cloned symbols. They occupy the illustrated escarpment and remain behind traversable geometry.
- **Art commit:** `7115b619e7554d12eddb3661f7d2fc9ce9b750f7`. Re-fetched `index.html` from main after commit and verified the new blob SHA `f4dbb1e02e84511486c0858418ea209623d2a63f`, all four new unique SVG group IDs, and placement before `terraceWildCopse`. The update was an exact one-anchor insertion preserving all existing source text.
- The entire group is `pointer-events="none"` and `aria-hidden="true"`; no save keys, JS, character atlases, quest, collisions, inputs, PWA metadata, or world coordinates changed.
- **Outstanding verification:** no actual browser screenshot review, measured frame timing, physical iPhone QA or independently executed npm tests in this run. Check GitHub Actions and Pages separately; a committed SVG does not establish visual quality or successful deployment.
- **Next:** compare actual in-engine terrace screenshots with the prior capture, inspect whether the hanging plants overlap the walkable foreground at depth, run smoke/simulation and iPhone-sized visual checks; then refine illustration according to actual evidence. Milestone A remains OPEN, 90/100 rubric NOT achieved or approved; Milestone B remains LOCKED.


## First Fold 0.39.1 — herbarium paper-depth treatment (2026-11-08; Milestone A)
- **Actual playable CSS edit:** three independently authored North Terrace hanging herbarium groups now receive distinct subtle paper-edge contact shadows and rounded vector path joins. The real SVG art remains in `terraceMidgroundCards`; this does not add a screen-space overlay, modify world geometry, input, collisions, animation timing, save keys or quest state. High-contrast mode removes the added shadows.
- **Artwork commit:** `bd321f8344a9294dd1931d7f89d32f874988b009`. Re-fetched committed `styles.css` (blob `4b8bb0a406f40d54124befdd7bb071f4db848e75`) and verified all three selectors; `main` pointed at the art commit at the time of the check.
- **CI/deployment:** Static preview, screenshot capture and Pages deployment for the artwork commit were QUEUED at inspection, not passed. The prior screenshot/documentation commit `d628536` had a failed Pages run; do not claim the new artwork is published until its own Pages run succeeds.
- **Not verified:** npm test execution in this run, actual rendered browser comparison, iPhone Safari/Home Screen or GPU performance. CSS source inspection alone cannot establish visual acceptance.
- **Next:** inspect the latest in-engine screenshots and Pages status, test desktop and iPhone-sized rendering, and replace these small GPU shadows with drawn ink contours if performance is poor. Milestone A OPEN; 90/100 creator visual gate unapproved; Milestone B LOCKED.


## Milestone A herbarium ink-edge optimization (2026-11-09)
- Replaced three GPU drop-shadow filters on the North Terrace herbarium groups with subtle original ink-printed outlines on filled paper shapes only. Existing authored stem strokes remain untouched by selecting paths with nonempty fills. High-contrast mode removes the extra outline.
- Commits: 3778551962f1b7c55c9e5b586cdb20fa07f494c4 (initial change), 53a632ca04727d99caa09c383aadd87b1acb89ec (correctly scope outlines to filled paper paths).
- Verified by reading real index.html markup for the three group IDs and comparing committed stylesheet source. No JS, saves, collision, story, or iPhone PWA files changed. Browser visual inspection, npm tests, physical iPhone performance and deployment still require independent verification. This is a potential rendering-cost improvement, not a measured FPS gain.
- Next: capture actual North Terrace screenshot and run Node/browser QA, inspect paper contours at game scale; continue Milestone A illustration work. 90/100 creator approval NOT reached; Milestone B remains LOCKED.

## First Fold 0.40 — static architectural letterpress ink (2026-11-09; Milestone A)
- Real playable stylesheet update `bccab16d0c31a2d666607658bc2f6588ab2bb46c`: subtle ink-pressed silhouette contours on direct filled SVG paper faces in the existing North Terrace crafted shopfronts, paper architecture, arch-edge relief and constructed tree branches. Original watercolor fills remain visible; no new DOM elements, animation, JS, collision, save, or touch layers.
- Scoped selectors deliberately exclude stroke-only paths, descendants with hand-authored details, and animated actor/foliage layers. High-contrast mode suppresses the extra ink. Read-back verified the new stylesheet blob and all four actual SVG group IDs in index.html; main pointed at the artwork commit at verification.
- **Unverified:** live visual impact and exact SVG per-path appearance, npm smoke/simulation tests, iPhone frame rate/physical QA and Pages publication. GitHub workflow status and actual browser capture require independent inspection. The new ink is a tentative polish pass, not proof of a 90/100 art grade.
- **Next:** compare rendered North Terrace screenshots at near/distant zoom and iPhone landscape; remove any over-inking on authored architectural faces; run tests and verify Pages before further illustration work. Milestone A OPEN; Milestone B LOCKED until explicit creator approval.

## Milestone A 0.41 — terrace paper-contact ink, GPU-filter removal (2026-11-09)
- Replaced four full-group CSS drop-shadow treatments on the playable North Terrace escarpment base, layered page edges, wild cut-paper edges and orchard with direct ink contours on static SVG paper faces. Existing 0.38.2 path-edge ink remains on page/wild groups; the original moving orchard foliage hinge keyframes and watercolor fills are unchanged. No new art DOM, overlay, hitbox, JS, quest, save, or PWA changes.
- Artwork commit: 37f889693ae7bee26728953400fc316d06965205. Re-fetched committed styles.css, verified new 0.41 rules, absence of prior escarpment GPU shadow declaration, and preservation of terraceLeafHinge37 animation. This is a rendering-cost optimization hypothesis, NOT a measured FPS or visual-quality improvement.
- Pending: npm test, actual Chromium/iPhone-sized screenshot comparison, GPU/frame-time measurements, physical iPhone QA and final Pages publication verification. Check that hand-ink contours do not over-outline near/far scenery. Milestone A visual rubric is NOT approved (90/100 target); Milestone B stays LOCKED.

## First Fold 0.42 — three illustrated story-page cliff banners (2026-11-09; Milestone A)
- Added three independently authored in-game SVG hanging story tapestries to the existing North Terrace midground paper escarpment, immediately before the wild copse: river-and-stitch, orchard-and-fruit, and crescent-and-stars. Each uses individually cut cardstock silhouettes, separate vellum faces, hand-painted ink motifs, stitched edging and a distinct hanging pin. No repeated symbols, static mockup or screen-space overlay.
- Art commit `b53a42deeee7e19a3b45e16f42be0690be8ab179`; verified source read-back from main, index.html blob `852ccaa74c728925072ea4e1eb8c8cc5e19f83cb`, unique SVG IDs and midground placement. The change inserted only decorative, pointer-events-none, aria-hidden SVG content; no JS, collision, touch targets, save format or PWA files changed.
- Pending: execute Node smoke/simulation tests, review actual near/far/mobile North Terrace screenshots for visual density and clipping, confirm latest Pages publication, and perform real iPhone testing. This commit does not prove 90/100 art acceptance or measured performance. Milestone A remains OPEN; Milestone B LOCKED pending creator approval.

## First Fold 0.43 — three distinct folded vellum lanterns (2026-11-09; Milestone A)
- Added original world-anchored SVG artwork to the actual North Terrace midground, before the wild copse: `terraceFoldedLanterns43` contains three independently drawn lanterns (spindle, folio and petal), each with distinct cage construction, warm vellum windows, hand-ink ornament, paper seams and separate hanging fixtures. No reused symbols or viewport overlay; art is noninteractive and hidden from accessibility tree.
- Artwork commit: `c388161df51e8721808e33d252c4f8d667ca9cbb`. Re-read committed `index.html` blob `821291584798b3f2253dd52c98722a9ba838a2d1` and verified all four new IDs occur once, positioned before `terraceWildCopse`. No game.js, collision, quests, character poses, saves, touch controls or service worker modified.
- GitHub combined status returned no individual statuses at inspection; this is NOT a test pass or deployment confirmation. Node smoke/simulation, actual browser screenshot comparison, Pages deployment, visual acceptance and physical iPhone QA remain unverified.
- Next: inspect the new lanterns in actual North Terrace captures at near/far depth and mobile landscape for clipping, contrast and overlap; run `npm test` and check Pages workflow before declaring the change live. Milestone A OPEN; 90/100 creator visual acceptance unapproved; Milestone B LOCKED.


## Milestone A — North Terrace vellum lantern light pass (2026-11-09)
- Commit `0369df0` adds three independent, subtle light-opacity rhythms to the **existing actual-game** spindle, folio and petal lantern inner vellum panes in `styles.css`. Their paper cages, hooks, collision, interactions, perspective layers and saved story state are unchanged.
- The CSS selectors were checked against the current `index.html` SVG's exact three lantern IDs and unique pane fill colors; the committed stylesheet was re-fetched and confirmed. The pass uses opacity only, no expensive blurred shadows or screen overlays, and suppresses the animation with `prefers-reduced-motion`.
- **Not yet verified:** `npm test`, actual browser capture, GitHub Pages publish of this commit, and physical iPhone visual/performance inspection. The new animation's aesthetic impact is not an approved art score.
- **Next:** capture a North Terrace browser frame at normal/reduced motion, inspect lantern readability and clipping, run existing tests, confirm Pages deployment, and continue larger original environment/character illustration. Milestone A remains open; 90/100 creator approval has NOT been granted; Milestone B stays locked.


## Milestone A 0.45 — stitched North Terrace banner hinge motion (2026-11-09)
- Actual game stylesheet adds independent restrained rotational sway to the three already-authored river, orchard and moon story banners in the North Terrace SVG. Pivot coordinates use their illustrated hanging pins, with the moon pivot corrected in follow-up. CSS rotates each complete banner as a unit so painted motifs and paper edges stay registered; world collision, hit targets, gameplay, save state, actors and PWA configuration are unchanged.
- Artwork commits: `409f0d798eae3476eaee993c96f71ed6f119e53c` and pivot correction `182c7a89d6e95c365f122f3c7e5ca184b65466f5`. Confirmed all three banner IDs in `index.html`, and read back the committed stylesheet. Motion is disabled with `prefers-reduced-motion: reduce`; decorative banner group remains pointer-events:none.
- GitHub Actions check was queued at first inspection. **Still required:** run `npm test`/browser screenshot QA, visually inspect actual banner movement at mobile landscape size and reduced motion, check successful Pages deployment and perform physical iPhone QA. Source-level selector checks alone do not establish a passing build, visual quality, or measured performance.
- Milestone A remains **OPEN**, 90/100 artwork rubric **NOT creator-approved**, Milestone B **LOCKED**. Next: verify current workflows and real browser screenshots, correct any clipping/unnatural movement, then prioritize larger environmental/character illustration improvements.


## First Fold 0.46 — North Terrace tapestry cardstock finish (Milestone A)
- Artwork commit `4f6455be38cdfd27f273eb2a4acdda932eeb03e0` updates `styles.css` only. Three existing river, orchard and moon hanging banners receive individually colored ink-cut edges beneath painted SVG fills, with no extra filters, collision surfaces or game-state changes.
- Source check: fetched committed CSS; verified selectors and balanced braces. No Node suite, real browser screenshot comparison, physical iPhone check, or deployment verification was performed in this cycle. Visual benefit remains unverified.
- Next: review actual screenshots for excessive dark edges, confirm Pages publication and run smoke/simulation checks; prioritize major character/environment illustration rather than repeated minor outlines. Art rubric 90/100 NOT established; creator approval outstanding; Milestone B LOCKED.


## First Fold 0.47 — compact iPhone landscape control composition (2026-11-09; Milestone A)
- Actual playable stylesheet commit `01a1283e559e019f179a0a25d8a366ea9559b90e` adds a compact-landscape layout for the D-pad and ACT control at viewport heights <=430px. Buttons remain in the existing fixed overlay, tucked closer to lower corners to reveal more of the authored stage; the existing <=340px 36px controls are preserved explicitly. Focus-visible rings remain visible. No change to the SVG world, 2D travel, collision, combat, saves or PWA cache.
- Source-only check: matched CSS braces, verified stylesheet write and read-back. Local git clone/npm tests were attempted but blocked by this runtime's DNS failure resolving github.com. No browser capture, physical iPhone test, or measured control accessibility was performed. CI and GitHub Pages publication require independent confirmation.
- Next: run npm test and browser screenshot QA at 390px/430px landscape heights, check D-pad/ACT against scenery and dialogue; verify latest Pages deployment. Continue substantial original environment/character artwork. 90/100 rubric unapproved; Milestone A OPEN, Milestone B LOCKED.

## Milestone A 0.48 — protect authored tapestry linework (2026-11-09)
- Commit `f8a34295adb97be9b8e65616ddf50b01adac5e91` updates `styles.css`: the 0.46 paper-edge contour selectors now exclude SVG paths that already have an explicit `stroke` attribute, preserving hand-authored outlines and stitched marks instead of overriding them with uniform CSS ink. The existing banner sway, painted fills, hit-testing, gameplay and saves remain untouched.
- Verified stylesheet read-back blob `8fee089dcf1eee45b77cbb9206661725c13a4a2d`, five updated selector occurrences and balanced CSS braces. No local Node tests, rendered screenshot review, Pages deployment verification or physical iPhone test performed; actual visual benefit is unverified.
- Next: inspect newly captured North Terrace screenshots and verify CI/Pages. Prioritize larger original character/environment artwork and the 90/100 creator review. Milestone A OPEN; Milestone B LOCKED.


### Milestone A motion accessibility sweep — 2026-11-09
- Commit `55a2fae4a9b4d8684f1ca0698b93ed4a460238a5` changes `styles.css`: reduced-motion users now receive a still-frame treatment across the actual SVG world and battle-stage descendants, including newer terrace paper foliage and hanging decorations. Bridge reveal transitions are also suppressed; JS story state, save format, controls, and directional frame selection were not edited.
- Source-only review: no local Node suite, browser capture, physical iPhone test, or measured FPS was performed in this cycle. Verify reduced-motion gameplay and timed combat in browser, confirm Actions/Pages, then continue major authored scene and character-art composition work.
- Milestone A aesthetic approval remains pending; 90/100 visual gate unverified, Milestone B LOCKED.

## Milestone A — short landscape dialogue layout (2026-11-09)
- Commit `aff34ce2c68ca5de24b2386d5a0bc4e36cace7a9` updates `styles.css`: at landscape heights <=430px the illustrated dialogue folio uses a capped 46% viewport height, compact portrait and border, internally scrollable copy, and a reachable continuation button. No game JS, save format, hitboxes or character art changed.
- Source-only verification: CSS media rule written to main and readback pending; no browser render, Node test, GitHub Actions pass, Pages publication, or physical iPhone check is claimed.
- Next: verify short-landscape dialogue with long lines and keyboard/touch, inspect actual screenshots, then prioritize substantial directional character/companion and environmental art. Milestone A visual score unverified; Milestone B locked until creator approval.

## Milestone A — compact dialogue scrollport correction (2026-11-09)
- Gameplay stylesheet commit `849fa97a8dda5df8b7086c4fbc347365be9a69c5` corrects the <=430px landscape dialogue copy's flex-centering/clipping risk by making it a shrinkable block scrollport, retaining a visible portrait and continuation button. This targets long story conversations on small iPhone screens; no gameplay, saves, collision or art asset source changed.
- GitHub source read-back confirmed CSS changes and balanced braces. Browser rendering, npm tests, CI/Pages deployment and physical iPhone QA remain unverified; no claim of visual acceptance. Next: inspect a long Morrow/Mila dialogue on landscape iPhone and capture actual game screenshots; continue substantial authored character/environment art. Milestone A OPEN; 90/100 rubric not approved; Milestone B LOCKED.


## Milestone A — Threadfall light on painted water (2026-11-09)
- Commit `15ab005c3bc5046ceb18bf141a1d2c648b2b1229` adds restrained opacity animation to the existing original North Terrace Threadfall water wash and highlight paths in `styles.css`; the cut-paper banks and valley anchor do not move. Reduced-motion users receive static art. No JavaScript, gameplay, collisions, saves, or asset geometry changed.
- Verified stylesheet read-back blob `80188043663e5276ece28d64b78ea64c4055d180`, selectors, and balanced CSS braces before writing. Browser screenshots, Node tests, iPhone testing and Pages publication have NOT been verified.
- Next: inspect real North Terrace screenshots for water visibility, clipping and excessive animation; run `npm test` and Pages workflow checks. Milestone A art rubric remains unapproved; Milestone B LOCKED.


## Milestone A — Threadfall traveling ink-current (2026-11-09)
- Gameplay stylesheet commit `4309cf6dc337b48a7174e520d2dc0ee1bfeb3850` adds flowing dashed highlights to the two existing hand-illustrated white-water strokes inside the real North Terrace Threadfall SVG. The water silhouette, banks, paper-wash layer and collision remain fixed; no game JS, saves, controls or PWA files changed.
- Source inspection verified `terraceThreadfall49` has nine direct SVG paths and the fourth and fifth paths are the intended white-water ink strokes. The new rule uses stroke-dashoffset rather than shifting whole paper layers. Reduced-motion mode restores continuous static strokes.
- CSS braces were balanced before commit; no Node smoke/simulation run, browser animation screenshot, Pages workflow success or physical iPhone testing is claimed. **Next:** run `npm test`, inspect the current in-game Threadfall animation in landscape screenshots for unwanted dotted-looking water, verify Pages deployment and focus on larger character/scene art. Milestone A OPEN, 90/100 creator visual gate NOT approved, Milestone B LOCKED.


## Milestone A — Morrow travel-driven papercraft flight bank (2026-11-09)
- Gameplay commit `ad01df999914a925718a5931973c1f745c0d082e` changes `game.js`: the existing following Morrow character measures actual horizontal travel per frame and applies a clamped ±6° banking angle to the **in-world illustrated bird only**. The turn response is based on real companion movement rather than the hero's facing, avoiding immediate art snapping on direction changes.
- Stylesheet commit `496e74c95433e0c3c2c971f3cac5f75ba2a1a5f1` changes `styles.css`: individual CSS `rotate` is applied to `#morrowSprite`, composing with its existing vertical hover animation. The separately rendered ground-contact shadow and world-space depth transform remain unchanged. `prefers-reduced-motion` forces a still, unbanked bird.
- Static pre-write checks verified unique JS insertion anchors and balanced brace counts in modified JS/CSS. This is **not** a runtime test or proof of visual quality. Existing movement/collision, story, saved data, PWA URL and other games are untouched.
- Pending: run `npm test`, verify in-browser companion motion/portrait and screenshot in all three areas, confirm Pages deployment and physically inspect on iPhone. Art rubric 90/100 remains **NOT approved**; Milestone A open and Milestone B locked. Next prioritize larger complete-character directional artwork and environment composition rather than decorative micro-adjustments.


## Milestone A — Threadfall watercolor/current composition correction (2026-11-09)
- Game stylesheet commit `827c65f9f38f73e81bb5648f6cc44e6bfc3c36b3` corrects a CSS cascade conflict: the later moving-ink animation shorthand had overwritten the earlier hand-painted highlight opacity shimmer on both Threadfall white-water paths. Both now run concurrently as separate CSS animations. The current keyframes animate only stroke-dashoffset while the watercolor highlight controls opacity; the fifth path uses separate reverse-current and alternate-shimmer timing. Existing reduced-motion suppression still disables both. No SVG shapes, story, collision, saves, controls or PWA routes changed.
- Verified latest main and committed CSS blob `9cf3b48cc3c051d2efc689e3fc725904feea2679` after write, including both animation tracks and updated keyframes. This is a source-level check, NOT a browser animation or visual acceptance test.
- Next: run npm smoke/simulation, inspect actual North Terrace screenshot/animation at iPhone landscape sizes for overly dashed white water, verify GitHub Actions and Pages, and continue major original character and environmental illustration work. Milestone A OPEN; 90/100 creator approval NOT reached; Milestone B LOCKED.


## Milestone A — Morrow continuous flight-responsive wing acting (2026-11-09)
- Gameplay commit `7d31eb3456ec3677841b2ecca13f63bb2a736652` updates `game.js`: the existing six-frame original ink-bird wing sequence now advances on a continuous fractional phase rather than sampling `Math.floor(now/interval)`. Switching between idle, following, and speaking therefore retains frame continuity. During following, real companion travel distance drives wingbeat cadence (175 ms/cel at low speed down to 120 ms/cel at higher speed); speaking uses 105 ms/cel and idle 240 ms/cel. Reduced-motion users retain a fixed frame; no new SVG art, transforms, hitboxes, quests, save keys or PWA routes changed.
- Companion horizontal bank remains sourced from actual horizontal travel; an independent instantaneous two-axis speed is now tracked in memory for wing cadence. Teleports between areas and pre-recruitment reset speed to zero; speed is never persisted. This is a meaningful **live character animation** correction, not a finished production-quality frame atlas.
- Verified committed `game.js` blob `2604e1a25c730e04b54a7a443cc2993fe97c8856` on main and exact source anchors. Local clone/npm test attempt failed because this runtime could not resolve github.com; source checks are NOT a runtime test. Browser wing-motion captures, mobile landscape frame pacing, GitHub Actions and Pages deployment need separate verification. Physical iPhone testing outstanding.
- Next: inspect Morrow's full flight loop in actual in-engine captures, run npm smoke/simulation, verify Pages, and prioritize larger character/environment illustration. Milestone A OPEN; 90/100 creator art approval NOT reached; Milestone B LOCKED.


## Milestone A — damped ink-bird flight bank and vertical paper acting (2026-11-09)
- Gameplay commit `66862b931c26f6d2cc3f198fb5ec2de7c4305dd6` updates `game.js`: Morrow's existing travel-responsive banking now eases in real elapsed time instead of snapping to a new extreme when Tavi reverses direction. Actual vertical follower velocity also drives a small, capped ascent/descent paper-sprite offset (±3px), independently from the grounded contact shadow. Both values are transient and reset when the bird is unrecruited, changes area, or reduced motion is enabled. No new save fields, gameplay hitboxes, collision, quests or sprite geometry.
- Stylesheet commit `bcc3a86d13cbba19108e5a7b0afcacb4fb2e15b5` applies the pitch via independent CSS `translate` and removes the older 150ms rotate transition, avoiding compounded CSS and JavaScript smoothing. The world SVG anchor and feather animation remain unchanged. Reduced-motion override explicitly cancels bank and pitch.
- Read-back verified committed `game.js` blob `ecf5a034c9e8254dc5fd7d3ee966b9bb15ea8273` and `styles.css` blob `4bf6580ace38647b473f44c8fa7228ed5f486cba`, including expected flight selectors and state updates. GitHub Actions static-preview, screenshot capture and Pages workflows for the stylesheet commit were queued when checked; **no passing tests, rendered visual review, physical iPhone QA or successful deployment claimed**.
- Next: inspect screenshot workflow results and actual Morrow turns/ascents in browser at mobile landscape size, run the Node test suite, verify Pages deployment, and prioritize substantive new authored directional character/environment artwork. Milestone A OPEN; 90/100 creator art acceptance NOT established; Milestone B LOCKED.

## Milestone A — current-frame Morrow wingbeat synchronization (2026-11-09)
- Playable-game commit `b21a6ccae8de2551b8ff898cd1654add7ebded34` updates `game.js` to evaluate the actual companion follow position/velocity before advancing the six-frame illustrated wing sequence. Previously the wingbeat cadence used the previous frame's speed, lagging rapid starts and direction reversals. Existing drawn wing cels, banking/pitch, gameplay, world depth, saves and iPhone Home Screen path are unchanged.
- Regression commit `a7b977cbca7539eed380ab97820ed3d45c289732` adds a static smoke assertion in `tests/smoke.mjs` enforcing companion motion before wing selection. GitHub source write was confirmed. Local `git ls-remote` failed because the execution container cannot resolve github.com; local npm tests and real browser visual inspection were NOT performed. Check GitHub Actions and Pages independently before claiming runtime or deployment success.
- This is a targeted animation timing correction, not a major new illustration or 90/100 visual proof. Next: review actual Morrow start/stop and turn captures, run full tests and check published Pages; prioritize major original full-body animation and environmental illustration. Milestone A remains OPEN; Milestone B LOCKED pending explicit creator approval.


## Milestone A — blocked-direction illustrated turn response (2026-11-09)
- Playable `game.js` commit `8cdf44fa6a202dd2002738bca6c94bf1c1ec66e1` corrects a visual-input mismatch: when Tavi pushes against a wall or collision, his facing/directional art now updates even if his physical position does not change. The actual `updateCharacter()` path refreshes the original five-direction papercraft poses and turning cels; movement, collision, companion logic, quest state, save schema, and iPhone Home Screen URL are unchanged.
- Regression commit `c8564df29e5448d0839443112b101a02982d1645` adds a smoke assertion that requires blocked-motion facing changes to trigger the live art update. The existing walking-state collision rule still stops leg cycles on blocked steps.
- Verification pending: run Node smoke/simulation suite, inspect live browser capture while pushing into a wall from multiple directions, verify latest GitHub Actions and Pages deployment, and physically test on iPhone. This is a visual responsiveness correction, NOT a production illustration overhaul or proof of the 90/100 art rubric. Milestone A OPEN; Milestone B LOCKED pending creator approval.
- Next: prioritize original full-body character animation and deeper composed papercraft environments; compare rendered gameplay before and after changes instead of repeating minor CSS polish.


## Milestone A — repair failing smoke check for blocked-direction artwork (2026-11-09)
- Actual CI log for run 42746810610 showed `npm test` failing at `tests/smoke.mjs:23`: the test expected the old exact string `else if(modal==='field'&&fieldMotion)updateCharacter()`. The prior 8cdf44f gameplay fix intentionally broadened that branch to also refresh facing artwork when walking is blocked, so the string-only assertion was stale.
- Test commit `ed1cd115b1aa7f4fa840983ab0fe1a3ae5020c77` updates the smoke check to require BOTH real movement and blocked-facing changes in the same branch. Read-back of the committed test and game source confirmed that the new regular expression matches the actual live source; no game runtime, save schema, art assets, or iPhone Home Screen route changed.
- At inspection, GitHub Actions static-preview run 42752903477, screenshot run 42752903550 and Pages run 42752902489 were queued, **not yet passing**. The previous Pages build at 5d29fc7 succeeded, but the prior smoke suite failed. Do not infer successful runtime QA from a matching source assertion.
- Next: inspect the new CI logs and screenshot artifacts, resolve any further failures, then return to substantial original full-body directional artwork and environmental depth. Physical iPhone visual testing remains outstanding. Milestone A 90/100 art approval NOT established; Milestone B LOCKED.

## Milestone A — original Threadfall ravine paper-bank illustration (2026-11-10)
- Playable artwork commit `e3e45825b7e757e1f649a21a555f3f9e10d20d92` adds `terraceThreadfallRavine50` immediately after the existing distant Threadfall waterfall inside the real North Terrace scene. Sixteen newly authored SVG paths form distinct left and right torn-card banks, inset watercolor surfaces, individually drawn fern fronds/veins, and a folded pool with two ink reflections. This is integrated game artwork, not a concept render or flat screen overlay.
- Noninteractive `aria-hidden` and `pointer-events="none"` scenery; no JavaScript, gameplay hitboxes, collision, movement, quest, save key, service worker, controls or PWA route changed. Source read-back confirmed the unique ravine ID, all 16 paths, balanced new group markup, and preserved original waterfall.
- Verification: GitHub read-back/source structure checks only at documentation time; CI status checked separately. No local npm run, rendered before/after screenshot review, measured mobile FPS or physical iPhone test claimed. Potential art risk: pool overlap/occlusion against existing waterfall and midground cliff; inspect actual North Terrace screenshots and adjust if necessary.
- Next: inspect CI and Pages result for artwork commit; capture actual near/far/mobile Threadfall frames and verify depth order; then prioritize larger original character/scene art. Milestone A visual gate 90/100 NOT creator-approved; Milestone B LOCKED.


## Milestone A — Threadfall cardstock escarpment depth (2026-11-10)
- Actual playable `index.html` commit `2b65658b6321da7682175162b636398e7ec12be9` adds `terraceRavineUndercut51` directly after the previously illustrated waterfall/ravine and before the hillside settlement. Nine individually drawn SVG paths form three offset cut-card cliff strata, sediment seams, and two distinct ink-veined moss sprays. This is authored world-space decorative artwork; no HUD overlay, collision geometry, movement, saves, JS, or PWA routes changed.
- Source-side validation before commit: all HTML id attributes remained unique, new SVG group tags balanced, prior `terraceThreadfallRavine50` preserved, and the new layer appears before the hamlet in paint order. Committed `index.html` blob: `4c2b09d9426666b127bab47e7f64f7df528f1946`.
- Verification pending: actual Chromium screenshot inspection for overlap/occlusion and visual density, Node smoke/simulation results, latest GitHub Actions/Pages deployment and physical iPhone QA. No 90/100 visual score is claimed. Milestone A remains OPEN; Milestone B LOCKED pending creator approval.
- Next: compare near/far/844x390 mobile Threadfall renders, correct any overdraw or tiny-scale noise, then prioritize major character/full-body illustration improvements.

## Milestone A — Threadfall vellum spray and paper-pool artwork (2026-11-10)
- Playable artwork commit `0fca2a1fdb35fa915d43ecded4e08e3492962b5a` adds `terraceThreadfallSpray52` to the North Terrace SVG after the existing ravine undercut and before the hillside settlement. Seven individually authored paths form two asymmetric folded mist fans, hand-painted veins, a layered reflective basin edge and detached spray lines. All shapes are in-world noninteractive SVG artwork, not a concept image or HUD overlay.
- GitHub read-back verified the new unique group ID, seven paths, placement before `terraceHillsideHamlet`, and unchanged JavaScript, gameplay/save schema, controls and PWA route. HTML ID uniqueness and SVG group balance checked before the commit. No runtime visual assessment or measured performance is claimed.
- Independent CI observation before this artwork: static-preview checks and Pages deployment succeeded on `6376de7`, but screenshot capture failed at `tools/capture-screenshots.mjs:378` because the 74ms turn-pose timing check observed `turning:false`. This may be timing-sensitive; diagnose and correct without weakening actual animation assertions. That earlier successful Pages deployment is NOT proof this new artwork has deployed.
- Pending: run automated tests and screenshot capture for the new artwork, inspect near/far/mobile Threadfall composition and clipping, verify Pages publication, and conduct physical iPhone QA. Creator's 90/100 art gate remains unapproved; Milestone B stays LOCKED. Next prioritize substantial full-body character and environmental illustration rather than tiny CSS polish.

## 2026-11-10 — Tap-to-walk obstruction correction (Milestone A)
- Gameplay commit `5c8ffdf27ce9679a5c7b2a491c74a137dd955f6c`: tap-to-walk now cancels after 12 consecutive frames without meaningful progress toward its selected destination. This prevents prolonged wall-sliding against layered paper scenery while preserving ordinary manual movement and collision.
- Regression assertion commit `956d787a0c2844cf3ad6076e650ddb34a7c4ddb0` checks the new stall detection in `tests/smoke.mjs`.
- Source change was committed; rendered browser behavior, CI result, latest Pages deployment and physical iPhone testing must be checked separately. No artwork acceptance is claimed. Next: confirm automated tests and screenshot workflow, then resume major original character/environment artwork work.
- **Milestone A visual gate NOT MET; Milestone B LOCKED.**

## 2026-11-10 — Manual control priority over tap-to-walk (Milestone A)
- Playable `game.js` commit `81efb8bda382c4a569acfcdcf07a940fb08c19e7` cancels an outstanding tap destination immediately when physical D-pad/keyboard movement begins. Previously the stale target could resume walking on control release or interfere with deliberate directional turns. Existing collision, saved state, scenes, art and PWA path are unchanged.
- `tests/smoke.mjs` regression assertion commit `e17f9ce87e2aaa7e23c89bfb9a73e3aaace90efe` requires this manual-input precedence. Source edits were committed through GitHub; full Node test execution, browser interaction, latest CI/Pages status and physical iPhone testing remain unverified until checked independently.
- Next: confirm CI and actual tap-then-D-pad interaction in browser; prioritize major original multi-direction character artwork and environmental composition. Milestone A art target 90/100 NOT demonstrated; Milestone B LOCKED.

## 2026-11-10 — Threadfall valley-bank original flower illustration (Milestone A)
- Playable world artwork commit `afcbd9a49a70dc4203e9b8ba48c28f0607d5a87e` inserts `terraceThreadfallWildflowers53` before the distant hillside settlement in `index.html`. Ten original SVG paths plus two illustrated flower centers build asymmetric stems, folded leaves, hand-inked veins and two differently colored blossoms. This is real North Terrace scenery, not a concept image.
- Source validation: insertion marker located exactly once; all HTML IDs unique after insertion; source length increased by exactly 2,081 characters. No game JS, collision, saved progress, chapter logic or PWA paths altered.
- Outstanding: Node smoke and browser screenshot execution, visual inspection of the new plants at mobile landscape scale, Pages deployment confirmation and physical iPhone QA. Do not claim the 90/100 aesthetic gate passed; creator approval is pending. Milestone B LOCKED.
- Next: verify CI/Pages and inspect Threadfall composition, then prioritize larger illustrated character/scene improvements.


### 2026-11-10 — Short-walk checkpoint persistence (Milestone A maintenance)
- `game.js`: track unsaved movement and persist immediately on the first idle frame, including brief D-pad or tap journeys that end before the existing 1.1-second periodic checkpoint. Existing save key, schema, movement, collision, artwork and chapter progression are unchanged.
- `tests/smoke.mjs`: source regression assertion for the idle-save condition.
- Gameplay commit `7c62284b6c895689f386ef2064bd89adbbdee686`; test commit `e35cc8351c6b4dc4b74d334770a3bd3447c0ba79`.
- Source read-back and CI/deployment status must be checked independently. No physical iPhone QA claimed. Visual acceptance remains **NOT APPROVED**; Milestone B locked.
- Next: inspect latest screenshot captures for character scale, ravine clipping and perspective, then implement substantial original art improvements.
