# 光の宮殿 回想進行不能・演出調整 Phase 12

作業日: 2026-08-19  
基準: Phase 11 + X16〜18/Y20 hotfix 適用済み環境  
承認根拠: 2026-08-19 ユーザー直接指示

## 対応概要

Phase 11環境で、光の宮殿回想の `LIGHT_PALACE_FLASHBACK_HEXAGRAM_TRAP` において、最後の「ルーナ様から離れろ！」表示直後に `回想パーティを変更できませんでした。` でイベントが停止する問題を再調査した。

今回の調査では、ルーナ離脱の処理方法と、再読込後のScene Context復元の双方に問題があることを確認した。加えて、ジャスパー／ヴェルドの出現位置・出現演出、ヴェルド強制敗北戦、クロード退場演出をユーザー指定に合わせて再調整した。

## 進行不能の直接原因

Phase 11のスタックトレースで例外が投げられていた `story_logic.js:2550` は、会話表示や `MOVE_PLAYER` ではなく `SCENE_PARTY` の失敗時throwだった。

該当イベントのPhase 11時点の順序は概ね次の通りだった。

1. ジャスパー出現
2. `LIGHT_PALACE_FLASHBACK_HEXAGRAM_TRAP` 会話
3. resolved flag
4. `RESET_TEMP_ALLY 401`（ルーナ）
5. `SCENE_PARTY`（レイラ単独）
6. レイラ北移動

ユーザーの「ルーナ消滅と編成変更の周辺が怪しい」という指摘は妥当だった。ただし、旧 `resetTemporaryStoryAlly()` 自体も内部ではpartyから外してからcharactersを削除しており、単純な配列更新順だけが直接原因ではなかった。

直接の失敗条件は、再読込した一部の回想セーブで `App.data.system.sceneContextResume.stack` は残っている一方、メモリ上の `App.sceneContextStack` がまだ空だったこと。その状態でPhase 11の `recoverLegacyLightPalaceFlashbackContext()` は、resume metadataが存在するため「legacy saveではない」と判定して復旧探索を終了していた。結果として `setSceneContextParty()` がactive Scene Contextを取得できずfalseを返し、`回想パーティを変更できませんでした。` になっていた。

また、`RESET_TEMP_ALLY` は通常時間側の一時仲間リセット用で、LB carryover等も扱う。`isolateCharacters` の回想内離脱に使う責務ではなかったため、これも同時に除去した。

## 進行不能修正

### Scene Context復元

- `ensureActiveSceneContext()` を追加。
- active contextがない場合、まず保存済み `sceneContextResume.stack` をメモリへ復元する。
- それでも復元できない旧セーブだけ、従来のlegacy origin探索へ進む。
- `SCENE_PARTY` / `SCENE_CHECKPOINT` / `SCENE_END` / `SCENE_REMOVE_ALLY` の直前でこの保証を行う。

### 回想専用ルーナ離脱

- `SCENE_REMOVE_ALLY` と `removeSceneContextAlly()` を追加。
- `isolateCharacters` Scene Context専用。
- ルーナのUIDを削除前に取得。
- `party` からルーナUIDを除外してから、回想中 `characters` からルーナを削除。
- 回想用story character stateのみ初期化。
- 通常時間snapshotおよび通常時間用LB carryoverには触れない。

### 既に停止しているPhase 11セーブとの互換

イベントaction番号は意図的に維持した。

- action[3] = ルーナ離脱（Phase 11では `RESET_TEMP_ALLY`、Phase 12では `SCENE_REMOVE_ALLY`）
- action[4] = レイラ単独 `SCENE_PARTY`

Phase 11でaction[3]まで完了しaction[4]で停止したセーブは、action[4]からそのまま再試行できる。action[3]を前後へ移動していないため、completedActionsとの対応を壊さない。

## 出現位置・闇渦演出

ユーザー指定どおり、位置をレイラ基準で再定義した。

