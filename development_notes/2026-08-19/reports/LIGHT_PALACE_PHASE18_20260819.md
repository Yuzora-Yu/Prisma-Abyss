# LIGHT_PALACE Phase 18 — persistent visual fallback / movement / retreat gate

Date: 2026-08-19
Base: Phase 17 delta applied

## User-reported regressions / requests

- `world-space floor effect could not be rendered: flashback-genesis-circle` continued to occur and the 9-tile ritual circle was absent.
- Jasper and Veld could also disappear in the same sequence.
- Waiting for the field visual made the trap event begin noticeably late.
- Do not teleport Leila to X17 when the trap fires. Keep her X16/X17/X18 trigger position until the post-binding advance toward Veld.
- At that advance, X16 -> X17 -> north, X17 -> north, X18 -> X17 -> north.
- At the first-floor barrier trigger, flash/shake and visibly repel Leila back inside.
- Re-check the Claude warning when the player tries to return north after the first Veld battle.

## Root causes

### 1. The event flow was waiting on one renderer implementation

Phase 17 treated `PhaserFieldRenderer.ensureStoryFloorEffectSprite()` as a prerequisite for continuing the event. If the Phaser scene or the story texture was not ready inside the retry window, the story layer logged the floor-effect warning and continued without a reliable world visual. That design also added a visible delay to the event.

The ritual circle is not a transient command; it is persistent map state. The correct authority is therefore the saved story flag + absolute map coordinate, not completion of one Phaser draw call.

### 2. Persistent event actors had no complete fallback authority

Jasper / Veld had absolute coordinates, but persistent re-synchronization still assumed Phaser was the active story actor renderer. If the Phaser field renderer was temporarily unavailable/fallbacking, those actors could be missing after a refresh.

### 3. The Claude retreat warning really could be masked

The trap tile and the retreat-warning tile intentionally overlap at X16..18 / Y19. `MapRegistry.findTileEffect()` returns the first authored effect at a coordinate without evaluating story conditions. After the trap had already been consumed, runtime lookup still returned that first trap definition; `handleFixedTileEffect()` then rejected it because its event flag was already set, and the later `light_palace_flashback_wrong_way` definition was never considered.

This is why the northward Claude warning could appear to have disappeared.

## Changes

### Ritual circle / persistent visuals

- `lightPalaceFlashbackRitualVisible` now refreshes the field immediately.
- The hexagram event no longer issues a one-shot `SHOW_FLOOR_EFFECT` command.
- Persistent world state is exposed by `StoryManager.getLightPalaceFlashbackPersistentVisualState()`:
  - circle: X17/Y16, size 9
  - Jasper: X20/Y15
  - Veld: X17/Y16
- Phaser stores absolute world-effect specs even when the scene/texture is not ready yet and materializes them after readiness.
- When Phaser is unavailable, the legacy Canvas renderer uses the same absolute specs:
  - the 9x9 circle is drawn tile-by-tile after the floor and before walls/actors;
  - Jasper/Veld are drawn at their map coordinates.
- Image-load redraw now falls back to `Field.render()` when `PhaserFieldRenderer.refresh()` cannot actually repaint.
- The old 2.5-second “wait for Phaser floor effect” requirement and its warning are no longer part of this event path.

### Leila movement

- No X17 correction at trap start.
- After Luna is bound and immediately before Veld appears:
  - from X16/Y19: east to X17/Y19, then north to X17/Y18;
  - from X17/Y19: north to X17/Y18;
  - from X18/Y19: west to X17/Y19, then north to X17/Y18.
- Jasper and Veld stay at the fixed map positions above and never depend on Leila's trigger X.

### Entrance barrier

- The flashback exit event now begins with `BARRIER_REPEL`.
- It flashes white and shakes vertically while moving Leila back to X17/Y26 before the three-character staging continues.

### Claude northward warning

- Runtime tile-effect selection now skips effects whose story conditions are not active or whose one-shot event flag has already been consumed.
- Therefore, after `lightPalaceFlashbackRetreatOrdered`:
  - X16..18 / Y19 resolves to `light_palace_flashback_wrong_way`, not the already-used hexagram trap.
- Existing blocked stair links (2F -> 3F and 1F -> 2F during retreat) remain intact.

## Compatibility

- The hexagram event action count is not shifted by the Leila correction; only the contents of existing field-cutscene actions changed.
- Trap event revision remains Phase 18 revision `16` for Phase 17 -> Phase 18 recovery.
- Existing persistent flags are reused; no save-schema field was added for this pass.
- `map.js` is unchanged in this phase; the user-edited map lineage remains the authority.

## Validation

Passed:

- Root JavaScript syntax: 63 / 63 files.
- `tools/validation/validate-news-data.js`.
- Phase 15 encounter/rank regression validation.
- `validate-light-palace-phase18.js`.

Phase 18 validation asserts:

- no Leila X17 teleport at trap start;
- three trigger-X post-binding movement patterns converge at X17/Y18;
- fixed Jasper / Veld coordinates;
- ritual state is persistent and no one-shot floor-effect command is used in this event;
- no Phase 17 blocking floor-effect warning/wait path;
- Canvas persistent-floor and actor fallback code exists;
- entrance barrier repel returns Leila to X17/Y26;
- overlapping X16..18/Y19 runtime effects select the Claude wrong-way event after retreat instead of the consumed trap.

Older Phase 16/17 validators contain assertions for superseded behavior (Phaser retry-window waiting and immediate X17 centering), so they are intentionally not treated as current acceptance tests. Phase 15 remains applicable and passes.

## Manual checks requested

1. Enter the trap from X16, X17, and X18 in separate runs.
2. Confirm the circle appears without a multi-second pause and stays at X17/Y16 while walking/resizing.
3. Confirm Jasper remains X20/Y15 and Veld appears X17/Y16.
4. After the first Veld battle / flash bomb retreat, walk north into X16, X17, or X18 / Y19 and confirm Claude stops the player.
5. Descend a floor and verify the upper stair is also blocked during retreat.
6. At the entrance barrier, confirm the trigger flash/shake and pushback precede the staging.
