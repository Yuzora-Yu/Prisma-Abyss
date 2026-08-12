# PRISMA ABYSS Handoff 2026-08-13 — Forbidden Forest Arisa/Haine Phase2

## Completed this unit

海底神殿後の本編導線について、第二単位をruntime実装済み。

`水上都市暴動鎮圧 → カザリア救援要請 → 禁忌の森深部 → アリサ／ハイネ救出・加入 → 水上都市帰還 → レクスノート邸の所在判明`

### Important runtime state

- `arisaHaineMainStoryRequired`: 水上都市の使いイベント後
- `arisaHaineMainStoryStarted`: カザリアで救援依頼受諾後
- `arisaHaineMainStoryCleared`: 深部ボス後
- `rexnoteRouteKnown`: 水上都市帰還後、ソフィア／ハイネ会話後
- Item 701012: `古びた魔笛`

### Character canon now reflected

- アリサ: ヴェリア出身。風へ旋律を捧げてきた楽師家系。本人へ全真相はまだ明かさない。
- ハイネ: Bランク冒険者。アレル侯から過去に護衛・討伐・輸送護衛等の依頼を何度か請けた。
- ハイネとアレルは親友／家臣関係ではない。

### Ancient flute

Item 701012 `古びた魔笛` として正式化。
入手場面ではヴェリアという名称を出さず、アリサの指が笛穴を覚えていることで伏線化。
後のエリシア／ヴェリア線まで由来説明を保留する。

### Save compatibility

`20260813_arisaHaineAncientFluteV1` を追加。
救出済みと確認できる旧セーブだけへ魔笛を一度補填する。
単にstoryStepが先へ進んでいるだけのセーブには補填しない。

## Do not redo

- 水上都市暴動5戦はPhase1で完成済み。
- クロード／レオン初対面は完成済み。
- 聖女の噂は完成済み。
- 禁忌の森の深部MAP／bossは既存を流用して成立している。今回MAP再作成は不要。
- アリサ／ハイネ加入導線は今回完成済み。

## Next priority

1. 暴動後の水上都市追加NPC
2. 噴水の戦後利用／演出
3. 水上都市の短い討伐依頼
4. その単位の通し確認
5. レクスノート邸地下B1～B5へ進む

レクスノート地下、301033魔導司書レグルス、船取得、アラン加入方式変更はまだruntimeへ入れない。

## Source of truth for this unit

- `development_notes/2026-08-13/scenario/FORBIDDEN_FOREST_ARISA_HAINE_PHASE2_APPROVED_20260813.md`
- `development_notes/2026-08-13/reports/FORBIDDEN_FOREST_ARISA_HAINE_PHASE2_IMPLEMENTATION_20260813.md`
- `docs/scenario/00_SCENARIO_CANON.md`
- `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
- `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`

## Validation policy

User instructed not to use bundled validation tools for now. Do not treat old validator assumptions as authoritative when they conflict with approved current canon.
