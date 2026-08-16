# マップ／ストーリーエディタ利用ガイド vNext

更新日: 2026-08-16

## 最重要: `map.js` を丸ごと再生成しない

現行の `map.js` には、単純な配置データだけでなく `MAP_MASTER`、MAP ID alias、section index、`WORLD_MAPS`、深淵地域の正本、生成式固定ダンジョン、互換コード、派生ID付与処理などが共存している。

旧エディタのように「実行時オブジェクトを JSON 化して `map.js` 全体を作り直す」方式は禁止する。`map_story_editor.html` vNext は、現在の `map.js` ソースを保持し、編集した定数／直接定義だけを書き換える source-preserving 方式を採用する。

出力時に次の保護定義が変化・欠落した場合は出力を停止する。

- `MAP_MASTER`
- `RETIRED_MAP_IDS`
- `MAP_ID_ALIASES`
- `MAP_IDS`
- `FIXED_AREA_MAP_KEYS`
- `FIXED_AREA_MAP_SECTION_INDEX`
- `STORY_AREA_MAP_KEYS`
- `WORLD_MAPS`
- `DERIVED_PROGRESS_FLAGS`
- `ABYSS_REGION_MASTER`
- `decorateMapDefinitionsWithIds()` と window export 群

## 起動

推奨はプロジェクトをローカル HTTP サーバーで配信し、`map_story_editor.html` を開く方法。

HTTP 経由では `map.js` / `story.js` の**現在のソース本文**を自動取得する。`file://` で開いて fetch が制限された場合は、上部の `map.jsを選択してください` / `story.jsを選択してください` をクリックし、現在のファイルを明示選択してから出力する。

ソース本文を保持できていない状態では、安全な出力を行わない。

## UI構成

### ワールド

最上位で以下を完全に分離する。

- 地上世界 (`WORLD`)
- 深淵世界 (`ABYSS_WORLD`)

地上世界表示に深淵世界の拠点・ダンジョンを混在させない。逆も同様。

ワールド画面には `STORY_DATA.areas` のうち、選択中の `worldKey` に属する拠点だけを表示する。固定MAP・固定DUNGEONは別タブで編集する。

### 固定MAP

町、邸宅、屋外区画など `FIXED_MAPS` を編集する。

- タイル直接編集
- 入口座標
- 名称 / themeKey
- 配置オブジェクト単位編集
- 詳細JSON

### 固定DUNGEON

`FIXED_DUNGEON_MAPS` の階層を確認・編集する。

**直接ソースに定義されているダンジョンのみ書き出し可能。** spread / helper / authored generator から作られる定義は読み取り専用とし、実行時オブジェクトを展開してソースへ逆輸出しない。

### ストーリー

`STORY_MANAGER_DATA.scripts` / `events` を個別JSONで編集する。既存台詞の変更はシナリオ承認ルールに従う。

### データ

以下の独立データを編集できる。

- `FIELD_ENCOUNTER_ZONES`
- `WORLD_BRIDGES`
- `STORY_MAP_MUTATIONS`
- `AUTHORED_MAP_PROP_PLACEMENTS`

## 配置オブジェクト編集

固定MAP／直接定義の固定DUNGEONでは、「オブジェクト」タブから以下を1件ずつ編集できる。

- `chests`
- `bosses`
- `floorLinks`
- `mapActors`
- `mapActions`
- `tileEffects`
- `healSprings`
- `blockingObjects`
- `floorDecorations`

種類を選択 → 対象を選択 → X/Y またはその1件だけのJSONを編集する。追加・複製・削除にも対応する。

「オブジェクト」タブを開いている時にキャンバス上の既存オブジェクトをクリックすると、その配置を選択する。MAP全体JSONを編集する必要はない。

## 軽量化

旧エディタの「全マップ／全画像を常時再描画」方式を避ける。

- 一覧は現在タブ・現在世界だけ生成
- キャンバスは現在選択中のMAPだけ描画
- 標準はカラータイル表示
- 画像表示は必要時だけON
- 再描画は `requestAnimationFrame` へ集約
- ドラッグ塗りのUndo snapshotは**1ストロークにつき1回**。1マスごとに全データをJSON化しない
- 検索入力は短い debounce を使用

## 出力方式

`map.js 出力` は、読み込んだ現在ソースを土台に以下の**変更された範囲だけ**を書き換える。

- `SURFACE_WORLD_MAP_DATA`
- `ABYSS_WORLD_MAP_DATA`
- `FIELD_ENCOUNTER_ZONES`
- `WORLD_BRIDGES`
- `STORY_MAP_MUTATIONS`
- `AUTHORED_MAP_PROP_PLACEMENTS`
- `STORY_DATA.areas.<areaKey>` の直接定義
- `FIXED_MAPS.<areaKey>` の直接定義
- `FIXED_DUNGEON_MAPS.<areaKey>` の直接定義

未編集部分は元ソースをそのまま維持する。

`story.js 出力` も同様に、現在ソース内の `STORY_MANAGER_DATA` だけを置換する。

## 検証画面

最低限、以下を確認する。

- ワールド行幅の一致
- 拠点座標が所属世界の範囲内か
- 固定MAPの行幅、width / height
- 配置オブジェクトの座標範囲
- 保護定義が現在の `map.js` に存在するか
- 地上・深淵の二世界定義が存在するか

ただし、エディタ内検証は**runtimeの目視点検の代替ではない**。特に階段、帰還、可変ダンジョン、セーブ復帰、進行条件はコード経路を別途確認する。

## MAP拡張時の注意

今後、町・ダンジョン・ワールドを拡張／再レイアウトする前提なので、以下を守る。

- 拠点は `worldKey` を正しく設定する。
- 同じ探索物は座標を動かしても `lootId` を維持する。
- 階段・入口・出口を動かしたら `entryPoint` / `entryPoints` / `floorLinks` / `exitPoint` を同時に確認する。
- 地下へ進むダンジョンは `floorDirectionMode: "basement"` を明示する。
- 可変生成ダンジョンの制約（例: 海底火山は迷路禁止）は、将来的にはダンジョン自身の定義へ持たせる。
- 大規模変更後は、保存中座標が新MAPで通行不能になった場合の復帰も確認する。
