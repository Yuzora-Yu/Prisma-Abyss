const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');
const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const checks = [];
const ok = (name, condition) => { assert.ok(condition, name); checks.push(name); };

const mapSource = read('map.js');
const storySource = read('story.js');
const mainSource = read('main.js');
const menuSource = read('menus_items.js');
const itemSource = read('items.js');
const jobSource = read('job_data.js');
const skillSource = read('skills.js');
const newsSource = read('news.js');
const swSource = read('sw.js');

// ---- World map / undersea volcano route ----
const mapCtx = { console, Math, Date, JSON, setTimeout, clearTimeout };
mapCtx.window = mapCtx; mapCtx.globalThis = mapCtx;
vm.createContext(mapCtx);
vm.runInContext(mapSource + '\n;globalThis.__WORLD=SURFACE_WORLD_MAP_DATA;globalThis.__STORY=STORY_DATA;globalThis.__FDM=FIXED_DUNGEON_MAPS;', mapCtx, {timeout:10000});
const world = mapCtx.__WORLD;
ok('world has rows', Array.isArray(world) && world.length > 0);
ok('world width expanded from 110 to 130', world.every(row => String(row).length === 130));
ok('undersea volcano coordinate is a one-tile grass island', world[17][113] === 'G' && world[17][112] === 'W' && world[17][114] === 'W' && world[16][113] === 'W' && world[18][113] === 'W');
const palace = mapCtx.__STORY.areas.LIGHT_PALACE;
const lighthouse = mapCtx.__STORY.areas.BIG_TOWER;
const volcanoArea = mapCtx.__STORY.areas.UNDERSEA_VOLCANO;
ok('light palace coordinate canonical', palace.centerX === 67 && palace.centerY === 48);
ok('big lighthouse coordinate canonical', lighthouse.centerX === 21 && lighthouse.centerY === 79);
ok('undersea volcano coordinate exact', volcanoArea.centerX === 113 && volcanoArea.centerY === 17);
ok('undersea volcano world marker uses cave icon over the grass base tile', volcanoArea.fieldTile?.img === 'overlay_field_cave');
ok('undersea volcano remains at the planned northeast coordinate', volcanoArea.centerX === 113 && volcanoArea.centerY === 17);
ok('undersea volcano world marker is always visible', !volcanoArea.worldConditions && !volcanoArea.entryRequiredFlag);
const registryCtx = { console, Math, Date, JSON, setTimeout, clearTimeout };
registryCtx.window = registryCtx; registryCtx.globalThis = registryCtx;
registryCtx.App = { data:{ location:{worldKey:'WORLD'}, progress:{flags:{}} }, evaluateGameConditions:(cond)=>!cond?.requiredFlag || !!registryCtx.App.data.progress.flags[cond.requiredFlag] };
vm.createContext(registryCtx);
vm.runInContext(mapSource, registryCtx, {timeout:10000});
vm.runInContext(read('maps_logic.js'), registryCtx, {timeout:10000});
ok('undersea volcano resolves before route-open flag', registryCtx.MapRegistry.getWorldAreaAt(113,17)?.[0] === 'UNDERSEA_VOLCANO');
registryCtx.App.data.progress.flags.underseaVolcanoRouteOpened = true;
ok('undersea volcano remains resolved after route-open flag', registryCtx.MapRegistry.getWorldAreaAt(113,17)?.[0] === 'UNDERSEA_VOLCANO');
const volcano = mapCtx.__FDM.UNDERSEA_VOLCANO;
ok('undersea volcano fixed dungeon uses world-entry event', volcano.entryEventId === 'undersea_volcano_world_entry');
ok('undersea volcano uses basement stair semantics', volcano.floorDirectionMode === 'basement');
ok('undersea volcano first floor exits to world entrance', volcano.floors?.[0]?.proceduralExitLabel === '海上へ戻る' && volcano.floors?.[0]?.proceduralExitPoint?.x === 113 && volcano.floors?.[0]?.proceduralExitPoint?.y === 17);
ok('undersea volcano procedural floors no longer force maze generation', volcano.floors.slice(0,3).every(floor => floor.procedural === true && floor.forceMaze !== true));
ok('undersea volcano B3 carries deep-route gate contract', volcano.floors?.[2]?.proceduralTemplateVersion >= 3 && volcano.floors?.[2]?.proceduralNextLink?.requiredFlag === 'underseaVolcanoRouteOpened');
ok('undersea volcano does not retain a fixed base entry coordinate', !Object.prototype.hasOwnProperty.call(volcano, 'entryPoint'));
ok('Sky Prism places undersea volcano immediately below big lighthouse', mainSource.includes("'BIG_TOWER',\n            'UNDERSEA_VOLCANO',\n            'LIGHT_PALACE'"));
ok('fixed dungeon entry prefers resolved floor entry point', read('dungeon.js').includes(': (areaDef.entryPoint || ((Number(baseDef?.entryFloor || 1) === startFloor && baseDef?.entryPoint) ? baseDef.entryPoint : null))'));
ok('procedural generation restores world location after temporary spawn generation', read('dungeon.js').includes('const previousLocationState = { x: App.data?.location?.x, y: App.data?.location?.y };') && read('dungeon.js').includes('App.data.location.x = previousLocationState.x;'));
ok('old lighthouse direct action removed', !mapSource.includes('船着き場から海底火山へ向かう'));
ok('world route remains fixed dungeon route', mainSource.includes("targetAreaKey && typeof FIXED_DUNGEON_MAPS !== 'undefined' && FIXED_DUNGEON_MAPS[targetAreaKey]"));

