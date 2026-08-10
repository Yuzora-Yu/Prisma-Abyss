const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const fail = msg => { console.error(`[phase7d-six-element] FAIL: ${msg}`); process.exitCode = 1; };
const assert = (cond, msg) => { if (!cond) fail(msg); };

const story = read('story.js');
const map = read('map.js');
const main = read('main.js');
const database = read('database.js');
const assets = read('assets.js');
const canon = read('canon/PRISMA_SCENARIO_CANON_MASTER_v8.md');
const draft = read('docs/scenario/36_CRYSTAL_TREE_SIX_ELEMENT_RITUAL_DRAFT_20260810.md');

const sliceBetween = (text, startNeedle, endNeedle) => {
  const start = text.indexOf(startNeedle);
  const end = start >= 0 ? text.indexOf(endNeedle, start + startNeedle.length) : -1;
  return start >= 0 && end > start ? text.slice(start, end) : '';
};

assert(draft.includes('**Status:** approved / implemented'), 'Approved ritual Markdown must be bundled and marked implemented.');
assert(canon.includes('## 32.18 結晶樹の六属性循環・人体小循環・秘薬'), 'Scenario canon must contain the Phase7D six-element section.');
for (const term of ['水 → 風 → 光 → 火 → 雷 → 闇', '**水:** 血液・体液', '**風:** 呼吸', '**光:** 覚醒・生命リズム', '**火:** 代謝・体温', '**雷:** 神経信号', '**闇:** 睡眠・回復']) {
  assert(canon.includes(term), `Canon is missing: ${term}`);
}

const ritual = sliceBetween(story, '        "CRYSTAL_TREE_SIX_ELEMENT_RITUAL": [', '        "CRYSTAL_TREE_POST_RITUAL_REPEAT": [');
assert(ritual, 'CRYSTAL_TREE_SIX_ELEMENT_RITUAL script is missing.');
const order = ['crystal-ritual-water','crystal-ritual-wind','crystal-ritual-light','crystal-ritual-fire','crystal-ritual-thunder','crystal-ritual-dark'];
let last = -1;
for (const id of order) {
  const pos = ritual.indexOf(`"id": "${id}"`);
  assert(pos > last, `Ritual pedestal order is wrong or missing at ${id}.`);
  last = pos;
}
assert(ritual.includes('支配するか。命令へ逆らえなくするか。意志へ割り込むか。'), 'Ritual must explicitly test domination/command/will interference as observed phenomena.');
assert(ritual.includes('正常な闇には、そういう反応がない。'), 'Ritual must state that normal Darkness did not show domination reactions.');
assert(ritual.includes('黒いから闇、って決める方が雑だよ。'), 'Minerva must separate black abnormal phenomena from normal Darkness.');
assert(ritual.includes('分からないものが増えた。いいね。'), 'Minerva playful curiosity voice marker is missing.');
assert(ritual.includes('"text": "レイラは。"'), 'Leon must ask for Leila first after waking.');
assert(ritual.includes('暖かな光') && ritual.includes('小さな水路') && ritual.includes('白い祈り布') && ritual.includes('炊事の火の匂い'), 'Luna sensory hometown memory is incomplete.');
assert(story.includes('小さな光神の祠へ朝日が差し、白い祈り布が風に揺れている。水路の音に、炊事の匂いが混じっていた。'), 'Prologue must contain the subtle hometown sensory motif.');
assert(story.includes('{ "name": "シャオ", "charId": 105, "text": "またそれか。理由も言わずに連れていけると思うな。" }'), 'Crystal Tree root ritual Xiao charId must be 105.');

for (const key of ['water','wind','light','fire','thunder','dark']) {
  assert(assets.includes(`prism_pedestal_${key}:`), `Existing pedestal asset registration missing for ${key}.`);
  assert(map.includes(`"authoredPlacementId": "crystal-ritual-pedestal-${key}"`), `Crystal Tree M0 pedestal placement missing for ${key}.`);
  assert(map.includes(`"imageKey": "prism_pedestal_${key}"`), `Crystal Tree M0 pedestal imageKey missing for ${key}.`);
}

assert(story.includes('{ "type": "FLAG", "key": "leilaCrystalTreeLeafTreated" }'), 'Leila leaf treatment must set a dedicated flag.');
const waterBrief = sliceBetween(story, '        "water_city_crystal_tree_briefing": {', '        "crystal_tree_route_departure": {');
assert(waterBrief.includes('"key": "leilaCrystalTreeLeafTreated"'), 'Crystal Tree briefing must require Leila leaf treatment for new progression.');
assert(waterBrief.includes('WATER_CITY_CRYSTAL_TREE_BRIEFING_LEILA_PENDING'), 'Missing natural pending dialogue when Leila treatment has not been observed.');
const prisonCheck = sliceBetween(story, '        "light_palace_check_prison_rescue": {', '        "light_palace_alan_betrayal": {');
assert(prisonCheck.includes('"key": "lightPalaceLeilaLocated"'), 'Light Palace final route must still use Leila located state and avoid a treatment circular dependency.');
assert(!prisonCheck.includes('leilaCrystalTreeLeafTreated'), 'Light Palace prison rescue must not require post-clear Leila treatment and softlock the altar.');

assert(main.includes('storyStateSchemaVersion: 9'), 'Main story state schema must be bumped for Phase7D compatibility.');
assert(database.includes('storyStateSchemaVersion: 9'), 'Database story state schema must be bumped for Phase7D compatibility.');
assert(main.includes('flags.leilaJoined === true && flags.leilaCrystalTreeLeafTreated !== true'), 'Old Leila-joined saves must migrate to the new treatment flag.');
const reconcile = sliceBetween(main, '    reconcileCrystalTreeWorldState:', '    getWorldStateValue:');
assert(!reconcile.includes('crystalTreeSixElementRitualSeen = true'), 'Old crystalTreeCleared saves must not be auto-marked as having watched the new ritual.');

const defense = sliceBetween(story, '        "crystal_tree_defense_clear": {', '        "crystal_tree_post_clear_checkpoint": {');
assert(!defense.includes('leonCrystalTreeTreated') && !defense.includes('luna_crystal_tree_300k'), 'Formal treatment/reward must not commit at defense clear.');
const post = sliceBetween(story, '        "crystal_tree_post_clear_checkpoint": {', '        "light_palace_overpower_clear": {');
assert(post.includes('"key": "crystalTreeSixElementRitualSeen"'), 'Independent ritual seen flag is missing.');
assert(post.includes('"value": "CRYSTAL_TREE_POST_RITUAL_REPEAT"'), 'Post-ritual repeat dialogue is missing.');

if (!process.exitCode) console.log('[phase7d-six-element] PASS: approved six-element medicine ritual, save compatibility, Leila gate, pedestals, and subtle hometown foreshadowing are wired.');
