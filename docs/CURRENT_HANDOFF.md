# FoldFarer — Current manual development handoff

Updated 2026-11-12. Verify live GitHub again at every manual development session. This file is a timestamped handoff, **not** evidence of future CI.

**Repository:** https://github.com/hdog960/Fold-farer
**Live game:** https://hdog960.github.io/Fold-farer/
**Verified game release commit:** `d2726e6338aa66a4f3e3ca63c99a5670a4485fea` (PR #22 merged)
**Most recent screenshots-only main when drafting:** `31402fdb3eaac7d4481a4a42c8b82123795e525d` (main may move due this handoff)
**Current service-worker cache:** `foldfarer-shell-0.61` (existing Home Screen install keeps same URL)
**Existing package metadata:** 0.37.0 (not a release gate).
**Open PR:** #21, optional directional cloak candidate, `84fb81e`, **UNMERGED**. PR #22 is merged/closed.

## Verified production-source release checks
- Node, check static preview (merged main): [43309943943](https://github.com/hdog960/Fold-farer/actions/runs/43309943943) **SUCCESS**.
- New real Chromium phone-size, two-thumb, corrupted checkpoint and offline reload QA (merged main): [43309944103](https://github.com/hdog960/Fold-farer/actions/runs/43309944103) **SUCCESS**. Tested 667×375, 844×390 and 932×430 with genuine touch dispatch, service worker and offline reload; this is browser *emulation*, **not real iPhone Safari or measured FPS**. The run uploaded six browser screenshots; actual pixel-level manual inspection remains unverified.
- Full pre-existing screenshot gameplay workflow: [43309943755](https://github.com/hdog960/Fold-farer/actions/runs/43309943755) **SUCCESS**, produced screenshots-only main `31402fdb`.
- Pages for shipped game source: [43309943207](https://github.com/hdog960/Fold-farer/actions/runs/43309943207) **SUCCESS**. Screenshots-only follow-up Pages run 43310254925 pending at time of drafting; independently verify.

## Implemented in this manual session (A-02)
- Separate keyboard and pointer-ID owners for movement directions; clear all owner states on dialogue or page suspension; old traversal and saves remain compatible.
- Reliable ACT for the second touch while a movement thumb remains held. Touch-down triggers ACT; duplicate synthetic click is suppressed to avoid skipping dialogue; keyboard/accessible click still accepted.
- Primary checkpoint retains key `foldfarer.firstfold.0.1` and old schema. Recovery copy `.backup` is read if the primary is missing/malformed; backups are throttled during walking, refreshed at milestones, and both copies removed on explicit restart.
- Local trusted HTTP loopback now supports testable service-worker install; deployed game continues HTTPS-only production behavior.
- New PR and main Chromium QA tests covering real multi-touch, save recovery and offline reopening at three landscape sizes. Game art and existing performance mitigations untouched.

## Immediate NEXT manual objective
1. Independently recheck latest main, PR #21, CI/screenshots/Pages. If any current completed checks red, fix before features.
2. **A-01/A-02 physical iPhone verification:** creator tests two thumbs moving + ACT on same screen, suspend/resume, three areas, dialogue/battle, Home Screen offline reopen and lag. Do not claim iPhone acceptance from Chromium.
3. Continue substantial **Milestone A-03 playable exploration** after safeguarding mobile responsiveness, reusing the existing characters/scenes and *verified* source story clues only. Add meaningful interactive puzzles/NPC consequences and genuine tests rather than extra dense SVG illustration. The separate creator-held Game Design Bible is not available here; do not invent its unseen canonical story.
4. Leave PR #21 untouched until explicitly scoped, rebased and performance-tested. Keep **Milestone B LOCKED** until creator's explicit approval and complete polished Milestone A slice.
5. End with another Continue Development button. **Hourly automation remains DISABLED**; do not restart or modify it.

## Gate truth
Creator likes current art style and says lag is better. These are positive feedback, **not a physical FPS benchmark, finished 30–60-minute First Fold, 90/100 gate or release authorization**.
