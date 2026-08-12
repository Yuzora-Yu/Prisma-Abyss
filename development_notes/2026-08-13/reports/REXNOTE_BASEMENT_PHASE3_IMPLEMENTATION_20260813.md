# 水上都市事後～レクスノート邸地下B1～B5 Phase3 実装報告 2026-08-13

## Scope completed

- 暴動後の水上都市追加住民
- 錬金案内
- 復旧噴水
- 短い討伐依頼3件
- レクスノート邸地下入口
- B1～B4可変階層
- メタルジェリー限定レア遭遇
- B5固定隠し書庫
- 301033 魔導司書レグルス
- 701013 レクスノートの魔道書
- 魔道書報告後の船取得
- アラン正式加入
- 旧セーブ移行

## Runtime files

### story.js

- story objective 4-10 / 4-11追加
- 水上都市事後住民会話追加
- `REXNOTE_ESTATE_ARRIVAL` を地下依頼式へ変更
- `REXNOTE_BASEMENT_REMINDER`
- `REXNOTE_REGULUS_ENCOUNTER`
- `REXNOTE_REGULUS_CLEAR`
- `REXNOTE_BASEMENT_REPORT`
- related story events追加

ユーザー指定のアラン2台詞を維持。
初対面時点では同行を条件にせず、地下報告後にアラン自身が同行を申し出る。

### map.js

- `REXNOTE_BASEMENT / MAP000076`
- `FIXED_AREA_MAP_KEYS` 登録
- レクスノート邸地下入口 action
- B1～B4 procedural floor
- B5 25x17 fixed hidden archive
- 301033 boss placement
- B5帰還陣は撃破後のみ利用可
- 水上都市の事後NPC／噴水／quest board追加

### dungeon.js

fixed procedural floorへ `proceduralEntryReturnsOutside` を追加。
B1だけ前階ではなく邸外へ戻す。
他の既存procedural fixed dungeonは従来挙動を維持する。

### monsters.js / battle.js

- 301033追加
- rare encounter生成へ明示candidate poolを渡せるよう拡張
- レクスノート地下ではメタルジェリー200201だけをrare candidateにする

### items.js

- 701013 `レクスノートの魔道書`
- 売却／使用不可の貴重品
- 既存 `item-key` iconを使用

### quests.js / main.js

水上都市討伐依頼3件追加。
quest completionへ以下を追加。

- `rewardEquipment`
- `rewardPartyExp`

噴水 `App.useWaterCityFountain()` を追加。

save migration `20260813_rexnoteBasementRouteV1` を追加。

## Dungeon parameters

- B1: encounterRank 40
- B2: encounterRank 43
- B3: encounterRank 46
- B4: encounterRank 49
- normal encounter monsters actual Rank: 40 / 41 / 46帯のみ
- all normal candidates stay within Rank40～49
- rare: Metal Jelly 200201
- B5: fixed / no random encounter

## Regulus runtime

- ID 301033
- Rank45
- HP 4200
- MP 980
- MAG 168
- MDEF 142
- 2 actions
- existing imageId 406

新規assets参照は追加していない。

## Save migration policy

旧版で以下のいずれかが既に成立するsaveは、地下攻略を再要求しない。

- `alanJoinedAtRexnote`
- `rexnoteShipObtained`
- `hasShip`

対応する地下完了flagを補完し、701013を未所持なら一度補填する。
途中saveは可能な範囲で地下依頼へ接続し、物語を巻き戻さない。

## Checks

ユーザー指示により同梱validatorは使用していない。

実施済み個別確認:

- changed JS 8本 `node --check`: 8/8 PASS
- custom targeted static audit: 77/77 PASS
  - Item 701013 uniqueness / sell-use restrictions
  - Monster 301033 uniqueness / Rank45 / boss / magic-forward stats
  - B1～B4 normal monster actual Rank40～49
  - rare pool Metal Jelly 200201 only
  - B1 external return
  - B5 grid 25x17 / entrance→boss / entrance→exit reachability
  - B5 boss event linkage / exit gate before boss clear
  - Water City fountain / quest board walkability and post-riot gate
  - quest target / reward Item existence / +3 equipment / party EXP
  - save migration registration / load invocation
  - MAP000076 uniqueness
- Phase3追加NPC3体のactor/chest/action座標衝突: 0件
- existing-file newline style changes: 0件
- bundled validator: 未使用（ユーザー指定）
- assets physical existence check: 未実施（基準ZIPにassetsなし）

## Not included

- レクスノート邸外周ハヤテ無言接触
- 正式な邸外周MAP
- assetsを含む実機NEW GAME通し

外周ハヤテは屋内へ代替配置せず、正式外周MAP作成後に実装する。
