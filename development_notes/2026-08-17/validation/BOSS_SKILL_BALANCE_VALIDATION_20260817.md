# ボス／スキルID／描画経路 検証 2026-08-17

## 実施結果

- ルートJavaScript 63本: `node --check` 全PASS
- `SKILLS_DATA` ID重複: 0
- 正規スキル数: 192
- runtimeのID 700000以上: 0
- 100～199: 物理のみ
- 200～299: 魔法のみ
- 300～399: ブレスのみ
- 400～499: 回復・蘇生・MP回復・浄化／再生系のみ
- 500～599: 強化のみ
- 600～699: 弱体のみ
- 700～899: 特殊のみ
- フラッシュボム: 249へ移行済み
- 混沌の外套: 511へ移行済み。MP48 / 4ターン / 自己全能力強化＋属性耐性30として既存500帯と横比較済み
- 旧700101 / 700201～700205: runtime参照なし。migration表だけに残存

## グラド

- ID: 301063
- HP6500 < ジャスパー7810
- max(ATK,MAG)=185 < ジャスパー205
- HP6500 < 光の宮殿ヴェルド8100
- ATK185 < 光の宮殿ヴェルド218
- 光の宮殿ジャスパー＋ヴェルド: 合計HP15910 / 合計4行動 > グラドHP6500 / 2行動
- HP6500 < 回想ヴェルド24000
- max(ATK,MAG)=185 < 回想ヴェルド360
- 700000番台行動: 0
- 専用特性: 炎楔同化Lv1のみ
- 解決画像: `assets/monsters/monster_301063.png`
- `PRISMA_ASSETS.cacheWarmup.installImages` に同画像が登録されることを実行確認

## レクスノート邸地下

- B5 (12,3) が `B` タイルであることを確認
- boss monsterId 301033
- startEventId `rexnote_regulus_battle`
- storyEventId `rexnote_regulus_clear`
- 解決画像: `assets/monsters/monster_000406.png`
- グラフィックキー: `monster_301033`
- installImagesへ `monster_000406.png` が登録されることを実行確認

## セーブmigration実動ハーネス

旧データを模したオブジェクトに対し、`main.js` から実際のmigration関数本体を抽出して実行した。

- 716 → 249
- 700101 → 511
- 700201 → 104
- 700202 → 141
- 700203 → 216
- 700204 → 500
- 700205 → 213
- `skills`, `skillBookSkills`, `hiddenSkills`, `autoDisabledSkills`, 戦闘中enemy actsを移行
- 旧グラド戦闘snapshotは残HP/MP比率を保ったまま新最大値へ補正
- 旧グラドsnapshot imageId 301010 → 301063
- 旧レグルス戦闘snapshotも残HP/MP比率を保ったまま新バランスへ補正

結果: PASS

## 画像ファイルそのものについて

今回提供コード一式にはモンスター画像の全量が含まれていないため、301063画像そのもののPNGデコード検証は未実施。ファイル配置後に実画像ロードを行う必要がある。画像パス解決、グラフィック登録、全量キャッシュ対象化までのコード経路はPASS。
