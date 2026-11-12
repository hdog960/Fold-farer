# FoldFarer — Locked milestone roadmap and acceptance board

**Current gate: MILESTONE A — OPEN. Milestone B — LOCKED.**
Updated 2026-11-12. This board tracks work by functional acceptance, not elapsed time, arbitrary commit count or claimed percent complete.

## Manual session development sequence
Every session selects the highest-priority incomplete slice, investigates blockers, implements as much meaningful cohesive work as is safely verifiable, and updates the exact state. Regressions outrank planned features. Progression is sequential **unless parallel work is demonstrably independent**.

| ID | Slice | Current reality | Required completion evidence |
| --- | --- | --- | --- |
| A-01 | **Handheld performance and update reliability** | Source mitigation 0.56–0.59 deployed; creator says lag is better; device FPS unmeasured | iPhone playtest across Folio, workshop, terrace, dialogue and battle; no severe stalls; screenshot/perf budget regressions; no loss of art direction |
| A-02 | **Core loop durability / touchscreen QA** | Quest chain and local save work in Node simulation; physical QA remains limited | Two-thumb landscape navigation and ACT while moving; no overlap; save reload, offline installed route, reduced motion, collision and area transitions validated at realistic mobile sizes |
| A-03 | **Complete First Fold vertical-slice exploration** | Three short connected scenes and a few interactions | Expand the meaningful playable sequence toward the existing 30–60-minute Milestone A goal with story-consistent puzzles, traversal discoveries, NPC reactions and consequences; do not fabricate creator-held canonical story |
| A-04 | **Distinct encounter depth and memorable climax** | One fixed Paper Scrapper battle | Several tested purposeful encounters, meaningful ability variety and at least one original boss/climax; preserve established action timing, readable battle panels, responsive controls and balance |
| A-05 | **Integrated completion/polish pass** | Functional short preview but no full slice acceptance | First-to-last real gameplay regression, clear objective flow, no blockers or major lag, readable acting and effects, no broken save, annotated real-game screenshots and offline load |
| A-06 | **Creator review / final Milestone A gate** | Creator likes **art direction**; final First Fold acceptance not explicitly given | Evidence-backed visual rubric target ≥90/100 with no failed category, physical iPhone control/performance approval, creator explicitly approves Milestone A and authorizes Milestone B |

### Sequencing rules
- A-01 is a standing regression budget across every later feature. Do not add more complex decorative SVGs or expensive animation while performance is at risk.
- Do not pretend that a passing desktop Chromium run proves physical iPhone FPS. Device acceptance must come from creator review.
- Existing artwork is **preserved**, not subject to wholesale overhaul without a particular visible defect.
- A-03 and A-04 can be planned in detail only from verified existing story/source or supplied original Game Design Bible text; do not silently invent canonical plot.
- A-05 is not a pass until all preceding functional slices have integrated passing results.
- A-06 requires a *specific approval*, not a subjective assistant score.
- **Milestone B** will be scoped from the actual approved First Fold and story bible, then can cover larger world/chapter, party, progression, item/economy and extended combat systems. Do NOT implement Milestone B now.

## Next manual development session (A-01 → A-02)
1. Independently verify latest main, open PRs, test/screenshot/Pages workflows, runtime and save baseline; inspect PR #21 without merging it.
2. Deep-test landscape touch controls, scene movement/frames and renderer on a realistic mobile viewport, and record honest performance evidence; fix any identifiable regressions.
3. Build an integrated functional improvement that advances A-02 **without increasing rendering cost** (e.g. touch/offline/save reliability where evidence exposes a defect). Add Node + browser regressions, inspect screenshots.
4. Guarded merge only after exact-head green checks; verify main/Pages and update ledger/handoff. If checks are pending, leave the candidate isolated and state exact next action.

Never count documentation entries as gameplay progress.
