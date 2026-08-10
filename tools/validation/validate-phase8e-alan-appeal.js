const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..', '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const fail = msg => { console.error(`[phase8e-alan] FAIL: ${msg}`); process.exitCode = 1; };
const assert = (cond, msg) => { if (!cond) fail(msg); };

function loadStory() {
  const ctx = { console };
  vm.createContext(ctx);
  vm.runInContext(read('story.js') + '\n;globalThis.__DATA=STORY_MANAGER_DATA;', ctx);
  return ctx.__DATA;
}
function loadQuestData() {
  const ctx = { console };
  vm.createContext(ctx);
  vm.runInContext(read('quests.js'), ctx);
  return ctx.QUEST_DATA;
}
function loadMaps() {
  const ctx = { console };
  vm.createContext(ctx);
  vm.runInContext(read('map.js') + '\n;globalThis.__FM=FIXED_MAPS;globalThis.__FDM=FIXED_DUNGEON_MAPS;', ctx);
  return { fixed: ctx.__FM, dungeons: ctx.__FDM };
}

const story = loadStory();
const qdata = loadQuestData();
const maps = loadMaps();
const q = qdata.arel_kagetora_appeal;
const itemText = read('items.js');
const monsterText = read('monsters.js');
const mainText = read('main.js');
const news = read('news.js');
const approved = read('docs/scenario/42_ALAN_AREL_KAGETORA_APPEAL_AND_ALTAR_PHASE8E_APPROVED_20260810.md');
const inventory = read('docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md');

assert(q && q.kind === 'travel', 'arel_kagetora_appeal quest must exist as a staged travel quest.');
assert(Array.isArray(q.unlockFlags) && q.unlockFlags.includes('alanBetrayedLightPalace'), 'quest must unlock immediately after Alan betrays at Light Palace.');
assert(q.startEventId === 'arel_kagetora_quest_start_phase8e', 'quest start event must point to Phase8E Zelied scene.');
assert(Array.isArray(q.rewardItems) && q.rewardItems.some(x => x.id === 701011 && x.count === 1), 'quest must reward the original appeal document item.');

assert(itemText.includes('"id": 701011') && itemText.includes('"name": "王への上申書"'), '王への上申書 key item is missing.');
assert(itemText.includes('国王への提出を準備していた上申書') && itemText.includes('暗部に消されたはずの原本'), 'item description must state the original Arel petition meaning.');
assert(!itemText.includes('王印を追記'), 'item/runtime must not use the rejected modern royal-stamp interpretation.');

const scriptKeys = [
  'AREL_QUEST_START_PHASE8E','AREL_WATER_ARCHIVE_PHASE8E','AREL_REXNOTE_RECORD_PHASE8E',
  'AREL_PALACE_OLD_ORDER_PHASE8E','AREL_HAYATE_TRUTH_PHASE8E','AREL_APPEAL_FOUND_PHASE8E',
  'ALAN_ALTAR_OPENING_PHASE8E','ALAN_ALTAR_NO_APPEAL_WARNING_PHASE8E','ALAN_ALTAR_RETREAT_PHASE8E',
  'ALAN_ALTAR_WITH_APPEAL_PHASE8E','ALAN_ALTAR_DEATH_PHASE8E','ALAN_ALTAR_POST_BATTLE_APPEAL_PHASE8E',
  'ALAN_ALTAR_SAVED_PHASE8E','ALAN_ALTAR_DEATH_WITH_APPEAL_PHASE8E'
];
for (const key of scriptKeys) assert(Array.isArray(story.scripts[key]), `${key} must live under STORY_MANAGER_DATA.scripts.`);
assert(!story.ALAN_ALTAR_OPENING_PHASE8E, 'Phase8E conversations must not be misplaced at STORY_MANAGER_DATA root.');

const flatten = key => story.scripts[key].map(x => `${x.name}:${x.text}`).join('\n');
const appealFound = flatten('AREL_APPEAL_FOUND_PHASE8E');
assert(appealFound.includes('宛先『国王陛下』') && appealFound.includes('署名は、アレル＝レクスノート'), 'original petition discovery must identify addressee and Arel signature.');
assert(appealFound.includes('プリズム統合の儀を即時停止'), 'original petition must explicitly seek to stop the integration ritual.');

const hayate = story.scripts.AREL_HAYATE_TRUTH_PHASE8E;
const hayateLines = hayate.filter(x => x.name === 'ハヤテ').map(x => x.text).join('\n');
assert(hayateLines.includes('父さんは、あんたを一番信じてた'), 'Hayate must remember Zelied as Kagetora’s most trusted partner.');
assert(hayateLines.includes('許すとも、許さないとも、まだ言えない'), 'Hayate must defer forgiveness rather than instantly reconcile.');
assert(hayateLines.includes('自分の手で、自分の目で') && hayateLines.includes('もう一度、あんたと話したい'), 'Hayate must choose to verify truth and talk again later.');
assert(!hayateLines.includes('斬る') && !hayateLines.includes('殺す') && !hayateLines.includes('胸倉'), 'Hayate must not be rewritten into an immediate aggressive confrontation.');

