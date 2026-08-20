# PRISMA ABYSS — Light Palace Phase 25

Date: 2026-08-20  
Base: Phase 24 applied

## Scope

光の宮殿回想3F、ルーナ拘束時の床魔法陣について、動画確認を踏まえて透過度と動きを再調整する。

維持する仕様:

- asset: `assets/effect/fx_special_rupture.png`
- MAP絶対座標: X17 / Y16
- 表示規模: 9タイル
- 9本の横sliceでY深度を分ける
- レイヤー: floor -> magic circle -> walls / characters / bosses
- Phase 23の共通scale + seam bleedによる継ぎ目対策
- cycle: 3000ms

## Visual tuning

Phase 24では `alpha=0.5` に `pulseMin=0.74..0.80` を係数として掛けていたため、実効alphaが約0.37～0.40となり、意図より薄く見えていた。

Phase 25では既存の加算式 `pulseAlpha` を利用し、次へ変更する。

- base alpha: 0.77
- pulse alpha: +/- 0.03
- effective alpha: 0.74 ～ 0.80
- X drift: 0px
- Y drift: 0px

これにより魔法陣の座標は完全固定し、透明度だけがゆっくり明滅する。
床に定着した術式が発光している見え方を優先し、微小な平行移動は廃止する。

## Renderer impact

`phaser-field.js` の既存 `pulseAlpha` 経路で要求を満たせるため、描画基盤そのものは変更しない。
`driftX=0`, `driftY=0` をpersistent specに明示して、既定の微動値が入らないようにする。

## Cache update

App Shell cache generation:

`prisma-abyss-v98.20260820`

## Validation

Passed:

- top-level JavaScript syntax check
- Phase 25 validator
- `special-rupture` のasset登録確認
- base alpha 0.77確認
- pulseAlpha +/-0.03確認
- effective alpha 0.74～0.80確認
- X/Y drift 0確認
- 既存の加算式明滅経路確認
- 2026/08/20 NEWS_DATAが1レコードのみであることを確認
- Service Worker cache generation v98確認

## File inventory

変更・作成したファイルは6件です。

1. `story_logic.js`
2. `sw.js`
3. `news.js`
4. `development_notes/2026-08-20/validation/validate-light-palace-phase25.js`
5. `development_notes/2026-08-20/reports/LIGHT_PALACE_PHASE25_20260820.md`
6. `development_notes/2026-08-20/DELTA_MANIFEST_20260820_LIGHT_PALACE_PHASE25.txt`
