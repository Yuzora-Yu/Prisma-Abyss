# PRISMA ABYSS — 新規Asset制作台帳 v3

**更新日:** 2026-08-10  
**目的:** 新シナリオ実装を仮素材で止めずに進めつつ、後半のMAP/演出拡張時に必要な新規画像を漏れなく差し替えるための制作台帳。

## 運用ルール

- コード実装は、存在する既存assetを仮参照して先行してよい。
- この台帳で `P0` は近い実プレイ確認に必要、`P1` は該当章の本仕上げ前、`P2` は演出・最終ポリッシュ用。
- MAPはユーザー作成図面を受領するまで最小構造を維持し、tilesetの最終切り出し・装飾配置も図面反映工程で行う。
- キャラクターのフィールド移動チップは最低 **上・下・左・右 × 各2フレーム = 8フレーム/1衣装** を基本単位とする。
- 回想のセピア表現はランタイムfilterを使用できるため、セピア専用複製画像は原則作らない。
- 新assetが未完成でも既存画像fallbackで進行を止めない。正式画像追加後にasset keyだけ差し替えられるようにする。

---

## P0 — 5年前プロローグ

### MAP tileset / props

| Asset | 用途 | 必要差分 | 現在 |
|---|---|---|---|
| `tiles_prologue_mountain_village_normal` | 名もなき山奥の村・平穏時 | 草地、山道、素朴な家、石垣、小川/水場、花畑 | 新規必要 |
| `tiles_prologue_mountain_village_collapse` | 爆発後の南/北エリア | 地割れ、崩落縁、落下した家屋跡、瓦礫、焦げ地面 | 新規必要 |
| `prop_old_light_altar` | 古き光の神の信仰表現 | 小祠/祭壇/石碑 | 新規必要 |
| `prop_light_offering_flower` | 西の高台の花採取 | 採取前/採取後 | 新規必要 |
| `prop_abyss_fissure` | 南エリアの深い地割れ | 小/中/大裂け目 | 新規必要 |

### Battle backgrounds

| Asset | 用途 | 現在 |
|---|---|---|
| `battle_bg_prologue_hill` | 西高台/周辺の緊急戦闘用 | 新規必要 |
| `battle_bg_prologue_ruined_village` | 南エリア・ルーナ救援/崩壊村 | 新規必要 |
| `battle_bg_prologue_north_wilds` | 北エリア、強敵/メタルジェリー | 新規必要 |
| `battle_bg_prologue_abyss_gate` | 南入口・深淵の化け物 | 新規必要 |

### 顔グラ / 立ち絵

| 対象 | ID | 必要内容 | 現在 |
|---|---:|---|---|
| アルス（13歳） | 301をプロローグ差分運用 | 通常/驚き/焦り/喪失など基本表情 | 新規必要 |
| ルーナ（13歳） | 403 | 通常/笑顔/驚き/恐怖/心配など基本表情 | 新規必要 |

※ ID403のゲーム内表示名は「ルーナ」。asset内部名で `child` / `prologue` を使うのは可だが、ゲーム表示へ「（幼少期）」を出さない。

### フィールド歩行チップ

- アルス（13歳）: 4方向×2フレーム。
- ルーナ ID403: 4方向×2フレーム。
- プロローグ村人: 男女/年齢差を最低3〜4セット。4方向×2フレーム。

---

## P0 — 海底火山

### MAP tileset / props

| Asset | 対象 | 必要内容 | 現在の仮実装 |
|---|---|---|---|
| `tiles_undersea_volcano_natural` | 第1〜3層 | 黒い火山岩、溶岩脈、蒸気、海水が滲む岩壁、冷却された玄武岩 | `FIRE_VILLAGE` fallback |
| `tiles_undersea_volcano_lab` | 研究区画 | 石造/金属床、配管、観測装置、火属性導管、水圧安全弁 | `THUNDER_FORT` fallback |
| `tiles_undersea_volcano_core` | 最奥戦闘区画 | 大型炉心、火脈制御環、破損可能な研究設備 | `FIRE_VILLAGE` fallback |
| `prop_grad_adaptation_chamber` | 研究区画 | グラドの長期適応研究を示す培養/拘束/導流設備 | 新規必要 |
| `prop_fire_water_regulator` | 研究区画 | 火と周囲の水属性を両方利用する制御装置 | 新規必要 |
| `prop_jasper_lab_documents` | 研究記録 | 書類/端末/研究台 | 新規必要 |

