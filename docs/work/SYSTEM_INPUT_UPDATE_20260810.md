# System/Input Update — 2026-08-10

This note records the system changes made after the Phase 7C handoff. It intentionally does not change pending story dialogue or the Minerva follow-up scene.

## 1. Opening villages: village semantics + encounters

- `PROLOGUE_SOUTH_VILLAGE` and `PROLOGUE_NORTH_VILLAGE` are no longer `isDungeon:true`.
- Both retain `useHabitatEncounters:true` and their encounter Rank settings.
- `App.tryRandomEncounter()` now treats `useHabitatEncounters:true` local maps as map encounters independently from dungeon semantics.
- `Field.move()` performs the local encounter roll for non-dungeon habitat maps.
- Result: the opening villages can still encounter monsters, but dungeon-only Escape is not exposed merely to enable encounters.

## 2. Rees mountain hut world location

- World coordinate: `x:66, y:58`.
- `REES_MOUNTAIN_HUT.worldExits` and `exitPoint` point to `(66,58)`.
- `STORY_DATA.areas.REES_MOUNTAIN_HUT` registers the hut at `(66,58)` with `overlay_field_house_1`, so the world tile can be recognized and the fixed map can be re-entered after the present-day wake event is available.

## 3. Basic equipment drops

- Battle equipment reward Rank now prefers the defeated monster's Rank (`enemy.rank` / master Rank), rather than generated/map floor.
- `memoryRewardRank` remains the explicit transformed-Rank override for Memory Realm enemies.
- For standard monster equipment drops, base equipment selection is now two-stage (other `source === 'drop'` callers such as authored chest/start-item generation keep their prior behavior):
  1. Part type: 武器 / 盾 / 頭 / 体 / 足, equal probability (20% each while all five are present).
  2. `baseName`: uniform within the selected part type. Weapons therefore select 剣 / 斧 / 短剣 / 杖 / 槍 / 弓 uniformly.

## 4. Analog movement

- Existing D-pad buttons remain.
- A center analog stick was added.
- Pointer Events cover touch drag and mouse click-drag with the same logic.
- The dominant axis determines the 4-direction grid movement and keeps moving while held.

## 5. Tap-to-walk investigation and implementation

- No large rendering rewrite was required.
- Fixed/local maps reuse `Dungeon.findShortestGridPath()` (BFS).
- Phaser already exposes camera screen-to-world conversion, so a tap/click can resolve directly to a tile.
- Auto-walk repeatedly calls the existing `Field.move()` rather than bypassing collision/event logic.
- Static terrain/building collision is considered during pathfinding. Dynamic blockers such as locked doors, chests, bosses, actors, or scripted transitions are left to the existing movement code; if the next step cannot complete, auto-walk stops at that point.
- World-map routing uses a small wrapped BFS because the world map wraps at its edges.
- Manual keyboard, D-pad, analog input, encounter transitions, menus, and map/scene transitions cancel auto-walk.

## 6. Validation status

- Syntax checks pass for `main.js`, `battle.js`, `map.js`, `phaser-field.js`, and `news.js`.
- The new `validate-system-input-update-20260810.js` passes, including all Rank 1-200 equipment candidate windows.
- Relevant prologue, encounter, fixed-exit, main-story routing, and NEWS validators pass.
- `run-all.js` currently reports `12 / 64 FAIL` in this assets-omitted package. Ten are the same asset/manifest omissions documented in the Phase 7C handoff (`validate-asset-fixed-names`, `validate-authored-map-props`, `validate-blocking-map-objects`, `validate-chest-mimics`, `validate-companion-map-sprites`, `validate-event-map-markers`, `validate-fixed-water-shore`, `validate-full-cache-assets`, `validate-summit-temple`, `validate-visual-polish`).
- The two additional failures are legacy validators already inconsistent with the current codebase: `validate-prologue-phase2.js` expects removed `PROLOGUE_HILL`, and `validate-story-monster-variants.js` expects the removed `getStoryMonsterVariant` API. Product code was not changed to satisfy those stale assumptions.
