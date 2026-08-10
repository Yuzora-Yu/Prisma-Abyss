# 07_DIALOGUE_REVIEW_QUEUE

既存会話の不審点・改善余地・採用待ちを管理する。

## Purpose

既存会話は、現在ゲームに入っている実装済み資料である。

しかし、既存会話を自動的に完成稿・正史とは扱わない。
同時に、Codexが勝手に直して実装へ反映してもいけない。

このファイルは、その中間のためにある。

- 気になる既存会話を記録する。
- 現行文を残す。
- 改善案を複数提示する。
- Codexの推奨を出す。
- ユーザー判断欄を空ける。
- 承認後だけ実装へ進める。

## Status values

| status | 意味 | 実装反映 |
|---|---|---|
| pending | ユーザー判断待ち | 不可 |
| approved_keep | 現行維持で承認 | 可 |
| approved_light | 軽微修正で承認 | 可 |
| approved_rewrite | 大幅修正で承認 | 可 |
| rejected | 不採用 | 不可 |
| later | 保留 | 不可 |
| implemented | 承認済み変更を反映済み | 済 |

## Review entry template

````md
## DR-000

Status: pending
Created:
Updated:

### Target
- file:
- script key / event ID:
- map / area:
- storyStep-subStep:
- required flags:
- speaker:

### Current implemented text
```text
話者：
「現行文」
```

### Concern
- 気になる点:
- なぜ問題か:
- 影響する設定:
- 影響する後続イベント:
- 画面上の読みやすさ・呼吸:
- ネタバレ危険:
- 口調混同:
- AIっぽさ:

### Option A: keep current
```text
話者：
「現行文」
```

#### Reason to keep
- 

#### Risk if kept
- 

### Option B: light revision
```text
話者：
「軽微修正文」
```

#### Revision intent
- 

#### Implementation impact
- none / text only / flags / event flow

### Option C: larger rewrite
```text
話者：
「大幅修正文」
```

#### Rewrite intent
- 

#### Implementation impact
- none / text only / flags / event flow / new event

### Codex recommendation
- recommended option:
- reason:
- confidence:

### User decision
- decision: undecided
- selected option:
- user notes:
- approved date:

### Implementation tracking
- implemented file:
- implemented script key:
- implemented date:
- validation:
````

## Entries

## DR-001-opening-lycion-long-line

Status: pending
Created: 2026-06-26
Updated: 2026-06-26

### Target
- file: `story.js`
- script key / event ID: 開幕リュシオン周辺
- map / area: 開幕
- storyStep-subStep: 0-x
- required flags: なし
- speaker: リュシオン

### Current implemented text
```text
リュシオン：
「私に残された最後の権能をもって、今一度、深淵を打ち倒す力を授けます…」
```

### Concern
- 気になる点: 1行が長く、開幕から情報密度が高い。
- なぜ問題か: プレイヤーが世界観を掴む前に、神・権能・深淵が一気に出る。
- 影響する設定: リュシオン、深淵、アルスの過去。
- 影響する後続イベント: 光の神殿、深淵解放。
- 画面上の読みやすさ・呼吸: review
- ネタバレ危険: medium
- 口調混同: low
- AIっぽさ: medium

### Option A: keep current
```text
リュシオン：
「私に残された最後の権能をもって、今一度、深淵を打ち倒す力を授けます…」
```

#### Reason to keep
- 開幕から神話的スケールを出せる。

#### Risk if kept
- 説明語が重なり、印象がやや抽象的になる。

### Option B: light revision
```text
リュシオン：
「私に残る力を、あなたへ。」
「もう一度だけ、深淵に抗うために。」
```

#### Revision intent
- 意味を保ちつつ、表示行を短くする。

#### Implementation impact
- text only

### Option C: larger rewrite
```text
リュシオン：
「……まだ、届く。」
「アルス。私の最後の光を持って。」
「深淵に、呑まれないで。」
```

#### Rewrite intent
- 神話説明より、祈りと切迫感を優先する。

#### Implementation impact
- text only

