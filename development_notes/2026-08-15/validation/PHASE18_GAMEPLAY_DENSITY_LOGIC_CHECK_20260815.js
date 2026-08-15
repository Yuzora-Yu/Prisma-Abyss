const fs = require('fs');
const vm = require('vm');
const path = require('path');
const ROOT = path.resolve(__dirname, '../../../');
let passed = 0;
const ok = (cond, msg) => { if (!cond) throw new Error(msg); passed++; };
function load(file, tail = '') {
  const c = { console, setTimeout, clearTimeout, Math, Date, JSON };
  c.window = c; c.globalThis = c;
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, file), 'utf8') + '\n' + tail, c, { timeout: 10000 });
  return c;
}

(async () => {
  const mapCtx = load('map.js', ';globalThis.__FM=FIXED_MAPS;');
  const storyCtx = load('story.js', ';globalThis.__SD=STORY_MANAGER_DATA;');
  const questCtx = load('quests.js');
  const equipCtx = load('equips.js');
  const maps = mapCtx.__FM;
  const events = storyCtx.__SD.events;
  const quests = questCtx.QUEST_DATA;
  const equips = equipCtx.EQUIP_MASTER || equipCtx.EQUIPS_DATA || equipCtx.EQUIP_DATA;

  ok(maps.WIND_VILLAGE && maps.WATER_CITY, 'target maps missing');
  ok(events.npc_kazaria_rope_mender_plus3_gift, 'Kazaria gift event missing');
  ok(events.npc_water_city_retired_deckhand_plus3_gift, 'Rivaria gift event missing');

  const windGift = events.npc_kazaria_rope_mender_plus3_gift.actions.find(a => a.type === 'EQUIP');
  const waterGift = events.npc_water_city_retired_deckhand_plus3_gift.actions.find(a => a.type === 'EQUIP');
  ok(windGift?.eid === 53 && windGift?.plus === 3, 'Kazaria +3 equipment reward mismatch');
  ok(waterGift?.eid === 67 && waterGift?.plus === 3, 'Rivaria +3 equipment reward mismatch');

  const equipList = Array.isArray(equips) ? equips : [];
  ok(equipList.some(e => Number(e.eid) === 53 && e.name === '鋼のブーツ'), 'eid53 missing');
  ok(equipList.some(e => Number(e.eid) === 67 && e.name === 'はがねのたて'), 'eid67 missing');

  const lootIds = [];
  for (const [mapKey, map] of Object.entries(maps)) {
    for (const chest of map.chests || []) if (chest.lootId) lootIds.push([chest.lootId, mapKey, chest]);
  }
  const dup = lootIds.map(x => x[0]).filter((id, i, arr) => arr.indexOf(id) !== i);
  ok(dup.length === 0, `duplicate lootId: ${dup.join(',')}`);
  ok(lootIds.length >= 8, 'expected stable lootId conversions/additions are missing');

  for (const mapKey of ['WIND_VILLAGE', 'WATER_CITY']) {
    const map = maps[mapKey];
    for (const c of map.chests || []) {
      if (!['pot', 'barrel'].includes(String(c.containerKind || '').toLowerCase())) continue;
      const adj = [[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy]) => map.tiles[c.y + dy]?.[c.x + dx]);
      ok(adj.includes('W'), `${mapKey}:${c.lootId} is not wall-adjacent`);
    }
  }

  const windLegacy = maps.WIND_VILLAGE.chests.find(c => c.lootId === 'kazaria_chest_south_01');
  ok(Array.isArray(windLegacy?.legacyPositions) && windLegacy.legacyPositions.length > 0, 'Kazaria legacy chest position missing');
  for (const id of ['water_city_chest_northwest_01','water_city_chest_northwest_02','water_city_chest_northwest_03','water_city_chest_northwest_04']) {
    const c = maps.WATER_CITY.chests.find(x => x.lootId === id);
    ok(Array.isArray(c?.legacyPositions) && c.legacyPositions.length > 0, `${id} legacy position missing`);
  }

  const eventIds = new Set(Object.keys(events));
  const missingEventRefs = [];
  const missingQuestRefs = [];
  for (const [mapKey, map] of Object.entries(maps)) {
    for (const actor of map.mapActors || []) for (const state of actor.states || []) {
      const action = state.action || {};
      if (action.eventId && !eventIds.has(action.eventId)) missingEventRefs.push(`${mapKey}:${actor.actorId}:${action.eventId}`);
      for (const e of action.events || []) if (e.eventId && !eventIds.has(e.eventId)) missingEventRefs.push(`${mapKey}:${actor.actorId}:${e.eventId}`);
      if (action.questId && !quests[action.questId]) missingQuestRefs.push(`${mapKey}:${actor.actorId}:${action.questId}`);
    }
    for (const action of map.mapActions || []) {
      if (action.eventId && !eventIds.has(action.eventId)) missingEventRefs.push(`${mapKey}:mapAction:${action.eventId}`);
      for (const e of action.events || []) if (e.eventId && !eventIds.has(e.eventId)) missingEventRefs.push(`${mapKey}:mapAction:${e.eventId}`);
    }
  }
  ok(missingEventRefs.length === 0, `missing story event refs: ${missingEventRefs.join(',')}`);
  ok(missingQuestRefs.length === 0, `missing quest refs: ${missingQuestRefs.join(',')}`);
  for (const [qid, q] of Object.entries(quests)) for (const req of q.requiredQuests || []) ok(!!quests[req], `${qid} requires missing quest ${req}`);

  const dungeonCode = fs.readFileSync(path.join(ROOT, 'dungeon.js'), 'utf8');
  ok(dungeonCode.includes('getFixedContainerOpenKey'), 'stable fixed-container key helper missing');
  ok(dungeonCode.includes('legacyPositions'), 'legacy-position compatibility missing');
  ok(dungeonCode.includes('fixedChestTrap: { progressKey, openKey, mapPosKey }'), 'trap rollback stable-key handoff missing');

  const dctx = { console, setTimeout, clearTimeout, Math, Date, JSON };
  dctx.window = dctx; dctx.globalThis = dctx;
  const moved = { x: 8, y: 8, lootId: 'moved_test_01', legacyPositions: [{ x: 4, y: 17 }] };
  dctx.__stats = [];
  dctx.App = {
    data: { progress: { openedChests: { TEST: ['4,17'] }, mapChanges: {} } },
    save(){},
    incrementLifetimeStat: (key, amount) => dctx.__stats.push([key, amount])
  };
  dctx.Field = { currentMapData: { isFixed: true, chests: [moved] }, getCurrentAreaKey: () => 'TEST' };
  dctx.MapRegistry = { findFixedChest: (m,x,y) => (m.chests || []).find(c => Number(c.x) === Number(x) && Number(c.y) === Number(y)) || null };
  vm.runInNewContext(dungeonCode + ';globalThis.__D=Dungeon;', dctx, { timeout: 10000 });
  ok(dctx.__D.getFixedContainerOpenKey(moved, 8, 8) === 'loot:moved_test_01', 'lootId open key mismatch');
  ok(dctx.__D.isFixedChestOpenedAt(8, 8, moved, dctx.Field.currentMapData) === true, 'moved legacy container is not recognized as opened');
  dctx.__D.markFixedChestOpened('TEST', 'loot:moved_test_01', 8, 8, moved, dctx.Field.currentMapData);
  ok(dctx.App.data.progress.openedChests.TEST.includes('loot:moved_test_01'), 'stable opened key not persisted');
  dctx.__stats.length = 0;
  dctx.__D.noteFixedContainerOpened({ containerKind:'pot' });
  dctx.__D.noteFixedContainerOpened({ containerKind:'barrel' });
  dctx.__D.noteFixedContainerOpened({ containerKind:'chest' });
  ok(dctx.__stats.length === 1 && dctx.__stats[0][0] === 'totalChestsOpened', 'pots/barrels must not advance chest achievements');

  const logicCode = fs.readFileSync(path.join(ROOT, 'story_logic.js'), 'utf8');
  const lctx = { console, setTimeout, clearTimeout, Math, Date, JSON, STORY_MANAGER_DATA: { scripts:{}, events:{} } };
  lctx.window = lctx; lctx.globalThis = lctx;
  lctx.App = {
    data: { progress: {}, inventory: [] },
    createEquipById: (eid, plus) => ({ eid, plus, name: `TEST${eid}+${plus}` }),
    log(){}, save(){}, reconcileDerivedProgressFlags(){}
  };
  vm.runInNewContext(logicCode, lctx, { timeout: 10000 });
  await lctx.StoryManager.processAction({ type:'EQUIP', eid:53, plus:3, source:'townNpcGift' }, 'test', 0, { deferSave:true });
  ok(lctx.App.data.inventory.length === 1, 'generic EQUIP action did not grant equipment');
  ok(lctx.App.data.inventory[0].eid === 53 && lctx.App.data.inventory[0].plus === 3, 'generic EQUIP action generated wrong equipment');
  ok(lctx.App.data.inventory[0].source === 'townNpcGift', 'generic EQUIP source missing');

  const news = fs.readFileSync(path.join(ROOT, 'news.js'), 'utf8');
  ok((news.match(/date:\s*"2026\/08\/15"/g) || []).length === 1, 'news.js must contain exactly one 2026/08/15 record');

  console.log(`PHASE18_GAMEPLAY_DENSITY_LOGIC_CHECK PASS ${passed}/${passed}`);
})().catch(err => { console.error(err.stack || err); process.exit(1); });
