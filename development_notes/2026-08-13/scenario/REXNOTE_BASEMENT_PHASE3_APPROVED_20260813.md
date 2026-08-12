# 水上都市事後～レクスノート邸地下B1～B5 Phase3 実装確定稿 2026-08-13

Status: implemented_runtime

## Scope

Phase1 / Phase2から続く本編区間として、以下を一括実装する。

1. 暴動後の水上都市の生活復旧
2. 復旧噴水
3. 短い討伐依頼3件
4. レクスノート邸でアランから地下調査を依頼
5. 地下B1～B4の可変階層
6. B5固定「隠し書庫」
7. 魔導司書レグルス戦
8. レクスノートの魔道書取得
9. アランへ報告
10. 船取得・アラン正式加入

邸外周ハヤテは、正式な外周MAPが存在しないため本Phaseへ含めない。

## Main route

`禁忌の森救出・ハイネ／アリサ加入 → 水上都市帰還 → ソフィア／ハイネからレクスノート邸導線 → レクスノート邸 → B1 → B2 → B3 → B4 → B5隠し書庫 → 301033 → 魔道書 → 邸へ帰還 → 船・アラン加入`

## Water City post-riot

暴動鎮圧後だけ利用できる要素として追加する。

- 備蓄や既存宝箱について、持っていってよいと示す住民。
- 澄んだ水と錬金術の関係を案内する住民。
- 街の復旧を伝える住民。
- 復旧噴水。
- 短い討伐依頼3件。

### Fountain

- cost: 500 Gold
- once per day
- 日付判定は既存デイリーと同じ `MenuExchange.getTodayStr()` を優先
- 保存flag: `waterCityFountainLastDate`
- 35%: 15～40 GEM
- 65%: 既存消耗品poolから1個
- 端末時計への独自対策は追加しない

### Hunts

1. `澄んだ水路の残火`
   - 15体
   - reward: Rank40相当 +3武器
   - party EXP 2500
2. `沈殿した魔力`
   - 18体
   - reward: Item 600410「魔泉の風」
   - party EXP 3000
3. `黒鎧の置き土産`
   - 20体
   - reward: Item 600100「鋼穿ち」
   - party EXP 3500

## Rexnote estate introduction

ユーザー確定の2台詞を核として維持する。

> 船は貸せるが条件がある。君たちの力を見せてほしい。
>
> この屋敷の地下がいつの間にか迷宮と繋がっていてね…そこの調査をしてくれないだろうか。

アランはこの時点で「自分を同行させること」を船貸与条件にはしない。
地下調査を終えた後に、自分自身の意思で同行を申し出る。

## Basement B1-B4

- dungeon master: `REXNOTE_BASEMENT`
- map id: `MAP000076`
- 既存fixed procedural生成基盤を流用
- 通常敵: Rank40～49のみ
- rare pool: `200201 メタルジェリー` のみ
- 邸から入った時に新しいprocedural runを開始
- B1～B4内部の階層移動中は同一runを維持
- B1から邸へ戻れる
- 再入場時はB1～B4の構造が更新される

## Basement B5 — 隠し書庫

- fixed map
- 25x17
- random encounterなし
- 入口からボスまで歩行可能
- boss撃破前は帰還陣を封鎖
- boss撃破後に帰還可能

### Boss

- ID: 301033
- name: 魔導司書レグルス
- Rank: 45
- type: 魔法型
- race: 無生物
- boss: true
- imageId: 406（既存資産を再利用）

役割は、レクスノート邸隠し書庫を守る古い魔導守護者。
人物の黒幕説明や新しい陰謀をこの場で追加しない。

## Key item

### Item 701013 — レクスノートの魔道書

- 貴重品
- 売却不可
- 使用不可
- abyss dropなし
- 表紙にレクスノート家の紋章と古い封蝋が残る

この段階では魔道書の内容から新しい大設定を断定しない。
地下調査を最奥まで完遂した証として機能させる。

## Report / Alan join

魔道書をアランへ持ち帰る。

アランは約束どおり船を貸す。
その後、自分が地下の存在すら知らなかったことを受け止め、父と国のことを自分の目で確かめたいとして同行を申し出る。

加入動機は本心。
同時に存在するジャスパー側の秘密任務は、この場でplayer-facingには説明しない。

runtime commit:

- `rexnoteBasementCleared`
- ALLY 201
- `alanJoinedAtRexnote`
- boat item / boat unlock
- `hasShip`
- `rexnoteShipObtained`
- storyStep 5 / subStep 0

## Save compatibility

migration: `20260813_rexnoteBasementRouteV1`

旧版ですでにアラン加入／船取得まで進んだsaveは巻き戻さない。
地下完了相当flagと701013を補完して、既に経験した本編を再強制しない。

## Writing boundary

- アランの秘密任務はここで匂わせすぎない。
- 魔道書からアレル無実やジャスパー陰謀を即断しない。
- 隠し書庫は後のアレル関連長編の答えを先に配らない。
- 地下迷宮の不安定さはプレイヤーが構造変化から理解できるようにし、長いシステム解説を置かない。
