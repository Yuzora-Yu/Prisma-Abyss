# 転生職歴復帰・海底火山ワールド導線 実装報告（2026-08-16）

## 実装概要

### 転生の実

- 表示Lv100で使用。
- 現在職だけでなく、`jobHistory` に記録された過去職から転生後の職業を選択可能。
- 過去職へ戻る際は「転職の書」を消費しない。
- 転生回数+1 / Lv1 / EXP0。
- 他職で習得済みのスキルは維持。
- 選択した職のLv1習得対象のみ不足補完し、転生回数から高Lv技能を誤復元しない。
- `jobTransferJobId` を選択職へ更新し、通常ロードで元のストーリー職へ戻されないようにする。
- 職業特性は現在職だけが発動する既存仕様を維持。

### 海底火山

- `SURFACE_WORLD_MAP_DATA` の各行へ右側20海タイルを追加。横幅110→130。
- 光の宮殿 `(67,48)` を中心に、大灯台 `(21,79)` の点対称となる `(113,17)` を海底火山のワールド座標に設定。
- 基底タイル `(113,17)` は海 `W`。
- `underseaVolcanoRouteOpened` 後にワールド上へ表示・進入可能。
- 大灯台内部の旧直通mapActionを削除し、船でワールド入口へ移動する経路を正規化。
- 初回進入時は `undersea_volcano_world_entry` を実行し、その後固定ダンジョンを開始。
- 第1層からの退出表記を「海上へ戻る」に変更し、固定ダンジョンの通常returnPointで進入した海上へ戻す。
- 雷の要塞の冒険者、水上都市の船大工に位置ヒントを追加。
- App Shell更新のためService Worker cache versionを `v66.20260816` へ更新。
- Story objective 6-2へ「光の宮殿の北東／大灯台と反対側の外海」を追記。

## 新規会話

正本: `docs/scenario/59_REINCARNATION_JOB_RETURN_AND_UNDERSEA_VOLCANO_WORLD_ROUTE_20260816.md`

既存会話 `UNDERSEA_VOLCANO_DEPARTURE` はセーブ／履歴互換のためデータとして残すが、現行MAPからは呼び出さない。

## 聖拳士監査

`development_notes/2026-08-16/review/HOLY_FIST_ALL_MP_SYNERGY_AUDIT_20260816.md` を参照。

- 全MP消費技3種は全て魔法。
- 聖拳士の聖気循環は物理特技限定なので、全MP技持ち込みではHP追加消費／倍率増加は起きない。
- 現行で強いのは高MP物理＋二刀流＋吸血。
- 全MP技は二刀流有効時に現在MP+1を要求して使用不能になる既存挙動があるが、今回は変更していない。

## 検証

- `REINCARNATION_UNDERSEA_ROUTE_CHECK_20260816.js`: 43/43 PASS
- `JOB_TRAIT_SYSTEM_CHECK_20260816.js`: 115/115 PASS
- 既存回帰8スクリプト: 8/8 PASS
- Top-level JavaScript: 63/63 `node --check` PASS
