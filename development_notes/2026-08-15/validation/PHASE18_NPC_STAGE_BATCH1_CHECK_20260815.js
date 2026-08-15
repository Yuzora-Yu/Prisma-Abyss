const fs = require('fs');
const vm = require('vm');
const path = require('path');
const ROOT = path.resolve(__dirname, '../../..');
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
let passed = 0;
let total = 0;
function check(name, condition, detail='') {
    total += 1;
    if (condition) {
        passed += 1;
        console.log(`PASS ${name}${detail ? ` — ${detail}` : ''}`);
    } else {
        console.log(`FAIL ${name}${detail ? ` — ${detail}` : ''}`);
    }
}

const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(read('map.js'), ctx, { filename: 'map.js' });
ctx.App = {
    data: { progress: { storyStep: 0, subStep: 0, flags: {} }, items: {} },
    evaluateGameConditions(condition = {}) {
        const flags = this.data.progress.flags || {};
        const req = Array.isArray(condition.requiredFlags) ? condition.requiredFlags : (condition.requiredFlag ? [condition.requiredFlag] : []);
        const miss = Array.isArray(condition.missingFlags) ? condition.missingFlags : (condition.missingFlag ? [condition.missingFlag] : []);
        return req.every(key => !!flags[key]) && miss.every(key => !flags[key]);
    }
};
vm.runInContext(read('maps_logic.js'), ctx, { filename: 'maps_logic.js' });
vm.runInContext(read('story.js'), ctx, { filename: 'story.js' });

const maps = ctx.FIXED_MAPS;
const MR = ctx.MapRegistry;
const story = ctx.STORY_MANAGER_DATA;

const expectedActors = [
    ['START_VILLAGE', 'lumina_baker_01', 'NPC-LUMINA-NEW-01', 5, 4, 9, 'G'],
    ['START_VILLAGE', 'lumina_goat_boy_01', 'NPC-LUMINA-NEW-02', 6, 12, 7, 'G'],
    ['FIRE_VILLAGE', 'ignisia_communal_kitchen_01', 'NPC-IGNISIA-NEW-01', 5, 17, 16, 'G'],
    ['FIRE_VILLAGE', 'ignisia_bath_elder_01', 'NPC-IGNISIA-NEW-02', 6, 9, 10, 'G']
];

check('START_VILLAGE nextActorPlacementId', maps.START_VILLAGE.nextActorPlacementId === 7);
check('FIRE_VILLAGE nextActorPlacementId', maps.FIRE_VILLAGE.nextActorPlacementId === 7);

for (const [area, actorId, profileId, placementId, x, y, tile] of expectedActors) {
    const actor = maps[area].mapActors.find(entry => entry.actorId === actorId);
    check(`${actorId} exists with stable profile/placement IDs`, !!actor && actor.profileId === profileId && actor.placementId === placementId);
    check(`${actorId} coordinate remains on intended walkable base tile`, !!actor && maps[area].tiles[y]?.[x] === tile, `${x},${y}`);
    const collision = maps[area].mapActors.filter(entry => entry.x === x && entry.y === y);
    check(`${actorId} does not share its placement cell with another actor`, collision.length === 1);
    const actionCollision = (maps[area].mapActions || []).filter(entry => Number(entry.x) === x && Number(entry.y) === y);
    check(`${actorId} does not cover an existing mapAction cell`, actionCollision.length === 0);
}

