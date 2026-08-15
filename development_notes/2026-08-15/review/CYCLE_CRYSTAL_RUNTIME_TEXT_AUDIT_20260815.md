# 輪廻の結晶 / 旧オクタプリズマ runtime文言・構造監査

Date: 2026-08-15  
Status: review only / runtime未変更

## 1. runtime該当箇所

### `items.js`
- Item ID: `701008`
- 現行名: `オクタプリズマ`
- 現行説明: 六つの大精霊と光の神の加護を宿す結晶。所持していると、深淵王アゼルガラグとの戦いで真価を発揮する。

### `story.js`
- `ABYSS_SPIRIT_TRIAL_ALL_COMPLETE`
- 六精霊試練の最後で即時にリュシオンが出現。
- ペンダント変化とItem 701008授与が同一場面。
- `abyss_spirit_trials_octaprism_grant` が各精霊victory eventの末尾から呼ばれる。

### `story_logic.js`
- 六精霊試練完了時に `abyssOctaprismGrantPending` を立てる。
- `ABYSS_SPIRIT_TRIAL_GRANT_OCTAPRISM` でgrantをcommit。

### `main.js`
- `migratePendantOctaprismV1`
- `grantOctaprismFromPendant`
- `abyssOctaprismGrantPending`
- Item 701008所持済み旧セーブとの互換が既にある。

### `abyss_content.js`
- `OCTAPRISM_SUPPORT_MASTER`
- `octaprismItemId: 701008`
- アゼルガラグ戦での支援effect master。

### `battle.js`
内部octaprism state/function群が広範囲に存在。
player-facing旧名称は主に戦闘開始ログ2件。

### `item_runtime.js`
- Item 701008の特殊メッセージ1件。

## 2. 正本との衝突

canon v8 §47では以下が固定。

- 六属性を融合しない。
- 結晶樹でミネルバが循環の儀を主導。
- 六片を水→風→光→火→雷→闇→水の順に巡らせる。
- ルーナと焼け焦げたネックレスが共鳴。
- ネックレスに残るリュシオンの痕跡が反応。
- リュシオンは人間側の理論へ立ち会う。
- 生成物は「輪廻の結晶」。

現行の「六精霊試練直後に神が授与」は構造差分であり、
表示名置換だけでは解消できない。

## 3. 内部名を維持すべき理由

現行セーブ・戦闘state・migrationで `octaprism` が広く使われている。

一括renameは、
- セーブ互換
- 戦闘途中save
- 旧Item取得済み判定
- migration idempotency
- story pending flag

を同時に壊す可能性がある。

したがって当面は
**player-facingだけ輪廻の結晶、内部compat keyはoctaprism維持**
が安全。

## 4. 変更しないもの

ユーザー承認前は以下を変更しない。

- `story.js`
- `story_logic.js`
- `main.js`
- `items.js`
- `battle.js`
- `item_runtime.js`
- `abyss_content.js`
- `news.js`

## 5. 次の判断点

1. 新scenario proposalを採用するか。
2. ミネルバの説明量。
3. 「輪廻の結晶」の命名者。
4. 旧セーブ所持済みプレイヤーへ新儀式をどう扱うか。
5. Item説明をどの程度メタ情報から物語表現へ寄せるか。
