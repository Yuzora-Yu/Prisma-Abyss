# Phase8E 実装レポート — アレル／カゲトラ／王への上申書／光の楔アラン

Date: 2026-08-10  
Status: **implemented / validated**

## 1. 今回確定した正典

ユーザー最終回答を反映し、以下を正本として実装した。

1. 長編クエストは、光の宮殿でアランが裏切った直後から解禁する。
2. 「王への上申書」は現代に新しく作る文書ではない。**アレルが十年前、ジャスパーの統合の儀を止めるため国王へ直接提出しようと準備していた原本**である。暗部により関連記録ごと消去されたはずの文書を、現代の一行が発見する。
3. ハヤテは、父カゲトラがゼリードを最も信頼していたことを昔から知っている。ゼリードの告白後も即座に許しはしないが、短絡的な喧嘩・抜刀にはしない。「自分の手と目で真実を確かめ、その後でもう一度話す」という態度を取る。
4. ガルヴァニア渓谷の門を破壊したのがアランであることは、統合の祭壇でも明かさない。
5. 上申書を所持していても、アラン戦後の生死はプレイヤーが決める。上申書は「救済可能条件」であり「強制生存条件」ではない。
6. チュートリアル以外のシステム文・メニュー・UI文言は作業範囲を問わずレビュー対象として収集し、変更時は **現行 / 修正案** を併記してユーザー判断後に反映する。

## 2. 長編クエスト `arel_kagetora_appeal`

### 解禁

- `alanBetrayedLightPalace` 後。
- 雷の要塞のゼリードから開始。

### 調査順

1. **水上都市・旧行政記録**
   - アレルが六属性を一つに固定する危険性へ早期から警告していた痕跡を確認。
2. **レクスノート邸・私的記録**
   - アレルが研究者であるだけでなく、アランやリュウの父親だった生活痕跡を確認。
   - カゲトラへ「王へ出す上申は別便」と残した記録を発見。
3. **光の宮殿・旧命令簿**
   - 拘束命令が後から処刑許可へ改竄された痕跡を確認。
   - ゼリードが「カゲトラを斬ったのは俺だ」と告白。
4. **水上都市・ハヤテ**
   - ハヤテは父がゼリードを最も信頼していたと明言。
   - 許す／許さないを即断せず、自分の目で全てを確認してから改めて話すと決める。
   - ハヤテ正式加入。
5. **光の宮殿・封印された押収箱**
   - ゼリードが十年前に焼却命令へ背き、密かに残していた未開封箱を開く。
   - **アレル本人の署名と国王宛封印を持つ「王への上申書」原本**を発見。

上申書には、プリズム統合の儀の即時停止、人体・大規模実験で六属性を一つへ強制固定する行為の禁止、ジャスパー関連記録の国王直轄再調査要求が記されている。

## 3. 統合の祭壇・光の楔アラン

- story boss ID: `301110`
- name: `光の楔アラン`
- Rank: 95
- `storyOnly / bestiaryExcluded`
- 統合の祭壇では正式 `mapActors` として配置し、人物spriteを `mapActions` へ置かない。
- 中央亀裂は `alanAltarResolved` 後にのみ利用可能。

### 上申書なし

戦闘前に仲間が制止し、明示選択:

- **進む**
- **引き返す**

「進む」を選んで撃破した場合:

- `alanOutcome = dead`
- `alanDeadAtIntegrationAltar = true`
- `alanAltarResolved = true`
- 未完了の `arel_kagetora_appeal` は失敗
- 後日の救済・再加入不可

### 上申書あり

アランへ十年前の原本を提示するが、それだけで改心・和解はしない。

アランは、ジャスパーだけが自分の力を「使える」と評価したことへの執着を認めつつ、最後は「自分が選んだ」と責任を引き受けたうえで戦う。

撃破後に明示選択:

- **共に生きろ**
- **ここで終わらせる**

救済を選択:

- `alanOutcome = saved`
- `alanSavedAtIntegrationAltar = true`
- `alanAltarResolved = true`
- 祭壇では即再加入しない
- 後続Phaseの光魔剣士再加入／Story EXP +500,000 once-onlyへ接続予定

死亡を選択:

- `alanOutcome = dead`
- `alanDeadAtIntegrationAltar = true`
- `alanAltarResolved = true`

## 4. 旧save互換

すでに旧実装で深淵側へ進んでいるsaveを巻き戻さない。

- `abyssOuterReached === true` または `storyStep >= 10`
- かつ Phase8E結果未確定

の場合:

- `alanAltarLegacyBypass = true`
- `alanAltarResolved = true`

とする。

この救済で `alanOutcome` を勝手に `saved / dead` へ補完しない。

## 5. システム文・UI文言レビュー

新ルールを `AGENTS.md` / development policy / Dialogue Review Queue / handoffへ反映した。

master inventory:

- `docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md`
- root convenience copy: `SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md`

初回全体走査:

- total: **1640 entries**
- story system narration: **155**
- story objective text: **55**
- other UI / map / menu candidates: **1430**

既存文言は自動置換しない。

Phase8Cで発見した下記もruntimeは未変更のままレビュー待ち:

**現行**  
「包帯を巻いた兵が壁にもたれ、そのすぐ横を親子が避難区画へ急いでいく。\n侵略のための軍都というより、長く何かに耐えてきた街に見えた。」

**修正案**  
「包帯を巻いた兵が壁にもたれ、そのすぐ横を親子が避難区画へ急いでいく。」

## 6. Validator更新

Phase8Eで正式Actorを追加したことにより、古いvalidatorの以下4固定前提がstale化したため、新仕様を弱めずに更新した。

- Abyss Outer Rim: 中央亀裂が常時利用可能という前提 → `alanAltarResolved` gateを検証しつつ、解禁時footprintも検証。
- Water City: `nextActorPlacementId === 15` 固定 → messenger placement 14を保持しつつ、allocatorが全issued IDsより大きいことを検証。
- Light Palace F5: actor総数が必ず5という前提 → 既存5囚人のstable IDを個別検証し、新規調査Actor追加を許容。
- Thunder Fort: `nextActorPlacementId === 15` 固定 → Luna placement 14を保持しつつallocator整合を検証。

## 7. Validation結果

### Targeted

Phase7D / 8A / 8B / 8C / 8D / 8E、main-story routing、story dialogue、condition engine、world-state normalizer、map actors、news等をPASS。

### Full suite

`node tools/validation/run-all.js`

**12 / 71 FAIL**

内訳:

- assetsフォルダ除外による既知FAIL: **10**
- 現行コードと食い違う旧validator:
  - obsolete `PROLOGUE_HILL`
  - removed `getStoryMonsterVariant`
  **2**

Phase8E実装による新規FAIL: **0**

## 8. 次工程

Phase8E後は、アランの結果差分をStep10以降へ接続する。

- saved: 後の光魔剣士アラン再加入、Story EXP +500,000 once-only、関係人物差分。
- dead: 再加入不可、関係NPC／記録／ending差分。
- 深淵編で `alanOutcome` をどう参照するか監査。
- システム／UI文言はinventoryからbatch化し、**現行 / 修正案**を提示してユーザー承認後にだけruntime反映。
