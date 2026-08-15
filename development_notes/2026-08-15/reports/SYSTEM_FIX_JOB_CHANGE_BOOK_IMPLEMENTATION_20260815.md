# システム修正・転職の書実装報告（2026-08-15）

## 結論

ユーザー指定の6系統を実装した。

1. レクスノート邸地下1階から邸へ戻る階段を、汎用returnPointではなく邸内地下入口前 `(13,7)` へ明示帰還するよう安定化。
2. 戦闘終了ログから「戦闘不能50%」「控え25%」の割合説明行だけを削除。経験値配分率そのものは維持。
3. 転生の実（Item 107）をランダム宝箱抽選から除外。固定報酬・実績・交換・明示ドロップ等の既存取得経路は変更していない。
4. 天使の試練のステータス上昇表示をステータス画面表記へ統一。`ATK/DEF/MDEF/SPD` 等ではなく `攻撃力/防御力/魔法防御/素早さ` を使用。
5. 天使の試練・深淵の亀裂の3体編成で、中央（2体目）の選定Rankを左右の基準Rankより +5～+9 とした。
6. 大灯台南西の小島 `(8～10,83)` を専用生息地化。通常敵は粘体・Rank1～140、レアはメタルジェリー／ロンリーメタル／メタルロードだけ。プリズムキングは出現しない。
7. 全23職の固定 `jobId`、各職の転職の書、キャラクター別職歴・職別到達Lv・転職後スキル継承基盤を実装。

## レクスノート邸地下1階

`REXNOTE_BASEMENT` B1へ `proceduralExitPoint` を持たせた。

- 帰還先: `REXNOTE_ESTATE`
- 座標: `(13,7)`
- 生成済みキャッシュ階層にもテンプレート側の最新exitPointを注入する。

これにより、古い汎用帰還点や直前の別ダンジョン帰還情報に左右されない。

## 戦闘終了EXPログ

削除したのは次の2表示だけ。

- `戦闘不能の仲間は経験値を50%取得した。`
- `控えの仲間は経験値を25%取得した。`

前衛生存100%／戦闘不能50%／控え25%の内部配分は変更していない。

## 転生の実とランダム宝箱

Item 107 に `randomChestDrop:false` を設定し、固定手続き型ダンジョンと深淵系のランダム宝箱候補判定の双方で除外する。

既存キャッシュ階層にItem 107がランダム宝箱として保存されている場合も、現行の候補妥当性チェックに失敗して再生成される。

固定配置宝箱、実績報酬、施設交換、明示的な報酬・ドロップは変更していない。

## 天使の試練・深淵の亀裂

### ステータス表示

- HP → `HP`
- MP → `MP`
- atk → `攻撃力`
- def → `防御力`
- mag → `魔力`
- mdef → `魔法防御`
- spd → `素早さ`

### 中央の敵

戦闘開始データ生成時に +5～+9 のRank差を一度決定し、3体編成のindex 1（中央）へ適用する。左右は従来の基準Rankのまま。

旧セーブなどbonus値を持たない戦闘データでは戦闘生成時に安全な +5～+9 を補完する。

## 大灯台南西の小島

ワールド座標 `(8,83)` ～ `(10,83)` の3マスを `SLIME_ISLET_SOUTHWEST` として、大灯台周辺の通常ゾーンより高優先度の矩形ゾーンにした。

通常候補条件:

- race: `粘体`
- Rank: `1～140`

レア候補:

- `200201` メタルジェリー
- `200202` ロンリーメタル
- `200203` メタルロード

`200204` プリズムキングは候補外。

ワールド遭遇プロファイルへ `encounterRankMin / encounterRankMax / encounterRaces / rareEncounterMonsterIds` を通す共通処理を追加したため、今後ほかの特殊生息地にも流用できる。

## 転職の書

### 固定職業ID

`job_data.js` の `JOB_MASTER_DATA` を職業IDの正本とした。職業名を後日変更してもIDは変更しない。

全23職に `jobId=1～23` を付与。転職の書 Item ID は `710001～710023`。

転職の書の表示名・説明は `jobId` から職業マスターを参照して更新するため、アイテム側に職名の正本を重複させない。

