# CSS cascade cleanup Phase 1 — 2026-08-18

## 目的

`modern-polish.css` と JavaScript / HTML 内の inline style・runtime style injection が積み重なった状態を、既存表示を変えないことを最優先に整理する。

今回の保護条件は以下。

- 戦闘画面・会話画面・フィールド画面のデザイン変更はしない。
- 値が異なる上書きは、フォールバックや意図的な段階調整の可能性があるため、この段階では機械削除しない。
- 「同一セレクタ・同一 at-rule 条件・同一 property・同一 value・同一 important 状態」で後方に同じ宣言がある場合のみ、前方宣言を確実な重複として削除する。
- JS の動的な位置・幅・表示状態・演出値は、CSS へ一括移動しない。

## 実施結果

### modern-polish.css

| 指標 | 作業前 | 作業後 | 差分 |
|---|---:|---:|---:|
| 行数 | 8,038 | 7,785 | -253 |
| CSS rule | 1,335 | 1,303 | -32 |
| declaration | 4,851 | 4,631 | -220 |
| `!important` declaration | 1,353 | 1,247 | -106 |

機械的に証明できる完全重複 declaration を 226 件削除した。そのうち 110 件が `!important`。

作業後に同じ重複検出を再実行し、追加で削除可能な完全重複は 0 件であることを確認した。

### JS と CSS の競合整理

今回、特に「JS の style 値を CSS が状態判定に使う」箇所を確認した。

#### 仲間編成タブ

従来は `menus_party.js` が選択中タブへ `background:#ffd700`、非選択へ `background:#111` を inline 指定し、`modern-polish.css` 側にも `[style*="background:#ffd700"]` / `[style*="background:#111"]` 判定が存在していた。

ただし現在は既に `active` / `is-active` class が付与されており、CSS 側にも class ベースの状態ルールがあるため、inline 色を状態信号にする必要がなかった。

今回以下へ変更した。

- JS は `active` / `is-active` と `aria-selected` を管理する。
- タブ色は `modern-polish.css` が管理する。
- party 専用の `[style*=background...]` セレクタを削除した。
- fixed なレイアウト値だけは今回は JS 側に残し、共通タブ部品化は次段階へ送った。

これにより、仲間編成タブについては「色コードを変更すると状態判定まで壊れる」依存を解消した。

#### 仲間詳細のスキル使用可否ボタン

`menus_allies.js` では `is-enabled` / `is-disabled` class が既に付いている一方、同じ background / color を inline `!important` でも指定していた。

`modern-polish.css` に class ベースの完全な状態ルールがあるため、inline `!important` を削除した。

#### 仲間詳細カード

`menus_ally_detail.js` の静的カード画像には、既存 CSS と同じ `animation:none` / `opacity:1` が inline `!important` で重複していたため削除した。

カード本体の固定 width / height / aspect-ratio / animation も動的値ではないため、既存の `.ally-detail-premium-card` scoped CSS へ移動した。クリック可能状態は `is-portrait-interactive` class へ変更した。

これにより、メニュー JS の生成 markup に直接書かれていた `!important` は今回の対象箇所では 0 になった。

## 現在残っている JS / CSS 競合ポイント

### 1. `[style*=...]` に依存する CSS

`modern-polish.css` には現在も 11 rule が style attribute selector を含む。

主な用途は以下。

- `background:#ffd700` / `#111` を選択・非選択として解釈する旧タブ群
- `#d00` / `#500` を危険系操作として再塗装するルール
- `#004` / `#004444` を青系操作として再塗装するルール
- `#333` / `#222` / `#252525` / `#1a1a1a` など古いグレー面を茶系へ再塗装するルール
- inventory / blacksmith / achievements の inline background を状態判定に使うルール

ここが今後の最優先整理対象。

ただし一括削除すると `menus_status.js`、`menus_allies.js`、`menus_ally_detail.js`、`menus_exchange.js`、`menus_inventory.js`、`menus_achievements.js`、`blacksmith.js` などの表示状態が変わる可能性があるため、画面単位で class 化してから削除する。

### 2. runtime stylesheet injection

