# Phase8C — 魔王城真相／第二次統合 実装状況 v1

**Date:** 2026-08-10  
**Status:** implemented / validated

## 実装済み

- ガルヴァニア帝国初回進入で、負傷兵・子ども・避難生活をルーナが目撃。
- 帝国M0へ負傷兵／配給係／避難親子／工兵を追加。
- 魔王城1Fへ地下巡回優先、防衛設備、反復補修の環境story eventを追加。
- 三幹部のPhase8B男性設定・戦闘理由を維持しつつ、ルーナの誤った魔族史／討伐歴への後悔と再起を戦前会話へ追加。
- ゼノン撃破後、玉座裏の無傷の闇プリズムを確認。ルーナが直接触れて記憶Stage3へ。
- 記憶喪失前の故郷の夜と、教団教育／討伐経験が接続し、頭痛・脱力を伴う。アルスは急かさず支える。
- ルーナが魔族討伐歴を謝罪し、許しを要求せず、自分で見て選ぶ正義へ再起。
- エクリプス滅亡時点で闇研究が完了済みだった因果、四研究者の知見、調和と強制統合の差を実装。
- 第二次統合の地鳴りを発生。奈落への洞窟→統合の祭壇へ接続。
- シャニーはゼノンの命令ではなく本人の意思で加入。

## ルーナ報酬／commit

- Story EXP +300,000 / reward key `luna_dark_castle_300k`
- `lunaMemoryStage = max(current, 3)`
- 必要EXP倍率 `min(current, 1600%)`
- `prismBlessingsComplete`
- `secondIntegrationStarted`
- `darkCastleTruthPhase8CSeen`
- 上記後に `darkCastleCleared`
- 最後に `storyStep=9/subStep=0`

## 既存save

旧 `darkCastleCleared=true` かつ `darkCastleTruthPhase8CSeen=false` のsaveでは、魔王城3F旧ゼノン座標 `x16,y7` に再閲覧イベントを表示する。

再閲覧時:

- `luna_dark_castle_300k` で二重EXPを防止。
- `WORLD_STATE mode:max` で後続Memory Stageを巻き戻さない。
- `SET_EXP_MULTIPLIER onlyDecrease:true` で後続倍率を1600%へ戻さない。
- storyStepは変更しない。

## プレイヤー情報境界

- ガルヴァニア渓谷の門を破壊したのがアランであることは非開示。
- アラン／ヴェルド／ジャスパーが統合の祭壇へ先行中であることも非開示。
- ルーナが夜に握っていた「誰か」の手の正体も非開示。

## 関連資料

- `docs/scenario/39_DARK_CASTLE_TRUTH_AND_SECOND_INTEGRATION_PHASE8C_DRAFT_20260810.md`
- `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
- `canon/PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md`
- `canon/PRISMA_DEVELOPER_CORE_THOUGHTS_v6.md`
- `canon/PRISMA_CODING_HANDOFF_v5.md`
- `tools/validation/validate-dark-castle-phase8c.js`


## Final validation result

- Phase8C targeted validator: PASS.
- Phase8B / Phase8A / Phase7D / system-input / NEWS / mapActors regression: PASS.
- `run-all.js`: **12/68 FAIL**. Failure set is unchanged from Phase8B: 10 assets-excluded validation failures + 2 stale legacy validators requiring old `PROLOGUE_HILL` / removed story-monster-variant API. No new Phase8C-specific failure.
