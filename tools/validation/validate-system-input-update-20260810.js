const fs = require('fs');
const vm = require('vm');
const { loadMapRuntime } = require('./validation-helpers');

const root = process.cwd();
const read = file => fs.readFileSync(`${root}/${file}`, 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const { context } = loadMapRuntime(root);
const { FIXED_MAPS, STORY_DATA, MapRegistry } = context;

// 1) Opening villages are villages (not dungeon escape contexts) while keeping habitat encounters.
for (const key of ['PROLOGUE_SOUTH_VILLAGE', 'PROLOGUE_NORTH_VILLAGE']) {
  const def = FIXED_MAPS[key];
  assert(def, `${key}: missing fixed map`);
  assert(def.isDungeon !== true, `${key}: must not be marked as a dungeon`);
  assert(def.useHabitatEncounters === true, `${key}: habitat encounters must remain enabled`);
}

const mainCode = read('main.js');
assert(/Field\.currentMapData\.isDungeon \|\| Field\.currentMapData\.useHabitatEncounters === true/.test(mainCode),
  'tryRandomEncounter must accept useHabitatEncounters independently from isDungeon');
assert(/!Field\.currentMapData\.isDungeon && Field\.currentMapData\.useHabitatEncounters === true/.test(mainCode),
  'Field.move must roll encounters on non-dungeon habitat maps');
const menuCode = read('menus.js');
const escapeStart = menuCode.indexOf('isDungeonEscapeContext:');
const escapeEnd = menuCode.indexOf('featureButton:', escapeStart);
assert(escapeStart >= 0 && escapeEnd > escapeStart, 'Menu.isDungeonEscapeContext helper missing');
const escapeSlice = menuCode.slice(escapeStart, escapeEnd);
assert(escapeSlice.includes('mapData?.isDungeon') && !escapeSlice.includes('useHabitatEncounters'),
  'Escape visibility must remain tied to dungeon semantics, not habitat encounters');

// 2) Rees hut has a world-map location and can be found by the world-area registry.
const hut = FIXED_MAPS.REES_MOUNTAIN_HUT;
assert(hut, 'REES_MOUNTAIN_HUT: missing fixed map');
assert(Number(hut.exitPoint?.x) === 66 && Number(hut.exitPoint?.y) === 58,
  'REES_MOUNTAIN_HUT: exitPoint must be (66,58)');
assert(Array.isArray(hut.worldExits) && hut.worldExits.some(exit => Number(exit.worldX) === 66 && Number(exit.worldY) === 58),
  'REES_MOUNTAIN_HUT: worldExits must contain (66,58)');
const hutArea = STORY_DATA.areas.REES_MOUNTAIN_HUT;
assert(hutArea && Number(hutArea.centerX) === 66 && Number(hutArea.centerY) === 58,
  'REES_MOUNTAIN_HUT: STORY_DATA world coordinate must be (66,58)');
assert(MapRegistry.getWorldAreaAt(66, 58)?.[0] === 'REES_MOUNTAIN_HUT',
  'REES_MOUNTAIN_HUT: MapRegistry must resolve the hut at (66,58)');
const hutSurface = MapRegistry.getWorldSurfaceAt(66, 58);
assert(hutSurface && !hutSurface.isSea && !hutSurface.isImpassable,
  'REES_MOUNTAIN_HUT: world coordinate (66,58) must be a walkable land tile');

// 3) Equipment drop base selection is two-stage: type, then baseName.
const selectorStart = mainCode.indexOf('pickBasicDropEquipBase:');
const selectorEnd = mainCode.indexOf('\n\t/* main.js: App.createEquipByFloor 関数 */', selectorStart);
assert(selectorStart >= 0 && selectorEnd > selectorStart, 'pickBasicDropEquipBase helper missing');
let selectorFragment = mainCode.slice(selectorStart, selectorEnd).trim().replace(/,$/, '');
const selector = vm.runInNewContext(`({${selectorFragment}}).pickBasicDropEquipBase`, { Math, Set });
assert(typeof selector === 'function', 'pickBasicDropEquipBase is not executable');

const types = ['武器', '盾', '頭', '体', '足'];
const weaponBases = ['剣', '斧', '短剣', '杖', '槍', '弓'];
const synthetic = [
  ...weaponBases.map((baseName, i) => ({ id:`w${i}`, type:'武器', baseName })),
  { id:'s1', type:'盾', baseName:'盾' }, { id:'s2', type:'盾', baseName:'腕輪' },
  { id:'h1', type:'頭', baseName:'兜' }, { id:'h2', type:'頭', baseName:'帽子' },
  { id:'b1', type:'体', baseName:'鎧' }, { id:'b2', type:'体', baseName:'ローブ' },
  { id:'f1', type:'足', baseName:'ブーツ' }, { id:'f2', type:'足', baseName:'くつ' },
];
const sequenceRandom = values => {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)];
};
types.forEach((type, index) => {
  const picked = selector(synthetic, sequenceRandom([(index + 0.01) / 5, 0.01, 0.01]));
  assert(picked?.type === type, `drop type bucket ${index}: expected ${type}, got ${picked?.type}`);
});
weaponBases.forEach((baseName, index) => {
  const picked = selector(synthetic, sequenceRandom([0.01, (index + 0.01) / weaponBases.length, 0.01]));
  assert(picked?.type === '武器' && picked?.baseName === baseName,
    `weapon base bucket ${index}: expected ${baseName}, got ${picked?.baseName}`);
});

