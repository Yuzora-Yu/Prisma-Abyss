'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '../../..');
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const deepEq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function evalConst(rel, constName) {
    const source = `${read(rel)}\n;globalThis.__VALUE__=${constName};`;
    const ctx = { console, window: undefined };
    ctx.globalThis = ctx;
    vm.createContext(ctx);
    vm.runInContext(source, ctx, { timeout: 5000, filename: rel });
    return ctx.__VALUE__;
}

const story = evalConst('story.js', 'STORY_MANAGER_DATA');
const maps = evalConst('map.js', 'FIXED_DUNGEON_MAPS');
const trap = story.events.light_palace_flashback_hexagram_trap;
assert(trap && Array.isArray(trap.actions), 'flashback trap event missing');

// Phase13で出現演出・永続化命令が前置されたため、旧action index固定ではなく
// 意味順序を検証する。ルーナ離脱 -> レイラ単独編成は隣接順序を維持する。
const removeIndex = trap.actions.findIndex(action => action.type === 'SCENE_REMOVE_ALLY' && Number(action.value) === 401);
const partyIndex = trap.actions.findIndex(action => action.type === 'SCENE_PARTY' && deepEq(action.party, [{ charId:204 }]));
assert(removeIndex >= 0, 'SCENE_REMOVE_ALLY must atomically remove Luna inside Scene Context');
assert(partyIndex === removeIndex + 1, 'Layla-only SCENE_PARTY must immediately follow Luna removal');
assert(!trap.actions.some(action => action.type === 'RESET_TEMP_ALLY'),
    'normal-world RESET_TEMP_ALLY must not be used for Luna flashback removal');

const spawn1 = (trap.actions.find(action => action.type === 'FIELD_CUTSCENE'
    && (action.commands || []).some(cmd => cmd.op === 'DARK_TELEPORT' && cmd.id === 'flashback-jasper'))?.commands || []);
const jasperFlash = spawn1.find(cmd => cmd.op === 'SCREEN_FLASH');
const jasperFx = spawn1.find(cmd => cmd.op === 'PLAY_EFFECT' && cmd.id === 'flashback-jasper-vortex');
const jasperSprite = spawn1.find(cmd => cmd.op === 'DARK_TELEPORT' && cmd.id === 'flashback-jasper');
assert(jasperFlash, 'Jasper spawn must include one screen flash');
assert(jasperFx?.src === 'assets/effect/fx-abyss-vortex-ai.png', 'Jasper vortex effect missing');
assert(Number(jasperFx?.dx) === 3 && Number(jasperFx?.dy) === -4 && Number(jasperFx?.size) === 4.2,
    'Jasper must spawn 3 east / 4 north of Layla with 2x vortex');
assert(Number(jasperSprite?.dx) === 3 && Number(jasperSprite?.dy) === -4,
    'Jasper monster sprite position mismatch');

const veldSpawn = (trap.actions.find(action => action.type === 'FIELD_CUTSCENE'
    && (action.commands || []).some(cmd => cmd.op === 'DARK_TELEPORT' && cmd.id === 'flashback-veld'))?.commands || []);
const veldFlash = veldSpawn.find(cmd => cmd.op === 'SCREEN_FLASH');
const veldFx = veldSpawn.find(cmd => cmd.op === 'PLAY_EFFECT' && cmd.id === 'flashback-veld-vortex');
const veldSprite = veldSpawn.find(cmd => cmd.op === 'DARK_TELEPORT' && cmd.id === 'flashback-veld');
assert(veldFlash, 'Veld spawn must include one screen flash');
assert(veldFx?.src === 'assets/effect/fx-abyss-vortex-ai.png' && Number(veldFx?.size) === 4.2,
    'Veld vortex effect missing');
assert(Number(veldSprite?.dy) === -2, 'Veld must appear 2 tiles north after Layla steps north');

