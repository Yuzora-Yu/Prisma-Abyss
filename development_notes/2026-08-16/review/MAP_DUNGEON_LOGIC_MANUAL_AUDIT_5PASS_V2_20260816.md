# MAP / DUNGEON ロジック目視監査 5-pass v2（2026-08-16）

## 目的

前回の5周監査は、海底火山最奥に `bosses[]` のグラド定義がある一方、実床が `B` ではなく `T` だったためボス処理が発火しない不具合を発見できなかった。これは「定義が存在するか」「validatorが通るか」を見過ぎ、**複数定義がruntime上で意味的に結合しているか**を十分照合しなかった監査ミスだった。

今回は自動検証を補助にのみ使い、以下5観点をコード経路とデータ定義を突き合わせて再監査した。今回見つけた監査項目は、ユーザー指定の修正3点を除きruntimeへは未修正。

---

## Pass 1 — boss / chest / action と床記号の意味契約

### 現状確認

固定ボスは `bosses[]` に定義されているだけでは戦闘にならない。`Dungeon.prepareFixedTileAction()` と隣接ボス検出は `B` タイルを入口条件にしている。

海底火山グラドは前回 `bosses[]=(9,4)` / tile=`T` だったため進行不能になった。現行では `(9,4)` が `B` で一致している。

全固定ダンジョンを現行の `maps_logic.js` 正規化後データでも見直し、現在定義されている他の固定ボスは `B` と一致している。

### P1候補: `normalizeCoordinateActorTiles()` が特殊タイルを消せる

`maps_logic.js` の画像付き `mapAction / mapActor` 正規化は、`baseTile` 未指定時に元タイルを原則 `T`（元がGだけG）へ変更する。

つまり将来、ボス `B`、階段 `D/U`、出口 `S`、宝箱 `C/R` 上へ画像付きactor/actionを重ねて `baseTile` を書き忘れると、**データ上はボス/階段/宝箱定義が残ったまま床だけTへ消える**。海底火山グラドと同型の不具合を共通処理が再生成できる。

現行データで確認した特殊タイル上の画像付き配置は必要箇所で `baseTile` が明示されており、現在の別ボスが消えている事例は見つからなかった。

### 修正提案

- 元タイルが `B/D/U/S/C/R/X/Y/Z/Q/N/O` の場合は、`baseTile` 未指定なら元タイルを保持する。
- あるいは特殊タイル上で `imageKey` を使う場合、`baseTile` 必須としてconsole/errorまたはeditor警告にする。

---

## Pass 2 — floorLinks と実床・遷移先

### P1: 明示EXITリンクが実際のSタイルとずれている3地域

現在、次の明示EXITリンクは実床が `T` で、実際の `S` 出口は隣のマスにある。

1. `FORBIDDEN_FOREST` 1階
   - floorLink: `(53,16)` / tile `T`
   - actual `S`: `(54,16)`
2. `LIGHT_PALACE` 1階
   - floorLinks: `(16,27),(17,27),(18,27)` / すべて tile `T`
   - actual `S`: `(16,28),(17,28),(18,28)`
3. `CRENA_LIMESTONE_CAVE` 1階
   - floorLink: `(13,21)` / tile `T`
   - actual `S`: `(13,22)`

### なぜ今まで表面化しにくいか

`tryFixedAutoFloorLink()` は `S` 上に明示linkがなくても汎用 `Dungeon.exit()` を実行する。そのためプレイヤーは外へ出られ、テストも「退出できる」で通り得る。

しかし明示link側の `label / log / requiredFlag / setFlag / exitPoint` は実際のSを踏んだ時に使われない。将来そこへ条件を追加すると、データ上は設定済みなのにruntimeでは無視される。

### 修正提案

- floorLink source座標とタイル種別を契約化する。
- `to:'EXIT'` + 接触退出なら原則 `S` 上に置く。
- エディタ保存時に `floorLinks[]` の座標と床記号を意味検証し、ずれを警告する。

### 補足: `D` 上のEXITは別仕様

`PURGATORY_MOUNTAINS` 北東峰は `D` タイル上に `to:'EXIT'` があるが、これは隣接アクションで `followFixedFloorLink()` を呼ぶ構造で、上記のS座標ずれとは異なる。現状ロジック上は操作可能。

### P2: targetMarker fallback が階層方向を考慮しない

`followFixedFloorLink()` は明示targetがない場合、`toFloor < currentFloor ? 'D' : 'U'` と固定している。これは「階数が増えるほど上る塔」と「階数が増えるほど潜る地下」で意味が逆になる。

現行の主要リンクは明示座標や生成時linkで救われているが、将来 `floorDirectionMode` を持つ固定ダンジョンでfallbackを使うと逆階段へ出る可能性がある。

---

## Pass 3 — 試練の天使など特殊配置の実配置安全性

### 今回の指定修正

固定ダンジョンの天使戦は以下へ補正済み。

- 左右: 基準Rank +10～+14
- 中央: 基準Rank +15～+19
- 追加ステータス倍率あり（現行master 1.35）
- `bosses[]` がある固定ボス階では天使を生成しない

