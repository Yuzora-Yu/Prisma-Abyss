# 光の宮殿回想 Phase 14 — ワールド座標固定・3F演出再配置・退却逆走禁止

更新日: 2026-08-19

## 今回再開した未処理指示

停止していた作業を、次の未処理指示を正本として再開した。

- 六芒星の魔法陣を X17/Y16 中心の9タイル規模へ拡大する。
- 魔法陣以外の3Fイベント座標をPhase 13から北へ1マス移す。
- 画面サイズ変更、カメラ移動、再描画、再読込でイベント人物・床演出の位置がずれたり消えたりしないよう、MAP座標を正本にする。
- 魔法陣が主人公について移動する挙動を廃止する。
- 再読込だけでルーナ封印イベントが再着火しないようにする。
- 六芒星発生時のシステム文を「広間を出ようとした瞬間、床に六芒星が閃きルーナの足に絡みついた。」へ変更する。
- 演出順を「着火 → 魔法陣＋明滅＋上下揺れ → システム文 → 再明滅＋深淵渦 → ジャスパー → 台詞」にする。
- 退却開始後は、一度下りた階へ上り直せないようにする。
- 旧エラー停止検証セーブについて、完全救済を必須とはしないが再開処理の問題を継続調査する。

## 根本原因の再調査

今回の不安定さは単一原因ではなく、次の三つが重なっていた。

1. **画面座標とMAP座標の混在**
   - 旧演出の一部はDOMオーバーレイへ画面相対位置で配置されていた。
   - `base:"player"` の演出は、再描画時点の主人公座標を再び基準にすると、イベント開始時の位置からずれる。
   - この組み合わせにより、歩行・画面サイズ変更・再描画で「床に置いたはずの演出が画面についてくる」状態になり得た。

2. **描画と進行状態の責務が近すぎた**
   - 永続演出の再描画とストーリーフラグ更新を同じ経路で扱うと、表示復元だけで一度きりイベントを再武装する危険がある。
   - また、床イベントの一度きりフラグがイベント本文側の進行に依存すると、着火直後の再読込に二重発火の窓が残る。

3. **六芒星イベントrevisionの不一致**
   - 作業途中状態では、旧ERRORカーソル復旧側がrevision `14`、新規イベント開始側がrevision `13` になっていた。
   - この不一致は `ensureEventJournal()` が呼ばれるたびに「古い定義」と誤判定し、進行中イベントを先頭へ巻き戻す原因になり得た。
   - Phase 14で双方をrevision `14` に統一した。

## 実装内容

### 1. 3F座標

魔法陣のみ従来中心を維持し、それ以外を北へ1マス移した。

- 六芒星中心: **X17/Y16**（変更なし）
- 六芒星サイズ: **9タイル**、横9スライス
- 封印イベント発火: **X16〜18/Y19**
- 退却後の3F逆走制止: **X16〜18/Y18**
- 救援後基準配置:
  - レオン **X16/Y18**
  - レイラ **X17/Y19**
  - クロード **X18/Y18**
- ジャスパー: 発火座標から **東3・北4**
- ヴェルド: 発火座標から **北3**（レイラ北進後の位置から北2）

### 2. 六芒星演出

`light_palace_flashback_hexagram_trap` は次の順に整理した。

1. 発火時のMAP座標を `lightPalaceFlashbackTrapOrigin` として保存。
2. X17/Y16へ `fx_ultimate_244_genesis_magic.png` を9タイル規模で表示。
3. 白明滅＋上下揺れ。
4. 新システム文を表示。
5. 再度白明滅。
6. 保存済み発火座標を基準に `fx-abyss-vortex-ai.png` を表示。
7. ジャスパーを同じ絶対MAP座標へ出現。
8. ジャスパー台詞へ進む。

魔法陣は床装飾より上、壁面・人物・ボスより下になるよう、行単位に分割して `rowY * 100 + 46` の深度で描画する。

### 3. イベント描画をMAPワールド座標へ固定

`phaser-field.js` にストーリー用ワールドオブジェクト／床演出の管理を持たせた。

- `storyObjects`
- `storyFloorEffects`
- ストーリー人物・モンスター・画像・床演出をタイルX/Yで保持
- 同一ID・同一座標の再同期では破棄再生成せず、既存スプライトを更新
- Phaserカメラが動いてもMAP上の位置は変化しない

