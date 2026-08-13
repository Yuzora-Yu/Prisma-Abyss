# PRISMA ABYSS Handoff 2026-08-13 — Prologue habitat visibility / delta delivery

## Current state

名もなき山村は引き続き1つのcanonical MAP:

- `PROLOGUE_NAMELESS_VILLAGE / MAP000066`
- section 00 = 西の高台
- section 01 = 南側
- section 02 = 北側

旧 `MAP000067` / `MAP000068` は廃止予約のまま。

## Monster encyclopedia habitat policy

Encounter habitatと図鑑の生息域表示を分離した。

MAP master optional field:

```js
showMonsterHabitatInEncyclopedia: false
```

Common resolver:

- `MapRegistry.shouldShowMonsterHabitatInEncyclopedia(mapIdOrKey)`

Default is visible. Do not add monster-ID-specific suppression branches.

`MAP000066` は冒頭専用特殊MAPのためfalse。

Do not remove its `habitats[].sections`; they are required for actual south/north encounters.

## North special encounters — preserve

- `rareEncounterAll:true`
- rank range 1-76
- hunter every 50 steps
- hunter `[960,965]`
- speed 2
- hunter state remains areaKey-scoped

## Delivery contract

From this delivery onward, always provide both:

1. cumulative full project ZIP
2. changed/new-files-only delta ZIP

Delta ZIP must preserve project-root relative paths so it can be extracted directly over the user's existing tree.

If files are deleted, list them explicitly in the delta manifest/handoff; overwrite ZIP alone cannot delete files.

## Continuation audit

The next deep-Abyss content already has six-spirit runtime structures, but legacy player-facing `オクタプリズマ` remains while newer canon defines `輪廻の結晶`.

Do not mass-rename internal `octaprism*` save keys or migration IDs. A later dedicated unit should audit player-facing name/meaning and preserve save compatibility. Existing UI-text review rules still require controlled review rather than unrelated silent copy changes.

## Files changed/new in this unit

- `map.js`
- `maps_logic.js`
- `monsters.js`
- `canon/PRISMA_CODING_HANDOFF_v5.md`
- `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`
- `tools/validation/validate-monster-habitat-master.js`
- `development_notes/2026-08-13/targeted_prologue_map_section_check_20260813.js`
- `development_notes/2026-08-13/reports/PROLOGUE_HABITAT_VISIBILITY_AND_DELTA_DELIVERY_20260813.md`
- this handoff
- validation log
- delta manifest

No deleted files.

## Validation

Bundled validation suite was not run, per current handoff policy.

PASS:

- syntax checks for changed JS
- prologue map-section targeted check
- previous runtime image/thunder/rexnote targeted check
- previous map-section/volcano targeted check

Real-device priority: encyclopedia should omit Nameless Village while encounters and north special behavior remain unchanged.
