# 45_WORLD_LIFE_REVISIT_DIALOGUE_EXPANSION_DRAFT_20260815

Status: approved new-text source / partial runtime implementation started (Phase 18 Batch 1)
Date: 2026-08-15
Scope: existing main-story towns and hubs; **no existing dialogue is rewritten or deleted in this draft**

## 2026-08-15 runtime status

Phase 18 Batch 1として `NPC-LUMINA-NEW-01/02` と `NPC-IGNISIA-NEW-01/02` を `56_PHASE18_LUMINA_IGNISIA_NPC_STAGE_BATCH1_20260815.md` 経由でruntimeへ接続する。その他の草稿は引き続き未接続。

## 0. Intent

This batch fills the canon backlog item `各NPCの進行差分` without turning towns into exposition rooms.

The priority order is:

1. RPG readability: the player can still feel where the danger, recovery, and next adventure are.
2. A lived-in world: people have work, meals, debts, family, grudges, habits, and bad days unrelated to the hero.
3. Imperfect knowledge: villagers know what they saw, not what the setting bible says.
4. Contradiction: two honest people may explain the same event differently.
5. Deliberate lies are rare and must have a concrete motive. They are not used to hide authorial contradictions.

A rescued town does not become emotionally healthy overnight. Restored fire creates repair work. Clean water exposes old stains. Returning adults can still be ashamed, frightened, or angry. A defeated enemy can leave people with fewer certainties rather than more.

## 0.1 Knowledge labels

- `observed`: the speaker personally saw or handled it.
- `heard`: second-hand rumor.
- `assumed`: emotional or cultural interpretation.
- `wrong-belief`: sincere but incorrect.
- `half-truth`: factually partial and knowingly framed.
- `deliberate-lie`: knowingly false; motive and exposure reaction are specified.

## 0.2 Implementation boundary

- All lines below are **new material**.
- No existing `story.js` conversation key is replaced by this draft.
- Phase 18 Batch 1 (`NPC-LUMINA-NEW-01/02`, `NPC-IGNISIA-NEW-01/02`) is approved and runtime-connected via `56_PHASE18_LUMINA_IGNISIA_NPC_STAGE_BATCH1_20260815.md`; all other entries remain unconnected until their roadmap insertion pass.
- If a new actor cannot be placed without damaging map readability, reuse the concept as an optional indoor NPC or short examine event rather than crowding the map.

---

# 1. リュミナ村 / 始まりの村

Area: Beginning Village / Lumina
Timing: opening through first-cave clear and early revisits
Known to residents: the village was attacked; the mountain/cave changed; local people were hurt.
Hidden from residents: the larger Abyss/prism truth, Ars's full past unless personally told.
Purpose: establish ordinary recovery before the elemental journey becomes large-scale.

## NPC-LUMINA-NEW-01 — パン焼きの女

Role: communal oven keeper
Life: bakes for several households because two ovens cracked during the disturbance.
Family: husband has a burned hand; older daughter is temporarily doing deliveries.
Knowledge: `observed` only.
Function: life / recovery / small RPG grounding

### First visit

```text
パン焼きの女：
「朝の分はもうないよ。昼なら、端っこを残せる」

パン焼きの女：
「旅に出るなら食べておきな。
腹が空いた勇者なんて、ただの機嫌の悪い若者だよ」
```

### After first-cave clear

```text
パン焼きの女：
「穴の騒ぎが収まったって？」

「じゃあ明日は、粉を多めに練る。
祝いじゃないよ。修理の連中が食うんだ」
```

### Later revisit

```text
パン焼きの女：
「おや。顔つきが旅人になったね」

「……村の味が恋しい、とか言うなよ。
こっちは塩を減らしたの、まだ誤魔化してるんだから」
```

Notes:
- Last line is not a lie to the player; it is an embarrassed admission about rationing.
- Keep it mundane. No prism metaphor.

## NPC-LUMINA-NEW-02 — 山羊を探す少年

Role: helps family herd goats near the village edge.
Life: one goat disappeared during the mountain collapse and later returns on its own.
Knowledge: `wrong-belief`.
Wrong belief: believes the cave “hates bells” because the missing goat wore a bell and only the strap was found first.
Why he believes it: child pattern-matching under fear; adults did not explain the collapse.
Function: child misconception / flavor / gentle dungeon unease

### Before cave clear

```text
少年：
「山へ行くなら、鈴は外した方がいいよ」

「ミルの鈴だけ、切れて落ちてたんだ。
穴のやつ、鈴の音が嫌いなんだと思う」
```

### After cave clear

