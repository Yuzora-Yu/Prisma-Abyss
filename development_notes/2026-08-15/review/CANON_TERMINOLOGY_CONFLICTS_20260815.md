# CANON 用語衝突監査 2026-08-15

Status: review / no runtime change

## 1. 焼け焦げたペンダント vs 焼け焦げたネックレス

### 安定している既存正本
`canon/PRISMA_SCENARIO_CANON_MASTER_v8.md`

- §5 見出し: **キーアイテム ― 焼け焦げたペンダント**
- 5年前にルーナがアルスへ託した私物。
- 五年間保持。
- 神性と記憶の残響を宿す。
- §22.15 でも **焼け焦げたペンダント** としてシステム役割を固定。

現行runtime:
- Item 701009: `焼け焦げたペンダント`
- Item 701010: `光結晶のペンダント`

### 後半追補での表記
- `PRISMA_SCENARIO_CANON_MASTER_v8.md` §47.4: **焼け焦げたネックレス**
- `PRISMA_CODING_HANDOFF_v5.md` 輪廻の結晶関連: **焼け焦げたネックレス**
- `PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md` ミネルバ補遺: **焼け焦げたネックレス**

### 判断
同じ `SCENARIO_CANON_MASTER_v8` 内で、専用章§5／§22.15は「ペンダント」、
後発の輪廻の結晶節だけ「ネックレス」になっている。

現時点では **runtimeの「ペンダント」を変更しない**。
輪廻の結晶proposalも実装時はItem ID 701009との互換を優先し、
ユーザーが用語を明示するまでは「ペンダント」を暫定正とするのが安全。

## 2. リュシオン vs ルシオン

### 安定している既存正本
- Character ID501見出し: **リュシオン**
- `PRISMA_SCENARIO_CANON_MASTER_v8.md` 全体では「リュシオン」が多数。
- 現行 `story.js` も **リュシオン**。

### 後半追補での表記
輪廻の結晶関連の一部に **ルシオン** が混在する。

### 判断
Character ID501の正式名と既存runtimeの整合から、
現時点では **リュシオン** を維持する。
「ルシオン」は後半追補時の表記揺れ／誤記候補として扱い、
ユーザー判断なしに全canonを機械置換しない。

## 3. 今回の扱い

- runtime変更なし。
- canonファイルの本文も勝手に修正しない。
- 新proposalでは既存Item名 `焼け焦げたペンダント` と正式Character名 `リュシオン` を使用。
- ユーザーが正式表記を確定した後、canon／runtime／docsを一括整合する。
