# PRISMA ABYSS Development Policy

Last updated: 2026-08-17

This document records the current long-term development direction. Treat it as a product/design policy, not just an implementation TODO.

Story, character relationship, and hidden-setting references are archived under `docs/story-bible/`.

All implemented story regions, including the Abyss and post-surface chapters, must be stored in `story.js`. Region-specific runtime append files must not make the editor and game load different scenario sets.

The current non-negotiable directives are recorded in `docs/CURRENT_PRODUCT_DIRECTIVES_20260714.md`. They supersede older notes about dialogue length, tutorial timing, cache confirmation, and future gacha use.

Opening asset delivery is staged: before play begins, preload Lumina Village, the opening Jelly battle, and the complete pre-opening first-cave battle set (map tiles, regular enemies, boss, and field/dungeon battle backgrounds). Play the paper-theater opening after the first-cave clear report `PROLOGUE3` advances the save to `storyStep: 2 / subStep: 1`, then present the full-image download choice.

## ゲームとしての体験設計

ゲーム内の文章は、実装状態や設計意図を説明するための表示領域ではない。進行条件、内部フラグ、一時編成、数値補正、制作上の分類はコードと内部文書で管理し、プレイヤーには結果と体験だけを渡す。

すべての情報を文章や一枚絵で説明しきることを目標にしない。歩いて気づく、戦って分かる、失敗して覚える、後から意味が変わる、人物ごとに受け取り方が違う、といった余白をゲーム体験として扱う。沈黙、間、配置、敵の行動、壊れた物、行けない道も情報である。

進行不能、セーブ破損、意図しない勝敗処理のような破壊的な不具合は防ぐ。一方で、任意探索中の強敵、珍しい遭遇、想定より早い成長、プレイヤー自身の勘違いや発見まで均一化しない。安全性と予定調和を同一視しない。

登場人物は均一な理解力を持たない。見落とし、思い込み、感情的判断、土地ごとの偏見、誤った噂を許し、必要がない限り客観ナレーションで即座に正解へ訂正しない。

システム文を追加する前に「その文章を消しても、画面・操作・配置・音・人物の反応で伝わるか」を確認する。伝わるなら文章を足さない。

### システム文・メニュー／UI文言の全体レビュー運用（2026-08-10追記）

チュートリアルを除き、既存のシステム文、現在の目的、マップ操作文、メニュー、施設、戦闘等のUI文言は、現在の作業範囲に関係なくレビュー候補として収集する。既存文言を変更する場合は、必ず `現行` と `修正案` を併記し、ユーザーの最終判断前にruntimeへ反映しない。master inventoryは `docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md` とし、新規文言も継続追記する。チュートリアルは既存のUI完成ゲートを優先し、この全体レビューからは保留する。

### 冒険記録のストーリー進行度表示（2026-08-17追記）

- 冒険記録／ステータス系画面で `storyStep-subStep`（例: `12-3`）をそのまま「ストーリー進行度」として表示する現行仕様は、承認済みのプレイヤー向け表現として維持する。
- この表示は開発用デバッグ値の誤露出とは扱わない。章名・目的名への自動置換や非表示化を行わない。
- `storyStep` / `subStep` 自体の保存互換・進行判定上の意味は従来どおり内部契約として維持し、表示仕様の変更が必要な場合のみ個別に再レビューする。

### プレイヤー向け短縮表記・操作語彙（2026-08-17追記）

- 通貨表記はプレイヤー向け画面では `Gold` / `GEM` を正本とする。内部enumの `GOLD` や変数名 `gold` は変更しないが、価格・報酬・所持金表示で `G` / `GOLD` / `ゴールド` を混在させない。
- ランクは数値メタデータとして表示する場合 `Rank 70` のように半角スペースを入れる。レベルは `Lv.70` を標準とする。固有名や外部データ由来の名称そのものを機械的に改名しない。
- 画面階層を一つ戻る操作は `もどる`、モーダルや情報画面を閉じる操作は `閉じる`、未確定の選択・処理を取り消す操作は `キャンセル`、開始済みの挑戦等を中断する意味では `やめる` を使う。
- マップ上の「○○へ戻る」は行き先を表す自然文であり、上記UIボタン規約の一括置換対象にしない。

## Core Intent

The game has become feature-rich, but the next direction is to reorganize it as an RPG where features open naturally through story progression.

## Maintainable Implementation Rule

### 本番公開物・ホスティング方針