```text
少年：
「ミル、帰ってきた」

「鈴はなくしたけど、本人は平気そう。
……穴が返してくれたのかな」
```

### Optional party reaction: Sara present

```text
サラ：
「迷って、戻ってきたのかもしれませんね」

少年：
「そっか。じゃあミル、道を覚えたんだ」
```

Notes:
- Sara does not “correct” him with setting knowledge she does not have.

## NPC-LUMINA-NEW-03 — 行商人モルド

Role: small traveling peddler; sells needles, salt, lampwick, cheap charms.
Life: detours around dangerous roads and turns every detour into a heroic story to justify higher prices.
Knowledge: `deliberate-lie`, low-stakes.
Lie: claims he personally drove off three cave monsters on the north road.
Truth: he saw tracks, turned around, and slept in a hay shed.
Motive: salesmanship and embarrassment; wants villagers to keep trusting him as a reliable road man.
If exposed: laughs first, then admits he ran; does not double down.
Function: humor / trade / unreliable rumor source

### First visit

```text
モルド：
「北道？　通れる通れる。俺が三匹ばかり追い払った後だからな」

「で、命を張った男から塩を買う気は？
今日はほんの少しだけ高い」
```

### If spoken to after a villager mentions the north road was blocked

```text
モルド：
「……三匹ってのは、足跡が三組あったって意味だ」

「追い払ったってのは……俺が反対へ歩いたから、結果として距離は開いた」

「商売人の言葉は、よく噛んで聞け。俺が言うのもなんだが」
```

Notes:
- No critical navigation information should depend on him.

---

# 2. 炎の里イグニシア

Area: Ignisia
Timing: prism instability / immediately after restoration / late revisit
Known: fire is behaving abnormally; army inspection occurred; local work is failing.
Hidden: full cause and Shanny's history.
Purpose: show that fire restoration fixes one crisis and immediately creates a backlog of human work.

## NPC-IGNISIA-NEW-01 — 共同炊事場の番人

Role: runs the communal cauldron when household hearths are unsafe.
Life: keeps meal order by household token; hates waste more than she fears monsters.
Knowledge: `observed`.
Function: life / recovery / practical stakes

### During fire instability

```text
炊事番：
「鍋に近づくな。さっきまで弱火だったのに、急に蓋が跳ねた」

「今日の豆は半煮えだ。
文句は火山に言っとくれ。順番は変えないよ」
```

### Immediately after fire restoration

```text
炊事番：
「火が戻った？　見りゃ分かるよ。
鍋底を二つ焦がした」

「嬉しいさ。嬉しいけどね、
加減を忘れた手まで一晩で戻るわけじゃない」
```

### Later revisit

```text
炊事番：
「今日は煮込み。明日は焼き物」

「普通の献立を考えるの、こんなに面倒だったかね。
……まあ、悪くない面倒だ」
```

## NPC-IGNISIA-NEW-02 — 湯屋の老人

Role: maintains a small public bath and hot-water pipes.
Life: old pipes cracked during uncontrolled heat surges.
Knowledge: `wrong-belief`.
Wrong belief: younger smiths stopped observing an old pre-heating custom, angering “the mountain.”
Reason: the custom historically reduced thermal shock, so he has seen a real correlation but mistakes engineering for divine displeasure.
Function: local tradition / plausible wrong explanation

### During crisis

```text
湯屋の老人：
「若いのは、すぐ火を急かす」

「昔は湯を通す前に、石へ水をひと匙やった。
笑うからこうなる。山にも機嫌ってもんがある」
```

### After clear

```text
湯屋の老人：
「ほら見ろ。水をやったら静かになった」

里の若者：
「プリズムが戻った日と同じ日だろ」

湯屋の老人：
「二つ効いたんだよ。年寄りの顔を立てろ」
```

Notes:
- Do not resolve who is “right” in narration. His custom can still be mechanically sensible.

## NPC-IGNISIA-NEW-03 — 注文帳を抱えた若い職人

Role: receives repair orders for tools, stove plates, hinges, and weapons.
Life: villagers assume warriors' gear should be repaired first because the heroes saved them; he refuses.
Knowledge: `observed`.
Function: RPG-world practicality / mild resistance to hero privilege

### Post-clear

```text
若い職人：
「剣の研ぎ直し？　番号札、七十二番」

「その顔するなよ。英雄でも七十二番だ。
一番は産婆の湯沸かし釜。二番は水車の軸」

「剣が要るのは分かる。
けど畑は明日もある。鍬がなきゃ飯が減る」
```

### Second talk

