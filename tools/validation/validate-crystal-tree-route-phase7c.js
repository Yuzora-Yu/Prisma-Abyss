const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const fail = msg => { console.error(`[phase7c-crystal-tree] FAIL: ${msg}`); process.exitCode = 1; };
const assert = (cond, msg) => { if (!cond) fail(msg); };

const map = read('map.js');
const story = read('story.js');
const news = read('news.js');

const sliceBetween = (text, startNeedle, endNeedle) => {
  const start = text.indexOf(startNeedle);
  const end = start >= 0 ? text.indexOf(endNeedle, start + startNeedle.length) : -1;
  return start >= 0 && end > start ? text.slice(start, end) : '';
};

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

const crystalBlock = sliceBetween(map, '    "CRYSTAL_TREE": {', '\n    }\n};');
const tileBlock = (crystalBlock.match(/"tiles": \[([\s\S]*?)\n        \],/) || [])[1] || '';
const rows = [...tileBlock.matchAll(/"([WGT]+)"/g)].map(m => m[1]);
assert(rows.length === 21, `Crystal Tree M0 should have 21 rows, got ${rows.length}.`);
assert(rows.every(r => r.length === 29), 'Crystal Tree M0 row width must stay 29.');

const blockers = new Set();
for (const m of crystalBlock.matchAll(/"authoredPlacementId": "crystal-ritual-pedestal-[^"]+"[\s\S]*?"x":\s*(\d+),\s*"y":\s*(\d+)[\s\S]*?"blocking": true/g)) {
  blockers.add(`${Number(m[1])},${Number(m[2])}`);
}

function reachable(sx, sy, targets) {
  if (!rows.length) return new Set();
  const q = [[sx,sy]], seen = new Set([`${sx},${sy}`]);
  while (q.length) {
    const [x,y] = q.shift();
    for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx=x+dx, ny=y+dy, key=`${nx},${ny}`;
      if (ny<0 || ny>=rows.length || nx<0 || nx>=rows[0].length || seen.has(key) || blockers.has(key) || rows[ny][nx] === 'W') continue;
      seen.add(key); q.push([nx,ny]);
    }
  }
  return new Set(targets.filter(([x,y]) => seen.has(`${x},${y}`)).map(([x,y]) => `${x},${y}`));
}
const rootAdj = [[13,6],[15,6],[14,5],[14,7]];
const reached = reachable(14,18, [[14,11],[14,18], ...rootAdj]);
assert(reached.has('14,11'), 'Entry must reach Minerva first-meeting position with ritual pedestals present.');
assert(rootAdj.some(([x,y]) => reached.has(`${x},${y}`)), 'Entry must reach a tile adjacent to Minerva root-ritual position.');
assert(reached.has('14,18'), 'Water-gate return marker must remain reachable.');

for (const id of ['crystal_tree_route_departure','crystal_tree_arrival','crystal_tree_minerva_meeting','crystal_tree_root_ritual','crystal_tree_defense_clear','crystal_tree_post_clear_checkpoint']) {
  assert(story.includes(`"${id}": {`), `${id} story event is missing.`);
}
assert(story.includes('{ "type": "ALLY", "charId": 401, "initialLevel": 1, "expMultiplierPct": 2000, "silent": true }'), 'Luna formal join must use the shared ally path with 2000% EXP requirement.');
assert(story.includes('"7-9": "結晶樹の根元へ向かおう"'), '7-9 objective must not imply Luna is forced into the active battle party.');
assert(story.includes('"value": [652, 755, 652]'), 'Direct demon-army battle 2 composition is missing.');
assert(story.includes('"noRecruit": true, "noQuestProgress": true'), 'Story demon battle must not leak recruitment/quest progress.');
assert(story.includes('"7-11": "根元に残ったミネルバと話そう"'), '7-11 checkpoint objective must remain explicit.');
assert(story.includes('"8-0": "ガルヴァニア渓谷を越え、魔王城で闇のプリズムの真実を確かめよう"'), 'Crystal Tree completion must point through Galvania Gorge to the revised Demon Castle objective.');

