# PRISMA ABYSS

## 会話・Relationship・戦闘演出 強化方針案 v3

---

# 1. 全体方針

今後の演出強化は、以下の2軸で進める。

1. **会話システム・キャラクター関係性の大幅強化**
2. **戦闘エフェクトの大幅強化**

PRISMA ABYSSでは、戦闘・育成・探索だけでなく、

**「仲間と旅をすることそのもの」**

をゲーム体験の大きな柱とする。

そのため会話は単なるストーリー表示ではなく、

* キャラクターの表情
* キャラクター同士の距離
* プレイヤーの選択
* パーティ編成
* 共闘
* キャラクエスト
* プレゼント
* Relationship

が互いに接続するシステムとして設計する。

---

# 第1軸

# 会話システムの大幅強化

---

# 2. 会話画面の基本コンセプト

会話画面を、

**左右2スロットを持つ簡易ADVステージ**

として扱う。

画面上には、

```text
LEFT PORTRAIT     RIGHT PORTRAIT
```

の2つの立ち絵スロットを持つ。

会話Runtimeは左右それぞれについて、

```js
{
    charId,
    face,
    visible,
    depthState
}
```

を保持する。

各セリフごとに左右両方を再指定する必要はない。

直前状態を保持し、変更が指定された部分だけ更新する。

---

# 3. 正式な表情差分

会話用立ち絵の表情キーは以下の6種類を正式仕様とする。

```text
normal
happy
sad
shout
angry
defeated
```

---

## normal

基本表情。

用途：

* 通常会話
* 説明
* 冷静な発言
* 判断に迷う場合
* 特に強い感情がない場面

---

## happy

用途：

* 喜び
* 安心
* 親愛
* 感謝
* 軽い笑顔
* 楽しい会話

---

## sad

用途：

* 悲しみ
* 不安
* 心配
* ためらい
* 寂しさ
* 静かなショック

---

## shout

用途：

* 大声
* 驚き
* 必死な呼びかけ
* 強い感情の噴出
* 戦闘中または緊迫時の叫び

---

## angry

用途：

* 怒り
* 苛立ち
* 敵意
* 強い拒絶
* 激しい決意

---

## defeated

**原則として戦闘敗北・敗北イベント専用。**

用途：

* 戦闘敗北直後
* 敗北イベント後
* 敵に完全に打ちのめされた場面
* 重傷状態
* 戦闘不能から意識を取り戻した直後

通常の日常会話で、

```text
落ち込んでいる
気まずい
少し疲れた
悲しい
```

程度の理由では使用しない。

その場合は `sad` または `normal` を使用する。

`defeated` は希少な状態として扱い、使用時の印象を維持する。

---

# 4. 会話データ

基本形：

```js
{
    charId: 401,
    name: "ルーナ",

    side: "right",
    face: "sad",
    bounce: false,

    text: "……アルス。"
}
```

---

# 5. 非話者の立ち絵操作

話者以外の人物も任意に変更可能にする。

```js
{
    charId: 301,
    name: "アルス",
    side: "left",
    face: "normal",

    portraitChanges: {
        right: {
            charId: 401,
            face: "sad",
            visible: true
        }
    },

    text: "無理に話さなくていい。"
}
```

これにより、

**聞き手のリアクションを台詞中に表現できる。**

---

# 6. 話者と非話者の前後表現

通常会話では、

```text
話者
→ foreground

非話者
→ background
```

とする。

目安：

### foreground

```text
scale       1.00
translateY  0
brightness  1.00
```

### background

```text
scale       0.94～0.97
translateY  +6～10px
brightness  0.85～0.92
```

話者変更時は、

```text
150～220ms
```

程度で滑らかに前後を切り替える。

---

# 7. 発言開始モーション

必要な台詞のみ、

```js
bounce: true
```

を設定できる。

話者の立ち絵を軽く上下させる。

目安：

```text
6～10px
120～200ms
```

用途：

* 強い呼びかけ
* 驚き
* 会話への割り込み
* 感情の強調

毎台詞には使用しない。

---

# 8. システム・ナレーション

