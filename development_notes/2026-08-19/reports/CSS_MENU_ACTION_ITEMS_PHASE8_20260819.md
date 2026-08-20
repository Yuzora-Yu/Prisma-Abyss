# CSS Menu Action / Items Phase 8 — 2026-08-19

## 目的

Phase 7 を基準に、次の2点を整理した。

1. 仲間詳細の「スキル習得画面へ」等の操作ボタンを、旧来のクラシックな茶色RPGボタンへ寄せる。
2. 道具画面のカテゴリタブとアイテム一覧を、別々の部品ではなく「同じタブページ」として見える構造へ変更する。

戦闘・会話・フィールドの見た目には手を入れていない。

## 仲間詳細の操作ボタン

`menu-action-button` の役割を明示し、JS側のinlineサイズ指定を削除した。

- `menu-action-button--classic`
  - スキル習得画面
  - ボーナスPt振分
  - 明るめの茶色グラデーション、ブロンズ枠、上面ハイライト、落ち影を使用。
- `menu-action-button--secondary`
  - キャラクター詳細を見る
  - 暗い茶色を維持しつつ、ブロンズ1px枠と内外の影を追加し、ラベルではなくボタンだと判別できるようにした。
- `menu-action-button--danger`
  - 仲間モンスターを逃がす
  - 既存の危険色を維持。

また、全buttonへ適用されていた旧 `:active / .is-pressing` 演出から `.menu-action-button` を除外し、この部品自身が押下表現を所有するようにした。これにより、押下時だけ古い全体用アクセント表現へ戻る競合を避けた。

## 道具画面の構造

`index.html` で `#item-tabs` と `#list-items` を `.item-tab-page` の中へまとめた。

構造は次の形になった。

```text
item-screen-list
└─ item-tab-page        ← 1つの外枠
   ├─ item-tabs         ← 上端のタブ列
   └─ list-items        ← 同じページ内のスクロール領域
```

これにより、タブと一覧は同じ左右幅・同じ外枠を共有する。タブ単体の角丸外枠は廃止し、外側の `.item-tab-page` だけを角丸にした。

アイテム行は `item-list-row` を付与して道具画面が直接所有するようにした。

- 行間のgapは0
- 行の角丸は0
- 行ごとの外側余白は0
- 区切りは1pxの薄いブロンズ線
- 最終行は下線なし
- 一覧背景はタブページ内の濃い茶色

空一覧の色・余白もinline styleから `.item-empty-state` へ移した。

## Cascade整理

道具画面について、旧グローバル `.list-item` とメニュー共通 `.list-item` の対象から `item-list-row / #sub-screen-items` を明示的に外した。

この結果、`modern-polish-items.css` は旧ルールへ勝つための `!important` が不要になった。

- modern-polish 7ファイル合計 `!important`: **1198 → 1170 (-28)**
- `modern-polish-items.css`: **28 → 0**
- runtime style source findings: **1766 → 1761 (-5)**
  - 仲間詳細ボタン4件のinline styleを削除
  - 道具空表示1件のinline styleを削除

## 検証

- root JavaScript: 63/63 `node --check` OK
- CSS: 10ファイル PostCSS parse OK
- `validate-menu-state-ownership.js`: OK
- `validate-achievement-notification.js`: OK
- `validate-news-data.js`: 19 records / latest 2026-08-19 OK
- `validate-menu-cascade-states.py`: 18状態ペア OK
- `validate-menu-phase8.py`: OK
  - classic操作ボタンに枠・立体影が存在
  - secondary暗色ボタンに枠・立体影が存在
  - タブと一覧が同一ページ幅で接続
  - アイテム行のmargin / radiusが0
  - 行間は区切り線のみ

## キャッシュ

App Shell更新のため Service Worker cache を `prisma-abyss-v80.20260819` へ更新した。
