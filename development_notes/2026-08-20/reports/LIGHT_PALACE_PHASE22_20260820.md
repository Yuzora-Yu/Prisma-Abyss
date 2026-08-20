# PRISMA ABYSS — Light Palace Phase 22

Date: 2026-08-20  
Base: Phase 21 applied

## Scope

Phase 21で六芒星画像のロード経路は復旧し、実機でも画像自体が表示されることを確認できた。
一方、9タイル表示時に画像が横帯へ分断され、帯と帯の間に床が露出する問題が残った。

要求仕様は変更しない。

- MAP絶対座標: X17 / Y16
- 表示規模: 9タイル
- 9本の横sliceでY深度を分ける
- レイヤー: floor -> magic circle -> walls / characters / bosses

## Cause confirmed from bundled Phaser renderer

`phaser-field.js` は大型床エフェクトを9本の横帯へ分けるため、各 `Phaser.Image` に対して `setCrop(0, cropY, sourceWidth, cropHeight)` を使っている。

Phase 20では crop 後の縮尺を `cropHeight` 基準へ直したが、Phaserのcropにはもう1つ重要な挙動がある。

同梱 `vendor/phaser/phaser.min.js` の Image renderer は cropped object の描画Yを概ね次の形で作る。

`localY = -displayOriginY + cropY`

つまり `originY = 0.5` のままでは、元画像384px内の `cropY` が各帯のローカル位置として残る。

一方、ゲーム側でも各帯を `py` で1タイルずつ下へ配置している。
その結果、

1. world側のslice位置で約32pxずつ移動
2. Phaser crop内の元画像位置でも約32pxずつ移動

が二重に加算され、実質的に「32pxの描画帯 + 約32pxの空白」が並ぶ。
ユーザー提供スクリーンショットの分断状態と一致する。

## Fix

各crop帯について、元画像内の帯中央を計算する。

`cropCenterY = cropY + cropHeight / 2`

そしてImageのY原点を、その帯中央へ設定する。

`image.setOrigin(0.5, cropCenterY / sourceHeight)`

これにより Phaser renderer 内では、cropped quad の中心が常に GameObject の `py` と一致する。

- crop由来の余分なYオフセット: 0
- world側のslice中心間隔: 32px
- 各slice表示高: 32px
- slice間gap: 0px
- 9slice合計表示高: 288px = 9タイル

Phase 20の `cropHeight` 基準scale修正はそのまま維持する。

## Layer order

深度式は変更していない。

- floor: `row * 100`
- magic circle: `row * 100 + 46`
- wall: `row * 100 + 48`
- player: `row * 100 + 88`

したがって、引き続き床より上、壁・キャラ・ボスより下となる。

legacy Canvas側はタイルごとに `drawImage()` のsource矩形を直接割り当てており、Phaserのcropローカル座標問題を持たないため変更していない。

## Cache update

App Shell cache generationを次へ更新した。

`prisma-abyss-v95.20260820`

これにより旧 `phaser-field.js` がService Workerから残留することを防ぐ。

## Validation

Passed:

- top-level JavaScript syntax check
- Phase 22 validator
- 384x384 / 9slice のPhaser crop geometry再現
  - 修正前gap平均: 約32px
  - 修正後gap: 0px
  - 修正後全高: 288px
- X17/Y16, size 9, slices 9 のpersistent spec維持
- floor < magic circle < wall < player の全9行depth確認
- Service Worker cache generation v95

## Expected manual result

ルーナ拘束イベント開始時、`fx_ultimate_244_genesis_magic.png` がX17/Y16を中心に約9x9タイルで1枚絵として連続表示される。
横帯の間に床が見える分断はなくなり、壁・人物・ボスは従来どおり魔法陣より前面に描画される。

## File inventory

変更・作成したファイルは下記の6件。

1. `phaser-field.js`
2. `sw.js`
3. `news.js`
4. `development_notes/2026-08-20/validation/validate-light-palace-phase22.js`
5. `development_notes/2026-08-20/reports/LIGHT_PALACE_PHASE22_20260820.md`
6. `development_notes/2026-08-20/DELTA_MANIFEST_20260820_LIGHT_PALACE_PHASE22.txt`