### P1: 固定天使の候補マスがNPC・家具・泉を避けない

`getFixedTrialAngelSpawnCandidates()` は以下を避ける。

- floorLinks
- mapActions
- tileEffects
- bosses
- chests
- 他special object

一方で以下を避けていない。

- `mapActors`
- `blockingObjects`
- blocking floorDecorations
- `healSprings`

そのためT/Gであれば、NPC、寝台、家具、回復泉と同じ座標へ天使を生成できる余地がある。

### P1: 到達可能性を検証しない

ランダムダンジョン側 `getSpecialSpawnCandidates()` は reachable set を使うが、固定版は単純な距離しか見ない。鍵扉の向こう、進行上まだ入れない部屋、分断された歩行領域へ天使が出る可能性がある。

### 修正提案

固定版も「現在地点からの到達可能セル」を作り、`MapRegistry.findBlockingObject()`、actor、heal spring等を除外した共通candidate resolverへ寄せる。

### P3: 生成時angel recordに半端な情報が残る

`rollTrialAngelSpawn()` は `monsterIds / statMultiplier / rewardCount` をrecordへ持つ一方、戦闘開始時にはRankから敵を再選定する。今回statMultiplier/rewardCountはmaster値へ合わせたが、`monsterIds` は現状実戦選定には使われない。将来の調整時に「このIDが出る」と誤認させる死にかけた契約になっている。

---

## Pass 4 — fixed procedural生成・キャッシュ

### P1: 古い/半端な可変階キャッシュをvalid扱いできる

`isValidFixedProceduralFloor()` は矩形判定の後、

`!floorDef.generatedFromAbyssLogic || !Array.isArray(floorDef.chests)`

なら即 `true` を返す。

つまり「現在はprocedural templateが要求されているのに、古いsave上のcached floorが生成markerを持たない」「chests配列が欠けている」場合に、version比較・到達可能性検証へ進まず有効扱いできる。

海底火山の過去の不安定化のように、古いcache形状が残る系の事故に弱い。

### 修正提案

- `template.procedural === true` の場合は、生成marker/version/chests/entryPoint/floorLinksを必須にしてfail closed。
- authored/static floorだけをmarker不要として扱う。

### P2: 海底火山の「迷路禁止」がエリア自身の契約になっていない

現在海底火山が迷路にならないのは、共通 `pickRandomFloorType()` が現状mazeを選ばないことに依存している。

将来、別ランダムダンジョン向けに共通maze抽選を復帰すると、海底火山も再び迷路化し得る。

### 修正提案

海底火山template側へ `allowedLayoutTypes:['room','cave','ruins']` のような許可リストを持たせ、共通生成器はtemplate制約の中から選ぶ。

---

## Pass 5 — entryPoint / safe spawn / save互換 / schema正規化

### P1: `changeFixedFloor()` が明示target座標を無条件採用する

`changeFixedFloor()` は `targetX/targetY` があればそのまま `Field.x/y` へ設定し、次の座標を統一的には検査しない。

- W/impassable tileではないか
- blocking object上ではないか
- blocking decoration上ではないか
- actorと重ならないか
- 現在の進行状態で有効な床か

現行の静的floorLinksの明示targetについては今回読んだ範囲で壁直撃は見つからなかったが、ユーザーが今後MAPを大きく再配置する予定のため、古いtarget座標が新MAPの壁/家具へ化ける危険が高い。

### P1: schemaの自動entryPointが歩行可能性を見ない

`normalizeFixedMapSchema()` はentryPointが欠けると `(width/2, height-2)` を自動生成するが、そのタイルが歩行可能かを確認しない。新MAPをエディタで追加しentryPointを忘れると、壁内スポーンを静かに作り得る。

### 修正提案

`resolveSafeFixedSpawn(mapDef, desiredPoint, options)` のような共通関数を作り、entry、floor transition、escape/return、save復帰のすべてを通す。

優先順位例:
1. 指定点が安全ならそのまま。
2. 対応する階段/entry marker。
3. BFSで最寄りの歩行可能・非blockingセル。
4. それでもなければエラーを明示し、安全なfallbackへ。

---

# 優先順位まとめ

## P1 — MAP大改修前に直したい

1. 明示EXIT linkと実Sタイルの3地域座標ずれ。
2. 固定天使のNPC/家具/泉重複・到達不能spawn。
3. `normalizeCoordinateActorTiles()` の特殊タイル破壊リスク。
4. fixed procedural cacheのfail-open判定。
5. entry/floor transition/save復帰を共通safe-spawnへ統合。

## P2 — 基盤整理時

6. 地下/塔方向を考慮しないtargetMarker fallback。
7. 海底火山のlayout allow-list化。

## P3 — 読み違い防止

8. trialAngel recordの未使用 `monsterIds` 等の契約整理。

---

# 今回修正していない理由

ユーザー指定は「細かなロジックミスを見つけること」が主目的であり、監査で見つけた別件を勝手に直すと進行・セーブ互換へ新しい影響を入れるため。上記は修正案までに留める。
