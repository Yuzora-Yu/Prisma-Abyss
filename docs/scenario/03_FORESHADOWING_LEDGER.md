# 03_FORESHADOWING_LEDGER

伏線・ミスリード・後半回収の台帳。

## Policy

伏線は多ければよいわけではない。
このゲームでは、後から振り返って気づく程度を基本とする。

- 露骨な予言は禁止。
- 同じ伏線の繰り返しすぎは禁止。
- 古文書による答え合わせは禁止。
- キャラの感情による誤認は歓迎。
- ミスリードは、後で納得できる理由を持たせる。

## Clue types

| type | 意味 |
|---|---|
| true_clue | 後で真相につながる本物の伏線 |
| false_clue | その時点では筋が通るが、後で違うと分かるもの |
| emotional_misread | キャラの感情による誤解 |
| local_rumor | 土地の噂・伝承・偏見 |
| damaged_record | 欠けた記録・碑文・書物 |
| visual_motif | 台詞ではなく演出上の違和感 |

## Ledger template

```md
## FL-000

Status: draft / approved / implemented / retired
Type: true_clue / false_clue / emotional_misread / local_rumor / damaged_record / visual_motif

### Location
- area:
- scene:
- storyStep-subStep:
- required flags:

### Surface meaning now
プレイヤーが初見で受け取る意味。

### Hidden meaning later
後で分かる本当の意味。

### Text or staging
実際に置く台詞・石碑・演出。

### Speaker or object
誰が言うか、何が示すか。

### Reveal timing
いつ意味が反転・回収されるか。

### Risk check
- 露骨すぎないか:
- 多すぎないか:
- キャラが知りすぎていないか:
- 他の伏線と重複していないか:
```

## Example direction: Demon army misread

```md
## FL-example-xiao-demon-army

Status: draft
Type: emotional_misread

### Location
- area: 炎の里〜イグナ火山
- scene: 王国兵の足跡、魔族の噂、火のプリズム異変
- storyStep-subStep: 2-x

### Surface meaning now
魔王軍が火山の異変に関わっているように見える。
シャオもその可能性に強く引っ張られる。

### Hidden meaning later
実際には、王国軍側の行動や深淵の影響が重要であり、魔王軍は別目的でプリズムを守ろうとしていた可能性が見えてくる。

### Text or staging
- 王国兵の足跡があるが、村人は魔族の仕業だと噂する。
- 魔族らしき影は見えるが、プリズムには触れていない。
- シャオは「またあいつらか」と言うが、根拠は薄い。

### Risk check
- 真相を言わない。
- シャオを愚かにしない。
- 魔王軍善玉説を序盤で言わない。
```

## FL-001-xiao-shanny-misread

Status: draft
Type: emotional_misread

### Location
- area: 炎の里〜魔王城
- scene: シャオの魔王軍・シャニーへの反応
- storyStep-subStep: 2-x から 8-x
- required flags: `shaoJoinedAtVolcano`

### Surface meaning now
シャオは魔王軍やシャニーを、里を傷つける裏切り者として見ている。

### Hidden meaning later
シャニーは妹や故郷を守るため、ゼノンと契約して裏切り者として消えた可能性がある。

### Text or staging
- 炎の里で、シャオが魔王軍の噂に過敏に反応する。
- 魔王城でシャニーの名前が出た時、怒りより先に一瞬だけ言葉が詰まる。

### Speaker or object
シャオ、炎の里の老人、魔王城側の魔族

### Reveal timing
魔王城終盤、またはシャニー加入後の個別会話。

### Risk check
- 露骨すぎないか: 「姉妹」と序盤で断定しない。
- 多すぎないか: 炎の里では1〜2箇所まで。
- キャラが知りすぎていないか: 村人は噂以上を知らない。
- 他の伏線と重複していないか: 魔王軍善玉化とは分ける。

## FL-002-joseph-leon-silence

Status: draft
Type: true_clue

### Location
- area: 雷の要塞〜光の神殿
- scene: ジョセフが白銀騎士・レオンの名に反応する
- storyStep-subStep: 5-x から 7-x
- required flags: `josephJoinedAtThunderFort`

### Surface meaning now
ジョセフが王国軍時代に何かを失ったように見える。

### Hidden meaning later
ジョセフはレオンの父であり、父と名乗る資格を失ったと思っている。

### Text or staging
- 「白銀の騎士」の名を聞いた時だけ、ジョセフが黙る。
- バロンやシルビアは事情を知っているが、本人が言うまで触れない。

### Speaker or object
ジョセフ、バロン、シルビア、光の宮殿NPC

