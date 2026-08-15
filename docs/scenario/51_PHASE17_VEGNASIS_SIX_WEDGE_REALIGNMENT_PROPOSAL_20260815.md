# PRISMA ABYSS — Phase17 ヴェグナシス六楔整合 proposal

Date: 2026-08-15  
Status: superseded — user confirmed five-wedge runtime as canon on 2026-08-15


> **User correction (2026-08-15):** 本proposalの六楔化案は不採用。ヴェグナシスは現行どおり五楔、ヴェルドは闇扱いを維持する。ジャスパーは災禍の根ジャゴレアで敗北した時点で深淵王から見限られ消滅しており、終焉の祭壇へ再登場させない。正本は `52_PHASE17_PRIEST_OPTIONAL_ALLY_SPIRIT_TRIAL_CANON_UPDATE_20260815.md` を優先する。

## 1. Finding

canon v8 §45.2–47.5 では、終焉の祭壇の六楔は次で固定されている。

1. 火: グラド
2. 水: シーリス
3. 風: エリシア
4. 雷: レナード
5. 光: ヴェルド
6. 闇: ジャスパー

深淵王はこの六楔をヴェグナシスへ強制統合し、六つを一体ずつ解放させること自体を儀式完成の工程に利用する。

現行runtimeのヴェグナシス戦は5体構成である。

- 302080 雷柱レナード
- 302081 風柱エリシア
- 302082 水柱シーリス
- 302083 火柱グラド
- 302084 闇柱ヴェルド

ジャスパーが構成員に入っておらず、ヴェルドも闇柱扱いになっている。
`ABYSS_VEGNASIS` も「五つの声」と説明している。

これは名称差ではなく、Phase17最終戦のゲーム構造と正本が食い違う箇所。

## 2. Battle runtime assumptions found

`battle.js` はlinked battle group自体は人数可変で処理しているが、ヴェグナシス専用演出には5体前提が残る。

- fall visual stageを0–4へ固定。
- fall scriptを `ABYSS_VEGNASIS_FALL_1` ～ `_5` へ固定。
- visual stageを `Math.min(4, fallCount)` へ固定。
- final stageを4へ固定。
- 最終一柱覚醒logが「四柱の力を取り込み」と固定。
- story側のfall/last-stand会話も5人分。

したがって6体目をmonsters.jsへ足すだけでは不十分。
戦闘途中の同時撃破、再開journal、最終一柱覚醒も6体前提で回帰確認する必要がある。

## 3. Canon-aligned target structure

### Six linked units

| Role | Existing source | Proposed battle role |
|---|---|---|
| 雷 | レナード | 雷柱レナード |
| 風 | エリシア | 風柱エリシア |
| 水 | シーリス | 水柱シーリス |
| 火 | グラド | 火柱グラド |
| 光 | ヴェルド | 光柱ヴェルド |
| 闇 | ジャスパー | 闇柱ジャスパー |

内部monster IDは既存302080–302084を維持する。`monsters.js` を監査した時点で 302085 は未使用のため、ジャスパー柱の第一候補を **302085** とする。既存IDを詰め直さない。

ヴェグナシスはshared visualを使うため、302085も `imageId:302080` を共有する案を第一候補とし、新規画像を必須にはしない。

### Important narrative distinction

- ヴェルドは本来の光そのものではなく、終局の「光楔」へ加工された存在。
- ジャスパーは本来の闇そのものではなく、混沌で「闇の役割」を模倣させた存在。
- この偽物同士を含む六つを固定すること自体が、深淵王の歪んだ統合。

会話で設定資料のように全部説明しない。
戦闘前は見た目・六つの声・ルーナの反応で分からせ、詳細は戦闘中の解放台詞へ分散する。

## 4. Jasper continuity problem

現行ではジャスパーを災禍の根で先に撃破する。
その後にヴェグナシスへ入れるには、「生き返った本人」と安易に扱わず、深淵王が残った混沌核／魂の残滓を終局楔へ加工したことを演出する必要がある。

### Recommended interpretation

ジャスパー戦で肉体・自律意思は敗北する。
深淵王は災禍の根に残った混沌化済みの術式核を回収し、ジャスパーの執着と記憶を残した「闇楔」としてヴェグナシスへ縫い付ける。

これにより:

- 先のジャスパー撃破が無意味にならない。
- 「また普通に復活した」印象を避けられる。
- 本人が他者を材料扱いしてきた末に、自分も材料へされる皮肉が成立する。
- ただし因果応報を説明台詞で言い切らない。

## 5. New dialogue draft — Jasper release

新規文なので草稿のみ先行する。

### `ABYSS_VEGNASIS_FALL_6` candidate

```text
ジャスパー：
「……式が、私を……材料に……？」

ジャスパー：
「違う……私は、作る側だ……。
私が……正しい形を……」
```

このままでは説明的なので、実装候補としてはさらに削る案を推奨。

### Shorter recommendation

```text
ジャスパー：
「……私が、材料……？」

ジャスパー：
「違う……私は――」
```

最後まで自己認識が追いつかない方が人物像に合う。
客観ナレーションで「因果応報だった」と補足しない。

## 6. Veld role correction

現行monster 302084は `vegnasisElement: 闇`, `vegnasisElementKey: dark`。
正本へ合わせる場合は光役へ変更が必要。

これは既存戦闘データの意味変更なので、六楔化と同じ承認単位で行う。
単独で先に変えない。

## 7. Cycle Crystal dependency

六楔化だけ先に完成させても、現行ではヴェグナシス撃破直後にそのままアゼルガラグ戦へ入る。
canon v8では最後の楔解放で六芒星が臨界へ達し、そこで輪廻の結晶が「固定された六つ」と拮抗する必要がある。

したがって最終的なPhase17改修単位は:

1. レガシオンでミネルバが六精霊巡礼を発案。
2. 六精霊試練。
3. 結晶樹で輪廻の結晶生成。
4. ヴェグナシスを六楔化。
5. 六楔解放で祭壇臨界。
6. 輪廻の結晶が拮抗。
7. アゼルガラグ戦。

この一連を分断してプレイヤーへ中途半端な正本を見せない。

## 8. Approval boundary

### New material that may be drafted now

- ジャスパー闇楔の新規戦闘データ案。
- 六番目のfall/last-stand会話。
- 六芒星臨界の新規演出。
- migration / validation design。

### Existing runtime that must not be changed without consultation

- `ABYSS_VEGNASIS` の「五つ」→「六つ」。
- ヴェルドの既存闇柱データ。
- 5体配列から6体配列への本戦変更。
- 最終一柱覚醒の既存player-facing battle log。
- オクタプリズマ関連既存本文と戦闘表示。

## 9. Implementation order after approval

1. 空きmonster ID／画像流用方針を確認。
2. `battle.js` の5体固定値を人数可変へ一般化。
3. ジャスパー柱を追加し、ヴェルドを光役へ整理。
4. six-wedge battle scriptを追加。
5. 輪廻の結晶の臨界介入eventを接続。
6. 同時撃破・敗北・battle resume・セーブ再開を検証。
7. 既存5体セーブ中断データがある場合の互換を確認。

## 10. Review result

- Character voice separation: 5
- On-screen readability: 5
- Spoiler discipline: 5
- Lived-in world detail: 4
- Exposition control: 5
- Foreshadowing subtlety: 5
- Flag/party awareness: 5
- Existing dialogue handling: 5
- Player interpretation boundary: 5
- Implementation readiness: 4

Required before runtime implementation:
- user decision on legacy five→six battle conversion and cycle-crystal realignment.

