'use strict';
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');
const root = path.resolve(__dirname, '../..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8').replace(/\r\n?/g, '\n');

function testEntityIdentity() {
  let code = read('main.js');
  code = code.slice(0, code.indexOf('const App = {'));
  code += '\nglobalThis.__classes = { Entity, Player, Monster };';
  const context = {
    console,
    window: { JOB_SKILLS: {} },
    DB: {
      CHARACTERS: [{ id: 501, img: 'lucion-face.png' }],
      SKILLS: [{ id: 1, name: 'attack' }]
    },
    CONST: { SKILL_TREES: {} },
    App: { calcStats: () => ({}) }
  };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(code, context);
  const { Player, Monster } = context.__classes;
  const monster = new Monster({ id: 501, name: 'ストーンジェリー', hp: 10, image: null });
  assert.strictEqual(monster.img, null, 'monster 501 must not inherit character 501 image');
  assert.strictEqual(monster.image, null, 'monster 501 image must remain monster-owned');
  const player = new Player({ id: 501, charId: 501, name: 'リュシオン', hp: 10, level: 1, job: '勇者' });
  assert.strictEqual(player.img, 'lucion-face.png', 'player must keep character-master fallback');
}

function testMapData() {
  const context = { console, window: {} };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(read('map.js') + '\nglobalThis.__map = { STORY_DATA, MAP_MASTER, FIXED_AREA_MAP_KEYS, FIXED_MAPS, FIXED_DUNGEON_MAPS, SEA_ENCOUNTER_MONSTERS, FIELD_ENCOUNTER_ZONES };', context);
  vm.runInContext(read('maps_logic.js'), context);
  const { STORY_DATA, MAP_MASTER, FIXED_AREA_MAP_KEYS, FIXED_MAPS, FIXED_DUNGEON_MAPS } = context.__map;
  assert.strictEqual(STORY_DATA.areas.REXNOTE_ESTATE.fixedMapKey, 'REXNOTE_ESTATE_GROUNDS');
  assert.strictEqual(MAP_MASTER.REXNOTE_ESTATE_GROUNDS.id, 'MAP000077');
  assert.strictEqual(FIXED_AREA_MAP_KEYS.REXNOTE_ESTATE_GROUNDS, 'REXNOTE_ESTATE_GROUNDS');
  const grounds = FIXED_MAPS.REXNOTE_ESTATE_GROUNDS;
  assert(grounds && grounds.width === 17 && grounds.height === 13);
  const hayate = grounds.mapActors.find(a => a.actorId === 'hayate_rexnote_sighting');
  assert(hayate && hayate.x === 5 && hayate.y === 7);
  assert.strictEqual(grounds.tiles[11][8], 'S', 'grounds world exit must be an exit tile');
  const interiorExit = FIXED_MAPS.REXNOTE_ESTATE.mapActions.find(a => a.type === 'fixedMap' && a.target === 'REXNOTE_ESTATE_GROUNDS');
  assert(interiorExit && interiorExit.x === 8 && interiorExit.y === 9 && interiorExit.targetX === 8 && interiorExit.targetY === 3 && interiorExit.triggerOnStep === true);
  assert.strictEqual(FIXED_MAPS.REXNOTE_ESTATE.worldExits.length, 0);

  const thunder = FIXED_DUNGEON_MAPS.THUNDER_FORT;
  const candidates = context.window.MapRegistry.getMapActorActionCandidates(thunder.floors ? thunder.floors[0] : thunder);
  const marie = candidates.find(c => c.actorId === 'marie_undersea_volcano_departure' && c.actorStateId === 'undersea_volcano_departure_story');
  const frieda = candidates.find(c => c.actorId === 'frieda_baron_thunder_depths' && c.actorStateId === 'undersea_volcano_departure_story');
  assert(marie && marie.x === 13 && marie.y === 21, 'Marie state placement must be left of Freida');
  assert(frieda && frieda.x === 14 && frieda.y === 21, 'Freida must remain at 14,21');

  const walkable = (x, y) => x >= 0 && y >= 0 && y < grounds.tiles.length && x < grounds.tiles[y].length && grounds.tiles[y][x] !== 'W';
  const start = grounds.entryPoint;
  const q = [[start.x, start.y]];
  const seen = new Set([`${start.x},${start.y}`]);
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx=x+dx, ny=y+dy, k=`${nx},${ny}`;
      if (!seen.has(k) && walkable(nx,ny)) { seen.add(k); q.push([nx,ny]); }
    }
  }
  for (const [label, point] of [['Hayate', hayate], ['estate door', {x:8,y:2}], ['world exit', {x:8,y:11}]]) {
    assert(seen.has(`${point.x},${point.y}`), `${label} must be reachable from grounds entry`);
  }
}

