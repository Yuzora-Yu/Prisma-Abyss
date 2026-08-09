# 35. 結晶樹の秘跡 M0ルート — Phase 7C

**作成日:** 2026-08-10  
**基準:** Scenario Canon v8 / Phase7B Foundation / Player Information Boundary

## 目的

結晶樹の地理・最終フロア数を早期固定せず、現在本編の `7-6` から「ミネルバの長会話レビュー直前」までを実際に遊べる一本の導線として接続する。

## 今回のM0実装

### 水上都市からの入口

- ソフィアの本編会話後だけ、水上都市北側の古い水門が使用可能になる。
- 水上都市→結晶樹は別MAP移動なので、アクションボタン式。
- ワールドMAPへ新規座標は打たない。結晶樹の世界地理をM0都合で固定しない。
- 北水門の座標はM0配置。最終都市図面で移設可能。

### 結晶樹MAP

- `MAP000073` / `CRYSTAL_TREE`。
- 現段階は1枚の固定MAP。これは「結晶樹は1フロア」という正本ではない。
- 後で図面が決まった場合、外縁・根路・根源域などへ分割可能なようstory stateをMAP階数から独立させる。
- ランダムエンカウントは未設定。敵生態を勝手に作らない。
- 現在の `WATER_CITY` theme / `battle_bg_forest` はasset完成までのfallback。

### ミネルバ接触

- ミネルバ(ID206)を実際のフィールドNPCとして配置。
- 初対面で六属性理論を長く説明しない。
- まずルーナの状態を見る人物として登場させる。
- ルーナ(ID401)はここで正式加入。
- `initialLevel:1` を指定するが、既存の回想carryoverがある場合は `App.addStoryAlly()` の共通仕様により回想到達Lvが最低保証される。
- EXP要求倍率は正式加入時に2000%。

### 根元／魔王軍直接戦闘②

- 根元で治療を始める直前に魔王軍が侵入。
- M0敵編成は既存の魔族データを再利用:
  - 魔人兵士(ID652)
  - 魔人兵長(ID755)
  - 魔人兵士(ID652)
- 新規幹部名・新規設定は作らない。
- AUTO禁止にはしない。負けイベントにもしていない。
- 仲間勧誘とギルド討伐進捗だけは対象外にする。
- 「魔王軍＝単純な黒幕」という認識へ亀裂を入れる短い台詞だけ入れる。答えは説明しきらない。

### クリア処理

防衛戦勝利後:

- `crystalTreeDefenseCleared`
- `lunaCrystalTreeStabilized`
- `leonCrystalTreeTreated`
- `crystalTreeCleared`
- `crystalTreeState = 5`
- `lunaMemoryStage = 2`
- ルーナ +300,000 Story EXP（一度のみ）
- EXP要求倍率を1800%へ絶対値設定

## 現在の本編終端

`storyStep 7 / subStep 11`

目的:

> 根元に残ったミネルバと話そう

ここから先の、

- 六属性の本来の役割
- 正常な闇属性に支配の力がないこと
- 魔王軍への認識変化
- 魔王城へ「真実を確かめに行く」動機

を扱う長会話は、ユーザー確認を通した後で実装する。

## 正本化しないもの

今回のM0実装だけを根拠に、以下を固定設定としない。

- 結晶樹が1フロアであること
- 北水門が最終版唯一の入口であること
- MAP000073の地形形状
- 通常エンカウントが存在しないこと
- 魔人兵長が結晶樹侵攻部隊の正式幹部であること
- 現在の背景asset

## 検証方針

- 水上都市でソフィア会話前は入口非表示。
- 会話後のみ入口出現。
- 結晶樹入口→ミネルバ→根元→帰還地点がすべて歩行可能。
- ルーナ報酬はrewardKeyで二重取得不可。
- クリアしてもStep8へ自動進行しない。

## 9. Phase7C確定時の検証

- `validate-crystal-tree-route-phase7c.js`: PASS
- `validate-crystal-tree-foundation-phase7b.js`: PASS
- `validate-thunder-fort-defense-phase7a.js`: PASS
- `validate-main-story-routing.js`: PASS
- `validate-save-safety.js`: PASS
- `run-all.js`: 10 / 54 FAIL。10件は既知の画像asset欠落のみ。

再実行安全性として、ルーナ正式加入は `crystalTreeMinervaMet` より先、Story EXP/1800%設定は `crystalTreeCleared` より先に確定する。
