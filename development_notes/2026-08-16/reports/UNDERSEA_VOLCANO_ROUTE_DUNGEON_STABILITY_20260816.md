# 海底火山：ワールド入口・可変階層・帰還安定化（2026-08-16）

## 概要

海底火山について、ワールド上の見え方、スカイプリズムの並び、可変階層の生成方式、突入位置、エスケープ帰還、階段方向、案内文言を一体で修正した。

今回の正仕様は以下。

- ワールド座標 `(113,17)` を海底火山入口とする。
- 入口の**基底タイルは草原（G）**。周囲4方向は海（W）のため、海中の小さな陸地として見える。
- 基底タイル上には従来どおり**洞窟アイコン `overlay_field_cave`**を表示する。
- スカイプリズムの行先一覧では**「大灯台」の直下に「海底火山」**を置く。
- 海底火山F1～F3の可変階層は、迷路型を生成しない。room / cave / ruins 系の可変構造だけを使う。
- 海底火山は地下へ潜るダンジョンとして扱い、**下り階段＝先へ進む／上り階段＝戻る**に統一する。
- 初回突入は、生成されたF1の実際の上り階段 `U` 上へ出現する。
- F1の上り階段・エスケープはいずれもワールド `(113,17)` へ戻す。
- 旧可変階層キャッシュはテンプレートバージョン差を検知して再生成し、旧座標が新MAPで不適切な場合は新しい入口階段へ安全補正する。
- 案内文は「光の宮殿の北東」ではなく、**「カザリアよりさらに北東、海の中」**を基準表現とする。

## 不安定化の原因

### 1. 固定 `entryPoint` が可変階の実入口を上書きしていた

海底火山のベース定義に `entryPoint: {x:9,y:13}` が残っており、F1をランダム生成した後も、生成MAPが持つ本来の `entryPoint` より固定座標が優先されていた。

そのため、生成結果によっては階段のない場所へ突入していた。

対策として、固定可変ダンジョン開始時は**生成済み階層の `entryPoint` を最優先**するよう共通処理を修正し、海底火山ベース側の固定 `entryPoint` を削除した。

### 2. 可変MAP生成中の仮スポーンがワールド帰還座標を破壊していた

`Dungeon.getOrCreateFixedProceduralFloor()` は生成時の歩行可能座標確認で `setPlayerRandomSpawn()` を一時利用する。この処理が `Field.x/y` だけでなく `App.data.location.x/y` も書き換えていた。

`Dungeon.startFixed()` はその後にreturnPointを作るため、海底火山へ入る直前のワールド `(113,17)` ではなく、**生成中のランダムなダンジョン座標**を脱出先として保存してしまう場合があった。

この結果、エスケープ時に不正なワールド座標へ戻ろうとして位置不安定が発生していた。

対策として、可変MAP生成前に `App.data.location.x/y` も退避し、生成後に `Field.x/y` と合わせて完全復元するよう修正した。

## 可変階層の迷路廃止

F1～F3に設定されていた `forceMaze: true` を削除した。

通常の `Dungeon.pickRandomFloorType()` は room / cave / ruins のみを返し、maze typeは返さないため、海底火山の可変階層は迷路型にならない。

さらに `proceduralTemplateVersion: 2` を付与した。旧セーブに保存された旧迷路生成キャッシュ（version 0相当）は不一致として破棄・再生成する。

## 地下階層方向

海底火山に `floorDirectionMode: "basement"` を追加した。

これにより階数が増えるほど地下深部へ進むものとして表示・操作を統一する。

- F1 → F2：下り
- F2 → F3：下り
- F3 → F4：下り
- F4 → F5：下り
- F5 → F4：上り
- 各階の前階帰還：上り
- F1の上り：ワールドへ戻る

## ワールドとスカイプリズム

ワールドサイズは前工程で拡張済みの横130マスを維持した。今回さらに横幅を増やしてはいない。

`(113,17)` のみを海 `W` から草原 `G` へ変更し、上下左右は海のままとした。AREA側の `fieldTile` は洞窟アイコンのままなので、見た目は「海の中の1マス陸地＋洞窟入口」となる。