assert((news.match(/date: "2026\/08\/10"/g) || []).length === 1, 'NEWS_DATA must keep one 2026/08/10 record.');
assert(news.includes('結晶樹の六属性秘薬'), '2026/08/10 news must mention the six-element Crystal Tree medicine ritual.');

const joinPos = story.indexOf('{ "type": "ALLY", "charId": 401, "initialLevel": 1, "expMultiplierPct": 2000, "silent": true }');
const minervaCommitPos = story.indexOf('{ "type": "FLAG", "key": "crystalTreeMinervaMet", "refreshField": true }', joinPos);
assert(joinPos >= 0 && minervaCommitPos > joinPos, 'Luna join must commit before crystalTreeMinervaMet so interrupted re-entry stays recoverable.');

const defenseEvent = sliceBetween(story, '        "crystal_tree_defense_clear": {', '        "crystal_tree_post_clear_checkpoint": {');
assert(defenseEvent.includes('"value": "CRYSTAL_TREE_DEFENSE_CLEAR"'), 'Defense clear must play the emergency-stabilization conversation.');
assert(defenseEvent.includes('{ "type": "SUB", "value": 11 }'), 'Defense clear must stop at subStep 11.');
assert(defenseEvent.includes('"key": "crystalTreeDefenseCleared"'), 'Defense clear flag is missing.');
assert(!defenseEvent.includes('luna_crystal_tree_300k'), 'Defense clear must not grant the formal Luna treatment reward before the ritual.');
assert(!defenseEvent.includes('"key": "leonCrystalTreeTreated"'), 'Defense clear must not commit Leon treatment before the ritual.');
assert(!defenseEvent.includes('"key": "crystalTreeCleared"'), 'Defense clear must not commit Crystal Tree completion before the ritual.');
assert(!defenseEvent.includes('"type": "STEP", "value": 8'), 'Defense clear must not jump to Step 8.');

const ritualEvent = sliceBetween(story, '        "crystal_tree_post_clear_checkpoint": {', '        "light_palace_overpower_clear": {');
for (const needle of [
  '"value": "CRYSTAL_TREE_SIX_ELEMENT_RITUAL"',
  '"key": "leonCrystalTreeTreated"',
  '"key": "lunaCrystalTreeStabilized"',
  '"key": "lunaMemoryStage", "value": 2',
  '"rewardKey": "luna_crystal_tree_300k"',
  '"pct": 1800',
  '"key": "crystalTreeState", "value": 5',
  '"key": "crystalTreeSixElementRitualSeen"',
  '"key": "crystalTreeCleared"',
  '"type": "STEP", "value": 8',
  '"type": "SUB", "value": 0'
]) assert(ritualEvent.includes(needle), `Post-clear ritual event is missing required action: ${needle}`);

const ritualConv = ritualEvent.indexOf('"value": "CRYSTAL_TREE_SIX_ELEMENT_RITUAL"');
const reward = ritualEvent.indexOf('"rewardKey": "luna_crystal_tree_300k"');
const clear = ritualEvent.lastIndexOf('"key": "crystalTreeCleared"');
const step8 = ritualEvent.indexOf('"type": "STEP", "value": 8');
assert(ritualConv >= 0 && reward > ritualConv, 'Formal reward must occur after the approved ritual conversation.');
assert(reward >= 0 && clear > reward, 'Once-only Luna reward must execute before final crystalTreeCleared commit.');
assert(clear >= 0 && step8 > clear, 'Step 8 must be entered only after final Crystal Tree completion commit.');

if (!process.exitCode) console.log('[phase7c-crystal-tree] PASS: Water City -> Crystal Tree M0 -> defense checkpoint -> approved ritual -> Step 8 route is coherent and walkable.');