// Every normal Rank window must actually contain all five parts and all six weapon baseNames;
// otherwise the requested 20% / 1-in-6 policy could not be satisfied at that Rank.
const equipContext = { window:{} };
vm.createContext(equipContext);
vm.runInContext(read('equips.js'), equipContext);
const randomEquipPool = (equipContext.window.EQUIP_MASTER || []).filter(eq => !eq.noRandom);
for (let rank = 1; rank <= 200; rank++) {
  let rankCandidates = randomEquipPool.filter(eq => Number(eq.rank) <= rank && Number(eq.rank) >= Math.max(1, rank - 15));
  if (rankCandidates.length === 0) rankCandidates = randomEquipPool.filter(eq => Number(eq.rank) <= rank);
  const rankTypes = new Set(rankCandidates.map(eq => eq.type));
  const rankWeaponBases = new Set(rankCandidates.filter(eq => eq.type === '武器').map(eq => eq.baseName));
  assert(types.every(type => rankTypes.has(type)), `Rank ${rank}: not all five equipment types are available`);
  assert(weaponBases.every(baseName => rankWeaponBases.has(baseName)), `Rank ${rank}: not all six weapon baseNames are available`);
}
assert(/options\?\.balancedDropBase === true[\s\S]{0,180}App\.pickBasicDropEquipBase\(candidates\)/.test(mainCode),
  'createEquipByFloor must expose the balanced selector for explicit basic monster drops');

const battleCode = read('battle.js');
const rankStart = battleCode.indexOf('getEquipmentRewardRank:');
const rankEnd = battleCode.indexOf('\n    getEquipmentRewardFloor:', rankStart);
assert(rankStart >= 0 && rankEnd > rankStart, 'getEquipmentRewardRank helper missing');
const rankSlice = battleCode.slice(rankStart, rankEnd);
const enemyRankPos = rankSlice.indexOf('enemy?.rank');
const baseRankPos = rankSlice.indexOf('base.rank');
const generatedFloorPos = rankSlice.indexOf('enemy?.generatedFloor');
assert(enemyRankPos >= 0 && baseRankPos > enemyRankPos && generatedFloorPos > baseRankPos,
  'equipment reward Rank must prefer monster Rank before generated floor');
assert(/const rewardRank = Battle\.getEquipmentRewardRank\(e, 1\)/.test(battleCode),
  'normal battle equipment drops must resolve reward Rank from the monster, without map floor fallback');
assert(/App\.createEquipByFloor\('drop', rewardRank, fixedPlus, \{ balancedDropBase:true \}\)/.test(battleCode),
  'normal battle equipment drops must request the balanced type/baseName selector');

// 4) D-pad remains and center analog stick exists with Pointer Events movement.
const html = read('index.html');
for (const id of ['btn-up', 'btn-down', 'btn-left', 'btn-right']) assert(html.includes(`id="${id}"`), `${id}: D-pad button missing`);
assert(html.includes('id="move-stick"') && html.includes('id="move-stick-knob"'), 'center analog stick DOM missing');
const css = read('modern-polish.css');
assert(css.includes('"left stick right"') && css.includes('.move-stick') && css.includes('grid-area: stick'),
  'analog stick must occupy the D-pad center cell');
assert(mainCode.includes('const bindMoveStick = () =>') && mainCode.includes('stick.onpointerdown') && mainCode.includes('stick.onpointermove') && /activeDir = dirKey;\s*startMove\(dir\[0\], dir\[1\]\)/.test(mainCode),
  'analog stick Pointer Events movement binding missing');

// 5) Tap-to-walk reuses BFS + existing movement, without changing tile rendering architecture.
assert(/findAutoWalkPath:[\s\S]*Dungeon\.findShortestGridPath/.test(mainCode),
  'local tap-to-walk must reuse Dungeon.findShortestGridPath');
assert(/requestAutoWalkTo:[\s\S]*Field\.move\(next\.dx, next\.dy\)/.test(mainCode),
  'auto-walk must execute the existing Field.move collision/event path');
assert(/findWrappedWorldAutoWalkPath/.test(mainCode), 'world-map wrapped auto-walk pathfinder missing');
const phaserCode = read('phaser-field.js');
assert(/getWorldPoint\(Number\(pointer\.x\), Number\(pointer\.y\)\)/.test(phaserCode),
  'Phaser tap-to-walk must convert screen coordinates to world coordinates');
assert(/field\.requestAutoWalkTo\(tileX, tileY\)/.test(phaserCode),
  'Phaser tap-to-walk must hand the target tile to Field.requestAutoWalkTo');

console.log('System/input update validation passed: village encounters, Rees hut coordinate, Rank drops, analog input, and tap-to-walk are wired correctly.');