### Codex recommendation
- recommended option: Option B
- reason: 現行の意味を壊さず、開幕の読みやすさを改善できる。
- confidence: medium

### User decision
- decision: undecided
- selected option:
- user notes:
- approved date:

### Implementation tracking
- implemented file:
- implemented script key:
- implemented date:
- validation:

## DR-002-start-village-elder-request

Status: pending
Created: 2026-06-26
Updated: 2026-06-26

### Target
- file: `story.js`
- script key / event ID: 始まりの村の依頼
- map / area: 始まりの村
- storyStep-subStep: 1-x
- required flags: なし
- speaker: 村長

### Current implemented text
```text
村長：
「村の若い衆で塞ごうとしたんですが、奥に巨大な化け物がいてどうにも手が出せず…」
「勝手なお願いとは思うのですが、どうか、化け物を討伐してくれないじゃろうか。」
```

### Concern
- 気になる点: 依頼説明が長く、村長の口調も少し揺れている。
- なぜ問題か: 序盤の依頼は短く、生活被害が見える方が強い。
- 影響する設定: 始まりの村、ガイル・サラ加入。
- 影響する後続イベント: 始まりの洞窟。
- 画面上の読みやすさ・呼吸: review
- ネタバレ危険: low
- 口調混同: medium
- AIっぽさ: medium

### Option A: keep current
```text
村長：
「村の若い衆で塞ごうとしたんですが、奥に巨大な化け物がいてどうにも手が出せず…」
「勝手なお願いとは思うのですが、どうか、化け物を討伐してくれないじゃろうか。」
```

#### Reason to keep
- 状況説明としては分かりやすい。

#### Risk if kept
- 会話が依頼文らしく整いすぎ、村の生活感が薄い。

### Option B: light revision
```text
村長：
「若い衆で塞ごうとした。」
「だが奥に、でかい影がおってな。」
「頼める立場ではないが……」
「どうか、見てきてくれんか。」
```

#### Revision intent
- 情報を分割し、村長の年配口調へ寄せる。

#### Implementation impact
- text only

### Option C: larger rewrite
```text
村長：
「北東の畑が、もう使えん。」
「穴から魔物が出て、柵も壊された。」
「若い衆も戻ってこん。」
「旅の方。頼めんじゃろうか。」
```

#### Rewrite intent
- 抽象的な「大穴」より、畑・柵・若者という生活被害で見せる。

#### Implementation impact
- text only

### Codex recommendation
- recommended option: Option C
- reason: 序盤NPCを攻略看板にせず、村の被害として伝えられる。
- confidence: medium

### User decision
- decision: undecided
- selected option:
- user notes:
- approved date:

### Implementation tracking
- implemented file:
- implemented script key:
- implemented date:
- validation:

## DR-003-fire-elder-report-exposition

Status: pending
Created: 2026-06-26
Updated: 2026-06-26

### Target
- file: `story.js`
- script key / event ID: `fire_village_report`
- map / area: 炎の里
- storyStep-subStep: 2-4
- required flags: `firePrismRestored`
- speaker: 里の長

### Current implemented text
```text
里の長：
「礼を言う、旅の者よ。王国軍がプリズムに手をかけていたとは、信じたくない話だが……目を逸らしてはならんな。」
「北の風の集落へ向かうがよい。あの地の風は、世界の流れに敏い。道を示してくれるはずだ。」
```

### Concern
- 気になる点: 1行が非常に長く、次目的地説明も神託めいている。
- なぜ問題か: 炎の里の長なら、まず炉・鍛冶・里の損害から語る方が土地に根ざす。
- 影響する設定: 王国軍への疑い、風の集落導線。
- 影響する後続イベント: 風の集落。
- 画面上の読みやすさ・呼吸: review
- ネタバレ危険: low
- 口調混同: medium
- AIっぽさ: high

### Option A: keep current
```text
里の長：
「礼を言う、旅の者よ。王国軍がプリズムに手をかけていたとは、信じたくない話だが……目を逸らしてはならんな。」
```

#### Reason to keep
- 王国軍への違和感と次目的地が明確。

