# PRISMA ABYSS Handoff 2026-08-13 — 名もなき山村 MAP sections / encounter sections

## Current status

名もなき山村の3エリアが別MAP IDだった状態を修正済み。

canonical location:

- `PROLOGUE_NAMELESS_VILLAGE / MAP000066 / 名もなき山村`

sections:

- 00: `PROLOGUE_WEST_HILL` / `名もなき山村・西の高台`
- 01: `PROLOGUE_SOUTH_VILLAGE` / `名もなき山村・南側`
- 02: `PROLOGUE_NORTH_VILLAGE` / `名もなき山村・北側`

旧 `MAP000067` / `MAP000068` は `RETIRED_MAP_IDS` に登録済み。再利用しない。

## Section contract extension

非ダンジョン固定MAPの区画別エンカウントで `floor` を流用しない。

- canonical location identity: `mapId`
- runtime fixed-map area identity: `areaKey`
- same-map section identity: `mapSection` / `sectionId`
- dungeon habitat dimension: `habitats[].floors`
- non-dungeon same-map habitat dimension: `habitats[].sections`

Field random encounter -> Battle -> MonsterData へ `encounterSection` / `section` を渡す共通経路を追加済み。

## Map registry additions

- `MAP_ID_ALIASES`: legacy map keys -> canonical map key
- `MapRegistry.getMapDefinition()` now resolves aliases through `MAP_IDS`
- `MapRegistry.getMapSections(mapIdOrKey)`
- `MapRegistry.getMapSectionName(mapIdOrKey, section)`

Do not create location-specific section-name or encounter branches.

## North prologue special encounters — preserve

`PROLOGUE_NORTH_VILLAGE`:

- `rareEncounterAll: true`
- `encounterRankMin: 1`
- `encounterRankMax: 76`
- heal spring unchanged
- hunter id `prologue_north_rank100_hunter`
- hunter interval `50` steps
- hunter monsterPoolIds `[960, 965]`
- speed `2`
- respawning hunter state remains areaKey-scoped through fixed-map progress key behavior

Do not replace this with a canonical-map-wide hunter state; that would leak the north-only mechanic into the south section.

## Habitat migration

Early south monsters `1-4`:

- old: `MAP000067 / floor 0`
- new: `MAP000066 / sections:[1]`

North habitat monsters `51-54`:

- old: `MAP000068 / floor 0`
- new: `MAP000066 / sections:[2]`

Encyclopedia habitat labels resolve section names through `MapRegistry`, so they remain `名もなき山村・南側` / `名もなき山村・北側`, not fake floor labels.

## Previous work remains active

Do not revert:

- Rexnote estate same-map section contract.
- Rees mountain hut same-map section contract.
- Undersea Volcano procedural F1-F3 continuation.
- startup image loader / Monster vs Character image identity fixes.
- boss + rare battle start AUTO OFF.
- Thunder Fortress rendering/performance and Marie placement fixes.

## Files changed in this unit

Runtime:

- `map.js`
- `maps_logic.js`
- `main.js`
- `battle.js`
- `monsters.js`
- `news.js`

Canon:

- `canon/PRISMA_CODING_HANDOFF_v5.md`
- `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`

Validation maintenance:

- `tools/validation/validate-monster-habitat-master.js` (updated only; bundled validator not run)
- `development_notes/2026-08-13/targeted_prologue_map_section_check_20260813.js`

Report:

- `development_notes/2026-08-13/reports/PROLOGUE_NAMELESS_VILLAGE_MAP_SECTION_AUDIT_20260813.md`

## Validation result

Bundled validators were not run, following the current handoff policy.

PASS:

- `node --check map.js`
- `node --check maps_logic.js`
- `node --check main.js`
- `node --check battle.js`
- `node --check monsters.js`
- `node --check news.js`
- `targeted_followup_check_20260813.js`
- `targeted_map_section_volcano_check_20260813.js`
- `targeted_prologue_map_section_check_20260813.js`

Latest prologue targeted result:

```json
{
  "canonicalMap": "MAP000066",
  "sections": "00/01/02 ok",
  "southHabitat": "ok",
  "northHabitat": "ok",
  "northHunter": "ok",
  "encyclopediaLabels": "ok",
  "encounterSectionRuntime": "ok"
}
```

## Real-device priority

1. West hill -> south -> north -> south traversal.
2. South normal encounter pool.
3. North stronger normal/rare encounters.
4. North 50-step hunter spawn / chase / encounter / respawn.
5. Hunter state does not leak into south.
6. Encyclopedia habitat labels for monsters 1-4 and 51-54.
7. Rees/Rexnote same-map section regression check.

## Continuation guidance

The same-map section infrastructure is now sufficient for non-dungeon section-specific encounters as well as location identity. Use it for future same-location subareas.

Do not automatically merge older castle/tower/prison MAP IDs merely because their display names share a facility prefix. Those are established legacy progression/location boundaries and need an explicit canonical-location decision before migration.

No new scenario dialogue was invented in this unit.