```text
若い職人：
「……急ぎなら、刃こぼれだけ見てやる」

「順番を曲げるんじゃない。
旅人を欠けた剣で送り出すと、あとで寝覚めが悪いだけだ」
```

## NPC-IGNISIA-NEW-04 — シャニー加入後の灰掃き女

Runtime hold: **late-game relationship approval recommended**.
Role: lost an older brother during past instability/violence around the region; does not know Shanny's full history.
Knowledge: `heard` + personal grief.
Attitude: does not forgive Shanny merely because the party accepts her.
Function: social consequence / resistance / no instant absolution

### If Shanny is in party on late revisit

```text
灰掃きの女：
「……その人、里に入れるんだね」

シャオ：
「俺が――」

灰掃きの女：
「シャオに聞いてない」

「助けたって話は聞いたよ。
でも、それで私が怖くなくなるわけじゃない」
```

### Shanny response

```text
シャニー：
「そうね」

灰掃きの女：
「……謝らないの」

シャニー：
「あなたが知らない罪まで、
都合よく私の口で一つにしたくない」
```

Notes:
- This does **not** define the woman's brother as a direct victim of Shanny. Her fear/grief can be association, not factual accusation.
- Avoid turning the exchange into a courtroom summary.

---

# 3. 風の集落カザリア

Area: Kazaria
Timing: adult disappearance / after wind restoration / after Arisa & Haine join / saint-rumor period
Known: adults disappeared and later returned; wind culture is local life.
Hidden: Veleria/Elicia full truth.
Purpose: keep Kazaria culturally distinct without making every resident speak in wind poetry.

## NPC-KAZARIA-NEW-01 — 綱直しの女

Role: repairs roof ropes, drying lines, and travel packs.
Life: business worsened when the wind was abnormal, then exploded after everyone returned and found neglected damage.
Knowledge: `observed`.
Function: recovery / shop-adjacent RPG texture

### During disappearance

```text
綱直しの女：
「結び目は嘘つかない。
緩んだら、誰かが締めなきゃ落ちる」

「今は屋根より子どもの寝床が先。
布が飛ばないよう、端を踏んでて」
```

### After clear

```text
綱直しの女：
「大人が戻ったら楽になると思った？」

「逆だよ。屋根、柵、荷綱、全部いっぺんに壊れてるって気づいた」

「まあ、直す人の手も戻ったけどさ」
```

## NPC-KAZARIA-NEW-02 — 年長の留守番娘

Role: teenager who took care of younger children during the disappearance.
Life: now that adults returned, everyone tells her to “go play,” which annoys her.
Knowledge: `observed`; emotional reaction is not corrected.
Function: aftermath / resentment without villainy

### After clear

```text
留守番娘：
「帰ってきた途端にさ、みんな言うんだ。
『もう子どもに戻っていい』って」

「勝手だよね。
鍋の焦げ落としまで覚えさせといて」
```

### Second talk

```text
留守番娘：
「でも昨日、昼まで寝た」

「弟が粥を作って、まずかった。
……ちょっとだけ、子どもに戻れた」
```

## NPC-KAZARIA-NEW-03 — 祭りを教える老女

Role: teaches old Kazaria dance steps to children.
Knowledge: `wrong-belief`.
Wrong belief: adults vanished because the younger generation performed a festival step carelessly.
Reason: her late partner insisted ritual precision protected the village; guilt turned that teaching into certainty.
Function: culture / grief-shaped error / future Veleria contrast

### Before resolution

```text
老女：
「三歩目で踵を上げるな、と何度言ったか」

「風は見ているよ。
雑に踊れば、雑に連れていく」
```

### After adults return

```text
老女：
「……戻ったね」

子ども：
「じゃあ踊り、間違ってなかった？」

老女：
「さあね。今日は最初からやるよ」

「間違ってても、覚えるまでやる。
それが祭りだ」
```

Notes:
- Her belief is not authoritative canon. It emerges from grief and tradition.

## NPC-KAZARIA-NEW-04 — 旅荷の商人（聖女の噂期）

Role: moves cloth between Kazaria and Rivaria.
Knowledge: `heard` / distorted rumor.
Belief: the “saint” in Rivaria healed a whole canal by touching the water.
Actual basis: he heard three separate stories—someone treated wounded people, clean water returned, a pale-clad girl was seen—and fused them.
Function: rumor mutation / no identity reveal

### After `waterCityRiotSuppressed`, before `lunaSurvivalRevealed`

