# 44_CYCLE_CRYSTAL_RITUAL_REALIGNMENT_PROPOSAL_20260815

Status: **proposal / user approval required**  
Date: 2026-08-15  
Target: 六精霊試練完了 → 結晶樹の秘跡 → 輪廻の結晶生成  
Legacy source: `30_PENDANT_OCTAPRISM_RESONANCE_APPROVED_20260804.md`  
Current canon override: `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md` §47


## Canon terminology note

`PRISMA_SCENARIO_CANON_MASTER_v8.md` は §5 / §22.15 で「焼け焦げたペンダント」を正本化している一方、§47.4だけ「焼け焦げたネックレス」と表記が揺れている。また、正式Character ID501は「リュシオン」だが、輪廻の結晶追補の一部に「ルシオン」が混在する。

今回のproposalでは、既存専用章・runtimeとの整合を優先して **焼け焦げたペンダント / リュシオン** を使用する。canon本文の機械修正はユーザー判断まで行わない。

---

## Area

- 六精霊試練の最終地点
- 結晶樹の秘跡 `CRYSTAL_TREE / MAP000073`

## Story timing

- 深淵編で六精霊巡礼を完了した直後。
- 六つの結晶片を所持している。
- 最終決戦前。

## Required flags / items

Current compatibility keys are preserved:

- six spirit trial clear flags
- `abyssOctaprismGrantPending`（互換上の内部キーとして当面維持）
- `abyssOctaprismGrantEventSeen`
- Item 701008（player-facing名のみ将来「輪廻の結晶」）
- Item 701009 焼け焦げたペンダント
- Item 701010 光結晶のペンダント

新規flag案:

- `cycleCrystalReturnBriefed`
- `cycleCrystalRitualSeen`

※新規flag名は実装時に最終監査する。既存 `abyssOctaprism*` を削除・renameしない。

## Party assumptions

- アルス
- ルーナ
- ミネルバが結晶樹側で儀式を主導できる状態
- 他の同行仲間は任意

## Known facts

- 六属性は統合ではなく循環によって世界を支える。
- 六精霊はアルスたちを認め、結晶片を託した。
- 深淵の「統合」へ対抗するには地上側の正常な循環が必要。
- 焼け焦げたペンダントには5年前から説明し切れていない痕跡がある。

## Hidden facts not to over-explain

- リュシオンが最初から完成回答を用意していたようには描かない。
- 神が人間へ「正解」を授けた構図にしない。
- 六属性が融合して第七属性になるわけではない。
- 内部state名、戦闘支援仕様、混沌耐性90%などの実装値を会話で説明しない。

## Scene purpose

1. 六精霊巡礼を「アイテム即時授与」で終わらせず、結晶樹へ帰還する目的を作る。
2. ミネルバを循環理論の到達者・実行者として立てる。
3. ルーナと焼け焦げたペンダントを、神性の残響へ繋ぐ。
4. リュシオンは人間の到達した答えへ立ち会う存在に留める。
5. 「輪廻の結晶」が統合の対極であることを、説明過多にせず成立させる。

---

## Current implemented lines

`story.js / ABYSS_SPIRIT_TRIAL_ALL_COMPLETE`

```text
システム：
六つの結晶片が一斉に震え、胸元の焼け焦げたペンダントが熱を帯びた。

システム：
黒く焼けた表面から、細かな煤がほどけていく。
その奥で、懐かしい温もりに似た光が脈打った。

リュシオン：
……ようやく、届きました。

リュシオン：
六つの加護が、その小さな光を呼び覚ましたのです。
あなたが失わずにいたものへ、私の声もまた届く。

リュシオン：
深淵の混沌へ抗う時、その光は六精霊の道を結びます。
受け取りなさい――オクタプリズマを。

システム：
焼け焦げたペンダントは、澄んだ光を宿す結晶へと姿を変えた。
光結晶のペンダントと、オクタプリズマを手に入れた！
```

### Concern

この本文は2026-08-04時点では承認済みだったが、
後発のcanon v8 §47で生成主体・場所・意味が更新された。