#### Risk if kept
- 里長の口から作者説明が出ている印象がある。

### Option B: light revision
```text
里の長：
「礼を言う。炉が息を吹き返した。」
「王国軍の話は……重いな。」
「だが、目を逸らすわけにもいかぬ。」
```

#### Revision intent
- 現行の意味を保ち、火の里らしい具体物を入れる。

#### Implementation impact
- text only

### Option C: larger rewrite
```text
里の長：
「聞こえるか。槌の音が戻った。」
「これで、冬までに鍋も直せる。」
「……王国軍の件は、胸に置く。」
「北へ行け。風の集落なら、道を知る。」
```

#### Rewrite intent
- 鍛冶と生活の回復を中心にしてから、次目的地へつなぐ。

#### Implementation impact
- text only

### Codex recommendation
- recommended option: Option C
- reason: 火の里の生活感が増え、次目的地説明も自然になる。
- confidence: medium

### User decision
- decision: undecided
- selected option:
- user notes:
- approved date:

### Implementation tracking
- implemented file:
- implemented script key:
- implemented date:
- validation:

## DR-004-sophia-kate-long-line

Status: pending
Created: 2026-06-26
Updated: 2026-06-26

### Target
- file: `story.js`
- script key / event ID: 水上都市クリア周辺
- map / area: 水上都市
- storyStep-subStep: 4-x
- required flags: `waterCityCleared`
- speaker: ソフィア / ケイト

### Current implemented text
```text
ソフィア：
「プリズムを狙う連中の言葉、こちらでも洗っておく。[N:104]は連れていきな。あの子に足りなかったのは、机の上じゃなく実戦だ。」

ケイト：
「怖くないと言えば嘘になります。でも、足手まといのままでは終わりたくありません。どうか、同行させてください。」
```

### Concern
- 気になる点: どちらも長く、師弟の距離感は良いが説明が一息に出ている。
- なぜ問題か: ソフィアはもっと余白と含みで魅せられる。ケイトは震えながら短く決意する方が合う。
- 影響する設定: ケイトの成長、ソフィアの立場。
- 影響する後続イベント: 海底神殿後、ケイト正式同行。
- 画面上の読みやすさ・呼吸: review
- ネタバレ危険: low
- 口調混同: low
- AIっぽさ: medium

### Option A: keep current
```text
ソフィア：
「プリズムを狙う連中の言葉、こちらでも洗っておく。[N:104]は連れていきな。あの子に足りなかったのは、机の上じゃなく実戦だ。」
```

#### Reason to keep
- ソフィアの師匠らしい評価が出ている。

#### Risk if kept
- 行が長く、ゲーム内テンポが重い。

### Option B: light revision
```text
ソフィア：
「連中の言葉は、こっちで洗う。」
「[N:104]は連れていきな。」
「あの子に足りないのは、実戦さ。」

ケイト：
「怖くない、と言えば嘘です。」
「でも、足手まといでは終われません。」
「どうか、同行させてください。」
```

#### Revision intent
- 現行意味を保ったまま分割する。

#### Implementation impact
- text only

### Option C: larger rewrite
```text
ソフィア：
「机の上じゃ、潮の匂いは読めない。」
「行きな、[N:104]。」
「怖いなら、なおさら見ておいで。」

ケイト：
「……足は震えています。」
「でも、ここで待つ方が怖いです。」
「僕も行きます。」
```

#### Rewrite intent
- 水上都市らしい比喩と、ケイトの弱さからの決意を出す。

#### Implementation impact
- text only

### Codex recommendation
- recommended option: Option C
- reason: キャラの声が分かれ、水上都市の土地感も出る。
- confidence: medium

### User decision
- decision: undecided
- selected option:
- user notes:
- approved date:

### Implementation tracking
- implemented file:
- implemented script key:
- implemented date:
- validation:

## DR-005-veld-sacrifice-speech

Status: pending
Created: 2026-06-26
Updated: 2026-06-26

### Target
- file: `story.js`
- script key / event ID: `thunder_fort_clear` / ヴェルド戦
- map / area: 雷の要塞
- storyStep-subStep: 5-x
- required flags: `thunderFortCleared` 前
- speaker: ヴェルド

