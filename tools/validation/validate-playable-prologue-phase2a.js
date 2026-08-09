const fs = require('fs');
const path = require('path');
const { loadMapStoryRuntime } = require('./validation-helpers');
const root = path.resolve(__dirname, '..', '..');
const { context } = loadMapStoryRuntime(root);
const mainSource = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const dbSource = fs.readFileSync(path.join(root, 'database.js'), 'utf8');
const battleSource = fs.readFileSync(path.join(root, 'battle.js'), 'utf8');
const logicSource = fs.readFileSync(path.join(root, 'story_logic.js'), 'utf8');
const vm = require('vm');
const monsterContext = {}; monsterContext.globalThis = monsterContext; vm.createContext(monsterContext);
vm.runInContext(fs.readFileSync(path.join(root, 'monsters.js'), 'utf8'), monsterContext);
const monsterApi = monsterContext.MonsterData;

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

assert(mainSource.includes("const template = (typeof INITIAL_DATA_TEMPLATE !== 'undefined'"), 'App.getInitialData must derive from the NEW GAME initial-data master.');
assert(dbSource.includes("area: 'PROLOGUE_WEST_HILL'"), 'Database initial data does not start at west hill.');
assert(mainSource.includes('prologueStage: 0') && dbSource.includes('prologueStage: 0'), 'prologueStage is missing from persistent defaults.');
assert(/storyStateSchemaVersion:\s*([3-9]|[1-9][0-9]+)/.test(mainSource) && /storyStateSchemaVersion:\s*([3-9]|[1-9][0-9]+)/.test(dbSource), 'Story-state schema version must remain at least 3.');

const westToSouth = (maps.PROLOGUE_WEST_HILL.mapActions || []).find(a => a.type === 'fixedMap' && a.target === 'PROLOGUE_SOUTH_VILLAGE');
assert(westToSouth, 'West hill is not connected to south village.');
assert(westToSouth.requiredWorldState?.prologueStage?.value === 1, 'West-to-south route is not gated by playable prologue start.');
assert(Number(westToSouth.x) === 15 && Number(westToSouth.y) === 7, 'West hill must leave from the east edge.');
assert(Number(westToSouth.targetX) === 2 && Number(westToSouth.targetY) === 3, 'South village must be entered from the west.');
assert(westToSouth.triggerOnStep === true, 'West-to-south area boundary must trigger on step.');

// Regression: object-map WorldState rules must preserve their comparison operator.
// A previous normalizer treated { prologueStage: { op: '>=', value: 1 } } as
// prologueStage === { ... }, permanently hiding the west-hill exit action.
const normalizeMatch = mainSource.match(/normalizeWorldStateConditions:\s*(\(value\)\s*=>\s*\{[\s\S]*?\n    \}),\n\n    evaluateWorldStateCondition/);
assert(normalizeMatch, 'Could not locate normalizeWorldStateConditions runtime.');
const normalizeWorldStateConditions = require('vm').runInNewContext(`(${normalizeMatch[1]})`);
const normalizedWestGate = normalizeWorldStateConditions(westToSouth.requiredWorldState);
assert(normalizedWestGate.length === 1, 'West-hill WorldState gate did not normalize to one rule.');
assert(normalizedWestGate[0].key === 'prologueStage', 'West-hill WorldState gate lost its key.');
assert(normalizedWestGate[0].op === '>=' && normalizedWestGate[0].value === 1, 'West-hill WorldState comparison operator/value were corrupted.');

const reachableWest = require('./validation-helpers').collectReachableCells(maps.PROLOGUE_WEST_HILL, maps.PROLOGUE_WEST_HILL.entryPoint);
assert(reachableWest.has(`${westToSouth.x},${westToSouth.y}`), 'West-hill exit cell is not physically reachable from the start point.');
const southToNorth = (maps.PROLOGUE_SOUTH_VILLAGE.mapActions || []).find(a => a.target === 'PROLOGUE_NORTH_VILLAGE');
const northToSouth = (maps.PROLOGUE_NORTH_VILLAGE.mapActions || []).find(a => a.target === 'PROLOGUE_SOUTH_VILLAGE');
const southToWest = (maps.PROLOGUE_SOUTH_VILLAGE.mapActions || []).find(a => a.target === 'PROLOGUE_WEST_HILL');
assert(southToNorth?.triggerOnStep === true, 'South-to-north area boundary must trigger on step.');
assert(northToSouth?.triggerOnStep === true, 'North-to-south area boundary must trigger on step.');
assert(southToWest?.triggerOnStep === true && Number(southToWest.x) === 1, 'South-to-west return must use the west edge and trigger on step.');

