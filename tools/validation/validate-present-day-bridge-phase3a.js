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
const reesActor = (hut.mapActors || []).find(a => a.actorId === 'rees_hut_rees');
assert(reesActor, 'Rees is not visibly placed in her mountain hut.');
assert((reesActor.states || []).some(s => s.action?.eventId === 'present_talk_rees'), 'Rees has no departure conversation interaction.');
const hutWorldExit = (hut.worldExits || []).find(e => Number(e.x) === 5 && Number(e.y) === 7);
assert(hutWorldExit && hut.tiles?.[7]?.[5] === 'S', 'Rees hut has no visible contact-driven world exit tile.');
assert(hutWorldExit.requiredFlag === 'prologueReesDepartureTalkSeen', 'Rees hut exit is not gated by speaking with Rees.');
assert(hutWorldExit.setFlag === 'prologueDepartedReesHut', 'Rees hut world exit does not persist actual departure on contact.');

const lumina = maps.START_VILLAGE;
assert(lumina?.entryEventId === 'present_lumina_rescue', 'Current Lumina village does not trigger the new arrival rescue event.');
assert(lumina?.entryEventFlag === 'presentLuminaRescueSeen', 'Current Lumina rescue is not one-time.');
assert(Number(lumina?.entryEventStoryStep) === 0, 'Current Lumina rescue is not limited to storyStep 0.');
assert(Array.isArray(lumina?.entryEventConditions?.requiredFlags) && lumina.entryEventConditions.requiredFlags.includes('prologueDepartedReesHut'), 'Current Lumina rescue can trigger without leaving Rees hut via the new prologue bridge.');

const reesTalk = events.present_talk_rees;
assert(reesTalk?.actions?.some(a => a.type === 'FLAG' && a.key === 'prologueReesDepartureTalkSeen'), 'Rees conversation does not unlock the hut exit.');
assert(!JSON.stringify(reesTalk || {}).includes('START_FIXED_MAP'), 'Talking to Rees must not teleport directly into an undiscovered village.');

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

for (const key of ['PROLOGUE_PRESENT_WAKE','PRESENT_REES_TALK','PRESENT_REES_AFTER_TALK','PRESENT_LUMINA_RESCUE','PRESENT_LUMINA_RESCUE_AFTER','PRESENT_LUMINA_RESCUE_RETRY']) {
  assert(Array.isArray(scripts[key]) && scripts[key].length, `Missing present bridge script ${key}.`);
}
assert(Array.isArray(scripts.PROLOGUE3) && scripts.PROLOGUE3.some(line => String(line.text || '').includes('王都で大きな統合の儀')), 'Post-cave elder scene does not give the integration-ritual clue.');
assert(!scripts.PROLOGUE3.some(line => String(line.text || '').includes('5年ほど前でしょうか')), 'Post-cave elder scene still explains the five-year catastrophe as if Ars did not experience it.');
assert(!String(objectives['0-0'] || '').includes('リュミナ'), 'storyStep 0 objective must not reveal the village name before the player learns it.');
assert(String(objectives['0-1'] || '').includes('長老'), 'storyStep 0-1 does not route to the elder.');
assert(logicSource.includes("if (!flags.prologueReesDepartureTalkSeen) return 'リースと話そう'"), 'Objective runtime does not route the player to Rees after waking.');
assert(logicSource.includes("if (!flags.prologueDepartedReesHut) return '山小屋を出よう'"), 'Objective runtime does not use the spoiler-safe hut departure objective.');
assert(logicSource.includes("if (!flags.presentLuminaRescueSeen) return '山を下りた先の村の様子を確かめよう'"), 'Objective runtime reveals the village name before the arrival rescue.');
assert(mainSource.includes('areaDef.entryEventConditions') && mainSource.includes('App.evaluateGameConditions(areaDef.entryEventConditions)'), 'Fixed-map entry events cannot use the shared condition engine.');

console.log('PASS validate-present-day-bridge-phase3a');
