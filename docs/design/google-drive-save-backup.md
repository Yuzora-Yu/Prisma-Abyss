# Google Driveセーブバックアップ方針

Last updated: 2026-08-14

## 目的

ユーザーが管理場所を迷わず、サイトデータ削除後にも復旧できる任意のバックアップ経路としてGoogle Driveを利用する。ゲーム独自アカウントや管理者サーバーは設けない。

## プライバシー境界

- OAuth scopeは `https://www.googleapis.com/auth/drive.file` だけを要求する。
- `email`、`profile`、`openid`、Drive全体を読むscopeは要求しない。
- ブラウザからGoogle Drive APIへ直接送受信し、管理者サーバーへアクセストークン、Googleアカウント情報、セーブ本文を送らない。
- アクセストークンは実行中のメモリだけに保持し、localStorage、IndexedDB、Cookieへ保存しない。
- Drive上では `マイドライブ/Prisma Abyss Backups/prisma_abyss_all_saves.rpgsave` を正規保存先とする。
- バックアップはオートセーブと手動No.1～20を含む。既存ファイルを明示操作で更新し、自動バックアップには使用しない。

## 有効化

Google Cloud ConsoleでWeb OAuthクライアントを作成し、配信元のHTTPS originを承認済みJavaScript生成元へ登録する。取得したクライアントIDを `index.html` と `main.html` の次のmeta要素へ設定する。

```html
<meta name="google-drive-client-id" content="取得したクライアントID">
```

空欄の配布物では、Google Driveの出力・読込ボタンを無効化し、`＜有効化が必要です＞` と表示する。

## 復旧動作

Google Driveから読込む前に暗号化ラッパー、全データ形式、オートセーブと全手動レコードのチェックサム、各payloadのJSON形式を検査する。検査完了後にユーザー確認を行い、手動枠とオート枠を置換する。途中失敗時は読込前の手動レコードとオートセーブへ戻す。
