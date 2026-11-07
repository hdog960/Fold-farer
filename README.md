# FoldFarer: The Unfinished World

An original, iPhone-first papercraft storybook RPG in development.

## Install on iPhone — permanent Home Screen shortcut

1. Open **https://hdog960.github.io/Fold-farer/** in **Safari**.
2. Tap **Share** (square with upward arrow) → **Add to Home Screen** → **Add**. If prompted, leave **Open as Web App** enabled.
3. Tap the new **FoldFarer** icon on your Home Screen and rotate to **landscape**.

**Updates:** Keep the existing icon. When you open FoldFarer while connected to the internet, the application checks for the latest GitHub Pages files and downloads updates automatically. You never need to reinstall for ordinary game updates. If an update was published while you were playing, close and reopen the Home Screen app to load the updated version. Offline use continues with the last cached build; iOS controls when to wake apps, so updates cannot be guaranteed while the game stays closed/offline. Do not clear Safari website data if you want to retain the current local preview save.

**Current playable review:** [Open First Fold 0.4.0](https://hdog960.github.io/Fold-farer/) (GitHub Pages; availability depends on Pages publishing the main/root source).
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
