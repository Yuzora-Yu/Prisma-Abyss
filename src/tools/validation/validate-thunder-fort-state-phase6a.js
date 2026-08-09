const fs=require('fs');
const path=require('path');
const { loadMapStoryRuntime }=require('./validation-helpers');
const root=path.resolve(__dirname,'..','..');
const { context }=loadMapStoryRuntime(root);
const story=context.StoryManager; const events=story.events||{}; const maps=context.FIXED_DUNGEON_MAPS||{};
const main=fs.readFileSync(path.join(root,'main.js'),'utf8'); const db=fs.readFileSync(path.join(root,'database.js'),'utf8');
function assert(v,m){if(!v)throw new Error(m)}
function hasAction(id,type,p=()=>true){return (events[id]?.actions||[]).some(a=>a.type===type&&p(a));}
assert(main.includes('thunderFortState: 0')&&db.includes('thunderFortState: 0'),'Thunder Fort WorldState default missing');
assert(/storyStateSchemaVersion:\s*[6-9]/.test(main)&&/storyStateSchemaVersion:\s*[6-9]/.test(db),'story schema must be at least 6');
assert(story.storyObjectives['5-1']&&story.storyObjectives['5-2'],'Thunder Fort crisis objectives missing');
assert(hasAction('thunder_fort_entry','WORLD_STATE',a=>a.key==='thunderFortState'&&Number(a.value)===1),'entry does not set crisis state');
for(const id of ['thunder_veld_forced_loss','thunder_veld_loss']) assert(hasAction(id,'WORLD_STATE',a=>a.key==='thunderFortState'&&Number(a.value)===2),`${id} does not secure fort state`);
const floor=maps.THUNDER_FORT?.floors?.[0]; assert(floor,'Thunder Fort floor1 missing');
const holy=floor.mapActors.find(a=>a.actorId==='thunder_fort_holy_knight_crisis');
const dark=floor.mapActors.find(a=>a.actorId==='thunder_fort_dark_knight_crisis');
assert(holy&&dark,'crisis faction actors missing');
assert(holy.states[0].when?.requiredWorldState?.thunderFortState?.value===1,'holy knight not crisis-state gated');
assert(dark.states[0].when?.requiredWorldState?.thunderFortState?.value===1,'dark knight not crisis-state gated');
const holyText=(story.scripts.THUNDER_FORT_HOLY_KNIGHT_CRISIS||[]).map(x=>x.text||'').join('\n');
const darkText=(story.scripts.THUNDER_FORT_DARK_KNIGHT_CRISIS||[]).map(x=>x.text||'').join('\n');
assert(holyText.includes('負傷者')&&holyText.includes('民間人'),'holy knight action does not show civilian protection');
assert(darkText.includes('居住区')&&darkText.includes('制御炉'),'dark knight action does not show command priority contrast');
console.log('PASS validate-thunder-fort-state-phase6a');
