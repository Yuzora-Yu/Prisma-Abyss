const fs = require('fs');
const vm = require('vm');
const path = require('path');
const ROOT = path.resolve(__dirname, '../../..');
let pass = 0, fail = 0;
function check(name, cond, detail='') {
  if (cond) { pass++; console.log(`PASS ${name}${detail ? ` :: ${detail}` : ''}`); }
  else { fail++; console.error(`FAIL ${name}${detail ? ` :: ${detail}` : ''}`); }
}
function text(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
const mapSrc = text('map.js');
const ctx = { console };
vm.createContext(ctx);
vm.runInContext(mapSrc + '\n;globalThis.__STORY_DATA=STORY_DATA;globalThis.__FIXED_MAPS=FIXED_MAPS;globalThis.__FIXED_DUNGEON_MAPS=FIXED_DUNGEON_MAPS;', ctx, {filename:'map.js'});
const STORY = ctx.__STORY_DATA;
const MAPS = ctx.__FIXED_MAPS;
const DUN = ctx.__FIXED_DUNGEON_MAPS;

const underArea = STORY.areas.UNDERSEA_VOLCANO;
check('undersea-world-entry-always-visible', !underArea.worldConditions);
check('undersea-world-entry-no-required-flag', !underArea.entryRequiredFlag);
check('undersea-world-position', underArea.centerX === 113 && underArea.centerY === 17);
check('undersea-cave-icon', underArea.fieldTile?.img === 'overlay_field_cave');

const u = DUN.UNDERSEA_VOLCANO;
check('undersea-five-floors', Array.isArray(u.floors) && u.floors.length === 5);
const f1=u.floors[0], f2=u.floors[1], f3=u.floors[2], f4=u.floors[3], f5=u.floors[4];
check('undersea-b1-label', f1.label === '地下1階');
check('undersea-b2-label', f2.label === '地下2階');
check('undersea-b3-label', f3.label === '地下3階');
check('undersea-b4-label', f4.label === '地下4階・沈圧研究棟');
check('undersea-b5-label', f5.label === '地下5階・深海調律炉');
check('undersea-b3-cache-version', Number(f3.proceduralTemplateVersion) >= 3);
check('undersea-b3-gate-flag', f3.proceduralNextLink?.requiredFlag === 'underseaVolcanoRouteOpened');
check('undersea-b3-gate-locked-text', /古い錠/.test(f3.proceduralNextLink?.lockedLog || ''));
check('undersea-b3-open-label', /破壊された隔壁/.test(f3.proceduralNextLink?.label || ''));
check('undersea-story-entry-gated-not-map-entry', u.entryEventConditions?.requiredFlag === 'underseaVolcanoRouteOpened');
check('undersea-b5-boss-tile', f5.tiles?.[4]?.[9] === 'B', `tile=${f5.tiles?.[4]?.[9]}`);
const grad = f5.bosses?.find(b => Number(b.x)===9 && Number(b.y)===4);
check('undersea-b5-grad-present', !!grad && Number(grad.monsterId) === 301063);
for (const [idx,f] of u.floors.entries()) {
  if (Array.isArray(f.tiles)) {
    check(`undersea-floor-${idx+1}-row-widths`, f.tiles.every(r => r.length === f.width), `width=${f.width}`);
  }
}

const reesArea=STORY.areas.REES_MOUNTAIN_HUT;
check('rees-world-entry-unlocked', !reesArea.entryRequiredFlag);
const hut=MAPS.REES_MOUNTAIN_HUT;
check('rees-hut-exit-unlocked', !hut.mapActions?.find(a=>a.target==='REES_MOUNTAIN_HUT_EXTERIOR')?.requiredFlag);
const beds=(hut.blockingObjects||[]).filter(o=>o.imageKey==='guild_bed');
check('rees-two-beds', beds.length===2);
check('rees-bed-positions', beds.some(o=>o.x===7&&o.y===2)&&beds.some(o=>o.x===8&&o.y===2));

const water=MAPS.WATER_CITY;
const broker=water.mapActors?.find(a=>a.actorId==='water_city_post_riot_broker');
const brokerAction=broker?.states?.[0]?.action;
check('water-keeper-renamed', broker?.name==='水路番');
check('water-keeper-fixed-quest', brokerAction?.type==='quest' && brokerAction?.questId==='water_city_hunt_waterway');
check('water-old-board-action-removed', !(water.mapActions||[]).some(a=>a.type==='questBoard'));
const fountain=(water.floorDecorations||[]).find(d=>d.authoredPlacementId==='water-city-restored-fountain');
const fountainAction=(water.mapActions||[]).find(a=>a.type==='waterCityFountain');
check('water-fountain-position-decoration', fountain?.x===19&&fountain?.y===13);
check('water-fountain-position-action', fountainAction?.x===19&&fountainAction?.y===13);
check('water-fountain-base-tile-walkable', String(water.tiles?.[13]?.[19] || '').toUpperCase() === 'T', `tile=${water.tiles?.[13]?.[19]}`);
check('water-fountain-sparkle', fountain?.shimmer===true && fountain?.imageKey==='overlay_shrine_healing_spring');
const sophia=water.mapActors?.find(a=>a.actorId==='sophia_water_city');
for (const stateId of ['crystal_tree_main_route','water_city_post_clear','water_city_rexnote_route','sophia_alan_seabed_depths']) {
  const st=sophia?.states?.find(x=>x.stateId===stateId);
  check(`sophia-${stateId}-moved-off-fountain`, st?.placement?.x===18 && st?.placement?.y===13);
}

const storySrc=text('story.js');
check('rees-initial-talk-heals', /"present_talk_rees"[\s\S]{0,400}"type": "HEAL", "silent": true/.test(storySrc));
check('rees-repeat-talk-heals', /"present_talk_rees_after"[\s\S]{0,300}"type": "HEAL", "silent": true/.test(storySrc));
check('undersea-research-name-story', storySrc.includes('沈圧研究棟'));
check('undersea-boss-area-name-story', storySrc.includes('巨大な調律炉へ出た'));

const dungeonSrc=text('dungeon.js');
check('undersea-can-enter-fixed-always', /case 'UNDERSEA_VOLCANO':[\s\S]{0,240}return ok\(\);/.test(dungeonSrc));
check('procedural-next-link-contract-merged', dungeonSrc.includes('template.proceduralNextLink'));
check('fixed-trial-side-rank-plus-10-14', dungeonSrc.includes('const fixedSideRankBonus = 10 + Math.floor(Math.random() * 5)'));
check('fixed-trial-center-rank-plus-15-19', dungeonSrc.includes('const fixedCenterRankBonus = 15 + Math.floor(Math.random() * 5)'));
check('fixed-trial-extra-stat-multiplier', dungeonSrc.includes('statMultiplier:Math.max(1, Number(master.statMultiplier || 1.35))'));
check('fixed-boss-floor-blocks-trial-angel', dungeonSrc.includes('const fixedBossFloor = fixed && Array.isArray(Field.currentMapData?.bosses)'));
check('fixed-trial-spawn-record-multiplier', dungeonSrc.includes('statMultiplier: fixed ? Math.max(1, Number(angelMaster.statMultiplier || 1.35))')); 

check('generic-battle-area-name-removed-runtime', !mapSrc.includes('最奥・戦闘エリア') && !storySrc.includes('戦闘区画'));
check('generic-research-area-name-removed-runtime', !mapSrc.includes('label: "研究区画"'));
const deepKeys=['BLACK_ROPE_PYRAMID','MAGIC_WIND_MAUSOLEUM','ICE_PENANCE_ROAD','SCORCHING_OLD_CASTLE','RIDPALM_DREAM_CORRIDOR','JAGOREA_ROOT','CHRONO_ABYSS'];
for (const key of deepKeys) {
  const floors=DUN[key]?.floors||[];
  check(`simple-layer-labels-${key}`, floors.every((f,i)=>String(f.label||'')===`${i+1}層`), floors.map(f=>f.label).join(','));
}

console.log(`\nRESULT ${pass}/${pass+fail} PASS; ${fail} FAIL`);
process.exitCode = fail ? 1 : 0;
