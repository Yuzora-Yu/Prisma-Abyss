# PRISMA ABYSS — 作業引き継ぎ書 最新版

**更新:** 2026-08-10  
**Phase:** 8E implemented / アレル・カゲトラ長編クエスト、王への上申書原本、光の楔アラン、救済／死亡分岐  
**用途:** 次Chat/次作業開始時に最初に読む短縮版。詳細は `canon/PRISMA_CODING_HANDOFF_v5.md` と各正本MD。

## 1. 最新基準

- Phase8E承認正本: `docs/scenario/42_ALAN_AREL_KAGETORA_APPEAL_AND_ALTAR_PHASE8E_APPROVED_20260810.md`
- Phase8E implementation report: `docs/project-status/PHASE8E_IMPLEMENTATION_REPORT_20260810.md`
- システム／UI全文言レビュー台帳: `docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md`
- Phase8C/8D監査: `docs/project-status/PHASE8C_PHASE8D_AUDIT_20260810.md`
- Scenario Canon: `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
- Character/Boss Encyclopedia: `canon/PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md`
- Coding Handoff: `canon/PRISMA_CODING_HANDOFF_v5.md`

**重要:** `41_ALAN_AREL_KAGETORA_APPEAL_AND_ALTAR_PHASE8E_DRAFT_20260810.md` は承認前の履歴稿で、上申書等に旧解釈を含む。実装正本として使用しない。

## 2. 戻さない既実装

- Phase7D: 結晶樹の六属性秘薬、レオン／ルーナ治療。
- Phase8A: ガルヴァニア渓谷、ガルヴァニア帝国、奈落への洞窟の地理再編。
  - ガルヴァニア渓谷: 要塞側 x:31,y:40 / 帝国側 x:35,y:42。
  - ガルヴァニア帝国: ワールド x:8,y:50。魔王城入口は帝国内 local x:27,y:3。
  - 奈落への洞窟: 入口側 x:38,y:55 / 祭壇側 x:42,y:55。
- Phase8B: 三幹部全員男性。帝国3店舗は魔王城クリア前取引不可、クリア後営業。城内へショップを戻さない。
  - 店舗座標: 雑貨 `x9,y11` / 武器 `x9,y21` / 防具 `x45,y21`。
- Phase8C: ゼノン戦後の闇プリズム確認、ルーナ記憶Stage3、第二次統合、シャニー加入。
- Phase8D: 奈落への洞窟を深淵防衛線として再解釈。統合の祭壇に物証を追加。
- 2026-08-10 system/input: 村エンカウントとダンジョン判定分離、山小屋(66,58)、Rank装備ドロップ、アナログスティック、タップ自動歩行。

## 3. Phase8E正本 — 王への上申書

**「王への上申書」は現代に新しく作る書類ではない。**

- アレル＝レクスノート侯爵が十年前、ジャスパーのプリズム統合の儀を止めるため、国王への提出を準備していた未提出原本。
- 王国暗部が関連資料を消去／焼却したため、存在しない扱いになっていた。
- ゼリードがカゲトラ殺害後の押収品焼却命令に従い切れず、一箱だけ封を切らず旧文書庫裏へ隠した。
- その箱から原本を発見する。
- 現代の国王が王印を追記する、新しく上申書を作る、公的再審書類へ変える、という旧案は**不採用**。

Key item: `701011 王への上申書`。

## 4. Phase8E長編クエスト `arel_kagetora_appeal`

解禁: **光の宮殿でアランが裏切った直後** (`alanBetrayedLightPalace`)。

1. 雷の要塞: ゼリードが暗部処分記録の端切れを示す。
2. 水上都市: アレルの旧研究申請。六属性を一つへ固定する危険を十年前から警告。
3. レクスノート邸: 父親としての私記録＋カゲトラ宛「王へ出す上申は別便」の覚え書き。
4. 光の宮殿: 同日付の命令書を照合し、暗部用の処断命令が改竄と確認。ゼリードが「カゲトラを斬ったのは俺だ」と告白。
5. 水上都市: ハヤテへ告白。ハヤテ正式同行。
6. 光の宮殿旧文書庫: ゼリードが隠した押収箱を発見し、原本「王への上申書」取得。クエスト完了。

### ハヤテ／ゼリード

カゲトラはゼリードを最も信頼していた。ハヤテも父からその話を何度も聞き、ゼリードを「父の一番の相棒」と信頼している。

そのため告白直後も刃を抜く／胸倉を掴む等の即時喧嘩にはしない。一方で簡単にも許さない。

- 「今は、許すとも許さないとも言えない」
- 「自分の手で、自分の目で確かめる」
- 「全部見たあとで、もう一度あんたと話したい」

関係修復は後続物語へ残す。

## 5. 統合の祭壇 — 光の楔アラン

- `ABYSS_FIELD` の中央亀裂へ進む前、アランを人物actorとして配置。
- boss: `301110 光の楔アラン`, Rank95。人格上書きではなく、深淵に傷を増幅されつつ本人の意思で立つ。
- ガルヴァニア渓谷の門破壊者がアランであることは**ここでも明かさない**。

### 上申書なし

- ジョセフ／レオン／クロード／レイラ／ゼリード、若手の制止。
- 明示選択 **「進む / 引き返す」**。
- 引き返せば救済クエストへ戻れる。
- 「進む」を選んで撃破するとアラン死亡。後日救済・蘇生・再加入不可。
- 未完了の `arel_kagetora_appeal` は失敗へ遷移。

### 上申書あり

- アランへ十年前の原本を見せるが、それだけで和解しない。
- 戦闘後、プレイヤーが **「共に生きろ / ここで終わらせる」** を選ぶ。
- 上申書は生存を可能にする条件であり、**生存を強制しない**。
- savedでも祭壇では即再加入しない。後続Phaseの光魔剣士再加入＋500,000EXPへ接続予定。

アラン戦が解決し `alanAltarResolved` 後にだけ、中央亀裂から旧 `abyss_unsealed` / CARMENA側へ進める。

## 6. Save safety

- 旧saveで `abyssOuterReached` または `storyStep>=10` の場合、`alanAltarLegacyBypass=true`, `alanAltarResolved=true` として進行を巻き戻さない。
- 旧save救済時に `alanOutcome` を勝手に `dead/saved` へ補完しない。
- 上申書は戦闘後も消費しない。

## 7. システム文・メニュー／UI文言の新ルール

ユーザー指示により、チュートリアル以外の既存player-facing copyを作業範囲に関係なくレビュー対象とする。

- master inventory: `docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md`
- 修正提案時は必ず **現行 / 修正案** を併記。
- 最終ユーザー判断前に既存runtime文言を勝手に置換しない。
- 新規システム／UI文言もinventoryへ追加する。
- チュートリアルはUI完成ゲート方針を優先し、現レビューでは保留。

現在のproposal-ready項目:
- `GALVANIA_EMPIRE_ARRIVAL_PHASE8C` の「侵略のための軍都というより～」行。runtimeは**まだ変更していない**。

## 8. 次工程

Phase8E後に進める際は、まずアラン生存／死亡双方の後続差分を監査する。

- saved: 後の光魔剣士アラン再加入、+500,000EXP once-only、クロード／レオン／リュウ／ハヤテ等の差分。
- dead: 再加入不可、関係NPC／アーカイブ／ending差分。
- 深淵側のStep10以降へPhase8E結果をどう持ち込むか。
- システム／UI文言レビューは別途batch化し、現行／修正案を提示して承認後に反映。

## 9. Validation

最低限:

- `node --check story.js map.js main.js quests.js items.js monsters.js news.js story_logic.js`
- `node tools/validation/validate-phase8e-alan-appeal.js`
- `node tools/validation/validate-phase8e-story-infrastructure.js`
- Phase8D / 8C / 8B / 8A / 7D regressions
- `node tools/validation/validate-map-actors.js`
- `node tools/validation/validate-news-data.js`
- final `node tools/validation/run-all.js`

最終 `run-all`: **12 / 71 FAIL**。

- assets除外由来: 10
- 旧前提validator (`PROLOGUE_HILL`, removed `getStoryMonsterVariant`): 2
- Phase8E由来の新規FAIL: 0

Phase8Eで新規Actor／祭壇gateを追加したことでstale化した4本のmaintained validatorは、新仕様を検証する形へ更新済み。
