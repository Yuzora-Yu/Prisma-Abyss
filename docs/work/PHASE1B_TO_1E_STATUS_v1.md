# PRISMA ABYSS — Phase 1B〜1E 実装状況 v1

**作成日:** 2026-08-09  
**基準:** Phase 1A（WorldState / save migration）完了版  
**状態:** Phase 1B / 1C / 1D / 1E 完了。ストーリー本文・加入タイミング・MAP本体は未変更。

---

## 1. 今回の目的

新版シナリオを直接書き始める前に、今後の大量の人物状態・MAP差分・イベント戦闘・ルーナ成長を既存ロジックへ安全に載せる共通基盤を完成させる。

今回実装した範囲：

- Phase 1B — 共通条件評価器
- Phase 1C — ストーリー仲間状態の分離
- Phase 1D — 個別必要EXP倍率 / 一度きりStory EXP / 大量LvUP通知集約
- Phase 1E — イベント専用戦闘ルール / 図鑑除外

まだ行っていないこと：

- グラド初戦データそのものの変更
- ルーナ正式加入イベントの変更
- アラン離脱イベントの変更
- ハイネ／アリサ必須加入化
- 5年前プロローグMAP・イベント作成
- 光の宮殿回想実装

基盤と実際の物語変更を分離し、回帰原因を追いやすくしている。

---

# 2. Phase 1B — 共通条件評価器

## 2.1 `App.evaluateGameConditions()`

既存のMAP / NPC / イベント条件を壊さず、新版条件を一つの評価器へ統合した。

従来互換：

- `requiredFlag(s)`
- `missingFlag(s)`
- 必要アイテム / 不足アイテム
- `storyStep / subStep`
- 既存quest条件

新版追加：

- WorldState値比較
- 加入済みキャラクター
- 現在同行可能キャラクター
- 現在戦闘編成中キャラクター
- quest completed条件
- 任意quest state条件

WorldStateは単純一致だけでなく、`>=`, `>`, `<=`, `<`, `!=` 等の比較に対応。

例：

```js
requiredWorldState: [
  { key: 'fireVillageRecovery', op: '>=', value: 2 }
]
```

## 2.2 既存MAP条件との統合

以下を共通評価器へ接続した。

- `Field.isMapActionAvailable()`
- `MapRegistry.isProgressEntryActive()`
- `App.isQuestUnlocked()` の共通条件部分

既存flags主体のMAPはそのまま動作する。

---

# 3. Phase 1C — ストーリー仲間状態

`progress.storyCharacters` を追加し、「所持キャラ一覧にいるか」だけでは表現できなかった状態を分離した。

各キャラの基本状態：

```js
{
  recruited: false,
  available: false,
  temporary: false,
  permanentlyUnavailable: false
}
```

意味：

- `recruited` — 一度正式加入した履歴
- `available` — 現在同行・編成可能
- `temporary` — 回想／イベント等の一時キャスト
- `permanentlyUnavailable` — アラン死亡等の永久離脱
- `party` — 従来どおり `data.party` を正本とする

追加API：

- `App.hasStoryAlly()`
- `App.isStoryAllyAvailable()`
- `App.isStoryAllyInParty()`
- `App.setStoryAllyAvailability()`
- `App.setStoryAllyTemporary()`
- `App.setStoryAllyPermanentlyUnavailable()`
- `App.removeStoryAllyFromParty()`

`App.addStoryAlly()` も状態対応し、以下を指定可能にした。

- `available:false`
- `joinParty:false`
- `temporary:true`
- `allowPermanentReturn:true`（明示時のみ永久離脱解除可）

これにより今後、

- 昏睡中ルーナ
- 光宮殿回想の一時キャスト
- アラン裏切り後
- アラン永久死亡

を「未加入」と混同せず管理できる。

---

# 4. Phase 1D — EXP / Story Reward

## 4.1 個別必要EXP倍率

キャラクターへ `expMultiplierPct` を持たせられるようにした。

`App.getNextExp()` の最終必要経験値へ倍率を適用する。

通常：100  
ルーナ加入直後：2000

したがってルーナは、既存レアリティ補正等を維持した上でさらに20倍の必要EXPを要求できる。

追加API：

- `App.getCharacterExpRequirementMultiplierPct()`
- `App.setCharacterExpRequirementMultiplierPct()`

`App.addStoryAlly()` には以下も追加。

```js
{
  initialLevel: 1,
  expMultiplierPct: 2000
}
```

現行ルーナ加入クエスト自体はまだ変更していない。

## 4.2 一度きりStory EXP

`progress.storyRewards` を追加。

追加API：

```js
App.grantStoryExp(charId, exp, rewardKey, options)
```

特徴：

- `rewardKey` ごとに一度のみ
- キャラ不在時は報酬フラグを消費しない
- save:false対応
- 複数LvUP対応

将来、

- 結晶樹 +300,000
- 魔王城 +300,000
- 六精霊 各+300,000

を安全に実装できる。

## 4.3 大量LvUP通知

内部では一段ずつLvUPし、飛び越えたレベルの技能習得を処理する。

一方、大量EXP時は通知をまとめられる `aggregateLevelUpLogs` を追加した。

つまり「技能習得は全Lv処理」「画面通知は大量連打しない」を両立する。

---

# 5. Phase 1E — Event Battle

通常戦闘へ影響を与えず、`battle.eventBattleRules` を持つ物語戦だけ特殊ルールを使用する。

