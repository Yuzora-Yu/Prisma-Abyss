# PRISMA ABYSS — Character Portrait / Service Worker Phase 27

Date: 2026-08-20  
Base: Phase 26 + user replacements of `main.html` and `assets.js`

## Scope

実環境でService Worker installが以下の404により失敗していた。

- `assets/characters/char_face_301_past5y.png` -> HTTP 404
- `precacheRequiredList()` が必須precache失敗としてthrowし、新Service Worker install全体を中断

また、プロローグの13歳ルーナ（character 403）の会話で、
`assets/characters/portraits-all-expressions/char_face_403_normal.png` が存在せず、portraitが非表示になっていた。

## Root cause

### Service Worker

`assets.js` のcritical image listに、実在しない旧形式の5年前アルス会話画像
`assets/characters/char_face_301_past5y.png` が残っていた。

Service Workerは重要画像を「必須」として扱う設計のため、404を検出すると
`Required precache failed` をthrowし、新版SWへの切り替えを拒否していた。

このstrict policy自体は更新直後の必須画像欠落を防ぐ目的があるため維持し、誤った必須URLのみ除去する。

### Conversation portrait

`setConversationPortrait()` の従来fallbackは「指定表情 -> normal」までで、
normal portrait自体が存在しない場合に常設 `assets/characters/face/<id>.png` へ退避しなかった。

さらにcharacter 403は `prologueOnly: true` で、表情差分portraitを持たず基本face画像を正本とする構成だった。

## Changes

### `assets.js`

critical image listから以下を削除。

- `assets/characters/char_face_301_past5y.png`

以下は維持。

- `assets/characters/face/301_past5y.png`

### `main.js`

5年前アルスはportrait/faceの両用途で以下を使用。

- `assets/characters/face/301_past5y.png`

また `prologueOnly` キャラクターは存在しない表情差分URLを生成せず、
`getDefaultFaceIconPath()` を直接返す。現在該当するのは13歳ルーナ（403）。

### `story_logic.js`

会話portraitのfallbackを以下へ拡張。

1. 指定表情portrait
2. normal portrait
3. `assets/characters/face/<id>.png` 相当のdefault face
4. 全候補失敗時のみ非表示

候補URLは重複排除する。

### `sw.js`

App Shell cache generationを更新。

- `prisma-abyss-v99.20260820`
- -> `prisma-abyss-v100.20260820`

`Required precache failed` のstrict policyは維持。

## Expected result

- 実環境で `char_face_301_past5y.png` の404によりSW installが失敗しない
- 5年前アルスの会話画像は `face/301_past5y.png` を使用
- 13歳ルーナ（403）は `face/403.png` を直接使用し、`char_face_403_normal.png` を要求しない
- 他キャラで表情差分が不足していても、最終的に基本faceへfallbackする

## Validation

- `assets.js`, `main.js`, `story_logic.js`, `sw.js` syntax check passed
- all top-level JavaScript syntax checks passed
- Phase 27 validator passed
- invalid `char_face_301_past5y.png` reference absent from runtime files
- Service Worker cache generation v100 confirmed
