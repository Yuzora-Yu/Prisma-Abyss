# PRISMA ABYSS — Phase 2 第一ボス実装準備 v1

**作成日:** 2026-08-09  
**状態:** プロローグ前半チェックポイント + 第一ボス用共通戦闘基盤完了

## 追加内容

前チェックポイントの「南出口で第一ボス出現」までに加え、第一ボスおよび今後のイベント専用ボスへ使う以下の基盤を追加した。

### 1. 数値IDを発行しないStory Monster Variant

- `STORY_MONSTER_VARIANTS`
- `MonsterData.getStoryMonsterVariant(key)`
- Story `BOSS` action: `storyMonsterVariantKey`
- Battle側でstring-key variantを生成

用途：

- 5年前プロローグ第一ボス
- グラド初戦variant
- プロローグ用の既存ボス別variant
- 図鑑へ載せない負けイベント／弱体・強化イベント形態

数値IDなしvariantは図鑑IDへ混入させない。

現時点では第一ボスの名称・能力・技構成が正本未確定のため、**具体的variant登録は0件**。仕組みだけを実装している。

### 2. イベント戦闘のAUTO禁止

Story `BOSS` actionで、

- `forceAutoOff: true`
- または `autoBattleAllowed: false`

を指定可能。

Battle開始時にAUTOをOFFへ固定し、戦闘中にAUTOボタンを押してもONへ戻せない。
ボタン表示も `AUTO: LOCK` となる。

通常戦闘のAUTO機能には影響しない。

これはプロローグ第一ボス正本の「オート戦闘不可／プレイヤー自身に操作させる」を実装するためのもの。

## 現在のPhase 2到達点

NEW GAME
→ 5年前・西の高台
→ 花採取
→ 東空の光／遅れて爆発音／地震
→ 南へ
→ ルーナ救援戦
→ ルーナstory variant一時加入
→ 南／北自由探索
→ 北限定メタルジェリー
→ 通常全滅時の微弱な加護復帰
→ 家跡の巨大亀裂・家族不明
→ 南出口へ
→ 第一ボス出現演出
→ **次：第一ボス戦**

## 検証

`node tools/validation/run-all.js`

結果：**10 / 41 FAIL**。

Phase 0から継続しているassets本体欠落由来の既知10件のみ。
新規ロジックFAILは0。

専用PASS：

- `validate-prologue-phase2.js`
- `validate-story-monster-variants.js`
- `validate-event-battle-rules.js`
- Phase 1各validator

## 次工程

1. 第一ボスの暫定Story Monster Variantを定義。
2. リュシオン強加護イベント。
3. アルス＋プロローグルーナ一時LB99。
4. AUTO禁止で第一ボス戦。
5. 敗北時：通常生き別れルート。
6. 勝利時：prologueOutcome 2 → イルミナシア(ID302070)戦。
7. イルミナシア敗北時：通常本編へ収束。
8. 隠し勝利時：後続特殊分岐へ。

第一ボスの具体的な戦闘データは正本未確定のため、このパッケージでは捏造していない。