### Current implemented text
```text
ヴェルド：
「お前達は救世の障害だ。大いなる祝福には犠牲が伴い、犠牲無しに世界を変えることなどできない。」
「お前達は世界を救っている気になっているようだが、ゆるやかな死に向かっているだけよ。」
```

### Concern
- 気になる点: テーマは良いが、説明がかなり直接的。
- なぜ問題か: ヴェルドの恐ろしさは、思想説明より裁きの短さで出せる。
- 影響する設定: 王国軍、祝福、犠牲、光の神殿。
- 影響する後続イベント: 光の神殿。
- 画面上の読みやすさ・呼吸: review
- ネタバレ危険: medium
- 口調混同: low
- AIっぽさ: medium

### Option A: keep current
```text
ヴェルド：
「お前達は救世の障害だ。大いなる祝福には犠牲が伴い、犠牲無しに世界を変えることなどできない。」
```

#### Reason to keep
- 敵思想が分かりやすい。

#### Risk if kept
- 伏線ではなく説明になりやすい。

### Option B: light revision
```text
ヴェルド：
「お前達は、救世の障害だ。」
「大いなる祝福には、犠牲が伴う。」
「犠牲を恐れて、世界は変えられぬ。」
```

#### Revision intent
- 現行思想を保ち、表示単位を短くする。

#### Implementation impact
- text only

### Option C: larger rewrite
```text
ヴェルド：
「退け。」
「祈りの列に、迷いは要らぬ。」
「犠牲を数える者に、救済は成せん。」
```

#### Rewrite intent
- 神官的・騎士的な冷たさを強め、真相説明を抑える。

#### Implementation impact
- text only

### Codex recommendation
- recommended option: Option B
- reason: 現行プロット指定に近く、実装時の意味変化が少ない。
- confidence: high

### User decision
- decision: undecided
- selected option:
- user notes:
- approved date:

### Implementation tracking
- implemented file:
- implemented script key:
- implemented date:
- validation:

## DR-006-zenon-chaos-exposition

Status: pending
Created: 2026-06-26
Updated: 2026-06-26

### Target
- file: `story.js`
- script key / event ID: `dark_castle_clear`
- map / area: 魔王城
- storyStep-subStep: 8-x
- required flags: `lightPalaceCleared`
- speaker: ゼノン

### Current implemented text
```text
ゼノン：
「六つのプリズムが応えた今、世界の中心に開いた亀裂へ進める。だが、混沌は力だけで越えられる場所ではない。」
「混沌への案内は、こいつに任せる。ひよっこ達が混沌に魅入られないように、助けてやれ。」
```

### Concern
- 気になる点: 重要な真相と次目的地が一息に説明される。
- なぜ問題か: ゼノンは言い訳しない王なので、説明しすぎると威厳が薄まる。
- 影響する設定: 闇のプリズム、混沌、シャニー加入。
- 影響する後続イベント: 深淵解放。
- 画面上の読みやすさ・呼吸: review
- ネタバレ危険: medium
- 口調混同: medium
- AIっぽさ: medium

### Option A: keep current
```text
ゼノン：
「六つのプリズムが応えた今、世界の中心に開いた亀裂へ進める。だが、混沌は力だけで越えられる場所ではない。」
```

#### Reason to keep
- 次目的地と危険が明確。

#### Risk if kept
- 魔王が案内役になりすぎる。

### Option B: light revision
```text
ゼノン：
「六つのプリズムが応えた。」
「ならば、中心の亀裂も開く。」
「だが混沌は、力だけでは越えられぬ。」
```

#### Revision intent
- 意味を保ちつつ、ゼノンの語りを短くする。

#### Implementation impact
- text only

### Option C: larger rewrite
```text
ゼノン：
「中心の亀裂へ行け。」
「六つの光を持つ今なら、門は開く。」
「だが忘れるな。」
「混沌は、勝者から先に喰う。」
```

#### Rewrite intent
- 案内を短くし、混沌の怖さをゼノンらしい警告にする。