```text
旅商人：
「水上都市じゃ、聖女が運河に手を入れたら濁りが引いたってさ」

綱直しの女：
「昨日は『兵を十人眠らせた』って言ってなかった？」

旅商人：
「俺が言ったんじゃない。聞いた話だ」

綱直しの女：
「その口で聞いたんだろ」
```

Notes:
- Explicitly demonstrates rumor drift without a narrator correcting it.

---

# 4. 水上都市リヴァリア

Area: Rivaria
Timing: occupation / riot aftermath / Rexnote route period / later revisit
Known: occupation, water trouble, riot, repairs.
Hidden: larger political manipulation unless character-specific.
Purpose: make a commercial city feel divided; not everyone hated every soldier, and not everyone welcomes the post-riot vacuum.

## NPC-RIVARIA-NEW-01 — 洗濯場の姉妹

Role: sisters running a laundry service for inns and boats.
Life: one is practical, one keeps grudges; both worked for occupying soldiers because refusing meant no income.
Knowledge: `observed`.
Function: labor / moral ambiguity / recovery

### During occupation

```text
姉：
「黒い外套は別桶。金具で他の布が裂けるから」

妹：
「敵の洗濯なんか断ればいいのに」

姉：
「断ったら、あんたの飯も断ることになるよ」
```

### After riot

```text
妹：
「兵がいなくなった。せいせいした」

姉：
「売上も半分になった」

妹：
「……じゃあ、戻ってきてほしいの？」

姉：
「冗談。客が減ったって話をしてるだけだよ」
```

## NPC-RIVARIA-NEW-02 — 氷売りの男

Role: sells blocks of stored ice to fishmongers and healers.
Life: occupation disrupted delivery; he is accused of price gouging.
Knowledge: `half-truth`.
Truth: transport really became dangerous; he also added a margin because he expected future shortages.
Motive: protect household savings after losing a boat the previous year.
Function: trade / self-interest / morally gray but ordinary

### During shortage

```text
氷売り：
「高い？　なら買うな。
こっちだって橋を二つ迂回して運んでる」

魚屋：
「迂回代にしちゃ倍だろ！」

氷売り：
「来月も氷がある保証を、値段に入れてんだよ」
```

### After clear

```text
氷売り：
「道が戻ったから下げた。見ろ、ちゃんと下げた」

魚屋：
「上げる時の半分しか下げてない」

氷売り：
「去年、船が沈んだ時に誰が補填した？　俺だよ」
```

Notes:
- He is not a secret villain. His risk calculation is selfish and understandable.

## NPC-RIVARIA-NEW-03 — 舟を描く子ども

Role: waits near repair docks while parent works.
Knowledge: `wrong-belief`.
Wrong belief: black-armored soldiers cannot swim because the child never saw them remove armor and heard adults say “those men sink the city.”
Function: child logic / tonal relief

### During occupation

```text
子ども：
「黒い兵隊って、泳げないんだよ」

「だってずっと鎧着てる。
水に落ちたら、たぶん底まで行く」
```

### After riot

```text
子ども：
「昨日、鎧の人が泳いで逃げたって」

「……ずるい。泳げないと思ってたのに」
```

## NPC-RIVARIA-NEW-04 — 倉庫組合の書記

Role: records damaged cargo and disputed claims.
Life: disliked occupation but also fears the collapse of order after it.
Knowledge: `observed` + political assumption.
Function: resistance to easy victory narrative / quest-world grounding

### Post-riot

```text
書記：
「解放、ね。言葉はきれいだ」

「今朝だけで、持ち主の分からない荷が十四箱。
兵が怖くて黙ってた盗人まで、急に元気になった」

「勘違いするな。戻ってきてほしいとは言ってない。
次の秩序を作る手が要るって言ってる」
```

### If party is heading to Rexnote

```text
書記：
「旧レクスノート家の印がある帳面なら、捨てるなよ」

「昔の税帳は嫌われるが、橋の修理歴まで載ってる。
嫌いな相手の記録ほど、後で役に立つことがある」
```

Notes:
- This is a soft RPG nudge toward valuing records without revealing the basement solution.

---

# 5. レクスノート邸

Area: Rexnote Estate exterior/interior
Timing: first arrival / basement investigation / after Alan joins / later evidence quest
Known: house is fallen, locals know pieces of its reputation.
Hidden: Alan's mission, deep family/political truth, private-record specifics until found.
Purpose: make the mansion feel like a place where people once worked, not just a dungeon lobby.

## NPC-REXNOTE-NEW-01 — 元庭師オルバ

