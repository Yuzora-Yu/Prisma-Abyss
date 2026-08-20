# Light Palace Phase 19 — 六芒星アセット欠落修正 / 回想終了暗転

日付: 2026-08-20
基準: Phase 18 適用済み環境への差分

## 1. 六芒星が表示されなかった直接原因

Phase 18までの描画ロジックでは、六芒星を `ultimate-genesis-magic` として
`assets/effect/fx_ultimate_244_genesis_magic.png` から読み込む設計になっていた。

しかし、実際のPhase 18作業ツリーを再構成して確認したところ、`assets.js` には登録が存在する一方、
**画像ファイル本体がruntimeに存在していなかった**。

この状態ではPhaser側のpending spec、legacy Canvas fallback、再描画、画像ロード待機のいずれも
最終的な画像取得には成功しない。9タイル表示倍率が原因ではなかった。

Phase 19ではGitHubリポジトリの `assets/effect/` から画像アセットだけを取得し、runtimeへ追加した。
コードはGitHub版へ差し替えていない。

追加:
- `assets/effect/fx_ultimate_244_genesis_magic.png` — 384x384 RGBA PNG
- `assets/effect/fx-neutral-slash-ai.png` — 384x384 RGBA PNG

後者も `assets.js` には登録済みだがローカル実行物に欠けていたため、「黒白の葬閃」用斬撃演出の
次の欠落を防ぐ目的で同時に追加した。

六芒星の現行仕様は変更していない。
- MAP絶対座標 X17/Y16
- 9タイル規模
- 床より上、壁・人物・ボスより下
- Phaser利用時はworld object、Phaser不可時はlegacy Canvas fallback

## 2. 旧 `story_logic.js` が混ざる可能性の抑止

ユーザー環境のconsoleにはPhase 18 runtimeには既に存在しない
`world-space floor effect could not be rendered` 警告が表示されていた。

Service WorkerのApp Shell fallbackが `caches.match()` で全世代キャッシュを横断検索していたため、
ネットワーク失敗・更新境界では旧世代のJSだけがfallbackとして戻る可能性があった。

Phase 19ではApp Shellのfallbackを **現在の `CACHE_NAME` のみ**に限定した。
Cache世代も `prisma-abyss-v92.20260820` へ更新した。

これにより、story.jsだけ新しくstory_logic.jsだけ古い、といった世代混在を避ける。

## 3. 回想終了時の上下暗転

`LIGHT_PALACE_FLASHBACK_ESCAPE_END` の最後、
「クロードの記憶はそこで途切れる。」を含むシステム文が終わった後に、
上下から黒い幕が中央へ寄る場面転換を追加した。

処理順:
1. 回想最後の会話を表示
2. `VERTICAL_CURTAIN close` — 上下から720msで暗転
3. 完全暗転中に回想用field visualをcleanup
4. `SCENE_END` で現在時間・雷の要塞へ復帰
5. 90ms待って現在時間側の描画を安定させる
6. `VERTICAL_CURTAIN open` — 680msで上下へ開く
7. 現代側の `LIGHT_PALACE_FLASHBACK_RETURN_AFTERMATH` を開始

幕はMAP座標オブジェクトではなく画面全体のtransition overlayとして管理する。
エラー中断時に黒幕だけ残らないよう、イベント失敗処理でもoverlayを除去する。

## 4. 検証

- `node --check`: ルートJS 63/63 OK
- `tools/validation/validate-news-data.js`: 20 records / latest 2026-08-20 OK
- Phase 18回帰検証: OK
- Phase 19検証: OK
  - 六芒星画像ファイル存在確認
  - 黒白の葬閃画像ファイル存在確認
  - 両PNG 384x384確認
  - `assets.js` 登録先との一致確認
  - 旧blocking warning文字列がruntime `story_logic.js` に存在しないことを確認
  - 回想最後の会話 → close → SCENE_END → open → 現代会話の順序確認
  - Service Workerが現行世代cacheだけをApp Shell fallbackに使用することを確認

## 5. 実機確認ポイント

1. 回想3Fの封印イベントで六芒星がX17/Y16へ9タイル規模で出ること。
2. 歩行・リサイズしても六芒星がMAP座標から動かないこと。
3. 黒白の葬閃で白黒明滅と斬撃画像が出ること。
4. 回想最後の記憶文後、上下から暗転し、暗転中に雷の要塞へ戻ってから開くこと。
5. DevToolsで旧 `world-space floor effect could not be rendered` 警告が出ないこと。
