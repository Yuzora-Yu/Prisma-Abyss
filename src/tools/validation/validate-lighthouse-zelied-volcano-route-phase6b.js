const fs=require('fs');
const path=require('path');
const { loadMapStoryRuntime }=require('./validation-helpers');
const root=path.resolve(__dirname,'..','..');
const { context }=loadMapStoryRuntime(root);
const story=context.StoryManager; const events=story.events||{}; const maps=context.FIXED_DUNGEON_MAPS||{};
function assert(v,m){if(!v)throw new Error(m)}
function action(id,type,p=()=>true){return (events[id]?.actions||[]).find(a=>a.type===type&&p(a));}
assert(story.storyObjectives['6-1']&&story.storyObjectives['6-2'],'phase6 continuation objectives missing');
const tower=maps.BIG_TOWER; assert(tower?.floors?.[0],'Big Tower floor1 missing');
const zelied=tower.floors[0].mapActors?.find(a=>a.actorId==='zelied_big_tower'); assert(zelied,'Zelied lighthouse actor missing');
assert(zelied.states?.some(s=>s.stateId==='zelied_lighthouse_story_intro'&&s.priority>=30),'mandatory Zelied intro state missing');
const up=tower.floors[0].floorLinks?.find(l=>l.toFloor===2); assert(up?.requiredFlag==='zeliedLighthouseIntroSeen','upper floor is not gated behind Zelied intro');
assert(action('lighthouse_zelied_story_intro','FLAG',a=>a.key==='zeliedLighthouseIntroSeen'),'intro event does not set seen flag');
const clear=events.big_tower_clear?.actions||[];
assert(clear.some(a=>a.type==='ALLY'&&Number(a.value)===103),'Zelied does not join in main lighthouse clear');
assert(clear.some(a=>a.type==='FLAG'&&a.key==='zeliedJoinedAtLighthouse'),'Zelied story join flag missing');
assert(clear.some(a=>a.type==='WORLD_STATE'&&a.key==='thunderFortState'&&Number(a.value)===3),'lighthouse clear does not enter volcano phase');
assert(clear.some(a=>a.type==='SUB'&&Number(a.value)===1),'lighthouse clear does not set 6-1');
assert(!clear.some(a=>a.type==='STEP'&&Number(a.value)===7),'lighthouse clear still jumps directly to Light Palace');
const lilith=(story.scripts.LIGHTHOUSE_LILITH_ENCOUNTER||[]).map(x=>x.text||'').join('\n');
const lighthouseClear=(story.scripts.LIGHTHOUSE_CLEAR||[]).map(x=>x.text||'').join('\n');
assert(lilith.includes('我が主'),'Lilith misdirection lacks 我が主');
assert(!lilith.includes('ヴェルド')&&!lilith.includes('ジャスパー'),'Lilith encounter reveals kingdom names too early');
assert(lighthouseClear.includes('海底火山'),'lighthouse clear does not reveal Undersea Volcano');
assert(lighthouseClear.includes('完全には消えない')||lighthouseClear.includes('まだ残っています'),'lighthouse clear does not preserve second barrier');
const fort=maps.THUNDER_FORT?.floors?.[0]; assert(fort,'Thunder Fort floor1 missing');
for(const id of ['frieda_baron_thunder_depths','frieda_baron_thunder_depths_2','marie_undersea_volcano_departure']){
  const actor=fort.mapActors?.find(a=>a.actorId===id); assert(actor,`${id} missing`);
  assert(actor.states?.some(s=>s.stateId==='undersea_volcano_departure_story'&&s.when?.requiredWorldState?.thunderFortState?.value===3),`${id} lacks volcano departure story state`);
}
assert(action('thunder_guild_undersea_volcano_briefing','FLAG',a=>a.key==='underseaVolcanoBriefingSeen'),'volcano briefing seen flag missing');
assert(action('thunder_guild_undersea_volcano_briefing','FLAG',a=>a.key==='underseaVolcanoRouteKnown'),'volcano route flag missing');
assert(action('thunder_guild_undersea_volcano_briefing','SUB',a=>Number(a.value)===2),'briefing does not advance to 6-2');
const briefing=(story.scripts.THUNDER_GUILD_UNDERSEA_VOLCANO_BRIEFING||[]).map(x=>x.text||'').join('\n');
assert(briefing.includes('グラド')&&briefing.includes('冒険者'),'briefing does not establish Grad as adventurer senior');
console.log('PASS validate-lighthouse-zelied-volcano-route-phase6b');