- ジャスパー: 発火時レイラ位置から東3・北4。
- ルーナ封印後、レイラが北へ1マス。
- ヴェルド: 移動後レイラ位置から北2。

両者とも出現順を次の通り統一した。

1. 画面を白く1回明滅。
2. `assets/effect/fx-abyss-vortex-ai.png` を表示。
3. effect sizeはmonster sprite 2.1に対して4.2（2倍）。
4. 闇渦表示後にmonster spriteを `DARK_TELEPORT` で出現。

ユーザー提供PNGを `assets/effect/fx-abyss-vortex-ai.png` として追加した。`assets.js` には既に同パスの `abyss-vortex` 登録が存在していたため、assets.jsの追加変更は不要。

## ヴェルド強制敗北戦

初戦・1階入口戦の両方を同じイベント専用条件へ変更した。

発火条件はOR。

- 第5ターン終了時。
- 第5ターン未満でもヴェルドがHP1まで削られた直後。

発火後の順序:

1. `LIGHT_PALACE_FLASHBACK_VELD_FINISHER` 専用会話。
2. ヴェルドのイベント専用技名 `黒白の葬閃` を表示。
3. 味方生存者全員へ固定9999ダメージ。
4. 命中・防御・耐性判定を通さず全滅。

通常スキルID 140のマスター名 `紫電の葬閃` は変更していない。この回想イベント内だけ `finisherSkillName` で表示名を上書きする。

HP1発火については各行動終了直後、次の行動者へ移る前に判定する。ターン条件は5ターン目のround endで判定する。

## クロード退場演出

Phase 11の1マス交互押しを撤去した。

- レオンがクロードの北側へ素早く移動。
- レオンを短時間、上下へ小さく振動させて「押し込む力」を表現。
- クロードは1マスずつ会話待ちするのではなく、南側の画面外座標へ1750msで連続移動。
- `START_MOVE_SPRITE` を追加し、移動を待たずに次の台詞へ進める。
- そのためクロードは「レオン――！」表示中に南へ消えていく。
- イベント再開時のvisual replayでは、退場済み非同期spriteを再表示しない。

## map.jsについて

Phase 12では `map.js` に変更を加えていない。ユーザー提供版を正本とするPhase 10以降の系統をそのまま維持している。

- 六芒星発火範囲: X16〜18 / Y20を維持。
- 逆走制止範囲: X16〜18 / Y19を維持。
- 出現位置はイベント時のplayer-relative visual commandsで変更しているため、固定マップ地形そのものを変更していない。

## 検証

### 静的検証

- top-level JS: 63 / 63 `node --check` OK。
- `node tools/validation/validate-news-data.js`: OK、NEWS_DATA 19件、最新2026/08/19。
- `node development_notes/2026-08-19/validation/validate-light-palace-phase12.js`: OK。

### 実行時スモーク

専用検証で実コードをVMロードし、Phase 11の停止状態を再現した。

再現状態:

- `App.data.system.sceneContextResume.stack` は存在。
- メモリ上 `App.sceneContextStack = []`。
- ルーナはaction[3]で既に削除済み。
- レイラはcharactersに存在。
- 次の再実行actionは `SCENE_PARTY`。

結果:

- `ensureActiveSceneContext()` がresume metadataからactive contextを復元: OK。
- 実 `setSceneContextParty([{charId:204}])`: OK。
- fresh pathで実 `removeSceneContextAlly(401)`: party/characters双方からルーナを除去: OK。
- HP1到達前5ターン: `黒白の葬閃` 強制敗北: OK。
- 5ターン終了HP残存: `黒白の葬閃` 強制敗北: OK。

## 実機確認ポイント

今回特に確認価値が高いのは、Phase 11で実際に停止したセーブをそのまま再読込して「ルーナ様から離れろ！」直後から継続できるかどうか。新規回想でもルーナ封印から初戦までを通し、ジャスパー／ヴェルドの闇渦位置・サイズを目視確認する。