#### Implementation impact
- text only

### Codex recommendation
- recommended option: Option C
- reason: ゼノンを善良な説明者にせず、危険な王のまま次へ送れる。
- confidence: medium

### User decision
- decision: undecided
- selected option:
- user notes:
- approved date:

### Implementation tracking
- implemented file:
- implemented script key:
- implemented date:
- validation:
# 2026-07-29 カルメナ住民会話

- 対象: 現行 `abyss_carmena_resident`
- 懸念: 同一会話を複数住民へ流用しており、カルメナの生活・圧政・異なる時代から来た住民という土地固有性が出ていない。
- 選択肢: 現行維持 / 軽微修正 / `27_CARMENA_RESIDENT_DIALOGUE_DRAFT_20260729.md` の四イベントへ分割
- Codex推奨: 四イベントへ分割。ただし新規会話のためユーザー承認後に実装する。
- 状態: 解決済み
- ユーザー承認: 2026-07-29「深淵の会話は実装してOK。どんどん住人増やして」
- 実装: 現在の `story.js`（旧 `abyss_story.js`）の四専用スクリプト、`map.js` の四固有住民へ置換

## DR-20260810-light-palace-present-final

Status: pending
Created: 2026-08-10

### Target
- file: `story.js`
- legacy script keys: `LIGHT_PALACE_FINAL_ENCOUNTER`, `LIGHT_PALACE_BLESSING_RETRY`, `LIGHT_PALACE_OVERPOWER_CLEAR`, `LIGHT_PALACE_CLEAR`
- map / area: 光の宮殿グランプリズマ・現在時間
- storyStep-subStep: 7-x

### Current issue
旧実装は「ジャスパー＋ヴェルド3倍戦→敗北→リュシオンの加護で弱体化→再戦勝利」を前提とする。
新版v8は、回想後の現在攻略、地下牢の国王／レイラ／レオン確認、祭壇戦後のアラン不意打ちと離脱を正本とするため進行構造が衝突する。

### Handling in Phase 6E
旧会話本文は削除・改稿せず legacy source として残す。
新ルートは最小骨格用の別script keyを使用し、旧強制敗北ルートを呼ばない。

### User decision
- 長台詞の最終稿: pending
- Phase 6Eでは進行骨格のみ実装可

## DR-20260810-thunder-fort-luna-awakening

Status: pending  
Created: 2026-08-10

### Target
- new script keys: `THUNDER_FORT_DEMON_ASSAULT_*`, `THUNDER_FORT_LUNA_AWAKENING_SKELETON`
- map / area: 雷の要塞ライザーク・救護区画周辺
- storyStep-subStep: 7-3〜7-5

### Fixed canon
- 魔王軍は市民虐殺ではなくルーナ確保を優先。
- 現時点では誘拐目的に聞こえる言葉を使う。
- 防衛後にルーナ覚醒。
- 正本確定台詞: 「冒険者様、助けてくださってありがとうございます。」
- アルスを知らないことで、5年前以前の記憶喪失を確定提示。

### Handling in Phase 7A
進行に必要な最短会話のみ実装する。
アルス／レイラ／ルーナの長い感情会話、ゼノン側の真意説明は後の章別Dialogue Polishへ送る。

## DR-20260810-legacy-opening-retry-meta

Status: later  
Created: 2026-08-10

### Target
- file: `story.js`
- script key: `BATTLE_RETRY_TALK`
- legacy event: `game_start_retry`
- area: 旧開幕ルート

### Current implemented text
```text
？？？？:
「[N:301]よ、まだ倒れてはなりません。
私に残された最後の権能をもって、今一度、深淵を打ち倒す力を授けます…」

システム:
「不思議なちからで体力が全回復し、秘められた力が開放された！！」
```

### Concern
- 現在の5年前プロローグ導線では使用していない旧イベントだが、再利用された場合に「加護の意味・内部強化」をその場で説明しすぎる。
- 新プロローグの全滅復帰は `PROLOGUE_LUCION_RECOVER` で現象だけを見せる方針と一致しない。
- 旧ルート自体が dormant なので、今回の品質修正では削除・改稿しない。

