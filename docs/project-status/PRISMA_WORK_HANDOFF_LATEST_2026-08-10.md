# PRISMA ABYSS — 作業引き継ぎ書 最新版

**更新:** 2026-08-10  
**用途:** 次Chat/次作業開始時に最初に読む短縮版。詳細技術仕様は `PRISMA_CODING_HANDOFF_v5.md`。

## 1. 最新基準

- 最新累積コード: `PRISMA_PHASE7C_CRYSTAL_TREE_M0_2026-08-10.zip`
- 最新Coding Handoff: `PRISMA_CODING_HANDOFF_v5.md`
- Scenario Canon: `PRISMA_SCENARIO_CANON_MASTER_v8.md`
- Character/Boss Encyclopedia: `PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md`
- Developer Core Thoughts: `PRISMA_DEVELOPER_CORE_THOUGHTS_v6.md`
- Asset Backlog: `ASSET_BACKLOG_20260810_v6.md`

Libraryへ保存する作業物は必ず `/作業/` 配下。

## 2. 今の本編位置

現在の新規実装終端:

- `storyStep = 7`
- `subStep = 11`
- 表示目的: 「根元に残ったミネルバと話そう」

ここまではプレイ導線を接続済み。

## 3. 結晶樹 Phase 7C で実装したもの

1. 水上都市のソフィアから結晶樹への手掛かりを聞く。
2. 会話後のみ北側の古い水門が使用可能。
3. 水門から `CRYSTAL_TREE / MAP000073` へ移動。
4. MAP000073は1枚のM0固定MAP。最終フロア数ではない。
5. ミネルバ(ID206)を実フィールドNPCとして配置。
6. ミネルバ初対面後、ルーナ(ID401)正式加入。
   - EXP要求倍率2000%。
   - `App.addStoryAlly()` のcarryoverにより光宮殿回想のLv/EXP/装備を最低保証。
7. 根元で魔王軍直接戦闘②。
   - M0編成: 652 / 755 / 652。
   - 新しい固有幹部は作っていない。
8. 勝利後:
   - `crystalTreeCleared`
   - `crystalTreeState=5`
   - `lunaCrystalTreeStabilized`
   - `leonCrystalTreeTreated`
   - `lunaMemoryStage=2`
   - ルーナ Story EXP +300,000（一度のみ）
   - EXP倍率1800%
9. Step8へはまだ進めない。

## 4. 次にやること

最優先は**ミネルバの結晶樹クリア後会話**。

扱う内容:

- 六属性の本来の役割。
- 闇は「還す/休ませる」力であり、本来の闇に人を支配する性質はない。
- 黒いオーラ/暗黒騎士/深淵を単純な闇属性と同一視できなくなる。
- 魔王軍と二度戦った事実は残るため、即「味方」とは判断しない。
- 魔王城へ行く理由を「討伐」から「真実を確かめる」へ変える。

**この会話は長会話扱い。先にMarkdown稿をユーザーへ提示し、一度確認を受けてからstory.jsへ実装する。**

その後:

- Step8移行。
- 魔王城前の地理/既存洞窟/旧イベント監査。
- 魔王城の「説明よりMAP/NPC配置で反転を見せる」再構成。

## 5. 絶対に戻さない品質基準

- プレイヤー向け文章へ開発者の状態管理・実装理由を出さない。
- 「見れば分かる」ことをシステム文で重ねない。
- MAP移動成功だけのログを出さない。
- 同MAP内区画移動/固定MAPからフィールド退出は踏み式を基本。
- フロア移動は階段。
- 別MAPへの移動はアクション式でよい。
- 未知の地名/人名を目的欄で先出ししない。
- 症状だけを隠す局所hotfixではなく、共有ロジックの正本を直す。
- 長い会話はchapter単位でユーザー確認後に最終実装。
- M0 MAPを最終地理/最終フロア数として扱わない。

## 6. 既知の検証状況

- `tools/validation/run-all.js` を工程ゲートで使用。
- 最新実行: **54本中10本FAIL**。
- 画像assets本体が提供コードに無いため、画像関連validator 10件は既知FAIL。
- 画像不足を理由に製品コード・参照を削らない。
- Phase7C用 `validate-crystal-tree-route-phase7c.js` を追加。

## 7. Asset

Asset台帳は `ASSET_BACKLOG_20260810_v6.md`。

Phase7C追加候補:

- 水上都市 古い北水門prop。
- 結晶樹の根/結晶/水路tileset。
- 結晶樹根源域prop。
- 初回防衛戦background。
- ルーナ/レオン治療pose。

存在しないassetを `assets.js` へ架空登録しない。完成後にmanifest/full-cache validatorと同時接続。


## 8. Phase 7C の再実行安全性

- `crystal_tree_minerva_meeting` は、ルーナ正式加入・state/subStep更新を先に行い、`crystalTreeMinervaMet` を最後に確定する。
- `crystal_tree_defense_clear` は、ルーナ+300,000 EXP・1800%設定・治療stateを先に適用し、`crystalTreeCleared` を最後のcommit flagとして立てる。
- 中断や再入場が起きても、once-only reward key `luna_crystal_tree_300k` により二重加算せず、逆に報酬だけ取り逃がす順序にも戻さない。
- `7-9` の目的文は「結晶樹の根元へ向かおう」。PT満員時にルーナがactive battle partyへ自動挿入されない可能性があるため、UIで強制同行を偽らない。
