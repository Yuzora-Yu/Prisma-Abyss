# CSS / Menu UI Phase 5 — 茶色ベースの操作部品と仲間詳細カード

## 目的

Phase 4 / スキル切替 hotfix 適用後の状態を基準に、仲間詳細で残っていた旧グレー系のカード・ボタン表現を整理し、メニュー共通の茶色基調へ寄せる。
戦闘・会話・フィールドの画面構造やロジックは変更しない。

## 今回確認できた競合

### 1. 右上「もどる」が青灰色に戻る原因

`modern-polish-menu.css` 前半に、非パーティ系サブ画面のヘッダーボタンだけを青灰色へ戻す高specificity + `!important` ルールが残っていた。
後方には茶色の共通ナビゲーションルールがあったが、前者の `:not(#sub-screen-party)` が ID specificity を持つため、後方ルールが負けるケースがあった。

対応:
- 青灰色のヘッダー専用overrideを削除。
- 共通ナビゲーション色を `--menu-control-*` トークンへ統一。
- 右上の「もどる」を含む通常メニュー操作を茶色基調へ統一。

### 2. 「スキル習得画面へ」等の枠が消える原因

仲間詳細全体に対して、旧ルールが descendant `.btn` を拾い `border:0 !important` を適用していた。
これはスキルON/OFF回帰と同じ系統の「広い旧セレクタが新しいsemantic componentを潰す」問題だった。

対応:
- 仲間詳細を旧 party-tab skin の対象から完全に除外。
- `menu-action-button` を新設し、背景・枠・文字色をCSS側の責務にした。
- 「スキル習得画面へ」「ボーナスPt振分」「キャラクター詳細を見る」を同じ茶色系操作ボタンへ移行。
- 仲間モンスター解放だけは danger variant として赤茶色を維持。

### 3. `modern-polish-base.css` の旧青灰色 `.btn !important`

新しい `menu-action-button` を作っても、さらに基盤側にある `body.game-page .btn { ... !important }` が背景・色を奪うことを実ブラウザの computed style テストで検出した。

対応:
- 基盤の旧 `.btn` skin を `.btn:not(.menu-action-button)` に限定。
- 新しいメニュー操作部品は旧全画面 `.btn !important` の競合から外した。
- 戦闘等で使う通常 `.btn` の既存挙動は変更していない。

## 仲間詳細スキルカード

旧コードでは各カードが JS 内で `#252525 / #444` を直接持っていた。
今回これを削除し、次のsemantic classに移した。

- `.ally-skill-card`
- `.ally-skill-card.is-hidden`
- `.ally-skill-name`
- `.ally-skill-desc`

通常カードは濃い茶、非表示スキルはさらに沈んだ茶色にした。
ON/OFF状態は従来どおり黄色 / グレーの state button が担当するため、カード背景と状態表示の役割を分離した。

## タブ枠

タブ列の外枠は完全には消していない。
ページ内の切替領域であることは残しつつ、従来より低コントラストの細いブロンズ線へ弱めた。
選択状態の主役は黄色タブで、外枠は領域境界だけを示す設計にした。

## CSS負債への効果

- `modern-polish-menu.css` の `!important` 宣言: 256 → 253
- 分割済み modern-polish 7ファイル合計: 1204 → 1201
- `[style*=...]` CSS依存: 0を維持
- semantic tab/filter state の `!important`: 0を維持
- 実行時 `<style>` 注入: 0を維持
- stateful menu button のinline状態色: 0を維持
- inline `!important`: 0を維持

今回の重要点は数字より、`menu-action-button` が旧 `.btn !important` から独立したこと。
今後、他画面の旧青灰色ボタンを同componentへ移す際に、追加の `!important` で殴り返す必要がない。

## 検証

- root JS: 63 / 63 `node --check` OK
- CSS: 10 / 10 PostCSS parse OK
- menu state ownership validation OK
- Chromium computed-style validation OK
  - 仲間タブ active / inactive
  - スキル使用可 / 使用否
  - ヘッダー「もどる」が茶色
  - `menu-action-button` が茶色
  - `menu-action-button` の1px枠が実際に残る
  - スキルカードが茶色
  - タブレール外枠が存在する
- 実績通知回帰テスト OK
- CSS ownership split validation OK
- NEWS_DATA validation OK
- runtime stylesheet injection: 0
- modern-polish / runtime-components の同一selector-property競合: 0

## 次に見るべき箇所

検証環境ではまず仲間詳細の「基本」と「スキル」を確認する。
特に以下を確認すると今回の変更範囲をほぼカバーできる。

- 右上「もどる」が青灰色ではなく茶色になっている
- 「前 / 次」は暗い茶色で、枠が見える
- タブ外枠は弱く、選択中の黄色が主役になっている
- スキルカードがグレーではなく茶色になっている
- 使用可/表示は黄色、使用否/非表示はグレーのまま
- 「スキル習得画面へ」「キャラクター詳細を見る」に茶色の面と枠がある

## ファイル一覧

変更・作成したファイルは下記の11件です。

1. `modern-polish-base.css`
2. `modern-polish-menu.css`
3. `menus_allies.js`
4. `news.js`
5. `sw.js`
6. `development_notes/2026-08-18/validation/validate-menu-cascade-states.py`
7. `development_notes/2026-08-18/validation/validate-menu-state-ownership.js`
8. `development_notes/2026-08-18/validation/runtime-style-source-audit.json`
9. `development_notes/2026-08-18/validation/static-style-boundary-audit.json`
10. `development_notes/2026-08-18/reports/CSS_MENU_BROWN_FOUNDATION_PHASE5_20260818.md`
11. `development_notes/2026-08-18/DELTA_MANIFEST_20260818_MENU_BROWN_PHASE5.txt`
