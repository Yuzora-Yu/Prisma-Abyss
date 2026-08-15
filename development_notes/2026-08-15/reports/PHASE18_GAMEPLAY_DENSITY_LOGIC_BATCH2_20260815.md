# Phase18 探索密度・ゲーム性ロジック Batch2 作業報告 — 2026-08-15

## 概要

ロードマップ Phase18 の継続として、カザリア／リヴァリアへ進行段階NPCと再訪報酬を追加した。
同時に、Phase19で全MAPを拡張・再レイアウトする前提で、固定探索物の取得状態を座標から切り離す基盤を先行実装した。

今回、既存NPCの既存台詞本文は修正していない。追加した会話は新規NPC用のみ。

## 実装 1 — 固定探索物の安定 `lootId`

従来の固定宝箱・固定コンテナは、取得済み状態を基本的に `x,y` 座標で保存していた。
この方式ではMAP拡張時にコンテナを移動すると、旧セーブで再取得できたり、別の物が取得済み扱いになる可能性がある。

`dungeon.js` に以下を追加・変更した。

- `getFixedContainerDefinitionAt`
- `getFixedContainerOpenKey`
- `getFixedContainerLegacyOpenKeys`
- `isFixedChestOpenedAt` の `lootId` 対応
- `markFixedChestOpened` の永続取得IDと描画座標の分離
- 擬態箱敗北rollbackの `openKey / mapPosKey` 分離

新規・更新対象は `loot:<lootId>` を取得済みキーとして保存する。
`legacyPositions` を持つ既存探索物は、旧座標キーで開封済みだったセーブも取得済みとして認識する。

MAPの座標は今後変更してよいが、同一物を示す `lootId` は維持する。

## 実装 2 — ツボ・タルと宝箱実績の分離

固定コンテナ共通処理では、従来ツボ・タルでも `totalChestsOpened` が増える余地があった。
探索密度を上げるほど宝箱実績が水増しされるため、`noteFixedContainerOpened` を追加した。

- `chest`: 宝箱開封数へ加算
- `pot / barrel`: アイテム取得のみ。宝箱開封数へ加算しない

## 実装 3 — 汎用 `EQUIP` ストーリーaction

`story_logic.js` に固定装備をストーリーから渡す `EQUIP` action を追加した。

主要パラメータ:

- `eid`
- `plus` 0〜3
- `fixedOpts`
- `fixedTraits`
- `source`
- `silent`

既存のevent journal単位で処理されるため、付与直後に中断・再開しても同一actionを二重実行しない。
今後、町の職人・老兵・サブイベントなどから +1〜+3 装備を渡す際に専用コードを増やさず利用できる。

## 実装 4 — カザリア Phase18 Batch2

新規 actor:

- `kazaria_rope_mender_01` / 綱直しの女
- 現座標 `(24,14)`
- 解決前／解決後報酬未受取／報酬受取後の3段階
- 風の里解決後、初回だけ `鋼のブーツ+3` (eid 53)

新規固定探索物:

- `kazaria_pot_northwest_01` — 毒消し草
- `kazaria_barrel_northeast_01` — 魔法の小瓶
- `kazaria_pot_southwest_01` — 上やくそう

既存南側宝箱:

- `kazaria_chest_south_01`
- 旧 `(4,17)` を `legacyPositions` に保持

新規ツボ・タル3個はすべて壁隣接を検証済み。

## 実装 5 — リヴァリア Phase18 Batch2

新規 actor:

- `water_city_retired_deckhand_01` / 老甲板員
- 現座標 `(35,21)`
- 暴動前／暴動中／鎮圧後報酬未受取／報酬受取後の4段階
- 暴動鎮圧後、初回だけ `はがねのたて+3` (eid 67)

新規固定探索物:

- `water_city_pot_north_01` — 上やくそう
- `water_city_barrel_west_01` — やまびこ草
- `water_city_pot_east_01` — 魔法の聖水

既存北西4宝箱:

- `water_city_chest_northwest_01`〜`04`
- それぞれ旧座標を `legacyPositions` に保持

新規ツボ・タル3個はすべて壁隣接を検証済み。

## MAP拡張前提の方針

今後の町・固定ダンジョンでは、以下を同じ密度設計単位として扱う。

- 段階NPC
- 日記／掲示物／生活物
- ツボ・タル
- 宝箱
- 再訪報酬
- +装備を渡す人物
- 隠し道／ショートカット／レア敵／小型ギミック

ツボ・タルは原則として壁、外周、建物脇へ寄せ、主要通路中央へ無意味に置かない。
Phase19で座標やMAPサイズを変更しても、`actorId / placementId / stateId / lootId` は可能な限り維持する。

## ロジック監査

### 参照整合

- 固定MAP `mapActors / mapActions` -> story event 欠落: 0
- MAP quest参照欠落: 0
- `requiredQuests` 欠落: 0
- 2026-08-15 `NEWS_DATA`: 同日1レコードを維持

### 過去に不安があった戦闘系

現行コードでは以下は既に大幅に堅牢化されている。

- 最速行動優先度
- 継続ダメージ後の死亡・勝敗判定
- 勝利報酬と保存のtransaction recovery

今回、ここを旧仕様へ戻す変更は行っていない。最終Phase21では実プレイQAを行う。

### 現在も明確に暫定／未完成なゲーム性

1. **Phase18 全地域NPC／日記／再訪差分**
   - 進行中。リュミナ、イグニシア、カザリア、リヴァリアまで着手。

2. **Phase19 MAP拡張**
   - 本工程は未着手。
   - 隠し道、ショートカット、レア敵条件、段差、探索ギミック、生活導線をMAP拡張と同時に入れる予定。

3. **狩人／魔弓使い／光魔剣士の職固有ゲーム性**
   - 職業定義と暫定習得技は存在する。
   - 専用弓技や三職それぞれの明確な戦術差は未完成で、後調整対象。

4. **Lv101以降の経験値曲線**
   - `main.js` の `getNextExp` に「転生帯（後で調整前提）」と `P_REINC` 仮値が残る。
   - Phase21バランス調整対象。

## 回帰テスト

- `PHASE18_GAMEPLAY_DENSITY_LOGIC_CHECK_20260815.js`: **34/34 PASS**
- `PHASE18_NPC_STAGE_BATCH1_CHECK_20260815.js`: **35/35 PASS**
- `CYCLE_CRYSTAL_PHASE17_CHECK_20260815.js`: **26/26 PASS**
- `ALAN_PHASE17_MAINLINE_CHECK_20260815.js`: **20/20 PASS**（三条件ゲート現仕様へ検証側も更新）
- `PHASE17_OPTIONAL_ALLY_SPIRIT_JOB_CHECK_20260815.js`: PASS
- `HAYATE_REXNOTE_PHASE17_AUDIT_CHECK_20260815.js`: PASS
- `REXNOTE_BASEMENT_ROUTE_TARGETED_CHECK_20260815.js`: PASS
- トップレベルJavaScript `node --check`: **62/62 PASS**

## 次工程

ロードマップ優先でPhase18を継続する。
次バッチでは他地域の段階NPCだけを増やすのではなく、MAP拡張で移し替えられる安定IDを付けながら、探索物・再訪報酬・生活物をセットで整備する。

Phase19へ入った段階で、町だけでなく固定ダンジョンにも「一本道を崩すショートカット／鍵／小型パズル／条件付きレア敵」のいずれかを適量配置し、戦闘外のゲーム性も上げる。
