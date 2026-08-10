# PRISMA ABYSS — 作業引き継ぎ書 最新版


## 0. 緊急修正 — 生息域エンカウント Rank1 固定（8F-HF1）

- 症状: ライザーク要塞、光の宮殿、ワールドマップ等で `monsters.js` の `habitats` が無視され、Rank1帯が出現する。
- 原因: `getEncounterCandidates()` が任意引数 `rankMin/rankMax` の `null` を `Number(null) === 0` と解釈し、「Rank範囲指定あり」と誤判定していた。
- runtime は未指定境界を `null` で渡すため、通常の habitat encounter が実質 Rank1〜1 に固定されていた。
- 修正: `null / undefined / ''` は「未指定」として扱い、実値がある場合だけ Rank範囲抽選へ入る。
- 明示Rank範囲を使う `PROLOGUE_NORTH_VILLAGE (1〜76)`、`GALVANIA_GORGE (68〜76)` は従来どおり。
- validator: 全111固定ダンジョン階層＋全15フィールド遭遇地域について、runtime同等の `rankMin:null / rankMax:null` を渡しても、未指定時と同一の habitat pool になることを検証する。
- 実測: ライザーク要塞1F `MAP000019` は Rank51〜52候補、光の宮殿1F `MAP000023` は Rank61〜65候補へ復帰。

**更新:** 2026-08-10  
**Phase:** 8F-HF1 / 生息域エンカウントRank1固定回帰を修正  
**用途:** 次Chat/次作業開始時に最初に読む短縮版。詳細は `canon/PRISMA_CODING_HANDOFF_v5.md` と各正本MD。

## 1. 最新基準

- Phase8F正本: `docs/scenario/43_JAGOREA_JASPER_ALAN_SUPPORT_PHASE8F_20260810.md`
- Phase8F implementation report: `docs/project-status/PHASE8F_IMPLEMENTATION_REPORT_20260810.md`
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
- savedでも祭壇では即再加入しない。Phase8Fのジャスパー戦へ生存状態を持ち越す。

アラン戦が解決し `alanAltarResolved` 後にだけ、中央亀裂から旧 `abyss_unsealed` / CARMENA側へ進める。

## 6. Phase8F — 災禍の根ジャゴレア / ジャスパー戦

### 共通

- `ABYSS_JASPER` は混沌呪縛罠から開始。
- ジャスパーは王国、聖女、騎士、プリズム、人魔対立を研究材料へ利用したことを自慢げに明かす。
- アルスたちを殺し、亡骸を深淵王へ捧げれば幹部として研究を続けられると信じている。
- 地上を自分の管理下に置かれた暁には、全生命を研究材料にする意図を明言する。

### アラン死亡時

- そのまま `302060 妄執の神官ジャスパー` 戦。
- `ambush:true`。
- `openingPartyStatDebuff` の「混沌呪縛」で ATK/DEF/MDEF/SPD/MAG/HIT/EVA/CRI を0.5倍。
- 最大HP/MPは変化させない。戦闘後へも持ち越さない。

### アラン生存時

- `alanSavedAtIntegrationAltar` でアラン登場。混沌に染まった光を逆流させ、呪縛を崩す。
- 黒幕本人から父・自身の利用・統合の儀について聞いたと語り、アルスへ共闘を願う。
- ガイルは過去を帳消しにしないと釘を刺し、アルスはジャスパーを止めるため受け入れる。
- 戦闘外NPC援護 `externalTurnSupports` を使用。party slotを使わず、敵targetにもならない。
- source statsは主人公 `charId:301` の最終能力値。
- 毎ターン **アステリア(146) -> 霊脈断ち(115) -> 戦神の律動(508) -> ルクシオン・ノナ(232)** をcycle。

### ジャスパー撃破後

- アランは真実を自分の目で確認し決着をつけられたことへ感謝し、自身の嫉妬・父への失望・誤った選択を認める。
- プレイヤーは **「仲間に迎える / 今は断る」** を選ぶ。
- 許可: その場でALLY201。Story EXP **+1,000,000** once-only (`alan_jagorea_join_1000k`)。
- 保留: `alanWaitingAtLegacionAfterJasper`。混沌魔城レガシオンにアランActorを配置し、後から加入可能。
- 後日加入でも同じreward keyで+1,000,000。加入後 `alanRejoinedAfterJasper` で待機Actor消滅。
- Phase8E時点の将来予定「後続で再加入＋500,000EXP」は**再加入時期／EXP量を上書き**。光魔剣士構想は残るがPhase8F runtimeでは職変更未実装。