for (const eventId of ['light_palace_flashback_hexagram_trap', 'light_palace_flashback_exit_veld']) {
    const boss = story.events[eventId].actions.find(action => action.type === 'BOSS');
    assert(boss && Number(boss.hpFloor) === 1, `${eventId}: HP floor must be 1`);
    assert(Number(boss.finisherAfterTurns) === 5, `${eventId}: finisher turn condition must be 5`);
    assert(boss.finisherAtHpFloor === true, `${eventId}: HP1 finisher condition missing`);
    assert(boss.finisherConversation === 'LIGHT_PALACE_FLASHBACK_VELD_FINISHER', `${eventId}: finisher conversation missing`);
    assert(boss.finisherSkillName === '黒白の葬閃', `${eventId}: finisher skill name mismatch`);
    assert(Number(boss.finisherDamage) === 9999, `${eventId}: finisher damage must be 9999`);
}
assert(Array.isArray(story.scripts.LIGHT_PALACE_FLASHBACK_VELD_FINISHER) && story.scripts.LIGHT_PALACE_FLASHBACK_VELD_FINISHER.length >= 2,
    'finisher conversation script missing');

const escapeScript = story.scripts.LIGHT_PALACE_FLASHBACK_ESCAPE_END || [];
const claudeLine = escapeScript.findIndex(entry => entry.charId === 304 && String(entry.text || '').includes('レオン'));
assert(claudeLine > 0, 'Claude exit line missing');
const push = escapeScript[claudeLine - 1]?.commands || [];
const asyncExit = push.find(cmd => cmd.op === 'START_MOVE_SPRITE' && cmd.id === 'flashback-exit-claude');
assert(asyncExit && Number(asyncExit.y) >= 31 && Number(asyncExit.duration) >= 1500 && Number(asyncExit.duration) <= 2000,
    'Claude must leave at a brisk Veld-like speed while dialogue is shown');
assert(asyncExit.removeAfter === true, 'Claude sprite must be removed after off-map exit');
const leonBob = push.filter(cmd => cmd.op === 'MOVE_SPRITE' && cmd.id === 'flashback-exit-leon' && Number(cmd.x) === 18 && Number(cmd.y) > 23.9 && Number(cmd.y) < 24.2);
assert(leonBob.length >= 4, 'Leon push animation must include short vertical bobbing');

const light = maps.LIGHT_PALACE;
const f3 = light?.floors?.[2];
const trapTile = (f3?.tileEffects || []).find(effect => effect.eventId === 'light_palace_flashback_hexagram_trap');
const wrongWay = (f3?.tileEffects || []).find(effect => effect.eventId === 'light_palace_flashback_wrong_way');
assert(trapTile && deepEq(trapTile.rect, { x1:16, y1:20, x2:18, y2:20 }), 'seal trigger must remain X16-18/Y20');
assert(wrongWay && deepEq(wrongWay.rect, { x1:16, y1:19, x2:18, y2:19 }), 'wrong-way trigger must remain X16-18/Y19');

const main = read('main.js');
assert(main.includes('ensureActiveSceneContext: async () =>'), 'Scene Context resume guard missing');
assert(main.includes('App.restoreSceneContextResumeMetadata?.()'), 'resume metadata must be restored before legacy fallback');
assert(main.includes('removeSceneContextAlly: (charId, options = {}) =>'), 'isolated-scene ally removal helper missing');
assert(main.includes('App.data.party = App.data.party.map(slot =>'), 'scene ally removal must detach party membership before roster removal');

const storyLogic = read('story_logic.js');
assert(storyLogic.includes("if (action.type === 'SCENE_REMOVE_ALLY')"), 'SCENE_REMOVE_ALLY runtime missing');
assert(storyLogic.includes('await App.ensureActiveSceneContext()'), 'scene actions must restore active context before mutation');
assert(storyLogic.includes("case 'START_MOVE_SPRITE':"), 'async field movement command missing');
for (const key of ['finisherAtHpFloor','finisherConversation','finisherSkillName']) {
    assert(storyLogic.includes(`'${key}'`), `BOSS direct rule missing ${key}`);
}

const battle = read('battle.js');
assert(battle.includes('const hpFloorReady = rules.finisherAtHpFloor === true'), 'HP1 finisher condition runtime missing');
assert(battle.includes("battleData.eventFinisherTriggerReason = hpFloorReady ? 'hp_floor' : 'turn_limit'"), 'finisher trigger reason not persisted');
assert(battle.includes('rules.finisherConversation') && battle.includes('Battle.queueBattleConversation(conversationKey'), 'pre-finisher battle conversation missing');
assert(battle.includes("const skillName = String(rules.finisherSkillName"), 'event-specific finisher skill name override missing');
assert(battle.includes('await Battle.tryExecuteEventBattleFinisher(eventRulesAfterAction);'), 'HP1 finisher must be checked immediately after an action');

