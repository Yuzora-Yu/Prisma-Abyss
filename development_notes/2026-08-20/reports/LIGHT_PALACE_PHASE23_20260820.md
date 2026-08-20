# PRISMA ABYSS — Light Palace Phase 23

Date: 2026-08-20  
Base: Phase 22 applied

## Scope

Phase 22で六芒星の9分割帯は正しい位置へ連続配置されるようになったが、実機スクリーンショットでは帯境界に細い横線が残っていた。
あわせて、床へ固定表示されるだけではなく、魔法陣が稼働しているような弱い発光感を追加する。

維持する仕様:

- MAP絶対座標: X17 / Y16
- 表示規模: 9タイル
- 9本の横sliceでY深度を分ける
- レイヤー: floor -> magic circle -> walls / characters / bosses

## Remaining seam cause

元画像は384x384、表示サイズは9タイル=288x288なので、本来の全体縮尺は縦横とも `0.75`。

Phase 22ではcrop境界を整数化していたため、9分割した帯の高さが42pxまたは43pxになり、それぞれを個別に32pxへ縮小していた。
その結果、帯ごとの縦scaleがわずかに異なる。

- 42px -> 32px: 約0.7619
- 43px -> 32px: 約0.7442

位置上のgapは0pxでも、連続画像のサンプリング位相が帯ごとに変わるため、境界が細い横線として見える。
Phaser Canvas rendererのroundPixelsも境界付近の丸め差を増やす要因になる。

## Seam fix

`phaser-field.js` の大型床エフェクト分割描画を次の方式へ変更した。

1. crop境界を `sourceHeight * i / sliceCount` の小数値のまま扱う。
2. 全sliceで `displayHeight / sourceHeight` の共通scaleを使う。
3. 内部境界は上下それぞれ0.5px表示分だけcropを広げ、隣接帯どうしを合計1px重ねる。
4. Phase 22のcrop中心origin補正は維持する。

384px -> 288pxの場合、全sliceのscaleは常に0.75になる。
元画像の座標対応を崩さず、帯境界だけをわずかに重ねるため、床が覗く線や丸め由来の線を隠せる。

## Ritual animation

六芒星のpersistent specを次へ調整した。

- base alpha: 0.72
- alpha pulse: +/- 0.08（約0.64～0.80）
- X drift: +/- 0.8px
- Y drift: +/- 0.55px
- cycle: 3000ms

拡大縮小や回転は行わない。
9本のsliceへ同一のX/Y変位を同時適用するため、アニメーション中もslice間の位置関係は変わらず、継ぎ目を再発させない。

alphaはゆっくり正弦波で明滅し、XYは別位相の正弦波で微動する。
床に薄く焼き付いた魔法陣が稼働・発光している印象を狙い、人物や壁より目立ちすぎない値に抑えた。

床演出を削除する際は無限Tweenも停止・解除する。

## Layer order

深度式は変更なし。

- floor: `row * 100`
- magic circle: `row * 100 + 46`
- wall: `row * 100 + 48`
- player: `row * 100 + 88`

したがって、床より上、壁・人物・ボスより下を維持する。

## Legacy Canvas

persistent specのalphaが0.72になったため、Phaser障害時のlegacy Canvasでも従来より薄く表示される。
連続アニメーションはPhaser描画時のみ実施する。legacy Canvasは常時再描画ループを持たないため、今回の範囲では無理にタイマー駆動へ変更しない。

## Cache update

App Shell cache generation:

`prisma-abyss-v96.20260820`

## Validation

Passed:

- top-level JavaScript syntax check
- Phase 23 validator
- 384x384 -> 288x288 共通scale = 0.75
- 隣接sliceの理論上の重なり = 1px
- alpha range = 0.64～0.80
- 全sliceへ同一XY driftを適用する実装確認
- Tween cleanup確認
- floor < magic circle < wall < player の全9行depth確認
- Service Worker cache generation v96

## Expected manual result

ルーナ拘束イベントの六芒星は、X17/Y16を中心に9x9タイル規模で表示される。
横方向の分割境界はほぼ見えなくなり、画像全体は従来より薄くなる。
さらに約3秒周期で穏やかに明滅し、1px未満～約1pxの範囲でごく小さく揺らぐため、床上で魔法が稼働している印象になる。

## File inventory

変更・作成したファイルは7件。

1. `phaser-field.js`
2. `story_logic.js`
3. `sw.js`
4. `news.js`
5. `development_notes/2026-08-20/validation/validate-light-palace-phase23.js`
6. `development_notes/2026-08-20/reports/LIGHT_PALACE_PHASE23_20260820.md`
7. `development_notes/2026-08-20/DELTA_MANIFEST_20260820_LIGHT_PALACE_PHASE23.txt`