### Battle backgrounds

| Asset | 用途 | 現在 |
|---|---|---|
| `battle_bg_undersea_volcano` | 第1〜3層の通常戦 | `battle_bg_fire` fallback |
| `battle_bg_undersea_lab` | 研究区画イベント戦 | 新規必要 |
| `battle_bg_undersea_grad` | 炎楔のグラド再戦 | `battle_bg_fire` fallback |

### Boss visual

| Asset | 用途 | 現在 |
|---|---|---|
| `monster_grad_complete` | 海底火山・完全適応グラド | ID301010画像をfallback利用。専用差分はP1 |
| `effect_grad_core_fire` | 炎楔同化/焔炉心解放 | 新規必要 |
| `effect_grad_heaven_pierce` | 「炎楔・天穿」 | 新規必要 |

---

## P0/P1 — フィールド歩行チップ（プレイアブル）

以下の全プレイアブルについて、最低 **4方向×2フレーム** を用意する。現行の静止overlay画像は仮表示として残せるが、最終的には歩行チップへ置換する。

| ID | キャラ | 優先 |
|---:|---|---|
| 301 | アルス（18歳） | P0 |
| 403 | ルーナ（13歳・プロローグ） | P0 |
| 401 | ルーナ（18歳） | P0 |
| 101 | ジョセフ | P0 |
| 103 | ゼリード | P0 |
| 104 | ケイト | P0 |
| 108 | アリサ | P0 |
| 201 | アラン | P0 |
| 207 | ハイネ | P0 |
| 304 | クロード | P0 |
| 204 | レイラ | P0（光宮殿回想操作） |
| 305 | レオン | P0/P1 |
| 102 | マリー | P1 |
| 205 | バロン | P1 |
| 302 | フリーダ | P1 |
| 105 | シャオ | P1 |
| 106 | エリーゼ | P1 |
| 107 | リュウ | P1 |
| 109 | ガイル | P1 |
| 110 | サラ | P1 |
| 202 | ソフィア | P1 |
| 203 | ハヤテ | P1 |
| 206 | ミネルバ | P1 |
| 208 | リン | P1 |
| 209 | シルビア | P1 |
| 210 | カリン | P1 |
| 303 | リーシア | P1 |
| 306 | シャニー | P1 |
| 402 | ゼノン | P1 |
| 501 | リュシオン | P1/P2 |

### 衣装差分を別セットにする候補

- レイラ：光宮殿回想時の衣装が通常同行時と違う場合。
- ルーナ：聖女としての公的衣装/通常衣装を分ける場合。
- アラン：裏切り時/光魔剣士再加入後。
- レオン：宮殿時/正式同行後。
- ゼリード：王国暗部回想用。

---

## P1 — 光の宮殿・回想

- 光宮殿の正式tileset差分（宮殿、牢獄、儀式区画、崩壊/戦闘状態）。
- レイラ歩行チップ 4方向×2。
- クロード歩行チップ 4方向×2。
- レオン歩行チップ 4方向×2。
- ヴェルドのフィールド用チップ。
- ルーナ（18歳）の昏睡/横臥表現（救護所用）。
- クロードがルーナを抱えて運ぶ専用1枚絵またはイベント用大型sprite（P2でも可）。
- 回想用の画面フィルターはコード側でセピア化するため専用背景複製不要。

---

## P1 — レクスノート邸・船

- `tiles_rexnote_estate`：旧侯爵邸の外観/広間/廃れた内装。
- レクスノート家紋prop。
- アレル＝レクスノート関連の肖像/記録物prop（必要なら）。
- 魔法の小舟のフィールド表示差分（既存船assetで不足する場合）。

---

## P1 — 結晶樹の秘跡

- 結晶樹tileset（根、発光結晶、水路/循環表現）。
- 六属性を円環に置く祭壇/リングprop。
- battle background：結晶樹内部、六精霊試練。
- 輪廻の結晶生成演出用effect/CG。

