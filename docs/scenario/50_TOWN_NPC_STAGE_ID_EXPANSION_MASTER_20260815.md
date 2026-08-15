# PRISMA ABYSS — 町NPC ID／段階会話 拡張マスター

Date: 2026-08-15  
Status: authoring/runtime mapping plan  
Priority: subtask; main-roadmap work takes precedence

## 1. Purpose

町NPCを「その場限りの台詞」ではなく、同じ人物が本編進行を記憶して話し方を変える存在として管理する。

既存runtimeの正本は以下をそのまま使う。

- `placementId`: MAP／階層内で一意の配置番号。
- `actorId`: 人物の安定ID。配置を動かしても原則変更しない。
- `stateId`: その人物の会話・配置段階。
- `states[].when`: `storyStep/subStep`, `progress.flags`, quest state 等による条件。

シナリオ側では `NPC-AREA-XXX` を人物プロフィールIDとして持ち、runtimeの `actorId` と一対一で対応させる。
同じ人物の再訪差分に新しいNPC IDを発行しない。

## 2. ID rule

| Layer | Example | Meaning |
|---|---|---|
| profile ID | `NPC-LUMINA-NEW-01` | シナリオ資料上の人物ID |
| actorId | `lumina_baker_01` | runtime安定ID |
| placementId | `3` | そのMAP内での配置番号 |
| stateId | `before_cave` | 会話／配置段階 |
| eventId | `npc_lumina_baker_before_cave` | StoryManager event |
| script key | `NPC_LUMINA_BAKER_BEFORE_CAVE` | 会話本文 |

### Rules

1. `actorId` は人物に紐づけ、会話段階ごとに増やさない。
2. 同じ人物が場所を移る場合は `state.placement` を優先する。
3. 一時退場は `missingFlag` 等でstate自体を非表示にする。
4. 再訪差分のためだけに世界共通flagを乱造しない。世界状態として意味がある事実だけ `progress.flags` に置く。
5. 将来クエスト専用段階が増える場合は `progress.quests[questId]` を使い、NPC個人の状態とメイン進行を分離する。
6. NPCの誤解・噂・嘘はプロフィール側へ理由を記録し、stateが変わっても都合よく知識を更新させない。

## 3. First implementation batch

`45_WORLD_LIFE_REVISIT_DIALOGUE_EXPANSION_DRAFT_20260815.md` のうち、本編MAP改修に合わせて先に接続する候補。

| Profile ID | actorId | Area | Minimum states |
|---|---|---|---|
| NPC-LUMINA-NEW-01 | `lumina_baker_01` | リュミナ村 | `before_cave` / `after_cave` / `later_revisit` |
| NPC-LUMINA-NEW-02 | `lumina_goat_boy_01` | リュミナ村 | `before_cave` / `after_cave` |
| NPC-IGNISIA-NEW-01 | `ignisia_communal_kitchen_01` | イグニシア | `fire_unstable` / `fire_restored` / `later_revisit` |
| NPC-IGNISIA-NEW-02 | `ignisia_bath_elder_01` | イグニシア | `during_crisis` / `after_clear` |
| NPC-KAZARIA-NEW-01 | `kazaria_rope_mender_01` | カザリア | `during_disappearance` / `after_clear` |
| NPC-KAZARIA-NEW-02 | `kazaria_older_sitter_01` | カザリア | `after_clear` / `second_talk` |
| NPC-RIVARIA-NEW-01 | `rivaria_laundry_sisters_01` | 水上都市 | `occupation` / `post_riot` |
| NPC-RIVARIA-NEW-04 | `rivaria_warehouse_clerk_01` | 水上都市 | `post_riot` / `rexnote_route` |
| NPC-REXNOTE-NEW-01 | `rexnote_gardener_orba_01` | レクスノート邸 | `first_arrival` / `cellar_evidence` / `alan_present` |
| NPC-THUNDER-NEW-01 | `thunder_maintenance_vasco_01` | 雷の要塞 | `during_crisis` / `ledger_known` |
| NPC-CRYSTAL-NEW-01 | `crystal_assistant_nina_01` | 結晶樹 | `before_defense` / `minerva_nearby` |
| NPC-GALVANIA-NEW-01 | `galvania_baker_01` | ガルヴァニア | `first_talk` / `lie_context_seen` |

この12名を「NPC追加専用工事」として一括投入しない。
本編で該当MAPを拡張・再訪導線を整える時に、そのMAPの既存密度・通行・イベント座標を見て必要人数だけ接続する。

## 4. Hayate as the same state architecture

レクスノート邸外のハヤテも同じ仕組みで既に管理されている。

- actorId: `hayate_rexnote_sighting`
- stateId: `hayate_rexnote_sighting`
- required: `rexnoteRouteKnown`
- missing: `hayateRexnoteSighted`

今回の演出では人物IDを増やさず、既存stateのevent内容だけユーザー指定に従って更新する。
一度遭遇した後は同じactorが再生成されない。

## 5. Background continuity rules

各NPCプロフィールには最低限、以下を持たせる。

- 生業／日々触っている物。
- 家族または近しい相手。
- 今の損得。
- その地域について知っている範囲。
- 知らないこと。
- 信じている噂。
- 誤っている場合、その誤りに至った経験。
- 意図的に嘘をつく場合、守りたい対象・露見時の反応。
- 本編事件後に変わるもの／変わらないもの。

「事件が解決したので全員が真相を知り、正しい感想を言う」状態にはしない。

## 6. Runtime insertion rule

本編MAP改修時の順序:

1. MAPの目的・導線・イベントを先に確定。
2. 通行と重要イベントを邪魔しないNPC座標を決める。
3. `placementId` をそのMAPの `nextActorPlacementId` から発行。
4. profile IDに対応する固定 `actorId` を設定。
5. 進行差分を `states` として同じactorへ積む。
6. 新規会話をscenario Markdownでレビュー。
7. 接続が承認されたものからruntimeへ反映。
8. 各stateが本当に到達可能かを検証。

## 7. Do not do

- 町を賑やかにするためだけにNPCを詰める。
- 同一人物のafter-clear版を別actorとして置く。
- 全員に本筋の正解を喋らせる。
- 進行ヒントを生活会話へ無理に混ぜる。
- 一度しか使わない小さな会話差分ごとに世界flagを発行する。

