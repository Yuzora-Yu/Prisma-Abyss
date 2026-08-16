# MAP / Dungeon Logic Manual Audit — 5 Passes

日付: 2026-08-16  
対象: `map.js`, `maps_logic.js`, `dungeon.js`, `main.js`, `menus_items.js`, `map_story_editor.html`  
方針: 自動検証を結論の根拠にせず、コード経路を観点別に5周して目視確認する。今回、エディタと誤生成 `map.js` の復元以外は修正しない。

## 総括

直近の海底火山不具合そのものは、現在の正常版ではかなり改善されている。特に可変階生成時のワールド座標復元、生成階 `entryPoint` 優先、地下方向 `floorDirectionMode: "basement"` は正しい。

一方、今後MAPを大規模に拡張・再配置する前提で見ると、**「座標が正しいことをデータ作成者が保証する」前提の共通処理がまだ多い**。海底火山のような事故を防ぐには、入口・階段・帰還・セーブ復帰を一つの安全座標解決器へ集約するのが最重要。

---

## Pass 1 — 正本 / MAP ID / 世界分離 / エディタ往復

### 確認結果

正常版 `map.js` は以下を独立した正本として保持している。

- `MAP_MASTER`
- `RETIRED_MAP_IDS`
- `MAP_ID_ALIASES`
- `MAP_IDS`
- `FIXED_AREA_MAP_KEYS`
- `FIXED_AREA_MAP_SECTION_INDEX`
- `STORY_AREA_MAP_KEYS`
- `SURFACE_WORLD_MAP_DATA`
- `ABYSS_WORLD_MAP_DATA`
- `WORLD_MAPS`
- `DERIVED_PROGRESS_FLAGS`
- `ABYSS_REGION_MASTER`
- 派生MAP ID付与 / exportコード

旧 `map_story_editor.html` はruntimeオブジェクトをJSON化して `map.js` 全体を再生成していたため、このうちエディタが知らない定義を消す構造だった。

### 判定

**Critical / 修正済み（今回必須対応）**

### 今回の対応

- `map.js` を直前正常版へ復元。
- `map_story_editor.html` を source-preserving 方式で再構築。
- 保護定義が出力前後で変わった場合は出力停止。
- helper / spread 由来ダンジョンは読み取り専用。
- `WORLD` / `ABYSS_WORLD` をUI最上位で分離。

---

## Pass 2 — 入口 / 出口 / 帰還 / セーブ位置

### 良い点

- 海底火山の生成時に一時的に変更した `Field.x/y` と `App.data.location.x/y` を復元する処理がある。
- 生成済み可変階の復帰では、旧キャッシュや壁内座標なら `entryPoint` へ補正する処理がある。
- ワールド帰還では海・山を不正帰還先として検出する安全装置がある。

### Finding A — 固定MAP側の帰還安全判定が `W` 依存

`Dungeon.exit()` の固定MAP帰還判定は、基本的にタイル `W` しか拒否しない。

以下を考慮していない。

- `impassableTiles`
- `blockingObjects`
- blocking な `floorDecorations`
- 将来追加される特殊通行不可地形

MAPを再レイアウトしてreturn pointの位置に家具・溶岩・特殊障害物を置くと、座標上は「安全」と判定される余地がある。

**重要度: High**  
**今回: 未修正**

### Finding B — authored固定MAP / authored固定DUNGEONのロード復帰座標に共通修復がない

`Field.init()` は保存された `App.data.location.x/y` をそのまま `Field.x/y` へ復元する。可変生成階には限定的な修復があるが、通常の固定MAP / authored固定階には共通の通行可能セル補正がない。

今後MAPレイアウトを変更すると、旧セーブの座標が新しい壁・家具・閉鎖区画へ入る可能性がある。

**重要度: High**  
**今回: 未修正**

### Finding C — `enterFixedMap()` / `Dungeon.startFixed()` は指定entryを信頼する

`entryPoint`, `entryPoints`, `targetX/targetY` を読み、そのセルが現在のMAP定義で本当に通行可能かを最終確認しない。

エディタで階段や入口を動かし、座標の片側だけ更新し忘れた時に海底火山型の事故が再発しうる。

**重要度: High**  
**今回: 未修正**

### 修正提案

`MapRegistry.resolveSafeSpawn(mapDef, preferredPoint, options)` のような共通関数へ集約する。

判定対象:

1. map bounds
2. wall / `impassableTiles`
3. active `blockingObjects`
4. blocking `floorDecorations`
5. 必要ならイベント占有セル
6. preferredが不正ならentryPoint
7. それも不正なら近傍BFSで最寄り安全セル

入口、階段移動、脱出、スカイプリズム、セーブ復帰の全経路で同じ関数を使う。

---

## Pass 3 — 可変ダンジョン生成 / 海底火山 / 階層リンク

### 良い点

