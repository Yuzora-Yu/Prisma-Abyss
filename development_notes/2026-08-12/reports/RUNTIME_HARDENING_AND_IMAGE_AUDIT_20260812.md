# Runtime hardening / 画像参照点検 2026-08-12

## 1. monster_301110.png 読込失敗

症状:

`assets/monsters/monster_301110.png` を読み込もうとして `ERR_FILE_NOT_FOUND`。

原因:

Monster ID 301110「光の楔アラン」は `monsters.js` 側で明示的に

`assets/characters/char_face_201.gif`

を指定している。一方、共通画像登録側が明示指定を見ず、IDから `monster_301110.png` を機械生成していた。

修正:

- `assets.js`
- `monsters.js`
- `monster-images.js`

の画像解決を、`image` / `img` の明示指定を最優先し、指定がない場合だけ `imageId/baseId/id` から通常モンスター画像を生成する方式へ統一した。

確認:

- ID301110の解決先: `assets/characters/char_face_201.gif`
- `monster_301110.png` はinstall image対象へ入らない。

注意:

今回提供された最新版ZIPには `assets/` が含まれないため、全画像ファイルの物理的存在確認まではできない。今回の修正は、コード上で確認できた誤った参照生成の正本修正である。

## 2. イベント戦闘後の入力競合

症状:

イベント戦闘勝利後、事後イベント再開前の短い時間にタップ移動が入り、別戦闘へ突入するとイベントが止まる。再読込すると継続する。

原因:

StoryManagerのpost-battleイベントがjournalへqueue済みでも、フィールド入力禁止判定は「現在会話表示中か」を中心に見ていた。scene復帰からjournal resumeまでの隙間があった。

修正:

`StoryManager.hasPendingFieldResume()` を追加し、以下をフィールド入力ロック対象へ含めた。

- active journal
- queued journal
- active event
- pending event
- pending battle win event
- active conversation

`App.isFieldControlBlocked()` がこれを参照するため、事後イベント開始前に移動・新規遭遇を差し込めない。

## 3. 鍛冶後に旧メニューへ戻る

原因:

施設から入った鍛冶でも、成功／失敗メッセージ後のcallbackが `MenuBlacksmith.init()` を引数なしで呼び、entry context / mode / return contextを失っていた。

修正:

`reopenCurrentWorkspace()` を追加し、鍛冶のentry context、mode、return destinationを保持して再描画する。

## 4. フィールド長時間稼働

今回の対策:

- field非表示中はPhaser sceneとgame loopをsleep。
- fallback破棄時にResizeObserverをdisconnect。
- MAP表示に必要な画像だけPhaser Textureへ遅延登録。
- MAP再構築後、現在のworld / water / actor / UI / atmosphereから参照されないPhaser Textureを削除。
- Browser Image / Cache Storage側の画像保持は変更しない。
- 水上都市の波表現をタイルごとの複数Rectangleから共有Graphicsへ集約。
- 雷の要塞の電撃Tweenを全装飾ではなく安定ハッシュで約1/4に制限。

目的は「ダウンロード済み画像を消す」ことではなく、長時間プレイで増え続けやすいGPU/RAM側のPhaser Textureと常時Tweenを抑えること。

## 5. 序章北側ハンター出現時の停止感

候補マスごとに個別最短経路探索を行っていた処理を、プレイヤー位置からの1回のBFS距離計算へ変更した。

同じ到達距離を基準に出現地点を選べるため、出現時に会話を挟んで停止をごまかすのではなく、原因側の計算量を削減した。
