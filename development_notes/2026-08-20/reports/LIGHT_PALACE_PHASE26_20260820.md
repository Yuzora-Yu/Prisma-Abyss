# PRISMA ABYSS — Light Palace Phase 26

Date: 2026-08-20  
Base: Phase 25 applied

## Scope

光の宮殿回想3F、ルーナ拘束時の床魔法陣について、実機録画で以下を確認した。

- 回想全体のsepiaにより、ボス・キャラクター・魔法陣が近い茶灰色へ寄りすぎる
- Phase 25のalpha 0.74～0.80だけの変化は、発光ではなく僅かな濃淡変化に見える
- 床へ固定された術式という方針は良いため、X/Yの移動は引き続き行わない

## Flashback color separation

光の宮殿回想専用preset `light-palace-memory` を追加。

- previous generic sepia: `sepia(0.72) saturate(0.72) contrast(1.08) brightness(0.96)`
- Light Palace memory: `sepia(0.55) saturate(0.88) contrast(1.10) brightness(0.99)`

回想感は維持しつつsepia量を弱め、人物・ボス・床演出に残る元色と明度差を少し戻す。
他のsepia演出には影響させない。

Phase 26以前の途中セーブが `visualPreset='sepia'` を保持していても、
`lightPalaceFlashbackActive` が有効な間は新preset相当へ読み替えるため、更新直後の再開にも反映される。

## Magic circle rendering

本体と発光を分離する。

### Base layer

- asset: `assets/effect/fx_special_rupture.png`
- base alpha: 0.60
- alpha pulse: 0
- X drift: 0px
- Y drift: 0px
- fixed world position: X17 / Y16
- size: 9 tiles
- slices: 9
- depthOffset: 46
- seamBleed: 0.5px

本体は完全固定・一定濃度とし、輪郭が消えたり位置が揺れたりしない。

### Glow layer

各9 sliceに同一cropの発光Imageを追加し、本体の直上へ重ねる。

- blend: `Phaser.BlendModes.ADD`
- tint fill: `0xffe59a`
- glow alpha: 0.10 ～ 0.32
- cycle: 2200ms
- position: base layerと完全同期、移動なし
- depth: base row depth + 0.2

alpha本体を点滅させるのではなく、加算発光層の光量だけを呼吸させる。
sepia後でも明度差として残るため、キャラ・ボスとの差別化と「光っている」感を優先する。

Glow depthは既存 `depthOffset=46` に0.2だけ加えるため、床より上かつ壁(+48/+49)・人物・ボスより下の関係を維持する。

## Legacy Canvas fallback

Phaser停止時のlegacy Canvasでは常時animation loopを持たないため、完全な脈動は行わない。
代わりに同一cropを `globalCompositeOperation='lighter'` で中間光量として重ね、暗い紋様だけになることを避ける。

## Cache update

App Shell cache generation:

`prisma-abyss-v99.20260820`

## Validation

Passed:

- top-level JavaScript syntax check
- Phase 26 validator
- `special-rupture` asset登録確認
- base alpha 0.60 / pulseAlpha 0確認
- X/Y drift 0確認
- additive glow layer生成・破棄確認
- glow alpha 0.10～0.32確認
- glow tint `0xffe59a`確認
- glow cycle 2200ms確認
- floor < base/glow < wall/character/boss depth関係確認
- Light Palace専用memory filter確認
- Phase 26以前のsepia途中セーブ読み替え確認
- legacy Canvas additive fallback確認
- 2026/08/20 NEWS_DATAが1レコードのみであることを確認
- Service Worker cache generation v99確認

## File inventory

変更・作成したファイルは9件。

1. `phaser-field.js`
2. `story_logic.js`
3. `story.js`
4. `main.js`
5. `sw.js`
6. `news.js`
7. `development_notes/2026-08-20/validation/validate-light-palace-phase26.js`
8. `development_notes/2026-08-20/reports/LIGHT_PALACE_PHASE26_20260820.md`
9. `development_notes/2026-08-20/DELTA_MANIFEST_20260820_LIGHT_PALACE_PHASE26.txt`