最大の問題は名称だけではなく、
**六精霊巡礼の直後にリュシオンが完成品を即時授与する構造**が、
「ミネルバの循環理論へ神が立ち会う」という最新正本と衝突する点。

---

# Proposed scene structure

## Scene A — 六番目の精霊戦直後

目的は「完成」ではなく「六片が揃った」ことだけ見せる。

### Draft

```text
システム：
六つ目の結晶片が、他の五つに応えるようにかすかに震えた。

ルーナ：
……重なろうとしているんじゃない。
呼んでる……次へ渡すみたいに。

アルスたちは六つの結晶片を持ち、結晶樹の秘跡へ戻ることにした。
```

- リュシオンはまだ出さない。
- ペンダントもまだ変化させない。
- Item 701008はまだ付与しない。

## Scene B — 結晶樹、ミネルバの準備

### Character voice notes

**ミネルバ**
- 研究者。理論・実験に強い。
- 神秘を最初から神秘として飲み込まず、観測して考える。
- 故郷喪失を「何が起きたか証明する」方向へ処理してきた。
- 完成答案を神へ求めない。

**ルーナ**
- 神性はあるが、自分を万能な答え役にしない。
- 感覚・身体反応で先に異変へ気づく余地を持つ。
- 教団由来の聖女口調だけに均一化しない。

**リュシオン**
- 人間へ都合の良い奇跡を無条件に与えない。
- 今回はミネルバの到達を承認・補助する側。

### Draft

```text
ミネルバ：
そこ。六つとも置いて。
くっつけないで。円にする。

ミネルバ：
水の次に風。風の次に光。
火、雷、闇――それで、水へ戻す。

ミネルバ：
一つにするんじゃない。
一つが退いた場所を、次が受け取る。
……たぶん、世界はずっとそうやって保ってた。

ルーナ：
きれい……。
でも、止まってない。光がずっと巡ってる。

ミネルバ：
止めたら駄目なんだと思う。
六つ全部を同じ場所へ縛りつけたら――それは、あの「統合」と同じになる。
```

※最後の1行は説明量が高めなので、実装前に削る案も有力。

## Scene C — ペンダント共鳴

```text
システム：
六つの光が円を巡った瞬間、アルスの胸元で乾いた音がした。

システム：
焼け焦げたペンダントの表面から、黒い煤がひとひら落ちる。

ルーナ：
アルス……それ。

ルーナが手を伸ばしかけ、触れる前に指を止めた。

ルーナ：
……あたたかい。
前にも、この光を――
```

- ルーナが全部を思い出す場面にはしない。
- 身体記憶・感覚で止める。

## Scene D — リュシオン一時顕現

```text
リュシオン：
……そこまで辿り着いたのですね。

ミネルバ：
答え合わせをしに来たなら、遅いわよ。
もう回し始めた。

リュシオン：
ええ。
だから、私は止めに来たのではありません。

リュシオン：
異なるものを、異なるまま次へ渡す。
その輪が途切れぬよう――残った光を、お返ししましょう。
```

- リュシオンが理論を講義しない。
- ミネルバの到達が先。
- 神は「完成品を授ける」のでなく、ペンダントに残った神性の痕跡を返す／支える。

## Scene E — 輪廻の結晶生成

```text
システム：
ペンダントからほどけた淡い光が、六つの結晶片の輪へ溶け込んだ。

システム：
六色は混ざらない。
水から風へ、風から光へ――絶えず色を渡しながら、一つの結晶の中を巡り続けている。

ミネルバ：
……できた。
融合じゃない。中で、ずっと順番を譲ってる。

ルーナ：
輪廻の……結晶。

システム：
「輪廻の結晶」を手に入れた。
```

名称をルーナに言わせるか、ミネルバに言わせるかはユーザー判断対象。
名称誕生の唐突さを避けるなら、先にミネルバが研究上の仮称として「輪廻」と呼んでいた差分を置く手もある。

---

# Conditional variants

## 旧セーブでItem 701008所持済み

