const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { loadMapStoryRuntime } = require('./validation-helpers');

const root = path.resolve(__dirname, '..', '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const { context } = loadMapStoryRuntime(root, {
  context: { App: { data: { progress: { flags: {}, worldState: {}, quests: {}, storyStep: 0, subStep: 0 }, items: {}, characters: [], party: [] } } }
});
const { FIXED_MAPS, STORY_MANAGER_DATA } = context;

for (const key of ['PROLOGUE_HILL', 'PROLOGUE_SOUTH', 'PROLOGUE_NORTH']) {
  const map = FIXED_MAPS[key];
  assert(map, `${key} is missing.`);
  assert(!String(map.name || '').includes('リュミナ'), `${key} is incorrectly named as Lumina village.`);
  assert(map.tiles.length === map.height, `${key} tile height mismatch.`);
  assert(map.tiles.every(row => row.length === map.width), `${key} tile width mismatch.`);
}

const hill = FIXED_MAPS.PROLOGUE_HILL;
const south = FIXED_MAPS.PROLOGUE_SOUTH;
const north = FIXED_MAPS.PROLOGUE_NORTH;
assert(hill.mapId === 'MAP000066' && south.mapId === 'MAP000067' && north.mapId === 'MAP000068', 'Prologue map IDs changed unexpectedly.');
assert((hill.mapActions || []).some(a => a.eventId === 'prologue_pick_offering_flower' && a.missingFlag === 'prologueDisasterStarted'), 'Offering-flower action is not gated as the calm opening interaction.');
assert((hill.worldExits || []).filter(e => e.area === 'PROLOGUE_SOUTH').every(e => e.requiredFlag === 'prologueDisasterStarted'), 'Hill can be left before the disaster starts.');
assert(south.entryEventId === 'prologue_south_rescue', 'South does not trigger the Luna rescue on entry.');
assert(south.allowRandomEncounters === true && south.storyLossEventId === 'prologue_random_defeat_recovery' && south.suppressWipeoutCountOnLoss === true, 'South prologue defeat-recovery rules are incomplete.');
assert(north.allowRandomEncounters === true && Number(north.encounterRank) > Number(south.encounterRank), 'North is not configured as the stronger optional encounter area.');
assert((south.mapActions || []).some(a => a.eventId === 'prologue_home_chasm' && a.requiredFlag === 'prologueLunaRescued' && a.missingFlag === 'prologueHomeLossSeen'), 'Home/chasm progression action is missing or wrongly gated.');
assert(!south.tiles[south.height - 1].includes('S'), 'South edge still allows escaping before the exit-boss sequence is implemented.');
assert((south.mapActions || []).some(a => a.eventId === 'prologue_south_exit_abyss_appears' && a.requiredFlag === 'prologueHomeLossSeen' && a.missingFlag === 'prologueFirstBossRevealed'), 'South exit boss-reveal gate is missing.');

for (const eventId of ['prologue_hill_intro','prologue_pick_offering_flower','prologue_south_rescue','prologue_south_rescue_retry','prologue_random_defeat_recovery','prologue_home_chasm','prologue_south_exit_abyss_appears']) {
  assert(STORY_MANAGER_DATA.events[eventId], `Missing prologue event: ${eventId}`);
}
const rescue = STORY_MANAGER_DATA.events.prologue_south_rescue;
assert(rescue.actions.some(a => a.type === 'BOSS' && a.lossEventId === 'prologue_south_rescue_retry' && a.suppressWipeoutCount === true), 'First rescue battle does not recover instead of game-over.');
assert(rescue.winActions.some(a => a.type === 'STORY_VARIANT_ALLY' && a.value === 'LUNA_PROLOGUE' && a.temporary === true), 'Prologue Luna does not join as a temporary story variant.');
assert(STORY_MANAGER_DATA.events.prologue_home_chasm.actions.some(a => a.type === 'WORLD_STATE' && a.key === 'prologueStage' && a.value === 4), 'Home/chasm event does not advance prologueStage to 4.');
assert(STORY_MANAGER_DATA.events.prologue_south_exit_abyss_appears.actions.some(a => a.type === 'WORLD_STATE' && a.key === 'prologueStage' && a.value === 5), 'South exit reveal does not advance prologueStage to 5.');

const dbContext = { window:{}, console, JSON, Math, Object, Array, Number, String, Set, Map };
dbContext.window = dbContext; dbContext.globalThis = dbContext;
vm.createContext(dbContext);
vm.runInContext(read('database.js') + '\nglobalThis.__INITIAL__ = INITIAL_DATA_TEMPLATE;', dbContext, { filename:'database.js' });
const initial = dbContext.__INITIAL__;
assert(initial.location?.area === 'PROLOGUE_HILL', 'NEW GAME does not start on the prologue highland.');
assert(Number(initial.items?.[701009] || 0) === 0, 'Charred pendant is incorrectly granted before the prologue ends.');
assert(initial.progress?.storyVariantStates && typeof initial.progress.storyVariantStates === 'object', 'Story variant state container is missing from NEW GAME data.');
assert(initial.system?.storyStateSchemaVersion === 3, 'Phase 2 save schema must be version 3.');

const mainSource = read('main.js');
assert(mainSource.includes("pendingEventId = 'prologue_hill_intro'"), 'NEW GAME does not queue the prologue intro.');
const charSource = read('characters.js');
assert(/LUNA_PROLOGUE[\s\S]*canonicalCharId\s*:\s*null/.test(charSource), 'Prologue Luna must remain a non-numeric story variant until a canonical ID is approved.');

const monsterContext = { window:{}, console, Math, tileEntry:(img,color)=>({img,color}) };
monsterContext.window = monsterContext; monsterContext.globalThis = monsterContext;
vm.createContext(monsterContext);
for (const file of ['map.js','maps_logic.js','monsters.js']) vm.runInContext(read(file), monsterContext, { filename:file });
assert(monsterContext.MonsterData.getEncounterCandidates({ mapId:'MAP000067', floor:0 }).length > 0, 'South has no habitat-master encounter candidates.');
assert(monsterContext.MonsterData.getEncounterCandidates({ mapId:'MAP000068', floor:0 }).length > 0, 'North has no habitat-master encounter candidates.');
const metal = monsterContext.MonsterData.tryGenerateRareMonster(8, { mapId:'MAP000068', force:true });
assert(metal?.id === 200201, 'North prologue rare encounter is not Metal Jelly.');
assert(monsterContext.MonsterData.tryGenerateRareMonster(8, { mapId:'MAP000067', force:true }) === null, 'South incorrectly inherits the North-only early Metal Jelly override.');

console.log('PASS: Phase 2 prologue maps, NEW GAME route, Luna rescue/recovery, home-loss gate, habitat encounters, and North Metal Jelly override are coherent.');
