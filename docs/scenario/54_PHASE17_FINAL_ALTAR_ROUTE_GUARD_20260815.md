# Phase 17 終焉の祭壇 本筋ゲート補強 — 2026-08-15

## 目的

Phase 17 の正規順序を、runtime の移動導線でも保証する。

正規順序は以下。

1. レガシオン神官の指摘。
2. ミネルバが着想し、ソフィアと六精霊巡礼を提案。
3. 火／水／風／雷／光／闇の六精霊試練を完了。
4. 終焉の祭壇へ進む。
5. 五楔ヴェグナシス、続いてアゼルガラグへ挑む。

「輪廻の結晶」生成イベントの再構成は既存本文の変更を伴うため、本稿の変更対象には含めない。
内部 `octaprism*` 互換キーもこの工程では変更しない。

## 監査で確認した問題

`CHRONO_ABYSS` 7層から `FINAL_ALTAR` へ向かう固定ダンジョンリンクは、従来 `abyssIlluminaciaDefeated` だけを要求していた。
そのため、六精霊巡礼を未完了のままクロノアビスを踏破すると、終焉の祭壇へ到達できる余地があった。

これはロードマップの「六精霊 → 終章」の順序と一致しない。

## 実装

### 固定ダンジョンリンクの複数flag条件

`dungeon.js` に固定ダンジョンリンク共通判定 `isFixedFloorLinkUnlocked(link, flags)` を追加。

対応条件:

- `requiredFlag`
- `requiredFlags[]`
- `missingFlag`
- `missingFlags[]`

既存の単一 `requiredFlag` はそのまま互換維持する。

### クロノアビス → 終焉の祭壇

必要flagを次の2つへ変更。

- `abyssIlluminaciaDefeated`
- `abyssAllSpiritTrialsCleared`

六精霊が未完了の場合は、新規ロック文を表示して移動させない。

### 最終戦イベント側の二重防御

`abyss_final_altar_encounter` にも `abyssAllSpiritTrialsCleared` 判定を追加。
マップリンク以外から直接イベントが呼ばれても、六精霊未完了ではヴェグナシス戦を開始しない。

## 既存テキストについて

既存会話は変更していない。
今回追加したのは、未達成時にのみ表示される新規の移動ロック／システムログだけ。

## 今回触れないもの

- `ABYSS_SPIRIT_TRIAL_ALL_COMPLETE` の旧オクタプリズマ授与本文。
- Item 701008 の player-facing 名称／説明。
- 結晶樹での輪廻の結晶生成儀式。
- `octaprism*` 内部キー。

これらは既存本文・既存授与構造の変更になるため、別の承認境界として維持する。
