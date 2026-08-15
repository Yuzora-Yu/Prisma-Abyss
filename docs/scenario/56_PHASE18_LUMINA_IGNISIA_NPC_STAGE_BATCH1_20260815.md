# Phase 18 — リュミナ村／イグニシア 段階NPC実装 Batch 1

Date: 2026-08-15  
Status: approved new-text material / runtime implementation source  
Roadmap: Phase 18「全地域NPC／日記／再訪差分」開始

## 1. 実装方針

Phase 18 の最初の接続単位として、既存NPCの台詞を修正せず、ユーザー確認済みの新規草稿から4名だけを接続する。

- `NPC-LUMINA-NEW-01` / `lumina_baker_01` — パン焼きの女
- `NPC-LUMINA-NEW-02` / `lumina_goat_boy_01` — 山羊を探す少年
- `NPC-IGNISIA-NEW-01` / `ignisia_communal_kitchen_01` — 共同炊事場の番人
- `NPC-IGNISIA-NEW-02` / `ignisia_bath_elder_01` — 湯屋の老人

同一人物は一つの `actorId` を維持し、進行差分は `stateId` で切り替える。人物のafter版を別actorとして増やさない。

## 2. 共通runtime拡張

`MapRegistry.isProgressEntryActive()` に以下の段階条件を正式対応させる。

- `stepMin`
- `stepMax`
- `subMin`
- `subMax`

これにより `mapActors[].states[].when` でも、既存の `mapActions[].events` と同じ語彙で本編進行段階を指定できる。

任意仲間の短い差分は、Phase 17 で実装済みの `IF_ALLY` を再利用する。今回、リュミナ村の少年の洞穴攻略後会話で、サラが現在パーティにいる時だけ短い返答を挟む。

## 3. リュミナ村

### 3.1 パン焼きの女

Profile ID: `NPC-LUMINA-NEW-01`  
actorId: `lumina_baker_01`  
placementId: `5`

#### `before_cave`
Condition: `stepMax: 1`

```text
パン焼きの女：
「朝の分はもうないよ。昼なら、端っこを残せる」

パン焼きの女：
「旅に出るなら食べておきな。
腹が空いた勇者なんて、ただの機嫌の悪い若者だよ」
```

#### `after_cave`
Condition: `stepMin: 2, stepMax: 2`

```text
パン焼きの女：
「穴の騒ぎが収まったって？」

パン焼きの女：
「じゃあ明日は、粉を多めに練る。
祝いじゃないよ。修理の連中が食うんだ」
```

#### `later_revisit`
Condition: `stepMin: 3`

```text
パン焼きの女：
「おや。顔つきが旅人になったね」

パン焼きの女：
「……村の味が恋しい、とか言うなよ。
こっちは塩を減らしたの、まだ誤魔化してるんだから」
```

### 3.2 山羊を探す少年

Profile ID: `NPC-LUMINA-NEW-02`  
actorId: `lumina_goat_boy_01`  
placementId: `6`

この少年は洞穴崩落と山羊の失踪を結びつけ、「洞穴は鈴を嫌う」という誤った因果を信じている。悪意や設定説明ではなく、怖い経験から子どもが組み立てた説明として扱う。

#### `before_cave`
Condition: `stepMax: 1`

```text
少年：
「山へ行くなら、鈴は外した方がいいよ」

少年：
「ミルの鈴だけ、切れて落ちてたんだ。
穴のやつ、鈴の音が嫌いなんだと思う」
```

#### `after_cave`
Condition: `stepMin: 2`

```text
少年：
「ミル、帰ってきた」

少年：
「鈴はなくしたけど、本人は平気そう。
……穴が返してくれたのかな」
```

サラが現在パーティにいる場合のみ続ける。

```text
サラ：
「迷って、戻ってきたのかもしれませんね」

少年：
「そっか。じゃあミル、道を覚えたんだ」
```

サラは設定上の正解を教えるのではなく、少年が自分で受け止められる別の可能性を一つ置くだけにする。

## 4. 炎の里イグニシア

### 4.1 共同炊事場の番人

Profile ID: `NPC-IGNISIA-NEW-01`  
actorId: `ignisia_communal_kitchen_01`  
placementId: `5`

#### `fire_unstable`
Condition: `missingFlag: fireVillageCleared`

```text
炊事番：
「鍋に近づくな。さっきまで弱火だったのに、急に蓋が跳ねた」

炊事番：
「今日の豆は半煮えだ。
文句は火山に言っとくれ。順番は変えないよ」
```

#### `fire_restored`
Condition: `requiredFlag: fireVillageCleared, stepMax: 3`

```text
炊事番：
「火が戻った？　見りゃ分かるよ。
鍋底を二つ焦がした」

炊事番：
「嬉しいさ。嬉しいけどね、
加減を忘れた手まで一晩で戻るわけじゃない」
```

#### `later_revisit`
Condition: `requiredFlag: fireVillageCleared, stepMin: 4`

```text
炊事番：
「今日は煮込み。明日は焼き物」

炊事番：
「普通の献立を考えるの、こんなに面倒だったかね。
……まあ、悪くない面倒だ」
```

### 4.2 湯屋の老人

Profile ID: `NPC-IGNISIA-NEW-02`  
actorId: `ignisia_bath_elder_01`  
placementId: `6`

老人は「石へ水をひと匙やる」古い作法が山を鎮めると信じている。実際には急加熱を避ける経験則として意味があったため、本人の人生では相関が何度も成立しており、単なる迷信家として扱わない。

#### `during_crisis`
Condition: `missingFlag: fireVillageCleared`

```text
湯屋の老人：
「若いのは、すぐ火を急かす」

湯屋の老人：
「昔は湯を通す前に、石へ水をひと匙やった。
笑うからこうなる。山にも機嫌ってもんがある」
```

#### `after_clear`
Condition: `requiredFlag: fireVillageCleared`

```text
湯屋の老人：
「ほら見ろ。水をやったら静かになった」

里の若者：
「プリズムが戻った日と同じ日だろ」

湯屋の老人：
「二つ効いたんだよ。年寄りの顔を立てろ」
```

ここで真相解説を差し込まない。老人は間違っているが、古い作法自体が無意味だったわけではない。

## 5. 配置方針

- リュミナ村は重要出口・店・長老の進路から外す。
- イグニシアは火山入口、店、宿、カリン、里長の導線を塞がない。
- 4名とも新規会話専用で、メイン進行条件や報酬は持たせない。
- NPC追加がメイン導線の視認性を落とす場合は、人数を増やすより配置を見直す。

## 6. 既存文変更境界

今回、既存会話本文の置換・削除・意味変更は行わない。
新規NPC4名の追加、段階条件の共通runtime対応、サラの新規任意差分のみを実装する。

## 7. Review checklist

| Criterion | Score | Note |
|---|---:|---|
| Character voice | 5 | 職業・年齢・経験から語彙を分ける |
| Gameplay readability | 5 | 重要ヒントや進行flagを持たせない |
| World-life balance | 5 | 食事・山羊・湯屋を本編事件の余波へ接続 |
| Imperfect knowledge | 5 | 少年と老人に背景付きの誤認を持たせる |
| Optional ally logic | 5 | `IF_ALLY` の再利用でサラ差分を分離 |
| State continuity | 5 | actorId固定、stateIdで段階管理 |
| Existing text safety | 5 | 既存会話を改稿しない |
| Runtime readiness | 5 | MAP座標と条件を小規模batchで検証する |

