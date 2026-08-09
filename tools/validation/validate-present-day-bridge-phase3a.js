const fs = require('fs');
const path = require('path');
const { loadMapStoryRuntime } = require('./validation-helpers');
const root = path.resolve(__dirname, '..', '..');
const { context } = loadMapStoryRuntime(root);
const maps = context.FIXED_MAPS || {};
const events = context.StoryManager?.events || {};
const scripts = context.StoryManager?.scripts || {};
const objectives = context.StoryManager?.storyObjectives || {};
const mainSource = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const logicSource = fs.readFileSync(path.join(root, 'story_logic.js'), 'utf8');
function assert(v, msg) { if (!v) throw new Error(msg); }

const hut = maps.REES_MOUNTAIN_HUT;
assert(hut, 'Missing Rees mountain hut.');
assert((hut.mapActions || []).some(a => a.eventId === 'present_depart_rees' && a.requiredFlag === 'prologuePresentWakeSeen' && a.missingFlag === 'prologueDepartedReesHut'), 'Rees hut does not expose the one-time present-day departure action.');

const lumina = maps.START_VILLAGE;
assert(lumina?.entryEventId === 'present_lumina_rescue', 'Current Lumina village does not trigger the new arrival rescue event.');
assert(lumina?.entryEventFlag === 'presentLuminaRescueSeen', 'Current Lumina rescue is not one-time.');
assert(Number(lumina?.entryEventStoryStep) === 0, 'Current Lumina rescue is not limited to storyStep 0.');
assert(Array.isArray(lumina?.entryEventConditions?.requiredFlags) && lumina.entryEventConditions.requiredFlags.includes('prologueDepartedReesHut'), 'Current Lumina rescue can trigger without leaving Rees hut via the new prologue bridge.');

const depart = events.present_depart_rees;
assert(depart?.actions?.some(a => a.type === 'FLAG' && a.key === 'prologueDepartedReesHut'), 'Departure event does not persist the Rees-hut departure.');
assert(depart?.actions?.some(a => a.type === 'START_FIXED_MAP' && a.value === 'START_VILLAGE'), 'Departure event does not connect to current Lumina village.');

for (const eventId of ['present_lumina_rescue', 'present_lumina_rescue_retry']) {
  const event = events[eventId];
  const boss = event?.actions?.find(a => a.type === 'BOSS');
  assert(boss && Array.isArray(boss.value) && boss.value.length === 2 && boss.value.every(id => Number(id) === 100001), `${eventId} does not reuse the early two-monster rescue battle.`);
  assert(boss.lossEventId === 'present_lumina_rescue_retry', `${eventId} does not keep a safe tutorial retry path.`);
  assert(event?.winActions?.some(a => a.type === 'FLAG' && a.key === 'presentLuminaRescueSeen'), `${eventId} does not persist rescue completion.`);
  assert(event?.winActions?.some(a => a.type === 'SUB' && Number(a.value) === 1), `${eventId} does not move storyStep 0 to the elder objective.`);
  const convIndex = event.winActions.findIndex(a => a.type === 'CONV' && a.value === 'PRESENT_LUMINA_RESCUE_AFTER');
  const knownIndex = event.winActions.findIndex(a => a.type === 'FLAG' && a.key === 'luminaVillageNameKnown');
  assert(convIndex >= 0 && knownIndex > convIndex, `${eventId} reveals the village name before the elder says it.`);
}

for (const key of ['PROLOGUE_PRESENT_WAKE','PRESENT_REES_DEPART','PRESENT_LUMINA_RESCUE','PRESENT_LUMINA_RESCUE_AFTER','PRESENT_LUMINA_RESCUE_RETRY']) {
  assert(Array.isArray(scripts[key]) && scripts[key].length, `Missing present bridge script ${key}.`);
}
assert(Array.isArray(scripts.PROLOGUE3) && scripts.PROLOGUE3.some(line => String(line.text || '').includes('王都で大きな統合の儀')), 'Post-cave elder scene does not give the integration-ritual clue.');
assert(!scripts.PROLOGUE3.some(line => String(line.text || '').includes('5年ほど前でしょうか')), 'Post-cave elder scene still explains the five-year catastrophe as if Ars did not experience it.');
assert(!String(objectives['0-0'] || '').includes('リュミナ'), 'storyStep 0 objective must not reveal the village name before the player learns it.');
assert(String(objectives['0-1'] || '').includes('長老'), 'storyStep 0-1 does not route to the elder.');
assert(logicSource.includes("if (!flags.prologueDepartedReesHut) return '山小屋を出よう'"), 'Objective runtime does not use the spoiler-safe hut departure objective.');
assert(logicSource.includes("if (!flags.presentLuminaRescueSeen) return '山を下りた先の村の様子を確かめよう'"), 'Objective runtime reveals the village name before the arrival rescue.');
assert(mainSource.includes('areaDef.entryEventConditions') && mainSource.includes('App.evaluateGameConditions(areaDef.entryEventConditions)'), 'Fixed-map entry events cannot use the shared condition engine.');

console.log('PASS validate-present-day-bridge-phase3a');
