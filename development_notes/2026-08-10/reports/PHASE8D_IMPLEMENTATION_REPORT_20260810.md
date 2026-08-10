# PRISMA ABYSS — Phase8D Implementation Report

**Date:** 2026-08-10  
**Target:** 奈落への洞窟 / 統合の祭壇前半

## Implemented

1. 既存「奈落への洞窟」6階層を維持し、魔王城後の敵対魔族hunterを侵食側の魔物へ置換。
2. F1〜F6に、深淵側を向いた封鎖杭、空間侵食の刻印、溶けた装備と黒骨、反復凍結封鎖、補給回数、最終防衛線、新しい複数人の足跡を追加。
3. F3/F4/F6の任意bossを、魔王軍の番人・魔将ではなく侵食獣／異形として再定義。
4. 統合の祭壇のレイアウトを変えず、旧防衛設備、新しい足跡、旧封鎖術式へ重ねられた新術式を追加。
5. 先行した人物の名前・属性はプレイヤーへ伏せた。
6. NEWS 2026/08/10既存レコードへPhase8Dを追記。

## Important audit finding

現runtimeでは統合の祭壇にアラン戦が存在せず、中央亀裂の `abyss_unsealed` から直接次章へ進める。同時に、アラン救済必須アイテム「王への上申書」を得る長期サブクエストもruntime未実装。

このためPhase8Dでは亀裂導線をsoftlockさせず現状維持し、次段で **上申書クエスト + アラン戦 + 引き返す/進む + 死亡/救済** を一括設計・実装する。

## Validation result

- Phase8D dedicated validator: PASS.
- Phase8C / Phase8B / Phase8A / Phase7D / system-input / NEWS / mapActors regression: PASS.
- `run-all.js`: **12/69 FAIL**.
- Failure set is unchanged in substance from Phase8C: **10 failures caused by the intentionally omitted `assets/` tree** and **2 stale legacy validators** requiring removed `PROLOGUE_HILL` / story-monster-variant API.
- No new Phase8D-specific failure.