- Gitリポジトリは、ゲーム本体のruntimeだけでなく、開発資料、編集用データ、検証ツール、ログ、バックアップ等も保管する開発上の正本として扱う。一方、本番ホスティングへ公開する成果物は、プレイヤーのゲーム実行に必要なファイルだけに限定する。
- GitHub Pagesを利用する間は、リポジトリ直下の `_config.yml` をJekyll公開除外設定の正本とする。`image-backups/`、`edit/`、`canon/`、`development_notes/`、`docs/`、`tools/`、`logs/`、`.agents/` はGitには保持するが、本番Pages成果物へ含めない。
- `_config.yml` の `exclude` はGit管理・Git履歴・リポジトリ容量からファイルを除外するものではない。あくまでGitHub Pagesの生成物から除外する設定である。この区別を崩さない。
- 新しい開発専用ディレクトリ、大容量バックアップ、生成原画、監査資料等を追加する場合は、「Gitには必要だが本番runtimeには不要か」を判断し、不要であれば公開除外設定も同時に更新する。
- `assets/`、`vendor/`、実行用HTML/CSS/JavaScript、`manifest.json`、`sw.js` 等のruntime依存ファイルを公開対象から外す場合は、参照元、Service Worker、全量キャッシュ、起動導線を先に監査する。容量削減のみを理由にruntimeファイルを除外してはならない。
- ホスティング先をGitHub Pages以外へ移行しても、「Gitリポジトリ全体をそのまま公開しない」という原則を維持する。Cloudflare Pages / Workers等へ移行する場合は、`dist/`、`public/`、`_site/` 等の本番専用出力ディレクトリを定め、そのディレクトリだけをデプロイ対象とする。
- Cloudflare等でJekyllを実行しない構成では、GitHub Pages用 `_config.yml` の `exclude` は自動では適用されない。その場合はビルドまたはコピー工程で同等の公開対象制御を実装し、本番出力に開発専用ディレクトリが混入しないことを検証する。
- ホスティング先や独自ドメインを変更する場合は、相対URL、Service Workerのscope、manifestのstart URL、キャッシュ、セーブデータのorigin依存性を移行前に確認する。特にlocalStorage / IndexedDBのセーブはorigin変更で自動移行されないため、既存プレイヤーがいる段階でのドメイン移行ではセーブ移行手段を用意する。

### Map rendering authority

- `phaser-field.js` is the production field/map renderer and must be implemented and verified first for every map visual, overlay, animation, depth, shadow, and atmosphere change.
- The legacy `Field.render()` 2D Canvas path in `main.js` exists only as an automatic safety fallback when Phaser initialization or synchronization fails. It is not the primary implementation target.
- Phaser itself currently uses its Canvas backend for asset compatibility. This is separate from the legacy Canvas fallback above; “Phaser-first” still applies.
- After the Phaser implementation is complete, mirror the minimum equivalent behavior into the legacy Canvas path so a renderer failure does not break movement or essential readability.
- A map-editor preview or a passing legacy-Canvas check does not prove the production renderer is correct. Visual changes must be checked in the active Phaser game view, and validation must assert both paths when fallback parity matters.
- Phaser-layer failures and legacy 2D Canvas failures are not identical. Missing Phaser initialization, scene lifecycle errors, resize/wake/sync failures, or Phaser texture/object handling failures can still leave the direct 2D Canvas fallback usable even though Phaser itself is configured with its Canvas backend. Therefore the legacy fallback remains enabled for now.
- Do not remove the legacy fallback merely because Phaser normally succeeds. Removal requires explicit failure-path testing and a replacement fatal-render diagnostic/recovery UX so a Phaser-only failure cannot silently turn the field blank.

### ワールドマップ端のループ仕様（2026-08-17追記）

- ワールドマップの上下左右端は、昔ながらのRPGと同様に反対側へ連続するループ世界を正式仕様とする。`Field.move()` 等の座標剰余によるwrapを、範囲外バグとしてclamp・移動禁止へ変更しない。
- 地理上の進行制約は、ワールド端を塞ぐことで作らず、マップ配置、乗り物の利用条件、固定マップ、イベントゲート等の既存仕様で管理する。
- 深淵世界では船・飛行を使用できないため、ワールド側の乗り物仕様から深淵の進行迂回を推測しない。移動監査では各worldKeyの利用可能な移動手段を先に確認する。

### スキルID管理・属性技追加・ボスバランス（2026-08-17追記）

#### スキルIDの基礎規則

本番runtimeで使用するスキルIDは、以下の分類帯を正本とする。新規スキル、仮実装から本実装へ移すスキル、既存スキルを再整理する場合は、効果の主分類に合わせて必ずこの帯へ収める。

