# Phase 10: 光の宮殿イベント復旧・演出強化 / Google Drive導線非表示

日付: 2026-08-19

## 対応範囲

- Google Driveのデータ出力・読込ボタンをプレイヤーUIから非表示化（連携ロジックは保持）。
- ユーザー提供の `map.js` を正本として採用し、未関連のマップ編集を巻き戻さずに光の宮殿だけを追従修正。
- 現在時間4階のジャスパー＆ヴェルド祭壇戦のイベント導線を復旧。
- 光の宮殿回想のルーナ離脱、罠位置、人物配置、移動、暗転／瞬間移動／明滅演出を強化。
- マップエディタの複数階編集導線を確認し、vNextエディタの階層切替を常時アクセスしやすい位置へ追加。

## 1. Google Drive導線

`save_backup.js` の Google Drive API / 認証 / `exportGoogle` / `importGoogle` 処理は削除していない。
`SaveDataUI.open()` が生成するアクションだけを次の4つに限定した。

- オートセーブ出力
- 全セーブデータ出力
- オートセーブ読込
- 全セーブデータ読込

`menus_config.js` の説明も「オート・全セーブ」に変更した。
将来機能を再開する場合はUI導線を戻せば既存ロジックを再利用できる。

## 2. ユーザー提供 `map.js` の扱い

今回の `map.js` は Phase 9 のコピーではなく、2026-08-19にユーザーが添付した `/mnt/data/map.js` を土台にした。
添付版とのdiffは光の宮殿周辺だけで、29 insertions / 12 deletions。

特に、ユーザー編集済みの3階地形では南西階段 `D` が X4 / Y25 に移っていたため、以下のメタデータだけを地形へ追従させた。

- 2階→3階 `targetX: 4`
- 3階→2階 `floorLinks.x: 4`
- 3階 `entryPoint.x: 4`

マップ全体の再生成・再整形はしていない。

## 3. 現在時間・祭壇戦

4階祭壇の単一Bタイル／複合ボス定義を、横並びの2体へ分離した。

- ジャスパー `301070`: X16 / Y11
- ヴェルド `301050`: X18 / Y11
- 共通 `defeatGroupId: light_palace_final_pair`
- どちらも `startEventId: light_palace_final_encounter`

`light_palace_final_encounter` は既存 `LIGHT_PALACE_FINAL_ENCOUNTER` を呼び、ジャスパー＋ヴェルド戦を3倍補正で開始する。

- 初戦勝利 → `light_palace_alan_betrayal`
- 初戦敗北 → Game Overにせず `light_palace_blessing_retry`
- retry → 既存 `LIGHT_PALACE_BLESSING_RETRY` → HEAL → 通常倍率再戦
- retry勝利 → `light_palace_alan_betrayal`

`battle.js` の既存 `storyLossEventId` 処理が `Battle.resultEndIsGameOver = false` とすること、敗北時に同一battle chainの `activeFixedBossContext` を削除することを確認した。したがってretryへ3倍補正が意図せず継承されない。

旧 `LIGHT_PALACE_OVERPOWER_CLEAR` / `LIGHT_PALACE_CLEAR` は会話本文を削除せず残しているが、現行祭壇ルートからは呼ばない。これは現在のアラン裏切りルートとの整合を優先したもの。

## 4. 回想開始

`story_logic.js` にフィールド演出コマンドを追加した。

- `IRIS_TRANSITION`: 外周→中心のアイリス暗転 / 中心→外周の開放
- `DARK_TELEPORT`: 闇からの人物出現
- `SCREEN_FLASH`: 指定色列の全画面明滅

回想開始時はアイリスclose → Scene Context開始 → 6番目の固定階（聖女の部屋）へ移動 → アイリスopen。
`lockPartyComposition:false` とし、編成制限は追加していない。

## 5. 3階・ルーナ封印

罠発火範囲は確認訂正により `X16〜18 / Y20` のrect定義とした。現行地形でも X16〜18 は3マスとも床、両端の X15/X19 は壁であり、通路幅と一致することを検証した。

演出順:

1. ジャスパーを北側へ `DARK_TELEPORT`
2. 既存 `LIGHT_PALACE_FLASHBACK_HEXAGRAM_TRAP` のジャスパー／ルーナ／レイラ部分
3. `RESET_TEMP_ALLY 401 force:true`
4. 回想パーティをレイラのみへ
5. レイラを北へ1マス移動
6. ヴェルドを正面へ `DARK_TELEPORT`
7. 既存ヴェルド台詞を分離した `LIGHT_PALACE_FLASHBACK_VELD_ARRIVAL`
8. 既存の回想ヴェルド強制敗北戦

