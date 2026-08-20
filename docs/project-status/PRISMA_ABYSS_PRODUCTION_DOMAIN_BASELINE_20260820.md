# PRISMA ABYSS 本番ドメイン・公開経路ベースライン

更新日: 2026-08-20  
適用開始: 2026-08-20

## 目的

2026-08-20以降の PRISMA ABYSS 開発では、YU-ZORA 本番ドメイン配下で公開・運用されていることを前提として実装、修正、検証を行う。

本資料は、日次の作業ログではなく、現在有効な本番公開ベースラインと、今後の変更時に守るべき運用上の前提を記録する。

## 現在の本番公開ベースライン

- 対象リポジトリ: `Yuzora-Yu/Prisma-Abyss`
- YU-ZORA 入口: `https://yu-zora.com/`
- PRISMA ABYSS の本番公開パス: `https://yu-zora.com/games/Prisma-Abyss/`
- 2026-08-20時点で Cloudflare Worker 側の YU-ZORA ドメイン経路は設定済み。
- YU-ZORA 側から PRISMA ABYSS へ遷移できる状態を本番の基準とする。
- `workers.dev` 等の直接URLは、動作確認や切り分けに使用してもよいが、プレイヤー向けの正規公開URLとは扱わない。

Cloudflare ダッシュボード上では PRISMA ABYSS Worker に追加の route が存在することも確認されているが、提供資料からその完全な文字列は確定できないため、本資料では推測して記載しない。route を変更する作業では、必ず Cloudflare 側の現行値を先に確認する。

## 2026-08-20以降の開発前提

今後の修正は、ローカル直下や GitHub Pages のルートだけで動くことを完成条件にしない。少なくとも本番の `/games/Prisma-Abyss/` 配下で正常に動作することを確認する。

過去資料に GitHub Pages を本番前提とした記述が残っていても、2026-08-20以降の本番確認では YU-ZORA / Cloudflare 経路を優先する。GitHub Pages 固有の設定を変更する場合も、それが現在の YU-ZORA 本番配信に自動適用されるとは考えない。

## サブパス公開を壊さないための実装規則

### URL・アセット参照

- `/games/Prisma-Abyss/` 配下での公開を前提にする。
- 画像、音声、CSS、JavaScript、JSON、動的読込、画面遷移等で、意図せずドメイン直下 `/` を基準にした絶対パスへ変更しない。
- `fetch()`、dynamic import、リンク生成、asset resolver、manifest、アイコン等を変更した場合は、本番サブパスから404にならないことを確認する。
- URLの `Prisma-Abyss` の大文字・小文字を安易に変更しない。公開経路の名称変更は Cloudflare route と YU-ZORA 側リンクを含む移行作業として扱う。

### Service Worker / PWA / キャッシュ

- Service Worker を使用する場合、その scope が PRISMA ABYSS の公開範囲を超えて `yu-zora.com/` 全体を不必要に支配しないようにする。
- キャッシュ名は PRISMA ABYSS 固有の名前空間を使用し、YU-ZORA 本体や他ゲームと衝突しないようにする。
- `manifest` の `start_url` / `scope` 等を変更する場合は、本番公開パスから起動できることを確認する。
- キャッシュ更新で旧版ファイルが残る場合は、単純な再読込だけでなく更新後の本番挙動も確認する。

### セーブ・ブラウザ保存領域

`yu-zora.com` 配下では複数のゲームやサービスが同じ origin を共有し得るため、localStorage / IndexedDB / Cache Storage 等のキーやDB名を汎用名だけで新設しない。

新規の保存領域は PRISMA ABYSS 固有の名前空間を付ける。既存の保存キーを変更する場合は、既存セーブ互換と移行処理を先に検討し、単純なリネームでプレイヤーデータを切り捨てない。

## Cloudflare route を変更するときの注意

- PRISMA ABYSS 用の変更で、`yu-zora.com/*` や `/games/*` 全体を不用意に取得する広すぎる route を設定しない。
- YU-ZORA 本体、ゲームポータル、他ゲームの route を巻き込まないことを確認する。
- route の追加・削除・名称変更を行う場合は、Cloudflare 側だけで完了とせず、YU-ZORA 側の遷移リンクも確認する。
- 本番経路を変えた場合は、本資料または後継の正本文書へ変更日と新しい公開URLを記録する。

## 本番確認の最低項目

変更を本番へ反映した後は、最低限以下を確認する。

1. `https://yu-zora.com/` から PRISMA ABYSS へ遷移できる。
2. `https://yu-zora.com/games/Prisma-Abyss/` を直接開いて起動できる。
3. CSS、JavaScript、画像、音声、主要データ等に404が出ていない。
4. 画面遷移・戦闘・マップ等、変更箇所に関係する主要runtimeが本番パスでも動く。
5. セーブ／ロードを変更した場合、既存保存データとの互換を確認する。
6. Service Worker / キャッシュを変更した場合、YU-ZORA 本体や他ゲームへ影響していないことを確認する。
7. 本番URLで再読込しても正常復帰する。

## 文書上の扱い

この内容は `development_notes/` の日次記録より優先して参照する現行の本番運用ベースラインとして扱う。

将来、公開経路とホスティング方針が長期的に固定された段階では、本資料の有効部分を `docs/development-policy.md` の「本番公開物・ホスティング方針」へ統合し、本資料は履歴として残すか、後継文書へ置き換える。

明示的な移行決定がない限り、2026-08-20以降の修正では「YU-ZORA 本番ドメイン配下の `/games/Prisma-Abyss/` で動作すること」を前提とする。
