# Phase8D — 奈落への洞窟「深淵防衛線」 / 統合の祭壇前半 Status

**Date:** 2026-08-10  
**Status:** implemented

## Runtime

- `GALVANIA_CAVE / MAP000025` の6階層構造・既存パズルを維持。
- 魔王城クリア後にも敵対魔族が襲うhunter表現を、侵食側の魔物へ置換。
- F1/F2/F3/F4/F5/F6へ長期防衛を示す調査ポイントを追加。
- F3/F4/F6の任意bossを「魔王軍の番人」ではなく、保管区画へ居着いた侵食獣／異形へ再文脈化。
- `ABYSS_FIELD / MAP000032` の既存レイアウトを変更せず、防衛設備の方向・新しい複数人の足跡・旧術式上の新術式を調べられるようにした。
- 先行者の正体と光属性は未開示。
- `nadirCaveCleared` および入口/祭壇側座標は維持。

## Deferred intentionally

- 統合の祭壇「光の楔アラン」戦。
- アラン死亡／救済の不可逆分岐。
- 救済条件「王への上申書」連続サブクエスト。

現runtimeでは上申書取得手段がないため、Phase8Dでアラン戦だけを先行させると死亡確定ルートを実質強制する。次Phaseで救済条件と戦闘をセット実装する。

## Source / validation

- Scenario source: `docs/scenario/40_NADIR_CAVE_DEFENSE_LINE_AND_INTEGRATION_ALTAR_PHASE8D_20260810.md`
- Validator: `tools/validation/validate-nadir-cave-phase8d.js`

## Validation

- `validate-nadir-cave-phase8d.js`: PASS
- Phase8C / 8B / 8A / 7D regressions: PASS
- system-input / NEWS / mapActors: PASS
- `run-all.js`: **12/69 FAIL** — 10 assets-excluded failures + 2 stale legacy validators; Phase8D-specific new failureなし。