// ---- Story route hints ----
const storyCtx = { console, Math, Date, JSON };
storyCtx.window = storyCtx; storyCtx.globalThis = storyCtx;
vm.createContext(storyCtx);
vm.runInContext(storySource, storyCtx, {timeout:10000});
const sd = storyCtx.STORY_MANAGER_DATA;
ok('story data exported', !!sd);
ok('objective uses Kazaria as the practical landmark', sd.storyObjectives['6-2'].includes('カザリアよりさらに北東') && sd.storyObjectives['6-2'].includes('海にある海底火山'));
ok('new world entry event exists', !!sd.events.undersea_volcano_world_entry);
ok('thunder hint event exists', !!sd.events.undersea_volcano_route_hint_thunder);
ok('water-city hint event exists', !!sd.events.undersea_volcano_route_hint_water);
ok('world entry dialogue exists', Array.isArray(sd.scripts.UNDERSEA_VOLCANO_WORLD_ENTRY));
ok('thunder hint dialogue exists', Array.isArray(sd.scripts.UNDERSEA_VOLCANO_ROUTE_HINT_THUNDER));
ok('water hint dialogue exists', Array.isArray(sd.scripts.UNDERSEA_VOLCANO_ROUTE_HINT_WATER));
ok('thunder fort has route hint actor state', mapSource.includes('undersea_volcano_route_hint_thunder'));
ok('water city has route hint actor state', mapSource.includes('undersea_volcano_route_hint_water'));

