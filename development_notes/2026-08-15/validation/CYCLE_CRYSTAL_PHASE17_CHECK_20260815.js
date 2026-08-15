'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../../..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

let passed = 0;
let failed = 0;
const failures = [];
function check(label, condition) {
    if (condition) {
        passed++;
        console.log(`PASS ${label}`);
    } else {
        failed++;
        failures.push(label);
        console.error(`FAIL ${label}`);
    }
}
function includesAll(text, parts) { return parts.every(part => text.includes(part)); }
function between(text, start, end) {
    const a = text.indexOf(start);
    if (a < 0) return '';
    const b = text.indexOf(end, a + start.length);
    return b < 0 ? text.slice(a) : text.slice(a, b);
}

// story.js can be loaded as data if a browser-like window alias exists.
global.window = globalThis;
require(path.join(root, 'story.js'));
const storyData = global.STORY_MANAGER_DATA || {};
const events = storyData.events || {};
const scripts = storyData.scripts || {};
const storyText = read('story.js');
const logic = read('story_logic.js');
const main = read('main.js');
const map = read('map.js');
const items = read('items.js');
const abyss = read('abyss_content.js');
const battle = read('battle.js');
const itemRuntime = read('item_runtime.js');
const canon = read('canon/PRISMA_SCENARIO_CANON_MASTER_v8.md');
const roadmap = read('canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md');
const news = read('news.js');

const completeScript = scripts.ABYSS_SPIRIT_TRIAL_ALL_COMPLETE || [];
check('Six-spirit completion no longer grants completed item immediately',
    completeScript.length === 3
    && completeScript.some(line => String(line.text || '').includes('結晶樹の秘跡へ戻る'))
    && !completeScript.some(line => String(line.text || '').includes('オクタプリズマ'))
    && !completeScript.some(line => String(line.text || '').includes('手に入れた')));

const legacyGrantEvent = events.abyss_spirit_trials_octaprism_grant || {};
const legacyGrantJson = JSON.stringify(legacyGrantEvent);
check('Legacy grant event is retained only as return-to-Crystal-Tree compatibility route',
    legacyGrantJson.includes('abyssCycleCrystalRitualPending')
    && legacyGrantJson.includes('ABYSS_SPIRIT_TRIAL_ALL_COMPLETE')
    && !legacyGrantJson.includes('ABYSS_SPIRIT_TRIAL_GRANT_OCTAPRISM')
    && !legacyGrantJson.includes('"type":"ITEM"'));

check('Crystal Tree ritual script exists with Minerva-led circulation and Lycion witness',
    Array.isArray(scripts.CRYSTAL_TREE_CYCLE_CRYSTAL_RITUAL_PHASE17)
    && includesAll(JSON.stringify(scripts.CRYSTAL_TREE_CYCLE_CRYSTAL_RITUAL_PHASE17), [
        'ミネルバ','水の次に風','くっつけたら駄目','ルーナ','焼け焦げたペンダント','リュシオン','輪廻の結晶'
    ]));

const ritualEvent = events.crystal_tree_cycle_crystal_ritual_phase17 || {};
const ritualJson = JSON.stringify(ritualEvent);
check('Crystal Tree ritual event commits Cycle Crystal creation exactly through dedicated action',
    ritualJson.includes('ABYSS_CYCLE_CRYSTAL_CREATE')
    && ritualJson.includes('abyssAllSpiritTrialsCleared')
    && ritualJson.includes('abyssCycleCrystalCreated'));

check('Story runtime has dedicated Cycle Crystal create action and keeps legacy action as non-grant compatibility path',
    includesAll(logic, ['ABYSS_CYCLE_CRYSTAL_CREATE','createCycleCrystalFromRitual','ABYSS_SPIRIT_TRIAL_GRANT_OCTAPRISM','abyssCycleCrystalRitualPending'])
    && between(logic, "if (action.type === 'ABYSS_SPIRIT_TRIAL_GRANT_OCTAPRISM')", "if (action.type === 'BOSS')").indexOf('grantOctaprismFromPendant') < 0);

const createBlock = between(main, 'createCycleCrystalFromRitual: () => {', 'resolveAbyssSpiritTrialEventId:');
check('Create API requires six blessings and prior Crystal Tree clear',
    includesAll(createBlock, ['elements.every(element => progress.abyssSpiritBlessings?.[element] === true)', "progress.flags.crystalTreeCleared !== true"]));
check('Create API transforms pendant, grants Item 701008, and commits created flag',
    includesAll(createBlock, ['charredPendantItemId','lightCrystalPendantItemId','cycleCrystalItemId','abyssCycleCrystalCreated = true','abyssCycleCrystalRitualPending = false']));
check('Legacy API alias is retained for code compatibility', main.includes('grantOctaprismFromPendant: () => App.createCycleCrystalFromRitual()'));

