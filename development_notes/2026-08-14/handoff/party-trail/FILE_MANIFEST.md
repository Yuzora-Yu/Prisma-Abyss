# 配布ファイル・マニフェスト

## 今回変更したゲームファイル（6件）

1. `main.js`
2. `phaser-field.js`
3. `news.js`
4. `sw.js`
5. `docs/development-policy.md`
6. `docs/design/character-walk-assets.md`

## 配布補助ファイル（2件）

1. `development_notes/2026-08-14/handoff/party-trail/README.md`
2. `development_notes/2026-08-14/handoff/party-trail/FILE_MANIFEST.md`

## ZIPに同梱する歩行画像（256件）

次の32系列について、それぞれ `_down_1.png`、`_down_2.png`、`_left_1.png`、`_left_2.png`、`_right_1.png`、`_right_2.png`、`_up_1.png`、`_up_2.png` の8ファイルを `assets/characters/walk/` に収録する。

- `101`、`102`、`103`、`104`、`105`、`106`、`107`、`108`、`109`、`110`
- `201`、`202`、`203`、`204`、`205`、`206`、`207`、`208`、`209`、`210`
- `301`、`301_flying`、`301_past5y`、`302`、`303`、`304`、`305`、`306`
- `401`、`402`、`403`、`501`

## ZIPへ追加同梱する参照登録ファイル（1件）

- `assets.js`（歩行画像256件の登録内容。今回の隊列実装より前に更新済み）

ZIP内部は合計265ファイル（変更ゲームファイル6件、配布補助2件、歩行画像256件、参照登録ファイル1件）。

