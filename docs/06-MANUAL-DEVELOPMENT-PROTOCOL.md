# FoldFarer — Mandatory manual Continue Development protocol

Updated 2026-11-12. **Do not schedule or restart the disabled hourly automation.**

When the creator presses **Continue Development**, treat it as a serious full manual development session, NOT a timed automation, short discussion or a one-commit target.

## Beginning
- Independently verify `hdog960/Fold-farer` latest `main`, open PRs, CI, Pages, release ledger, gate checklist and current handoff; never trust an old SHA.
- Check newest user feedback. For now: retain established aesthetic; severe iPhone lag improved but its performance budget remains binding.
- Identify the highest-value incomplete Milestone A goal, confirm real code/tests, inspect actual in-engine screenshot artifacts.

## Implementation
- Carry through complete, cohesive work in the actual playable game: code, art integration only if needed, interaction and failure paths, tests, real browser captures, defect correction and release. One small CSS decoration, test-only change or status memo does NOT constitute a substantial gameplay session.
- Continue with the next related safe fix where practical; no arbitrary clock target and no invented number of future sessions.
- Prioritize player-facing functionality and stability over extra SVG complexity. Preserve known-good interfaces, art direction, functionality, save and PWA.
- Do not silently skip CI because local git DNS fails: use connected GitHub tools. Branch/PR and guarded merge when feasible.

## Ending
- Verify actual source/head, relevant Node and genuine browser tests, screenshot review, current Pages SHA, unresolved PRs and gate status.
- Update the checklist, release ledger and handoff accurately; unresolved tests or hardware approval are explicitly **pending**.
- Report what genuinely changed and what is still missing, next exact working objective, and offer a clickable **Continue Development** action.
- Any creator test feedback in the next turn is actionable defect input; patch game directly on the next continuation instead of reexplaining the plan.
- Gate B stays locked until explicit creator authorization and a completed Milestone A slice; art-direction enthusiasm alone is not that authorization.

Manual-session entry: "Continue substantial FoldFarer development from independently verified latest GitHub main. Read the seven governance documents, release ledger, current handoff and open PRs. Work on the next unfinished Milestone A roadmap slice, preserve art and iPhone performance, implement/test/inspect/guarded-merge/verify Pages; report factual results and give me another Continue Development button."
