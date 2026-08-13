# MAP区画統合・リースの山小屋・海底火山 継続実装 2026-08-13

## 1. 今回の確定方針

ユーザー指示により、同一施設の屋外／屋内は別MAPとして増やさず、ダンジョンの階層違いと同様に**同一MAP内の別区画**として管理する方針へ統一した。

今回の実装では次の責務を分離している。

- `mapId`: ロケーションそのものの正規MAP ID。
- `areaKey`: runtimeが現在いる区画を識別する内部キー。
- `mapSection`: 同一MAP内の区画番号。
- `floorId` / `sectionId`: `MAPxxxxx-00`, `MAPxxxxx-01` の形式で区画を一意に識別するID。

区画対応は `FIXED_AREA_MAP_KEYS` と `FIXED_AREA_MAP_SECTION_INDEX` を共通正本とし、個別施設だけの判定分岐は作っていない。`MapRegistry.getMapBindingForArea()` から同じ契約を参照できる。

## 2. レクスノート邸

### MAP管理

- 正規MAP: `REXNOTE_ESTATE / MAP000071`
- section 00: internal area key `REXNOTE_ESTATE_GROUNDS` / player name `レクスノート邸`
- section 01: internal area key `REXNOTE_ESTATE` / player name `レクスノート邸内`

前回の開発版で屋外用に一時確保した `MAP000077` は廃止した。セーブ・資料・後続実装で別用途へ誤再利用しないよう `RETIRED_MAP_IDS` に予約情報だけ残している。

内部 area key `REXNOTE_ESTATE_GROUNDS` は既存セーブ／既存イベント互換のため残すが、プレイヤー向け名称は `レクスノート邸` とする。

ハヤテの無言接触は屋外区画に維持し、屋内への代替配置はしていない。

## 3. リースの山小屋

### MAP管理

- 正規MAP: `REES_MOUNTAIN_HUT / MAP000069`
- section 00: internal area key `REES_MOUNTAIN_HUT_EXTERIOR` / player name `リースの山小屋`
- section 01: internal area key `REES_MOUNTAIN_HUT` / player name `リースの山小屋内`

### 新規屋外区画

17x13の屋外区画を追加した。

- ワールドから山小屋へ入る時は屋外section 00へ入る。
- 玄関から屋内section 01へ遷移する。
- プロローグの5年後起床イベントは従来どおり屋内section 01から開始する。
- 屋内から出る時は直接WORLDへ戻さず、必ず屋外section 00へ移る。
- `prologueDepartedReesHut` は屋内→屋外では立てず、実際に屋外→WORLDへ出た時だけ立てる。

これにより、既存の「リースへ話しかけてから出発する」という進行条件を壊さず、屋外／屋内の位置関係も自然になった。

### locked stepの共通改善

固定MAPの `triggerOnStep` actionは、条件未達時に `lockedText` があっても旧runtimeでは無言になるケースがあった。

`Field.move` の共通処理を修正し、条件未達のstep transitionでも `lockedText` / `lockedLog` を表示するようにした。リースの山小屋だけの特殊分岐は入れていない。

## 4. 続きの処理 — 海底火山の可変ダンジョン化

2026-08-12の設計で保留されていた「海底火山の大規模可変ダンジョン化」を今回の継続作業としてruntimeへ反映した。

### 構成

- F1 `第1層・海底火道`: 可変 / 溶岩は通行不可。
- F2 `第2層・圧熱回廊`: 可変 / 溶岩は歩行可能なダメージ床。
- F3 `第3層・火脈深部`: 可変 / 溶岩は通行不可。
- F4 `研究区画`: 固定。ジャスパー秘密研究施設・研究イベントを維持。
- F5 `最奥・戦闘エリア`: 固定。グラド `301063` と `underseaVolcanoCleared` を維持。

F1～F3は既存のfixed procedural基盤を再利用している。外から海底火山へ再進入すると新runになり、同じrun中の階層移動では生成結果を維持する。

### 溶岩地形の共通化

`Dungeon.applyFixedProceduralTerrain()` を追加した。