---

## P1/P2 — 後半主要MAP

- リース山小屋。
- 魔王城ガルヴァニアの「深淵防衛砦」化に必要な生活/防衛props。
- 統合の祭壇。
- 混沌魔城レガシオン。
- 夢幻回廊リドパルム。
- 六精霊の各試練背景/祭壇差分。

---

## 顔グラ制作の共通最低仕様

主要キャラは最低以下を想定する。

1. 通常
2. 微笑/喜
3. 怒り/決意
4. 困惑/驚き
5. 悲しみ/喪失
6. 負傷/苦痛（必要キャラのみ）

プロローグのアルス/ルーナ、光宮殿回想のレイラ/クロード/レオンは優先度を上げる。

---

## 実装時のasset key方針

- キャラクターの内部IDとasset名は分離する。表示名変更でファイル名を壊さない。
- 年齢差分は `char_301_prologue_*`, `char_403_*` のように内部keyで区別する。
- MAPは `tiles_<area>_<variant>`、battle backgroundは `battle_bg_<area>_<variant>` を基本とする。
- 追加assetをコードへ接続したら `assets.js` / `audio_manifest.js` 相当のmanifestとfull-cache validatorを同時更新する。
- assetが存在しない段階ではmanifestへ架空パスを登録しない。台帳上だけ `planned` として保持する。

---

# 追記 v2 — 光の宮殿回想用 Asset Backlog

## P0 / 回想成立に直結

| Asset | 用途 | 最低要件 | 備考 |
|---|---|---|---|
| 聖女の部屋 tileset / room props | 回想開始地点 | ベッド、聖具、白光壁、扉 | 現在は光宮殿既存tile fallback |
| 六芒星の間・床紋様 | ジャスパー罠 | 通常状態＋起動状態 | 最終図面座標へ移設 |
| 六芒星拘束エフェクト | ルーナ捕縛 | 6本の光楔／拘束環 | 静止画＋簡易発光でも可 |
| 聖女ルーナ field sprite | レイラとの逃走 | 上下左右×2 = 8frame | ID401、呪縛前衣装 |
| レイラ field sprite | 回想操作 | 上下左右×2 | ID204 |
| レオン field sprite | 後半逃走 | 上下左右×2 | ID305 |
| クロード field sprite | 後半逃走 | 上下左右×2 | ID304 |
| クロード＋昏睡ルーナ carry sprite | 後半逃走演出 | 最低4方向、可能なら各2frame | 通常クロードとは別表示候補 |
| ヴェルド field sprite | 追跡／対峙 | 上下左右×2 | 騎士団長仕様 |
| フラッシュボム effect | 六芒星の間 | 光↔闇の高速交互明滅 | 「融合色」にしない |
| 宮殿入口結界 effect | 第二ヴェルド戦 | 通常／揺らぎ／消失 | 大地震と同期 |
| 光宮殿・六芒星戦闘背景 | 第1ヴェルド戦 | 1枚 | 既存宮殿BG fallback可 |
| 光宮殿・正面入口戦闘背景 | 第2ヴェルド戦 | 1枚 | 既存宮殿BG fallback可 |

### Asset不要の演出
- セピア／低彩度表示はCSS/renderer filterで実装可能。専用画像不要。
- 記憶巻き戻しはfade＋既存UIで成立可能。専用画像は後回し。

---

# 追記 v3 — 光の宮殿・現在時間攻略 / アラン裏切り

## P0/P1 — 現在時間の光の宮殿