実行時に `<style>` を追加する箇所は 5 系統確認した。

- `equip_acquisition_card.js` — 装備獲得カード
- `facilities.js` — shop UI redesign
- `menus_inventory.js` — 所持装備カード
- `tutorial.js` — tutorial modal
- `story_logic.js` — credits keyframes

これらは `modern-polish.css` の読み込み後に head へ追加されるため、同じ specificity / importance なら runtime style 側が後勝ちになる。一方 `modern-polish.css` の `!important` は runtime normal declaration より強い。

静的解析で「同一 at-rule context・同一 selector・同一 property」の完全一致競合は 0 件だった。ただし generic selector（例 `.btn`、`.list-item`）が同じ DOM に当たる可能性は残るため、「競合なし」とは断定しない。

これらは現状かなり component 固有に scoped されているため、Phase 1 では移動しない。

### 3. JS の inline `important` priority

`gacha.js` に `style.setProperty(..., 'important')` が 4 箇所残る。

これは今回のメニュー整理対象外で、ガチャ演出系 CSS と直接関係するため触っていない。

### 4. JS inline style 全体

root runtime の JS / HTML 40 ファイルに style 生成・変更パターンが存在する。監査スクリプト上は 1,820 finding。

これは「1,820 箇所すべてが悪い」という意味ではない。

以下は JS に残すべきもの。

- `display` の状態切替
- HP / MP / progress width
- field / effect の座標やサイズ
- rarity / element などデータに依存する色
- CSS custom property へ渡す runtime 値
- 一時モーダルの z-index / position など実行時状態

一方、以下は CSS 側へ移す候補。

- 常に同じ padding / gap / font-size / border-radius
- タブの active / inactive 色
- ボタン種別を色コードで識別しているもの
- 生成カードの固定 background / border / layout

## 次段階の推奨順序

1. `menus_status.js` のタブを class state 化
2. `menus_allies.js` / `menus_ally_detail.js` の旧タブを class state 化
3. `menus_exchange.js` のタブを class state 化
4. inventory / achievements / blacksmith の「色コードを状態信号にしているボタン」を class 化
5. 上記移行済み画面に対応する `[style*=...]` selector を削除
6. その後で初めて、値の異なる古い `!important` chain を画面単位で削る

値の異なる古い override は、たとえば `100vh` → `calc(var(--vh) * 100)` のように fallback として意味があるケースも含むため、単純な「後ろが勝つから前を消す」は行わない。

## 保護領域

今回、以下の機能ロジック / UI の実装ファイルは変更していない。

- `battle.js`
- `story.js`
- `story_logic.js`
- `main.js`
- `polish.js`
- field / control 系 JS

`modern-polish.css` 内では完全重複だけを削除したため戦闘・会話セレクタの記述量は減っているが、後方に同一 selector / property / value が存在する宣言だけを対象にしている。

## 検証

- root の JavaScript 63 ファイルに `node --check` を実行: OK
- `modern-polish.css` を PostCSS parser で parse: OK
- 完全重複削除スクリプトを再実行: 追加削除 0 件
- runtime style source audit を再実行
- 提供 ZIP には README 記載の `tools/validation/run-core.js` が含まれていないため、同 validator は実行不可
- この実行環境ではローカルゲームを Chromium で自動操作する visual regression が成立しなかったため、画面ピクセル差分は未実施

次の class 化フェーズからは表示に触れる範囲が増えるため、PC / スマホ実機またはユーザー環境でのスクリーンショット比較を併用するのが安全。

## 変更・作成したファイル

変更・作成したファイルは下記の9件です。

1. `modern-polish.css`
2. `menus_party.js`
3. `menus_allies.js`
4. `menus_ally_detail.js`
5. `development_notes/2026-08-18/reports/CSS_CASCADE_CLEANUP_PHASE1_20260818.md`
6. `development_notes/2026-08-18/validation/remove-exact-css-duplicates.js`
7. `development_notes/2026-08-18/validation/exact-css-duplicate-removals.json`
8. `development_notes/2026-08-18/validation/audit-runtime-style-sources.js`
9. `development_notes/2026-08-18/validation/runtime-style-source-audit.json`
