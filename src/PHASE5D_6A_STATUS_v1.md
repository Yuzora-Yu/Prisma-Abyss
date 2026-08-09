# PRISMA ABYSS — Phase 5D / Phase 6A 実装状況 v1

**作成日:** 2026-08-09  
**基準:** Phase 5A-C 水上都市～レクスノート邸完了版  
**状態:** Phase 5D 完了 / Phase 6A（雷の要塞WorldState導入）完了

## 1. ルーナ ID403 修正

- `characters.js` に既存のプロローグ専用キャラ **ID403** が存在することを再確認。
- プロローグはすでに `TEMP_ALLY charId:403` を使用していたため、別ID・文字列variantは作らない。
- 表示名 `ルーナ（幼少期）` を **`ルーナ`** へ変更。
- `prologueOnly:true` / `adultCharacterId:401` / 年齢13 / 能力値等は維持。
- `story.js` のプロローグ会話・加入処理が403を一貫して参照することをvalidatorで固定。

## 2. Phase 5D — 旧加入ルート整理

以下を検証上も正式に固定した。

- ハヤテ旧「早駆け討伐」: `disabled:true / legacyConvertedToLongArc:true`。
- ゼリード旧大灯台加入クエスト: `disabled:true / legacyConvertedToStory:true`。
- ルーナ旧闇の神殿跡地加入クエスト: `disabled:true / legacyConvertedToStory:true`。
- マリー: `underseaVolcanoCleared` 後に解禁。
- フリーダ／バロン: `underseaVolcanoCleared` 後に解禁。
- MAP上の旧ハヤテ／ゼリード／ルーナactorは明示的legacy flagがない限り露出しない。

## 3. Phase 6A — 雷の要塞WorldState

`progress.worldState.thunderFortState` を追加。

- `0`: 未到達
- `1`: 機械暴走・攻略中
- `2`: 解放後
- `3+`: 後期差分用に予約

実装：

- 雷の要塞本編突入時に `thunderFortState=1`。
- ヴェルド強制敗北を経て章を抜ける両ルートで `thunderFortState=2`。
- 既存 `thunderFortCleared` / `josephJoinedAtThunderFort` flags は互換性のため維持。
- 旧saveでは flags から state を上方向に復元する `reconcileThunderFortWorldState()` を追加。
- StoryState schema version を 5 へ更新。

## 4. News

`news.js` に 2026/08/09 の同日1レコードを追加し、今回までのプレイヤー向け開発内容を簡潔に統合。

## 5. 検証

PASS:

- `validate-luna403-thunder-state-phase5d.js`
- `validate-recruitment-route-cleanup-phase5d.js`
- `validate-save-safety.js`
- `validate-main-story-routing.js`
- `validate-story-dialogue-data.js`
- `validate-water-city-transition-phase5a.js`
- `validate-news-data.js`

`run-all.js`: **10 / 42 FAIL**

FAIL 10件は従来からの画像assets欠落由来のみ。今回の変更で新規FAILは0。

## 6. 次工程

Phase 6B以降：

1. 雷の要塞内の段階差分を `thunderFortState` へ載せる。
2. 大灯台のゼリードを任意クエスト加入ではなく本編加入へ移す。
3. 大灯台クリア後に直接光宮殿へ進む旧導線を止め、海底火山へ接続する。
4. 海底火山は図面待ちのため、まず入口→研究区画→最奥だけの最小進行MAPを作る。
5. 海底火山クリアをマリー／バロン／フリーダ加入クエストの正式解禁点にする。
