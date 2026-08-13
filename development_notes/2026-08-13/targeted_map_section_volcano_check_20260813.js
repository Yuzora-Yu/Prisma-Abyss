'use strict';
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');
const root = path.resolve(__dirname, '../..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8').replace(/\r\n?/g, '\n');

function loadMapContext() {
  const context = { console, window: {} };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(read('map.js') + `\nglobalThis.__map = {
    STORY_DATA, MAP_MASTER, MAP_IDS, RETIRED_MAP_IDS, FIXED_AREA_MAP_KEYS,
    FIXED_AREA_MAP_SECTION_INDEX, FIXED_MAPS, FIXED_DUNGEON_MAPS
  };`, context);
  vm.runInContext(read('maps_logic.js'), context);
  return context;
}

function reachable(mapDef, start, impassable = []) {
  const blocked = new Set(['W', ...impassable].map(v => String(v).toUpperCase()));
  const q = [[Number(start.x), Number(start.y)]];
  const seen = new Set([`${Number(start.x)},${Number(start.y)}`]);
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx = x + dx, ny = y + dy, key = `${nx},${ny}`;
      if (seen.has(key) || ny < 0 || nx < 0 || ny >= mapDef.tiles.length || nx >= mapDef.tiles[ny].length) continue;
      const tile = String(mapDef.tiles[ny][nx] || 'W').toUpperCase();
      if (blocked.has(tile)) continue;
      seen.add(key);
      q.push([nx, ny]);
    }
  }
  return seen;
}

function testMapGrouping() {
  const context = loadMapContext();
  const { STORY_DATA, MAP_MASTER, RETIRED_MAP_IDS, FIXED_AREA_MAP_KEYS, FIXED_AREA_MAP_SECTION_INDEX, FIXED_MAPS } = context.__map;
  const registry = context.window.MapRegistry;

  assert.strictEqual(MAP_MASTER.REXNOTE_ESTATE.id, 'MAP000071');
  assert.strictEqual(MAP_MASTER.REXNOTE_ESTATE_GROUNDS, undefined, 'Rexnote outdoor section must not own a separate MAP');
  assert.strictEqual(RETIRED_MAP_IDS.MAP000077.canonicalMapKey, 'REXNOTE_ESTATE', 'obsolete MAP id must be retired instead of recycled');
  assert.strictEqual(FIXED_AREA_MAP_KEYS.REXNOTE_ESTATE_GROUNDS, 'REXNOTE_ESTATE');
  assert.strictEqual(FIXED_AREA_MAP_SECTION_INDEX.REXNOTE_ESTATE_GROUNDS, 0);
  assert.strictEqual(FIXED_AREA_MAP_SECTION_INDEX.REXNOTE_ESTATE, 1);

  const rexOutside = FIXED_MAPS.REXNOTE_ESTATE_GROUNDS;
  const rexInside = FIXED_MAPS.REXNOTE_ESTATE;
  assert.strictEqual(rexOutside.name, 'レクスノート邸');
  assert.strictEqual(rexInside.name, 'レクスノート邸内');
  assert.strictEqual(rexOutside.mapId, 'MAP000071');
  assert.strictEqual(rexInside.mapId, 'MAP000071');
  assert.strictEqual(rexOutside.floorId, 'MAP000071-00');
  assert.strictEqual(rexInside.floorId, 'MAP000071-01');
  const rexBinding = registry.getMapBindingForArea('REXNOTE_ESTATE_GROUNDS');
  assert.strictEqual(rexBinding.areaKey, 'REXNOTE_ESTATE_GROUNDS');
  assert.strictEqual(rexBinding.mapKey, 'REXNOTE_ESTATE');
  assert.strictEqual(rexBinding.mapId, 'MAP000071');
  assert.strictEqual(rexBinding.section, 0);
  assert.strictEqual(rexBinding.sectionId, 'MAP000071-00');

  const reesOutside = FIXED_MAPS.REES_MOUNTAIN_HUT_EXTERIOR;
  const reesInside = FIXED_MAPS.REES_MOUNTAIN_HUT;
  assert(reesOutside, 'Rees hut outdoor section must exist');
  assert.strictEqual(STORY_DATA.areas.REES_MOUNTAIN_HUT.fixedMapKey, 'REES_MOUNTAIN_HUT_EXTERIOR');
  assert.strictEqual(reesOutside.name, 'リースの山小屋');
  assert.strictEqual(reesInside.name, 'リースの山小屋内');
  assert.strictEqual(reesOutside.mapId, 'MAP000069');
  assert.strictEqual(reesInside.mapId, 'MAP000069');
  assert.strictEqual(reesOutside.floorId, 'MAP000069-00');
  assert.strictEqual(reesInside.floorId, 'MAP000069-01');

  const outsideDoor = reesOutside.mapActions.find(a => a.type === 'fixedMap' && a.target === 'REES_MOUNTAIN_HUT');
  const insideDoor = reesInside.mapActions.find(a => a.type === 'fixedMap' && a.target === 'REES_MOUNTAIN_HUT_EXTERIOR');
  assert(outsideDoor && outsideDoor.x === 8 && outsideDoor.y === 3);
  assert(insideDoor && insideDoor.x === 5 && insideDoor.y === 7 && insideDoor.triggerOnStep === true);
  assert.strictEqual(insideDoor.requiredFlag, 'prologueReesDepartureTalkSeen');
  assert.strictEqual(insideDoor.lockedText, '出る前に、リースへ声をかけておこう。');
  assert.strictEqual(reesInside.worldExits.length, 0, 'leaving the interior must move to the outdoor section, not directly to WORLD');
  const worldExit = reesOutside.worldExits.find(e => e.x === 8 && e.y === 11);
  assert(worldExit && worldExit.setFlag === 'prologueDepartedReesHut', 'departure flag belongs to the actual outdoor -> world exit');

  for (const [name, def, points] of [
    ['Rees outdoor', reesOutside, [outsideDoor, worldExit]],
    ['Rexnote outdoor', rexOutside, [{x:8,y:2}, {x:8,y:11}, rexOutside.mapActors.find(a => a.actorId === 'hayate_rexnote_sighting')]]
  ]) {
    const seen = reachable(def, def.entryPoint, def.impassableTiles || []);
    for (const point of points) assert(seen.has(`${point.x},${point.y}`), `${name} anchor ${point.x},${point.y} must be reachable`);
  }

  assert(!rexOutside.name.includes('外周') && !rexInside.name.includes('外周'), 'player-facing Rexnote names must not use 外周');
}