スカイプリズムの `skyPrismAreaOrder` は、`BIG_TOWER` の直後に `UNDERSEA_VOLCANO` を追加した。未発見時の解禁条件は既存仕様を維持する。

## 案内文

雷の要塞・水上都市・現在目的の表現を次へ統一した。

- 「カザリアよりさらに北東」
- 「陸ではなく海の中／外海」

「光の宮殿の北東」という地理的には正しいが距離感を誤認しやすい表現は、プレイヤー向け目的文・案内会話から外した。

## 旧セーブ互換

- 旧海底火山F1～F3キャッシュはテンプレートversion差により再生成する。
- 再生成直後、保存座標が新MAPで壁・不正位置の場合、または旧テンプレートからの再生成を検出した場合は、生成された入口 `U` へ無言で補正する。
- ワールド帰還先は `(113,17)` に固定される。
- 旧大灯台直通イベント定義は進行中イベント互換のため残しているが、現行MAPからは通常呼ばれない。

## 検証

- `UNDERSEA_VOLCANO_STABILITY_CHECK_20260816.js`：**69/69 PASS**
  - ランダム生成8回で毎回 `U` 階段上へ突入
  - 毎回returnPointがWORLD `(113,17)`
  - エスケープ後も `(113,17)`、位置不安定ログなし
  - F1上り階段も `(113,17)`
  - floor type 2000回抽選でmaze 0件
  - 旧version 0キャッシュ再生成・入口補正
  - F4/F5の上下方向確認
- `REINCARNATION_UNDERSEA_ROUTE_CHECK_20260816.js`：**50/50 PASS**
- `JOB_TRAIT_SYSTEM_CHECK_20260816.js`：**115/115 PASS**
- 関連回帰スクリプト：**10/10 PASS**
- トップレベルJavaScript：**63/63 `node --check` PASS**

`tools/validation/validate-news-data.js` は現行スナップショット内に存在しないため直接実行できなかった。代わりに専用検証で2026/08/16のNEWSが1件だけであり、今回内容が同一レコードへ追記されていることを確認している。

## 変更ファイル

最終差分マニフェスト `development_notes/2026-08-16/DELTA_MANIFEST_20260816_UNDERSEA_VOLCANO_STABILITY.txt` を正とする。

### 正確な変更・新規ファイル一覧（21件）

- `canon/PRISMA_CODING_HANDOFF_v5.md`
- `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`
- `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
- `development_notes/2026-08-16/DELTA_MANIFEST_20260816_UNDERSEA_VOLCANO_STABILITY.txt`
- `development_notes/2026-08-16/reports/UNDERSEA_VOLCANO_ROUTE_DUNGEON_STABILITY_20260816.md`
- `development_notes/2026-08-16/validation/JOB_TRAIT_SYSTEM_CHECK_20260816.js`
- `development_notes/2026-08-16/validation/JOB_TRAIT_SYSTEM_REGRESSION_UNDERSEA_20260816.log`
- `development_notes/2026-08-16/validation/REINCARNATION_UNDERSEA_ROUTE_CHECK_20260816.js`
- `development_notes/2026-08-16/validation/REINCARNATION_UNDERSEA_ROUTE_CHECK_20260816.log`
- `development_notes/2026-08-16/validation/TOP_LEVEL_JS_NODE_CHECK_20260816_UNDERSEA_STABILITY.log`
- `development_notes/2026-08-16/validation/UNDERSEA_VOLCANO_REGRESSION_20260816.log`
- `development_notes/2026-08-16/validation/UNDERSEA_VOLCANO_STABILITY_CHECK_20260816.js`
- `development_notes/2026-08-16/validation/UNDERSEA_VOLCANO_STABILITY_CHECK_20260816.log`
- `docs/scenario/59_REINCARNATION_JOB_RETURN_AND_UNDERSEA_VOLCANO_WORLD_ROUTE_20260816.md`
- `docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md`
- `dungeon.js`
- `main.js`
- `map.js`
- `news.js`
- `story.js`
- `sw.js`
