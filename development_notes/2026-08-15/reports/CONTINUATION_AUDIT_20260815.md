# PRISMA ABYSS 継続作業監査 2026-08-15

## 1. 参照優先順位

今回の継続作業は、以下を優先して照合した。

1. `AGENTS.md`
2. `.agents/skills/rpg-scenario-polisher/SKILL.md`（GitHub公開版）
3. `canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`
4. `canon/PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md`
5. `canon/PRISMA_CODING_HANDOFF_v5.md`
6. `canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md`
7. `canon/PRISMA_DEVELOPER_CORE_THOUGHTS_v6.md`
8. `development_notes/2026-08-10` ～ `2026-08-14`
9. 現行runtime (`story.js`, `story_logic.js`, `main.js`, `map.js`, `battle.js`, `items.js`, `abyss_content.js` 等)

GitHub公開tree上も `development_notes` は 2026-08-14 まで、canon は上記5ファイル構成であることを確認した。

## 2. 直近作業の整理

### 完了済みとして扱う

2026-08-12 時点で大型未実装だった以下は、2026-08-13 の実装記録とruntimeを照合し、継続キューから外す。

- 禁忌の森／アリサ・ハイネ救援と正式加入
- 水上都市暴動後の住民・錬金案内・噴水・討伐依頼
- レクスノート邸地下B1～B5
- 魔導司書レグルス ID301033
- レクスノートの魔道書 ID701013
- 地下調査後の船取得・アラン正式加入
- レクスノート邸外周とハヤテ無言接触
- 海底火山F1～F3の可変ダンジョン化
- リース山小屋／レクスノート邸のsection整理
- プロローグ生息域非表示契約
- マップ隊列・歩行画像256枚の登録とparty trail

### 保留を維持する

以下は現行資料でユーザー判断／素材承認待ちと明示されているため、今回runtimeへ接続しない。

1. **初回画像キャッシュ方針変更**
   - 2026-08-14 auditでは3層化案が提案されている。
   - 一方、現行 `AGENTS.md` / current product directives は全量キャッシュを維持する方針。
   - 方針変更はユーザー判断が必要。

2. **幼少期アルス 32×32 歩行候補**
   - `development_notes/2026-08-14/review/child-ars-walk-32x32-candidate/`
   - QA済みだがREADMEで「候補素材・ゲーム本体へ未接続」と明示。
   - 現行歩行素材の置換は承認待ち。

## 3. 今回着手した次工程

2026-08-13の監査で次の独立工程として明示された、
**旧「オクタプリズマ」から正本「輪廻の結晶」への整合監査**を開始した。

### 重要な差分

現行runtime:
- 六精霊試練をすべて終える。
- `ABYSS_SPIRIT_TRIAL_ALL_COMPLETE` が即時再生。
- 焼け焦げたペンダントが変化。
- リュシオンが「オクタプリズマ」を授与。
- Item 701008を即時取得。

canon v8:
- 六精霊から六つの結晶片を得る。
- 結晶樹の秘跡へ戻る。
- ミネルバが六片を融合せず環状配置し「循環の儀」を主導。
- 水→風→光→火→雷→闇→水……の循環を成立させる。
- ルーナ、焼け焦げたネックレス、リュシオンの神性痕跡が共鳴。
- 人間の理論へ神が立ち会う形でリュシオンが一時顕現。
- **輪廻の結晶**が生まれる。

したがって、単純な表示名置換では不十分。
イベント発火場所と授与タイミングを変更する必要がある。

### canon内部の用語衝突

輪廻の結晶関連追補には、既存専用章と異なる表記が混在する。

- §5 / §22.15 とruntime: `焼け焦げたペンダント`
- §47.4 等の一部追補: `焼け焦げたネックレス`
- Character ID501正式名／runtime: `リュシオン`
- 一部追補: `ルシオン`

今回は既存専用章・Character master・runtimeとの整合を優先し、
`焼け焦げたペンダント` / `リュシオン` を暫定維持する。
canon本文はユーザー判断なしに機械修正しない。
詳細: `development_notes/2026-08-15/review/CANON_TERMINOLOGY_CONFLICTS_20260815.md`

## 4. 互換性方針

既存セーブ保護のため、以下は当面内部名を維持する。

- `octaprismItemId`
- `OCTAPRISM_SUPPORT_MASTER`
- `abyssOctaprismGrantPending`
- `abyssOctaprismGrantEventSeen`
- `abyssOctaprismUsed`
- `octaprismState`
- `20260804_pendantOctaprismV1`

表示名・説明・新規event/script名は将来 `cycleCrystal` 系へ寄せられるが、
既存flag/keyを一括renameしない。

既にItem 701008を所持する旧セーブは、取得済み状態を巻き戻さない。
新しい循環の儀を「未体験だから」と強制再生して二重授与しない。

## 5. 今回作成するレビュー成果物

- `docs/scenario/44_CYCLE_CRYSTAL_RITUAL_REALIGNMENT_PROPOSAL_20260815.md`
- `docs/scenario/07_DIALOGUE_REVIEW_QUEUE.md` へ pending entry追記
- `docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md` の該当文言へ提案追記
- `development_notes/2026-08-15/review/CYCLE_CRYSTAL_RUNTIME_TEXT_AUDIT_20260815.md`
- `development_notes/2026-08-15/handoff/PRISMA_ABYSS_HANDOFF_20260815.md`

runtime本体は承認前なので変更しない。

## 6. 静的確認

アップロード版に含まれるトップレベルJavaScriptを `node --check` で確認。

- 対象: 62ファイル
- PASS: 62
- FAIL: 0

`tools/validation/` は今回アップロード版に含まれていないため、
READMEにある `run-core.js` / `run-all.js` はこの環境では実行していない。

## 7. 次の実装順

ユーザー承認が得られた場合の順序:

1. Item 701008のplayer-facing名称・説明を「輪廻の結晶」へ更新。
2. 六精霊試練完了時は「結晶片が揃った」状態だけcommit。
3. 結晶樹への帰還導線を解禁。
4. ミネルバ主導の循環の儀eventを追加。
5. ルーナ／ネックレス／リュシオン共鳴後にItem 701008を授与。
6. 旧セーブmigrationを非退行で追加。
7. battle支援ロジックは内部octaprism keyを維持し、player-facing logだけ更新。
8. `news.js` は実際にplayer-facing変更を実装した日だけ更新。
9. 対象validationを追加・実行。
