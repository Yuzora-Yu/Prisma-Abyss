'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '../../..');
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const fail = message => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const deepEq = (a,b) => JSON.stringify(a) === JSON.stringify(b);

function evalConst(rel, constName) {
    const source = `${read(rel)}\n;globalThis.__VALUE__=${constName};`;
    const ctx = { console, window: undefined };
    ctx.globalThis = ctx;
    vm.createContext(ctx);
    vm.runInContext(source, ctx, { timeout: 5000, filename: rel });
    return ctx.__VALUE__;
}

const maps = evalConst('map.js', 'FIXED_DUNGEON_MAPS');
const story = evalConst('story.js', 'STORY_MANAGER_DATA');
const light = maps.LIGHT_PALACE;
assert(light && Array.isArray(light.floors), 'LIGHT_PALACE missing');
const f3 = light.floors[2];

const trap = (f3.tileEffects || []).find(effect => effect.eventId === 'light_palace_flashback_hexagram_trap');
assert(trap && deepEq(trap.rect, { x1:16, y1:20, x2:18, y2:20 }), 'seal trigger must cover X16-18 / Y20');
assert([16,17,18].every(x => f3.tiles[20][x] === 'T'), 'seal trigger corridor must remain walkable');
assert(f3.tiles[20][15] === 'W' && f3.tiles[20][19] === 'W', 'seal trigger corridor side walls changed');
const wrongWay = (f3.tileEffects || []).find(effect => effect.eventId === 'light_palace_flashback_wrong_way');
assert(wrongWay && deepEq(wrongWay.rect, { x1:16, y1:19, x2:18, y2:19 }), 'wrong-way trigger must cover X16-18 / Y19');
assert(!wrongWay.eventFlag && !wrongWay.flag, 'wrong-way trigger must remain repeatable');

const trapEvent = story.events.light_palace_flashback_hexagram_trap;
assert(trapEvent, 'seal event missing');
const jasper = trapEvent.actions.flatMap(a => a.commands || []).find(c => c.op === 'DARK_TELEPORT' && c.id === 'flashback-jasper');
assert(jasper && Number(jasper.dx) === 3 && Number(jasper.dy) === -4, 'Jasper must appear 3 east / 4 north in the current superseding staging');
assert(trapEvent.actions.some(a => a.type === 'SCENE_REMOVE_ALLY' && Number(a.value) === 401), 'Luna isolated-scene roster removal missing');
assert(trapEvent.actions.some(a => a.type === 'SCENE_PARTY' && deepEq(a.party, [{charId:204}])), 'post-seal party must be Layla only');
const jasperRemoval = trapEvent.actions.findIndex(a => a.type === 'FIELD_CUTSCENE' && a.commands?.some(c => c.op === 'REMOVE_SPRITE' && c.id === 'flashback-jasper'));
const veldArrival = trapEvent.actions.findIndex(a => a.type === 'FIELD_CUTSCENE' && a.commands?.some(c => c.op === 'DARK_TELEPORT' && c.id === 'flashback-veld'));
assert(jasperRemoval < 0 && veldArrival >= 0, 'Jasper must remain visible through Veld arrival');
const veld = trapEvent.actions[veldArrival].commands.find(c => c.id === 'flashback-veld');
assert(Number(veld.dy) === -2, 'Veld must appear two tiles north of Layla after her step');

const firstBattle = trapEvent.actions.find(a => a.type === 'BOSS');
assert(firstBattle && Number(firstBattle.value) === 301064, 'first flashback Veld battle missing');
assert(firstBattle.endAfterTurns == null, 'first Veld battle must not auto-end by turn count');
for (const b of [firstBattle]) {
    assert(Number(b.hpFloor) === 1, 'Veld event HP floor must be 1');
    assert(Number(b.finisherAfterTurns) === 5, 'Veld finisher turn must be 5');
    assert(Number(b.finisherSkillId) === 140, 'Veld finisher skill must be 紫電の葬閃 (140)');
    assert(Number(b.finisherDamage) === 9999, 'Veld finisher must deal fixed 9999');
    assert(Number(b.finisherActorMonsterId) === 301064, 'Veld finisher actor mismatch');
}

