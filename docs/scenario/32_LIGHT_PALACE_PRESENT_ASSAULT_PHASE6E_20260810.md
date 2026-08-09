# 光の宮殿・現在時間攻略 Phase 6E 実装骨格

作成日: 2026-08-10
基準: PRISMA_SCENARIO_CANON_MASTER_v8 / Phase 6D 回想完了後

## この工程の範囲

長台詞の最終稿は実装しない。情報順・移動理由・救出対象・アラン離脱をプレイ可能な骨格として固定する。

## 正式進行

1. クロードの回想完了後、アルス一行が現在時間の光の宮殿へ突入。
2. ルーナは雷の要塞救護所に残る。
3. 宮殿地下牢の看守を突破。
4. 国王、レイラ、レオンの所在をそれぞれ確認。
   - 国王: ジャスパーにより投獄済み。
   - レイラ: 肉体損傷＋比較的浅い呪縛。
   - レオン: 生命魔力構造へ達する深い光の呪い。結晶樹の葉では治療不能。
5. 三名の所在確認後のみ、4階・光の祭壇のジャスパー／ヴェルド戦へ進める。
6. 現在時間の祭壇戦は旧「強制敗北→リュシオン加護→再戦」を使用しない。
7. ジャスパー／ヴェルドを追い詰めた直後、アランが不意打ち。
8. アランの全装備を所持品へ返却してから同行不可にする。加入履歴は残す。
9. アランは光プリズムの力を取り込み、「これで準備は整った。」を残して、深淵へ退くジャスパー／ヴェルドを追う。
10. 地下牢へ戻り、国王・レオン・レイラ・国王派を保護して宮殿を解放。
11. 直後、雷の要塞から魔王軍侵攻の急報。次工程の要塞防衛へ接続。

## 実装用 state

### WorldState: lightPalaceState

- 0: 回想未完了／現在攻略前
- 1: 回想完了・現在攻略可能
- 2: 現在時間の宮殿へ侵入
- 3: 地下牢の主要三名を確認
- 4: 祭壇戦後・アラン裏切り発生
- 5: 宮殿解放・雷要塞急報

### flags

- lightPalaceKingLocated
- lightPalaceLeilaLocated
- lightPalaceLeonLocated
- lightPalacePrisonRescueSecured
- lightPalacePresentBossDefeated
- alanEquipmentReturnedAtBetrayal
- alanBetrayedLightPalace
- lightPalaceLiberationSeen
- thunderFortDemonAssaultAlert

## 台詞方針

今回のJS実装は、正本で既に確定している情報とシステム上必要な最短文だけに留める。
ジャスパー、ヴェルド、国王、レオン、レイラ、アランの長会話は後の章別Dialogue Polishでユーザー確認後に確定する。

### 今回実装してよい最小文

- 現在時間へ戻ったことを示す入口文。
- レオンの呪いがレイラより深いことを示す診断用システム文。
- 地下牢確認前に祭壇へ進めない旨。
- アラン裏切り時の正本確定文「これで準備は整った。」
- 宮殿解放直後の雷要塞急報。

## Review result

Target: Phase 6E current Light Palace assault skeleton
Reviewer: implementation pass
Date: 2026-08-10

### Scores
- Character voice separation: 4（長台詞を新規確定しない）
- On-screen readability and dialogue rhythm: 5
- Spoiler discipline: 5
- Lived-in world detail: 3（後工程）
- Exposition control: 5
- Foreshadowing subtlety: 5
- Flag and party awareness: 5
- Existing dialogue handling: 5
- Implementation readiness: 5

### Required fixes before implementation
- 旧強制敗北ルートを新ルートから参照しない。
- アラン装備返却→離脱の順序を保証する。
- 旧saveの lightPalaceCleared / storyStep>=8 を巻き戻さない。

### User approval required
- 長い最終戦会話・国王会話の全面改稿は別途ユーザー確認。

### Codex recommendation
- implement skeleton now / dialogue polish later

## storyStep 接続補足（2026-08-10）

旧実装の `lightPalaceCleared -> storyStep 8` は新版では使用しない。
Phase 6E〜雷要塞防衛までは `storyStep 7` 内の subStep を拡張して管理する。

- 7-0: 現在時間の光宮殿攻略／地下牢確認
- 7-1: 三名確認後、光の祭壇へ
- 7-2: アラン裏切り後、地下牢へ戻る
- 7-3: 宮殿解放直後、雷の要塞へ急行

これにより、雷要塞防衛前に旧 `8-0: 魔王城へ` の目標が表示される矛盾を防ぐ。
Step 8へ進めるタイミングは雷要塞防衛〜ルーナ覚醒の接続工程で改めて確定する。
