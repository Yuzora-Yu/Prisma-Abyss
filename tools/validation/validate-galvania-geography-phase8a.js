const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..', '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const fail = msg => { console.error(`[phase8a-galvania] FAIL: ${msg}`); process.exitCode = 1; };
const assert = (cond, msg) => { if (!cond) fail(msg); };

const mapSource = read('map.js');
const main = read('main.js');
const dungeon = read('dungeon.js');
const story = read('story.js');
const phaser = read('phaser-field.js');
const news = read('news.js');
const canon = read('canon/PRISMA_SCENARIO_CANON_MASTER_v8.md');
const handoff = read('development_notes/2026-08-10/handoff/PRISMA_WORK_HANDOFF_LATEST_2026-08-10.md');
const geoDoc = read('docs/scenario/37_GALVANIA_GEOGRAPHY_PHASE8A_20260810.md');

const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(mapSource, context, { filename: 'map.js' });
const { STORY_DATA, FIXED_MAPS, FIXED_DUNGEON_MAPS, MAP_IDS } = context.window;

assert(STORY_DATA && FIXED_MAPS && FIXED_DUNGEON_MAPS, 'map.js did not expose expected registries.');

const gorgeArea = STORY_DATA.areas.GALVANIA_GORGE;
const caveArea = STORY_DATA.areas.GALVANIA_CAVE;
const empireArea = STORY_DATA.areas.GALVANIA_EMPIRE;
const castleArea = STORY_DATA.areas.DARK_CASTLE;
const altarArea = STORY_DATA.areas.ABYSS_FIELD;

assert(gorgeArea?.name === 'ガルヴァニア渓谷', 'GALVANIA_GORGE story area is missing.');
assert(gorgeArea?.entrances?.some(e => e.x === 31 && e.y === 40 && e.entryKey === 'fortSide'), 'Gorge fort-side world coordinate must be x31,y40.');
assert(gorgeArea?.entrances?.some(e => e.x === 35 && e.y === 42 && e.entryKey === 'empireSide'), 'Gorge empire-side world coordinate must be x35,y42.');
assert(caveArea?.name === '奈落への洞窟', 'Old Galvania Cave must be renamed Nadir Cave.');
assert(caveArea?.entrances?.some(e => e.x === 38 && e.y === 55 && e.entryKey === 'entrance'), 'Nadir Cave entrance must be x38,y55.');
assert(caveArea?.entrances?.some(e => e.x === 42 && e.y === 55 && e.entryKey === 'altarSide'), 'Nadir Cave altar-side exit must be x42,y55.');
assert(empireArea?.name === 'ガルヴァニア帝国' && empireArea.centerX === 8 && empireArea.centerY === 50, 'Galvania Empire must replace the old Castle world coordinate x8,y50.');
assert(!Number.isFinite(castleArea?.centerX) && !Number.isFinite(castleArea?.centerY), 'DARK_CASTLE must no longer own a world-map coordinate.');
assert(altarArea?.name === '統合の祭壇' && altarArea.entryRequiredFlag === 'nadirCaveCleared', 'Integration Altar must be gated behind Nadir Cave clear.');

assert(MAP_IDS.GALVANIA_GORGE === 'MAP000074', 'Galvania Gorge must use MAP000074.');
assert(MAP_IDS.GALVANIA_EMPIRE === 'MAP000075', 'Galvania Empire must use MAP000075.');
assert(MAP_IDS.GALVANIA_CAVE === 'MAP000025', 'Nadir Cave must preserve old cave MAP000025.');

const validateRect = (key, map) => {
  assert(map, `${key} fixed map is missing.`);
  assert(map.tiles?.length === map.height, `${key} tile row count must equal height.`);
  assert(map.tiles?.every(row => row.length === map.width), `${key} every tile row must equal width.`);
};
const gorge = FIXED_MAPS.GALVANIA_GORGE;
const empire = FIXED_MAPS.GALVANIA_EMPIRE;
validateRect('GALVANIA_GORGE', gorge);
validateRect('GALVANIA_EMPIRE', empire);
assert(gorge?.entryPoints?.fortSide?.x === 46 && gorge?.entryPoints?.fortSide?.y === 15, 'Gorge fort-side local entry is wrong.');
assert(gorge?.entryPoints?.empireSide?.x === 2 && gorge?.entryPoints?.empireSide?.y === 15, 'Gorge empire-side local entry is wrong.');
assert(gorge?.worldExits?.some(e => e.worldX === 31 && e.worldY === 40), 'Gorge must return to world x31,y40.');
assert(gorge?.worldExits?.some(e => e.worldX === 35 && e.worldY === 42), 'Gorge must return to world x35,y42.');