システム文表示時も、左右立ち絵を制御可能にする。

```js
{
    speaker: "system",
    portraitMode: "dim",

    text: "二人の間に、短い沈黙が落ちた。"
}
```

使用可能なモード：

```text
focus
dim
keep
hide
```

---

## focus

通常の話者前景状態。

---

## dim

左右両方を少し後ろへ下げ、暗くする。

ナレーションや心理描写の基本モード。

---

## keep

直前状態を変更しない。

---

## hide

左右の立ち絵を消す。

時間経過、場所転換、過去回想への移行などに使用。

---

# 9. システム文中の表情変化

可能とする。

例：

```js
{
    speaker: "system",
    portraitMode: "dim",

    portraitChanges: {
        right: {
            face: "sad"
        }
    },

    text: "ルーナは、わずかに視線を落とした。"
}
```

これにより、

**台詞を発していない人物にも芝居をさせる。**

---

# 10. AUTO機能

AUTOでは、

```text
文字送り完了
↓
読了待機
↓
次の行
```

を自動化する。

待機時間は本文量に応じて変化させる。

目安：

```text
基本 500ms
+
1文字あたり 25～35ms
```

AUTOは以下で停止する。

* 主人公選択肢
* その他の選択肢
* 戦闘開始
* MAP移動
* 特殊な操作イベント
* ユーザーによる解除

---

# 11. SKIP機能

SKIPは会話イベントを削除する機能ではない。

**イベント処理を維持したまま超高速再生する。**

SKIP中：

* 文字送りをほぼ即時化
* 行間待機を極端に短くする
* 前後transitionを高速化
* bounceを短縮または省略
* ナレーションも高速化

ただし、

* フラグ
* Relationship変化
* クエスト処理
* キャラクター加入
* アイテム取得
* ストーリー進行

などは通常通り処理する。

選択肢では必ず停止する。

---

# 12. 主人公アルスの会話

原則として、

**アルスの能動的な発言・心理的反応はプレイヤー選択式に変更する。**

例：

ルーナが無理をしている場面。

```text
「無茶するな。まだ本調子じゃないだろ」

（……また、いなくなるんじゃないかと思ってしまう）
```

のように、

* 実際に発言する
* 心の中に留める

といった差も選択肢にできる。

---

# 13. 主人公の人格

主人公を無個性化しない。

選択肢は、

**「アルスならどの反応を選ぶか」**

の範囲に収める。

例：

```text
率直に心配する
ぶっきらぼうに心配する
冗談で誤魔化す
黙って寄り添う
厳しく止める
```

等。

善人／悪人を選ぶシステムにはしない。

---

# 14. 会話分岐

基本的には短い分岐とする。

```text
            ┌ A → 数行
共通会話 ──┤
            └ B → 数行
                  ↓
                 合流
```

大量の完全分岐シナリオは必須としない。

ただし選択の結果は、

* Relationship
* 特殊フラグ
* 後の台詞
* 関係イベント

などに残すことができる。

---

# 15. Relationship基本仕様

Relationshipは、

**キャラクターAとキャラクターBの間に1つだけ存在する共有値**

とする。

有向値にはしない。

---

# 16. Relationship API

内部では必ずペアIDを正規化する。

例えば、

```js
Relationship.get(201, 207);
Relationship.get(207, 201);
```

は完全に同じ値を返す。

内部キー例：

```text
201:207
```

必ず小さいIDを先頭にする。

---

# 17. Relationship値域

推奨：

```text
-100 ～ 100
```

とする。

通常の仲間関係では、

```text
0以上
```

を基本とする。

強い敵意・確執のある特殊な組み合わせのみ負数開始を許可する。

例：

```text
レオン : ジョセフ = -30
```

等。

---

# 18. 初期値

初期値はユーザーがキャラクター関係に応じて設定する。

全組み合わせを記述する必要はない。

例：

```js
RELATIONSHIP_INITIAL = {
    "301:401": 60,
    "201:207": -30,
    "101:105": 20
};
```

未登録ペアは、

```text
0
```

をデフォルトとする。

---

# 19. Relationship上昇要因

