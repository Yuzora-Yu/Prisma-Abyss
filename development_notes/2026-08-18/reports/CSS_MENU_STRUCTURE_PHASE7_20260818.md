# CSS / menu structure Phase 7 — 実績・仲間編成・耐性表示

## 対象

Phase 6 適用済み環境を基準に、ユーザー確認で見つかった以下を修正した。

- 仲間詳細「属性耐性」の表記を `属性耐性（環境補正有）` へ変更。
- 仲間詳細の耐性3カードに残っていた旧グレー系 inline style を semantic class へ移行。
- 実績画面の「集計」「一括受取」「絞り込み」「カテゴリ」をページ面と同じ暗い茶色へ整理。
- 実績の「全て / 未達成 / 達成済み」はページ切替タブではなく、コンパクトな segmented filter として再構成。
- 仲間編成のスクロール面をページ色に統一し、仲間カードの背景を明るい独立茶色から一段暗いカード面へ変更。
- メニュー内 select / input / textarea の旧青灰色基調を茶色基調へ統一（ガチャは既存保護のまま）。
- Service Worker の App Shell キャッシュ名を更新。

## 「現環境補正込み」について

Phase 6 の現行ソースと元ZIPを検索した範囲では、実装文字列は `属性耐性（環境補正込み）` の1系統で、`現環境補正` は見つからなかった。

表示DOMと手元ソースが一致していなかった場合は、旧JSをService Worker/ブラウザ側が保持していた可能性があるため、今回 `CACHE_NAME` を更新している。最終表示文字列は `属性耐性（環境補正有）` に固定した。

## 実績画面の構造

旧状態では overview / controls 自体に「別の持ち上がった茶色パネル」を当て、その内部にさらにグレー系の集計カード・ボタン・selectを置いていたため、Phase 6 の「ページ本体は暗い茶色」という方針と衝突していた。

今回、以下の所有関係へ変更。

- `achievement-overview` : ページ面そのもの
- `achievement-rate-card` / `achievement-summary-card` : ページ上の小カード
- `achievement-filter-rail` : ページ内フィルター（ページタブではない）
- `achievement-category-row` : 同じフィルターツール群
- `achievement-list` : ページ面そのもの

`全て / 未達成 / 達成済み` は3個の独立ボタンではなく、1つの外枠を共有する segmented control とした。

一括受取は、
- 受取可能: 金
- 受取なし: 暗い茶色
とし、無効状態だけ古いグレーへ落ちる状態をやめた。

## 仲間編成カード

`#sub-screen-party .scroll-area` の背景を `--menu-page` へ統一。

仲間カードは従来の `--menu-panel-raised`（比較的明るい茶色）から、ページ面に近い濃い茶色へ下げた。カードの識別は大きな色差ではなく、薄いブロンズ枠とごく弱いハイライトで行う。

タブは Phase 6 の独立したページ内タブ構造を維持。

## 仲間詳細の耐性カード

`menus_allies.js` に残っていた以下の旧inline色を削除した。

- `background:#222`
- `background:#2a2a2a`
- `border:#444`
- ラベルの `#aaa`

代わりに下記classへ移行。

- `.ally-resistance-grid`
- `.ally-resistance-card`
- `.ally-resistance-card-title`
- `.ally-resistance-rows`
- `.ally-resistance-row`

これにより DevTools 上でも「元はグレー、CSSの !important で茶色にしている」という二重構造を減らした。

## cascade整理

Phase 6 → Phase 7:

- `modern-polish-menu.css` の `!important`: 254 → 251
- modern-polish 7分割CSS合計の `!important`: 1201 → 1198
- runtime style audit findings: 1806 → 1766
- `menus_achievements.js` findings: 42 → 15
- `menus_allies.js` findings: 242 → 229

今回追加した実績コンポーネントは、古い achievement surface selector の所有対象から外したうえで記述しており、新規 `!important` で押し返す方式にはしていない。

## 検証

- root JS 63ファイル: `node --check` OK
- CSS 10ファイル: PostCSS parse OK
- `validate-news-data.js`: OK
- `validate-achievement-notification.js`: OK
- `validate-menu-state-ownership.js`: OK
- Chromium computed-style regression:
  - 既存18組の状態差 OK
  - 仲間編成 scroll surface = `--menu-page`
  - 仲間編成 card = muted brown
  - 実績 overview / controls / list = `--menu-page`
  - 実績 summary card = brown
  - 実績 category select = brown
  - 実績 filter rail = gap 0 / padding 0 の segmented control
