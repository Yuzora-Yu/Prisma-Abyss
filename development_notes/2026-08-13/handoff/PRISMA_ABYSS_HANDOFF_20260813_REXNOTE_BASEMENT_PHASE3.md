# PRISMA ABYSS Handoff 2026-08-13 — Water City Post-Riot / Rexnote Basement Phase3

## Completed this unit

Phase1 / Phase2の後続として、以下をruntime実装済み。

`禁忌の森帰還 → 水上都市事後要素 → レクスノート邸 → 地下B1～B4 → B5隠し書庫 → レグルス → 魔道書 → アラン報告 → 船・アラン加入`

## Important runtime state

- `rexnoteBasementRequested`
- `rexnoteBasementEntered`
- `rexnoteRegulusDefeated`
- `rexnoteGrimoireObtained`
- `rexnoteBasementCleared`
- `alanJoinedAtRexnote`
- `rexnoteShipObtained`
- `hasShip`
- `waterCityFountainLastDate`

## New runtime IDs

- map: `MAP000076 / REXNOTE_BASEMENT`
- boss: `301033 魔導司書レグルス`
- key item: `701013 レクスノートの魔道書`

## Basement behavior

- B1～B4: fixed dungeon内のprocedural floors
- normal enemies: Rank40～49
- rare candidate: Metal Jelly 200201 only
- entry from estate starts a fresh procedural run
- internal floor transition keeps the current run
- B1 can return to estate
- B5 fixed, no random encounter
- B5 exit is gated by `rexnoteRegulusDefeated`

## Alan route

旧「屋敷到着会話だけで加入・船取得」は使用しない。

現在:

1. アランが地下調査を依頼
2. B5で301033撃破
3. 701013取得
4. アランへ報告
5. 船取得
6. アランが自分から同行を申し出る
7. ALLY201

アランの加入動機は父と国の真実を自分の目で確かめたいという本心。
ジャスパー側の秘密任務はこの場ではplayer-facingへ出さない。

## Water City post-riot

- supply resident
- alchemy resident
- recovery resident / local information
- fountain once per day, 500G
- 3 hunt quests

## Save compatibility

migration: `20260813_rexnoteBasementRouteV1`

既に旧版で船／アラン加入済みなら巻き戻さない。
地下完了相当状態と701013を補完する。

## Do not redo

- Phase1 水上都市暴動5戦
- Claude / Leon first meeting
- saint rumors
- Phase2 forbidden forest rescue
- Arisa / Haine mandatory joining
- 701012 古びた魔笛
- Phase3 basement B1～B5 / Regulus / grimoire / Alan ship join

## Still pending from the 2026-08-12 proposal

レクスノート邸外周のハヤテ無言接触のみ。
正式な邸外周MAPができるまで屋内へ代替配置しない。

## Source of truth

- `development_notes/2026-08-13/scenario/REXNOTE_BASEMENT_PHASE3_APPROVED_20260813.md`
- `development_notes/2026-08-13/reports/REXNOTE_BASEMENT_PHASE3_IMPLEMENTATION_20260813.md`
- `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
- `canon/PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md`
- `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`

## Validation policy

User instructed not to use bundled validation tools for now.
This delivery uses syntax checks and targeted static/runtime-data audits instead.
