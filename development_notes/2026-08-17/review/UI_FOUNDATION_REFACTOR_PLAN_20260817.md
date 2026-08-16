# UI基盤改修計画 — 2026-08-17

対象: 旧監査 22 / 23 / 24 / 25。ゲーム進行ロジックと分離し、画面単位で回帰確認しながら段階導入する。

## 22. CSS / UI primitive

**2026-08-17 第1段階:** `modern-polish.css` に既存値と同値のcontrol/spacing/radius tokenを追加し、基礎 `.btn` / `.menu-btn` だけtoken参照へ移行。見た目を変えず、以後の画面単位移行の入口を作成した。


- 新規inline styleと新規`!important`を原則増やさない。
- 色、文字サイズ、余白、角丸、border、z-indexをtoken化する。
- `panel / section-title / list-row / stat-row / badge / modal / button` を共通primitiveへ寄せる。
- 既存巨大CSSを一括置換せず、画面を1つ移行するたびに旧overrideを削る。

## 23. Accessibility / modal contract

**2026-08-17 第1段階:** `index.html` / `main.html` の `maximum-scale=1.0, user-scalable=no` を撤去し、`viewport-fit=cover` を維持した通常viewportへ変更。モーダルfocus管理は未着手。


- viewport zoom制限を再監査し、モバイル実機でレイアウト崩れがないことを確認した上で拡大を妨げない設定へ移行する。
- `Menu.ensureModalOverlay` / `Facilities.showModal` 系に `role=dialog`, `aria-modal`, initial focus, focus trap, restore focus, Escape/戻る処理を集約する。
- 記号だけの操作ボタンにはaccessible nameを必須化する。
- `prefers-reduced-motion` は動きを消すこと自体を目的にせず、長時間の常時アニメーション等から段階対応する。目的marqueeは今回現行維持。

## 24. Semantic asset registry

**2026-08-17 第1段階:** `PRISMA_ASSETS.uiIcons` を追加し、道具/スキルiconをsemantic keyから解決するよう `menus.js` を移行。未移行iconだけ旧命名規則へフォールバックする。cache warmupにもregistry値を含める。


- 画面側が`.png` / `.svg`を推測しない。
- `semantic icon key -> assets.js path` を正本にする。
- 既存`assets/gacha`は削除しない。ステータス詳細で利用するruntime assetとして保持する。
- 移行はmenu icon等、用途が明確な群から始め、未移行assetの互換参照を残す。

## 25. Menu registry

**2026-08-17 第1段階:** 現行route IDを一切renameせず `Menu.subScreenRegistry` を追加し、`openSubScreen()` のDOM準備/init/feature metadataをregistry adapter経由へ移行。`subScreenFeatureMap` は互換用に残す。


- `id / playerLabel / featureGate / init / backBehavior / iconKey / notificationSelector` を持つregistryへ段階移行する。
- 現行route名（例: `status`, `allies`）はセーブ/外部参照互換を壊さないため、表示名と一致しなくても即renameしない。
- 最初は現行if-chainの振り分け結果をregistryから返すadapterとし、動作を変えずに分散情報だけ集約する。

## 完了条件

各段階でスマートフォン幅（少なくとも320/360/390px）とPC幅、キーボード/タッチ、モーダル復帰、戻る導線、通知badgeを確認する。一括リファクタで4項目を同時に置き換えない。
