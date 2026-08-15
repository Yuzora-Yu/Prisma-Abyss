# PRISMA ABYSS — Phase17 六精霊巡礼導入 / レクスノート邸外ハヤテ演出

Date: 2026-08-15  
Status: Hayate runtime approved / Phase17 new dialogue drafted / legacy revisions on hold  
References:
- `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
- `canon/PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md`
- `docs/canon_update_20260809/PRISMA_DEVELOPMENT_ROADMAP_v2.md`
- `docs/scenario/06_SCENARIO_REVIEW_CHECKLIST.md`
- `development_notes/2026-08-15/handoff/PRISMA_ABYSS_HANDOFF_20260815.md`

## 1. Scope

ロードマップ本筋を優先し、今回は以下を扱う。

1. レクスノート邸外のハヤテ初見演出を、ユーザー指定どおり会話＋消失演出へ更新する。
2. Phase17「六精霊・輪廻の結晶・終章」のうち、レガシオン到達後にミネルバが六精霊巡礼を発案する工程をruntimeへ追加する。
3. 既存の「オクタプリズマ」即時生成本文は、既存テキスト修正に該当するため今回は変更しない。
4. NPCの `placementId / actorId / stateId` による段階管理は、新規配置でも継続使用する。

---

# 2. レクスノート邸外 — ハヤテ

## 2.1 User-approved staging

既存の完全無言flag-only処理を次へ変更する。

1. 邸外でハヤテへ話しかける。
2. ハヤテが一言だけ発する。
3. `assets/effect/fx-abyss-vortex-ai.png` をハヤテの位置へ重ねる。
4. ハヤテが消える。
5. ガイルが一言だけ反応する。
6. 二度目以降はハヤテを配置しない。

## 2.2 Script

### `HAYATE_REXNOTE_SIGHTING`

```text
ハヤテ：
「・・・・・・」
```

直後、渦エフェクトを表示。

### `HAYATE_REXNOTE_AFTER_SIGHTING`

```text
ガイル：
「ん、誰かいたのか？」
```

### Notes

- ハヤテはこの時点でアルス達へ説明しない。
- 正体を隠すための大仰な忍術説明は入れない。
- ガイルも「ハヤテだった」等の正解へ到達しない。
- エフェクトは闇属性の正体説明ではなく、視覚上の消失表現として使う。

---

# 3. Phase17 — レガシオンから六精霊巡礼へ

## 3.1 Existing gap

現行runtimeでは、レガシオンの神官 `ABYSS_LEGACION_PRIEST` が地上の六プリズムを訪ねる可能性を示し、`abyssSpiritPrismKnown` を立てる。

正本では、その知見を受けたミネルバが、深淵の混沌へ正常な属性循環を持ち込むため六精霊巡礼を発案する。

既存神官会話は修正せず、その後段としてミネルバを追加する。

## 3.2 New actor state

Area: `LEGACION_TEMPLE`  
Actor: ミネルバ ID206  
Placement ID: 2  
Actor ID: `minerva_spirit_pilgrimage_phase17`

### State A — start

Conditions:
- required: `abyssSpiritPrismKnown`
- missing: `abyssSpiritPilgrimageStarted`

Action:
- `abyss_spirit_pilgrimage_start_phase17`

### State B — underway

Conditions:
- required: `abyssSpiritPilgrimageStarted`
- missing: `abyssAllSpiritTrialsCleared`

Action:
- `abyss_spirit_pilgrimage_reminder_phase17`

## 3.3 New dialogue — start

### `ABYSS_SPIRIT_PILGRIMAGE_START_PHASE17`

```text
ミネルバ：
「神官の話、聞いた？」

ミネルバ：
「ここの魔力、六属性が混ざりすぎてる。
この底でほどこうとすると、また別の混ざり方をする。」

ガイル：
「じゃあ、どうすんだよ。」

ミネルバ：
「地上へ戻る。」

ミネルバ：
「火も水も風も、こっちじゃなくて本来の場所で生きてる。
まず六つとも、ちゃんと別々に会ってくる。」

ガイル：
「会うって……精霊に？」

ミネルバ：
「たぶん。」

ミネルバ：
「返事してくれるかは知らない。
殴られるかもしれないし。」

ガイル：
「そこ先に言えよ！」

ミネルバ：
「でも、六つを一つに潰す方法を探すよりはまし。」

ミネルバ：
「別々のまま力を貸してもらえるか、確かめよう。」
```

### Scene intent

- ミネルバは完成済みの答えを講義しない。
- 現場観察から「深淵内で無理にほどかない」「地上の正常状態を見る」という仮説を立てる。
- 循環の儀の完成形はこの時点では説明しない。
- ガイルを質問役にするが、説明装置にはしない。

## 3.4 New dialogue — reminder

### `ABYSS_SPIRIT_PILGRIMAGE_REMINDER_PHASE17`

```text
ミネルバ：
「全部いっぺんに考えなくていいよ。」

ミネルバ：
「地上のプリズムを一つずつ回る。
向こうが話を聞いてくれたら、その先を考える。」
```

## 3.5 Runtime condition change

六精霊試練の出現条件は、従来の `abyssSpiritPrismKnown` から `abyssSpiritPilgrimageStarted` へ移す。

既存saveについては、以下のいずれかならmigrationで開始済み扱いにする。

- いずれかの六精霊試練記録が存在する。
- `abyssAllSpiritTrialsCleared` が成立済み。
- Item 701008を所持済み。

単に神官へ話しただけの旧saveは、ミネルバへ一度話すことで新導線へ入る。

---

# 4. Hold point — 輪廻の結晶

以下は既存実装テキストの修正を伴うため今回runtimeへ反映しない。

- `ABYSS_SPIRIT_TRIAL_ALL_COMPLETE` の即時授与構造変更。
- Item 701008 `オクタプリズマ` → `輪廻の結晶`。
- `battle.js` / `item_runtime.js` の既存player-facing文変更。
- 結晶樹での循環の儀への置換。

既存案は `44_CYCLE_CRYSTAL_RITUAL_REALIGNMENT_PROPOSAL_20260815.md` に保持する。

---

# 5. Review result

Target: Hayate Rexnote staging / Phase17 pilgrimage start  
Reviewer: Codex  
Date: 2026-08-15

### Scores
- Character voice separation: 5
- On-screen readability and dialogue rhythm: 5
- Spoiler discipline: 5
- Lived-in world detail: 4
- Exposition control: 5
- Foreshadowing subtlety: 5
- Flag and party awareness: 4
- Existing dialogue handling: 5
- Player interpretation / information boundary: 5
- Implementation readiness: 5

### Required fixes before implementation
- ハヤテ演出はユーザー明示指定のためruntime反映可。
- ミネルバ巡礼導入は新規文として草稿完了。repo運用上、runtime接続はユーザー確認後に行う。

### User approval required
- ミネルバ巡礼導入のruntime接続。
- Existing octaprism/cycle-crystal text replacement remains on hold.

### Recommendation
- Implement Hayate staging now.
- Keep Minerva pilgrimage start implementation-ready, but do not connect it to runtime until confirmed.
- Keep the cycle-crystal replacement as the next explicit text-revision gate.