- `100～199`: 物理
- `200～299`: 魔法
- `300～399`: ブレス
- `400～499`: 回復・蘇生。HP/MP回復、状態回復、再生等の回復系補助もこの系統で管理する。
- `500～599`: 強化
- `600～699`: 弱体
- `700～899`: 特殊

`700000` 以上の番号は開発中の一時IDとしてのみ許容し、本番runtimeの正規IDとして残してはならない。仮IDを用いた場合は、納品前に上記の正規帯へ再分類し、既存セーブや戦闘再開データが参照し得る場合は旧IDから新IDへのmigrationを同時に実装する。既にプレイヤーデータへ保存され得るIDを、migrationなしで別の技へ再利用しない。

複合効果を持つ技は、名称ではなく戦闘上の主作用で分類する。攻撃に弱体等が付随する場合は、その攻撃が用いる物理・魔法・ブレスの帯を優先する。純粋な強化・弱体は500帯・600帯、即死・割合効果・特殊状態操作など通常の攻撃／回復／強弱体へ整理できないものを700帯とする。

#### 属性技の追加規則

- 通常の属性攻撃・属性魔法・属性ブレスの新しい威力段階や系統を追加する場合、火だけ、水だけ等の単属性を先行して大量追加しない。既存の六属性（火・水・風・雷・光・闇）の同格技を同時に比較し、必要な系統は原則として横並びで追加・調整する。
- 物語上の固有技が本当に専用挙動を必要とする場合は例外を認めるが、「そのボスらしい名前を付けたい」だけを理由に既存汎用技と同じ挙動の専用スキルを増やさない。既存技で表現できる場合は既存マスターを再利用する。
- 属性技を追加・強化するときは、MP、倍率、固定威力、対象範囲、手数、追加効果、属性耐性／貫通の影響を同格の他属性と並べて確認する。単純な倍率だけで比較しない。

#### ボスの前後比較

- ストーリーボスのHP、MP、ATK、DEF、SPD、MAG、MDEF、行動回数、使用技、自己強化、回復、耐性、特性は、そのボス単体で決めない。必ず直前・直後に戦う主要ボスと横比較して決定する。
- 後続ボスより一時的に高い単一能力値を持たせること自体は役割表現として許容するが、実効耐久・平均火力・最大瞬間火力・行動阻害まで含めた総合難度が、物語上の意図なく前後関係を逆転しないようにする。
- 複数体同時ボスは、個体値ではなく敵側全体のHP、合計行動回数、同一ターン火力、回復／蘇生／連携を合算して比較する。イベント上の強制敗北戦、耐久戦、特殊勝利条件戦は通常撃破ボスと別枠で扱い、比較理由をデータまたは監査記録へ残す。

#### ボス画像ID

- モンスター画像は原則としてモンスター自身のIDと同じ `assets/monsters/monster_<6桁ID>.png` を使用する。`imageId` は別IDの画像を意図的に共用する場合だけ指定する。
- 同一IDの専用画像を新設した場合は、過去の代替 `imageId` を残したままにしない。通常描画、戦闘再開snapshot、Phaser texture登録、全量キャッシュの全経路で同じ画像へ解決されることを確認する。

### 職業固有特性の数値FIXと再調整単位（2026-08-17追記）

- 斥候（jobId 5）「先読み」、星詠師（jobId 12）「星巡り」、竜騎士（jobId 19）「竜脈」は、2026-08-17時点の実装数値を暫定FIXとする。個別の実プレイ結果だけを理由に、この3職のみを先行して再調整しない。
- 今後、職業固有特性の数値バランスへ手を入れる必要が生じた場合は、全23職を同じ評価軸で並べた一括バランスレビューとして実施する。単独職の上方／下方修正を先に確定しない。
- バグ修正、説明文と実挙動の不一致、計算式の誤実装、セーブ互換等は数値バランス調整とは別扱いとし、必要なら個別に修正してよい。ただし意図した倍率・確率・ターン数そのものは上記一括レビューまで維持する。

### monsters.js 直接マスター記述規則（2026-08-17追記）

