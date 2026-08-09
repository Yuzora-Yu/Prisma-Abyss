const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { loadMapStoryRuntime } = require('./validation-helpers');
const root = path.resolve(__dirname, '..', '..');
const assert = (value, message) => { if (!value) throw new Error(message); };

const { context } = loadMapStoryRuntime(root);
const maps = context.FIXED_DUNGEON_MAPS || {};
const story = context.StoryManager || {};
const events = story.events || {};
const scripts = story.scripts || {};
const thunder = maps.THUNDER_FORT?.floors?.[0];
assert(thunder, 'Thunder Fort floor 1 is missing.');

const main = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const news = fs.readFileSync(path.join(root, 'news.js'), 'utf8');
assert(main.includes('5:魔王軍急襲警戒 6:防衛中 7:防衛成功/ルーナ覚醒後'), 'Thunder Fort state 5-7 semantics are not documented.');
assert(main.includes('flags.thunderFortDemonAssaultCleared === true || flags.lunaAwakenedAtThunderFort === true'), 'Thunder Fort defense save reconciliation is missing.');
assert(main.includes('flags.lunaMemoryLossRevealed === true'), 'Luna memory-stage save reconciliation is missing.');

for (const id of ['7-3','7-4','7-5','7-6']) assert(story.storyObjectives?.[id], `Story objective ${id} is missing.`);
assert(story.storyObjectives['7-3'].includes('雷の要塞'), '7-3 must return to Thunder Fort.');
assert(story.storyObjectives['7-4'].includes('魔王軍'), '7-4 must describe the defense battle.');
assert(story.storyObjectives['7-5'].includes('ソフィア'), '7-5 must route to Sophia / Crystal Tree research.');
assert(story.storyObjectives['7-6'].includes('ミネルバ') && story.storyObjectives['7-6'].includes('結晶樹'), '7-6 must expose the Minerva / Crystal Tree endpoint.');

const arrival = events.thunder_fort_demon_assault_arrival?.actions || [];
assert(arrival.some(a => a.type === 'WORLD_STATE' && a.key === 'thunderFortState' && Number(a.value) === 6), 'Assault arrival must set thunderFortState=6.');
assert(arrival.some(a => a.type === 'SUB' && Number(a.value) === 4), 'Assault arrival must move to 7-4.');

const wave1 = events.thunder_fort_demon_assault_wave1?.actions || [];
const wave1Boss = wave1.find(a => a.type === 'BOSS');
assert(JSON.stringify(wave1Boss?.value) === JSON.stringify([652,652,651]), 'Defense wave 1 roster changed unexpectedly.');
assert(wave1Boss?.winEventId === 'thunder_fort_demon_assault_wave1_clear', 'Defense wave 1 clear event missing.');
const wave1Clear = events.thunder_fort_demon_assault_wave1_clear?.actions || [];
assert(wave1Clear.some(a => a.type === 'FLAG' && a.key === 'thunderFortDefenseWave1Cleared'), 'Defense wave 1 completion flag missing.');

const wave2 = events.thunder_fort_demon_assault_wave2?.actions || [];
const wave2Boss = wave2.find(a => a.type === 'BOSS');
assert(JSON.stringify(wave2Boss?.value) === JSON.stringify([652,651,652]), 'Defense wave 2 roster changed unexpectedly.');
assert(wave2Boss?.winEventId === 'thunder_fort_luna_awakening', 'Defense wave 2 must flow to Luna awakening.');

const awake = events.thunder_fort_luna_awakening?.actions || [];
const awakeText = (scripts.THUNDER_FORT_LUNA_AWAKENING_SKELETON || []).map(line => line.text || '').join('\n');
assert(awakeText.includes('冒険者様、助けてくださってありがとうございます。'), 'Canonical Luna awakening line is missing.');
assert(awakeText.includes('ルーナの瞳に、幼馴染を見る色はない') && !awakeText.includes('五年前より前の記憶を失っている'), 'Luna memory loss should be shown by her reaction instead of certified by narrator exposition.');
assert(awakeText.includes('結晶樹') && awakeText.includes('レオン'), 'Crystal Tree motivation must include both Luna and Leon.');
const awakeDump = JSON.stringify(awake);
for (const flag of ['thunderFortDemonAssaultCleared','lunaAwakenedAtThunderFort','lunaMemoryLossRevealed','crystalTreeMainRouteOpened']) {
  assert(awakeDump.includes(flag), `Awakening event is missing ${flag}.`);
}
assert(awakeDump.includes('"key":"thunderFortState","value":7'), 'Awakening must set thunderFortState=7.');
assert(awakeDump.includes('"key":"lunaMemoryStage","value":1'), 'Awakening must set lunaMemoryStage=1.');
assert(awakeDump.includes('"type":"SUB","value":5'), 'Awakening must move to 7-5.');
assert(!awakeDump.includes('"type":"STEP","value":8'), 'Thunder defense must not skip Crystal Tree by advancing to Step 8.');

