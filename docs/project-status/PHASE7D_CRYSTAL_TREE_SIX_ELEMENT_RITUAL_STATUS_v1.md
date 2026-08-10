# PRISMA ABYSS — Phase 7D 結晶樹・六属性秘薬 Status v1

**作成日:** 2026-08-10  
**基準:** 2026-08-10 system/input累積更新版  
**状態:** 承認済み長会話と治療commitをruntimeへ実装。結晶樹編完了後 `storyStep=8 / subStep=0` へ接続。

## 1. 実装概要

- `CRYSTAL_TREE_DEFENSE_CLEAR` を応急安定化へ変更。
- `CRYSTAL_TREE_SIX_ELEMENT_RITUAL` を追加。
- 六属性の順番は `水→風→光→火→雷→闇`。
- 既存登録済みpedestal assetをMAP000073へ円状にM0仮配置。
- 会話中は `FIELD_CUTSCENE` で該当pedestalを発光強調。
- ミネルバがレイラ/レオン/ルーナの症状差から人体の小循環と不完全統合を推測。
- レオン→ルーナの順で治療。
- ルーナは故郷の感覚記憶を一部回復。
- 正常な闇には支配/洗脳の本質がないことを観測結果として提示。
- 「魔王軍は味方」ではなく「闇プリズムを確認しに魔王城へ行く」でStep8へ進む。

## 2. Runtime commit順

魔王軍戦②勝利時は以下だけ。

1. 応急安定化会話。
2. `subStep=11`。
3. `crystalTreeDefenseCleared`。

その後、ミネルバへ話しかけて長会話を完走した後に:

1. `leonCrystalTreeTreated`
2. `lunaCrystalTreeStabilized`
3. `lunaMemoryStage=2`
4. Luna Story EXP +300,000 / `luna_crystal_tree_300k`
5. Luna EXP multiplier 1800%
6. `crystalTreeState=5`
7. `crystalTreeSixElementRitualSeen`
8. `crystalTreeCleared`
9. `storyStep=8`
10. `subStep=0`

`crystalTreeCleared` は治療・報酬より後ろに置く。

## 3. Save compatibility

### Phase7C既存save

旧Phase7Cは戦闘勝利時点で以下を既に持つ可能性がある。

- `crystalTreeCleared`
- `leonCrystalTreeTreated`
- `lunaCrystalTreeStabilized`
- `lunaMemoryStage=2`
- `luna_crystal_tree_300k`
- Luna 1800%

`crystalTreeSixElementRitualSeen` はこれらから自動付与しない。したがって旧saveでもミネルバへ話しかけると承認済み長会話を再生できる。Story EXPは既存reward keyで二重加算しない。

### レイラ治療flag

新規 `leilaCrystalTreeLeafTreated` を葉使用成功時に立てる。

旧saveは `leilaJoined=true` なら、現行旧ルート上「葉を使って回復した」ことと同義だったため、`reconcileCrystalTreeWorldState()` で治療済みへ互換昇格する。

新規進行では、光宮殿祭壇戦を治療flagで塞がない。既存実装ではレイラへ葉を使えるのが宮殿解放後だからである。代わりに、水上都市のソフィアが結晶樹ルートを開く前にレイラ治療済みを要求する。

## 4. M0 map staging

MAP000073は最終地理ではない。

仮の六台座:

| 属性 | x | y |
|---|---:|---:|
| 水 | 11 | 4 |
| 風 | 14 | 3 |
| 光 | 17 | 4 |
| 火 | 18 | 6 |
| 雷 | 16 | 8 |
| 闇 | 12 | 8 |

既存入口 `(14,18)` からミネルバ根元周辺への経路は、blocking pedestalを含めても維持する。

## 5. 正本資料更新

- `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
  - 32.18 六属性循環/人体小循環/秘薬を追加。
- `docs/scenario/36_CRYSTAL_TREE_SIX_ELEMENT_RITUAL_DRAFT_20260810.md`
  - approved/implementedへ更新。
- `docs/scenario/07_DIALOGUE_REVIEW_QUEUE.md`
  - DR-20260810-crystal-tree-six-element-ritualをresolvedで追加。
- `docs/scenario/03_FORESHADOWING_LEDGER.md`
  - FL-005故郷の感覚モチーフを追加。
- `canon/PRISMA_CODING_HANDOFF_v5.md`
  - Phase7Dと次のガルヴァニア監査方針へ更新。

## 6. 次工程

魔王城／ガルヴァニア再編はまだ実装しない。まず既存地理・イベント・敵Rank・旧会話を監査し、新正本に対して「維持/意味変更/移設/廃止」を分類する。

## 7. Validation result

Targeted validators:

- JS syntax: PASS (`story.js`, `main.js`, `database.js`, `map.js`, `news.js`)
- `validate-crystal-tree-route-phase7c.js`: PASS
- `validate-crystal-tree-six-element-phase7d.js`: PASS
- `validate-crystal-tree-foundation-phase7b.js`: PASS
- `validate-light-palace-present-assault-phase6e.js`: PASS
- `validate-news-data.js`: PASS
- `validate-system-input-update-20260810.js`: PASS

Full `run-all.js`: **12/65 FAIL**.

Known asset-omission failures (10):

1. `validate-asset-fixed-names.js`
2. `validate-authored-map-props.js`
3. `validate-blocking-map-objects.js`
4. `validate-chest-mimics.js`
5. `validate-companion-map-sprites.js`
6. `validate-event-map-markers.js`
7. `validate-fixed-water-shore.js`
8. `validate-full-cache-assets.js`
9. `validate-summit-temple.js`
10. `validate-visual-polish.js`

Stale legacy-validator failures (2):

- `validate-prologue-phase2.js`: removed `PROLOGUE_HILL` required by old validator. Current prologue uses WEST/SOUTH/NORTH split and current phase2a/b/c validators pass.
- `validate-story-monster-variants.js`: removed `getStoryMonsterVariant` API required by old validator.

Phase7D changes introduce no additional full-suite failure.