| Asset | 用途 | 最低要件 | 優先 | 現在 |
|---|---|---|---|---|
| `tiles_light_palace_present_corrupted` | 現在時間の宮殿攻略 | 白い宮殿tileに濁った光、損傷、封鎖具の差分 | P1 | 既存LIGHT_PALACE fallback |
| `battle_bg_light_palace_present_altar` | ジャスパー＋ヴェルド祭壇戦 | 二つの結界源消失後の光祭壇 | P1 | 既存宮殿戦闘背景 fallback |
| `prop_light_palace_prison_seal` | 地下牢の封印具 | 閉鎖 / 破砕後の2状態 | P1 | 既存牢扉素材 fallback |
| `sprite_king_captive_present` | 国王の幽閉状態 | 牢内・衰弱、最低正面＋横 | P1 | `overlay_light_captive_king` fallback |
| `sprite_leila_cursed_bed_present` | 現在時間レイラ | 横臥 / 呪縛 / 解放後の差分 | P0/P1 | `overlay_light_captive_leila_bed` fallback |
| `sprite_leon_cursed_bed_present` | 現在時間レオン | 深い光の呪い、横臥状態 | P0/P1 | `overlay_companion_leon` fallback |
| `effect_leon_light_curse_deep` | レオンの深い光呪縛 | 生命魔力へ食い込む細い発光脈。派手な爆発表現は不要 | P1 | 新規必要 |
| `effect_alan_betrayal_strike` | 祭壇戦直後の不意打ち | 味方列背後から走る高密度の光斬撃/魔力 | P1 | 汎用光effect fallback |
| `sprite_alan_betrayal_field` | アラン裏切り直後 | 通常同行時と区別できる構え。最低4方向 | P1 | 通常アラン fallback |
| `portrait_alan_betrayal` | 「これで準備は整った。」 | 無表情/決意/葛藤のいずれか。最終表情はDialogue Polishで確定 | P1 | 通常顔グラ fallback |
| `effect_abyss_retreat_light_palace` | ジャスパー/ヴェルド/アラン退場 | 深淵へ沈む裂け目 / 暗転 | P1 | 汎用深淵effect fallback |
| `tiles_light_palace_liberated` | 宮殿解放後 | 濁光消失、負傷者救護、破損箇所を残す | P1 | 現在マップを状態差分利用 |
| `prop_royalist_rescue_set` | 国王派・捕虜救助 | 担架、毛布、救護灯、解錠された牢 | P2 | 新規必要 |

### 現在時間の人物フィールド差分

既存の4方向×2frame台帳に加え、以下は状態差分を別spriteとして検討する。

- アラン：通常同行 / 裏切り時。後の光魔剣士再加入形態はさらに別セット候補。
- レオン：回想戦闘時 / 現在時間の呪縛・横臥 / 正式同行後。
- レイラ：回想時 / 現在時間の負傷・横臥 / 回復加入後。
- 国王：通常王装 / 幽閉・衰弱 / 宮殿解放後。

## P1 — 雷の要塞急報への接続

| Asset | 用途 | 優先 | 現在 |
|---|---|---|---|
| `sprite_thunder_emergency_messenger` | 宮殿解放直後の急報 | P2 | システム文で代替中 |
| `effect_thunder_fort_alarm` | 要塞防衛フェーズの警戒状態 | P1 | 次工程で接続 |
| `tiles_thunder_fort_under_attack` | 魔王軍侵入中の要塞差分 | P1 | 通常雷要塞tileset fallback |
| `prop_thunder_infirmary_barricade` | ルーナの救護区画防衛 | P1 | 次工程で配置予定 |

## 制作順の補足

現在の実装確認で最も見た目の誤解が起きやすいのは、`レオンの呪縛状態`、`アラン裏切り`、`海底火山研究区画`、`プロローグ崩壊村` の4系統。
正式asset制作を始める場合は、各章の本MAP拡張より先にこの4系統の視認性を優先する。


---

# 追記 v3.1 — 雷の要塞防衛 / ルーナ覚醒

| Asset | 用途 | 優先 | 現在 |
|---|---|---|---|
| `battle_bg_thunder_fort_infirmary_defense` | 魔王軍直接戦闘①・救護区画前 | P1 | `battle_bg_thunder_fort` fallback |
| `sprite_demon_soldier_field` | 魔人兵士の侵入表示 | P1 | 戦闘のみ先行。フィールド表示未作成 |
| `sprite_dark_butler_field` | 魔王軍別働隊の強兵 | P1 | 戦闘のみ先行。フィールド表示未作成 |
| `portrait_luna_awakened_memoryless` | 覚醒直後のルーナ | P0/P1 | 通常ルーナ顔グラ fallback |
| `portrait_ars_luna_memory_shock` | アルスの第二の衝撃 | P1 | 通常アルス顔グラ fallback |
| `sprite_leila_wounded_infirmary` | レイラが救護班に支えられる場面 | P1 | 回想/通常レイラ fallback |
| `prop_thunder_infirmary_bed_luna` | 昏睡〜覚醒の救護所 | P0/P1 | ギルド区画の既存背景で代替 |
| `effect_thunder_fort_defense_alarm` | 防衛中の赤色警戒灯/雷光警報 | P1 | 新規必要 |

