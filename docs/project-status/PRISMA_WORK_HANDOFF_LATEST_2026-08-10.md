# PRISMA ABYSS — 作業引き継ぎ書 最新版

**更新:** 2026-08-10  
**Phase:** 8C / 魔王城真相・第二次統合・シャニー加入実装完了  
**用途:** 次Chat/次作業開始時に最初に読む短縮版。詳細技術仕様は `canon/PRISMA_CODING_HANDOFF_v5.md`。

## 1. 最新基準

- 最新累積コード: `PRISMA_PHASE8C_DARK_CASTLE_TRUTH_SECOND_INTEGRATION_2026-08-10.zip`
- Phase8C承認稿: `docs/scenario/39_DARK_CASTLE_TRUTH_AND_SECOND_INTEGRATION_PHASE8C_DRAFT_20260810.md`
- Phase8C status: `docs/project-status/PHASE8C_DARK_CASTLE_TRUTH_SECOND_INTEGRATION_STATUS_v1.md`
- Coding Handoff: `canon/PRISMA_CODING_HANDOFF_v5.md`
- Scenario Canon: `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
- Character/Boss Encyclopedia: `canon/PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md`
- Developer Core Thoughts: `canon/PRISMA_DEVELOPER_CORE_THOUGHTS_v6.md`
- Phase8B資料: `docs/scenario/38_DARK_CASTLE_OFFICERS_AND_EMPIRE_SHOPS_PHASE8B_20260810.md`
- Phase8A地理資料: `docs/scenario/37_GALVANIA_GEOGRAPHY_PHASE8A_20260810.md`
- 結晶樹六属性稿: `docs/scenario/36_CRYSTAL_TREE_SIX_ELEMENT_RITUAL_DRAFT_20260810.md`

**注意:** 2026-08-10のシステム入力更新、Phase7D、Phase8A、Phase8Bを全て含む累積版から作業すること。古い展開元へ戻さない。

## 2. 現在の本編位置

魔王ゼノン戦後の真相会話、第二次統合発生、シャニー加入までruntime接続済み。

- Phase8C開始側: `storyStep=8 / subStep=0`
- 完了後: **`storyStep=9 / subStep=0`**
- 表示目的: 「奈落への洞窟を越え、統合の祭壇へ向かおう」
- `darkCastleCleared` 後にガルヴァニア帝国3店舗が営業開始し、奈落への洞窟入口側が解禁される。

## 3. 戻さない地理

- ガルヴァニア渓谷: 要塞側 **x:31,y:40** / 帝国側 **x:35,y:42**。
- ガルヴァニア帝国: ワールド **x:8,y:50**。魔王城入口は帝国内 local **x:27,y:3**。
- 奈落への洞窟: 入口側 **x:38,y:55** / 祭壇側 **x:42,y:55**。旧ガルヴァニア洞窟6階層を転用。
- 統合の祭壇は `nadirCaveCleared` 前に直行不可。
- 魔王城内部構造はM0現行を維持し、城下町／帝国M0は最終地理ではない。

## 4. Phase8B前提

- 三幹部は **全員男性**。
- ゼルドラス: 人間不信／聖女と闇プリズムを利用させない。
- エルメナス: 王国による闇プリズム強奪の結果を根拠に警戒。知略型。
- ベレト: 思想差より魔王への謁見資格を実力で測る。
- 帝国ショップ local: 雑貨 `x9,y11` / 武器 `x9,y21` / 防具 `x45,y21`。攻略前は取引不可、`darkCastleCleared` 後Rank65で営業。

## 5. Phase8Cで実装した人物／物語

### ルーナ

- 教団／ジャスパーから誤った魔族史を教えられ、近年は聖女として魔族討伐へ参加していた。本人は当時それを正義だと信じていた。
- ガルヴァニア帝国で魔族の子ども・負傷兵・避難民・長期防衛の生活を見てショックを受ける。
- 三幹部戦を通じ、知らなかったことを言い訳にせず、目を逸らさない姿勢へ進む。
- ゼノン戦後、**無傷の闇プリズムへ本人が直接触れる**。記憶喪失前の故郷の夜と、喪失後の教団教育／討伐記憶が接続し、頭痛・脱力を伴う。
- 記憶断片: 夜の葉音、湿った草、誰かの寝息、その誰かの手を握って安心していた感覚。相手の正体はまだ伏せる。
- 魔族討伐歴を謝罪するが許しを要求しない。「自分で見て、自分で選び、目の前の人を守るため戦う」へ正義を作り直す。
- 魔王城報酬: Story EXP +300,000 (`luna_dark_castle_300k`)、`lunaMemoryStage>=3`、必要EXP倍率最大1600%。

### アルス×ルーナ

- アルスは記憶を急かさない、昔の答えを長く語らない。
- 「無理に戻さなくていい」→ルーナが続けると選ぶ→「倒れたら支える」という短いやり取りを基準にする。
- 記憶があってもなくても今のルーナをルーナとして扱う。
- 昔と変わらない優しさ／頑固さ／仕草に気づいて静かに喜ぶ。感情が溢れる場合は、本人へ圧をかけるより見えないところで涙する。
- 恋愛は記憶復元ではなく現在の旅で再構築。

### 魔王城の真相

- 玉座裏の闇プリズムは無傷。
- 暗魔帝国エクリプス滅亡戦で、人間／魔族の死者や闇魔力を研究材料にされ、闇の統合研究は6年前時点で必要分が完成済み。現在の闇プリズムを再奪取する必要はなかった。
- リーシア／ソフィア／ミネルバ／ゼノンの知見を重ねる。ケイトが5年前の術式には循環順がなく、六属性を同時に止めていることへ気づく。
- 「調和（異なるまま巡る）」と「強制統合（一つに潰す）」を分離。深淵の全真相まではまだ明かさない。
- 第二次統合が地下側から開始。
- シャニーはゼノンの命令ではなく、自分で奈落へ行くことを選び加入。シャオとの完全和解はまだしない。

## 6. 帝国／城の環境story

- 帝国初回攻略時にルーナのショック会話。
- 帝国M0: 負傷兵 `x16,y11` / 配給係 `x38,y11` / 避難親子 `x16,y31` / 工兵 `x38,y31`。
- 魔王城1F: 地下巡回を優先する兵、裂け目へ向いた防衛設備、何年も反復した補修痕。
- ゼノンの説明より先に「魔族が深淵を防いでいる」証拠をMAPで見せる。

## 7. commit／save互換

新 `dark_castle_clear` 順序:

1. 長会話
2. シャニー加入
3. ルーナ +300,000 Story EXP（once key）
4. `lunaMemoryStage = max(current,3)`
5. EXP倍率 `min(current,1600%)`
6. `prismBlessingsComplete`
7. `secondIntegrationStarted`
8. `darkCastleTruthPhase8CSeen`
9. **`darkCastleCleared`**
10. Step9/Sub0

`story_logic.js` に `WORLD_STATE mode:max` と `SET_EXP_MULTIPLIER onlyDecrease:true` を追加。

旧 `darkCastleCleared=true` / `darkCastleTruthPhase8CSeen=false` saveは、魔王城3F旧ゼノン位置 `x16,y7` から新会話を回収可能。二重EXP・Memory Stage低下・EXP倍率上昇・storyStep巻き戻しを行わない。

## 8. プレイヤーへまだ明かさないこと

- ガルヴァニア渓谷の門を壊したのは **アラン**。
- アランは光の力制御を完成させ、ヴェルド／ジャスパーらと統合の祭壇へ先行中。
- Phase8Cでも正体を伏せる。光属性の破壊痕と断定させない。
- ルーナが夜に手を握っていた「誰か」の正体。
- 深淵／混沌／第二次統合の全真相。

## 9. 次にやること

次は **Phase8D / 奈落への洞窟～統合の祭壇前半の監査・再構成**を優先。

- 現 `GALVANIA_CAVE` 6階層を奈落防衛線としてさらに磨く。敵・イベント・NPC／記録・深淵侵食演出を監査。
- 魔王城から祭壇への連戦感を避け、魔族が長年浸食を抑えてきたことをプレイで確認させる。
- 統合の祭壇の既存レイアウトは原則変更しない。
- アラン／ヴェルド／ジャスパーの先行痕跡は、正体を早く断定させない範囲で段階的に置く。
- 統合の祭壇でのアラン再戦・救済／死亡分岐は既存canonの上申書条件と整合させる。
- 長い新規台詞は引き続きMarkdown承認→実装。

## 10. 検証

- `node --check story.js story_logic.js map.js news.js`
- `node tools/validation/validate-dark-castle-phase8c.js`
- `node tools/validation/validate-dark-castle-phase8b.js`
- `node tools/validation/validate-galvania-geography-phase8a.js`
- `node tools/validation/validate-crystal-tree-six-element-phase7d.js`
- `node tools/validation/validate-system-input-update-20260810.js`
- `node tools/validation/validate-news-data.js`
- `node tools/validation/validate-map-actors.js`
- 最終: `node tools/validation/run-all.js`

assets除外由来の既知FAILと、旧前提validatorは別扱い。Phase8C validatorおよび回帰対象に新規FAILを出さない。


## Final validation result

- Phase8C targeted validator: PASS.
- Phase8B / Phase8A / Phase7D / system-input / NEWS / mapActors regression: PASS.
- `run-all.js`: **12/68 FAIL**. Failure set is unchanged from Phase8B: 10 assets-excluded validation failures + 2 stale legacy validators requiring old `PROLOGUE_HILL` / removed story-monster-variant API. No new Phase8C-specific failure.