const afterVeld = story.events.light_palace_flashback_veld1_after;
const postCommands = afterVeld.actions.find(a => a.type === 'FIELD_CUTSCENE')?.commands || [];
assert(postCommands.some(c => c.op === 'MOVE_PLAYER' && Number(c.x) === 17 && Number(c.y) === 20), 'Layla rescue staging must shift left to X17/Y20');
assert(postCommands.some(c => c.id === 'flashback-postveld-leon' && c.op === 'MOVE_SPRITE' && Number(c.x) === 16 && Number(c.y) === 19 && c.direction === 'up'), 'Leon rescue staging must end X16/Y19');
assert(postCommands.some(c => c.id === 'flashback-postveld-claude' && c.op === 'MOVE_SPRITE' && Number(c.x) === 18 && Number(c.y) === 19 && c.direction === 'up'), 'Claude rescue staging must end X18/Y19');

const exitEvent = story.events.light_palace_flashback_exit_veld;
const exitBattle = exitEvent.actions.find(a => a.type === 'BOSS');
assert(exitBattle && exitBattle.endAfterTurns == null, 'exit Veld battle must not auto-end by turn count');
assert(Number(exitBattle.hpFloor) === 1 && Number(exitBattle.finisherAfterTurns) === 5 && Number(exitBattle.finisherDamage) === 9999, 'exit Veld finisher rules mismatch');
assert(!exitEvent.actions.some(a => a.type === 'FIELD_CUTSCENE' && a.commands?.some(c => c.op === 'REMOVE_SPRITE' && c.id === 'flashback-exit-veld')), 'Veld must not be removed before final flashback battle');

const escapeEvent = story.events.light_palace_flashback_escape_end;
const escapeSetup = escapeEvent.actions.find(a => a.type === 'FIELD_CUTSCENE')?.commands || [];
assert(escapeSetup.some(c => c.op === 'SHOW_SPRITE' && c.id === 'flashback-exit-veld' && Number(c.x) === 17 && Number(c.y) === 23), 'Veld must remain visible after final flashback battle');
const escapeScript = story.scripts.LIGHT_PALACE_FLASHBACK_ESCAPE_END || [];
const shakeIndex = escapeScript.findIndex(entry => entry.type === 'FIELD_CUTSCENE' && entry.commands?.some(c => c.op === 'SCREEN_SHAKE'));
const barrierLineIndex = escapeScript.findIndex(entry => String(entry.text || '').includes('結界が、一瞬だけ消える'));
assert(shakeIndex === barrierLineIndex + 1, 'vertical screen shake must immediately follow barrier disappearance');
const shake = escapeScript[shakeIndex].commands.find(c => c.op === 'SCREEN_SHAKE');
assert(shake.axis === 'y' && Number(shake.amplitude) >= 18 && Number(shake.duration) >= 700, 'barrier shake must be a strong vertical shake');
const leonLine = escapeScript.findIndex(entry => entry.charId === 305 && String(entry.text || '').includes('クロード！'));
const pushCommands = escapeScript[leonLine + 1]?.commands || [];
assert(pushCommands[0]?.id === 'flashback-exit-leon' && Number(pushCommands[0]?.x) === 16 && Number(pushCommands[0]?.y) === 24, 'Leon must first move north before pushing Claude');
assert(pushCommands.some(c => c.id === 'flashback-exit-leon' && Number(c.x) === 18 && Number(c.y) === 24), 'Leon must move to the tile north of Claude');
const claudeExit = pushCommands.find(c => c.id === 'flashback-exit-claude' && c.op === 'START_MOVE_SPRITE');
assert(claudeExit && Number(claudeExit.y) > 29 && Number(claudeExit.duration) >= 1500, 'Claude must be pushed into one continuous off-map movement');
assert(claudeExit.removeAfter === true, 'Claude must be removed only after reaching off-map');