- 進行を巻き戻さない。
- Itemを二重付与しない。
- 新しい儀式eventを強制再生しない。
- 必要なら回想／記録閲覧として後から追加するが、別判断とする。

## 焼け焦げたペンダント状態がmigration済み

- Item 701010所持済みなら、701009を復活させない。
- 旧migrationの結果を壊さず、儀式演出用の表示状態だけ別管理する案を優先。

---

# Player-facing current / proposal review

| Target | 現行 | 修正案 |
|---|---|---|
| Item 701008 name | オクタプリズマ | 輪廻の結晶 |
| Item 701008 desc | 六つの大精霊と光の神の加護を宿す結晶。所持していると、深淵王アゼルガラグとの戦いで真価を発揮する。 | 六つの属性が互いへ役割を渡し続ける循環を封じた結晶。深淵の「統合」に抗う力を秘める。 |
| battle activation | オクタプリズマが六精霊の道を開き、主人公の混沌属性耐性を90%まで高めた！ | 輪廻の結晶が巡り、六精霊の加護がアルスを混沌から守る！ |
| battle fallback | オクタプリズマが輝き、六精霊が戦いを見守っている。 | 輪廻の結晶の六色が巡り、精霊たちの気配が戦場を満たした。 |
| battle item message | オクタプリズマは使用せず、所持しているだけでアゼルガラグ戦を支援する。 | 輪廻の結晶は道具として使うものではない。六つの光は、深淵王との戦いで巡り続ける。 |

battle item messageは、現行UI上そもそも到達しない可能性があるため、
実装時に到達性を確認し、不要なら文言改稿ではなくdead branch整理も検討する。

---

# Implementation notes

承認後の推奨実装:

1. `story.js`
   - 六精霊試練完了eventから即時grantを外す。
   - 結晶樹帰還briefingを追加。
   - 循環の儀script/eventを追加。

2. `story_logic.js`
   - 六片完了とItem 701008 grantを分離。
   - 既存 `ABYSS_SPIRIT_TRIAL_GRANT_OCTAPRISM` は互換入口として残すか、内部actionだけalias化。

3. `main.js`
   - 既存migrationを削除しない。
   - 新migrationは「旧所持者を巻き戻さない」方向のみ。

4. `items.js`
   - ID 701008維持、表示名・説明だけ更新。

5. `abyss_content.js`
   - `octaprismItemId`, `OCTAPRISM_SUPPORT_MASTER` は当面維持。
   - コメントだけcanon用語へ更新可能。

6. `battle.js`
   - 内部function/state名は維持。
   - player-facing logのみ承認後に更新。

7. `item_runtime.js`
   - player-facing message更新または到達性確認後に整理。

8. `news.js`
   - runtime反映日に同日既存レコードへ統合。

---

## Review result

Target: 輪廻の結晶生成ルート再構成  
Reviewer: ChatGPT / Codex-compatible review  
Date: 2026-08-15

### Scores

- Character voice separation: 4
- On-screen readability and dialogue rhythm: 4
- Spoiler discipline: 5
- Lived-in world detail: 3
- Exposition control: 4
- Foreshadowing subtlety: 4
- Flag and party awareness: 4
- Existing dialogue handling: 5
- Player interpretation / information boundary: 4
- Implementation readiness: 4

### Required fixes before implementation

- ミネルバの「統合」説明1行を残すか削るか最終判断。
- 「輪廻の結晶」という命名者をミネルバ／ルーナのどちらにするか決定。
- 旧セーブで既にItem 701008取得済みの場合、新儀式を未体験扱いしないmigration仕様をコード化。
- 結晶樹への戻り導線とevent位置を現行MAP actor配置に合わせて確定。

### User approval required

- 旧承認済み `30_PENDANT_OCTAPRISM_RESONANCE_APPROVED_20260804.md` を、この新構造で置き換えること。
- 上記新規台詞。
- Item 701008のplayer-facing名称／説明。
- battle / item runtimeのplayer-facing文言。

### Recommendation

**revise/approve first; do not implement runtime yet.**
