# 冒険記録・ステータス詳細で集計可能な数値 inventory — 2026-08-17

Status: **inventory only / 表示構成は未決定**

ユーザー方針により、現行の「生産の記録」等の分類を先に組み替えず、まず保存データ・派生値から継続的に集計可能な数値を列挙する。ここでの掲載は表示採用を意味しない。

## 1. 既存 lifetime / record stats

|候補|保存場所 / 算出元|種別|信頼性|備考|
|---|---|---|---|---|
|累計歩数|`stats.totalSteps`|累計|**未完成**|schema/migrationはあるが、成功移動時の加算処理を確認できない。現状は表示候補にしない|
|累計戦闘勝利数|`stats.totalBattles`|累計|高|通常の戦闘勝利処理で加算|
|累計宝箱開封数|`stats.totalChestsOpened`|累計|高|固定・生成ダンジョン等の宝箱処理で加算|
|累計獲得コイン|`stats.totalMedals`|累計|高|コイン獲得処理で加算|
|累計消費コイン|`stats.totalCoinsSpent`|累計|中～高|現行経路は追跡。旧セーブは獲得累計－所持数から復元するmigrationあり|
|通常クエスト完了数|`stats.totalQuestCompletions` + `progress.quests`|累計/派生|高|`App.getNormalQuestCompletionCount()` は保存値と完了state数の大きい方を採用|
|ギルド依頼完了数|`stats.totalGuildQuestCompletions` + guild completion|累計/派生|高|固定依頼＋生成依頼の累計と保存counterを統合|
|錬金実行回数|`stats.totalAlchemyCrafts`|累計|高|一括錬金はbatch数を加算|
|錬成アイテム総数|`stats.totalAlchemyItemsCrafted`|累計|高|作成個数ベース|
|鍛冶総操作回数|`stats.totalBlacksmithActions`|累計|高|合成・素材強化・精錬・強化の成功/挑戦経路で加算|
|装備合成回数|`stats.blacksmithSynthesisCount`|累計|高|鍛冶内訳|
|素材強化回数|`stats.blacksmithMaterialUpgradeCount`|累計|高|鍛冶内訳|
|精錬挑戦回数|`stats.blacksmithRefineAttempts`|累計|高|成功/失敗とも加算|
|精錬成功回数|`stats.blacksmithRefineSuccesses`|累計|高|成功のみ|
|強化挑戦回数|`stats.blacksmithEnhanceAttempts`|累計|高|成功/失敗とも加算|
|強化成功回数|`stats.blacksmithEnhanceSuccesses`|累計|高|成功のみ|
|累計獲得Gold|`stats.totalGoldEarned`|累計|高|Gold setter経由の正の増加を追跡。今回、保存失敗rollbackで追跡descriptorを壊さないよう修正|
|累計獲得GEM|`stats.totalGemsEarned`|累計|高|GEM setter経由の正の増加を追跡。同上|
|過去最大所持Gold|`stats.maxGold`|最大値|高|save時に更新|
|過去最大所持GEM|`stats.maxGems`|最大値|高|save時に更新|
|全滅回数|`stats.wipeoutCount`|累計|高|通常敗北を集計し、例外的な再試行等で補正あり|
|最高与ダメージ|`stats.maxDamage.val`|最大値|高|記録者・Lv・技・日時metadataも保持|
|プレイ時間|`stats.playTimeMs` / playtime helper|累計時間|高|現行画面で使用|
|開始日時|`stats.startTime`|日時|高|必要なら経過日数等の派生に利用可能|

## 2. ダンジョン・探索

|候補|保存場所 / 算出元|種別|信頼性|備考|
|---|---|---|---|---|
|深淵ストーリー最高到達階|`dungeon.storyMaxFloor`|最大値|高|ストーリー深淵用|
|深淵の亀裂 最高到達階|`dungeon.maxFloor`|最大値|高|生成側。現行冒険記録で表示|
|深淵ストーリー挑戦回数|`dungeon.storyTryCount`|累計|高|現行schema|
|深淵の亀裂挑戦回数|`dungeon.randomTryCount`|累計|高|現行冒険記録で表示|
|深淵系通算挑戦回数|`dungeon.tryCount`|互換累計|**参考値**|legacy互換を含むため、新規表示はstory/random分離を優先|
|固定マップ訪問数|`progress.visitedFixedMaps` の有効entry数|派生|中～高|「発見済み」の意味と一致させる必要あり|
|発見済み固定マップ率|上記 / MapRegistry対象数|派生率|中|対象に休止・隠しマップを含めるか要設計|
|モンスター図鑑登録数|`book.monsters` とbestiary対象DB|派生|高|現行表示あり|
|モンスター図鑑完成率|登録数 / 対象総数|派生率|高|イベント専用除外規則あり|
|総討伐数|`book.killCounts` のbestiary対象合計|派生累計|高|対象範囲を通常/ボス/イベントで分ける余地あり|
|個別モンスター討伐数|`book.killCounts[monsterId]`|累計|高|図鑑詳細で利用済み|

