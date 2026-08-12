# システム文・メニュー／UI文言 全体レビュー台帳 — 2026-08-10

Status: **inventory / no automatic replacement**

## 運用ルール

- チュートリアルを除き、既存のシステム文・目的文・マップ操作文・メニュー／UI文言をレビュー対象として収集する。
- 修正する場合は必ず **現行 / 修正案** を併記し、ユーザーの最終判断前にruntimeへ反映しない。
- `（未提案・レビュー待ち）` は、収集済みだがまだ文章案を提示していない項目。
- チュートリアルは既存のUI完成ゲート方針を優先し、現在の一括レビューからは保留する。
- この台帳は初回全体走査のmaster inventory。今後、新規システム文／UI文言を追加した場合も追記する。

## 集計

- total entries: **1656**
- story system narration: **159**
- story objective text: **55**
- other UI/map/menu candidates: **1442**

## レビュー項目

|#|分類|source|context|現行|修正案|status|
|---:|---|---|---|---|---|---|
|1|story_system|`story.js:93`|PROLOGUE_WEST_HILL_OPENING|――5年前。山奥の小さな村。|（未提案・レビュー待ち）|inventory_only|
|2|story_system|`story.js:94`|PROLOGUE_WEST_HILL_OPENING|眼下の村では、小さな光神の祠へ朝日が差し、白い祈り布が風に揺れている。水路の音に、炊事の匂いが混じっていた。|（未提案・レビュー待ち）|inventory_only|
|3|story_system|`story.js:96`|PROLOGUE_WEST_HILL_OPENING|東の空が、白く弾けた。|（未提案・レビュー待ち）|inventory_only|
|4|story_system|`story.js:98`|PROLOGUE_WEST_HILL_OPENING|遅れて、腹の底まで響く轟音。高台が大きく跳ね、山のどこかで土砂が崩れる音がした。|（未提案・レビュー待ち）|inventory_only|
|5|story_system|`story.js:103`|PROLOGUE_SOUTH_AMBUSH|道の先で、毛を逆立てた魔物がルーナへ飛びかかった。|（未提案・レビュー待ち）|inventory_only|
|6|story_system|`story.js:108`|PROLOGUE_LUCION_RECOVER|閉じかけた視界に、淡い光がにじむ。痛みが引き、指先に力が戻った。|（未提案・レビュー待ち）|inventory_only|
|7|story_system|`story.js:115`|PROLOGUE_HOME_LOST|家へ続いていた道は、途中で途切れていた。|（未提案・レビュー待ち）|inventory_only|
|8|story_system|`story.js:116`|PROLOGUE_HOME_LOST|その先には、底の見えない裂け目しかない。|（未提案・レビュー待ち）|inventory_only|
|9|story_system|`story.js:119`|PROLOGUE_HOME_LOST|足元で石が崩れ、闇の中へ吸い込まれていく。|（未提案・レビュー待ち）|inventory_only|
|10|story_system|`story.js:123`|PROLOGUE_SOUTH_EXIT_BOSS|村を抜ける道へ駆け込んだ、その時。|（未提案・レビュー待ち）|inventory_only|
|11|story_system|`story.js:124`|PROLOGUE_SOUTH_EXIT_BOSS|裂け目の底から、形の定まらない巨大な影が這い上がった。|（未提案・レビュー待ち）|inventory_only|
|12|story_system|`story.js:127`|PROLOGUE_SOUTH_EXIT_BOSS|白い光が胸の奥へ沈み、冷えていた手が熱を取り戻した。|（未提案・レビュー待ち）|inventory_only|
|13|story_system|`story.js:130`|PROLOGUE_COLLAPSE_AND_PENDANT|大きな亀裂が走り、足場が一気に傾いた。|（未提案・レビュー待ち）|inventory_only|
|14|story_system|`story.js:132`|PROLOGUE_COLLAPSE_AND_PENDANT|ルーナが首元のペンダントを外し、アルスの手へ押し込んだ。|（未提案・レビュー待ち）|inventory_only|
|15|story_system|`story.js:134`|PROLOGUE_COLLAPSE_AND_PENDANT|掴んだ手が離れる。次の瞬間、視界が暗闇に呑まれた。|（未提案・レビュー待ち）|inventory_only|
|16|story_system|`story.js:137`|PROLOGUE_FIRST_BOSS_WIN|巨大な影が揺らぎ、裂け目の縁へ崩れ落ちた。|（未提案・レビュー待ち）|inventory_only|
|17|story_system|`story.js:139`|PROLOGUE_FIRST_BOSS_WIN|返事の代わりに、地の底から冷たい気配が吹き上がる。|（未提案・レビュー待ち）|inventory_only|
|18|story_system|`story.js:143`|PROLOGUE_PRESENT_WAKE|――5年後。山中の小さな山小屋。|（未提案・レビュー待ち）|inventory_only|
|19|story_system|`story.js:144`|PROLOGUE_PRESENT_WAKE|地鳴りで目が覚めた。枕元では、焼け焦げたペンダントが小さく揺れている。|（未提案・レビュー待ち）|inventory_only|
|20|story_system|`story.js:157`|PRESENT_LUMINA_RESCUE|山を下りて最初に見えた村から、鋭い悲鳴が上がった。|（未提案・レビュー待ち）|inventory_only|
|21|story_system|`story.js:166`|PRESENT_LUMINA_RESCUE_RETRY|倒れかけたアルスは息を整え、もう一度剣を握った。子どもたちはまだ逃げ切れていない。|（未提案・レビュー待ち）|inventory_only|
|22|story_system|`story.js:169`|PROLOGUE_HIDDEN_ILLUMINACIA_WIN|あり得ないはずの一撃が、イルミナシアの混沌を打ち砕いた。|（未提案・レビュー待ち）|inventory_only|
|23|story_system|`story.js:171`|PROLOGUE_HIDDEN_ILLUMINACIA_WIN|相反する二つの気配が、時の裂け目の向こうから近づいてくる。|（未提案・レビュー待ち）|inventory_only|
|24|story_system|`story.js:174`|PROLOGUE_HIDDEN_ALTAR|裂け目の向こうに、見覚えのない祭壇が浮かんでいる。空気だけが、ひどく古い。|（未提案・レビュー待ち）|inventory_only|
|25|story_system|`story.js:177`|PROLOGUE_HIDDEN_ALTAR|祭壇の奥で、巨大な影が何度も輪郭を失っている。|（未提案・レビュー待ち）|inventory_only|
|26|story_system|`story.js:180`|PROLOGUE_HIDDEN_END_WIN|祭壇を覆っていた闇が裂け、白い光が足元から押し寄せる。|（未提案・レビュー待ち）|inventory_only|
|27|story_system|`story.js:181`|PROLOGUE_HIDDEN_END_WIN|光に呑まれても、手のひらに残った熱だけは消えなかった。|（未提案・レビュー待ち）|inventory_only|
|28|story_system|`story.js:184`|PROLOGUE_HIDDEN_END_LOSS|不完全な顕現でさえ、深淵王の力は圧倒的だった。四人の意識が闇へ沈む。|（未提案・レビュー待ち）|inventory_only|
|29|story_system|`story.js:185`|PROLOGUE_HIDDEN_END_LOSS|意識が沈む寸前まで握っていた力だけが、熱のように身体へ残った。|（未提案・レビュー待ち）|inventory_only|
|30|story_system|`story.js:339`|PROLOGUE3|アルスが知っているのは、故郷が裂け、深淵のような闇に呑まれた事実だけだ。王都で何が行われていたかは知らない。|（未提案・レビュー待ち）|inventory_only|
|31|story_system|`story.js:344`|PROLOGUE3|アルスは焼け焦げたペンダントへ触れ、東へ向かうことを決めた。|（未提案・レビュー待ち）|inventory_only|
|32|story_system|`story.js:2178`|UNDERSEA_VOLCANO_RESEARCH_ENTRY|自然洞の先に、人の手で造られた研究区画が現れた。火の力を長期間肉体へ馴染ませるための記録が並んでいる。|（未提案・レビュー待ち）|inventory_only|
|33|story_system|`story.js:2182`|UNDERSEA_VOLCANO_BATTLE_AREA_ENTRY|研究区画の最奥。熱量が跳ね上がり、広い戦闘区画の中央から炎が脈打っている。|（未提案・レビュー待ち）|inventory_only|
|34|story_system|`story.js:2185`|UNDERSEA_GRAD_ENCOUNTER|先行したバロン、マリー、フリーダが壁際まで押し戻されている。その正面で、グラドの炎だけが乱れず燃えていた。|（未提案・レビュー待ち）|inventory_only|
|35|story_system|`story.js:2191`|UNDERSEA_GRAD_CLEAR|炎楔が砕け、研究炉を満たしていた火の流れが急速に弱まっていく。|（未提案・レビュー待ち）|inventory_only|
|36|story_system|`story.js:2193`|UNDERSEA_GRAD_CLEAR|グラドは崩れた研究炉の奥へ退いた。光の宮殿を支えていた第二結界源は沈黙した。|（未提案・レビュー待ち）|inventory_only|
|37|story_system|`story.js:2197`|THUNDER_FORT_CLAUDE_LUNA_ARRIVAL|雷の要塞へ戻ると、救護所の前が騒然としていた。クロードが、意識を失った一人の少女を抱えて駆け込んでくる。|（未提案・レビュー待ち）|inventory_only|
|38|story_system|`story.js:2199`|THUNDER_FORT_CLAUDE_LUNA_ARRIVAL|五年前に失ったはずの面影が、そこにあった。生きている。だが、目を覚まさない。|（未提案・レビュー待ち）|inventory_only|
|39|story_system|`story.js:2204`|LIGHT_PALACE_FLASHBACK_BRIEFING|クロードの記憶は、光の宮殿でレイラが動き始めた場面へ遡る。|（未提案・レビュー待ち）|inventory_only|
|40|story_system|`story.js:2211`|LIGHT_PALACE_FLASHBACK_HEXAGRAM_TRAP|六芒星の間へ踏み込んだ瞬間、床の光条が閉じ、ルーナの足元へ六つの楔が走った。|（未提案・レビュー待ち）|inventory_only|
|41|story_system|`story.js:2214`|LIGHT_PALACE_FLASHBACK_HEXAGRAM_TRAP|聖女の力が奪われ、さらに呪縛が重なる。ルーナはその場で意識を失った。|（未提案・レビュー待ち）|inventory_only|
|42|story_system|`story.js:2219`|LIGHT_PALACE_FLASHBACK_VELD1_AFTER|レイラは正面から斬り結ぶが、騎士団長ヴェルドの剣はあまりにも重い。膝をついたその時、二つの足音が六芒星の間へ飛び込んだ。|（未提案・レビュー待ち）|inventory_only|
|43|story_system|`story.js:2222`|LIGHT_PALACE_FLASHBACK_VELD1_AFTER|白。黒。白。黒。焼きつくような明滅に、ヴェルドの足が一瞬止まった。|（未提案・レビュー待ち）|inventory_only|
|44|story_system|`story.js:2226`|LIGHT_PALACE_FLASHBACK_EXIT_VELD|一階正面入口。扉の外は見えている。だが透明な結界が出口を塞いでいた。|（未提案・レビュー待ち）|inventory_only|
|45|story_system|`story.js:2232`|LIGHT_PALACE_FLASHBACK_ESCAPE_END|三人が再び地へ伏す。ヴェルドは説得を諦め、剣を下げたまま一歩ずつ距離を詰める。|（未提案・レビュー待ち）|inventory_only|
|46|story_system|`story.js:2233`|LIGHT_PALACE_FLASHBACK_ESCAPE_END|その瞬間、大地が大きく揺れた。宮殿を覆っていた結界が、一瞬だけ消える。|（未提案・レビュー待ち）|inventory_only|
|47|story_system|`story.js:2235`|LIGHT_PALACE_FLASHBACK_ESCAPE_END|レオンは、ルーナを抱えたクロードごと結界の外へ投げ飛ばした。|（未提案・レビュー待ち）|inventory_only|
|48|story_system|`story.js:2237`|LIGHT_PALACE_FLASHBACK_ESCAPE_END|クロードの記憶はそこで途切れる。彼が確かに覚えているのは、ルーナを抱えたまま宮殿の外へ転がり出たことだけだった。|（未提案・レビュー待ち）|inventory_only|
|49|story_system|`story.js:2240`|LOCKED_LIGHT_PALACE_RECALL|宮殿へ向けた足が止まる。クロードは、まだ話していないことがあると言っていた。|（未提案・レビュー待ち）|inventory_only|
|50|story_system|`story.js:2647`|LIGHT_PALACE_PRISON_GUARD_CLEAR|看守が握っていた封印具が砕け、牢の扉が一斉に開いた。|（未提案・レビュー待ち）|inventory_only|
|51|story_system|`story.js:2650`|LIGHT_PALACE_LEILA_CURSED|ベッドに横たわる聖騎士は、汚染された光の呪いに蝕まれている。呼吸は浅く、目を開けることさえできない。|（未提案・レビュー待ち）|inventory_only|
|52|story_system|`story.js:2655`|LIGHT_PALACE_LEILA_STABILIZED|宮殿を覆っていた呪いは弱まった。しかし、レイラの生命力はひどく衰えたままだ。|（未提案・レビュー待ち）|inventory_only|
|53|story_system|`story.js:2660`|LIGHT_PALACE_LEILA_NEEDS_LEAF|レイラを完全に回復させるには「世界樹の葉」が必要だ。|（未提案・レビュー待ち）|inventory_only|
|54|story_system|`story.js:2663`|LIGHT_PALACE_LEILA_RECOVERY_JOIN|世界樹の葉からあふれた生命の光が、レイラを蝕む濁りを押し流していく。|（未提案・レビュー待ち）|inventory_only|
|55|story_system|`story.js:2669`|LIGHT_PALACE_LEILA_RECOVERY_JOIN|レイラの同行を受け入れた。|（未提案・レビュー待ち）|inventory_only|
|56|story_system|`story.js:2670`|LIGHT_PALACE_LEILA_RECOVERY_JOIN|[N:204]が仲間に加わった！|（未提案・レビュー待ち）|inventory_only|
|57|story_system|`story.js:2673`|LIGHT_PALACE_PRESENT_ASSAULT_ENTRY|クロードの回想を聞き終えた後。ルーナは雷の要塞の救護所に残し、アルスたちは改めて光の宮殿へ踏み込んだ。|（未提案・レビュー待ち）|inventory_only|
|58|story_system|`story.js:2724`|THUNDER_FORT_DEMON_ASSAULT_ARRIVAL|雷の要塞へ戻る。砕かれているのは救護区画へ続く扉ばかりで、商店の窓には手をつけた跡すらない。|（未提案・レビュー待ち）|inventory_only|
|59|story_system|`story.js:2729`|THUNDER_FORT_DEMON_ASSAULT_WAVE1|脇を逃げる市民には目もくれず、魔族たちは救護所へ続く通路へ殺到する。|（未提案・レビュー待ち）|inventory_only|
|60|story_system|`story.js:2739`|THUNDER_FORT_LUNA_AWAKENING_SKELETON|魔王軍が退いた後。救護所の静けさの中で、ルーナがゆっくりと目を開いた。|（未提案・レビュー待ち）|inventory_only|
|61|story_system|`story.js:2740`|THUNDER_FORT_LUNA_AWAKENING_SKELETON|救護班に支えられたレイラは涙をこぼしながら謝り、ルーナを抱きしめた。|（未提案・レビュー待ち）|inventory_only|
|62|story_system|`story.js:2741`|THUNDER_FORT_LUNA_AWAKENING_SKELETON|アルスは五年間探し続けた幼馴染へ、震える声で呼びかける。だがルーナの瞳に、幼馴染を見る色はない。|（未提案・レビュー待ち）|inventory_only|
|63|story_system|`story.js:2746`|THUNDER_FORT_LUNA_POST_AWAKENING|ルーナは目を閉じたまま、浅い呼吸を繰り返している。|（未提案・レビュー待ち）|inventory_only|
|64|story_system|`story.js:2758`|CRYSTAL_TREE_ARRIVAL|水音が遠のき、代わりに低い脈動だけが足元から伝わってくる。|（未提案・レビュー待ち）|inventory_only|
|65|story_system|`story.js:2769`|CRYSTAL_TREE_ROOT_RITUAL|根の奥で、何かが軋む。少し遅れて、複数の足音が近づいてきた。|（未提案・レビュー待ち）|inventory_only|
|66|story_system|`story.js:2775`|CRYSTAL_TREE_DEFENSE_CLEAR|魔族たちは深追いせず、根の裂け目の向こうへ退いていった。|（未提案・レビュー待ち）|inventory_only|
|67|story_system|`story.js:2777`|CRYSTAL_TREE_DEFENSE_CLEAR|根から薄い光が二人へ流れる。レオンの浅かった呼吸が少しだけ深くなり、ルーナの冷えていた指先へわずかに温度が戻った。|（未提案・レビュー待ち）|inventory_only|
|68|story_system|`story.js:3840`|CRYSTAL_TREE_GALVANIA_RUMBLE|そのとき――遠く西の方角から、地面を震わせるような轟音が響いた。|（未提案・レビュー待ち）|inventory_only|
|69|story_system|`story.js:3846`|GALVANIA_GORGE_AFTER_CRYSTAL_TREE|渓谷を塞いでいたはずの巨大な城壁が崩れている。厚い門扉まで、原形が分からないほど打ち砕かれていた。|（未提案・レビュー待ち）|inventory_only|
|70|story_system|`story.js:3852`|GALVANIA_GORGE_FALLEN_DEMON_HATRED|魔族はアルスたちを睨んだまま、最後の息を吐いた。|（未提案・レビュー待ち）|inventory_only|
|71|story_system|`story.js:3857`|GALVANIA_GORGE_FALLEN_DEMON_WARNING|その言葉を最後に、魔族の呼吸が止まった。|（未提案・レビュー待ち）|inventory_only|
|72|story_system|`story.js:3874`|GALVANIA_CAVE_NORTH_BLOCKED|倒れた魔族兵の記録には「祭壇側の侵食が強い。低地へ誘われるな。急ぐなら高い岩をたどれ」と掠れた字で残されている。|（未提案・レビュー待ち）|inventory_only|
|73|story_system|`story.js:3875`|GALVANIA_CAVE_NORTH_BLOCKED|「・・・は輪を・・。火を・・・戻れ。高みの橋・・・次の闇へ・・」だけが読み取れた|（未提案・レビュー待ち）|inventory_only|
|74|story_system|`story.js:3876`|GALVANIA_CAVE_NORTH_BLOCKED|「柱を数えよ。三度目に迷い、四度目に上れ。端まで急ぐ者は輪の腹へ戻る」と読める。|（未提案・レビュー待ち）|inventory_only|
|75|story_system|`story.js:3877`|GALVANIA_CAVE_NORTH_BLOCKED|魔族兵の足跡は不自然に北へ迂回している。この区画だけ、侵食の強い地脈を避けて巡回していたようだ。|（未提案・レビュー待ち）|inventory_only|
|76|story_system|`story.js:3878`|GALVANIA_CAVE_NORTH_BLOCKED|「湖は赤く、道は細い。まっすぐな橋ほど熱に沈む。黒炎の島は宝を守るだけ」とある。|（未提案・レビュー待ち）|inventory_only|
|77|story_system|`story.js:3879`|GALVANIA_CAVE_NORTH_BLOCKED|橋脚には魔王軍の焼印と、何度も重ねた補修痕が残っている。深部の防衛線へ物資を運ぶため、長く維持されてきた補給路らしい。|（未提案・レビュー待ち）|inventory_only|
|78|story_system|`story.js:3880`|GALVANIA_CAVE_NORTH_BLOCKED|灰まみれの旅人は「火の島に欲を出すな。出口は北東の橋から南へ折れる」と残している。|（未提案・レビュー待ち）|inventory_only|
|79|story_system|`story.js:3881`|GALVANIA_CAVE_NORTH_BLOCKED|古い地図には、滑床を大きく迂回する赤い線が引かれている。|（未提案・レビュー待ち）|inventory_only|
|80|story_system|`story.js:3882`|GALVANIA_CAVE_NORTH_BLOCKED|箱には魔王城の紋章と「奈落防衛線」の印がある。兵糧、黒晶、予備の鎧が、いつでも補充できるよう整然と積まれている。|（未提案・レビュー待ち）|inventory_only|
|81|story_system|`story.js:3883`|GALVANIA_CAVE_NORTH_BLOCKED|折れた防壁杭の尖端は入口側ではなく、洞窟の奥へ向けて並べられている。<br>何度も打ち直した跡の上に、まだ乾ききっていない黒い血が残っている。|（未提案・レビュー待ち）|inventory_only|
|82|story_system|`story.js:3884`|GALVANIA_CAVE_NORTH_BLOCKED|壁へ短い刻み傷が一定間隔で続いている。<br>途中から同じ番号が何度も繰り返されている。道ではなく、空間そのものが戻っていたらしい。|（未提案・レビュー待ち）|inventory_only|
|83|story_system|`story.js:3885`|GALVANIA_CAVE_NORTH_BLOCKED|溶けた鎧と、獣とも人ともつかない黒い骨が橋の下で絡み合っている。<br>残った傷の向きは、どちらも祭壇側を向いている。|（未提案・レビュー待ち）|inventory_only|
|84|story_system|`story.js:3886`|GALVANIA_CAVE_NORTH_BLOCKED|氷の下に古い術式線が透けている。<br>割れては凍らせ、また割れては凍らせた跡が何層にも重なっている。|（未提案・レビュー待ち）|inventory_only|
|85|story_system|`story.js:3887`|GALVANIA_CAVE_NORTH_BLOCKED|箱の側面には日付ではなく、「第七码」「第八碼」と補充回数だけが刻まれている。<br>一度きりの遠征ではなく、何度もここへ物資が運ばれていたようだ。|（未提案・レビュー待ち）|inventory_only|
|86|story_system|`story.js:3888`|GALVANIA_CAVE_NORTH_BLOCKED|祭壇側へ向けて立てられていた最後の封鎖杭が、根元からこちら側へ倒れている。<br>向こうから押し破られた跡だ。|（未提案・レビュー待ち）|inventory_only|
|87|story_system|`story.js:3889`|GALVANIA_CAVE_NORTH_BLOCKED|古い血痕の上を、新しい足跡が横切っている。<br>数は一人ではない。立ち止まった形跡もなく、祭壇側へまっすぐ続いている。|（未提案・レビュー待ち）|inventory_only|
|88|story_system|`story.js:3890`|GALVANIA_CAVE_NORTH_BLOCKED|折れた固定杭は、祭壇の外周ではなく中央の亀裂へ向けて並べられている。<br>根元には、何度も交換した跡がある。|（未提案・レビュー待ち）|inventory_only|
|89|story_system|`story.js:3891`|GALVANIA_CAVE_NORTH_BLOCKED|乾いた泥の上を、数人分の新しい足跡が横切っている。<br>迷った形跡はなく、祭壇中央へ続いている。|（未提案・レビュー待ち）|inventory_only|
|90|story_system|`story.js:3892`|GALVANIA_CAVE_NORTH_BLOCKED|古い導線の上へ、色の違う新しい術式線が刻まれている。<br>下の線は亀裂を囲み、上の線は亀裂へ集まっている。|（未提案・レビュー待ち）|inventory_only|
|91|story_system|`story.js:3893`|GALVANIA_CAVE_NORTH_BLOCKED|黒い炎をまとった侵食獣が、赤い宝箱の島に居着いている。洞窟突破には関係なさそうだ。|（未提案・レビュー待ち）|inventory_only|
|92|story_system|`story.js:3894`|GALVANIA_CAVE_NORTH_BLOCKED|氷漬けの保管区画に異形が潜んでいる。倒せば金の鍵を回収できそうだ。|（未提案・レビュー待ち）|inventory_only|
|93|story_system|`story.js:3895`|GALVANIA_CAVE_NORTH_BLOCKED|白骨坑の横穴に異形がうずくまっている。洞窟突破には関係なさそうだ。|（未提案・レビュー待ち）|inventory_only|
|94|story_system|`story.js:3897`|GALVANIA_EMPIRE_ARRIVAL_PHASE8C|城下へ入る。武装した魔族兵の間を、担架が何度も行き交っている。<br>配給所では、小さな子どもが両手で椀を抱えていた。|（未提案・レビュー待ち）|inventory_only|
|95|story_system|`story.js:3899`|GALVANIA_EMPIRE_ARRIVAL_PHASE8C|包帯を巻いた兵が壁にもたれ、そのすぐ横を親子が避難区画へ急いでいく。<br>侵略のための軍都というより、長く何かに耐えてきた街に見えた。|包帯を巻いた兵が壁にもたれ、そのすぐ横を親子が避難区画へ急いでいく。|proposal_ready / user_decision_pending|
|96|story_system|`story.js:3914`|GALVANIA_EMPIRE_RATIONS_PHASE8C|配給係はアルスたちに気づき、手を止める。|（未提案・レビュー待ち）|inventory_only|
|97|story_system|`story.js:3921`|GALVANIA_EMPIRE_EVACUEES_PHASE8C|親子のそばには、いつでも持ち出せるよう小さな荷物がまとめられている。|（未提案・レビュー待ち）|inventory_only|
|98|story_system|`story.js:3930`|DARK_CASTLE_RIFT_EMPLACEMENT_PHASE8C|重い砲身は城外の平野ではなく、床下へ続く深い裂け目へ向けて固定されている。|（未提案・レビュー待ち）|inventory_only|
|99|story_system|`story.js:3933`|DARK_CASTLE_REPAIR_LAYERS_PHASE8C|新しい石材の下に古い補修跡が幾重にも重なっている。<br>同じ場所を、何年も塞ぎ直してきたようだ。|（未提案・レビュー待ち）|inventory_only|
|100|story_system|`story.js:3958`|DARK_CASTLE_ZELDRAS_ENCOUNTER|西館二階、結界の間。青い封印石の前で、大剣を背負った男が待ち受けている。|（未提案・レビュー待ち）|inventory_only|
|101|story_system|`story.js:3984`|DARK_CASTLE_ELMENAS_ENCOUNTER|東館二階、結界の間。気配のない室内で、低い男の声が背後から響く。|（未提案・レビュー待ち）|inventory_only|
|102|story_system|`story.js:4010`|DARK_CASTLE_BELET_ELM_ENCOUNTER|本館二階、夢幻回廊。歪む通路の中央で、一人の騎士が大剣を床へ突き立てている。|（未提案・レビュー待ち）|inventory_only|
|103|story_system|`story.js:4111`|DARK_CASTLE_CLEAR|ゼノンは武器を下ろし、玉座の後ろへ視線を向けた。<br>そこには闇のプリズムがある。濁りも傷もなく、静かに脈打っている。|（未提案・レビュー待ち）|inventory_only|
|104|story_system|`story.js:4117`|DARK_CASTLE_CLEAR|ルーナが闇のプリズムへ指先を触れた。<br>息が止まる。記憶の前と後が、境目を失って一度に流れ込む。|（未提案・レビュー待ち）|inventory_only|
|105|story_system|`story.js:4118`|DARK_CASTLE_CLEAR|夜の木々。湿った草の匂い。すぐそばの小さな寝息。<br>白い祈祷室。『闇は人を惑わす』と繰り返す声。討伐帰りの鎧。|（未提案・レビュー待ち）|inventory_only|
|106|story_system|`story.js:4120`|DARK_CASTLE_CLEAR|ルーナの膝から力が抜ける。アルスがすぐに肩を支えた。|（未提案・レビュー待ち）|inventory_only|
|107|story_system|`story.js:4126`|DARK_CASTLE_CLEAR|アルスの手が肩に残ったまま、ルーナはもう一度プリズムへ触れる。<br>今度は流れ込むものを拒まず、ひとつずつ受け止めた。|（未提案・レビュー待ち）|inventory_only|
|108|story_system|`story.js:4149`|DARK_CASTLE_CLEAR|その瞬間、城全体が低く唸った。<br>上からではない。はるか地下から、地面そのものを押し上げるような振動が続く。|（未提案・レビュー待ち）|inventory_only|
|109|story_system|`story.js:4161`|DARK_CASTLE_CLEAR|ルーナが前を向く。アルスはその横顔を見て、ほんの少しだけ口元を緩めた。<br>何かを言いかけてやめ、ただ隣に立つ。|（未提案・レビュー待ち）|inventory_only|
|110|story_system|`story.js:4163`|DARK_CASTLE_CLEAR|[N:306]が仲間に加わった！|（未提案・レビュー待ち）|inventory_only|
|111|story_system|`story.js:4328`|ABYSS_FLOOR_010_LEON_GUARDIAN|割れた軍旗が床に刺さっている。<br>布だけが、ありもしない風を受けて、まだ命令を待っていた。|（未提案・レビュー待ち）|inventory_only|
|112|story_system|`story.js:4337`|ABYSS_FLOOR_010_CLEAR|割れた軍旗が、音もなく灰になった。<br>号令だけで立っていた影は、もう誰も呼ばない。|（未提案・レビュー待ち）|inventory_only|
|113|story_system|`story.js:4341`|ABYSS_FLOOR_020_GLEN_GUARDIAN|爪痕だらけの盾が落ちている。<br>裏には、拙い字で子どもの名が彫られていた。|（未提案・レビュー待ち）|inventory_only|
|114|story_system|`story.js:4349`|ABYSS_FLOOR_020_CLEAR|盾の裏に刻まれた小さな名だけが残った。<br>誰かの巣を守った牙は、ようやく眠りについた。|（未提案・レビュー待ち）|inventory_only|
|115|story_system|`story.js:4353`|ABYSS_FLOOR_030_LEONARD|雷が鳴らない。黒い雲もない。<br>ただ、床に突き立つ剣だけが、歯を食いしばるように震えていた。|（未提案・レビュー待ち）|inventory_only|
|116|story_system|`story.js:4363`|ABYSS_FLOOR_030_CLEAR|剣の震えが止まった。<br>雷の残滓は、ジョセフの盾に触れて、小さな火花を一つだけ散らした。|（未提案・レビュー待ち）|inventory_only|
|117|story_system|`story.js:4368`|ABYSS_FLOOR_040_ELICIA|風が同じ向きに吹き続ける。<br>迷いも声も、不要な荷物のように押し流されていく。|（未提案・レビュー待ち）|inventory_only|
|118|story_system|`story.js:4376`|ABYSS_FLOOR_040_CLEAR|押し流すだけだった風がほどけ、誰かの窓辺を撫でるような弱い風になった。|（未提案・レビュー待ち）|inventory_only|
|119|story_system|`story.js:4380`|ABYSS_FLOOR_050_SYRIS|息が白く落ちる。床で凍ったその息は、<br>踏み出すたびに、薄い悲鳴のような音を立てた。|（未提案・レビュー待ち）|inventory_only|
|120|story_system|`story.js:4391`|ABYSS_FLOOR_050_CLEAR|凍った息が溶け、床に細い水筋を作った。<br>その水は、深淵の奥へは流れず、足元で静かに澄んだ。|（未提案・レビュー待ち）|inventory_only|
|121|story_system|`story.js:4395`|ABYSS_FLOOR_060_GRAD|床の亀裂から火が噴いた。<br>石畳が赤く溶け、逃げ道が一つずつ炎に塗り潰される。|（未提案・レビュー待ち）|inventory_only|
|122|story_system|`story.js:4405`|ABYSS_FLOOR_060_CLEAR|炎は消えなかった。<br>ただ、焼き尽くす赤から、手をかざせる橙へと色を戻した。|（未提案・レビュー待ち）|inventory_only|
|123|story_system|`story.js:4410`|ABYSS_FLOOR_070_VELD|白い鎧が黒く脈打っている。<br>混沌の騎士は、祈る者の列を見下ろすように剣を構えた。|（未提案・レビュー待ち）|inventory_only|
|124|story_system|`story.js:4416`|ABYSS_FLOOR_070_VELD|振り上げた剣の下で、首元のペンダントがかすかに揺れた。<br>黒い鎧の中で、その小さな光だけが消えていない。|（未提案・レビュー待ち）|inventory_only|
|125|story_system|`story.js:4423`|ABYSS_FLOOR_070_VELD_CLEAR|黒い脈動が鎧から抜け落ちた。<br>ヴェルドの剣が床を打ち、レイラは自分の剣を放り捨てて駆け寄った。|（未提案・レビュー待ち）|inventory_only|
|126|story_system|`story.js:4426`|ABYSS_FLOOR_070_VELD_CLEAR|ヴェルドは震える手を伸ばし、<br>子どもをあやすように、レイラの涙を親指でぬぐった。|（未提案・レビュー待ち）|inventory_only|
|127|story_system|`story.js:4431`|ABYSS_FLOOR_070_VELD_CLEAR|ヴェルドの瞳に、かすかな光が戻る。<br>彼はレイラの向こうに立つ者たちを、静かに見つめた。|（未提案・レビュー待ち）|inventory_only|
|128|story_system|`story.js:4434`|ABYSS_FLOOR_070_VELD_CLEAR|ヴェルドはレイラの膝の中で、静かに息を吐いた。<br>床には輝く剣が、レイラの腕には古いペンダントが残された。|（未提案・レビュー待ち）|inventory_only|
|129|story_system|`story.js:4449`|ABYSS_FLOOR_080_CLEAR|リリスの影が床へほどけた。<br>笑い声だけが残り、すぐに深淵の奥へ吸われて消えた。|（未提案・レビュー待ち）|inventory_only|
|130|story_system|`story.js:4454`|ABYSS_FLOOR_090_JASPER|白い祭壇が、黒い光を吐いている。<br>眩しいのに冷たい。祈りの場というより、裁きの台に近かった。|（未提案・レビュー待ち）|inventory_only|
|131|story_system|`story.js:4471`|ABYSS_FLOOR_090_JASPER_CLEAR|黒い腕が、ジャスパーの影を掴んだ。<br>影だけが先に怯え、体はそれに遅れて震え始めた。|（未提案・レビュー待ち）|inventory_only|
|132|story_system|`story.js:4473`|ABYSS_FLOOR_090_JASPER_CLEAR|最後の声は、祈りにも悲鳴にもならなかった。<br>研究成果も名も奪われ、選ばれたと信じた男だけが無残に消えた。|（未提案・レビュー待ち）|inventory_only|
|133|story_system|`story.js:4477`|ABYSS_FLOOR_100_PHASE1|六つの光が床に縫い付けられている。<br>雷、風、水、火、光、そして闇。世界の呼吸が、ここで止められていた。|（未提案・レビュー待ち）|inventory_only|
|134|story_system|`story.js:4487`|ABYSS_FLOOR_100_PHASE2|黒い雷、黒い風、黒い氷、黒い炎。<br>四つの影が同時に崩れ、縛られていた光の破片がほどけていく。|（未提案・レビュー待ち）|inventory_only|
|135|story_system|`story.js:4496`|ABYSS_FLOOR_100_CLEAR|六つの光が鎖を失った。<br>暴れていた残滓は静まり、闇の光が初めて他の属性と肩を並べた。|（未提案・レビュー待ち）|inventory_only|
|136|story_system|`story.js:4498`|ABYSS_FLOOR_100_CLEAR|地上へ漏れていた深淵化が、遠くで静かに鎮まっていく。<br>世界は一度、大きく息を吹き返した。|（未提案・レビュー待ち）|inventory_only|
|137|story_system|`story.js:4505`|ABYSS_FLOOR_100_EPILOGUE|世界の中心の亀裂の縁。<br>深淵の風は弱まり、遠くの草が、久しぶりに朝の匂いを運んでいた。|（未提案・レビュー待ち）|inventory_only|
|138|story_system|`story.js:4515`|ABYSS_FLOOR_100_EPILOGUE|深淵の奥に残る気配は消えていない。<br>一行は、終焉の祭壇へ至る道を探すことにした。|（未提案・レビュー待ち）|inventory_only|
|139|story_system|`story.js:4530`|AREL_WATER_ARCHIVE_PHASE8E|水上都市の旧行政記録。処分済みの束に、レクスノート侯爵家の研究申請控えが一枚だけ残っている。|（未提案・レビュー待ち）|inventory_only|
|140|story_system|`story.js:4538`|AREL_REXNOTE_RECORD_PHASE8E|古い机の隠し棚から、魔術式と生活の走り書きが混ざった紙束が出てきた。|（未提案・レビュー待ち）|inventory_only|
|141|story_system|`story.js:4539`|AREL_REXNOTE_RECORD_PHASE8E|『アラン、光弾三発。二発目で庭木を焦がす。本人は隠せたつもりらしい。』|（未提案・レビュー待ち）|inventory_only|
|142|story_system|`story.js:4540`|AREL_REXNOTE_RECORD_PHASE8E|『リュウ、また勝手に外へ出る。叱る前に帰ってこい。』|（未提案・レビュー待ち）|inventory_only|
|143|story_system|`story.js:4543`|AREL_REXNOTE_RECORD_PHASE8E|その下には、カゲトラ宛の短い覚え書きがある。『王へ出す上申は別便にする。統合試験が先に動くなら、子どもたちを近づけるな。』|（未提案・レビュー待ち）|inventory_only|
|144|story_system|`story.js:4550`|AREL_PALACE_OLD_ORDER_PHASE8E|同じ日付の命令書が二枚ある。王命控えは『証拠確保まで身柄を拘束』。暗部へ渡った写しには『反逆抵抗時、現場判断で処断を許可』。|（未提案・レビュー待ち）|inventory_only|
|145|story_system|`story.js:4580`|AREL_APPEAL_FOUND_PHASE8E|崩れた書架の背面から、小さな封印箱が見つかった。封蝋にはレクスノート家の印と、宛先『国王陛下』が残っている。|（未提案・レビュー待ち）|inventory_only|
|146|story_system|`story.js:4582`|AREL_APPEAL_FOUND_PHASE8E|本文には、プリズム統合の儀を即時停止すること、六属性を一つへ固定する人体・大規模実験を禁じること、ジャスパー主導の試験記録を王自身が再確認することが求められている。|（未提案・レビュー待ち）|inventory_only|
|147|story_system|`story.js:4589`|ALAN_ALTAR_OPENING_PHASE8E|祭壇中央。古い抑制術式の上に、新しい光の術式が重なっている。その前に、アランが一人で立っていた。|（未提案・レビュー待ち）|inventory_only|
|148|story_system|`story.js:4626`|ALAN_ALTAR_NO_APPEAL_WARNING_PHASE8E|ここで戦えば、もうアランを連れ戻す道は残らないかもしれない。|（未提案・レビュー待ち）|inventory_only|
|149|story_system|`story.js:4643`|ALAN_ALTAR_DEATH_PHASE8E|アランが膝をつく。剣を包んでいた光が、細い粒になって消えていく。|（未提案・レビュー待ち）|inventory_only|
|150|story_system|`story.js:4651`|ALAN_ALTAR_DEATH_PHASE8E|それきり、アランは動かなかった。|（未提案・レビュー待ち）|inventory_only|
|151|story_system|`story.js:4654`|ALAN_ALTAR_POST_BATTLE_APPEAL_PHASE8E|アランが膝をつく。戦いの最中に落ちた上申書が、光の消えた床に残っている。|（未提案・レビュー待ち）|inventory_only|
|152|story_system|`story.js:4657`|ALAN_ALTAR_POST_BATTLE_APPEAL_PHASE8E|アルスは、倒れたアランへ手を伸ばした。|（未提案・レビュー待ち）|inventory_only|
|153|story_system|`story.js:4663`|ALAN_ALTAR_SAVED_PHASE8E|長い沈黙のあと、アランは手を取らなかった。けれど、もう振り払おうともしなかった。|（未提案・レビュー待ち）|inventory_only|
|154|story_system|`story.js:4667`|ALAN_ALTAR_SAVED_PHASE8E|アランは戦線を離れた。今はまだ、仲間として戻る時ではない。|（未提案・レビュー待ち）|inventory_only|
|155|story_system|`story.js:4671`|ALAN_ALTAR_DEATH_WITH_APPEAL_PHASE8E|アランは床の上申書を一度だけ見た。やがて、光は完全に消えた。|（未提案・レビュー待ち）|inventory_only|
|156|story_objective|`story.js:6`|0-0|山を下り、見えてきた村へ向かおう|（未提案・レビュー待ち）|inventory_only|
|157|story_objective|`story.js:7`|0-1|リュミナ村の長老に話を聞こう|（未提案・レビュー待ち）|inventory_only|
|158|story_objective|`story.js:8`|0-2|リュミナ村で次の手がかりを探そう|（未提案・レビュー待ち）|inventory_only|
|159|story_objective|`story.js:9`|1-0|始まりの村の奥で話を聞こう|（未提案・レビュー待ち）|inventory_only|
|160|story_objective|`story.js:10`|1-1|洞窟の奥で魔物の気配を追おう|（未提案・レビュー待ち）|inventory_only|
|161|story_objective|`story.js:11`|1-2|洞窟のボスを倒そう|（未提案・レビュー待ち）|inventory_only|
|162|story_objective|`story.js:12`|2-0|始まりの村の長老へ討伐を報告しよう|（未提案・レビュー待ち）|inventory_only|
|163|story_objective|`story.js:13`|2-1|炎の里の長に相談を聞こう|（未提案・レビュー待ち）|inventory_only|
|164|story_objective|`story.js:14`|2-2|火山の入口へ向かおう|（未提案・レビュー待ち）|inventory_only|
|165|story_objective|`story.js:15`|2-3|炎の里の長に異常な炎を報告しよう|（未提案・レビュー待ち）|inventory_only|
|166|story_objective|`story.js:16`|2-4|森の風穴で妖精の泉を探そう|（未提案・レビュー待ち）|inventory_only|
|167|story_objective|`story.js:17`|2-5|妖精の聖水を火山入口で使おう|（未提案・レビュー待ち）|inventory_only|
|168|story_objective|`story.js:18`|2-6|イグナ火山の奥へ向かおう|（未提案・レビュー待ち）|inventory_only|
|169|story_objective|`story.js:19`|2-7|炎の里の長へ火山の異変を報告しよう|（未提案・レビュー待ち）|inventory_only|
|170|story_objective|`story.js:20`|3-0|風の集落の様子を調べよう|（未提案・レビュー待ち）|inventory_only|
|171|story_objective|`story.js:21`|3-1|集落の西から禁忌の森へ向かおう|（未提案・レビュー待ち）|inventory_only|
|172|story_objective|`story.js:22`|3-2|風の神殿へ向かおう|（未提案・レビュー待ち）|inventory_only|
|173|story_objective|`story.js:23`|4-0|北西の水上都市で船の手がかりを探そう|（未提案・レビュー待ち）|inventory_only|
|174|story_objective|`story.js:24`|4-1|クレナ鍾乳洞で青の結晶を探そう|（未提案・レビュー待ち）|inventory_only|
|175|story_objective|`story.js:25`|4-2|水上都市のソフィアへ青の結晶を届けよう|（未提案・レビュー待ち）|inventory_only|
|176|story_objective|`story.js:26`|4-3|海底神殿へ向かい、水のプリズムを守ろう|（未提案・レビュー待ち）|inventory_only|
|177|story_objective|`story.js:27`|4-4|解放された水上都市へ戻り、ソフィアと今後を相談しよう|（未提案・レビュー待ち）|inventory_only|
|178|story_objective|`story.js:28`|4-5|水上都市で一息つき、街に残る手掛かりを探そう|（未提案・レビュー待ち）|inventory_only|
|179|story_objective|`story.js:29`|4-6|風の集落へ戻り、アリサとハイネの消息を確かめよう|（未提案・レビュー待ち）|inventory_only|
|180|story_objective|`story.js:30`|4-7|禁忌の森深部へ向かい、アリサとハイネを救出しよう|（未提案・レビュー待ち）|inventory_only|
|181|story_objective|`story.js:31`|4-8|アリサとハイネを迎え、水上都市へ戻ろう|（未提案・レビュー待ち）|inventory_only|
|182|story_objective|`story.js:32`|4-9|レクスノート邸を訪ね、アランに会おう|（未提案・レビュー待ち）|inventory_only|
|183|story_objective|`story.js:33`|5-0|船で川を進み、雷の要塞へ向かおう|（未提案・レビュー待ち）|inventory_only|
|184|story_objective|`story.js:34`|5-1|機械暴走の中、要塞内部へ進む道を確保しよう|（未提案・レビュー待ち）|inventory_only|
|185|story_objective|`story.js:35`|5-2|雷の制御炉へ向かい、レナードを止めよう|（未提案・レビュー待ち）|inventory_only|
|186|story_objective|`story.js:36`|6-0|大灯台へ向かい、光の神殿の第一結界源を壊そう|（未提案・レビュー待ち）|inventory_only|
|187|story_objective|`story.js:37`|6-1|雷の要塞へ戻り、もう一つの結界源について相談しよう|（未提案・レビュー待ち）|inventory_only|
|188|story_objective|`story.js:38`|6-2|バロンたちを追い、海底火山へ向かおう|（未提案・レビュー待ち）|inventory_only|
|189|story_objective|`story.js:39`|6-3|海底火山の三層を進み、最深部の研究区画を探ろう|（未提案・レビュー待ち）|inventory_only|
|190|story_objective|`story.js:40`|6-4|研究区画を抜け、最奥で炎楔のグラドを止めよう|（未提案・レビュー待ち）|inventory_only|
|191|story_objective|`story.js:41`|6-5|第二結界源を破壊した。雷の要塞へ戻ろう|（未提案・レビュー待ち）|inventory_only|
|192|story_objective|`story.js:42`|6-6|救護所のルーナを確認し、ギルド区画でクロードの話を聞こう|（未提案・レビュー待ち）|inventory_only|
|193|story_objective|`story.js:43`|6-7|クロードの回想から、光の宮殿で起きたことを追体験しよう|（未提案・レビュー待ち）|inventory_only|
|194|story_objective|`story.js:44`|7-0|光の宮殿地下牢で、国王・レイラ・レオンの所在を確認しよう|（未提案・レビュー待ち）|inventory_only|
|195|story_objective|`story.js:45`|7-1|地下牢の主要な生存者を確認した。光の祭壇へ進もう|（未提案・レビュー待ち）|inventory_only|
|196|story_objective|`story.js:46`|7-2|アランが離脱した。地下牢へ戻り、捕らわれていた人々を保護しよう|（未提案・レビュー待ち）|inventory_only|
|197|story_objective|`story.js:47`|7-3|雷の要塞へ急行し、救護区画のルーナを守ろう|（未提案・レビュー待ち）|inventory_only|
|198|story_objective|`story.js:48`|7-4|バロンたちと合流し、救護区画へ進む魔王軍を退けよう|（未提案・レビュー待ち）|inventory_only|
|199|story_objective|`story.js:49`|7-5|ルーナとレオンを救う手掛かりを求め、水上都市のソフィアを訪ねよう|（未提案・レビュー待ち）|inventory_only|
|200|story_objective|`story.js:50`|7-6|ソフィアから聞いたミネルバと、結晶樹の秘跡への道を探ろう|（未提案・レビュー待ち）|inventory_only|
|201|story_objective|`story.js:51`|7-7|水上都市の北側にある古い水門を調べよう|（未提案・レビュー待ち）|inventory_only|
|202|story_objective|`story.js:52`|7-8|結晶樹の奥へ進み、ミネルバを探そう|（未提案・レビュー待ち）|inventory_only|
|203|story_objective|`story.js:53`|7-9|結晶樹の根元へ向かおう|（未提案・レビュー待ち）|inventory_only|
|204|story_objective|`story.js:54`|7-10|結晶樹を守り、ルーナとレオンの治療を続けよう|（未提案・レビュー待ち）|inventory_only|
|205|story_objective|`story.js:55`|7-11|根元に残ったミネルバと話そう|（未提案・レビュー待ち）|inventory_only|
|206|story_objective|`story.js:56`|8-0|ガルヴァニア渓谷を越え、魔王城で闇のプリズムの真実を確かめよう|（未提案・レビュー待ち）|inventory_only|
|207|story_objective|`story.js:57`|9-0|奈落への洞窟を越え、統合の祭壇へ向かおう|（未提案・レビュー待ち）|inventory_only|
|208|story_objective|`story.js:58`|10-0|深淵の魔窟の先に広がる異界を探索しよう|（未提案・レビュー待ち）|inventory_only|
|209|story_objective|`story.js:59`|10-1|深淵を覆う結界を解こう|（未提案・レビュー待ち）|inventory_only|
|210|story_objective|`story.js:60`|10-2|終焉の祭壇で混沌の根源を断とう|（未提案・レビュー待ち）|inventory_only|
|211|ui_label|`abyss_content.js:126`|label|初級|（未提案・レビュー待ち）|inventory_only|
|212|ui_label|`abyss_content.js:127`|label|中級|（未提案・レビュー待ち）|inventory_only|
|213|ui_label|`abyss_content.js:128`|label|上級|（未提案・レビュー待ち）|inventory_only|
|214|ui_label|`abyss_content.js:129`|label|極限|（未提案・レビュー待ち）|inventory_only|
|215|ui_message|`abyss_content.js:199`|message|強大な気配と、宝の輝きが入り混じっている……|（未提案・レビュー待ち）|inventory_only|
|216|ui_title|`abyss_content.js:199`|title|強敵の財宝階|（未提案・レビュー待ち）|inventory_only|
|217|ui_message|`abyss_content.js:201`|message|希少な魔物の気配が濃い……|（未提案・レビュー待ち）|inventory_only|
|218|ui_title|`abyss_content.js:201`|title|希少種の気配|（未提案・レビュー待ち）|inventory_only|
|219|ui_message|`abyss_content.js:203`|message|過去の戦いの残響が、この階層を満たしている……|（未提案・レビュー待ち）|inventory_only|
|220|ui_title|`abyss_content.js:203`|title|物語の残響|（未提案・レビュー待ち）|inventory_only|
|221|ui_title|`achievements.js:20`|title|駆け出し冒険者|（未提案・レビュー待ち）|inventory_only|
|222|ui_title|`achievements.js:30`|title|熟練の剣筋|（未提案・レビュー待ち）|inventory_only|
|223|ui_title|`achievements.js:34`|title|伝説の胎動|（未提案・レビュー待ち）|inventory_only|
|224|ui_title|`achievements.js:38`|title|深淵の到達者|（未提案・レビュー待ち）|inventory_only|
|225|ui_title|`achievements.js:47`|title|重い一撃|（未提案・レビュー待ち）|inventory_only|
|226|ui_title|`achievements.js:48`|title|必殺の手応え|（未提案・レビュー待ち）|inventory_only|
|227|ui_title|`achievements.js:49`|title|必殺の極意|（未提案・レビュー待ち）|inventory_only|
|228|ui_title|`achievements.js:50`|title|魔神の一撃|（未提案・レビュー待ち）|inventory_only|
|229|ui_title|`achievements.js:51`|title|天を砕く一撃|（未提案・レビュー待ち）|inventory_only|
|230|ui_title|`achievements.js:56`|title|最果ての門|（未提案・レビュー待ち）|inventory_only|
|231|ui_title|`achievements.js:57`|title|第一層の解放者|（未提案・レビュー待ち）|inventory_only|
|232|ui_title|`achievements.js:58`|title|第二層の解放者|（未提案・レビュー待ち）|inventory_only|
|233|ui_title|`achievements.js:59`|title|深淵を越えし者|（未提案・レビュー待ち）|inventory_only|
|234|ui_title|`achievements.js:63`|title|真装備の探索者|（未提案・レビュー待ち）|inventory_only|
|235|ui_title|`achievements.js:69`|title|プリズムの守護者|（未提案・レビュー待ち）|inventory_only|
|236|ui_title|`achievements.js:73`|title|世界の真実|（未提案・レビュー待ち）|inventory_only|
|237|ui_title|`achievements.js:79`|title|見習い職人|（未提案・レビュー待ち）|inventory_only|
|238|ui_title|`achievements.js:80`|title|名匠の称号|（未提案・レビュー待ち）|inventory_only|
|239|ui_title|`achievements.js:81`|title|神工の槌音|（未提案・レビュー待ち）|inventory_only|
|240|ui_title|`achievements.js:86`|title|魔物学者|（未提案・レビュー待ち）|inventory_only|
|241|ui_title|`achievements.js:87`|title|モンスターハンター|（未提案・レビュー待ち）|inventory_only|
|242|ui_title|`achievements.js:88`|title|深淵生態系の記録者|（未提案・レビュー待ち）|inventory_only|
|243|ui_title|`achievements.js:91`|title|貯金家|（未提案・レビュー待ち）|inventory_only|
|244|ui_title|`achievements.js:92`|title|大富豪|（未提案・レビュー待ち）|inventory_only|
|245|ui_title|`achievements.js:93`|title|輝石を集めし者|（未提案・レビュー待ち）|inventory_only|
|246|ui_title|`achievements.js:96`|title|災厄への挑戦|（未提案・レビュー待ち）|inventory_only|
|247|ui_title|`achievements.js:97`|title|災厄を撃ち払う者|（未提案・レビュー待ち）|inventory_only|
|248|ui_title|`achievements.js:98`|title|災厄の征服者|（未提案・レビュー待ち）|inventory_only|
|249|ui_title|`achievements.js:101`|title|小さな仲間たち|（未提案・レビュー待ち）|inventory_only|
|250|ui_title|`achievements.js:102`|title|冒険者ギルド|（未提案・レビュー待ち）|inventory_only|
|251|ui_title|`achievements.js:103`|title|英雄団|（未提案・レビュー待ち）|inventory_only|
|252|ui_title|`achievements.js:107`|title|四人の誓い|（未提案・レビュー待ち）|inventory_only|
|253|ui_title|`achievements.js:108`|title|神話との邂逅|（未提案・レビュー待ち）|inventory_only|
|254|ui_title|`achievements.js:111`|title|探索者|（未提案・レビュー待ち）|inventory_only|
|255|ui_title|`achievements.js:112`|title|深層常連|（未提案・レビュー待ち）|inventory_only|
|256|ui_title|`achievements.js:113`|title|宝箱ハンター|（未提案・レビュー待ち）|inventory_only|
|257|ui_title|`achievements.js:114`|title|開封の達人|（未提案・レビュー待ち）|inventory_only|
|258|ui_title|`achievements.js:116`|title|収集癖|（未提案・レビュー待ち）|inventory_only|
|259|ui_title|`achievements.js:120`|title|蒐集家|（未提案・レビュー待ち）|inventory_only|
|260|ui_title|`achievements.js:124`|title|伝説の蒐集家|（未提案・レビュー待ち）|inventory_only|
|261|ui_title|`achievements.js:130`|title|極意の発現|（未提案・レビュー待ち）|inventory_only|
|262|ui_title|`achievements.js:131`|title|共鳴|（未提案・レビュー待ち）|inventory_only|
|263|ui_title|`achievements.js:132`|title|鍛え抜かれた逸品|（未提案・レビュー待ち）|inventory_only|
|264|ui_title|`achievements.js:133`|title|真なる武具|（未提案・レビュー待ち）|inventory_only|
|265|ui_title|`achievements.js:136`|title|新たなる始まり|（未提案・レビュー待ち）|inventory_only|
|266|ui_title|`achievements.js:137`|title|輪廻の探究者|（未提案・レビュー待ち）|inventory_only|
|267|ui_title|`achievements.js:138`|title|永劫回帰|（未提案・レビュー待ち）|inventory_only|
|268|ui_title|`achievements.js:142`|title|限界を越える者|（未提案・レビュー待ち）|inventory_only|
|269|ui_title|`achievements.js:143`|title|極限覚醒|（未提案・レビュー待ち）|inventory_only|
|270|ui_title|`achievements.js:144`|title|熟達の証|（未提案・レビュー待ち）|inventory_only|
|271|ui_title|`achievements.js:147`|title|百戦錬磨|（未提案・レビュー待ち）|inventory_only|
|272|ui_title|`achievements.js:148`|title|千の屍を越えて|（未提案・レビュー待ち）|inventory_only|
|273|ui_title|`achievements.js:149`|title|敗北からの再起|（未提案・レビュー待ち）|inventory_only|
|274|ui_title|`achievements.js:150`|title|不屈の冒険者|（未提案・レビュー待ち）|inventory_only|
|275|ui_title|`achievements.js:153`|title|旅の道標|（未提案・レビュー待ち）|inventory_only|
|276|ui_title|`achievements.js:154`|title|空路の開拓者|（未提案・レビュー待ち）|inventory_only|
|277|ui_title|`achievements.js:155`|title|世界を巡る者|（未提案・レビュー待ち）|inventory_only|
|278|ui_title|`achievements.js:156`|title|地平の記録者|（未提案・レビュー待ち）|inventory_only|
|279|ui_title|`achievements.js:159`|title|最初の依頼|（未提案・レビュー待ち）|inventory_only|
|280|ui_title|`achievements.js:160`|title|頼れる冒険者|（未提案・レビュー待ち）|inventory_only|
|281|ui_title|`achievements.js:161`|title|各地の問題解決者|（未提案・レビュー待ち）|inventory_only|
|282|ui_title|`achievements.js:162`|title|万事解決|（未提案・レビュー待ち）|inventory_only|
|283|ui_title|`achievements.js:163`|title|ギルドの初仕事|（未提案・レビュー待ち）|inventory_only|
|284|ui_title|`achievements.js:164`|title|依頼の常連|（未提案・レビュー待ち）|inventory_only|
|285|ui_title|`achievements.js:165`|title|ギルドの主力|（未提案・レビュー待ち）|inventory_only|
|286|ui_title|`achievements.js:166`|title|百の依頼を成す者|（未提案・レビュー待ち）|inventory_only|
|287|ui_title|`achievements.js:167`|title|Fランク冒険者|（未提案・レビュー待ち）|inventory_only|
|288|ui_title|`achievements.js:168`|title|Dランク冒険者|（未提案・レビュー待ち）|inventory_only|
|289|ui_title|`achievements.js:169`|title|Bランク冒険者|（未提案・レビュー待ち）|inventory_only|
|290|ui_title|`achievements.js:170`|title|Aランク冒険者|（未提案・レビュー待ち）|inventory_only|
|291|ui_title|`achievements.js:171`|title|最高位冒険者|（未提案・レビュー待ち）|inventory_only|
|292|ui_title|`achievements.js:174`|title|初めての錬成|（未提案・レビュー待ち）|inventory_only|
|293|ui_title|`achievements.js:175`|title|錬金術の習熟|（未提案・レビュー待ち）|inventory_only|
|294|ui_title|`achievements.js:176`|title|百錬成|（未提案・レビュー待ち）|inventory_only|
|295|ui_title|`achievements.js:177`|title|万物の調合者|（未提案・レビュー待ち）|inventory_only|
|296|ui_title|`achievements.js:178`|title|最初の槌音|（未提案・レビュー待ち）|inventory_only|
|297|ui_title|`achievements.js:179`|title|工房の常連|（未提案・レビュー待ち）|inventory_only|
|298|ui_title|`achievements.js:180`|title|百打の職人|（未提案・レビュー待ち）|inventory_only|
|299|ui_title|`achievements.js:181`|title|神工への道|（未提案・レビュー待ち）|inventory_only|
|300|ui_title|`achievements.js:182`|title|百戦の経験|（未提案・レビュー待ち）|inventory_only|
|301|ui_title|`achievements.js:183`|title|千戦の覇者|（未提案・レビュー待ち）|inventory_only|
|302|ui_title|`achievements.js:184`|title|深淵王の終焉|（未提案・レビュー待ち）|inventory_only|
|303|ui_title|`achievements.js:185`|title|追憶を越えし者|（未提案・レビュー待ち）|inventory_only|
|304|ui_title|`achievements.js:188`|title|深層への歩み|（未提案・レビュー待ち）|inventory_only|
|305|ui_title|`achievements.js:189`|title|深層観測者|（未提案・レビュー待ち）|inventory_only|
|306|ui_title|`achievements.js:190`|title|百層の到達者|（未提案・レビュー待ち）|inventory_only|
|307|ui_title|`achievements.js:191`|title|無限深層の探索者|（未提案・レビュー待ち）|inventory_only|
|308|ui_message|`achievements.js:494`|message|実績データが見つかりません。|（未提案・レビュー待ち）|inventory_only|
|309|ui_message|`achievements.js:498`|message|まだ達成していません。|（未提案・レビュー待ち）|inventory_only|
|310|ui_message|`achievements.js:499`|message|すでに受け取り済みです。|（未提案・レビュー待ち）|inventory_only|
|311|ui_message|`achievements.js:510`|message|報酬を保存できなかったため、受取を取り消しました。|（未提案・レビュー待ち）|inventory_only|
|312|ui_message|`achievements.js:513`|message|報酬を保存できませんでした。|（未提案・レビュー待ち）|inventory_only|
|313|ui_message|`alchemy.js:240`|message|素材は2～5種類選んでください。|（未提案・レビュー待ち）|inventory_only|
|314|ui_message|`alchemy.js:242`|message|各素材は1～10個で指定してください。|（未提案・レビュー待ち）|inventory_only|
|315|ui_message|`alchemy.js:247`|message|この組み合わせから生成できる品がありません。|（未提案・レビュー待ち）|inventory_only|
|316|ui_html_text|`alchemy.js:293`|html/template text|錬成品を選ぶ|（未提案・レビュー待ち）|inventory_only|
|317|ui_html_text|`alchemy.js:294`|html/template text|作成可能一覧|（未提案・レビュー待ち）|inventory_only|
|318|ui_html_text|`alchemy.js:295`|html/template text|ランダム錬成|（未提案・レビュー待ち）|inventory_only|
|319|ui_html_text|`alchemy.js:306`|html/template text|「素材の組み合わせが違えば、同じ品にも別の道がある」|（未提案・レビュー待ち）|inventory_only|
|320|ui_html_text|`alchemy.js:314`|html/template text|素材は生成直前に再確認されます。|（未提案・レビュー待ち）|inventory_only|
|321|ui_dom_textContent|`alchemy.js:333`|textContent|手持ち素材で作成可能|（未提案・レビュー待ち）|inventory_only|
|322|ui_html_text|`alchemy.js:337`|html/template text|現在の手持ち素材で作成できる品はありません。|（未提案・レビュー待ち）|inventory_only|
|323|ui_html_text|`alchemy.js:340`|html/template text|作成可能な素材構成を1つずつ表示しています。|（未提案・レビュー待ち）|inventory_only|
|324|ui_dom_textContent|`alchemy.js:388`|textContent|ランダム錬成|（未提案・レビュー待ち）|inventory_only|
|325|ui_html_text|`alchemy.js:402`|html/template text|異なる素材を2～5種類、各1～10個選択。素材ランク・総数・種類数で完成品の品質が変わります。|（未提案・レビュー待ち）|inventory_only|
|326|ui_html_text|`alchemy.js:403`|html/template text|所持素材がありません。|（未提案・レビュー待ち）|inventory_only|
|327|ui_html_text|`alchemy.js:405`|html/template text|選択|（未提案・レビュー待ち）|inventory_only|
|328|ui_html_text|`alchemy.js:406`|html/template text|予測品質|（未提案・レビュー待ち）|inventory_only|
|329|ui_html_text|`alchemy.js:407`|html/template text|生成候補の上限 Rank ${quality.maxRank}|（未提案・レビュー待ち）|inventory_only|
|330|ui_html_text|`alchemy.js:408`|html/template text|選択解除|（未提案・レビュー待ち）|inventory_only|
|331|ui_dom_textContent|`alchemy.js:485`|textContent|錬金レシピ|（未提案・レビュー待ち）|inventory_only|
|332|ui_html_text|`battle.js:1812`|html/template text|風の大精霊の支援！ 味方全体のHPが${total}回復した！|（未提案・レビュー待ち）|inventory_only|
|333|ui_html_text|`battle.js:1825`|html/template text|水の大精霊の支援！ 味方全体のMPが${total}回復した！|（未提案・レビュー待ち）|inventory_only|
|334|ui_html_text|`battle.js:1832`|html/template text|光の大精霊の支援！ このターン、味方全体の全属性耐性が${Number(support.value \|\| 50)}%上昇！|（未提案・レビュー待ち）|inventory_only|
|335|ui_html_text|`battle.js:1841`|html/template text|闇の大精霊の支援！ 深淵王の全能力が低下した！|（未提案・レビュー待ち）|inventory_only|
|336|ui_html_text|`battle.js:1859`|html/template text|雷の大精霊の支援！ 深淵王へ${total}ダメージを与え、守備力を低下させた！|（未提案・レビュー待ち）|inventory_only|
|337|ui_html_text|`battle.js:1861`|html/template text|炎の大精霊の支援！ 深淵王へ${total}ダメージ！|（未提案・レビュー待ち）|inventory_only|
|338|ui_html_text|`battle.js:2388`|html/template text|オクタプリズマが六精霊の道を開き、主人公の混沌属性耐性を90%まで高めた！|（未提案・レビュー待ち）|inventory_only|
|339|ui_html_text|`battle.js:2389`|html/template text|オクタプリズマが輝き、六精霊が戦いを見守っている。|（未提案・レビュー待ち）|inventory_only|
|340|ui_html_text|`battle.js:2398`|html/template text|まものの むれに ふいうちを うけた！|（未提案・レビュー待ち）|inventory_only|
|341|ui_html_text|`battle.js:2400`|html/template text|まものの むれを さきに みつけた！|（未提案・レビュー待ち）|inventory_only|
|342|ui_html_text|`battle.js:3198`|html/template text|天使の試練を担う強敵が現れた！|（未提案・レビュー待ち）|inventory_only|
|343|ui_html_text|`battle.js:3289`|html/template text|亀裂の根源から強敵が現れた！|（未提案・レビュー待ち）|inventory_only|
|344|ui_html_text|`battle.js:3334`|html/template text|追憶の最奥から、強大な記憶が具現化した！|（未提案・レビュー待ち）|inventory_only|
|345|ui_html_text|`battle.js:3344`|html/template text|深淵の守護者が現れた！|（未提案・レビュー待ち）|inventory_only|
|346|ui_html_text|`battle.js:3538`|html/template text|強化された魔物の記憶が現れた！|（未提案・レビュー待ち）|inventory_only|
|347|ui_dom_innerText|`battle.js:4865`|innerText|にげる|（未提案・レビュー待ち）|inventory_only|
|348|ui_dom_innerText|`battle.js:4871`|innerText|もどる|（未提案・レビュー待ち）|inventory_only|
|349|ui_dom_innerText|`battle.js:4894`|innerText|さくせん|（未提案・レビュー待ち）|inventory_only|
|350|ui_html_text|`battle.js:4939`|html/template text|現在: ${Battle.escapeHtml(currentLabel)}|（未提案・レビュー待ち）|inventory_only|
|351|ui_html_text|`battle.js:4945`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|352|ui_dom_innerText|`battle.js:5090`|innerText|特技・魔法|（未提案・レビュー待ち）|inventory_only|
|353|ui_html_text|`battle.js:5095`|html/template text|特技がありません|（未提案・レビュー待ち）|inventory_only|
|354|ui_dom_innerText|`battle.js:5199`|innerText|道具|（未提案・レビュー待ち）|inventory_only|
|355|ui_html_text|`battle.js:5220`|html/template text|使える道具がありません|（未提案・レビュー待ち）|inventory_only|
|356|ui_html_text|`battle.js:5647`|html/template text|まものたちは おどろき とまどっている！|（未提案・レビュー待ち）|inventory_only|
|357|ui_html_text|`battle.js:5735`|html/template text|(状況の変化により ${actor.name} は行動を変更)|（未提案・レビュー待ち）|inventory_only|
|358|ui_html_text|`battle.js:5745`|html/template text|(状況の変化により ${actor.name} は行動を変更)|（未提案・レビュー待ち）|inventory_only|
|359|ui_html_text|`battle.js:6780`|html/template text|防御を貫通！|（未提案・レビュー待ち）|inventory_only|
|360|ui_html_text|`battle.js:6836`|html/template text|かいしんの一撃！|（未提案・レビュー待ち）|inventory_only|
|361|ui_html_text|`battle.js:6838`|html/template text|魔力が暴走！|（未提案・レビュー待ち）|inventory_only|
|362|ui_html_text|`battle.js:6986`|html/template text|急所を貫いた！ ${targetToHit.name}は 息絶えた！|（未提案・レビュー待ち）|inventory_only|
|363|ui_html_text|`battle.js:7002`|html/template text|急所を貫いた！ ${targetToHit.name}は 息絶えた！|（未提案・レビュー待ち）|inventory_only|
|364|ui_html_text|`battle.js:7713`|html/template text|解放済|（未提案・レビュー待ち）|inventory_only|
|365|ui_html_text|`battle.js:7924`|html/template text|状態変化|（未提案・レビュー待ち）|inventory_only|
|366|ui_html_text|`battle.js:8002`|html/template text|なし|（未提案・レビュー待ち）|inventory_only|
|367|ui_html_text|`battle.js:8672`|html/template text|戦闘に勝利した！|（未提案・レビュー待ち）|inventory_only|
|368|ui_html_text|`battle.js:8680`|html/template text|訓練戦のため報酬・討伐記録は発生しない。HP・MPは開始前の状態へ戻った。|（未提案・レビュー待ち）|inventory_only|
|369|ui_html_text|`battle.js:8686`|html/template text|戦闘不能の仲間は経験値を50%取得した。|（未提案・レビュー待ち）|inventory_only|
|370|ui_html_text|`battle.js:8689`|html/template text|控えの仲間は経験値を25%取得した。|（未提案・レビュー待ち）|inventory_only|
|371|ui_html_text|`battle.js:8755`|html/template text|特性：応急手当でパーティのHPが回復した！|（未提案・レビュー待ち）|inventory_only|
|372|ui_html_text|`battle.js:8758`|html/template text|特性：魔力充填でパーティのMPが回復した！|（未提案・レビュー待ち）|inventory_only|
|373|ui_html_text|`battle.js:8878`|html/template text|勝利演出の一部を省略しました。結果は保存済みです。|（未提案・レビュー待ち）|inventory_only|
|374|ui_html_text|`battle.js:9062`|html/template text|訓練開始前のHP・MPへ戻った。|（未提案・レビュー待ち）|inventory_only|
|375|ui_html_text|`blacksmith.js:135`|html/template text|素材鍛造 ＋1～＋3|（未提案・レビュー待ち）|inventory_only|
|376|ui_html_text|`blacksmith.js:136`|html/template text|装備合成 ＋3～＋4|（未提案・レビュー待ち）|inventory_only|
|377|ui_html_text|`blacksmith.js:137`|html/template text|オプション精錬|（未提案・レビュー待ち）|inventory_only|
|378|ui_html_text|`blacksmith.js:138`|html/template text|オプション強化|（未提案・レビュー待ち）|inventory_only|
|379|ui_html_text|`blacksmith.js:150`|html/template text|「聞こえるか。炉が、また飯を食い始めた。」|（未提案・レビュー待ち）|inventory_only|
|380|ui_html_text|`blacksmith.js:153`|html/template text|鍛冶レベル|（未提案・レビュー待ち）|inventory_only|
|381|ui_html_text|`blacksmith.js:154`|html/template text|上昇効果|（未提案・レビュー待ち）|inventory_only|
|382|ui_html_text|`blacksmith.js:156`|html/template text|熟練度|（未提案・レビュー待ち）|inventory_only|
|383|ui_html_text|`blacksmith.js:158`|html/template text|下のコマンドから鍛冶内容を選択してください。|（未提案・レビュー待ち）|inventory_only|
|384|ui_html_text|`blacksmith.js:224`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|385|ui_html_text|`blacksmith.js:235`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|386|ui_html_text|`blacksmith.js:318`|html/template text|上昇効果を確認|（未提案・レビュー待ち）|inventory_only|
|387|ui_html_text|`blacksmith.js:323`|html/template text|熟練度 (NEXT: ${nextExp})|（未提案・レビュー待ち）|inventory_only|
|388|ui_html_text|`blacksmith.js:337`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|389|ui_html_text|`blacksmith.js:361`|html/template text|鍛冶レベル特典|（未提案・レビュー待ち）|inventory_only|
|390|ui_html_text|`blacksmith.js:363`|html/template text|鍛冶ガイド|（未提案・レビュー待ち）|inventory_only|
|391|ui_html_text|`blacksmith.js:363`|html/template text|・合成：＋４進化時のレアリティ再抽選上限|（未提案・レビュー待ち）|inventory_only|
|392|ui_html_text|`blacksmith.js:363`|html/template text|・精錬：GEM消費でOP昇格(失敗時も消失なし)|（未提案・レビュー待ち）|inventory_only|
|393|ui_html_text|`blacksmith.js:363`|html/template text|・強化：素材消費でOP値上昇(Lvで成功率UP)|（未提案・レビュー待ち）|inventory_only|
|394|ui_html_text|`blacksmith.js:387`|html/template text|効果:|（未提案・レビュー待ち）|inventory_only|
|395|ui_html_text|`blacksmith.js:387`|html/template text|全ての効果|（未提案・レビュー待ち）|inventory_only|
|396|ui_html_text|`blacksmith.js:388`|html/template text|並替:|（未提案・レビュー待ち）|inventory_only|
|397|ui_html_text|`blacksmith.js:388`|html/template text|取得順|（未提案・レビュー待ち）|inventory_only|
|398|ui_html_text|`blacksmith.js:388`|html/template text|Rank順|（未提案・レビュー待ち）|inventory_only|
|399|ui_html_text|`blacksmith.js:486`|html/template text|強化前|（未提案・レビュー待ち）|inventory_only|
|400|ui_html_text|`blacksmith.js:489`|html/template text|強化後|（未提案・レビュー待ち）|inventory_only|
|401|ui_html_text|`blacksmith.js:493`|html/template text|必要素材（${preview.recipe.grade}帯）|（未提案・レビュー待ち）|inventory_only|
|402|ui_html_text|`blacksmith.js:496`|html/template text|内容を確認して鍛造する|（未提案・レビュー待ち）|inventory_only|
|403|ui_html_text|`blacksmith.js:544`|html/template text|素材にできる装備がありません|（未提案・レビュー待ち）|inventory_only|
|404|ui_html_text|`blacksmith.js:557`|html/template text|継承させたい能力を持つ「素材装備」を選択|（未提案・レビュー待ち）|inventory_only|
|405|ui_dom_innerText|`blacksmith.js:564`|innerText|継承させるオプションを選択|（未提案・レビュー待ち）|inventory_only|
|406|ui_html_text|`blacksmith.js:597`|html/template text|⚠️ 熟練度不足 (最低:${minRequiredRarity}が必要)|（未提案・レビュー待ち）|inventory_only|
|407|ui_html_text|`blacksmith.js:715`|html/template text|(成功率:${successRate}%)` : `|（未提案・レビュー待ち）|inventory_only|
|408|ui_html_text|`blacksmith.js:715`|html/template text|数値を最大まで上げると精錬可能|（未提案・レビュー待ち）|inventory_only|
|409|ui_dom_innerText|`blacksmith.js:759`|innerText|強化したい能力を選択|（未提案・レビュー待ち）|inventory_only|
|410|ui_html_text|`blacksmith.js:791`|html/template text|選択素材:|（未提案・レビュー待ち）|inventory_only|
|411|ui_html_text|`blacksmith.js:791`|html/template text|強化実行|（未提案・レビュー待ち）|inventory_only|
|412|ui_html_text|`blacksmith.js:795`|html/template text|素材が不足しています|（未提案・レビュー待ち）|inventory_only|
|413|ui_label|`boss_training.js:43`|label|初級|（未提案・レビュー待ち）|inventory_only|
|414|ui_html_text|`boss_training.js:55`|html/template text|対戦相手を選ぶ|（未提案・レビュー待ち）|inventory_only|
|415|ui_html_text|`boss_training.js:56`|html/template text|ランダム対戦|（未提案・レビュー待ち）|inventory_only|
|416|ui_html_text|`boss_training.js:57`|html/template text|訓練所の説明|（未提案・レビュー待ち）|inventory_only|
|417|ui_html_text|`boss_training.js:75`|html/template text|撃破した物語の強敵を、深層の力で再現する訓練施設です。|（未提案・レビュー待ち）|inventory_only|
|418|ui_html_text|`boss_training.js:80`|html/template text|訓練戦では報酬・討伐記録・クエスト進行・仲間加入は発生しません。|（未提案・レビュー待ち）|inventory_only|
|419|ui_html_text|`boss_training.js:82`|html/template text|この相手と訓練する|（未提案・レビュー待ち）|inventory_only|
|420|ui_html_text|`boss_training.js:114`|html/template text|元Rank ${rank}|（未提案・レビュー待ち）|inventory_only|
|421|ui_html_text|`boss_training.js:156`|html/template text|元Rank ${Number(base.rank \|\| 1)} / ${BossTraining.escape(base.race \|\| '不明')}|（未提案・レビュー待ち）|inventory_only|
|422|ui_html_text|`boss_training.js:159`|html/template text|強化段階|（未提案・レビュー待ち）|inventory_only|
|423|ui_html_text|`boss_training.js:165`|html/template text|訓練を開始する|（未提案・レビュー待ち）|inventory_only|
|424|ui_label|`dungeon.js:196`|label|北東の洞穴|（未提案・レビュー待ち）|inventory_only|
|425|ui_label|`dungeon.js:197`|label|森の風穴|（未提案・レビュー待ち）|inventory_only|
|426|ui_label|`dungeon.js:198`|label|イグナ火山|（未提案・レビュー待ち）|inventory_only|
|427|ui_label|`dungeon.js:199`|label|禁忌の森・風の神殿|（未提案・レビュー待ち）|inventory_only|
|428|ui_label|`dungeon.js:200`|label|クレナ鍾乳洞|（未提案・レビュー待ち）|inventory_only|
|429|ui_label|`dungeon.js:201`|label|海底神殿|（未提案・レビュー待ち）|inventory_only|
|430|ui_label|`dungeon.js:202`|label|雷の要塞|（未提案・レビュー待ち）|inventory_only|
|431|ui_label|`dungeon.js:203`|label|大灯台|（未提案・レビュー待ち）|inventory_only|
|432|ui_label|`dungeon.js:204`|label|光の宮殿|（未提案・レビュー待ち）|inventory_only|
|433|ui_label|`dungeon.js:205`|label|闇の神殿跡|（未提案・レビュー待ち）|inventory_only|
|434|ui_label|`dungeon.js:206`|label|ガルヴァニア洞窟|（未提案・レビュー待ち）|inventory_only|
|435|ui_label|`dungeon.js:207`|label|魔王城|（未提案・レビュー待ち）|inventory_only|
|436|ui_label|`dungeon.js:208`|label|禁足地グレゼリア|（未提案・レビュー待ち）|inventory_only|
|437|ui_label|`dungeon.js:322`|label|深淵|（未提案・レビュー待ち）|inventory_only|
|438|ui_label|`dungeon.js:323`|label|禁忌の森|（未提案・レビュー待ち）|inventory_only|
|439|ui_label|`dungeon.js:324`|label|雷要塞|（未提案・レビュー待ち）|inventory_only|
|440|ui_label|`dungeon.js:325`|label|海底神殿|（未提案・レビュー待ち）|inventory_only|
|441|ui_label|`dungeon.js:326`|label|イグナ火山|（未提案・レビュー待ち）|inventory_only|
|442|ui_label|`dungeon.js:327`|label|大灯台|（未提案・レビュー待ち）|inventory_only|
|443|ui_label|`dungeon.js:330`|label|光の宮殿|（未提案・レビュー待ち）|inventory_only|
|444|ui_label|`dungeon.js:338`|label|魔王城|（未提案・レビュー待ち）|inventory_only|
|445|ui_label|`dungeon.js:339`|label|ガルヴァニア洞窟|（未提案・レビュー待ち）|inventory_only|
|446|ui_label|`dungeon.js:340`|label|森の風穴|（未提案・レビュー待ち）|inventory_only|
|447|ui_label|`dungeon.js:341`|label|クレナ鍾乳洞|（未提案・レビュー待ち）|inventory_only|
|448|ui_label|`dungeon.js:342`|label|闇の神殿跡|（未提案・レビュー待ち）|inventory_only|
|449|ui_label|`dungeon.js:343`|label|禁足地グレゼリア|（未提案・レビュー待ち）|inventory_only|
|450|ui_html_text|`dungeon.js:524`|html/template text|現在地|（未提案・レビュー待ち）|inventory_only|
|451|ui_html_text|`dungeon.js:525`|html/template text|地下 ${Dungeon.floor \|\| App.data.progress.floor \|\| 1} 階|（未提案・レビュー待ち）|inventory_only|
|452|ui_html_text|`dungeon.js:530`|html/template text|ボスを倒すまで脱出できません。|（未提案・レビュー待ち）|inventory_only|
|453|ui_html_text|`dungeon.js:549`|html/template text|最高 ${maxF}階|（未提案・レビュー待ち）|inventory_only|
|454|ui_html_text|`dungeon.js:549`|html/template text|挑戦 ${tryCount}回|（未提案・レビュー待ち）|inventory_only|
|455|ui_html_text|`dungeon.js:556`|html/template text|終焉の祭壇に生じた亀裂を見つけると解放されます。|（未提案・レビュー待ち）|inventory_only|
|456|ui_html_text|`dungeon.js:557`|html/template text|深淵へ挑む|（未提案・レビュー待ち）|inventory_only|
|457|ui_confirm|`dungeon.js:568`|confirm|ダンジョンから脱出しますか？|（未提案・レビュー待ち）|inventory_only|
|458|ui_html_text|`dungeon.js:655`|html/template text|追憶の魔境へ足を踏み入れた。挑戦は1階から始まる。|（未提案・レビュー待ち）|inventory_only|
|459|ui_label|`dungeon.js:1696`|label|前の階へ|（未提案・レビュー待ち）|inventory_only|
|460|ui_label|`dungeon.js:1697`|label|次の階へ|（未提案・レビュー待ち）|inventory_only|
|461|ui_html_text|`dungeon.js:2100`|html/template text|帰還先が不安定だったため、安全な場所へ移動しました。|（未提案・レビュー待ち）|inventory_only|
|462|ui_html_text|`dungeon.js:2713`|html/template text|なんと|（未提案・レビュー待ち）|inventory_only|
|463|ui_html_text|`dungeon.js:2831`|html/template text|清らかな泉が湧いている。|（未提案・レビュー待ち）|inventory_only|
|464|ui_html_text|`dungeon.js:2865`|html/template text|清らかな泉の力で、HPとMPが全回復した！|（未提案・レビュー待ち）|inventory_only|
|465|ui_html_text|`dungeon.js:2923`|html/template text|溶岩の熱でダメージを受けた！|（未提案・レビュー待ち）|inventory_only|
|466|ui_label|`dungeon.js:3697`|label|試練の天使と話す|（未提案・レビュー待ち）|inventory_only|
|467|ui_log|`dungeon.js:3698`|log|試練の天使が静かに待っている。|（未提案・レビュー待ち）|inventory_only|
|468|ui_title|`dungeon.js:3864`|title|深淵の旅商人|（未提案・レビュー待ち）|inventory_only|
|469|ui_html_text|`dungeon.js:3998`|html/template text|深淵のハンターに追いつかれた！|（未提案・レビュー待ち）|inventory_only|
|470|ui_confirm|`dungeon.js:4066`|confirm|なんと、冒険者と遭遇した！\n話しかけてみますか？|（未提案・レビュー待ち）|inventory_only|
|471|ui_html_text|`dungeon.js:4105`|html/template text|フロアに深淵のハンターが現れた！|（未提案・レビュー待ち）|inventory_only|
|472|ui_confirm|`dungeon.js:4152`|confirm|闇がどこまでも続いているような亀裂を見つけた・・・\n亀裂の根源を断ちますか？\n（強敵との戦闘になります）|（未提案・レビュー待ち）|inventory_only|
|473|ui_html_text|`dungeon.js:4255`|html/template text|亀裂の根源を打ち破った！|（未提案・レビュー待ち）|inventory_only|
|474|ui_html_text|`dungeon.js:4297`|html/template text|根源が消滅し、その跡から輝く装備を見つけた！！|（未提案・レビュー待ち）|inventory_only|
|475|ui_label|`dungeon.js:4627`|label|道具屋|（未提案・レビュー待ち）|inventory_only|
|476|ui_label|`dungeon.js:4628`|label|武器屋|（未提案・レビュー待ち）|inventory_only|
|477|ui_label|`dungeon.js:4629`|label|防具屋|（未提案・レビュー待ち）|inventory_only|
|478|ui_label|`dungeon.js:4631`|label|鍛冶屋|（未提案・レビュー待ち）|inventory_only|
|479|ui_label|`dungeon.js:4632`|label|錬金屋|（未提案・レビュー待ち）|inventory_only|
|480|ui_label|`dungeon.js:4637`|label|地上へ戻る|（未提案・レビュー待ち）|inventory_only|
|481|ui_html_text|`dungeon.js:6345`|html/template text|依頼迷宮の討伐目標を達成した！|（未提案・レビュー待ち）|inventory_only|
|482|ui_html_text|`dungeon.js:6493`|html/template text|追憶の魔境を踏破した！ 宝箱と帰還ゲートが現れた。|（未提案・レビュー待ち）|inventory_only|
|483|ui_html_text|`dungeon.js:6531`|html/template text|物語深淵を踏破した！ 深淵の亀裂が解放されます。|（未提案・レビュー待ち）|inventory_only|
|484|ui_html_text|`dungeon.js:6533`|html/template text|階段が現れた！|（未提案・レビュー待ち）|inventory_only|
|485|ui_html_text|`facilities.js:87`|html/template text|とじる|（未提案・レビュー待ち）|inventory_only|
|486|ui_html_text|`facilities.js:148`|html/template text|転送の扉|（未提案・レビュー待ち）|inventory_only|
|487|ui_html_text|`facilities.js:151`|html/template text|泊まる (50Gold)|（未提案・レビュー待ち）|inventory_only|
|488|ui_html_text|`facilities.js:159`|html/template text|所持金: ${gold.toLocaleString()} Gold|（未提案・レビュー待ち）|inventory_only|
|489|ui_confirm|`facilities.js:165`|confirm|一泊して ＨＰ・ＭＰを 回復しますか？|（未提案・レビュー待ち）|inventory_only|
|490|ui_html_text|`facilities.js:198`|html/template text|深淵の亀裂|（未提案・レビュー待ち）|inventory_only|
|491|ui_html_text|`facilities.js:199`|html/template text|必要額: ${Facilities.getAbyssTeleportCost(Facilities.teleportFloor).toLocaleString()} Gold|（未提案・レビュー待ち）|inventory_only|
|492|ui_html_text|`facilities.js:207`|html/template text|転送を実行する|（未提案・レビュー待ち）|inventory_only|
|493|ui_html_text|`facilities.js:240`|html/template text|ふるびたコインを交換する|（未提案・レビュー待ち）|inventory_only|
|494|ui_html_text|`facilities.js:241`|html/template text|累計報酬|（未提案・レビュー待ち）|inventory_only|
|495|ui_html_text|`facilities.js:248`|html/template text|所持コイン: ${medals} 枚|（未提案・レビュー待ち）|inventory_only|
|496|ui_html_text|`facilities.js:249`|html/template text|累計消費: ${spent.toLocaleString()} 枚|（未提案・レビュー待ち）|inventory_only|
|497|ui_html_text|`facilities.js:336`|html/template text|ふるびたコイン 累計消費枚数|（未提案・レビュー待ち）|inventory_only|
|498|ui_html_text|`facilities.js:351`|html/template text|累計 ${milestone.toLocaleString()} 枚|（未提案・レビュー待ち）|inventory_only|
|499|ui_html_text|`facilities.js:352`|html/template text|報酬: ${rewardText}|（未提案・レビュー待ち）|inventory_only|
|500|ui_html_text|`facilities.js:993`|html/template text|買いにきた|（未提案・レビュー待ち）|inventory_only|
|501|ui_html_text|`facilities.js:994`|html/template text|売りにきた|（未提案・レビュー待ち）|inventory_only|
|502|ui_html_text|`facilities.js:1007`|html/template text|所持金|（未提案・レビュー待ち）|inventory_only|
|503|ui_html_text|`facilities.js:1014`|html/template text|品物を選んでください。|（未提案・レビュー待ち）|inventory_only|
|504|ui_html_text|`facilities.js:1018`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|505|ui_title|`facilities.js:1069`|title|道具屋|（未提案・レビュー待ち）|inventory_only|
|506|ui_title|`facilities.js:1138`|title|道具屋|（未提案・レビュー待ち）|inventory_only|
|507|ui_html_text|`facilities.js:1143`|html/template text|所持金: ${(App.data.gold \|\| 0).toLocaleString()} Gold|（未提案・レビュー待ち）|inventory_only|
|508|ui_html_text|`facilities.js:1149`|html/template text|買いにきた|（未提案・レビュー待ち）|inventory_only|
|509|ui_html_text|`facilities.js:1150`|html/template text|売りにきた|（未提案・レビュー待ち）|inventory_only|
|510|ui_html_text|`facilities.js:1151`|html/template text|出る|（未提案・レビュー待ち）|inventory_only|
|511|ui_html_text|`facilities.js:1213`|html/template text|所持|（未提案・レビュー待ち）|inventory_only|
|512|ui_html_text|`facilities.js:1228`|html/template text|所持 ${owned.toLocaleString()}|（未提案・レビュー待ち）|inventory_only|
|513|ui_html_text|`facilities.js:1295`|html/template text|品切れです。|（未提案・レビュー待ち）|inventory_only|
|514|ui_html_text|`facilities.js:1343`|html/template text|単価 ${price.toLocaleString()} G|（未提案・レビュー待ち）|inventory_only|
|515|ui_html_text|`facilities.js:1352`|html/template text|はい|（未提案・レビュー待ち）|inventory_only|
|516|ui_html_text|`facilities.js:1510`|html/template text|品切れです。|（未提案・レビュー待ち）|inventory_only|
|517|ui_html_text|`facilities.js:1553`|html/template text|はい|（未提案・レビュー待ち）|inventory_only|
|518|ui_html_text|`facilities.js:1681`|html/template text|購入品|（未提案・レビュー待ち）|inventory_only|
|519|ui_html_text|`facilities.js:1684`|html/template text|支払い ${price.toLocaleString()} G / 残金 ${(App.data.gold \|\| 0).toLocaleString()} G|（未提案・レビュー待ち）|inventory_only|
|520|ui_html_text|`facilities.js:1778`|html/template text|売れる道具・装備がありません。|（未提案・レビュー待ち）|inventory_only|
|521|ui_html_text|`facilities.js:1787`|html/template text|装備|（未提案・レビュー待ち）|inventory_only|
|522|ui_html_text|`facilities.js:1824`|html/template text|所持 ${count.toLocaleString()}|（未提案・レビュー待ち）|inventory_only|
|523|ui_html_text|`facilities.js:1842`|html/template text|単価 ${Facilities.getItemSellPrice(item).toLocaleString()} G|（未提案・レビュー待ち）|inventory_only|
|524|ui_html_text|`facilities.js:1851`|html/template text|はい|（未提案・レビュー待ち）|inventory_only|
|525|ui_html_text|`facilities.js:1936`|html/template text|はい|（未提案・レビュー待ち）|inventory_only|
|526|ui_html_text|`facilities.js:1980`|html/template text|GEMを賭ける|（未提案・レビュー待ち）|inventory_only|
|527|ui_html_text|`facilities.js:1981`|html/template text|GOLDを賭ける|（未提案・レビュー待ち）|inventory_only|
|528|ui_html_text|`facilities.js:1982`|html/template text|ジェム交換所|（未提案・レビュー待ち）|inventory_only|
|529|ui_label|`facilities.js:1993`|label|スキルのたね|（未提案・レビュー待ち）|inventory_only|
|530|ui_label|`facilities.js:1994`|label|転生の実|（未提案・レビュー待ち）|inventory_only|
|531|ui_label|`facilities.js:1995`|label|世界樹の雫|（未提案・レビュー待ち）|inventory_only|
|532|ui_label|`facilities.js:1996`|label|エルフの飲み薬|（未提案・レビュー待ち）|inventory_only|
|533|ui_label|`facilities.js:1997`|label|希少武器+3|（未提案・レビュー待ち）|inventory_only|
|534|ui_label|`facilities.js:1998`|label|希少防具+3|（未提案・レビュー待ち）|inventory_only|
|535|ui_label|`facilities.js:1999`|label|英雄武器+3|（未提案・レビュー待ち）|inventory_only|
|536|ui_label|`facilities.js:2000`|label|英雄防具+3|（未提案・レビュー待ち）|inventory_only|
|537|ui_html_text|`facilities.js:2008`|html/template text|所持GEM: ${gems.toLocaleString()}|（未提案・レビュー待ち）|inventory_only|
|538|ui_html_text|`facilities.js:2110`|html/template text|所持 ${unit}: ${Casino.getCurrencyAmount().toLocaleString()}|（未提案・レビュー待ち）|inventory_only|
|539|ui_html_text|`facilities.js:2111`|html/template text|ブラックジャック|（未提案・レビュー待ち）|inventory_only|
|540|ui_html_text|`facilities.js:2112`|html/template text|ポーカー|（未提案・レビュー待ち）|inventory_only|
|541|ui_html_text|`facilities.js:2134`|html/template text|所持 ${unit}: ${current.toLocaleString()}|（未提案・レビュー待ち）|inventory_only|
|542|ui_html_text|`facilities.js:2136`|html/template text|ゲーム選択へ戻る|（未提案・レビュー待ち）|inventory_only|
|543|ui_html_text|`facilities.js:2243`|html/template text|ロイヤルフラッシュ|（未提案・レビュー待ち）|inventory_only|
|544|ui_html_text|`facilities.js:2244`|html/template text|フラッシュ|（未提案・レビュー待ち）|inventory_only|
|545|ui_html_text|`facilities.js:2245`|html/template text|ストレートフラッシュ|（未提案・レビュー待ち）|inventory_only|
|546|ui_html_text|`facilities.js:2246`|html/template text|ストレート|（未提案・レビュー待ち）|inventory_only|
|547|ui_html_text|`facilities.js:2247`|html/template text|ファイブカード|（未提案・レビュー待ち）|inventory_only|
|548|ui_html_text|`facilities.js:2248`|html/template text|スリーカード|（未提案・レビュー待ち）|inventory_only|
|549|ui_html_text|`facilities.js:2249`|html/template text|フォーカード|（未提案・レビュー待ち）|inventory_only|
|550|ui_html_text|`facilities.js:2250`|html/template text|ツーペア|（未提案・レビュー待ち）|inventory_only|
|551|ui_html_text|`facilities.js:2251`|html/template text|フルハウス|（未提案・レビュー待ち）|inventory_only|
|552|ui_html_text|`facilities.js:2263`|html/template text|カード交換 / 勝負！|（未提案・レビュー待ち）|inventory_only|
|553|ui_html_text|`facilities.js:2279`|html/template text|ダブルアップ|（未提案・レビュー待ち）|inventory_only|
|554|ui_html_text|`facilities.js:2279`|html/template text|受け取る|（未提案・レビュー待ち）|inventory_only|
|555|ui_html_text|`facilities.js:2283`|html/template text|もう一度|（未提案・レビュー待ち）|inventory_only|
|556|ui_html_text|`facilities.js:2283`|html/template text|やめる|（未提案・レビュー待ち）|inventory_only|
|557|ui_html_text|`facilities.js:2345`|html/template text|BLACKJACK!! (2.5倍配当)|（未提案・レビュー待ち）|inventory_only|
|558|ui_html_text|`facilities.js:2346`|html/template text|ディーラーバースト！ 勝ち！|（未提案・レビュー待ち）|inventory_only|
|559|ui_html_text|`facilities.js:2347`|html/template text|あなたの勝ちです！|（未提案・レビュー待ち）|inventory_only|
|560|ui_html_text|`facilities.js:2355`|html/template text|ダブルアップ|（未提案・レビュー待ち）|inventory_only|
|561|ui_html_text|`facilities.js:2355`|html/template text|受け取る|（未提案・レビュー待ち）|inventory_only|
|562|ui_html_text|`facilities.js:2358`|html/template text|もう一度|（未提案・レビュー待ち）|inventory_only|
|563|ui_html_text|`facilities.js:2358`|html/template text|やめる|（未提案・レビュー待ち）|inventory_only|
|564|ui_html_text|`facilities.js:2367`|html/template text|現在の配当: ${Casino.currentPayout.toLocaleString()} ${Casino.getCurrencyLabel()}|（未提案・レビュー待ち）|inventory_only|
|565|ui_html_text|`facilities.js:2369`|html/template text|降りる|（未提案・レビュー待ち）|inventory_only|
|566|ui_html_text|`facilities.js:2378`|html/template text|WIN!! 配当が ${Casino.currentPayout.toLocaleString()} ${Casino.getCurrencyLabel()} に倍増！|（未提案・レビュー待ち）|inventory_only|
|567|ui_html_text|`facilities.js:2379`|html/template text|さらに勝負！|（未提案・レビュー待ち）|inventory_only|
|568|ui_html_text|`facilities.js:2379`|html/template text|受け取る|（未提案・レビュー待ち）|inventory_only|
|569|ui_html_text|`facilities.js:2383`|html/template text|もう一度|（未提案・レビュー待ち）|inventory_only|
|570|ui_html_text|`facilities.js:2383`|html/template text|やめる|（未提案・レビュー待ち）|inventory_only|
|571|ui_html_text|`gacha.js:174`|html/template text|開催中|（未提案・レビュー待ち）|inventory_only|
|572|ui_html_text|`gacha.js:225`|html/template text|ピックアップ|（未提案・レビュー待ち）|inventory_only|
|573|ui_html_text|`gacha.js:231`|html/template text|排出対象一覧|（未提案・レビュー待ち）|inventory_only|
|574|ui_alert|`gacha.js:250`|alert|GEMが足りません|（未提案・レビュー待ち）|inventory_only|
|575|ui_alert|`gacha.js:277`|alert|GEMが足りません|（未提案・レビュー待ち）|inventory_only|
|576|ui_html_text|`gacha.js:532`|html/template text|カードをタップ|（未提案・レビュー待ち）|inventory_only|
|577|ui_dom_textContent|`gacha.js:558`|textContent|召喚中...|（未提案・レビュー待ち）|inventory_only|
|578|ui_html_text|`gacha.js:631`|html/template text|攻撃|（未提案・レビュー待ち）|inventory_only|
|579|ui_html_text|`gacha.js:632`|html/template text|守備|（未提案・レビュー待ち）|inventory_only|
|580|ui_html_text|`gacha.js:633`|html/template text|素早|（未提案・レビュー待ち）|inventory_only|
|581|ui_html_text|`gacha.js:634`|html/template text|魔力|（未提案・レビュー待ち）|inventory_only|
|582|ui_html_text|`gacha.js:706`|html/template text|攻:${status.atk \|\| 0}|（未提案・レビュー待ち）|inventory_only|
|583|ui_html_text|`gacha.js:706`|html/template text|防:${status.def \|\| 0}|（未提案・レビュー待ち）|inventory_only|
|584|ui_html_text|`gacha.js:706`|html/template text|速:${status.spd \|\| 0}|（未提案・レビュー待ち）|inventory_only|
|585|ui_dom_innerText|`gacha.js:756`|innerText|もどる|（未提案・レビュー待ち）|inventory_only|
|586|ui_label|`guild.js:692`|label|深淵の亀裂|（未提案・レビュー待ち）|inventory_only|
|587|ui_html_text|`guild.js:1481`|html/template text|必要ランク ${App.escapeHtml(def.requiredRank \|\| 'G')}${Guild.getQuestReferenceRank(def) ? ` / 参考Rank ${Guild.getQuestReferenceRank(def)}` : ''} / 危険度 ${App.escapeHtml(Guild.getDifficultyLabel(def))} / ${App.escapeHtml(App.getQuestKindLabel?.(def.kind) \|\| def.kind)}|（未提案・レビュー待ち）|inventory_only|
|588|ui_html_text|`guild.js:1483`|html/template text|報酬: ${App.escapeHtml(rewardSummary)}|（未提案・レビュー待ち）|inventory_only|
|589|ui_html_text|`guild.js:1495`|html/template text|依頼迷宮へ挑戦|（未提案・レビュー待ち）|inventory_only|
|590|ui_html_text|`guild.js:1498`|html/template text|依頼をキャンセルする|（未提案・レビュー待ち）|inventory_only|
|591|ui_html_text|`guild.js:1499`|html/template text|受注する|（未提案・レビュー待ち）|inventory_only|
|592|ui_html_text|`guild.js:1502`|html/template text|対象エリア入口へ移動|（未提案・レビュー待ち）|inventory_only|
|593|ui_html_text|`guild.js:1509`|html/template text|達成済みです。受付職員へ報告してください。|（未提案・レビュー待ち）|inventory_only|
|594|ui_confirm|`guild.js:1532`|confirm|この依頼をキャンセルしますか？\n現在の進捗は失われます。|（未提案・レビュー待ち）|inventory_only|
|595|ui_html_text|`guild.js:1550`|html/template text|広告視聴で受注枠 +10|（未提案・レビュー待ち）|inventory_only|
|596|ui_html_text|`guild.js:1551`|html/template text|広告追加済み|（未提案・レビュー待ち）|inventory_only|
|597|ui_html_text|`guild.js:1555`|html/template text|依頼は最大5件。Cランク以上ではSSR以上の依頼迷宮が発生します。受注中の依頼は更新しても残ります。|（未提案・レビュー待ち）|inventory_only|
|598|ui_html_text|`guild.js:1558`|html/template text|本日の受注: ${dailyInfo.used}/${dailyInfo.limit}|（未提案・レビュー待ち）|inventory_only|
|599|ui_html_text|`guild.js:1559`|html/template text|残り ${dailyInfo.remaining}件|（未提案・レビュー待ち）|inventory_only|
|600|ui_html_text|`guild.js:1562`|html/template text|依頼を更新|（未提案・レビュー待ち）|inventory_only|
|601|ui_html_text|`guild.js:1566`|html/template text|紹介中のギルドクエスト|（未提案・レビュー待ち）|inventory_only|
|602|ui_html_text|`guild.js:1569`|html/template text|現在紹介できる依頼はありません。|（未提案・レビュー待ち）|inventory_only|
|603|ui_html_text|`guild.js:1606`|html/template text|受注中の依頼はありません。|（未提案・レビュー待ち）|inventory_only|
|604|ui_html_text|`guild.js:1613`|html/template text|ギルド経験値 +${result.guildExp}|（未提案・レビュー待ち）|inventory_only|
|605|ui_html_text|`guild.js:1613`|html/template text|ギルドポイント +${result.guildPoints}${equipmentText ? `|（未提案・レビュー待ち）|inventory_only|
|606|ui_html_text|`guild.js:1622`|html/template text|すでに最高ランクです。|（未提案・レビュー待ち）|inventory_only|
|607|ui_html_text|`guild.js:1628`|html/template text|昇格試験マスターが見つかりません。|（未提案・レビュー待ち）|inventory_only|
|608|ui_html_text|`guild.js:1633`|html/template text|次のランク:|（未提案・レビュー待ち）|inventory_only|
|609|ui_html_text|`guild.js:1633`|html/template text|必要経験値: ${progress.required}|（未提案・レビュー待ち）|inventory_only|
|610|ui_html_text|`guild.js:1633`|html/template text|現在経験値: ${state.exp}|（未提案・レビュー待ち）|inventory_only|
|611|ui_html_text|`guild.js:1634`|html/template text|対戦相手: ${App.escapeHtml(opponent.name)}|（未提案・レビュー待ち）|inventory_only|
|612|ui_html_text|`guild.js:1634`|html/template text|この戦闘からは逃げられません。|（未提案・レビュー待ち）|inventory_only|
|613|ui_html_text|`guild.js:1653`|html/template text|(${entry.requiredRank}ランク)|（未提案・レビュー待ち）|inventory_only|
|614|ui_html_text|`guild.js:1656`|html/template text|所持: ${state.points} GP|（未提案・レビュー待ち）|inventory_only|
|615|ui_html_text|`guild.js:1673`|html/template text|クエスト報告|（未提案・レビュー待ち）|inventory_only|
|616|ui_html_text|`guild.js:1674`|html/template text|昇格試験|（未提案・レビュー待ち）|inventory_only|
|617|ui_html_text|`guild.js:1675`|html/template text|GP交換|（未提案・レビュー待ち）|inventory_only|
|618|ui_html_text|`guild.js:1681`|html/template text|冒険者ランク|（未提案・レビュー待ち）|inventory_only|
|619|ui_html_text|`guild.js:1682`|html/template text|ギルド経験値|（未提案・レビュー待ち）|inventory_only|
|620|ui_html_text|`guild.js:1683`|html/template text|次のランクまで|（未提案・レビュー待ち）|inventory_only|
|621|ui_html_text|`guild.js:1684`|html/template text|ギルドポイント|（未提案・レビュー待ち）|inventory_only|
|622|ui_label|`guild_master.js:9`|label|R', difficultyLabel: '標準|（未提案・レビュー待ち）|inventory_only|
|623|ui_label|`guild_master.js:10`|label|SR', difficultyLabel: '高難度|（未提案・レビュー待ち）|inventory_only|
|624|ui_label|`guild_master.js:11`|label|SSR', difficultyLabel: '危険|（未提案・レビュー待ち）|inventory_only|
|625|ui_label|`guild_master.js:12`|label|UR', difficultyLabel: '極危険|（未提案・レビュー待ち）|inventory_only|
|626|ui_label|`guild_master.js:13`|label|EX', difficultyLabel: '規格外|（未提案・レビュー待ち）|inventory_only|
|627|ui_label|`guild_master.js:16`|label|Gランク|（未提案・レビュー待ち）|inventory_only|
|628|ui_label|`guild_master.js:17`|label|Fランク|（未提案・レビュー待ち）|inventory_only|
|629|ui_label|`guild_master.js:18`|label|Eランク|（未提案・レビュー待ち）|inventory_only|
|630|ui_label|`guild_master.js:19`|label|Dランク|（未提案・レビュー待ち）|inventory_only|
|631|ui_label|`guild_master.js:20`|label|Cランク|（未提案・レビュー待ち）|inventory_only|
|632|ui_label|`guild_master.js:21`|label|Bランク|（未提案・レビュー待ち）|inventory_only|
|633|ui_label|`guild_master.js:22`|label|Aランク|（未提案・レビュー待ち）|inventory_only|
|634|ui_label|`guild_master.js:23`|label|Sランク|（未提案・レビュー待ち）|inventory_only|
|635|ui_objective|`guild_master.js:32`|objective|攻守を切り替える歴戦の試験官を撃破し、実戦任務を任せられる力量を示す。|（未提案・レビュー待ち）|inventory_only|
|636|ui_objective|`guild_master.js:40`|objective|自己強化と炎技を使い分ける試験官を破り、長期戦への対応力を示す。|（未提案・レビュー待ち）|inventory_only|
|637|ui_objective|`guild_master.js:48`|objective|高い速度と連続攻撃を制し、変化する戦況を捉える判断力を示す。|（未提案・レビュー待ち）|inventory_only|
|638|ui_objective|`guild_master.js:56`|objective|高い防御と回復を備えた試験官を攻略し、決定力と継戦能力を示す。|（未提案・レビュー待ち）|inventory_only|
|639|ui_objective|`guild_master.js:64`|objective|強化解除と雷撃を操る試験官を退け、上位依頼を率いる実力を示す。|（未提案・レビュー待ち）|inventory_only|
|640|ui_objective|`guild_master.js:72`|objective|攻撃・防御・回復を高水準で操る試験官を破り、英雄級の力量を示す。|（未提案・レビュー待ち）|inventory_only|
|641|ui_objective|`guild_master.js:80`|objective|複数属性と弱体化を使い分ける総試験官を撃破し、最高位冒険者の資格を示す。|（未提案・レビュー待ち）|inventory_only|
|642|ui_label|`guild_quests.js:1022`|label|灼熱|（未提案・レビュー待ち）|inventory_only|
|643|ui_label|`guild_quests.js:1023`|label|氷水|（未提案・レビュー待ち）|inventory_only|
|644|ui_label|`guild_quests.js:1024`|label|暴風|（未提案・レビュー待ち）|inventory_only|
|645|ui_label|`guild_quests.js:1025`|label|雷霆|（未提案・レビュー待ち）|inventory_only|
|646|ui_label|`guild_quests.js:1026`|label|聖光|（未提案・レビュー待ち）|inventory_only|
|647|ui_label|`guild_quests.js:1027`|label|暗黒|（未提案・レビュー待ち）|inventory_only|
|648|ui_label|`guild_quests.js:1030`|label|敵のテーマ属性攻撃+50%|（未提案・レビュー待ち）|inventory_only|
|649|ui_label|`guild_quests.js:1031`|label|敵全員が再生Lv10|（未提案・レビュー待ち）|inventory_only|
|650|ui_label|`guild_quests.js:1032`|label|敵全員が根性Lv10|（未提案・レビュー待ち）|inventory_only|
|651|ui_label|`guild_quests.js:1033`|label|レアモンスター率50%／味方は常に猛毒|（未提案・レビュー待ち）|inventory_only|
|652|ui_label|`guild_quests.js:1034`|label|レアモンスター率50%／レア以外は超強敵|（未提案・レビュー待ち）|inventory_only|
|653|ui_html_text|`index.html:136`|html/template text|フィールド|（未提案・レビュー待ち）|inventory_only|
|654|ui_html_text|`index.html:138`|html/template text|目的|（未提案・レビュー待ち）|inventory_only|
|655|ui_html_text|`index.html:138`|html/template text|冒険を開始しよう|（未提案・レビュー待ち）|inventory_only|
|656|ui_html_text|`index.html:140`|html/template text|アクション|（未提案・レビュー待ち）|inventory_only|
|657|ui_html_text|`index.html:155`|html/template text|決定|（未提案・レビュー待ち）|inventory_only|
|658|ui_html_text|`index.html:161`|html/template text|スキップ|（未提案・レビュー待ち）|inventory_only|
|659|ui_dom_title|`index.html:163`|title|戦闘速度: 普通|（未提案・レビュー待ち）|inventory_only|
|660|ui_html_text|`index.html:176`|html/template text|こうげき|（未提案・レビュー待ち）|inventory_only|
|661|ui_html_text|`index.html:177`|html/template text|とくぎ|（未提案・レビュー待ち）|inventory_only|
|662|ui_html_text|`index.html:178`|html/template text|どうぐ|（未提案・レビュー待ち）|inventory_only|
|663|ui_html_text|`index.html:179`|html/template text|ぼうぎょ|（未提案・レビュー待ち）|inventory_only|
|664|ui_html_text|`index.html:180`|html/template text|さくせん|（未提案・レビュー待ち）|inventory_only|
|665|ui_html_text|`index.html:181`|html/template text|にげる|（未提案・レビュー待ち）|inventory_only|
|666|ui_html_text|`index.html:187`|html/template text|対象を選択|（未提案・レビュー待ち）|inventory_only|
|667|ui_html_text|`index.html:187`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|668|ui_html_text|`index.html:188`|html/template text|選択|（未提案・レビュー待ち）|inventory_only|
|669|ui_html_text|`index.html:188`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|670|ui_html_text|`index.html:196`|html/template text|キャラ名|（未提案・レビュー待ち）|inventory_only|
|671|ui_html_text|`index.html:205`|html/template text|切替|（未提案・レビュー待ち）|inventory_only|
|672|ui_html_text|`index.html:217`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|673|ui_html_text|`index.html:230`|html/template text|⚔️ 仲間編成|（未提案・レビュー待ち）|inventory_only|
|674|ui_html_text|`index.html:230`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|675|ui_html_text|`index.html:231`|html/template text|スロットを選択|（未提案・レビュー待ち）|inventory_only|
|676|ui_html_text|`index.html:232`|html/template text|メンバーを選択|（未提案・レビュー待ち）|inventory_only|
|677|ui_html_text|`index.html:236`|html/template text|🗡️ 装備変更|（未提案・レビュー待ち）|inventory_only|
|678|ui_html_text|`index.html:236`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|679|ui_html_text|`index.html:237`|html/template text|キャラを選択|（未提案・レビュー待ち）|inventory_only|
|680|ui_html_text|`index.html:238`|html/template text|部位を選択|（未提案・レビュー待ち）|inventory_only|
|681|ui_html_text|`index.html:238`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|682|ui_html_text|`index.html:239`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|683|ui_html_text|`index.html:245`|html/template text|🏹 所持装備|（未提案・レビュー待ち）|inventory_only|
|684|ui_html_text|`index.html:247`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|685|ui_html_text|`index.html:253`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|686|ui_html_text|`index.html:259`|html/template text|🍀 道具|（未提案・レビュー待ち）|inventory_only|
|687|ui_html_text|`index.html:260`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|688|ui_html_text|`index.html:268`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|689|ui_html_text|`index.html:273`|html/template text|使用対象を選択|（未提案・レビュー待ち）|inventory_only|
|690|ui_html_text|`index.html:277`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|691|ui_html_text|`index.html:284`|html/template text|‍🧑‍🤝‍🧑 仲間一覧|（未提案・レビュー待ち）|inventory_only|
|692|ui_html_text|`index.html:285`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|693|ui_html_text|`index.html:297`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|694|ui_html_text|`index.html:304`|html/template text|✨ スキル|（未提案・レビュー待ち）|inventory_only|
|695|ui_html_text|`index.html:305`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|696|ui_html_text|`index.html:309`|html/template text|使用者を選択|（未提案・レビュー待ち）|inventory_only|
|697|ui_html_text|`index.html:313`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|698|ui_html_text|`index.html:318`|html/template text|スキルを選択|（未提案・レビュー待ち）|inventory_only|
|699|ui_html_text|`index.html:322`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|700|ui_html_text|`index.html:327`|html/template text|対象を選択|（未提案・レビュー待ち）|inventory_only|
|701|ui_html_text|`index.html:331`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|702|ui_html_text|`index.html:338`|html/template text|📖 魔物図鑑|（未提案・レビュー待ち）|inventory_only|
|703|ui_html_text|`index.html:339`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|704|ui_html_text|`index.html:346`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|705|ui_html_text|`index.html:352`|html/template text|📡 魔道通信|（未提案・レビュー待ち）|inventory_only|
|706|ui_html_text|`index.html:353`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|707|ui_html_text|`index.html:356`|html/template text|遠隔利用する施設・ギルド窓口を選択してください。|（未提案・レビュー待ち）|inventory_only|
|708|ui_html_text|`index.html:358`|html/template text|鍛冶屋|（未提案・レビュー待ち）|inventory_only|
|709|ui_html_text|`index.html:359`|html/template text|装備合成・装備精錬・装備強化|（未提案・レビュー待ち）|inventory_only|
|710|ui_html_text|`index.html:362`|html/template text|錬金所|（未提案・レビュー待ち）|inventory_only|
|711|ui_html_text|`index.html:363`|html/template text|素材から道具や香を錬成|（未提案・レビュー待ち）|inventory_only|
|712|ui_html_text|`index.html:366`|html/template text|ギルド依頼|（未提案・レビュー待ち）|inventory_only|
|713|ui_html_text|`index.html:367`|html/template text|依頼掲示板の確認・更新・受注|（未提案・レビュー待ち）|inventory_only|
|714|ui_html_text|`index.html:371`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|715|ui_html_text|`index.html:377`|html/template text|⚒️ 鍛冶屋|（未提案・レビュー待ち）|inventory_only|
|716|ui_html_text|`index.html:379`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|717|ui_html_text|`index.html:380`|html/template text|外へ出る|（未提案・レビュー待ち）|inventory_only|
|718|ui_html_text|`index.html:385`|html/template text|装備強化|（未提案・レビュー待ち）|inventory_only|
|719|ui_html_text|`index.html:386`|html/template text|スロット拡張|（未提案・レビュー待ち）|inventory_only|
|720|ui_html_text|`index.html:391`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|721|ui_html_text|`index.html:397`|html/template text|🎲 ガチャ|（未提案・レビュー待ち）|inventory_only|
|722|ui_html_text|`index.html:399`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|723|ui_html_text|`index.html:403`|html/template text|召喚するガチャを選択|（未提案・レビュー待ち）|inventory_only|
|724|ui_html_text|`index.html:411`|html/template text|単発 (300 GEM)|（未提案・レビュー待ち）|inventory_only|
|725|ui_html_text|`index.html:412`|html/template text|10連 (3000 GEM)|（未提案・レビュー待ち）|inventory_only|
|726|ui_html_text|`index.html:413`|html/template text|提供割合|（未提案・レビュー待ち）|inventory_only|
|727|ui_html_text|`index.html:418`|html/template text|召喚する|（未提案・レビュー待ち）|inventory_only|
|728|ui_html_text|`index.html:422`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|729|ui_html_text|`index.html:428`|html/template text|取引所|（未提案・レビュー待ち）|inventory_only|
|730|ui_html_text|`index.html:429`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|731|ui_html_text|`index.html:435`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|732|ui_html_text|`index.html:441`|html/template text|実績|（未提案・レビュー待ち）|inventory_only|
|733|ui_html_text|`index.html:442`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|734|ui_html_text|`index.html:448`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|735|ui_html_text|`index.html:454`|html/template text|🐦‍⬛ ダンジョン|（未提案・レビュー待ち）|inventory_only|
|736|ui_html_text|`index.html:455`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|737|ui_html_text|`index.html:461`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|738|ui_html_text|`index.html:465`|html/template text|宿屋|（未提案・レビュー待ち）|inventory_only|
|739|ui_html_text|`index.html:466`|html/template text|古銭王の館|（未提案・レビュー待ち）|inventory_only|
|740|ui_html_text|`index.html:466`|html/template text|所持:|（未提案・レビュー待ち）|inventory_only|
|741|ui_html_text|`index.html:466`|html/template text|枚|（未提案・レビュー待ち）|inventory_only|
|742|ui_html_text|`index.html:466`|html/template text|出る|（未提案・レビュー待ち）|inventory_only|
|743|ui_html_text|`index.html:466`|html/template text|ふるびたコインと景品を交換します|（未提案・レビュー待ち）|inventory_only|
|744|ui_html_text|`index.html:469`|html/template text|カジノ|（未提案・レビュー待ち）|inventory_only|
|745|ui_html_text|`index.html:470`|html/template text|ポーカー|（未提案・レビュー待ち）|inventory_only|
|746|ui_html_text|`index.html:470`|html/template text|ブラックジャック|（未提案・レビュー待ち）|inventory_only|
|747|ui_html_text|`index.html:470`|html/template text|出る|（未提案・レビュー待ち）|inventory_only|
|748|ui_html_text|`index.html:474`|html/template text|ショップ|（未提案・レビュー待ち）|inventory_only|
|749|ui_html_text|`index.html:475`|html/template text|錬金所|（未提案・レビュー待ち）|inventory_only|
|750|ui_html_text|`index.html:476`|html/template text|モンスター育成所|（未提案・レビュー待ち）|inventory_only|
|751|ui_html_text|`index.html:477`|html/template text|ストーリーボス訓練所|（未提案・レビュー待ち）|inventory_only|
|752|ui_html_text|`index.html:478`|html/template text|鍛冶屋|（未提案・レビュー待ち）|inventory_only|
|753|ui_html_text|`index.html:479`|html/template text|冒険者ギルド|（未提案・レビュー待ち）|inventory_only|
|754|ui_html_text|`index.html:485`|html/template text|スキップ|（未提案・レビュー待ち）|inventory_only|
|755|ui_html_text|`index.html:489`|html/template text|提供割合|（未提案・レビュー待ち）|inventory_only|
|756|ui_html_text|`index.html:489`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|757|ui_html_text|`index.html:494`|html/template text|召喚結果|（未提案・レビュー待ち）|inventory_only|
|758|ui_html_text|`index.html:497`|html/template text|所持GEM:|（未提案・レビュー待ち）|inventory_only|
|759|ui_html_text|`index.html:499`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|760|ui_html_text|`index.html:500`|html/template text|もう一度引く|（未提案・レビュー待ち）|inventory_only|
|761|ui_alert|`index.html:661`|alert|エラー: データベースまたはスクリプトの読み込みに失敗しました。|（未提案・レビュー待ち）|inventory_only|
|762|ui_alert|`index.html:666`|alert|エラー: 初期化に失敗しました。|（未提案・レビュー待ち）|inventory_only|
|763|ui_html_text|`item_runtime.js:79`|html/template text|0) Battle.log(`${target.name}に|（未提案・レビュー待ち）|inventory_only|
|764|ui_message|`item_runtime.js:242`|message|仲間全員が蘇生し、HPとMPが全回復した！|（未提案・レビュー待ち）|inventory_only|
|765|ui_label|`items.js:7080`|label|金属|（未提案・レビュー待ち）|inventory_only|
|766|ui_label|`items.js:7081`|label|木材|（未提案・レビュー待ち）|inventory_only|
|767|ui_label|`items.js:7082`|label|魔石|（未提案・レビュー待ち）|inventory_only|
|768|ui_label|`items.js:7083`|label|羽|（未提案・レビュー待ち）|inventory_only|
|769|ui_label|`items.js:7084`|label|爪|（未提案・レビュー待ち）|inventory_only|
|770|ui_label|`items.js:7085`|label|毛皮|（未提案・レビュー待ち）|inventory_only|
|771|ui_label|`items.js:7086`|label|液体|（未提案・レビュー待ち）|inventory_only|
|772|ui_label|`items.js:7087`|label|分類不能|（未提案・レビュー待ち）|inventory_only|
|773|ui_dom_textContent|`main.html:59`|textContent|いいえ|（未提案・レビュー待ち）|inventory_only|
|774|ui_html_text|`main.html:151`|html/template text|オートセーブから|（未提案・レビュー待ち）|inventory_only|
|775|ui_html_text|`main.html:152`|html/template text|つづきから|（未提案・レビュー待ち）|inventory_only|
|776|ui_html_text|`main.html:153`|html/template text|はじめから|（未提案・レビュー待ち）|inventory_only|
|777|ui_html_text|`main.html:154`|html/template text|データ管理|（未提案・レビュー待ち）|inventory_only|
|778|ui_html_text|`main.html:160`|html/template text|主人公設定|（未提案・レビュー待ち）|inventory_only|
|779|ui_html_text|`main.html:162`|html/template text|名前|（未提案・レビュー待ち）|inventory_only|
|780|ui_dom_placeholder|`main.html:163`|placeholder|名前を入力|（未提案・レビュー待ち）|inventory_only|
|781|ui_html_text|`main.html:165`|html/template text|アイコン|（未提案・レビュー待ち）|inventory_only|
|782|ui_html_text|`main.html:168`|html/template text|画像を選ぶ|（未提案・レビュー待ち）|inventory_only|
|783|ui_html_text|`main.html:173`|html/template text|冒険を始める|（未提案・レビュー待ち）|inventory_only|
|784|ui_html_text|`main.html:174`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|785|ui_html_text|`main.html:181`|html/template text|データ管理|（未提案・レビュー待ち）|inventory_only|
|786|ui_html_text|`main.html:182`|html/template text|バックアップ出力|（未提案・レビュー待ち）|inventory_only|
|787|ui_html_text|`main.html:183`|html/template text|バックアップ読込|（未提案・レビュー待ち）|inventory_only|
|788|ui_html_text|`main.html:185`|html/template text|アプリをインストール|（未提案・レビュー待ち）|inventory_only|
|789|ui_html_text|`main.html:186`|html/template text|アプリを更新|（未提案・レビュー待ち）|inventory_only|
|790|ui_html_text|`main.html:188`|html/template text|オートセーブを削除|（未提案・レビュー待ち）|inventory_only|
|791|ui_html_text|`main.html:189`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|792|ui_label|`main.js:405`|label|ガンガンいこうぜ|（未提案・レビュー待ち）|inventory_only|
|793|ui_label|`main.js:406`|label|バッチリがんばれ|（未提案・レビュー待ち）|inventory_only|
|794|ui_label|`main.js:407`|label|せつやくしようぜ|（未提案・レビュー待ち）|inventory_only|
|795|ui_label|`main.js:408`|label|いろいろやろうぜ|（未提案・レビュー待ち）|inventory_only|
|796|ui_label|`main.js:409`|label|いのちだいじに|（未提案・レビュー待ち）|inventory_only|
|797|ui_label|`main.js:410`|label|ＭＰつかうな|（未提案・レビュー待ち）|inventory_only|
|798|ui_dom_textContent|`main.js:2413`|textContent|はい|（未提案・レビュー待ち）|inventory_only|
|799|ui_dom_textContent|`main.js:2419`|textContent|いいえ|（未提案・レビュー待ち）|inventory_only|
|800|ui_message|`main.js:3480`|message|スカイプリズムを持っていません。|（未提案・レビュー待ち）|inventory_only|
|801|ui_message|`main.js:3483`|message|まだ発見していない場所には移動できない。|（未提案・レビュー待ち）|inventory_only|
|802|ui_message|`main.js:3486`|message|この場所の定義が見つかりません。|（未提案・レビュー待ち）|inventory_only|
|803|ui_message|`main.js:3494`|message|深淵世界はスカイプリズムの座標に定着しない。|（未提案・レビュー待ち）|inventory_only|
|804|ui_message|`main.js:3497`|message|統合の祭壇へ向かうには、先に奈落への洞窟の祭壇側出口を確保する必要がある。|（未提案・レビュー待ち）|inventory_only|
|805|ui_message|`main.js:3500`|message|この場所のフィールド座標が見つかりません。|（未提案・レビュー待ち）|inventory_only|
|806|ui_message|`main.js:3624`|message|ライザーク要塞の冒険者ギルドはまだ利用できません。|（未提案・レビュー待ち）|inventory_only|
|807|ui_message|`main.js:3633`|message|ギルド受付のマップ情報を読み込めませんでした。|（未提案・レビュー待ち）|inventory_only|
|808|ui_confirm|`main.js:3678`|confirm|ライザーク要塞1階のギルド受付前へ移動しますか？|（未提案・レビュー待ち）|inventory_only|
|809|ui_label|`main.js:4320`|label|バランス型A|（未提案・レビュー待ち）|inventory_only|
|810|ui_message|`main.js:4396`|message|仲間データを確認できません。|（未提案・レビュー待ち）|inventory_only|
|811|ui_message|`main.js:4398`|message|対象の仲間が見つかりません。|（未提案・レビュー待ち）|inventory_only|
|812|ui_message|`main.js:4400`|message|仲間モンスター以外は逃がせません。|（未提案・レビュー待ち）|inventory_only|
|813|ui_message|`main.js:4401`|message|戦闘中は仲間を逃がせません。|（未提案・レビュー待ち）|inventory_only|
|814|ui_message|`main.js:4529`|message|格闘場ランクを確認できません。|（未提案・レビュー待ち）|inventory_only|
|815|ui_html_text|`main.js:5305`|html/template text|クエスト|（未提案・レビュー待ち）|inventory_only|
|816|ui_html_text|`main.js:5314`|html/template text|目的|（未提案・レビュー待ち）|inventory_only|
|817|ui_html_text|`main.js:5317`|html/template text|対象|（未提案・レビュー待ち）|inventory_only|
|818|ui_html_text|`main.js:5319`|html/template text|報酬|（未提案・レビュー待ち）|inventory_only|
|819|ui_html_text|`main.js:5339`|html/template text|入口へ移動|（未提案・レビュー待ち）|inventory_only|
|820|ui_html_text|`main.js:5343`|html/template text|受ける|（未提案・レビュー待ち）|inventory_only|
|821|ui_html_text|`main.js:5344`|html/template text|やめる|（未提案・レビュー待ち）|inventory_only|
|822|ui_html_text|`main.js:5349`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|823|ui_html_text|`main.js:5644`|html/template text|報酬: ${App.escapeHtml(App.getQuestRewardSummary(quest))}|（未提案・レビュー待ち）|inventory_only|
|824|ui_html_text|`main.js:5649`|html/template text|依頼掲示板|（未提案・レビュー待ち）|inventory_only|
|825|ui_html_text|`main.js:5649`|html/template text|討伐・素材交換依頼|（未提案・レビュー待ち）|inventory_only|
|826|ui_html_text|`main.js:5650`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|827|ui_html_text|`main.js:7415`|html/template text|最大HP+${incHp} 最大MP+${incMp}|（未提案・レビュー待ち）|inventory_only|
|828|ui_html_text|`main.js:7415`|html/template text|攻撃+${incAtk} 防御+${incDef} 魔力+${incMag} 魔防+${incMdef} 速さ+${incSpd}|（未提案・レビュー待ち）|inventory_only|
|829|ui_html_text|`main.js:7962`|html/template text|攻:${s.atk}|（未提案・レビュー待ち）|inventory_only|
|830|ui_html_text|`main.js:7962`|html/template text|防:${s.def}|（未提案・レビュー待ち）|inventory_only|
|831|ui_html_text|`main.js:7962`|html/template text|魔:${s.mag}|（未提案・レビュー待ち）|inventory_only|
|832|ui_html_text|`main.js:7962`|html/template text|速:${s.spd}|（未提案・レビュー待ち）|inventory_only|
|833|ui_message|`main.js:8162`|message|スキルデータを確認できません。|（未提案・レビュー待ち）|inventory_only|
|834|ui_message|`main.js:8250`|message|合成する仲間モンスターを確認できません。|（未提案・レビュー待ち）|inventory_only|
|835|ui_message|`main.js:8304`|message|引き継ぐスキルを8個選んでください。|（未提案・レビュー待ち）|inventory_only|
|836|ui_message|`main.js:8307`|message|引き継ぐ特性を6個選んでください。|（未提案・レビュー待ち）|inventory_only|
|837|ui_message|`main.js:8310`|message|合成の壺を持っていません。|（未提案・レビュー待ち）|inventory_only|
|838|ui_message|`main.js:8728`|message|セーブデータの出力に失敗しました|（未提案・レビュー待ち）|inventory_only|
|839|ui_html_text|`main.js:8803`|html/template text|「警戒」により不意打ちを防いだ！|（未提案・レビュー待ち）|inventory_only|
|840|ui_html_text|`main.js:8808`|html/template text|「忍び足」により先制攻撃のチャンス！|（未提案・レビュー待ち）|inventory_only|
|841|ui_html_text|`main.js:9962`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|842|ui_label|`main.js:10771`|label|赤の鍵|（未提案・レビュー待ち）|inventory_only|
|843|ui_label|`main.js:10772`|label|青の鍵|（未提案・レビュー待ち）|inventory_only|
|844|ui_label|`main.js:10773`|label|金の鍵|（未提案・レビュー待ち）|inventory_only|
|845|ui_label|`map.js:1509`|label|西門|（未提案・レビュー待ち）|inventory_only|
|846|ui_label|`map.js:1515`|label|東門|（未提案・レビュー待ち）|inventory_only|
|847|ui_label|`map.js:1544`|label|要塞側|（未提案・レビュー待ち）|inventory_only|
|848|ui_label|`map.js:1550`|label|帝国側|（未提案・レビュー待ち）|inventory_only|
|849|ui_label|`map.js:1569`|label|入口側|（未提案・レビュー待ち）|inventory_only|
|850|ui_label|`map.js:1575`|label|祭壇側|（未提案・レビュー待ち）|inventory_only|
|851|ui_label|`map.js:1712`|label|南西門|（未提案・レビュー待ち）|inventory_only|
|852|ui_label|`map.js:1713`|label|北東門|（未提案・レビュー待ち）|inventory_only|
|853|ui_label|`map.js:1744`|label|南門|（未提案・レビュー待ち）|inventory_only|
|854|ui_label|`map.js:1745`|label|北門|（未提案・レビュー待ち）|inventory_only|
|855|ui_lockedText|`map.js:1745`|lockedText|北門は城内から閉ざされている。皇帝家の末裔との謁見が必要だ。|（未提案・レビュー待ち）|inventory_only|
|856|ui_html_text|`map.js:6266`|html/template text|ギルガメッシュに挑みますか？|（未提案・レビュー待ち）|inventory_only|
|857|ui_html_text|`map.js:6266`|html/template text|※この戦いからは逃げられません|（未提案・レビュー待ち）|inventory_only|
|858|ui_label|`map.js:8510`|label|深淵世界へ戻る|（未提案・レビュー待ち）|inventory_only|
|859|ui_label|`map.js:8513`|label|砂丘の北西口から外へ出る|（未提案・レビュー待ち）|inventory_only|
|860|ui_label|`map.js:8529`|label|深淵世界へ戻る|（未提案・レビュー待ち）|inventory_only|
|861|ui_label|`map.js:8532`|label|墓地の東口から外へ出る|（未提案・レビュー待ち）|inventory_only|
|862|ui_label|`map.js:8542`|label|東域|（未提案・レビュー待ち）|inventory_only|
|863|ui_label|`map.js:8543`|label|深淵世界へ戻る|（未提案・レビュー待ち）|inventory_only|
|864|ui_label|`map.js:8543`|label|西域へ進む|（未提案・レビュー待ち）|inventory_only|
|865|ui_label|`map.js:8545`|label|西域|（未提案・レビュー待ち）|inventory_only|
|866|ui_label|`map.js:8547`|label|東域へ戻る|（未提案・レビュー待ち）|inventory_only|
|867|ui_label|`map.js:8550`|label|樹林の西口から外へ出る|（未提案・レビュー待ち）|inventory_only|
|868|ui_label|`map.js:8558`|label|南西峰|（未提案・レビュー待ち）|inventory_only|
|869|ui_label|`map.js:8559`|label|深淵世界へ戻る|（未提案・レビュー待ち）|inventory_only|
|870|ui_label|`map.js:8559`|label|北東峰へ進む|（未提案・レビュー待ち）|inventory_only|
|871|ui_label|`map.js:8561`|label|北東峰|（未提案・レビュー待ち）|inventory_only|
|872|ui_label|`map.js:8563`|label|南西峰へ戻る|（未提案・レビュー待ち）|inventory_only|
|873|ui_label|`map.js:8566`|label|山脈の北東口から外へ出る|（未提案・レビュー待ち）|inventory_only|
|874|ui_label|`map.js:8575`|label|1層|（未提案・レビュー待ち）|inventory_only|
|875|ui_label|`map.js:8576`|label|外へ戻る|（未提案・レビュー待ち）|inventory_only|
|876|ui_label|`map.js:8576`|label|2層へ進む|（未提案・レビュー待ち）|inventory_only|
|877|ui_label|`map.js:8579`|label|6層|（未提案・レビュー待ち）|inventory_only|
|878|ui_label|`map.js:8581`|label|5層へ戻る|（未提案・レビュー待ち）|inventory_only|
|879|ui_label|`map.js:8597`|label|災禍の根ジャゴレアへ進む|（未提案・レビュー待ち）|inventory_only|
|880|ui_label|`map.js:8600`|label|1層|（未提案・レビュー待ち）|inventory_only|
|881|ui_label|`map.js:8600`|label|リドパルムへ戻る|（未提案・レビュー待ち）|inventory_only|
|882|ui_label|`map.js:8600`|label|2層へ進む|（未提案・レビュー待ち）|inventory_only|
|883|ui_label|`map.js:8602`|label|5層|（未提案・レビュー待ち）|inventory_only|
|884|ui_label|`map.js:8602`|label|4層へ戻る|（未提案・レビュー待ち）|inventory_only|
|885|ui_label|`map.js:8605`|label|1層|（未提案・レビュー待ち）|inventory_only|
|886|ui_label|`map.js:8605`|label|レガシオン地下神殿へ戻る|（未提案・レビュー待ち）|inventory_only|
|887|ui_label|`map.js:8605`|label|2層へ進む|（未提案・レビュー待ち）|inventory_only|
|888|ui_label|`map.js:8607`|label|7層|（未提案・レビュー待ち）|inventory_only|
|889|ui_label|`map.js:8607`|label|6層へ戻る|（未提案・レビュー待ち）|inventory_only|
|890|ui_label|`map.js:8607`|label|終焉の祭壇へ進む|（未提案・レビュー待ち）|inventory_only|
|891|ui_label|`map.js:8610`|label|終焉の祭壇|（未提案・レビュー待ち）|inventory_only|
|892|ui_label|`map.js:8611`|label|クロノアビスへ戻る|（未提案・レビュー待ち）|inventory_only|
|893|ui_label|`map.js:8620`|label|さらに深い亀裂を調べる|（未提案・レビュー待ち）|inventory_only|
|894|ui_lockedText|`map.js:8620`|lockedText|亀裂はまだ固く閉ざされている。|（未提案・レビュー待ち）|inventory_only|
|895|ui_log|`map.js:8620`|log|祭壇の奥に、底の知れない亀裂が広がっている。|（未提案・レビュー待ち）|inventory_only|
|896|ui_label|`map.js:8761`|label|火山道|（未提案・レビュー待ち）|inventory_only|
|897|ui_label|`map.js:8793`|label|里へ戻る|（未提案・レビュー待ち）|inventory_only|
|898|ui_label|`map.js:8801`|label|溶岩回廊へ|（未提案・レビュー待ち）|inventory_only|
|899|ui_label|`map.js:8820`|label|溶岩回廊|（未提案・レビュー待ち）|inventory_only|
|900|ui_label|`map.js:8854`|label|火山道へ戻る|（未提案・レビュー待ち）|inventory_only|
|901|ui_label|`map.js:8862`|label|火の祭壇へ|（未提案・レビュー待ち）|inventory_only|
|902|ui_label|`map.js:8882`|label|火の祭壇|（未提案・レビュー待ち）|inventory_only|
|903|ui_lockedText|`map.js:8932`|lockedText|火のプリズムは、まだこちらの声に応えない。|（未提案・レビュー待ち）|inventory_only|
|904|ui_label|`map.js:8935`|label|火のプリズムに呼びかける|（未提案・レビュー待ち）|inventory_only|
|905|ui_label|`map.js:8945`|label|溶岩回廊へ戻る|（未提案・レビュー待ち）|inventory_only|
|906|ui_label|`map.js:8953`|label|火山深部へ|（未提案・レビュー待ち）|inventory_only|
|907|ui_label|`map.js:8990`|label|火山深部・煤風洞|（未提案・レビュー待ち）|inventory_only|
|908|ui_label|`map.js:9044`|label|火の祭壇へ戻る|（未提案・レビュー待ち）|inventory_only|
|909|ui_label|`map.js:9052`|label|炎心炉へ|（未提案・レビュー待ち）|inventory_only|
|910|ui_message|`map.js:9073`|message|濃い火山ガスを吸った！|（未提案・レビュー待ち）|inventory_only|
|911|ui_message|`map.js:9081`|message|噴気孔から熱風が吹き上がった。|（未提案・レビュー待ち）|inventory_only|
|912|ui_message|`map.js:9089`|message|熱風に押し戻された。|（未提案・レビュー待ち）|inventory_only|
|913|ui_message|`map.js:9105`|message|炎を纏う強敵が迫る！|（未提案・レビュー待ち）|inventory_only|
|914|ui_label|`map.js:9141`|label|左の排熱弁を回す|（未提案・レビュー待ち）|inventory_only|
|915|ui_log|`map.js:9231`|log|煤に埋もれた排熱弁を回した。|（未提案・レビュー待ち）|inventory_only|
|916|ui_label|`map.js:9238`|label|右の排熱弁を回す|（未提案・レビュー待ち）|inventory_only|
|917|ui_log|`map.js:9328`|log|赤く焼けた排熱弁を押し込んだ。|（未提案・レビュー待ち）|inventory_only|
|918|ui_label|`map.js:9341`|label|火山深部・炎心炉|（未提案・レビュー待ち）|inventory_only|
|919|ui_label|`map.js:9394`|label|煤風洞へ戻る|（未提案・レビュー待ち）|inventory_only|
|920|ui_message|`map.js:9415`|message|炉心の煙が体を焼く！|（未提案・レビュー待ち）|inventory_only|
|921|ui_message|`map.js:9431`|message|炉心の番人が迫る！|（未提案・レビュー待ち）|inventory_only|
|922|ui_label|`map.js:9486`|label|封じられた森・東の迷い路|（未提案・レビュー待ち）|inventory_only|
|923|ui_label|`map.js:9530`|label|風の集落カザリアへ戻る|（未提案・レビュー待ち）|inventory_only|
|924|ui_log|`map.js:9531`|log|集落へ続く森の出口だ。|（未提案・レビュー待ち）|inventory_only|
|925|ui_label|`map.js:9540`|label|森の奥へ進む|（未提案・レビュー待ち）|inventory_only|
|926|ui_log|`map.js:9541`|log|木々の切れ目から、さらに深い森へ道が続いている。|（未提案・レビュー待ち）|inventory_only|
|927|ui_message|`map.js:9560`|message|黒い風に道を逸らされた。|（未提案・レビュー待ち）|inventory_only|
|928|ui_message|`map.js:9568`|message|黒い風に道を逸らされた。|（未提案・レビュー待ち）|inventory_only|
|929|ui_message|`map.js:9576`|message|不思議な力で移動した。|（未提案・レビュー待ち）|inventory_only|
|930|ui_message|`map.js:9584`|message|不思議な力で移動した。|（未提案・レビュー待ち）|inventory_only|
|931|ui_message|`map.js:9592`|message|不思議な力で移動した。|（未提案・レビュー待ち）|inventory_only|
|932|ui_label|`map.js:9599`|label|立札を読む|（未提案・レビュー待ち）|inventory_only|
|933|ui_log|`map.js:9600`|log|掠れた字で「北」と書かれているようだ…|（未提案・レビュー待ち）|inventory_only|
|934|ui_label|`map.js:9617`|label|封じられた森・祈りの広場|（未提案・レビュー待ち）|inventory_only|
|935|ui_label|`map.js:9668`|label|東の森へ戻る|（未提案・レビュー待ち）|inventory_only|
|936|ui_log|`map.js:9669`|log|木々の切れ目から、来た道へ戻れそうだ。|（未提案・レビュー待ち）|inventory_only|
|937|ui_label|`map.js:9675`|label|風の神殿へ入る|（未提案・レビュー待ち）|inventory_only|
|938|ui_log|`map.js:9676`|log|森の北端に、風の神殿へ続く古い石門が開いている。|（未提案・レビュー待ち）|inventory_only|
|939|ui_label|`map.js:9687`|label|森の深部へ|（未提案・レビュー待ち）|inventory_only|
|940|ui_message|`map.js:9714`|message|祈りの広場に残る瘴気が肌を刺す。|（未提案・レビュー待ち）|inventory_only|
|941|ui_message|`map.js:9721`|message|祈りの広場に残る瘴気が肌を刺す。|（未提案・レビュー待ち）|inventory_only|
|942|ui_label|`map.js:9728`|label|朽ちた石碑を読む|（未提案・レビュー待ち）|inventory_only|
|943|ui_log|`map.js:9729`|log|石碑には、森の風を鎮めた名もなき守人の印が刻まれている。|（未提案・レビュー待ち）|inventory_only|
|944|ui_label|`map.js:9736`|label|石碑に祈る|（未提案・レビュー待ち）|inventory_only|
|945|ui_log|`map.js:9737`|log|守護者を鎮めた石碑に、穏やかな風が巡っている。|（未提案・レビュー待ち）|inventory_only|
|946|ui_label|`map.js:9772`|label|禁忌の森深部・迷い根の庭|（未提案・レビュー待ち）|inventory_only|
|947|ui_label|`map.js:9826`|label|祈りの広場へ戻る|（未提案・レビュー待ち）|inventory_only|
|948|ui_label|`map.js:9834`|label|呪風の根へ|（未提案・レビュー待ち）|inventory_only|
|949|ui_message|`map.js:9867`|message|濃い瘴気がまとわりつく。|（未提案・レビュー待ち）|inventory_only|
|950|ui_message|`map.js:9883`|message|呪根の追跡者が迫る！|（未提案・レビュー待ち）|inventory_only|
|951|ui_label|`map.js:9923`|label|禁忌の森深部・呪風の根|（未提案・レビュー待ち）|inventory_only|
|952|ui_label|`map.js:9978`|label|迷い根の庭へ戻る|（未提案・レビュー待ち）|inventory_only|
|953|ui_message|`map.js:9996`|message|呪風の番人が迫る！|（未提案・レビュー待ち）|inventory_only|
|954|ui_message|`map.js:10004`|message|不思議な力で移動した。|（未提案・レビュー待ち）|inventory_only|
|955|ui_message|`map.js:10012`|message|不思議な力で移動した。|（未提案・レビュー待ち）|inventory_only|
|956|ui_message|`map.js:10020`|message|不思議な力で移動した。|（未提案・レビュー待ち）|inventory_only|
|957|ui_message|`map.js:10028`|message|不思議な力で移動した。|（未提案・レビュー待ち）|inventory_only|
|958|ui_message|`map.js:10036`|message|不思議な力で移動した。|（未提案・レビュー待ち）|inventory_only|
|959|ui_message|`map.js:10044`|message|不思議な力で移動した。|（未提案・レビュー待ち）|inventory_only|
|960|ui_message|`map.js:10052`|message|不思議な力で移動した。|（未提案・レビュー待ち）|inventory_only|
|961|ui_label|`map.js:10106`|label|1階・風廊|（未提案・レビュー待ち）|inventory_only|
|962|ui_label|`map.js:10141`|label|森へ戻る|（未提案・レビュー待ち）|inventory_only|
|963|ui_label|`map.js:10149`|label|2階へ上がる|（未提案・レビュー待ち）|inventory_only|
|964|ui_label|`map.js:10174`|label|2階・旋風の回廊|（未提案・レビュー待ち）|inventory_only|
|965|ui_label|`map.js:10214`|label|1階へ下りる|（未提案・レビュー待ち）|inventory_only|
|966|ui_label|`map.js:10222`|label|3階へ上がる|（未提案・レビュー待ち）|inventory_only|
|967|ui_message|`map.js:10238`|message|不思議な力で移動した。|（未提案・レビュー待ち）|inventory_only|
|968|ui_message|`map.js:10246`|message|不思議な力で移動した。|（未提案・レビュー待ち）|inventory_only|
|969|ui_label|`map.js:10259`|label|3階・風の祭壇|（未提案・レビュー待ち）|inventory_only|
|970|ui_lockedText|`map.js:10315`|lockedText|風のプリズムは、まだこちらの声に応えない。|（未提案・レビュー待ち）|inventory_only|
|971|ui_label|`map.js:10318`|label|風のプリズムに呼びかける|（未提案・レビュー待ち）|inventory_only|
|972|ui_label|`map.js:10328`|label|2階へ下りる|（未提案・レビュー待ち）|inventory_only|
|973|ui_label|`map.js:10372`|label|地下1階・沈水回廊|（未提案・レビュー待ち）|inventory_only|
|974|ui_label|`map.js:10406`|label|外へ出る|（未提案・レビュー待ち）|inventory_only|
|975|ui_label|`map.js:10414`|label|地下2階へ下りる|（未提案・レビュー待ち）|inventory_only|
|976|ui_label|`map.js:10451`|label|地下2階・水門|（未提案・レビュー待ち）|inventory_only|
|977|ui_label|`map.js:10487`|label|地下1階へ上がる|（未提案・レビュー待ち）|inventory_only|
|978|ui_label|`map.js:10495`|label|地下3階へ下りる|（未提案・レビュー待ち）|inventory_only|
|979|ui_label|`map.js:10546`|label|地下3階・祈祷の間|（未提案・レビュー待ち）|inventory_only|
|980|ui_lockedText|`map.js:10598`|lockedText|水のプリズムは、まだこちらの声に応えない。|（未提案・レビュー待ち）|inventory_only|
|981|ui_label|`map.js:10601`|label|水のプリズムに呼びかける|（未提案・レビュー待ち）|inventory_only|
|982|ui_label|`map.js:10611`|label|地下2階へ上がる|（未提案・レビュー待ち）|inventory_only|
|983|ui_label|`map.js:10619`|label|地下4階へ下りる|（未提案・レビュー待ち）|inventory_only|
|984|ui_label|`map.js:10649`|label|地下4階・潮環回廊|（未提案・レビュー待ち）|inventory_only|
|985|ui_label|`map.js:10703`|label|地下3階へ上がる|（未提案・レビュー待ち）|inventory_only|
|986|ui_label|`map.js:10711`|label|地下5階へ下りる|（未提案・レビュー待ち）|inventory_only|
|987|ui_message|`map.js:10746`|message|逆潮に押し流された。|（未提案・レビュー待ち）|inventory_only|
|988|ui_message|`map.js:10754`|message|渦潮が反対側の水路へ運んだ。|（未提案・レビュー待ち）|inventory_only|
|989|ui_message|`map.js:10762`|message|水鏡が戻り道を映した。|（未提案・レビュー待ち）|inventory_only|
|990|ui_message|`map.js:10778`|message|逆潮の番人が迫る！|（未提案・レビュー待ち）|inventory_only|
|991|ui_label|`map.js:10813`|label|西の水門を下ろす|（未提案・レビュー待ち）|inventory_only|
|992|ui_log|`map.js:10843`|log|西の水門が低い音を立てた。|（未提案・レビュー待ち）|inventory_only|
|993|ui_label|`map.js:10850`|label|東の水門を下ろす|（未提案・レビュー待ち）|inventory_only|
|994|ui_log|`map.js:10880`|log|東の水門が閉じ、潮の唸りが変わった。|（未提案・レビュー待ち）|inventory_only|
|995|ui_label|`map.js:10891`|label|地下5階・逆潮祭壇|（未提案・レビュー待ち）|inventory_only|
|996|ui_label|`map.js:10944`|label|地下4階へ上がる|（未提案・レビュー待ち）|inventory_only|
|997|ui_message|`map.js:10971`|message|祭壇の逆潮に引かれた。|（未提案・レビュー待ち）|inventory_only|
|998|ui_message|`map.js:10987`|message|祭壇守が水を割って迫る！|（未提案・レビュー待ち）|inventory_only|
|999|ui_label|`map.js:11025`|label|1階・潮風の塔道|（未提案・レビュー待ち）|inventory_only|
|1000|ui_label|`map.js:11060`|label|外に出る|（未提案・レビュー待ち）|inventory_only|
|1001|ui_label|`map.js:11068`|label|2階へ|（未提案・レビュー待ち）|inventory_only|
|1002|ui_label|`map.js:11149`|label|船着き場から海底火山へ向かう|（未提案・レビュー待ち）|inventory_only|
|1003|ui_log|`map.js:11150`|log|ゼリードが示した海底火山への航路を確認する。|（未提案・レビュー待ち）|inventory_only|
|1004|ui_label|`map.js:11166`|label|2階・螺旋階段|（未提案・レビュー待ち）|inventory_only|
|1005|ui_label|`map.js:11206`|label|1階へ戻る|（未提案・レビュー待ち）|inventory_only|
|1006|ui_label|`map.js:11214`|label|3階へ|（未提案・レビュー待ち）|inventory_only|
|1007|ui_label|`map.js:11239`|label|3階・灯火回廊|（未提案・レビュー待ち）|inventory_only|
|1008|ui_label|`map.js:11279`|label|2階へ戻る|（未提案・レビュー待ち）|inventory_only|
|1009|ui_label|`map.js:11287`|label|4階へ|（未提案・レビュー待ち）|inventory_only|
|1010|ui_label|`map.js:11312`|label|4階・結界炉|（未提案・レビュー待ち）|inventory_only|
|1011|ui_label|`map.js:11352`|label|3階へ戻る|（未提案・レビュー待ち）|inventory_only|
|1012|ui_label|`map.js:11360`|label|5階へ|（未提案・レビュー待ち）|inventory_only|
|1013|ui_label|`map.js:11407`|label|5階・風鳴りの壁|（未提案・レビュー待ち）|inventory_only|
|1014|ui_label|`map.js:11447`|label|4階へ戻る|（未提案・レビュー待ち）|inventory_only|
|1015|ui_label|`map.js:11455`|label|6階へ|（未提案・レビュー待ち）|inventory_only|
|1016|ui_label|`map.js:11466`|label|6階・古い守衛室|（未提案・レビュー待ち）|inventory_only|
|1017|ui_label|`map.js:11506`|label|5階へ戻る|（未提案・レビュー待ち）|inventory_only|
|1018|ui_label|`map.js:11514`|label|7階へ|（未提案・レビュー待ち）|inventory_only|
|1019|ui_label|`map.js:11539`|label|7階・灯台頂上|（未提案・レビュー待ち）|inventory_only|
|1020|ui_label|`map.js:11579`|label|6階へ戻る|（未提案・レビュー待ち）|inventory_only|
|1021|ui_label|`map.js:11637`|label|第1層・海底火道|（未提案・レビュー待ち）|inventory_only|
|1022|ui_label|`map.js:11656`|label|大灯台沖へ戻る|（未提案・レビュー待ち）|inventory_only|
|1023|ui_label|`map.js:11657`|label|第2層へ|（未提案・レビュー待ち）|inventory_only|
|1024|ui_label|`map.js:11662`|label|第2層・圧熱回廊|（未提案・レビュー待ち）|inventory_only|
|1025|ui_label|`map.js:11681`|label|第1層へ戻る|（未提案・レビュー待ち）|inventory_only|
|1026|ui_label|`map.js:11682`|label|第3層へ|（未提案・レビュー待ち）|inventory_only|
|1027|ui_label|`map.js:11687`|label|第3層・火脈深部|（未提案・レビュー待ち）|inventory_only|
|1028|ui_label|`map.js:11706`|label|第2層へ戻る|（未提案・レビュー待ち）|inventory_only|
|1029|ui_label|`map.js:11707`|label|研究区画へ|（未提案・レビュー待ち）|inventory_only|
|1030|ui_label|`map.js:11712`|label|研究区画|（未提案・レビュー待ち）|inventory_only|
|1031|ui_label|`map.js:11732`|label|研究記録を調べる|（未提案・レビュー待ち）|inventory_only|
|1032|ui_log|`map.js:11732`|log|火の力を長期間肉体へ馴染ませるための観測記録が残されている。海水圧と周囲の水属性を安全弁として利用していたようだ。|（未提案・レビュー待ち）|inventory_only|
|1033|ui_label|`map.js:11735`|label|第3層へ戻る|（未提案・レビュー待ち）|inventory_only|
|1034|ui_label|`map.js:11736`|label|最奥へ|（未提案・レビュー待ち）|inventory_only|
|1035|ui_label|`map.js:11741`|label|最奥・戦闘エリア|（未提案・レビュー待ち）|inventory_only|
|1036|ui_label|`map.js:11772`|label|研究区画へ戻る|（未提案・レビュー待ち）|inventory_only|
|1037|ui_label|`map.js:11800`|label|1階・双門外郭|（未提案・レビュー待ち）|inventory_only|
|1038|ui_label|`map.js:11842`|label|西門から外に出る|（未提案・レビュー待ち）|inventory_only|
|1039|ui_log|`map.js:11843`|log|西門の向こうに、川沿いの岸辺が見える。|（未提案・レビュー待ち）|inventory_only|
|1040|ui_label|`map.js:11854`|label|東門から外に出る|（未提案・レビュー待ち）|inventory_only|
|1041|ui_log|`map.js:11855`|log|門の向こうに、うっすらと光の神殿が見える。|（未提案・レビュー待ち）|inventory_only|
|1042|ui_label|`map.js:11871`|label|2階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1043|ui_log|`map.js:12455`|log|冒険者ギルドの受付カウンターだ。|（未提案・レビュー待ち）|inventory_only|
|1044|ui_log|`map.js:12462`|log|冒険者ギルドの受付カウンターだ。|（未提案・レビュー待ち）|inventory_only|
|1045|ui_log|`map.js:12469`|log|冒険者ギルドの受付カウンターだ。|（未提案・レビュー待ち）|inventory_only|
|1046|ui_log|`map.js:12479`|log|冒険者ギルドの受付カウンターだ。|（未提案・レビュー待ち）|inventory_only|
|1047|ui_log|`map.js:12486`|log|冒険者ギルドの受付カウンターだ。|（未提案・レビュー待ち）|inventory_only|
|1048|ui_log|`map.js:12493`|log|冒険者ギルドの受付カウンターだ。|（未提案・レビュー待ち）|inventory_only|
|1049|ui_log|`map.js:12500`|log|依頼掲示板が置かれている。|（未提案・レビュー待ち）|inventory_only|
|1050|ui_log|`map.js:12507`|log|依頼掲示板が置かれている。|（未提案・レビュー待ち）|inventory_only|
|1051|ui_log|`map.js:12514`|log|依頼掲示板が置かれている。|（未提案・レビュー待ち）|inventory_only|
|1052|ui_log|`map.js:12521`|log|簡素な寝台が並んでいる。|（未提案・レビュー待ち）|inventory_only|
|1053|ui_log|`map.js:12528`|log|簡素な寝台が並んでいる。|（未提案・レビュー待ち）|inventory_only|
|1054|ui_log|`map.js:12538`|log|要塞の宿泊所に備えられた寝台だ。|（未提案・レビュー待ち）|inventory_only|
|1055|ui_log|`map.js:12548`|log|要塞の宿泊所に備えられた寝台だ。|（未提案・レビュー待ち）|inventory_only|
|1056|ui_log|`map.js:12555`|log|簡素な寝台が並んでいる。|（未提案・レビュー待ち）|inventory_only|
|1057|ui_log|`map.js:12562`|log|簡素な寝台が並んでいる。|（未提案・レビュー待ち）|inventory_only|
|1058|ui_log|`map.js:12572`|log|要塞の宿泊所に備えられた寝台だ。|（未提案・レビュー待ち）|inventory_only|
|1059|ui_log|`map.js:12582`|log|要塞の宿泊所に備えられた寝台だ。|（未提案・レビュー待ち）|inventory_only|
|1060|ui_label|`map.js:12587`|label|2階・暴走機関室|（未提案・レビュー待ち）|inventory_only|
|1061|ui_label|`map.js:12631`|label|1階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1062|ui_label|`map.js:12639`|label|3階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1063|ui_label|`map.js:12676`|label|3階・雷鎧の防衛線|（未提案・レビュー待ち）|inventory_only|
|1064|ui_label|`map.js:12720`|label|2階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1065|ui_label|`map.js:12728`|label|4階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1066|ui_label|`map.js:12764`|label|4階・雷の中枢|（未提案・レビュー待ち）|inventory_only|
|1067|ui_label|`map.js:12808`|label|3階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1068|ui_label|`map.js:12816`|label|5階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1069|ui_lockedText|`map.js:12888`|lockedText|雷のプリズムは、まだこちらの声に応えない。|（未提案・レビュー待ち）|inventory_only|
|1070|ui_label|`map.js:12891`|label|雷のプリズムに呼びかける|（未提案・レビュー待ち）|inventory_only|
|1071|ui_label|`map.js:12896`|label|5階・双電路|（未提案・レビュー待ち）|inventory_only|
|1072|ui_label|`map.js:12956`|label|4階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1073|ui_label|`map.js:12964`|label|6階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1074|ui_message|`map.js:12974`|message|雷流に弾かれた。|（未提案・レビュー待ち）|inventory_only|
|1075|ui_message|`map.js:12982`|message|雷流が反転した。|（未提案・レビュー待ち）|inventory_only|
|1076|ui_message|`map.js:12998`|message|雷鎧の強敵が迫る！|（未提案・レビュー待ち）|inventory_only|
|1077|ui_label|`map.js:13020`|label|左の雷導スイッチを押す|（未提案・レビュー待ち）|inventory_only|
|1078|ui_log|`map.js:13050`|log|左の雷導スイッチに手を置いた。|（未提案・レビュー待ち）|inventory_only|
|1079|ui_label|`map.js:13057`|label|東の雷導スイッチを押す|（未提案・レビュー待ち）|inventory_only|
|1080|ui_log|`map.js:13087`|log|右の雷導スイッチに手を置いた。|（未提案・レビュー待ち）|inventory_only|
|1081|ui_label|`map.js:13100`|label|6階・制御核区|（未提案・レビュー待ち）|inventory_only|
|1082|ui_label|`map.js:13159`|label|5階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1083|ui_message|`map.js:13177`|message|制御核の守衛が迫る！|（未提案・レビュー待ち）|inventory_only|
|1084|ui_label|`map.js:13250`|label|1階・白光の回廊|（未提案・レビュー待ち）|inventory_only|
|1085|ui_label|`map.js:13291`|label|外に出る|（未提案・レビュー待ち）|inventory_only|
|1086|ui_label|`map.js:13299`|label|2階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1087|ui_label|`map.js:13307`|label|地下牢へ下りる|（未提案・レビュー待ち）|inventory_only|
|1088|ui_label|`map.js:13313`|label|外に出る|（未提案・レビュー待ち）|inventory_only|
|1089|ui_label|`map.js:13319`|label|外に出る|（未提案・レビュー待ち）|inventory_only|
|1090|ui_label|`map.js:13470`|label|2階・祝福の水盤|（未提案・レビュー待ち）|inventory_only|
|1091|ui_label|`map.js:13516`|label|1階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1092|ui_label|`map.js:13524`|label|3階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1093|ui_label|`map.js:13550`|label|3階・結界の聖廊|（未提案・レビュー待ち）|inventory_only|
|1094|ui_label|`map.js:13596`|label|2階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1095|ui_label|`map.js:13604`|label|4階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1096|ui_label|`map.js:13639`|label|4階・光の祭壇|（未提案・レビュー待ち）|inventory_only|
|1097|ui_label|`map.js:13685`|label|3階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1098|ui_label|`map.js:13759`|label|祭壇の奥を確認する|（未提案・レビュー待ち）|inventory_only|
|1099|ui_lockedText|`map.js:13765`|lockedText|光のプリズムは、まだこちらの声に応えない。|（未提案・レビュー待ち）|inventory_only|
|1100|ui_label|`map.js:13768`|label|光のプリズムに呼びかける|（未提案・レビュー待ち）|inventory_only|
|1101|ui_label|`map.js:13773`|label|地下牢|（未提案・レビュー待ち）|inventory_only|
|1102|ui_label|`map.js:13805`|label|1階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1103|ui_label|`map.js:14128`|label|聖女の部屋・回想|（未提案・レビュー待ち）|inventory_only|
|1104|ui_label|`map.js:14149`|label|聖女の部屋を出る|（未提案・レビュー待ち）|inventory_only|
|1105|ui_label|`map.js:14193`|label|1階・入口側 黒岩の胎道|（未提案・レビュー待ち）|inventory_only|
|1106|ui_label|`map.js:14239`|label|入口側へ戻る|（未提案・レビュー待ち）|inventory_only|
|1107|ui_label|`map.js:14252`|label|偽りの無限回廊へ|（未提案・レビュー待ち）|inventory_only|
|1108|ui_message|`map.js:14270`|message|黒岩の隙間から、侵食に追われた魔物が飛び出した！|（未提案・レビュー待ち）|inventory_only|
|1109|ui_message|`map.js:14278`|message|脆い横穴が崩れ、少し手前へ押し戻された。|（未提案・レビュー待ち）|inventory_only|
|1110|ui_label|`map.js:14375`|label|2階・偽りの無限回廊|（未提案・レビュー待ち）|inventory_only|
|1111|ui_label|`map.js:14423`|label|黒岩の胎道へ戻る|（未提案・レビュー待ち）|inventory_only|
|1112|ui_label|`map.js:14431`|label|溶岩の地底湖へ|（未提案・レビュー待ち）|inventory_only|
|1113|ui_message|`map.js:14441`|message|同じ石柱の前へ戻された。|（未提案・レビュー待ち）|inventory_only|
|1114|ui_message|`map.js:14449`|message|道が不安定に変化した・・・|（未提案・レビュー待ち）|inventory_only|
|1115|ui_message|`map.js:14457`|message|一歩進んだはずが、また最初の柱を見上げている。|（未提案・レビュー待ち）|inventory_only|
|1116|ui_message|`map.js:14465`|message|闇の風に巻かれ、どこかへ移動した。|（未提案・レビュー待ち）|inventory_only|
|1117|ui_message|`map.js:14473`|message|外周を回りきったはずの道が、また入口側へつながっていた。|（未提案・レビュー待ち）|inventory_only|
|1118|ui_message|`map.js:14481`|message|内側の回廊に吸い込まれた。|（未提案・レビュー待ち）|inventory_only|
|1119|ui_message|`map.js:14489`|message|どこかに移動したようだ…|（未提案・レビュー待ち）|inventory_only|
|1120|ui_message|`map.js:14497`|message|輪の中心から、始まりの横穴へ放り出された。|（未提案・レビュー待ち）|inventory_only|
|1121|ui_label|`map.js:14549`|label|古びた石碑を読む|（未提案・レビュー待ち）|inventory_only|
|1122|ui_label|`map.js:14559`|label|煤けた足跡を調べる|（未提案・レビュー待ち）|inventory_only|
|1123|ui_label|`map.js:14569`|label|壁の刻み傷を調べる|（未提案・レビュー待ち）|inventory_only|
|1124|ui_label|`map.js:14587`|label|3階・溶岩の地底湖|（未提案・レビュー待ち）|inventory_only|
|1125|ui_label|`map.js:14635`|label|偽りの無限回廊へ戻る|（未提案・レビュー待ち）|inventory_only|
|1126|ui_label|`map.js:14643`|label|氷晶の十字滑床へ|（未提案・レビュー待ち）|inventory_only|
|1127|ui_message|`map.js:14661`|message|溶岩霧の向こうから、侵食に濁った魔物が這い出した！|（未提案・レビュー待ち）|inventory_only|
|1128|ui_label|`map.js:14792`|label|4階・氷晶の十字滑床|（未提案・レビュー待ち）|inventory_only|
|1129|ui_label|`map.js:14840`|label|溶岩の地底湖へ戻る|（未提案・レビュー待ち）|inventory_only|
|1130|ui_label|`map.js:14848`|label|深淵防衛補給路へ|（未提案・レビュー待ち）|inventory_only|
|1131|ui_message|`map.js:15053`|message|氷晶の床に足を取られ、止まるまで滑った！|（未提案・レビュー待ち）|inventory_only|
|1132|ui_message|`map.js:15069`|message|氷壁の裂け目から、侵食獣が滑るように迫ってきた！|（未提案・レビュー待ち）|inventory_only|
|1133|ui_label|`map.js:15132`|label|氷漬けの荷物を調べる|（未提案・レビュー待ち）|inventory_only|
|1134|ui_label|`map.js:15142`|label|氷の下の術式を調べる|（未提案・レビュー待ち）|inventory_only|
|1135|ui_label|`map.js:15158`|label|5階・深淵防衛補給路|（未提案・レビュー待ち）|inventory_only|
|1136|ui_label|`map.js:15206`|label|氷晶の十字滑床へ戻る|（未提案・レビュー待ち）|inventory_only|
|1137|ui_label|`map.js:15214`|label|祭壇側の白骨旧坑へ|（未提案・レビュー待ち）|inventory_only|
|1138|ui_message|`map.js:15232`|message|崩れた補給路から、深淵側の魔物がなだれ込んできた！|（未提案・レビュー待ち）|inventory_only|
|1139|ui_label|`map.js:15284`|label|防衛軍の積荷を調べる|（未提案・レビュー待ち）|inventory_only|
|1140|ui_label|`map.js:15294`|label|補給箱の刻印を調べる|（未提案・レビュー待ち）|inventory_only|
|1141|ui_label|`map.js:15312`|label|6階・祭壇側 白骨の旧坑|（未提案・レビュー待ち）|inventory_only|
|1142|ui_label|`map.js:15360`|label|深淵防衛補給路へ戻る|（未提案・レビュー待ち）|inventory_only|
|1143|ui_label|`map.js:15366`|label|祭壇側へ出る|（未提案・レビュー待ち）|inventory_only|
|1144|ui_message|`map.js:15391`|message|最終防衛線を越えた魔物が、祭壇側から迫ってきた！|（未提案・レビュー待ち）|inventory_only|
|1145|ui_label|`map.js:15459`|label|最後の封鎖杭を調べる|（未提案・レビュー待ち）|inventory_only|
|1146|ui_label|`map.js:15469`|label|新しい足跡を調べる|（未提案・レビュー待ち）|inventory_only|
|1147|ui_label|`map.js:15510`|label|本館1階・中央広間|（未提案・レビュー待ち）|inventory_only|
|1148|ui_log|`map.js:15562`|log|重厚な燭台が道を塞いでいる。|（未提案・レビュー待ち）|inventory_only|
|1149|ui_log|`map.js:15570`|log|重厚な燭台が道を塞いでいる。|（未提案・レビュー待ち）|inventory_only|
|1150|ui_label|`map.js:15578`|label|外に出る|（未提案・レビュー待ち）|inventory_only|
|1151|ui_label|`map.js:15586`|label|西館2階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1152|ui_label|`map.js:15594`|label|東館2階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1153|ui_label|`map.js:15602`|label|本館2階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1154|ui_label|`map.js:15654`|label|兵士たちの会話を聞く|（未提案・レビュー待ち）|inventory_only|
|1155|ui_label|`map.js:15655`|label|防衛設備を調べる|（未提案・レビュー待ち）|inventory_only|
|1156|ui_label|`map.js:15656`|label|補修痕を調べる|（未提案・レビュー待ち）|inventory_only|
|1157|ui_label|`map.js:15666`|label|西館2階・黒影廊|（未提案・レビュー待ち）|inventory_only|
|1158|ui_label|`map.js:15712`|label|本館1階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1159|ui_label|`map.js:15720`|label|西館3階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1160|ui_message|`map.js:15745`|message|黒鏡の回廊が左右を入れ替えた。|（未提案・レビュー待ち）|inventory_only|
|1161|ui_message|`map.js:15753`|message|黒鏡が元の廊下へ返した。|（未提案・レビュー待ち）|inventory_only|
|1162|ui_message|`map.js:15769`|message|西館の巡察兵が迫る！|（未提案・レビュー待ち）|inventory_only|
|1163|ui_label|`map.js:15781`|label|西館3階・結界の間|（未提案・レビュー待ち）|inventory_only|
|1164|ui_label|`map.js:15827`|label|西館2階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1165|ui_label|`map.js:15864`|label|東館2階・風哭廊|（未提案・レビュー待ち）|inventory_only|
|1166|ui_label|`map.js:15910`|label|本館1階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1167|ui_label|`map.js:15918`|label|東館3階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1168|ui_message|`map.js:15943`|message|風哭の門が東西を反転した。|（未提案・レビュー待ち）|inventory_only|
|1169|ui_message|`map.js:15951`|message|風哭の門が閉じた。|（未提案・レビュー待ち）|inventory_only|
|1170|ui_message|`map.js:15967`|message|東館の追跡者が迫る！|（未提案・レビュー待ち）|inventory_only|
|1171|ui_label|`map.js:15979`|label|東館3階・結界の間|（未提案・レビュー待ち）|inventory_only|
|1172|ui_label|`map.js:16025`|label|東館2階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1173|ui_label|`map.js:16062`|label|本館2階・夢幻回廊|（未提案・レビュー待ち）|inventory_only|
|1174|ui_label|`map.js:16108`|label|本館1階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1175|ui_label|`map.js:16116`|label|本館3階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1176|ui_message|`map.js:16141`|message|夢幻回廊が景色を裏返した。|（未提案・レビュー待ち）|inventory_only|
|1177|ui_message|`map.js:16149`|message|夢の継ぎ目から戻った。|（未提案・レビュー待ち）|inventory_only|
|1178|ui_message|`map.js:16165`|message|夢幻の番人が迫る！|（未提案・レビュー待ち）|inventory_only|
|1179|ui_label|`map.js:16187`|label|本館3階・謁見の間|（未提案・レビュー待ち）|inventory_only|
|1180|ui_label|`map.js:16233`|label|本館2階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1181|ui_label|`map.js:16270`|label|ゼノンと話す|（未提案・レビュー待ち）|inventory_only|
|1182|ui_label|`map.js:16279`|label|玉座の間を見渡す|（未提案・レビュー待ち）|inventory_only|
|1183|ui_log|`map.js:16280`|log|滅びた玉座の前で、赤い空だけが静かに揺れている。|（未提案・レビュー待ち）|inventory_only|
|1184|ui_lockedText|`map.js:16288`|lockedText|闇のプリズムは、まだこちらの声に応えない。|（未提案・レビュー待ち）|inventory_only|
|1185|ui_label|`map.js:16291`|label|闇のプリズムに呼びかける|（未提案・レビュー待ち）|inventory_only|
|1186|ui_label|`map.js:16352`|label|風鳴りの洞|（未提案・レビュー待ち）|inventory_only|
|1187|ui_label|`map.js:16384`|label|外へ出る|（未提案・レビュー待ち）|inventory_only|
|1188|ui_label|`map.js:16392`|label|泉の奥へ|（未提案・レビュー待ち）|inventory_only|
|1189|ui_message|`map.js:16402`|message|風穴の渦に運ばれた。|（未提案・レビュー待ち）|inventory_only|
|1190|ui_message|`map.js:16410`|message|風穴の渦が巻き戻った。|（未提案・レビュー待ち）|inventory_only|
|1191|ui_message|`map.js:16426`|message|黒風の魔物が迫る！|（未提案・レビュー待ち）|inventory_only|
|1192|ui_label|`map.js:16448`|label|風の通り道を聞く|（未提案・レビュー待ち）|inventory_only|
|1193|ui_log|`map.js:16449`|log|洞の奥へ、低く澄んだ風の音が吸い込まれていく。|（未提案・レビュー待ち）|inventory_only|
|1194|ui_label|`map.js:16463`|label|妖精の泉|（未提案・レビュー待ち）|inventory_only|
|1195|ui_label|`map.js:16497`|label|入口へ戻る|（未提案・レビュー待ち）|inventory_only|
|1196|ui_message|`map.js:16507`|message|妖精風が泉の反対岸へ運んだ。|（未提案・レビュー待ち）|inventory_only|
|1197|ui_message|`map.js:16515`|message|妖精風が泉を巡った。|（未提案・レビュー待ち）|inventory_only|
|1198|ui_label|`map.js:16573`|label|地下1階・蒼滴の道|（未提案・レビュー待ち）|inventory_only|
|1199|ui_label|`map.js:16607`|label|外へ出る|（未提案・レビュー待ち）|inventory_only|
|1200|ui_label|`map.js:16615`|label|地下2階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1201|ui_message|`map.js:16625`|message|結晶光が鍾乳洞の反対側へ運んだ。|（未提案・レビュー待ち）|inventory_only|
|1202|ui_message|`map.js:16633`|message|結晶光が元の足場へ引き戻した。|（未提案・レビュー待ち）|inventory_only|
|1203|ui_message|`map.js:16649`|message|爪痕の主が襲いかかる！|（未提案・レビュー待ち）|inventory_only|
|1204|ui_label|`map.js:16704`|label|地下2階・青の結晶の間|（未提案・レビュー待ち）|inventory_only|
|1205|ui_label|`map.js:16740`|label|地下1階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1206|ui_label|`map.js:16748`|label|地下3階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1207|ui_message|`map.js:16761`|message|結晶光が空間を曲げた。|（未提案・レビュー待ち）|inventory_only|
|1208|ui_message|`map.js:16769`|message|結晶光が戻り道を開いた。|（未提案・レビュー待ち）|inventory_only|
|1209|ui_label|`map.js:16833`|label|地下3階・結晶裏路|（未提案・レビュー待ち）|inventory_only|
|1210|ui_label|`map.js:16890`|label|地下2階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1211|ui_label|`map.js:16898`|label|地下4階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1212|ui_message|`map.js:16919`|message|結界毒が体を蝕む！|（未提案・レビュー待ち）|inventory_only|
|1213|ui_message|`map.js:16948`|message|結界の膜を滑った。|（未提案・レビュー待ち）|inventory_only|
|1214|ui_message|`map.js:16964`|message|結界守が迫る！|（未提案・レビュー待ち）|inventory_only|
|1215|ui_label|`map.js:16987`|label|上層小部屋の封晶を砕く|（未提案・レビュー待ち）|inventory_only|
|1216|ui_log|`map.js:17010`|log|封晶のひとつにヒビが入った。|（未提案・レビュー待ち）|inventory_only|
|1217|ui_label|`map.js:17017`|label|南東の封晶を砕く|（未提案・レビュー待ち）|inventory_only|
|1218|ui_log|`map.js:17040`|log|封晶のひとつを砕いた。|（未提案・レビュー待ち）|inventory_only|
|1219|ui_label|`map.js:17053`|label|地下4階・結界核|（未提案・レビュー待ち）|inventory_only|
|1220|ui_label|`map.js:17110`|label|地下3階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1221|ui_message|`map.js:17125`|message|結界核の毒光が肌を焼く！|（未提案・レビュー待ち）|inventory_only|
|1222|ui_message|`map.js:17141`|message|結界核の守り手が迫る！|（未提案・レビュー待ち）|inventory_only|
|1223|ui_label|`map.js:17204`|label|1階・影残る拝廊|（未提案・レビュー待ち）|inventory_only|
|1224|ui_label|`map.js:17241`|label|外へ出る|（未提案・レビュー待ち）|inventory_only|
|1225|ui_label|`map.js:17249`|label|2階へ上がる|（未提案・レビュー待ち）|inventory_only|
|1226|ui_message|`map.js:17258`|message|闇の霧が命を削る！|（未提案・レビュー待ち）|inventory_only|
|1227|ui_message|`map.js:17266`|message|影の門に呑まれた。|（未提案・レビュー待ち）|inventory_only|
|1228|ui_message|`map.js:17274`|message|影の門が開いた。|（未提案・レビュー待ち）|inventory_only|
|1229|ui_message|`map.js:17290`|message|神殿の影が追ってくる！|（未提案・レビュー待ち）|inventory_only|
|1230|ui_label|`map.js:17374`|label|2階・月影の祭壇|（未提案・レビュー待ち）|inventory_only|
|1231|ui_label|`map.js:17418`|label|1階へ下りる|（未提案・レビュー待ち）|inventory_only|
|1232|ui_message|`map.js:17427`|message|月光の床を滑った。|（未提案・レビュー待ち）|inventory_only|
|1233|ui_message|`map.js:17434`|message|月影の闇が染み込む！|（未提案・レビュー待ち）|inventory_only|
|1234|ui_message|`map.js:17442`|message|月影が左右を反転させた。|（未提案・レビュー待ち）|inventory_only|
|1235|ui_message|`map.js:17450`|message|月影が元の祭廊へ返した。|（未提案・レビュー待ち）|inventory_only|
|1236|ui_label|`map.js:17544`|label|禁則回廊|（未提案・レビュー待ち）|inventory_only|
|1237|ui_label|`map.js:17580`|label|外へ出る|（未提案・レビュー待ち）|inventory_only|
|1238|ui_label|`map.js:17588`|label|禁奥へ|（未提案・レビュー待ち）|inventory_only|
|1239|ui_message|`map.js:17598`|message|禁則式が座標を奪った。|（未提案・レビュー待ち）|inventory_only|
|1240|ui_message|`map.js:17606`|message|禁則式が反転した。|（未提案・レビュー待ち）|inventory_only|
|1241|ui_message|`map.js:17622`|message|禁則の番人が迫る！|（未提案・レビュー待ち）|inventory_only|
|1242|ui_label|`map.js:17696`|label|禁奥の核|（未提案・レビュー待ち）|inventory_only|
|1243|ui_label|`map.js:17736`|label|回廊へ戻る|（未提案・レビュー待ち）|inventory_only|
|1244|ui_label|`map.js:17744`|label|零式禁則層へ|（未提案・レビュー待ち）|inventory_only|
|1245|ui_message|`map.js:17757`|message|術式が進行方向を反転した。|（未提案・レビュー待ち）|inventory_only|
|1246|ui_message|`map.js:17765`|message|術式が再び反転した。|（未提案・レビュー待ち）|inventory_only|
|1247|ui_label|`map.js:17801`|label|禁奥の脈動を読む|（未提案・レビュー待ち）|inventory_only|
|1248|ui_log|`map.js:17802`|log|床下で、研究棟の心臓のような魔力が脈打っている。|（未提案・レビュー待ち）|inventory_only|
|1249|ui_label|`map.js:17815`|label|零式禁則層|（未提案・レビュー待ち）|inventory_only|
|1250|ui_label|`map.js:17857`|label|禁奥の核へ戻る|（未提案・レビュー待ち）|inventory_only|
|1251|ui_message|`map.js:17867`|message|零式術式が左右を入れ替えた。|（未提案・レビュー待ち）|inventory_only|
|1252|ui_message|`map.js:17875`|message|零式術式が再反転した。|（未提案・レビュー待ち）|inventory_only|
|1253|ui_message|`map.js:17891`|message|零式執行者が二歩ずつ迫る！|（未提案・レビュー待ち）|inventory_only|
|1254|ui_confirm|`menus.js:65`|confirm|（広告再生のテスト）動画を最後まで視聴したことにしますか？|（未提案・レビュー待ち）|inventory_only|
|1255|ui_html_text|`menus.js:339`|html/template text|攻:${stats.atk}|（未提案・レビュー待ち）|inventory_only|
|1256|ui_html_text|`menus.js:340`|html/template text|魔:${stats.mag}|（未提案・レビュー待ち）|inventory_only|
|1257|ui_html_text|`menus.js:341`|html/template text|速:${stats.spd}|（未提案・レビュー待ち）|inventory_only|
|1258|ui_html_text|`menus.js:342`|html/template text|防:${stats.def}|（未提案・レビュー待ち）|inventory_only|
|1259|ui_html_text|`menus.js:343`|html/template text|魔防:${stats.mdef}|（未提案・レビュー待ち）|inventory_only|
|1260|ui_html_text|`menus.js:413`|html/template text|未開放|（未提案・レビュー待ち）|inventory_only|
|1261|ui_html_text|`menus.js:483`|html/template text|パーティ編成|（未提案・レビュー待ち）|inventory_only|
|1262|ui_html_text|`menus.js:484`|html/template text|ステータス|（未提案・レビュー待ち）|inventory_only|
|1263|ui_html_text|`menus.js:486`|html/template text|所持装備|（未提案・レビュー待ち）|inventory_only|
|1264|ui_html_text|`menus.js:487`|html/template text|所持道具|（未提案・レビュー待ち）|inventory_only|
|1265|ui_html_text|`menus.js:489`|html/template text|お知らせ${hasUnclaimedDaily ? badge : ''}|（未提案・レビュー待ち）|inventory_only|
|1266|ui_html_text|`menus.js:490`|html/template text|スキル|（未提案・レビュー待ち）|inventory_only|
|1267|ui_html_text|`menus.js:492`|html/template text|実績${hasUnclaimedAchievement ? badge : ''}|（未提案・レビュー待ち）|inventory_only|
|1268|ui_html_text|`menus.js:495`|html/template text|戦歴|（未提案・レビュー待ち）|inventory_only|
|1269|ui_html_text|`menus.js:498`|html/template text|魔物図鑑|（未提案・レビュー待ち）|inventory_only|
|1270|ui_html_text|`menus.js:499`|html/template text|設定|（未提案・レビュー待ち）|inventory_only|
|1271|ui_html_text|`menus.js:501`|html/template text|タイトルへ|（未提案・レビュー待ち）|inventory_only|
|1272|ui_html_text|`menus.js:502`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|1273|ui_html_text|`menus.js:803`|html/template text|[習得:${skillNames.join(', ')}]|（未提案・レビュー待ち）|inventory_only|
|1274|ui_html_text|`menus.js:831`|html/template text|特性: ${traitList.join('・')}|（未提案・レビュー待ち）|inventory_only|
|1275|ui_dom_innerText|`menus.js:917`|innerText|はい|（未提案・レビュー待ち）|inventory_only|
|1276|ui_dom_innerText|`menus.js:924`|innerText|いいえ|（未提案・レビュー待ち）|inventory_only|
|1277|ui_dom_innerText|`menus.js:976`|innerText|やめる|（未提案・レビュー待ち）|inventory_only|
|1278|ui_html_text|`menus_achievements.js:55`|html/template text|🏆 実績|（未提案・レビュー待ち）|inventory_only|
|1279|ui_html_text|`menus_achievements.js:56`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|1280|ui_html_text|`menus_achievements.js:116`|html/template text|🏆 実績|（未提案・レビュー待ち）|inventory_only|
|1281|ui_html_text|`menus_achievements.js:117`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|1282|ui_html_text|`menus_achievements.js:124`|html/template text|達成率|（未提案・レビュー待ち）|inventory_only|
|1283|ui_html_text|`menus_achievements.js:128`|html/template text|達成|（未提案・レビュー待ち）|inventory_only|
|1284|ui_html_text|`menus_achievements.js:132`|html/template text|未受取|（未提案・レビュー待ち）|inventory_only|
|1285|ui_html_text|`menus_achievements.js:136`|html/template text|未達成|（未提案・レビュー待ち）|inventory_only|
|1286|ui_html_text|`menus_achievements.js:140`|html/template text|表示中|（未提案・レビュー待ち）|inventory_only|
|1287|ui_html_text|`menus_achievements.js:165`|html/template text|カテゴリ|（未提案・レビュー待ち）|inventory_only|
|1288|ui_html_text|`menus_achievements.js:198`|html/template text|進捗: ${progressLabel}|（未提案・レビュー待ち）|inventory_only|
|1289|ui_html_text|`menus_achievements.js:211`|html/template text|該当する実績はありません。|（未提案・レビュー待ち）|inventory_only|
|1290|ui_html_text|`menus_achievements.js:215`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|1291|ui_html_text|`menus_allies.js:200`|html/template text|🧑‍🤝‍🧑 仲間一覧|（未提案・レビュー待ち）|inventory_only|
|1292|ui_html_text|`menus_allies.js:201`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|1293|ui_html_text|`menus_allies.js:284`|html/template text|攻:${s.atk}|（未提案・レビュー待ち）|inventory_only|
|1294|ui_html_text|`menus_allies.js:284`|html/template text|魔:${s.mag}|（未提案・レビュー待ち）|inventory_only|
|1295|ui_html_text|`menus_allies.js:284`|html/template text|速:${s.spd}|（未提案・レビュー待ち）|inventory_only|
|1296|ui_html_text|`menus_allies.js:287`|html/template text|防:${s.def}|（未提案・レビュー待ち）|inventory_only|
|1297|ui_html_text|`menus_allies.js:287`|html/template text|魔防:${s.mdef}|（未提案・レビュー待ち）|inventory_only|
|1298|ui_html_text|`menus_allies.js:346`|html/template text|装備なし|（未提案・レビュー待ち）|inventory_only|
|1299|ui_html_text|`menus_allies.js:389`|html/template text|[習得:${skillNames.join(', ')}]|（未提案・レビュー待ち）|inventory_only|
|1300|ui_html_text|`menus_allies.js:594`|html/template text|発動中のシナジー効果|（未提案・レビュー待ち）|inventory_only|
|1301|ui_html_text|`menus_allies.js:603`|html/template text|ボーナスPt振分 (残:${freeAllocPt})|（未提案・レビュー待ち）|inventory_only|
|1302|ui_html_text|`menus_allies.js:604`|html/template text|スキル習得画面へ (SP:${c.sp\|\|0})|（未提案・レビュー待ち）|inventory_only|
|1303|ui_html_text|`menus_allies.js:605`|html/template text|キャラクター詳細を見る|（未提案・レビュー待ち）|inventory_only|
|1304|ui_html_text|`menus_allies.js:607`|html/template text|この仲間モンスターを逃がす|（未提案・レビュー待ち）|inventory_only|
|1305|ui_html_text|`menus_allies.js:631`|html/template text|与ダメージ|（未提案・レビュー待ち）|inventory_only|
|1306|ui_html_text|`menus_allies.js:634`|html/template text|被ダメージ|（未提案・レビュー待ち）|inventory_only|
|1307|ui_html_text|`menus_allies.js:639`|html/template text|属性攻撃|（未提案・レビュー待ち）|inventory_only|
|1308|ui_html_text|`menus_allies.js:645`|html/template text|属性耐性（環境込み）|（未提案・レビュー待ち）|inventory_only|
|1309|ui_html_text|`menus_allies.js:651`|html/template text|異常耐性|（未提案・レビュー待ち）|inventory_only|
|1310|ui_html_text|`menus_allies.js:738`|html/template text|やめる|（未提案・レビュー待ち）|inventory_only|
|1311|ui_html_text|`menus_allies.js:738`|html/template text|変更する|（未提案・レビュー待ち）|inventory_only|
|1312|ui_html_text|`menus_allies.js:739`|html/template text|装備変更の確認 (${MenuAllies.targetPart})|（未提案・レビュー待ち）|inventory_only|
|1313|ui_html_text|`menus_allies.js:740`|html/template text|(装備を外す)|（未提案・レビュー待ち）|inventory_only|
|1314|ui_html_text|`menus_allies.js:741`|html/template text|に変更しますか？|（未提案・レビュー待ち）|inventory_only|
|1315|ui_html_text|`menus_allies.js:815`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|1316|ui_html_text|`menus_allies.js:816`|html/template text|全ての効果|（未提案・レビュー待ち）|inventory_only|
|1317|ui_html_text|`menus_allies.js:817`|html/template text|Rank順|（未提案・レビュー待ち）|inventory_only|
|1318|ui_html_text|`menus_allies.js:817`|html/template text|取得順|（未提案・レビュー待ち）|inventory_only|
|1319|ui_html_text|`menus_allies.js:818`|html/template text|[${item.owner}装備中]|（未提案・レビュー待ち）|inventory_only|
|1320|ui_html_text|`menus_allies.js:846`|html/template text|命中率:|（未提案・レビュー待ち）|inventory_only|
|1321|ui_html_text|`menus_allies.js:847`|html/template text|回避率:|（未提案・レビュー待ち）|inventory_only|
|1322|ui_html_text|`menus_allies.js:848`|html/template text|会心率:|（未提案・レビュー待ち）|inventory_only|
|1323|ui_html_text|`menus_allies.js:860`|html/template text|習得スキルなし|（未提案・レビュー待ち）|inventory_only|
|1324|ui_dom_title|`menus_allies.js:874`|title|オート戦闘でこの技を使用するか|（未提案・レビュー待ち）|inventory_only|
|1325|ui_html_text|`menus_allies.js:874`|html/template text|オート|（未提案・レビュー待ち）|inventory_only|
|1326|ui_dom_title|`menus_allies.js:875`|title|手動の戦闘・回復メニューに表示するか|（未提案・レビュー待ち）|inventory_only|
|1327|ui_html_text|`menus_allies.js:875`|html/template text|メニュー|（未提案・レビュー待ち）|inventory_only|
|1328|ui_html_text|`menus_allies.js:955`|html/template text|装備固定|（未提案・レビュー待ち）|inventory_only|
|1329|ui_html_text|`menus_allies.js:958`|html/template text|固定ON|（未提案・レビュー待ち）|inventory_only|
|1330|ui_html_text|`menus_allies.js:985`|html/template text|有効な特性がありません|（未提案・レビュー待ち）|inventory_only|
|1331|ui_html_text|`menus_allies.js:995`|html/template text|＜ 前|（未提案・レビュー待ち）|inventory_only|
|1332|ui_html_text|`menus_allies.js:996`|html/template text|仲間詳細|（未提案・レビュー待ち）|inventory_only|
|1333|ui_html_text|`menus_allies.js:997`|html/template text|次 ＞|（未提案・レビュー待ち）|inventory_only|
|1334|ui_html_text|`menus_allies.js:1005`|html/template text|画像操作|（未提案・レビュー待ち）|inventory_only|
|1335|ui_html_text|`menus_allies.js:1048`|html/template text|攻撃力|（未提案・レビュー待ち）|inventory_only|
|1336|ui_html_text|`menus_allies.js:1049`|html/template text|防御力|（未提案・レビュー待ち）|inventory_only|
|1337|ui_html_text|`menus_allies.js:1050`|html/template text|魔力|（未提案・レビュー待ち）|inventory_only|
|1338|ui_html_text|`menus_allies.js:1051`|html/template text|魔防|（未提案・レビュー待ち）|inventory_only|
|1339|ui_html_text|`menus_allies.js:1052`|html/template text|素早さ|（未提案・レビュー待ち）|inventory_only|
|1340|ui_html_text|`menus_allies.js:1209`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|1341|ui_html_text|`menus_allies.js:1255`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|1342|ui_html_text|`menus_allies.js:1261`|html/template text|全ての効果|（未提案・レビュー待ち）|inventory_only|
|1343|ui_html_text|`menus_allies.js:1265`|html/template text|Rank順|（未提案・レビュー待ち）|inventory_only|
|1344|ui_html_text|`menus_allies.js:1266`|html/template text|取得順|（未提案・レビュー待ち）|inventory_only|
|1345|ui_html_text|`menus_allies.js:1274`|html/template text|[${MenuAllies.escapeHtml(item.owner)}装備中]|（未提案・レビュー待ち）|inventory_only|
|1346|ui_html_text|`menus_allies.js:1282`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|1347|ui_html_text|`menus_allies.js:1348`|html/template text|装備変更の確認|（未提案・レビュー待ち）|inventory_only|
|1348|ui_html_text|`menus_allies.js:1351`|html/template text|戻る|（未提案・レビュー待ち）|inventory_only|
|1349|ui_html_text|`menus_allies.js:1355`|html/template text|(装備を外す)|（未提案・レビュー待ち）|inventory_only|
|1350|ui_html_text|`menus_allies.js:1364`|html/template text|やめる|（未提案・レビュー待ち）|inventory_only|
|1351|ui_html_text|`menus_allies.js:1365`|html/template text|変更する|（未提案・レビュー待ち）|inventory_only|
|1352|ui_html_text|`menus_allies.js:1518`|html/template text|画像操作|（未提案・レビュー待ち）|inventory_only|
|1353|ui_html_text|`menus_allies.js:1519`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|1354|ui_html_text|`menus_allies.js:1524`|html/template text|画像変更|（未提案・レビュー待ち）|inventory_only|
|1355|ui_html_text|`menus_allies.js:1525`|html/template text|画像加工|（未提案・レビュー待ち）|inventory_only|
|1356|ui_html_text|`menus_allies.js:1566`|html/template text|画像加工|（未提案・レビュー待ち）|inventory_only|
|1357|ui_html_text|`menus_allies.js:1567`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|1358|ui_html_text|`menus_allies.js:1569`|html/template text|正方形の範囲に合わせて、拡大率と位置を調整してください。|（未提案・レビュー待ち）|inventory_only|
|1359|ui_html_text|`menus_allies.js:1574`|html/template text|拡大率|（未提案・レビュー待ち）|inventory_only|
|1360|ui_html_text|`menus_allies.js:1575`|html/template text|横位置|（未提案・レビュー待ち）|inventory_only|
|1361|ui_html_text|`menus_allies.js:1576`|html/template text|縦位置|（未提案・レビュー待ち）|inventory_only|
|1362|ui_html_text|`menus_allies.js:1579`|html/template text|保存|（未提案・レビュー待ち）|inventory_only|
|1363|ui_html_text|`menus_allies.js:1580`|html/template text|キャンセル|（未提案・レビュー待ち）|inventory_only|
|1364|ui_confirm|`menus_allies.js:1819`|confirm|画像を初期状態に戻しますか？|（未提案・レビュー待ち）|inventory_only|
|1365|ui_html_text|`menus_allies.js:1849`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|1366|ui_html_text|`menus_allies.js:1918`|html/template text|次:|（未提案・レビュー待ち）|inventory_only|
|1367|ui_html_text|`menus_allies.js:1918`|html/template text|習得 SP:${cost}|（未提案・レビュー待ち）|inventory_only|
|1368|ui_confirm|`menus_allies.js:1931`|confirm|スキルポイントを初期化しますか？|（未提案・レビュー待ち）|inventory_only|
|1369|ui_html_text|`menus_allies.js:1946`|html/template text|能力値振分|（未提案・レビュー待ち）|inventory_only|
|1370|ui_html_text|`menus_allies.js:1946`|html/template text|残りポイント:|（未提案・レビュー待ち）|inventory_only|
|1371|ui_html_text|`menus_allies.js:1946`|html/template text|決定|（未提案・レビュー待ち）|inventory_only|
|1372|ui_html_text|`menus_allies.js:1946`|html/template text|キャンセル|（未提案・レビュー待ち）|inventory_only|
|1373|ui_label|`menus_ally_detail.js:69`|label|アーカイブ|（未提案・レビュー待ち）|inventory_only|
|1374|ui_label|`menus_ally_detail.js:70`|label|成長の記録|（未提案・レビュー待ち）|inventory_only|
|1375|ui_label|`menus_ally_detail.js:71`|label|限界突破|（未提案・レビュー待ち）|inventory_only|
|1376|ui_label|`menus_ally_detail.js:164`|label|初期|（未提案・レビュー待ち）|inventory_only|
|1377|ui_html_text|`menus_ally_detail.js:184`|html/template text|未解放の記録です|（未提案・レビュー待ち）|inventory_only|
|1378|ui_html_text|`menus_ally_detail.js:184`|html/template text|さらなる成長で紐解かれます|（未提案・レビュー待ち）|inventory_only|
|1379|ui_html_text|`menus_ally_detail.js:199`|html/template text|データが存在しません|（未提案・レビュー待ち）|inventory_only|
|1380|ui_html_text|`menus_ally_detail.js:201`|html/template text|解放される可能性の断片|（未提案・レビュー待ち）|inventory_only|
|1381|ui_html_text|`menus_ally_detail.js:279`|html/template text|内部 +${value}|（未提案・レビュー待ち）|inventory_only|
|1382|ui_html_text|`menus_ally_detail.js:325`|html/template text|現在値|（未提案・レビュー待ち）|inventory_only|
|1383|ui_html_text|`menus_ally_detail.js:336`|html/template text|反映待ち +${earned - current}：試練突破後に上限まで反映されます。|（未提案・レビュー待ち）|inventory_only|
|1384|ui_html_text|`menus_ally_detail.js:344`|html/template text|獲得状況|（未提案・レビュー待ち）|inventory_only|
|1385|ui_dom_innerText|`menus_book.js:63`|innerText|もどる|（未提案・レビュー待ち）|inventory_only|
|1386|ui_html_text|`menus_book.js:109`|html/template text|討伐数: ${killCount}|（未提案・レビュー待ち）|inventory_only|
|1387|ui_html_text|`menus_book.js:116`|html/template text|攻:${m.atk}|（未提案・レビュー待ち）|inventory_only|
|1388|ui_html_text|`menus_book.js:116`|html/template text|防:${m.def}|（未提案・レビュー待ち）|inventory_only|
|1389|ui_html_text|`menus_book.js:116`|html/template text|魔:${m.mag}|（未提案・レビュー待ち）|inventory_only|
|1390|ui_html_text|`menus_book.js:116`|html/template text|魔防:${m.mdef \|\| 0}|（未提案・レビュー待ち）|inventory_only|
|1391|ui_html_text|`menus_book.js:116`|html/template text|速:${m.spd}|（未提案・レビュー待ち）|inventory_only|
|1392|ui_html_text|`menus_book.js:167`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|1393|ui_html_text|`menus_book.js:250`|html/template text|分類|（未提案・レビュー待ち）|inventory_only|
|1394|ui_html_text|`menus_book.js:260`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|1395|ui_dom_innerText|`menus_book.js:291`|innerText|もどる|（未提案・レビュー待ち）|inventory_only|
|1396|ui_html_text|`menus_book.js:327`|html/template text|特性なし|（未提案・レビュー待ち）|inventory_only|
|1397|ui_html_text|`menus_book.js:335`|html/template text|（生息地未登録）|（未提案・レビュー待ち）|inventory_only|
|1398|ui_html_text|`menus_book.js:340`|html/template text|行動・耐性|（未提案・レビュー待ち）|inventory_only|
|1399|ui_html_text|`menus_book.js:341`|html/template text|情報・報酬|（未提案・レビュー待ち）|inventory_only|
|1400|ui_html_text|`menus_book.js:348`|html/template text|行動パターン (${monster.actCount\|\|1}回)|（未提案・レビュー待ち）|inventory_only|
|1401|ui_html_text|`menus_book.js:353`|html/template text|属性耐性 (%)|（未提案・レビュー待ち）|inventory_only|
|1402|ui_html_text|`menus_book.js:359`|html/template text|異常耐性|（未提案・レビュー待ち）|inventory_only|
|1403|ui_html_text|`menus_book.js:369`|html/template text|保有特性|（未提案・レビュー待ち）|inventory_only|
|1404|ui_html_text|`menus_book.js:373`|html/template text|モンスター情報|（未提案・レビュー待ち）|inventory_only|
|1405|ui_html_text|`menus_book.js:377`|html/template text|生息地|（未提案・レビュー待ち）|inventory_only|
|1406|ui_html_text|`menus_book.js:381`|html/template text|ドロップ情報|（未提案・レビュー待ち）|inventory_only|
|1407|ui_html_text|`menus_book.js:382`|html/template text|通常ドロップ：${getDropText('normal')}|（未提案・レビュー待ち）|inventory_only|
|1408|ui_html_text|`menus_book.js:383`|html/template text|レアドロップ：${getDropText('rare')}|（未提案・レビュー待ち）|inventory_only|
|1409|ui_html_text|`menus_book.js:390`|html/template text|＜ 前|（未提案・レビュー待ち）|inventory_only|
|1410|ui_html_text|`menus_book.js:391`|html/template text|図鑑ナビ|（未提案・レビュー待ち）|inventory_only|
|1411|ui_html_text|`menus_book.js:392`|html/template text|次 ＞|（未提案・レビュー待ち）|inventory_only|
|1412|ui_html_text|`menus_book.js:397`|html/template text|ID:${typeof MonsterData !== 'undefined' && MonsterData.formatId ? MonsterData.formatId(monster.id) : String(monster.id).padStart(6, '0')} / 種族:${monster.race\|\|'不明'}|（未提案・レビュー待ち）|inventory_only|
|1413|ui_html_text|`menus_book.js:441`|html/template text|討伐数|（未提案・レビュー待ち）|inventory_only|
|1414|ui_html_text|`menus_book.js:447`|html/template text|攻撃|（未提案・レビュー待ち）|inventory_only|
|1415|ui_html_text|`menus_book.js:448`|html/template text|防御|（未提案・レビュー待ち）|inventory_only|
|1416|ui_html_text|`menus_book.js:449`|html/template text|魔力|（未提案・レビュー待ち）|inventory_only|
|1417|ui_html_text|`menus_book.js:450`|html/template text|魔防|（未提案・レビュー待ち）|inventory_only|
|1418|ui_html_text|`menus_book.js:451`|html/template text|素早|（未提案・レビュー待ち）|inventory_only|
|1419|ui_html_text|`menus_book.js:456`|html/template text|命中|（未提案・レビュー待ち）|inventory_only|
|1420|ui_html_text|`menus_book.js:460`|html/template text|会心|（未提案・レビュー待ち）|inventory_only|
|1421|ui_html_text|`menus_book.js:464`|html/template text|回避|（未提案・レビュー待ち）|inventory_only|
|1422|ui_label|`menus_config.js:6`|label|普通|（未提案・レビュー待ち）|inventory_only|
|1423|ui_label|`menus_config.js:7`|label|早い|（未提案・レビュー待ち）|inventory_only|
|1424|ui_label|`menus_config.js:8`|label|最速|（未提案・レビュー待ち）|inventory_only|
|1425|ui_html_text|`menus_config.js:52`|html/template text|⚙️ 設定|（未提案・レビュー待ち）|inventory_only|
|1426|ui_html_text|`menus_config.js:53`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|1427|ui_html_text|`menus_config.js:56`|html/template text|設定|（未提案・レビュー待ち）|inventory_only|
|1428|ui_html_text|`menus_config.js:57`|html/template text|セーブ|（未提案・レビュー待ち）|inventory_only|
|1429|ui_html_text|`menus_config.js:61`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|1430|ui_alert|`menus_config.js:142`|alert|全データダウンロード機能を利用できません。|（未提案・レビュー待ち）|inventory_only|
|1431|ui_html_text|`menus_config.js:172`|html/template text|セーブ|（未提案・レビュー待ち）|inventory_only|
|1432|ui_html_text|`menus_config.js:175`|html/template text|ロード|（未提案・レビュー待ち）|inventory_only|
|1433|ui_html_text|`menus_config.js:178`|html/template text|データ出力|（未提案・レビュー待ち）|inventory_only|
|1434|ui_html_text|`menus_config.js:179`|html/template text|現在のオートセーブをバックアップ|（未提案・レビュー待ち）|inventory_only|
|1435|ui_html_text|`menus_config.js:182`|html/template text|データ読込|（未提案・レビュー待ち）|inventory_only|
|1436|ui_html_text|`menus_config.js:183`|html/template text|バックアップをオートセーブへ復元|（未提案・レビュー待ち）|inventory_only|
|1437|ui_html_text|`menus_config.js:186`|html/template text|一括ダウンロード|（未提案・レビュー待ち）|inventory_only|
|1438|ui_html_text|`menus_config.js:187`|html/template text|ゲーム画像などの全データを端末へ保存|（未提案・レビュー待ち）|inventory_only|
|1439|ui_html_text|`menus_config.js:207`|html/template text|戦闘速度|（未提案・レビュー待ち）|inventory_only|
|1440|ui_html_text|`menus_config.js:212`|html/template text|オート戦闘|（未提案・レビュー待ち）|inventory_only|
|1441|ui_html_text|`menus_config.js:218`|html/template text|BGM音量|（未提案・レビュー待ち）|inventory_only|
|1442|ui_html_text|`menus_config.js:224`|html/template text|SE音量|（未提案・レビュー待ち）|inventory_only|
|1443|ui_html_text|`menus_config.js:228`|html/template text|音源ファイルが無音プレースホルダーの項目は、処理だけ実行されます。|（未提案・レビュー待ち）|inventory_only|
|1444|ui_html_text|`menus_exchange.js:154`|html/template text|📢 お知らせ|（未提案・レビュー待ち）|inventory_only|
|1445|ui_html_text|`menus_exchange.js:155`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|1446|ui_html_text|`menus_exchange.js:163`|html/template text|お知らせ|（未提案・レビュー待ち）|inventory_only|
|1447|ui_html_text|`menus_exchange.js:169`|html/template text|チュートリアル|（UI完成ゲート後に別途レビュー）|tutorial_deferred|
|1448|ui_html_text|`menus_exchange.js:175`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|1449|ui_html_text|`menus_exchange.js:198`|html/template text|デイリー報酬|（未提案・レビュー待ち）|inventory_only|
|1450|ui_html_text|`menus_exchange.js:201`|html/template text|毎日1000 GEM|（未提案・レビュー待ち）|inventory_only|
|1451|ui_html_text|`menus_exchange.js:205`|html/template text|毎日10000 GOLD|（未提案・レビュー待ち）|inventory_only|
|1452|ui_html_text|`menus_exchange.js:211`|html/template text|最新の情報|（未提案・レビュー待ち）|inventory_only|
|1453|ui_html_text|`menus_exchange.js:223`|html/template text|現在、お知らせはありません。|（未提案・レビュー待ち）|inventory_only|
|1454|ui_html_text|`menus_exchange.js:226`|html/template text|前へ|（未提案・レビュー待ち）|inventory_only|
|1455|ui_html_text|`menus_exchange.js:228`|html/template text|次へ|（未提案・レビュー待ち）|inventory_only|
|1456|ui_html_text|`menus_exchange.js:239`|html/template text|チュートリアルを読み込めませんでした|（UI完成ゲート後に別途レビュー）|tutorial_deferred|
|1457|ui_html_text|`menus_exchange.js:240`|html/template text|tutorial.js が同じ階層に配置されているか確認してください。|（未提案・レビュー待ち）|inventory_only|
|1458|ui_html_text|`menus_exchange.js:241`|html/template text|再読み込み|（未提案・レビュー待ち）|inventory_only|
|1459|ui_html_text|`menus_exchange.js:247`|html/template text|チュートリアルを読み込んでいます…|（UI完成ゲート後に別途レビュー）|tutorial_deferred|
|1460|ui_html_text|`menus_exchange.js:258`|html/template text|チュートリアル一覧|（UI完成ゲート後に別途レビュー）|tutorial_deferred|
|1461|ui_html_text|`menus_exchange.js:274`|html/template text|登録済みのチュートリアルはありません。|（UI完成ゲート後に別途レビュー）|tutorial_deferred|
|1462|ui_html_text|`menus_inventory.js:170`|html/template text|選択|（未提案・レビュー待ち）|inventory_only|
|1463|ui_html_text|`menus_inventory.js:244`|html/template text|効果:|（未提案・レビュー待ち）|inventory_only|
|1464|ui_html_text|`menus_inventory.js:247`|html/template text|全て|（未提案・レビュー待ち）|inventory_only|
|1465|ui_html_text|`menus_inventory.js:255`|html/template text|並替:|（未提案・レビュー待ち）|inventory_only|
|1466|ui_html_text|`menus_inventory.js:258`|html/template text|取得順|（未提案・レビュー待ち）|inventory_only|
|1467|ui_html_text|`menus_inventory.js:259`|html/template text|Rank順|（未提案・レビュー待ち）|inventory_only|
|1468|ui_html_text|`menus_inventory.js:265`|html/template text|前へ|（未提案・レビュー待ち）|inventory_only|
|1469|ui_html_text|`menus_inventory.js:270`|html/template text|次へ|（未提案・レビュー待ち）|inventory_only|
|1470|ui_html_text|`menus_inventory.js:274`|html/template text|選択:|（未提案・レビュー待ち）|inventory_only|
|1471|ui_html_text|`menus_inventory.js:274`|html/template text|個|（未提案・レビュー待ち）|inventory_only|
|1472|ui_html_text|`menus_inventory.js:276`|html/template text|一括売却|（未提案・レビュー待ち）|inventory_only|
|1473|ui_html_text|`menus_inventory.js:278`|html/template text|選択売却|（未提案・レビュー待ち）|inventory_only|
|1474|ui_html_text|`menus_inventory.js:306`|html/template text|装備がありません|（未提案・レビュー待ち）|inventory_only|
|1475|ui_html_text|`menus_inventory.js:432`|html/template text|一括売却 条件設定|（未提案・レビュー待ち）|inventory_only|
|1476|ui_html_text|`menus_inventory.js:433`|html/template text|ロック中・装備中の装備は常に対象外です。条件はANDで判定します。|（未提案・レビュー待ち）|inventory_only|
|1477|ui_dom_innerText|`menus_inventory.js:462`|innerText|売却実行|（未提案・レビュー待ち）|inventory_only|
|1478|ui_dom_innerText|`menus_inventory.js:469`|innerText|やめる|（未提案・レビュー待ち）|inventory_only|
|1479|ui_html_text|`menus_inventory.js:502`|html/template text|個|（未提案・レビュー待ち）|inventory_only|
|1480|ui_message|`menus_items.js:696`|message|スカイプリズムを使用できませんでした。|（未提案・レビュー待ち）|inventory_only|
|1481|ui_html_text|`menus_news_detail.js:67`|html/template text|◀ 前|（未提案・レビュー待ち）|inventory_only|
|1482|ui_html_text|`menus_news_detail.js:68`|html/template text|次 ▶|（未提案・レビュー待ち）|inventory_only|
|1483|ui_html_text|`menus_news_detail.js:70`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|1484|ui_html_text|`menus_party.js:63`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|1485|ui_html_text|`menus_party.js:92`|html/template text|そうび|（未提案・レビュー待ち）|inventory_only|
|1486|ui_html_text|`menus_party.js:101`|html/template text|仲間|（未提案・レビュー待ち）|inventory_only|
|1487|ui_html_text|`menus_party.js:102`|html/template text|さくせん|（未提案・レビュー待ち）|inventory_only|
|1488|ui_html_text|`menus_party.js:106`|html/template text|そうび|（未提案・レビュー待ち）|inventory_only|
|1489|ui_html_text|`menus_party.js:126`|html/template text|作戦を選択|（未提案・レビュー待ち）|inventory_only|
|1490|ui_html_text|`menus_party.js:185`|html/template text|空き|（未提案・レビュー待ち）|inventory_only|
|1491|ui_html_text|`menus_party.js:242`|html/template text|現在: ${MenuParty.escapeHtml(currentLabel)}|（未提案・レビュー待ち）|inventory_only|
|1492|ui_html_text|`menus_party.js:253`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|1493|ui_html_text|`menus_party.js:281`|html/template text|空きスロット|（未提案・レビュー待ち）|inventory_only|
|1494|ui_html_text|`menus_party.js:326`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|1495|ui_html_text|`menus_party.js:365`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|1496|ui_html_text|`menus_party.js:444`|html/template text|前衛|（未提案・レビュー待ち）|inventory_only|
|1497|ui_html_text|`menus_party.js:445`|html/template text|後衛|（未提案・レビュー待ち）|inventory_only|
|1498|ui_html_text|`menus_party.js:467`|html/template text|攻:${s.atk}|（未提案・レビュー待ち）|inventory_only|
|1499|ui_html_text|`menus_party.js:468`|html/template text|魔:${s.mag}|（未提案・レビュー待ち）|inventory_only|
|1500|ui_html_text|`menus_party.js:469`|html/template text|速:${s.spd}|（未提案・レビュー待ち）|inventory_only|
|1501|ui_html_text|`menus_party.js:470`|html/template text|防:${s.def}|（未提案・レビュー待ち）|inventory_only|
|1502|ui_html_text|`menus_party.js:471`|html/template text|魔防:${s.mdef}|（未提案・レビュー待ち）|inventory_only|
|1503|ui_html_text|`menus_party.js:486`|html/template text|(空き)|（未提案・レビュー待ち）|inventory_only|
|1504|ui_html_text|`menus_party.js:487`|html/template text|設定 &gt;|（未提案・レビュー待ち）|inventory_only|
|1505|ui_html_text|`menus_party.js:520`|html/template text|(この枠を空にする)|（未提案・レビュー待ち）|inventory_only|
|1506|ui_html_text|`menus_party.js:571`|html/template text|攻:${s.atk}|（未提案・レビュー待ち）|inventory_only|
|1507|ui_html_text|`menus_party.js:571`|html/template text|防:${s.def}|（未提案・レビュー待ち）|inventory_only|
|1508|ui_html_text|`menus_party.js:571`|html/template text|魔:${s.mag}|（未提案・レビュー待ち）|inventory_only|
|1509|ui_html_text|`menus_party.js:571`|html/template text|魔防:${s.mdef}|（未提案・レビュー待ち）|inventory_only|
|1510|ui_html_text|`menus_party.js:571`|html/template text|速:${s.spd}|（未提案・レビュー待ち）|inventory_only|
|1511|ui_html_text|`menus_skill_detail.js:123`|html/template text|追加効果なし|（未提案・レビュー待ち）|inventory_only|
|1512|ui_html_text|`menus_skill_detail.js:131`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|1513|ui_html_text|`menus_skills.js:54`|html/template text|使用可能なスキルがありません|（未提案・レビュー待ち）|inventory_only|
|1514|ui_html_text|`menus_status.js:23`|html/template text|⚔️ 冒険の記録|（未提案・レビュー待ち）|inventory_only|
|1515|ui_html_text|`menus_status.js:24`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|1516|ui_html_text|`menus_status.js:28`|html/template text|記録|（未提案・レビュー待ち）|inventory_only|
|1517|ui_html_text|`menus_status.js:29`|html/template text|クエスト|（未提案・レビュー待ち）|inventory_only|
|1518|ui_html_text|`menus_status.js:30`|html/template text|ギルド|（未提案・レビュー待ち）|inventory_only|
|1519|ui_html_text|`menus_status.js:47`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|1520|ui_html_text|`menus_status.js:158`|html/template text|生産の記録|（未提案・レビュー待ち）|inventory_only|
|1521|ui_html_text|`menus_status.js:260`|html/template text|進行中|（未提案・レビュー待ち）|inventory_only|
|1522|ui_html_text|`menus_status.js:264`|html/template text|完了|（未提案・レビュー待ち）|inventory_only|
|1523|ui_html_text|`menus_status.js:269`|html/template text|受注中のクエストはありません。|（未提案・レビュー待ち）|inventory_only|
|1524|ui_html_text|`menus_status.js:271`|html/template text|クエスト名を選ぶと詳細を確認できます。|（未提案・レビュー待ち）|inventory_only|
|1525|ui_html_text|`menus_status.js:277`|html/template text|冒険者ギルドの記録はまだ利用できません。|（未提案・レビュー待ち）|inventory_only|
|1526|ui_html_text|`menus_status.js:301`|html/template text|依頼迷宮へ挑戦|（未提案・レビュー待ち）|inventory_only|
|1527|ui_html_text|`menus_status.js:302`|html/template text|対象エリア入口へ移動|（未提案・レビュー待ち）|inventory_only|
|1528|ui_html_text|`menus_status.js:309`|html/template text|冒険者ランク|（未提案・レビュー待ち）|inventory_only|
|1529|ui_html_text|`menus_status.js:310`|html/template text|累計達成 ${completedTotal} 件|（未提案・レビュー待ち）|inventory_only|
|1530|ui_html_text|`menus_status.js:312`|html/template text|ギルド経験値 ${state.exp.toLocaleString()}|（未提案・レビュー待ち）|inventory_only|
|1531|ui_html_text|`menus_status.js:316`|html/template text|受注中のギルド依頼 (${acceptedIds.length}/5)|（未提案・レビュー待ち）|inventory_only|
|1532|ui_html_text|`menus_status.js:317`|html/template text|受注中のギルド依頼はありません。|（未提案・レビュー待ち）|inventory_only|
|1533|ui_html_text|`menus_status.js:318`|html/template text|ギルドへ移動|（未提案・レビュー待ち）|inventory_only|
|1534|ui_confirm|`menus_trait_detail.js:63`|confirm|2000 GEM を使用して特性を再抽選しますか？|（未提案・レビュー待ち）|inventory_only|
|1535|ui_html_text|`menus_trait_detail.js:161`|html/template text|特性再抽選|（未提案・レビュー待ち）|inventory_only|
|1536|ui_html_text|`menus_trait_detail.js:166`|html/template text|既存の特性|（未提案・レビュー待ち）|inventory_only|
|1537|ui_html_text|`menus_trait_detail.js:172`|html/template text|再抽選の結果|（未提案・レビュー待ち）|inventory_only|
|1538|ui_html_text|`menus_trait_detail.js:176`|html/template text|所持:|（未提案・レビュー待ち）|inventory_only|
|1539|ui_html_text|`menus_trait_detail.js:179`|html/template text|この特性に変更する|（未提案・レビュー待ち）|inventory_only|
|1540|ui_html_text|`menus_trait_detail.js:180`|html/template text|既存を維持してもどる|（未提案・レビュー待ち）|inventory_only|
|1541|ui_html_text|`menus_trait_detail.js:181`|html/template text|もう一度抽選する (2000 GEM)|（未提案・レビュー待ち）|inventory_only|
|1542|ui_html_text|`menus_trait_detail.js:214`|html/template text|現在のLv|（未提案・レビュー待ち）|inventory_only|
|1543|ui_html_text|`menus_trait_detail.js:215`|html/template text|分類|（未提案・レビュー待ち）|inventory_only|
|1544|ui_html_text|`menus_trait_detail.js:226`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|1545|ui_html_text|`menus_trait_detail.js:228`|html/template text|特性を再抽選する (2000 GEM)|（未提案・レビュー待ち）|inventory_only|
|1546|ui_html_text|`monster_nursery.js:54`|html/template text|モンスター合成|（未提案・レビュー待ち）|inventory_only|
|1547|ui_html_text|`monster_nursery.js:55`|html/template text|説明を聞く|（未提案・レビュー待ち）|inventory_only|
|1548|ui_html_text|`monster_nursery.js:71`|html/template text|「姿を残し、積み重ねた力を次の生へ渡す。それがここでの合成だ」|（未提案・レビュー待ち）|inventory_only|
|1549|ui_html_text|`monster_nursery.js:75`|html/template text|メインの姿・名前・成長型を維持し、素材の永続能力10%を加算します。|（未提案・レビュー待ち）|inventory_only|
|1550|ui_html_text|`monster_nursery.js:82`|html/template text|メイン|（未提案・レビュー待ち）|inventory_only|
|1551|ui_html_text|`monster_nursery.js:82`|html/template text|と|（未提案・レビュー待ち）|inventory_only|
|1552|ui_html_text|`monster_nursery.js:82`|html/template text|素材|（未提案・レビュー待ち）|inventory_only|
|1553|ui_html_text|`monster_nursery.js:82`|html/template text|の仲間モンスターを1体ずつ選びます。|（未提案・レビュー待ち）|inventory_only|
|1554|ui_html_text|`monster_nursery.js:130`|html/template text|Lv${Number(character.level \|\| 1)} / 合成${fusionCount}|（未提案・レビュー待ち）|inventory_only|
|1555|ui_html_text|`monster_nursery.js:132`|html/template text|HP / MP / 攻 / 防 / 魔 / 魔防 / 速 ${stats}|（未提案・レビュー待ち）|inventory_only|
|1556|ui_html_text|`monster_nursery.js:206`|html/template text|メイン|（未提案・レビュー待ち）|inventory_only|
|1557|ui_html_text|`monster_nursery.js:208`|html/template text|素材|（未提案・レビュー待ち）|inventory_only|
|1558|ui_html_text|`monster_nursery.js:208`|html/template text|合成後に消滅|（未提案・レビュー待ち）|inventory_only|
|1559|ui_html_text|`monster_nursery.js:210`|html/template text|現在|（未提案・レビュー待ち）|inventory_only|
|1560|ui_html_text|`monster_nursery.js:210`|html/template text|素材10%|（未提案・レビュー待ち）|inventory_only|
|1561|ui_html_text|`monster_nursery.js:210`|html/template text|合成後|（未提案・レビュー待ち）|inventory_only|
|1562|ui_html_text|`monster_nursery.js:211`|html/template text|スキル|（未提案・レビュー待ち）|inventory_only|
|1563|ui_html_text|`monster_nursery.js:211`|html/template text|なし|（未提案・レビュー待ち）|inventory_only|
|1564|ui_html_text|`monster_nursery.js:212`|html/template text|特性|（未提案・レビュー待ち）|inventory_only|
|1565|ui_html_text|`monster_nursery.js:212`|html/template text|なし|（未提案・レビュー待ち）|inventory_only|
|1566|ui_html_text|`monster_nursery.js:213`|html/template text|合成後 Lv1 / 合成回数 ${preview.nextFusionCount}|（未提案・レビュー待ち）|inventory_only|
|1567|ui_html_text|`monster_nursery.js:213`|html/template text|合成の壺 ${MonsterNursery.getPotCount()}個|（未提案・レビュー待ち）|inventory_only|
|1568|ui_label|`monsters.js:61`|label|守備特化型A|（未提案・レビュー待ち）|inventory_only|
|1569|ui_label|`monsters.js:62`|label|守備特化型B|（未提案・レビュー待ち）|inventory_only|
|1570|ui_label|`monsters.js:63`|label|守備特化型C|（未提案・レビュー待ち）|inventory_only|
|1571|ui_label|`monsters.js:64`|label|魔防特化型A|（未提案・レビュー待ち）|inventory_only|
|1572|ui_label|`monsters.js:65`|label|魔防特化型B|（未提案・レビュー待ち）|inventory_only|
|1573|ui_label|`monsters.js:66`|label|魔防特化型C|（未提案・レビュー待ち）|inventory_only|
|1574|ui_label|`monsters.js:67`|label|守備・魔防特化型A|（未提案・レビュー待ち）|inventory_only|
|1575|ui_label|`monsters.js:68`|label|守備・魔防特化型B|（未提案・レビュー待ち）|inventory_only|
|1576|ui_label|`monsters.js:69`|label|守備・魔防特化型C|（未提案・レビュー待ち）|inventory_only|
|1577|ui_label|`monsters.js:70`|label|魔力特化型A|（未提案・レビュー待ち）|inventory_only|
|1578|ui_label|`monsters.js:71`|label|魔力特化型B|（未提案・レビュー待ち）|inventory_only|
|1579|ui_label|`monsters.js:72`|label|魔力特化型C|（未提案・レビュー待ち）|inventory_only|
|1580|ui_label|`monsters.js:73`|label|攻撃特化型A|（未提案・レビュー待ち）|inventory_only|
|1581|ui_label|`monsters.js:74`|label|攻撃特化型B|（未提案・レビュー待ち）|inventory_only|
|1582|ui_label|`monsters.js:75`|label|攻撃特化型C|（未提案・レビュー待ち）|inventory_only|
|1583|ui_label|`monsters.js:76`|label|攻撃・魔力特化型A|（未提案・レビュー待ち）|inventory_only|
|1584|ui_label|`monsters.js:77`|label|攻撃・魔力特化型B|（未提案・レビュー待ち）|inventory_only|
|1585|ui_label|`monsters.js:78`|label|攻撃・魔力特化型C|（未提案・レビュー待ち）|inventory_only|
|1586|ui_label|`monsters.js:79`|label|速さ特化型A|（未提案・レビュー待ち）|inventory_only|
|1587|ui_label|`monsters.js:80`|label|速さ特化型B|（未提案・レビュー待ち）|inventory_only|
|1588|ui_label|`monsters.js:81`|label|速さ特化型C|（未提案・レビュー待ち）|inventory_only|
|1589|ui_label|`monsters.js:82`|label|バランス型A|（未提案・レビュー待ち）|inventory_only|
|1590|ui_label|`monsters.js:83`|label|バランス型B|（未提案・レビュー待ち）|inventory_only|
|1591|ui_label|`monsters.js:84`|label|バランス型C|（未提案・レビュー待ち）|inventory_only|
|1592|ui_label|`monsters.js:86`|label|全特化型|（未提案・レビュー待ち）|inventory_only|
|1593|ui_title|`news.js:9`|title|Ver 0.1 リリース！|（未提案・レビュー待ち）|inventory_only|
|1594|ui_title|`news.js:10`|title|ver 0.2 アップデート！|（未提案・レビュー待ち）|inventory_only|
|1595|ui_title|`news.js:11`|title|ver 0.8 アップデート！|（未提案・レビュー待ち）|inventory_only|
|1596|ui_title|`news.js:12`|title|ver 1.0 アップデート！|（未提案・レビュー待ち）|inventory_only|
|1597|ui_title|`news.js:13`|title|ver 1.0 開発版アップデート！|（未提案・レビュー待ち）|inventory_only|
|1598|ui_title|`news.js:14`|title|ver 1.0 開発版アップデート！|（未提案・レビュー待ち）|inventory_only|
|1599|ui_title|`news.js:15`|title|ver 1.0 開発版アップデート！|（未提案・レビュー待ち）|inventory_only|
|1600|ui_title|`news.js:16`|title|ver 1.0 開発版アップデート！|（未提案・レビュー待ち）|inventory_only|
|1601|ui_title|`news.js:17`|title|ver 1.0 開発版アップデート！|（未提案・レビュー待ち）|inventory_only|
|1602|ui_title|`news.js:18`|title|ver 1.0 開発版アップデート！|（未提案・レビュー待ち）|inventory_only|
|1603|ui_html_text|`opening.js:54`|html/template text|記憶を辿っています…|（未提案・レビュー待ち）|inventory_only|
|1604|ui_html_text|`passiveSkill.js:297`|html/template text|【${char.name}】は 新たな特性【${m.name}】を習得した！|（未提案・レビュー待ち）|inventory_only|
|1605|ui_dom_placeholder|`polish.js:31`|placeholder|名前を入力|（未提案・レビュー待ち）|inventory_only|
|1606|ui_dom_textContent|`polish.js:35`|textContent|主人公アイコン（任意）|（未提案・レビュー待ち）|inventory_only|
|1607|ui_dom_textContent|`polish.js:37`|textContent|はじめから|（未提案・レビュー待ち）|inventory_only|
|1608|ui_dom_textContent|`polish.js:39`|textContent|つづきから|（未提案・レビュー待ち）|inventory_only|
|1609|ui_dom_textContent|`polish.js:41`|textContent|データ管理|（未提案・レビュー待ち）|inventory_only|
|1610|ui_dom_textContent|`polish.js:43`|textContent|データ管理|（未提案・レビュー待ち）|inventory_only|
|1611|ui_dom_textContent|`polish.js:45`|textContent|アプリをインストール|（未提案・レビュー待ち）|inventory_only|
|1612|ui_dom_textContent|`polish.js:47`|textContent|アプリを更新|（未提案・レビュー待ち）|inventory_only|
|1613|ui_dom_textContent|`polish.js:49`|textContent|セーブデータを削除|（未提案・レビュー待ち）|inventory_only|
|1614|ui_dom_textContent|`polish.js:51`|textContent|戻る|（未提案・レビュー待ち）|inventory_only|
|1615|ui_dom_textContent|`polish.js:53`|textContent|バックアップから復元|（未提案・レビュー待ち）|inventory_only|
|1616|ui_dom_textContent|`polish.js:58`|textContent|フィールド|（未提案・レビュー待ち）|inventory_only|
|1617|ui_dom_textContent|`polish.js:62`|textContent|決定|（未提案・レビュー待ち）|inventory_only|
|1618|ui_dom_textContent|`polish.js:75`|textContent|対象を選択|（未提案・レビュー待ち）|inventory_only|
|1619|ui_dom_textContent|`polish.js:77`|textContent|選択|（未提案・レビュー待ち）|inventory_only|
|1620|ui_dom_textContent|`polish.js:79`|textContent|戻る|（未提案・レビュー待ち）|inventory_only|
|1621|ui_dom_textContent|`polish.js:82`|textContent|閉じる|（未提案・レビュー待ち）|inventory_only|
|1622|ui_dom_textContent|`polish.js:84`|textContent|スキップ|（未提案・レビュー待ち）|inventory_only|
|1623|ui_dom_textContent|`polish.js:89`|textContent|提供割合|（未提案・レビュー待ち）|inventory_only|
|1624|ui_dom_textContent|`polish.js:90`|textContent|閉じる|（未提案・レビュー待ち）|inventory_only|
|1625|ui_html_text|`save_slots.js:526`|html/template text|いいえ|（未提案・レビュー待ち）|inventory_only|
|1626|ui_html_text|`save_slots.js:587`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|1627|ui_html_text|`save_slots.js:592`|html/template text|もどる|（未提案・レビュー待ち）|inventory_only|
|1628|ui_html_text|`save_slots.js:610`|html/template text|セーブデータを確認しています……|（未提案・レビュー待ち）|inventory_only|
|1629|ui_dom_textContent|`save_slots.js:621`|textContent|手動セーブ領域を利用できません。オートセーブと既存のデータ出力・読込は利用できます。|（未提案・レビュー待ち）|inventory_only|
|1630|ui_dom_textContent|`save_slots.js:625`|textContent|この環境では手動セーブ領域を利用できません。オートセーブと既存のデータ出力・読込は利用できます。|（未提案・レビュー待ち）|inventory_only|
|1631|ui_html_text|`story_logic.js:1243`|html/template text|イベント処理を中断しました。再読込すると同じ位置から再試行します。|（未提案・レビュー待ち）|inventory_only|
|1632|ui_html_text|`story_logic.js:1568`|html/template text|会話の再開に失敗しました。再読込すると同じ位置から再試行します。|（未提案・レビュー待ち）|inventory_only|
|1633|ui_dom_innerText|`story_logic.js:2673`|innerText|選択|（未提案・レビュー待ち）|inventory_only|
|1634|ui_dom_textContent|`story_logic.js:2747`|textContent|画面を押して戻る|（未提案・レビュー待ち）|inventory_only|
|1635|ui_html_text|`story_logic.js:2981`|html/template text|会話ログ|（未提案・レビュー待ち）|inventory_only|
|1636|ui_html_text|`story_logic.js:2982`|html/template text|閉じる|（未提案・レビュー待ち）|inventory_only|
|1637|ui_html_text|`story_logic.js:2985`|html/template text|会話履歴はありません。|（未提案・レビュー待ち）|inventory_only|
|1638|ui_html_text|`tutorial.js:865`|html/template text|◀ 前へ|（UI完成ゲート後に別途レビュー）|tutorial_deferred|
|1639|ui_html_text|`tutorial.js:870`|html/template text|次へ ▶|（UI完成ゲート後に別途レビュー）|tutorial_deferred|
|1640|ui_html_text|`tutorial.js:872`|html/template text|閉じる|（UI完成ゲート後に別途レビュー）|tutorial_deferred|
|1641|story_system|`story.js:7801`|ABYSS_JASPER|災禍の根の最深部。白い祭壇を中心に、黒ずんだ根が幾重にも絡み合っている。|（未提案・レビュー待ち）|new_copy_inventory|
|1642|story_system|`story.js:7805`|ABYSS_JASPER|足元の紋様が反転した。白と黒の光が根を伝い、一行の身体へ絡みつく。|（未提案・レビュー待ち）|new_copy_inventory|
|1643|story_system|`story.js:7824`|ABYSS_JASPER_ALAN_ENTRY_PHASE8F|その時、祭壇の外縁で影が揺れた。濁った光が一閃し、身体を縛る白黒の鎖へ食い込む。|（未提案・レビュー待ち）|new_copy_inventory|
|1644|story_system|`story.js:7827`|ABYSS_JASPER_ALAN_ENTRY_PHASE8F|混沌に染まった光が、混沌呪縛の術式へ逆流する。絡みついていた力がひび割れ、一行の身体からほどけていった。|（未提案・レビュー待ち）|new_copy_inventory|
|1645|ui_choice|`story.js:8287`|abyss_jasper_clear|アランを仲間に迎えますか？|（未提案・レビュー待ち）|new_copy_inventory|
|1646|ui_choice_label|`story.js:8288`|abyss_jasper_clear yesLabel|仲間に迎える|（未提案・レビュー待ち）|new_copy_inventory|
|1647|ui_choice_label|`story.js:8288`|abyss_jasper_clear noLabel|今は断る|（未提案・レビュー待ち）|new_copy_inventory|
|1648|ui_story_log|`story.js:8294`|abyss_jasper_clear join|アランが再び仲間に加わった。|（未提案・レビュー待ち）|new_copy_inventory|
|1649|ui_story_log|`story.js:8299`|abyss_jasper_clear wait|アランは混沌魔城レガシオンへ戻った。|（未提案・レビュー待ち）|new_copy_inventory|
|1650|ui_choice|`story.js:8377`|abyss_legacion_alan_rejoin_phase8f|アランを仲間に迎えますか？|（未提案・レビュー待ち）|new_copy_inventory|
|1651|ui_choice_label|`story.js:8378`|abyss_legacion_alan_rejoin_phase8f yesLabel|仲間に迎える|（未提案・レビュー待ち）|new_copy_inventory|
|1652|ui_choice_label|`story.js:8378`|abyss_legacion_alan_rejoin_phase8f noLabel|今は断る|（未提案・レビュー待ち）|new_copy_inventory|
|1653|ui_story_log|`story.js:8384`|abyss_legacion_alan_rejoin_phase8f join|アランが再び仲間に加わった。|（未提案・レビュー待ち）|new_copy_inventory|
|1654|map_interaction_label|`map.js:3683`|alan_waiting_legacion_phase8f|アランと話す|（未提案・レビュー待ち）|new_copy_inventory|
|1655|battle_system_fallback|`battle.js:2064`|openingPartyStatDebuff fallback label|特殊な呪縛|（未提案・レビュー待ち）|new_copy_inventory|
|1656|battle_system_log|`battle.js:2065`|openingPartyStatDebuff battle log|${label}により、味方全体の能力が低下した！|（未提案・レビュー待ち）|new_copy_inventory|

|1657|story_system|`story.js:1949`|QUEST_ARISA_HAINE_ENCOUNTER|折れた枝の向こうで、刃が根を弾く乾いた音がした。|（2026-08-13新規・承認済み）|new_copy_approved|
|1658|story_system|`story.js:1968`|QUEST_ARISA_HAINE_ENCOUNTER|黒く膨れた根の向こうで、アリサの足元だけ枯葉が逆向きに舞っている。|（2026-08-13新規・承認済み）|new_copy_approved|
|1659|story_system|`story.js:1984`|QUEST_ARISA_HAINE_CLEAR|倒れた古根の奥。土に半ば埋もれた細い笛が、風に触れてかすかな一音を返した。|（2026-08-13新規・承認済み）|new_copy_approved|
|1660|story_system|`story.js:2013`|QUEST_ARISA_HAINE_CLEAR|アリサの指が、迷わず古い笛の穴をなぞる。本人はそれに気づくと、すぐ手を止めた。|（2026-08-13新規・承認済み）|new_copy_approved|
|1661|story_system|`story.js:2042`|QUEST_ARISA_HAINE_CLEAR|ハイネは一度だけ目を細めた。|（2026-08-13新規・承認済み）|new_copy_approved|
|1662|ui_story_log|`story.js:6210`|quest_arisa_haine_clear|アリサとハイネが仲間に加わった。水上都市へ戻ろう。|（既存骨格維持）|inventory_only|
|1663|quest_objective|`quests.js:34`|arisa_haine_forest_depths|風の音を追って禁忌の森深部へ入ったアリサと、後を追ったハイネを捜す。|（2026-08-13改稿・承認済み）|approved_rewrite|
|1664|quest_start_text|`quests.js:35`|arisa_haine_forest_depths|カザリアから、禁忌の森へ入ったアリサとハイネの救援を頼まれた。|（2026-08-13改稿・承認済み）|approved_rewrite|
|1665|quest_progress_text|`quests.js:36`|arisa_haine_forest_depths|禁忌の森深部へ向かい、アリサとハイネを救出しよう。|（既存維持）|inventory_only|
|1666|quest_complete_text|`quests.js:37`|arisa_haine_forest_depths|禁忌の森深部で二人を救出し、アリサとハイネが仲間に加わった。|（2026-08-13改稿・承認済み）|approved_rewrite|
|1667|item_name|`items.js:7046`|Item 701012|古びた魔笛|（2026-08-13新規・承認済み）|new_copy_approved|
|1668|item_description|`items.js:7049`|Item 701012|黒ずんだ木と銀の輪で作られた古い笛。風が抜けると、どこか懐かしい短い音を返す。|（2026-08-13新規・承認済み）|new_copy_approved|