主な要因：

* 同一PTでの戦闘
* ストーリー進行
* キャラクタークエスト
* 特定MAPイベント
* 主人公の選択肢
* 特殊会話
* プレゼント

---

# 20. 同一PTによるRelationship上昇

同じパーティで戦った仲間同士には、

```text
Bond EXP
```

を蓄積する。

例：

```text
同一PTで戦闘勝利
→ Bond EXP +1

15 Bond EXP
→ Relationship +1
```

とする。

Relationshipを毎戦直接+1しない。

---

# 21. Relationshipイベント

基本閾値：

```text
20
40
60
80
100
```

を目安にする。

ただし、すべてのキャラクターペアにイベントを作る必要はない。

イベントが存在するペアだけ登録する。

---

# 22. 閾値イベントの判定

「Relationshipが40になった瞬間」ではなく、

```text
Relationship >= 40
AND
40イベント未読
AND
その他条件を満たしている
```

なら発生可能とする。

これにより、

```text
38 → 43
```

のように一度に閾値を超えてもイベントを取り逃さない。

---

# 23. Relationshipイベント条件

数値以外に、

* ストーリー進行
* キャラ加入
* MAP到達
* クエスト状態
* 両者のパーティ参加
* 特定イベント既読

などを条件化可能にする。

---

# 24. 主人公専用プレゼントシステム

主人公アルスのみ、

**仲間へプレゼントを渡す**

ことができる。

プレゼントは、

```text
アルスと対象キャラクターのRelationship
```

を上昇させる。

他キャラクター同士でプレゼント交換を行うシステムにはしない。

---

# 25. プレゼント基本フロー

```text
仲間を選択
↓
プレゼントを選択
↓
相手の反応
↓
Relationship上昇
↓
お礼会話
```

---

# 26. プレゼントアイテム

既存アイテムとは別カテゴリでも、既存アイテムにタグを追加する方式でもよい。

推奨：

```js
{
    id: 9001,
    name: "花の髪飾り",

    gift: true,

    giftCategory: "accessory"
}
```

等。

---

# 27. キャラクターごとのプレゼント嗜好

各キャラクターに、

```text
favorite
like
neutral
dislike
```

程度の分類を設定可能にする。

例：

```js
GIFT_PREFERENCES = {
    401: {
        favorite: ["flower", "sweet"],
        like: ["accessory"],
        dislike: ["alcohol"]
    }
};
```

---

# 28. Relationship上昇量

目安：

```text
favorite   +5
like       +3
neutral    +1
dislike     0
```

程度。

負数にするかどうかは慎重に扱う。

基本的には、

**善意で渡したプレゼントによって大幅にRelationshipが下がる仕様にはしない。**

好みでなければ上がらない、程度を基本とする。

---

# 29. プレゼントのお礼会話

プレゼント後には、対象キャラクターごとの短い会話を表示する。

最低限、

```text
favorite
like
neutral
dislike
```

の反応差分を用意可能にする。

表情も連携する。

例：

### favorite

```text
face: happy
```

### like

```text
face: happy
```

または `normal`

### neutral

```text
face: normal
```

### dislike

```text
face: normal
```

必要なら軽い困惑を本文で表現する。

---

# 30. 特殊プレゼント会話

特定キャラクター × 特定アイテムのみ、

専用会話を設定可能にする。

例：

```js
SPECIAL_GIFT_EVENTS = {
    "401:gift_rose": "gift_luna_rose"
};
```

通常のお礼会話より長いイベントを発生させてもよい。

---

# 31. プレゼントとRelationshipイベント

プレゼントによってRelationship閾値を超えた場合も、

通常のRelationshipイベント候補にする。

ただし、

```text
プレゼント会話
↓
通常画面へ戻る
↓
Relationshipイベント発生可能判定
```

とし、お礼会話の途中に別イベントを割り込ませない。

---

# 32. プレゼント制限

Relationship上げの単純作業化を防ぐため、以下のいずれかを採用可能にする。

例：

```text
同一キャラへ1日1回
一定戦闘回数ごと
宿屋利用ごと
ストーリー区間ごと
```

