# 超レア宝箱・特性書ロック・データ編集ツール実装報告（2026-08-15）

## 実装内容

### 1. ランダム宝箱の超レア枠

ランダム宝箱の通常アイテム抽選と超レア抽選を分離した。

超レア枠は次の4種だけを候補とする。

- Item 107 `転生の実`
- Item 599998 `神鉄の鍛冶台`
- Item 599999 `合成の壺`
- Item 98 `災厄の楔`

`転生の実` の `randomChestDrop:false` は維持する。これは「通常アイテム枠へ混ざらない」ための指定であり、超レア専用プールからは取得できる。

通常宝箱の実・種抽選内で超レア判定へ入った場合と、赤宝箱の超レア判定へ入った場合の双方が同じ4種プールを利用する。超レア取得時は既存の赤黒フラッシュ演出を維持する。

### 2. 特性書由来特性のロック

特性書で追加・上書きした特性へ `source: 'traitBook'` を保存する。

この印が付いた特性は、以下の別経路では変更・消失させない。

- 2000 GEM の特性再抽選
- 仲間モンスター合成時の特性選別

変更可能なのは、別の特性書で同じ交換可能枠を上書きする場合だけ。

現行仕様で7枠目は特性書でしか追加できないため、旧セーブで7枠あるキャラクターについては7枠目を安全に特性書由来として補正できる。過去版ですでに5・6枠目を特性書で交換済みのデータについては、再抽選由来との安全な区別材料がないため推測移行は行わない。

### 3. `editor_job_data.html`

新規開発ツール。

- `skills.js` と `job_data.js` を読み込む。
- 固定jobId順の職業一覧から編集対象を選択。
- Lv1～100の各レベルへ、習得スキルをプルダウン指定可能。
- スキル候補はSkill ID昇順。
- 各候補へ `ID / スキル名 / 種別 / 対象 / MP / 効果説明` を併記。
- 設定済みレベルだけの絞り込みが可能。
- 現行 `JOB_MASTER_DATA` の固定IDを保持。
- 最終的に `job_data.js` をプレビュー／ダウンロード可能。

### 4. `editor_characters.html`

新規開発ツール。

- `skills.js` / `job_data.js` / `characters.js` を読み込む。
- キャラクターごとに職業をJOB_MASTERから選択可能。
- HP / MP / 攻撃力 / 防御力 / 魔力 / 魔法防御 / 素早さ / 命中 / 回避 / 会心を編集可能。
- LB30 / LB50 / LB99 の習得スキルをSkill ID順のプルダウンから指定可能。
- スキル候補へ名称・効果を併記。
- 必要時のみ `lbBase` / `growthBase` も編集可能。
- `JOB_MASTER_DATA` 外の既存 `冒険者` テンプレートは、勝手に別職へ置換せず「現行（JOB_MASTER外）」として保持。
- 編集対象以外のcharacterプロパティを保持したまま `characters.js` をプレビュー／ダウンロード可能。

## 検証

- 専用検証: `EDITOR_TRAIT_ULTRA_CHEST_CHECK: 744/744 PASS`
- トップレベルJavaScript: `62/62 node --check PASS`
- 転職の書回帰: `62/62 PASS`
- 転生EXP・非MAPロジック回帰: `110/110 PASS`
- 輪廻の結晶: `26/26 PASS`
- アラン/Phase17: `20/20 PASS`
- 六精霊・任意加入差分: PASS
- レクスノート地下導線: PASS
- Phase18ゲーム密度: `34/34 PASS`
- Phase18 NPC段階管理: `35/35 PASS`
- 2つの新規HTML内インラインJavaScriptは `node --check` 相当の構文検証を通過。

## プレイヤー向け文言

特性書ロックに伴う新規エラー文言を `docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md` へ追加した。

`news.js` は2026/08/15の既存1レコードへ、超レア宝箱と特性書ロックの変更だけ追記した。開発ツールはプレイヤー機能ではないためNEWSには記載していない。

## 変更・作成ファイル

変更・作成したファイルは下記の15件です。

1. `development_notes/2026-08-15/DELTA_MANIFEST_20260815_ULTRA_CHEST_TRAIT_EDITORS.txt`
2. `development_notes/2026-08-15/reports/SYSTEM_FIX_JOB_CHANGE_BOOK_IMPLEMENTATION_20260815.md`
3. `development_notes/2026-08-15/reports/ULTRA_CHEST_TRAIT_LOCK_DATA_EDITORS_20260815.md`
4. `development_notes/2026-08-15/validation/EDITOR_TRAIT_ULTRA_CHEST_CHECK_20260815.js`
5. `development_notes/2026-08-15/validation/EDITOR_TRAIT_ULTRA_CHEST_CHECK_20260815.log`
6. `development_notes/2026-08-15/validation/EDITOR_TRAIT_ULTRA_REGRESSION_20260815.log`
7. `development_notes/2026-08-15/validation/TOP_LEVEL_JS_NODE_CHECK_20260815_EDITORS_TRAIT_ULTRA.log`
8. `docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md`
9. `dungeon.js`
10. `editor_characters.html`
11. `editor_job_data.html`
12. `main.js`
13. `menus_trait_detail.js`
14. `news.js`
15. `passiveSkill.js`
