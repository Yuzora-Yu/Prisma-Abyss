# PRISMA ABYSS HANDOFF 2026-08-15

## 現在地点

2026-08-14までの作業記録と現行runtimeを再監査した。

直近大型項目の多くは2026-08-13までに実装済み。
2026-08-14のparty trailもruntime・docs上は実装済みとして扱う。

## 今回進めたこと

### 1. 全体キュー再整理
- 8/12の大型未実装項目が8/13に解消済みであることを確認。
- 8/14保留2件を明確化。
  - 初回画像キャッシュ方針
  - 幼少アルス32×32候補接続

### 2. JavaScript静的確認
- トップレベル62 JS
- `node --check`: 62/62 PASS

### 3. 輪廻の結晶整合監査
旧「オクタプリズマ」は名前だけでなく生成イベント構造が最新canonと不一致。

新規proposal:
- `docs/scenario/44_CYCLE_CRYSTAL_RITUAL_REALIGNMENT_PROPOSAL_20260815.md`

review queue:
- `DR-20260815-cycle-crystal-octaprism-realignment`

runtimeは未変更。

## 保留

### 初回画像キャッシュ
`development_notes/2026-08-14/reports/initial-asset-cache-audit.md` の3層案は、
現行 `AGENTS.md` の全量キャッシュ指示と衝突する。
ユーザーが方針変更を明示するまで現行維持。

### 幼少期アルス歩行画像
候補はQA済みだが本体未接続。
承認なく差し替えない。

## 次に行う作業

### ユーザーが輪廻の結晶proposalを承認した場合
1. story eventを六精霊即時grantから結晶樹帰還型へ変更。
2. Item 701008の表示名・説明変更。
3. 旧save互換migration。
4. battle/player-facing log変更。
5. news更新。
6. targeted validation。

### 承認前でも進められる非破壊作業
- party trail / section / procedural volcanoの静的回帰監査
- 旧validator期待値と最新仕様の差分整理
- PC/スマホ実機確認項目のチェックリスト整備
- asset cache容量監査の設計だけ継続（runtime方針は変更しない）

## 重要ルール

- legacy dialogueは承認前に置換しない。
- システム/UI文言も現行/修正案を提示してから。
- scenario変更はMarkdown先行。
- `octaprism*` 内部keyはsave互換のため当面維持。
- player-facing変更を実装した日は `news.js` を同日1レコードへ統合。

---

## 2026-08-15 追加継続: レクスノート地下導線安定化

ユーザー実機指摘を受け、レクスノート邸地下B4～B5（隠し書庫）を再監査した。

### 修正済み
- B4からB5へ進む階段が「上の階へ」と表示される問題を修正。
  - 原因: B5ラベル「隠し書庫」が「地下」を含まないため、共通上下判定が地下→地上と誤認していた。
  - `REXNOTE_BASEMENT` に地下深度モードを明示し、同一迷宮内の4→5を下りとして扱う。
- B5上部の帰還マスを踏んだ瞬間に退出する挙動を、この地点だけ明示操作式へ変更。
- B5上部からの帰還先を `REXNOTE_ESTATE (13,7)` に固定し、固定MAP定義を解決した上で安全判定へ渡すようにした。
- 既存の他固定ダンジョンS出口は従来どおり踏み込み退出を維持。

### ボス戦点検
- 301033 魔導司書レグルス
- `rexnote_regulus_battle` → `rexnote_regulus_clear`
- `rexnoteRegulusDefeated`
- Item 701013 `レクスノートの魔道書`

上記の勝利後連鎖に静的な切断は確認されなかった。

### 続きの非破壊監査
- top-level JS `node --check`: 62/62 PASS
- map section / Rees / procedural Undersea Volcano regression: PASS
- party trail static contract: PASS

輪廻の結晶proposalは引き続き承認待ち。承認前のruntime変更は行っていない。

---

## 2026-08-15 追加継続: アラン光魔剣士覚醒／Phase17本筋ゲート

### アラン再加入
- ジャスパー撃破後の即時加入、レガシオンでの後日加入の双方で、`ALLY 201` → 指定システム会話 → `SET_JOB 光魔剣士` → +1,000,000EXP の順へ統一。
- 汎用 `SET_JOB` story action と恒久 `jobOverride` を追加。ロード後にマスター職 `魔法剣士` へ戻る旧補正も `jobOverride` 優先へ変更。
- 既に旧版で再加入済みのsaveは演出を捏造せず、職業と現在Lvまでの光魔剣士skillだけを一度補正。
- 再加入後の人物像は、礼儀正しく知的な外面と、承認欲求・敗北への敏感さ・アルスへの敬意と嫉妬が同居する二面性を維持。既存台詞の無断改稿は行わない。