- `monsters.js` の直接オブジェクトで管理する各モンスターは、ID順を維持し、**1モンスターにつき2行**を標準記述とする。
- 1行目は必ず `id` をオブジェクトの最左項目に置く。名称、種族、Rank、能力値、行動等の主要項目はID側へ続ける。
- 従来 `id` より左に置かれていた命中・回避・会心、ボス／レア等の種別フラグ、ドロップ、属性耐性、状態耐性、特性、アーカイブ、preload等の技術項目は2行目へ移す。
- この規則は可読性のための記述形式であり、runtimeのデータ意味・キー名・値を変えない。整形だけを理由にモンスター能力、行動、画像ID、出現条件を変更しない。
- `editor_monsters.html` のJS生成も同じ2行形式を正本とする。エディタから再出力した際に、`MONSTER_ALLY_GROWTH_TYPE_MASTER`、宝箱トラップ、イベント専用モンスター、画像解決関数等、エディタ管理外の現行runtime定義を欠落させてはならない。

### 町・建物マップの外周と出入口

- 町や家などの固定マップの出入口は、壁と壁の間に通行可能な床マスを配置し、その床マスを出入りの導線とする。壁自体や不透過オブジェクトを出入口の代用にしない。
- 出入口にする床マスは、出入りする方向の前後が通行可能な床へ連続していることを必須とする。周囲を壁に囲まれ、歩行で出入りできない床マスを出入口として設定することは原則として認めない。ただし、階段、魔法陣、転送装置など、その床マス自体が歩行以外の移動手段であることが見た目と演出から明らかな場合は例外とする。
- マップ最下部の壁帯は、原則として縦2マス以上の厚みを確保する。1マスのみで画面端を塞ぐ構造は避ける。
- マップは原則として、壁のさらに外側へ1～2マス分の床タイル等を配置し、壁をマップ配列の最外縁に直接置かない。
- 上記は、出入口の読みやすさ、マップ下端の壁の見え方、外周描画の安定性を保つための標準とする。演出上の明確な理由で例外とする場合は、通行判定、画面端の露出、Phaserと旧Canvasの描画を実画面で確認し、例外の意図をマップ定義または関連設計文書に残す。
- 既存マップには上記標準へ未対応のものが多い。それらの現状を仕様として追認せず、今後のマップ点検・改修における変更検討対象とする。ただし、進行、座標、イベント、帰還先との整合を確認せずに一括変更しない。

### 固定マップの探索物・報酬密度

- 町・村・固定ダンジョンの密度はNPC会話だけで作らず、ツボ、タル、宝箱、調べられる生活物、寄り道報酬、進行後の人物報酬も組み合わせる。
- アイテム入りのツボ・タルは、原則として壁際・外周・建物脇など、歩行導線を不自然に塞がない端側へ置く。中央通路へ意味なく散らさない。
- MAPは将来の拡張・レイアウト変更を前提とし、取得状態を座標だけへ依存させない。固定探索物には再配置後も変えない `lootId` を付ける。旧座標由来のセーブ互換が必要な場合は `legacyPositions` を保持する。
- +3装備などの強めの固定報酬は、単なる宝箱だけでなく、その町で暮らす人物の仕事・過去・再訪状況と結びつける。報酬だけを配るNPCにはしない。
- MAP拡張時は `actorId` / `placementId` / `stateId` / `lootId` を維持し、座標のみを変更できる構造を優先する。

手抜き作業と、その場しのぎのつぎはぎ修正を禁止する。症状だけを局所的に隠すのではなく、描画・移動・イベント・データ参照の正本を確認し、同種の挙動が一つの共有ロジックへ収束するよう修正すること。

新しいデータやアセットは、後から由来・用途・再生成方法を追跡できる状態で格納する。既存ファイルの配置が保守を妨げている場合は、参照元・全量キャッシュ・検証スクリプトを同時に更新したうえで適切なフォルダへ整理する。生成原画、ゲーム用加工物、マニフェスト、加工スクリプトを分離し、無名の上書きや用途不明ファイルを増やさない。

変更時は少なくとも、既存セーブ互換、入口と帰還先、通行可能性、画像の全量キャッシュ登録、描画欠けの同期フォールバック、データ検証を確認する。短期的に動くことより、再現可能で管理しやすい構成を優先する。

### キャラクター歩行グラフィック

- 歩行画像は `assets/characters/walk/<キャラクターID>_<方向>_<1|2>.png` を正本とし、上下左右の各2枚、合計8枚で管理する。
- 待機中も現在の向きの `_1` と `_2` を交互に表示し、足踏みを続ける。`idle_down` を歩行フレームに採用しない。
- 正面棒立ちは村人等と同様の固定配置用とし、`assets/characters/map-stand/` で歩行フレームと分離する。
- マップ隊列は `data.party` の編成順にキャラクターIDを解決し、最大4人を先頭キャラクターの移動履歴に沿って表示する。編成変更は次回描画から並び順へ反映する。仲間モンスターは人数と順番の両方から除外し、人型キャラクターの画像で代用しない。
- 飛行中は当面、隊列の追従者を表示せず主人公1人だけを表示する。最大4人表示は徒歩移動時に限る。
- ファイル命名、時代差分ID、固定配置、隊列、登録とキャッシュの詳細は `docs/design/character-walk-assets.md` を正本とする。