Role: former estate gardener; now keeps weeds from swallowing the road because nearby farmers still use the path.
Life: was not a confidant of the family. Knows servants' routines, not political secrets.
Knowledge: `observed` / `deliberate-lie` on a low-stakes matter.
Lie: says the old wine cellar collapsed and contains nothing.
Truth: it is mostly intact; he hides blankets and tools there for two elderly former servants who sometimes sleep on the property.
Motive: prevent scavengers from stripping their shelter.
Exposure reaction: becomes defensive, then asks the party not to take the bedding; he does not invent grander secrets.
Function: lived history / grounded lie / anti-treasure-chest logic

### First arrival

```text
オルバ：
「屋敷を見に来たなら、瓦に気をつけろ。
家名より先に屋根が落ちる」

「地下？　知らんよ。
酒蔵なら潰れた。漁る物もない」
```

### If player later finds evidence the cellar is used

```text
オルバ：
「……見たのか」

「盗人避けだ。嘘で悪かったな」

「婆さん二人が、雨の夜だけあそこを使う。
本も魔道具もない。毛布まで持っていくな、それだけだ」
```

### If Alan is present

```text
オルバ：
「若様――」

アラン：
「その呼び方はやめてくれ」

オルバ：
「分かった。アランさん」

「……草は、勝手に伸びる。
家がなくなっても、そこだけ律儀だ」
```

Notes:
- Do not make Orba a secret keeper of Arel's conspiracy evidence.

## NPC-REXNOTE-NEW-02 — 帳場を手伝っていた女

Role: former kitchen/accounting helper, now visits to retrieve household ledgers useful to local creditors.
Life: resents nobles generally, but remembers Arel as punctual with worker wages.
Knowledge: personal employment history only.
Function: contradictory reputation / Alan characterization

### First talk

```text
元使用人：
「レクスノート家が善人だったかって？」

「知らないよ。貴族なんて、台所まで降りてこない」

「ただ給金は日付どおりだった。
それで父の薬が買えた。私が知ってるのはそこまで」
```

### If Alan reacts

```text
アラン：
「父は……使用人には、そうだったのか」

元使用人：
「『には』って何さ」

「家族の父親まで、台所女に採点させないでよ。
あんたが知らないなら、あんたが考えな」
```

Notes:
- Important: she refuses to solve Alan's father for him.

## NPC-REXNOTE-NEW-03 — 船渠の魔導整備士

Role: once serviced the family boat's minor fittings; not the core creator.
Life: superstitious about magical vessels because he understands only mechanical parts.
Knowledge: partial technical knowledge + `wrong-belief`.
Wrong belief: the boat “remembers bad-tempered owners” and stalls for people it dislikes.
Basis: mana feed fluctuates with inexperienced operators; he anthropomorphizes it.
Function: boat flavor / RPG travel anticipation

### Before boat acquisition

```text
整備士：
「船体は古いが、腹は丈夫だ」

「ただし機嫌がある。
急かす奴の時ほど、起動輪が二回止まる」
```

### Alan present

```text
アラン：
「機嫌じゃない。魔力の入れ方が荒いだけだ」

整備士：
「ほら。そうやって理屈で怒鳴る家の船だから、性格が悪くなった」

アラン：
「……もう好きに言え」
```

### After acquisition

```text
整備士：
「帰ってきた時、底を見せろよ。
海は静かでも、船底は嘘つかん」
```

---

# 6. ライザーク要塞

Area: Thunder Fortress / surrounding hub
Timing: first crisis / after fortress clear / later revisit
Known: machines malfunctioned; multiple armed groups are present; civilians and guild workers are affected.
Hidden: the full wedge system and Leonard's later role until story reveals it.
Purpose: show a military/adventurer hub as a workplace full of competence, fear, and institutional disagreement.

## NPC-THUNDER-NEW-01 — 整備主任バスコ

Role: maintains lift rails and lightning conductors.
Life: his apprentice was injured, and he has been doing two people's work while pretending the schedule is normal.
Knowledge: `deliberate-lie`, low stakes.
Lie: says a jammed machine “kicked by itself” despite perfect maintenance.
Truth: he skipped one oiling cycle because he was at the infirmary with his apprentice.
Motive: shame and fear that command will dismiss the apprentice for causing delays.
Exposure reaction: snaps, then admits it; asks the party not to blame the apprentice.
Function: machinery life / lie with human stakes

### During crisis

```text
バスコ：
「触るな。そいつは今朝、勝手に蹴った」

「整備はしてある。毎日だ。俺の記録に穴はない」
```

### If maintenance ledger is examined later

```text
バスコ：
「……一日だけ抜けてる」

「弟子が指を潰した日だ。
医務室にいた。戻ったら交代の奴がもう避難してた」

「俺の手抜きでいい。
あいつの名前を報告書に足すな」
```