### Codex recommendation
- current routeでは未使用のまま維持。
- 旧 `game_start_retry` を再接続する場合は、その時点で削除または新しい現象描写へ置換する。

### User decision
- decision: later

## DR-20260810-light-palace-legacy-exposition

Status: pending  
Created: 2026-08-10

### Target
- file: `story.js`
- script key: `LIGHT_PALACE_LEILA_RECOVERY_JOIN` ほか旧光宮殿会話
- area: 光の宮殿

### Concern
- 旧実装には、闇のプリズムの所在、魔王城への道、ヴェルドとの関係、同行理由を一つの会話で連続説明する箇所が残る。
- 新版の「人物が知っていることを段階的に見せる」「プレイヤーが後から意味を繋ぐ」方針と衝突する可能性が高い。
- 現在のPhase 6E新ルートは別骨格を使用しているため、今すぐ大量置換する必要はない。

### Codex recommendation
- 現行文をlegacy sourceとして保持。
- 光宮殿の長台詞Polish時に、情報を人物・場所・再訪会話へ分散する案をユーザーへ提示する。

### User decision
- decision: undecided

## DR-20260810-crystal-tree-six-element-ritual

Status: resolved  
Created: 2026-08-10  
Approved: 2026-08-10  
Implemented: 2026-08-10

### Target
- file: `story.js`
- script keys: `CRYSTAL_TREE_DEFENSE_CLEAR`, `CRYSTAL_TREE_POST_CLEAR_CHECKPOINT`, `CRYSTAL_TREE_SIX_ELEMENT_RITUAL`, `CRYSTAL_TREE_POST_RITUAL_REPEAT`
- source draft: `36_CRYSTAL_TREE_SIX_ELEMENT_RITUAL_DRAFT_20260810.md`
- map / area: `CRYSTAL_TREE / MAP000073`
- storyStep-subStep: `7-11` → `8-0`

### Approved direction
- 魔王軍戦②直後は応急安定化のみ。完治commitを行わない。
- レイラが葉で治った観測結果を起点に、ミネルバが六属性循環の仮説を組み立てる。
- 秘薬は水→風→光→火→雷→闇の順で生成し、最後の闇で完成する。
- 正常な闇に支配・操作・洗脳の本質がないことを観測結果として示す。
- ルーナは故郷を理屈ではなく、木漏れ日・水音・風・匂い・暖かな光として思い出す。
- レオンを先に治療し、覚醒後最初にレイラの無事を尋ねる。
- ルーナは身体循環と成長阻害を回復方向へ戻すが、奪われた力そのものは全回復しない。
- 魔王軍を味方と断定せず、闇のプリズムの実態を自分の目で確かめるため魔王城へ向かう。

### User decision
- decision: approved
- selected option: approved long-form draft / full implementation
- user notes: 「これでOKです。コード側の作業に入ってください。」
- approved date: 2026-08-10

### Implementation tracking
- `crystal_tree_defense_clear` から治療reward/clear commitを後段へ移動。
- `crystalTreeSixElementRitualSeen` を独立既読flagとして追加。
- `leilaCrystalTreeLeafTreated` を追加し、結晶樹案内前に治療済みを保証。旧 `leilaJoined` saveは互換昇格。
- MAP000073へ既存六属性pedestal assetをM0仮配置。
- 冒頭村へ同一感覚モチーフを薄く追加。
- シャオの誤 `charId:301` を `105` へ修正。
- implementation validation: `validate-crystal-tree-route-phase7c.js` / `validate-crystal-tree-six-element-phase7d.js`

## DR-Phase8B-dark-castle-three-officers

Status: implemented  
Created: 2026-08-10  
Updated: 2026-08-10

### Target
- file: `story.js`
- script keys: `DARK_CASTLE_ZELDRAS_ENCOUNTER/CLEAR`, `DARK_CASTLE_ELMENAS_ENCOUNTER/CLEAR`, `DARK_CASTLE_BELET_ELM_ENCOUNTER/CLEAR`
- map / area: 魔王城ガルヴァニア
- storyStep-subStep: 8-0
- speakers: 常闇のゼルドラス／風詠のエルメナス／冥騎士ベレト

