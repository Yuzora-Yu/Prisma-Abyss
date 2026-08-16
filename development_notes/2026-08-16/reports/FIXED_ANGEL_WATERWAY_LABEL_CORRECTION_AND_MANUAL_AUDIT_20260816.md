# 固定天使・水上都市依頼・階層表示補正 + 5周目視再監査（2026-08-16）

## 今回反映したユーザー指定修正

### 固定ダンジョンの試練の天使
- 左右: 現在階Rank +10～+14。
- 中央: 現在階Rank +15～+19。
- 追加ステータス倍率あり。現行 `randomDungeonPhase2IMaster.angelTrial.statMultiplier = 1.35` を使用。
- 固定ボス階への天使配置抑止は維持。
- spawn record側のstatMultiplier/rewardCountもmaster値へ揃え、開始時ロジックとの食い違いを減らした。

### 水上都市
- 旧「依頼仲介人」を「水路番」へ変更。
- questBoard/3件一覧を廃止し、`water_city_hunt_waterway / 澄んだ水路の残火` を本人から受注・報告する固定クエスト1件へ変更。
- 旧broker専用conversation/eventは未使用化ではなく削除。
- 他2件のquest dataは将来配置用として保持し、水路番からは提示しない。

### 階層表示
- 海底火山地下1～3階を `地下1階 / 地下2階 / 地下3階` へ戻す。
- 地下4階「沈圧研究棟」、地下5階「深海調律炉」は特殊階として維持。
- 前回新規に固有化した深淵後半7ダンジョンを `1層 / 2層...` へ戻す。
- 前回過剰に固有化した通常編の名称も直前の簡潔な表記へ戻す。

## 目視監査のやり直し

前回の5周監査が海底火山グラド不出現を拾えなかった点を監査失敗として記録し、検査軸を「定義の存在」から「runtimeで結び付く定義同士の意味整合」へ変更した。

5-passの詳細は `development_notes/2026-08-16/review/MAP_DUNGEON_LOGIC_MANUAL_AUDIT_5PASS_V2_20260816.md`。

今回新たに、修正せず報告だけに留めた主な事項:

1. 禁忌の森F1、光の宮殿F1、クレナ鍾乳洞F1で、明示EXIT floorLinkが実際のS出口から1マスずれている。汎用S exitが偶然救っている。
2. 固定天使候補がmapActors / blockingObjects / healSpringsを避けず、到達可能性も見ない。
3. imageKey付きactor/actionの正規化がbaseTile未指定時にB/D/U/S/C/R等の特殊タイルをTへ消せる。
4. fixed procedural cache validationが生成marker/chests欠落時にfail-openする。
5. fixed floor transitionのtargetX/Yや自動entryPointを共通safe-spawnで検証していない。
6. 海底火山のmaze禁止がエリア自身ではなく現在の共通floor-type抽選に依存している。

これらはユーザー承認なしに今回修正していない。

## 回帰確認

自動確認は目視監査の代替ではなく、指定修正の回帰確認として実施。

- 補正専用: 54/54 PASS
- 海底火山安定性: 70/70 PASS
- 転生・海底火山航路: 51/51 PASS
- 職業特性: 115/115 PASS
- トップレベルJavaScript: 63/63 `node --check` PASS

目視監査で報告したP1/P2項目は、これらがPASSしていても残っている。特に「明示EXIT linkずれ」は汎用S退出が代替するため、正常系テストだけでは検出しにくい典型例。
