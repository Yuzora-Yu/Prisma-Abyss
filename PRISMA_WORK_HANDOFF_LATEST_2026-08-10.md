# PRISMA ABYSS — 作業引き継ぎ書 最新版

**更新:** 2026-08-10  
**Phase:** 7D / 結晶樹・六属性秘薬実装完了  
**用途:** 次Chat/次作業開始時に最初に読む短縮版。詳細技術仕様は `canon/PRISMA_CODING_HANDOFF_v5.md`。

## 1. 最新基準

- 最新累積コード: `PRISMA_PHASE7D_CRYSTAL_TREE_SIX_ELEMENT_2026-08-10.zip`
- Coding Handoff: `canon/PRISMA_CODING_HANDOFF_v5.md`
- Scenario Canon: `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
- 承認済み会話稿: `docs/scenario/36_CRYSTAL_TREE_SIX_ELEMENT_RITUAL_DRAFT_20260810.md`
- Phase7D status: `docs/project-status/PHASE7D_CRYSTAL_TREE_SIX_ELEMENT_RITUAL_STATUS_v1.md`
- Character/Boss Encyclopedia: `canon/PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md`
- Developer Core Thoughts: `canon/PRISMA_DEVELOPER_CORE_THOUGHTS_v6.md`

**注意:** 2026-08-10のシステム入力更新（村エンカウント/エスケープ、山小屋座標、Rankドロップ、アナログ入力、タップ移動）を含む累積版から作業すること。古い展開元へ戻さない。

## 2. 現在の本編位置

結晶樹の六属性秘薬イベントまでruntime接続済み。

- 長会話開始: `storyStep=7 / subStep=11`
- 完了後: **`storyStep=8 / subStep=0`**
- 表示目的: 「魔王城へ向かい、闇のプリズムの真実を確かめよう」

## 3. Phase 7D で実装したもの

1. 魔王軍戦②直後を「完治」から**応急安定化**へ変更。
2. 承認済み長会話 `CRYSTAL_TREE_SIX_ELEMENT_RITUAL` を追加。
3. 六台座を `水→風→光→火→雷→闇` の順で起動し、最後の闇で秘薬を完成。
4. ミネルバはいたずらっぽい探究者として、症状・観測から仮説を組み立てる。設定講義にはしない。
5. 人体小循環の内部正本を追加。
   - 水=血液/体液
   - 風=呼吸
   - 光=覚醒/生命リズム
   - 火=代謝/体温
   - 雷=神経信号
   - 闇=睡眠/回復
6. ジャスパーの呪縛を、プリズム統合技術を個人へ悪用した**不完全統合固定**として正本化。
7. レオンを先に治療し、その後ルーナを治療。
8. ルーナは故郷を、暖かな光・木漏れ日・水音・風・白い祈り布・匂いとして一部思い出す。理屈は思い出さない。
9. 正常な闇に支配/操作/洗脳の本質がないことを観測結果として提示。
10. 魔王軍を即味方とせず、闇プリズムを自分の目で確かめるため魔王城へ向かう。
11. 治療完了後に以下をcommit。
    - `leonCrystalTreeTreated`
    - `lunaCrystalTreeStabilized`
    - `lunaMemoryStage=2`
    - ルーナ Story EXP +300,000 / reward key `luna_crystal_tree_300k`
    - EXP倍率 1800%
    - `crystalTreeState=5`
    - `crystalTreeSixElementRitualSeen`
    - `crystalTreeCleared`
    - Step8/Sub0
12. Phase7C既存saveは長会話既読flagを独立させ、報酬二重取得なしで会話を見られる。
13. レイラ治療専用flag `leilaCrystalTreeLeafTreated` を追加。旧 `leilaJoined` saveはロード時に互換昇格。
14. 新規進行ではソフィアが結晶樹ルートを開く前にレイラ葉治療済みを要求。
15. MAP000073へ既存の六属性pedestal画像をM0仮配置。最終地理ではない。
16. 冒頭の故郷へ、光神の祠・白い祈り布・水路・炊事の匂いを一度だけ追加。
17. `CRYSTAL_TREE_ROOT_RITUAL` のシャオ誤ID `301` を `105` へ修正。

## 4. 次にやること

最優先は**魔王城／ガルヴァニア再編の実装前監査**。

いきなり既存MAPを作り替えない。まず以下を一覧化する。

- 現在のガルヴァニアへの洞窟のワールド位置、入口条件、敵Rank、出口。
- 新規「ガルヴァニア渓谷」へ置換する地理と進行条件。
- 結晶樹クリア後、雷の要塞西方から破壊音を鳴らす導線。
- 破壊された魔王軍城壁/門、倒れた魔族2系統の台詞。
- 破壊者アランの痕跡を、プレイヤーへ正体を明かさず整合させる方法。
- 既存ガルヴァニア洞窟を魔王城後→統合の祭壇の道中へ再利用する場合の接続。
- 魔王城既存フロア/鍵/中ボス/ゼノン戦のうち、そのまま使える部分。
- 城下町、避難民、負傷魔族、深淵側を向く防衛設備を追加できる箇所。
- ゼルドラス/エルメナス=人間不信、ベレト=実力試験という戦闘理由の差別化。
- 玉座裏の闇プリズムをゼノン戦直後に目視確認する演出。
- 旧 `dark_castle_clear` の一括進行を新版へ段階化する必要箇所。

## 5. 新しいガルヴァニア正本

- 現在の「ガルヴァニアへの洞窟」の場所は将来「ガルヴァニア渓谷」新規MAP予定。
- 結晶樹/レオン治療前は魔王軍の門と城壁で進行不能。
- 治療後に何者かが門・城壁を破壊する。
- 実際の破壊者は光の力を制御したアラン。ヴェルド、ジャスパーらと統合の祭壇へ向かうが、ここでは伏せる。
- 倒れた魔族の一人は人間への憎悪、もう一人は世界への危機感を残して死亡。
- 既存洞窟MAPは削除せず、魔王城後の統合の祭壇への道中ダンジョンへ再利用候補。
- 魔王城構造は原則維持可能。会話、城下町、防衛描写を増やす。
- 闇プリズムは魔王の台座の裏。ゼノン戦後すぐ無事を確認可能。

## 6. 絶対に戻さない品質基準

- 長い新規会話はユーザー承認稿を正本にする。
- プレイヤー向け文章へ内部state/制作都合を出さない。
- 「見れば分かる」情報をナレーションで重ねすぎない。
- 隠し設定はキャラへ説明台詞として悟らせない。
- M0を最終地理とみなさない。
- 既存saveの報酬二重取得・進行不能を作らない。
- assetsなし配布物のvalidator失敗へ合わせて製品参照を削除しない。

## 7. 検証

工程ゲート:

- `node --check story.js main.js map.js news.js`
- `node tools/validation/validate-crystal-tree-route-phase7c.js`
- `node tools/validation/validate-crystal-tree-six-element-phase7d.js`
- `node tools/validation/validate-news-data.js`
- `node tools/validation/validate-system-input-update-20260810.js`
- 最終: `node tools/validation/run-all.js`

最終実行結果は同梱validation logを参照すること。
