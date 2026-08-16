const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');
const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const checks = [];
const ok = (name, condition) => { assert.ok(condition, name); checks.push(name); };

function makeContext() {
    const ctx = { console, Math, Date, JSON, setTimeout, clearTimeout };
    ctx.window = ctx;
    ctx.globalThis = ctx;
    ctx.DB = { ITEMS: [{ id: 1, rank: 1, price: 1, randomChestDrop: true }, { id: 2, rank: 10, price: 1, randomChestDrop: true }] };
    ctx.__logs = [];
    ctx.App = {
        data: {
            progress: { flags: { underseaVolcanoRouteOpened: true }, fixedProceduralFloors: {}, fixedProceduralRunIds: {}, floor: 0 },
            location: { area: 'WORLD', worldKey: 'WORLD', x: 113, y: 17 },
            dungeon: {}, system: {}
        },
        evaluateGameConditions: cond => !cond?.requiredFlag || !!ctx.App.data.progress.flags[cond.requiredFlag],
        save: () => {}, changeScene: () => {}, discoverFixedMap: () => {},
        log: value => ctx.__logs.push(String(value)), clearAction: () => {}, setAction: () => {}, hasStoryAlly: () => true
    };
    ctx.Field = {
        x: 113, y: 17, currentMapData: null,
        getCurrentAreaKey() { return ctx.App.data.location.area; },
        getCurrentProgressMapKey() { return `${ctx.App.data.location.area}:F${ctx.App.data.progress.floor || 1}`; }
    };
    ctx.AudioManager = { playSe: () => {} };
    vm.createContext(ctx);
    vm.runInContext(read('map.js'), ctx, { timeout: 10000 });
    vm.runInContext(read('maps_logic.js') + '\n;globalThis.MapRegistry=MapRegistry;', ctx, { timeout: 10000 });
    vm.runInContext(read('dungeon.js') + '\n;globalThis.Dungeon=Dungeon;', ctx, { timeout: 10000 });
    return ctx;
}

const ctx = makeContext();
const { App, Field, Dungeon, MapRegistry } = ctx;

const world = MapRegistry.getWorldDefinition().tiles;
ok('world entrance is grass', world[17][113] === 'G');
ok('world entrance remains one-tile island', world[17][112] === 'W' && world[17][114] === 'W' && world[16][113] === 'W' && world[18][113] === 'W');

for (let run = 0; run < 8; run++) {
    App.data.location = { area: 'WORLD', worldKey: 'WORLD', x: 113, y: 17 };
    App.data.dungeon = {};
    App.data.progress.floor = 0;
    App.data.progress.fixedProceduralFloors = {};
    App.data.progress.fixedProceduralRunIds = {};
    Field.x = 113; Field.y = 17; Field.currentMapData = null;
    ctx.__logs.length = 0;

    ok(`run ${run + 1}: fixed dungeon starts`, Dungeon.startFixed('UNDERSEA_VOLCANO') === true);
    const floor = Field.currentMapData;
    ok(`run ${run + 1}: spawn is generated entry stair`, String(floor.tiles[Field.y][Field.x]).toUpperCase() === 'U');
    ok(`run ${run + 1}: return point preserves volcano world coordinate`, App.data.dungeon.returnPoint?.areaKey === 'WORLD' && Number(App.data.dungeon.returnPoint?.x) === 113 && Number(App.data.dungeon.returnPoint?.y) === 17);
    ok(`run ${run + 1}: first floor has explicit stable world exit`, floor.floorLinks?.some(link => link.to === 'EXIT' && Number(link.exitPoint?.x) === 113 && Number(link.exitPoint?.y) === 17));
    ok(`run ${run + 1}: deeper link is down staircase`, MapRegistry.getFixedFloorDirection(floor, floor.floorLinks.find(link => Number(link.toFloor) === 2), 1, 'UNDERSEA_VOLCANO') === 'down');

    Dungeon.exit(false, null, { save: false, changeScene: false, log: false });
    ok(`run ${run + 1}: escape returns to volcano entrance`, App.data.location.area === 'WORLD' && Number(App.data.location.x) === 113 && Number(App.data.location.y) === 17);
    ok(`run ${run + 1}: escape does not trigger unstable fallback`, !ctx.__logs.some(line => line.includes('帰還先が不安定')));
}

