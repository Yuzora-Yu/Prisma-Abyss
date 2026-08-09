const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const fail = msg => { console.error(`[phase7c-crystal-tree] FAIL: ${msg}`); process.exitCode = 1; };
const assert = (cond, msg) => { if (!cond) fail(msg); };

const map = read('map.js');
const story = read('story.js');
const news = read('news.js');

assert(map.includes('CRYSTAL_TREE: { id: "MAP000073", name: "結晶樹の秘跡" }'), 'MAP000073 Crystal Tree master entry is missing.');
assert(map.includes('CRYSTAL_TREE: "CRYSTAL_TREE"'), 'Crystal Tree fixed-map key is missing.');
assert(map.includes('"eventId": "crystal_tree_route_departure"'), 'Water City route action is missing.');
assert(map.includes('"requiredFlag": "crystalTreeRouteBriefed"'), 'Crystal Tree route must remain hidden until Sophia briefs it.');
assert(map.includes('"CRYSTAL_TREE": {') && map.includes('"mapId": "MAP000073"'), 'Crystal Tree fixed map is missing.');
assert(map.includes('"randomEncounterDisabled": true') && map.includes('"disableRandomEncounters": true'), 'M0 Crystal Tree must not invent random encounters.');
assert(map.includes('"actorId": "minerva_crystal_tree"'), 'Minerva must be present in Crystal Tree.');
assert(map.includes('"eventId": "crystal_tree_minerva_meeting"'), 'Minerva first meeting event is missing.');
assert(map.includes('"eventId": "crystal_tree_root_ritual"'), 'Root ritual event is missing.');
assert(map.includes('"target": "WATER_CITY"') && map.includes('"label": "古い水門へ戻る"'), 'Crystal Tree must have an explicit action-based return to Water City.');

const crystalBlock = (map.match(/"CRYSTAL_TREE": \{[\s\S]*?"useHabitatEncounters": false\n    \}/) || [])[0] || '';
const tileBlock = (crystalBlock.match(/"tiles": \[([\s\S]*?)\n        \],/) || [])[1] || '';
const rows = [...tileBlock.matchAll(/"([WGT]+)"/g)].map(m => m[1]);
assert(rows.length === 21, `Crystal Tree M0 should have 21 rows, got ${rows.length}.`);
assert(rows.every(r => r.length === 29), 'Crystal Tree M0 row width must stay 29.');

function reachable(sx, sy, tx, ty) {
  if (!rows.length) return false;
  const passable = c => c && c !== 'W';
  const q = [[sx,sy]], seen = new Set([`${sx},${sy}`]);
  while (q.length) {
    const [x,y] = q.shift();
    if (x === tx && y === ty) return true;
    for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx=x+dx, ny=y+dy, key=`${nx},${ny}`;
      if (ny<0 || ny>=rows.length || nx<0 || nx>=rows[0].length || seen.has(key) || !passable(rows[ny][nx])) continue;
      seen.add(key); q.push([nx,ny]);
    }
  }
  return false;
}
assert(reachable(14,18,14,11), 'Entry must reach Minerva first-meeting position.');
assert(reachable(14,18,14,6), 'Entry must reach root-ritual position.');
assert(reachable(14,11,14,18), 'Player must be able to return from Minerva to the water-gate marker.');

for (const id of ['crystal_tree_route_departure','crystal_tree_arrival','crystal_tree_minerva_meeting','crystal_tree_root_ritual','crystal_tree_defense_clear']) {
  assert(story.includes(`"${id}": {`), `${id} story event is missing.`);
}
assert(story.includes('{ "type": "ALLY", "charId": 401, "initialLevel": 1, "expMultiplierPct": 2000, "silent": true }'), 'Luna formal join must use the shared ally path with 2000% EXP requirement.');
assert(story.includes('"7-9": "結晶樹の根元へ向かおう"'), '7-9 objective must not imply Luna is forced into the active battle party.');
assert(story.includes('"value": [652, 755, 652]'), 'Direct demon-army battle 2 composition is missing.');
assert(story.includes('"noRecruit": true, "noQuestProgress": true'), 'Story demon battle must not leak recruitment/quest progress.');
assert(story.includes('"rewardKey": "luna_crystal_tree_300k"'), 'Crystal Tree Luna story EXP once-only key is missing.');
assert(story.includes('{ "type": "SET_EXP_MULTIPLIER", "charId": 401, "pct": 1800 }'), 'Crystal Tree clear must set Luna EXP multiplier to 1800%.');
assert(story.includes('{ "type": "WORLD_STATE", "key": "lunaMemoryStage", "value": 2 }'), 'Crystal Tree clear must advance Luna memory stage.');
assert(story.includes('{ "type": "WORLD_STATE", "key": "crystalTreeState", "value": 5 }'), 'Crystal Tree clear must complete crystalTreeState.');
assert(!story.match(/crystal_tree_(?:arrival|minerva_meeting|root_ritual|defense_clear)[\s\S]{0,1800}"type": "STEP", "value": 8/), 'Crystal Tree M0 must not jump to Step 8 before the reviewed Minerva theory scene.');
assert(story.includes('"7-11": "根元に残ったミネルバと話そう"'), 'Current playable endpoint must be explicit without opening Demon Castle early.');
assert((news.match(/date: "2026\/08\/10"/g) || []).length === 1, 'NEWS_DATA must keep one 2026/08/10 record.');
assert(news.includes('結晶樹の秘跡'), '2026/08/10 news must mention the new Crystal Tree route.');
assert(story.indexOf('{ "type": "ALLY", "charId": 401, "initialLevel": 1, "expMultiplierPct": 2000, "silent": true }') < story.indexOf('{ "type": "FLAG", "key": "crystalTreeMinervaMet", "refreshField": true }'), 'Luna join must commit before crystalTreeMinervaMet so interrupted re-entry stays recoverable.');
const clearEventStart = story.indexOf('"crystal_tree_defense_clear": {');
const clearEventEnd = story.indexOf('"crystal_tree_post_clear_checkpoint": {', clearEventStart);
const clearEvent = clearEventStart >= 0 && clearEventEnd > clearEventStart ? story.slice(clearEventStart, clearEventEnd) : '';
assert(clearEvent.indexOf('"rewardKey": "luna_crystal_tree_300k"') >= 0, 'Clear event must contain the once-only Luna reward.');
assert(clearEvent.indexOf('"rewardKey": "luna_crystal_tree_300k"') < clearEvent.lastIndexOf('"key": "crystalTreeCleared"'), 'Once-only Luna reward must execute before the final crystalTreeCleared commit flag.');
assert(clearEvent.indexOf('"pct": 1800') < clearEvent.lastIndexOf('"key": "crystalTreeCleared"'), 'EXP multiplier update must execute before the final crystalTreeCleared commit flag.');

if (!process.exitCode) console.log('[phase7c-crystal-tree] PASS: Water City -> Crystal Tree M0 -> Minerva -> demon defense -> Luna reward route is coherent and walkable.');
