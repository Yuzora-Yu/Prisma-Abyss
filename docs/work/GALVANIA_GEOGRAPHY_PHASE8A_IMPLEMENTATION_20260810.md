# ガルヴァニア地理再編 Phase8A 実装レポート

**Date:** 2026-08-10  
**Status:** implemented

## Approved input reflected

- ガルヴァニア渓谷: 旧ガルヴァニア洞窟の出入口座標を流用。
  - x:31,y:40
  - x:35,y:42
- 奈落への洞窟（旧ガルヴァニアへの洞窟）:
  - 入口側 x:38,y:55
  - 祭壇側 x:42,y:55
- ガルヴァニア帝国:
  - 旧魔王城のワールド座標 x:8,y:50 を置換。
  - 魔王城入口を帝国内へ移設。

## Runtime changes

### map.js

- `GALVANIA_GORGE / MAP000074` M0追加。
- `GALVANIA_EMPIRE / MAP000075` M0追加。
- `GALVANIA_CAVE / MAP000025` を奈落への洞窟へ改名・再接続・Rank再編。
- `DARK_CASTLE` のワールド座標を撤去。
- `ABYSS_FIELD / MAP000032` を統合の祭壇表示へ変更し `nadirCaveCleared` gateを追加。
- ガルヴァニア渓谷の結晶樹クリア前城壁を動的blocking objectで実装。
- ガルヴァニア帝国内ローカルx27,y3に魔王城正門を設置。

### story.js

- Step8目的をガルヴァニア渓谷経由へ更新。
- Step9目的を奈落への洞窟→統合の祭壇へ更新。
- 結晶樹治療後の雷の要塞西方の破壊音を追加。
- ガルヴァニア渓谷の破壊後初回イベントと倒れた魔族2名を追加。
- runtimeでは門の破壊者アランを伏せる。
- 魔王城クリア後の次目的を奈落への洞窟へ接続。
- 旧洞窟の補給/備蓄説明を、魔族の長期深淵防衛線の証拠へ再文脈化。

### main.js / dungeon.js

- 旧発見済み洞窟を新ガルヴァニア渓谷へsave migration。
- 旧魔王城発見をガルヴァニア帝国へ互換移行。
- すでに後半へ進んだsaveは `nadirCaveCleared` を補完。
- Sky Prismの順を Gorge → Empire → Nadir Caveへ更新し、Dark Castle直接warpを廃止。
- 統合の祭壇への直行を `nadirCaveCleared` 前は遮断。
- fixedDungeon actionから `entryKey` を引き継ぐよう修正。
- 奈落への洞窟の入口側/祭壇側ゲートを分離。

### phaser-field.js / news.js

- ガルヴァニア渓谷のfloor decoration fallbackを追加。
- 2026/08/10 NEWSへ地理再編を追記。

## Save compatibility

- 旧 `GALVANIA_CAVE` の north/south entry key はaliasとして保持。
- 旧洞窟発見を新奈落洞窟発見へ誤継承しない。
- storyStep>=10等の後半saveは新規中継ダンジョン追加で逆戻りしない。

## Validation

- `validate-galvania-geography-phase8a.js`: PASS.
- `validate-crystal-tree-route-phase7c.js`: PASS.
- `validate-crystal-tree-six-element-phase7d.js`: PASS.
- `validate-system-input-update-20260810.js`: PASS.
- `validate-main-story-routing.js`: PASS.
- `validate-news-data.js`: PASS.
- `validate-map-actors.js`: PASS.
- Full suite: 12/66 FAIL. Phase8A由来の新規FAILなし。
  - assets除外による既知10件。
  - stale legacy validator 2件。

## Next

Phase8Bでは新規地理をさらに増やす前に既存 `DARK_CASTLE` の内容監査を行う。
三幹部、城内NPC、ショップ、旧台詞、ゼノン戦、シャニー加入、闇プリズム、旧clear一括処理を新版正本へ合わせて段階的に再構成する。
