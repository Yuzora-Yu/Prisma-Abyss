# PRISMA ABYSS — Phase 0監査 / Phase 1A実装状況 v1

**作成日:** 2026-08-09  
**対象:** 添付コードZIP + `tools.zip` + 正本v7/v4/v4/v2 + 開発ロードマップv1  
**状態:** Phase 0 完了 / Phase 1A（WorldState・save migration基盤）完了

---

## 1. 今回の作業範囲

今回の作業では、新ストーリー本文・MAP・加入タイミングそのものにはまだ手を入れていない。

先に以下を実施した。

1. 添付コード構造の再監査。
2. `tools/validation/run-all.js` による変更前ベースライン取得。
3. 新版シナリオを支える `progress.worldState` の最小基盤追加。
4. 新規ゲームと既存saveの双方へWorldStateを補完するmigration追加。
5. WorldState専用validator追加。
6. 主要ストーリー／save／map validatorの回帰確認。

---

## 2. Phase 0 — 現行コード監査結果

### 2.1 現行実装で再利用すべき正本ロジック

現行コードには以下がすでに存在し、捨てずに拡張すべき。

- `story.js`：ストーリーデータ。
- `story_logic.js`：イベント実行。
- `progress.storyStep / subStep / flags`：現在のストーリー進行。
- `progress.quests`：クエスト状態。
- `App.addStoryAlly()`：ストーリー仲間生成・レベル補正。
- `App.gainExp()`：複数レベルアップ対応。
- `MapRegistry / Field.isMapActionAvailable()`：固定MAP／NPC／イベント条件。
- `App.migrateImportedSaveData()` と `App.init()`：既存save補完。
- `Battle` の固定ボス／フェーズ移行／戦闘結果処理。

新システムを並列で作るより、この正本関数へ機能を集約する。

### 2.2 新規ゲーム初期値が2か所ある

新規ゲーム生成は `database.js` の `INITIAL_DATA_TEMPLATE` をコピーする。
一方、`main.js` に `App.getInitialData()` があり、ロード後の補完基準として使われる。

**今後、新しい永続データを追加する際は両方を同期する必要がある。**

今回のWorldStateも両方へ追加した。

### 2.3 MAP条件は現状 flags 中心

現行のMAP/NPC条件で標準対応しているもの：

- `requiredFlag(s)` / `missingFlag(s)`
- 所持アイテム条件
- `storyStep / subStep`
- クエスト状態

新版が必要とする以下はまだ共通条件化されていない。

- WorldState値比較
- 加入済み
- 同行可能
- 現在編成中
- プレイヤー知識段階
- 地域復興stage

→ Phase 1Bで条件評価器を拡張する。

### 2.4 仲間加入とパーティ状態が近すぎる

`App.addStoryAlly()` は、キャラクターを `data.characters` へ追加した後、空きがあればそのまま戦闘パーティへ入れる。

現状は「加入済み」と「現在同行可能」が明確に別データではない。

新版ではアラン離脱、回想一時パーティ、ルーナ昏睡、その他一時同行不可があるため、以下を分離する必要がある。

- recruited / 加入履歴
- available / 現在同行可能
- party / 現在戦闘編成
- temporary / 回想等の一時キャスト
- permanentlyUnavailable / 永久離脱

→ Phase 1Cで追加する。

### 2.5 EXP処理は大量取得に耐えられるが個別倍率がない

`App.gainExp()` は `while` で複数Lvアップを処理しているため、ルーナの+300,000EXP自体は既存基盤を再利用可能。

不足：

- キャラクター個別EXP必要量倍率。
- story EXP一回取得管理。
- 大量レベルアップ通知の集約方針。

→ Phase 1D。

### 2.6 Event Battle共通属性は未整備

現行戦闘には固定ボスやフェーズ処理はあるが、新正本の共通属性、

- `bestiaryExcluded`
- `noDrops`
- `noExp`
- `forcedLoss`
- `hpFloor`
- `endAfterTurns`
- `endAtHpPercent`
- `storyVariantOf`

は共通仕様として未整備。

グラド初戦HP50%勝利、プロローグvariant等に必要。

→ Phase 1E。

---

## 3. 現行加入クエストと新版の衝突

### アリサ／ハイネ

現行 `arisa_haine_forest_depths` は `waterCityCleared` 後の任意クエスト。

新版：**海底神殿クリア後～レクスノート邸前の本編必須加入。**

既存禁忌の森深部MAP・ボス・会話IDは再利用価値が高い。
クエストを完全削除するより、本編イベントとして自動受注／本編完了扱いへ変換する方向を第一候補とする。

### アラン／ソフィア

現行 `sophia_alan_seabed_depths` は二人同時加入かつ `thunderFortCleared` 後。

新版：

- アラン：海底神殿後、レクスノート邸で本編加入。
- ソフィア：結晶樹導線の連続SQ後加入。

→ 現行共同加入クエストは分割または転用必須。

### ゼリード

現行 `zelied_big_tower` は大灯台クリア後の任意加入クエスト。

新版：**大灯台本編で正式加入し、海底火山の場所を示す。**

→ 既存再戦クエストを加入条件から外し、別の後日談／強敵クエストへ転用可能。