### Reveal timing
光の宮殿終盤、または魔王城前の重い会話。

### Risk check
- 露骨すぎないか: 「父」「息子」は伏せる。
- 多すぎないか: 雷の要塞では沈黙1回で足りる。
- キャラが知りすぎていないか: 一般NPCは「似ている」程度。
- 他の伏線と重複していないか: ジョセフの責任テーマと接続する。

## FL-003-kingdom-salvation-language

Status: draft
Type: false_clue

### Location
- area: 火の里〜光の神殿
- scene: 王国兵・神官が「国の未来」「祝福」を語る
- storyStep-subStep: 2-x から 7-x
- required flags: なし

### Surface meaning now
王国軍は危険な手段を使ってでも国を守ろうとしている。

### Hidden meaning later
美しい言葉は、混沌や深淵に近づく儀式を覆い隠す建前になっている。

### Text or staging
- 王国兵は「命令」よりも「救済」「祝福」という語を使う。
- 神官は痛みや犠牲を美しい言葉で包む。

### Speaker or object
グラド、レナード、ヴェルド、ジャスパー、王国兵

### Reveal timing
光の神殿から魔王城、深淵入口。

### Risk check
- 露骨すぎないか: 早期に「洗脳」と断定しない。
- 多すぎないか: 敵幹部ごとに語彙を変える。
- キャラが知りすぎていないか: 味方側は違和感だけを持つ。
- 他の伏線と重複していないか: 王国軍全体を単純悪にしない。

## FL-004-zenon-not-good-person

Status: draft
Type: true_clue

### Location
- area: 魔王城
- scene: 魔王ゼノン戦前後
- storyStep-subStep: 8-x
- required flags: `lightPalaceCleared`

### Surface meaning now
ゼノンは恐ろしく、倒すべき魔王に見える。

### Hidden meaning later
ゼノンは闇のプリズムを守っていたが、善人として弁明するつもりはない。

### Text or staging
- 魔王城の魔族が「王は残酷だ。だが約束だけは破らぬ」と言う。
- ゼノン自身は守っていた理由を最低限しか語らない。

### Speaker or object
魔王城の魔族、ゼノン

### Reveal timing
ゼノン撃破後から深淵解放。

### Risk check
- 露骨すぎないか: 「実はいい人」にしない。
- 多すぎないか: 魔王城内の一部NPCだけ。
- キャラが知りすぎていないか: 魔族は忠誠と恐怖を混ぜる。
- 他の伏線と重複していないか: 闇=悪の反転と接続する。

## FL-005-luna-hometown-six-element-warmth

Status: implemented  
Type: visual_motif

### Location
- area: 5年前・名もなき山村 / 結晶樹の秘跡
- scene: 西の高台から見る村の朝 / 六属性秘薬生成中のルーナの記憶断片
- storyStep-subStep: `0-0` / `7-11`
- required flags: 結晶樹側は `crystalTreeDefenseCleared`

### Surface meaning now
冒頭では、光神を信仰する小さな山村の穏やかな朝。結晶樹では、ルーナが失った故郷の感覚を少し思い出す。

### Hidden meaning later
村人は光神の加護だと受け止めていたが、実際には六属性が小規模かつ非常に綺麗に循環し、土地と人の生命活動が安定していた。

### Text or staging
- 光神の小さな祠へ差す朝日。
- 白い祈り布を揺らす風。
- 水路の音。
- 木漏れ日の暖かさ。
- 濡れた土、葉、炊事の匂い。
- 結晶樹では同じ種類の感覚だけを反復し、「六属性の村だった」と説明しない。

### Speaker or object
システム描写、ルーナの感覚記憶。

### Reveal timing
六属性循環の意味は結晶樹で一部だけ見える。故郷そのものの性質は後半で振り返って繋がる余地を残す。

### Risk check
- 露骨すぎないか: 理屈・属性名を故郷回想へ持ち込まない。
- 多すぎないか: 冒頭1描写＋結晶樹の記憶断片を基本とする。
- キャラが知りすぎていないか: ルーナ自身は感覚しか思い出さない。
- 他の伏線と重複していないか: 光神信仰と六属性循環を対立させず、後から意味が増える構造にする。


## FS-Phase8C-Luna-Dark-Prism-Memory【2026-08-10】

- setup: 結晶樹でルーナは暖かな木漏れ日・水音・風・匂いとして故郷を一部回復。闇＝休息という循環も体験する。
- pay-in Phase8C: ゼノン戦後、闇プリズムへ直接触れて「夜の葉音／湿った草／誰かの寝息／手を握っていた安心感」を回復する。同時に教団の対魔族教育・討伐記憶が接続し、痛みを伴う。
- still hidden: 手を握っていた相手の正体、大きな崩壊記憶、最後の約束はまだ明かさない。
- character payoff: アルスは答えを与えず、ルーナ本人が記憶へ向き合う選択を尊重する。

