# 08_IMPLEMENTATION_HANDOFF

Markdownシナリオから `story.js`、`map.js`、`maps_logic.js` などへ反映する時の引き継ぎ。

## Implementation policy

実装に進めるのは、以下のいずれかのみ。

1. ユーザーが明示的に実装を指示した新規草稿
2. `05_EVENT_SCRIPT_MASTER.md` で `approved` になっている台本
3. `07_DIALOGUE_REVIEW_QUEUE.md` で `approved_*` になっている既存会話修正

以下は実装不可。

- `pending` の改善案
- `draft` の未承認草稿
- Codexが勝手に良いと判断しただけの文章
- 既存会話のサイレント置換

## Before implementation

必ず確認すること:

- 対象ファイル
- script key
- map event
- storyStep/subStep
- required flags
- flags to set
- party assumptions
- approved status
- 実際の会話画面での読みやすさ、改行、人物の呼吸

## Runtime files

主な確認先:

- `story.js`: story data and scripts
- `story_logic.js`: runtime story manager logic
- `map.js`: map data
- `maps_logic.js`: map event and movement logic
- `characters.js`: character names, IDs, related data

## story.js reflection template

```md
## IMPL-000

Status: ready / implemented / blocked
Source:
- scenario file:
- review queue ID:
- approval status:

### Target
- file:
- script key:
- current storyStep-subStep:
- target storyStep-subStep:

### Change summary
- 

### Dialogue keys changed
- 

### Flags changed
- set:
- check:
- remove:

### Risks
- save compatibility:
- event duplication:
- premature spoiler:
- presentation/readability:

### Validation
- manual dialogue presentation check:
- manual route check:
- browser smoke test:
```

## After implementation report

Codexは実装後に以下を報告する。

```md
## Implementation report

### Files changed
- 

### Approved source used
- 

### Script keys changed
- 

### Flags touched
- 

### Dialogue presentation check
- result:

### Manual concerns
- 

### User follow-up needed
- 
```

---

## IMPL-20260810-PHASE8A-GALVANIA-GEOGRAPHY

Status: implemented  
Source:
- scenario file: `docs/scenario/37_GALVANIA_GEOGRAPHY_PHASE8A_20260810.md`
- approval status: user-approved coordinates / geography direction

### Target
- files: `map.js`, `main.js`, `dungeon.js`, `story.js`, `phaser-field.js`, `news.js`
- current storyStep-subStep: `8-0`
- target storyStep-subStep: geography reorg only; main step remains `8-0` until Castle clear

### Change summary
- Old Galvania Cave world pins -> new Galvania Gorge at x31,y40 / x35,y42.
- Old Castle world pin x8,y50 -> new Galvania Empire M0; Castle entrance moved inside Empire.
- Old Galvania Cave dungeon -> Nadir Cave at x38,y55 / x42,y55 after Castle.
- Integration Altar gated behind Nadir Cave exit.
- Crystal Tree clear rumble and Gorge fallen-demon aftermath wired.
- Old-save discovery and late-story migration added.

### Flags changed
- set: `galvaniaGorgeAftermathSeen`, `galvaniaGorgeHatredDemonDead`, `galvaniaGorgeWarningDemonDead`, `nadirCaveCleared`
- check: `crystalTreeCleared`, `darkCastleCleared`

### Risks
- save compatibility: handled by visited-area and late-story migration.
- route skip: Integration Altar and Sky Prism both check `nadirCaveCleared`.
- premature spoiler: Alan identity remains internal only.
- M0 quality: Galvania Empire is deliberately not final town geography.

### Validation
- `validate-galvania-geography-phase8a.js`
- full `run-all.js` baseline comparison required before delivery.


## 2026-08-10 Phase8C — 魔王城真相／第二次統合

- 入口側: ガルヴァニア帝国初回会話でルーナが魔族の生活圏を見て、自身の討伐歴を認識。
- 三幹部: Phase8Bの男性設定と戦闘理由を維持し、ルーナの「知らなかったことを言い訳にしない」人物軸を追加。
- 玉座: ゼノン撃破後に闇プリズム無傷確認。ルーナが直接触れ、記憶喪失前後の記憶接続による痛みを経験。アルスは急かさず支える。
- 真相: エクリプス戦で闇統合研究は完了済み。リーシア／ソフィア／ミネルバ／ゼノンの知見から、循環（調和）と強制統合の違いをケイトが言語化。
- ルーナ: 魔族討伐への謝罪→許しを要求しない→自分で見て選び、目の前の人を守るため戦う、と再起。
- 第二次統合: 地下から地鳴り。奈落への洞窟を経て統合の祭壇へ。
- シャニー: ゼノン命令ではなく本人の意思で加入。
- commit: `darkCastleCleared` は会話・加入・ルーナ報酬・第二次統合flagの後。旧save再閲覧あり。