Notes:
- The machine crisis itself must not be explained away by this skipped maintenance. It is one local failure inside a larger supernatural/systemic event.

## NPC-THUNDER-NEW-02 — 医務室の補助員

Role: washes bandages, counts pain medicine, cannot use high healing magic.
Life: irritated that adventurers call non-magical care “just bandages.”
Knowledge: observed injuries, little politics.
Function: ordinary competence / item-healing texture

### During crisis

```text
補助員：
「治癒術が使えるなら、奥の三人を先に見て」

「こっちは血を止める。骨を固定する。熱を測る。
魔法が切れた後も、人はまだ怪我してるから」
```

### After clear

```text
補助員：
「今日は包帯を煮沸する暇がある」

「暇って言うと怒られるけど、
医務室じゃ最高の褒め言葉だよ」
```

## NPC-THUNDER-NEW-03 — 新米冒険者二人

Role: E-rank pair taking minor guild jobs near the fort.
Life: one idolizes Leonard, the other distrusts anyone praised by officers.
Knowledge: both `heard`; neither knows the truth.
Function: conflicting public image / RPG guild flavor

### Before Leonard confrontation

```text
新米A：
「レナード様が来たなら終わったも同然だろ。
東門の魔物を一人で止めたって話、知らない？」

新米B：
「その話、昨日は『十人で止めた』だったぞ」

新米A：
「英雄譚は人数が減るほど本物っぽいんだよ」
```

### After fortress crisis

```text
新米B：
「なあ。結局、誰が味方だったんだ？」

新米A：
「分からん」

新米B：
「……ギルドの依頼書、魔物の数だけは正確で助かるな」
```

Notes:
- Do not have them summarize Leonard's true alignment.

## NPC-THUNDER-NEW-04 — 家へ手紙を書けない補給兵

Role: handles preserved food and lamp fuel.
Life: keeps rewriting a letter to his younger sister, ashamed that he was afraid.
Knowledge: observed.
Function: aftermath / small optional document event

### Examine desk after clear

```text
書きかけの手紙：
「要塞は無事だ。俺も――」

その先が三度、線で消されている。

端に小さく、
「怖かった。でも逃げなかった。たぶん」と書き直してある。
```

Notes:
- Can be an examine event rather than actor, reducing map crowding.

---

# 7. 結晶樹の秘跡

Area: Crystal Tree
Timing: arrival / Minerva research phase / defense clear / six-element ritual aftermath
Known: this is a dangerous research/ritual site; Minerva leads theory work.
Hidden: anything beyond the player's current reveal, including cycle-crystal realignment pending approval.
Purpose: prevent the site from feeling like Minerva and six pedestals exist in an empty level editor. Add a small expedition camp without turning it into a town.

## NPC-CRYSTAL-NEW-01 — 採集助手ニナ

Role: Minerva's temporary field assistant; labels roots, water samples, broken crystal flakes.
Life: competent at cataloging, terrified of touching active crystals.
Knowledge: research fragments, not cosmology.
Function: research life / mild humor

### Before defense

```text
ニナ：
「赤札は触るな、青札は運んでいい、黒札は先生を呼ぶ」

「白札？　……白札は、先生が札を付け忘れたやつ。
一番触るな」
```

### Minerva nearby

```text
ミネルバ：
「私、そんなに付け忘れる？」

ニナ：
「昨日だけで四つです」

ミネルバ：
「昨日は少ない方ね」
```

## NPC-CRYSTAL-NEW-02 — 荷運びの猟師

Role: paid to carry water, food, and specimen crates from the nearest safe route.
Life: does not care about theory, cares about whether crystal light spooks pack animals.
Knowledge: `wrong-belief`.
Wrong belief: crystals “smell fear” because nervous animals stop near bright roots.
Basis: animals react to vibration/high-frequency resonance he cannot perceive.
Function: ground lofty research in field logistics

### First talk

```text
猟師：
「先生方は『共鳴』って言うが、俺は匂いだと思うね」

「怯えた馬ほど、あの根の前で止まる。
石が怖がってる奴を嗅ぎ分けるんだ」
```

### After defense

```text
猟師：
「今日は馬が通った」

「俺が慣れたのか、石が慣れたのか。
どっちでもいい。荷が軽くなるならな」
```

## NPC-CRYSTAL-NEW-03 — 子ども避けの迷信を作った助手