// Explicitly taking the first-floor up staircase must use the authored world exit, not the generic return fallback.
const stairCtx = makeContext();
stairCtx.Dungeon.startFixed('UNDERSEA_VOLCANO');
const upExit = stairCtx.Field.currentMapData.floorLinks.find(link => link.to === 'EXIT');
ok('first-floor exit link is an up-stair exit', stairCtx.MapRegistry.getFixedFloorActionLabel(stairCtx.Field.currentMapData, upExit, 1, 'UNDERSEA_VOLCANO') === '海上へ戻る');
stairCtx.Dungeon.followFixedFloorLink(upExit, stairCtx.Field.currentMapData);
ok('using first-floor up staircase returns to volcano island', stairCtx.App.data.location.area === 'WORLD' && Number(stairCtx.App.data.location.x) === 113 && Number(stairCtx.App.data.location.y) === 17);

ok('random fixed-floor type chooser never returns maze type', Array.from({ length: 2000 }, () => Dungeon.pickRandomFloorType()).every(type => type !== 2));
const base = MapRegistry.getFixedDungeonBase('UNDERSEA_VOLCANO');
ok('procedural volcano floors use current template versions', base.floors[0].proceduralTemplateVersion === 2 && base.floors[1].proceduralTemplateVersion === 2 && base.floors[2].proceduralTemplateVersion >= 3);
ok('B3 template carries deep-route gate', base.floors[2].proceduralNextLink?.requiredFlag === 'underseaVolcanoRouteOpened');
ok('all procedural volcano floors leave forceMaze disabled', base.floors.slice(0, 3).every(floor => floor.forceMaze !== true));
ok('volcano dungeon uses basement direction mode', base.floorDirectionMode === 'basement');

// Simulate an old cached undersea floor from the former maze profile. Even if the old coordinate
// would happen to be walkable after regeneration, the first load must move to the new entry stair.
App.data.location = { area: 'WORLD', worldKey: 'WORLD', x: 113, y: 17 };
App.data.dungeon = {};
App.data.progress.floor = 0;
App.data.progress.fixedProceduralFloors = {};
App.data.progress.fixedProceduralRunIds = {};
Field.x = 113; Field.y = 17; Field.currentMapData = null;
Dungeon.startFixed('UNDERSEA_VOLCANO');
const cacheKey = Object.keys(App.data.progress.fixedProceduralFloors).find(key => key.includes('UNDERSEA_VOLCANO') && key.endsWith(':F1'));
const legacyCached = JSON.parse(JSON.stringify(App.data.progress.fixedProceduralFloors[cacheKey]));
legacyCached.proceduralTemplateVersion = 0;
App.data.progress.fixedProceduralFloors[cacheKey] = legacyCached;
App.data.location.area = 'UNDERSEA_VOLCANO';
App.data.progress.floor = 1;
App.data.location.x = 2;
App.data.location.y = 2;
Field.x = 2; Field.y = 2;
Field.currentMapData = legacyCached;
Dungeon.loadFloor();
const repaired = Field.currentMapData;
ok('old maze-profile cache regenerates with template version 2', repaired.proceduralTemplateVersion === 2);
ok('old cache migration snaps player to regenerated entry stair', Number(Field.x) === Number(repaired.entryPoint.x) && Number(Field.y) === Number(repaired.entryPoint.y) && String(repaired.tiles[Field.y][Field.x]).toUpperCase() === 'U');

// Fixed authored research/boss floors must also present descent/ascent consistently.
const f4 = MapRegistry.getFixedDungeonFloor('UNDERSEA_VOLCANO', 4);
const f5 = MapRegistry.getFixedDungeonFloor('UNDERSEA_VOLCANO', 5);
const f4Back = f4.floorLinks.find(link => Number(link.toFloor) === 3);
const f4Next = f4.floorLinks.find(link => Number(link.toFloor) === 5);
const f5Back = f5.floorLinks.find(link => Number(link.toFloor) === 4);
ok('research floor back link is up staircase', MapRegistry.getFixedFloorDirection(f4, f4Back, 4, 'UNDERSEA_VOLCANO') === 'up');
ok('research floor deeper link is down staircase', MapRegistry.getFixedFloorDirection(f4, f4Next, 4, 'UNDERSEA_VOLCANO') === 'down');
ok('boss floor return link is up staircase', MapRegistry.getFixedFloorDirection(f5, f5Back, 5, 'UNDERSEA_VOLCANO') === 'up');

console.log(`UNDERSEA_VOLCANO_STABILITY_CHECK: ${checks.length}/${checks.length} PASS`);
checks.forEach((name, index) => console.log(`${String(index + 1).padStart(2, '0')}. PASS ${name}`));