## 2026-08-10 Phase8F — 災禍の根ジャゴレア / ジャスパー・アラン援護

- Source: `docs/scenario/43_JAGOREA_JASPER_ALAN_SUPPORT_PHASE8F_20260810.md`。
- `ABYSS_JASPER`: 混沌呪縛罠＋ジャスパーによる計画自白へ置換。
- アラン死亡: 不意打ち＋開幕 `openingPartyStatDebuff`。ATK/DEF/MDEF/SPD/MAG/HIT/EVA/CRI 0.5倍、HP/MP上限は変更しない。
- アラン生存: `alanSavedAtIntegrationAltar` で専用登場会話。混沌呪縛を崩した後、汎用 `externalTurnSupports` で毎ターン援護。
- アラン援護は主人公 `charId:301` の最終ステータス参照。party枠／敵targetを消費しない。
- cycle: アステリア(146) → 霊脈断ち(115) → 戦神の律動(508) → ルクシオン・ノナ(232)。
- ジャスパー撃破後: `仲間に迎える / 今は断る`。実加入時にStory EXP +1,000,000 once-only。
- 保留時: `alanWaitingAtLegacionAfterJasper` で混沌魔城レガシオンActorへ移動。後から加入可能。
- 2026-08-15補正により、ジャスパー撃破後の実加入時は覚醒システム文→`光魔剣士`へ恒久職変更→Story EXP +1,000,000 once-only。加入保留後のレガシオン再加入も同順序。
- Validation: `tools/validation/validate-phase8f-jasper-alan-support.js`。

## 2026-08-15 Phase17 — 六精霊完了後／輪廻の結晶生成

- Approved source: `docs/scenario/55_CYCLE_CRYSTAL_RITUAL_APPROVED_IMPLEMENTATION_20260815.md`。
- 六精霊完了直後の旧「オクタプリズマ」即時授与を廃止。六片が呼び合う描写の後、結晶樹の秘跡へ戻す。
- `CRYSTAL_TREE` のミネルバへ `cycle_crystal_ritual_phase17` stateを追加。六精霊完了＋未生成時だけ循環の儀を起動する。
- ミネルバ主導で `水→風→光→火→雷→闇→水` を循環。ルーナ／焼け焦げたペンダント／リュシオンの残した神性が共鳴し、Item `701008`「輪廻の結晶」を生成する。
- `ABYSS_CYCLE_CRYSTAL_CREATE` と `App.createCycleCrystalFromRitual()` を正規生成入口とする。
- 旧 `abyss_spirit_trials_octaprism_grant` / `octaprism*` は進行中save・戦闘再開互換のため内部名だけ維持し、完成品の即時grantには使わない。
- 旧Item 701008所持saveは生成済みとして補完し、儀式を強制再演しない。六精霊完了・未所持saveは結晶樹へ誘導。終焉の祭壇以降へ進行済みの古いsaveだけは進行不能防止のbackfillを行う。
- 終焉の祭壇の正規進入条件は `abyssIlluminaciaDefeated` + `abyssAllSpiritTrialsCleared` + `abyssCycleCrystalCreated`。
- ヴェグナシスは5柱のまま。撃破後に輪廻の結晶が終局統合陣へ対抗するsceneを挟んでからアゼルガラグ戦へ移行する。
- Validation: `development_notes/2026-08-15/validation/CYCLE_CRYSTAL_PHASE17_CHECK_20260815.js` 26/26 PASS、top-level JS 62/62 `node --check` PASS。

## 2026-08-15 Phase 18 Batch 1 — staged town NPCs

Phase 17本編接続完了後、ロードマップどおりPhase 18へ着手した。

### Runtime architecture

- `mapActors[].states[].when` で `stepMin / stepMax / subMin / subMax` を正式評価するよう `MapRegistry.isProgressEntryActive()` を拡張。
- 同一人物は固定 `actorId` を維持し、進行差分を `stateId` で切り替える。
- 任意同行者差分は既存の共通 `IF_ALLY` を再利用する。

### Batch 1

リュミナ村:
- `lumina_baker_01`: `before_cave / after_cave / later_revisit`
- `lumina_goat_boy_01`: `before_cave / after_cave`
- 少年の攻略後会話では、サラが現在パーティにいる時だけ任意反応を追加。

炎の里イグニシア:
- `ignisia_communal_kitchen_01`: `fire_unstable / fire_restored / later_revisit`
- `ignisia_bath_elder_01`: `during_crisis / after_clear`

既存NPC会話は改稿していない。新規会話だけを接続している。

### Validation

- `PHASE18_NPC_STAGE_BATCH1_CHECK_20260815.js`: 35/35 PASS
- Phase 17 Cycle Crystal regression: 26/26 PASS
- top-level JavaScript `node --check`: 62/62 PASS

次のPhase 18実装はカザリア／水上都市を優先し、MAP密度と本筋再訪タイミングを見ながら小分けに接続する。