- `template.proceduralTerrain` でtile / density / modeをデータ定義する。
- `mode: "damage"` は歩行可能。既存の共通 `M` tile処理 `Dungeon.stepOnLava()` をそのまま使う。
- `mode: "impassable"` は生成floorの `impassableTiles` にtileを登録する。
- 通行不可terrainを置く前に、入口から出口・宝箱など必須anchorへの具体的な経路を保護する。
- terrain配置後のcached floorも、入口／floor link／宝箱の到達性を `isValidFixedProceduralFloor()` で検証する。

特定の「海底火山だけ」へ直書きするのではなく、今後ほかの物語ダンジョンでも利用できるfixed procedural terrain契約として実装した。

F4から可変F3へ戻る際は固定座標へ戻さず、そのrunで生成されたF3の `D` markerを動的に解決する。

### セーブ互換

`fixedProceduralGenerationVersion` は **3のまま**維持した。

今回versionを全体で上げると、既に運用中のレクスノート邸地下B1～B4のcached floorまで一斉無効化し、既存セーブで現在地と再生成MAPがずれる危険があるためである。

海底火山F1～F3は今回初めてfixed procedural化する区画なので、全体versionを上げなくても新契約で生成される。

## 5. 更新した正本

- `canon/PRISMA_CODING_HANDOFF_v5.md`
- `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`
- `news.js` の2026/08/13レコード

同日のnews recordを増やさず、既存1件へ今回の内容を統合した。

## 6. 主な変更ファイル

Runtime:

- `map.js`
- `maps_logic.js`
- `dungeon.js`
- `main.js`
- `news.js`

Targeted audit:

- `development_notes/2026-08-13/targeted_followup_check_20260813.js`
- `development_notes/2026-08-13/targeted_map_section_volcano_check_20260813.js`

Documentation:

- `canon/PRISMA_CODING_HANDOFF_v5.md`
- `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`
- 本report
- `development_notes/2026-08-13/handoff/PRISMA_ABYSS_HANDOFF_20260813_MAP_SECTION_REES_VOLCANO.md`

## 7. 検証

最新handoffの指示どおり、同梱validatorは実行していない。

実施:

- `node --check map.js`: PASS
- `node --check maps_logic.js`: PASS
- `node --check dungeon.js`: PASS
- `node --check main.js`: PASS
- `node --check news.js`: PASS
- `targeted_followup_check_20260813.js`: PASS
- `targeted_map_section_volcano_check_20260813.js`: PASS

新targeted checkで確認した内容:

- レクスノート邸の屋外／屋内が同じ `MAP000071` でsection 00／01になる。
- リースの山小屋の屋外／屋内が同じ `MAP000069` でsection 00／01になる。
- `MAP000077` はactive MAP masterから消え、retired IDとしてのみ残る。
- リース屋外の玄関・WORLD出口がentryから到達可能。
- レクスノート邸のハヤテ・玄関・WORLD出口がentryから到達可能。
- 海底火山F1～F3だけが可変、F4/F5は固定。
- F1/F3の通行不可溶岩を置いても出口／宝箱への必須経路が残る。
- F2の溶岩はwalkableのまま。
- 到達不能になったcached procedural floorは拒否される。
- `getOrCreateFixedProceduralFloor()` の実生成経路でも溶岩を適用し、同一runではcacheを再利用し、新run開始時はrun IDを更新する。
- 固定MAPの条件未達step transitionで既存locked文言を表示する共通契約が存在する。

## 8. 実機で残る確認

このZIPには `assets/` がないため、画像ファイル実体を含む総合確認は別環境が必要。

次の実機確認を優先する。

1. NEW GAMEで5年後起床 → リースと会話 → `リースの山小屋内` → `リースの山小屋` → WORLD の導線。
2. ワールドからリースの山小屋へ再訪した際、まず屋外区画へ入ること。
3. レクスノート邸で `レクスノート邸` → `レクスノート邸内` の表記とハヤテ無言接触。
4. 海底火山F1～F3を一度通し、F4/F5へ正常接続すること。
5. 海底火山からいったん出て再進入し、F1～F3の構造だけが更新されること。
6. F2溶岩の既存ダメージ床挙動と、F1/F3溶岩の通行不可挙動。
7. F4からF3へ戻った際、そのrunの生成済みF3出口へ復帰すること。