### Current implemented text before revision
- ゼルドラスは「資格」「怒り」を中心にした旧試練会話。
- エルメナスは「遠ざかるわ」「あなた次第よ」「ただの敵ではないわ」等、女性口調として実装されていた。
- ベレトは夢幻回廊／己の影を中心とする旧試練会話。

### Concern
- 三幹部はユーザー正典で全員男性。
- 戦闘理由が、魔王軍側の人間不信・闇プリズム防衛・謁見資格という新版設定を十分に反映していなかった。

### User decision
- decision: approved_rewrite
- selected option: 大幅修正
- user notes: 三幹部は全員男性。ゼルドラス／エルメナスは人間側を信用せず通さない。ベレトは思想差より謁見資格を実力で測る。
- approved date: 2026-08-10

### Implementation tracking
- implemented file: `story.js`
- implemented script keys: 上記6キー
- implemented date: 2026-08-10
- source draft: `docs/scenario/38_DARK_CASTLE_OFFICERS_AND_EMPIRE_SHOPS_PHASE8B_20260810.md`
- validation: `tools/validation/validate-dark-castle-phase8b.js`

## DR-20260810-dark-castle-truth-second-integration-phase8c

Status: implemented  
Created: 2026-08-10

### Target
- file: `story.js`
- script keys: `DARK_CASTLE_CLEAR` / `dark_castle_clear`
- map / area: 魔王城ガルヴァニア 3F 玉座の間 / ガルヴァニア帝国
- storyStep-subStep: `8-0` → `9-0`
- source draft: `docs/scenario/39_DARK_CASTLE_TRUTH_AND_SECOND_INTEGRATION_PHASE8C_DRAFT_20260810.md`

### Pre-Phase8C implemented text
- 闇プリズム無傷確認後、シャニーとゼノンの契約説明へ直行していた。
- 奈落への洞窟案内、シャニー加入、`darkCastleCleared`、`prismBlessingsComplete`、Step9を一括commitしていた。

### Concern
- 新正典に必要なエクリプス滅亡／闇研究完成済みの因果、四研究者の知見、結晶樹で学んだ「循環」と統合の違い、ルーナの魔王城記憶回復、第二次統合開始が欠落している。
- `darkCastleCleared` が長会話と報酬より先に一括commitされる旧構造では、途中中断・既存save互換・帝国ショップ解禁の順序が粗い。
- シャニー加入は本人の自立選択として一段強く描く必要がある。

### Codex recommendation
- substantial rewrite。現行文の核（闇プリズム無傷／ゼノンを善人化しない／シャニー契約の重さ／奈落への道／加入）は継承する。
- 長会話の前に、帝国・城内MAPの生活／地下防衛描写を追加し、ゼノンの説明より先にプレイヤーへ証拠を見せる。
- user approval後にPhase8Cとして実装する。

### User decision
- decision: approved_with_additions
- approved date: 2026-08-10
- additions: ルーナの記憶回復はゼノン戦後の闇プリズム直接接触。記憶接続による痛み、アルスが急かさず支える関係、ルーナの誤った魔族史・討伐歴への後悔と謝罪、自分で見て選び直す再起を追加。その他のPhase8C案は承認。

### Implementation tracking
- implemented: 2026-08-10
- runtime: `story.js` / `story_logic.js` / `map.js`
- reward: `luna_dark_castle_300k`, `lunaMemoryStage=3`, EXP multiplier 1600%
- save rescue: `dark_castle_truth_phase8c_revisit` + non-regressive state actions
- validation: `tools/validation/validate-dark-castle-phase8c.js`

## DR-20260810-alan-altar-irreversible-branch-phase8e

Status: approved_and_implemented  
Created: 2026-08-10  
Approved: 2026-08-10  
Approved source: `docs/scenario/42_ALAN_AREL_KAGETORA_APPEAL_AND_ALTAR_PHASE8E_APPROVED_20260810.md`