`story_logic.js` 側では、長いイベント中に主人公が移動しても出現位置を再計算しないよう、`anchorKey` を追加した。

- `CAPTURE_ANCHOR` でイベント開始地点を保存
- `persistKey` でジャスパー／ヴェルドの確定座標を保存
- 再読込後は `storyVisualAnchors` の絶対X/Yから再生成
- `syncLightPalaceFlashbackPersistentVisuals()` は**描画のみ**を担当し、進行フラグを書き換えない

旧Canvas/DOMフォールバックについても、要素に `data-tile-x/y` を持たせ、render・ResizeObserver・window resize時に現在のカメラから画面位置を再投影するようにした。

### 4. 再読込による六芒星イベント再着火の防止

3F床イベントは「完了フラグ」を一度きり判定へ流用せず、専用ラッチ:

- `lightPalaceFlashbackHexagramTriggered`

を使用する。

`dungeon.js` の共通storyEvent処理では、床に乗った瞬間にこの `eventFlag` を立て、**`StoryManager.executeEvent()` より前に `App.save()`** する。会話開始直後に更新されても、床イベント自体は再着火しない。

### 5. 退却後の逆走禁止

「一度下りたら上へ戻れない」を階層単位で実装した。

- 3F → 2F は可能
- 2F → 3F は退却中ブロック
- 2F → 1F は可能
- 1F → 2F も退却中ブロック

ブロック時は既存のクロード制止会話 `LIGHT_PALACE_FLASHBACK_WRONG_WAY` を表示し、階層移動しない。

制限条件は次の回想退却中だけ。

- `lightPalaceFlashbackActive === true`
- `lightPalaceFlashbackRetreatOrdered === true`
- `lightPalaceFlashbackCompleted !== true`

通常時間の光の宮殿探索には影響しない。

## 旧ERROR検証セーブの追加調査

旧停止データについては、ユーザー確認どおり「回想前データからの新規進行」は正常で、古い検証セーブだけが引き続き特殊ケースとなる。

Phase 14では追加で、六芒星イベントrevisionの `14/13` 不一致を発見し `14/14` に修正した。VMテストでは、次の旧状態を再現している。

- `status: error`
- `currentPath: [4]`
- `lightPalaceTrapRevision: 13`
- エラー文「回想パーティを変更できませんでした。」

この場合、旧action indexをそのまま信用せず、冪等なイベント先頭へ巻き戻し、revision 14として再開準備できることを確認した。

ただし、旧検証セーブ側で「回想開始前のScene Context snapshotそのもの」が欠落しているケースは、失われた現在時間側の所持品・仲間状態を推測復元しない。新規進行を壊してまで古い検証データを強制修復する方針にはしていない。

## 検証

実施結果:

- ルートJS: **63/63 `node --check` OK**
- `tools/validation/validate-news-data.js`: **OK**
- `validate-light-palace-phase14.js`: **OK**
  - 9タイル六芒星・新テキスト・演出順
  - 北1マス移動後の3F座標
  - ジャスパー／ヴェルドの保存済みMAP座標
  - 主人公座標を変更して再同期しても魔法陣・人物座標が不変
  - persistent visual syncが進行フラグを変更しない
  - storyEventラッチが非同期イベント開始前に保存される
  - 2F→3F、1F→2Fの両逆走階段がブロックされる
  - 六芒星イベントrevision 14の一致
  - 旧ERRORカーソルを新定義先頭へ巻き戻せる

## 変更ファイル

1. `story.js`
2. `story_logic.js`
3. `phaser-field.js`
4. `main.js`
5. `dungeon.js`
6. `map.js`
7. `news.js`
8. `sw.js`
9. `docs/implemented-story-flow-20260608.md`
10. `docs/scenario/62_LIGHT_PALACE_FLASHBACK_AND_FINAL_STAGING_PHASE10_20260819.md`
11. `docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md`
12. `development_notes/2026-08-19/validation/validate-light-palace-phase14.js`
13. `development_notes/2026-08-19/reports/LIGHT_PALACE_PHASE14_20260819.md`
14. `development_notes/2026-08-19/DELTA_MANIFEST_20260819_LIGHT_PALACE_PHASE14.txt`
