const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { loadMapStoryRuntime, collectReachableCells } = require('./validation-helpers');

const root = path.resolve(__dirname, '..', '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const { context } = loadMapStoryRuntime(root);
const maps = context.FIXED_MAPS || {};
const dungeons = context.FIXED_DUNGEON_MAPS || {};
const events = context.StoryManager?.events || {};
const scripts = context.StoryManager?.scripts || {};
const mainSource = read('main.js');
const battleSource = read('battle.js');
const dungeonSource = read('dungeon.js');
const storySource = read('story.js');
const logicSource = read('story_logic.js');
const dbSource = read('database.js');

const monsterContext = { console, window: {} };
monsterContext.globalThis = monsterContext;
vm.createContext(monsterContext);
vm.runInContext(`${read('monsters.js')}\nglobalThis.__MonsterData = MonsterData;`, monsterContext, { filename: 'monsters.js' });
const MonsterData = monsterContext.__MonsterData;

// 1) Geography / contact-driven local boundaries.
const west = maps.PROLOGUE_WEST_HILL;
const south = maps.PROLOGUE_SOUTH_VILLAGE;
const north = maps.PROLOGUE_NORTH_VILLAGE;
const hut = maps.REES_MOUNTAIN_HUT;
assert(west && south && north && hut, 'Opening fixed maps are incomplete.');
const westExit = (west.mapActions || []).find(a => a.type === 'fixedMap' && a.target === 'PROLOGUE_SOUTH_VILLAGE');
assert(westExit, 'West hill has no route back to the village.');
assert(Number(westExit.x) === 15 && Number(westExit.y) === 7, 'West hill must be left from the east edge.');
assert(Number(westExit.targetX) === 2 && Number(westExit.targetY) === 3, 'South village must be entered from its west side.');
assert(westExit.triggerOnStep === true, 'West hill -> village local boundary must activate on contact.');
const southNorth = (south.mapActions || []).find(a => a.target === 'PROLOGUE_NORTH_VILLAGE');
const northSouth = (north.mapActions || []).find(a => a.target === 'PROLOGUE_SOUTH_VILLAGE');
const southWest = (south.mapActions || []).find(a => a.target === 'PROLOGUE_WEST_HILL');
assert(southNorth?.triggerOnStep === true, 'South -> north village boundary must activate on contact.');
assert(northSouth?.triggerOnStep === true, 'North -> south village boundary must activate on contact.');
assert(southWest?.triggerOnStep === true, 'South -> west hill village boundary must activate on contact.');

// 2) Reachability: not just definitions; the player must physically reach them.
const westReachable = collectReachableCells(west, west.entryPoint);
assert(westReachable.has(`${westExit.x},${westExit.y}`), 'West hill east exit is not walkable from the NEW GAME position.');
const southReachable = collectReachableCells(south, south.entryPoint);
const homeAction = (south.mapActions || []).find(a => a.eventId === 'prologue_home_loss');
const bossExit = (south.mapActions || []).find(a => a.eventId === 'prologue_south_exit_boss');
assert(homeAction && southReachable.has(`${homeAction.x},${homeAction.y}`), 'The destroyed-home event is not reachable from the south west entrance.');
assert(bossExit && southReachable.has(`${bossExit.x},${bossExit.y}`), 'The south village escape/boss boundary is not reachable from the west entrance.');
const hutExit = (hut.mapActions || []).find(a => a.eventId === 'present_depart_rees');
assert(hutExit, 'Rees hut has no departure action.');
assert(hut.tiles?.[Number(hutExit.y)]?.[Number(hutExit.x)] === 'S', 'Rees hut departure point must be visibly marked as an exit tile.');
assert(hutExit.triggerOnStep !== true, 'Rees hut -> another map must remain action-button driven.');
const hutReachable = collectReachableCells(hut, hut.entryPoint);
assert(hutReachable.has(`${hutExit.x},${hutExit.y}`), 'Rees hut exit is not physically reachable from the wake-up point.');

// 3) Opening combat pacing and victory semantics.
const rescue = events.prologue_south_arrival;
const rescueBattle = rescue?.actions?.find(a => a.type === 'BOSS');
assert(Number(rescueBattle?.value) === 802000, 'Opening rescue still uses a generic Rank-1 trash enemy.');
assert(rescueBattle?.endAfterTurns === undefined && rescueBattle?.endAtHpPercent === undefined && rescueBattle?.forcedLoss !== true,
  'Opening rescue must end by normal enemy HP=0, not an authored turn/HP shortcut.');
assert(battleSource.includes("if (value === null || value === undefined || value === '') return null;"), 'Event-battle numeric rule normalizer can still convert null into a 1-turn threshold.');
const rescueMonster = MonsterData?.getMonsterById?.(802000);
assert(rescueMonster && Number(rescueMonster.hp) >= 40, 'Opening rescue enemy is too fragile to form a real battle.');
assert(Number(south.enemyBoost?.statMultiplier || 1) === 1, 'Opening encounter pacing must not be achieved by raising enemy offense.');
assert(Number(south.enemyBoost?.hpMultiplier || 1) >= 2, 'Opening normal encounters need HP-only pacing so they do not evaporate in one hit.');

// 4) Prologue wipeout recovery belongs to the field, not battle-log healing.
const wipeEvent = events.prologue_field_wipeout_recover;
assert(wipeEvent?.actions?.some(a => a.type === 'HEAL'), 'Prologue field wipe recovery does not restore the party.');
assert(wipeEvent?.actions?.some(a => a.type === 'CONV' && a.value === 'PROLOGUE_LUCION_RECOVER'), 'Prologue field recovery scene is missing.');
assert(battleSource.includes("queuedLossEventId = 'prologue_field_wipeout_recover'"), 'Battle loss does not hand prologue recovery back to the field event system.');
assert(!battleSource.includes('古き光の加護がアルスを立ち上がらせた。'), 'Prologue recovery is still being narrated in the battle log.');

// 5) First boss -> Illuminacia must retain temporary LB99.
const firstBossEvent = events.prologue_south_exit_boss;
const lbAction = firstBossEvent?.actions?.find(a => a.type === 'TEMP_LB_START');
assert(Number(lbAction?.value) === 99 && lbAction?.persistAcrossBattles === true, 'First boss LB99 is not marked to persist into Illuminacia.');
const firstBossWinActions = events.prologue_first_boss_win?.actions || [];
const illuminaciaIndex = firstBossWinActions.findIndex(a => a.type === 'BOSS' && Number(a.value) === 802002);
const prematureClear = firstBossWinActions.findIndex(a => a.type === 'TEMP_LB_CLEAR');
assert(illuminaciaIndex >= 0, 'Illuminacia battle is not chained from the first-boss victory.');
assert(prematureClear < 0 || prematureClear > illuminaciaIndex, 'LB99 is cleared before Illuminacia starts.');
assert(battleSource.includes('tempStoryPower.persistAcrossBattles !== true'), 'Battle cleanup ignores persistent temporary story power.');

// 6) Ars growth/equipment/items must survive the five-year transition.
const prologueEventJson = JSON.stringify(Object.fromEntries(Object.entries(events).filter(([key]) => key.startsWith('prologue_'))));
assert(!prologueEventJson.includes('RESET_HERO_BASELINE'), 'A prologue route still resets Ars before the present era.');
for (const key of ['prologue_first_boss_loss', 'prologue_illuminacia_loss', 'prologue_hidden_special_end_win', 'prologue_hidden_special_end_loss']) {
  assert(events[key], `Missing prologue convergence event: ${key}`);
  assert(!(events[key].actions || []).some(a => a.type === 'RESET_HERO_BASELINE'), `${key} resets Ars growth/equipment.`);
}

// 7) Burned pendant exists only after the collapse, never in NEW GAME defaults.
const dbInitialStart = dbSource.indexOf('const INITIAL_DATA_TEMPLATE =');
const dbInitialEnd = dbSource.indexOf('window.DB = DB;', dbInitialStart);
const dbInitial = dbSource.slice(dbInitialStart, dbInitialEnd);
assert(dbInitialStart >= 0 && dbInitialEnd > dbInitialStart, 'Could not isolate database INITIAL_DATA_TEMPLATE.');
assert(!/items\s*:\s*\{[^}]*701009/.test(dbInitial), 'Burned pendant is still present in NEW GAME database items.');
const getInitialStart = mainSource.indexOf('getInitialData: () =>');
const getInitialEnd = mainSource.indexOf('// --- データ補完ロジック', getInitialStart);
const getInitial = mainSource.slice(getInitialStart, getInitialEnd);
assert(getInitialStart >= 0 && getInitialEnd > getInitialStart, 'Could not isolate App.getInitialData.');
assert(getInitial.includes("const template = (typeof INITIAL_DATA_TEMPLATE !== 'undefined'"), 'App.getInitialData has drifted away from the NEW GAME initial-data master.');
assert(!/items\s*:\s*\{[^}]*701009/.test(getInitial), 'Burned pendant is still present in App.getInitialData items.');
assert(mainSource.includes('migratedPrologueStage < 100') && mainSource.includes('delete data.items[701009]'), 'Old early-prologue saves are not cleaned of the legacy pre-owned pendant.');
assert((events.prologue_first_boss_loss?.actions || []).some(a => a.type === 'ITEM' && Number(a.id) === 701009), 'Collapse route no longer grants the burned pendant at the correct time.');

// 8) Spoiler-safe objectives: unknown place/person names must not be used before discovery.
assert(logicSource.includes("return '山小屋を出よう'"), 'Hut objective is not spoiler-safe.');
assert(logicSource.includes("return '山を下りた先の村の様子を確かめよう'"), 'Unknown village is named too early in the objective runtime.');
assert(logicSource.includes("return '村の長老と話そう'"), 'Village objective reveals its name before the elder identifies it.');
assert(!logicSource.includes('リースの山小屋を出て、リュミナ地方へ向かおう'), 'Objective still leaks the Lumina region name before discovery.');
const rescueAfter = scripts.PRESENT_LUMINA_RESCUE_AFTER || [];
const elderNamesVillage = rescueAfter.findIndex(line => String(line?.text || '').includes('ここはリュミナ村です'));
const rescueWin = events.present_lumina_rescue?.winActions || [];
const knowsName = rescueWin.findIndex(a => a.type === 'FLAG' && a.key === 'luminaVillageNameKnown' && a.state === true);
const afterConversation = rescueWin.findIndex(a => a.type === 'CONV' && a.value === 'PRESENT_LUMINA_RESCUE_AFTER');
assert(elderNamesVillage >= 0 && afterConversation >= 0 && knowsName > afterConversation, 'Village-name knowledge flag is set before the elder actually names the village.');

// 9) Player-facing opening copy must not expose implementation vocabulary.
const openingScriptKeys = [
  'PROLOGUE_WEST_HILL_OPENING','PROLOGUE_SOUTH_AMBUSH','PROLOGUE_LUCION_RECOVER','PROLOGUE_SOUTH_AFTER_BATTLE',
  'PROLOGUE_HOME_LOST','PROLOGUE_SOUTH_EXIT_BOSS','PROLOGUE_COLLAPSE_AND_PENDANT','PROLOGUE_FIRST_BOSS_WIN',
  'PROLOGUE_PRESENT_WAKE','PRESENT_REES_DEPART','PRESENT_LUMINA_RESCUE','PRESENT_LUMINA_RESCUE_AFTER'
];
const openingText = openingScriptKeys.flatMap(key => scripts[key] || []).map(line => String(line?.text || '')).join('\n');
for (const banned of ['南エリア','北エリア','パーティに加わった','限界を越えた力','LB99']) {
  assert(!openingText.includes(banned), `Opening player-facing text still contains implementation wording: ${banned}`);
}

// 10) Successful navigation itself must not spam the field log.
assert(!mainSource.includes('App.log(`${areaDef.name}に入った'), 'Fixed-map entry still emits a generic transition log.');
assert(!mainSource.includes("App.log('フィールドへ出た')") && !mainSource.includes('App.log("フィールドへ出た")'), 'World return still emits a generic transition log.');
assert(!dungeonSource.includes('App.log("ダンジョンから脱出した")') && !dungeonSource.includes("App.log('ダンジョンから脱出した')"), 'Dungeon exit still emits a generic transition log.');
assert(!dungeonSource.includes('if (link?.openLog || link?.log) App.log(link.openLog || link.log);'), 'Contact-driven floor/exit navigation still logs successful movement.');
assert(!dungeonSource.includes('if (link.openLog || link.log) App.log(link.openLog || link.log);'), 'Automatic stair navigation still logs successful movement.');
assert(!dungeonSource.includes('logIfNeeded(link.openLog || link.log ||'), 'Standing on a navigation tile still logs movement text.');

// 11) Contact transition must fire before encounter processing.
const triggerIndex = mainSource.indexOf('if (targetMapAction?.triggerOnStep === true');
const encounterIndex = mainSource.indexOf('Dungeon.handleMove(nx, ny)', triggerIndex);
assert(triggerIndex >= 0 && encounterIndex > triggerIndex, 'Step transition is not processed before encounter movement handling.');

// 12) Floor changes use stairs; inter-map dungeon links must not be forced auto transitions.
const badFloorLinks = [];
const badInterMapAuto = [];
for (const [areaKey, area] of Object.entries(dungeons)) {
  for (let i = 0; i < (area.floors || []).length; i++) {
    const floor = area.floors[i];
    for (const link of floor.floorLinks || []) {
      const tile = String(floor.tiles?.[Number(link.y)]?.[Number(link.x)] || '?').toUpperCase();
      if (link.toFloor !== undefined && link.toFloor !== null && !['U','D'].includes(tile)) {
        badFloorLinks.push(`${areaKey} F${i + 1} (${link.x},${link.y})=${tile}`);
      }
      if (link.toDungeon && link.auto === true) {
        badInterMapAuto.push(`${areaKey} F${i + 1} -> ${link.toDungeon}`);
      }
    }
  }
}
assert(badFloorLinks.length === 0, `Inter-floor links must use stair tiles only: ${badFloorLinks.join(', ')}`);
assert(badInterMapAuto.length === 0, `Inter-map dungeon links must remain action-button driven: ${badInterMapAuto.join(', ')}`);

console.log('PASS validate-prologue-quality-audit-20260810');