const migrationBlock = between(main, 'migrateCycleCrystalRitualV1:', '// ペンダント導入前のセーブへ');
check('One-time Cycle Crystal migration exists', migrationBlock.includes('20260815_cycleCrystalRitualV1'));
check('Migration preserves old Item 701008 owners without ritual replay',
    includesAll(migrationBlock, ['ownsCycleCrystal','abyssCycleCrystalCreated','abyssCycleCrystalRitualSeen','abyssOctaprismGrantEventSeen']));
check('Migration backfills only already-past-final-gate legacy saves when Item 701008 is missing',
    includesAll(migrationBlock, ['alreadyPastGate','abyssVegnasisDefeated','abyssAzelgaragDefeated','abyssEpilogueSeen','!ownsCycleCrystal && allCleared && alreadyPastGate']));

check('Crystal Tree Minerva actor exposes ritual state before repeat state',
    includesAll(map, ['"stateId": "cycle_crystal_ritual_phase17"','"priority": 120','"requiredFlags": ["crystalTreeCleared", "abyssAllSpiritTrialsCleared"]','"missingFlag": "abyssCycleCrystalCreated"','"stateId": "cycle_crystal_after_phase17"']));
check('Final Altar map gate requires Illuminacia + six spirits + Cycle Crystal',
    map.includes("requiredFlags: ['abyssIlluminaciaDefeated','abyssAllSpiritTrialsCleared','abyssCycleCrystalCreated']"));

const finalJson = JSON.stringify(events.abyss_final_altar_encounter || {});
check('Final Altar event itself guards Illuminacia + six spirits + Cycle Crystal',
    includesAll(finalJson, ['abyssIlluminaciaDefeated','abyssAllSpiritTrialsCleared','abyssCycleCrystalCreated']));
check('Vegnasis remains five wedges',
    finalJson.includes('[302080,302081,302082,302083,302084]') || storyText.includes("value:[302080,302081,302082,302083,302084]"));
check('Vegnasis clear now shows Cycle Crystal counter-scene before Azelgarag',
    JSON.stringify(events.abyss_vegnasis_clear || {}).includes('ABYSS_CYCLE_CRYSTAL_FINAL_ARRAY_PHASE17')
    && JSON.stringify(events.abyss_vegnasis_clear || {}).includes('ABYSS_AZELGARAG'));

const item701008 = between(items, '"id": 701008', '"id": 701009');
check('Item 701008 player-facing identity is Cycle Crystal',
    includesAll(item701008, ['"name": "輪廻の結晶"','六つの属性が互いへ役割を渡し続ける循環を封じた結晶','"consumable": false']));
check('Abyss content exposes canonical Cycle Crystal names plus legacy aliases',
    includesAll(abyss, ['cycleCrystalItemId: 701008','octaprismItemId: 701008','cycleCrystalSupportMaster: CYCLE_CRYSTAL_SUPPORT_MASTER','octaprismSupportMaster: CYCLE_CRYSTAL_SUPPORT_MASTER']));
check('Battle logs are Cycle Crystal-facing while octaprism battle state remains compatible',
    includesAll(battle, ['輪廻の結晶が巡り、六精霊の加護がアルスを混沌から守る！','輪廻の結晶の六色が巡り','octaprismState'])
    && !battle.includes('オクタプリズマが六精霊の道を開き'));
check('Item runtime message uses Cycle Crystal terminology', itemRuntime.includes('輪廻の結晶は道具として使うものではない。'));

check('Abyss objective routes completed trials back to Crystal Tree', logic.includes("return '六つの結晶片を持ち、結晶樹の秘跡へ戻ろう'"));
check('Active runtime has no player-facing old Octaprism Japanese name',
    ![storyText, logic, map, items, abyss, battle, itemRuntime].some(text => text.includes('オクタプリズマ')));

check('Canon §47 is definitive and uses established pendant/Lycion terminology',
    includesAll(canon, ['「輪廻の結晶」**として再構成する。','焼け焦げたペンダント','リュシオン','終焉の祭壇へ進むには、イルミナシア撃破と六精霊試練完了に加え、結晶樹の秘跡で輪廻の結晶を生成していることを必須とする。'])
    && !between(canon, '# 47. 輪廻の結晶', '\n---').includes('焼け焦げたネックレス'));
check('Roadmap Phase17 gate includes Cycle Crystal generation', roadmap.includes('イルミナシア撃破・六精霊試練完了・結晶樹の秘跡での輪廻の結晶生成を必須とする'));

const dateCount = (news.match(/date: "2026\/08\/15"/g) || []).length;
check('news.js keeps exactly one 2026/08/15 record', dateCount === 1);
check('2026/08/15 news mentions Cycle Crystal mainline event', news.includes('六精霊の試練後に結晶樹で「輪廻の結晶」を生み出す本編イベントを追加しました'));

console.log(`\nRESULT ${passed}/${passed + failed} PASS`);
if (failed) {
    console.error(`FAILED: ${failures.join(', ')}`);
    process.exit(1);
}
