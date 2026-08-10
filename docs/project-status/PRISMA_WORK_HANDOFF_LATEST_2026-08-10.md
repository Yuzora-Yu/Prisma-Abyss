# PRISMA ABYSS — 作業引き継ぎ書 最新版

**更新:** 2026-08-10  
**Phase:** 8B / 魔王城三幹部・ガルヴァニア帝国施設再編実装完了  
**用途:** 次Chat/次作業開始時に最初に読む短縮版。詳細技術仕様は `canon/PRISMA_CODING_HANDOFF_v5.md`。

## 1. 最新基準

- 最新累積コード: `PRISMA_PHASE8B_DARK_CASTLE_OFFICERS_EMPIRE_SHOPS_2026-08-10.zip`
- Coding Handoff: `canon/PRISMA_CODING_HANDOFF_v5.md`
- Scenario Canon: `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
- Phase8A地理資料: `docs/scenario/37_GALVANIA_GEOGRAPHY_PHASE8A_20260810.md`
- Phase8A status: `docs/project-status/PHASE8A_GALVANIA_GEOGRAPHY_STATUS_v1.md`
- Phase8B会話/施設資料: `docs/scenario/38_DARK_CASTLE_OFFICERS_AND_EMPIRE_SHOPS_PHASE8B_20260810.md`
- Phase8B status: `docs/project-status/PHASE8B_DARK_CASTLE_OFFICERS_EMPIRE_SHOPS_STATUS_v1.md`
- 承認済み結晶樹会話稿: `docs/scenario/36_CRYSTAL_TREE_SIX_ELEMENT_RITUAL_DRAFT_20260810.md`
- Phase7D status: `docs/project-status/PHASE7D_CRYSTAL_TREE_SIX_ELEMENT_RITUAL_STATUS_v1.md`
- Character/Boss Encyclopedia: `canon/PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md`
- Developer Core Thoughts: `canon/PRISMA_DEVELOPER_CORE_THOUGHTS_v6.md`

**注意:** 2026-08-10のシステム入力更新（村エンカウント/エスケープ、山小屋座標、Rankドロップ、アナログ入力、タップ移動）とPhase7D六属性秘薬を含む累積版から作業すること。古い展開元へ戻さない。

## 2. 現在の本編位置

結晶樹の六属性秘薬イベントまでruntime接続済み。

- 長会話開始: `storyStep=7 / subStep=11`
- 完了後: **`storyStep=8 / subStep=0`**
- 表示目的: 「ガルヴァニア渓谷を越え、魔王城で闇のプリズムの真実を確かめよう」
- 結晶樹治療後に雷の要塞西方で大きな破壊音が発生。

## 3. Phase 7D の前提（戻さない）

1. 六属性の正式循環は `水→風→光→火→雷→闇`。
2. 人体小循環:
   - 水=血液/体液
   - 風=呼吸
   - 光=覚醒/生命リズム
   - 火=代謝/体温
   - 雷=神経信号
   - 闇=睡眠/回復
3. ジャスパーの呪縛はプリズム統合技術の個人向け悪用による不完全統合固定。
4. レイラは結晶樹の葉で治療済み。レオン/ルーナは六属性秘薬で治療。
5. ルーナは故郷を暖かな光、木漏れ日、水音、風、白い祈り布、匂いとして部分的に思い出す。理屈は思い出さない。
6. 正常な闇には支配/操作/洗脳の本質がない。
7. ルーナ Story EXP +300,000、`lunaMemoryStage=2`、EXP倍率1800%。二重取得防止済み。
8. 次の目的は魔王軍を即信頼することではなく、闇プリズムの状態を自分の目で確かめること。

## 4. Phase 8A で実装した地理

### ガルヴァニア渓谷 — `MAP000074`

- **要塞側 x:31,y:40 / 帝国側 x:35,y:42**。
- 旧「ガルヴァニアへの洞窟」のワールド出入口座標をそのまま流用。
- 49x31のM0固定MAP。
- `crystalTreeCleared` 前は中央の魔王軍城壁/門で物理的に通行不能。
- 治療後は破壊状態へ変わり通過可能。
- 初回進入で、誰かが先行して門を破壊したことを確認。
- 倒れた魔族2名を配置。
  - 人間への憎悪を語って死亡。
  - 「このままでは世界が……」と世界を案じて死亡。

### ガルヴァニア帝国 — `MAP000075`

- **ワールド x:8,y:50**。旧魔王城座標を置換。
- 55x41の広めM0。
- 魔王城そのものはワールド座標を持たない。
- 帝国内ローカル **x:27,y:3** の正門から既存 `DARK_CASTLE / MAP000027` へ入る。
- 救護区画、長期防衛用補給、奥側を意識した補修痕を最低限配置。
- 城下町/NPC/避難民/負傷魔族は次工程で拡張。**M0を最終地理にしない。**

### 奈落への洞窟 — `MAP000025`

- 旧「ガルヴァニアへの洞窟」6階層レイアウトを転用。
- **入口側 x:38,y:55 / 祭壇側 x:42,y:55** に移設。
- base Rank86 / floors 81,83,85,87,89,91。
- 入口側は `darkCastleCleared` 後に進入可能。
- F6祭壇側出口で `nadirCaveCleared`。
- 祭壇側からの逆進入は出口確保後のみ。
- 補給路/備蓄/補修痕を、魔族が深淵侵食を防ぎ続けた防衛線の証拠へ再文脈化。

### 統合の祭壇 — `MAP000032`

- 旧後半MAPレイアウトは変更しない。
- 表示名を統合の祭壇へ整理。
- `nadirCaveCleared` 前は通常進入不可。
- 魔王城→奈落への洞窟→統合の祭壇という体験順を保証する。

## 5. ガルヴァニア内部正本（プレイヤーへ漏らさない）

- 渓谷の門を破壊したのは **アラン**。
- アランは光の力の制御を習得済み。
- ヴェルド、ジャスパーらを伴って渓谷を突破し、統合の祭壇へ向かっている。
- 渓谷では正体を伏せる。「光属性で破壊された」と断定できる痕跡も置かない。

## 6. save互換

- 旧座標 x31,y40 系の `visited.GALVANIA_CAVE` は新 `GALVANIA_GORGE` 発見へ移す。
- 旧洞窟発見だけで、新しい奈落への洞窟を発見済みにしない。
- 旧魔王城発見済みかつ十分進行済みのsaveは `GALVANIA_EMPIRE` 発見へ移行。
- すでに `abyssOuterReached` または storyStep>=10 の旧saveは `nadirCaveCleared` を補完し、新ダンジョン追加で逆戻りさせない。
- 奈落への洞窟の旧 `north` / `south` entry key は互換aliasとして残す。

## 7. Phase 8B で実装した内容

- 三大魔族は **全員男性**として正典・会話を統一。
- ゼルドラス: 聖女ルーナを人間側へ任せられず、闇プリズムの再利用を警戒して戦う。
- エルメナス: 王国が過去に闇プリズムを奪った事実を根拠に人間を信用せず、知略担当らしく「見たものを自分で考えられるか」を問う。
- ベレト: 思想差より、魔王ゼノンへの謁見に値する実力を戦闘で測る。
- 旧魔王城1Fのクリア後限定 item/weapon/armor 3ショップを削除。
- ガルヴァニア帝国へ Rank65 の雑貨店・武器店・防具店を移管。攻略前から店舗NPCは存在するが取引拒否、`darkCastleCleared` 後に営業開始。
- 店舗 local 座標: 雑貨 `x9,y11` / 武器 `x9,y21` / 防具 `x45,y21`。

## 8. 次にやること

最優先は **魔王城Phase8C — 城内の生活／防衛描写とゼノン戦後の本編再構成**。

- 魔王城／帝国内に、負傷魔族・非戦闘員・避難民・深淵防衛の痕跡を追加する候補を監査。
- 三幹部とシャニーの10年間の関係は、三戦だけで説明しきらず、城内NPCやクリア後会話で少しずつ見せる。
- ゼノン戦後、玉座裏の闇プリズムが無傷であることを即目視する既存演出を維持・強化。
- `DARK_CASTLE_CLEAR` / `dark_castle_clear` はまだ旧一括処理が残るため、四者研究、シャニー加入、第二次統合の地鳴り、奈落への洞窟導線へ段階化する。
- ゼノン／シャニー周辺の大幅な会話書き換えは、実装前にMarkdown稿を作成してレビューする。

## 9. 絶対に戻さない品質基準

- 長い新規会話はユーザー承認稿を正本にする。
- プレイヤー向け文章へ内部state/制作都合を出さない。
- 「見れば分かる」情報をナレーションで重ねすぎない。
- 隠し設定を説明台詞として悟らせない。
- 新規M0を最終地理とみなさない。
- 既存saveの報酬二重取得・進行不能を作らない。
- assetsなし配布物のvalidator失敗へ合わせて製品参照を削除しない。

## 10. 検証

工程ゲート:

- `node --check story.js main.js map.js dungeon.js phaser-field.js news.js`
- `node tools/validation/validate-crystal-tree-six-element-phase7d.js`
- `node tools/validation/validate-system-input-update-20260810.js`
- `node tools/validation/validate-galvania-geography-phase8a.js`
- `node tools/validation/validate-news-data.js`
- 最終: `node tools/validation/run-all.js`

最終実行結果は同梱validation logを参照すること。
