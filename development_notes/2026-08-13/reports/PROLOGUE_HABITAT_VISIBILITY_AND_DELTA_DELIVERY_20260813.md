# 名もなき山村・図鑑生息域非掲載 / 差分ZIP納品運用 2026-08-13

## 1. 要求の整理

名もなき山村は `MAP000066` の同一MAP sectionとして維持する一方、冒頭専用の特殊MAPであり、通常の「その地域に生息する魔物」を示す場所ではないため、モンスター図鑑の生息域一覧には表示しない。

重要なのは、以下を混同しないこと。

- encounter habitat: 実際の遭遇候補を決めるruntimeデータ
- encyclopedia habitat: プレイヤーへ図鑑で見せる生息域ラベル

名もなき山村の遭遇用 `habitats[].sections` を削除すると南／北の通常遭遇を壊すため、monster側へ特例を置かずMAP側の表示ポリシーで分離した。

## 2. 共通ポリシー

`MAP_MASTER` に任意フラグを追加した。

```js
showMonsterHabitatInEncyclopedia: false
```

未指定MAPは従来どおり表示する。

共通解決口:

- `MapRegistry.shouldShowMonsterHabitatInEncyclopedia(mapIdOrKey)`

`MonsterData.getHabitatLabels()` は、通常floor habitat / section habitatのどちらでもラベル生成前にこのポリシーを参照する。

これにより今後、チュートリアル、イベント専用空間、特殊選定エリアなど「遭遇は存在するが生息域として図鑑へ載せたくないMAP」をmonster IDごとの分岐なしで管理できる。

## 3. 名もなき山村

`PROLOGUE_NAMELESS_VILLAGE / MAP000066` にのみ現在 `showMonsterHabitatInEncyclopedia:false` を設定した。

維持事項:

- section 00 西の高台
- section 01 南側
- section 02 北側
- 南側の通常habitat
- 北側の通常habitat
- `rareEncounterAll:true`
- Rank 1～76
- 50歩hunter
- hunter monster IDs `[960,965]`
- hunter stateのareaKey単位管理

変更されたのは**図鑑ラベル表示だけ**。

例:

- Monster 1 ジェリー: `リュミナ村周辺`, `北東の洞穴（1階）` は表示、名もなき山村は非表示
- Monster 51 さまよう鎧: `森の風穴（1～2階）`, `炎の里イグニシア周辺` は表示、名もなき山村は非表示

## 4. 差分ZIP納品運用

今後は累積版ZIPに加えて、変更・新規作成ファイルだけの差分ZIPを必ず作成する。

差分ZIPの要件:

- project root相対パスを保持
- 既存作業フォルダへそのまま上書き展開できる
- runtimeだけでなく、その工程で更新したcanon / handoff / reports / validator maintenanceも含める
- ファイル削除はZIP上書きだけでは表現できないため、削除発生時はmanifestへ明記する

今回、削除ファイルはない。

## 5. 続きの作業についての監査

最新正本と現行runtimeを再確認した。

深淵後半の六精霊試練自体は現行 `story.js` / `abyss_content.js` / `battle.js` に既に存在する一方、プレイヤー向け名称と内部識別には旧 `オクタプリズマ` が残っている。新正本では `輪廻の結晶` へ再定義されている。

ただし既存player-facing UI文言は「現行／修正案を提示して承認後に置換する」という同日handoffのレビュー契約があるため、本工程ではユーザー依頼と直接関係しない名称置換を黙って混ぜていない。

次の独立工程では、save互換のため内部 `octaprism*` key / flag / migration IDは安易に改名せず、player-facing item名・説明・戦闘ログ・授与演出と新正本の「循環」意味付けをまとめて監査するのが安全。

## 6. 更新ファイル

Runtime:

- `map.js`
- `maps_logic.js`
- `monsters.js`

Canon:

- `canon/PRISMA_CODING_HANDOFF_v5.md`
- `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`

Validation maintenance:

- `tools/validation/validate-monster-habitat-master.js`
- `development_notes/2026-08-13/targeted_prologue_map_section_check_20260813.js`

New documentation:

- 本レポート
- 最新handoff
- validation log
- delta manifest

## 7. 検証

同梱validator一式は最新handoff方針に従って実行していない。

PASS:

- `node --check map.js`
- `node --check maps_logic.js`
- `node --check monsters.js`
- `node --check development_notes/2026-08-13/targeted_prologue_map_section_check_20260813.js`
- `node --check tools/validation/validate-monster-habitat-master.js`
- `development_notes/2026-08-13/targeted_prologue_map_section_check_20260813.js`
- `development_notes/2026-08-13/targeted_followup_check_20260813.js`
- `development_notes/2026-08-13/targeted_map_section_volcano_check_20260813.js`

Targeted result:

```json
{
  "canonicalMap": "MAP000066",
  "sections": "00/01/02 ok",
  "southHabitat": "ok",
  "northHabitat": "ok",
  "northHunter": "ok",
  "encyclopediaHabitatSuppression": "ok",
  "encounterSectionRuntime": "ok"
}
```

## 8. 実機確認優先

1. 南側／北側の通常遭遇が従来どおりであること。
2. 北側rare / 50歩hunterが維持されること。
3. Monster 1 / 51等の図鑑に「名もなき山村」が出ないこと。
4. 同じmonsterの他地域の生息域は引き続き表示されること。
5. リース山小屋／レクスノート邸のsection表示には影響がないこと。