const battleRuntime = read('battle.js');
for (const token of ['finisherAfterTurns','finisherSkillId','finisherDamage','finisherActorMonsterId','tryExecuteEventBattleFinisher']) {
    assert(battleRuntime.includes(token), `event finisher runtime missing: ${token}`);
}
assert(battleRuntime.includes('member.hp = 0') && battleRuntime.includes('eventFinisherTriggered'), 'finisher must directly wipe living party and be one-shot');
const storyLogic = read('story_logic.js');
for (const key of ['finisherAfterTurns','finisherSkillId','finisherDamage','finisherActorMonsterId']) assert(storyLogic.includes(`'${key}'`), `BOSS direct event rule missing ${key}`);

assert(storyLogic.includes('setStoryEventGuideHidden: function(hidden)'), 'event guide hide helper missing');
assert(storyLogic.includes("document.getElementById('field-info-box')"), 'field-info-box is not wired to event guide hide');
assert(storyLogic.includes('this.setStoryEventGuideHidden(true);') && storyLogic.includes('this.setStoryEventGuideHidden(false);'), 'event lifecycle does not hide/restore top-left guide');
assert(storyLogic.includes("case 'SCREEN_SHAKE':"), 'SCREEN_SHAKE visual command missing');

const main = read('main.js');
for (const token of ['syncSceneContextResumeMetadata','restoreSceneContextResumeMetadata','sceneContextResume']) assert(main.includes(token), `scene resume persistence missing: ${token}`);
for (const token of ['isLegacyLightPalaceFlashbackData','attachLegacyLightPalaceFlashbackOrigin','recoverLegacyLightPalaceFlashbackContext']) assert(main.includes(token), `legacy flashback recovery missing: ${token}`);
assert(main.includes('originFlags.lightPalaceFlashbackReady !== true'), 'legacy recovery must reject unrelated/old origin saves');
assert(main.includes('App.restoreSceneContextResumeMetadata();'), 'App.load must restore scene context stack');
assert(main.includes('App.syncSceneContextResumeMetadata?.();'), 'App.save/end scene must sync scene context metadata');
assert(!main.includes("if (typeof App.isSceneContextSaveSuppressed === 'function' && App.isSceneContextSaveSuppressed()) {\n            App.sceneContextSaveAttempted = true;\n            if (typeof App.updateHUD === 'function') App.updateHUD();\n            return true;"), 'scene-context save is still silently discarded');
const slots = read('save_slots.js');
assert(slots.includes('app?.syncSceneContextResumeMetadata?.();'), 'manual save must sync scene context resume metadata');
assert(slots.includes('app?.isLegacyLightPalaceFlashbackData?.(data)') && slots.includes('attachLegacyLightPalaceFlashbackOrigin'), 'manual legacy flashback load must try to attach a normal-save origin before overwriting autosave');
assert(storyLogic.includes('await App.ensureActiveSceneContext()'), 'SCENE_PARTY/CHECKPOINT/END must restore or recover Scene Context before failing');

const achievements = read('achievements.js');
assert(achievements.includes('sceneContext?.isolateCharacters') && achievements.includes('sceneContext.snapshot?.data?.characters'), 'hero lookup must use pre-flashback snapshot during isolated scene');
assert(achievements.includes("App.getActiveSceneContext()?.isolateCharacters) return 0"), 'achievement progress must be suppressed in isolated flashback');

const sw = read('sw.js');
assert(sw.includes('prisma-abyss-v86.20260819'), 'service worker cache version must be current Phase13 v86');

console.log('LIGHT PALACE PHASE11 OK');
console.log('  3F: seal X16-18/Y20, wrong-way X16-18/Y19, Jasper +3/-4 persistent, Veld -2 persistent');
console.log('  Rescue: Leon16 / Layla17 / Claude18');
console.log('  Veld fights: HP floor 1, turn-5 unavoidable 9999 finisher, no turn auto-end');
console.log('  Exit: Veld remains visible, barrier vertical shake, Leon push + continuous Claude exit');
console.log('  Resume: scene-context snapshot persists; legacy Phase10 saves can recover from a compatible normal save');
console.log('  Achievements: isolated flashback state excluded');
console.log('  Event UI: top-left field guide hidden while event runner is active');
