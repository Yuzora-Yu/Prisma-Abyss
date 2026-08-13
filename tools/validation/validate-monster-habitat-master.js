const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, console, Math, tileEntry: (img, color) => ({ img, color }) };
context.window = context;
context.globalThis = context;
vm.createContext(context);
for (const file of ['map.js', 'maps_logic.js', 'monsters.js']) {
    vm.runInContext(read(file), context, { filename: file });
}

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

const mapSource = read('map.js');
const mapsLogicSource = read('maps_logic.js');
const battleSource = read('battle.js');
assert(!/(?:^|[,\s])["']?monsters["']?\s*:\s*\[/m.test(mapSource),
    'map.js still contains a normal encounter roster. monsters.js habitats must be the only master.');
assert(!/(?:^|[,\s])["']?rareMonsters["']?\s*:\s*\[/m.test(mapSource),
    'map.js still contains a rare encounter roster. Rank bands must be the only master.');
assert(!mapsLogicSource.includes('base.rareMonsters') && !mapsLogicSource.includes('def.rareMonsters'),
    'MapRegistry still propagates map-local rare encounter rosters.');
assert(!battleSource.includes('battleData.rareMonsters') && !battleSource.includes('currentMapData.rareMonsters'),
    'Battle still gives map-local rare encounter rosters priority.');
assert((battleSource.match(/tryGenerateRareMonster\(/g) || []).length === 1,
    'Rare selection must be rolled exactly once per encounter in battle.js.');
assert(battleSource.includes('allowRare: false'),
    'Normal enemy slots can still reroll a rare monster after the encounter-level roll.');
assert(battleSource.includes('section: battleData.encounterSection'),
    'Battle habitat lookup does not preserve fixed-map section identity.');

const { MonsterData, MapRegistry, MAP_MASTER, FIXED_DUNGEON_MAPS, FIELD_ENCOUNTER_ZONES, MAP_IDS } = context;
assert(MAP_MASTER.PROLOGUE_NAMELESS_VILLAGE?.showMonsterHabitatInEncyclopedia === false,
    'Nameless Village must be hidden from monster encyclopedia habitat labels at map-master level.');
assert(MapRegistry.shouldShowMonsterHabitatInEncyclopedia(MAP_IDS.PROLOGUE_NAMELESS_VILLAGE) === false,
    'MapRegistry does not honor the map-level monster habitat display policy.');
let floorsChecked = 0;
for (const [areaKey, dungeon] of Object.entries(FIXED_DUNGEON_MAPS)) {
    const floors = dungeon.floors || [dungeon];
    floors.forEach((unused, index) => {
        const floor = MapRegistry.getFixedDungeonFloor(areaKey, index + 1);
        if (floor.disableRandomEncounters || floor.isGuildQuestDungeon || floor.useHabitatEncounters === false) return;
        const abyssFloor = floor.mapId === MAP_IDS.ABYSS ? floor.floor : 0;
        const candidates = MonsterData.getEncounterCandidates({ mapId: floor.mapId, floor: floor.floor, abyssFloor });
        const runtimeCandidates = MonsterData.getEncounterCandidates({
            mapId: floor.mapId, floor: floor.floor, abyssFloor, rankMin: null, rankMax: null
        });
        assert(candidates.length > 0, `${areaKey}:F${index + 1} has no monsters.js habitat candidates.`);
        assert(JSON.stringify(runtimeCandidates.map(monster => monster.id)) === JSON.stringify(candidates.map(monster => monster.id)),
            `${areaKey}:F${index + 1} runtime null rank bounds bypass monsters.js habitats.`);
        assert(!Array.isArray(floor.monsters), `${areaKey}:F${index + 1} restored a map-local monster roster.`);
        assert(!Array.isArray(floor.rareMonsters), `${areaKey}:F${index + 1} restored a map-local rare roster.`);
        floorsChecked += 1;
    });
}

for (const zone of FIELD_ENCOUNTER_ZONES) {
    const candidates = MonsterData.getEncounterCandidates({ mapId: zone.mapId, floor: 0 });
    const runtimeCandidates = MonsterData.getEncounterCandidates({ mapId: zone.mapId, floor: 0, rankMin: null, rankMax: null });
    assert(candidates.length > 0, `${zone.id} has no monsters.js field-habitat candidates.`);
    assert(JSON.stringify(runtimeCandidates.map(monster => monster.id)) === JSON.stringify(candidates.map(monster => monster.id)),
        `${zone.id} runtime null rank bounds bypass monsters.js field habitats.`);
    assert(!Array.isArray(zone.monsters) && !Array.isArray(zone.rareMonsters),
        `${zone.id} contains a map-local encounter override.`);
}
assert(MonsterData.getEncounterCandidates({ mapId: MAP_IDS.SEA, floor: 0 }).length > 0,
    'Sea encounters have no monsters.js habitat candidates.');

const prologueJellyLabels = MonsterData.getHabitatLabels(1);
const prologueArmorLabels = MonsterData.getHabitatLabels(51);
assert(!prologueJellyLabels.some(label => label.includes('名もなき山村'))
    && !prologueArmorLabels.some(label => label.includes('名もなき山村')),
    'Nameless Village must remain an encounter habitat without being listed in the monster encyclopedia.');

const explicitRange = MonsterData.getEncounterCandidates({ mapId: MAP_IDS.THUNDER_FORT, floor: 1, rankMin: 68, rankMax: 76 });
assert(explicitRange.length > 0 && explicitRange.every(monster => Number(monster.rank) >= 68 && Number(monster.rank) <= 76),
    'Explicit encounterRankMin/Max no longer selects the intended global Rank range.');
assert(MonsterData.getEncounterCandidates({ mapId: MAP_IDS.PROLOGUE_SOUTH_VILLAGE, section: 1, floor: 0 }).some(monster => [1,2,3,4].includes(monster.id)),
    'Playable prologue south section has no early-game habitat candidates.');
assert(MonsterData.getEncounterCandidates({ mapId: MAP_IDS.PROLOGUE_NORTH_VILLAGE, section: 2, floor: 0 }).some(monster => [51,52,53,54].includes(monster.id)),
    'Playable prologue north section has no stronger habitat candidates.');

const monster51 = MonsterData.getMonsterById(51);
assert(JSON.stringify(monster51.habitats) === JSON.stringify([
    { mapId: 'MAP000004', floors: [{ from: 1, to: 2 }] },
    { mapId: 'MAP000005', floors: [{ from: 0, to: 0 }] },
    { mapId: 'MAP000066', sections: [2] }
]), 'Monster 51 habitat master was changed.');
for (const [mapId, floor, section, expected] of [
    ['MAP000004', 1, null, true], ['MAP000004', 2, null, true], ['MAP000004', 3, null, false],
    ['MAP000005', 0, null, true], ['MAP000005', 1, null, false],
    ['MAP000066', 0, 2, true], ['MAP000066', 0, 1, false], ['MAP000066', 0, null, false]
]) {
    const found = MonsterData.getEncounterCandidates({ mapId, floor, section }).some(monster => monster.id === 51);
    assert(found === expected, `Monster 51 habitat resolution mismatch: ${mapId} floor ${floor} section ${section}.`);
}

for (const [rank, expectedId, expectedRate] of [
    [30, null, 0], [31, 200201, 0.03], [70, 200201, 0.03],
    [71, 200202, 0.03], [105, 200202, 0.03],
    [106, 200203, 0.03], [150, 200203, 0.03],
    [151, 200204, 0.03], [999, 200204, 0.03]
]) {
    assert(MonsterData.getRareMonsterIdForRank(rank) === expectedId,
        `Rare monster band mismatch at Rank ${rank}.`);
    assert(MonsterData.getRareEncounterRateForRank(rank) === expectedRate,
        `Rare encounter rate mismatch at Rank ${rank}.`);
    const candidates = MonsterData.getRareCandidatesForRank(rank);
    assert((candidates[0]?.id || null) === expectedId && candidates.length === (expectedId ? 1 : 0),
        `Rare candidate mismatch at Rank ${rank}.`);
}

console.log(`Monster habitat master validation passed: ${floorsChecked} fixed floors, ${FIELD_ENCOUNTER_ZONES.length} field zones, sea habitats, and four rare Rank bands at one 3% encounter roll.`);