The game should not begin with every major system available. Blacksmithing, the abyss, boat travel, wing flight, dungeon transfer, and other systems should become available as the player explores the field, clears regional fixed maps, gains allies, and expands the world. Gacha-related code and assets may remain as dormant legacy/internal implementation, but gacha is not planned as a player-facing feature and must not receive an unlock route.

Existing code uses `progress.unlocked` for story-gated systems. Field blacksmith access is gated by `smith`, while the main-menu **Magic Communication** route to blacksmithing, alchemy, and guild quest reception is independently gated by `craftingMenu`. Dungeon menu access keeps its own unlock check; gacha is not shown in the main menu route.

`Magic Boat` and `Light Wing` are progression-linked travel items. `Light Wing` is a unique Final Altar reward from Lycion. `Sky Prism` is intentionally an ordinary consumable sold by normal item shops; its destination list is limited by discovered-map records rather than by an acquisition event.

## Main Game Scope

The main story should focus on field exploration and regional story progression until roughly level 50.

During this period:

- Field travel and fixed maps should be the main experience.
- Story allies should carry the party experience.
- Abyss farming should not be the main route to power during the main story.
- Fixed story dungeons should be hand-authored rather than randomly generated.
- Random/deep farming systems should become stronger after the main story opens them.

The goal is for the player to feel that the world opens gradually through adventure.

## World Progression

Primary field destinations:

- Beginning Village
- Fire Village
- Wind Settlement
- Water City
- Thunder Fortress
- Light Palace
- Demon Castle
- Abyss

Main progression order:

1. Beginning Village
2. Fire Village
3. Wind Settlement
4. Water City
5. Thunder Fortress
6. Light Palace
7. Demon Castle
8. Abyss

Element order:

1. Fire
2. Wind
3. Water
4. Thunder
5. Light
6. Dark

Story dungeons should be fixed maps. For story-use dungeons, prefer fixed definitions for:

- Enemy appearance
- Chest contents
- Bosses
- Events
- Entrances and exits

This should make story progression feel authored and memorable.

## Feature Unlock Plan

Features should unlock through story progress, not be fully available at game start.

Proposed unlock route:

- Beginning Village clear:
  - Gaile and Sara join.
  - Record future tutorial requirements only; implementation waits until all target screens are complete.

- Fire Village clear:
  - Xiao joins.
  - The local Fire Village blacksmith facility opens.
  - Main-menu Magic Communication access to blacksmithing, alchemy, and guild quest reception remains locked until a future dedicated quest unlocks `craftingMenu`.
  - Record the future blacksmith tutorial requirement, but do not implement it before the blacksmith UI is final.

- Wind Settlement clear:
  - Elise joins.
  - Wind area progression.
  - Reserve status-ailment and speed teaching goals for the post-UI-completion tutorial pass.

- Water City clear:
  - Kate joins.
  - Magic Boat obtained.
  - Sea movement opens.
  - Casino is placed in Water City as a map facility.

- Thunder Fortress clear:
  - Joseph joins.
  - Medal King remains a reachable map facility with no story-clear prerequisite; the fortress may still explain small medals.

- Light Palace clear:
  - The prison rescue route opens. Layla does not join at the altar.
  - Returning to the prison and giving Layla one World Tree Leaf restores and recruits her.
  - Abyss and reincarnation foreshadowing.
  - Reserve light/dark teaching goals for the post-UI-completion tutorial pass.

- Demon Castle arrival event battle:
  - Shanny joins.

- Demon Castle clear:
  - Main story reaches a major ending point.
  - Gacha remains unused dormant legacy/internal code; no player-facing unlock is planned.
  - Main postgame/farming systems open through their implemented story gates.

- Six regions and Demon Castle clear:
  - Abyss opens.

- Abyss floor 40 boss defeated:
  - Surface ending.
  - Additional Light Palace event opens.
  - One Reincarnation Fruit is granted.

- Light Palace clear:
  - The prison rescue route opens. Layla joins only after the party returns to the prison and gives her one World Tree Leaf.

- Final Altar / Azelgarag clear:
  - Lycion grants the Light Wing. It is not a Medal King reward.

- Postgame Final Altar crack event:
  - Random Abyss and the dungeon menu open.
  - The inn dungeon-transfer door becomes visible and usable at the same time.