function testUnderseaVolcanoData() {
  const context = loadMapContext();
  const volcano = context.__map.FIXED_DUNGEON_MAPS.UNDERSEA_VOLCANO;
  assert(volcano && volcano.floors.length === 5);
  const [f1, f2, f3, f4, f5] = volcano.floors;
  assert(f1.procedural && f2.procedural && f3.procedural, 'volcano layers 1-3 must be procedural');
  assert(!f4.procedural && !f5.procedural, 'research and boss anchors must remain fixed');
  assert.strictEqual(f1.proceduralTerrain.mode, 'impassable');
  assert.strictEqual(f2.proceduralTerrain.mode, 'damage');
  assert.strictEqual(f3.proceduralTerrain.mode, 'impassable');
  assert.strictEqual(f1.proceduralTerrain.tile, 'M');
  assert.strictEqual(f4.entryEventId, 'undersea_volcano_research_entry');
  assert.strictEqual(f5.entryEventId, 'undersea_volcano_battle_area_entry');
  assert.strictEqual(f5.bosses[0].monsterId, 301063);
  assert.strictEqual(f5.bosses[0].clearedFlag, 'underseaVolcanoCleared');
  const backToF3 = f4.floorLinks.find(link => Number(link.toFloor) === 3);
  assert(backToF3 && backToF3.targetX === undefined && backToF3.targetY === undefined,
    'fixed research section must return to the generated floor through its dynamic D marker');
}

function loadDungeonContext() {
  const context = {
    console,
    window: {},
    DB: { ITEMS: [{ id: 1, name: 'test', type: '消耗品', rank: 1, price: 1 }] },
    ITEMS_DATA: [{ id: 1, name: 'test', type: '消耗品', rank: 1, price: 1 }],
    Math,
    App: { data: { progress: {}, dungeon: {}, party: [] } },
    Field: { x: 0, y: 0, currentMapData: null }
  };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(read('dungeon.js') + '\nglobalThis.__Dungeon = Dungeon;', context);
  return context;
}