function activeState(area, actorId, step, flags = {}, sub = 0) {
    ctx.App.data.progress.storyStep = step;
    ctx.App.data.progress.subStep = sub;
    ctx.App.data.progress.flags = { ...flags };
    const actor = maps[area].mapActors.find(entry => entry.actorId === actorId);
    const action = MR.findMapAction(maps[area], actor.x, actor.y);
    return action?.actorStateId || null;
}
const stateTests = [
    ['lumina baker before cave', activeState('START_VILLAGE','lumina_baker_01',1), 'before_cave'],
    ['lumina baker after cave', activeState('START_VILLAGE','lumina_baker_01',2), 'after_cave'],
    ['lumina baker later revisit', activeState('START_VILLAGE','lumina_baker_01',3), 'later_revisit'],
    ['lumina goat boy before cave', activeState('START_VILLAGE','lumina_goat_boy_01',1), 'before_cave'],
    ['lumina goat boy after cave', activeState('START_VILLAGE','lumina_goat_boy_01',2), 'after_cave'],
    ['ignisia kitchen crisis', activeState('FIRE_VILLAGE','ignisia_communal_kitchen_01',2,{}), 'fire_unstable'],
    ['ignisia kitchen restored', activeState('FIRE_VILLAGE','ignisia_communal_kitchen_01',3,{fireVillageCleared:true}), 'fire_restored'],
    ['ignisia kitchen late', activeState('FIRE_VILLAGE','ignisia_communal_kitchen_01',4,{fireVillageCleared:true}), 'later_revisit'],
    ['ignisia bath crisis', activeState('FIRE_VILLAGE','ignisia_bath_elder_01',2,{}), 'during_crisis'],
    ['ignisia bath after', activeState('FIRE_VILLAGE','ignisia_bath_elder_01',3,{fireVillageCleared:true}), 'after_clear']
];
for (const [name, actual, expected] of stateTests) check(`${name} resolves correct state`, actual === expected, `${actual} / ${expected}`);

const expectedScripts = [
    'NPC_LUMINA_BAKER_BEFORE_CAVE','NPC_LUMINA_BAKER_AFTER_CAVE','NPC_LUMINA_BAKER_LATER_REVISIT',
    'NPC_LUMINA_GOAT_BOY_BEFORE_CAVE','NPC_LUMINA_GOAT_BOY_AFTER_CAVE','NPC_LUMINA_GOAT_BOY_SARA_REACTION',
    'NPC_IGNISIA_COMMUNAL_KITCHEN_FIRE_UNSTABLE','NPC_IGNISIA_COMMUNAL_KITCHEN_FIRE_RESTORED','NPC_IGNISIA_COMMUNAL_KITCHEN_LATER_REVISIT',
    'NPC_IGNISIA_BATH_ELDER_DURING_CRISIS','NPC_IGNISIA_BATH_ELDER_AFTER_CLEAR'
];
check('all Phase18 Batch1 conversation scripts exist', expectedScripts.every(key => Array.isArray(story.scripts[key]) && story.scripts[key].length > 0));

const goatEvent = story.events.npc_lumina_goat_boy_after_cave;
const saraBranch = goatEvent?.actions?.find(action => action.type === 'IF_ALLY');
check('goat-boy revisit reuses common optional-party branch logic', !!saraBranch && saraBranch.charId === 110 && saraBranch.mode === 'party');
check('Sara branch remains optional rather than blocking dialogue', Array.isArray(saraBranch?.else) && saraBranch.else.length === 0);

const mapLogicText = read('maps_logic.js');
check('map actor state runtime supports step/sub min/max gates', ['stepMin','stepMax','subMin','subMax'].every(key => mapLogicText.includes(`entry.${key}`)));

const sourceDoc = read('docs/scenario/56_PHASE18_LUMINA_IGNISIA_NPC_STAGE_BATCH1_20260815.md');
check('Phase18 Batch1 implementation source exists and preserves legacy dialogue boundary', sourceDoc.includes('既存会話本文の置換・削除・意味変更は行わない'));

const newsText = read('news.js');
const todayRecords = [...newsText.matchAll(/date:\s*"2026\/08\/15"/g)].length;
check('NEWS_DATA still has exactly one 2026/08/15 record', todayRecords === 1, String(todayRecords));
check('NEWS_DATA mentions first staged-town-dialogue batch', newsText.includes('リュミナ村と炎の里の住民会話に進行段階ごとの差分を追加しました'));

console.log(`RESULT ${passed}/${total} PASS`);
process.exitCode = passed === total ? 0 : 1;
