# PRISMA ABYSS — Phase 2 プロローグ前半チェックポイント v1

**作成日:** 2026-08-09  
**基準:** `PRISMA_PHASE1_COMPLETE_FOUNDATION_2026-08-09.zip`  
**状態:** Phase 2 前半（NEW GAME～第一ボス出現直前）実装済み

---

## 1. 今回実装したプレイ導線

以下を実コードへ接続した。

1. NEW GAME開始地点を5年前の名もなき山奥の村・西の高台へ変更。
2. 西の高台で短い平穏時間。
3. 古き光の神へ捧げる花を採取。
4. 東空の光の明滅 → 数瞬後の爆発音 → 地震・亀裂。
5. ルーナが南エリアへ先行。
6. 南エリア入場直後、ルーナ救援戦。
7. 敗北時はゲームオーバーにせず、微弱な白い加護で回復して再戦。
8. 勝利後、プロローグ専用ルーナが一時パーティ加入。
9. 南エリア通常エンカウント解禁。
10. 北エリアへ任意寄り道可能。
11. 北は南より高Rankの敵を配置。
12. 北のみ既存メタルジェリー(ID 200201)を2%標準レア率で出現可能にした。
13. 通常エンカウント敗北時は南／北とも加護で復帰。
14. 家跡を調べ、アルス・ルーナ双方の家族と家が巨大な亀裂へ消えたことを確認。
15. 地盤崩壊を受けて南出口から逃げる判断へ移行。
16. 南出口直前で深淵の強大な存在がせり上がる演出まで実装。
17. 第一ボス戦自体は、正式な敵データ未確定のため未接続。

---

## 2. 新規最小MAP（M0）

### MAP000066 — 名もなき山奥の村・西の高台

- 17x11。
- 花採取地点。
- 災害前ルーナNPC。
- 災害発生前は南へ進めない。
- 災害後に南エリアへ遷移。

### MAP000067 — 名もなき山奥の村・南

- 25x19。
- ルーナ救援戦。
- 通常エンカウント。
- 家跡／巨大な亀裂イベント。
- 北エリアへの任意導線。
- 南出口の第一ボス出現演出。
- 第一ボス戦未実装中にMAP外へ抜けないよう、最南端は現在封鎖。

### MAP000068 — 名もなき山奥の村・北

- 27x19。
- 任意探索。
- 南より強い通常敵。
- メタルジェリーの低確率レア出現。
- 南へ戻れる。

全MAPは最終図面ではない。進行可能性とイベント接続を確認するM0版。

---

## 3. プロローグ専用ルーナ

本編ルーナ(ID401)の一時書き換えは行わず、内部string key `LUNA_PROLOGUE` のstory variantとして追加。

- `canonicalCharId: null`
- `sourceCharId: 401`
- 年齢13。
- 職：僧侶。
- 大器晩成Lv10。
- `storyOnly: true`
- `temporary: true` で加入。

正式な数値キャラクターIDは正本で未確定のため発行していない。

現在のM0基礎ステータスは進行テスト用の仮値。最終数値正本ではない。
グラフィックも現行401画像をplaceholderとして参照し、後で村娘版へ置換する。
LB50/99技は正式スキル照合前のため捏造していない。

---

## 4. 遭遇マスター

MAP側へ `monsters:[...]` を置かず、`monsters.js` の生息地正本へ追加。

### 南

既存低Rank個体 1～4をMAP000067へ追加。

### 北

既存個体 52～55をMAP000068へ追加。

### 北限定メタルジェリー

既存レアID `200201` を再利用。
通常Rank帯ではRank31からだが、5年前北エリアに限りmap contextを見てRank8でも候補化する。
レア率は既存標準の2%を再利用。
南エリアにはこの例外を適用しない。

---

## 5. 全滅救済

南／北通常エンカウントには、

- `storyLossEventId: prologue_random_defeat_recovery`
- `suppressWipeoutCountOnLoss: true`