const effectPath = path.join(ROOT, 'assets/effect/fx-abyss-vortex-ai.png');
assert(fs.existsSync(effectPath) && fs.statSync(effectPath).size > 1000, 'abyss vortex effect asset missing');

const sw = read('sw.js');
assert(sw.includes('prisma-abyss-v86.20260819'), 'service worker cache version must be v86 or current Phase13');

console.log('LIGHT PALACE PHASE12 OK');
console.log('  Resume blocker: normal RESET_TEMP_ALLY removed; Luna removal -> SCENE_PARTY semantic order preserved; Scene Context restored before SCENE_PARTY');
console.log('  Spawns: Jasper +3/-4, Veld -2 after Layla step; flash + 4.2-tile abyss vortex before sprite');
console.log('  Veld finisher: turn 5 OR HP1 -> conversation -> 黒白の葬閃 -> unavoidable fixed 9999 wipe');
console.log('  Claude exit: Leon short bob push, Claude async 1750ms off-map movement during 「レオン――！」');

// ---- Runtime smoke: the exact Phase11 failure state ----
// sceneContextResume exists in the save, but the in-memory stack is empty and Luna was already removed
// by the old RESET_TEMP_ALLY before action[4] SCENE_PARTY failed.
(async () => {
    const mainSource = read('main.js');
    const noop = () => {};
    const documentStub = {
        getElementById: () => null,
        querySelectorAll: () => [],
        addEventListener: noop,
        body: {},
        documentElement: { style:{} }
    };
    const windowStub = {
        JOB_SKILLS: {},
        CHARACTERS_DATA: [{ id:204, name:'レイラ', job:'騎士', rarity:'SSR', sp:0, hp:100, mp:20, atk:20, def:20, mag:10, spd:15, mdef:10 }],
        addEventListener: noop,
        removeEventListener: noop,
        document: documentStub,
        innerWidth: 500,
        innerHeight: 800,
        matchMedia: () => ({ matches:false, addListener:noop, addEventListener:noop })
    };
    const mainCtx = {
        console,
        window: windowStub,
        document: documentStub,
        globalThis: null,
        localStorage: { getItem:()=>null, setItem:noop, removeItem:noop },
        setTimeout,
        clearTimeout,
        requestAnimationFrame: fn => setTimeout(fn, 0),
        navigator: {}, location: {}, performance:{ now:()=>0 },
        Image:function(){}, Audio:function(){}, Menu:{ renderPartyBar:noop }
    };
    mainCtx.globalThis = mainCtx;
    windowStub.globalThis = mainCtx;
    vm.createContext(mainCtx);
    vm.runInContext(`${mainSource}\n;globalThis.__APP__=App;`, mainCtx, { timeout:5000, filename:'main.js' });
    const runtimeApp = mainCtx.__APP__;
    const leila = { uid:'u-leila', charId:204, name:'レイラ', level:50, job:'騎士', rarity:'SSR', equips:{}, skillBookSkills:[] };
    const originData = { characters:[{ uid:'hero', charId:301, name:'主人公' }], party:['hero',null,null,null], progress:{storyCharacters:{}}, system:{} };
    const sceneContext = { token:'scene-x', snapshot:{data:originData}, isolateCharacters:true, visualPreset:'sepia', checkpoints:{}, carryoverCharacterIds:[], suppressSave:true };
    runtimeApp.data = {
        characters:[leila],
        party:['u-leila',null,null,null],
        progress:{ storyCharacters:{ '204':{ recruited:true, available:true, temporary:true, permanentlyUnavailable:false } } },
        system:{ sceneContextResume:{ stack:[sceneContext] } }
    };
    runtimeApp.sceneContextStack = [];
    assert(await runtimeApp.ensureActiveSceneContext(), 'runtime: resume metadata did not restore active Scene Context');
    assert(runtimeApp.setSceneContextParty([{charId:204}], { preserveExisting:true }) === true,
        'runtime: the exact formerly-failing SCENE_PARTY still fails after resume restore');
    assert(runtimeApp.data.party[0] === 'u-leila', 'runtime: Layla party slot was not restored');

    // Fresh path: remove party reference before deleting Luna from the isolated roster.
    runtimeApp.data.characters.push({ uid:'u-luna', charId:401, name:'ルーナ' });
    runtimeApp.data.party[1] = 'u-luna';
    runtimeApp.data.progress.storyCharacters['401'] = { recruited:true, available:true, temporary:true, permanentlyUnavailable:false };
    assert(runtimeApp.removeSceneContextAlly(401, { save:false }) === true, 'runtime: SCENE_REMOVE_ALLY failed');
    assert(!runtimeApp.data.party.includes('u-luna'), 'runtime: Luna UID remained in party after removal');
    assert(!runtimeApp.data.characters.some(char => Number(char?.charId) === 401), 'runtime: Luna remained in isolated character roster');

    // ---- Runtime smoke: HP1 and turn-5 finish conditions ----
    const battleSource = read('battle.js');
    const makeBattleRuntime = ({ hp, completedTurns }) => {
        const eventRules = {
            forcedLoss:true, hpFloor:1, finisherAfterTurns:5, finisherAtHpFloor:true,
            finisherConversation:null, finisherSkillId:140, finisherSkillName:'黒白の葬閃',
            finisherDamage:9999, finisherActorMonsterId:301064
        };
        const battleApp = { data:{ battle:{ eventBattleRules:eventRules, completedTurns } }, save:noop };
        const battleCtx = {
            console,
            document:{ getElementById:()=>null, querySelector:()=>null, querySelectorAll:()=>[], addEventListener:noop, body:{} },
            window:null,
            globalThis:null,
            App:battleApp,
            DB:{ SKILLS:[{ id:140, name:'紫電の葬閃' }] },
            setTimeout,
            clearTimeout,
            AudioManager:{ playSe:noop }
        };
        battleCtx.globalThis = battleCtx;
        battleCtx.window = battleCtx;
        vm.createContext(battleCtx);
        vm.runInContext(`${battleSource}\n;globalThis.__BATTLE__=Battle;`, battleCtx, { timeout:5000, filename:'battle.js' });
        const runtimeBattle = battleCtx.__BATTLE__;
        runtimeBattle.active = true;
        runtimeBattle.phase = 'turn';
        runtimeBattle.enemies = [{ baseId:301064, id:301064, name:'ヴェルド', hp, baseMaxHp:100, isDead:false, isFled:false }];
        runtimeBattle.party = [{ name:'レイラ', hp:100, isDead:false, isFled:false }];
        const logs = [];
        runtimeBattle.log = message => logs.push(String(message));
        runtimeBattle.resultWait = async () => {};
        runtimeBattle.updateDeadState = () => { runtimeBattle.party.forEach(member => { if (member.hp <= 0) member.isDead = true; }); };
        runtimeBattle.renderPartyStatus = noop;
        runtimeBattle.renderEnemies = noop;
        runtimeBattle.saveBattleState = noop;
        return { runtimeBattle, battleApp, logs };
    };

    const hpRuntime = makeBattleRuntime({ hp:1, completedTurns:2 });
    assert(await hpRuntime.runtimeBattle.tryExecuteEventBattleFinisher(hpRuntime.runtimeBattle.getEventBattleRules()) === true,
        'runtime: HP1 did not trigger finisher before turn 5');
    assert(hpRuntime.battleApp.data.battle.eventFinisherTriggerReason === 'hp_floor', 'runtime: HP1 trigger reason mismatch');
    assert(hpRuntime.runtimeBattle.party[0].hp === 0, 'runtime: HP1 finisher did not wipe party');
    assert(hpRuntime.logs.some(line => line.includes('黒白の葬閃')), 'runtime: event-specific finisher name not used');

    const turnRuntime = makeBattleRuntime({ hp:80, completedTurns:5 });
    assert(await turnRuntime.runtimeBattle.tryExecuteEventBattleFinisher(turnRuntime.runtimeBattle.getEventBattleRules()) === true,
        'runtime: turn 5 did not trigger finisher');
    assert(turnRuntime.battleApp.data.battle.eventFinisherTriggerReason === 'turn_limit', 'runtime: turn-5 trigger reason mismatch');

    console.log('  Runtime smoke: interrupted SCENE_PARTY recovery + atomic Luna removal + both finisher triggers OK');
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