### Target
- file: `story.js` / `map.js` / `quests.js` / `items.js` / `monsters.js`
- map / area: 統合の祭壇 `ABYSS_FIELD / MAP000032`
- related character: アラン、アルス、ルーナ、ジョセフ、レオン、クロード、レイラ、ゼリード、ハヤテほか
- prerequisite item: **王への上申書**

### Final user decisions
- 長編クエストは光の宮殿でアランが裏切った直後から解禁。
- 「王への上申書」は現代に新規作成・認証するものではなく、**アレルが十年前、ジャスパーの統合の儀を止めるため国王へ提出しようと準備していた原本**。暗部に消されたはずの資料から発見する。
- カゲトラはゼリードを最も信頼した相棒。ハヤテもその信頼を受け継いでおり、告白直後に喧嘩腰にはならない。許しは保留し、自分の手と目で真実を確認した後でもう一度ゼリードと話す。
- ガルヴァニア渓谷の門を破壊した者がアランであることは、この場面では明かさない。
- 上申書所持時もアランの最終的な生死はプレイヤー判断。
- 上申書未所持時は **「進む / 引き返す」** を明示し、進んで撃破した場合の死亡は不可逆。

### Implementation status
- 連続クエスト、原本上申書、ハヤテ加入、光の楔アラン戦、未所持警告、所持時の生死選択をruntime実装済み。
- 旧セーブは `alanAltarLegacyBypass` で進行を巻き戻さず、過去のアラン生死を捏造しない。

### User decision
- decision: approved with corrections
- approved date: 2026-08-10

## DR-20260810-galvania-empire-arrival-exposition-phase8c-review

Status: pending  
Created: 2026-08-10

### Target
- file: `story.js`
- script key: `GALVANIA_EMPIRE_ARRIVAL_PHASE8C`
- map / area: ガルヴァニア帝国
- storyStep-subStep: 8-0
- speaker: システム

### Current implemented text
> 包帯を巻いた兵が壁にもたれ、そのすぐ横を親子が避難区画へ急いでいく。\n侵略のための軍都というより、長く何かに耐えてきた街に見えた。

### Concern
- 1文目だけで「負傷兵」「親子の避難」という視覚情報が十分に置かれている。
- 2文目の「侵略のための軍都というより～」は、その視覚情報から何を考えるべきかをシステム文が先回りしている。
- Phase8Cの狙いは、プレイヤー自身が魔王軍への理解を揺らすことなので、ここは説明を減らした方が後の三幹部／ゼノン／闇プリズムが強くなる。

### Options
- **現行維持:** 現在の2文をそのまま残す。
- **軽微修正:** 1文目を残し、2文目を「古い補修跡の残る壁の向こうで、避難を告げる鐘が鳴った。」等の観測可能な描写へ差し替える。
- **大幅修正:** 2文目を削除し、1文目だけにする。

### Codex recommendation
- **大幅修正**を推奨。ここでは判断文を消し、プレイヤーの解釈を後段へ委ねる。
- ユーザー承認まではruntimeを変更しない。

### User decision
- decision: undecided
- selected option:
- user notes:
- approved date:
## POLICY-20260810-system-ui-global-review

Status: active  
Created: 2026-08-10

### User direction
- チュートリアルを除き、シナリオ作業範囲外であっても、**システム文・メニュー・UI文言を全て調整候補としてピックアップ**する。
- 修正を提案する際は必ず **「現行 / 修正案」** を併記する。
- ユーザーの最終判断より先に、既存runtime文言を勝手に置換しない。
- チュートリアルは既存のUI完成ゲート方針を優先し、現在の全体レビューでは保留する。

### Master inventory
- `docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md`
- 初回全体走査では story system narration / story objective / map interaction / quest text / DOM UI / menu labels / HTML/template text を収集。
- 新規文言を追加した場合も同台帳へ追記する。

### Current proposal-ready item
- `DR-20260810-galvania-empire-arrival-exposition-phase8c-review`
- 現行と修正案を台帳にも併記済み。runtimeは未変更。

