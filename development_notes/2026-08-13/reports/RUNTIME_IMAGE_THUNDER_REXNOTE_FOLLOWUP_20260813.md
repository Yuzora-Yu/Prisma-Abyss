# Runtime image / Thunder Fortress / Rexnote follow-up 2026-08-13

## 1. 実施方針

先に `canon/` と `development_notes/` の最新引継ぎを確認し、以下を今回の判断基準とした。

- player-facing の表示欠落を、単なる負荷低減より優先する。
- 不具合は症状箇所だけを差し替えず、ID解決・画像ロード・MAP描画などの共通層で原因を止める。
- 既存セーブ／既存進行を不用意に巻き戻さない。
- 同梱validatorは今回も実行せず、構文確認と今回の変更点を直接検査するtargeted checkを正とする。
- Phase3引継ぎで唯一残っていた「レクスノート邸外周のハヤテ無言接触」も今回の継続作業として完了させる。

参照した主な正本:

- `canon/PRISMA_CODING_HANDOFF_v5.md`
- `canon/PRISMA_DEVELOPER_CORE_THOUGHTS_v6.md`
- `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`
- `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
- `development_notes/2026-08-13/handoff/PRISMA_ABYSS_HANDOFF_20260813_REXNOTE_BASEMENT_PHASE3.md`
- `development_notes/2026-08-12/scenario/WATER_CITY_RIOT_REXNOTE_BASEMENT_PROPOSAL_20260812.md`

## 2. 追加依頼① セーブ／設定タブ順

`menus_config.js` のタブDOM順を

`設定 → セーブ`

から

`セーブ → 設定`

へ変更した。

`MenuConfig.activeTab` の初期値は従来どおり `settings` のまま。今回の依頼は「タブを逆にする」ため、起動時に表示する内容まで勝手にセーブ画面へ変更していない。

## 3. 追加依頼② ボス戦開始時AUTO解除

従来は `disableAutoForRareEncounter()` がレア敵だけを特例判定していた。

これを `getManualStartEncounterReason()` / `disableAutoForManualStartEncounter()` へ共通化し、開始時に手動へ戻す遭遇種別を一か所で判定するよう変更した。

判定対象:

- `App.data.battle.isBossBattle === true`
- enemy `isBoss`
- enemy `isSpecialBoss`
- enemy `isEstark`
- enemy `isRare`

AUTOの設定値 `battleAutoStart` 自体は書き換えない。したがって、通常のボス戦では開始時だけAUTO OFFとなり、プレイヤーが戦闘中に再びAUTOをONにすることは妨げない。既存の「再ON自体を禁止する特殊戦」の契約とは分離している。

## 4. 追加依頼③ ストーンジェリーがリュシオン画像になる

### 原因

ID空間の衝突。

- ストーンジェリー: Monster ID `501`
- リュシオン: Character ID `501`

旧 `Entity` constructor は、派生種別を問わず画像が未指定なら `DB.CHARACTERS` を数値IDで検索していた。

そのため画像を明示保持していないMonster 501を生成すると、Character 501の `assets/characters/char_face_501.gif` を拾っていた。

モンスター図鑑が正常だったのは、図鑑側がmonster master／monster image resolverを直接参照し、この誤った `Entity` fallbackを通らなかったため。

Gitショートカット先も確認し、`assets/monsters/monster_000501.png` 自体は存在することを確認した。したがって今回の症状は501画像ファイル欠落ではなくruntimeの種別横断ID解決が原因。

### 修正

`main.js` の画像所有責務を分離した。

- `Entity`: `data.img` / `data.image` だけを受け取り、Character masterを検索しない。
- `Player`: `DB.CHARACTERS` fallbackをPlayerだけで行う。旧セーブの `charId` 互換を維持。
- `Monster`: monster dataの `img` / `image` だけを保持し、Character masterへ絶対にfallbackしない。

これにより501だけの個別例外を作らず、今後Character/Monsterで同じ数値IDが増えても同系統の誤表示を防ぐ。

Targeted checkではMonster 501とPlayer 501を同時生成し、Monster側へリュシオン画像が侵入しない一方、Player側のcharacter master fallbackは維持されることを確認した。

## 5. 追加依頼④ 起動時画像読み込みエラー

### 確認した構造問題

`GRAPHICS.load()` は `keys` を渡さない場合、`GRAPHICS.data` の全キーを一度に `new Image()` していた。

monster定義登録後の現行データでは `GRAPHICS.data` は698キーある。つまり起動時に実プレイ直後には不要な画像まで大量にdecode/request対象へしていた。

また、`App.preloadStartupImages()` と `GRAPHICS.load()` が同じstartup画像を別々の `Image` として先読みする重複経路もあった。現行データではraw startup 55 URL中53 URLが `GRAPHICS` startup対象と重複する。

### 共通ローダー修正

`assets.js` の `GRAPHICS` を以下の共通契約へ変更した。

- `GRAPHICS.request(key)` を単一キーの正規ロード入口にする。
- `loadPromises` で同一キーの同時要求をdedupe。
- 一時的な `onerror` は最大3回まで再試行し、最終失敗だけ警告。
- `GRAPHICS.loading[key]` は従来どおり現在の `Image` を保持し、既存 `get()` 利用側との互換を維持。
- `GRAPHICS.load()` はworker方式の有限並列。既定6、上限12。
- startup一括load中は画像1枚ごとにField再描画を発火しない。
- lazy `get()` も同じretry/dedupe pipelineを使う。

`main.js` 側では起動時 `GRAPHICS.load()` に `initialGraphicKeys` を明示指定する。

現行登録数:

- 全GRAPHICS: 698
- 起動時メモリ対象: 186
- battle background: 28 / 28を起動対象へ自動追加

さらにraw startup preload側は `GRAPHICS` が担当するURLを除外するため、55 URL中53重複を除き、現在は補助2 URLだけを別経路で先読みする。timeout後は新しいURLを追加スケジュールしない。

これにより「全画像を起動時に一斉decodeする」「同じ画像をraw preloadとGRAPHICSで二重起動する」という構造原因を除去した。全データのHTTP/Cache warmup自体は既存Service Worker経路を維持するため、軽量化のために画像キャッシュ方針を捨ててはいない。

### 表示欠落を避ける契約

- 全 `battle_bg_*` を自動でstartup memory keyへ含める。
- lazy load成功時はPhaser静的層をrefreshし、「一歩動くまで画像が現れない」を避ける。
- Thunder固定MAPの高速描画は、textureがdecode済みでない場合には従来のtile描画へfallbackし、速度優先で画像を消さない。

### 残る実機確認境界

今回の配布ZIPには `assets/` がないため、ローカルパッケージだけで全698参照先の物理ファイル存在・破損を総当たりすることはできない。

特定報告のStone Jelly 501についてはGit側に `monster_000501.png` が存在することまで確認済み。全画像についてはassets込み実機環境での起動／NEW GAME通しが最終確認工程として残る。

## 6. 追加依頼⑤ 雷の要塞: マリー配置

雷の要塞1階のマリーは複数story stateを持つため、actor本体座標を一律移動させていない。

大灯台後に該当する `undersea_volcano_departure_story` stateだけへ

`placement: { x: 13, y: 21 }`

を付与した。

フリーダは従来どおり `(14,21)`。このstateではマリーがその左 `(13,21)` へ移り、通路側を塞ぎにくくする。他の進行stateにおけるマリー座標は変更しない。

## 7. 追加依頼⑤ 雷の要塞: 描画負荷

前回までに「電撃Tweenを約1/4へ減らす」対策は入っていたが、固定MAP描画そのものにまだ共通改善余地があったため `phaser-field.js` を追加修正した。

### 7.1 fixed map境界のedge clamp複製を停止

portrait viewportが固定MAP外へはみ出すと、旧処理は範囲外座標を端tileへclampして描いていた。その結果、同じ端tileを多数のGameObjectとして複製し得る。

固定MAPだけは範囲外tileを個別描画せず、画面外周用のbackdropを1枚の `tileSprite` で描く共通処理へ変更した。textureが使えない場合のみ単色rectangleで「MAP外」だけを埋め、MAP内画像の欠落をごまかす用途には使わない。

### 7.2 一様groundのbatch描画

表示範囲のfloor textureがすべて同じfixed mapでは、床を1tileずつ画像GameObject化せず1枚の `tileSprite` へまとめる。

ただし以下では最適化を使わず旧経路へ戻る。

- floor image keyが解決できない
- textureがまだdecodeされていない
- 表示範囲で床textureが混在する
- animated waterを含む

したがって高速化が画像欠落を新たに作ることはない。

### 7.3 電気装飾の共通timer化

電撃decorごとの無限Tweenを廃止し、対象decorを登録してscene timer 1本でalphaを更新する方式へ変更した。

前回の「対象数を減らす」に加え、今回「アニメーション駆動器そのものを共通化」した形。

## 8. Phase3未処理継続: レクスノート邸外周／ハヤテ

最新handoffで唯一保留だった項目を正式実装した。

### 新規固定MAP

- key: `REXNOTE_ESTATE_GROUNDS`
- map ID: `MAP000077`
- name: `レクスノート邸 外周`
- 17x13
- no random encounter

`STORY_DATA.areas.REXNOTE_ESTATE.fixedMapKey` をこの外周へ向け、ワールドからは

`WORLD → 邸外周 → 邸内`

の順に入る。

邸内の旧world exit `(8,9)` は、外周 `(8,3)` へ戻る `fixedMap` actionへ変更。`triggerOnStep:true` で従来の「出口へ踏み込めば出る」感覚を維持した。

### ハヤテ

外周 `(5,7)` へ配置。

条件:

- `rexnoteRouteKnown`
- `hayateRexnoteSighted` 未成立

接触イベント `hayate_rexnote_sighting` はCONV/LOGを持たず、`hayateRexnoteSighted` flagだけを立ててField refreshする。

したがって仕様どおり

`話しかける → 台詞なし → 消える`

となる。

BFS到達性チェックで、外周entryからハヤテ、邸玄関、world exitのすべてへ到達できることを確認した。

## 9. 変更ファイル

Runtime:

- `main.js`
- `battle.js`
- `assets.js`
- `menus_config.js`
- `map.js`
- `story.js`
- `phaser-field.js`
- `news.js`

Targeted audit:

- `development_notes/2026-08-13/targeted_followup_check_20260813.js`

Documentation:

- 本report
- `development_notes/2026-08-13/handoff/PRISMA_ABYSS_HANDOFF_20260813_RUNTIME_IMAGE_THUNDER_REXNOTE_FOLLOWUP.md`

## 10. 検証

同梱 `tools/validation` はユーザー指示および最新handoffに従い実行していない。

実施:

- 変更runtime JS 8件 `node --check`: PASS
- targeted follow-up check: PASS
  - Entity/Player/Monster画像所有境界
  - Rexnote外周MAP定義・到達性
  - Thunder Fortress Marie/Freida state座標
  - Save/Settings tab順
  - boss/rare AUTO共通入口
  - Hayate silent event
  - shared electric timer contract
  - startup loader retry/concurrency
  - 全28 battle backgroundがstartup対象
  - startup raw preload重複除外

Targeted loader result:

```json
{
  "entityIdentity": "ok",
  "mapData": "ok",
  "staticContracts": "ok",
  "graphics": {
    "all": 698,
    "startup": 186,
    "battle": 28,
    "startupRaw": 55,
    "startupSupplemental": 2,
    "maxActive": 3
  }
}
```

Mock Image監査では12キーを対象に1回目を意図的に失敗させ、2回目で全て回復し、指定concurrency 3を超えないことを確認した。

## 11. 次に実機で確認すべき項目

assets込み環境で以下を優先する。

1. キャッシュなし起動／キャッシュあり起動の双方でplayer-facing画像エラーが出ないこと。
2. 雷の要塞でStone Jellyが戦闘・図鑑とも同じmonster画像になること。
3. 雷の要塞を数分歩行し、入力遅延・スクロール・戦闘復帰時の体感を確認すること。
4. 大灯台後stateでマリー `(13,21)`、フリーダ `(14,21)` になり通路を阻害しないこと。
5. レア戦／通常ボス戦開始時AUTO OFF、通常戦では設定どおりAUTO開始すること。
6. 水上都市暴動後ルートで `WORLD → レクスノート邸外周 → ハヤテ無言接触 → 邸内 → 地下` をNEW GAMEで通すこと。
