# Phase 8A — ガルヴァニア地理再編 Status

**Date:** 2026-08-10  
**Status:** implemented / targeted validation PASS / full suite 12/66 known baseline failures

## Implemented

- 旧ガルヴァニア洞窟のワールド2地点を新規 `ガルヴァニア渓谷` に置換。
- 旧魔王城ワールド座標 x8,y50 を新規 `ガルヴァニア帝国` に置換。
- 既存魔王城内部をガルヴァニア帝国内正門へ接続。
- 既存ガルヴァニア洞窟6階層を `奈落への洞窟` へ転用し x38,y55 / x42,y55 に移設。
- 魔王城クリア後のみ奈落への洞窟入口側へ進めるよう再ゲート。
- 奈落への洞窟祭壇側出口で `nadirCaveCleared` を設定し、統合の祭壇を解放。
- 結晶樹クリア後の破壊音、渓谷破壊後イベント、倒れた魔族2名をruntime接続。
- 旧洞窟の補給・補修テキストを深淵防衛線の証拠として再文脈化。
- 旧saveの発見地点・後半進行を互換移行。
- スカイプリズムから魔王城への直接移動を外し、新地理順へ更新。

## MAP IDs

- `MAP000025`: 奈落への洞窟（既存内部レイアウト転用）
- `MAP000027`: 魔王城ガルヴァニア（既存内部）
- `MAP000032`: 統合の祭壇（既存レイアウト）
- `MAP000074`: ガルヴァニア渓谷（新規M0）
- `MAP000075`: ガルヴァニア帝国（新規M0）

## Remaining

- 魔王城内部シナリオ/三幹部/ゼノン/シャニー/第二次統合の新版化。
- ガルヴァニア帝国M0の城下町・NPC・避難民・負傷者・防衛設備の品質拡張。
- 魔王城から奈落への洞窟へ向かう演出の最終調整。

## Validation result

- `validate-galvania-geography-phase8a.js`: PASS.
- Phase7C / Phase7D / system-input / main-story / news / map-actor targeted validators: PASS.
- Full `run-all.js`: **12/66 FAIL**.
  - assets intentionally omitted from delivery: 10 known asset validators.
  - stale legacy validators: 2 (`validate-prologue-phase2.js`, `validate-story-monster-variants.js`).
- Phase8A由来の新規FAILなし。
