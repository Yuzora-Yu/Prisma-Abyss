# PRISMA ABYSS — Phase 6C 炎楔のグラド再戦 / Asset台帳 状況 v1

**作成日:** 2026-08-09  
**基準:** Phase 6A/B 雷の要塞→大灯台ルート完成版 + Phase 6B 海底火山5区画を手動統合  
**状態:** 海底火山グラド再戦、第二結界源破壊、雷の要塞帰還〜ルーナ生存判明、回想開始直前まで接続

## 1. 枝統合

ライブラリに存在した以下2枝を比較して統合した。

- Phase 6A/B: 雷の要塞危機、ゼリード大灯台本編加入、雷要塞ギルドでバロン/マリー/フリーダ先行。
- Phase 6B: 海底火山5区画、underseaVolcanoState、光宮殿二段階gate。

Phase 6B側を単純上書きするとPhase 6A/Bのギルド導線が消えるため、Phase 6A/B full sourceを基準に海底火山部分だけを手動移植した。

正しい導線は以下。

**大灯台 → ゼリード加入 → 雷の要塞ギルド → バロン/マリー/フリーダ先行 → 海底火山 → グラド → 雷の要塞へ帰還 → クロード＋ルーナ**

## 2. 海底火山

ユーザー指定どおり、MAPは5区画から増やしていない。

1. 第1層・海底火道
2. 第2層・圧熱回廊
3. 第3層・火脈深部
4. 研究区画
5. 最奥・戦闘エリア

第1〜3層のみ通常エンカウント。研究区画/最奥はランダムエンカウントなし。

## 3. 炎楔のグラド（海底火山）

### 固定ボス

- ID: `301063`
- 表示名: `炎楔のグラド`
- image fallback: `301010`
- race: `人`
- Rank: 64
- HP: 10800
- MP: 1850
- ATK: 230
- DEF: 168
- SPD: 158
- MAG: 240
- MDEF: 174
- HIT: 155
- EVA: 8
- CRI: 18
- 2回行動
- 火耐性: 85
- 水耐性: -25

初戦301010/イベントvariant803010は変更していない。

### 新規スキル

- `700201 炎楔連斬` — 火属性単体2連物理。
- `700202 紅蓮断界` — 火属性全体物理。
- `700203 火脈暴流` — 火属性全体魔法＋DEF/MDEF低下。
- `700204 焔炉心解放` — 自己強化。ATK/MAG/SPD/属性耐性上昇。
- `700205 炎楔・天穿` — HP低下後に比重が上がる単体極大火属性魔法。

初戦の「大技収束失敗」と対比し、海底火山では失敗ルールを付けない。最大技まで正常発動する。

### 新規ボス専用特性

- `62 炎楔同化`
- `63 灼熱循環`
- `64 深海耐圧`

3特性は `bossOnly:true`。
特性書、装備特性抽選、通常モンスターのランダム特性、キャラ特性再抽選へ混入しないよう抽選入口を修正した。

## 4. ボス配置・進行

海底火山5Fの最奥戦闘エリアへ301063を配置。

- `undersea_grad_encounter`
- `undersea_grad_clear`
- clear flag: `underseaVolcanoCleared`

勝利時:

- `underseaGradDefeated = true`
- `underseaVolcanoCleared = true`
- `underseaVolcanoState = 5`
- `thunderFortState = 4`
- Story 6-5へ

グラドは死亡確定にせず、研究炉奥へ退く。第二結界源は破壊される。

## 5. 光宮殿への接続

海底火山クリアだけでは光宮殿へ入れない。

新規プレイでは:

1. 海底火山を攻略。
2. 雷の要塞へ戻る。
3. クロードが昏睡したルーナを抱えて到着。
4. ここでアルス/プレイヤーが初めてルーナ生存を知る。
5. クロードから宮殿での出来事を聞く。
6. `lightPalaceFlashbackReady` まで進む。
7. 次工程でレイラ操作・セピア回想を実装。
8. 回想完了後にのみ光宮殿実侵入を解禁する。

旧saveで既にstoryStep>=7の場合は従来どおりlegacy bypassを維持する。

## 6. Asset制作台帳

`docs/project-status/ASSET_BACKLOG_20260809.md` を追加。

P0として特に以下を登録。

- 名もなき山奥の村: 平穏tileset / 崩壊tileset / 信仰小物 / 地割れ。
- プロローグ戦闘背景4種。
- 13歳アルス/13歳ルーナ(ID403)顔グラ。
- 13歳アルス/ルーナ歩行チップ 4方向×2。
- 海底火山: 自然3層 / 研究区画 / 最奥のtileset。
- 海底火山戦闘背景。
- 完全適応グラド専用sprite/effect候補。
- 全プレイアブル30名の最低4方向×2歩行チップ一覧。
- 光宮殿回想、レクスノート邸、結晶樹、終盤MAPの後続asset候補。

未完成assetの架空パスはmanifestへ登録せず、現状は既存asset fallbackで動かす。

## 7. 検証

新規validator:

- `validate-undersea-grad-phase6c.js`

PASS確認:

- undersea Grad 301063 / 5新スキル / 3新特性
- bossOnly traitの抽選漏出防止
- 海底火山5F配置
- victory state更新
- 大灯台→雷要塞guild→海底火山の順序
- クロード/ルーナ帰還導線
- 光宮殿の回想前侵入防止
- `validate-undersea-volcano-phase6b.js`
- `validate-lighthouse-zelied-volcano-route-phase6b.js`
- `validate-thunder-fort-state-phase6a.js`
- `validate-map-actors.js`
- `validate-story-dialogue-data.js`
- `validate-main-story-routing.js`
- `validate-news-data.js`

`run-all.js`: **10 / 46 FAIL**。

FAIL数は従来と同じ10件で、添付コード側に画像assets一式が存在しないことによる既知項目のみ。今回のPhase 6Cによる新規回帰は確認されていない。

## 8. 次工程

次はPhase 6Dとして、以下を行う。

1. 雷要塞ギルド区画のクロード語りから回想Scene Context開始。
2. セピアfilter。
3. レイラ(ID204)一時操作。
4. 光宮殿内部を回想専用一時party/map stateで進行。
5. 回想終了時に雷要塞へ完全復帰。
6. `lightPalaceFlashbackCompleted` を現在世界側へ確定保存。
7. storyStep 7へ進め、初めて光宮殿への実侵入を許可。

長台詞は骨格のみ実装し、最終文面は後で章単位調整する。
