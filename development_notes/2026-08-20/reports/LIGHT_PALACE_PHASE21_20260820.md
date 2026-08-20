# PRISMA ABYSS — Light Palace Phase 21

Date: 2026-08-20
Base: Phase 20 applied

## Scope

Phase 21 addresses the remaining issue where the six-point magic circle in the Light Palace flashback still does not appear even though the real runtime contains:

`assets/effect/fx_ultimate_244_genesis_magic.png`

The requested visual contract is unchanged:

- map absolute coordinate: X17 / Y16
- footprint: about 9 floor tiles
- layer order: floor -> magic circle -> walls / characters / bosses
- persistent during the binding sequence

## Actual remaining cause

Phase 20 fixed the 9-slice crop scaling, but the runtime image registry path still prevented this particular image from reaching that renderer.

The canonical asset registration is:

- `PRISMA_ASSETS.battleFx["ultimate-genesis-magic"]`
- `assets/effect/fx_ultimate_244_genesis_magic.png`

However, the field/story image loader `GRAPHICS` used only `PRISMA_ASSETS.graphics` as its lookup table.

Therefore the persistent floor-effect route behaved as follows:

1. Story state requested `ultimate-genesis-magic`.
2. Phaser called `GRAPHICS.get("ultimate-genesis-magic")` / `GRAPHICS.request(...)`.
3. `GRAPHICS.data["ultimate-genesis-magic"]` was undefined because `GRAPHICS.data` points to `PRISMA_ASSETS.graphics`.
4. The loader returned no image.
5. The legacy Canvas fallback used the same `GRAPHICS` cache and likewise had no image.
6. The 9-slice renderer itself could be correct and still never receive pixels to draw.

This also explains why merely confirming that the PNG exists in `assets/effect/` does not solve the problem.

## Fix

`assets.js` now gives `GRAPHICS` a central resolver that can read both canonical registries:

- `PRISMA_ASSETS.graphics`
- `PRISMA_ASSETS.battleFx`

The canonical path is **not duplicated** into `PRISMA_ASSETS.graphics`.

`GRAPHICS.resolveKey()` supports both:

- runtime key -> `ultimate-genesis-magic`
- source path -> `assets/effect/fx_ultimate_244_genesis_magic.png`

`GRAPHICS.request()` and `GRAPHICS.get()` normalize through that resolver and cache the loaded Image under the canonical key.

`story_logic.js` and `phaser-field.js` now use the same resolver, so key-based and source-path-based story effects cannot diverge.

The Phase 20 crop scaling fix remains unchanged:

`image.setScale(displayWidth / sourceWidth, targetSliceHeight / cropHeight)`

The floor-effect depth contract also remains unchanged.

## Cache update

The App Shell cache generation is advanced to:

`prisma-abyss-v94.20260820`

This is necessary because `assets.js` itself changed. Without a service-worker generation change, an older cached loader could remain active even when the other runtime files are updated.

## Validation

Passed:

- syntax check for all top-level JavaScript files
- Phase 21 validator
- Phase 20 validator except its historical exact cache-generation assertion, which is superseded by Phase 21
- runtime registry smoke test using a mock 384x384 Image:
  - battleFx key resolves
  - battleFx source path reverse-resolves
  - `GRAPHICS.request("ultimate-genesis-magic")` loads the canonical PNG path
  - the loaded image is cached as `GRAPHICS.images["ultimate-genesis-magic"]`
  - requesting by source path reuses the same cached image
- persistent magic circle remains X17/Y16, size 9, slices 9
- legacy Canvas still requests the same key through `GRAPHICS.get()`
- Service Worker cache generation is v94

The provided ZIP intentionally omits the real `assets/` directory, so validation does not require the PNG file to exist inside this delivery archive. The user's stated runtime asset presence is treated as the deployment condition.

## Expected manual result

At the Luna binding trigger on Light Palace flashback 3F:

1. `lightPalaceFlashbackRitualVisible` becomes true.
2. `ultimate-genesis-magic` resolves from `battleFx`.
3. The PNG is loaded into the shared `GRAPHICS` runtime cache.
4. Phaser reconstructs the 9 horizontal slices into the full 9-tile image.
5. The image remains above floor tiles and below walls / characters / bosses.

## File inventory

変更・作成したファイルは下記の8件です。

1. `assets.js`
2. `phaser-field.js`
3. `story_logic.js`
4. `sw.js`
5. `news.js`
6. `development_notes/2026-08-20/validation/validate-light-palace-phase21.js`
7. `development_notes/2026-08-20/reports/LIGHT_PALACE_PHASE21_20260820.md`
8. `development_notes/2026-08-20/DELTA_MANIFEST_20260820_LIGHT_PALACE_PHASE21.txt`
