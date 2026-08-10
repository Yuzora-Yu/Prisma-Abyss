# Encounter Habitat Rank1 Hotfix — 2026-08-10

## 症状
ライザーク要塞、光の宮殿、ワールドマップを含む habitat encounter で、本来 `monsters.js` に設定された生息域候補ではなく Rank1 モンスターが選ばれる。

## 原因
`monsters.js:getEncounterCandidates(options)` が `rankMin/rankMax` を最初に `Number()` 化していた。runtime は境界未指定時に `null` を渡すため、JavaScript の `Number(null) === 0` により Rank 範囲が指定されたと誤判定。結果、`rankMin=1, rankMax=1` となり、`mapId/habitats` 分岐へ到達しなかった。

この式自体は提供元 `.agents.zip` にも存在していたが、既存validatorは `getEncounterCandidates({mapId,floor})` の直接呼び出しだけを検証し、実runtimeと同じ `rankMin:null, rankMax:null` を再現していなかったため検出できなかった。以後はruntime payloadを含めて検証する。

## 修正
`null / undefined / 空文字` を「Rank境界なし」として判定し、実際の数値境界がある場合だけ Rank range モードへ入る。明示範囲（序章北側1〜76、ガルヴァニア渓谷68〜76など）は維持。

## 検証
- 全111 fixed dungeon floors: omitted bounds と runtime null bounds の候補ID列が完全一致
- 全15 field encounter zones: 同上
- ライザーク要塞1F: Rank51〜52 habitat roster
- 光の宮殿1F: Rank61〜65 habitat roster
- 雷要塞周辺 / 光宮殿周辺 / START_PLAINS: 各 `mapId` habitatへ復帰
- explicit Rank68〜76: Rank range抽選を維持
- Phase7D〜8F targeted validators: PASS
- run-all: 12/72 FAIL（従来のassets除外・旧validatorのみ）
