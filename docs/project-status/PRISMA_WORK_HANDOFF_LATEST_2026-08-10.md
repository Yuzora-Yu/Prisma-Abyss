# PRISMA ABYSS — 作業引き継ぎ書 最新版

**更新:** 2026-08-10  
**Phase:** 8E preparation / Phase8C・8D監査完了、不可逆分岐基盤実装、専用シナリオ稿ユーザー承認待ち  
**用途:** 次Chat/次作業開始時に最初に読む短縮版。詳細技術仕様は `canon/PRISMA_CODING_HANDOFF_v5.md`。

## 1. 最新基準

- 最新累積コード（次回梱包予定）: `PRISMA_PHASE8E_PREPARATION_2026-08-10.zip`
- Phase8C/8D audit: `docs/project-status/PHASE8C_PHASE8D_AUDIT_20260810.md`
- Phase8E draft: `docs/scenario/41_ALAN_AREL_KAGETORA_APPEAL_AND_ALTAR_PHASE8E_DRAFT_20260810.md`
- Phase8E prep status: `docs/project-status/PHASE8E_PREPARATION_STATUS_v1.md`
- Phase8D source: `docs/scenario/40_NADIR_CAVE_DEFENSE_LINE_AND_INTEGRATION_ALTAR_PHASE8D_20260810.md`
- Phase8D status: `docs/project-status/PHASE8D_NADIR_CAVE_DEFENSE_LINE_STATUS_v1.md`
- Phase8D report: `PHASE8D_IMPLEMENTATION_REPORT_20260810.md`
- Phase8C source: `docs/scenario/39_DARK_CASTLE_TRUTH_AND_SECOND_INTEGRATION_PHASE8C_DRAFT_20260810.md`
- Coding Handoff: `canon/PRISMA_CODING_HANDOFF_v5.md`
- Scenario Canon: `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
- Character/Boss Encyclopedia: `canon/PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md`
- Developer Core Thoughts: `canon/PRISMA_DEVELOPER_CORE_THOUGHTS_v6.md`

**注意:** Phase8E prepは監査済みPhase8D累積版から作成。Phase8A/8B/8C/8D、Phase7D、2026-08-10 system/input更新を巻き戻さない。Phase8Eの新規player-facing台詞と不可逆分岐はまだ未実装。

## 2. 現在の本編位置

魔王ゼノン戦後の真相、第二次統合開始、シャニー加入までruntime接続済み。

- Phase8C完了後: **`storyStep=9 / subStep=0`**
- 表示目的: 「奈落への洞窟を越え、統合の祭壇へ向かおう」
- `darkCastleCleared` 後にガルヴァニア帝国3店舗が営業し、奈落への洞窟入口側が解禁。
- F6祭壇側出口で `nadirCaveCleared` を立てる。

## 3. Phase8Bで維持する店舗／三幹部基準

- 三幹部は全員男性。ゼルドラス＝人間不信と聖女／闇プリズム保護、エルメナス＝知略と歴史的警戒、ベレト＝謁見資格を実力で測る。
- 帝国ショップ配置は **雑貨 `x9,y11` / 武器 `x9,y21` / 防具 `x45,y21`**。`darkCastleCleared` 前は取引不可、後にRank65で営業。
- 魔王城内部へ商業ショップを戻さない。

## 4. 戻さない地理

- ガルヴァニア渓谷: 要塞側 **x:31,y:40** / 帝国側 **x:35,y:42**。
- ガルヴァニア帝国: ワールド **x:8,y:50**。魔王城入口は帝国内 local **x:27,y:3**。
- 奈落への洞窟: 入口側 **x:38,y:55** / 祭壇側 **x:42,y:55**。
- 統合の祭壇は既存17×15レイアウトを維持。
- 魔王城内部構造もM0現行を維持。帝国／城下町は最終地理ではない。

## 5. Phase8Dで実装した奈落への洞窟

旧6階層のパズル・地形は削除せず、「魔族が長年深淵を食い止めた防衛線」として意味を強化。

### hunter置換

魔王城真相後にも敵対魔族が襲う旧配置を廃止し、侵食側の魔物へ変更。

- F1: `[802,803,851]`
- F3: `[851,855,861]`
- F4: `[851,857,863]`
- F5: `[863,864,865]`
- F6: `[901,904,911]`

F3/F4/F6の任意bossも「魔将／守護魔／魔王軍の番人」ではなく、保管区画へ居着いた侵食獣・異形としてplayer-facing textを変更。攻略必須にはしていない。

### 追加した物証

- F1: 奥へ向く防壁杭、反復補修、新しい黒い血。
- F2: 同じ番号が繰り返される刻印。空間侵食で巡回路自体が戻る痕跡。
- F3: 溶けた鎧と黒骨、祭壇側を向く戦闘痕。
- F4: 氷下の旧封鎖術式、何層もの再凍結。
- F5: 「奈落防衛線」積荷＋第七码／第八碼の補給回数。
- F6: 祭壇側から押し破られた最終杭＋古い血痕を横切る新しい複数人の足跡。

「魔族は世界を守っていた」とシステム文で結論づけず、設備方向・補修・補給・敵の侵入方向を先に見せる。

## 6. 統合の祭壇 Phase8D

既存MAP構造は変更していない。調査点だけ追加。

- 入口寄り: 折れた防衛設備が外周ではなく中央亀裂を向く。
- 中央手前: 数人分の新しい足跡が祭壇中央へ続く。
- 祭壇設備: 亀裂を囲む古い導線の上へ、亀裂へ集約する新しい術式線が重ねられている。

**先行者がアラン／ヴェルド／ジャスパーであることはまだplayer-facingには伏せる。光属性痕跡も明示しない。**

## 7. 重要なruntime監査結果

現 `ABYSS_FIELD / MAP000032` では、中央亀裂を調べると旧 `abyss_unsealed` が発火してStep10 / CARMENAへ進める。

しかし正本では、その前に **光の楔アラン** が地上側最後の壁として立つ。

同時に、アラン救済必須アイテム **「王への上申書」** を取得する連続サブクエストもruntime未実装。

したがってPhase8Dでは、中央亀裂を単純にロックしたり、アラン死亡確定戦だけを先行実装していない。救済手段が存在しない状態で不可逆死亡を強制しないこと。

## 8. 次にやること — Phase8E候補

**アラン父／ハヤテ連続クエスト + 王への上申書 + 統合の祭壇アラン戦**を一つの大きなパッケージとして設計する。

必要要素:

1. ゼリード起点でアラン父の研究・汚名を追う。
2. ハヤテ父カゲトラとゼリード側の過去を開示。
3. ハヤテ正式加入。
4. キーアイテム **王への上申書** を取得。
5. 統合の祭壇到着時のアラン会話。
6. 上申書なしの場合、ジョセフ／レオン／クロード／レイラ／ゼリード等の苦悩を入れ、**「引き返す / 進む」** を明示。
7. 「進む」後のアラン戦。上申書なしで撃破すると死亡し、戦後救済不可。
8. 上申書ありなら撃破後に救済可能。後の再加入・+500k EXP等は既存canonと整合。
9. アラン戦完了後に初めて中央亀裂の旧直行導線を正式置換。

不可逆分岐と長会話を含むため、**まずMarkdown稿を作成しユーザー承認後にruntime化**する。レビューキュー `DR-20260810-alan-altar-irreversible-branch-phase8e` 参照。

## 9. Phase8C人物canon（維持）

### ルーナ

- ジャスパー／教団から誤った魔族史を教えられ、聖女として魔族討伐に参加していた。
- ガルヴァニアで後悔と謝罪を引き受け、「知らなかった」を免罪符にせず、自分で見て正義を選び直す。
- 魔王戦後、闇プリズムへ直接触れて記憶Stage3へ。記憶接続には頭痛・脱力が伴う。

### アルス×ルーナ

- アルスは過去の答えを語りすぎない、急かさない。
- ルーナが続けると選んだら支える。
- 記憶があってもなくても「今のルーナ」を見る。
- 昔と変わらない優しさ・頑固さ・仕草に静かに喜ぶ。恋愛は現在の旅で再構築。

## 10. プレイヤーへまだ明かさないこと

- ガルヴァニア渓谷の門を壊したのは **アラン**。
- アランは光の力制御を完成させ、ヴェルド／ジャスパーらと統合の祭壇へ先行している。
- 奈落F6／祭壇の複数人足跡の正体。
- ルーナが故郷の夜に手を握っていた「誰か」の正体。
- 深淵／混沌／第二次統合の全真相。

## 11. 検証

Phase8D最低限:

- `node --check story.js story_logic.js map.js news.js dungeon.js`
- `node tools/validation/validate-nadir-cave-phase8d.js`
- `node tools/validation/validate-dark-castle-phase8c.js`
- `node tools/validation/validate-dark-castle-phase8b.js`
- `node tools/validation/validate-galvania-geography-phase8a.js`
- `node tools/validation/validate-crystal-tree-six-element-phase7d.js`
- `node tools/validation/validate-system-input-update-20260810.js`
- `node tools/validation/validate-news-data.js`
- `node tools/validation/validate-map-actors.js`
- 最終: `node tools/validation/run-all.js`

assets除外由来の既知FAILと旧前提validatorは別扱い。Phase8Dによる新規FAILを出さない。

## Final validation result

- Phase8D targeted validator: PASS.
- Phase8C / Phase8B / Phase8A / Phase7D / system-input / NEWS / mapActors regression: PASS.
- `run-all.js`: **12/69 FAIL**. 内訳はassets除外由来10件＋旧 `PROLOGUE_HILL` / 廃止済みstory-monster-variant APIを要求するstale validator 2件。Phase8D由来の新規FAILなし。


## 12. Phase8C / 8D監査結果とPhase8E preparation

- Phase7D / 8A / 8B / 8C / 8D専用validatorはすべてPASS。
- 監査時 `run-all.js` は **12/69 FAIL**。既知assets除外10件＋stale validator 2件のみ。
- Phase8Cの `GALVANIA_EMPIRE_ARRIVAL_PHASE8C` に、観測描写の後へ「侵略のための軍都というより～」と解釈を先回りするシステム文が1件ある。runtimeは勝手に変更せず `DR-20260810-galvania-empire-arrival-exposition-phase8c-review` へ送付。
- Phase8D中央亀裂の旧 `abyss_unsealed` はPhase8Eまでの一時状態。アラン救済クエストとアラン戦を分離実装しない。

### Phase8E safe infrastructure implemented

`story_logic.js`へ以下を追加。

- `IF_QUEST_STAGE`: quest stageによるmanaged/unmanaged分岐。
- `QUEST_STAGE`: story eventからquest stageを安全に更新。
- `QUEST_FAIL`: 不可逆分岐時のquest失敗処理。
- `CHOICE`の `yesLabel` / `noLabel`: 既存 `はい / いいえ` defaultを維持しつつ、`進む / 引き返す` 等の明示ラベルを使用可能。

専用validator: `tools/validation/validate-phase8e-story-infrastructure.js`。

### Phase8E scenario draft

`41_ALAN_AREL_KAGETORA_APPEAL_AND_ALTAR_PHASE8E_DRAFT_20260810.md` を作成済み。以下を一つのPhaseとして扱う。

1. アラン裏切り後、雷の要塞のゼリードから開始。
2. 水上都市のアレル旧研究申請。
3. レクスノート邸の父親としての私的記録／カゲトラ宛文書。
4. 光の宮殿旧命令簿で改竄痕を確認し、ゼリードがカゲトラ殺害を自分の口で告白。
5. 水上都市でハヤテと完全に決裂。即時赦免なし。
6. 王へ上申書を提出し、王国の公的再審／記録訂正を開始。キーアイテム `王への上申書`。
7. 統合の祭壇で光の楔アラン。父の真実だけでは和解しない。
8. 上申書なし: 仲間の苦悩→`進む / 引き返す`→進んで撃破すると死亡永久確定。
9. 上申書あり: 戦闘後に救済選択を開く。savedでも祭壇では即再加入させず、後の光魔剣士再加入へhook。
10. Alan outcome確定後にだけ深淵への旧直行導線を解禁。

### Phase8E user approval待ち5点

- クエスト解禁をアランの光の宮殿裏切り直後からにする。
- `王への上申書` は王へ提出した上申書原本へ王印／正式受理文が追記される形。
- ハヤテはゼリードへ刃を半分抜くが殺さず、許さないまま父の意志を確かめるため加入。
- ガルヴァニア渓谷の門破壊者＝アランを統合の祭壇で本人の短い応答により初回収。
- 上申書ありでも `共に生きろ / ここで終わらせる` の最終選択を残し、条件達成後も死亡を選べる仕様にするか。

**上記の承認前に `story.js` / `map.js` へPhase8Eの新規台詞・Alan battle・death/saved branchを入れない。**

## 13. Phase8E preparation validation

- targeted Phase8E infra / Phase8D / 8C / 8B / 8A / 7D / system-input / NEWS / mapActors: **PASS**。
- `run-all.js`: **12/70 FAIL**。Phase8E validator追加により総数70。失敗は従来と同系統（assets除外由来＋stale validator）で、新規Phase8E regressionなし。
- runtimeのPhase8E本編実装は `41_ALAN_AREL_KAGETORA_APPEAL_AND_ALTAR_PHASE8E_DRAFT_20260810.md` のユーザー承認後に開始する。