`App.resetTemporaryStoryAlly` はパーティから外すだけでなく `App.data.characters` から対象 `charId` をfilterするため、回想中の仲間一覧からもルーナが消える。Scene Context終了時には現在時間の状態が復元される。

## 6. 初戦敗北後〜入口退却

### レオン／クロード登場

- レイラ: X18 / Y20、北向き
- レオン: 南西階段 X4 / Y25 から走って登場
- クロード: X5 / Y25 から走って登場
- 最終配置: レオン X17/Y19、クロード X19/Y19、レイラ X18/Y20、北向き

クロードの既存「フラッシュボム！」直後に白黒白黒白の全画面明滅を入れた。

退却開始後に北へ戻ると、repeatable tile effectから次のユーザー指定台詞を出して南へ1マス戻す。

`そっちに戻ってどうする！入口へ急ぐぞ！！`

### 1階入口

結界前で:

- レオン X16/Y26、レイラ X17/Y26、クロード X18/Y26
- 初期は3人とも南向き
- ヴェルドは北 X17/Y20 から X17/Y23 へゆっくり南下
- レイラの既存「お断りします。」後、3人が北を向いて1マス前進
- ヴェルド戦へ

敗北後の既存 `LIGHT_PALACE_FLASHBACK_ESCAPE_END` では、レオンの「クロード！ ルーナを絶対に離すな！」直後にクロードだけを南側のマップ外へ移動させて削除する。既存本文は維持した。

## 7. マップエディタ

確認結果:

- `editor_map_story.html` は元から `d.floors.forEach(...)` で固定ダンジョン各階を別エントリとして列挙しており、1階限定ではなかった。
- `map_story_editor.html` も `state.selectedFloor` と右側Edit inspectorの階selectを持っていた。
- ただし階selectがEdit inspector内にしか見えず、Objects / Raw表示では階切替導線が消えるため「1Fしか編集できない」ように見えやすかった。

今回、キャンバス上部へ `canvasFloorSelect` を追加し、固定DUNGEON選択時はどのinspectorでも階層を切り替えられるようにした。

Light Palaceで7階層が列挙されることをChromium smoke testで確認:

1. 1階・白光の回廊
2. 2階・祝福の水盤
3. 3階・結界の聖廊
4. 4階・光の祭壇
5. 地下牢
6. 聖女の部屋
7. 宝物保管庫

## 8. Asset確認方針

GitHubはユーザー指定どおり `assets` 配下の構造確認だけに使用し、Git上のJSコードを今回の実装へコピー／差し替えしていない。
実装上の画像解決はローカル `assets.js` と既存 `App.getCharacterWalkGraphicPresentation` / `Field.getMonsterMapSpriteSrc` を使用する既存ランタイムへ乗せた。

## 9. 検証

実施済み:

- `node --check`: root JS 63 / 63 OK
- `node development_notes/2026-08-19/validation/validate-light-palace-phase10.js`: OK
- `node tools/validation/validate-news-data.js`: OK（19 records / latest 2026/08/19）
- Google Data UI Chromium smoke:
  - export = `オートセーブ出力`, `全セーブデータ出力`
  - import = `オートセーブ読込`, `全セーブデータ読込`
  - Google表示なし
- Map Editor Chromium smoke:
  - Light Palace 7階層表示
  - 3階選択でタイトル更新
  - Objects / Raw / Edit間で選択階維持
  - page error 0
- ユーザー提供 `map.js` との差分を確認し、変更が光の宮殿範囲に限定されていることを確認。

### 検証環境で重点確認してほしい点

自動テストでは実際のプレイ速度・カメラ・キャラ同士の視覚的な間隔までは保証できないため、次を実機で確認する。

1. 回想突入時アイリス暗転の速度
2. 3階罠でジャスパー／ヴェルドの出現位置
3. レオン／クロードの走行速度と最終配置
4. フラッシュボムの白黒明滅が強すぎないか
5. 入口でヴェルドが北から歩いてくる速度
6. 初回3倍戦で敗北しても祝福retryへ確実に進むこと
7. 祭壇のジャスパー／ヴェルドどちらから調べても同じ戦闘へ入ること
