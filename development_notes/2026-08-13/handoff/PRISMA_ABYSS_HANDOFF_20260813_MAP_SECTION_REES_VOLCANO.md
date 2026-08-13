# PRISMA ABYSS Handoff 2026-08-13 — MAP sections / Rees hut / Undersea Volcano

## Current status

2026-08-13 runtime follow-upの次段を反映済み。

今回の重要な運用確定:

- 同一施設の屋外／屋内は別MAP IDにしない。
- ダンジョンの階層と同じように、1つのcanonical `mapId` 配下のsectionとして管理する。
- player-facing名称は、屋外を施設名そのもの、屋内を `～内` とする。

また、2026-08-12設計で残っていた海底火山の可変ダンジョン化も実装済み。

## Canonical MAP section contract

Common sources of truth:

- `FIXED_AREA_MAP_KEYS`: runtime areaKey -> canonical map key
- `FIXED_AREA_MAP_SECTION_INDEX`: runtime areaKey -> section number
- `MapRegistry.getMapBindingForArea(areaKey)`: canonical binding resolver

Identity roles:

- `areaKey`: runtime section identity
- `mapId`: canonical location identity
- `floorId` / `sectionId`: same-map section identity (`MAPxxxxx-00`, `MAPxxxxx-01`, ...)

Do not allocate another MAP id merely because a facility gets an outdoor/interior section.

## Rexnote estate

Canonical map:

- `REXNOTE_ESTATE / MAP000071`

Sections:

- section 00: areaKey `REXNOTE_ESTATE_GROUNDS`, name `レクスノート邸`
- section 01: areaKey `REXNOTE_ESTATE`, name `レクスノート邸内`

Compatibility:

- internal areaKey `REXNOTE_ESTATE_GROUNDS` remains for runtime/save compatibility.
- previous development-only `MAP000077` is no longer active.
- `MAP000077` is recorded in `RETIRED_MAP_IDS`; do not recycle it casually.

Hayate silent encounter remains in section 00 and is complete.

## Rees mountain hut

Canonical map:

- `REES_MOUNTAIN_HUT / MAP000069`

Sections:

- section 00: areaKey `REES_MOUNTAIN_HUT_EXTERIOR`, name `リースの山小屋`
- section 01: areaKey `REES_MOUNTAIN_HUT`, name `リースの山小屋内`

Flow:

- WORLD entry -> section 00.
- door -> section 01.
- 5-years-later wake story still starts directly in section 01 via existing `START_FIXED_MAP REES_MOUNTAIN_HUT` actions.
- interior exit requires `prologueReesDepartureTalkSeen` and goes to section 00.
- `prologueDepartedReesHut` is set only on section 00 -> WORLD exit.

`Field.move` now has shared locked-message handling for unavailable `triggerOnStep` fixed-map actions. Do not replace this with a Rees-specific branch.

## Undersea Volcano continuation

`FIXED_DUNGEON_MAPS.UNDERSEA_VOLCANO`:

- F1: procedural, impassable magma.
- F2: procedural, walkable damage magma.
- F3: procedural, impassable magma.
- F4: fixed research section.
- F5: fixed Grad battle section, monster `301063`, clear flag `underseaVolcanoCleared`.

Common implementation:

- `Dungeon.applyFixedProceduralTerrain()` owns authored procedural terrain placement.
- impassable terrain protects a concrete path from entry to all required anchors before placement.
- `Dungeon.isValidFixedProceduralFloor()` rejects cached generated floors whose entry/floor links/chests are unreachable under authored impassable tiles.
- damage magma continues to use existing common `M` tile / `Dungeon.stepOnLava()` behavior.
- F4 -> F3 return resolves the generated F3 `D` marker dynamically; do not restore a fixed target coordinate.

Save compatibility:

- `fixedProceduralGenerationVersion` remains `3` intentionally.
- Do not bump it only for this change: doing so can invalidate existing Rexnote basement B1-B4 cached floors in active saves.

## Previous runtime-image / Thunder fixes remain active

Do not redo or revert:

- Save / Settings tab order.
- boss + rare start AUTO OFF common contract.
- Monster 501 / Character 501 image identity boundary.
- bounded startup GRAPHICS load / dedupe / retry.
- Thunder Fortress Marie position for the relevant post-lighthouse state.
- fixed-map renderer batching/fallback/electric timer optimizations.
- Rexnote basement B1-B5 / Regulus / grimoire / Alan + ship progression.

## Files changed in this unit

Runtime:

- `map.js`
- `maps_logic.js`
- `dungeon.js`
- `main.js`
- `news.js`

Canon:

- `canon/PRISMA_CODING_HANDOFF_v5.md`
- `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`

Targeted checks:

- `development_notes/2026-08-13/targeted_followup_check_20260813.js`
- `development_notes/2026-08-13/targeted_map_section_volcano_check_20260813.js`

Report:

- `development_notes/2026-08-13/reports/MAP_SECTION_REES_VOLCANO_CONTINUATION_20260813.md`

## Validation policy / result

User instructed not to run bundled validators.

Used instead:

- `node --check map.js`: PASS
- `node --check maps_logic.js`: PASS
- `node --check dungeon.js`: PASS
- `node --check main.js`: PASS
- `node --check news.js`: PASS
- `targeted_followup_check_20260813.js`: PASS
- `targeted_map_section_volcano_check_20260813.js`: PASS

Latest map/volcano targeted result:

```json
{
  "mapGrouping": "ok",
  "reesExterior": "ok",
  "underseaVolcano": "ok",
  "proceduralTerrain": "ok",
  "generatedFloorIntegration": "ok"
}
```

## Remaining real-device verification

The delivery ZIP still omits `assets/`, so assets-inclusive device verification remains required.

Priority:

1. NEW GAME 5-years-later wake -> Rees talk -> hut interior -> hut outdoor -> WORLD.
2. re-enter Rees hut from WORLD and confirm outdoor-first flow and player-facing names.
3. Rexnote outdoor/inside naming and Hayate silent encounter.
4. Undersea Volcano F1-F3 generated traversal -> fixed F4 -> fixed F5.
5. leave/re-enter volcano and confirm a new generated run without mid-run regeneration.
6. F1/F3 impassable magma, F2 damage magma.
7. F4 -> generated F3 return marker resolution.
8. previous startup-image / Stone Jelly / Thunder performance checks from the superseded handoff.

## Continuation after this unit

The 2026-08-12 explicitly pending Sea Volcano rework is now complete at runtime level.

Do not invent new scenario dialogue simply to keep implementation moving. For the next large content unit, use the canon/roadmap and obtain/confirm scenario scope before material story additions. Existing longer-term candidates include companion multi-part growth quests and LB30+ skill work, but they are not silently authorized by this handoff.

## Source of truth

- `development_notes/2026-08-13/reports/MAP_SECTION_REES_VOLCANO_CONTINUATION_20260813.md`
- `development_notes/2026-08-13/reports/RUNTIME_IMAGE_THUNDER_REXNOTE_FOLLOWUP_20260813.md`
- `canon/PRISMA_CODING_HANDOFF_v5.md`
- `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`
- `canon/PRISMA_DEVELOPER_CORE_THOUGHTS_v6.md`
- `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
