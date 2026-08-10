# Phase8F — 災禍の根ジャゴレア / ジャスパー最終対決・アラン援護

**更新:** 2026-08-10  
**Status:** user-directed / runtime implemented  
**対象:** 深淵エリア「災禍の根ジャゴレア」ジャスパー戦、アラン生存差分、戦闘外NPC援護、戦後再加入

## 1. 正本要点

### 共通進行

ジャスパーは一行を最深部へ誘い込み、**混沌呪縛**を発動する。そのうえで、自身の計画を隠すのではなく研究成果として自慢げに語る。

- 王国へ統合の儀を「救済」と信じ込ませたこと。
- 異を唱えた者を反逆者へ仕立てたこと。
- 聖女、騎士、プリズム、個人への呪縛を六属性統合研究の材料にしたこと。
- 人間と魔族の対立・死も、深淵の裂け目と研究を進める材料として利用したこと。
- アルスたちを殺し、亡骸を深淵王へ捧げれば、自分はまだ幹部として重用され研究を継続できると信じていること。
- 地上を自分の管理下に与えられた暁には、人・獣・魔族・草木を含む全生命を使い研究を完成させるつもりであること。

ジャスパーは「六つのまま存在すること」を不完全と見なし、一つの正しい形へ固定することを完成と考えている。ここでも、循環・共存と、強制統合の差を理解していない。

## 2. アラン死亡ルート

条件: `alanSavedAtIntegrationAltar` がない。

ジャスパーの自白後、そのまま戦闘開始。

- boss: `302060 妄執の神官ジャスパー`
- `ambush: true`
- 開幕状態: `混沌呪縛`
- 戦闘中、味方全員の以下能力を **0.5倍**。
  - ATK
  - DEF
  - MDEF
  - SPD
  - MAG
  - HIT
  - EVA
  - CRI
- 最大HP / 最大MPは変更しない。既存の割合回復・最大値依存処理への不要な副作用を避けるため。
- 呪縛はこの戦闘中のみ。戦闘終了後へ持ち越さない。

アラン死亡という不可逆選択が、このボス戦の難度差としても残る。

## 3. アラン生存ルート

条件: `alanSavedAtIntegrationAltar`。

ジャスパーの自白を最後まで聞いた後、アランが祭壇外縁の影から現れる。

アランの光は、深淵・混沌の影響を受けたままの濁った光。その力を混沌呪縛へ逆流させ、術式を崩壊させる。

### 会話上の役割

- アランは、父アレルのこと、自分が利用された理由、統合の儀について、**黒幕ジャスパー本人の口から聞いた**と明言する。
- ガイルはアランの過去を帳消しにはしないと怒る。
- アランも反論せず、自分が怒られる理由は理解していると認める。
- アランはジャスパーを「恩人だったと思っていた」と認め、そのうえで自分の手で終わらせると決める。
- アルスへ「共に戦わせてくれ」と頼む。
- アルスは「今はジャスパーを止める」と受け入れる。

この戦闘では混沌呪縛による能力半減・不意打ちは発生しない。

## 4. 戦闘外NPC援護システム

ジャスパー戦だけの直書きにせず、story BOSS actionから利用可能な**汎用 `externalTurnSupports`** として実装する。

### 設計目的

- 戦闘メンバー枠を消費しない。
- 敵の通常ターゲットにならない。
- 指定した既存キャラクターの最終ステータスを参照できる。
- NPC独自の技リストを持てる。
- 毎ターン / 条件付きなど、後のクエストや共闘ボスへ再利用できる構造にする。
- skill selectionは `cycle` / `random` などへ拡張可能にする。

### Phase8F アラン設定

```js
externalTurnSupports: [{
  supportId: 'alan_jagorea_phase8f',
  name: 'アラン',
  sourceCharId: 301,
  skillIds: [146, 115, 508, 232],
  selection: 'cycle',
  freeSkillCost: true,
  actsEveryTurn: true
}]
```

`sourceCharId:301` は主人公アルス。アランはアルスの**最終戦闘ステータス**を参照して援護用Actorを構築する。装備・passiveそのものを複製するのではなく、算出後の能力値を参照する。

### 行動順

毎ターン一回、次の順に循環する。

1. `146 アステリア`
2. `115 霊脈断ち`
3. `508 戦神の律動`
4. `232 ルクシオン・ノナ`
5. 以後1へ戻る

攻撃技はジャスパーを優先して対象とし、全体支援技は味方partyへ使用する。アラン自身はparty配列へ入らない。

## 5. ジャスパー撃破後 — アランの再選択

アラン生存ルートのみ発生。

アランは、以下を自分の言葉で認める。

- 黒幕本人の口から真実を確認し、自ら決着をつけられたことへの感謝。
- 大切な友人への嫉妬。
- 大好きだった父への失望。
- 差し出された言葉へ縋り、自分自身で誤った道を選んだこと。
- 許しを要求しないこと。
- それでも許されるなら、今度は自分で選んだ側で共に戦いたいこと。

選択:

- **仲間に迎える**
- **今は断る**

### 仲間に迎える

- `ALLY charId:201`
- 即時に正式加入 / party利用可能。
- Story EXP **+1,000,000**。
- reward key: `alan_jagorea_join_1000k`
- flag: `alanRejoinedAfterJasper`

### 今は断る

- flag: `alanWaitingAtLegacionAfterJasper`
- アランは**混沌魔城レガシオン**へ戻る。
- レガシオンに人物Actorとして出現。
- 話しかければ、同じ加入確認を再度行える。
- 後日加入した場合もStory EXP **+1,000,000**。
- 同一reward keyのため二重取得不可。
- 加入後はレガシオンActorが消える。

「今は断る」はアラン死亡ではなく、加入時期を保留する選択。

## 6. 主要flag / reward

- `alanSavedAtIntegrationAltar`: アラン生存ルート条件。
- `alanRejoinedAfterJasper`: ジャスパー撃破後にアランが正式再加入済み。
- `alanWaitingAtLegacionAfterJasper`: ジャスパー後、加入を保留しレガシオン待機中。
- `alan_jagorea_join_1000k`: Story EXP +1,000,000 once-only reward key。
- `abyssJasperDefeated`: ジャスパー撃破済み。

## 7. 実装ファイル

- `story.js`
  - `ABYSS_JASPER`
  - `ABYSS_JASPER_ALAN_ENTRY_PHASE8F`
  - `ABYSS_JASPER_ALAN_POST_PHASE8F`
  - join/wait/rejoin scripts
  - `abyss_jasper_battle`
  - `abyss_jasper_clear`
  - `abyss_legacion_alan_rejoin_phase8f`
- `story_logic.js`
  - BOSS actionから `externalTurnSupports` / `openingPartyStatDebuff` をbattle stateへ受け渡す。
- `battle.js`
  - generic external turn support runtime
  - generic opening party stat debuff runtime
- `map.js`
  - レガシオン待機中アランActor。
- `news.js`
  - 2026-08-10更新記録。
- `tools/validation/validate-phase8f-jasper-alan-support.js`
  - Phase8F仕様固定validator。

## 8. プレイヤー情報境界

- アランがガルヴァニア渓谷の門を破壊した事実は、このイベントでも説明しない。
- ジャスパーは自身が行った計画を自慢するが、深淵王・終焉の祭壇・最終統合の全構造を万能に説明する役にはしない。
- アラン生存ルートは「アランが無罪だった」ことを意味しない。ガイルの反応とアラン自身の謝罪拒否／責任認識を残す。