const gateBlocks = (gorge?.blockingObjects || []).filter(o => o.x === 24 && o.y >= 12 && o.y <= 18);
assert(gateBlocks.length === 7, 'Gorge intact gate must physically block the full seven-tile road width.');
assert(gateBlocks.every(o => o.missingFlag === 'crystalTreeCleared'), 'Gorge intact gate blockers must disappear only after crystalTreeCleared.');
assert(gorge?.entryEventId === 'galvania_gorge_after_crystal_tree' && gorge?.entryEventFlag === 'galvaniaGorgeAftermathSeen', 'Gorge aftermath entry event must be one-shot.');
assert((gorge?.mapActors || []).some(a => a.actorId === 'galvania_gorge_fallen_demon_hatred'), 'Hatred dying demon is missing from Gorge.');
assert((gorge?.mapActors || []).some(a => a.actorId === 'galvania_gorge_fallen_demon_warning'), 'World-warning dying demon is missing from Gorge.');

const isWalkable = (map, x, y, extraBlocked = new Set()) => {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
  if (extraBlocked.has(`${x},${y}`)) return false;
  const tile = map.tiles[y][x];
  return !(map.impassableTiles || ['W']).includes(tile) && tile !== 'W' && tile !== 'I';
};
const reachable = (map, start, goal, extraBlocked = new Set()) => {
  const q = [start];
  const seen = new Set([`${start.x},${start.y}`]);
  while (q.length) {
    const p = q.shift();
    if (p.x === goal.x && p.y === goal.y) return true;
    for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const x=p.x+dx,y=p.y+dy,k=`${x},${y}`;
      if (!seen.has(k) && isWalkable(map,x,y,extraBlocked)) { seen.add(k); q.push({x,y}); }
    }
  }
  return false;
};
const blockedSet = new Set(gateBlocks.map(o => `${o.x},${o.y}`));
assert(!reachable(gorge, gorge.entryPoints.fortSide, gorge.entryPoints.empireSide, blockedSet), 'Gorge must not be crossable while the intact gate exists.');
assert(reachable(gorge, gorge.entryPoints.fortSide, gorge.entryPoints.empireSide), 'Gorge must become crossable after the gate is destroyed.');

assert(empire?.entryPoint?.x === 27 && empire?.entryPoint?.y === 37, 'Empire world entry point is wrong.');
const castleAction = (empire?.mapActions || []).find(a => a.type === 'fixedDungeon' && a.target === 'DARK_CASTLE');
assert(castleAction?.x === 27 && castleAction?.y === 3, 'Castle entrance must be inside Empire at local x27,y3.');
assert(reachable(empire, empire.entryPoint, { x: 27, y: 4 }), 'Empire entry must have a walkable route to the Castle gate approach.');
assert(empire?.worldExits?.some(e => e.worldX === 8 && e.worldY === 50), 'Empire must return to world x8,y50.');

const nadir = FIXED_DUNGEON_MAPS.GALVANIA_CAVE;
assert(nadir?.name === '奈落への洞窟', 'Fixed dungeon name must be Nadir Cave.');
assert(nadir?.entryPoints?.entrance?.floor === 1 && nadir?.entryPoints?.altarSide?.floor === 6, 'Nadir Cave must enter F1 from entrance and F6 from altar side.');
assert(nadir?.entryPoints?.north && nadir?.entryPoints?.south, 'Legacy north/south entry aliases must remain for saves.');
assert(JSON.stringify(nadir?.floors?.map(f => f.encounterRank)) === JSON.stringify([81,83,85,87,89,91]), 'Nadir floor encounter ranks must be 81,83,85,87,89,91.');
const f1Exit = nadir?.floors?.[0]?.floorLinks?.find(l => l.to === 'EXIT');
const f6Exit = nadir?.floors?.[5]?.floorLinks?.find(l => l.to === 'EXIT');
assert(f1Exit?.exitPoint?.x === 38 && f1Exit?.exitPoint?.y === 55, 'Nadir F1 exit must return to x38,y55.');
assert(f6Exit?.exitPoint?.x === 42 && f6Exit?.exitPoint?.y === 55, 'Nadir F6 exit must return to x42,y55.');
assert(f6Exit?.setFlag === 'nadirCaveCleared', 'Nadir F6 exit must set nadirCaveCleared.');
assert(FIXED_MAPS.ABYSS_FIELD?.name === '統合の祭壇', 'Fixed ABYSS_FIELD display name must be Integration Altar.');

