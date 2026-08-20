PRISMA ABYSS - Cloudflare patch
=================================

目的
----
Prisma-Abyss を以下のURLで公開するためのインフラ設定です。

https://yu-zora.com/games/Prisma-Abyss/

設計
----
- ゲーム本体は極力変更しません。
- 既存 _config.yml の production exclusions をCloudflare buildでも踏襲します。
- build後の配置は:
    dist/games/Prisma-Abyss/...
- このため、CSS/JS/画像/Service Worker/manifest は公開URLと同じパスで
  Cloudflare Static Assetsから直接配信できます。
- /games/Prisma-Abyss/ だけWorkerが main.html へ案内します。
- index.html は既存ゲーム本体としてそのまま残します。
- 本番Routeはこのパッチには入れていません。workers.dev確認後にDashboardで追加します。

既存 _config.yml から引き継ぐ除外対象
------------------------------------
image-backups
edit
canon
development_notes
docs
tools
logs
.agents

さらにCloudflare公開時のみ除外
------------------------------
.git
.github
.wrangler
node_modules
dist
worker
.gitignore
_config.yml
package.json
package-lock.json
wrangler.jsonc

適用手順
--------
このZIP内のファイルを Prisma-Abyss リポジトリ直下へ展開してください。

PowerShell:

npm.cmd install
npm.cmd test
git status

npm.cmd test 成功後、dist は .gitignore によりGit管理対象外になります。

確認予定URL（Cloudflare初回Deploy後）
------------------------------------
https://yu-zora-prisma-abyss.rikai-829.workers.dev/games/Prisma-Abyss/

ゲーム本体:
https://yu-zora-prisma-abyss.rikai-829.workers.dev/games/Prisma-Abyss/index.html

Service Worker:
https://yu-zora-prisma-abyss.rikai-829.workers.dev/games/Prisma-Abyss/sw.js

manifest:
https://yu-zora-prisma-abyss.rikai-829.workers.dev/games/Prisma-Abyss/manifest.json

workers.dev直下が Not Found でも正常です。

本番Route（workers.dev確認後）
-----------------------------
yu-zora.com/games/Prisma-Abyss/*

Cloudflare Worker name
----------------------
yu-zora-prisma-abyss
