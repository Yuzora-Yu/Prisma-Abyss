const fs = require('fs');
const path = require('path');
const { loadMapStoryRuntime } = require('./validation-helpers');
const root = path.resolve(__dirname, '..', '..');
const { context } = loadMapStoryRuntime(root);
const mainSource = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const dbSource = fs.readFileSync(path.join(root, 'database.js'), 'utf8');
const battleSource = fs.readFileSync(path.join(root, 'battle.js'), 'utf8');
const logicSource = fs.readFileSync(path.join(root, 'story_logic.js'), 'utf8');

function assert(v, msg) { if (!v) throw new Error(msg); }
const maps = context.FIXED_MAPS;
const ids = context.window.MAP_IDS;
const events = context.StoryManager.events || {};
const scripts = context.StoryManager.scripts || {};

for (const key of ['PROLOGUE_WEST_HILL','PROLOGUE_SOUTH_VILLAGE','PROLOGUE_NORTH_VILLAGE']) {
  assert(maps[key], `Missing prologue map: ${key}`);
  assert(ids[key], `Missing prologue map ID: ${key}`);
  const map = maps[key];
  assert(Array.isArray(map.tiles) && map.tiles.length === map.height, `Height mismatch: ${key}`);
  map.tiles.forEach((row, y) => assert(row.length === map.width, `Width mismatch: ${key} row ${y}`));
  assert(Number.isFinite(Number(map.entryPoint?.x)) && Number.isFinite(Number(map.entryPoint?.y)), `Missing entry point: ${key}`);
}

assert(mainSource.includes("location: { area: 'PROLOGUE_WEST_HILL', x: 8, y: 7 }"), 'App initial data does not start at west hill.');
assert(dbSource.includes("area: 'PROLOGUE_WEST_HILL'"), 'Database initial data does not start at west hill.');
assert(mainSource.includes('prologueStage: 0') && dbSource.includes('prologueStage: 0'), 'prologueStage is missing from persistent defaults.');
assert(/storyStateSchemaVersion:\s*([3-9]|[1-9][0-9]+)/.test(mainSource) && /storyStateSchemaVersion:\s*([3-9]|[1-9][0-9]+)/.test(dbSource), 'Story-state schema version must remain at least 3.');

const westToSouth = (maps.PROLOGUE_WEST_HILL.mapActions || []).find(a => a.type === 'fixedMap' && a.target === 'PROLOGUE_SOUTH_VILLAGE');
assert(westToSouth, 'West hill is not connected to south village.');
assert(westToSouth.requiredWorldState?.prologueStage?.value === 1, 'West-to-south route is not gated by playable prologue start.');
assert((maps.PROLOGUE_SOUTH_VILLAGE.mapActions || []).some(a => a.target === 'PROLOGUE_NORTH_VILLAGE'), 'South village is not connected to north village.');
assert((maps.PROLOGUE_NORTH_VILLAGE.mapActions || []).some(a => a.target === 'PROLOGUE_SOUTH_VILLAGE'), 'North village has no return route to south village.');

assert(maps.PROLOGUE_SOUTH_VILLAGE.entryEventId === 'prologue_south_arrival', 'South entry does not trigger the rescue battle.');
assert(maps.PROLOGUE_SOUTH_VILLAGE.entryEventFlag === 'prologueFirstBattleCleared', 'South rescue battle has no victory gate.');
assert(maps.PROLOGUE_SOUTH_VILLAGE.isDungeon === true && maps.PROLOGUE_NORTH_VILLAGE.isDungeon === true, 'Prologue encounter areas must use fixed-map encounter runtime.');
assert(maps.PROLOGUE_SOUTH_VILLAGE.useHabitatEncounters === true && maps.PROLOGUE_NORTH_VILLAGE.useHabitatEncounters === true, 'Prologue normal encounters must use monsters.js habitat master.');
assert(!Array.isArray(maps.PROLOGUE_SOUTH_VILLAGE.monsters) && !Array.isArray(maps.PROLOGUE_NORTH_VILLAGE.monsters), 'Prologue maps must not duplicate normal encounter rosters in map.js.');
assert(maps.PROLOGUE_SOUTH_VILLAGE.encounterRank === 1, 'South encounter rank must remain early-game rank.');
assert(maps.PROLOGUE_NORTH_VILLAGE.encounterRank >= 31, 'North area must enter the first Metal Jelly rare-rank band.');
assert(Number(maps.PROLOGUE_NORTH_VILLAGE.rareEncounterRateMultiplier || 0) > 1, 'North area does not expose the rare-monster hunt hook.');

assert(events.game_start?.actions?.some(a => a.type === 'WORLD_STATE' && a.key === 'prologueStage' && a.value === 1), 'game_start does not activate playable prologue stage.');
const rescue = events.prologue_south_arrival;
assert(rescue, 'Missing prologue_south_arrival event.');
assert(rescue.actions?.some(a => a.type === 'BOSS' && Number(a.value) === 100002 && a.lossEventId === 'prologue_south_ambush_retry'), 'First rescue battle is not wired with retry.');
assert(rescue.winActions?.some(a => a.type === 'TEMP_ALLY' && Number(a.charId) === 403), 'Luna does not join as temporary prologue ally after rescue.');
assert(rescue.winActions?.some(a => a.type === 'WORLD_STATE' && a.key === 'prologueStage' && a.value === 3), 'Rescue victory does not advance prologue stage.');
assert(events.prologue_south_ambush_retry?.actions?.some(a => a.type === 'HEAL'), 'First-battle retry does not heal before retry.');

for (const key of ['PROLOGUE_WEST_HILL_OPENING','PROLOGUE_SOUTH_AMBUSH','PROLOGUE_LUCION_RECOVER','PROLOGUE_SOUTH_AFTER_BATTLE']) {
  assert(Array.isArray(scripts[key]) && scripts[key].length, `Missing prologue script: ${key}`);
}
assert(logicSource.includes("action.type === 'TEMP_ALLY'"), 'Story runtime lacks TEMP_ALLY action.');
assert(logicSource.includes("action.type === 'WORLD_STATE'"), 'Story runtime lacks WORLD_STATE action.');
assert(logicSource.includes("prologueStage > 0 && prologueStage < 100"), 'Objective runtime lacks playable-prologue override.');
assert(battleSource.includes('const isPlayablePrologue = prologueStage > 0 && prologueStage < 100'), 'Battle loss runtime lacks playable-prologue safety.');
assert(battleSource.includes('Ancient light') === false, 'Unexpected English placeholder in prologue recovery.');
assert(battleSource.includes('古き光の加護がアルスを立ち上がらせた。'), 'Prologue recovery feedback is missing.');

console.log('PASS validate-playable-prologue-phase2a');
