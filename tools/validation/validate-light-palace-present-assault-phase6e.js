const fs = require('fs');
const path = require('path');
const { loadMapRuntime } = require('./validation-helpers');
const root = path.resolve(__dirname, '..', '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const assert = (cond, msg) => { if (!cond) { console.error(`[phase6e] FAIL: ${msg}`); process.exitCode = 1; } };

const main = read('main.js');
const database = read('database.js');
const storyLogic = read('story_logic.js');
const story = read('story.js');
const map = read('map.js');
const news = read('news.js');

assert(main.includes('storyStateSchemaVersion: 7'), 'main story schema version 7 missing');
assert(database.includes('storyStateSchemaVersion: 7'), 'database story schema version 7 missing');
assert(main.includes('lightPalaceState: 0') && database.includes('lightPalaceState: 0'), 'lightPalaceState defaults missing');
assert(main.includes('reconcileLightPalaceWorldState'), 'Light Palace save reconciliation missing');
assert(main.includes('flags.lightPalaceCleared === true || storyStep >= 8'), 'old cleared-save compatibility missing');

assert(storyLogic.includes("action.type === 'DEPART_ALLY'"), 'generic story ally departure action missing');
assert(storyLogic.includes('App.departStoryAlly(charId'), 'DEPART_ALLY does not use shared departure helper');
assert(storyLogic.includes('equipmentReturnedFlag'), 'DEPART_ALLY equipment-return ledger flag missing');

assert(story.includes('"light_palace_prison_leon"'), 'Leon prison event missing');
assert(story.includes('"lightPalaceKingLocated"') && story.includes('"lightPalaceLeilaLocated"') && story.includes('"lightPalaceLeonLocated"'), 'three prisoner location flags missing');
assert(story.includes('"lightPalacePrisonRescueSecured"'), 'prison rescue secured flag missing');
assert(story.includes('"key": "lightPalacePrisonRescueSecured",\n                                "then": []'), 'prison rescue completion must be idempotent');
assert(story.includes('"light_palace_alan_betrayal"'), 'Alan betrayal event missing');
assert(story.includes('"DEPART_ALLY", "value": 201'), 'Alan departure action missing');
assert(story.includes('"alanEquipmentReturnedAtBetrayal"') && story.includes('"alanBetrayedLightPalace"'), 'Alan betrayal ledgers missing');
assert(story.includes('"alanOutcome", "value": "betrayed"'), 'Alan world-state betrayal missing');
assert(story.includes('"key": "alanBetrayedLightPalace",\n                                "then": []'), 'Alan betrayal event must be idempotent');
assert(story.includes('これで準備は整った。'), 'canonical Alan betrayal line missing');
assert(story.includes('"light_palace_liberation_after_betrayal"'), 'palace liberation event missing');
assert(story.includes('"thunderFortDemonAssaultAlert"'), 'Thunder Fortress emergency alert missing');
assert(story.includes('"thunderFortState", "value": 5'), 'Thunder Fortress assault world-state transition missing');
assert(story.includes('"7-1": "地下牢の主要な生存者を確認した。光の祭壇へ進もう"'), '7-1 objective missing');
assert(story.includes('"7-2": "アランが離脱した。地下牢へ戻り、捕らわれていた人々を保護しよう"'), '7-2 objective missing');
assert(story.includes('"7-3": "雷の要塞へ急行し、救護区画のルーナを守ろう"'), '7-3 objective missing');
const liberationStart = story.indexOf('"light_palace_liberation_after_betrayal"');
const liberationEnd = story.indexOf('"light_palace_overpower_clear"', liberationStart);
const liberationEvent = story.slice(liberationStart, liberationEnd);
assert(liberationEvent.includes('"SUB", "value": 3'), 'palace liberation must advance to 7-3');
assert(!liberationEvent.includes('"STEP", "value": 8'), 'new palace liberation must not skip Thunder Fortress defense by advancing to Step 8');

const finalEventStart = story.indexOf('"light_palace_final_encounter"');
const finalEventEnd = story.indexOf('"light_palace_prison_king"', finalEventStart);
const finalEvent = story.slice(finalEventStart, finalEventEnd);
assert(finalEvent.includes('"LIGHT_PALACE_PRESENT_FINAL_SKELETON"'), 'present-time final skeleton not used');
assert(finalEvent.includes('"winEventId": "light_palace_alan_betrayal"'), 'present final does not flow to Alan betrayal');
assert(!finalEvent.includes('"bossStatMultiplier": 3'), 'legacy x3 forced route still active in present final');
assert(!finalEvent.includes('"lossEventId": "light_palace_blessing_retry"'), 'legacy blessing retry still active in present final');

const palaceStart = map.indexOf('    LIGHT_PALACE: {', map.indexOf('const FIXED_DUNGEON_MAPS'));
const palaceEnd = map.indexOf('\n    GALVANIA_CAVE:', palaceStart);
const palace = map.slice(palaceStart, palaceEnd);
assert(palace.includes('requiredFlag: "lightPalacePrisonRescueSecured"'), 'final boss is not gated by prisoner confirmation');
assert(palace.includes('eventId: "light_palace_final_locked_prison"'), 'locked altar guidance missing');
assert(palace.includes('"actorId": "light_palace_prison_leon"'), 'Leon prison actor missing');
assert(palace.includes('entryEventId: "light_palace_liberation_after_betrayal"'), 'post-betrayal prison liberation entry event missing');
assert(palace.includes('storyEventId: "light_palace_alan_betrayal"'), 'fixed boss post-event not updated to Alan betrayal');



// Runtime map connectivity: existence alone is insufficient for a mandatory route.
const { context: mapContext } = loadMapRuntime(root);
const palaceRuntime = mapContext.FIXED_DUNGEON_MAPS?.LIGHT_PALACE;
assert(palaceRuntime && Array.isArray(palaceRuntime.floors), 'Light Palace runtime map missing');
const f1 = palaceRuntime?.floors?.[0];
const f4 = palaceRuntime?.floors?.[3];
const prison = palaceRuntime?.floors?.[4];
const key = (x,y) => `${x},${y}`;
const tileWalkable = (floor,x,y) => {
    if (!floor || x < 0 || y < 0 || x >= Number(floor.width) || y >= Number(floor.height)) return false;
    return String(floor.tiles?.[y]?.[x] || 'W').toUpperCase() !== 'W';
};
const blockingAt = (floor,x,y,flags={}) => (floor?.blockingObjects || []).some(obj => {
    if (Number(obj?.x) !== x || Number(obj?.y) !== y) return false;
    if (obj.requiredFlag && flags[obj.requiredFlag] !== true) return false;
    if (obj.missingFlag && flags[obj.missingFlag] === true) return false;
    if (Array.isArray(obj.requiredFlags) && obj.requiredFlags.some(flag => flags[flag] !== true)) return false;
    if (Array.isArray(obj.missingFlags) && obj.missingFlags.some(flag => flags[flag] === true)) return false;
    return true;
});
const reachable = (floor,start,target,{flags={},allowTargetBlocked=false}={}) => {
    const q=[{x:Number(start.x),y:Number(start.y)}];
    const seen=new Set([key(q[0].x,q[0].y)]);
    const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
    while(q.length){
        const p=q.shift();
        if(p.x===Number(target.x)&&p.y===Number(target.y)) return true;
        for(const [dx,dy] of dirs){
            const x=p.x+dx,y=p.y+dy,k=key(x,y);
            if(seen.has(k)||!tileWalkable(floor,x,y)) continue;
            const isTarget=x===Number(target.x)&&y===Number(target.y);
            if(blockingAt(floor,x,y,flags) && !(allowTargetBlocked&&isTarget)) continue;
            seen.add(k); q.push({x,y});
        }
    }
    return false;
};
const adjacentReachable = (floor,start,target,options={}) => [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy]) =>
    reachable(floor,start,{x:Number(target.x)+dx,y:Number(target.y)+dy},options)
);
const basementLink = (f1?.floorLinks || []).find(link => Number(link.toFloor) === 5);
assert(basementLink && reachable(f1,f1.entryPoint,basementLink), 'Light Palace F1 basement route is not physically reachable');
const prisonGuard = (prison?.bosses || []).find(boss => boss.startEventId === 'light_palace_prison_guard_encounter');
assert(prisonGuard && adjacentReachable(prison,prison.entryPoint,prisonGuard), 'prison guard cannot be reached from basement entry');
for (const actorId of ['captive_king','light_palace_prison_leila','light_palace_prison_leon']) {
    const actor=(prison?.mapActors || []).find(entry => entry.actorId === actorId);
    assert(actor && adjacentReachable(prison,prison.entryPoint,actor,{flags:{lightPalacePrisonOpened:true}}), `${actorId} cannot be reached after prison opens`);
}
const altarBoss=(f4?.bosses || []).find(boss => boss.startEventId === 'light_palace_final_encounter');
assert(altarBoss && adjacentReachable(f4,f4.entryPoint,altarBoss,{flags:{lightPalacePrisonRescueSecured:true}}), 'final altar cannot be reached from F4 entry');

assert((news.match(/date: "2026\/08\/10"/g) || []).length === 1, 'NEWS_DATA must keep exactly one 2026/08/10 record');
assert(news.includes('光の宮殿の現在時間攻略'), '2026/08/10 news missing Light Palace present assault');

if (!process.exitCode) console.log('[phase6e] PASS: present Light Palace rescue gate, Alan betrayal/departure, liberation, save state, and news validated.');
