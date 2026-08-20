# CSS Cascade Cleanup Phase 3 — 2026-08-18

## Purpose

Phase 3 continues from the Phase 2 delta while keeping battle/conversation behavior frozen. Two goals were handled together:

1. fix the achievement main-menu notification mismatch reported during validation;
2. split the 7,822-line `modern-polish.css` monolith into ordered ownership files without changing the existing cascade order, so later menu-only `!important` reduction no longer requires editing battle/conversation CSS in the same file.

Baseline: `PRISMA_ABYSS_css_cleanup_phase2_DELTA_20260818.zip` applied to the Phase 1 tree.

## Achievement notification bug

The main-menu badge and the achievement screen did not use the same source of truth:

- the main menu scanned **every** record in `App.data.achievements`;
- the achievement screen and `claimAll()` iterate the **current `ACHIEVEMENTS_DATA` master**.

Therefore an old/retired achievement ID left in save data as `completed: true, claimed: false` could keep the red badge visible forever even though the current achievement screen showed zero claimable rewards.

### Fix

- Added `AchievementManager.getUnclaimedCount()`.
- `AchievementManager.hasUnclaimed()` now delegates to the current-master count.
- `Menu.openMainMenu()` now asks `AchievementManager.hasUnclaimed()` instead of scanning raw save records.
- `MenuAchievements.render()` uses the same count function.
- Old/unknown achievement records are **not deleted** from the save; they are simply ignored by current notification/reward logic, avoiding destructive migration.
- The red notification dot's fixed styling was moved from inline HTML into menu-owned CSS.

Validation includes a synthetic stale-ID save-state case. The badge remains off for stale-only data, turns on for a current unclaimed achievement, and turns off after that current reward is marked claimed while the stale record remains.

## `modern-polish.css` ownership split

The runtime entry point remains `modern-polish.css`, but it is now a small ordered loader:

1. `modern-polish-base.css`
2. `modern-polish-menu.css`
3. `modern-polish-field.css`
4. `modern-polish-items.css`
5. `modern-polish-battle-late.css`
6. `modern-polish-config-save.css`
7. `modern-polish-final.css`

The import order is the original source order. The Phase 2 stylesheet was sliced only at top-level rule boundaries.

### Protected-area integrity

Compared with the Phase 2 source slices:

- `modern-polish-base.css`: exact baseline slice
- `modern-polish-field.css`: exact baseline slice
- `modern-polish-items.css`: exact baseline slice
- `modern-polish-battle-late.css`: exact baseline slice
- `modern-polish-config-save.css`: exact baseline slice
- `modern-polish-final.css`: exact baseline slice
- `modern-polish-menu.css`: exact baseline slice plus the new `.menu-notification-dot` rule

No battle JS, story/dialogue JS, field JS, or gacha JS was modified in this phase.

## `!important` ownership after the split

Phase 3 intentionally does **not** delete speculative `!important` declarations while also changing stylesheet ownership. The total remains 1,247, but they are now isolated by domain:

- base/shared legacy: 807
- main menu/sub-screen theme: 287
- field late overrides: 105
- items tabs: 30
- battle late overrides: 15
- config/save: 0
- final late rules: 3

This is the key structural change for the next pass: the **317 menu + item `!important` declarations can now be reduced without editing the battle-late or field files at all**.

## Service worker/cache

The app-shell cache was bumped from `prisma-abyss-v72.20260818` to `prisma-abyss-v73.20260818` and all seven imported CSS files were added to precache. Existing `index.html` / `main.html` references to `modern-polish.css` remain valid.

## In-game news

Added the single `2026/08/18` `NEWS_DATA` record required by project policy. It mentions only player-facing effects:

- achievement reward notification consistency fix;
- menu display stability improvement.

## Validation performed

- Root runtime JavaScript: **63/63** files passed `node --check`.
- Achievement notification regression validator: passed stale/current/claimed cases.
- CSS ownership validator: 7 imports in expected order, all files present, 1,311 rules parsed, 1,247 `!important` declarations counted.
- PostCSS parse: loader + all seven split sheets + `opening.css` + `runtime-components.css` passed.
- Split-source integrity check: all protected chunks equal their Phase 2 source slices byte-for-byte; menu chunk equals its Phase 2 slice plus only the notification-dot rule.
- `NEWS_DATA` validator: 18 records, unique IDs, one record per date, valid ordering; latest `2026/08/18`.

## Recommended validation-environment checks

1. Open the main menu with no current unclaimed achievement rewards: the red badge must be absent.
2. Complete a current achievement but do not claim it: the badge must appear.
3. Claim the last current reward and return to the main menu: the badge must disappear.
4. Spot-check one battle and one conversation. The relevant CSS source content is unchanged, but this confirms stylesheet import loading in the target environment/service worker.
5. Spot-check items and config/save because those rules now load from separate imported files while retaining their original order.

## Next phase

With ownership separated, Phase 4 can work only in `modern-polish-menu.css` and `modern-polish-items.css` first:

- replace remaining generic `.btn` / broad-tab collisions with menu-specific component ownership;
- remove the `!important` declarations that exist solely to beat legacy global button/tab rules;
- consolidate party/items/achievements/inventory/config tab geometry into one menu tab shell;
- keep `modern-polish-field.css` and `modern-polish-battle-late.css` frozen during that pass.

## File inventory

変更・作成したファイルは下記の18件です。

1. `achievements.js`
2. `menus.js`
3. `menus_achievements.js`
4. `modern-polish.css`
5. `modern-polish-base.css`
6. `modern-polish-menu.css`
7. `modern-polish-field.css`
8. `modern-polish-items.css`
9. `modern-polish-battle-late.css`
10. `modern-polish-config-save.css`
11. `modern-polish-final.css`
12. `sw.js`
13. `news.js`
14. `tools/validation/validate-news-data.js`
15. `development_notes/2026-08-18/validation/validate-achievement-notification.js`
16. `development_notes/2026-08-18/validation/validate-css-ownership-split.js`
17. `development_notes/2026-08-18/reports/CSS_CASCADE_CLEANUP_PHASE3_20260818.md`
18. `development_notes/2026-08-18/DELTA_MANIFEST_20260818_CSS_CLEANUP_PHASE3.txt`