assert(story.includes('"8-0": "ガルヴァニア渓谷を越え、魔王城で闇のプリズムの真実を確かめよう"'), 'Step 8 objective must point through Galvania Gorge.');
assert(story.includes('"9-0": "奈落への洞窟を越え、統合の祭壇へ向かおう"'), 'Step 9 objective must point through Nadir Cave.');
for (const id of ['CRYSTAL_TREE_GALVANIA_RUMBLE','GALVANIA_GORGE_AFTER_CRYSTAL_TREE','GALVANIA_GORGE_FALLEN_DEMON_HATRED','GALVANIA_GORGE_FALLEN_DEMON_WARNING','LOCKED_INTEGRATION_ALTAR_ROUTE']) {
  assert(story.includes(`"${id}"`), `Story script ${id} is missing.`);
}
assert(story.includes('……人間……め……。どこまで……奪えば……気が、済む……。'), 'Hatred demon must retain the approved human-hatred final line.');
assert(story.includes('このままでは……世界が……。'), 'Warning demon must worry about the world.');
assert(!story.includes('門を破壊したのはアラン') && !story.includes('アランが門'), 'Runtime story must not reveal Alan as the Gorge destroyer.');
assert(story.includes('{ "type": "FLAG", "key": "galvaniaGorgeAftermathSeen" }'), 'Gorge aftermath must set its one-shot flag.');
assert(story.includes('この城の先に、我らが深淵の浸食を抑えてきた地下路がある。'), 'Dark Castle clear must lead toward the recontextualized Nadir defense route.');

assert(main.includes("'GALVANIA_GORGE',\n            'GALVANIA_EMPIRE',\n            'GALVANIA_CAVE',"), 'Sky Prism order must be Gorge -> Empire -> Nadir Cave.');
const skyOrderStart = main.indexOf('const skyPrismAreaOrder');
const skyOrderEnd = main.indexOf(']);', skyOrderStart);
const skyOrder = main.slice(skyOrderStart, skyOrderEnd);
assert(!skyOrder.includes("'DARK_CASTLE'"), 'Sky Prism must not warp directly to Dark Castle.');
assert(main.includes("areaKey === 'ABYSS_FIELD' && !App.data?.progress?.flags?.nadirCaveCleared"), 'Sky Prism must block Integration Altar before Nadir Cave clear.');
assert(main.includes("targetAreaKey === 'ABYSS_FIELD' && !App.data?.progress?.flags?.nadirCaveCleared"), 'Direct fixed-map entry must block Integration Altar before Nadir Cave clear.');
assert(main.includes("visited.GALVANIA_GORGE") && main.includes("delete visited.GALVANIA_CAVE"), 'Old cave discovery must migrate to Gorge instead of discovering Nadir Cave.');
assert(main.includes("visited.GALVANIA_EMPIRE") && main.includes("flags.nadirCaveCleared = true"), 'Empire and advanced-save geography migration must be present.');
assert(main.includes('Dungeon.startFixed(action.target, { entryKey: action.entryKey || null })'), 'Fixed dungeon actions must forward entryKey.');

assert(dungeon.includes("case 'GALVANIA_CAVE':") && dungeon.includes("options.entryKey || 'entrance'"), 'Dungeon gate must understand Nadir entrance keys.');
assert(dungeon.includes('flags.darkCastleCleared') && dungeon.includes('flags.nadirCaveCleared'), 'Nadir access must use Castle clear and Nadir exit flags.');
assert(dungeon.includes("case 'DARK_CASTLE':") && dungeon.includes('flags.crystalTreeCleared'), 'Dark Castle entry must remain after Crystal Tree treatment.');

assert(phaser.includes("GALVANIA_GORGE: { key: 'overlay_decor_galvania_crystal'"), 'Phaser fallback decor theme must know GALVANIA_GORGE.');
assert(news.includes('ガルヴァニア渓谷とガルヴァニア帝国を追加し、魔王城へのワールド導線を再編しました'), 'NEWS must mention Galvania geography reorg.');
assert(news.includes('旧ガルヴァニアへの洞窟を奈落への洞窟として移設'), 'NEWS must mention Nadir Cave relocation.');

for (const doc of [canon, handoff, geoDoc]) {
  const compactDoc = doc.replace(/\s+/g, '');
  for (const token of ['x:31,y:40','x:35,y:42','x:38,y:55','x:42,y:55','x:8,y:50']) {
    assert(compactDoc.includes(token), `Canonical docs must include coordinate ${token}.`);
  }
}
assert(geoDoc.includes('門を破壊したのは **アラン**'), 'Internal geography doc must retain Alan destroyer truth.');
assert(geoDoc.includes('この段階では「光で破壊された」と断定できる痕跡を置かない'), 'Player-information boundary for Alan must be documented.');

if (!process.exitCode) console.log('[phase8a-galvania] PASS: world coordinates, new M0 maps, route gates, hidden Gorge aftermath, save migration, Nadir reuse, and Integration Altar sequencing are wired.');