assert(maps.PROLOGUE_SOUTH_VILLAGE.entryEventId === 'prologue_south_arrival', 'South entry does not trigger the rescue battle.');
assert(maps.PROLOGUE_SOUTH_VILLAGE.entryEventFlag === 'prologueFirstBattleCleared', 'South rescue battle has no victory gate.');
assert(maps.PROLOGUE_SOUTH_VILLAGE.isDungeon === true && maps.PROLOGUE_NORTH_VILLAGE.isDungeon === true, 'Prologue encounter areas must use fixed-map encounter runtime.');
assert(maps.PROLOGUE_SOUTH_VILLAGE.useHabitatEncounters === true && maps.PROLOGUE_NORTH_VILLAGE.useHabitatEncounters === true, 'Prologue normal encounters must use monsters.js habitat master.');
assert(!Array.isArray(maps.PROLOGUE_SOUTH_VILLAGE.monsters) && !Array.isArray(maps.PROLOGUE_NORTH_VILLAGE.monsters), 'Prologue maps must not duplicate normal encounter rosters in map.js.');
assert(maps.PROLOGUE_SOUTH_VILLAGE.encounterRank === 1, 'South encounter rank must remain early-game rank.');
assert(Number(maps.PROLOGUE_SOUTH_VILLAGE.enemyBoost?.hpMultiplier || 1) >= 2, 'South prologue encounters need HP-only pacing support.');
assert(Number(maps.PROLOGUE_SOUTH_VILLAGE.enemyBoost?.statMultiplier || 1) === 1, 'South prologue pacing must not raise enemy offense just to lengthen fights.');
assert(maps.PROLOGUE_NORTH_VILLAGE.encounterRank >= 31, 'North area must enter the first Metal Jelly rare-rank band.');
assert(Number(maps.PROLOGUE_NORTH_VILLAGE.rareEncounterRateMultiplier || 0) > 1, 'North area does not expose the rare-monster hunt hook.');

assert(events.game_start?.actions?.some(a => a.type === 'WORLD_STATE' && a.key === 'prologueStage' && a.value === 1), 'game_start does not activate playable prologue stage.');
const rescue = events.prologue_south_arrival;
assert(rescue, 'Missing prologue_south_arrival event.');
const rescueBattle = rescue.actions?.find(a => a.type === 'BOSS');
assert(rescueBattle && Number(rescueBattle.value) === 802000 && rescueBattle.lossEventId === 'prologue_south_ambush_retry', 'First rescue battle must use the dedicated prologue enemy and keep retry.');
assert(rescueBattle.endAfterTurns === undefined && rescueBattle.endAtHpPercent === undefined && rescueBattle.forcedLoss !== true, 'First rescue battle must use normal HP=0 victory, not an authored one-turn finish rule.');
const rescueMonster = monsterApi?.getMonsterById?.(802000);
assert(rescueMonster && Number(rescueMonster.hp) >= 40, 'Dedicated rescue enemy is too fragile for a real opening battle.');
assert(rescueMonster.bestiaryExcluded === true || rescueMonster.storyOnly === true, 'Dedicated rescue enemy must stay out of normal bestiary flow.');
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
assert(!battleSource.includes('古き光の加護がアルスを立ち上がらせた。'), 'Prologue divine recovery must not be written into the battle log.');
assert(events.prologue_field_wipeout_recover?.actions?.some(a => a.type === 'HEAL'), 'Normal prologue wipeout must recover on the field.');
assert(events.prologue_field_wipeout_recover?.actions?.some(a => a.type === 'CONV' && a.value === 'PROLOGUE_LUCION_RECOVER'), 'Field recovery event is missing its recovery scene.');
assert(!JSON.stringify(scripts.PROLOGUE_SOUTH_AMBUSH || []).includes('南エリア'), 'Player-facing rescue dialogue still exposes an internal area label.');

console.log('PASS validate-playable-prologue-phase2a');