## 7. Save safety

- 旧saveで `abyssOuterReached` または `storyStep>=10` の場合、`alanAltarLegacyBypass=true`, `alanAltarResolved=true` として進行を巻き戻さない。
- 旧save救済時に `alanOutcome` を勝手に `dead/saved` へ補完しない。
- 上申書は戦闘後も消費しない。

## 8. システム文・メニュー／UI文言の新ルール

ユーザー指示により、チュートリアル以外の既存player-facing copyを作業範囲に関係なくレビュー対象とする。

- master inventory: `docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md`
- 修正提案時は必ず **現行 / 修正案** を併記。
- 最終ユーザー判断前に既存runtime文言を勝手に置換しない。
- 新規システム／UI文言もinventoryへ追加する。
- チュートリアルはUI完成ゲート方針を優先し、現レビューでは保留。

現在のproposal-ready項目:
- `GALVANIA_EMPIRE_ARRIVAL_PHASE8C` の「侵略のための軍都というより～」行。runtimeは**まだ変更していない**。

## 9. 次工程

Phase8F後は、ジャスパー撃破とアラン再加入結果をさらに深淵後半へ接続する。

- saved + joined: アランを正式partyとして後続深淵へ反映。クロード／レオン／リュウ／ハヤテ／ゼリード等の差分。
- saved + waiting: レガシオン待機を維持し、加入必須化しない。後続会話がアラン加入済みを誤前提にしないこと。
- dead: 再加入不可。関係NPC／アーカイブ／ending差分を維持。
- ジャスパー以降の現行深淵ボス、レガシオン、終焉の祭壇の旧会話／旧進行を監査する。
- 汎用 `externalTurnSupports` は他クエスト共闘で利用可能。新規利用時は固有実装を増やさずconfigから設定する。
- システム／UI文言レビューは別途batch化し、現行／修正案を提示して承認後に反映。

## 10. Validation

最低限:

- `node --check story.js map.js main.js quests.js items.js monsters.js news.js story_logic.js`
- `node tools/validation/validate-phase8e-alan-appeal.js`
- `node tools/validation/validate-phase8e-story-infrastructure.js`
- `node tools/validation/validate-phase8f-jasper-alan-support.js`
- Phase8D / 8C / 8B / 8A / 7D regressions
- `node tools/validation/validate-map-actors.js`
- `node tools/validation/validate-news-data.js`
- final `node tools/validation/run-all.js`

最終 `run-all`: **12 / 72 FAIL**。

- assets除外由来: 10
- 旧前提validator (`PROLOGUE_HILL`, removed `getStoryMonsterVariant`): 2
- Phase8F由来の新規FAIL: 0

Phase8Eで新規Actor／祭壇gateを追加したことでstale化した4本のmaintained validatorは、新仕様を検証する形へ更新済み。

## 9. 次工程として確定した必須導線（未実装）

レガシオン到達後、北側はジャスパーの多重混沌封印で進行不能。属性が無秩序に混ざっているため、循環へ戻す手段が必要。

1. 精霊の加護を最大限に受けるため各属性プリズムを巡る。
2. 各属性で精霊戦 → 精霊に認められる → 六属性の結晶片／加護を集める。
3. 結晶樹の間で六属性を円形配置するが、最初は何も起こらない。
4. アルスのペンダントが発光、ルーナも共鳴。
5. 光の神リュシオンが短時間だけ顕現し、六属性が大きな円環として循環。
6. key item「輪廻の結晶」を生成。ルーナは故郷の記憶をさらに回復。
7. レガシオン北側で輪廻の結晶を掲げ、多重混沌封印を循環へ戻して突破。

終焉の祭壇では**光柱ジャスパーを新設しない**。既存5柱のみ。ヴェグナシスが聖女（またはアラン）を取り込めば統合準備が整う旨を深淵王に言わせる。ヴェグナシス撃破で六芒星属性柱が臨界へ入り、主人公たちは混沌奔流で行動不能になるが、「輪廻の結晶」が反応し六芒星の強制統合を円環循環へ押し返す。その直後に深淵王最終戦第一形態へ入る。
