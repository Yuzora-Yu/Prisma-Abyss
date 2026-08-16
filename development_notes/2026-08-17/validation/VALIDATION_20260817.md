# 修正後検証 — 2026-08-17

対象: 2026-08-17修正一式。自動validatorの合否だけに依存せず、重要な状態遷移はコード経路と小規模runtime harnessでも確認した。

## 1. 構文

- ルート直下 JavaScript 63本を `node --check` で再確認: **PASS**
- `main.js`, `menus.js`, `assets.js`, `sw.js` は最終追加修正後にも個別再確認: **PASS**

## 2. 保存トランザクション / rollback

実際の `main.js` をNode VMへ読み込み、DOM等だけ最小stub化して以下を確認した。

- `App.data` root参照を維持してrollback: **PASS**
- `characters` と `inventory` に同じ `id:1` が存在しても、親containerを跨いで参照復元先を取り違えない: **PASS**
- character / equip / traits array / trait / inventory item の既存参照を維持: **PASS**
- 保存失敗後に変更値・追加entryを復元: **PASS**
- `gold` getter/setter descriptorをrollback後も維持: **PASS**
- rollback自体を「Gold獲得」として累計加算しない: **PASS**
- rollback後の新規Gold獲得は `totalGoldEarned` に正常加算: **PASS**
- atomic mutator内部から複数回 `App.save()` が要求されても、部分状態を書き出さず最終1回へ集約: **PASS**
- 最終save成功時は変更をcommit: **PASS**

Harness結果: `atomic_rollback_test=PASS`

## 3. Safe spawn

実際の `Field.resolveSafeLocalSpawn()` を使い、blocked preferred cellからfallback/近傍walkable cellへ退避する小規模harnessを実行: **PASS**

Harness結果: `safe_spawn_test=PASS`

適用経路を静的に再確認:

- fixed map entry
- fixed dungeon floor change / start / saved floor restore
- 起動時の保存済みlocal map座標復元
- Sky Prism local destination
- guild reception transfer

World mapの座標loopはsafe spawn対象へ変更していない。

## 4. ワールド端loop

`main.js` の通常world移動に以下が残っていることを確認。

```js
nx = (nx + mapW) % mapW; ny = (ny + mapH) % mapH;
```

**仕様維持: PASS**

## 5. 水上都市の復旧噴水

`WATER_CITY` map action:

- 旧 `(19,13)` から **`(16,12)`** へ移動: PASS
- 専用 `floorDecorations` の泉画像を除去: PASS
- actionに `imageKey` を持たせない: PASS
- 共通mapAction marker経路が `overlay_event_blue_glimmer` を返すことを確認: PASS

これにより頂の神殿の試練等と同系統のキラキラ表示を利用する。

## 6. 日付 / UI表記scan

- `sv-SE`: ルートJSで残存なし
- 誤置換 `GoldEM`, `Goldold`, `GEMold`: 残存なし
- UI文言inventory: table row 1840件 / max ID 1840
- `inventory_only` 1627件、その他reviewed/new 213件でsummaryと一致

## 7. runtime image cache

最終世代:

- `assets.js cacheWarmup.version`: `2026-08-17-runtime-cache-contract-v28`
- runtime cache: `prisma-abyss-v47.20260817-runtime`
- `main.js fullDataCacheName` fallback: 同上
- `sw.js CACHE_NAME`: `prisma-abyss-v71.20260817`
- `sw.js` image `cacheFirst()` はCacheStorage全世代検索ではなく現runtime世代だけを参照
- `activate` で旧 `prisma-abyss-*` 世代を整理
- `PRISMA_ASSETS.uiIcons` もwarmup image listへ統合

## 8. Semantic icon / menu registry

Node VMの最小harnessで以下を確認。

- skill semantic keyが `PRISMA_ASSETS.uiIcons` を解決: PASS
- item semantic keyがregistryを解決: PASS
- unknown itemがregistry generic iconへfallback: PASS
- `openSubScreen('party')` が新registry adapter経由で従来initを呼ぶ: PASS

Harness結果: `menu_registry_test=PASS`

## 9. viewport / UI foundation

- `index.html`, `main.html` から `maximum-scale=1.0`, `user-scalable=no` を撤去
- `width=device-width, initial-scale=1.0, viewport-fit=cover` を確認
- CSS基礎tokenは既存値と同値で導入し、初期 `.btn` / `.menu-btn` をtoken参照へ移行

## 10. 改行コード

変更ファイルについて、元が純CRLFのファイルをLF/mixedへ変えていないことを比較検査: **0 issues**

## 11. 意図的に変更していないもの

- world map端loop
- browser広告test挙動
- `storyStep-subStep` のプレイヤー向け進行度表示
- Sky Prismボタンへの消費説明追加
- objective marquee方式
- お知らせ/デイリーbadgeの役割
- 1歩ごとの通常移動save（性能計測前のため今回維持）
- legacy direct Canvas fallback（Phaser固有障害との切り分けが残るため維持）
- ガチャ画像runtime asset参照

## 12. 残課題

- `stats.totalSteps` はschemaがあるが成功移動時の加算が未確認のため、数値inventoryでは未完成扱い。
- 22〜25は第一段階のみ。巨大CSSの画面単位移行、modal focus/ARIA contract、全asset semantic化、menu metadata完全統合は段階作業とする。
- autosaveを「dirty + 最大5分 + 重要point即時save」に変更する場合は、長期saveでserialize/write時間を実測してから判断する。
