# Light Palace Phase 16 — 六芒星初回描画安定化・初戦後退避位置

日付: 2026-08-19

## 対応内容

### 1. 六芒星が表示されず `world-space floor effect could not be rendered` になる問題

原因は9タイル表示倍率ではなかった。

`fx_ultimate_244_genesis_magic.png` の実画像は 384x384。`showStoryFloorEffectSprite()` は表示サイズを計算する前にPhaserテクスチャの確保を行うが、対象画像が遅延ロード中の場合、`GRAPHICS.get()` がロードを開始した直後の未完了 `Image` を返し、`ensureTexture()` が false になる。

Phase 15まではその後の再試行が `Field.render() -> 34ms待機 -> 1回再試行` のみだったため、画像デコード／ロードが34msを超えると警告を出してイベントを継続した。また、画像ロード完了時の `GRAPHICS.queueFieldRedraw()` はPhaserのrefreshを直接呼ぶため、StoryManagerの永続床演出同期まで必ずしも戻らず、魔法陣だけ欠落し続ける余地があった。

修正:

- `StoryManager.ensureStoryGraphicReady()` を追加。
- `SHOW_FLOOR_EFFECT` は登録済み画像のロード完了を await してからPhaserへ渡す。
- Phaser scene側の同期にも余裕を持たせ、34/80/140msの段階的再試行に変更。
- 回想3Fの永続同期時に画像が未ロードなら、画像ロード完了後にX17/Y16のMAP絶対座標から再同期する。
- 9タイル表示サイズは維持。

この変更は `SHOW_FLOOR_EFFECT` 共通命令へ入れているため、同じ遅延ロード競合を持つ将来のワールド固定床演出にも適用される。

### 2. レイラ対ヴェルド初戦後の逆走制止位置

Phase 14で X16〜18 / Y18 としていた3Fのクロード制止判定を、ユーザー指定どおり1マス南へ戻した。

- 初回封印着火: X16〜18 / Y19
- 退却後逆走制止: X16〜18 / Y19

同じ座標行だが、前者は `lightPalaceFlashbackRetreatOrdered` が未成立、後者は成立済みを条件にするため排他的に発火する。

### 3. フラッシュボム後に南へ約3マス退避

`LIGHT_PALACE_FLASHBACK_VELD1_AFTER` の会話終了後、イベントを閉じる前に三人が南へ退避するよう変更。

- レオン: X16/Y18 -> X16/Y21
- レイラ: X17/Y19 -> X17/Y22
- クロード: X18/Y18 -> X18/Y21

レオン／クロードは非同期スプライト移動を開始し、レイラはY20 -> Y21 -> Y22と段階的に進める。移動完了後に `lightPalaceFlashbackRetreatOrdered` を立て、救援用スプライトを閉じて3人編成へ切り替える。

これにより操作復帰位置は制止帯Y19より十分南になり、北へ引き返した時に自然にクロードの警告へ入る。

## 検証

- root JavaScript 63/63 `node --check` OK
- `validate-light-palace-phase14.js` OK（現行座標へ累積更新）
- `validate-light-palace-phase15.js` OK
- `validate-light-palace-phase16.js` OK
- `tools/validation/validate-news-data.js` OK
- 魔法陣PNG: 384x384確認
- 遅延 `GRAPHICS.request()` のruntime smokeで、未ロード -> await -> readyの遷移確認
- 3Fの封印／逆走イベントがともにX16〜18/Y19で、条件が排他的であることを確認
- フラッシュボム後のレオン／レイラ／クロード南退避座標を静的検証

## 実機で重点確認する箇所

1. 六芒星イベント開始時に警告が出ず、9タイル規模の魔法陣が表示される。
2. ブラウザ更新直後または画像キャッシュが薄い状態でも魔法陣が復元される。
3. フラッシュボム後、三人が南へ約3マス退避してから操作が戻る。
4. その後X16〜18/Y19へ北上すると、どの列でもクロードに止められる。
