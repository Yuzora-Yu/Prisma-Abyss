# PRISMA ABYSS — 2026-08-15 本筋継続 / Phase17監査 / ハヤテ演出

Date: 2026-08-15  
Scope: ロードマップ本筋優先。NPC生活会話拡張は従属作業として扱う。

## 実施内容

### 1. レクスノート邸外ハヤテ演出 — runtime実装

ユーザー指定に従い、従来のflag-only遭遇を以下へ変更した。

1. ハヤテへ話しかける。
2. ハヤテ「・・・・・・」
3. `assets/effect/fx-abyss-vortex-ai.png` をハヤテ座標 `(5,7)` に重ねる。
4. `hayateRexnoteSighted` を立ててハヤテactorを消す。
5. 渦を消す。
6. ガイル「ん、誰かいたのか？」
7. 以後ハヤテは同地点へ再配置されない。

既存 `actorId/stateId/requiredFlag/missingFlag` は維持し、人物IDを増殖させていない。

### 2. Phase17 — 六精霊巡礼導入の不足を特定

現行runtimeはレガシオン神官が地上六プリズムを示唆し、`abyssSpiritPrismKnown` を立てる。

canon v8 §47.2では、その知見を受けてミネルバが「深淵で無理に混ぜ直すのではなく、地上の正常な六属性へ会いに行く」方針を立てる工程が必要。

この新規会話は `docs/scenario/49_PHASE17_PILGRIMAGE_AND_REXNOTE_HAYATE_CONTINUATION_20260815.md` へ実装可能な粒度まで草稿化した。

既存神官会話を直す必要はない。
ただしruntimeへ接続すると六精霊試練の開始条件変更・旧save migrationを伴うため、今回の差分では草稿／実装設計に留めた。

### 3. Phase17 — 輪廻の結晶の既存修正ゲートを維持

現行は六精霊完了直後にリュシオンが「オクタプリズマ」を即時授与する。
canon v8は結晶樹へ戻り、ミネルバの循環の儀で「輪廻の結晶」を生成する。

これは既存実装本文・Item 701008・battle log等の変更を伴うため、既存proposal `44_CYCLE_CRYSTAL_RITUAL_REALIGNMENT_PROPOSAL_20260815.md` を維持し、勝手にruntime置換していない。

### 4. Phase17 — ヴェグナシスが5楔のままという重大差分を新規発見

canon v8 §45.2–46:

- 火: グラド
- 水: シーリス
- 風: エリシア
- 雷: レナード
- 光: ヴェルド
- 闇: ジャスパー

現行runtime:

- 302080 レナード
- 302081 エリシア
- 302082 シーリス
- 302083 グラド
- 302084 ヴェルド（闇）

合計5体。ジャスパー不在。

`battle.js` にも次の5体固定前提が残る。

- visual stage 0–4固定
- fall script 1–5固定
- `Math.min(4, fallCount)`
- final stage 4
- 最終一柱の既存log「四柱の力を取り込み」

このためmonsters.jsへ6体目を足すだけでは正しくない。
`docs/scenario/51_PHASE17_VEGNASIS_SIX_WEDGE_REALIGNMENT_PROPOSAL_20260815.md` に、六楔化・ジャスパーの連続性・battle resumeを含む改修単位を整理した。

302085は現時点の`monsters.js`では未使用であり、ジャスパー柱候補として予約可能。
shared visual方式のため、新規画像を必須にせず既存ヴェグナシス画像を共有する案を優先する。

## NPC段階管理 — サブ作業

ユーザー指示に合わせ、既存の

- `placementId`
- `actorId`
- `stateId`
- `states[].when`

を正本として使い続ける方針を明文化した。

`docs/scenario/50_TOWN_NPC_STAGE_ID_EXPANSION_MASTER_20260815.md` では、シナリオ側 `NPC-AREA-XXX` とruntime `actorId` を一対一で結び、同一人物の再訪差分を別NPCとして増やさない運用へ整理した。

生活NPCは専用工程として大量配置せず、ロードマップ上で町MAPを触る際に通行・イベント・本筋の密度を先に確定してから必要人数だけ接続する。

## 検証

- top-level JavaScript: **62/62 `node --check` PASS**
- `HAYATE_REXNOTE_PHASE17_AUDIT_CHECK_20260815.js`: PASS
  - ハヤテ台詞
  - 渦asset参照
  - actor消失flag順序
  - ガイル反応
  - actor座標／state条件
  - assets.js登録
  - FIELD_CUTSCENE direct src対応
- `REXNOTE_BASEMENT_ROUTE_TARGETED_CHECK_20260815.js`: PASS
  - B4→B5階段方向
  - 隠し書庫退出
  - return resolution
  - レグルスboss chain
  - news
- news 2026/08/15 record: 1件のみ、日付重複なし。

## 次の本筋改修単位

既存テキスト修正の承認後は、Phase17を次の一単位で進めるのが安全。

1. レガシオンでミネルバが巡礼を発案。
2. 六精霊試練開始flagを分離し、旧save migration。
3. 六精霊完了後は即時アイテム授与を止め、結晶樹帰還へ。
4. 結晶樹で循環の儀・輪廻の結晶生成。
5. ヴェグナシスを六楔化。
6. 六楔解放で六芒星臨界。
7. 輪廻の結晶が統合を拮抗させる。
8. アゼルガラグ戦へ接続。

この単位なら「旧オクタプリズマの途中仕様」と「新六楔戦」が同時にplayer-facingへ露出する期間を作らずに済む。

## ファイル一覧

変更・作成したファイルは下記の11件です。

1. `story.js`
2. `news.js`
3. `docs/scenario/07_DIALOGUE_REVIEW_QUEUE.md`
4. `docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md`
5. `docs/scenario/49_PHASE17_PILGRIMAGE_AND_REXNOTE_HAYATE_CONTINUATION_20260815.md`
6. `docs/scenario/50_TOWN_NPC_STAGE_ID_EXPANSION_MASTER_20260815.md`
7. `docs/scenario/51_PHASE17_VEGNASIS_SIX_WEDGE_REALIGNMENT_PROPOSAL_20260815.md`
8. `development_notes/2026-08-15/validation/HAYATE_REXNOTE_PHASE17_AUDIT_CHECK_20260815.js`
9. `development_notes/2026-08-15/validation/HAYATE_REXNOTE_PHASE17_AUDIT_CHECK_20260815.log`
10. `development_notes/2026-08-15/reports/MAINLINE_CONTINUATION_PHASE17_HAYATE_AUDIT_20260815.md`
11. `development_notes/2026-08-15/DELTA_MANIFEST_20260815_PHASE17_HAYATE.txt`
