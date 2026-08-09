const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { loadMapStoryRuntime } = require('./validation-helpers');
const root = path.resolve(__dirname, '..', '..');
const { context } = loadMapStoryRuntime(root);
const maps = context.FIXED_MAPS || {};
const master = context.window?.MAP_MASTER || {};
const events = context.StoryManager?.events || {};
const scripts = context.StoryManager?.scripts || {};
const monsterContext = {}; monsterContext.globalThis = monsterContext; vm.createContext(monsterContext);
vm.runInContext(fs.readFileSync(path.join(root, 'monsters.js'), 'utf8'), monsterContext);
const monsterApi = monsterContext.MonsterData;
const mainSource = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const logicSource = fs.readFileSync(path.join(root, 'story_logic.js'), 'utf8');
const battleSource = fs.readFileSync(path.join(root, 'battle.js'), 'utf8');
function assert(v, msg) { if (!v) throw new Error(msg); }

assert(master.REES_MOUNTAIN_HUT?.id === 'MAP000069', 'Rees hut must have canonical MAP000069 master id.');
assert(master.PROLOGUE_FINAL_ALTAR?.id === 'MAP000070', 'Hidden prologue final altar must have MAP000070 master id.');
assert(maps.PROLOGUE_FINAL_ALTAR, 'Missing provisional five-years-ago final altar map.');
assert(maps.PROLOGUE_FINAL_ALTAR.entryEventId === 'prologue_hidden_azelgarag_start', 'Hidden final altar does not enter Azelgarag event.');
assert(maps.PROLOGUE_FINAL_ALTAR.entryEventFlag === 'prologueHiddenAzelgaragResolved', 'Hidden final altar can retrigger after resolution.');

const hidden = events.prologue_hidden_route_pending;
assert(hidden?.actions?.some(a => a.type === 'FLAG' && a.key === 'prologueIlluminaciaDefeated'), 'Illuminacia hidden victory is not persisted.');
assert(hidden?.actions?.some(a => a.type === 'FLAG' && a.key === 'prologueResult4'), 'Result4 is not persisted.');
for (const id of [501, 402]) {
  assert(hidden?.actions?.some(a => a.type === 'ALLY' && Number(a.value ?? a.charId) === id && Number(a.initialLevel) === 100), `Hidden route does not join character ${id} at level 100.`);
  assert(hidden?.actions?.some(a => a.type === 'SET_CHARACTER_LB' && Number(a.charId) === id && Number(a.limitBreak) === 99), `Hidden route does not set character ${id} to LB99.`);
}
assert(hidden?.actions?.some(a => a.type === 'START_FIXED_MAP' && a.value === 'PROLOGUE_FINAL_ALTAR'), 'Hidden route does not transfer to the provisional final altar.');

const az = events.prologue_hidden_azelgarag_start;
const azBattle = az?.actions?.find(a => a.type === 'BOSS');
assert(azBattle && Number(azBattle.value) === 802003, 'Hidden route does not use event Azelgarag variant 802003.');
assert(Number(azBattle.bossStatMultiplier) === 0.5, 'Five-years-ago Azelgarag must be 0.5x stats.');
assert(azBattle.forceAutoOff === true, 'Hidden Azelgarag battle must be manual.');
assert(azBattle.noExp === true && azBattle.noDrops === true && azBattle.noGold === true && azBattle.bestiaryExcluded === true, 'Hidden Azelgarag rewards/bestiary suppression is incomplete.');
assert(azBattle.winEventId === 'prologue_hidden_special_end_win' && azBattle.lossEventId === 'prologue_hidden_special_end_loss', 'Hidden Azelgarag battle does not keep both special ending outcomes.');

const azMonster = monsterApi?.getMonsterById?.(802003);
assert(azMonster?.storyVariantOf === 302100, 'Hidden Azelgarag variant does not identify source 302100.');
assert(!azMonster?.phaseTransition && !azMonster?.phaseTransitionMonsterId, 'Five-years-ago Azelgarag variant must not jump to an unscaled normal second phase.');

for (const eventId of ['prologue_hidden_special_end_win', 'prologue_hidden_special_end_loss']) {
  const end = events[eventId];
  assert(end?.actions?.some(a => a.type === 'TEMP_LB_CLEAR' && a.id === 'prologue_divine_lb99'), `${eventId} does not clear temporary divine LB wrapper.`);
  assert(!end?.actions?.some(a => a.type === 'RESET_HERO_BASELINE'), `${eventId} must preserve prologue leveling into the present.`);
  assert(end?.actions?.some(a => a.type === 'PROMOTE_TEMP_ALLY' && Number(a.charId) === 403), `${eventId} removes prologue Luna instead of carrying her.`);
  for (const id of [301, 403, 501, 402]) {
    assert(end?.actions?.some(a => a.type === 'SET_CHARACTER_LB' && Number(a.charId) === id && Number(a.limitBreak) === 99), `${eventId} does not carry LB99 for ${id}.`);
  }
  assert(end?.actions?.some(a => a.type === 'IF_ITEM' && Number(a.id) === 701009), `${eventId} does not guarantee burned pendant.`);
  assert(end?.actions?.some(a => a.type === 'FLAG' && a.key === 'prologueSpecialEndingSeen'), `${eventId} does not mark special ending.`);
  assert(end?.actions?.some(a => a.type === 'WORLD_STATE' && a.key === 'prologueStage' && Number(a.value) === 100), `${eventId} does not move prologue to present-day stage.`);
  assert(end?.actions?.some(a => a.type === 'START_FIXED_MAP' && a.value === 'REES_MOUNTAIN_HUT'), `${eventId} does not return to Rees hut.`);
}

for (const key of ['PROLOGUE_HIDDEN_ILLUMINACIA_WIN','PROLOGUE_HIDDEN_ALTAR','PROLOGUE_HIDDEN_END_WIN','PROLOGUE_HIDDEN_END_LOSS']) {
  assert(Array.isArray(scripts[key]) && scripts[key].length, `Missing hidden prologue script ${key}.`);
}
assert(mainSource.includes('promoteTemporaryStoryAlly:'), 'Runtime lacks temporary ally promotion helper.');
assert(mainSource.includes('setStoryCharacterLimitBreak:'), 'Runtime lacks explicit LB carry helper.');
assert(logicSource.includes("action.type === 'PROMOTE_TEMP_ALLY'"), 'Story runtime lacks PROMOTE_TEMP_ALLY adapter.');
assert(logicSource.includes("action.type === 'SET_CHARACTER_LB'"), 'Story runtime lacks SET_CHARACTER_LB adapter.');
assert(battleSource.includes('Math.max(0.1, Number(battleData.bossStatMultiplier'), 'Battle runtime still clamps authored story boss multipliers to >=1.0.');
assert(battleSource.includes('Math.abs(Number(options.storyBossStatMultiplier || 1) - 1)'), 'Battle runtime does not apply authored story boss downscaling below 1.0.');

console.log('PASS validate-playable-prologue-phase2c');
