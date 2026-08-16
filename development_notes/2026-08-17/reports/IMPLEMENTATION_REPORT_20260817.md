# 実装修正報告 — 2026-08-17

## ユーザー指定を最優先した修正

### 水上都市の復旧噴水

- `(19,13)` → `(16,12)`（左3、上1）
- 専用泉画像のoverlayを外し、通常mapActionの共通 `overlay_event_blue_glimmer` を使用
- fountain効果・1日1回等のゲーム内容は維持

## 監査項目別

### 1. ワールドmap端loop

**変更なし。正式仕様として維持。** `docs/development-policy.md` に、DQ等の古典RPGと同様の両軸loop設計でありclamp/blockしないことを追記。深淵の船/飛行可否とworld loopを混同しないことも明文化。

### 2 / 3. 保存失敗rollback

- JSON cloneの単純上書きをやめ、既存object参照をpath/identity/親containerで対応付けて復元
- 同じ `id` が別containerに存在する場合の誤参照を防止
- Gold/GEM tracking descriptorを維持
- rollback時は獲得累計trackingを停止
- atomic mutator内のsave要求を保留し、最終save 1回へ集約

### 4. 重要な資産/状態変更

保存成功前に成功扱いしないようatomic化。主な対象:

- Sky Prism移動
- guild受付転送
- Water City fountain
- 宿屋、転送料金
- コイン累計報酬、メダル交換、カジノ景品
- 店の道具/装備売買
- 所持装備の単体/一括売却
- 錬金
- guild依頼報告 / GP交換
- skill book / trait book / 各種消費item
- trait reroll
- casino wager / payout
- 仲間monster合成

ゲーム内価格、確率、報酬量等は変更していない。

### 5. 画像cache世代

- runtime cache名をasset manifest由来へ統一
- 固定file名画像を旧runtime世代から拾わないよう、image cache-firstは現世代だけを見る
- install/activate世代を更新
- semantic UI icon registryもwarmup対象に追加

### 7. autosave

**今回は1歩ごとのsaveを維持。** 5分interval方式は実装せず、`AUTOSAVE_POLICY_REVIEW_20260817.md` に候補を整理。

変更する場合の推奨は:

- 通常歩行: dirtyのみ
- 最大5分でflush
- area移動 / boss終了 / event終了 / critical trade/reward / dungeon開始終了: 即時save
- hidden/pagehide: 強制flush
- save失敗時: dirty維持

ただし通常歩行位置が最大数分戻るtrade-offがあるため、先に実測する。

### 8. safe spawn

`resolveSafeLocalSpawn` を追加。壁、水、blocking object/action、未処理の特殊tile等を避け、必要ならBFSで近傍の安全cellへ移す。

固定map入場、固定dungeon階移動/復元、起動load、Sky Prism、guild受付転送へ適用。world座標loopには適用していない。

### 9. 初期武器

`eid 1..6` を引くまで回す無限loopを廃止し、対象poolから1回選択して+3生成。対象poolが成立しない場合は開始失敗を明示。

### 10. プレイヤー向け内部表現

map key / item ID / equip ID等を通常player errorへ漏らさず、playerには意味の通る一般message、技術情報はconsoleへ分離。

### 11. UI文言台帳

master tableを実数へ再集計:

- 1840 total
- story system 179
- story objective 58
- other UI/map/menu 1603
- inventory_only 1627 / reviewed-or-new 213

共通表記/操作語彙の承認済み判断も追記。

### 12. storyStep-subStep表示

**runtime変更なし。正式方針として維持。** `docs/development-policy.md` に、例 `12-3` をdebug漏出ではなくプレイヤー向け進行度表示として承認する旨を明記。

### 13. 集計可能数値

画面分類は変更せず、`STATUS_NUMERIC_AGGREGATE_INVENTORY_20260817.md` へ数値候補を先に列挙。累計/最大/現在値/派生率と信頼性を分離。

`stats.totalSteps` は加算実装未確認のため「未完成」として表示候補から外した。

### 14 / 15. 表記・操作語彙

開発方針を次で統一:

- 通貨: `Gold / GEM`
- 数値rank: `Rank 70`
- 数値level: `Lv.70`
- navigation back: `もどる`
- modal/info dismiss: `閉じる`
- 未確定操作取消: `キャンセル`
- 開始済み挑戦等の中断: `やめる`

固有名詞や自然文中の「戻る」は機械置換しない。

### 17. Guild挑戦失敗時

挑戦開始に成功してから戦歴画面を閉じる順序へ変更。開始失敗時は元画面を維持。

### 18. 日付key

locale formatter依存を避け、local timezoneから `YYYY-MM-DD` を作る共通helperへ統一。Water City fountain / daily / guild等で利用。

### 20. 起動migration

職業/character補正の重複処理を1batchへまとめ、実際に変更があった場合だけ最後にsave。

## 22〜25: 長期UI基盤の第一段階

### 22 CSS/UI primitive

- control/spacing/radius tokenを既存値と同値で追加
- 基礎 `.btn` / `.menu-btn` のみtoken参照へ移行
- 大規模override削除はまだ行わない

### 23 Accessibility

- browser zoom禁止viewportを撤去
- modal ARIA / focus trap / restore focusは次段階

### 24 Semantic asset registry

- `PRISMA_ASSETS.uiIcons` を追加
- item/skill iconはsemantic keyから解決
- 未移行assetだけ旧規則へfallback
- `assets/gacha/front_card.png` / `back_card.png` の参照は維持

### 25 Menu registry

- route IDをrenameせず `Menu.subScreenRegistry` adapterを追加
- DOM準備/init/feature metadataをregistry経由へ移行
- 旧 `subScreenFeatureMap` は互換用に維持

## 28. Phaserとlegacy Canvas

legacy Canvasは今回削除していない。

Phaserが `Phaser.CANVAS` backendを使っていても、これは「Phaser framework上のCanvas renderer」。直接 `Field.render()` するlegacy 2D Canvasとは故障点が同一ではない。共有map dataや画像自体が壊れれば両方失敗し得る一方、Phaser script/init、Game/Scene lifecycle、wake/resize/sync、Phaser texture/object管理だけが失敗した場合はlegacy direct Canvasが動ける余地がある。

したがって、現時点でfallbackを消す合理性はまだ不足。削除条件を開発方針へ追記し、Phaser固有failure-path testと代替のfatal-render diagnostics/recovery UXを用意してから削除判断する。

## 意図的に触っていない項目

- 6 browser広告test
- 16 Sky Prismボタンの説明量
- 21 objective marquee方式
- 26 お知らせbadge設計
- gacha player unlock方針