const assaultText = [
  ...(scripts.THUNDER_FORT_DEMON_ASSAULT_ARRIVAL || []),
  ...(scripts.THUNDER_FORT_DEMON_ASSAULT_WAVE1 || []),
  ...(scripts.THUNDER_FORT_DEMON_ASSAULT_WAVE2 || [])
].map(line => line.text || '').join('\n');
assert(assaultText.includes('救護') && assaultText.includes('聖女を渡せ'), 'Assault dialogue does not communicate the apparent abduction objective.');
assert(!assaultText.includes('ゼノン') && !assaultText.includes('保護するため'), 'Assault dialogue reveals the Demon Army true motive too early.');
assert(assaultText.includes('商店の窓には手をつけた跡すらない') || assaultText.includes('脇を逃げる市民には目もくれず'), 'Assault behavior does not show civilians are not the primary target.');

assert(thunder.entryEventId === 'thunder_fort_demon_assault_arrival', 'Thunder Fort arrival event is not connected to floor 1.');
assert(thunder.entryEventFlag === 'thunderFortDemonAssaultArrivalSeen', 'Thunder Fort arrival one-shot flag missing.');
assert(thunder.entryEventConditions?.requiredFlag === 'thunderFortDemonAssaultAlert', 'Thunder Fort arrival is not gated by the palace emergency alert.');
const baron = (thunder.mapActors || []).find(a => a.actorId === 'frieda_baron_thunder_depths_2');
const marie = (thunder.mapActors || []).find(a => a.actorId === 'marie_undersea_volcano_departure');
const luna = (thunder.mapActors || []).find(a => a.actorId === 'luna_thunder_infirmary_post_awake');
assert(baron?.states?.some(s => s.stateId === 'demon_assault_wave1' && s.action?.eventId === 'thunder_fort_demon_assault_wave1'), 'Baron does not start defense wave 1.');
assert(marie?.states?.some(s => s.stateId === 'demon_assault_wave2' && s.action?.eventId === 'thunder_fort_demon_assault_wave2'), 'Marie does not start defense wave 2.');
assert(luna?.states?.some(s => s.when?.requiredFlag === 'lunaAwakenedAtThunderFort'), 'Post-awakening Luna actor is missing.');
assert(Number(thunder.nextActorPlacementId) === 15, 'Thunder Fort nextActorPlacementId must reserve Luna placement 14.');

const monsterContext = {}; monsterContext.globalThis = monsterContext; vm.createContext(monsterContext);
vm.runInContext(fs.readFileSync(path.join(root, 'monsters.js'), 'utf8'), monsterContext);
const soldier = monsterContext.MonsterData?.getMonsterById?.(652);
const butler = monsterContext.MonsterData?.getMonsterById?.(651);
assert(soldier?.name === '魔人兵士' && Number(soldier.rank) === 66, 'Defense soldier ID652 is not the intended existing demon troop.');
assert(butler?.name === 'ダークバトラー' && Number(butler.rank) === 66, 'Defense elite ID651 is not the intended existing demon troop.');


const crystalBrief = events.water_city_crystal_tree_briefing?.actions || [];
const crystalDump = JSON.stringify(crystalBrief);
assert(crystalDump.includes('crystalTreeRouteBriefed') && crystalDump.includes('minervaCrystalTreeLeadKnown'), 'Sophia Crystal Tree briefing flags are missing.');
assert(crystalDump.includes('\"type\":\"SUB\",\"value\":7'), 'Sophia briefing must hand off from Phase7A to the implemented Crystal Tree route.');
const waterCity = context.FIXED_MAPS?.WATER_CITY;
const sophia = (waterCity?.mapActors || []).find(a => a.actorId === 'sophia_water_city');
assert(sophia?.states?.some(state => state.stateId === 'crystal_tree_main_route' && state.action?.eventId === 'water_city_crystal_tree_briefing'), 'Sophia does not expose the mandatory Crystal Tree briefing.');
const briefingText=(scripts.WATER_CITY_CRYSTAL_TREE_BRIEFING || []).map(line => line.text || '').join('\n');
assert(briefingText.includes('ミネルバ') && briefingText.includes('結晶樹') && briefingText.includes('水門'), 'Sophia briefing must identify Minerva and the usable route without dumping later theory.');

assert((news.match(/date: "2026\/08\/10"/g) || []).length === 1, 'NEWS_DATA must keep one 2026/08/10 record.');
assert(news.includes('雷の要塞の魔王軍防衛戦') && news.includes('ルーナ覚醒'), '2026/08/10 news does not mention Phase 7A player-facing changes.');
assert(fs.existsSync(path.join(root, 'docs/scenario/33_THUNDER_FORT_DEFENSE_PHASE7A_20260810.md')), 'Phase 7A scenario skeleton MD is missing.');

console.log('PASS validate-thunder-fort-defense-phase7a');
