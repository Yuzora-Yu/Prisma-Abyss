# PRISMA ABYSS 手動監査フォローアップ — 2026-08-12

## 目的

ユーザー指示で確認された「現在の意図と合わない実装」を、既存validatorの合否ではなくruntimeコードの意味を追って再点検した。

## 監査ループ

### Loop 1: player-facing / UI

確認対象:

- チュートリアルの公開条件
- 限界突破画面
- ステータス画面
- player-facing error
- 未解放案内
- クエスト目的文
- 魔道通信名称
- NEWS

結果:

- 指定内容へ整理済み。
- サンプルチュートリアルは発火前に公開されない。
- 内部実装語を直接見せる主要箇所をgeneric messageへ変更。
- クエスト目的文から解放条件の「○○加入後」表現も外し、行動目標だけを残した。

### Loop 2: progression / cross-reference

確認対象:

- 結晶樹clear後表示
- fire_water_attunement / Item306
- legacy recruitment
- 現行加入event
- 残存ID / flag / event参照

結果:

- 結晶樹clear後非表示条件を削除。
- fire_water_attunement / Item306関連runtime参照は除去。
- ゼリード / ルーナ旧加入を削除し、現行本編加入を確認。
- ソフィアは現行加入を確認できないため旧routeを保持。
- ハヤテは現行長編加入はあるがmain-story加入ではないため、disabled legacy routeを保持。

### Loop 3: field lifetime / performance

確認対象:

- Phaser texture residency
- inactive field scene
- ResizeObserver / Tween lifetime
- Water City animated water
- Thunder Fort electric decoration
- North Village hunter spawn calculation

結果:

- browser Image / Cache StorageとPhaser texture residencyを分離。
- Phaser textureはMAP単位で遅延登録・解放。
- hidden field rendererをsleep。
- Water City wave GameObject数を削減。
- Thunder Fortの永続Tween数を削減。
- hunter spawn候補の最短路計算を1回のBFSへ置換。

## 保留

- ソフィアの正式加入導線が確定したら `sophia_alan_seabed_depths` を削除候補とする。
- ハヤテをmain story加入へ変更する場合、`hayate_water_city` legacy routeを削除候補とする。
- 今回仕様と衝突する旧validatorはmaintained tool更新候補。
- 実機長時間プレイでWater City / Thunder Fortの体感を再確認し、なお重ければ第二段階として水面image自体のbatch化または装飾密度調整を検討する。

## 補助回帰確認

- 最新基準: 52 PASS / 22 FAIL / 74 validators。
- 今回仕様反映後: 42 PASS / 32 FAIL / 74 validators。
- 増加10件は旧ソフィア座標、削除済み旧ゼリード加入route、圧縮前NEWS文言を固定期待するもの。
- 手動要件チェック PASS。
- 変更JS 22/22 `node --check` PASS。
- `validate-news-data.js` PASS。
- ハンターBFSは100ランダムMAP・4000地点で旧最短経路距離と一致。