async function testGraphicsLoader() {
  let active = 0, maxActive = 0;
  const attempts = new Map();
  class MockImage {
    constructor() { this.complete = false; this.naturalWidth = 0; }
    set src(value) {
      this._src = value;
      active += 1; maxActive = Math.max(maxActive, active);
      const n = (attempts.get(value) || 0) + 1; attempts.set(value, n);
      setTimeout(() => {
        active -= 1;
        if (n === 1) { this.onerror?.(new Error('transient')); return; }
        this.complete = true; this.naturalWidth = 32; this.onload?.();
      }, 1);
    }
    get src() { return this._src; }
  }
  const context = {
    console,
    Image: MockImage,
    setTimeout,
    clearTimeout,
    requestAnimationFrame: (cb) => setTimeout(cb, 0),
    window: {}
  };
  context.globalThis = context;
  context.window = context;
  vm.createContext(context);
  vm.runInContext(read('assets.js'), context);
  vm.runInContext(read('monsters.js'), context);
  vm.runInContext('globalThis.__assetsTest = { PRISMA_ASSETS, GRAPHICS };', context);
  const { PRISMA_ASSETS, GRAPHICS } = context.__assetsTest;
  const graphicsKeys = Object.keys(PRISMA_ASSETS.graphics);
  const startup = PRISMA_ASSETS.cacheWarmup.initialGraphicKeys.filter(k => GRAPHICS.data[k]);
  const battle = graphicsKeys.filter(k => k.startsWith('battle_bg_'));
  assert(battle.length > 0 && battle.every(k => startup.includes(k)), 'all battle backgrounds must be startup-memory keys');
  const startupGraphicUrls = new Set(startup.map(k => GRAPHICS.data[k]).filter(Boolean));
  const startupRaw = PRISMA_ASSETS.cacheWarmup.startupImages || [];
  const supplementalRaw = startupRaw.filter(src => !startupGraphicUrls.has(src));
  assert(supplementalRaw.length < startupRaw.length, 'raw startup preload must have GRAPHICS overlap to exclude');
  const sample = startup.slice(0, 12);
  await GRAPHICS.load(null, { keys: sample, concurrency: 3, maxAttempts: 3 });
  assert(maxActive <= 3, `loader exceeded concurrency: ${maxActive}`);
  assert(sample.every(k => GRAPHICS.images[k]?.naturalWidth > 0), 'retry loader must resolve transient failures');
  for (const k of sample) assert.strictEqual(attempts.get(GRAPHICS.data[k]), 2, `${k} should retry once`);
  return {
    all: graphicsKeys.length,
    startup: startup.length,
    battle: battle.length,
    startupRaw: startupRaw.length,
    startupSupplemental: supplementalRaw.length,
    maxActive
  };
}

function testStaticContracts() {
  const menu = read('menus_config.js');
  assert(menu.indexOf('id="config-tab-save"') < menu.indexOf('id="config-tab-settings"'), 'save tab must precede settings tab');
  const battle = read('battle.js');
  assert(battle.includes('disableAutoForManualStartEncounter'));
  assert(!battle.includes('disableAutoForRareEncounter'));
  const main = read('main.js');
  assert(main.includes('preloadStartupImages: async (options = {})'));
  assert(main.includes('excludeUrls: startupGraphicUrls'), 'GRAPHICS startup URLs must not be raw-preloaded twice');
  assert(main.includes('while (!cancelled && index < urls.length)'), 'startup raw preloader must stop scheduling after timeout');
  const story = read('story.js');
  const eventMatch = story.match(/"hayate_rexnote_sighting"\s*:\s*\{([\s\S]*?)\n\s*\},\n\s*"rexnote_estate_arrival"/);
  assert(eventMatch && eventMatch[1].includes('hayateRexnoteSighted'));
  assert(!eventMatch[1].includes('"type": "CONV"') && !eventMatch[1].includes('"type": "LOG"'), 'Hayate encounter must remain silent');
  const phaser = read('phaser-field.js');
  assert(phaser.includes('drawUniformFixedMapGround'));
  assert(phaser.includes('drawFixedMapBoundaryBackdrop'));
  assert(phaser.includes('startDecorAnimation(scene)'));
  const electricBlock = phaser.match(/if \(decor\.animate === 'electric'[\s\S]*?\n\s*}\n/);
  assert(electricBlock && electricBlock[0].includes('registerDecorAnimation') && !electricBlock[0].includes('scene.tweens.add'), 'electric decor must use shared timer');
}

(async () => {
  testEntityIdentity();
  testMapData();
  testStaticContracts();
  const graphics = await testGraphicsLoader();
  console.log(JSON.stringify({ entityIdentity: 'ok', mapData: 'ok', staticContracts: 'ok', graphics }, null, 2));
})().catch(err => { console.error(err); process.exit(1); });
