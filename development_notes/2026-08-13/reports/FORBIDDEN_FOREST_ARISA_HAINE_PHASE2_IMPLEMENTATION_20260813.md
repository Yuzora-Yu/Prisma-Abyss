# 禁忌の森・ハイネ／アリサ本編必須加入 Phase2 実装報告 2026-08-13

## Scope

今回の実装範囲は以下で固定した。

- 水上都市でカザリアから救援要請
- ソフィアが救援を優先し、並行して船の持ち主を調査
- カザリアでアリサの礼拝／ハイネ追跡理由を確認
- 禁忌の森深部で二人と合流
- 既存深部ボス戦
- ボス後に「古びた魔笛」を発見
- アリサ本人の意思による同行希望
- ハイネが本人の選択を尊重して同行
- 二人の本編必須加入
- 水上都市帰還後、ハイネのアレル侯との仕事上の面識からレクスノート邸へ接続

レクスノート邸地下迷宮、アラン加入方式変更、暴動後の追加NPC／噴水／討伐依頼は今回未着手。

## Runtime changes

### story.js

以下の承認済み会話を本編用に置換・拡張。

- `WATER_CITY_WIND_MESSENGER`
- `QUEST_ARISA_HAINE_START`
- `QUEST_ARISA_HAINE_ENCOUNTER`
- `QUEST_ARISA_HAINE_CLEAR`
- `WATER_CITY_REXNOTE_BRIEFING`

`quest_arisa_haine_clear` で Item 701012 を取得し、`arisaHaineMainStoryCleared` 更新時にfield refreshを行う。

### items.js

Item 701012 `古びた魔笛` を追加。

- type: 貴重品
- 売却不可
- 戦闘／フィールド使用不可
- 既存 `item-key.png` を使用するためassets追加不要
- 入手時点ではヴェリア由来と説明しない

### quests.js

`arisa_haine_forest_depths` の目的文／開始文／完了文を新版の本編理由へ同期。
既存のrewardAllies 108 / 207 は維持。

### main.js

`20260813_arisaHaineAncientFluteV1` を追加。

旧セーブで以下のいずれかを満たす場合のみ Item 701012 を一度補填する。

- `arisaHaineMainStoryCleared`
- `arisa_haine_forest_depths` completed
- アリサ108とハイネ207が両方加入済み

物語進行度だけでは補填しない。旧任意ルートを飛ばしたセーブへ、救出済みの出来事を捏造しないため。

### news.js

2026/08/13 のレコードを1件追加。

## Existing map assets reused

`map.js` の既存資産をそのまま利用できたため、MAP定義自体は変更不要だった。

- カザリアの `arisaHaineMainStoryRequired -> main_arisa_haine_start` actor
- 禁忌の森深部固定MAP
- 深部boss `303203 / 303207`
- `quest_arisa_haine_encounter`
- `quest_arisa_haine_clear`
- 水上都市ソフィアの `arisaHaineMainStoryCleared -> water_city_rexnote_briefing`

新しい敵ID・MAP・画像参照は増やしていない。

## Canon / scenario synchronization

更新:

- `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
- `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`
- `canon/PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md`
- `docs/scenario/00_SCENARIO_CANON.md`
- `docs/scenario/03_FORESHADOWING_LEDGER.md`
- `docs/scenario/07_DIALOGUE_REVIEW_QUEUE.md`
- `docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md`
- `development_notes/2026-08-12/scenario/WATER_CITY_RIOT_REXNOTE_BASEMENT_PROPOSAL_20260812.md`

新規承認稿:

- `development_notes/2026-08-13/scenario/FORBIDDEN_FOREST_ARISA_HAINE_PHASE2_APPROVED_20260813.md`

## Writing decisions

- アリサは精神支配されていない。自分の意思で風のプリズムへ礼拝し、その後に理解できない風を追う。
- ヴェリア／楽師家系／エリシアとの関係はこの場で説明しない。
- 伏線は「風の音」「指が笛穴を知る」「古びた魔笛」の3点に限定。
- ハイネはアリサの意思を止めず、自分も横に立つ。
- アレル侯は親友・旧主君ではなく、Bランク冒険者として何度か依頼を請けた仕事上の古い知人。

## Checks

同梱validatorはユーザー指示に従い使用していない。

実施した個別確認:

- `node --check`: story.js / quests.js / items.js / main.js / news.js PASS
- Item ID 701012 重複なし
- Item ID 全423件の重複なし
- 深部bossの startEvent / clearEvent linkage確認
- required / started / cleared / rexnoteRouteKnown のflag連鎖確認
- 旧セーブ補填 migration 登録・load時呼出し確認
- 2026/08/13 NEWS record 1件のみ
- 変更対象既存ファイルのCRLF維持

## Next unit

次は提案書の順序どおり、まず **暴動後の水上都市追加NPC・噴水・討伐依頼** を独立単位として完成させる。
その後にレクスノート邸地下迷宮へ進む。