### 取得方法

未設定。今回の転職の書は以下から出ない。

- ショップ
- ランダム宝箱
- 深淵ランダム宝箱

取得方法は後日決定する。

### 使用条件

通常仲間のみ。現在の表示Lv100で使用可能。

既存正本の

`effectiveLevel = displayedLevel + reincarnationCount * 100`

を変更しないため、使用可能時の実効Lvは100 / 200 / 300 ... となる。同じ現在職への転職の書は使用できない。

### 成功時

1. 現職の到達Lv・既習得スキルを保持。
2. 対象jobIdへ現在職を変更。
3. 転生回数を +1。
4. Lv1 / EXP0へ戻す。
5. 職歴へ転職元・転職先を記録。
6. 新職はLv1時点の技能だけを補完。
7. アイテムを1冊消費してセーブ。

別職で覚えたスキルは `character.skills` に残るため、転職後も使用可能。

### 職別到達Lv

`jobProgress[jobId]` に、その職で実際に到達した表示Lvを保存する。

これにより、転生回数3回のキャラが初めて新職へ移った場合でも「実効Lv301だから新職Lv100技まで全部取得」のような誤復元を防ぐ。

### ストーリー職との関係

ストーリーの明示的な職変更（例: アランの光魔剣士覚醒）はストーリー処理を優先する。その後プレイヤーが転職の書を使えば、プレイヤー選択職をロード後も保持する。

## 職業固有特性

**未実装のまま。**

今回追加したのは将来の判定基盤 `App.isCurrentJob(character, jobIdOrName)` だけ。開発者が各職の仕様を確定した後に全職同時実装する。

将来は現在職のjobIdと一致する特性だけ有効とし、過去に経験した職の特性は発動させない。

## 検証

- 専用検証: `62/62 PASS`
- トップレベルJavaScript: `62/62 node --check PASS`
- NONMAP_GAMEPLAY_LOGIC: PASS
- PHASE18_GAMEPLAY_DENSITY: PASS
- CYCLE_CRYSTAL_PHASE17: `26/26 PASS`
- ALAN_PHASE17_MAINLINE: `20/20 PASS`
- PHASE17 optional ally / spirit / jobs: PASS
- REXNOTE_BASEMENT_ROUTE: PASS
- HAYATE_REXNOTE_PHASE17: PASS
- PHASE18_NPC_STAGE_BATCH1: `35/35 PASS`
- `news.js` は2026/08/15レコード1件を維持。

`AGENTS.md` 指定の `tools/validation/validate-news-data.js` は受領ソースに存在しないため実行不能。代替として既存の複数検証で2026/08/15 NEWS_DATAが1件であることを確認し、`news.js` 自体もトップレベル構文検証を通した。

## 変更・作成ファイル

変更・作成したファイルは下記の19件です。

1. `battle.js`
2. `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`
3. `database.js`
4. `development_notes/2026-08-15/DELTA_MANIFEST_20260815_SYSTEM_FIX_JOB_CHANGE_BOOKS.txt`
5. `development_notes/2026-08-15/reports/SYSTEM_FIX_JOB_CHANGE_BOOK_IMPLEMENTATION_20260815.md`
6. `development_notes/2026-08-15/validation/SYSTEM_FIX_JOB_CHANGE_BOOK_CHECK_20260815.js`
7. `development_notes/2026-08-15/validation/SYSTEM_FIX_JOB_CHANGE_BOOK_CHECK_20260815.log`
8. `development_notes/2026-08-15/validation/SYSTEM_FIX_JOB_CHANGE_BOOK_REGRESSION_20260815.log`
9. `development_notes/2026-08-15/validation/TOP_LEVEL_JS_NODE_CHECK_20260815_JOB_CHANGE_BOOKS.log`
10. `docs/design/JOB_CHANGE_BOOK_CAREER_SYSTEM_20260815.md`
11. `docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md`
12. `dungeon.js`
13. `items.js`
14. `job_data.js`
15. `main.js`
16. `map.js`
17. `menus_items.js`
18. `monsters.js`
19. `news.js`
