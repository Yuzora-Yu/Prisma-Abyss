# Light Palace Phase 17 — 六芒星描画キュー / 3F固定座標 / 回想終了帰還保証

日付: 2026-08-19
基準: Phase 16適用済み環境

## 1. 六芒星が同じ警告で描画されない件

Phase 16では画像ロード完了待ちを追加したが、失敗条件を最後まで潰せていなかった。

旧 `PhaserFieldRenderer.showStoryFloorEffectSprite()` は、次のどれかの瞬間状態で即 `false` を返していた。

- Phaser scene がまだ `ready` ではない
- scene がまだ生成されていない
- texture がPhaser側へまだ登録されていない

StoryManager側は数回再試行していたが、その描画要求自体をrendererが保持していなかった。そのため、Phaser起動が再試行時間を越えると画像自体はロード済みでも要求が消え、

`world-space floor effect could not be rendered: flashback-genesis-circle`

となり得た。

Phase 17では、床演出のMAP座標仕様をrenderer側へpending登録する構造へ変更した。

- `storyFloorEffectSpecs` に id / key / X / Y / size / slices / alpha / depth を保持
- Phaser scene生成後に再同期
- textureロード完了後に再同期
- renderer refresh / resize時にも再同期
- persistent story visualもPhaser起動直後・resize・refreshで再同期
- `SHOW_FLOOR_EFFECT` は単に「要求を受け付けた」だけでは先へ進まず、最大2.5秒 `ensureStoryFloorEffectSprite()` で実描画完了を待つ

これにより、六芒星→画面揺れ→ナレーションの順序も維持する。

9タイル表示倍率は変更していない。

## 2. ルーナ封印イベント着火位置の正規化

発火範囲は X16〜18 / Y19 のまま。

ただし、X16またはX18で着火しても、イベント本文開始時にレイラを必ず X17/Y19へ移動させる。

以後の重要人物は発火地点の相対座標を使用せず、MAP絶対座標へ固定した。

- ジャスパー: X20/Y15
- ヴェルド: X17/Y16
- 六芒星: X17/Y16

Phase 13〜16由来の `storyVisualAnchors` に古い相対座標が残っていても、persistent sync時は上記絶対座標を正本として描画する。

イベントjournal revisionを15へ上げ、ヴェルド戦前の旧途中カーソルは新しい固定座標演出を通るよう安全な先頭から再実行する。

## 3. 回想終了時に雷の要塞へ戻らない件

新規の正常Scene Contextであれば、回想開始前snapshotに雷の要塞のlocationが保存されるため、本来 `SCENE_END` で復帰する。

ただしPhase 11〜16の検証セーブでは、互換復旧したScene Contextのsnapshotに古い／誤ったlocationが残る可能性があった。従来の `SCENE_END` はsnapshotを完全に信頼していたため、回想終了自体は成功してもLIGHT_PALACE側へ残る余地があった。

Phase 17では光の宮殿回想に明示的なreturn constraintを追加した。

- 正本帰還先: THUNDER_FORT / 1F
- 新規データでsnapshotが正しければ、回想開始直前のX/Yをそのまま使う
- Phase 11〜16 contextにreturn constraintが無くても、exitTrigger=`light_palace_flashback_exit_veld` から互換判定する
- snapshotのarea/floorが不正な場合のみ X18/Y22 を安全fallbackとして使う
- 不正snapshotからLIGHT_PALACE用dungeon payloadを持ち込まないよう、fallback時は一時dungeon stateも破棄する

したがって「古い検証セーブが原因だった可能性」はあるが、Phase 17では古いcontextに依存しないようコード側でも防御した。

## 4. map.js

Phase 17では `map.js` を変更していない。
Phase 16までのユーザー編集系統をそのまま正本として維持している。

## 5. 検証

- ルートJS 63ファイル: `node --check` OK
- Phase 14 regression validator: OK（Phase 17の固定座標仕様を許容するよう更新）
- Phase 15 validator: OK
- Phase 16 validator: OK
- Phase 17 validator: OK
- NEWS_DATA validator: OK
- Phaser未準備状態で9タイル床演出を投入しても `showStoryFloorEffectSprite()` が要求を保持するVM smoke: OK
- 封印イベント内で、X17/Y19へのレイラ正規化が六芒星表示より先に実行されることを確認
- ジャスパー X20/Y15、ヴェルド X17/Y16 の絶対座標を検証
- 回想開始actionに THUNDER_FORT / 1F return constraintが存在することを検証
- pre-Phase17 context向けexitTrigger互換帰還を検証

## 実機で優先確認してほしい点

1. X16から封印イベントを踏む → レイラがX17へ寄る → 六芒星が表示される
2. X18から踏んでも同じくX17へ寄る
3. 六芒星表示直後に `world-space floor effect could not be rendered` が出ない
4. ジャスパーがX20/Y15、ヴェルドがX17/Y16から動かず、画面リサイズや更新後も同じ位置へ戻る
5. 回想終了後、雷の要塞1Fへ戻る