を設定。

敗北時は白い光の演出 → HEAL → フィールド継続。
この時点ではリュシオン名を明かさない。

ルーナ救援戦も同様に通常ゲームオーバーへ落とさず、専用再戦イベントへ接続する。

---

## 6. WorldState / save schema

Phase 2で以下のprologue stateを正式に永続shapeへ追加。

- `prologueActive`
- `prologueStage`
- `prologueOutcome`
- `progress.storyVariantStates`

story state schemaを **v3** へ更新。

NEW GAME開始時はruntimeで、

- `prologueActive = true`
- `prologueStage = 1`
- `prologueOutcome = 0`

へ設定。

既存saveの未知値・既存flagsは従来どおり保持する。

---

## 7. 焼け焦げたペンダント

NEW GAME初期所持品から `701009` を除外した。

正本どおり、ペンダントはプロローグ終盤の生き別れイベントで取得する。
なお `App.getInitialData()` 側の旧save補完用初期値には旧データ互換のため現時点で残している。新規ゲーム生成は `INITIAL_DATA_TEMPLATE` を使用するため、開始時所持にはならない。

---

## 8. ストーリー専用モンスターバリアント基盤

第一ボスの正式な戦闘ID・能力が未確定であるため、勝手に数値IDを発行しなかった。

代わりに `monsters.js` へ、数値IDを持たないstring-key戦闘バリアント基盤を追加した。

- `STORY_MONSTER_VARIANTS`
- `MonsterData.getStoryMonsterVariant(key)`
- Story `BOSS` action の `storyMonsterVariantKey`
- Battle側のstring-key variant生成

数値IDなしvariantは自動的に `bestiaryExcluded` として扱える。

**現在のvariant登録件数は意図的に0件。**
第一ボスの戦闘内容確定後に登録する。

この仕組みは後で、

- プロローグ第一ボス
- グラド初戦variant
- プロローグ版イルミナシア等

にも利用可能。

---

## 9. 現在のプロローグstage

- Stage 1: 花を摘む。
- Stage 2: ルーナを追って南へ。
- Stage 3: ルーナ救援後、家へ向かう。
- Stage 4: 家消失確認後、南出口へ。
- Stage 5: 第一ボス出現確認。次工程で戦闘へ接続。

---

## 10. 検証

### 専用validator

新規：

- `validate-prologue-phase2.js`
- `validate-story-monster-variants.js`

Phase 1 validatorもschema v3へ追従。

### 統合検証

`node tools/validation/run-all.js`

結果：**10 / 41 FAIL**。

FAILはPhase 0から存在する、添付コードZIPに画像assets本体が含まれていないことによる既知10件のみ。
今回のプロローグ／save／story／monster／battleロジック由来の新規FAILは0。

PASS例：

- save safety
- main story routing
- map actors
- fixed exits
- story dialogue
- story item conditions
- monster habitat master
- WorldState
- story condition engine
- story ally lifecycle
- story EXP
- event battle rules
- scene context
- long quest state
- Phase2 prologue
- story monster variants

---

## 11. 次工程

### Phase 2 次単位 — 第一ボス戦と通常生き別れルート

実装予定：

1. 第一ボスのstory monster variant確定／登録。
2. 戦闘直前のリュシオン強加護。
3. アルス＋プロローグルーナを一時LB99。
4. オート戦闘禁止。
5. 通常想定は敗北、ただし勝利判定を残す。
6. 敗北 → prologueOutcome / story進行1。
7. 崩落・ペンダント譲渡。
8. プロローグルーナ離脱。
9. 一時LB99解除。
10. アルスのプロローグ育成値を本編開始値へ調整。
11. リースの山小屋M0へ5年後接続。
12. 第一ボス勝利時はイルミナシア(ID302070)へ接続する隠し進行2を実装。

第一ボスの正式な名称・ベース能力・技構成は現正本では未確定なので、今回のチェックポイントでは捏造していない。