ゲーム内時間概念が薄い場合は、

**ストーリー進行や一定回数制限**

の方が適している。

実装時に最終決定する。

---

# 33. プレゼントによる100到達

Relationship 100は、

単純な大量プレゼントだけでは容易に到達しない設計を推奨する。

例えば80以降は、

* キャラクエスト
* 重要会話
* ストーリーイベント

などを必要条件にできる。

プレゼントは関係構築を補助するものとする。

---

# 34. Relationship専用ファイル

推奨新規ファイル：

```text
relationships.js
```

役割：

```text
初期値
Relationship API
Bond EXP
閾値イベント
プレゼント嗜好
プレゼントRelationship処理
```

会話Runtimeから直接内部オブジェクトを変更しない。

---

# 35. Relationship APIイメージ

```js
Relationship.get(charA, charB);

Relationship.set(charA, charB, value);

Relationship.add(charA, charB, amount);

Relationship.addBondExp(charA, charB, amount);

Relationship.getGiftReaction(charId, gift);

Relationship.applyGift(playerId, targetId, giftId);

Relationship.getAvailableEvents(charA, charB);
```

---

# 36. プレゼント専用API

例：

```js
Relationship.giveGift({
    giverId: 301,
    targetId: 401,
    itemId: 9001
});
```

ただし `giverId` は主人公IDのみ許可。

それ以外の場合は処理しない。

---

# 37. 会話システム実装順

## Phase 1

左右立ち絵ステージ。

* 6表情
* foreground / background
* bounce
* 非話者表情変更

## Phase 2

システム文。

* focus
* dim
* keep
* hide

## Phase 3

AUTO / SKIP。

## Phase 4

主人公選択肢。

## Phase 5

Relationship基盤。

## Phase 6

同一PT Bond EXP。

## Phase 7

Relationshipイベント。

## Phase 8

プレゼントシステム。

## Phase 9

ストーリー改稿と同時に会話演出を順次投入。

---

# 第2軸

# 戦闘エフェクトの大幅強化

---

# 38. 基本方針

スキル性能と演出を分離する。

```text
skills.js
= スキル性能

battle_effects.js
= Skill ID別演出

BattleFX
= 演出描画

battle.js
= 戦闘ロジック
```

---

# 39. 新規ファイル

```text
battle_effects.js
```

を新設する。

ここを、

```text
Skill ID → Effect Recipe
```

の正本とする。

---

# 40. 基本データ

```js
window.BATTLE_EFFECT_MASTER = {
    version: 1,

    skills: {
        214: {
            cast: {},
            projectile: {},
            impact: {},
            camera: {}
        }
    }
};
```

---

# 41. BattleFX

既存 `polish.js` の `BattleFX` を廃止しない。

BattleFXを汎用演出レンダラーとして強化する。

---

# 42. 演出要素

最低限以下を設定可能にする。

```text
発動演出
飛翔物
速度
大きさ
軌道
尾・残像
着弾
多段Hit
全体攻撃
画面揺れ
画面フラッシュ
```

将来的に、

```text
ヒットストップ
使用者モーション
対象リアクション
```

も追加可能にする。

---

# 43. projectile

例：

```js
projectile: {
    enabled: true,

    assetKey: "water_spear",

    speed: 900,

    scale: 1.0,

    trajectory: {
        type: "arc",
        height: 40
    },

    rotateToPath: true,

    trail: {
        enabled: true,
        kind: "water",
        intervalMs: 30,
        scale: 0.4,
        fadeMs: 160
    }
}
```

---

# 44. 軌道

最低限、

```text
linear
arc
curve
homing
```

を扱う。

---

# 45. impact

```js
impact: {
    kind: "water-burst",
    scale: 1.2,

    perHit: true,
    intervalMs: 100
}
```

---

# 46. 画面揺れ

```js
camera: {
    shake: {
        enabled: true,
        strength: 4,
        durationMs: 140
    }
}
```

スマートフォンで不快にならない上限を設ける。

---

# 47. flash

