# Phase 17 輪廻の結晶接続／Phase 18 NPC段階差分 Batch 1 作業報告

Date: 2026-08-15

## 1. Phase 17 本筋

ユーザー承認に基づき、六精霊完了直後の旧「オクタプリズマ即時授与」を廃止し、以下の本筋へ接続した。

1. 六つ目の試練完了後、六片が呼応する。
2. 結晶樹の秘跡へ戻る。
3. ミネルバ主導で六属性を融合させず循環させる。
4. ルーナと焼け焦げたペンダントが反応し、リュシオンが人の側で作られた循環を支える。
5. Item 701008 が「輪廻の結晶」として生成される。
6. 終焉の祭壇は `イルミナシア撃破 + 六精霊完了 + 輪廻の結晶生成` の三条件を必須とする。
7. 五楔ヴェグナシス撃破後、輪廻の結晶が深淵側の強制統合へ対抗してからアゼルガラグ戦へ進む。

ヴェグナシスは五楔のまま。ヴェルドは闇楔、ジャスパーは不参加の現行canonを維持した。

### セーブ互換

- 内部 Item ID `701008` は維持。
- `octaprismState` 等の旧内部キーは戦闘・セーブ互換のため残す。
- 旧701008所持セーブは同じIDを「輪廻の結晶」として継承し、儀式を強制再演しない。
- 六精霊完了済み・701008未取得のセーブは結晶樹へ戻る状態へ補正する。
- すでに終焉の祭壇以降へ進んだ旧セーブで701008が欠落する場合のみ進行不能防止の補完を行う。

## 2. Phase 18 開始

ロードマップどおり、本編が一本通る状態になった後の「全地域NPC／日記／再訪差分」を開始した。

### 共通段階管理

`MapRegistry.isProgressEntryActive()` に `stepMin / stepMax / subMin / subMax` を追加し、`mapActors[].states[].when` でも本編段階を評価できるようにした。

人物は固定 `actorId` を持ち、会話進行は `stateId` で管理する。進行差分ごとに別actorを作らない。

### Batch 1

リュミナ村:
- `lumina_baker_01`: 洞穴前／攻略直後／後の再訪。
- `lumina_goat_boy_01`: 洞穴前／攻略後。攻略後はサラが現在パーティにいる場合だけ `IF_ALLY` で短い反応を追加。

炎の里イグニシア:
- `ignisia_communal_kitchen_01`: 火の異常中／復旧直後／後の再訪。
- `ignisia_bath_elder_01`: 危機中／解決後。経験則に根差した誤認を残す。

既存NPCの会話本文は変更していない。

## 3. Validation

- `CYCLE_CRYSTAL_PHASE17_CHECK_20260815.js`: **26/26 PASS**
- `PHASE18_NPC_STAGE_BATCH1_CHECK_20260815.js`: **35/35 PASS**
- top-level JavaScript `node --check`: **62/62 PASS**
- 新規NPC4名は既存actor・mapAction座標と非衝突、意図した歩行可能tile上であることを確認。
- `news.js` は 2026/08/15 を1レコードのまま更新。
- `tools/validation/validate-news-data.js` は現スナップショットに存在しないため実行不可。専用validatorで同日レコード数と今回の追記を検査した。

## 4. 次工程

Phase 18を継続し、次はカザリア／水上都市を優先する。既存MAP密度と再訪時期を先に監査し、承認済みの新規草稿を同じ `actorId/stateId` 方式で小分けに接続する。既存人物関係・既存台詞の改稿が必要な箇所は、ユーザー方針どおり別途相談する。

## 5. Delivery files

変更・作成したファイルは下記の36件です。

- `abyss_content.js` (変更)
- `battle.js` (変更)
- `canon/PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md` (変更)
- `canon/PRISMA_CODING_HANDOFF_v5.md` (変更)
- `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md` (変更)
- `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md` (変更)
- `development_notes/2026-08-15/DELTA_MANIFEST_20260815_CYCLE_CRYSTAL_PHASE18_BATCH1.txt` (新規)
- `development_notes/2026-08-15/handoff/PRISMA_ABYSS_HANDOFF_20260815.md` (変更)
- `development_notes/2026-08-15/reports/PHASE17_CYCLE_CRYSTAL_PHASE18_BATCH1_20260815.md` (新規)
- `development_notes/2026-08-15/validation/CYCLE_CRYSTAL_PHASE17_CHECK_20260815.js` (新規)
- `development_notes/2026-08-15/validation/CYCLE_CRYSTAL_PHASE17_CHECK_20260815.log` (新規)
- `development_notes/2026-08-15/validation/PHASE18_NPC_STAGE_BATCH1_CHECK_20260815.js` (新規)
- `development_notes/2026-08-15/validation/PHASE18_NPC_STAGE_BATCH1_CHECK_20260815.log` (新規)
- `development_notes/2026-08-15/validation/TOP_LEVEL_JS_NODE_CHECK_20260815_PHASE18_BATCH1.log` (新規)
- `docs/OCTAPRISM_AZELGARAG_BATTLE_GIMMICK_SPEC_20260803.md` (変更)
- `docs/scenario/07_DIALOGUE_REVIEW_QUEUE.md` (変更)
- `docs/scenario/08_IMPLEMENTATION_HANDOFF.md` (変更)
- `docs/scenario/30_PENDANT_OCTAPRISM_RESONANCE_APPROVED_20260804.md` (変更)
- `docs/scenario/44_CYCLE_CRYSTAL_RITUAL_REALIGNMENT_PROPOSAL_20260815.md` (変更)
- `docs/scenario/45_WORLD_LIFE_REVISIT_DIALOGUE_EXPANSION_DRAFT_20260815.md` (新規)
- `docs/scenario/46_COMPANION_WORLD_REACTION_SKITS_DRAFT_20260815.md` (新規)
- `docs/scenario/47_NPC_KNOWLEDGE_MISBELIEF_LIE_LEDGER_DRAFT_20260815.md` (新規)
- `docs/scenario/48_WORLD_LIFE_RUNTIME_INSERTION_PLAN_DRAFT_20260815.md` (新規)
- `docs/scenario/50_TOWN_NPC_STAGE_ID_EXPANSION_MASTER_20260815.md` (変更)
- `docs/scenario/55_CYCLE_CRYSTAL_RITUAL_APPROVED_IMPLEMENTATION_20260815.md` (新規)
- `docs/scenario/56_PHASE18_LUMINA_IGNISIA_NPC_STAGE_BATCH1_20260815.md` (新規)
- `docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md` (変更)
- `docs/scenario/abyss-region.md` (変更)
- `item_runtime.js` (変更)
- `items.js` (変更)
- `main.js` (変更)
- `map.js` (変更)
- `maps_logic.js` (変更)
- `news.js` (変更)
- `story.js` (変更)
- `story_logic.js` (変更)