function testProceduralTerrainContract() {
  const context = loadDungeonContext();
  const Dungeon = context.__Dungeon;
  assert.strictEqual(Dungeon.fixedProceduralGenerationVersion, 3);

  const makeGrid = () => {
    const size = 17;
    const map = Array.from({ length: size }, (_, y) => Array.from({ length: size }, (_, x) =>
      (x === 0 || y === 0 || x === size - 1 || y === size - 1) ? 'W' : 'T'));
    map[1][1] = 'U';
    map[15][15] = 'D';
    map[1][15] = 'C';
    return map;
  };

  const impassableGrid = makeGrid();
  const impassable = Dungeon.applyFixedProceduralTerrain(
    impassableGrid,
    { proceduralTerrain: { tile: 'M', density: 0.35, mode: 'impassable' } },
    { entryPoint: {x:1,y:1}, exitPoint: {x:15,y:15}, chests: [{x:15,y:1}] }
  );
  assert(impassable.applied[0].count > 0, 'impassable terrain should actually place cells');
  assert(impassable.impassableTiles.includes('M'));
  const impMap = { tiles: impassableGrid.map(row => row.join('')) };
  const impSeen = reachable(impMap, {x:1,y:1}, impassable.impassableTiles);
  assert(impSeen.has('15,15'), 'exit must remain reachable around impassable procedural terrain');
  assert(impSeen.has('15,1'), 'chest anchor must remain reachable around impassable procedural terrain');

  const damageGrid = makeGrid();
  const damage = Dungeon.applyFixedProceduralTerrain(
    damageGrid,
    { proceduralTerrain: { tile: 'M', density: 0.35, mode: 'damage' } },
    { entryPoint: {x:1,y:1}, exitPoint: {x:15,y:15}, chests: [{x:15,y:1}] }
  );
  assert(damage.applied[0].count > 0, 'damage terrain should actually place cells');
  assert(!damage.impassableTiles.includes('M'), 'damage-mode magma must remain walkable');

  const syntheticGood = {
    generatedFromAbyssLogic: true,
    proceduralGenerationVersion: 3,
    width: 5, height: 5,
    tiles: ['WWWWW','WUTTW','WMTTW','WTTDW','WWWWW'],
    entryPoint: {x:1,y:1},
    floorLinks: [{x:1,y:1,to:'EXIT'},{x:3,y:3,toFloor:2}],
    chests: [],
    impassableTiles: ['M']
  };
  assert.strictEqual(Dungeon.isValidFixedProceduralFloor(syntheticGood), true);
  const syntheticBad = { ...syntheticGood, tiles: ['WWWWW','WUMWW','WMMWW','WMTDW','WWWWW'] };
  assert.strictEqual(Dungeon.isValidFixedProceduralFloor(syntheticBad), false, 'unreachable cached floor must be rejected');
}

function testGeneratedFloorIntegration() {
  const context = loadDungeonContext();
  const Dungeon = context.__Dungeon;
  Dungeon.buildRandomFloorLayout = () => {
    const size = 17;
    Dungeon.map = Array.from({ length: size }, (_, y) => Array.from({ length: size }, (_, x) =>
      (x === 0 || y === 0 || x === size - 1 || y === size - 1) ? 'W' : 'T'));
    Dungeon.map[2][14] = 'C';
    context.Field.x = 1;
    context.Field.y = 1;
  };

  const template = {
    encounterRank: 52,
    forceMaze: true,
    procedural: true,
    proceduralEntryReturnsOutside: true,
    proceduralTerrain: { tile: 'M', density: 0.20, mode: 'impassable' }
  };
  const first = Dungeon.getOrCreateFixedProceduralFloor('UNDERSEA_VOLCANO_TEST', 1, template);
  assert(first.generatedFromAbyssLogic, 'full generator path must produce a fixed-procedural floor');
  assert(first.impassableTiles.includes('M'), 'full generator path must preserve authored impassable magma');
  assert(first.tiles.some(row => row.includes('M')), 'full generator path must place magma');
  assert.strictEqual(first.floorLinks[0].to, 'EXIT');
  assert(Dungeon.isValidFixedProceduralFloor(first), 'generated floor must satisfy cached-floor validation');

  const second = Dungeon.getOrCreateFixedProceduralFloor('UNDERSEA_VOLCANO_TEST', 1, template);
  assert.deepStrictEqual(second.tiles, first.tiles, 'same run must reuse the cached generated floor');
  const firstRun = context.App.data.progress.fixedProceduralRunIds.UNDERSEA_VOLCANO_TEST;
  context.FIXED_DUNGEON_MAPS = { UNDERSEA_VOLCANO_TEST: { floors: [{ procedural: true }] } };
  Dungeon.beginFixedProceduralRun('UNDERSEA_VOLCANO_TEST');
  assert.strictEqual(context.App.data.progress.fixedProceduralRunIds.UNDERSEA_VOLCANO_TEST, firstRun + 1, 'new entry must advance the procedural run');
}

function testRuntimeContract() {
  const main = read('main.js');
  assert(main.includes('const lockedMessage = targetMapAction.lockedText || targetMapAction.lockedLog || null;'),
    'locked step transitions must preserve authored feedback');
  const dungeon = read('dungeon.js');
  assert(dungeon.includes("if (tile === 'M')"), 'walkable magma must continue to use the common lava damage path');
  assert(dungeon.includes('Dungeon.applyFixedProceduralTerrain(generated, template'), 'procedural terrain must be applied in the common fixed-procedural generator');
}

function main() {
  testMapGrouping();
  testUnderseaVolcanoData();
  testProceduralTerrainContract();
  testGeneratedFloorIntegration();
  testRuntimeContract();
  console.log(JSON.stringify({ mapGrouping: 'ok', reesExterior: 'ok', underseaVolcano: 'ok', proceduralTerrain: 'ok', generatedFloorIntegration: 'ok' }, null, 2));
}

main();
