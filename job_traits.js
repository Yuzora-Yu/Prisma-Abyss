/* job_traits.js - current-job traits: persistent derived stats + battle effects (approved draft 2026-08-16) */
(() => {
    'use strict';

    const clamp = (v, min, max) => Math.max(min, Math.min(max, Number(v) || 0));
    const pct = value => 1 + Number(value || 0) / 100;
    const sourceOf = unit => unit?.originData || unit || null;
    const jobDefOf = unit => {
        const source = sourceOf(unit);
        if (!source || source.isMonsterAlly === true) return null;
        return window.JobData?.getById?.(source.jobId) || window.JobData?.getByName?.(source.job) || null;
    };
    const jobIdOf = unit => Number(jobDefOf(unit)?.id || 0);
    const isJob = (unit, id) => jobIdOf(unit) === Number(id);
    const effectiveLevel = unit => {
        const source = sourceOf(unit);
        return Math.max(1, Math.floor(Number(source?.level || unit?.level || 1))) +
            Math.max(0, Math.floor(Number(source?.reincarnationCount || 0))) * 100;
    };
    const unitKey = unit => String(unit?.uid || unit?.battleUnitId || unit?.charId || unit?.name || 'unknown');
    const battleData = () => (typeof App !== 'undefined' ? App.data?.battle : null);
    const runtimeRoot = () => {
        const battle = battleData();
        if (!battle) return {};
        if (!battle.jobTraitRuntime || typeof battle.jobTraitRuntime !== 'object' || Array.isArray(battle.jobTraitRuntime)) battle.jobTraitRuntime = {};
        return battle.jobTraitRuntime;
    };
    const runtime = unit => {
        const root = runtimeRoot();
        const key = unitKey(unit);
        if (!root[key] || typeof root[key] !== 'object') root[key] = {};
        return root[key];
    };
    const ensureJobStatus = unit => {
        if (!unit) return {};
        unit.battleStatus = unit.battleStatus || { buffs:{}, debuffs:{}, ailments:{} };
        unit.battleStatus.jobTraits = unit.battleStatus.jobTraits || {};
        return unit.battleStatus.jobTraits;
    };
    const currentTurn = () => Math.max(0, Number(battleData()?.turnNumber || 0));
    const maxHp = unit => Math.max(1, Number(unit?.baseMaxHp || unit?.maxHp || unit?.getStat?.('maxHp') || 1));
    const maxMp = unit => Math.max(0, Number(unit?.baseMaxMp || unit?.maxMp || unit?.getStat?.('maxMp') || 0));
    const alive = (Battle, unit) => Battle?.isBattleAlive ? Battle.isBattleAlive(unit) : !!unit && !unit.isDead && !unit.isFled && Number(unit.hp || 0) > 0;
    const statKeys = ['atk','def','mag','mdef','spd'];

    const DEFINITIONS = Object.freeze({
        1:{id:1,name:'精神集中',summary:'ぼうぎょした次のターン、最終与ダメージが大きく上昇する。'},
        2:{id:2,name:'加護',summary:'回復スキルのMP消費を減らし、強化スキルを1ターン延長する。'},
        3:{id:3,name:'魔素吸収',summary:'敵を倒すとMPを回復し、MPが少ないほど与ダメージが上昇する。'},
        4:{id:4,name:'連撃の型',summary:'連続ヒット数に応じて会心率と会心ダメージが上昇する。'},
        5:{id:5,name:'先読み',summary:'敵の攻撃を回避すると通常攻撃で反撃し、特殊な弱体を付与する。'},
        6:{id:6,name:'舞の余韻',summary:'行動時、一定確率で味方全体強化か敵全体弱体が追加発動する。'},
        7:{id:7,name:'魔装剣',summary:'物理攻撃と魔法攻撃を交互に使うほど与ダメージが上昇する。'},
        8:{id:8,name:'深慮',summary:'全スキルのMP消費を減らし、MPが高いほど与ダメージが上昇する。'},
        9:{id:9,name:'残心',summary:'頭・体・足の未装備数に応じて与ダメージ・回避率・会心率が常時上昇する。'},
        10:{id:10,name:'闘争心',summary:'ダメージを受けるたびに与ダメージが上昇する。'},
        11:{id:11,name:'ボルテージ',summary:'生存ターン数に応じて味方全体の与ダメージが上昇する。'},
        12:{id:12,name:'星巡り',summary:'毎ターン終了時、偶数ターンは味方支援、奇数ターンは敵妨害が必ず発生する。'},
        13:{id:13,name:'聖気循環',summary:'物理特技でMPと同量のHPも消費し、その量に応じて与ダメージが上昇する。'},
        14:{id:14,name:'守護誓約',summary:'生存中、味方全体の被ダメージを減少させる。'},
        15:{id:15,name:'必殺',summary:'ぼうぎょした次のターン、必ず会心になり会心ダメージも上昇する。'},
        16:{id:16,name:'魔導弦',summary:'戦闘時に攻撃力の半分を魔力へ加え、魔法攻撃時に味方全体を小回復する。'},
        17:{id:17,name:'霊脈破壊',summary:'同じ敵へ物理と魔法を交互に当てると、その敵の被ダメージが上昇する。'},
        18:{id:18,name:'影走り',summary:'道具効果が増加し、仲間生存中は敵の単体指定攻撃の対象にならない。'},
        19:{id:19,name:'竜脈',summary:'HPが高いほど全体攻撃、低いほど単体攻撃の与ダメージが上昇する。'},
        20:{id:20,name:'慈愛',summary:'ぼうぎょ時、味方全体のHP/MPを回復し、独立枠の強化を付与する。'},
        21:{id:21,name:'覇気',summary:'生存中、敵行動を止め、その敵の被ダメージを一時的に増やすことがある。'},
        22:{id:22,name:'神託',summary:'生存中に味方を確率で完全蘇生し、攻撃時は対象の光耐性を-100%として扱う。'},
        23:{id:23,name:'希望',summary:'生存中は他の味方を強化し、味方が倒れるほど自身の能力が上昇する。'}
    });

    const getDefinition = unitOrId => {
        if (Number.isFinite(Number(unitOrId))) return DEFINITIONS[Number(unitOrId)] || null;
        return DEFINITIONS[jobIdOf(unitOrId)] || null;
    };

    const getMpCostMultiplier = (actor, skill) => {
        const eff = effectiveLevel(actor);
        if (isJob(actor, 2) && ['回復','蘇生','MP回復'].includes(String(skill?.type || ''))) {
            return 1 - clamp(10 + eff / 5, 0, 50) / 100;
        }
        if (isJob(actor, 8)) return 1 - clamp(10 + eff / 5, 0, 50) / 100;
        return 1;
    };

    const adjustEffectTurns = (actor, data, turns, kind = 'effect') => {
        if (isJob(actor, 2) && data?.type === '強化' && kind === 'buff') return Math.max(1, Number(turns || 0) + 1);
        return turns;
    };

    const getMissingSamuraiArmorSlots = actor => {
        if (!isJob(actor, 9)) return 0;
        const equips = sourceOf(actor)?.equips || actor?.equips || {};
        const slotAliases = [
            ['頭','兜','帽子','head'],
            ['体','鎧','ローブ','body','Armor'],
            ['足','ブーツ','くつ','legs','Feet']
        ];
        return slotAliases.reduce((sum, aliases) => sum + (aliases.some(key => equips[key]) ? 0 : 1), 0);
    };

    // 戦闘外でも常に成立する職業特性は、App.calcStats() からこの入口を通す。
    // 戦闘インスタンス側で同じ補正を重ねないこと。
    const adjustPersistentStat = (actor, key, value) => {
        if (!actor || typeof value === 'undefined' || value === null) return value;
        let val = value;
        if (typeof val === 'number' && isJob(actor, 9)) {
            const missing = getMissingSamuraiArmorSlots(actor);
            if (key === 'eva') val += missing * 15;
            if (key === 'cri') val += missing * 10;
        }
        return val;
    };

    const strongestAliveTraitSource = (Battle, jobId, exclude = null) => {
        const party = (Battle?.party || []).filter(unit => unit !== exclude && alive(Battle, unit) && isJob(unit, jobId));
        if (!party.length) return null;
        return party.sort((a,b) => effectiveLevel(b) - effectiveLevel(a))[0];
    };

    const adjustBattleStat = (Battle, actor, key, value) => {
        if (!actor || typeof value === 'undefined' || value === null) return value;
        let val = value;
        if (typeof val === 'number') {
            if (isJob(actor, 16) && key === 'mag') {
                const battleAtk = Number(Battle?.getBattleStat?.(actor, 'atk') ?? actor.atk ?? sourceOf(actor)?.atk ?? 0);
                val += Math.floor(battleAtk * 0.5);
            }
            const saint = ensureJobStatus(actor)?.saintessBuff;
            if (saint?.turns > 0 && saint.stats?.[key]) val = Math.floor(val * 1.2);

            if ((Battle?.party || []).includes(actor)) {
                const hero = strongestAliveTraitSource(Battle, 23, actor);
                if (hero && statKeys.includes(key)) {
                    const boost = clamp(10 + effectiveLevel(hero) / 10, 0, 30);
                    val = Math.floor(val * pct(boost));
                }
                if (isJob(actor, 23) && statKeys.includes(key)) {
                    const ownBoost = clamp(Number(runtime(actor).heroDeathStacks || 0) * 10, 0, 100);
                    val = Math.floor(val * pct(ownBoost));
                }
            }
        } else if (key === 'elmRes' && val && typeof val === 'object') {
            const saint = ensureJobStatus(actor)?.saintessBuff;
            if (saint?.turns > 0 && saint.elementRes === true) {
                val = { ...val };
                ['火','水','風','雷','光','闇','混沌'].forEach(elm => { val[elm] = Number(val[elm] || 0) + 20; });
            }
        }
        return val;
    };

    const actionType = (data, cmd = null) => {
        if (cmd?.type === 'attack' || cmd?.type === 'enemy_attack') return 'physical';
        const type = String(data?.type || '');
        if (type === '物理' || type === '通常攻撃') return 'physical';
        if (type === '魔法') return 'magic';
        return null;
    };

    const outgoingMultiplier = (Battle, ctx) => {
        const { actor, data, cmd, isPhysical, effectType } = ctx || {};
        if (!actor) return 1;
        let mult = 1;
        const eff = effectiveLevel(actor);
        const state = runtime(actor);
        const turn = currentTurn();
        if (isJob(actor,1) && Number(state.warriorReadyTurn) === turn) mult *= pct(clamp(100 + eff, 0, 300));
        if (isJob(actor,3)) {
            const ratio = clamp(Number(actor.mp || 0) / Math.max(1, maxMp(actor)), 0, 1);
            mult *= 1 + (1 - ratio) / 2;
        }
        if (isJob(actor,7)) mult *= pct(clamp(Number(state.magicKnightStack || 0) * 5, 0, 50));
        if (isJob(actor,8)) {
            const ratio = clamp(Number(actor.mp || 0) / Math.max(1, maxMp(actor)), 0, 1);
            mult *= 1 + ratio / 2;
        }
        if (isJob(actor,9)) mult *= pct(getMissingSamuraiArmorSlots(actor) * 25);
        if (isJob(actor,10)) mult *= pct(clamp(Number(state.gladiatorHitsTaken || 0) * 2, 0, 100));
        if ((Battle?.party || []).includes(actor)) {
            const entertainer = strongestAliveTraitSource(Battle, 11);
            if (entertainer) mult *= pct(clamp(Number(runtime(entertainer).survivalTurns || 0) * 5, 0, 100));
        }
        if (isJob(actor,13) && Number(ctx.holyFistHpCost || 0) > 0 && isPhysical) {
            mult *= pct(clamp(Number(ctx.holyFistHpCost) / 2, 0, 1000));
        }
        if (isJob(actor,19)) {
            const ratio = clamp(Number(actor.hp || 0) / maxHp(actor), 0, 1);
            const scope = String(cmd?.targetScope || data?.target || '単体');
            if (scope === '全体') mult *= 1 + ratio / 2;
            else {
                const bonus = clamp(999 * Math.pow(1 - ratio, 3), 0, 999);
                mult *= pct(bonus);
            }
        }
        return mult;
    };

    const incomingMultiplier = (Battle, target) => {
        if (!target) return 1;
        let mult = 1;
        const status = ensureJobStatus(target);
        const lightBreaks = status.lightBreaks || {};
        const breakPct = clamp(Object.values(lightBreaks).reduce((sum, entry) => sum + Number(entry?.pct || 0), 0), 0, 50);
        if (breakPct > 0) mult *= pct(breakPct);
        if (Number(status.demonKingVulnerability?.turns || 0) > 0) mult *= 1.2;
        if ((Battle?.party || []).includes(target)) {
            const paladin = strongestAliveTraitSource(Battle, 14);
            if (paladin) {
                const reduction = clamp(10 + effectiveLevel(paladin) / 10, 0, 30);
                mult *= Math.max(0, 1 - reduction / 100);
            }
        }
        return mult;
    };

    const adjustFinalDamage = (Battle, ctx, damage) => {
        if (!Number.isFinite(Number(damage)) || Number(damage) <= 0) return Math.max(0, Number(damage) || 0);
        let result = Number(damage);
        result *= outgoingMultiplier(Battle, ctx);
        result *= incomingMultiplier(Battle, ctx?.target);
        return Math.max(0, Math.floor(result));
    };

    const overrideElementResistance = (actor, target, element, resistance) => {
        if (isJob(actor,22) && element === '光') return -100;
        return resistance;
    };

    const getCritBonus = actor => isJob(actor,4) ? clamp(Number(runtime(actor).monkCombo || 0) * 2, 0, 50) : 0;
    const forceCritical = (actor, isPhysical = true) => !!isPhysical && isJob(actor,15) && Number(runtime(actor).hunterReadyTurn) === currentTurn();
    const criticalDamageMultiplier = (actor, isPhysical = true) => {
        let mult = 1;
        if (isJob(actor,4)) mult *= pct(clamp(Number(runtime(actor).monkCombo || 0) * 4, 0, 200));
        if (isPhysical && isJob(actor,15) && Number(runtime(actor).hunterReadyTurn) === currentTurn()) {
            mult *= pct(clamp(50 + effectiveLevel(actor) / 4, 0, 100));
        }
        return mult;
    };

    const onDefend = (Battle, actor) => {
        const nextTurn = currentTurn() + 1;
        if (isJob(actor,1)) runtime(actor).warriorReadyTurn = nextTurn;
        if (isJob(actor,15)) runtime(actor).hunterReadyTurn = nextTurn;
        if (isJob(actor,20)) {
            const upper = clamp(20 + effectiveLevel(actor) / 20, 0, 30);
            const party = (Battle?.party || []).filter(unit => alive(Battle, unit));
            party.forEach(unit => {
                const rate = Math.random() * upper / 100;
                const hpRec = Math.floor(maxHp(unit) * rate);
                const mpRec = Math.floor(maxMp(unit) * rate);
                if (hpRec > 0) unit.hp = Math.min(maxHp(unit), Number(unit.hp || 0) + hpRec);
                if (mpRec > 0) unit.mp = Math.min(maxMp(unit), Number(unit.mp || 0) + mpRec);
                const status = ensureJobStatus(unit);
                const buff = status.saintessBuff || { turns:4, stats:{}, elementRes:false };
                buff.turns = Math.max(Number(buff.turns || 0), 4);
                statKeys.forEach(key => { if (Math.random() < 0.5) buff.stats[key] = true; });
                if (Math.random() < 0.5) buff.elementRes = true;
                status.saintessBuff = buff;
            });
            Battle?.playRecoverySe?.();
            Battle?.log?.(`${actor.name}の慈愛が仲間を包んだ！`);
        }
    };

    const chooseAutoAction = (Battle, actor) => {
        if (!actor || !alive(Battle, actor)) return null;
        const state = runtime(actor);
        const turn = currentTurn();
        if (isJob(actor,1) && Number(state.warriorReadyTurn) !== turn && Math.random() < 0.20) return { type:'defend', actor, isAuto:true };
        if (isJob(actor,15) && Number(state.hunterReadyTurn) !== turn && Math.random() < 0.25) return { type:'defend', actor, isAuto:true };
        if (isJob(actor,20)) {
            const party = (Battle?.party || []).filter(unit => alive(Battle, unit));
            const need = party.some(unit => Number(unit.hp || 0) / maxHp(unit) < 0.70 || (maxMp(unit) > 0 && Number(unit.mp || 0) / maxMp(unit) < 0.45));
            if (Math.random() < (need ? 0.55 : 0.15)) return { type:'defend', actor, isAuto:true };
        }
        return null;
    };

    const canPayHolyFistCost = (actor, skill, mpCost) => {
        if (!isJob(actor,13) || String(skill?.type || '') !== '物理') return true;
        const hpCost = Math.max(0, Number(mpCost || 0));
        return hpCost === 0 || Number(actor.hp || 0) > hpCost;
    };

    const spendHolyFistHp = (actor, skill, mpCost) => {
        if (!isJob(actor,13) || String(skill?.type || '') !== '物理') return 0;
        const hpCost = Math.max(0, Number(mpCost || 0));
        if (hpCost <= 0 || Number(actor.hp || 0) <= hpCost) return 0;
        actor.hp -= hpCost;
        return hpCost;
    };

    const filterEnemySingleTargetCandidates = (Battle, candidates) => {
        const list = (candidates || []).filter(Boolean);
        const visible = list.filter(unit => {
            if (!isJob(unit,18)) return true;
            return !list.some(other => other !== unit && alive(Battle, other));
        });
        return visible.length ? visible : list;
    };

    const applyScoutDebuff = (Battle, target) => {
        if (!target || !alive(Battle,target)) return;
        target.battleStatus = target.battleStatus || {buffs:{},debuffs:{},ailments:{}};
        target.battleStatus.buffs ||= {}; target.battleStatus.debuffs ||= {}; target.battleStatus.ailments ||= {};
        const options = ['Poison','ToxicPoison','Shock','Fear','allStats','elmRes'];
        const chosen = options[Math.floor(Math.random() * options.length)];
        if (chosen === 'allStats') {
            statKeys.forEach(key => { target.battleStatus.debuffs[key] = { val:0.8, turns:4 }; });
            Battle?.log?.(`${target.name}の全能力が下がった！`);
        } else if (chosen === 'elmRes') {
            target.battleStatus.debuffs.elmResDown = { val:20, turns:4 };
            Battle?.log?.(`${target.name}の全属性耐性が下がった！`);
        } else {
            target.battleStatus.ailments[chosen] = { turns:4, chance: chosen === 'Fear' ? 0.5 : null };
            const names = {Poison:'毒',ToxicPoison:'猛毒',Shock:'感電',Fear:'怯え'};
            Battle?.log?.(`${target.name}は${names[chosen]}を受けた！`);
        }
    };

    const onEvadedAttack = async (Battle, defender, attacker, cmd) => {
        if (!isJob(defender,5) || !cmd?.isEnemy || cmd?.isReaction || !alive(Battle,defender) || !alive(Battle,attacker)) return;
        Battle?.log?.(`${defender.name}は攻撃を読み切った！`);
        await Battle.executeReactionAttack(defender, attacker);
        if (alive(Battle,attacker)) applyScoutDebuff(Battle, attacker);
    };

    const onSuccessfulHit = (Battle, ctx) => {
        const { actor, target, data, cmd } = ctx || {};
        if (!actor || !target) return;
        if (isJob(actor,4)) runtime(actor).monkCombo = clamp(Number(runtime(actor).monkCombo || 0) + 1, 0, 999);
        if (isJob(actor,17) && !cmd?.isReaction && !cmd?.isJobTraitFollowup) {
            const type = actionType(data, cmd);
            if (type) {
                const status = ensureJobStatus(target);
                status.lightBreaks ||= {};
                const key = unitKey(actor);
                const entry = status.lightBreaks[key] || { pct:0, turns:null, lastType:null, lastActionToken:null };
                const token = String(cmd?.jobTraitActionToken || `${currentTurn()}-${data?.id || 'atk'}`);
                if (entry.lastActionToken !== token) {
                    const alternated = !!entry.lastType && entry.lastType !== type;
                    if (alternated) {
                        entry.pct = clamp(Number(entry.pct || 0) + 5, 0, 50);
                        entry.turns = 4;
                    }
                    entry.lastType = type;
                    entry.lastActionToken = token;
                    status.lightBreaks[key] = entry;
                }
            }
        }
    };

    const onMissedHit = actor => { if (isJob(actor,4)) runtime(actor).monkCombo = 0; };
    const onDamageTaken = (Battle, target, amount) => {
        if (!target || Number(amount || 0) <= 0) return;
        if (isJob(target,10)) runtime(target).gladiatorHitsTaken = clamp(Number(runtime(target).gladiatorHitsTaken || 0) + 1, 0, 9999);
    };
    const onKill = (Battle, actor, defeated) => {
        if (!actor || !defeated || !isJob(actor,3) || !Battle?.enemies?.includes(defeated)) return;
        const rate = clamp(5 + effectiveLevel(actor) / 20, 0, 15) / 100;
        const rec = Math.max(1, Math.floor(maxMp(actor) * rate));
        const before = Number(actor.mp || 0);
        actor.mp = Math.min(maxMp(actor), before + rec);
        const gained = actor.mp - before;
        if (gained > 0) Battle?.log?.(`${actor.name}は魔素を吸収し、MPを${gained}回復した！`);
    };

    const onActionStart = (actor, data, cmd) => {
        if (!isJob(actor,7) || cmd?.isReaction || cmd?.isJobTraitFollowup) return;
        const type = actionType(data, cmd);
        if (!type) return;
        const state = runtime(actor);
        const token = String(cmd?.jobTraitActionToken || `${currentTurn()}-${data?.id || cmd?.type || 'action'}`);
        if (state.magicKnightLastActionToken === token) return;
        if (state.magicKnightLastType && state.magicKnightLastType !== type) state.magicKnightStack = clamp(Number(state.magicKnightStack || 0) + 1, 0, 10);
        state.magicKnightLastType = type;
        state.magicKnightLastActionToken = token;
    };

    const healMagicArcherParty = (Battle, actor, data) => {
        if (!isJob(actor,16) || String(data?.type || '') !== '魔法') return;
        const upper = clamp(5 + effectiveLevel(actor) / 40, 0, 10);
        const rate = Math.random() * upper / 100;
        let any = false;
        (Battle?.party || []).filter(unit => alive(Battle,unit)).forEach(unit => {
            const rec = Math.floor(maxHp(unit) * rate);
            if (rec <= 0) return;
            const before = unit.hp;
            unit.hp = Math.min(maxHp(unit), Number(unit.hp || 0) + rec);
            any ||= unit.hp > before;
        });
        if (any) { Battle?.playRecoverySe?.(); Battle?.log?.(`${actor.name}の魔導弦が仲間の傷を癒した！`); }
    };

    const triggerDancerFollowup = async (Battle, actor, cmd) => {
        if (!isJob(actor,6) || cmd?.isReaction || cmd?.isJobTraitFollowup) return;
        const chance = clamp(10 + effectiveLevel(actor) / 20, 0, 20);
        if (Math.random() * 100 >= chance) return;
        const learnableIds = new Set();
        Object.values(window.JOB_SKILLS_DATA || {}).forEach(table => Object.values(table || {}).forEach(id => learnableIds.add(Number(id))));
        (window.DB?.CHARACTERS || window.CHARACTERS_DATA || []).forEach(char => Object.values(char?.lbSkills || {}).forEach(id => learnableIds.add(Number(id))));
        const pool = (window.DB?.SKILLS || window.SKILLS_DATA || []).filter(skill =>
            learnableIds.has(Number(skill?.id)) && skill?.target === '全体' && ['強化','弱体'].includes(skill?.type)
        );
        if (!pool.length) return;
        const skill = pool[Math.floor(Math.random() * pool.length)];
        const target = skill.type === '強化' ? 'all_ally' : 'all_enemy';
        Battle?.log?.(`${actor.name}の舞の余韻！ ${skill.name}が響いた！`);
        await Battle.processAction({ type:'skill', actor, data:skill, target, targetScope:'全体', isEnemy:false, isJobTraitFollowup:true });
    };

    const onActionComplete = async (Battle, actor, data, cmd) => {
        if (!actor || cmd?.isReaction || cmd?.isJobTraitFollowup) return;
        healMagicArcherParty(Battle, actor, data);
        await triggerDancerFollowup(Battle, actor, cmd);
    };

    const tryDemonKingSuppress = (Battle, enemy) => {
        const demon = strongestAliveTraitSource(Battle,21);
        if (!demon || !enemy || !Battle?.enemies?.includes(enemy)) return false;
        const chance = clamp(5 + effectiveLevel(demon) / 50, 0, 10);
        if (Math.random() * 100 >= chance) return false;
        const status = ensureJobStatus(enemy);
        // 発動した敵自身の行動は止まるため、次の1ターンを通して弱点が残るよう2で積み、同ラウンド末に1へ減衰させる。
        status.demonKingVulnerability = { pct:20, turns:2 };
        Battle?.log?.(`${enemy.name}は魔王の覇気に呑まれ、動けない！`);
        return true;
    };

    const onUnitDefeated = (Battle, unit) => {
        if (!unit || !Battle?.party?.includes(unit)) return false;
        const fallenState = runtime(unit);
        if (isJob(unit,1)) delete fallenState.warriorReadyTurn;
        if (isJob(unit,4)) fallenState.monkCombo = 0;
        if (isJob(unit,11)) fallenState.survivalTurns = 0;
        if (isJob(unit,15)) delete fallenState.hunterReadyTurn;
        (Battle.party || []).filter(hero => alive(Battle,hero) && hero !== unit && isJob(hero,23)).forEach(hero => {
            runtime(hero).heroDeathStacks = clamp(Number(runtime(hero).heroDeathStacks || 0) + 1, 0, 10);
        });
        const gods = (Battle.party || []).filter(god => god !== unit && alive(Battle,god) && isJob(god,22))
            .sort((a,b) => effectiveLevel(b) - effectiveLevel(a));
        for (const god of gods) {
            const state = runtime(god);
            if (Number(state.godRevivesUsed || 0) >= 3) continue;
            const chance = clamp(50 + effectiveLevel(god) / 5, 0, 100);
            if (Math.random() * 100 >= chance) continue;
            state.godRevivesUsed = Number(state.godRevivesUsed || 0) + 1;
            unit.isDead = false; unit.hasDiedThisTurn = false; unit.isFled = false;
            unit.hp = maxHp(unit); unit.mp = maxMp(unit);
            // 死亡で通常の強化・弱体・状態異常・聖女の一時強化をいったん解く。
            unit.battleStatus = { buffs:{}, debuffs:{}, ailments:{}, jobTraits:{} };
            Battle?.applyPersistentBattlePassives?.(unit);
            Battle?.playRecoverySe?.();
            Battle?.log?.(`${god.name}の神託！ ${unit.name}は完全に蘇った！`);
            return true;
        }
        return false;
    };

    const getItemEffectMultiplier = actor => {
        if (!isJob(actor,18)) return 1;
        return pct(clamp(50 + effectiveLevel(actor), 0, 200));
    };

    const decayJobStatuses = (Battle, unit) => {
        const status = ensureJobStatus(unit);
        if (status.saintessBuff?.turns > 0) {
            status.saintessBuff.turns--;
            if (status.saintessBuff.turns <= 0) delete status.saintessBuff;
        }
        if (status.demonKingVulnerability?.turns > 0) {
            status.demonKingVulnerability.turns--;
            if (status.demonKingVulnerability.turns <= 0) delete status.demonKingVulnerability;
        }
        if (status.lightBreaks) {
            Object.keys(status.lightBreaks).forEach(key => {
                const entry = status.lightBreaks[key];
                if (entry?.turns > 0) entry.turns--;
                if (!entry || entry.turns <= 0) delete status.lightBreaks[key];
            });
        }
    };

    const applyStarTurn = (Battle, star, turn) => {
        if (!star || !alive(Battle,star)) return;
        if (turn % 2 === 0) {
            const choice = Math.floor(Math.random() * 3);
            const party = (Battle.party || []).filter(unit => alive(Battle,unit));
            if (choice === 0) {
                party.forEach(unit => { unit.hp = Math.min(maxHp(unit), Number(unit.hp || 0) + Math.max(1, Math.floor(maxHp(unit) * 0.10))); });
                Battle.playRecoverySe?.(); Battle.log?.(`${star.name}の星巡り――生命の星が瞬いた！`);
            } else if (choice === 1) {
                party.forEach(unit => { unit.mp = Math.min(maxMp(unit), Number(unit.mp || 0) + Math.max(1, Math.floor(maxMp(unit) * 0.10))); });
                Battle.log?.(`${star.name}の星巡り――魔力の星が巡った！`);
            } else {
                const key = statKeys[Math.floor(Math.random() * statKeys.length)];
                party.forEach(unit => {
                    unit.battleStatus ||= {buffs:{},debuffs:{},ailments:{}}; unit.battleStatus.buffs ||= {};
                    unit.battleStatus.buffs[key] = { val:Math.max(Number(unit.battleStatus.buffs[key]?.val || 1),1.2), turns:3 };
                });
                Battle.log?.(`${star.name}の星巡り――味方を星の加護が包んだ！`);
            }
        } else {
            const enemies = (Battle.enemies || []).filter(unit => alive(Battle,unit));
            if (!enemies.length) return;
            if (Math.random() < 0.5) {
                const elements = ['火','水','風','雷','光','闇'];
                const elm = elements[Math.floor(Math.random() * elements.length)];
                enemies.forEach(enemy => {
                    const res = Number((Battle.getBattleStat?.(enemy,'elmRes') || enemy.elmRes || {})[elm] || 0);
                    const raw = Math.max(1, Math.floor((Number(star.mag || 0) * 0.75) + effectiveLevel(star) * 3));
                    const dmg = Math.max(1, Math.floor(raw * (1 - clamp(res,-100,100)/100)));
                    const before = enemy.hp; enemy.hp -= dmg;
                    Battle.log?.(`${enemy.name}に星光が降り、${dmg}の${elm}属性ダメージ！`);
                    if (enemy.hp <= 0 && !Battle.tryGutsSurvive?.(enemy,before)) Battle.markDefeated?.(enemy);
                });
            } else {
                const key = statKeys[Math.floor(Math.random() * statKeys.length)];
                enemies.forEach(enemy => {
                    enemy.battleStatus ||= {buffs:{},debuffs:{},ailments:{}}; enemy.battleStatus.debuffs ||= {};
                    enemy.battleStatus.debuffs[key] = { val:Math.min(Number(enemy.battleStatus.debuffs[key]?.val || 1),0.8), turns:3 };
                });
                Battle.log?.(`${star.name}の星巡り――凶星が敵の力を奪った！`);
            }
        }
    };

    const onEndOfRound = async Battle => {
        const turn = currentTurn();
        [...(Battle?.party || []), ...(Battle?.enemies || [])].forEach(unit => decayJobStatuses(Battle,unit));
        (Battle?.party || []).filter(unit => alive(Battle,unit) && isJob(unit,11)).forEach(unit => {
            runtime(unit).survivalTurns = clamp(Number(runtime(unit).survivalTurns || 0) + 1, 0, 20);
        });
        const star = strongestAliveTraitSource(Battle,12);
        if (star) applyStarTurn(Battle,star,turn);
        const root = runtimeRoot();
        Object.values(root).forEach(state => {
            if (Number(state.warriorReadyTurn) < turn + 1) delete state.warriorReadyTurn;
            if (Number(state.hunterReadyTurn) < turn + 1) delete state.hunterReadyTurn;
        });
    };

    window.JOB_TRAIT_DATA = DEFINITIONS;
    window.JobTraits = Object.freeze({
        definitions:DEFINITIONS, getDefinition, jobIdOf, isJob, effectiveLevel,
        getMpCostMultiplier, adjustEffectTurns, adjustPersistentStat, adjustBattleStat,
        outgoingMultiplier, incomingMultiplier, adjustFinalDamage, overrideElementResistance,
        getCritBonus, forceCritical, criticalDamageMultiplier,
        onActionStart, onDefend, chooseAutoAction, canPayHolyFistCost, spendHolyFistHp,
        filterEnemySingleTargetCandidates, onEvadedAttack, onSuccessfulHit, onMissedHit,
        onDamageTaken, onKill, onActionComplete, tryDemonKingSuppress, onUnitDefeated,
        getItemEffectMultiplier, onEndOfRound
    });
})();
