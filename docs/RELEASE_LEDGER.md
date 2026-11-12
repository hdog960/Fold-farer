# FoldFarer — Verified development and release ledger

Established 2026-11-12 to separate source commits, test evidence, deployment and creator approvals. For historic detail see `BUILD_STATUS.md`. Do not fabricate release numbers or percentage completion.

| Revision | Type | Source/CI evidence as verified 2026-11-12 | Deployment/gate |
| --- | --- | --- | --- |
| `3d41ebd` (shell 0.56) | Handheld SVG paint/cache mitigation | Source change and CI covered in later commits | User later reported improved lag, not measured FPS |
| `7f66146` (shell 0.57) | Cached actor paint writes and regression correction | Later status and current main includes changes | Physical QA outstanding |
| `6801ae3` (shell 0.58) | Idle prompt churn and handheld scenery budget | `Check FoldFarer static preview` run 43275060725: success; screenshot run 43275060845: success | Pages run 43275058960: success |
| `e0c7c73` (shell 0.59) | Depth-sort and class-write performance mitigation | Node run 43286352570: success; Chromium screenshot run 43286352819: success | Pages run 43286350818: success |
| `74c2afd572541aa9f9ca1d74b31eed9a1511e3af` | Generated screenshot refresh / source-equivalent head | No separate `npm test` result for this exact docs/screenshots-only SHA; source code last changed at `e0c7c73` | Pages run 43286675353: success |
| `d2726e6338aa66a4f3e3ca63c99a5670a4485fea` (shell 0.61) | **Milestone A-02** multi-pointer D-pad ownership, second-thumb ACT on touch-down, interrupted/corrupt save backup, testable offline PWA | PR #22 guarded merged from exact-head `9be306f` after Node 43309705676 and mobile QA 43309705967 passed. Merged main Node 43309943943 **success**, full screenshot workflow 43309943755 **success**, mobile/offline QA 43309944103 **success** (667×375, 844×390, 932×430; six genuine browser images uploaded, pixels not directly inspected by this session) | Merged Pages run 43309943207 **success**; physical iPhone 2-thumb/performance and final creator approval still pending |
| `31402fdb3eaac7d4481a4a42c8b82123795e525d` | Automatic screenshots-only follow-up to A-02 | No gameplay source modification or separate Node test required; generated screenshot workflow 43309943755 passed on merge source | Its Pages run 43310254925 was in progress at this record's drafting; verify separately |

## Creator feedback and approval
- 2026-11-12: Creator said the **current artwork style is aesthetically pleasing**. Art *direction* accepted. Not a statement of final Milestone A or Milestone B approval.
- 2026-11-12: Creator said the iPhone game is **running better** after performance fixes. Exact FPS and full route QA unmeasured.
- 2026-11-12: Creator **disabled** FoldFarer automation, requested substantial **manual** roadmap-led Continue Development sessions and newer-project governance.
- **Milestone A:** OPEN. **Milestone B:** LOCKED. **90/100 rubric:** target; no verified numeric score yet.
- **PR #22:** Merged at `d2726e6`; interactive changes shipped in source with exact-head Node and mobile/offline Chromium proof, but no physical iPhone approval.
- **PR #21:** Open, unmerged optional directional cloak candidate `84fb81e33de887f8abdcb62e29cfc135595c3c5b`; new main performance requirements must be integrated before considering merge.

## Recording future releases
For every candidate record: exact source commit, shipped behavior, new regression tests, Node results and workflow run IDs, real browser viewports/offline/touch results, screenshot inspection status, merged main SHA, Pages deployment SHA, creator device feedback, gate status and next incomplete slice. Distinguish **pending**, **failed**, **passed** and **not tested**.