```js
camera: {
    flash: {
        enabled: true,
        kind: "white",
        opacity: 0.4,
        durationMs: 100
    }
}
```

乱用しない。

---

# 48. 多段攻撃

スキルのHit数と連携する。

```js
impact: {
    perHit: true,
    intervalMs: 100
}
```

または一つの巨大演出で複数Hitを表現可能にする。

---

# 49. エフェクト素材

画像パスは `battle_effects.js` に大量に直書きしない。

`assets.js` を正本とする。

```js
assetKey: "water_spear"
```

等で参照する。

---

# 50. エフェクト解決順

```text
BATTLE_EFFECT_MASTER
↓
既存skills.js内battleFx
↓
既存BattleFX自動演出
```

未登録スキルは現在の演出を維持する。

---

# 51. 個別スキル制作方針

全スキルを一度に刷新しない。

ユーザーが、

```text
Skill ID 214

水を集める
↓
水槍を3本発射
↓
高速で軽い弧
↓
細い水の尾
↓
各Hitで飛沫
↓
最後だけ弱く画面揺れ
```

などの演出案を提示する。

ChatGPTがこれをEffect Recipeへ変換する。

---

# 52. 汎用プリミティブ

BattleFXへ、

```text
projectile
particle
burst
slash
beam
pillar
ring
aura
trail
flash
shake
```

などを蓄積する。

スキル固有コードを大量に作らない。

---

# 53. 戦闘速度

既存の、

```text
normal
fast
fastest
```

を維持する。

全演出時間はBattleFXの速度補正を通す。

---

# 54. 戦闘ロジックとの分離

演出は、

* ダメージ
* 命中
* 会心
* 状態異常
* MP
* AI
* ターン
* ドロップ
* 勝敗

へ影響させない。

---

# 55. 実装順

## Phase 1

`battle_effects.js` 新設。

## Phase 2

Skill ID lookupと旧演出フォールバック。

## Phase 3

linear / arc projectile。

## Phase 4

trail / impact / multi-hit。

## Phase 5

curve / homing / shake / flash。

## Phase 6

actor motion / hit stop等。

## Phase 7

各スキルをユーザー案に基づき順次刷新。

---

# 56. 会話と戦闘の連携

戦闘敗北イベントでは、

会話システムの、

```text
defeated
```

表情を使用可能にする。

例：

```text
敗北
↓
専用ストーリーイベント
↓
左右キャラクター defeated
↓
敗北後会話
```

通常のゲームオーバー画面だけでは必須ではない。

ストーリー上、

**「負けたあとも物語が続くイベント」**

で特に使用する。

---

# 57. 最終的なゲーム体験

## 会話

キャラクターが左右に立ち、

話者が手前へ出る。

非話者は少し後ろへ下がる。

話していない人物も表情を変える。

ナレーションでは二人とも暗くなる。

アルスの反応はプレイヤーが選ぶ。

旅・共闘・クエスト・選択・プレゼントによってRelationshipが変化する。

関係が深まると、その組み合わせ固有の会話が開放される。

---

## Relationship

Relationshipは、

**「その二人が現在どれだけ互いを理解し、信頼し、近しい関係にあるか」**

を共有値として表現する。

主人公はさらに、

**プレゼントという能動的な交流手段**

を持つ。

プレイヤー自身が、

「この仲間ともっと関わりたい」

と思ったときに、その意思をゲーム操作として表現できるようにする。

---

## 戦闘

各スキルが、

* どのように発動し
* 何が飛び
* どう動き
* 何を残し
* どう命中し
* どれだけ衝撃を与えるか

という固有の演出を持つ。

ただし内部コードは共通化し、今後大量に追加・修正可能な構造とする。

---

# 58. 最重要原則

### 会話

**人物関係を台詞だけで説明せず、表情・距離・選択・共闘・プレゼント・Relationshipを通して体験させる。**

### 戦闘

**スキル名と数値だけではなく、そのキャラクターが何をしている技なのかを画面上で理解できるようにする。**

### コンテンツ追加

**基盤を先に作り、会話・Relationshipイベント・プレゼント反応・スキル演出は後から段階的に増やせる構造にする。**
