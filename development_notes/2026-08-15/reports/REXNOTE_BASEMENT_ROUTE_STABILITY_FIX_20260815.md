# レクスノート邸地下 B4～隠し書庫 導線安定化 2026-08-15

## 結論

ユーザー指摘の2点を再現可能な実装上の問題として確認し、修正した。

1. 地下4階から隠し書庫へ進む階段が「上の階へ」と表示される。
2. 隠し書庫上部の退出マスが踏み込み即時発火し、帰還位置が汎用returnPoint依存になっている。

## 原因

### B4 → B5 の上下判定

共通の階段方向判定は階名中の「地下」を見て地下階かどうかを判定する。
B4は「地下4階」だがB5は「隠し書庫」で「地下」を含まないため、4→5を地下から地上への移動と誤認し `up` を返していた。

### 隠し書庫上部の退出

B5上部 `(12,1)` は `S + to: EXIT` で、固定ダンジョン共通仕様により接触即退出だった。
さらに退出先はダンジョン突入時の `returnPoint` を使っていたため、この地点固有の帰還先が明示されていなかった。

## 修正

- `REXNOTE_BASEMENT.floorDirectionMode = "basement"` を追加。
- basement modeでは同一ダンジョン内の floor number 増加を「下り」、減少を「上り」とする。
- B5上部退出リンクに `triggerOnStep: false` を設定。
- B5上部退出リンクに `exitPoint: REXNOTE_ESTATE (13,7)` を明示。
- 固定ダンジョンから固定MAPへ `exitPoint` で戻る場合、`FIXED_MAPS` からmapDataを解決して帰還安全判定へ渡すようにした。
- 他のS出口は `triggerOnStep` 未指定のため従来挙動を維持。

## ボス戦点検

魔導司書レグルス戦について以下を確認した。

- Monster 301033 が存在。
- B5 `(12,3)` に配置。
- start event: `rexnote_regulus_battle`
- battle win event: `rexnote_regulus_clear`
- clear flag: `rexnoteRegulusDefeated`
- clear後 Item 701013 `レクスノートの魔道書` を補填。
- objective 4-11へ進み、アラン報告イベントへ接続。
- B5上部帰還は `rexnoteRegulusDefeated` 前はロック、撃破後のみ使用可。

静的確認ではボス戦～魔道書取得～アラン報告の連鎖切断は見つからなかった。

## 続きの作業

承認不要の非破壊監査も継続した。

- top-level JavaScript 62本 `node --check`: 62/62 PASS
- 既存 map section / Rees exterior / Undersea Volcano procedural regression: PASS
- party trail の context/reset/commit/render/movement commit/Phaser連携契約: PASS
- 輪廻の結晶runtime再構成はproposal承認待ちのため未実装。

## 検証

- `development_notes/2026-08-15/validation/REXNOTE_BASEMENT_ROUTE_TARGETED_CHECK_20260815.js`
- `development_notes/2026-08-15/validation/REXNOTE_BASEMENT_ROUTE_TARGETED_CHECK_20260815.log`
- `development_notes/2026-08-15/validation/POST_REXNOTE_REGRESSION_CHECK_20260815.log`

## 完成ファイル一覧

変更・作成したファイルは下記の10件です。

1. `map.js`
2. `maps_logic.js`
3. `dungeon.js`
4. `news.js`
5. `development_notes/2026-08-15/handoff/PRISMA_ABYSS_HANDOFF_20260815.md`
6. `development_notes/2026-08-15/reports/REXNOTE_BASEMENT_ROUTE_STABILITY_FIX_20260815.md`
7. `development_notes/2026-08-15/validation/REXNOTE_BASEMENT_ROUTE_TARGETED_CHECK_20260815.js`
8. `development_notes/2026-08-15/validation/REXNOTE_BASEMENT_ROUTE_TARGETED_CHECK_20260815.log`
9. `development_notes/2026-08-15/validation/POST_REXNOTE_REGRESSION_CHECK_20260815.log`
10. `development_notes/2026-08-15/DELTA_MANIFEST_20260815_REXNOTE_STABILITY.txt`