Role: another low-level assistant who stores glittering but useless crystal offcuts.
Knowledge: `deliberate-lie`, harmless preventative superstition.
Lie: tells local children that crystals turn a liar's tongue green.
Truth: he invented it after children stole sharp crystal flakes and cut their hands.
Motive: safety; adults failed to keep them away with ordinary warnings.
Exposure reaction: admits it immediately to adults but asks them not to ruin it in front of children.
Function: human-scale lie / comedy / safety without tutorial prose

### Optional camp talk

```text
助手：
「子どもが来たら、そこの欠片は『嘘つきの舌を緑にする』って言ってくれ」

「本当かって？　まさか。
『切れるから触るな』で触ったんだよ、あいつら」
```

### If Sara objects

```text
サラ：
「嘘を重ねるのは、あまり……」

助手：
「じゃあ次に来た子へ説明してみてくれ。
目がきらきらしてる時の子ども、理屈を聞かないから」

サラ：
「……緑は、少し怖すぎませんか」
```

Notes:
- Keep optional. It is a low-stakes ethical disagreement, not a grand “truth vs lie” motif speech.

## NPC-CRYSTAL-NEW-04 — 儀式後の休憩場所

Role: environmental examine text; no speaker.
Function: aftermath / physical cost

### After `crystalTreeDefenseCleared`

```text
敷物の上に、空になった水差しが三つ並んでいる。

薬包の紙には、急いで開けた歯形が残っている。
誰かが「次は栓抜きを持つ」と書き足してある。
```

### After `crystalTreeSixElementRitualSeen`

```text
同じ場所に、新しい水差しが置かれている。
今度は栓抜きが紐で結びつけてある。
```

Notes:
- No lore explanation. The site remembers the previous event through mundane preparation.

---

# 8. ガルヴァニア帝国

Area: Galvania Empire M0
Timing: first arrival after Crystal Tree / Dark Castle approach / post-castle revisit
Known: residents have been defending and evacuating; humans and demons distrust each other.
Hidden: no resident is given omniscient knowledge of Zenon, Jasper, Abyss, or Luna's internal state.
Purpose: strongest social contrast in this batch. The player must see people, not “enemy-race exposition.”

## NPC-GALVANIA-NEW-01 — 配給パンの焼き手

Role: civilian baker attached to ration kitchens.
Life: flour is stretched with root meal; his child hides behind the ovens when humans enter.
Knowledge: `deliberate-lie`.
Lie: tells human travelers the dark ration bread contains powdered bone and will make them sick.
Truth: it is ordinary root-mixed bread, scarce but edible.
Motive: scare the party away from food reserved for children and keep strangers away from his frightened child.
Exposure reaction: if caught, does not apologize elegantly; says he would lie again if his child were hungry.
Function: scarcity / hostility / grounded lie

### First talk

```text
焼き手：
「人間向けのパンはない」

「こいつは骨粉入りだ。腹を壊すぞ。
分かったら向こうへ行け」
```

### If party notices a demon child eating the same bread

```text
ガイル：
「……あの子、普通に食ってるぞ」

焼き手：
「見たなら分かるだろ。嘘だ」

「子どもの分が減ると思った。
それで十分な理由だ、俺にはな」
```

### Optional Luna reaction

```text
ルーナ：
「私たちは、奪いません」

焼き手：
「お前が何をするかじゃない。
俺が、お前を知らないんだ」
```

Notes:
- Do not force reconciliation in the same interaction.

## NPC-GALVANIA-NEW-02 — 靴直しの老婆

Role: repairs soldier boots and children's shoes with the same needles.
Life: has poor eyesight; recognizes people by gait more than faces.
Knowledge: `observed` + prejudice.
Function: ordinary work / resistance to faction labels

### First arrival

```text
老婆：
「そこで止まりな。泥を落としてから入れ」

「人間か魔族かは、床を汚す量じゃ分からん。
兵士は全員ひどい」
```

### If Leila is present

```text
老婆：
「お前、騎士だね。踵が減りすぎだ」

レイラ：
「……歩き方で？」

老婆：
「顔なんぞ見えんよ。
偉そうな奴ほど、靴は正直だ」
```

### Post-castle

```text
老婆：
「王が負けても、靴底は減る」

「政治の話なら他所でしな。
修理するなら脱いで置け」
```

## NPC-GALVANIA-NEW-03 — 防壁で働く若い工兵

Role: repairs cracks that originate from deeper in the empire.
Life: lost a friend to a cave-in; resents heroic curiosity around dangerous cracks.
Knowledge: `observed`, not full cause.
Function: dungeon-route atmosphere / anti-exposition

### First arrival