## 3. ギルド・クエスト

|候補|保存場所 / 算出元|種別|信頼性|備考|
|---|---|---|---|---|
|ギルドランク|`progress.guild.rank`|現在値/序列|高|数値化する場合はランク順registryが必要|
|ギルド経験値|`progress.guild.exp`|現在値|高|次ランクまでの進捗にも派生可能|
|所持ギルドポイント|`progress.guild.points`|現在値|高|資産スナップショット|
|固定ギルド依頼達成数|`progress.guild.completionCounts` 合計|累計|高|依頼ID別内訳も保持|
|生成ギルド依頼達成数|`progress.guild.generatedCompletionTotal`|累計|高|現行画面にも累計達成として統合|
|受注中/完了待ち依頼数|quest state群|派生現在値|高|記録というより現在状況|

## 4. キャラクター育成から派生できる数値

|候補|保存場所 / 算出元|種別|信頼性|備考|
|---|---|---|---|---|
|主人公現在Lv|主人公character `level`|現在値|高|現行表示多数|
|全仲間の最高Lv|`characters[].level` max|最大現在値|高|転生後は表示Lvが戻るため「歴代最高Lv」とは別|
|主人公転生回数|主人公 `reincarnationCount`|累計|高|主人公/通常仲間ごとにも取得可能|
|仲間総転生回数|通常仲間の `reincarnationCount` 合計|派生累計|高|モンスター合成回数とは分ける|
|仲間モンスター合成回数|`monsterFusionCount` 合計/max|派生累計/最大|高|各個体に保存|
|仲間人数|利用可能な`characters`数|現在値|高|一時離脱・永久離脱を含める定義は要検討|
|仲間モンスター人数|`App.isMonsterAlly()`対象数|現在値|高|同上|
|最大限界突破値|`characters[].limitBreak` max|最大現在値|高|各キャラ個別も取得可能|
|限界突破合計|`characters[].limitBreak` sum|派生現在値|高|表示価値は要検討|
|転職経験職数|`jobProgress` の経験済み職数|派生|中～高|旧セーブ互換fallbackを考慮|
|スキル習得数|各character `skills` 等|派生現在値|中|書物由来・職業復元等の重複規則を決める必要あり|
|特性習得数|各character `traits`|派生現在値|高|装備由来特性は別扱い推奨|
|スキルツリー割当数/点数|各character tree/alloc|派生現在値|中～高|tree定義単位の集計規則が必要|

## 5. 装備・収集から派生できる数値

|候補|保存場所 / 算出元|種別|信頼性|備考|
|---|---|---|---|---|
|所持装備数|`inventory` + 装備中equipのunique装備|現在値|高|同一object重複を除外する|
|最高装備＋値|所持/装備中のplus値 max|最大現在値|高|歴代最高ではない|
|EXオプション付装備数|所持/装備中opts|派生現在値|高|EXの定義を既存rarityに合わせる|
|シナジー所持装備数|装備のsynergy判定|派生現在値|中～高|算出helperを正本にする|
|「真・」装備数|名称/生成metadata|派生現在値|中|名称依存より生成metadataがあればそちらを優先|
|アイテム種類数|`items` のqty>0 entry数|現在値|高|key itemを含めるか要検討|
|アイテム総所持数|`items` qty合計|現在値|高|上限・重要アイテム混在のため表示価値は要検討|

## 6. 現時点の判断

- **分類変更はまだ行わない。** 現行の「冒険の足跡 / 資産の記録 / 生産の記録 / 戦闘の極み」は維持する。
- 次に表示内容を検討する際は、まず「累計」「歴代最大」「現在値」「派生率」を混同しないことを優先する。
- `stats.totalSteps` は名前上は有用だが、加算実装が確認できないため、修正または廃止判断を行うまで表示対象にしない。
- 「戦闘勝利数」「宝箱開封数」が現行の生産欄にあること自体は今回変更しない。上記inventoryを材料に、最終的な情報量・優先順位から後で再検討する。
