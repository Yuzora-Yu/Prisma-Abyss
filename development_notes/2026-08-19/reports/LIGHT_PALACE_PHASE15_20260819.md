# Light Palace Phase 15 — 回想Lv・周辺遭遇Rank・地下牢優先導線

日付: 2026-08-19
基準: Phase 14 適用済みツリー

## 今回の未処理指示の点検結果

停止前に依頼されていた以下3点は Phase 14 配布物には未反映だったため、Phase 15 で回収した。

1. 光の宮殿回想の一時加入Lvを、レイラ49 / レオン62 / クロード58へ変更。
2. 光の宮殿グランプリズマ周辺で Rank1 の雑魚が出る問題を調査・修正。
3. 現在時間の光の宮殿1Fから2Fへ上がる前に、ジョセフが地下牢確認を優先する導線を追加。

## 1. 回想専用Lv

`story.js` の Scene Context 用キャラクター指定を変更した。

- レイラ (204): Lv49
- レオン (305): Lv62
- クロード (304): Lv58
- ルーナ (401): 既存値を維持

回想開始時のレイラと、ヴェルド初戦後の救援編成の両方へ反映した。現在時間側の加入Lvには触れていない。

## 2. 光の宮殿周辺 Rank1 の直接原因

### 設定側の確認

`map.js` の `LIGHT_PALACE_GROVE` 自体は既に以下の正しい値だった。

- Rank: 61
- mapId: `MAP000022` (`LIGHT_PALACE_OUTSKIRTS`)

`monsters.js` の habitat も正常で、`MAP000022 / floor 0` から以下が解決できる。

- 556 レイザーウイング — Rank58
- 601 アーマーリザード — Rank61
- 602 ルーンアーマー — Rank61

したがって、Light Palace 側の Rank 指定そのものが欠落していたわけではなかった。

### 実際の不具合

`main.js` で、任意指定の `encounterRankMin / encounterRankMax` を次のような判定で数値化していた。

```js
Number.isFinite(Number(value))
```

JavaScript では `Number(null) === 0` なので、上下限未指定の `null` が `0` として戦闘データへ格納されていた。

その後 `monsters.js` は `0` を「値が明示された」と判断する。内部で最低Rankを1へ丸めるため、結果として **Rank1～Rank1 の明示範囲**になり、map habitat より Rank 範囲抽選が優先されていた。

つまりユーザー指摘の「Rank指定なしが Rank1 扱いに化けている」に相当する症状で、直接原因は `map.js` ではなく **`main.js` の null→0 変換**だった。

### 修正

`App.normalizeOptionalEncounterRankBound()` を追加し、次を保証した。

- `null / undefined / ''` は `null` のまま。
- 実際に数値が指定された場合だけ Number 化。
- ワールド遭遇プロファイル生成時と、戦闘データ格納時の両方で同じ正規化を使用。

この修正は光の宮殿専用ではなく、habitat 遭遇で上下限を省略する他MAPにも同じ事故が起きないよう共通経路で直している。

`monsters.js` 側には既に `Number(null)` 問題を避けるガードがあったため変更していない。

## 3. 現在時間 1F→2F の地下牢優先導線

光の宮殿1Fの2F行き階段 (X17/Y5) に、`lightPalacePrisonRescueSecured` を要求するゲートを追加した。

未確認時は移動せず、ジョセフが以下を発言する。

- 「まってくれ、レオンやレイラの安否がどうしても気になっちまう。」
- 「宮殿の西に地下牢がある。先に見に行かせてくれないか。」

地下牢で国王・レイラ・レオンの主要生存者確認が完了すると、既存 `light_palace_check_prison_rescue` が `lightPalacePrisonRescueSecured` を立て、2Fへ進める。

### 既存経路との競合回避

- 回想退却中の階段逆走は、既存 `blockConditions` / クロード制止を維持。
- `dungeon.js` は block 判定を unlock 判定より先に行うため、回想中に現在時間用ジョセフ会話へ誤分岐しない。
- `lightPalaceCleared` 済み旧セーブは `DERIVED_PROGRESS_FLAGS` で救出済み扱いにし、再訪時に階段が再ロックされない。

## 検証

### 構文

- ルート JS 63ファイル: `node --check` 全件 OK
- `tools/validation/validate-news-data.js`: OK

### Phase 15 専用回帰

`development_notes/2026-08-19/validation/validate-light-palace-phase15.js`

確認内容:

- レイラ49 / レオン62 / クロード58
- ジョセフ指定台詞の完全一致
- 1F→2Fの地下牢ゲート
- 回想退却用クロード制止の維持
- クリア済み旧セーブ互換
- `LIGHT_PALACE_GROVE` Rank61 / MAP000022
- `main.js` 実遭遇プロファイルで未指定上下限が `null` のまま維持されること
- MAP000022 habitat が 556 / 601 / 602 を返すこと
- 80回の通常生成で Rank1 が生成されないこと

結果:

```text
OK: Light Palace Phase15 validation passed.
Encounter candidates: レイザーウイング(Rank58), アーマーリザード(Rank61), ルーンアーマー(Rank61)
```

### Phase 14 検証について

Phase 14 の検証スクリプトは Service Worker のバージョン文字列 `v87` を固定でassertしているため、Phase 15の正常なキャッシュ更新 `v88` によりその1項目だけ旧検証が失敗する。Phase 14 のストーリー座標仕様を壊したことによる失敗ではないため、旧検証ファイル自体は変更していない。

## Service Worker

Phase 15 反映用に `CACHE_NAME` を `prisma-abyss-v88.20260819` へ更新した。
