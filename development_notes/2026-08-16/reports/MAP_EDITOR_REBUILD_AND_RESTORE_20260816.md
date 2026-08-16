# map.js Restore / map_story_editor vNext Rebuild Report

日付: 2026-08-16

## 実施内容

### 1. `map.js` 復元

ユーザーが古い `map_story_editor.html` で再生成した `map.js` を、海底火山安定化まで反映済みの直前正常版へ復元した。

復元版 SHA-256:

`944f45706147bdba4bc55a23b53b6e1d6211c0631a6a6f3c60b6db2e21274`

復元対象には以下が含まれる。

- MAP ID canonical registry
- retired / alias MAP ID
- area section mapping
- surface / abyss world split
- WORLD_MAPS
- abyss region master
- authored / helper-generated map support
- derived map ID decoration and exports
- undersea volcano current route / dungeon data

### 2. `map_story_editor.html` 全面再構築

旧「全ファイル再生成」方式を廃止。

新方式:

1. 現在の `map.js` / `story.js` ソース本文を保持。
2. runtimeデータはプレビューと編集UIにのみ利用。
3. 出力時はdirtyになった直接定義だけをソース上で置換。
4. MAP registry / helper / compatibility / derived codeは原文維持。
5. 保護定義が変わった場合は出力停止。

### 3. 世界UI分離

- 地上世界
- 深淵世界

を最上位タブで分離。

`worldKey:"ABYSS_WORLD"` の拠点は地上世界の一覧・キャンバスマーカーへ出ない。
固定MAP / 固定DUNGEONもワールド画面へ混在させない。

### 4. UI / 性能改善

- ワールド / 固定MAP / 固定DUNGEON / ストーリー / データの用途別タブ
- 検索
- zoom / fit / 選択地点へセンタリング
- 標準は軽量カラー描画
- 画像表示は任意ON
- `requestAnimationFrame` へ再描画集約
- 一覧は現在タブ・現在世界のみ生成
- ドラッグ塗りのUndo snapshotを1ストローク1回へ変更
- 配置オブジェクトを種類別・1件単位で編集
- キャンバス上の既存オブジェクト選択
- 生成式ダンジョンを明示的に読み取り専用
- source取得失敗時は手動で現在JSを選択可能

### 5. エディタ保護対象

出力前後で以下を比較し、変更されていれば停止する。

- MAP_MASTER
- RETIRED_MAP_IDS
- MAP_ID_ALIASES
- MAP_IDS
- FIXED_AREA_MAP_KEYS
- FIXED_AREA_MAP_SECTION_INDEX
- STORY_AREA_MAP_KEYS
- WORLD_MAPS
- DERIVED_PROGRESS_FLAGS
- ABYSS_REGION_MASTER

また、`decorateMapDefinitionsWithIds` と主要window exportsの存在を確認する。

## 5周目視監査

別紙:

`development_notes/2026-08-16/review/MAP_LOGIC_MANUAL_AUDIT_5PASS_20260816.md`

今回、エディタ／復元以外のruntime懸念は修正せず、提案のみ記録した。

## NEWS

プレイヤー向け新機能ではなく開発エディタ修正＋誤生成ファイル復元のため、`news.js` は変更しない。
