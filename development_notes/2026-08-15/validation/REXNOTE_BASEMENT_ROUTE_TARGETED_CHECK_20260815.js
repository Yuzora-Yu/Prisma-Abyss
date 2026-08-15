'use strict';
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');
const root = path.resolve(__dirname, '../../..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8').replace(/\r\n?/g, '\n');

function loadMapContext() {
  const context = { console, window: {} };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(read('map.js') + `\nglobalThis.__map = { FIXED_MAPS, FIXED_DUNGEON_MAPS };`, context);
  vm.runInContext(read('maps_logic.js'), context);
  return context;
}

function testRexnoteFloorDirectionAndArchive() {
  const context = loadMapContext();
  const registry = context.window.MapRegistry;
  const base = context.__map.FIXED_DUNGEON_MAPS.REXNOTE_BASEMENT;
  assert(base, 'REXNOTE_BASEMENT must exist');
  assert.strictEqual(base.floorDirectionMode, 'basement');
  assert.strictEqual(base.floors.length, 5);

  const f4 = registry.getFixedDungeonFloor('REXNOTE_BASEMENT', 4);
  const f5 = registry.getFixedDungeonFloor('REXNOTE_BASEMENT', 5);
  assert(f4 && f5);
  assert.strictEqual(registry.getFixedFloorDirection(f4, { toFloor: 5 }, 4, 'REXNOTE_BASEMENT'), 'down');
  assert.strictEqual(registry.getFixedFloorActionLabel(f4, { toFloor: 5 }, 4, 'REXNOTE_BASEMENT'), '下の階へ');
  assert.strictEqual(registry.getFixedFloorDirection(f5, { toFloor: 4 }, 5, 'REXNOTE_BASEMENT'), 'up');

  const exitLink = f5.floorLinks.find(link => link.to === 'EXIT');
  assert(exitLink, 'hidden archive exit link must exist');
  assert.strictEqual(exitLink.x, 12);
  assert.strictEqual(exitLink.y, 1);
  assert.strictEqual(exitLink.triggerOnStep, false, 'hidden archive exit must require explicit action');
  assert.strictEqual(exitLink.requiredFlag, 'rexnoteRegulusDefeated');
  assert.deepStrictEqual(JSON.parse(JSON.stringify(exitLink.exitPoint)), {
    areaKey: 'REXNOTE_ESTATE', worldKey: 'WORLD', x: 13, y: 7
  });

  const boss = f5.bosses.find(entry => Number(entry.monsterId) === 301033);
  assert(boss, 'Regulus boss placement must exist');
  assert.strictEqual(boss.x, 12);
  assert.strictEqual(boss.y, 3);
  assert.strictEqual(boss.clearedFlag, 'rexnoteRegulusDefeated');
  assert.strictEqual(boss.startEventId, 'rexnote_regulus_battle');
  assert.strictEqual(boss.storyEventId, 'rexnote_regulus_clear');
}

function testDungeonExitContract() {
  const estateMap = {
    name: 'レクスノート邸内', width: 17, height: 11,
    tiles: Array.from({ length: 11 }, (_, y) => y === 0 || y === 10 ? 'W'.repeat(17) : `W${'T'.repeat(15)}W`),
    isFixed: true, isDungeon: false
  };
  const context = {
    console,
    window: {},
    FIXED_MAPS: { REXNOTE_ESTATE: estateMap },
    STORY_DATA: { areas: { REXNOTE_ESTATE: { worldKey: 'WORLD' } } },
    App: { data: { location: { area: 'REXNOTE_BASEMENT' }, progress: {}, dungeon: {} } },
    Field: { currentMapData: { isFixed: true, isDungeon: true } }
  };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(read('dungeon.js') + '\nglobalThis.__Dungeon = Dungeon;', context);
  const Dungeon = context.__Dungeon;

  const manualExit = {
    x: 12, y: 1, to: 'EXIT', triggerOnStep: false,
    exitPoint: { areaKey: 'REXNOTE_ESTATE', worldKey: 'WORLD', x: 13, y: 7 }
  };
  assert.strictEqual(Dungeon.isFixedExitStepTile('S', manualExit), false);
  assert.strictEqual(Dungeon.isFixedExitStepTile('S', { to: 'EXIT' }), true);

  let captured = null;
  Dungeon.exit = (isWipedOut, forced) => { captured = { isWipedOut, forced }; };
  assert.strictEqual(Dungeon.followFixedFloorLink(manualExit, context.Field.currentMapData), true);
  assert(captured && captured.forced, 'manual fixed exit must resolve a forced return point');
  assert.strictEqual(captured.forced.areaKey, 'REXNOTE_ESTATE');
  assert.strictEqual(captured.forced.x, 13);
  assert.strictEqual(captured.forced.y, 7);
  assert(captured.forced.mapData, 'fixed-map exit must resolve mapData for safety validation');
  assert.strictEqual(captured.forced.mapData.tiles[7][13], 'T');
}

function testStoryBossChain() {
  const story = read('story.js');
  const monsters = read('monsters.js');
  const items = read('items.js');
  assert(story.includes('"rexnote_regulus_battle"'));
  assert(story.includes('{ "type": "BOSS", "value": 301033, "winEventId": "rexnote_regulus_clear" }'));
  assert(story.includes('{ "type": "FLAG", "key": "rexnoteRegulusDefeated", "refreshField": true }'));
  assert(story.includes('{ "type": "IF_ITEM", "id": 701013, "count": 1'));
  assert(monsters.includes('"id":301033') && monsters.includes('"name":"魔導司書レグルス"'));
  assert(items.includes('"id": 701013') && items.includes('"name": "レクスノートの魔道書"'));
}

function testNewsSingleRecord() {
  const news = read('news.js');
  const matches = news.match(/date:\s*"2026\/08\/15"/g) || [];
  assert.strictEqual(matches.length, 1, '2026/08/15 NEWS_DATA must remain a single record');
  assert(news.includes('レクスノート邸地下の階段表示と隠し書庫からの帰還を安定化しました'));
}

function main() {
  testRexnoteFloorDirectionAndArchive();
  testDungeonExitContract();
  testStoryBossChain();
  testNewsSingleRecord();
  console.log(JSON.stringify({
    floorDirection: 'ok',
    hiddenArchiveExit: 'ok',
    fixedMapReturnResolution: 'ok',
    regulusBossChain: 'ok',
    news: 'ok'
  }, null, 2));
}

main();
