/* story_logic.js - generated split from original story.js. Keep editor output out of this file. */
const StoryManager = {
    // ==========================================
    // 0. プロパティ・初期化
    // ==========================================
    textSpeed: 20,
    newlineWait: 400,
    backlog: [],
    active: false,
    currentScript: null,
    index: 0,
    onComplete: null,
    mapTransferRecheckTokens: new Set(),
    resumeRunnerActive: false,
    resumeRunnerToken: null,

    // ==========================================
    // 目的表示の正本
    // ==========================================
    // 今後の「現在の目的」テキストは storyStep / subStep を基準にここで管理する。
    // UI側や main.js 側に目的文の switch 文を増やさないこと。
    // 現在のメインストーリー上限に到達した場合は、
    // 下の dungeonObjectiveMilestones に従ってダンジョン目標へ自動で切り替える。
    maxMainStoryProgress: (typeof STORY_MANAGER_DATA !== "undefined" && STORY_MANAGER_DATA.maxMainStoryProgress) ? STORY_MANAGER_DATA.maxMainStoryProgress : { storyStep: 10, subStep: 0 },

    storyObjectives: (typeof STORY_MANAGER_DATA !== "undefined" && STORY_MANAGER_DATA.storyObjectives) ? STORY_MANAGER_DATA.storyObjectives : {},

    storyDungeonObjectiveMilestones: (typeof STORY_MANAGER_DATA !== "undefined" && STORY_MANAGER_DATA.storyDungeonObjectiveMilestones) ? STORY_MANAGER_DATA.storyDungeonObjectiveMilestones : [],
    randomDungeonObjectiveMilestones: (typeof STORY_MANAGER_DATA !== "undefined" && STORY_MANAGER_DATA.randomDungeonObjectiveMilestones) ? STORY_MANAGER_DATA.randomDungeonObjectiveMilestones : [],

    getProgressKey: function(progress) {
        const step = Number(progress?.storyStep || 0);
        const sub = Number(progress?.subStep || 0);
        return `${step}-${sub}`;
    },

    isMainStoryComplete: function(progress) {
        const step = Number(progress?.storyStep || 0);
        const sub = Number(progress?.subStep || 0);
        const max = this.maxMainStoryProgress;
        if (step > max.storyStep) return true;
        if (step < max.storyStep) return false;
        return sub >= max.subStep;
    },

    getDungeonObjectiveText: function(data) {
        const dungeon = data?.dungeon || {};
        const progress = data?.progress || {};
        const randomUnlocked = !!progress.flags?.abyssRandomUnlocked;
        const maxFloor = randomUnlocked
            ? Number(dungeon.maxFloor || 0)
            : Number(dungeon.storyMaxFloor || progress.maxFloor || 0);
        const tryCount = randomUnlocked
            ? Number(dungeon.randomTryCount || 0)
            : Number(dungeon.storyTryCount || dungeon.tryCount || 0);

        if (maxFloor <= 0 && tryCount <= 0) {
            return "メニューからダンジョンに挑戦しよう";
        }

        const milestones = randomUnlocked
            ? this.randomDungeonObjectiveMilestones
            : this.storyDungeonObjectiveMilestones;
        for (const milestone of milestones) {
            if (maxFloor < milestone.floor) return milestone.text;
        }

        const killCounts = data?.book?.killCounts || {};
        const calamityKills = Number(killCounts[902000] || 0);
        if (calamityKills <= 0) {
            return "ふるびたコインを集めて災厄に挑もう";
        }

        return "ダンジョンで最強装備をそろえよう";
    },

    getObjectiveText: function(data = null) {
        if (!data && typeof App !== 'undefined') data = App.data;
        const progress = data?.progress || {};
        const flags = progress.flags || {};
        const prologueStage = Math.max(0, Number(progress.worldState?.prologueStage || 0));
        if (prologueStage >= 100 && flags.prologuePresentWakeSeen) {
            if (!flags.prologueReesDepartureTalkSeen) return 'リースと話そう';
            if (!flags.prologueDepartedReesHut) return '山小屋を出よう';
            if (!flags.presentLuminaRescueSeen) return '山を下りた先の村の様子を確かめよう';
            if (!flags.luminaVillageNameKnown) return '村の長老と話そう';
            if (Number(progress.storyStep || 0) === 0) return 'リュミナ村の長老に話を聞こう';
        }
        if (prologueStage > 0 && prologueStage < 100) {
            if (prologueStage <= 1) return 'ルーナを追って村へ戻ろう';
            if (prologueStage === 2) return '悲鳴のした方へ急ごう';
            if (prologueStage === 3) return 'ルーナと家族を探しに家へ戻ろう';
            if (prologueStage === 4) return '崩れ続ける村から逃げよう';
            if (prologueStage >= 5) return '出口を塞ぐ巨大な影に立ち向かおう';
        }
        const currentArea = (typeof Field !== 'undefined' && typeof Field.getCurrentAreaKey === 'function')
            ? Field.getCurrentAreaKey()
            : data?.location?.area;
        const abyssAreas = globalThis.ABYSS_REGION_MASTER?.areaKeys || [];
        // 追憶の魔境は既存ダンジョン基盤の都合で内部areaにABYSSを使うが、
        // 本編の深淵地域へ入ったことにはしない。既に本編深淵へ到達済みなら
        // abyssFirstEnteredを正本として従来どおり深淵側の目的を表示する。
        const activeAbyssMode = globalThis.ABYSS_FLOOR_RULES?.getMode?.(data)
            || data?.dungeon?.abyssMode
            || '';
        const isMemoryRealmActive = globalThis.ABYSS_FLOOR_RULES?.isMemoryMode?.(activeAbyssMode) === true;
        const isCurrentAbyssStoryArea = !isMemoryRealmActive && abyssAreas.includes(String(currentArea || ''));
        const hasEnteredAbyssRegion = !!flags.abyssFirstEntered
            || isCurrentAbyssStoryArea
            || !!flags.abyssCarmenaGateCleared;
        if (hasEnteredAbyssRegion) {
            if (!flags.abyssCarmenaGateCleared) return 'カルメナ北門を守る二将を倒そう';
            if (!flags.abyssLeonardDefeated || !flags.abyssEliciaDefeated) return '東西の楔を倒し、第一層の結界を解こう';
            if (!flags.abyssSyrisDefeated || !flags.abyssGradDefeated) return 'ビスタの先で二つの楔を倒そう';
            if (!flags.abyssLegacionNorthGateOpen) return 'レガシオンの謁見の間へ向かおう';
            if (!flags.abyssVeldDefeated) return '夢幻回廊リドパルムの最深部へ進もう';
            if (!flags.abyssJasperDefeated) return '災禍の根ジャゴレアでジャスパーを追おう';
            if (flags.abyssAllSpiritTrialsCleared && !flags.abyssCycleCrystalCreated) {
                return '六つの結晶片を持ち、結晶樹の秘跡へ戻ろう';
            }
            if (flags.abyssIlluminaciaDefeated && !flags.abyssAllSpiritTrialsCleared) {
                return '地上の六つのプリズムを巡り、大精霊の試練を終えよう';
            }
            if (!flags.abyssIlluminaciaDefeated) {
                const insideChronoRoute = flags.abyssChronoGateOpened || ['CHRONO_ABYSS', 'FINAL_ALTAR'].includes(String(currentArea || ''));
                return insideChronoRoute
                    ? '次元牢獄クロノアビスの最深部へ進もう'
                    : '混沌の結晶片で地下神殿の封印門を開こう';
            }
            if (!flags.abyssVegnasisDefeated) return '終焉の祭壇で死幻の魔柱を倒そう';
            if (!flags.abyssAzelgaragDefeated) return '深淵王アゼルガラグを倒そう';
            if (!flags.abyssEpilogueSeen) return '深淵王との戦いを見届けよう';
            if (!flags.abyssRandomUnlocked) return '終焉の祭壇に残った亀裂を調べよう';
        }

        if (this.isMainStoryComplete(progress)) {
            return this.getDungeonObjectiveText(data);
        }

        const key = this.getProgressKey(progress);
        if (this.storyObjectives[key]) return this.storyObjectives[key];

        // 未定義の進行度でも画面が空にならないようにする。
        // 新しい storyStep/subStep を追加したら、まず storyObjectives に目的文を足す。
        return "冒険を進めよう！";
    },
	

    /**
     * ストーリー演出用の一時強化APIを、story.js側で安全に補完する。
     *
     * もともと TEMP_LB_START / TEMP_LB_CLEAR は App.activateTemporaryStoryPower /
     * App.clearTemporaryStoryPower の存在を前提にしていたが、実装が無い環境では
     * 命令が無視され、開幕全滅後のLB99救済が発動しなかった。
     *
     * この補完は「現在の戦闘パーティだけ」を一時的にLB99扱いにし、
     * 戦闘終了または明示解除時に元のLBへ戻す。lbProgress は触らないため、
     * 通常の限界突破進行には影響しない。
     */
    installTemporaryStoryPowerApi: function() {
        if (typeof App === 'undefined' || !App) return false;

        const getPartyTargets = () => {
            if (!App.data || !Array.isArray(App.data.characters)) return [];
            const partyUids = Array.isArray(App.data.party)
                ? App.data.party.filter(uid => !!uid)
                : [];

            let targets = App.data.characters.filter(c => c && partyUids.includes(c.uid));

            // パーティ情報が壊れていても、開幕救済だけは主人公へ届くようにする。
            if (targets.length === 0) {
                const hero = App.data.characters.find(c => c && (c.charId === 301 || c.uid === 'p1' || c.isHero));
                if (hero) targets = [hero];
            }

            return targets;
        };

        const clampLb = (value) => {
            return Math.max(0, Math.min(99, Math.floor(Number(value) || 0)));
        };

        const recalcAndClampVitals = (char) => {
            if (!char || typeof App.calcStats !== 'function') return;
            const stats = App.calcStats(char);
            if (Number.isFinite(Number(stats?.maxHp)) && char.currentHp !== undefined) {
                char.currentHp = Math.max(0, Math.min(Number(char.currentHp) || 0, stats.maxHp));
            }
            if (Number.isFinite(Number(stats?.maxMp)) && char.currentMp !== undefined) {
                char.currentMp = Math.max(0, Math.min(Number(char.currentMp) || 0, stats.maxMp));
            }
        };

        const findCharByUid = (uid) => {
            if (!App.data || !Array.isArray(App.data.characters)) return null;
            return App.getChar
                ? App.getChar(uid)
                : App.data.characters.find(c => c && c.uid === uid);
        };

        // 重要：一時LB99のまま App.syncDerivedLimitBreaks() が走ると、
        // backfillLimitBreakLegacy が「正規のLB99」と誤認して恒久化してしまう。
        // そのため、同期時だけ元LBへ戻し、同期後に再び一時LBを適用する。
        if (typeof App.syncDerivedLimitBreaks === 'function' && !App.__storyTempPowerSyncWrapped) {
            const originalSyncDerivedLimitBreaks = App.syncDerivedLimitBreaks.bind(App);
            App.syncDerivedLimitBreaks = function(options = {}) {
                const temp = App.data?.progress?.tempStoryPower;
                if (!temp || !Array.isArray(temp.targets)) {
                    return originalSyncDerivedLimitBreaks(options);
                }

                temp.targets.forEach(snapshot => {
                    const char = findCharByUid(snapshot.uid);
                    if (char) char.limitBreak = clampLb(snapshot.limitBreak);
                });

                const result = originalSyncDerivedLimitBreaks(options);

                // 同期によって得た正規LBを、解除時の復元先として更新する。
                temp.targets.forEach(snapshot => {
                    const char = findCharByUid(snapshot.uid);
                    if (!char) return;
                    snapshot.limitBreak = clampLb(char.limitBreak);
                    App.captureStoryCharacterLimitBreakCarryover?.(char, { save:false });
                });

                const targetLb = clampLb(temp.limitBreak ?? 99);
                temp.targets.forEach(snapshot => {
                    const char = findCharByUid(snapshot.uid);
                    if (!char) return;
                    char.limitBreak = targetLb;
                    if (typeof App.calcStats === 'function') App.calcStats(char);
                });

                return result;
            };
            App.__storyTempPowerSyncWrapped = true;
        }

        if (typeof App.applyTemporaryStoryPower !== 'function') {
            App.applyTemporaryStoryPower = function() {
                const temp = App.data?.progress?.tempStoryPower;
                if (!temp || !Array.isArray(temp.targets)) return false;

                const targetLb = clampLb(temp.limitBreak ?? 99);
                temp.targets.forEach(snapshot => {
                    const char = App.getChar
                        ? App.getChar(snapshot.uid)
                        : App.data.characters.find(c => c && c.uid === snapshot.uid);
                    if (!char) return;
                    char.limitBreak = targetLb;
                    if (typeof App.calcStats === 'function') App.calcStats(char);
                });
                return true;
            };
        }

        if (typeof App.activateTemporaryStoryPower !== 'function') {
            App.activateTemporaryStoryPower = function(options = {}) {
                if (!App.data) return false;
                if (!App.data.progress) App.data.progress = {};

                const id = options.id || 'story_temp_power';
                const targetLb = clampLb(options.limitBreak ?? options.value ?? 99);

                // 別IDの一時強化が残っている場合は、先に元へ戻してから開始する。
                const current = App.data.progress.tempStoryPower;
                if (current && current.id && current.id !== id && typeof App.clearTemporaryStoryPower === 'function') {
                    App.clearTemporaryStoryPower({ id: current.id, force: true, skipSave: true });
                }

                const existing = App.data.progress.tempStoryPower;
                if (existing && existing.id === id && Array.isArray(existing.targets)) {
                    existing.limitBreak = targetLb;
                    existing.reason = options.reason || existing.reason || 'story_event';
                    existing.persistAcrossBattles = options.persistAcrossBattles === true || existing.persistAcrossBattles === true;
                    App.applyTemporaryStoryPower();
                    if (!options.skipSave && typeof App.save === 'function') App.save();
                    return true;
                }

                const targets = getPartyTargets();
                if (targets.length === 0) return false;
                targets.forEach(char => App.captureStoryCharacterLimitBreakCarryover?.(char, { save:false }));

                App.data.progress.tempStoryPower = {
                    id,
                    limitBreak: targetLb,
                    reason: options.reason || 'story_event',
                    persistAcrossBattles: options.persistAcrossBattles === true,
                    startedAt: Date.now(),
                    targets: targets.map(c => ({
                        uid: c.uid,
                        limitBreak: clampLb(c.limitBreak)
                    }))
                };

                App.applyTemporaryStoryPower();
                if (!options.skipSave && typeof App.save === 'function') App.save();
                if (typeof Menu !== 'undefined' && typeof Menu.renderPartyBar === 'function') Menu.renderPartyBar();
                return true;
            };
        }

        if (typeof App.clearTemporaryStoryPower !== 'function') {
            App.clearTemporaryStoryPower = function(options = {}) {
                const temp = App.data?.progress?.tempStoryPower;
                if (!temp) return false;

                const requestedId = options.id || null;
                if (requestedId && temp.id !== requestedId && !options.force) return false;

                if (Array.isArray(temp.targets)) {
                    temp.targets.forEach(snapshot => {
                        const char = App.getChar
                            ? App.getChar(snapshot.uid)
                            : App.data.characters.find(c => c && c.uid === snapshot.uid);
                        if (!char) return;
                        char.limitBreak = clampLb(snapshot.limitBreak);
                        recalcAndClampVitals(char);
                    });
                }

                delete App.data.progress.tempStoryPower;

                // 戦闘勝利などで恒久的なLB進行が増えていた場合は、解除後に正規値へ再同期する。
                if (typeof App.syncDerivedLimitBreaks === 'function') {
                    App.syncDerivedLimitBreaks();
                    if (Array.isArray(temp.targets)) {
                        temp.targets.forEach(snapshot => {
                            const char = App.getChar
                                ? App.getChar(snapshot.uid)
                                : App.data.characters.find(c => c && c.uid === snapshot.uid);
                            if (char) App.captureStoryCharacterLimitBreakCarryover?.(char, { save:false });
                            recalcAndClampVitals(char);
                        });
                    }
                }

                if (!options.skipSave && typeof App.save === 'function') App.save();
                if (typeof Menu !== 'undefined' && typeof Menu.renderPartyBar === 'function') Menu.renderPartyBar();
                return true;
            };
        }

        return true;
    },

    /**
     * 主人公のリミットブレイクを同期
     */
    syncHeroLimitBreak: function() {
		if (!App.data || !App.data.characters) return;
		this.installTemporaryStoryPowerApi();
		const hero = App.data.characters.find(c => c.charId === 301 || c.uid === 'p1');
		if (hero && App.data.progress && App.data.dungeon) {
			if (typeof App.syncDerivedLimitBreaks === 'function') {
				App.syncDerivedLimitBreaks({ heroOnly: true });
			}
			// 一時強化中のロード復帰・STEP同期でLB99が消えないように再適用する。
			if (App.data.progress.tempStoryPower && typeof App.applyTemporaryStoryPower === 'function') {
				App.applyTemporaryStoryPower();
			}
			if (typeof App.calcStats === 'function') App.calcStats(hero);
		}
	},
	


    /**
     * フィールド演出は story.js の会話スクリプト内に直接書く。
     * main.js には「画像を指定タイルに置く」などの描画補助だけを残し、
     * シナリオ固有の座標・移動・暗転・エフェクトは各イベント本文の commands で管理する。
     * 旧来のプリセット参照は廃止し、ストーリーを書きながら座標や演出タイミングを調整できる構成に統一する。
     */

    cloneFieldVisualCommand: function(cmd) {
        if (!cmd || typeof cmd !== 'object') return cmd;
        const copy = { ...cmd };
        if (cmd.fallback && typeof cmd.fallback === 'object') copy.fallback = { ...cmd.fallback };
        return copy;
    },

    isInlineStoryCommand: function(line) {
        if (!line || typeof line !== 'object') return false;
        return line.type === 'FIELD_CUTSCENE'
            || line.type === 'MAP_VISUAL'
            || line.type === 'WAIT'
            || line.type === 'STORY_UI'
            || line.op !== undefined;
    },

    getInlineStoryCommandCommands: function(line) {
        if (!line || typeof line !== 'object') return null;
        if (Array.isArray(line.commands)) return line.commands.map(cmd => this.cloneFieldVisualCommand(cmd));
        if (Array.isArray(line.visual)) return line.visual.map(cmd => this.cloneFieldVisualCommand(cmd));
        if (line.op !== undefined) return [this.cloneFieldVisualCommand(line)];
        if (line.type === 'FIELD_CUTSCENE' || line.type === 'MAP_VISUAL') {
            // 演出内容はイベント本文の commands / visual に直接書く。
            // 旧来の value プリセット参照は廃止し、空指定なら実行しない。
            return null;
        }
        return null;
    },

    getFieldVisualAnchor: function(options = {}) {
        if (options.anchor && Number.isFinite(Number(options.anchor.x)) && Number.isFinite(Number(options.anchor.y))) {
            return { x: Number(options.anchor.x), y: Number(options.anchor.y) };
        }
        if (Number.isFinite(Number(options.x)) && Number.isFinite(Number(options.y))) {
            return { x: Number(options.x), y: Number(options.y) };
        }
        if (typeof Field !== 'undefined' && typeof Field.getLastFixedBossEventPosition === 'function') {
            return Field.getLastFixedBossEventPosition();
        }
        if (typeof Field !== 'undefined') return { x: Number(Field.x || 0), y: Number(Field.y || 0) };
        return { x: 0, y: 0 };
    },

    resolveStoryFieldVisualTile: function(cmd, anchor) {
        // 長いイベントでは主人公が途中で移動する。演出座標をその時々の
        // player座標へ再解決すると、再読込・画面サイズ変更・再描画後に人物や
        // エフェクトの基準がずれるため、anchorKey指定時は保存済みMAP座標を正本にする。
        const storedAnchor = cmd?.anchorKey ? this.getStoryFieldVisualAnchorState(cmd.anchorKey) : null;
        const resolvedAnchor = storedAnchor || anchor;
        if (typeof Field !== 'undefined' && typeof Field.resolveFieldCutsceneTile === 'function') {
            return Field.resolveFieldCutsceneTile(cmd, resolvedAnchor);
        }
        const base = cmd?.base === 'player' && typeof Field !== 'undefined'
            ? { x: Number(Field.x || 0), y: Number(Field.y || 0) }
            : (resolvedAnchor || { x: 0, y: 0 });
        return {
            x: Number(cmd?.x ?? base.x) + Number(cmd?.dx || 0),
            y: Number(cmd?.y ?? base.y) + Number(cmd?.dy || 0)
        };
    },

    rememberStoryFieldVisualAnchor: function(key, cmd = {}, anchor = null) {
        const visualKey = String(key || '').trim();
        if (!visualKey || typeof App === 'undefined' || !App.data) return null;
        const tile = this.resolveStoryFieldVisualTile(cmd, anchor);
        if (!Number.isFinite(Number(tile?.x)) || !Number.isFinite(Number(tile?.y))) return null;
        if (!App.data.progress || typeof App.data.progress !== 'object') App.data.progress = {};
        if (!App.data.progress.storyVisualAnchors || typeof App.data.progress.storyVisualAnchors !== 'object' || Array.isArray(App.data.progress.storyVisualAnchors)) {
            App.data.progress.storyVisualAnchors = {};
        }
        let areaKey = null;
        try { areaKey = typeof Field !== 'undefined' && typeof Field.getCurrentAreaKey === 'function' ? Field.getCurrentAreaKey() : App.data?.location?.area; } catch (_) {}
        const floor = Number(typeof Dungeon !== 'undefined' ? Dungeon.floor : App.data?.progress?.floor);
        const value = {
            x: Number(tile.x),
            y: Number(tile.y),
            areaKey: areaKey || App.data?.location?.area || null,
            floor: Number.isFinite(floor) ? floor : null,
            monsterId: Number.isFinite(Number(cmd.monsterId)) ? Number(cmd.monsterId) : null,
            characterId: Number.isFinite(Number(cmd.characterId ?? cmd.charId)) ? Number(cmd.characterId ?? cmd.charId) : null,
            size: Number.isFinite(Number(cmd.size)) ? Number(cmd.size) : null,
            direction: cmd.direction || null
        };
        App.data.progress.storyVisualAnchors[visualKey] = value;
        if (typeof App.save === 'function') App.save();
        return value;
    },

    getStoryFieldVisualAnchorState: function(key) {
        const visualKey = String(key || '').trim();
        const value = App?.data?.progress?.storyVisualAnchors?.[visualKey];
        return value && typeof value === 'object' ? value : null;
    },

    resolveStoryGraphicKey: function(keyOrSrc) {
        const raw = String(keyOrSrc || '').trim();
        if (!raw) return '';
        const graphics = globalThis.GRAPHICS;
        if (typeof graphics?.resolveKey === 'function') return graphics.resolveKey(raw) || raw;
        if (graphics?.data?.[raw]) return raw;
        const entries = Object.entries(graphics?.data || {});
        const found = entries.find(([, src]) => String(src || '') === raw);
        return found?.[0] || raw;
    },

    isStoryGraphicReady: function(keyOrSrc) {
        const key = this.resolveStoryGraphicKey(keyOrSrc);
        if (!key) return false;
        const image = globalThis.GRAPHICS?.images?.[key];
        return !!(image?.complete && Number(image?.naturalWidth || image?.width || 0) > 0);
    },

    ensureStoryGraphicReady: async function(keyOrSrc) {
        const key = this.resolveStoryGraphicKey(keyOrSrc);
        if (!key) return false;
        if (this.isStoryGraphicReady(key)) return true;
        const graphics = globalThis.GRAPHICS;
        if (typeof graphics?.request !== 'function') return false;
        try {
            const image = await graphics.request(key, { maxAttempts: 3, redraw: false });
            return !!(image?.complete && Number(image?.naturalWidth || image?.width || 0) > 0);
        } catch (error) {
            console.warn('[StoryManager] story graphic preload failed:', key, error);
            return false;
        }
    },

    resolveStoryFieldVisualSrc: function(cmd) {
        if (!cmd) return '';
        if (cmd.src) return cmd.src;
        if (cmd.characterId !== undefined || cmd.charId !== undefined) {
            const characterId = cmd.characterId ?? cmd.charId;
            const direction = ['down', 'left', 'right', 'up'].includes(cmd.direction) ? cmd.direction : 'down';
            const step = Number(cmd.step) === 2 ? 2 : 1;
            const graphic = typeof App !== 'undefined' && typeof App.getCharacterWalkGraphicPresentation === 'function'
                ? App.getCharacterWalkGraphicPresentation(characterId, direction, step)
                : null;
            if (graphic?.key) {
                return globalThis.PRISMA_ASSETS?.graphics?.[graphic.key]
                    || globalThis.GRAPHICS?.data?.[graphic.key]
                    || globalThis.GRAPHICS?.images?.[graphic.key]?.src
                    || '';
            }
        }
        if (cmd.monsterId !== undefined && typeof Field !== 'undefined' && typeof Field.getMonsterMapSpriteSrc === 'function') {
            return Field.getMonsterMapSpriteSrc(cmd.monsterId);
        }
        if (cmd.monsterId !== undefined) {
            return (typeof MonsterData !== 'undefined' && typeof MonsterData.getImagePath === 'function')
                ? MonsterData.getImagePath(cmd.monsterId)
                : window.PRISMA_ASSETS?.getMonsterImagePath?.(cmd.monsterId);
        }
        if (cmd.effect === 'slash') return 'assets/effect/fx_phys_neutral_slash.png';
        return '';
    },

    getStoryFieldVisualZIndex: function(cmd, tile, fallbackZ = 4) {
        const rawZ = Number(cmd?.z ?? fallbackZ);
        const localZ = Number.isFinite(rawZ) ? rawZ : fallbackZ;

        // キャラ・敵などの通常スプライトは、画面下側（Y座標が大きい）ほど前面に出す。
        // 既存の z は同じY座標内の微調整値として扱い、Y差がある場合はY順を優先する。
        // 斬撃などのエフェクトや明示指定したものは従来通り固定 z にできる。
        if (cmd?.autoDepth === false || cmd?.fixedZ === true || cmd?.effect) return localZ;

        const y = Number(tile?.y ?? 0);
        const depthY = Number.isFinite(y) ? y : 0;
        return Math.round(1000 + (depthY * 20) + localZ);
    },

    getStoryFieldVisualSpriteCss: function(cmd, tile, fallbackZ = 4) {
        const z = this.getStoryFieldVisualZIndex(cmd, tile, fallbackZ);
        const opacity = cmd?.opacity !== undefined ? Number(cmd.opacity) : 1;
        return `z-index:${z}; opacity:${Number.isFinite(opacity) ? opacity : 1};` + (cmd?.css || '');
    },

    putStoryFieldVisualSprite: function(cmd, anchor) {
        if (typeof Field === 'undefined' || typeof Field.putFieldVisualSprite !== 'function') return null;
        const src = this.resolveStoryFieldVisualSrc(cmd);
        if (!src) return null;
        const tile = this.resolveStoryFieldVisualTile(cmd, anchor);
        const css = this.getStoryFieldVisualSpriteCss(cmd, tile, 4);
        return Field.putFieldVisualSprite(cmd.id || `field-visual-story-${Date.now()}`, src, tile, cmd.size || 2, css);
    },

    showStoryCharacterVisual: function(cmd, anchor) {
        if (!cmd || (cmd.characterId === undefined && cmd.charId === undefined)) return false;
        const renderer = globalThis.PhaserFieldRenderer;
        if (!renderer?.isReady?.() || typeof renderer.showStoryCharacterSprite !== 'function') return false;
        const tile = this.resolveStoryFieldVisualTile(cmd, anchor);
        const id = cmd.id || `field-story-char-${Date.now()}`;
        const shown = renderer.showStoryCharacterSprite(id, {
            characterId: cmd.characterId ?? cmd.charId,
            direction: cmd.direction || 'down',
            step: cmd.step,
            size: cmd.size || 1,
            opacity: cmd.opacity,
            x: tile.x,
            y: tile.y
        }) === true;
        if (shown && typeof document !== 'undefined') document.getElementById(id)?.remove();
        return shown;
    },


    showStoryMonsterVisual: function(cmd, anchor) {
        if (!cmd || cmd.monsterId === undefined) return false;
        const renderer = globalThis.PhaserFieldRenderer;
        if (!renderer?.isReady?.() || typeof renderer.showStoryMonsterSprite !== 'function') return false;
        const tile = this.resolveStoryFieldVisualTile(cmd, anchor);
        const id = cmd.id || `field-story-monster-${Date.now()}`;
        const shown = renderer.showStoryMonsterSprite(id, {
            monsterId: cmd.monsterId,
            size: cmd.size || 2,
            opacity: cmd.opacity,
            x: tile.x,
            y: tile.y
        }) === true;
        if (shown && typeof document !== 'undefined') document.getElementById(id)?.remove();
        return shown;
    },

    showStoryWorldImageVisual: function(cmd, anchor) {
        if (!cmd || (!cmd.src && !cmd.key)) return false;
        const renderer = globalThis.PhaserFieldRenderer;
        if (!renderer?.isReady?.() || typeof renderer.showStoryImageSprite !== 'function') return false;
        const tile = this.resolveStoryFieldVisualTile(cmd, anchor);
        const id = cmd.id || `field-story-image-${Date.now()}`;
        const shown = renderer.showStoryImageSprite(id, {
            key: cmd.key,
            src: cmd.src,
            size: cmd.size || 2,
            opacity: cmd.opacity,
            depthOffset: cmd.depthOffset,
            depthMode: cmd.depthMode,
            fixedDepth: cmd.fixedDepth === true,
            depth: cmd.depth,
            x: tile.x,
            y: tile.y
        }) === true;
        if (shown && typeof document !== 'undefined') document.getElementById(id)?.remove();
        return shown;
    },

    moveStoryCharacterVisual: async function(cmd, anchor) {
        if (!cmd || (cmd.characterId === undefined && cmd.charId === undefined)) return false;
        const renderer = globalThis.PhaserFieldRenderer;
        if (!renderer?.isReady?.() || typeof renderer.moveStoryCharacterSprite !== 'function') return false;
        const tile = this.resolveStoryFieldVisualTile(cmd, anchor);
        const id = cmd.id || '';
        const result = await renderer.moveStoryCharacterSprite(id, {
            characterId: cmd.characterId ?? cmd.charId,
            direction: cmd.direction || 'down',
            step: cmd.step,
            walk: cmd.walk === true,
            size: cmd.size || 1,
            opacity: cmd.opacity,
            x: tile.x,
            y: tile.y,
            duration: Math.max(0, Number(cmd.duration || 160))
        });
        if (result === true && id && typeof document !== 'undefined') document.getElementById(id)?.remove();
        return result === true;
    },


    moveStoryWorldObjectVisual: async function(cmd, anchor) {
        if (!cmd || (cmd.monsterId === undefined && !cmd.src && !cmd.key)) return false;
        const renderer = globalThis.PhaserFieldRenderer;
        if (!renderer?.isReady?.() || typeof renderer.moveStoryObjectSprite !== 'function') return false;
        const tile = this.resolveStoryFieldVisualTile(cmd, anchor);
        const id = cmd.id || '';
        if (!id) return false;
        const result = await renderer.moveStoryObjectSprite(id, {
            monsterId: cmd.monsterId,
            src: cmd.src,
            key: cmd.key,
            size: cmd.size || 2,
            opacity: cmd.opacity,
            fixedDepth: cmd.fixedDepth === true,
            depth: cmd.depth,
            x: tile.x,
            y: tile.y,
            duration: Math.max(0, Number(cmd.duration || 160))
        });
        if (result === true && typeof document !== 'undefined') document.getElementById(id)?.remove();
        return result === true;
    },

    // 会話を待たずにフィールドスプライトを移動させる。
    // 退場中の台詞など「動きながら会話」を成立させるための演出専用経路。
    startStoryCharacterMoveVisual: function(cmd, anchor) {
        if (!cmd) return false;
        const duration = Math.max(0, Number(cmd.duration || 160));
        const run = async () => {
            if (await this.moveStoryCharacterVisual(cmd, anchor) || await this.moveStoryWorldObjectVisual(cmd, anchor)) {
                if (cmd.removeAfter === true && cmd.id) this.removeStoryCharacterVisual(cmd.id);
                return true;
            }
            if (typeof document === 'undefined' || typeof Field === 'undefined') return false;
            let img = cmd.id ? document.getElementById(cmd.id) : null;
            if (!img && (cmd.monsterId !== undefined || cmd.src || cmd.characterId !== undefined || cmd.charId !== undefined)) {
                img = this.putStoryFieldVisualSprite({ ...cmd, dx: cmd.fromDx ?? cmd.dx ?? 0, dy: cmd.fromDy ?? cmd.dy ?? 0 }, anchor);
            }
            if (!img || typeof Field.getFieldVisualTileStyle !== 'function') return false;
            const tile = this.resolveStoryFieldVisualTile(cmd, anchor);
            const size = cmd.size || Number(img.dataset.sizeTiles || 2);
            img.style.cssText = Field.getFieldVisualTileStyle(tile, size) + this.getStoryFieldVisualSpriteCss(cmd, tile, 4) + `transition:left ${duration}ms linear, top ${duration}ms linear;`;
            img.dataset.tileX = String(tile.x);
            img.dataset.tileY = String(tile.y);
            img.dataset.sizeTiles = String(size);
            if (cmd.removeAfter === true) {
                setTimeout(() => {
                    this.removeStoryCharacterVisual(cmd.id);
                    document.getElementById(cmd.id)?.remove();
                }, duration + 20);
            }
            return true;
        };
        void run().catch(error => console.warn('[StoryManager] async field move failed', error));
        return true;
    },

    moveStoryFieldVisualElement: async function(cmd, anchor = null) {
        if (await this.moveStoryCharacterVisual(cmd, anchor)) return true;
        if (await this.moveStoryWorldObjectVisual(cmd, anchor)) return true;
        if (typeof document === 'undefined' || typeof Field === 'undefined') return false;
        let img = cmd.id ? document.getElementById(cmd.id) : null;
        if (!img && (cmd.monsterId !== undefined || cmd.src || cmd.characterId !== undefined || cmd.charId !== undefined)) {
            img = this.putStoryFieldVisualSprite({ ...cmd, dx: cmd.fromDx ?? cmd.dx ?? 0, dy: cmd.fromDy ?? cmd.dy ?? 0 }, anchor);
        }
        if (!img || typeof Field.getFieldVisualTileStyle !== 'function') return false;
        const tile = this.resolveStoryFieldVisualTile(cmd, anchor);
        const size = cmd.size || Number(img.dataset.sizeTiles || 2);
        const duration = Math.max(0, Number(cmd.duration || 160));
        img.style.cssText = Field.getFieldVisualTileStyle(tile, size) + this.getStoryFieldVisualSpriteCss(cmd, tile, 4) + `transition:left ${duration}ms linear, top ${duration}ms linear;`;
        img.dataset.tileX = String(tile.x);
        img.dataset.tileY = String(tile.y);
        img.dataset.sizeTiles = String(size);
        await new Promise(resolve => setTimeout(resolve, duration));
        return true;
    },

    removeStoryCharacterVisual: function(id) {
        if (!id) return false;
        const renderer = globalThis.PhaserFieldRenderer;
        return typeof renderer?.removeStoryCharacterSprite === 'function'
            ? renderer.removeStoryCharacterSprite(id) === true
            : false;
    },

    clearStoryCharacterVisuals: function() {
        const renderer = globalThis.PhaserFieldRenderer;
        if (typeof renderer?.clearStoryCharacterSprites === 'function') renderer.clearStoryCharacterSprites();
        if (typeof renderer?.clearStoryFloorEffectSprites === 'function') renderer.clearStoryFloorEffectSprites();
    },

    // 光の宮殿回想3Fの常駐演出はMAP絶対座標を正本にする。
    // Phaserが利用できない場合も、legacy Canvas側が同じspecを描画できるよう、
    // 描画命令ではなく「現在このMAPに何が存在するか」を返すデータ層を分離する。
    getLightPalaceFlashbackPersistentVisualState: function() {
        if (typeof Field === 'undefined' || typeof App === 'undefined' || !App.data) return { active:false, floorEffects:[], actors:[] };
        const flags = App.data?.progress?.flags || {};
        let areaKey = null;
        try { areaKey = typeof Field.getCurrentAreaKey === 'function' ? Field.getCurrentAreaKey() : App.data?.location?.area; } catch (_) {}
        const floor = Number(typeof Dungeon !== 'undefined' ? Dungeon.floor : App.data?.progress?.floor);
        const active = flags.lightPalaceFlashbackActive === true
            && flags.lightPalaceFlashbackCompleted !== true
            && String(areaKey || '') === 'LIGHT_PALACE'
            && floor === 3;
        if (!active) return { active:false, floorEffects:[], actors:[] };

        const floorEffects = [];
        if (flags.lightPalaceFlashbackRitualVisible === true) {
            floorEffects.push({
                id:'flashback-genesis-circle',
                key:'special-rupture',
                src:'assets/effect/fx_special_rupture.png',
                x:17, y:16, size:9, slices:9, alpha:0.60, depthOffset:46, seamBleed:0.5,
                animate:true, pulseAlpha:0, driftX:0, driftY:0, motionDuration:2200,
                glow:true, glowAlphaMin:0.10, glowAlphaMax:0.32, glowTint:0xffe59a
            });
        }

        const actors = [];
        if (flags.lightPalaceFlashbackJasperAppeared === true) {
            actors.push({ id:'flashback-jasper', type:'monster', monsterId:301070, x:20, y:15, size:2.1 });
        }
        if (flags.lightPalaceFlashbackVeldAppeared === true) {
            actors.push({ id:'flashback-veld', type:'monster', monsterId:301064, x:17, y:16, size:2.1 });
        }
        return { active:true, floorEffects, actors };
    },

    syncLightPalaceFlashbackPersistentVisuals: function() {
        const visualState = this.getLightPalaceFlashbackPersistentVisualState();
        const renderer = globalThis.PhaserFieldRenderer;
        const removeVisual = id => {
            this.removeStoryCharacterVisual(id);
            if (typeof document !== 'undefined') document.getElementById(id)?.remove();
        };

        if (!visualState.active) {
            renderer?.removeStoryFloorEffectSprite?.('flashback-genesis-circle');
            removeVisual('flashback-jasper');
            removeVisual('flashback-veld');
            return false;
        }

        const floorEffect = visualState.floorEffects[0] || null;
        if (floorEffect) {
            // showStoryFloorEffectSprite() はMAP座標specを保持する。Phaserがまだ起動前でも
            // legacy Canvas描画と同じ座標が正本なので、ここで描画完了を待たない。
            renderer?.showStoryFloorEffectSprite?.(floorEffect.id, floorEffect);
            if (!this.isStoryGraphicReady(floorEffect.key)) {
                this.ensureStoryGraphicReady(floorEffect.key).then((ready) => {
                    if (ready) Field.render?.();
                });
            }
        } else {
            renderer?.removeStoryFloorEffectSprite?.('flashback-genesis-circle');
        }

        const actorIds = new Set(visualState.actors.map(actor => actor.id));
        if (!actorIds.has('flashback-jasper')) removeVisual('flashback-jasper');
        if (!actorIds.has('flashback-veld')) removeVisual('flashback-veld');

        const phaserReady = renderer?.isReady?.() === true;
        if (!phaserReady) {
            // Phaserが停止している場合はlegacy Canvasを正本にする。DARK_TELEPORTが一時的に
            // 生成したDOMスプライトを残すと同じ人物が二重表示されるため、Canvas再描画後に除去する。
            Field.render?.();
            visualState.actors.forEach(actor => {
                if (typeof document !== 'undefined') document.getElementById(actor.id)?.remove();
            });
            return true;
        }

        visualState.actors.forEach(actor => {
            const shown = this.showStoryMonsterVisual({
                id:actor.id, monsterId:actor.monsterId, x:actor.x, y:actor.y, size:actor.size
            }, actor);
            if (shown && typeof document !== 'undefined') document.getElementById(actor.id)?.remove();
        });
        return true;
    },

    setStoryUiCutsceneHidden: function(hidden) {
        if (typeof Field !== 'undefined' && typeof Field.setStoryUiCutsceneHidden === 'function') {
            Field.setStoryUiCutsceneHidden(!!hidden);
            return;
        }
        const overlay = document.getElementById('story-ui-overlay');
        if (!overlay) return;
        overlay.style.display = hidden ? 'none' : 'flex';
    },

    // 物語イベント中は左上の場所・所持金・目的案内を隠し、演出と会話へ視線を集中させる。
    // LOG / ミニマップなど右上UIは対象外。
    setStoryEventGuideHidden: function(hidden) {
        if (typeof document === 'undefined' || typeof document.getElementById !== 'function') return;
        const box = document.getElementById('field-info-box');
        if (!box?.style) return;
        if (hidden) {
            if (box.dataset.storyEventGuideHidden !== '1') {
                box.dataset.storyEventGuideHidden = '1';
                box.dataset.storyEventGuideDisplay = box.style.getPropertyValue('display') || '';
                box.dataset.storyEventGuideDisplayPriority = box.style.getPropertyPriority('display') || '';
            }
            box.style.setProperty('display', 'none', 'important');
            return;
        }
        if (box.dataset.storyEventGuideHidden !== '1') return;
        const previousDisplay = box.dataset.storyEventGuideDisplay || '';
        const previousPriority = box.dataset.storyEventGuideDisplayPriority || '';
        if (previousDisplay) box.style.setProperty('display', previousDisplay, previousPriority);
        else box.style.removeProperty('display');
        delete box.dataset.storyEventGuideHidden;
        delete box.dataset.storyEventGuideDisplay;
        delete box.dataset.storyEventGuideDisplayPriority;
    },

    fadeStoryFieldBlackout: async function(holdMs = 160) {
        if (typeof Field !== 'undefined' && typeof Field.fadeFieldVisualBlackout === 'function') {
            await Field.fadeFieldVisualBlackout(holdMs);
            return;
        }
        await new Promise(resolve => setTimeout(resolve, Math.max(0, Number(holdMs) || 0)));
    },

    removeStoryFieldVisualTargets: function(cmd = {}) {
        if (typeof document === 'undefined') {
            if (cmd.cleanupLayer && typeof Field !== 'undefined') Field._visualCutsceneActive = false;
            return;
        }
        const removeIds = [];
        if (cmd.id) removeIds.push(cmd.id);
        if (cmd.removeId) removeIds.push(cmd.removeId);
        if (Array.isArray(cmd.removeIds)) removeIds.push(...cmd.removeIds.filter(Boolean));

        removeIds.forEach(id => {
            this.removeStoryCharacterVisual(id);
            const img = document.getElementById(id);
            if (img) img.remove();
        });

        if (cmd.cleanupLayer) {
            this.clearStoryCharacterVisuals();
            const currentLayer = document.getElementById('field-visual-cutscene-layer');
            if (currentLayer) currentLayer.remove();
            if (typeof Field !== 'undefined') Field._visualCutsceneActive = false;
        }
    },

    fadeStoryFieldBlackoutWithAction: async function(action, options = {}) {
        const holdMs = Math.max(0, Number(options.holdMs ?? 160) || 0);
        const fadeInMs = Math.max(0, Number(options.fadeInMs ?? options.fadeMs ?? 220) || 0);
        const fadeOutMs = Math.max(0, Number(options.fadeOutMs ?? options.fadeMs ?? 220) || 0);
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        if (typeof document === 'undefined') {
            if (typeof action === 'function') await action();
            await wait(holdMs);
            return;
        }

        let overlay = document.getElementById('story-field-blackout-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'story-field-blackout-overlay';
            document.body.appendChild(overlay);
        }

        overlay.style.cssText = [
            'position:fixed',
            'left:0',
            'top:0',
            'width:100vw',
            'height:100vh',
            'background:#000',
            'opacity:0',
            'pointer-events:none',
            'z-index:999999',
            `transition:opacity ${fadeInMs}ms ease`
        ].join(';') + ';';

        // style反映後にフェードを開始し、完全に黒くなってから対象を消す。
        overlay.offsetHeight;
        overlay.style.opacity = '1';
        await wait(fadeInMs);

        if (typeof action === 'function') await action();
        await wait(holdMs);

        overlay.style.transition = `opacity ${fadeOutMs}ms ease`;
        overlay.style.opacity = '0';
        await wait(fadeOutMs);
        if (overlay.parentNode) overlay.remove();
    },

    animateStoryFieldIrisTransition: async function(cmd = {}) {
        const duration = Math.max(0, Number(cmd.duration ?? cmd.ms ?? 650) || 0);
        const mode = String(cmd.mode || cmd.direction || 'close').toLowerCase() === 'open' ? 'open' : 'close';
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
        if (typeof document === 'undefined') {
            await wait(duration);
            return;
        }

        let canvas = document.getElementById('story-field-iris-overlay');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'story-field-iris-overlay';
            document.body.appendChild(canvas);
        }
        canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:1000000;';

        const width = Math.max(1, window.innerWidth || document.documentElement?.clientWidth || 1);
        const height = Math.max(1, window.innerHeight || document.documentElement?.clientHeight || 1);
        const dpr = Math.max(1, Number(globalThis.devicePixelRatio || 1));
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            if (mode === 'open') canvas.remove();
            await wait(duration);
            return;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const maxRadius = Math.hypot(width / 2, height / 2) * 1.08;
        const startRadius = mode === 'open' ? 0 : maxRadius;
        const endRadius = mode === 'open' ? maxRadius : 0;
        const color = cmd.color || '#000';
        const draw = (radius) => {
            ctx.globalCompositeOperation = 'source-over';
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, width, height);
            if (radius > 0.5) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }
        };

        if (duration <= 0 || typeof requestAnimationFrame !== 'function') {
            draw(endRadius);
        } else {
            await new Promise(resolve => {
                const started = globalThis.performance?.now?.() ?? Date.now();
                const frame = (now) => {
                    const elapsed = Math.max(0, Number(now ?? Date.now()) - started);
                    const raw = Math.min(1, elapsed / duration);
                    const eased = raw * raw * (3 - (2 * raw));
                    draw(startRadius + ((endRadius - startRadius) * eased));
                    if (raw >= 1) resolve();
                    else requestAnimationFrame(frame);
                };
                requestAnimationFrame(frame);
            });
        }

        if (mode === 'open') {
            if (canvas.parentNode) canvas.remove();
        } else if (cmd.holdMs) {
            await wait(cmd.holdMs);
        }
    },

    animateStoryFieldVerticalCurtainTransition: async function(cmd = {}) {
        const duration = Math.max(0, Number(cmd.duration ?? cmd.ms ?? 680) || 0);
        const holdMs = Math.max(0, Number(cmd.holdMs ?? 0) || 0);
        const mode = String(cmd.mode || cmd.direction || 'close').toLowerCase() === 'open' ? 'open' : 'close';
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
        if (typeof document === 'undefined') {
            await wait(duration + holdMs);
            return;
        }

        const overlayId = 'story-field-vertical-curtain-overlay';
        let overlay = document.getElementById(overlayId);
        const createOverlay = () => {
            const root = document.createElement('div');
            root.id = overlayId;
            root.style.cssText = [
                'position:fixed',
                'inset:0',
                'overflow:hidden',
                'pointer-events:none',
                'z-index:1000001'
            ].join(';') + ';';
            const top = document.createElement('div');
            top.dataset.storyCurtainHalf = 'top';
            const bottom = document.createElement('div');
            bottom.dataset.storyCurtainHalf = 'bottom';
            root.append(top, bottom);
            document.body.appendChild(root);
            return root;
        };
        if (!overlay) overlay = createOverlay();

        const top = overlay.querySelector('[data-story-curtain-half="top"]');
        const bottom = overlay.querySelector('[data-story-curtain-half="bottom"]');
        if (!top || !bottom) {
            overlay.remove();
            await wait(duration + holdMs);
            return;
        }

        const common = [
            'position:absolute',
            'left:0',
            'width:100%',
            'height:51%',
            'background:#000',
            'opacity:1',
            'will-change:transform,opacity'
        ].join(';');
        top.style.cssText = `${common};top:0;box-shadow:0 18px 34px rgba(0,0,0,.72);`;
        bottom.style.cssText = `${common};bottom:0;box-shadow:0 -18px 34px rgba(0,0,0,.72);`;

        const setClosed = () => {
            top.style.transform = 'translateY(0%)';
            bottom.style.transform = 'translateY(0%)';
            top.style.opacity = '1';
            bottom.style.opacity = '1';
        };
        const setOpen = () => {
            top.style.transform = 'translateY(-104%)';
            bottom.style.transform = 'translateY(104%)';
            top.style.opacity = '0';
            bottom.style.opacity = '0';
        };

        if (mode === 'close') setOpen();
        else setClosed();
        // 初期状態を一度確定してから上下の幕を動かす。
        overlay.offsetHeight;
        const easing = cmd.easing || 'cubic-bezier(.45,0,.2,1)';
        top.style.transition = `transform ${duration}ms ${easing}, opacity ${Math.max(120, Math.round(duration * 0.72))}ms ease`;
        bottom.style.transition = top.style.transition;
        if (mode === 'close') setClosed();
        else setOpen();
        await wait(duration);

        if (mode === 'close') {
            if (holdMs) await wait(holdMs);
            return;
        }
        if (overlay.parentNode) overlay.remove();
        if (holdMs) await wait(holdMs);
    },

    flashStoryFieldScreen: async function(cmd = {}) {
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
        const colors = Array.isArray(cmd.colors) && cmd.colors.length
            ? cmd.colors
            : ['#fff', '#000', '#fff', '#000', '#fff'];
        const intervalMs = Math.max(16, Number(cmd.intervalMs ?? cmd.ms ?? 70) || 70);
        if (typeof document === 'undefined') {
            await wait(intervalMs * colors.length);
            return;
        }
        let overlay = document.getElementById('story-field-flash-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'story-field-flash-overlay';
            document.body.appendChild(overlay);
        }
        overlay.style.cssText = [
            'position:fixed', 'inset:0', 'pointer-events:none', 'z-index:1000001',
            `opacity:${Math.max(0, Math.min(1, Number(cmd.opacity ?? 0.96) || 0.96))}`
        ].join(';') + ';';
        for (const color of colors) {
            overlay.style.background = String(color || '#fff');
            await wait(intervalMs);
        }
        if (cmd.finalHoldMs) await wait(cmd.finalHoldMs);
        if (overlay.parentNode) overlay.remove();
    },

    shakeStoryFieldScreen: async function(cmd = {}) {
        const duration = Math.max(120, Number(cmd.duration ?? cmd.ms ?? 720) || 720);
        const amplitude = Math.max(1, Number(cmd.amplitude ?? 16) || 16);
        const cycles = Math.max(2, Math.floor(Number(cmd.cycles ?? 7) || 7));
        const axis = String(cmd.axis || 'y').toLowerCase() === 'x' ? 'x' : 'y';
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
        if (typeof document === 'undefined') {
            await wait(duration);
            return;
        }
        const target = document.getElementById(cmd.targetId || 'canvas-wrapper') || document.getElementById('field-scene');
        if (!target?.style) {
            await wait(duration);
            return;
        }
        const originalTransform = target.style.transform || '';
        const translate = amount => `${originalTransform}${originalTransform ? ' ' : ''}translate${axis.toUpperCase()}(${amount}px)`;
        const frames = [{ transform: translate(0) }];
        for (let i = 0; i < cycles; i++) {
            const decay = 1 - (i / (cycles + 1));
            const amount = amplitude * decay;
            frames.push({ transform: translate(i % 2 === 0 ? -amount : amount) });
            frames.push({ transform: translate(i % 2 === 0 ? amount : -amount) });
        }
        frames.push({ transform: translate(0) });
        if (typeof target.animate === 'function') {
            try {
                const animation = target.animate(frames, { duration, easing: 'linear' });
                await animation.finished;
            } catch (_) {
                await wait(duration);
            } finally {
                target.style.transform = originalTransform;
            }
            return;
        }
        const stepMs = duration / Math.max(1, frames.length - 1);
        try {
            for (const frame of frames) {
                target.style.transform = frame.transform;
                await wait(stepMs);
            }
        } finally {
            target.style.transform = originalTransform;
        }
    },

    darkTeleportStoryFieldSprite: async function(cmd = {}, anchor = null) {
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
        const duration = Math.max(80, Number(cmd.duration ?? 280) || 280);
        if (typeof AudioManager !== 'undefined') AudioManager.playSe?.('event_effect');

        if (cmd.monsterId !== undefined) {
            const renderer = globalThis.PhaserFieldRenderer;
            if (renderer?.isReady?.() && typeof renderer.revealStoryMonsterSprite === 'function') {
                const tile = this.resolveStoryFieldVisualTile(cmd, anchor);
                const id = cmd.id || `field-story-monster-${Date.now()}`;
                const shown = await renderer.revealStoryMonsterSprite(id, {
                    monsterId: cmd.monsterId,
                    x: tile.x,
                    y: tile.y,
                    size: cmd.size || 2,
                    duration,
                    finalOpacity: cmd.finalOpacity ?? 1
                });
                if (shown) {
                    if (typeof document !== 'undefined') document.getElementById(id)?.remove();
                    return { __phaserStoryObject: true, id };
                }
            }
        }

        // Legacy fallback for older cutscenes. Persistent map actors should use the
        // Phaser route above so camera/viewport changes cannot shift their position.
        const img = this.putStoryFieldVisualSprite({ ...cmd, opacity: 0 }, anchor);
        if (!img) {
            await wait(duration);
            return null;
        }
        img.style.filter = cmd.shadowFilter || 'brightness(0.05) saturate(0.25) drop-shadow(0 0 14px rgba(0,0,0,.98))';
        img.style.transition = `opacity ${Math.round(duration * 0.58)}ms ease-out, filter ${duration}ms ease-out`;
        img.offsetHeight;
        img.style.opacity = String(cmd.finalOpacity ?? 1);
        img.style.filter = cmd.finalFilter || 'brightness(1) saturate(1) drop-shadow(0 2px 2px rgba(0,0,0,.55))';
        await wait(duration);
        return img;
    },

    runStoryFieldVisualCommands: async function(commands, options = {}) {
        if (!Array.isArray(commands) || commands.length === 0 || typeof Field === 'undefined') return false;
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
        const anchor = this.getFieldVisualAnchor(options);
        const layer = typeof Field.ensureFieldVisualLayer === 'function' ? Field.ensureFieldVisualLayer() : null;

        // 操作不可にするのは、台詞と台詞の間でこの関数が実行中の間だけ。
        // SHOW したスプライトを会話中に残しても、レイヤーはタップを奪わない。
        if (layer) layer.style.pointerEvents = 'auto';
        Field._visualCutsceneActive = true;
        if (typeof App !== 'undefined' && typeof App.lockFieldInput === 'function') App.lockFieldInput(Number(options.lockMs || 900));

        try {
            for (const raw of commands) {
                const cmd = this.cloneFieldVisualCommand(raw);
                if (!cmd || !cmd.op) continue;
                switch (cmd.op) {
                    case 'CAPTURE_ANCHOR': {
                        const key = String(cmd.key || cmd.anchorKey || '').trim();
                        if (key) {
                            this.rememberStoryFieldVisualAnchor(key, {
                                x: Number.isFinite(Number(cmd.x)) ? Number(cmd.x) : Number(Field.x || 0),
                                y: Number.isFinite(Number(cmd.y)) ? Number(cmd.y) : Number(Field.y || 0),
                                size: cmd.size
                            }, anchor);
                        }
                        break;
                    }
                    case 'CLEAR_LAYER': {
                        const currentLayer = typeof Field.ensureFieldVisualLayer === 'function' ? Field.ensureFieldVisualLayer() : layer;
                        if (currentLayer) currentLayer.innerHTML = '';
                        this.clearStoryCharacterVisuals();
                        break;
                    }
                    case 'BLACKOUT':
                        if (cmd.removeId || cmd.id || Array.isArray(cmd.removeIds) || cmd.cleanupLayer) {
                            await this.fadeStoryFieldBlackoutWithAction(() => this.removeStoryFieldVisualTargets(cmd), cmd);
                        } else {
                            await this.fadeStoryFieldBlackout(cmd.holdMs || 160);
                        }
                        break;
                    case 'IRIS_TRANSITION':
                        await this.animateStoryFieldIrisTransition(cmd);
                        break;
                    case 'VERTICAL_CURTAIN':
                        await this.animateStoryFieldVerticalCurtainTransition(cmd);
                        break;
                    case 'SCREEN_FLASH':
                        await this.flashStoryFieldScreen(cmd);
                        break;
                    case 'SCREEN_SHAKE':
                        await this.shakeStoryFieldScreen(cmd);
                        break;
                    case 'FLASH_SHAKE':
                        await Promise.all([
                            this.flashStoryFieldScreen({
                                colors: Array.isArray(cmd.colors) ? cmd.colors : ['#ffffff'],
                                intervalMs: cmd.intervalMs ?? 85,
                                finalHoldMs: cmd.finalHoldMs ?? 35,
                                opacity: cmd.opacity ?? 0.9
                            }),
                            this.shakeStoryFieldScreen({
                                axis: cmd.axis || 'y',
                                amplitude: cmd.amplitude ?? 7,
                                duration: cmd.duration ?? 300,
                                cycles: cmd.cycles ?? 5
                            })
                        ]);
                        break;
                    case 'DARK_TELEPORT':
                        await this.darkTeleportStoryFieldSprite(cmd, anchor);
                        if (cmd.persistKey) this.rememberStoryFieldVisualAnchor(cmd.persistKey, cmd, anchor);
                        break;
                    case 'SYNC_PERSISTENT_VISUALS':
                        this.syncLightPalaceFlashbackPersistentVisuals?.();
                        break;
                    case 'SHOW_FLOOR_EFFECT': {
                        const tile = this.resolveStoryFieldVisualTile(cmd, anchor);
                        const id = cmd.id || `story-floor-effect-${Date.now()}`;
                        const renderer = globalThis.PhaserFieldRenderer;
                        const graphicRef = cmd.key || cmd.src || '';
                        // 画像だけ先に準備する。Phaserのscene生成完了をイベント本文の進行条件にはしない。
                        // Phaserに問題がある場合はlegacy Canvasが同じMAP座標specを描画するため、
                        // 旧実装の2.5秒待機＋警告はイベント開始遅延と人物演出欠落の原因になっていた。
                        if (graphicRef) await this.ensureStoryGraphicReady(graphicRef);
                        const floorEffectOptions = { ...cmd, x: tile.x, y: tile.y };
                        if (cmd.worldSpace === true) {
                            renderer?.showStoryFloorEffectSprite?.(id, floorEffectOptions);
                            Field.render?.();
                            if (typeof document !== 'undefined') document.getElementById(id)?.remove();
                        } else if (cmd.src) {
                            this.putStoryFieldVisualSprite({ ...cmd, x: tile.x, y: tile.y, fixedZ:true, z:2 }, anchor);
                        }
                        break;
                    }
                    case 'REMOVE_FLOOR_EFFECT':
                        globalThis.PhaserFieldRenderer?.removeStoryFloorEffectSprite?.(cmd.id || '');
                        if (cmd.id && typeof document !== 'undefined') document.getElementById(cmd.id)?.remove();
                        break;
                    case 'MENACING_STEP': {
                        const movePromise = this.moveStoryFieldVisualElement(cmd, anchor);
                        const flashPromise = this.flashStoryFieldScreen({
                            colors: ['#ffffff', 'rgba(255,255,255,0)'],
                            intervalMs: Math.max(30, Math.round(Number(cmd.duration || 260) * 0.24)),
                            opacity: Number(cmd.flashOpacity ?? 0.76)
                        });
                        const shakePromise = this.shakeStoryFieldScreen({
                            axis: cmd.shakeAxis || 'y',
                            amplitude: Number(cmd.shakeAmplitude ?? 4),
                            duration: Math.max(140, Number(cmd.duration || 260)),
                            cycles: Number(cmd.shakeCycles ?? 3)
                        });
                        await Promise.all([movePromise, flashPromise, shakePromise]);
                        break;
                    }
                    case 'WAIT':
                        await wait(cmd.ms || 0);
                        break;
                    case 'HIDE_STORY_UI':
                        this.setStoryUiCutsceneHidden(!!cmd.hidden);
                        break;
                    case 'SHOW_SPRITE':
                        if (!this.showStoryCharacterVisual(cmd, anchor)
                            && !this.showStoryMonsterVisual(cmd, anchor)
                            && !(cmd.worldSpace === true && this.showStoryWorldImageVisual(cmd, anchor))) {
                            this.putStoryFieldVisualSprite(cmd, anchor);
                        }
                        break;
                    case 'START_MOVE_SPRITE': {
                        this.startStoryCharacterMoveVisual(cmd, anchor);
                        break;
                    }
                    case 'MOVE_SPRITE': {
                        await this.moveStoryFieldVisualElement(cmd, anchor);
                        break;
                    }
                    case 'MOVE_PLAYER': {
                        const currentX = Number(Field.x || 0);
                        const currentY = Number(Field.y || 0);
                        const absoluteX = Number(cmd.x);
                        const absoluteY = Number(cmd.y);
                        const x = Number.isFinite(absoluteX) ? absoluteX : currentX + Number(cmd.dx || 0);
                        const y = Number.isFinite(absoluteY) ? absoluteY : currentY + Number(cmd.dy || 0);
                        if (!Number.isFinite(x) || !Number.isFinite(y)) break;
                        const dirByName = { down: 0, left: 1, right: 2, up: 3 };
                        const direction = String(cmd.direction || '').toLowerCase();
                        const requestedDir = Number.isFinite(Number(cmd.dir))
                            ? Number(cmd.dir)
                            : (Object.prototype.hasOwnProperty.call(dirByName, direction) ? dirByName[direction] : null);
                        const movePlayer = () => {
                            Field.x = x;
                            Field.y = y;
                            if (requestedDir !== null) Field.dir = requestedDir;
                            if (App?.data?.location) {
                                App.data.location.x = x;
                                App.data.location.y = y;
                                if (requestedDir !== null) App.data.location.dir = requestedDir;
                            }
                            if (typeof App?.save === 'function') App.save();
                            if (typeof Field.refreshVisualState === 'function') Field.refreshVisualState();
                            else if (typeof Field.render === 'function') Field.render();
                            Field.refreshCurrentAction?.({ silent: true });
                        };
                        if (cmd.blackout === true) await this.fadeStoryFieldBlackoutWithAction(movePlayer, cmd);
                        else movePlayer();
                        if (cmd.duration || cmd.holdMs) await wait(cmd.duration || cmd.holdMs);
                        break;
                    }
                    case 'ADVANCE_PLAYER_CENTER_NORTH': {
                        // 六芒星イベントはX16/17/18のどこから踏んでも、その場から自然に中央へ寄せて
                        // 最後に北へ1歩進ませる。イベント開始時点では横ワープさせない。
                        const targetX = Number.isFinite(Number(cmd.centerX)) ? Number(cmd.centerX) : 17;
                        const stepMs = Math.max(60, Number(cmd.stepDuration || 150));
                        const moveTo = async (x, y, direction) => {
                            const dirByName = { down:0, left:1, right:2, up:3 };
                            Field.x = Number(x);
                            Field.y = Number(y);
                            Field.dir = dirByName[direction] ?? Field.dir;
                            if (App?.data?.location) {
                                App.data.location.x = Field.x;
                                App.data.location.y = Field.y;
                                App.data.location.dir = Field.dir;
                            }
                            App?.save?.();
                            if (typeof Field.refreshVisualState === 'function') Field.refreshVisualState();
                            else Field.render?.();
                            Field.refreshCurrentAction?.({ silent:true });
                            await wait(stepMs);
                        };
                        const startX = Number(Field.x || 0);
                        const startY = Number(Field.y || 0);
                        if (startX < targetX) await moveTo(targetX, startY, 'right');
                        else if (startX > targetX) await moveTo(targetX, startY, 'left');
                        await moveTo(targetX, startY - 1, 'up');
                        break;
                    }
                    case 'BARRIER_REPEL': {
                        const targetX = Number.isFinite(Number(cmd.x)) ? Number(cmd.x) : Number(Field.x || 0);
                        const targetY = Number.isFinite(Number(cmd.y)) ? Number(cmd.y) : Number(Field.y || 0) - 1;
                        const repelDelay = Math.max(20, Number(cmd.repelDelayMs || 70));
                        const movePromise = (async () => {
                            await wait(repelDelay);
                            Field.x = targetX;
                            Field.y = targetY;
                            Field.dir = 3;
                            if (App?.data?.location) {
                                App.data.location.x = targetX;
                                App.data.location.y = targetY;
                                App.data.location.dir = 3;
                            }
                            App?.save?.();
                            if (typeof Field.refreshVisualState === 'function') Field.refreshVisualState();
                            else Field.render?.();
                            Field.refreshCurrentAction?.({ silent:true });
                        })();
                        await Promise.all([
                            movePromise,
                            this.flashStoryFieldScreen({ colors:['#ffffff'], intervalMs:70, finalHoldMs:30, opacity:0.96 }),
                            this.shakeStoryFieldScreen({ axis:'y', amplitude:Number(cmd.amplitude ?? 10), duration:Number(cmd.duration ?? 300), cycles:Number(cmd.cycles ?? 5) })
                        ]);
                        break;
                    }
                    case 'PLAY_EFFECT': {
                        if (typeof AudioManager !== 'undefined') AudioManager.playSe?.('event_effect');
                        const id = cmd.id || `story-effect-${Date.now()}`;
                        let phaserShown = false;
                        if (cmd.worldSpace === true) {
                            phaserShown = this.showStoryWorldImageVisual({ ...cmd, id }, anchor);
                        }
                        const effect = phaserShown ? null : this.putStoryFieldVisualSprite({ ...cmd, id }, anchor);
                        await wait(cmd.ms || 300);
                        if (cmd.remove !== false) {
                            if (phaserShown) this.removeStoryCharacterVisual(id);
                            if (effect) effect.remove();
                        }
                        break;
                    }
                    case 'BLINK_REMOVE': {
                        let img = cmd.id ? document.getElementById(cmd.id) : null;
                        if (!img && cmd.fallback) img = this.putStoryFieldVisualSprite({ id: cmd.id, ...cmd.fallback }, anchor);
                        if (!img) break;
                        const count = Math.max(1, Number(cmd.count || 3));
                        for (let i = 0; i < count; i++) {
                            img.style.opacity = String(cmd.offOpacity ?? 0.25);
                            await wait(cmd.offMs || 80);
                            img.style.opacity = String(cmd.onOpacity ?? 1);
                            await wait(cmd.onMs || 80);
                        }
                        if (cmd.remove !== false) img.remove();
                        break;
                    }
                    case 'REMOVE_SPRITE': {
                        if (cmd.id) this.removeStoryCharacterVisual(cmd.id);
                        const img = cmd.id ? document.getElementById(cmd.id) : null;
                        if (img) img.remove();
                        break;
                    }
                    case 'CLEANUP': {
                        this.setStoryUiCutsceneHidden(false);
                        this.clearStoryCharacterVisuals();
                        const currentLayer = document.getElementById('field-visual-cutscene-layer');
                        if (currentLayer) currentLayer.remove();
                        Field._visualCutsceneActive = false;
                        break;
                    }
                    default:
                        break;
                }
            }
            return true;
        } finally {
            Field._visualCutsceneActive = false;
            const currentLayer = document.getElementById('field-visual-cutscene-layer');
            if (currentLayer) currentLayer.style.pointerEvents = 'none';
            this.setStoryUiCutsceneHidden(false);
        }
    },

    runStoryFieldVisual: async function(name, options = {}) {
        const commands = Array.isArray(options.commands)
            ? options.commands
            : (Array.isArray(options.visual) ? options.visual : null);
        if (!commands) return false;
        return this.runStoryFieldVisualCommands(commands, options);
    },

    runInlineStoryCommand: async function(line) {
        if (!line || typeof line !== 'object') return false;
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)));

        if (line.type === 'WAIT') {
            await wait(line.ms ?? line.value ?? 0);
            return true;
        }

        if (line.type === 'STORY_UI') {
            this.setStoryUiCutsceneHidden(!!line.hidden);
            return true;
        }

        if (line.type === 'FIELD_CUTSCENE' || line.type === 'MAP_VISUAL' || line.op !== undefined) {
            await this.runStoryFieldVisual(line.value || line.name || 'INLINE_STORY_VISUAL', line);
            return true;
        }

        return false;
    },

    getInlineFieldVisualReplayCommands: function(scriptKey, untilIndex) {
        const lines = this.scripts ? this.scripts[scriptKey] : null;
        if (!Array.isArray(lines)) return [];

        const end = Math.max(0, Math.min(Number(untilIndex) || 0, lines.length));
        const replay = [];

        for (let i = 0; i < end; i++) {
            const line = lines[i];
            if (!this.isInlineStoryCommand(line)) continue;
            const commands = this.getInlineStoryCommandCommands(line);
            if (!Array.isArray(commands)) continue;

            for (const raw of commands) {
                if (!raw || !raw.op) continue;
                const cmd = this.cloneFieldVisualCommand(raw);
                switch (cmd.op) {
                    case 'CLEAR_LAYER':
                    case 'SHOW_SPRITE':
                    case 'REMOVE_SPRITE':
                    case 'CLEANUP':
                        replay.push(cmd);
                        break;
                    case 'MOVE_SPRITE':
                        cmd.duration = 0;
                        replay.push(cmd);
                        break;
                    case 'START_MOVE_SPRITE':
                        if (cmd.removeAfter === true && cmd.id) replay.push({ op: 'REMOVE_SPRITE', id: cmd.id });
                        else {
                            cmd.op = 'MOVE_SPRITE';
                            cmd.duration = 0;
                            replay.push(cmd);
                        }
                        break;
                    case 'DARK_TELEPORT':
                        replay.push({ ...cmd, op: 'SHOW_SPRITE', opacity: cmd.finalOpacity ?? 1, css: cmd.finalCss || '' });
                        break;
                    case 'SHOW_FLOOR_EFFECT':
                    case 'REMOVE_FLOOR_EFFECT':
                        replay.push(cmd);
                        break;
                    case 'MENACING_STEP':
                        cmd.op = 'MOVE_SPRITE';
                        cmd.duration = 0;
                        replay.push(cmd);
                        break;
                    case 'BLINK_REMOVE':
                        if (cmd.remove !== false && cmd.id) replay.push({ op: 'REMOVE_SPRITE', id: cmd.id });
                        break;
                    case 'PLAY_EFFECT':
                        if (cmd.remove === false) replay.push({ ...cmd, op: 'SHOW_SPRITE' });
                        break;
                    case 'CAPTURE_ANCHOR':
                    case 'HIDE_STORY_UI':
                    case 'WAIT':
                    case 'IRIS_TRANSITION':
                    case 'VERTICAL_CURTAIN':
                    case 'SCREEN_FLASH':
                    case 'SCREEN_SHAKE':
                    case 'MOVE_PLAYER':
                        break;
                    case 'BLACKOUT':
                        if (cmd.cleanupLayer) {
                            replay.push({ op: 'CLEANUP' });
                        } else {
                            if (cmd.id) replay.push({ op: 'REMOVE_SPRITE', id: cmd.id });
                            if (cmd.removeId) replay.push({ op: 'REMOVE_SPRITE', id: cmd.removeId });
                            if (Array.isArray(cmd.removeIds)) {
                                cmd.removeIds.filter(Boolean).forEach(id => replay.push({ op: 'REMOVE_SPRITE', id }));
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        return replay;
    },

    applyInlineFieldVisualReplayCommands: function(commands, options = {}) {
        if (!Array.isArray(commands) || commands.length === 0 || typeof Field === 'undefined') return false;
        const anchor = this.getFieldVisualAnchor(options);
        let layer = typeof Field.ensureFieldVisualLayer === 'function' ? Field.ensureFieldVisualLayer() : null;

        for (const raw of commands) {
            const cmd = this.cloneFieldVisualCommand(raw);
            if (!cmd || !cmd.op) continue;
            switch (cmd.op) {
                case 'CLEAR_LAYER':
                    layer = typeof Field.ensureFieldVisualLayer === 'function' ? Field.ensureFieldVisualLayer() : layer;
                    if (layer) layer.innerHTML = '';
                    this.clearStoryCharacterVisuals();
                    break;
                case 'SHOW_SPRITE':
                    if (!this.showStoryCharacterVisual(cmd, anchor)) this.putStoryFieldVisualSprite(cmd, anchor);
                    break;
                case 'MOVE_SPRITE': {
                    if ((cmd.characterId !== undefined || cmd.charId !== undefined) && globalThis.PhaserFieldRenderer?.isReady?.()) {
                        const tile = this.resolveStoryFieldVisualTile(cmd, anchor);
                        globalThis.PhaserFieldRenderer.moveStoryCharacterSprite?.(cmd.id || '', {
                            characterId: cmd.characterId ?? cmd.charId,
                            direction: cmd.direction || 'down',
                            step: cmd.step,
                            walk: false,
                            size: cmd.size || 1,
                            opacity: cmd.opacity,
                            x: tile.x,
                            y: tile.y,
                            duration: 0
                        });
                        break;
                    }
                    let img = cmd.id ? document.getElementById(cmd.id) : null;
                    if (!img) img = this.putStoryFieldVisualSprite(cmd, anchor);
                    if (!img || typeof Field.getFieldVisualTileStyle !== 'function') break;
                    const tile = this.resolveStoryFieldVisualTile(cmd, anchor);
                    const size = cmd.size || Number(img.dataset.sizeTiles || 2);
                    img.style.cssText = Field.getFieldVisualTileStyle(tile, size) + this.getStoryFieldVisualSpriteCss(cmd, tile, 4);
                    img.dataset.tileX = String(tile.x);
                    img.dataset.tileY = String(tile.y);
                    img.dataset.sizeTiles = String(size);
                    break;
                }
                case 'REMOVE_SPRITE': {
                    if (cmd.id) this.removeStoryCharacterVisual(cmd.id);
                    const img = cmd.id ? document.getElementById(cmd.id) : null;
                    if (img) img.remove();
                    break;
                }
                case 'SHOW_FLOOR_EFFECT': {
                    const tile = this.resolveStoryFieldVisualTile(cmd, anchor);
                    globalThis.PhaserFieldRenderer?.showStoryFloorEffectSprite?.(cmd.id || `story-floor-effect-${Date.now()}`, { ...cmd, x:tile.x, y:tile.y });
                    break;
                }
                case 'REMOVE_FLOOR_EFFECT':
                    globalThis.PhaserFieldRenderer?.removeStoryFloorEffectSprite?.(cmd.id || '');
                    break;
                case 'CLEANUP': {
                    this.setStoryUiCutsceneHidden(false);
                    this.clearStoryCharacterVisuals();
                    const currentLayer = document.getElementById('field-visual-cutscene-layer');
                    if (currentLayer) currentLayer.remove();
                    break;
                }
                default:
                    break;
            }
        }

        const currentLayer = document.getElementById('field-visual-cutscene-layer');
        if (currentLayer) currentLayer.style.pointerEvents = 'none';
        this.setStoryUiCutsceneHidden(false);
        if (typeof Field !== 'undefined') Field._visualCutsceneActive = false;
        return true;
    },

    restoreInlineFieldVisualState: async function(scriptKey, untilIndex) {
        const replay = this.getInlineFieldVisualReplayCommands(scriptKey, untilIndex);
        if (replay.length === 0) return false;
        return this.applyInlineFieldVisualReplayCommands(replay);
    },

    scriptHasInlineFieldVisual: function(scriptKey) {
        const lines = this.scripts ? this.scripts[scriptKey] : null;
        if (!Array.isArray(lines)) return false;
        return lines.some(line => this.isInlineStoryCommand(line));
    },

    eventHasFieldVisualFlow: function(eventId, phase = 'actions') {
        const event = this.events ? this.events[eventId] : null;
        if (!event) return false;
        const actions = phase === 'win' ? event.winActions : event.actions;
        if (!Array.isArray(actions)) return false;
        return actions.some(action => {
            if (!action) return false;
            if (action.type === 'FIELD_CUTSCENE' || action.type === 'MAP_VISUAL') return true;
            if (action.type === 'CONV' && this.scriptHasInlineFieldVisual(action.value)) return true;
            return false;
        });
    },

    shouldRestartEventFromStartOnResume: function(eventId, phase = 'actions') {
        // イベント再実行はフラグ・加入・アイテム付与の重複リスクがあるため行わない。
        // 会話番号までの常駐スプライトだけを復元し、一過性エフェクトは再生しない。
        return false;
    },

    refreshFieldAfterStoryStateChange: function() {
        if (typeof Field === 'undefined') return;
        if (typeof Field.refreshCurrentAction === 'function') Field.refreshCurrentAction({ silent: true });
        if (typeof Field.refreshVisualState === 'function') Field.refreshVisualState();
        else if (typeof Field.render === 'function') Field.render();
        this.syncLightPalaceFlashbackPersistentVisuals?.();
    },

    resolvePostBattleBossSpriteConfig: function(event) {
        const raw = event?.postBattleBossSprite;
        const explicitlyDisabled = raw === false || event?.skipAutoPostBattleBossSprite === true || event?.keepPostBattleBossSprite === false;
        if (explicitlyDisabled) return { enabled: false, explicit: raw !== undefined };
        if (raw && typeof raw === 'object') {
            return {
                enabled: raw.enabled !== false,
                explicit: true,
                monsterId: Number.isFinite(Number(raw.monsterId)) ? Number(raw.monsterId) : null,
                size: Math.max(0.5, Number(raw.size || raw.sizeTiles || 2) || 2),
                zIndex: Number.isFinite(Number(raw.zIndex ?? raw.z)) ? Number(raw.zIndex ?? raw.z) : 4
            };
        }
        return { enabled: true, explicit: false, monsterId: null, size: 2, zIndex: 4 };
    },

    isCurrentFixedBossPosition: function(position) {
        if (!position || typeof Field === 'undefined' || !Field.currentMapData?.isFixed ||
            typeof MapRegistry === 'undefined' || typeof MapRegistry.findFixedBoss !== 'function') return false;
        return !!MapRegistry.findFixedBoss(Field.currentMapData, Number(position.x), Number(position.y));
    },

    wasBattleBossRenderedOnMap: function(source) {
        if (!source?.isBossBattle) return false;
        if (source.fieldBossWasRendered === true) return true;
        const active = App?.data?.progress?.activeFixedBossContext || null;
        if (active) {
            const nonceMatches = source.fixedBossContextNonce && active.nonce &&
                String(source.fixedBossContextNonce) === String(active.nonce);
            const chainMatches = source.battleChainId && active.battleChainId &&
                String(source.battleChainId) === String(active.battleChainId);
            if (nonceMatches || chainMatches) return true;
        }
        // 旧セーブ互換: 戦闘位置が現在の固定MAPで実在するボスタイルなら描画元ありとみなす。
        return this.isCurrentFixedBossPosition(source.fixedBossPosition);
    },

    wasLastFixedBossRenderedOnMap: function(last) {
        if (!last) return false;
        if (last.fieldBossWasRendered === true) return true;
        if (last.fieldBossWasRendered === false) return false;
        return this.isCurrentFixedBossPosition(last.position);
    },

    selectPostBattleBossMonsterId: function(rawIds) {
        const ids = (Array.isArray(rawIds) ? rawIds : [rawIds])
            .map(id => Number(id))
            .filter(id => Number.isFinite(id) && id > 0);
        if (!ids.length) return null;
        // 3体編成はMAP描画と同じく中央の敵を代表ボスとして扱う。
        return ids.length === 3 ? ids[1] : ids[0];
    },

    capturePostBattleBossVisualContext: function(eventId, battle = null, phase = 'actions') {
        const source = battle || App?.data?.battle || null;
        const targetEventId = String(eventId || '');
        if (!source?.isBossBattle || !targetEventId) return false;
        const event = this.events?.[targetEventId] || null;
        const spriteConfig = this.resolvePostBattleBossSpriteConfig(event);
        if (!spriteConfig.enabled) {
            const pending = App?.data?.progress?.pendingPostBattleBossVisual;
            if (pending && String(pending.eventId || '') === targetEventId) delete App.data.progress.pendingPostBattleBossVisual;
            return false;
        }
        const hadRenderedBoss = this.wasBattleBossRenderedOnMap(source);
        // 明示postBattleBossSpriteは演出上の意図的な出現として許可する。
        // それ以外は、戦闘前に実際にMAP描画されていたボスだけを戦後へ引き継ぐ。
        if (!hadRenderedBoss && !spriteConfig.explicit) {
            const pending = App?.data?.progress?.pendingPostBattleBossVisual;
            if (pending && String(pending.eventId || '') === targetEventId) delete App.data.progress.pendingPostBattleBossVisual;
            return false;
        }

        const ids = (Array.isArray(source.fixedBossId) ? source.fixedBossId : [source.fixedBossId])
            .map(id => Number(id))
            .filter(id => Number.isFinite(id) && id > 0);
        if (!ids.length) return false;
        const pos = source.fixedBossPosition
            || App?.data?.progress?.activeFixedBossContext?.fixedBossPosition
            || (spriteConfig.explicit && typeof Field !== 'undefined' ? { x: Field.x, y: Field.y } : null);
        if (!Number.isFinite(Number(pos?.x)) || !Number.isFinite(Number(pos?.y))) return false;

        const progress = App.data.progress || (App.data.progress = {});
        progress.pendingPostBattleBossVisual = {
            eventId: targetEventId,
            phase: phase === 'win' ? 'win' : 'actions',
            monsterIds: ids,
            monsterId: this.selectPostBattleBossMonsterId(ids),
            position: { x: Number(pos.x), y: Number(pos.y) },
            progressKey: source.fixedBossProgressKey || null,
            sourceWasRendered: hadRenderedBoss,
            explicitSprite: spriteConfig.explicit === true
        };
        return true;
    },

    getPostBattleBossVisualContext: function(eventId, event = null, phase = 'actions') {
        const targetEventId = String(eventId || '');
        const spriteConfig = this.resolvePostBattleBossSpriteConfig(event);
        if (!spriteConfig.enabled) return null;
        const pending = App?.data?.progress?.pendingPostBattleBossVisual || null;
        const pendingMatches = pending && String(pending.eventId || '') === targetEventId &&
            String(pending.phase || 'actions') === String(phase || 'actions');
        const currentProgressKey = typeof Field !== 'undefined' && typeof Field.getCurrentProgressMapKey === 'function'
            ? Field.getCurrentProgressMapKey()
            : null;
        const pendingMapMatches = !pending?.progressKey || !currentProgressKey || String(pending.progressKey) === String(currentProgressKey);
        const pendingSourceAllowed = pending && (
            pending.sourceWasRendered === true ||
            pending.explicitSprite === true ||
            spriteConfig.explicit === true ||
            (pending.sourceWasRendered === undefined && this.isCurrentFixedBossPosition(pending.position))
        );
        if (pendingMatches && pendingMapMatches && pendingSourceAllowed) {
            const monsterId = Number(spriteConfig.monsterId || pending.monsterId || pending.monsterIds?.[0] || 0);
            const pos = pending.position;
            if (Number.isFinite(monsterId) && monsterId > 0 && Number.isFinite(Number(pos?.x)) && Number.isFinite(Number(pos?.y))) {
                return { monsterId, x: Number(pos.x), y: Number(pos.y), config: spriteConfig };
            }
        }

        const battle = App?.data?.battle || null;
        const battleRelated = battle?.isBossBattle && (
            String(battle.eventId || '') === targetEventId ||
            String(battle.storyWinEventId || '') === targetEventId ||
            String(battle.fixedStoryEventId || '') === targetEventId
        );
        if (battleRelated && (this.wasBattleBossRenderedOnMap(battle) || spriteConfig.explicit)) {
            const rawId = this.selectPostBattleBossMonsterId(battle.fixedBossId);
            const monsterId = Number(spriteConfig.monsterId || rawId || 0);
            const pos = battle.fixedBossPosition
                || App?.data?.progress?.activeFixedBossContext?.fixedBossPosition
                || (spriteConfig.explicit && typeof Field !== 'undefined' ? { x: Field.x, y: Field.y } : null);
            if (Number.isFinite(monsterId) && monsterId > 0 && Number.isFinite(Number(pos?.x)) && Number.isFinite(Number(pos?.y))) {
                return { monsterId, x: Number(pos.x), y: Number(pos.y), config: spriteConfig };
            }
        }

        const last = App?.data?.progress?.lastFixedBossEvent || null;
        const lastRelated = last && (
            String(last.eventId || '') === targetEventId ||
            String(last.storyEventId || '') === targetEventId
        );
        if (lastRelated && (this.wasLastFixedBossRenderedOnMap(last) || spriteConfig.explicit)) {
            const rawId = this.selectPostBattleBossMonsterId(last.monsterId);
            const monsterId = Number(spriteConfig.monsterId || rawId || 0);
            const pos = last.position;
            if (Number.isFinite(monsterId) && monsterId > 0 && Number.isFinite(Number(pos?.x)) && Number.isFinite(Number(pos?.y))) {
                return { monsterId, x: Number(pos.x), y: Number(pos.y), config: spriteConfig };
            }
        }
        return null;
    },

    actionsContainConversation: function(actions) {
        if (!Array.isArray(actions)) return false;
        return actions.some(action => {
            if (!action) return false;
            if (action.type === 'CONV') return true;
            return ['then', 'else', 'otherwise', 'yes', 'no'].some(key => this.actionsContainConversation(action[key]));
        });
    },

    eventHasConversationAction: function(event, phase = 'actions') {
        const actions = phase === 'win' ? event?.winActions : event?.actions;
        return this.actionsContainConversation(actions);
    },

    showPostBattleBossSpriteForEvent: function(eventId, event, phase = 'actions') {
        const spriteConfig = this.resolvePostBattleBossSpriteConfig(event);
        if (!event || !spriteConfig.enabled) return false;
        if (!this.eventHasConversationAction(event, phase)) return false;
        // 明示的なフィールド演出を持つイベントは、そのスクリプト側の SHOW/CLEANUP に任せる。
        if (this.eventHasFieldVisualFlow(eventId, phase)) return false;
        if (typeof Field === 'undefined') return false;

        const ctx = this.getPostBattleBossVisualContext(eventId, event, phase);
        if (!ctx) return false;
        // 戦後ボスはカットシーン用DOM最前面レイヤーではなく、通常MAPオブジェクトと
        // 同じ行深度で描画する。Phaser/Canvas双方の通常描画が pending context を参照する。
        const legacyImg = typeof document !== 'undefined' ? document.getElementById('field-visual-post-battle-boss') : null;
        if (legacyImg) legacyImg.remove();
        if (typeof Field.refreshVisualState === 'function') Field.refreshVisualState();
        else if (typeof Field.render === 'function') Field.render();
        return true;
    },

    cleanupPostBattleBossSprite: function(eventId = null, phase = null) {
        const img = typeof document !== 'undefined' ? document.getElementById('field-visual-post-battle-boss') : null;
        const imageEventMatches = !eventId || String(img?.dataset?.postBattleEventId || '') === String(eventId);
        const imagePhaseMatches = !phase || String(img?.dataset?.postBattlePhase || 'actions') === String(phase);
        if (img && imageEventMatches && imagePhaseMatches) img.remove();
        const layer = typeof document !== 'undefined' ? document.getElementById('field-visual-cutscene-layer') : null;
        if (layer && layer.children.length === 0) layer.remove();
        const progress = App?.data?.progress;
        const pending = progress?.pendingPostBattleBossVisual;
        const eventMatches = !eventId || String(pending?.eventId || '') === String(eventId);
        const phaseMatches = !phase || String(pending?.phase || 'actions') === String(phase);
        if (pending && eventMatches && phaseMatches) {
            delete progress.pendingPostBattleBossVisual;
            if (typeof App !== 'undefined' && typeof App.save === 'function') App.save();
            if (typeof Field !== 'undefined' && typeof Field.refreshVisualState === 'function') Field.refreshVisualState();
            else if (typeof Field !== 'undefined' && typeof Field.render === 'function') Field.render();
        }
    },

    // ==========================================
    // 進行イベント・予約イベントの永続ジャーナル
    // ==========================================
    createEventToken: function(prefix = 'evt') {
        const random = Math.random().toString(36).slice(2, 10);
        return `${prefix}-${Date.now().toString(36)}-${random}`;
    },

    getEventPathKey: function(path = []) {
        return (Array.isArray(path) ? path : [path]).map(part => String(part)).join('/');
    },

    normalizeActiveEventJournal: function(active, fallback = {}) {
        if (!active || typeof active !== 'object') active = {};
        active.token = active.token || fallback.token || this.createEventToken('evt');
        active.eventId = active.eventId || fallback.eventId || null;
        active.phase = active.phase || fallback.phase || 'actions';
        active.status = active.status || 'running';
        active.currentPath = Array.isArray(active.currentPath)
            ? active.currentPath
            : (Number.isFinite(Number(active.actionIndex)) ? [Number(active.actionIndex)] : null);
        active.completedActions = active.completedActions && typeof active.completedActions === 'object'
            ? active.completedActions
            : {};
        active.selectedBranches = active.selectedBranches && typeof active.selectedBranches === 'object'
            ? active.selectedBranches
            : {};
        active.effectStates = active.effectStates && typeof active.effectStates === 'object'
            ? active.effectStates
            : {};
        active.meta = active.meta && typeof active.meta === 'object' ? active.meta : (fallback.meta || {});
        active.startedAt = Number(active.startedAt || Date.now());
        return active;
    },

    isEventPhaseRunnable: function(eventId, phase = 'actions') {
        const targetEventId = String(eventId || '');
        if (!targetEventId) return false;
        const event = this.events?.[targetEventId];
        if (!event) return false;
        const normalizedPhase = phase === 'win' ? 'win' : 'actions';
        const actions = normalizedPhase === 'win' ? event.winActions : event.actions;
        return Array.isArray(actions);
    },

    sanitizeEventJournal: function(journal = null) {
        const progress = App?.data?.progress;
        const target = journal || progress?.eventJournal;
        if (!progress || !target || typeof target !== 'object') {
            return { removedQueueEntries: 0, removedActive: false };
        }

        let removedQueueEntries = 0;
        const sourceQueue = Array.isArray(target.queue) ? target.queue : [];
        target.queue = sourceQueue.filter(entry => {
            if (!entry || entry.status === 'completed') return true;
            if (this.isEventPhaseRunnable(entry.eventId, entry.phase)) return true;
            removedQueueEntries += 1;
            console.warn('[StoryManager] 実行不能なイベント予約を破棄しました:', entry.eventId, entry.phase);
            return false;
        });

        let removedActive = false;
        if (target.active && target.active.status !== 'completed' &&
            !this.isEventPhaseRunnable(target.active.eventId, target.active.phase)) {
            console.warn('[StoryManager] 実行不能なactiveイベントを破棄しました:', target.active.eventId, target.active.phase);
            target.active = null;
            removedActive = true;
        }

        if (progress.activeEvent && progress.activeEvent.status !== 'completed' &&
            !this.isEventPhaseRunnable(progress.activeEvent.eventId, progress.activeEvent.phase)) {
            delete progress.activeEvent;
            removedActive = true;
        }

        return { removedQueueEntries, removedActive };
    },

    ensureEventJournal: function() {
        const progress = App?.data?.progress;
        if (!progress) return null;
        if (!progress.eventJournal || typeof progress.eventJournal !== 'object') {
            progress.eventJournal = { version: 2, queue: [], active: null };
        }
        const journal = progress.eventJournal;
        journal.version = 2;
        if (!Array.isArray(journal.queue)) journal.queue = [];
        let nextSequence = Math.max(1, Number(journal.nextSequence || 1));
        journal.queue.forEach(entry => {
            if (!entry || Number.isFinite(Number(entry.sequence))) return;
            entry.sequence = nextSequence++;
        });
        journal.nextSequence = Math.max(nextSequence, ...journal.queue.map(entry => Number(entry?.sequence || 0) + 1));

        const migrateLegacyQueue = (eventId, phase, legacyKey) => {
            if (!eventId) return;
            if (!this.isEventPhaseRunnable(eventId, phase)) {
                console.warn('[StoryManager] 実行不能な旧イベント予約を破棄しました:', eventId, phase, legacyKey);
                delete progress[legacyKey];
                return;
            }
            const exists = journal.queue.some(entry => entry && entry.eventId === eventId && entry.phase === phase && entry.status !== 'completed');
            if (!exists) {
                journal.queue.push({
                    token: this.createEventToken(phase === 'win' ? 'win' : 'evt'),
                    eventId,
                    phase,
                    status: 'queued',
                    sequence: journal.nextSequence++,
                    createdAt: Date.now(),
                    meta: { migratedFrom: legacyKey }
                });
            }
            delete progress[legacyKey];
        };
        migrateLegacyQueue(progress.pendingEventId, 'actions', 'pendingEventId');
        migrateLegacyQueue(progress.pendingBattleWinEventId, 'win', 'pendingBattleWinEventId');

        if (!journal.active && progress.activeEvent) {
            const legacy = progress.activeEvent;
            const active = this.normalizeActiveEventJournal({
                ...legacy,
                token: legacy.token || this.createEventToken('evt'),
                currentPath: Array.isArray(legacy.currentPath)
                    ? legacy.currentPath
                    : [Math.max(0, Number(legacy.actionIndex || 0))],
                completedActions: legacy.completedActions || {},
                selectedBranches: legacy.selectedBranches || {},
                effectStates: legacy.effectStates || {},
                meta: legacy.meta || { migratedFrom: 'activeEvent' }
            });
            const actionIndex = Math.max(0, Number(legacy.actionIndex || 0));
            for (let i = 0; i < actionIndex; i++) active.completedActions[String(i)] = true;

            // v1カーソルで世界樹の葉消費後に止まったレイラ加入セーブを救済する。
            // 回復会話まで到達している場合は選択済み分岐と消費済み命令を復元する。
            // 会話情報も残っていない曖昧な狭い窓では、葉を1枚だけ戻して再選択可能にする。
            if (legacy.eventId === 'light_palace_prison_leila' &&
                !progress.flags?.leilaJoined && progress.flags?.lightPalaceCleared) {
                const conversationKey = String(progress.activeConversation?.key || '');
                const branchPaths = {
                    outer: '0',
                    item: '0/then/1',
                    choice: '0/then/1/then/0',
                    consume: '0/then/1/then/0/yes/0'
                };
                if (conversationKey === 'LIGHT_PALACE_LEILA_RECOVERY_JOIN') {
                    active.selectedBranches[branchPaths.outer] = 'then';
                    active.selectedBranches[branchPaths.item] = 'then';
                    active.selectedBranches[branchPaths.choice] = 'yes';
                    active.completedActions[branchPaths.consume] = true;
                    active.meta.legacyRecovery = 'leila-consumed-leaf';
                } else if (!conversationKey && Number(App.data?.items?.[5] || 0) <= 0) {
                    if (!App.data.items) App.data.items = {};
                    App.data.items[5] = 1;
                    active.meta.legacyRecovery = 'leila-restored-leaf';
                }
            }
            journal.active = active;
        }

        if (journal.active) {
            journal.active = this.normalizeActiveEventJournal(journal.active);

            // Phase 10-12で六芒星イベントの「完了フラグ」をSCENE_PARTYより前に立てていたため、
            // その直後に失敗したセーブはeventJournalだけが古いaction indexを保持し、
            // マップ側の再発火もeventFlagに阻止される二重ロック状態になっていた。
            // 新しいVeldEncounterStartedが存在しない旧停止データだけを判定し、
            // 六芒星イベントを先頭から冪等再実行できる状態へ戻す。
            const flags = progress.flags || (progress.flags = {});
            const lightPalaceTrapRevision = 16;
            const isRecoverableLightPalaceTrap = journal.active.eventId === 'light_palace_flashback_hexagram_trap'
                && flags.lightPalaceFlashbackActive === true
                && flags.lightPalaceFlashbackVeldEncounterStarted !== true
                && flags.lightPalaceFlashbackRetreatOrdered !== true;
            const lightPalaceTrapNeedsReplay = isRecoverableLightPalaceTrap && (
                flags.lightPalaceFlashbackHexagramResolved === true
                || journal.active.status === 'error'
                || Number(journal.active.meta?.lightPalaceTrapRevision || 0) !== lightPalaceTrapRevision
            );
            if (lightPalaceTrapNeedsReplay) {
                const previousError = String(journal.active.error?.message || '');
                journal.active.completedActions = {};
                journal.active.selectedBranches = {};
                journal.active.effectStates = {};
                journal.active.currentPath = null;
                journal.active.status = 'running';
                journal.active.error = null;
                journal.active.meta = {
                    ...(journal.active.meta || {}),
                    lightPalaceTrapRevision,
                    lightPalaceTrapRecovery: 'phase18-restart-before-veld',
                    lightPalaceTrapPreviousError: previousError || undefined
                };
                flags.lightPalaceFlashbackHexagramTriggered = true;
                flags.lightPalaceFlashbackHexagramResolved = false;
                delete progress.activeConversation;
            }

            progress.activeEvent = journal.active;
        } else if (progress.activeEvent) {
            delete progress.activeEvent;
        }

        // StoryManagerに存在しないeventIdや、対象phaseを持たない予約は
        // フィールド入力を永久ロックするため、ロード時点で安全に除去する。
        this.sanitizeEventJournal(journal);
        return journal;
    },

    queueEvent: function(eventId, phase = 'actions', options = {}) {
        if (!eventId) return null;
        const normalizedPhase = phase === 'win' ? 'win' : 'actions';
        if (!this.isEventPhaseRunnable(eventId, normalizedPhase)) {
            console.warn('[StoryManager] Storyイベントではないためキュー登録を拒否しました:', eventId, normalizedPhase);
            return null;
        }
        const journal = this.ensureEventJournal();
        if (!journal) return null;
        const dedupeKey = options.dedupeKey || null;
        const existing = dedupeKey
            ? journal.queue.find(entry => entry && entry.status !== 'completed' && entry.dedupeKey === dedupeKey)
            : null;
        if (existing) {
            existing.meta = { ...(existing.meta || {}), ...(options.meta || {}) };
            if (options.save !== false) App.save();
            return existing;
        }
        const entry = {
            token: options.token || this.createEventToken(normalizedPhase === 'win' ? 'win' : 'evt'),
            eventId,
            phase: normalizedPhase,
            status: 'queued',
            dedupeKey,
            sequence: Number(journal.nextSequence || 1),
            createdAt: Date.now(),
            meta: options.meta && typeof options.meta === 'object' ? { ...options.meta } : {}
        };
        journal.nextSequence = entry.sequence + 1;
        journal.queue.push(entry);
        if (options.save !== false) App.save();
        return entry;
    },

    hasPendingFieldResume: function() {
        const progress = App?.data?.progress;
        if (!progress) return false;
        const journal = this.ensureEventJournal?.();
        if (journal?.active && journal.active.status !== 'completed') return true;
        if (Array.isArray(journal?.queue) && journal.queue.some(entry => entry && entry.status !== 'completed')) return true;
        if (progress.activeEvent && progress.activeEvent.status !== 'completed') return true;
        if (progress.pendingEventId || progress.pendingBattleWinEventId || progress.activeConversation) return true;
        return false;
    },

    activateQueuedEvent: function(entry) {
        const progress = App?.data?.progress;
        const journal = this.ensureEventJournal();
        if (!progress || !journal || !entry) return null;
        entry.status = 'running';
        entry.startedAt = entry.startedAt || Date.now();
        const active = this.normalizeActiveEventJournal({
            token: entry.token,
            eventId: entry.eventId,
            phase: entry.phase,
            status: 'running',
            currentPath: null,
            completedActions: entry.completedActions || {},
            selectedBranches: entry.selectedBranches || {},
            effectStates: entry.effectStates || {},
            meta: entry.meta || {},
            startedAt: entry.startedAt
        });
        journal.active = active;
        progress.activeEvent = active;
        this.setStoryEventGuideHidden(true);
        App.save();
        return active;
    },

    beginEventExecution: function(eventId, phase = 'actions', options = {}) {
        const progress = App?.data?.progress;
        const journal = this.ensureEventJournal();
        if (!progress || !journal) return null;
        let active = journal.active;
        if (!active || active.eventId !== eventId || active.phase !== phase || (options.token && active.token !== options.token)) {
            active = this.normalizeActiveEventJournal({
                token: options.token || this.createEventToken(phase === 'win' ? 'win' : 'evt'),
                eventId,
                phase,
                status: 'running',
                currentPath: null,
                completedActions: {},
                selectedBranches: {},
                effectStates: {},
                meta: options.meta || {}
            });
            const startActionIndex = Math.max(0, Number(options.startActionIndex || 0));
            for (let i = 0; i < startActionIndex; i++) active.completedActions[String(i)] = true;
            journal.active = active;
        }
        active.status = 'running';
        active.error = null;
        active.meta = { ...(active.meta || {}), ...(options.meta || {}) };
        if (eventId === 'light_palace_flashback_hexagram_trap') {
            active.meta.lightPalaceTrapRevision = 16;
        }
        progress.activeEvent = active;
        this.setStoryEventGuideHidden(true);
        return active;
    },

    completeEventExecution: function(active) {
        const progress = App?.data?.progress;
        const journal = this.ensureEventJournal();
        if (!progress || !journal) return;
        const token = active?.token || journal.active?.token || null;
        if (token) journal.queue = journal.queue.filter(entry => entry?.token !== token);
        journal.active = null;
        delete progress.activeEvent;
        delete progress.activeConversation;
        this.isTyping = false;
        this.active = false;
        this.endConversation();
        this.setStoryEventGuideHidden(false);
        App.save();
    },

    failEventExecution: function(active, error) {
        const progress = App?.data?.progress;
        const journal = this.ensureEventJournal();
        const message = String(error?.message || error || '不明なイベントエラー');
        if (active) {
            active.status = 'error';
            active.error = { message, at: Date.now(), path: active.currentPath || null };
            if (journal) journal.active = active;
            if (progress) progress.activeEvent = active;
        }
        this.isTyping = false;
        this.active = false;
        this.dismissChoiceUI({ hideOverlay: true });
        this.endConversation();
        this.setStoryEventGuideHidden(false);
        if (typeof document !== 'undefined') document.getElementById('story-field-vertical-curtain-overlay')?.remove();
        App.save();
        console.error('[StoryManager] event execution failed:', error);
        App.log(`<span style="color:#ff8b8b;">イベント処理を中断しました。再読込すると同じ位置から再試行します。<br>${this.escapeHtml ? this.escapeHtml(message) : message}</span>`);
    },

    getMapTransferArrivalState: function(pending) {
        if (!pending) return { arrived: false };
        const location = App.data?.location || {};
        const area = String(location.area || '');
        const mapData = (typeof Field !== 'undefined') ? Field.currentMapData : null;
        let currentAreaKey = null;
        try {
            currentAreaKey = typeof Field !== 'undefined' && typeof Field.getCurrentAreaKey === 'function'
                ? Field.getCurrentAreaKey()
                : null;
        } catch (error) {
            console.warn('[StoryManager] current area lookup during transfer recovery failed:', error);
        }
        const mapIds = [
            mapData?.id,
            mapData?.key,
            mapData?.mapId,
            mapData?.areaKey,
            mapData?.canonicalAreaKey,
            currentAreaKey,
            area
        ].filter(value => value !== undefined && value !== null).map(String);
        const currentFloor = Number(App.data?.progress?.floor || mapData?.floor || 0);
        const currentX = Number(typeof Field !== 'undefined' && Number.isFinite(Number(Field.x)) ? Field.x : location.x);
        const currentY = Number(typeof Field !== 'undefined' && Number.isFinite(Number(Field.y)) ? Field.y : location.y);

        let destinationMatches = false;
        if (pending.targetType === 'fixedMap' || pending.targetType === 'fixedDungeon') {
            destinationMatches = mapIds.includes(String(pending.targetId || ''));
        } else if (pending.targetType === 'abyss') {
            destinationMatches = area === 'ABYSS' || mapIds.includes('ABYSS');
            if (destinationMatches && pending.mode && App.data?.dungeon?.abyssMode) {
                destinationMatches = String(App.data.dungeon.abyssMode) === String(pending.mode);
            }
        }

        if (destinationMatches && Number.isFinite(Number(pending.floor)) && Number(pending.floor) > 0) {
            destinationMatches = currentFloor === Number(pending.floor);
        }
        if (destinationMatches && pending.targetX !== null && pending.targetX !== undefined &&
            Number.isFinite(Number(pending.targetX))) {
            destinationMatches = currentX === Number(pending.targetX);
        }
        if (destinationMatches && pending.targetY !== null && pending.targetY !== undefined &&
            Number.isFinite(Number(pending.targetY))) {
            destinationMatches = currentY === Number(pending.targetY);
        }
        return {
            arrived: destinationMatches,
            area,
            mapIds,
            floor: currentFloor,
            x: currentX,
            y: currentY
        };
    },

    recoverPendingMapTransfer: function() {
        const progress = App?.data?.progress;
        const pending = progress?.pendingMapTransfer;
        if (!pending) return false;
        const journal = this.ensureEventJournal();
        const active = journal?.active;
        const arrival = this.getMapTransferArrivalState(pending);

        // シーン切替直後はField.currentMapDataの構築がまだ終わっていない場合がある。
        // API受付から短時間は失敗判定せず、初期化完了後にもう一度照合する。
        if (!arrival.arrived && pending.status === 'dispatched' &&
            Date.now() - Number(pending.dispatchedAt || 0) < 1500) {
            // 再照合予約はメモリ上だけで管理する。セーブへ一時フラグを残すと、
            // タイマー発火前の再読込後に永久に再予約されないため。
            if (!(this.mapTransferRecheckTokens instanceof Set)) this.mapTransferRecheckTokens = new Set();
            if (!this.mapTransferRecheckTokens.has(pending.token)) {
                this.mapTransferRecheckTokens.add(pending.token);
                setTimeout(() => {
                    this.mapTransferRecheckTokens.delete(pending.token);
                    const current = App.data?.progress?.pendingMapTransfer;
                    if (current?.token === pending.token) StoryManager.resumeActiveConversation?.();
                }, 250);
            }
            return true;
        }

        if (arrival.arrived) {
            pending.status = 'arrived';
            pending.arrivedAt = Date.now();
            pending.arrival = arrival;
            let eventToResume = null;
            if (active && pending.sourceEventToken === active.token) {
                const key = this.getEventPathKey(pending.actionPath || active.currentPath || []);
                if (key) active.completedActions[key] = true;
                active.status = 'running';
                active.currentPath = null;
                journal.active = active;
                progress.activeEvent = active;
                delete progress.pendingMapTransfer;
                App.save();
                eventToResume = active;
            } else if (!active && pending.sourceEventSnapshot?.eventId) {
                // 遷移自体は成功したが、旧版の削除先行処理などでactiveだけ失われた場合も
                // 保存済みスナップショットから同じ命令列を復元し、遷移より後ろの命令を続行する。
                const restored = this.normalizeActiveEventJournal(pending.sourceEventSnapshot);
                const key = this.getEventPathKey(pending.actionPath || restored.currentPath || []);
                if (key) restored.completedActions[key] = true;
                restored.status = 'running';
                restored.currentPath = null;
                journal.active = restored;
                progress.activeEvent = restored;
                delete progress.pendingMapTransfer;
                App.save();
                eventToResume = restored;
            } else {
                delete progress.pendingMapTransfer;
                App.save();
            }
            // MAP遷移はイベント全体の終了点とは限らない。
            // 到着を確認した後は、その命令だけを完了済みにして残りの命令列を次tickで再開する。
            // 同期再入するとField.init / Scene Context初期化中のランナーと競合するため非同期にする。
            if (eventToResume) {
                setTimeout(() => StoryManager.resumeActiveConversation?.(), 0);
            }
            return true;
        }

        // 遷移API受付後も目的地へ到着していない場合は、元命令を未完了のまま再試行する。
        // actionPathを完了扱いにしないため、MAP変更失敗でイベントだけ失われない。
        if (active && pending.sourceEventToken === active.token) {
            active.status = 'running';
            active.currentPath = Array.isArray(pending.actionPath) ? [...pending.actionPath] : active.currentPath;
            pending.status = 'retry';
            pending.lastMismatch = arrival;
            pending.retryCount = Math.max(0, Number(pending.retryCount || 0)) + 1;
            delete progress.pendingMapTransfer;
            journal.active = active;
            progress.activeEvent = active;
            App.save();
            return false;
        }

        // 旧版の削除先行セーブを救済できるよう、保存済みイベントスナップショットがあれば復元する。
        if (!active && pending.sourceEventSnapshot?.eventId) {
            const restored = this.normalizeActiveEventJournal(pending.sourceEventSnapshot);
            restored.status = 'running';
            restored.currentPath = Array.isArray(pending.actionPath) ? [...pending.actionPath] : restored.currentPath;
            const key = this.getEventPathKey(restored.currentPath || []);
            if (key) delete restored.completedActions[key];
            journal.active = restored;
            progress.activeEvent = restored;
            delete progress.pendingMapTransfer;
            App.save();
            return false;
        }

        pending.status = 'orphaned';
        pending.lastMismatch = arrival;
        App.save();
        return false;
    },

    persistEventCursor: function(active, path) {
        const progress = App?.data?.progress;
        const journal = this.ensureEventJournal();
        if (!active || !progress || !journal) return;
        active.currentPath = Array.isArray(path) ? [...path] : null;
        active.status = 'running';
        journal.active = active;
        progress.activeEvent = active;
        App.save();
    },

    evaluateAllyCondition: function(action = {}) {
        const rawIds = Array.isArray(action.charIds)
            ? action.charIds
            : [action.charId ?? action.id ?? action.value];
        const ids = rawIds.map(Number).filter(id => Number.isFinite(id) && id > 0);
        if (ids.length === 0) return false;

        const mode = String(action.mode || action.scope || 'recruited').toLowerCase();
        const testOne = charId => {
            if (mode === 'party' || mode === 'in_party' || mode === 'inparty') {
                return typeof App.isStoryAllyInParty === 'function' && App.isStoryAllyInParty(charId);
            }
            if (mode === 'available') {
                return typeof App.isStoryAllyAvailable === 'function' && App.isStoryAllyAvailable(charId);
            }
            return typeof App.hasStoryAlly === 'function' && App.hasStoryAlly(charId);
        };
        const matchMode = String(action.match || 'all').toLowerCase();
        const matched = matchMode === 'any' ? ids.some(testOne) : ids.every(testOne);
        const expected = action.state !== undefined ? !!action.state : true;
        return matched === expected;
    },

    runEventActionList: async function(actions, rootEventId, phase, active, options = {}) {
        if (!Array.isArray(actions)) return null;
        const prefix = Array.isArray(options.prefix) ? options.prefix : [];
        const runtimeEventId = options.runtimeEventId || rootEventId;
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            if (!action) continue;
            const path = [...prefix, i];
            const pathKey = this.getEventPathKey(path);
            if (active.completedActions[pathKey]) continue;

            this.persistEventCursor(active, path);
            let result = null;

            if (action.type === 'IF_FLAG' || action.type === 'IF' || action.type === 'IF_ALLY' || action.type === 'IF_ITEM' || action.type === 'IF_KILL_COUNTS' || action.type === 'IF_QUEST_STAGE' || action.type === 'CHOICE') {
                let branchName = active.selectedBranches[pathKey];
                if (!branchName) {
                    if (action.type === 'IF_FLAG' || action.type === 'IF') {
                        const key = action.key || action.flag || action.value;
                        const expected = action.state !== undefined ? !!action.state : true;
                        const actual = key ? !!(App.data.progress.flags && App.data.progress.flags[key]) : false;
                        branchName = (actual === expected) ? 'then' : (Array.isArray(action.else) ? 'else' : 'otherwise');
                    } else if (action.type === 'IF_ALLY') {
                        branchName = this.evaluateAllyCondition(action)
                            ? 'then'
                            : (Array.isArray(action.else) ? 'else' : 'otherwise');
                    } else if (action.type === 'IF_ITEM') {
                        const itemId = Number(action.id ?? action.itemId ?? action.value);
                        const requiredCount = Math.max(1, Math.floor(Number(action.count) || 1));
                        branchName = Number(App.data?.items?.[itemId] || 0) >= requiredCount
                            ? 'then'
                            : (Array.isArray(action.else) ? 'else' : 'otherwise');
                    } else if (action.type === 'IF_KILL_COUNTS') {
                        const ids = (Array.isArray(action.ids) ? action.ids : [action.id ?? action.value])
                            .map(Number).filter(id => Number.isFinite(id) && id > 0);
                        const minimum = Math.max(1, Math.floor(Number(action.minimum ?? action.count) || 1));
                        const killCounts = App.data?.book?.killCounts || {};
                        branchName = ids.length > 0 && ids.every(id => Number(killCounts[id] || killCounts[String(id)] || 0) >= minimum)
                            ? 'then'
                            : (Array.isArray(action.else) ? 'else' : 'otherwise');
                    } else if (action.type === 'IF_QUEST_STAGE') {
                        const questId = action.questId || action.id || action.value;
                        const actual = (questId && typeof App.getQuestStage === 'function') ? App.getQuestStage(questId) : 0;
                        const expected = Number(action.stage ?? action.expected ?? action.count ?? 0);
                        const op = action.op || action.operator || '>=';
                        const matched = (typeof App.compareConditionValue === 'function')
                            ? App.compareConditionValue(actual, op, expected)
                            : actual >= expected;
                        branchName = matched ? 'then' : (Array.isArray(action.else) ? 'else' : 'otherwise');
                    } else {
                        const isYes = await this.showChoice(action.text, {
                            yesLabel: action.yesLabel,
                            noLabel: action.noLabel
                        });
                        branchName = isYes ? 'yes' : 'no';
                    }
                    active.selectedBranches[pathKey] = branchName;
                    App.save();
                }
                const branch = action[branchName] || (branchName === 'otherwise' ? action.else : null) || [];
                result = await this.runEventActionList(branch, rootEventId, phase, active, {
                    prefix: [...path, branchName],
                    runtimeEventId
                });
            } else if (action.type === 'EVENT') {
                const subEvent = this.events[action.value];
                if (!subEvent?.actions) throw new Error(`サブイベントが見つかりません: ${action.value}`);
                result = await this.runEventActionList(subEvent.actions, rootEventId, phase, active, {
                    prefix: [...path, `event:${action.value}`],
                    runtimeEventId: action.value
                });
            } else {
                const conversation = App.data?.progress?.activeConversation;
                const sameConversationAction = action.type === 'CONV' && conversation?.key === action.value;
                const lineIndex = sameConversationAction
                    ? Math.max(0, Number(conversation.index || 0))
                    : ((options.initialLineIndex && prefix.length === 0 && i === 0) ? options.initialLineIndex : 0);
                result = await this.processAction(action, runtimeEventId, lineIndex, {
                    managed: true,
                    deferSave: true,
                    activeEvent: active,
                    rootEventId,
                    phase,
                    path
                });
            }

            if (result === 'BREAK' || result === 'BREAK_COMPLETE' || result === 'BREAK_TRANSFER') {
                active.currentPath = path;
                if (result === 'BREAK_TRANSFER') {
                    // 到着確認が済むまで命令を完了扱いにしない。
                    active.status = 'waiting_transfer';
                    const pendingTransfer = App.data?.progress?.pendingMapTransfer;
                    if (pendingTransfer?.sourceEventToken === active.token) {
                        pendingTransfer.sourceEventSnapshot = JSON.parse(JSON.stringify(active));
                    }
                    App.save();
                } else {
                    active.completedActions[pathKey] = true;
                    active.status = result === 'BREAK_COMPLETE' ? 'completed' : 'suspended';
                    if (result === 'BREAK_COMPLETE') this.completeEventExecution(active);
                    else App.save();
                }
                return result === 'BREAK_TRANSFER' ? 'BREAK_TRANSFER' : 'BREAK';
            }

            active.completedActions[pathKey] = true;
            active.currentPath = null;
            delete App.data.progress.activeConversation;
            App.save();
        }
        return null;
    },

    beginResumeRunner: function(token = null) {
        if (this.resumeRunnerActive) return false;
        this.resumeRunnerActive = true;
        this.resumeRunnerToken = token || this.createEventToken('resume');
        return this.resumeRunnerToken;
    },

    endResumeRunner: function(token = null) {
        if (token && this.resumeRunnerToken && token !== this.resumeRunnerToken) return false;
        this.resumeRunnerActive = false;
        this.resumeRunnerToken = null;
        return true;
    },

    /**
     * 中断されたイベントまたは会話があれば再開する
     */
    resumeActiveConversation: function() {
        const data = App.data ? App.data.progress : null;
        if (!data) return false;
        // field初期化や多重入力から同じ再開処理が重なっても、既存ランナーを優先する。
        if (this.resumeRunnerActive) return true;
        if (this.recoverPendingMapTransfer()) return true;
        const journal = this.ensureEventJournal();
        const active = journal?.active;
        if (!active && !data.activeConversation) return false;
        this.setStoryEventGuideHidden(true);

        const runnerToken = this.beginResumeRunner(
            active?.token || `conversation:${String(data.activeConversation?.key || 'unknown')}`
        );
        if (!runnerToken) return true;
        this.active = false;
        this.isTyping = false;
        (async () => {
            try {
                if (active?.eventId) {
                    // restartOnResume は副作用済み命令との整合が取れないため使用しない。
                    // eventJournal の分岐・完了済み命令・会話行を正確に再開する。
                    if (active.phase === 'win') {
                        await this.onBattleWin(active.eventId, 0, 0, { token: active.token, resume: true, meta: active.meta });
                    } else {
                        await this.executeEvent(active.eventId, false, 0, 0, { token: active.token, resume: true, meta: active.meta });
                    }
                } else if (data.activeConversation) {
                    const key = data.activeConversation.key;
                    const conversationResult = await this.waitForConversationCompletion(key, Number(data.activeConversation.index || 0));
                    const conversationStatus = conversationResult?.status
                        || (conversationResult === false ? 'error' : 'completed');
                    if (conversationStatus !== 'completed') {
                        throw new Error(`会話を再開できませんでした: ${key} (${conversationStatus})`);
                    }
                    this.endConversation();
                }
            } catch (error) {
                this.isTyping = false;
                this.active = false;
                console.error('[StoryManager] active conversation resume failed:', error);
                App.log('<span style="color:#ff8b8b;">会話の再開に失敗しました。再読込すると同じ位置から再試行します。</span>');
            } finally {
                if (!this.ensureEventJournal()?.active) this.setStoryEventGuideHidden(false);
                this.endResumeRunner(runnerToken);
            }
        })();
        return true;
    },

    resumeQueuedEventByPhase: function(phase = null) {
        if (this.resumeRunnerActive) return true;
        const journal = this.ensureEventJournal();
        if (!journal || journal.active) return false;
        const entry = journal.queue
            .filter(item => item && (!phase || item.phase === phase) && ['queued', 'running'].includes(item.status))
            .sort((a, b) => Number(a.sequence || a.createdAt || 0) - Number(b.sequence || b.createdAt || 0))[0];
        if (!entry) return false;
        const active = this.activateQueuedEvent(entry);
        if (!active) return false;
        const actualPhase = entry.phase === 'win' ? 'win' : 'actions';
        const runnerToken = this.beginResumeRunner(entry.token);
        if (!runnerToken) return true;
        this.active = false;
        this.isTyping = false;
        (async () => {
            try {
                // 絞り込み引数phaseではなく、実際に取り出したentry.phaseで配送する。
                // resumePendingStoryEvent(null)経由のwin予約をactionsへ誤配送すると、
                // 元イベントのBOSS命令が再実行され、イベント戦闘が永久ループする。
                if (actualPhase === 'win') {
                    await this.onBattleWin(entry.eventId, 0, 0, { token: entry.token, resume: true, meta: entry.meta });
                } else {
                    await this.executeEvent(entry.eventId, false, 0, 0, { token: entry.token, resume: true, meta: entry.meta });
                }
            } catch (error) {
                console.error('[StoryManager] queued event resume failed:', error);
            } finally {
                this.endResumeRunner(runnerToken);
            }
        })();
        return true;
    },

    resumePendingStoryEvent: function() {
        return this.resumeQueuedEventByPhase(null);
    },

    resumePendingBattleWinEvent: function() {
        return this.resumeQueuedEventByPhase('win');
    },

    resumePendingEvent: function() {
        return this.resumeQueuedEventByPhase('actions');
    },

	// ==========================================
    // 1. 会話スクリプト (scripts)
    // ==========================================
    scripts: (typeof STORY_MANAGER_DATA !== "undefined" && STORY_MANAGER_DATA.scripts) ? STORY_MANAGER_DATA.scripts : {},

    events: (typeof STORY_MANAGER_DATA !== "undefined" && STORY_MANAGER_DATA.events) ? STORY_MANAGER_DATA.events : {},

	// ==========================================
    // 4. イベント実行エンジン
    // ==========================================
    /**
     * 通常イベント実行
     * @param {string} eventId 
     * @param {boolean} isSubEvent 
     * @param {number} startActionIndex 命令の開始位置
     * @param {number} startLineIndex セリフの開始位置
     */
    executeEvent: async function(eventId, isSubEvent = false, startActionIndex = 0, startLineIndex = 0, options = {}) {
        const event = this.events[eventId];
        if (!event || !Array.isArray(event.actions)) return false;

        // 旧EVENT命令の直接呼出し互換。新ランナーではサブイベントも同じジャーナルへ展開する。
        if (isSubEvent) {
            for (let i = Math.max(0, Number(startActionIndex || 0)); i < event.actions.length; i++) {
                const lineIdx = i === Number(startActionIndex || 0) ? startLineIndex : 0;
                const result = await this.processAction(event.actions[i], eventId, lineIdx);
                if (result === 'BREAK' || result === 'BREAK_COMPLETE' || result === 'BREAK_TRANSFER') return result;
            }
            return true;
        }

        const journal = this.ensureEventJournal();
        if (this.active && journal?.active && journal.active.eventId !== eventId) return false;
        const active = this.beginEventExecution(eventId, 'actions', {
            token: options.token,
            meta: options.meta,
            startActionIndex
        });
        if (!active) return false;
        this.active = true;
        this.showPostBattleBossSpriteForEvent(eventId, event, 'actions');

        try {
            const result = await this.runEventActionList(event.actions, eventId, 'actions', active, {
                initialLineIndex: startLineIndex
            });
            if (result === 'BREAK' || result === 'BREAK_TRANSFER') return true;
            this.completeEventExecution(active);
            this.refreshFieldAfterStoryStateChange();
            return true;
        } catch (error) {
            this.failEventExecution(active, error);
            return false;
        } finally {
            this.cleanupPostBattleBossSprite(eventId, 'actions');
        }
    },

    /**
     * 勝利後イベント実行
     */
    onBattleWin: async function(eventId, startActionIndex = 0, startLineIndex = 0, options = {}) {
        const event = this.events[eventId];
        if (!event || !Array.isArray(event.winActions)) return false;
        const active = this.beginEventExecution(eventId, 'win', {
            token: options.token,
            meta: options.meta,
            startActionIndex
        });
        if (!active) return false;

        this.active = true;
        this.showPostBattleBossSpriteForEvent(eventId, event, 'win');
        try {
            const result = await this.runEventActionList(event.winActions, eventId, 'win', active, {
                initialLineIndex: startLineIndex
            });
            if (result === 'BREAK' || result === 'BREAK_TRANSFER') return true;
            this.completeEventExecution(active);
            this.refreshFieldAfterStoryStateChange();
            return true;
        } catch (error) {
            this.failEventExecution(active, error);
            return false;
        } finally {
            this.cleanupPostBattleBossSprite(eventId, 'win');
        }
    },

    /**
     * 会話イベント中にMAP遷移する前のUI後始末。
     * activeEvent は遷移成功が確認できるまで残し、失敗時に同じ命令から再試行できるようにする。
     */
    prepareMapTransfer: function(options = {}) {
        const data = App?.data?.progress;
        if (data) delete data.activeConversation;
        this.isTyping = false;
        this.active = false;
        this.endConversation();
        if (options.save !== false && typeof App !== 'undefined' && typeof App.save === 'function') App.save();
    },

    performMapTransfer: function(targetType, targetId, transferOptions = {}, context = {}) {
        const progress = App?.data?.progress;
        const active = context.activeEvent || this.ensureEventJournal()?.active || null;
        if (!progress || !active) throw new Error('MAP遷移元イベントを特定できません。');
        const token = this.createEventToken('map');
        progress.pendingMapTransfer = {
            token,
            sourceEventToken: active.token,
            sourceEventId: active.eventId,
            sourceEventSnapshot: JSON.parse(JSON.stringify(active)),
            actionPath: Array.isArray(context.path) ? [...context.path] : active.currentPath,
            targetType,
            targetId: targetId || null,
            entryKey: transferOptions.entryKey || null,
            mode: transferOptions.mode || null,
            floor: transferOptions.floor || null,
            targetX: transferOptions.targetX !== null && transferOptions.targetX !== undefined && Number.isFinite(Number(transferOptions.targetX))
                ? Number(transferOptions.targetX)
                : null,
            targetY: transferOptions.targetY !== null && transferOptions.targetY !== undefined && Number.isFinite(Number(transferOptions.targetY))
                ? Number(transferOptions.targetY)
                : null,
            status: 'requested',
            requestedAt: Date.now()
        };
        App.save();
        this.prepareMapTransfer({ save: false });

        let result = false;
        if (targetType === 'fixedDungeon') {
            result = !!(typeof Dungeon !== 'undefined' && typeof Dungeon.startFixed === 'function' &&
                Dungeon.startFixed(targetId, transferOptions));
        } else if (targetType === 'fixedMap') {
            result = !!(typeof Field !== 'undefined' && typeof Field.enterFixedMap === 'function' &&
                Field.enterFixedMap(targetId, transferOptions));
        } else if (targetType === 'abyss') {
            if (typeof Dungeon === 'undefined') result = false;
            else if (transferOptions.direct === true && typeof Dungeon.start === 'function') {
                result = Dungeon.start(transferOptions.floor || 1, { mode: transferOptions.mode || 'story' }) !== false;
            } else if (typeof Dungeon.enter === 'function') {
                result = Dungeon.enter({ mode: transferOptions.mode || 'story' }) !== false;
            }
        }

        if (!result) {
            progress.pendingMapTransfer.status = 'error';
            progress.pendingMapTransfer.error = 'target_rejected';
            progress.pendingMapTransfer.failedAt = Date.now();
            App.save();
            throw new Error(`MAP遷移に失敗しました: ${targetType}:${targetId || ''}`);
        }
        // APIがtrueを返しただけでは到着完了とみなさない。次シーン初期化後に厳密照合する。
        progress.pendingMapTransfer.status = 'dispatched';
        progress.pendingMapTransfer.dispatchedAt = Date.now();
        App.save();
        return true;
    },

    /**
     * ストーリー用の敗北演出。
     * 通常のゲームオーバー処理は呼ばず、暗転・全滅ログ・HP0表示を挟んでから、
     * 指定割合で復帰させて次の会話へ進める。
     */
    playStoryDefeatEffect: async function(action = {}, context = {}) {
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
        const partyUids = Array.isArray(App.data?.party) ? App.data.party.filter(Boolean) : [];
        const targets = Array.isArray(App.data?.characters)
            ? App.data.characters.filter(c => c && partyUids.includes(c.uid))
            : [];
        const active = context.activeEvent || this.ensureEventJournal()?.active || null;
        const pathKey = this.getEventPathKey(context.path || active?.currentPath || []);
        if (active && !active.effectStates) active.effectStates = {};
        const effectState = active && pathKey
            ? (active.effectStates[pathKey] || (active.effectStates[pathKey] = { status: 'pending' }))
            : { status: 'pending' };
        const normalWipeout = action.normalWipeout || action.useNormalWipeout;

        // 副作用は演出より先に一度だけ確定する。演出中に再読込されても、
        // 全滅回数・HP・帰還先を二重適用せず同じアクションを安全に再表示できる。
        if (effectState.status !== 'committed') {
            if (App.data?.stats) App.data.stats.wipeoutCount = (App.data.stats.wipeoutCount || 0) + 1;
            effectState.normalWipeout = !!normalWipeout;
            effectState.targets = [];

            if (normalWipeout) {
                targets.forEach(c => {
                    c.currentHp = 1;
                    delete c.battleStatus;
                    effectState.targets.push({ uid: c.uid, hp: 1, mp: Math.max(0, Number(c.currentMp || 0)) });
                });
                if (App.data) App.data.battle = { active: false };
                if (typeof Dungeon !== 'undefined' && typeof Dungeon.exit === 'function') {
                    effectState.returnPoint = Dungeon.exit(true, null, {
                        save: false,
                        changeScene: false,
                        log: false,
                        clearAction: false
                    });
                } else if (typeof App !== 'undefined') {
                    App.data.location.area = 'WORLD';
                    App.data.location.worldKey = 'WORLD';
                    App.data.location.x = 58;
                    App.data.location.y = 65;
                    effectState.returnPoint = { area: 'WORLD', worldKey: 'WORLD', x: 58, y: 65 };
                }
            } else {
                const hpRate = Math.max(0.01, Math.min(1, Number(action.recoverRate ?? 0.35)));
                const mpRate = Math.max(0, Math.min(1, Number(action.recoverMpRate ?? 0.25)));
                targets.forEach(c => {
                    const stats = typeof App.calcStats === 'function' ? App.calcStats(c) : { maxHp: c.hp || 1, maxMp: c.mp || 0 };
                    const hp = Math.max(1, Math.floor((Number(stats.maxHp) || 1) * hpRate));
                    const mp = Math.max(Number(c.currentMp || 0), Math.floor((Number(stats.maxMp) || 0) * mpRate));
                    c.currentHp = hp;
                    c.currentMp = mp;
                    delete c.battleStatus;
                    effectState.targets.push({ uid: c.uid, hp, mp });
                });
            }
            effectState.status = 'committed';
            effectState.committedAt = Date.now();
            App.save();
        }

        const restoreCommittedTargets = () => {
            (effectState.targets || []).forEach(snapshot => {
                const c = App.getChar?.(snapshot.uid) || targets.find(target => target.uid === snapshot.uid);
                if (!c) return;
                c.currentHp = Math.max(0, Number(snapshot.hp || 0));
                c.currentMp = Math.max(0, Number(snapshot.mp || 0));
                delete c.battleStatus;
            });
        };

        let fade = document.getElementById('story-defeat-fade');
        if (!fade) {
            fade = document.createElement('div');
            fade.id = 'story-defeat-fade';
            fade.style.cssText = `
                position:absolute;
                inset:0;
                background:#000;
                opacity:0;
                pointer-events:none;
                z-index:2600;
                transition:opacity 420ms ease;
            `;
            (document.getElementById('game-container') || document.body).appendChild(fade);
        }

        await wait(30);
        fade.style.opacity = '1';
        await wait(480);

        if (action.cleanupFieldVisualOnBlackout || action.removeFieldVisualId || Array.isArray(action.removeFieldVisualIds)) {
            const removeIds = [];
            if (action.removeFieldVisualId) removeIds.push(action.removeFieldVisualId);
            if (Array.isArray(action.removeFieldVisualIds)) removeIds.push(...action.removeFieldVisualIds.filter(Boolean));
            this.removeStoryFieldVisualTargets({
                removeIds,
                cleanupLayer: !!action.cleanupFieldVisualOnBlackout
            });
        }

        if (action.log) App.log(action.log);
        else App.log('パーティは全滅した……。');

        if (normalWipeout) {
            restoreCommittedTargets();
            if (typeof Menu !== 'undefined' && typeof Menu.renderPartyBar === 'function') Menu.renderPartyBar();
            await wait(Number(action.downWait || 900));
            if (typeof App.changeScene === 'function') App.changeScene('field');
            await wait(Number(action.fadeHold || 650));
        } else {
            // HP0は保存データへ書き戻さない。暗転中は敗北ログだけを表示し、
            // pagehide等の自動保存が入っても回復後の確定状態を壊さない。
            await wait(Number(action.downWait || 900));
            restoreCommittedTargets();
            if (typeof Menu !== 'undefined' && typeof Menu.renderPartyBar === 'function') Menu.renderPartyBar();
            await wait(Number(action.fadeHold || 450));
        }

        fade.style.opacity = '0';
        await wait(460);
        fade.remove();
        if (typeof Field !== 'undefined' && typeof Field.refreshCurrentAction === 'function') {
            Field.refreshCurrentAction({ silent: true });
        }
    },

    waitForConversationCompletion: async function(scriptKey, startFromIndex = 0, options = {}) {
        const pollMs = Math.max(20, Number(options.pollMs || 50));
        let result = await this.showConversation(scriptKey, startFromIndex);
        while (result?.status === 'busy') {
            await new Promise(resolve => setTimeout(resolve, pollMs));
            if (typeof options.abortWhen === 'function' && options.abortWhen()) {
                return { status: 'aborted', scriptKey };
            }
            result = await this.showConversation(scriptKey, startFromIndex);
        }
        const status = result?.status || (result === false ? 'error' : 'completed');
        return result && typeof result === 'object' ? result : { status, scriptKey };
    },

    /**
     * 各アクションの個別処理
     * @param {Object} action 
     * @param {string} eventId 
     * @param {number} lineIndex 再開時のセリフ番号
     */
    processAction: async function(action, eventId, lineIndex = 0, context = {}) {
        const data = App.data.progress;
        const deferSave = context.deferSave === true;
        
        // CONV命令時に lineIndex を渡す。未表示・競合を成功扱いしない。
        if (action.type === 'CONV') {
            const conversationResult = await this.waitForConversationCompletion(action.value, lineIndex, {
                abortWhen: () => context.activeEvent?.status === 'error'
            });
            const conversationStatus = conversationResult?.status
                || (conversationResult === false ? 'error' : 'completed');
            if (conversationStatus !== 'completed') {
                throw new Error(`会話を完了できませんでした: ${action.value} (${conversationStatus})`);
            }
        }
        
        if (action.type === 'ALLY') {
            App.addStoryAlly(Number(action.charId ?? action.value), {
                save: !deferSave,
                initialLevel: action.initialLevel,
                expMultiplierPct: action.expMultiplierPct,
                available: action.available !== false,
                joinParty: action.joinParty !== false,
                silent: action.silent === true,
                allowPermanentReturn: action.allowPermanentReturn === true
            });
            this.refreshFieldAfterStoryStateChange();
        }

        if (action.type === 'SET_JOB') {
            const charId = Number(action.charId ?? action.value);
            const job = String(action.job ?? action.jobName ?? '').trim();
            if (!Number.isFinite(charId) || !job || typeof App.setStoryCharacterJob !== 'function') {
                throw new Error('SET_JOBにはcharId / jobが必要です。');
            }
            const result = App.setStoryCharacterJob(charId, job, {
                save: !deferSave,
                syncSkillsThroughCurrentLevel: action.syncSkills !== false
            });
            if (!result?.ok) {
                throw new Error(`職業を変更できませんでした: charId=${charId}, job=${job} (${result?.reason || 'unknown'})`);
            }
            if (action.refreshField !== false) this.refreshFieldAfterStoryStateChange();
        }

        if (action.type === 'DEPART_ALLY') {
            const charId = Number(action.charId ?? action.value);
            if (Number.isFinite(charId) && typeof App.departStoryAlly === 'function') {
                const result = App.departStoryAlly(charId, {
                    returnEquipment: action.returnEquipment !== false,
                    permanent: action.permanent === true,
                    save: !deferSave
                });
                if (result?.ok && action.equipmentReturnedFlag) {
                    if (!data.flags || typeof data.flags !== 'object') data.flags = {};
                    data.flags[String(action.equipmentReturnedFlag)] = true;
                }
                if (result?.ok && action.departedFlag) {
                    if (!data.flags || typeof data.flags !== 'object') data.flags = {};
                    data.flags[String(action.departedFlag)] = true;
                }
                this.refreshFieldAfterStoryStateChange();
            }
        }

        if (action.type === 'TEMP_ALLY') {
            const charId = Number(action.charId ?? action.value);
            if (Number.isFinite(charId)) {
                App.addStoryAlly(charId, {
                    temporary: true,
                    available: action.available !== false,
                    joinParty: action.joinParty !== false,
                    initialLevel: action.initialLevel,
                    expMultiplierPct: action.expMultiplierPct,
                    silent: action.silent === true,
                    save: !deferSave
                });
                this.refreshFieldAfterStoryStateChange();
            }
        }

        if (action.type === 'RESET_TEMP_ALLY') {
            const charId = Number(action.charId ?? action.value);
            if (Number.isFinite(charId) && typeof App.resetTemporaryStoryAlly === 'function') {
                App.resetTemporaryStoryAlly(charId, { save: !deferSave, force: action.force === true });
                this.refreshFieldAfterStoryStateChange();
            }
        }

        if (action.type === 'RESET_HERO_BASELINE') {
            if (typeof App.resetHeroAfterPlayablePrologue === 'function') {
                App.resetHeroAfterPlayablePrologue({ save: !deferSave });
                if (typeof Menu !== 'undefined') Menu.renderPartyBar();
            }
        }

        if (action.type === 'PROMOTE_TEMP_ALLY') {
            const charId = Number(action.charId ?? action.value);
            if (Number.isFinite(charId) && typeof App.promoteTemporaryStoryAlly === 'function') {
                App.promoteTemporaryStoryAlly(charId, { available: action.available !== false, save: !deferSave });
                this.refreshFieldAfterStoryStateChange();
            }
        }

        if (action.type === 'SET_CHARACTER_LB') {
            const charId = Number(action.charId ?? action.value);
            if (Number.isFinite(charId) && typeof App.setStoryCharacterLimitBreak === 'function') {
                App.setStoryCharacterLimitBreak(charId, action.limitBreak ?? action.lb ?? 99, { save: !deferSave });
                if (typeof Menu !== 'undefined') Menu.renderPartyBar();
            }
        }

        if (action.type === 'SCENE_BEGIN') {
            const options = action.options && typeof action.options === 'object' ? JSON.parse(JSON.stringify(action.options)) : {};
            if (Array.isArray(action.temporaryParty)) options.temporaryParty = action.temporaryParty;
            if (Array.isArray(action.carryoverCharacterIds)) options.carryoverCharacterIds = action.carryoverCharacterIds;
            if (action.visualPreset) options.visualPreset = action.visualPreset;
            if (action.wipeoutEventId) options.wipeoutEventId = action.wipeoutEventId;
            if (action.exitTrigger) options.exitTrigger = action.exitTrigger;
            options.restartOnWipeout = action.restartOnWipeout === true;
            options.isolateInventory = action.isolateInventory === true;
            options.mergeLoot = action.mergeLoot === true;
            const ctx = App.beginSceneContext(options);
            if (!ctx) throw new Error('回想Scene Contextを開始できませんでした。');
        }

        if (action.type === 'SCENE_REMOVE_ALLY') {
            const charId = Number(action.charId ?? action.value);
            const contextReady = typeof App.ensureActiveSceneContext === 'function'
                ? await App.ensureActiveSceneContext()
                : !!App.getActiveSceneContext?.();
            if (!contextReady || !Number.isFinite(charId) || typeof App.removeSceneContextAlly !== 'function'
                || !App.removeSceneContextAlly(charId, { save:false })) {
                throw new Error('回想中の仲間離脱を完了できませんでした。');
            }
            this.refreshFieldAfterStoryStateChange();
        }

        if (action.type === 'SCENE_PARTY') {
            const contextReady = typeof App.ensureActiveSceneContext === 'function'
                ? await App.ensureActiveSceneContext()
                : !!App.getActiveSceneContext?.();
            if (!contextReady || !App.setSceneContextParty(action.party || action.value || [], { preserveExisting: action.preserveExisting !== false })) {
                throw new Error('回想パーティを変更できませんでした。');
            }
            this.refreshFieldAfterStoryStateChange();
        }

        if (action.type === 'SCENE_CHECKPOINT') {
            const contextReady = typeof App.ensureActiveSceneContext === 'function'
                ? await App.ensureActiveSceneContext()
                : !!App.getActiveSceneContext?.();
            if (!contextReady || !App.setSceneContextCheckpoint(action.id || action.value || 'default', { wipeoutEventId: action.wipeoutEventId })) {
                throw new Error('回想チェックポイントを保存できませんでした。');
            }
        }

        if (action.type === 'SCENE_RESTORE') {
            if (!App.restoreSceneContextCheckpoint(action.id || action.value || null, { changeScene: action.changeScene !== false })) {
                throw new Error('回想チェックポイントへ復帰できませんでした。');
            }
        }

        if (action.type === 'SCENE_END') {
            const contextReady = typeof App.ensureActiveSceneContext === 'function'
                ? await App.ensureActiveSceneContext()
                : !!App.getActiveSceneContext?.();
            if (!contextReady || !App.endSceneContext(null, {
                carryoverCharacterIds: action.carryoverCharacterIds,
                changeScene: action.changeScene !== false,
                saveAfter: false
            })) throw new Error('回想Scene Contextを終了できませんでした。');
            this.refreshFieldAfterStoryStateChange();
        }

        if (action.type === 'WORLD_STATE') {
            const key = String(action.key || '').trim();
            if (key && typeof App.setWorldStateValue === 'function') {
                let nextValue = action.value;
                if (action.mode === 'max') {
                    const current = Number(App.getWorldStateValue?.(key, Number.NEGATIVE_INFINITY));
                    const requested = Number(action.value);
                    if (Number.isFinite(current) && Number.isFinite(requested)) nextValue = Math.max(current, requested);
                }
                App.setWorldStateValue(key, nextValue, { save: !deferSave });
                if (action.refreshField === true) this.refreshFieldAfterStoryStateChange();
            }
        }

        if (action.type === 'STORY_EXP') {
            const charId = Number(action.charId ?? action.value);
            const amount = Math.max(0, Math.floor(Number(action.amount ?? action.exp) || 0));
            const rewardKey = action.rewardKey ? String(action.rewardKey) : null;
            if (!Number.isFinite(charId) || amount <= 0 || !rewardKey) {
                throw new Error('STORY_EXPにはcharId / amount / rewardKeyが必要です。');
            }
            const result = App.grantStoryExp?.(charId, amount, rewardKey, {
                save: !deferSave,
                aggregateLevelUpLogs: action.aggregateLevelUpLogs !== false,
                silent: action.silent === true
            });
            if (!result?.ok && result?.reason !== 'already_granted') {
                throw new Error(`ストーリー経験値を付与できませんでした: ${rewardKey} (${result?.reason || 'unknown'})`);
            }
            if (action.refreshField === true) this.refreshFieldAfterStoryStateChange();
        }

        if (action.type === 'SET_EXP_MULTIPLIER') {
            const charId = Number(action.charId ?? action.value);
            let pct = Number(action.pct ?? action.multiplierPct ?? action.expMultiplierPct);
            if (!Number.isFinite(charId) || !Number.isFinite(pct) || pct <= 0) {
                throw new Error('SET_EXP_MULTIPLIERにはcharId / pctが必要です。');
            }
            if (action.onlyDecrease === true) {
                const charData = App.getStoryAllyCharacter?.(charId);
                if (charData) {
                    const current = Number(App.getCharacterExpRequirementMultiplierPct?.(charData));
                    if (Number.isFinite(current) && current > 0) pct = Math.min(current, pct);
                }
            }
            if (!App.setCharacterExpRequirementMultiplierPct?.(charId, pct, { save: !deferSave })) {
                throw new Error(`必要経験値倍率を設定できませんでした: charId=${charId}`);
            }
        }
        
        if (action.type === 'STEP') { 
            data.storyStep = action.value; 
            this.syncHeroLimitBreak(); 
            if (typeof Menu !== 'undefined') Menu.renderPartyBar();
        }

        if (action.type === 'TEMP_LB_START') {
            this.installTemporaryStoryPowerApi();
            if (typeof App.activateTemporaryStoryPower === 'function') {
                App.activateTemporaryStoryPower({
                    id: action.id || 'story_temp_power',
                    limitBreak: action.value ?? 99,
                    reason: eventId || 'story_event',
                    persistAcrossBattles: action.persistAcrossBattles === true,
                    skipSave: deferSave
                });
            }
        }

        if (action.type === 'TEMP_LB_CLEAR') {
            this.installTemporaryStoryPowerApi();
            if (typeof App.clearTemporaryStoryPower === 'function') {
                App.clearTemporaryStoryPower({ id: action.id || null, skipSave: deferSave });
            }
            this.syncHeroLimitBreak();
            if (typeof Menu !== 'undefined') Menu.renderPartyBar();
        }

        if (action.type === 'LB_ADD_PARTY') {
            const ids = Array.isArray(action.charIds)
                ? action.charIds
                : (action.charId != null ? [action.charId] : []);
            const partyUids = Array.isArray(App.data?.party) ? App.data.party.filter(Boolean) : [];
            const amount = Math.max(1, Math.floor(Number(action.amount) || 1));
            ids.forEach(id => {
                const char = Array.isArray(App.data?.characters)
                    ? App.data.characters.find(c => c && Number(c.charId) === Number(id) && partyUids.includes(c.uid))
                    : null;
                if (!char || typeof App.addLimitBreak !== 'function') return;
                const result = App.addLimitBreak(char, amount, action.source || 'story');
                if (result.changed || result.internalChanged) {
                    App.log(`${char.name || '仲間'}の絆が深まった。`);
                }
            });
            if (!deferSave && typeof App.save === 'function') App.save();
            if (typeof Menu !== 'undefined') Menu.renderPartyBar();
        }
        
        if (action.type === 'HEAL') {
            if (!action.silent && typeof AudioManager !== 'undefined') AudioManager.playSe?.('heal');
            App.data.characters.forEach(c => {
                const stats = App.calcStats(c);
                c.currentHp = stats.maxHp;
                c.currentMp = stats.maxMp;
            });
            if (!deferSave) App.save();
            if (typeof Menu !== 'undefined') Menu.renderPartyBar();
            // 汎用回復ログは既定で出さない。必要なイベントだけ message / log:true で明示する。
            if (!action.silent && action.message) App.log(String(action.message));
            else if (!action.silent && action.log === true) App.log("不思議な力で体力が回復した！");
        }
        
        if (action.type === 'SUB')  { data.subStep = action.value; }
        if (action.type === 'LOG')   App.log(action.value);
        if (action.type === 'CREDITS') {
            await this.showCredits(action);
        }

        if (action.type === 'QUEST_ACCEPT' && typeof App.acceptQuest === 'function') {
            App.acceptQuest(action.value || action.questId, { silent: true, save: !deferSave });
        }

        if (action.type === 'QUEST_COMPLETE' && typeof App.completeQuest === 'function') {
            App.completeQuest(action.value || action.questId, { silent: true, save: !deferSave });
            this.refreshFieldAfterStoryStateChange();
        }

        if (action.type === 'QUEST_STAGE' && typeof App.setQuestStage === 'function') {
            const questId = action.questId || action.id || action.value;
            const stage = Number(action.stage ?? action.to ?? action.count ?? 0);
            if (questId) App.setQuestStage(questId, stage, {
                allowDecrease: action.allowDecrease === true,
                allowCompleted: action.allowCompleted === true,
                allowFailed: action.allowFailed === true,
                save: !deferSave
            });
            this.refreshFieldAfterStoryStateChange();
        }

        if (action.type === 'QUEST_FAIL' && typeof App.failQuest === 'function') {
            const questId = action.questId || action.id || action.value;
            if (questId) App.failQuest(questId, {
                reason: action.reason || null,
                allowCompleted: action.allowCompleted === true,
                save: !deferSave
            });
            this.refreshFieldAfterStoryStateChange();
        }

        if (action.type === 'STORY_DEFEAT') {
            await this.playStoryDefeatEffect(action, context);
        }

        if (action.type === 'FIELD_CUTSCENE' || action.type === 'MAP_VISUAL') {
            await this.runStoryFieldVisual(action.value || action.name || 'ACTION_STORY_VISUAL', action);
        }

        if (action.type === 'OPENING_KAMISHIBAI') {
            if (!data.flags) data.flags = {};
            const flagKey = action.flag || 'openingKamishibaiViewed';
            if (!data.flags[flagKey] && typeof OpeningSequence !== 'undefined' && typeof OpeningSequence.play === 'function') {
                const storyOverlay = document.getElementById('story-ui-overlay');
                if (storyOverlay) storyOverlay.style.display = 'none';
                await OpeningSequence.play(action.options || {});
                data.flags[flagKey] = true;
                if (!deferSave) App.save();
            }
        }

        if (action.type === 'FULL_DATA_PROMPT') {
            try {
                if (typeof App.handlePostPrologueFullDataDownload === 'function') {
                    await App.handlePostPrologueFullDataDownload();
                }
            } catch (e) {
                console.error(e);
                if (typeof App.showFullDataDialog === 'function') {
                    await App.showFullDataDialog(
                        `全データダウンロード確認中にエラーが発生しました。\n設定メニューから再実行できます。\n\n${e.message || e}`,
                        { messageOnly: true }
                    );
                }
            }
        }

        if (action.type === 'FLAG') {
            if (!data.flags) data.flags = {};
            const key = action.key || action.value;
            if (key) data.flags[key] = action.state !== undefined ? !!action.state : true;
            App.reconcileDerivedProgressFlags?.();
            if (!deferSave) App.save();
            if (action.refreshField === true) this.refreshFieldAfterStoryStateChange();
        }

        if (action.type === 'UNLOCK') {
            const keys = Array.isArray(action.value) ? action.value : [action.value];
            keys.filter(Boolean).forEach(key => {
                if (typeof App.unlockFeature === 'function') App.unlockFeature(key, { save: !deferSave });
                else {
                    if (!data.unlocked || typeof data.unlocked !== 'object' || Array.isArray(data.unlocked)) data.unlocked = {};
                    data.unlocked[key] = true;
                }
            });
            if (!deferSave) App.save();
            App.reconcileDerivedProgressFlags?.();
        }

        if (action.type === 'ITEM') {
            const itemId = Number(action.id ?? action.value);
            const count = Math.max(1, Math.floor(Number(action.count) || 1));
            if (Number.isFinite(itemId)) {
                if (!App.data.items) App.data.items = {};
                App.data.items[itemId] = Number(App.data.items[itemId] || 0) + count;
                const item = (DB.ITEMS || []).find(i => Number(i.id) === itemId);
                App.log(`${item?.name || `アイテム${itemId}`}を手に入れた！`);
                if (!deferSave) App.save();
            }
        }

        if (action.type === 'EQUIP') {
            const equipId = Number(action.eid ?? action.id ?? action.value);
            const plus = Math.max(0, Math.min(3, Math.floor(Number(action.plus) || 0)));
            if (!Number.isFinite(equipId) || typeof App.createEquipById !== 'function') {
                throw new Error('EQUIPには有効なeidが必要です。');
            }
            const equip = App.createEquipById(equipId, plus, action.fixedOpts || null, action.fixedTraits || null);
            if (!equip) throw new Error(`装備を生成できませんでした: eid=${equipId}`);
            if (!Array.isArray(App.data.inventory)) App.data.inventory = [];
            equip.source = String(action.source || 'storyGift');
            App.data.inventory.push(equip);
            if (action.silent !== true) App.log(`${equip.name}を手に入れた！`);
            window.EquipAcquisitionCard?.enqueue?.(equip, { source:equip.source });
            if (!deferSave) App.save();
        }

        if (action.type === 'CONSUME_ITEM') {
            const itemId = Number(action.id ?? action.value);
            const count = Math.max(1, Math.floor(Number(action.count) || 1));
            const owned = Number(App.data?.items?.[itemId] || 0);
            if (Number.isFinite(itemId) && owned >= count) {
                const remain = owned - count;
                if (remain > 0) App.data.items[itemId] = remain;
                else delete App.data.items[itemId];
                const item = (DB.ITEMS || []).find(i => Number(i.id) === itemId);
                if (action.silent !== true) App.log(`${item?.name || `アイテム${itemId}`}を渡した。`);
                if (!deferSave) App.save();
            }
        }
        
        if (action.type === 'EVENT' && !context.managed) await this.executeEvent(action.value, true);

        if (action.type === 'START_FIXED_DUNGEON') {
            if (!action.value) throw new Error('固定ダンジョンIDが指定されていません。');
            this.performMapTransfer('fixedDungeon', action.value, {
                entryKey: action.entryKey || null,
                floor: action.floor || null,
                nestedReturn: action.nestedReturn === true,
                sceneContextEntry: action.sceneContextEntry === true
            }, context);
            return 'BREAK_TRANSFER';
        }

        if (action.type === 'START_FIXED_MAP') {
            if (!action.value) throw new Error('固定MAP IDが指定されていません。');
            this.performMapTransfer('fixedMap', action.value, {
                entryKey: action.entryKey || null,
                targetX: action.targetX,
                targetY: action.targetY,
                replaceReturnPoint: action.replaceReturnPoint === true
            }, context);
            return 'BREAK_TRANSFER';
        }

        if (action.type === 'START_ABYSS_DUNGEON') {
            const mode = action.mode || 'story';
            const floor = Math.max(1, Number(action.floor || 1));
            this.performMapTransfer('abyss', 'ABYSS', {
                direct: action.direct === true,
                mode,
                floor
            }, context);
            return 'BREAK_TRANSFER';
        }

        if (!context.managed && (action.type === 'IF_FLAG' || action.type === 'IF')) {
            const key = action.key || action.flag || action.value;
            const expected = action.state !== undefined ? !!action.state : true;
            const actual = key ? !!(data.flags && data.flags[key]) : false;
            const branch = (actual === expected) ? action.then : (action.else || action.otherwise);
            if (Array.isArray(branch)) {
                for (const sub of branch) {
                    const res = await this.processAction(sub, eventId);
                    if (res === 'BREAK' || res === 'BREAK_TRANSFER') return res;
                }
            }
        }


        if (!context.managed && action.type === 'IF_ALLY') {
            const branch = this.evaluateAllyCondition(action) ? action.then : (action.else || action.otherwise);
            if (Array.isArray(branch)) {
                for (const sub of branch) {
                    const res = await this.processAction(sub, eventId);
                    if (res === 'BREAK' || res === 'BREAK_TRANSFER') return res;
                }
            }
        }


        if (!context.managed && action.type === 'IF_ITEM') {
            const itemId = Number(action.id ?? action.itemId ?? action.value);
            const requiredCount = Math.max(1, Math.floor(Number(action.count) || 1));
            const ownedCount = Number(App.data?.items?.[itemId] || 0);
            const branch = ownedCount >= requiredCount ? action.then : (action.else || action.otherwise);
            if (Array.isArray(branch)) {
                for (const sub of branch) {
                    const res = await this.processAction(sub, eventId);
                    if (res === 'BREAK' || res === 'BREAK_TRANSFER') return res;
                }
            }
        }

        if (!context.managed && action.type === 'IF_KILL_COUNTS') {
            const ids = (Array.isArray(action.ids) ? action.ids : [action.id ?? action.value])
                .map(Number).filter(id => Number.isFinite(id) && id > 0);
            const minimum = Math.max(1, Math.floor(Number(action.minimum ?? action.count) || 1));
            const killCounts = App.data?.book?.killCounts || {};
            const branch = ids.length > 0 && ids.every(id => Number(killCounts[id] || killCounts[String(id)] || 0) >= minimum)
                ? action.then
                : (action.else || action.otherwise);
            if (Array.isArray(branch)) {
                for (const sub of branch) {
                    const res = await this.processAction(sub, eventId);
                    if (res === 'BREAK' || res === 'BREAK_TRANSFER') return res;
                }
            }
        }

        if (!context.managed && action.type === 'IF_QUEST_STAGE') {
            const questId = action.questId || action.id || action.value;
            const actual = (questId && typeof App.getQuestStage === 'function') ? App.getQuestStage(questId) : 0;
            const expected = Number(action.stage ?? action.expected ?? action.count ?? 0);
            const op = action.op || action.operator || '>=';
            const matched = (typeof App.compareConditionValue === 'function')
                ? App.compareConditionValue(actual, op, expected)
                : actual >= expected;
            const branch = matched ? action.then : (action.else || action.otherwise);
            if (Array.isArray(branch)) {
                for (const sub of branch) {
                    const res = await this.processAction(sub, eventId);
                    if (res === 'BREAK' || res === 'BREAK_TRANSFER') return res;
                }
            }
        }

        if (!context.managed && action.type === 'CHOICE') {
            const isYes = await this.showChoice(action.text, {
                yesLabel: action.yesLabel,
                noLabel: action.noLabel
            });
            const branch = isYes ? action.yes : action.no;
            if (branch && branch.length > 0) {
                for (const sub of branch) {
                    const res = await this.processAction(sub, eventId);
                    if (res === 'BREAK' || res === 'BREAK_TRANSFER') return res;
                }
            }
        }
        
        if (action.type === 'MAP_CHANGE') {
            if (typeof MapRegistry !== 'undefined' && typeof MapRegistry.applyStoryMapMutation === 'function') {
                MapRegistry.applyStoryMapMutation(action.value || action.key, { save: !deferSave });
            }
        }

        if (action.type === 'ABYSS_SPIRIT_TRIAL_BATTLE') {
            const element = String(action.element || action.value || '');
            const master = (typeof App.getAbyssSpiritTrialMaster === 'function')
                ? App.getAbyssSpiritTrialMaster()
                : (globalThis.ABYSS_SPIRIT_TRIAL_MASTER || {});
            const definition = master[element];
            if (!definition) throw new Error(`六属性プリズムの正式マスターが見つかりません: ${element}`);
            const progress = App.ensureAbyssSpiritTrialEvents?.() || App.ensureAbyssRegionProgress?.() || data;
            progress.abyssSpiritTrialEvents = progress.abyssSpiritTrialEvents || {};
            const record = progress.abyssSpiritTrialEvents[element] || (progress.abyssSpiritTrialEvents[element] = {});
            record.state = 'challenged';
            record.attempts = Math.max(0, Math.floor(Number(record.attempts) || 0)) + 1;
            record.lastAttemptAt = Date.now();
            const requiredElements = Object.keys(master);
            return this.processAction({
                type:'BOSS',
                value:Number(definition.bossId),
                winEventId:definition.victoryEventId,
                suppressFixedBossDefeat:true,
                bossStatMultiplier:1,
                elementalSpiritTrial:{
                    version:1,
                    element,
                    rewardItemId:Number(definition.rewardItemId || 0),
                    completionItemId:Number(globalThis.ABYSS_REGION_CONTENT?.cycleCrystalItemId || globalThis.ABYSS_REGION_CONTENT?.octaprismItemId || 701008),
                    requiredElements,
                    attemptNumber:record.attempts,
                    victoryEventId:definition.victoryEventId
                }
            }, eventId, lineIndex, context);
        }

        if (action.type === 'ABYSS_SPIRIT_TRIAL_COMPLETE') {
            const element = String(action.element || action.value || '');
            const progress = App.ensureAbyssSpiritTrialEvents?.() || App.ensureAbyssRegionProgress?.() || data;
            progress.flags = progress.flags || {};
            progress.abyssSpiritBlessings = progress.abyssSpiritBlessings || {};
            progress.abyssSpiritTrialEvents = progress.abyssSpiritTrialEvents || {};
            const record = progress.abyssSpiritTrialEvents[element] || (progress.abyssSpiritTrialEvents[element] = {});
            progress.abyssSpiritBlessings[element] = true;
            record.state = 'completed';
            record.completedAt = record.completedAt || Date.now();
            const master = (typeof App.getAbyssSpiritTrialMaster === 'function') ? App.getAbyssSpiritTrialMaster() : {};
            const elements = Object.keys(master).length ? Object.keys(master) : ['火','水','風','雷','光','闇'];
            if (elements.every(key => progress.abyssSpiritBlessings[key])) {
                progress.flags.abyssAllSpiritTrialsCleared = true;
                const itemId = Number(globalThis.ABYSS_REGION_CONTENT?.cycleCrystalItemId || globalThis.ABYSS_REGION_CONTENT?.octaprismItemId || 701008);
                const ownsCycleCrystal = Number(App.data?.items?.[itemId] || 0) > 0;
                progress.flags.abyssOctaprismGrantPending = false;
                if (ownsCycleCrystal) {
                    progress.flags.abyssCycleCrystalCreated = true;
                    progress.flags.abyssCycleCrystalRitualSeen = true;
                    progress.flags.abyssCycleCrystalRitualPending = false;
                } else if (progress.flags.abyssCycleCrystalCreated !== true) {
                    progress.flags.abyssCycleCrystalRitualPending = true;
                }
            }
        }

        if (action.type === 'ABYSS_CYCLE_CRYSTAL_CREATE') {
            const committed = (typeof App.createCycleCrystalFromRitual === 'function')
                ? App.createCycleCrystalFromRitual()
                : { ok:false, reason:'missing-api' };
            if (!committed?.ok) {
                throw new Error('輪廻の結晶とペンダントの変化を保存できませんでした。');
            }
        }

        // 旧event journalがこのaction直前で保存されていた場合の互換。
        // 旧名の完成品はその場で授与せず、結晶樹の循環の儀へ誘導する。
        if (action.type === 'ABYSS_SPIRIT_TRIAL_GRANT_OCTAPRISM') {
            const progress = App.ensureAbyssSpiritTrialEvents?.() || App.ensureAbyssRegionProgress?.() || data;
            progress.flags = progress.flags || {};
            progress.flags.abyssOctaprismGrantPending = false;
            if (progress.flags.abyssCycleCrystalCreated !== true) {
                progress.flags.abyssCycleCrystalRitualPending = true;
            }
            if (!deferSave && typeof App.save === 'function') App.save();
        }

        if (action.type === 'BOSS') {
            const requestedBossId = action.value !== undefined ? action.value : null;
            const requestedIds = (Array.isArray(requestedBossId) ? requestedBossId : [requestedBossId])
                .map(id => Number(id))
                .filter(id => Number.isFinite(id));
            if (!requestedIds.length) throw new Error(`ボスIDが指定されていません: ${eventId || 'unknown'}`);

            let fixedBossId = requestedBossId;
            let abyssBossEncounter = null;
            if (App.data?.location?.area === 'ABYSS' && requestedIds.length === 1 &&
                typeof Dungeon !== 'undefined' && typeof Dungeon.getCurrentAbyssBossEncounter === 'function') {
                const currentEncounter = Dungeon.getCurrentAbyssBossEncounter();
                const encounterIds = (currentEncounter?.monsterIds || [])
                    .map(id => Number(id))
                    .filter(id => Number.isFinite(id));
                if (encounterIds.length > 1 && encounterIds.includes(requestedIds[0])) {
                    fixedBossId = encounterIds;
                    abyssBossEncounter = currentEncounter;
                }
            }

            const ids = (Array.isArray(fixedBossId) ? fixedBossId : [fixedBossId])
                .map(id => Number(id))
                .filter(id => Number.isFinite(id));
            const monsterApi = (typeof window !== 'undefined' ? window.MonsterData : globalThis.MonsterData);
            const missingIds = ids.filter(id => !monsterApi?.getMonsterById?.(id));
            if (missingIds.length) throw new Error(`ボスデータが見つかりません: ${missingIds.join(', ')}`);
            const isSpecialBoss = ids.some(id => {
                const base = monsterApi.getMonsterById(id);
                return base?.isSpecialBoss || base?.isEstark || id === 902000;
            });

            const progress = App.data.progress || (App.data.progress = {});
            const candidateContext = progress.activeFixedBossContext?.type === 'fixedBoss'
                ? progress.activeFixedBossContext
                : null;
            const currentAreaKey = (typeof Field !== 'undefined' && typeof Field.getCurrentAreaKey === 'function')
                ? Field.getCurrentAreaKey()
                : App.data?.location?.area;
            const currentMapId = (typeof Field !== 'undefined' && Field.currentMapData)
                ? (Field.currentMapData.id || Field.currentMapData.key || Field.currentMapData.areaKey || currentAreaKey)
                : currentAreaKey;
            const inheritedChainId = context.activeEvent?.meta?.battleChainId || null;
            const eventMatches = candidateContext && (
                String(candidateContext.startEventId || '') === String(eventId || '') ||
                (inheritedChainId && String(candidateContext.battleChainId || '') === String(inheritedChainId))
            );
            const activeFixedBossContext = candidateContext &&
                String(candidateContext.areaKey || '') === String(currentAreaKey || '') &&
                String(candidateContext.mapId || candidateContext.areaKey || '') === String(currentMapId || currentAreaKey || '') &&
                eventMatches
                ? candidateContext
                : null;
            if (candidateContext && !activeFixedBossContext) delete progress.activeFixedBossContext;

            const actionFixedBossPosition = action.fixedBossPosition || action.position || null;
            const sourceFixedBossPosition = actionFixedBossPosition || activeFixedBossContext?.fixedBossPosition || null;
            const fixedBossPosition = Number.isFinite(Number(sourceFixedBossPosition?.x)) && Number.isFinite(Number(sourceFixedBossPosition?.y))
                ? { x: Number(sourceFixedBossPosition.x), y: Number(sourceFixedBossPosition.y) }
                : null;
            const rawKeyRewardColors = Array.isArray(action.keyRewardColors)
                ? action.keyRewardColors
                : action.keyRewardColor
                    ? [action.keyRewardColor]
                    : action.keyColor
                        ? [action.keyColor]
                        : [];
            const keyRewardColors = rawKeyRewardColors.filter(Boolean);
            const contextKeyReward = activeFixedBossContext?.fixedKeyReward || null;
            const fixedKeyReward = keyRewardColors.length > 0 ? {
                colors: keyRewardColors,
                color: keyRewardColors[0],
                x: fixedBossPosition?.x ?? ((typeof Field !== 'undefined') ? Field.x : null),
                y: fixedBossPosition?.y ?? ((typeof Field !== 'undefined') ? Field.y : null),
                scopeKey: (typeof Dungeon !== 'undefined' && typeof Dungeon.getKeyScopeKey === 'function')
                    ? Dungeon.getKeyScopeKey()
                    : null
            } : (contextKeyReward ? { ...contextKeyReward } : null);

            const battleChainId = action.battleChainId || activeFixedBossContext?.battleChainId || inheritedChainId ||
                `battle-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
            const elementalSpiritTrial = action.elementalSpiritTrial && typeof action.elementalSpiritTrial === 'object'
                ? JSON.parse(JSON.stringify(action.elementalSpiritTrial))
                : null;
            const externalTurnSupports = Array.isArray(action.externalTurnSupports)
                ? JSON.parse(JSON.stringify(action.externalTurnSupports))
                : null;
            const openingPartyStatDebuff = action.openingPartyStatDebuff && typeof action.openingPartyStatDebuff === 'object'
                ? JSON.parse(JSON.stringify(action.openingPartyStatDebuff))
                : null;
            const guaranteedEquipmentReward = action.guaranteedEquipmentReward && typeof action.guaranteedEquipmentReward === 'object'
                ? JSON.parse(JSON.stringify(action.guaranteedEquipmentReward))
                : null;
            const directEventBattleRuleKeys = [
                'bestiaryExcluded', 'noDrops', 'noExp', 'noGold', 'noQuestProgress', 'noRecruit',
                'forcedLoss', 'hpFloor', 'endAfterTurns', 'endAtHpPercent', 'endAtHpConversation', 'storyVariantOf',
                'finisherAfterTurns', 'finisherAtHpFloor', 'finisherConversation', 'finisherSkillId', 'finisherSkillName',
                'finisherDamage', 'finisherActorMonsterId', 'finisherEffectImage', 'finisherFlashCount', 'targetMonsterId', 'targetMonsterIds'
            ];
            const explicitEventBattleRules = action.eventBattleRules && typeof action.eventBattleRules === 'object'
                ? action.eventBattleRules
                : action.eventBattle && typeof action.eventBattle === 'object'
                    ? action.eventBattle
                    : null;
            const directEventBattleRules = Object.fromEntries(
                directEventBattleRuleKeys
                    .filter(key => action[key] !== undefined)
                    .map(key => [key, action[key]])
            );
            const eventBattleRules = (explicitEventBattleRules || Object.keys(directEventBattleRules).length)
                ? JSON.parse(JSON.stringify({ ...(explicitEventBattleRules || {}), ...directEventBattleRules }))
                : null;
            App.data.battle = {
                active: false,
                isBossBattle: true,
                battleBg: action.battleBg || null,
                fixedBossId,
                abyssBossEncounter,
                fixedBossPosition,
                fixedBossProgressKey: action.fixedBossProgressKey || action.progressKey || activeFixedBossContext?.progressKey || null,
                fixedQuestId: action.fixedQuestId || activeFixedBossContext?.fixedQuestId || null,
                bossStatMultiplier: action.bossStatMultiplier || action.bossScale || activeFixedBossContext?.bossStatMultiplier || null,
                isSpecialBoss,
                isEstark: isSpecialBoss,
                suppressFixedBossDefeat: !!(action.suppressFixedBossDefeat || action.deferFixedBossDefeat || action.markFixedBossDefeated === false),
                eventId,
                fixedKeyReward: fixedKeyReward,
                isAmbushed: !!action.ambush,
                forceAutoOff: action.forceAutoOff === true,
                storyWinEventId: action.winEventId || null,
                storyLossEventId: action.lossEventId || null,
                battleChainId,
                battleChainPhase: Math.max(0, Number(action.battleChainPhase ?? activeFixedBossContext?.phase ?? 0)),
                completedTurns: 0,
                ...(eventBattleRules ? { eventBattleRules } : {}),
                ...(externalTurnSupports ? { externalTurnSupports } : {}),
                ...(openingPartyStatDebuff ? { openingPartyStatDebuff } : {}),
                fixedBossContextNonce: activeFixedBossContext?.nonce || null,
                fieldBossWasRendered: action.fieldBossWasRendered === true || !!activeFixedBossContext,
                ...(elementalSpiritTrial ? {
                    elementalSpiritTrial,
                    abyssSpiritElement: elementalSpiritTrial.element,
                    fixedTrialElement: elementalSpiritTrial.element,
                    fixedTrialRewardItemId: Number(elementalSpiritTrial.rewardItemId || 0),
                    fixedTrialCompletionItemId: Number(elementalSpiritTrial.completionItemId || 0),
                    fixedTrialRequiredElements: Array.isArray(elementalSpiritTrial.requiredElements)
                        ? elementalSpiritTrial.requiredElements.slice()
                        : []
                } : {}),
                ...(guaranteedEquipmentReward ? { guaranteedEquipmentReward } : {})
            };
            if (!deferSave) App.save();
            this.isTyping = false;
            this.active = false;
            this.endConversation();
            const startBattleScene = () => App.changeScene('battle');
            if (typeof App.playEncounterTransition === 'function') {
                if (typeof App.lockFieldInput === 'function') App.lockFieldInput(1800);
                App.playEncounterTransition(startBattleScene, { eventBattle: true });
            } else {
                startBattleScene();
            }
            return 'BREAK_COMPLETE';
        }

    },
	
	// ==========================================
    // 5. UI制御ロジック (選択肢対応版)
    // ==========================================
    
    /**
     * はい/いいえの選択肢を表示します
     */
    dismissChoiceUI: function(options = {}) {
        const menu = document.getElementById('story-choice-area');
        if (menu) menu.remove();
        const indicator = document.getElementById('story-next-indicator');
        if (indicator) indicator.style.visibility = 'visible';
        if (options.hideOverlay !== false) {
            const overlay = document.getElementById('story-ui-overlay');
            if (overlay) overlay.style.display = 'none';
        }
    },

    clearStoryPortrait: function() {
        const portrait = document.getElementById('story-portrait');
        if (!portrait) return;
        portrait.removeAttribute('src');
        portrait.style.display = 'none';
    },

    prepareBattleTransitionUI: function() {
        this.dismissChoiceUI({ hideOverlay: true });
        const backlog = document.getElementById('backlog-overlay');
        if (backlog) backlog.remove();
        this.isTyping = false;
    },

    showChoice: function(text, options = {}) {
        return new Promise((resolve) => {
            this.dismissChoiceUI({ hideOverlay: false });
            const overlay = document.getElementById('story-ui-overlay') || this.createStoryDOM();
            overlay.style.display = 'flex';
            // 選択肢には話者が存在しない。直前のボス会話などの立ち絵を絶対に持ち越さない。
            this.clearStoryPortrait();
            const choiceName = document.getElementById('story-name');
            const choiceText = document.getElementById('story-text');
            choiceName.style.display = 'block';
            choiceName.innerText = "選択";
            choiceText.innerText = text;
            const choiceWindow = choiceText.parentElement;
            if (choiceWindow?.dataset?.defaultStyle) choiceWindow.style.cssText = choiceWindow.dataset.defaultStyle;
            // 選択肢はボタンを含むため、3行固定の会話ウィンドウとは分けて必要な高さまで広げる。
            if (choiceWindow) {
                choiceWindow.style.height = 'auto';
                choiceWindow.style.minHeight = '148px';
                choiceWindow.style.maxHeight = '300px';
                choiceWindow.style.overflowY = 'auto';
            }
			
			// ★修正: visibilityで制御することでshowConversationとの競合を回避
            document.getElementById('story-next-indicator').style.visibility = 'hidden';
			
            const box = document.getElementById('story-text').parentElement;
            const menu = document.createElement('div');
            menu.id = "story-choice-area";
            menu.style.cssText = "display:flex; gap:20px; margin-top:15px; justify-content:center;";
            
            const btnStyle = "padding:10px 30px; background:#000044; border:1px solid #ffd700; color:#ffd700; cursor:pointer; font-weight:bold; border-radius:4px;";
            const yesButton = document.createElement('button');
            const noButton = document.createElement('button');
            yesButton.style.cssText = btnStyle;
            noButton.style.cssText = btnStyle;
            yesButton.className = 'no-skip';
            noButton.className = 'no-skip';
            yesButton.textContent = String(options.yesLabel || 'はい');
            noButton.textContent = String(options.noLabel || 'いいえ');
            menu.appendChild(yesButton);
            menu.appendChild(noButton);
            
            yesButton.onclick = (e) => {
                e.stopPropagation();
                this.dismissChoiceUI({ hideOverlay: true });
                resolve(true);
            };
            noButton.onclick = (e) => {
                e.stopPropagation();
                this.dismissChoiceUI({ hideOverlay: true });
                resolve(false);
            };
            box.appendChild(menu);
        });
    },


    /**
     * ストーリー正本から呼び出す汎用エンドロール。
     */
    showCredits: async function(options = {}) {
        const existing = document.getElementById('story-credits-overlay');
        if (existing) existing.remove();
        const overlay = document.createElement('div');
        overlay.id = 'story-credits-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-label', options.title || 'エンドロール');
        overlay.style.cssText = [
            'position:fixed','inset:0','z-index:4200','background:radial-gradient(circle at 50% 35%, #22243d 0%, #080911 58%, #000 100%)',
            'color:#fff','display:flex','align-items:center','justify-content:center','overflow:hidden','font-family:serif'
        ].join(';');
        const roll = document.createElement('div');
        roll.style.cssText = 'width:min(88vw,720px);text-align:center;line-height:2.15;letter-spacing:.08em;transform:translateY(70vh);animation:storyCreditsRoll 16s linear forwards;';
        const title = document.createElement('h1');
        title.textContent = options.title || 'THE END';
        title.style.cssText = 'font-size:clamp(24px,5vw,46px);margin:0 0 10vh;color:#f1e7ba;text-shadow:0 0 18px rgba(255,255,255,.4);';
        roll.appendChild(title);
        (Array.isArray(options.lines) ? options.lines : []).forEach(line => {
            const p = document.createElement('p');
            p.textContent = String(line || '');
            p.style.cssText = 'margin:3.5vh 0;font-size:clamp(14px,2.8vw,22px);';
            roll.appendChild(p);
        });
        const end = document.createElement('p');
        end.textContent = '画面を押して戻る';
        end.style.cssText = 'margin:13vh 0 30vh;font-size:14px;opacity:.72;';
        roll.appendChild(end);
        overlay.appendChild(roll);
        document.body.appendChild(overlay);
        if (typeof AudioManager !== 'undefined') AudioManager.stopBgm?.(600);
        await new Promise(resolve => {
            let closable = false;
            const timer = setTimeout(() => { closable = true; }, 1200);
            const finish = () => {
                if (!closable) return;
                clearTimeout(timer);
                overlay.removeEventListener('click', finish);
                overlay.remove();
                resolve();
            };
            overlay.addEventListener('click', finish);
            setTimeout(() => { closable = true; }, 16000);
        });
        if (typeof AudioManager !== 'undefined') AudioManager.syncForScene?.('field');
    },

    /**
     * 会話の表示
     */
    setConversationPortrait: function(portraitImg, charId, expression = 'normal') {
        if (!portraitImg) return;
        portraitImg.onload = null;
        portraitImg.onerror = null;
        portraitImg.removeAttribute('src');
        portraitImg.style.display = 'none';

        if (charId === undefined || charId === null || typeof App.getCharacterPortraitPath !== 'function') return;

        // 表情差分は全キャラ・全表情が揃っているとは限らない。
        // 指定表情 -> normal表情 -> 常設の基本顔画像、の順に退避し、
        // 会話画像の不足だけでportrait全体が消えないようにする。
        const candidates = [
            App.getCharacterPortraitPath(charId, expression),
            App.getCharacterPortraitPath(charId, 'normal'),
            (typeof App.getDefaultFaceIconPath === 'function') ? App.getDefaultFaceIconPath(charId) : null,
        ].filter((src, index, list) => src && list.indexOf(src) === index);
        if (!candidates.length) return;

        let candidateIndex = 0;
        portraitImg.onload = () => {
            portraitImg.style.display = 'block';
        };
        portraitImg.onerror = () => {
            candidateIndex += 1;
            if (candidateIndex < candidates.length) {
                portraitImg.src = candidates[candidateIndex];
                return;
            }
            portraitImg.onload = null;
            portraitImg.onerror = null;
            portraitImg.removeAttribute('src');
            portraitImg.style.display = 'none';
        };
        portraitImg.src = candidates[candidateIndex];
    },

    showConversation: async function(scriptKey, startFromIndex = 0) {
        const lines = this.scripts[scriptKey];
        if (!Array.isArray(lines)) {
            console.error(`[StoryManager] conversation not found: ${scriptKey}`);
            return { status: 'missing', scriptKey };
        }

        // 別会話の入力待ちを「完了」と誤認しない。呼出側はqueuedのまま再試行する。
        if (this.isTyping) return { status: 'busy', scriptKey };
        this.isTyping = true;
        let completed = false;
        let overlay = null;

        try {
            startFromIndex = Math.max(0, Math.floor(Number(startFromIndex) || 0));
            if (startFromIndex > 0 && this.scriptHasInlineFieldVisual(scriptKey)) {
                try {
                    await this.restoreInlineFieldVisualState(scriptKey, startFromIndex);
                } catch (e) {
                    console.warn('[StoryManager] inline field visual resume failed:', e);
                }
            }

            overlay = document.getElementById('story-ui-overlay') || this.createStoryDOM();
            if (!overlay) throw new Error('会話UIを生成できませんでした。');
            overlay.style.display = 'flex';

            const portraitImg = document.getElementById('story-portrait');
            const nameBox = document.getElementById('story-name');
            const textBox = document.getElementById('story-text');
            const nextIndicator = document.getElementById('story-next-indicator');
            if (!portraitImg || !nameBox || !textBox || !nextIndicator) {
                throw new Error('会話UIの必須要素が不足しています。');
            }
            const textWindow = textBox.parentElement;
            if (textWindow && !textWindow.dataset.defaultStyle) {
                textWindow.dataset.defaultStyle = textWindow.getAttribute('style') || '';
            }

            for (let i = startFromIndex; i < lines.length; i++) {
                const line = lines[i];

                if (App.data) {
                    App.data.progress.activeConversation = { key: scriptKey, index: i };
                    App.save();
                }

                if (this.isInlineStoryCommand(line)) {
                    await this.runInlineStoryCommand(line);
                    // 命令の副作用と次カーソルを同じ保存へ確定する。
                    if (App.data?.progress) {
                        App.data.progress.activeConversation = { key: scriptKey, index: i + 1 };
                        App.save();
                    }
                    continue;
                }
                if (!line || typeof line.text !== 'string') continue;
                if (typeof AudioManager !== 'undefined') AudioManager.playSe?.('dialogue');

                const hasExplicitCharId = line.charId !== undefined && line.charId !== null;
                const isSystemLine = line.name === 'システム' && !hasExplicitCharId;
                const masterChar = hasExplicitCharId ? DB.CHARACTERS.find(c => c.id === line.charId) : null;
                const savedChar = hasExplicitCharId ? App.data.characters.find(c => c.charId === line.charId) : null;
                let displayName = isSystemLine ? '' : (savedChar ? savedChar.name : (masterChar ? masterChar.name : line.name));
                const portraitExpression = App.normalizeCharacterExpression?.(line.expression) || 'normal';
                const shouldShowPortrait = !isSystemLine && hasExplicitCharId && line.hidePortrait !== true;

                if (textWindow) {
                    if (isSystemLine) {
                        textWindow.style.cssText = `
                            position: absolute;
                            top: 45%;
                            left: 20px;
                            right: 20px;
                            background: rgba(0,0,0,0.72);
                            border: none;
                            border-radius: 2px;
                            padding: 12px 16px;
                            box-sizing: border-box;
                            height: 112px;
                            min-height: 112px;
                            max-height: 112px;
                            overflow: hidden;
                            box-shadow: none;
                            z-index: 10;
                        `;
                    } else if (textWindow.dataset.defaultStyle) {
                        textWindow.style.cssText = textWindow.dataset.defaultStyle;
                    }
                }
                nameBox.style.display = isSystemLine ? 'none' : 'block';

                const processedText = line.text.replace(/\[N:(\d+)\]/g, (match, id) => {
                    const targetId = parseInt(id);
                    const saved = App.data.characters.find(c => c.charId === targetId);
                    const master = DB.CHARACTERS.find(c => c.id === targetId);
                    return (saved ? saved.name : (master ? master.name : `ID:${id}`));
                }).replace(/\\n/g, '\n');

                this.backlog.push({ name: displayName, text: processedText.replace(/\n/g, ' ') });
                if (shouldShowPortrait) this.setConversationPortrait(portraitImg, line.charId, portraitExpression);
                else this.clearStoryPortrait();
                nameBox.innerText = displayName;
                nextIndicator.style.visibility = 'hidden';

                let isLineTyping = true;
                let skipTyping = false;
                overlay.onclick = (e) => {
                    if (!e.target.closest('.no-skip') && isLineTyping) skipTyping = true;
                };

                textBox.innerHTML = '';
                const chars = processedText.split('');
                for (let j = 0; j < chars.length; j++) {
                    if (skipTyping) {
                        textBox.innerHTML = processedText.replace(/\n/g, '<br>');
                        break;
                    }
                    const char = chars[j];
                    textBox.innerHTML += (char === '\n' ? '<br>' : char);
                    await new Promise(resolve => setTimeout(resolve, char === '\n' ? this.newlineWait : this.textSpeed));
                }
                isLineTyping = false;
                nextIndicator.style.visibility = 'visible';
                await new Promise(resolve => {
                    overlay.onclick = (e) => {
                        if (!e.target.closest('.no-skip')) resolve();
                    };
                });
                // 読了した行を再表示しないよう、次行カーソルを直ちに保存する。
                if (App.data?.progress) {
                    App.data.progress.activeConversation = { key: scriptKey, index: i + 1 };
                    App.save();
                }
            }

            completed = true;
            if (App.data?.progress) {
                delete App.data.progress.activeConversation;
                App.save();
            }
            return { status: 'completed', scriptKey };
        } catch (error) {
            console.error(`[StoryManager] conversation failed: ${scriptKey}`, error);
            // 会話DOMやインライン演出で例外が起きても、透明なオーバーレイや
            // 入力待ちを残さない。カーソルはfinallyで保持し、再読込後に再試行する。
            try { this.dismissChoiceUI({ hideOverlay: true }); } catch (_) {}
            try { this.clearStoryPortrait(); } catch (_) {}
            if (overlay) overlay.style.display = 'none';
            this.active = false;
            throw error;
        } finally {
            this.isTyping = false;
            if (overlay) overlay.onclick = null;
            // 失敗時はactiveConversationを残し、同じ行から再試行できるようにする。
            if (!completed && App.data?.progress?.activeConversation?.key !== scriptKey) {
                App.data.progress.activeConversation = { key: scriptKey, index: startFromIndex };
                try { App.save(); } catch (_) {}
            }
        }
    },

    /**
     * 会話UIを終了して隠す
     */
    endConversation: function() {
        this.dismissChoiceUI({ hideOverlay: false });
        this.clearStoryPortrait();
        const overlay = document.getElementById('story-ui-overlay');
        if (overlay) overlay.style.display = 'none';
        this.active = false;
        if (this.onComplete) {
            const cb = this.onComplete;
            this.onComplete = null;
            cb();
        }
    },

    /**
     * 会話ログ画面を表示する (復旧：オーバーレイ形式)
     */
    showBacklog: function() {
        // 既存のオーバーレイがあれば削除
        const old = document.getElementById('backlog-overlay');
        if (old) old.remove();

        const div = document.createElement('div');
        div.id = 'backlog-overlay';
        div.style.cssText = `
            position: fixed; top:0; left:0; width:100%; height:100%;
            background: rgba(0,0,20,0.95); z-index: 3000;
            display: flex; flex-direction: column; color: #fff; font-family: sans-serif;
        `;

        const list = this.backlog.map(b => `
            <div style="padding: 10px; border-bottom: 1px solid #333;">
                <div style="color: #ffd700; font-weight: bold; font-size: 12px;">${b.name}</div>
                <div style="font-size: 14px; margin-top: 4px;">${b.text}</div>
            </div>
        `).join('');

        div.innerHTML = `
            <div style="padding: 15px; background: #111; border-bottom: 2px solid #ffd700; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:bold; color:#ffd700;">会話ログ</span>
                <button onclick="document.getElementById('backlog-overlay').remove()" style="background:#444; color:#fff; border:none; padding:5px 15px; border-radius:4px; cursor:pointer;">閉じる</button>
            </div>
            <div style="flex:1; overflow-y:auto; padding: 10px;">
                ${list || '<div style="text-align:center; color:#555; margin-top:50px;">会話履歴はありません。</div>'}
            </div>
        `;
        document.body.appendChild(div);
    },
	
	// ==========================================
    // 6. UI構造の生成 (背面立ち絵・50%位置維持)
    // ==========================================
    createStoryDOM: function() {
        // 重複生成を完全に防止
        let div = document.getElementById('story-ui-overlay');
        if (div) return div;

		div = document.createElement('div');
		div.id = 'story-ui-overlay';
		
		// ==========================================
		// 1. 画面全体を覆うベースレイヤーの設定
		// ==========================================
		div.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.4); /* 背景の暗さ(0.0〜1.0) */
			z-index: 2000;                  /* 他のUIより手前に表示 */
			display: none;                  /* 初期状態は非表示 */
			flex-direction: column;
			justify-content: flex-start;    /* 配置の基準を上端にする */
			cursor: pointer;
			font-family: sans-serif;

			/* モバイル向け最適化 */
			-webkit-tap-highlight-color: transparent; /* タップ時の青い枠を消す */
			user-select: none;                         /* テキスト選択を禁止 */
			touch-action: manipulation;                /* ダブルタップズーム防止 */
		`;

		div.innerHTML = `
			<button class="no-skip" onclick="StoryManager.showBacklog()" style="
				position: absolute; 
				top: 20px; 
				right: 20px; 
				z-index: 2100;
				background: rgba(0,0,30,0.8); 
				border: 1px solid #ffd700; 
				color: #ffd700;
				padding: 8px 15px; 
				border-radius: 4px; 
				font-weight: bold; 
				cursor: pointer;
				font-size: 12px; 
				box-shadow: 0 2px 10px rgba(0,0,0,0.5);
			">LOG</button>

			<div class="story-ui-stage" style="
				position: relative;
				width: 100%;
				height: 100%;
				box-sizing: border-box;
			">
				
				<div class="story-portrait-frame" style="
					position: absolute;
					top: 45%;         /* 画面の中央（50%）を起点とする */
					left: 40px;       /* 画面左端からの距離 */
					width: 150px;     /* キャラ画像の最大幅 */
					height: 200px;    /* 画像エリアの高さ */
					display: flex;
					align-items: flex-end; 
					transform: translateY(-100%); /* 起点(50%)から「上」に向かって画像を表示 */
					z-index: 5;       /* 吹き出し(z-index:10)より背面に配置 */
				">
					<img id="story-portrait" style="
						max-width: 100%;
						max-height: 100%;
						object-fit: contain;
						filter: drop-shadow(0 0 10px rgba(0,0,0,0.8));
					">
				</div>
				
				<div class="story-text-window" style="
					position: absolute;
					top: 45%;                  /* 吹き出しの上端を画面の50%位置に設定 */
					left: 20px;
					right: 20px;
					background: rgba(0,0,30,0.95); 
					border: 2px solid #ffd700; 
					border-radius: 8px;           
					padding: 15px;
					box-sizing: border-box;
					height: 148px;                /* 話者名 + 本文3行 + 送り表示を基準に固定 */
					min-height: 148px;            
					max-height: 148px;            
					overflow: hidden;             
					box-shadow: 0 4px 15px rgba(0,0,0,0.5); 
					z-index: 10;               /* キャラ画像より前面に表示 */
				">
					<div id="story-name" style="
						color: #ffd700;
						font-weight: bold;
						font-size: 14px;
						margin-bottom: 8px;
						border-bottom: 1px solid #444;
						padding-bottom: 4px;
					"></div>

					<div id="story-text" style="
						color: #fff;
						font-size: 13px;
						line-height: 1.6;
						height: 4.8em;               /* 1.6em × 3行 */
						min-height: 4.8em;
						max-height: 4.8em;
						overflow-y: auto;
						letter-spacing: 0.5px;
					"></div>

					<div id="story-next-indicator" style="
						text-align: center;
						color: #ffd700;
						font-size: 10px;
						margin-top: 5px;
						animation: none;
					">▼</div>
				</div>
			</div>
`;

		(document.getElementById('game-container') || document.body).appendChild(div);
		return div;
	}
};

if (typeof window !== "undefined") {
    window.StoryManager = StoryManager;
}
