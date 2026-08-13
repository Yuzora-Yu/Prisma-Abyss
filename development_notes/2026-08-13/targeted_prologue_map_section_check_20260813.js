'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '../..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8').replace(/\r\n?/g, '\n');

const context = { console, window: {}, Math, tileEntry: (img, color) => ({ img, color }) };
context.window = context;
context.globalThis = context;
vm.createContext(context);
for (const file of ['map.js', 'maps_logic.js', 'monsters.js']) {
  vm.runInContext(read(file), context, { filename: file });
}

const { MAP_MASTER, MAP_IDS, RETIRED_MAP_IDS, FIXED_AREA_MAP_KEYS, FIXED_AREA_MAP_SECTION_INDEX, FIXED_MAPS, MapRegistry, MonsterData } = context;
const areas = ['PROLOGUE_WEST_HILL', 'PROLOGUE_SOUTH_VILLAGE', 'PROLOGUE_NORTH_VILLAGE'];
const expectedSections = [0, 1, 2];

assert(MAP_MASTER.PROLOGUE_NAMELESS_VILLAGE, 'canonical nameless-village MAP master is missing');
assert.strictEqual(MAP_MASTER.PROLOGUE_NAMELESS_VILLAGE.id, 'MAP000066');
assert.strictEqual(MAP_MASTER.PROLOGUE_NAMELESS_VILLAGE.showMonsterHabitatInEncyclopedia, false, 'prologue village must opt out only from encyclopedia habitat display');
assert.strictEqual(MapRegistry.shouldShowMonsterHabitatInEncyclopedia('MAP000066'), false, 'map-level habitat display policy is not resolved');
assert.strictEqual(MapRegistry.shouldShowMonsterHabitatInEncyclopedia('MAP000004'), true, 'ordinary maps must remain visible by default');
assert.strictEqual(MAP_MASTER.PROLOGUE_SOUTH_VILLAGE, undefined, 'south area must not own another canonical MAP');
assert.strictEqual(MAP_MASTER.PROLOGUE_NORTH_VILLAGE, undefined, 'north area must not own another canonical MAP');
assert.strictEqual(RETIRED_MAP_IDS.MAP000067.canonicalMapKey, 'PROLOGUE_NAMELESS_VILLAGE');
assert.strictEqual(RETIRED_MAP_IDS.MAP000068.canonicalMapKey, 'PROLOGUE_NAMELESS_VILLAGE');

areas.forEach((areaKey, index) => {
  assert.strictEqual(FIXED_AREA_MAP_KEYS[areaKey], 'PROLOGUE_NAMELESS_VILLAGE');
  assert.strictEqual(FIXED_AREA_MAP_SECTION_INDEX[areaKey], expectedSections[index]);
  assert.strictEqual(FIXED_MAPS[areaKey].mapId, 'MAP000066');
  assert.strictEqual(FIXED_MAPS[areaKey].mapSection, expectedSections[index]);
  assert.strictEqual(FIXED_MAPS[areaKey].sectionId, `MAP000066-0${expectedSections[index]}`);
  assert.strictEqual(FIXED_MAPS[areaKey].floorId, FIXED_MAPS[areaKey].sectionId);
  const binding = MapRegistry.getMapBindingForArea(areaKey);
  assert.strictEqual(binding.mapKey, 'PROLOGUE_NAMELESS_VILLAGE');
  assert.strictEqual(binding.mapId, 'MAP000066');
  assert.strictEqual(binding.section, expectedSections[index]);
});

assert.strictEqual(MAP_IDS.PROLOGUE_WEST_HILL, 'MAP000066');
assert.strictEqual(MAP_IDS.PROLOGUE_SOUTH_VILLAGE, 'MAP000066');
assert.strictEqual(MAP_IDS.PROLOGUE_NORTH_VILLAGE, 'MAP000066');
assert.strictEqual(MapRegistry.getMapName('PROLOGUE_NORTH_VILLAGE'), '名もなき山村', 'legacy map-key alias must resolve to canonical map name');
assert.deepStrictEqual(
  Array.from(MapRegistry.getMapSections('MAP000066'), entry => [entry.areaKey, entry.section, entry.name]),
  [
    ['PROLOGUE_WEST_HILL', 0, '名もなき山村・西の高台'],
    ['PROLOGUE_SOUTH_VILLAGE', 1, '名もなき山村・南側'],
    ['PROLOGUE_NORTH_VILLAGE', 2, '名もなき山村・北側']
  ]
);

const southCandidates = MonsterData.getEncounterCandidates({ mapId: 'MAP000066', section: 1, floor: 0, rankMin: null, rankMax: null });
const northHabitatCandidates = MonsterData.getEncounterCandidates({ mapId: 'MAP000066', section: 2, floor: 0, rankMin: null, rankMax: null });
assert(southCandidates.some(monster => [1,2,3,4].includes(monster.id)), 'south section lost its early-game habitat pool');
assert(!southCandidates.some(monster => [51,52,53,54].includes(monster.id)), 'south section leaked north habitat monsters');
assert(northHabitatCandidates.some(monster => [51,52,53,54].includes(monster.id)), 'north section lost its stronger habitat pool');
assert(!northHabitatCandidates.some(monster => [1,2,3,4].includes(monster.id) && !(monster.habitats || []).some(h => h.mapId === 'MAP000066' && h.sections?.includes(2))), 'north habitat section resolver is not section-specific');

const jellyLabels = MonsterData.getHabitatLabels(1);
const armorLabels = MonsterData.getHabitatLabels(51);
assert(!jellyLabels.some(label => label.includes('名もなき山村')), 'tutorial-only map leaked into jelly encyclopedia habitats');
assert(!armorLabels.some(label => label.includes('名もなき山村')), 'tutorial-only map leaked into armor encyclopedia habitats');
assert(jellyLabels.includes('リュミナ村周辺') && jellyLabels.includes('北東の洞穴（1階）'), 'hiding one map must not hide the monster other normal habitats');
assert(armorLabels.includes('森の風穴（1～2階）') && armorLabels.includes('炎の里イグニシア周辺'), 'hiding one map must preserve other habitat labels');

const north = FIXED_MAPS.PROLOGUE_NORTH_VILLAGE;
const hunter = (north.tileEffects || []).find(effect => effect.id === 'prologue_north_rank100_hunter');
assert(hunter && hunter.type === 'hunter', 'north respawning hunter effect must remain defined');
assert.strictEqual(hunter.spawnIntervalSteps, 50, 'north hunter interval changed');
assert.deepStrictEqual(Array.from(hunter.monsterPoolIds || []), [960, 965], 'north hunter pool changed');
assert.strictEqual(north.rareEncounterAll, true, 'north rare-encounter expansion must remain active');
assert.strictEqual(north.encounterRankMin, 1);
assert.strictEqual(north.encounterRankMax, 76);

const mainSource = read('main.js');
const battleSource = read('battle.js');
assert(mainSource.includes('encounterSection: Number.isFinite(Number(mapEncounter?.mapSection))'), 'field encounter data must preserve fixed-map section identity');
assert(battleSource.includes('section: battleData.encounterSection'), 'battle habitat lookup must receive section identity');

console.log(JSON.stringify({
  canonicalMap: 'MAP000066',
  sections: '00/01/02 ok',
  southHabitat: 'ok',
  northHabitat: 'ok',
  northHunter: 'ok',
  encyclopediaHabitatSuppression: 'ok',
  encounterSectionRuntime: 'ok'
}, null, 2));