- 現在の `pickRandomFloorType()` は部屋 / 洞窟 / 遺跡のみで、通常抽選から迷路を返さない。
- 海底火山F1–F3には `floorDirectionMode: "basement"` があり、深部へ進むほど下りになる。
- F1は `proceduralEntryReturnsOutside` と `(113,17)` の明示exitを持つ。
- procedural generation version / template version によるキャッシュ更新契約がある。

### Finding D — 「海底火山は迷路禁止」が海底火山自身の仕様になっていない

海底火山F1–F3は `procedural:true` だが、許可するレイアウト型を自分では指定していない。

現在迷路にならない理由は、共通 `pickRandomFloorType()` が偶然 `0 / 1 / 3` だけ返すため。

将来、別ランダムダンジョンのために共通抽選へ迷路(type 2)を戻すと、海底火山にも迷路が復活する。

**重要度: High（将来再発性）**  
**今回: 未修正**

### 修正提案

ダンジョン側へ、例えば次のような明示契約を置く。

```js
proceduralLayoutTypes: ["room", "cave", "ruins"]
```

または

```js
excludedProceduralLayoutTypes: ["maze"]
```

生成器はtemplate側の許可リストを最優先する。

### Finding E — 階段の対向先が「最初に見つかったU/D」へ依存できる

`changeFixedFloor()` は明示 `targetX/targetY` がない場合、次階の `U` または `D` を上から走査し、最初の1つを採用する。

現在の多くの階では問題ないが、今後MAPを広げて複数階段を置くと、別の階段へ飛ぶ可能性がある。

**重要度: Medium**  
**今回: 未修正**

### 修正提案

複数階段を許可するMAPでは `floorLinks` に以下のどちらかを必須化する。

- `targetX / targetY`
- `linkId / targetLinkId`

---

## Pass 4 — ワールド / スカイプリズム / 進行導線

### 良い点

- `MapRegistry.getWorldAreaAt()` はactive worldと `area.worldKey` を比較しており、runtimeでは地上と深淵を混ぜない。
- スカイプリズムは保存時の古い座標ではなく `getFixedMapWorldDestination()` から現在の座標を引き直す。今後拠点を移動しても比較的安全。
- 深淵世界そのものは `skyPrismEligible:false` で直接ワープ対象にしない。
- 海底火山は `BIG_TOWER` の直後に並んでいる。

### Finding F — スカイプリズム順序が `main.js` の手書き配列

移動先の正本順序が `getAllFixedMapDiscoveryEntries()` 内の `skyPrismAreaOrder` にハードコードされている。

新MAPを `STORY_DATA` / `MAP_MASTER` に追加しても、ここを編集し忘れるとスカイプリズムへ出ない。

**重要度: Medium**  
**今回: 未修正**

### 修正提案

`STORY_DATA.areas` または `MAP_MASTER` に次のようなデータを持たせる。

```js
skyPrism: { enabled: true, order: 140, group: "surface" }
```

UIもruntimeも同じデータを読む。

---

## Pass 5 — 保存互換 / データ正規化 / エディタ将来耐性

### 良い点

- `discoverFixedMap()` は現行座標と保存記録が変われば再同期する。
- procedural cacheにはgeneration versionとtemplate versionがあり、旧形状を無条件に使い続けない。
- MAP IDはcanonical location + section indexへ整理されている。
- 新エディタは未知のソースブロックを原文維持する。

### Finding G — `normalizeFixedMapSchema()` の自動entryPointは通行可能性を保証しない

entryPointが欠落している固定MAPには「横中央・下から2マス付近」を自動設定するが、そのセルが壁かどうかは確認しない。

通常はデータ側にentryPointがあるため顕在化しにくいが、未完成MAPや新規MAPで危険。

**重要度: Medium**  
**今回: 未修正**

### Finding H — runtime正規化済みオブジェクトをソースへ戻すこと自体が危険

今回の旧エディタ事故の根本。

runtimeでは `normalizeFixedMapSchema()` や派生ID付与によって、ソースには存在しないフィールドが追加される。runtimeオブジェクト全体を再シリアライズすると、正本と派生値の境界が消える。

**重要度: Critical**  
**今回: 新エディタで対策済み**

---

# 優先修正提案

## P0 — 今回対応済み

1. `map.js` 復元
2. `map_story_editor.html` source-preserving化
3. WORLD / ABYSS_WORLD UI分離
4. helper-generated dungeonの逆輸出禁止

## P1 — MAP本格再設計前に推奨

1. 共通 `resolveSafeSpawn()`
2. authored MAPの旧セーブ座標修復
3. entrance / floor link / exitすべての通行可能性チェック
4. 海底火山の `proceduralLayoutTypes` 明示

## P2 — MAP増加前に推奨

1. floor link ID化 / 複数階段対応
2. Sky Prism orderのデータ化
3. 新規MAPのentryPoint自動補完を安全セル探索化

# 今回あえて修正していないもの

Finding A–Gは報告・修正提案のみ。runtime変更は行っていない。
