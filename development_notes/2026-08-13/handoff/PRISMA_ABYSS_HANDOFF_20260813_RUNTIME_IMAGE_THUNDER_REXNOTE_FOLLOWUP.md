# PRISMA ABYSS Handoff 2026-08-13 — Runtime Image / Thunder / Rexnote Follow-up

## Current status

2026-08-13 Phase3後のruntime follow-upを反映済み。

今回、Phase3 handoffで唯一残っていた「レクスノート邸外周のハヤテ無言接触」も正式外周MAPの新設と同時に完了した。

2026-08-12 proposal由来の「保留」はこれで0件。

## Completed in this unit

### UI

- 設定画面のタブ順を `セーブ → 設定` へ変更。
- 初期active tabは従来どおり設定。

### Battle AUTO

- レア専用開始時AUTO OFFロジックを共通化。
- レア遭遇およびボス遭遇は戦闘開始時AUTO OFF。
- `battleAutoStart` 永続設定は変更しない。
- 通常のボス戦では戦闘中のAUTO再ONを禁止しない。

### Monster image identity

Stone Jelly 501 / Lucion 501の数値ID衝突が原因だった。

- generic `Entity` が `DB.CHARACTERS` を検索する契約を廃止。
- `Player` だけcharacter master fallback。
- `Monster` はmonster dataだけを画像正本とする。

個別ID 501 hackは入れていない。

Git側 `assets/monsters/monster_000501.png` の存在も確認済み。

### Startup image loading

旧起動経路は `GRAPHICS.data` 全698キーをmemory loadし得た。

現在:

- startup GRAPHICS = 186
- battle backgrounds = 28 / 28 startupへ自動包含
- `GRAPHICS.request()` でdedupe/retryを共通化
- `GRAPHICS.load()` は有限worker並列
- lazy `get()` も同じpipeline
- raw startup 55 URL中、GRAPHICSと重なる53 URLを二重preloadしない
- raw補助preloadは現在2 URL
- timeout後は新しいraw URLを追加scheduleしない

全量cache warmupはService Worker側で維持。

### Thunder Fortress

Post-Big-Lighthouse相当の `undersea_volcano_departure_story` stateだけMarieを `(13,21)` へ移動。

Freidaは `(14,21)` のまま。

Phaser fixed-map rendererも共通改善:

- 範囲外fixed tileのedge-clamp複製を停止
- fixed map外周は1枚のbackdrop tileSprite
- 同一floor textureならgroundを1枚のtileSpriteへbatch
- texture未decode／mixed floor／animated waterなら旧tile描画へfallback
- electric decorの無限Tween群をscene timer 1本へ共通化

画像欠落を許して負荷を下げる実装にはしていない。

### Rexnote estate / Hayate

New fixed map:

- `REXNOTE_ESTATE_GROUNDS`
- `MAP000077`
- `レクスノート邸 外周`

World route:

`WORLD -> REXNOTE_ESTATE_GROUNDS -> REXNOTE_ESTATE`

Hayate:

- external grounds `(5,7)`
- requires `rexnoteRouteKnown`
- missing `hayateRexnoteSighted`
- event `hayate_rexnote_sighting`
- no CONV / no LOG
- sets `hayateRexnoteSighted`
- refresh removes actor

Do not move this encounter back inside the estate.

## Important runtime IDs / flags

New map:

- `MAP000077 / REXNOTE_ESTATE_GROUNDS`

Newly consumed proposal flag:

- `hayateRexnoteSighted`

Existing important Phase3 flags remain:

- `rexnoteBasementRequested`
- `rexnoteBasementEntered`
- `rexnoteRegulusDefeated`
- `rexnoteGrimoireObtained`
- `rexnoteBasementCleared`
- `alanJoinedAtRexnote`
- `rexnoteShipObtained`
- `hasShip`

## Files changed

- `main.js`
- `battle.js`
- `assets.js`
- `menus_config.js`
- `map.js`
- `story.js`
- `phaser-field.js`
- `news.js`
- `development_notes/2026-08-13/targeted_followup_check_20260813.js`
- `development_notes/2026-08-13/reports/RUNTIME_IMAGE_THUNDER_REXNOTE_FOLLOWUP_20260813.md`
- this handoff

## Validation policy / result

User instructed not to use bundled validation tools.

Do not reinterpret old bundled-validator failures as blockers without checking whether the validator encodes superseded behavior.

This unit used:

- `node --check` on all 8 changed runtime JS: PASS
- `development_notes/2026-08-13/targeted_followup_check_20260813.js`: PASS

Latest targeted result:

```json
{
  "entityIdentity": "ok",
  "mapData": "ok",
  "staticContracts": "ok",
  "graphics": {
    "all": 698,
    "startup": 186,
    "battle": 28,
    "startupRaw": 55,
    "startupSupplemental": 2,
    "maxActive": 3
  }
}
```

## Do not redo

- Water City riot Phase1
- Forbidden Forest Arisa/Haine Phase2
- Rexnote basement B1-B5 / Regulus / grimoire / Alan ship join Phase3
- Hayate silent encounter is no longer pending; it is now implemented outside the estate
- Do not reintroduce generic Character lookup into `Entity`
- Do not special-case Monster ID 501; the fix is the class image-ownership boundary
- Do not restore per-electric-decor infinite tweens
- Do not make fixed-map batching hide undecoded textures
- Do not restore unbounded `GRAPHICS.load()` at boot

## Remaining high-priority verification

The delivery ZIP still omits `assets/`, so full physical file validation cannot be completed from this package alone.

Next pass should use an assets-inclusive real-device environment and prioritize:

1. cold startup / warm startup image behavior
2. Stone Jelly battle image
3. Thunder Fortress movement responsiveness over several minutes
4. post-Big-Lighthouse Marie/Freida placement
5. rare and boss AUTO-start behavior
6. NEW GAME route through Water City -> Forbidden Forest -> Rexnote grounds/Hayate -> basement -> ship/Alan

If any startup image error remains, capture the exact requested path. The loader now reports only final retry failure, so a remaining path should be treated first as an asset-manifest/file-integrity problem rather than suppressed.

## Source of truth

- `development_notes/2026-08-13/reports/RUNTIME_IMAGE_THUNDER_REXNOTE_FOLLOWUP_20260813.md`
- `development_notes/2026-08-13/handoff/PRISMA_ABYSS_HANDOFF_20260813_REXNOTE_BASEMENT_PHASE3.md`
- `development_notes/2026-08-12/scenario/WATER_CITY_RIOT_REXNOTE_BASEMENT_PROPOSAL_20260812.md`
- `canon/PRISMA_CODING_HANDOFF_v5.md`
- `canon/PRISMA_DEVELOPER_CORE_THOUGHTS_v6.md`
- `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`
- `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
