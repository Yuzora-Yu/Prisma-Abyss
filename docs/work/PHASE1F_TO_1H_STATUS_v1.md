# PRISMA ABYSS — Phase 1F〜1H 実装状況 v1

**作成日:** 2026-08-09  
**基準:** Phase 1E 完了版  
**状態:** Phase 1F / 1G / 1H 完了。Phase 1 共通基盤を一区切り。

---

## 1. Phase 1F — Scene Context / Flashback

光の宮殿回想を将来安全に実装するため、リアルタイムcutaway専用ではなく、回想・別視点・一時操作へ共通利用できるScene Contextを追加。

### 追加API

- `App.beginSceneContext(options)`
- `App.endSceneContext(token, options)`
- `App.captureSceneContextSnapshot()`
- `App.restoreSceneContextSnapshot(snapshot)`
- `App.getActiveSceneContext()`
- `App.isSceneContextSaveSuppressed()`
- `App.applySceneContextVisualFilter()`

### 退避・復帰対象

- 現在地 / 座標 / 向き
- キャラクター保存状態
- 戦闘party
- 所持アイテム / 装備inventory / Gold / GEM
- 図鑑 / stats
- dungeon / battle / mapReturnPoint
- `progress.floor`
- flags
- WorldState
- storyCharacters
- storyRewards
- quests

### 回想中のsave

Scene Context中は通常 `App.save()` を抑制する。

一時パーティ・過去の位置・過去戦闘中のデータを永続saveへ書き込まない。リロードした場合は最後の通常saveへ戻れるため、現在世界のsaveを壊さない。

### 一時キャスト

`temporaryParty` を指定すると、現在partyを退避した上で回想専用キャストを編成できる。

将来：

```js
App.beginSceneContext({
  type:'flashback',
  area:'LIGHT_PALACE_MEMORY',
  x:...,
  y:...,
  visualPreset:'sepia',
  temporaryParty:[{ charId: LEILA_ID, initialLevel: ... }]
});
```

のように「クロードの語り → セピア回想 → レイラ操作」へ接続可能。

**重要:** 現時点では光の宮殿回想本文や開示タイミングそのものには手を入れていない。

---

## 2. Phase 1G — 装備返却 / 離脱 / 再加入

追加API：

- `App.returnCharacterEquipment()`
- `App.departStoryAlly()`
- `App.rejoinStoryAlly()`

### 装備返却

- 全装備slotをinventoryへ返却
- 同一装備参照 / 同一uidは一度だけ返却
- slotをnull化
- 同じ離脱イベントが再実行されても装備増殖しない

### 離脱

`departStoryAlly` は、

- 加入履歴 `recruited` を保持
- `available=false`
- partyから除外
- temporary解除
- 任意で `permanent=true`
- 任意で装備全返却

を一回の共通処理で行う。

将来のアラン光宮殿離脱は、装備返却込みの通常離脱として実装できる。

### 再加入

通常離脱なら `rejoinStoryAlly` で復帰可能。

永久離脱後は通常再加入を拒否し、`allowPermanentReturn:true` の明示時だけ解除可能。

したがって、アラン死亡ルートを通常イベントの誤発火で復活させない。

---

## 3. Phase 1H — 長期Quest Stage / Failed

既存 `progress.quests[questId].state` を維持したまま、長期連続クエスト向けに `stage` と `failed` を一般化。

追加API：

- `App.getQuestStage()`
- `App.setQuestStage()`
- `App.advanceQuestStage()`
- `App.failQuest()`

### Stage

標準では単調増加。誤って過去stageへ戻さない。

必要な場合だけ `allowDecrease:true` で明示的に戻せる。

共通条件評価器に `requiredQuestStages` を追加。

例：

```js
requiredQuestStages: {
  hayate_chain: { op: '>=', value: 3 }
}
```

### Failed

`failQuest()` で長期クエストを明示的に失敗状態へできる。

通常、failed questは再解禁されない。
`retryableAfterFailure:true` のquestだけ再試行可能。

将来、上申書未取得のままアラン死亡となった際に、未完了のハヤテ／アラン父関連チェーンを閉鎖する基盤となる。

---

## 4. 検証

追加validator：

- `validate-scene-context.js`
- `validate-story-ally-lifecycle.js`
- `validate-long-quest-state.js`

既存の新版validatorもすべて継続PASS：

- WorldState
- shared conditions
- story ally states
- individual EXP / Story EXP
- Event Battle

統合結果：**10 / 39 FAIL**。

FAILはPhase 0ベースラインから存在する画像assets欠落10件と完全に同数。今回の変更由来の新規FAILは0。

---

## 5. Phase 1 完了時点で揃った基盤

- WorldState + save migration
- NPC/MAP/quest共通条件評価
- recruited / available / party / temporary / permanent離脱
- 個別必要EXP倍率
- 一度きりStory EXP
- 大量LvUP
- Event Battle / HP閾値 / forced loss / bestiary exclusion
- 回想Scene Context / save isolation / sepia preset
- 装備全返却 / 離脱 / 再加入
- 長期Quest stage / failed

これで新版本編を「その場しのぎのbooleanや専用処理」を増やさず落とし始められる。

---

## 6. 次工程

**Phase 2 — 5年前プロローグの最小垂直スライス**へ移る。

最初はMAP完成度を求めず、以下の順で小さく作る。

1. 名もなき山奥の故郷の3区画を最小通行MAPとして登録。
   - 西の高台（小）
   - 南エリア（広）
   - 北エリア（広）
2. NEW GAMEからプロローグgateへ入る導線。
3. 西の高台：花採取の日常 → 東の大閃光 → 遅れて爆発音・地震。
4. 南エリア：ルーナ悲鳴 → アルス単独の初戦闘。
5. ルーナ一時加入 → 二人party。
6. 自宅跡の地割れ／家族消失。
7. 南エリア通常エンカウント。
8. 北エリア寄り道・強敵・メタルジェリー（まず最低限）。
9. 全滅時リュシオン加護による全回復復帰。
10. 南出口前の深淵の化け物。
11. 現代編へ接続。

ユーザー作成の最終MAP図面が来るまでは、進行・イベント・戦闘検証を目的としたM0/M1品質に留める。