const alanCombined = ['ALAN_ALTAR_OPENING_PHASE8E','ALAN_ALTAR_WITH_APPEAL_PHASE8E','ALAN_ALTAR_NO_APPEAL_WARNING_PHASE8E']
  .map(flatten).join('\n');
assert(!alanCombined.includes('あの門') && !alanCombined.includes('門を破') && !alanCombined.includes('ガルヴァニア渓谷'), 'Alan must not reveal the Galvania Gorge gate destruction at the altar.');
assert(alanCombined.includes('俺が選んだ'), 'Alan must retain responsibility for choosing to stand with Jasper.');

const ev = story.events;
assert(ev.arel_kagetora_hayate_truth_phase8e.actions.some(a => a.type === 'ALLY' && a.value === 203), 'Hayate must formally join after the truth scene.');
assert(ev.arel_kagetora_appeal_found_phase8e.actions.some(a => a.type === 'QUEST_COMPLETE' && a.value === 'arel_kagetora_appeal'), 'petition discovery must complete the long quest.');

const altar = ev.integration_altar_alan_phase8e;
const altarText = JSON.stringify(altar);
assert(altarText.includes('"yesLabel":"進む"') && altarText.includes('"noLabel":"引き返す"'), 'no-petition route must explicitly offer 進む / 引き返す.');
assert(altarText.includes('alanAltarIrreversibleAccepted'), 'proceeding without petition must record irreversible acceptance.');
assert(altarText.includes('301110'), 'altar event must start the Light Wedge Alan boss.');
const clearText = JSON.stringify(ev.integration_altar_alan_clear_phase8e);
assert(clearText.includes('"yesLabel":"共に生きろ"') && clearText.includes('"noLabel":"ここで終わらせる"'), 'petition route must still leave Alan life/death to player choice.');
assert(clearText.includes('"value":"saved"') && clearText.includes('"value":"dead"'), 'post-battle route must commit both saved and dead outcomes.');
assert(clearText.includes('QUEST_FAIL'), 'no-petition death must fail the unfinished long quest.');

assert(monsterText.includes('"id":301110') && monsterText.includes('"name":"光の楔アラン"') && monsterText.includes('"rank":95'), 'Rank95 Light Wedge Alan story boss is missing.');

const abyss = maps.fixed.ABYSS_FIELD;
assert(Array.isArray(abyss.mapActors), 'Integration Altar must use mapActors for Alan.');
const alanActor = abyss.mapActors.find(a => a.actorId === 'alan_integration_altar_phase8e');
assert(alanActor && alanActor.imageKey === 'overlay_companion_alan', 'Alan must be a person actor, not a person sprite in mapActions.');
const alanState = alanActor.states.find(s => s.stateId === 'alan_altar_unresolved');
assert(alanState && alanState.when.requiredFlag === 'nadirCaveCleared' && alanState.when.missingFlag === 'alanAltarResolved', 'Alan actor must gate the altar after Nadir Cave until resolution.');
assert(alanState.action.eventId === 'integration_altar_alan_phase8e', 'Alan actor must invoke the Phase8E confrontation.');
const crack = abyss.mapActions.find(a => a.x === 8 && a.y === 7 && a.type === 'abyssDungeon');
assert(crack && crack.requiredFlag === 'alanAltarResolved' && Array.isArray(crack.events) && crack.events.some(e => e.eventId === 'abyss_unsealed'), 'central Abyss route must unlock only after Alan is resolved.');
assert(!abyss.mapActions.some(a => a.imageKey === 'overlay_companion_alan'), 'person image must not remain in Integration Altar mapActions.');

const thunder1 = maps.dungeons.THUNDER_FORT.floors[0];
const zeliedActor = thunder1.mapActors.find(a => a.actorId === 'zelied_arel_long_arc_phase8e');
assert(zeliedActor && thunder1.tiles[zeliedActor.y][zeliedActor.x] !== 'W', 'Phase8E Zelied quest actor must stand on a walkable tile.');

assert(mainText.includes('alanAltarLegacyBypass') && mainText.includes('alanAltarResolved'), 'old-save migration must bypass the new altar gate without rollback.');
assert(approved.includes('未提出原本') && approved.includes('生存を可能にする条件'), 'approved source must document corrected petition and non-forced rescue.');
assert(inventory.includes('SYSTEM_UI_TEXT_REVIEW') === false || inventory.includes('現行'), 'system/UI review inventory must be present and structured.');
assert(news.includes('アレルとカゲトラの連続クエスト') && news.includes('救済／死亡分岐'), 'NEWS must mention delivered Phase8E content.');

if (!process.exitCode) console.log('[phase8e-alan] PASS: corrected original-petition quest, Hayate/Zelied relationship, Alan boss, irreversible/no-petition and player-chosen petition branches, map gating, and save migration are wired.');
