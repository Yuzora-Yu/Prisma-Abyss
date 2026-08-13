# 名もなき山村3区画 MAP統合・エンカウント区画化 2026-08-13

## 1. 点検結果

ユーザー指示どおり、冒頭の「名もなき山村」の3エリアを点検した。

変更前は以下がそれぞれ別MAP IDだった。

- 西の高台: `MAP000066`
- 南側: `MAP000067`
- 北側: `MAP000068`

これは2026-08-13に確定した「同一ロケーションの屋外／屋内・区画違いは同じ `mapId` で管理する」という契約と不整合だった。

## 2. 正規MAPへ統合

正規MAPを以下へ統一した。

- canonical key: `PROLOGUE_NAMELESS_VILLAGE`
- canonical mapId: `MAP000066`
- canonical name: `名もなき山村`

section構成:

- section 00: `PROLOGUE_WEST_HILL` / `名もなき山村・西の高台`
- section 01: `PROLOGUE_SOUTH_VILLAGE` / `名もなき山村・南側`
- section 02: `PROLOGUE_NORTH_VILLAGE` / `名もなき山村・北側`

旧 `MAP000067` / `MAP000068` は `RETIRED_MAP_IDS` に登録し、別ロケーションへ再利用しない。

旧map keyを参照するツールやデータとの互換用に `MAP_ID_ALIASES` を追加し、`PROLOGUE_WEST_HILL` / `PROLOGUE_SOUTH_VILLAGE` / `PROLOGUE_NORTH_VILLAGE` は全て `MAP000066` を返す。

## 3. 区画ごとの敵出現をfloorと分離

単にMAP IDだけを統合すると、南側と北側の生息域を `floor=1/2` で分ける実装になり、モンスター図鑑に「名もなき山村（1階）」「名もなき山村（2階）」のような不自然な表示が出る。

そのため、その場しのぎでfloorを流用せず、非ダンジョン固定MAPの共通契約として `section` を追加した。

- fixed-map runtime: `mapId + mapSection`
- battle encounter context: `encounterMapId + encounterSection`
- monster habitat master: `habitats[].sections`
- dungeon floor habitat: 従来どおり `habitats[].floors`

`MonsterData.getEncounterCandidates()` は `sections` が定義されたhabitatではsection一致を要求する。従来のfloor habitatはそのまま維持するため、既存ダンジョンへ影響を広げない。

## 4. 南側／北側の生息域

南側の序盤敵4種は以下へ移行した。

- canonical map: `MAP000066`
- section: `1`

北側の強めの通常生息域4種は以下へ移行した。

- canonical map: `MAP000066`
- section: `2`

これにより、同じ村MAPでありながら南北の通常生息域を混線させない。

## 5. 北側特殊エンカウント維持

北側の既存特殊仕様は変更していない。

- `rareEncounterAll: true`
- `encounterRankMin: 1`
- `encounterRankMax: 76`
- 50歩ごとに再出現する追跡型hunter
- hunter id: `prologue_north_rank100_hunter`
- hunter monster pool: `960`, `965`
- speed: `2`
- consume/re-spawn方式: 維持
- 回復地点: 維持

hunter状態は固定非ダンジョンでは従来どおりareaKey単位で管理されるため、MAP ID統合によって南側へhunter状態が漏れる構造にはしていない。

## 6. モンスター図鑑表示

section habitatを図鑑で自然に表示するため、共通のsection解決APIを追加した。

- `MapRegistry.getMapSections(mapIdOrKey)`
- `MapRegistry.getMapSectionName(mapIdOrKey, section)`

これにより、該当モンスターは「名もなき山村（1階）」ではなく、

- `名もなき山村・南側`
- `名もなき山村・北側`

として表示される。

## 7. 続きとして行った共通整備

今回の点検で、MAP section契約がMAP ID／floorIdの付与までは共通化されていた一方、非ダンジョンの遭遇コンテキストにはsectionが渡っていないことが分かった。

このため、名もなき山村だけへ個別分岐を追加せず、以下を共通化した。

- legacy map-key aliasからcanonical MAPを引ける `MapRegistry.getMapDefinition()`
- section一覧／名称の共通解決
- Field -> Battleへの `encounterSection` 引き継ぎ
- Battle -> MonsterDataへのsection引き継ぎ
- MonsterData habitatのsection判定
- 図鑑のsection名称解決

今後、同一施設内で区画ごとに敵出現を変える場合も同じ契約を利用できる。

## 8. 追加監査

既存MAP masterには、城・地下牢・塔など名称上は大きな施設の一部に見えるlegacy MAPも存在する。ただし、それらは既に独立した探索ロケーション／生息域／進行単位として長期間運用されているものがあり、「名称が似ている」だけで一括統合するとセーブ・図鑑・探索進行を壊す可能性がある。

今回、ユーザーが明示した名もなき山村以外について、意味上の同一ロケーションであることが確定していないlegacy MAPの大量統合は行っていない。今後のMAP追加では今回のsection契約を正とする。

## 9. 更新ファイル

Runtime:

- `map.js`
- `maps_logic.js`
- `main.js`
- `battle.js`
- `monsters.js`
- `news.js`

Validation maintenance:

- `tools/validation/validate-monster-habitat-master.js`（新section契約へ追随。今回の指示に従い実行はしていない）
- `development_notes/2026-08-13/targeted_prologue_map_section_check_20260813.js`

Canon:

- `canon/PRISMA_CODING_HANDOFF_v5.md`
- `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`

## 10. 検証

同梱validatorは、最新handoffの方針どおり実行していない。

実行したもの:

- `node --check map.js`: PASS
- `node --check maps_logic.js`: PASS
- `node --check main.js`: PASS
- `node --check battle.js`: PASS
- `node --check monsters.js`: PASS
- `node --check news.js`: PASS
- `development_notes/2026-08-13/targeted_followup_check_20260813.js`: PASS
- `development_notes/2026-08-13/targeted_map_section_volcano_check_20260813.js`: PASS
- `development_notes/2026-08-13/targeted_prologue_map_section_check_20260813.js`: PASS

新規targeted result:

```json
{
  "canonicalMap": "MAP000066",
  "sections": "00/01/02 ok",
  "southHabitat": "ok",
  "northHabitat": "ok",
  "northHunter": "ok",
  "encyclopediaLabels": "ok",
  "encounterSectionRuntime": "ok"
}
```

## 11. 実機確認優先項目

1. NEW GAMEの西の高台 -> 南側 -> 北側 -> 南側の区画移動。
2. 南側で序盤の通常敵が出現し、北側用の強めhabitatが混ざらないこと。
3. 北側で強めの通常敵・レア遭遇が従来どおり機能すること。
4. 北側で50歩後にhunterが出現し、接触戦闘・再出現が従来どおり機能すること。
5. 北側から南側へ戻った後、hunterの追跡状態が南側へ漏れないこと。
6. 図鑑の該当モンスター生息地が「名もなき山村・南側／北側」で表示され、「1階／2階」にならないこと。
7. 既存のリースの山小屋／レクスノート邸 section運用が回帰していないこと。
