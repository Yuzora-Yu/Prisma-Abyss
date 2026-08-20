# Light Palace Phase 13 — persistent staging / finisher FX / legacy error-cursor recovery

Date: 2026-08-19
Baseline: Phase 12 applied project
Scope: Light Palace flashback only. `map.js` geometry/triggers are unchanged in this phase and continue to use the user-supplied source-of-truth branch.

## 1. Why the old error save can still fail while a pre-flashback save works

The fresh route proving successful means the Phase 12 `SCENE_REMOVE_ALLY -> SCENE_PARTY` implementation itself is now viable when the Scene Context was created by the current code.

The remaining old-save problem is a compatibility problem in the persisted event cursor:

- Phase 10–12 changed the action list of `light_palace_flashback_hexagram_trap` several times.
- An interrupted save can retain `eventJournal.active.currentPath` pointing at the old `SCENE_PARTY` action.
- Phase 12 recovery primarily recognized the old state when `lightPalaceFlashbackHexagramResolved` had already been set.
- A save stopped with `status: error` but with that flag absent/false could therefore keep the stale action cursor and retry an action index that no longer describes the current event definition.

Phase 13 adds an event-definition revision for this one event. Before Veld combat begins, the hexagram event is replayed from its start if any of these is true:

1. the old resolved flag is already set prematurely;
2. the journal status is `error`;
3. the stored event revision is not the current revision.

The replay is intentionally idempotent: Luna removal tolerates Luna already being absent, and the completion flag is not set until after Leila's step and Veld's arrival dialogue.

A VM regression test now reconstructs the important stale state directly: `currentPath=[4]`, `status=error`, completed old actions, `HexagramResolved=false`, error text `回想パーティを変更できませんでした。`. The journal is confirmed to reset to a running action-0 replay.

### Remaining limitation

No copy of the user's exact failing save payload was supplied, so its original Scene Context snapshot cannot be inspected byte-for-byte. If a very old test save has neither a valid `sceneContextResume.stack` nor any compatible pre-flashback normal save from which the current-time snapshot can be reconstructed, the game still must not fabricate current-time inventory/party state. Phase 13 improves event-cursor recovery, but does not guess missing irreversible save data.

## 2. Jasper / Veld persistence on 3F

The hexagram staging now stores world-coordinate anchors for both enemy visuals:

- Jasper: relative to trigger-position Leila, `dx +3 / dy -4`.
- Veld: after Leila steps north once, `dy -2`.

Their persistent keys are stored in `progress.storyVisualAnchors`. `Field.render` now asks StoryManager to resynchronize Light Palace flashback persistent visuals, so field refreshes, party mutations and battle return no longer make them disappear.

Additional explicit `SYNC_PERSISTENT_VISUALS` calls were added:

- immediately after the first Veld battle, before Leon/Claude run in;
- immediately before the wrong-way Claude warning.

No `REMOVE_SPRITE` for `flashback-jasper` or `flashback-veld` remains in the 3F trap sequence.

## 3. Persistent genesis magic circle

At hexagram-event start, before Jasper appears:

- center: X17 / Y16;
- image: `assets/effect/fx_ultimate_244_genesis_magic.png`;
- display size: 4 tiles;
- alpha: 0.92.

A new Phaser floor-effect layer renders large effects in horizontal slices. Each slice uses Y-aware depth:

- floor: row base depth;
- genesis slice: row + 60;
- characters / bosses: row + 90.

This keeps the image above floor tiles but below character/boss sprites across all rows covered by the 4-tile image. It is restored while Light Palace flashback floor 3 is active and removed when leaving that floor.

## 4. Entrance Veld approach

The previous single smooth slide is replaced by three authored one-tile steps:

- Y20 -> Y21
- Y21 -> Y22
- Y22 -> Y23

Each `MENACING_STEP` performs the one-tile movement while simultaneously applying a short white flash and a small vertical screen shake. This preserves deliberate tile-by-tile movement while giving each step impact.

## 5. 黒白の葬閃 special defeat effect

Both flashback Veld battles retain the Phase 12 trigger rule:

- after 5 completed turns; OR
- immediately when Veld reaches the HP floor of 1.

After the dedicated conversation:

1. Veld logs **黒白の葬閃**;
2. `assets/effect/fx-neutral-slash-ai.png` is rendered over the ally-party battle region;
3. the whole screen flashes white -> black twice;
4. only after the visual sequence completes are fixed 9999 damage logs written and all living party members reduced to 0 HP.

The normal skill database entry is not renamed. This name/effect override is limited to these event battle rules.

## 6. Claude exit depth fix

The continuous Claude push-out remains the faster Phase 12 version (`START_MOVE_SPRITE`, 1750ms while `レオン――！` is displayed).

The bug where Claude appeared to sink underneath the floor was caused by retaining the destination depth while a long vertical Phaser tween crossed multiple map rows. Moving story sprites now recalculate image/shadow depth from their current Y on every tween update. Claude therefore remains above each floor row until he reaches the off-map destination, and is removed only at the end.

## 7. Asset handling

The code uses existing runtime assets:

- `assets/effect/fx_ultimate_244_genesis_magic.png`
- `assets/effect/fx-neutral-slash-ai.png`
- `assets/effect/fx-abyss-vortex-ai.png`

`neutral-slash-ai` is added to the asset registry so it participates in normal asset warmup/cache handling. The two requested existing images are not added to the delta ZIP as duplicate binaries.

## 8. Validation

Passed:

- top-level JavaScript syntax: 63/63 files;
- updated Phase 11 Light Palace regression validator;
- updated Phase 12 Light Palace regression/runtime validator;
- new Phase 13 validator;
- stale `eventJournal` error-cursor VM reproduction/recovery;
- trap remains X16–18/Y20 and wrong-way remains X16–18/Y19;
- Jasper/Veld persistent keys and no premature removal;
- genesis floor effect X17/Y16, size 4;
- Veld entrance has exactly three menacing one-tile steps;
- finisher FX call precedes 9999 damage-log loop;
- Claude long vertical movement has per-frame depth synchronization;
- effect files are present and readable in the validation workspace.

## 9. Files intentionally not changed

- `map.js`: no map geometry or trigger edits were required. The current user-supplied version remains the source of truth.
- battle/dialogue/menu CSS: no unrelated UI changes in this phase.
- requested effect image binaries: already existing assets, therefore not included as modified files.
