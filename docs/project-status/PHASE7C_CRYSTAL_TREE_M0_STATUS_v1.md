# PRISMA ABYSS — Phase 7C 結晶樹M0ルート Status v1

**作成日:** 2026-08-10  
**基準:** `PRISMA_PHASE7B_CRYSTAL_TREE_FOUNDATION_2026-08-10.zip`  
**状態:** 水上都市→結晶樹M0→ミネルバ→ルーナ正式加入→魔王軍直接戦闘②→治療/固定成長→長会話レビュー直前まで接続完了

## 1. 今回の実装範囲

- 水上都市北側の既存水路文脈を使い、ソフィア説明後だけ「古い水門」を使用可能にした。
- 新しいワールド座標は確定していない。水門位置も最終MAP図面で移設可能。
- `CRYSTAL_TREE / MAP000073` を1枚のM0固定MAPとして追加。
  - 29x21。
  - 最終フロア数を意味しない。
  - ランダムエンカウントなし。未確定の生態系を今の都合で作らない。
- ミネルバ(ID206)を実フィールドNPCとして配置。
- 初対面後、ルーナ(ID401)を正式加入へ接続。
  - EXP要求倍率2000%。
  - `App.addStoryAlly()` の既存carryoverにより、光宮殿回想で到達したLv/EXP/装備/習得を最低保証する。
  - PT満員時のactive party強制入替は行わない。
- 結晶樹根元で魔王軍直接戦闘②を実装。
  - M0編成: 魔人兵士(652) / 魔人兵長(755) / 魔人兵士(652)。
  - 新しい固有幹部は作っていない。
  - AUTO可。forced lossなし。
  - noRecruit / noQuestProgress。
- 戦闘勝利後:
  - ルーナ Story EXP +300,000（一度のみ）
  - EXP要求倍率を絶対値1800%へ設定
  - `lunaMemoryStage=2`
  - `lunaCrystalTreeStabilized`
  - `leonCrystalTreeTreated`
  - `crystalTreeState=5`
- 現在の本編終端は `storyStep=7 / subStep=11`。
- Step8/魔王城はまだ解禁しない。

## 2. 再実行・中断安全性

### ミネルバ初対面
`crystalTreeMinervaMet` を処理の最後に置く。

先に:
1. 会話
2. ルーナ正式加入
3. `lunaFormalJoined`
4. WorldState更新
5. subStep更新

を行う。

途中中断で「初対面済みだけ立ち、ルーナが加入していない」状態を作らない。

### 結晶樹クリア
`crystalTreeCleared` を最終commit flagにする。

先に:
1. once-only Story EXP
2. 1800%設定
3. ルーナ/レオン治療state
4. `crystalTreeState=5`
5. subStep=11

を適用する。

Story EXPは reward key `luna_crystal_tree_300k` で二重加算を防ぐ。

## 3. プレイヤー向け情報境界

- ソフィア会話で六属性理論を全部説明しない。
- ミネルバ初対面でも結論を一気に語らない。
- 結晶樹M0のフロア数や仮配置を物語上の設定にしない。
- `7-9` は「結晶樹の根元へ向かおう」。ルーナがactive battle partyに必ず入るとUIで偽らない。
- 長い六属性/闇/循環の会話は、ユーザーへ一度レビュー提示してから最終実装する。

## 4. 今回あえて未確定のもの

- 結晶樹の最終フロア数。
- 最終ワールド座標。
- 最終tileset/戦闘背景。
- 結晶樹固有通常モンスター生態系。
- 魔王軍戦②の固有指揮官。
- ミネルバ長会話の最終台詞。
- Step8魔王城への最終接続文面。

## 5. 検証

追加/更新:
- `validate-crystal-tree-route-phase7c.js`
- `validate-crystal-tree-foundation-phase7b.js`
- `validate-thunder-fort-defense-phase7a.js`

Phase7C validatorでは以下を固定:
- MAP000073存在
- 水門gate
- 29x21行幅
- BFS歩行到達性
- ミネルバ配置
- 水上都市への帰還
- ルーナ正式加入2000%
- 魔王軍戦②
- one-time +300,000 EXP
- 1800%設定
- Step8早期進行禁止
- 加入/報酬commit flagの実行順
- 2026/08/10 NEWS_DATA 1レコード維持

`node tools/validation/run-all.js`:

**10 / 54 FAIL**

既知FAIL 10件:
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

いずれも提供コード内に画像assets本体/manifest一式がないことによる既知項目。Phase7Cロジック由来の新規FAILは0。

## 6. 次工程

次はミネルバの結晶樹クリア後長会話を**実装せずにMarkdown稿として先に提示**する。

会話で扱う核:
- 六属性の本来の役割。
- 闇は本来「還す/休ませる」側面を持つ。
- 黒いオーラ/暗黒騎士/深淵を単純な闇属性と同一視できなくなる。
- 魔王軍と実際に二度戦っているため、急に「味方」と結論づけない。
- 魔王城へ向かう動機を単純討伐から「確かめる」方向へ変える。

ユーザー確認後に `story.js` へ反映し、その後Step8・魔王城前地理監査へ進む。
