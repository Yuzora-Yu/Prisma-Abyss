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
