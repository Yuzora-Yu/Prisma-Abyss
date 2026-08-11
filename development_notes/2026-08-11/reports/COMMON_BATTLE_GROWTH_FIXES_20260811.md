# PRISMA ABYSS — 共通戦闘・成長修正 2026-08-11

## 対象

今回の品質単位は、追加指示のうち独立して仕上げられる以下4項目に限定した。

- ⑦ レアモンスター遭遇時のAUTO自動解除
- ⑨ レアモンスター基礎遭遇率 2% → 3%
- ⑪ 序章ルーナ(403)が自力で上げたLBを本編ルーナ(401)へ引き継ぐ
- ⑫ 二刀流特性ON時、武器2が空でも二回発動

④暫定回復の泉、⑥名もなき村北ハンター、⑩ランダムダンジョン400/500歩ハンターは次の実装単位へ回す。

## ⑦ レア遭遇時AUTO解除

`battle.js` の敵生成・戦闘復帰後、入力開始前に実敵配列を確認する。

- `enemy.isRare === true` が1体でもいれば、その戦闘開始時の `Battle.auto` を `false` にする。
- プレイヤーの恒久設定 `battleAutoStart` は変更しない。
- `forceAutoOff` と違いAUTOボタン自体はロックしないため、確認後にプレイヤーが手動でAUTOへ戻すことは可能。
- 通常敵だけの戦闘では従来のAUTO開始設定を維持する。

## ⑨ レア遭遇率3%

`monsters.js` の共通基礎値を `0.02` から `0.03` へ変更した。

- Rank帯にレア候補が存在しない場合は従来どおり0%。
- `rareEncounterRateMultiplier` は従来どおり基礎3%へ乗算する。
- 名もなき村北の `rareEncounterAll:true / rareEncounterRateMultiplier:1.0` はそのままなので、候補全体から基礎3%で抽選される。
- 既存validator `validate-monster-habitat-master.js` の2%固定前提を3%へ更新した。

## ⑪ ルーナLB引継ぎ

`characters.js` に既存の `403.adultCharacterId = 401` を正本として利用する。

単純な現在LBコピーは行わない。序章には `TEMP_LB_START` の一時LB99、および隠し分岐の明示LB99が存在するため、それらまで成人ルーナへ持ち込むと仕様違反になる。

実装では次を保証する。

1. 403の通常育成LBを `progress.storyCharacterLimitBreakCarryover[401]` に保存する。
2. TEMP_LB99中は `tempStoryPower.targets[].limitBreak` の元値を参照する。
3. `lbProgress.sources.story` は物語付与分として引継ぎ計算から除外する。
4. 本編ルーナ401が `addStoryAlly()` で初加入した時点で、保存した値だけを一度加算する。
5. 適用済み記録を持たせ、再加入・再実行で二重加算しない。
6. 通常ルートの `RESET_TEMP_ALLY` と隠しルートの `PROMOTE_TEMP_ALLY` の双方で、403消去／昇格前に最終安全スナップショットを取る。

これにより、本人が序章の通常戦闘等で実際に伸ばしたLBだけを5年後へ残し、神力LB99や隠し分岐の物語付与LB99は除外する。

## ⑫ 二刀流

`Battle.isDualWieldActive()` の責務を「二刀流の戦闘効果が有効か」に戻した。

- 特性8の有効Lvが1以上なら二刀流戦闘効果ON。
- 武器2装備の有無は要求しない。
- したがって武器2が空でも追撃ループが2回になり、既存の二刀流MP補正も適用される。
- 武器2を装備できるか、盾を装備できるかという装備画面側の制約は変更していない。

## NEWS

2026/08/11 の既存1レコードへ、上記4項目を追記した。同日レコードは増やしていない。

## Validation

### Targeted

以下すべてPASS。

- JS syntax: `battle.js`, `monsters.js`, `main.js`, `story_logic.js`, `news.js`, 新規validator、更新validator
- `validate-common-battle-growth-fixes-20260811.js`
- `validate-news-data.js`
- `validate-prologue-quality-audit-20260810.js`
- `validate-playable-prologue-phase2b.js`
- `validate-playable-prologue-phase2c.js`
- `validate-luna403-thunder-state-phase5d.js`
- `validate-monster-habitat-master.js`

### run-all baseline comparison

- baseline（①〜③完成状態）: 19 / 73 FAIL
- current: 19 / 74 FAIL
- 失敗validator集合は完全一致。
- 今回新規FAIL: 0

詳細ログ:

- `development_notes/2026-08-11/validation/TARGETED_COMMON_BATTLE_GROWTH_20260811.log`
- `development_notes/2026-08-11/validation/RUN_ALL_COMMON_BATTLE_GROWTH_20260811.log`
- `development_notes/2026-08-11/validation/BASELINE_COMPARISON_COMMON_BATTLE_GROWTH_20260811.log`
