# PRISMA ABYSS — 火山グラド初戦 AUTO制限解除 2026-08-11

## 目的

イグニス火山のイベント専用グラド初戦（803010）で設定されていた `forceAutoOff: true` を撤去し、通常のAUTO切替を使用可能にする。

## 変更範囲

`story.js` 内のグラド初戦3入口すべてを更新した。

- `fire_volcano_soldiers_encounter` の兵士撃破済み再入場経路
- `fire_volcano_soldiers_clear` の兵士戦から続けて開始する経路
- `fire_volcano_glad_retry` の再戦経路

上記3つの `BOSS value:803010` から `forceAutoOff` を削除した。

## 維持した仕様

AUTO制限以外のグラド初戦仕様は変更していない。

- HP50%でイベント勝利
- `targetMonsterId:803010`
- `storyVariantOf:301010`
- 大技223/224の収束失敗ルール
- 図鑑除外
- EXP / Gold / Drop / Quest Progress / Recruit の抑止
- 既存の勝利後イベント導線

## Validator

`tools/validation/validate-grad-first-battle-phase4.js` を現仕様へ更新し、3入口すべてで `forceAutoOff` が設定されていないことを検証する。

専用validatorはPASS。

全体suiteは変更前・変更後とも `19/74 FAIL`。FAIL集合は既知のassets欠損・旧前提validator等で、今回変更由来の新規FAILは0。

## 備考

旧 `docs/work/PHASE4_GRAD_FIRST_BATTLE_STATUS_v1.md` は当時のPhase4完成時点を記録した履歴資料のため改変せず、本addendumを2026-08-11時点の新仕様として優先する。