Inn transfer visibility and use are both gated by `progress.flags.abyssRandomUnlocked` / `progress.unlocked.teleport`. `abyssFirstEntered` is history only and must not reveal the door. Older saves that already own the legacy random-Abyss clear state may preserve access through migration.

## Unlock State Shape

Future `progress.unlocked` should move toward this shape:

```js
progress.unlocked = {
  smith: false, // local Fire Village blacksmith facility
  craftingMenu: false, // future quest reward: Magic Communication access to blacksmithing, alchemy, and guild quest reception
  gacha: false, // legacy/internal; no current main-menu player route
  abyss: true,
  dungeonMenu: false,
  teleport: true,
  boat: false,
  wing: true,
  fixedDungeonEndless: true
};
```

Implementation rule:

- Preserve existing save compatibility.
- Add missing keys in `App.init()` migration.
- Default missing unlock keys to `false`.
- Do not assume old saves already contain the full structure.

## Story Ally Policy

During the main story, party growth should center on story allies. Gacha is not exposed as a current player-facing progression route.

Planned story joins:

- Beginning Village clear:
  - Gaile
  - Sara

- Fire Village clear:
  - Xiao

- Wind Settlement clear:
  - Elise

- Water City clear:
  - Kate

- Thunder Fortress clear:
  - Joseph

- Light Palace prison rescue after clear:
  - Layla (give one World Tree Leaf)

- Demon Castle arrival event battle victory:
  - Shanny

Main character placement:

- Beginning Village:
  - Gaile, Sara

- Fire Village:
  - Xiao, Karin

- Wind Settlement:
  - Elise, Arisa, Heine, Marie
  - Licia appears only as a rumor.

- Water City:
  - Kate, Sophia, Silvia, Alan, Hayate

- Thunder Fortress:
  - Joseph, Frieda, Baron, Rin, Zeried

- Light Palace:
  - Layla, Claude, Leon, Luna
  - Lycion appears through telepathy only.

- Demon Castle:
  - Shanny, Zenon, Minerva, Ryu

High-rarity and very strong characters should not join too early. Main story should lean on R/SR characters. SSR+ characters are better as event appearances, foreshadowing, post-Demon-Castle rewards, or postgame content.

## Facility Placement

All major towns:

- Inn

Fire Village:

- Blacksmith unlock point

Water City:

- Casino
- Boat acquisition event

Thunder Fortress:

- Medal King facility tile; no story-clear prerequisite

Light Palace:

- Final battle and prison rescue route
- Layla recovery by World Tree Leaf
- Abyss and reincarnation foreshadowing

Demon Castle:

- Demon King defeat
- Transition from main story to postgame
- Gacha code may remain in the repository, but it is not documented as a current in-game unlock.

Menu and facility display should follow their respective unlock states. Local facility access and remote menu access must not share a flag when they are intended as different rewards. Unreleased systems can be hidden, or shown as `???` with a clear note such as "unlocks through story progress" if hiding them makes the UI confusing.

## Abyss Positioning

The Abyss is the current main dungeon system, but it should become a late-main-story/postgame system rather than something freely available from the beginning.

Proposed Abyss stages:

- Initial Abyss access:
  - Dungeon entry opens.

- Floor 40 boss defeated:
  - Surface ending.
  - Light Palace event opens.
  - One Reincarnation Fruit is granted.

- After Light Palace clear:
  - The party must return to the prison and spend one World Tree Leaf to restore and recruit Layla.
  - Regional endless exploration remains a separate system decision and is not an inn-transfer visibility condition.

- Final Altar / Azelgarag clear:
  - Lycion grants the Light Wing.

- Final Altar postgame crack:
  - Random Abyss opens.
  - The inn transfer door appears and becomes usable.

- Random Abyss high floors:
  - High-difficulty bosses may assume reincarnation.

## Regional Endless Exploration

After the Light Palace event, fixed regional dungeons should gain endless exploration modes. These should be separate from story fixed dungeons.

Story fixed dungeons:

- Fixed map
- Fixed enemies
- Fixed chests
- Fixed events
- Built to be cleared once as part of the story

Endless exploration:

- Attribute-focused enemies
- Attribute-focused equipment drops
- Repeatable growth, farming, and equipment hunting

Attribute dungeon examples:

- Fire region:
  - More fire monsters.
  - Fire resistance equipment and fire weapons drop more often.

- Wind region:
  - More wind monsters.
  - Wind resistance equipment and wind weapons drop more often.

- Water region:
  - More water monsters.
  - Water resistance equipment and water weapons drop more often.