// ---- Reincarnation fruit / job history return ----
const appCtx = { console, Math, Date, JSON, setTimeout, clearTimeout };
appCtx.window = appCtx; appCtx.globalThis = appCtx;
appCtx.window.addEventListener = () => {};
appCtx.window.requestAnimationFrame = fn => fn();
appCtx.document = { getElementById:()=>null, querySelector:()=>null, querySelectorAll:()=>[] };
appCtx.localStorage = { getItem:()=>null, setItem:()=>{}, removeItem:()=>{} };
vm.createContext(appCtx);
vm.runInContext(skillSource, appCtx, {timeout:10000});
vm.runInContext(jobSource, appCtx, {timeout:10000});
appCtx.DB = {
  SKILLS: appCtx.SKILLS_DATA || [],
  CHARACTERS: [{ id:999, name:'テスト', job:'戦士', hp:100, mp:30, atk:20, def:20, mag:10, mdef:10, spd:10 }],
  ITEMS: [], MONSTERS: [], EQUIPS: []
};
vm.runInContext(mainSource + '\n;globalThis.__App=App;', appCtx, {timeout:10000});
const App = appCtx.__App;
const warrior100 = Number(appCtx.JOB_SKILLS_DATA['戦士']['100']);
const priest1 = Number(appCtx.JOB_SKILLS_DATA['僧侶']['1']);
const priest100 = Number(appCtx.JOB_SKILLS_DATA['僧侶']['100']);
const char = {
  uid:'reinc-test', charId:999, name:'テスト', job:'戦士', level:100, exp:5000, reincarnationCount:0,
  hp:100, mp:30, atk:20, def:20, mag:10, mdef:10, spd:10, rarity:'N', equips:{},
  skills:[warrior100], traits:[], disabledTraits:[], tree:{}, config:{}
};
App.data = { characters:[char], party:['reinc-test'], progress:{storyCharacters:{}}, system:{}, items:{107:2} };
App.ensureCharacterJobCareer(char);
const firstTransfer = App.changeJobByBook(char, 2, {save:false});
ok('setup transfer to priest succeeds', firstTransfer.ok === true && char.jobId === 2 && char.level === 1);
char.level = 100;
char.exp = 123456;
if (!char.skills.includes(priest1)) char.skills.push(priest1);
const options = App.getReincarnationJobOptions(char);
ok('fruit options include current priest', options.some(x => x.jobId === 2 && x.current));
ok('fruit options include past warrior', options.some(x => x.jobId === 1 && !x.current));
ok('fruit options exclude unexperienced mage', !options.some(x => x.jobId === 3));
const beforeSkills = [...char.skills];
const previousReinc = char.reincarnationCount;
const result = App.reincarnateCharacter(char, 1, {save:false});
ok('fruit returns to previous job without book', result.ok === true && result.changedJob === true && char.jobId === 1 && char.job === '戦士');
ok('fruit reincarnates at same time', char.level === 1 && char.exp === 0 && char.reincarnationCount === previousReinc + 1);
ok('fruit preserves prior learned skills', beforeSkills.every(id => char.skills.includes(id)));
ok('return records history source', char.jobHistory.at(-1)?.source === 'reincarnation_fruit_return' && char.jobHistory.at(-1)?.jobId === 1);
ok('return sets transfer override to chosen historical job', char.jobTransferJobId === 1);
ok('fruit cannot jump to unexperienced job', App.reincarnateCharacter({...char, level:100, jobHistory:[...char.jobHistory], jobProgress:{...char.jobProgress}}, 3, {save:false}).reason === 'job_not_in_history');
ok('fruit UI intercepts item 107 before generic growth handling', menuSource.includes('if (Number(item.id) === 107)') && !menuSource.includes('case 107:'));
ok('fruit item description mentions past jobs', itemSource.includes('過去に経験した職業へ戻ることもできる'));

// ---- Holy Fist / full-MP synergy audit invariants (no behavior change) ----
const battleSource = read('battle.js');
const traitSource = read('job_traits.js');
const fullMpSkillIds = [245,246,247];
const skillsById = new Map((appCtx.SKILLS_DATA || []).map(s => [Number(s.id), s]));
ok('all current all-MP skills are magic', fullMpSkillIds.every(id => skillsById.get(id)?.type === '魔法'));
ok('holy-fist trait only applies extra HP cost to physical skills', traitSource.includes("String(skill?.type || '') !== '物理'"));
ok('full-MP skills have dedicated cost handling', fullMpSkillIds.every(id => battleSource.includes(String(id))) || battleSource.includes('MADANTE_SKILL_IDS'));

// ---- NEWS same-day single record ----
const newsCtx = {};
vm.createContext(newsCtx);
vm.runInContext(newsSource + '\n;globalThis.__NEWS=NEWS_DATA;', newsCtx);
const today = newsCtx.__NEWS.filter(row => row.date === '2026/08/16');
ok('NEWS has one 2026/08/16 record', today.length === 1);
ok('NEWS mentions reincarnation job-history return', today[0].body.includes('過去に経験した職業へ戻って転生'));
ok('NEWS mentions east-world / undersea route update', today[0].body.includes('海底火山への航路'));
ok('service-worker app-shell cache version bumped', swSource.includes('prisma-abyss-v69.20260816'));

console.log(`REINCARNATION_UNDERSEA_ROUTE_CHECK: ${checks.length}/${checks.length} PASS`);
checks.forEach((name,i)=>console.log(`${String(i+1).padStart(2,'0')}. PASS ${name}`));