### ルーナ

現行 `luna_hidden_dark_shrine` は光宮殿後の隠し加入。

新版：結晶樹で本編正式加入。

→ 旧加入クエストは加入処理を廃止し、エクリプス史／月影／記憶／高難度イベント等へ転用候補。

### バロン／フリーダ／マリー

新版では海底火山までは本編NPC・共闘者、正式加入は海底火山後クエスト。

- バロン／フリーダ：現行加入時期は遅いため解禁条件変更が必要。
- マリー：任意加入骨格は維持できるが、海底火山後の人物線に合わせて目的・会話・解禁を調整する。

### カリン／シルビア／リーシア

既存クエスト加入の骨格を維持する。
新版人物設定と矛盾する条件・文章のみ後で修正する。

---

## 4. ストーリー進行番号を壊さない案

全面的な `storyStep` 再採番は既存MAP・検証・save互換への影響が大きい。

### 推奨1：5年前プロローグは独立gate

5年前プロローグを既存 `storyStep` の前段として管理し、終了後に現代の既存 `storyStep:0` へ接続する。

候補：

- `worldState.prologueStage`
- `progress.prologueState`

これにより現行の全storyStepを1つずつ後ろへずらす必要がない。

### 推奨2：海底神殿後～船取得は storyStep 4 の subStep拡張

現行：

- 4-0 水上都市
- 4-1 クレナ鍾乳洞
- 4-2 青の結晶報告
- 4-3 海底神殿
- 5-0 雷の要塞へ

新版では、たとえば：

- 4-4 水上都市解放／呼吸区間
- 4-5 禁忌の森へ向かう
- 4-6 ハイネ／アリサ加入
- 4-7 レクスノート邸へ
- 4-8 アラン加入／船入手
- 5-0 雷の要塞へ

とすることで、後半のstoryStep再採番を避けられる。

※直接の禁忌の森必須目的は正本どおり、章プロット作成時に確定する。

---

## 5. Phase 1A — 今回実装した内容

### 変更ファイル

- `main.js`
- `database.js`
- `tools/validation/validate-world-state-schema.js`（新規）

### WorldState v1

初期shape：

```js
{
  fireVillageRecovery: 0,
  lunaPublicIdentityKnown: false,
  lunaMemoryStage: 0,
  leonJosephRelationStage: 0,
  hayateZeliedTruthStage: 0,
  churchPoliticalState: 0,
  alanOutcome: 'active'
}
```

追加した共通処理：

- `App.getDefaultWorldState()`
- `App.ensureWorldState()`
- `App.getWorldStateValue()`
- `App.setWorldStateValue()`
- `system.storyStateSchemaVersion = 1`

### migration方針

既存saveに `worldState` が無い場合はdefaultを追加する。
既に存在するWorldState値をdefaultで上書きしない。
将来追加された未知フィールドも削除しない。
既存 `progress.flags` には触れない。

---

## 6. 検証結果

### 変更前ベースライン

- ルートJavaScript構文：**61ファイル PASS**。
- maintained validators：10本FAIL。

FAILは添付コードZIPに画像assets本体が含まれていないことによるもの：

- validate-asset-fixed-names.js
- validate-authored-map-props.js
- validate-blocking-map-objects.js
- validate-chest-mimics.js
- validate-companion-map-sprites.js
- validate-event-map-markers.js
- validate-fixed-water-shore.js
- validate-full-cache-assets.js
- validate-summit-temple.js
- validate-visual-polish.js

### Phase 1A後

上記の**同じ10本だけがFAIL**。新規回帰は確認されていない。

以下はPASS：

- `validate-save-safety.js`
- `validate-main-story-routing.js`
- `validate-map-actors.js`
- `validate-story-dialogue-data.js`
- `validate-story-item-conditions.js`
- `validate-world-state-schema.js`（新規）

WorldState validatorでは、

- 旧saveへのdefault補完
- 既存値保持
- 未知フィールド保持
- flags非破壊
- setterのsave制御
- 新規ゲームtemplateとの一致

を検証している。

---

## 7. 次に行う作業

### Phase 1B — 共通条件評価器

次はWorldStateを実際のMAP/NPC条件から安全に参照できるようにする。

優先順：

1. WorldState値比較条件。
2. `hasStoryAlly`（加入済み）。
3. 同行可能状態。
4. 現在戦闘編成中。
5. quest state / failed stageとの統合を見越した共通condition helper。
6. `MapRegistry.isProgressEntryActive()` と `Field.isMapActionAvailable()` の二重実装を可能な限り共有化。

この段階ではまだ具体的なNPC大量差分を書かない。
条件基盤だけを完成させ、既存MAPが従来どおり動くことを確認する。

---

## 8. GitHub確認メモ

公開GitHub `main` のファイル構造と主要ファイルの存在は再確認した。
この実行環境からgit cloneはDNS制約で行えないため、実装作業用のローカル正本は今回ユーザー添付コードZIPとする。
GitHub上の `story.js` も現行旧オープニング（夜明け前の村）を保持していることをWeb経由で確認している。

実際のコミット適用直前にユーザー側mainとの差分が発生している場合は、その差分を先に再baseする。