- Thunder region:
  - More thunder monsters.
  - Thunder resistance equipment and thunder weapons drop more often.

- Light Palace region:
  - More light monsters.
  - Light resistance equipment and light weapons drop more often.

- Demon Castle region:
  - More dark monsters.
  - Dark resistance equipment and dark weapons drop more often.

## Field Monster Direction

Field monsters should vary by area instead of feeling uniform.

- Beginning Village area:
  - Level 1-5 equivalent.
  - Slime and basic enemies.

- Fire Village area:
  - Level 5-10 equivalent.
  - Fire skills common.
  - High fire resistance.
  - Low water resistance.

- Wind Settlement area:
  - Level 10-15 equivalent.
  - Wind skills common.
  - High wind resistance.
  - Low fire resistance.

- Water City area:
  - Level 15-20 equivalent.
  - Water skills common.
  - High water resistance.
  - Low thunder resistance.

- Thunder Fortress area:
  - Level 20-25 equivalent.
  - Thunder skills common.
  - High thunder resistance.
  - Low wind resistance.

- Light Palace area:
  - Level 25-30 equivalent.
  - Light skills common.
  - High light resistance.
  - Low dark resistance.

- Demon Castle area:
  - Level 30-40 equivalent.
  - Dark skills common.
  - High dark resistance.
  - Low light resistance.

- Abyss floor 1-20:
  - Level 40-45 equivalent.

- Abyss floor 21-50:
  - Level 45-50 equivalent.

- Abyss floor 51-75:
  - Level 50-70 equivalent.

- Abyss floor 76-100:
  - Level 70-90 equivalent.

- Abyss floor 101+:
  - Level 100 equivalent.
  - Floor 150+ assumes reincarnation.

## Virtual Floor Policy

Keep the current equipment drop system, but clarify how field/story areas map to virtual floor values.

Proposed virtual floor mapping:

- Beginning Village: 1
- Fire Village: 10
- Wind Settlement: 20
- Water City: 30
- Thunder Fortress: 40
- Light Palace: 50
- Demon Castle: 60
- Abyss floor 1-20: 70
- Abyss floor 21-40: 80
- Abyss floor 41-75: 90
- Abyss floor 76-100: 100
- Abyss floor 101+: actual floor

`App.getVirtualFloor()` already has the right kind of hook. Future work should consolidate this policy there.

## Monster, Boss, And Drop Rework

After field and Abyss progression are reorganized, monster definitions should be reviewed broadly.

Review targets:

- Monster names
- Stats
- Element resistances
- Skills
- Experience
- Gold
- Normal drops
- Rare drops
- Boss behavior
- Abyss spawn logic

Preferred individual drop shape:

```js
drops: {
  normal: { type: "item", id: 1, rate: 0.15 },
  rare: { type: "item", id: 100, rate: 0.02 }
}
```

Equipment drops should keep the current system. The virtual floor policy should tune which equipment rank bands appear.

## Achievement Notifications

Achievement completion should not stop play with a blocking modal. Prefer a toast notification in the upper-right area.

Example:

```text
Achievement Unlocked!
旅の道標
固有MAPを3か所発見した！
```

Desired behavior:

- Upper-right display.
- Auto-dismiss after a few seconds.
- Queue multiple achievements.
- Do not block controls.
- Show reward lightly when present.

The player should feel achievements at the moment they happen, not only when opening the achievements screen.

## Item And Equipment Icons

Items and equipment should gain simple icons.

Start with text, emoji, or simple symbols. Structure data so image icons can replace them later.

Examples:

```js
{ id: 1, name: "やくそう", icon: "🌿" }
{ id: 108, name: "魔法の小舟", icon: "⛵" }
{ id: 109, name: "光の翼", icon: "🪽" }
{ id: 110, name: "スカイプリズム", icon: "🔷" }
```

Equipment icon direction:

- Weapon: sword icon
- Shield: shield icon
- Head: crown/helm icon
- Body: armor/robe icon
- Feet: boot icon

When implementing, avoid hard-coding icons directly into menu rendering. Prefer data fields and fallback logic.

## Fixed Map NPCs

Fixed maps should have residents who can be spoken to.

NPC roles:

- Worldbuilding
- Next-destination hints
- Element matchup hints
- Facility tutorials
- Feature unlock explanation
- Character development
- Hidden-content hints

Examples:

- Fire Village artisan:
  - Blacksmith unlock and blacksmith tutorial.

- Water City shipwright:
  - Boat acquisition event and sea travel explanation.