対応フィールド：

```js
{
  bestiaryExcluded: false,
  noDrops: false,
  noExp: false,
  noGold: false,
  noQuestProgress: false,
  noRecruit: false,
  forcedLoss: false,
  hpFloor: null,
  endAfterTurns: null,
  endAtHpPercent: null,
  storyVariantOf: null,
  targetMonsterId: null,
  targetMonsterIds: []
}
```

## 5.1 BOSSイベントデータから直接指定

`story_logic.js` の `BOSS` action が `eventBattleRules` を戦闘データへ引き継ぐ。

例：将来のグラド初戦

```js
{
  type: 'BOSS',
  value: GRAD_PROLOGUE_VARIANT_ID,
  eventBattleRules: {
    bestiaryExcluded: true,
    noDrops: true,
    noExp: true,
    noGold: true,
    noQuestProgress: true,
    noRecruit: true,
    endAtHpPercent: 50,
    storyVariantOf: GRAD_NORMAL_ID
  }
}
```

この時点では実際のグラドイベントデータはまだ変更していない。

## 5.2 HP閾値終了

`endAtHpPercent: 50` なら対象敵のHPが50%以下で物語上の勝利条件成立。

同時に閾値をHP floorとして扱うため、オーバーダメージで0HPまで削れて通常死亡扱いになることを防ぐ。

グラド初戦の「HP50%で勝利」にそのまま利用可能。

## 5.3 HP floor / 指定ターン終了 / forced loss

- `hpFloor` — 絶対HP下限
- `endAfterTurns` — 指定ラウンド完了でイベント終了
- `forcedLoss` — イベント終了結果を敗北扱いに変更

負けイベント／耐久イベントにも再利用できる。

## 5.4 報酬抑制

イベント専用variantで必要に応じて、

- EXP
- Gold
- Drop
- 討伐クエスト進捗
- 魔物仲間化

を個別に止められる。

## 5.5 図鑑除外

`bestiaryExcluded` は、

1. 戦闘勝利時の図鑑登録をしない
2. 討伐数へ加算しない
3. 魔物図鑑一覧へ表示しない
4. 図鑑コンプリート分母へ含めない

まで実装。

プロローグvariant・負けイベントvariantを取り返しのつかない図鑑要素にしない。

---

# 6. schema / save compatibility

Story State schemaを **v2** へ更新。

新規永続データ：

- `progress.worldState`（Phase 1A）
- `progress.storyCharacters`
- `progress.storyRewards`

既存saveはロード時に不足分を補完する。

既存WorldState値・未知フィールド・既存flagsは保持する。

---

# 7. 変更ファイル

実コード：

- `main.js`
- `database.js`
- `maps_logic.js`
- `battle.js`
- `story_logic.js`
- `menus_book.js`
- `menus_status.js`

追加／更新validator：

- `tools/validation/validate-world-state-schema.js`
- `tools/validation/validate-story-condition-engine.js`
- `tools/validation/validate-story-exp-system.js`
- `tools/validation/validate-event-battle-rules.js`

---

# 8. 検証結果

## 8.1 専用validator

PASS：

- WorldState migration
- story condition engine
- recruited / available / party / temporary / permanently unavailable
- 個別EXP倍率
- Story EXP二重取得防止
- 大量LvUP
- Event Battle HP50% threshold
- HP floor
- endAfterTurns
- forcedLoss
- reward suppression
- bestiary exclusion

## 8.2 統合validator

ルートJavaScript構文チェック：PASS。

maintained validators：**10 / 36 FAIL**。

この10件はPhase 0変更前ベースラインと同一で、添付コードZIPに画像assets本体が存在しないことに起因する既知FAIL：

- `validate-asset-fixed-names.js`
- `validate-authored-map-props.js`
- `validate-blocking-map-objects.js`
- `validate-chest-mimics.js`
- `validate-companion-map-sprites.js`
- `validate-event-map-markers.js`
- `validate-fixed-water-shore.js`
- `validate-full-cache-assets.js`
- `validate-summit-temple.js`
- `validate-visual-polish.js`

**今回の変更による新規validator FAILは0。**

---

# 9. 小さな設計修正

Phase 1C実装中に、既存rosterからstoryCharactersへmigrationするコードを整理し、`recruited` はrosterに存在する場合明示的に `true` とした。

---

# 10. 次工程

次は **Phase 1F — Scene Context / Flashback基盤** を推奨。

旧ロードマップで「Cutaway」と呼んでいたものを、現在の正本に合わせてより一般化する。

必要機能候補：

1. 現在MAP / 座標 / 向き / BGM / party / scene情報のsnapshot。
2. 一時キャストによる回想用party生成。
3. 通常進行WorldStateを壊さず回想MAPへ遷移。
4. 回想終了後にsnapshotへ完全復帰。
5. セピア等の画面filterをscene contextへ紐付け。
6. 回想中のsave可否を明示管理。
7. クロードの語り → レイラ操作開始へ将来接続できるAPI。

重要：光の宮殿事件は時間軸上は大灯台／海底火山と並行だが、プレイヤーへの提示は**クロードが昏睡ルーナを雷の要塞へ連れて来た後**。ルーナ生存をプレイヤーがアルスより先に知る構造にはしない。

Phase 1Fでも、まだ実際の光宮殿回想本文は書かず、共通基盤だけを先に作る。