### Phase17本筋導線
- 監査で、六精霊未完了でもイルミナシア撃破だけで終焉の祭壇へ入れる余地を確認。
- 固定ダンジョンlinkへ `requiredFlags[] / missingFlags[]` 共通判定を追加。
- クロノアビス7層→終焉の祭壇は `abyssIlluminaciaDefeated` + `abyssAllSpiritTrialsCleared` を必須化。
- `abyss_final_altar_encounter` 側にも六精霊完了guardを追加。
- 五楔仕様は維持。ヴェルドは闇、ジャスパーは再登場させない。

### 検証
- `ALAN_PHASE17_MAINLINE_CHECK_20260815.js`: 18/18 PASS。
- top-level JS `node --check`: 62/62 PASS。

### 次の承認境界
- 本筋で残る大きな既存本文変更は、六精霊完了直後の旧オクタプリズマ即時授与を、結晶樹での輪廻の結晶生成へ再構成する工程。
- これは既存会話・Item 701008 player-facing文・授与タイミングの修正を伴うため、ユーザー承認前にはruntime置換しない。


---

## 2026-08-15 追加継続: 輪廻の結晶／Phase17終盤接続 完了

ユーザーが旧「オクタプリズマ即時授与」から結晶樹での輪廻の結晶生成への再構成を明示承認したため、承認境界を解除してruntimeへ反映した。

### 本編導線
- 六精霊完了直後は完成品を渡さず、六つの結晶片が呼応して結晶樹への帰還を促す。
- 結晶樹のミネルバへ循環の儀stateを追加。
- ミネルバが `水→風→光→火→雷→闇→水` を循環させ、ルーナと焼け焦げたペンダントが反応。リュシオンは人間側の到達した理論へ立ち会う。
- Item 701008はIDを維持してplayer-facing名を「輪廻の結晶」へ変更。
- ヴェグナシス撃破後、終局統合陣の固定化へ輪廻の結晶が対抗するsceneを追加してからアゼルガラグ戦へ続く。

### 終焉の祭壇ゲート
正規進入・イベント本体の双方で以下の三条件を要求する。
1. `abyssIlluminaciaDefeated`
2. `abyssAllSpiritTrialsCleared`
3. `abyssCycleCrystalCreated`

五楔／ヴェルド闇／ジャスパー不参加の現行正本は変更していない。

### save互換
- 旧701008所持済み: 同じIDを輪廻の結晶として扱い、儀式は強制再演しない。
- 六精霊完了・701008未所持: `abyssCycleCrystalRitualPending` で結晶樹へ誘導。
- 旧版でヴェグナシス以降へ到達済み: 新ゲートでsoftlockしないよう、必要なItem/flagを一度だけbackfill。
- 内部 `octaprism*` key/stateはsave・battle互換のため維持。

### 検証
- `CYCLE_CRYSTAL_PHASE17_CHECK_20260815.js`: 26/26 PASS。
- top-level JS `node --check`: 62/62 PASS。
- `tools/validation/validate-news-data.js` は今回のstaged sourceに存在しないため実行不可。専用validatorで2026/08/15のNEWS_DATAが1件のみであることを確認。

### 現在地点
Phase17終盤の「六精霊 → 輪廻の結晶 → 五楔ヴェグナシス → アゼルガラグ」は一本の本編導線として接続済み。
ロードマップ上の次工程はPhase18「全地域NPC／日記／再訪差分」。既存 `placementId / actorId / stateId` 基盤を拡張し、本編進行に伴う町人の段階会話を同一人物IDで管理する。

## Phase 18開始 — リュミナ村／イグニシア段階NPC Batch 1

Phase 17本編は輪廻の結晶生成まで接続済み。本編が一本通る状態を基準に、ロードマップPhase 18「全地域NPC／日記／再訪差分」へ移行した。

### 共通NPC段階管理

`MapRegistry.isProgressEntryActive()` に `stepMin / stepMax / subMin / subMax` を追加し、`mapActors[].states[].when` で本編進行段階を直接評価できるようにした。

同一人物を進行ごとに別actorへ増やさず、固定 `actorId` + 複数 `stateId` で管理する。

### Batch 1 runtime接続

- リュミナ村: パン焼きの女 `lumina_baker_01`
- リュミナ村: 山羊を探す少年 `lumina_goat_boy_01`
- イグニシア: 炊事番 `ignisia_communal_kitchen_01`
- イグニシア: 湯屋の老人 `ignisia_bath_elder_01`

少年の洞穴攻略後会話では、サラが現在パーティにいる場合だけ `IF_ALLY` で短い反応を挟む。

既存NPC会話は変更していない。配置も店・出口・既存actor・重要mapAction座標と衝突しないことを専用検証済み。

### Validation

- Phase18 staged NPC: 35/35 PASS
- Cycle Crystal Phase17 regression: 26/26 PASS
- top-level JS node check: 62/62 PASS

### 次工程

Phase18を継続。次はカザリア／水上都市を優先し、既存NPC密度と再訪導線を監査してから、承認済み新規草稿を同じ `actorId/stateId` 方式で接続する。シャニー等の既存関係性を直接改稿する会話は別の修正承認境界として残す。