```text
若い工兵：
「覗くな。落ちたら助けに行くのは俺たちだ」

「『何が下にいる』って？
知らん。知ってたら穴が塞がるのか」
```

### Second talk

```text
若い工兵：
「三年前は指二本ぶんだった。
今は腕が入る」

「それだけ覚えて帰れ。
名前を付けるのは、学者の仕事だ」
```

Notes:
- A good example of a person refusing the player's implied lore question for practical reasons.

## NPC-GALVANIA-NEW-04 — 避難所の少年と姉

Role: siblings who repeatedly evacuate when underground alarms sound.
Life: boy treats evacuation as a game; sister knows it is because their mother has not returned from an outer post.
Knowledge: different levels within one family.
Function: emotional asymmetry / no omniscient child

### First arrival

```text
少年：
「鐘が三回なら、競走なんだ」

姉：
「二回でも走るの」

少年：
「三回の方が速く走る」

姉：
「……そうだね。三回は、もっと速く」
```

### Party leaves

```text
少年：
「姉ちゃん、今日も母さん勝つ？」

姉：
「勝つよ」

少年：
「何と？」

姉：
「……遅刻と」
```

Knowledge note:
- The sister's final answer is an intentional protective lie/deflection: mother is overdue from an outer defensive post and her status is unknown.
- Motive: the boy sleeps only if told their mother is merely late.
- Exposure reaction should be quiet, not dramatic: if the mother is later confirmed safe/dead, the sister changes the wording rather than giving a moral speech about lying.

## NPC-GALVANIA-NEW-05 — 城攻略後、話しかけない住民

Role: civilian who lost family during human-led campaigns and does not want a conversation.
Function: refusal / social consequence

### If player interacts post-castle

```text
魔族の住民：
「……今は話したくない」
```

### If interacted again

```text
魔族の住民：
「助けたことまで否定してない」

「でも、礼を言える日を
そっちが決めないでくれ」
```

Notes:
- Do not reward repeated interaction with a secret item. The refusal itself is the content.

---

# 9. Cross-area progression design

The new NPCs should not all flip from `before` to `happy_after`. Use at least these state patterns:

| Pattern | Example | Meaning |
|---|---|---|
| crisis -> backlog | Ignisia cook, Kazaria rope-mender | recovery creates work |
| fear -> habit | Lumina goat boy | wrong belief softens but survives |
| occupation -> economic vacuum | Rivaria laundry/ice | liberation has costs |
| ruin -> contested memory | Rexnote servants | history differs by social position |
| emergency -> shame | Thunder mechanic | institutional crisis exposes private failures |
| research -> routine | Crystal Tree camp | cosmic place gains mundane memory |
| enemy capital -> unresolved distrust | Galvania civilians | victory does not auto-create reconciliation |

## 9.1 Recommended density

Do not place every proposed actor on every map.

Recommended first runtime pass after approval:

- Lumina: 2 actors + peddler as rotating/temporary actor.
- Ignisia: 2 new actors; late Shanny reaction can reuse one.
- Kazaria: 2 new actors; saint rumor can be attached to merchant spawn.
- Rivaria: 2–3 new actors because it is a major commercial hub.
- Rexnote: 1–2 exterior actors, preferably after route briefing so the ruined estate does not look inhabited as a normal town.
- Thunder: 2 actors + one examine document.
- Crystal Tree: 1–2 expedition assistants + environmental examine; do not make it a settlement.
- Galvania: 3 actors initially; add post-castle refusal state later.

---

# 10. Review result

Target: new world-life / revisit dialogue batch
Reviewer: Codex-style self-review
Date: 2026-08-15

### Scores
- Character voice separation: 4
- On-screen readability and dialogue rhythm: 4
- Spoiler discipline: 5
- Lived-in world detail: 5
- Exposition control: 5
- Foreshadowing subtlety: 4
- Flag and party awareness: 4
- Existing dialogue handling: 5
- Player interpretation / information boundary: 5
- Implementation readiness: 4

### Required fixes before implementation
- Confirm exact actor placement coordinates after Phaser map readability check.
- Confirm late Ignisia/Shanny reaction timing against the approved Shanny reconciliation sequence.
- Confirm whether the Rexnote former gardener should visually appear on first arrival or only after Alan's request begins.
- Do not connect any Crystal Tree line to the pending Cycle Crystal realignment until that separate proposal is approved.

### User approval required
- Runtime insertion of all new dialogue.
- Late Shanny/Ignisia social-consequence scene.
- Any map actor additions that change crowding/visual composition.

### Recommendation
- New prose is suitable for review as a first population pass.
- Implement in small area batches after approval, preserving all current lines.