- Thunder Fortress soldier:
  - Medal King and small medal explanation. The explanation is not an unlock gate.

- Light Palace priestess:
  - Layla's prison condition, Abyss foreshadowing, and reincarnation explanation.

## Tutorial Policy

Tutorial implementation is deferred until every target screen and interaction flow is complete. Tutorials built against obsolete screens create incorrect guidance and rework.

Before the UI completion gate, only maintain a tutorial-requirement ledger: what must be taught, the intended story timing, prerequisites, and measurable success conditions. Do not finalize tutorial copy, screenshots, pointer coordinates, or forced input sequences.

After the UI completion gate, build and validate tutorials against the final screens. Prefer teaching through current gameplay and story context rather than detached explanation screens.

There is no gacha tutorial because gacha is not planned for player use.

## Implementation Phases

### Phase 1: Unlock Flag Foundation

- Expand `progress.unlocked`.
- Add migration for old saves.
- Control menu display.
- Control facility access.
- Control item usage.

Priority: build the foundation for "when systems can be used" before adding more systems.

Current status on 2026-05-15:

- `progress.unlocked` now migrates toward the full planned key set.
- Main menu access for blacksmith and dungeon systems is routed through shared unlock checks. Gacha has no current main-menu button.
- Abyss entry, inn teleport, Magic Boat, and Light Wing access now use the unlock foundation or legacy key-item compatibility. Casino and Medal exchange remain map-facility routes in the current implementation.
- Future story events should call `App.unlockFeature(key)` at the planned unlock moments instead of directly opening systems.

### Phase 2: Story Progress And Ally Joins

- Organize `storyStep` / `subStep` from Beginning Village through Demon Castle.
- Add regional clear flags.
- Add story ally join handling.
- Add fixed dungeon clear flags.

Main story should be playable with story allies.

### Phase 3: Field, Fixed Maps, And Entrances

- Place six elemental regions on the field.
- Organize entrance coordinates.
- Place fixed dungeon entrances.
- Connect `Sky Prism` to discovered/undiscovered fixed-map records.

`Sky Prism` normally moves to the world-map entrance. When a fixed dungeon's actual entrance is authored inside another fixed map, resolve that `mapActions` entrance through the shared map registry and land on the entrance tile inside the parent fixed map instead of dropping the player on the world map.

### Phase 4: Facility Unlocks

- Fire Village clear opens blacksmith.
- Water City / Seabed Temple progression grants the Magic Boat and opens sea travel through `boat`, item `108`, and `hasShip` compatibility.
- Casino and Medal exchange are current map-facility routes rather than separately documented `progress.unlocked` gates.
- Demon King defeat does not currently open gacha through the player-facing menu route.
- Abyss/Light Palace event opens transfer service.
- Abyss floor 100 opens Light Wing.

### Phase 5: Enemy, Drop, And Virtual Floor Balance

- Area-based monster settings.
- Attribute-based monster tuning.
- Fixed-dungeon enemy fixation.
- Abyss spawn logic review.
- Normal and rare drops.
- Equipment drops tuned by virtual floor.

### Phase 6: Presentation And UI

- Achievement toast notifications.
- Item and equipment icons.
- Fixed-map resident NPCs.
- Story-integrated tutorials.
- Unlocked/locked feature display cleanup.

## Guiding Principle

The most important thing is not simply adding more features.

The core progression should feel like:

1. Advance the story.
2. Gain new allies.
3. Reach new regions.
4. Open new facilities.
5. Obtain new travel tools.
6. Unlock deeper postgame systems.

Do not give everything to the player immediately. The player should feel the world expanding through adventure.

During the main story, the player should struggle forward with story allies. The intended RPG identity is not "use farming to brute-force everything", but "travel through fire, wind, water, thunder, light, and dark regions while gathering allies, tools, and systems."

After Demon King defeat and the later Abyss gates, expand the game as a long-term postgame RPG through the implemented Abyss, travel, and fixed-dungeon systems. Gacha is not part of the current player-facing unlock route.

## Tutorial Impact Review

大きな機能追加、操作導線の変更、既存仕様の大幅な変更を完了した際は、対象画面が確定した後にチュートリアルへの影響を確認する。

- 既存チュートリアルが新しい画面・用語・操作と矛盾しないか確認する。
- 初見プレイヤーが自力で理解しにくい変更であれば、チュートリアルの追加または修正案をユーザーへ提示する。
- 画面や操作が未完成の段階では、将来変更が前提となるランタイムチュートリアルを先行実装しない。
- チュートリアル変更が不要と判断した場合も、実装報告の影響確認欄へ理由を残す。
