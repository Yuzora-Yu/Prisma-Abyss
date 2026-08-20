# CSS Cascade Skill Toggle Hotfix — 2026-08-18

## 症状

仲間詳細 > スキルで、`is-enabled` のスキル使用設定ボタンが黄色にならず、ON/OFF状態が暗色に見える回帰が発生した。

## 原因

`modern-polish-menu.css` の旧互換ルールが、仲間詳細の最上位コンテナ配下にある **すべての button** を高specificity + `!important` で暗色化していた。

```css
body.game-page #allies-detail-content > div:first-child button:not(.menu-tab-button) { ... !important; }
```

Phase 4でスキル設定を `.menu-state-button` のsemantic stateへ移行した際、状態側CSSから `!important` を外したため、この旧ルールが勝つようになった。

前回の回帰テストは `#skill-list-container` を実DOMと異なり `#allies-detail-content` の外側へ置いていたため、この競合を再現できていなかった。

## 修正

旧互換スキンの対象を、仲間詳細内の一般 `.btn` に限定した。

```css
body.game-page #allies-detail-content > div:first-child
  .btn:not(.menu-tab-button):not(.menu-state-button) { ... }
```

これにより `.menu-state-button` は旧 `!important` スキンから完全に分離され、以下のsemantic state CSSがそのまま描画を所有する。

- `.skill-usage-toggle.is-enabled` — 黄色
- `.skill-usage-toggle.is-disabled` — グレー
- `.ally-trait-toggle.is-on` — 緑
- `.ally-trait-toggle.is-off` — グレー

新しい `!important` は追加していない。

## 再発防止

`validate-menu-cascade-states.py` の仲間詳細fixtureを実DOMと同じ階層へ変更した。

さらに「ON/OFFで色が違えばよい」だけでなく、スキル設定について以下を固定値で検証するよう強化した。

- enabled: 金色グラデーション + 暗色文字
- disabled: グレーグラデーション + 明るいグレー文字

`validate-menu-state-ownership.js` には、`#allies-detail-content > div:first-child button` のような全descendant button対象ルールが再導入された場合に失敗するガードを追加した。

## 検証結果

- menu cascade state: 16/16 state pairs OK
- skill enabled exact style: OK
- skill disabled exact style: OK
- menu state ownership: OK
- `NEWS_DATA`: OK (18 records)
- `modern-polish-menu.css`: PostCSS parse OK
- `news.js`, `sw.js`, `menus_allies.js`: syntax OK

## Service Worker

CSS更新を確実に取得するため App Shell cache を `prisma-abyss-v76.20260818` へ更新した。
