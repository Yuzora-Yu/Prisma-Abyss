# PRISMA ABYSS — Light Palace Phase 24

Date: 2026-08-20  
Base: Phase 23 applied

## Scope

光の宮殿回想3F、ルーナ拘束時の床魔法陣について、素材と演出強度を再調整する。

維持する仕様:

- MAP絶対座標: X17 / Y16
- 表示規模: 9タイル
- 9本の横sliceでY深度を分ける
- レイヤー: floor -> magic circle -> walls / characters / bosses
- Phase 23の共通scale + seam bleedによる継ぎ目対策

## Asset change

床魔法陣素材を次へ変更。

- key: `special-rupture`
- src: `assets/effect/fx_special_rupture.png`

`special-rupture` は既存の `PRISMA_ASSETS.battleFx` 登録を使用するため、assets.jsの追加変更は不要。
Phase 21でGRAPHICSがbattleFxを解決できるようになっている前提で、同じworld-space floor effect経路からロードする。

## Animation tuning

persistent specを次へ変更。

- base alpha: 0.5
- pulse factor: 0.74 ～ 0.80
- X drift: +/- 0.4px
- Y drift: +/- 0.35px
- cycle: 3000ms（維持）

今回の `pulseMin` / `pulseMax` は基本alphaへ掛ける明滅係数として扱う。
したがってPhaser上の実効alphaは約0.37～0.40となり、Phase 23よりかなり薄く、かつ明滅幅も小さい。

旧 `pulseAlpha` 指定は後方互換として残しているため、他の床演出が従来方式を使っても挙動は変わらない。

## Layer / seam behavior

- depthOffsetは46のまま。
- seamBleedは0.5pxのまま。
- 9sliceへ同一XY変位を適用するため、微動でslice同士がずれない。
- 回転・拡縮は追加しない。

## Cache update

App Shell cache generation:

`prisma-abyss-v97.20260820`

## Validation

Passed:

- top-level JavaScript syntax check
- Phase 24 validator
- `special-rupture` の既存asset登録確認
- source path確認
- base alpha 0.5確認
- pulse factor 0.74～0.80確認
- effective alpha 0.37～0.40確認
- X drift +/-0.4px / Y drift +/-0.35px確認
- 旧pulseAlpha経路の後方互換確認
- Service Worker cache generation v97確認

## File inventory

変更・作成したファイルは7件。

1. `phaser-field.js`
2. `story_logic.js`
3. `sw.js`
4. `news.js`
5. `development_notes/2026-08-20/validation/validate-light-palace-phase24.js`
6. `development_notes/2026-08-20/reports/LIGHT_PALACE_PHASE24_20260820.md`
7. `development_notes/2026-08-20/DELTA_MANIFEST_20260820_LIGHT_PALACE_PHASE24.txt`
