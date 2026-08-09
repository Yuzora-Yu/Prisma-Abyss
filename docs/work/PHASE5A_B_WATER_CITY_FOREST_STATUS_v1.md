# PRISMA ABYSS — Phase 5A/B 水上都市解放後・禁忌の森必須化 v1

**作成日:** 2026-08-09  
**基準:** Phase 4 グラド初戦完成版  
**状態:** Phase 5A/B 完了

## Phase 5A — 海底神殿後の即船取得を撤去

- `storyStep 4` を維持し、`subStep 4` へ進む。
- 海底神殿クリアで `waterCityCleared` は立てるが、以下を廃止。
  - 船アイテム即取得
  - `UNLOCK boat`
  - `hasShip`
  - `STEP 5` への即移行
- WorldState `waterCityState` を追加。
  - 0: 未到達/未確定
  - 1: 暗黒騎士占拠
  - 2: 解放後
  - 3: 後期変化用予約
- story state schema version 4。
- 解放後に水上都市へ戻り、ソフィアと一度だけ会話する呼吸区間を追加。
- 「今すぐ次へ走らず休む」「兵が消えた今だから見られる情報がある」を会話骨格へ反映。

## Phase 5B — ハイネ／アリサを本編必須化

- 既存 `arisa_haine_forest_depths` を `mainStory:true` とし、直接の任意解禁を停止。
- 水上都市で呼吸区間を終えた後、風の集落の使いが出現。
- 使いから「アリサとハイネが禁忌の森深部から戻らない」と知らされる。
- 風の集落へ戻ることを `4-6` の本編目的化。
- 既存村人イベントを本編イベントへ変換し、クエストを自動受注。
- `4-7`: 禁忌の森深部へ向かい二人を救出。
- 既存深部MAP／固定ボス／会話を再利用。
- 救出戦後はクエストをその場で自動完了し、既存rewardAlliesでアリサID108／ハイネID207を正式加入。
- `4-8`: 二人を迎えて水上都市へ戻る。

## 変更ファイル

- `main.js`
- `database.js`
- `story.js`
- `map.js`
- `quests.js`
- `tools/validation/validate-main-story-routing.js`
- `tools/validation/validate-playable-prologue-phase2a.js`（schema versionを「3以上」へ追随）
- `tools/validation/validate-water-city-transition-phase5a.js`（新規）
- `tools/validation/validate-arisa-haine-main-route-phase5b.js`（新規）

## 検証

- Water City transition Phase5A: PASS
- Arisa/Haine main route Phase5B: PASS
- main-story routing: PASS
- map actors: PASS
- story dialogue data: PASS
- full run-all: **10 / 39 FAIL**

FAILはPhase 0から継続している画像assets欠落10件のみ。新規回帰0。

## 次工程

Phase 5C:
- 水上都市へ帰還
- レクスノート家の導線
- 最小「レクスノート邸」MAP新設
- アラン本編加入
- 邸宅で船入手
- その後初めて `STEP 5` 雷の要塞へ接続
