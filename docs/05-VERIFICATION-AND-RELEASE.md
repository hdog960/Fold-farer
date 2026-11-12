# FoldFarer — Exact-head QA and release discipline

Updated 2026-11-12. Mode: **manual gated development**.

## Workflow currently available
- `npm test` in Node 22: `node --check game.js`, `node --check sw.js`, `tests/smoke.mjs`, `tests/simulation.mjs`.
- GitHub `Check FoldFarer static preview`: runs on push to main and on PR; checks `npm test`.
- GitHub `Capture actual FoldFarer gameplay screenshots`: Chromium via Playwright, currently configured for **main pushes / workflow_dispatch**, NOT automatically for PR checks. Do not claim it proves a PR candidate before merge.
- GitHub Pages deployment: must be checked on exact deployed main, separately from gameplay tests.

## Required manual development loop
1. Read current main head, PRs, open gates, README, `BUILD_STATUS.md`, this authority set and exact latest CI status. If relevant completed CI is failing, resolve root cause first; queued checks are neither passed nor failed.
2. Inspect **actual** source and baseline real-game captures. Define one cohesive user-visible or high-value correctness target from the roadmap. Keep scope within Milestone A.
3. Use isolated branch/PR for risky playable changes; do not overwrite concurrent main. Add focused unit/regression coverage for the original bug or feature. Execute `npm test` when local code execution is available.
4. Exercise real Chromium for source revisions (prefer 667×375, 844×390 and 932×430 mobile landscape, plus portrait notice, PWA/offline reload, movement with concurrent two-thumb control, and first-to-last core loop). Inspect screenshots. Distinguish automated browser **emulation** from physical iPhone results.
5. Fix regressions without weakening tests. Merge only an exact candidate with relevant checks green; if the browser-gate infrastructure cannot verify candidate PRs, strengthen that workflow before risky merges or keep the candidate isolated.
6. After merge, independently confirm main SHA, Node CI, genuine browser results and Pages deployment. Capture and report any pending runs; never claim success based only on successful static hosting.
7. Update `RELEASE_LEDGER.md`, `CURRENT_HANDOFF.md`, and any applicable acceptance/roadmap status to reflect **only verified work**. Avoid documentation-only updates that mask inadequate gameplay changes.
8. End with one-click **Continue Development** and concise test/deployment status.

## P0 rules
Broken gameplay, save loss, bad lag, black screens, interaction failures and completed red CI outrank artwork or expansion. Any commit with outstanding checks must be described as pending. Don't assert physical-device FPS, screenshot appearance, deployment or art acceptance without evidence.

## Merge truth
PR #21 contains optional Tavi cloak art authored before recent handheld performance changes. It is OPEN/UNMERGED at establishment. Do not merge without reconciling against current main, verifying visual impact and performance, and completing tests. Unmerged art should not be described as live game art.
