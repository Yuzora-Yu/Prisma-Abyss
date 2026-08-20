# CSS Cascade Cleanup Phase 4 — 2026-08-18

## 目的
Phase 3 hotfix で発生した「仲間詳細の選択中タブが黄色にならない」回帰を起点に、`modern-polish-*` とメニューJSの inline style / state class の競合を詳細監査した。

今回は見た目の全面改修ではなく、**状態表示（選択中 / ON-OFF / 利用可能 / 選択済み）が legacy の `!important` に隠されない構造へ移す**ことを優先した。戦闘・会話ロジックは変更していない。

## 回帰の根本原因
仲間詳細タブでは、新しい `.menu-tab-button.is-active` が正しく付いていた一方、旧ルールの高 specificity + `!important` がタブボタンの背景・文字色を上書きしていた。

同じ構造を横断監査したところ、タブだけの問題ではなかった。JS が `style="background:..."` や `element.style.background = ...` で状態を示していても、CSS 側の `.sub-screen .btn` / `.list-item` / `.menu-surface-card` に `!important` があると inline style が負ける箇所が存在した。

## Phase 4 で確認した実害・潜在不具合
Chromium の synthetic DOM + computed style 検証、およびソース監査で以下を確認した。

### 既に表示差が消えていた状態
- 仲間詳細: 「基本 / 装備 / スキル / 特性」の active 表示
- パーティ作戦: 選択中作戦と未選択作戦
- 仲間特性: ON / OFF
- 所持装備: 「選択売却」の選択あり / なし
- 実績: 一括受取可能 / 受取対象なし
- ギルド: 移動可能 / 移動不可

### 同系統の競合として追加で修正した箇所
- 仲間スキル設定: 使用可 / 使用否が `.btn !important` に依存していた
- 仲間特性: 装備固定 / 固定ON、および装備由来カードの枠色が `.menu-surface-card !important` に負ける構造だった
- 実績一覧: 達成済みを示す左枠色が `.list-item` の `border-color !important` に負ける構造だった
- 鍛冶: 強化素材の選択状態を inline background/border で表現しており、`.list-item !important` に負ける構造だった
- セーブ・設定: ラジオ選択行の背景・枠色を inline style で切り替えており、`.list-item !important` に負ける構造だった
- ギルド依頼の移動/挑戦ボタン: inline 色指定ではなく既存の semantic action tone に統一した

## 実装方針
状態を色コードで推測・上書きするのではなく、状態 class を唯一の表現入口にした。

代表例:
- `.menu-tab-button.is-active`
- `.menu-choice-button.is-active`
- `.skill-usage-toggle.is-enabled / .is-disabled`
- `.ally-trait-toggle.is-on / .is-off`
- `.achievement-entry.is-completed / .is-incomplete`
- `.smith-material-item.is-selected`
- `.config-radio-row.is-selected`

新しい semantic state rule には `!important` を使っていない。legacy `.btn/.list-item` から状態部品を外すことで specificity 競争そのものを避けている。

## CSS ownership の修正
`#skill-list-container .skill-usage-toggle` は仲間メニュー専用なのに `modern-polish-field.css` に置かれていた。Phase 4 で `modern-polish-menu.css` へ移し、`.btn` 依存も外した。

これにより field stylesheet に仲間メニュー専用 selector は残っていない。

## !important の変化
Phase 3 hotfix 基準の実宣言数:

- `modern-polish-menu.css`: **287 → 256**（-31）
- `modern-polish-field.css`: **105 → 93**（-12）
- modern-polish 7分割合計: **1247 → 1204**（-43）

`opening.css` と `runtime-components.css` を含む実行時CSS全体では `!important` 実宣言は 1212。

今回の目的は数だけを減らすことではなく、**semantic state 側の `!important` を 0 にしたまま表示差を成立させること**。

## JS / CSS 競合監査の改善
`audit-runtime-style-sources.js` を Phase 3 の分割CSSに追従させ、loader だけではなく実際に読み込まれる全CSSを解析するよう修正した。

現在の監査結果:
- `[style*=...]` 依存ルール: **0**
- `[id$="-tabs"]` の wildcard tab ルール: **0**
- semantic tab/filter state rule の `!important`: **0**
- 実行時 `<style>` 注入: **0**
- runtime stylesheet と静的 stylesheet の完全 selector/property overlap: **0**
- inline `!important`: **0**
- stateful menu button の inline background/border/color: **0**
- `style.setProperty(..., 'important')`: **4**（全て `gacha.js`。今回の保護範囲外として維持）

なお runtime style source の検出は 1816 件残る。その内訳は inline markup 1328、style property assignment 426、cssText assignment 55、style object assignment 3、gacha の important 4。多くは位置・サイズ・表示切替などの layout 用であり、**1816件すべてが競合や死コードという意味ではない**。次工程では presentation/state と layout を分離して段階的に減らす。

## 回帰検証
### 静的検証
- root JS: 63/63 `node --check` OK
- root CSS: 10/10 PostCSS parse OK
- NEWS_DATA validation OK
- achievement notification regression test OK
- CSS split ownership validation OK
- menu state ownership validation OK

### Chromium computed-style 検証
実CSSを読み込んだ synthetic DOM で、以下 **16組すべてが異なる computed style を持つことを確認**した。

1. 仲間詳細 active / inactive tab
2. パーティ active / inactive tab
3. filter active / inactive
4. 作戦 selected / unselected
5. スキル使用 enabled / disabled
6. 特性 ON / OFF
7. 装備由来特性カード / 通常カード
8. 装備固定 / 固定ON badge
9. 所持装備の選択売却 has-selection / empty
10. 実績 completed / incomplete
11. 実績一括受取 has-claim / empty
12. 鍛冶素材 selected / unselected
13. 鍛冶素材強化 ready / unavailable
14. ギルド移動 available / unavailable
15. デイリー報酬 available / claimed
16. 設定ラジオ selected / unselected

フルゲームを自動遷移しての全画面 pixel diff ではなく、cascade の再発防止に焦点を当てた computed-style テスト。実機/検証環境での画面確認は引き続き必要。

## 保護領域
- `battle.js` 未変更
- 会話 / story ロジック未変更
- battle CSS 未変更
- field の見た目用ルール未変更（`modern-polish-field.css` から仲間メニュー専用 skill-toggle ルールだけを移動）

## 次工程の推奨
次は `modern-polish-menu.css` に残る legacy `.sub-screen .btn` / `.list-item` の broad `!important` を、画面・部品単位の semantic class に置き換える。特に generic `.btn` を「通常操作」「action」「danger」「back」に分離すると、JS inline presentation をさらに安全に削減できる。