## FS-Phase8C-Luna-False-Demon-History【2026-08-10】

- setup: 教団／ジャスパーが「魔族は闇で人を支配する敵」「エクリプス討伐と闇プリズム確保は正義」と教育。ルーナは近年、聖女として魔族討伐へ参加。
- reveal: ガルヴァニア帝国の生活・防衛、三幹部の証言、無傷の闇プリズムで教育との矛盾を連続提示。
- payoff: ルーナは謝罪するが許しを要求せず、「自分で見て選ぶ正義」へ更新する。

## FS-Galvania-Gate-Destroyer-Alan-Hidden【継続】

- internal truth: ガルヴァニア渓谷の門を破壊したのは光制御を完成させたアラン。ヴェルド／ジャスパーらと統合の祭壇へ先行。
- player boundary: Phase8Cでも正体・現在地・光属性痕跡を断定させない。第二次統合発生後も「誰が先行したか」は未解決のまま奈落へ進ませる。

## FL-006-luna-saint-rumors-after-water-city-riot

Status: implemented  
Type: true_clue

### Location
- area: 水上都市リヴァリア / 風の集落カザリア
- scene: 海底神殿後の暗黒騎士暴動鎮圧後、一般NPC会話
- storyStep-subStep: `4-5` 以降
- required flags: `waterCityRiotSuppressed`
- hidden after flag: `lunaSurvivalRevealed`

### Surface meaning now
王都には教団が擁する強力な聖女がいて、近年は魔族討伐にも関わっているらしい。聖騎士団や教団は民間から一定の信頼を得ている。

### Hidden meaning later
噂の聖女は生存していたルーナ。教団に保護・教育され、本人が正義だと信じたまま魔族討伐へ参加している。

### Text or staging
- 水上都市: 「あの聖騎士団、すごかった」「王都の聖女もすごいらしい」「最近、魔族の拠点を聖なる光で浄化したらしい」。
- カザリア: 水上都市から来た商人経由で「王都には奇跡を起こす聖女様がいるらしい」。
- 本名、素顔、アルスとの過去、年齢など、ルーナと即断できる特徴は出さない。

### Speaker or object
水上都市の荷運び人、カザリアの見張り。

### Reveal timing
海底火山後、クロードが昏睡したルーナを雷の要塞へ運び込み、アルスとプレイヤーが同時に生存を知る。

### Risk check
- 露骨すぎないか: 「白髪」「ルーナ」「五年前」等を出さない。
- 多すぎないか: 各地域1NPC程度に限定する。
- キャラが知りすぎていないか: 民間の伝聞として扱う。
- 他の伏線と重複していないか: 教団への民衆信頼とルーナ再会の両方に接続する。

## FL-007-arisa-veleria-wind-melody

Status: implemented  
Type: true_clue

### Location
- area: 風の神殿 / 禁忌の森深部
- scene: アリサの礼拝、深部へ導く風、深部ボス後の古い楽器候補
- storyStep-subStep: `4-6`～`4-8` 周辺
- required flags: アリサ／ハイネ本編救援ルート

### Surface meaning now
アリサは風のプリズムに強く惹かれ、本人にも理由の分からない風の音や旋律へ導かれる。深部では「古びた魔笛」（Item 701012）が見つかり、本人の指だけが笛穴を覚えている。

### Hidden meaning later
アリサはヴェリアで風へ旋律を捧げてきた楽師の家系の血を引き、身体が故郷の祈りの旋律を覚えている。後にエリシアがその旋律へ反応し、同郷性が説明台詞なしで繋がる。

### Text or staging
- 操られたのではなく、本人が礼拝へ行く意思を持った上で、風に「呼ばれる」感覚を強める。
- 「古びた魔笛」は正式名称、Item ID 701012。出自はプレイヤーへまだ断定しない。
- この時点でヴェリア／エリシアの全真相は説明しない。

### Speaker or object
アリサ、風のプリズム、禁忌の森の風、古い楽器。

### Reveal timing
エリシア本格登場～対峙時。

### Risk check
- 露骨すぎないか: 「あなたはヴェリアの楽師の末裔」と神託で説明しない。
- 多すぎないか: 音・風・楽器の三点に絞る。
- キャラが知りすぎていないか: アリサ自身も理由を言語化できない。
- 他の伏線と重複していないか: カザリアの舞／ヴェリアの演奏という二文化正本へ接続する。