ルーナ覚醒は物語上の重要カットなので、専用一枚絵を作る場合は `CG` ではなくても、顔グラ差分＋救護所propの組み合わせをP0候補とする。


## 2026-08-10 冒頭再点検 追加

- **P1 / リース専用フィールド歩行チップ**
  - 山小屋内会話用。最低 上下左右×2フレーム。
  - 完成までは `overlay_npc_villager` をfallback使用。
- **P1 / リース会話用顔グラ**
  - 起床後〜旅立ち会話。


---

# 追記 v5 — 結晶樹 Phase7B 制作準備

この段階ではMAP規模を未確定とし、最終フロア数を前提にassetを量産しない。

## P0/P1 — 章の成立に必要になる候補

| Asset | 用途 | 優先 | 状態 |
|---|---|---|---|
| `tiles_crystal_tree_core` | 結晶樹の根・幹・発光結晶・生命水の基礎tile | P1 | planned |
| `battle_bg_crystal_tree` | 通常戦／魔王軍直接戦闘②の基本背景 | P1 | planned |
| `prop_crystal_tree_root_vein` | 根を流れる光・水・魔力の循環を環境で見せる | P1 | planned |
| `effect_crystal_tree_healing_pulse` | レオン／ルーナ治療時の根源循環 | P1 | planned |
| `sprite_minerva_field` | 結晶樹で研究中のミネルバ | P1 | 既存プレイアブル歩行チップ台帳と統合予定 |
| `portrait_minerva_research` | 研究中の汚れ・集中・観察差分 | P2 | planned |
| `prop_minerva_field_notes` | 説明台詞の代わりに研究生活を見せる器具・紙束・測定具 | P2 | planned |
| `effect_luna_crystal_tree_resonance` | 呪縛後ルーナと結晶樹の反応 | P1 | planned |
| `effect_leon_crystal_tree_recovery` | 深い光呪縛がほどける過程 | P1 | planned |

## 保留

- 六属性リングpropは後半の輪廻の結晶生成でも使うため、今回の早い段階で最終デザインを固定しない。
- 「六精霊試練」用背景は本編後半の再訪用途。今回の初回結晶樹MAPとは分けて管理する。
- 魔王軍直接戦闘②の固有幹部spriteは、敵編成確定後に追加する。

---

# 追記 v6 — 結晶樹 Phase 7C M0

## P1 — 初回結晶樹編で追加確定した候補

| Asset | 用途 | 最低要件 | 現在fallback |
|---|---|---|---|
| 水上都市・古い北水門 marker/prop | 結晶樹への本編入口 | 水門/古い導水路だと視覚で分かる | `overlay_dungeon_event` |
| 結晶樹 外縁/root-path tileset | MAP000073 M0置換 | 巨大根、湿った岩、淡い結晶、水の流れ | `WATER_CITY` theme |
| 結晶樹 根源域 tileset/prop | ルーナ/レオン治療地点 | 根の束、脈動する結晶、人物を囲める空間 | 同上 |
| 結晶樹 初回防衛戦 background | 魔王軍直接戦闘② | 根と結晶が同時に見える戦闘背景 | `battle_bg_forest` |
| ミネルバ field sprite確認/差分 | 初対面・根元移動 | 上下左右×2、研究中の小物差分は任意 | 既存 `overlay_companion_minerva` |
| ルーナ治療中 event pose | 根元の治療演出 | 座位/手を根へ触れる等、1枚でも可 | 会話のみ |
| レオン治療中 event pose | 根元の治療演出 | 横臥/支えられた状態、1枚でも可 | 会話のみ |

### 注意

- Phase 7Cの1枚MAP構成はM0であり、最終asset枚数の根拠にしない。
- 最終図面で複数階へ分割する場合も、`crystalTreeState` とstory flagはそのまま使い、MAP構造だけ差し替える。
