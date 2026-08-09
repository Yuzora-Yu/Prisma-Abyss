const fs = require('fs');
const path = require('path');
const { loadMapStoryRuntime } = require('./validation-helpers');
const root = path.resolve(__dirname, '..', '..');
const { context } = loadMapStoryRuntime(root);
const story = context.StoryManager;
const events = story.events || {};
const scripts = story.scripts || {};
const master = context.window?.MAP_MASTER || {};
const maps = context.FIXED_DUNGEON_MAPS || context.window?.FIXED_DUNGEON_MAPS || {};
const dungeonSource = fs.readFileSync(path.join(root,'dungeon.js'),'utf8');
const mainSource = fs.readFileSync(path.join(root,'main.js'),'utf8');
const databaseSource = fs.readFileSync(path.join(root,'database.js'),'utf8');
function assert(v,msg){ if(!v) throw new Error(msg); }
function action(id,type,p=()=>true){ return (events[id]?.actions||[]).find(a=>a.type===type&&p(a)); }

function isWalkable(floor,x,y){
  const c=String(floor.tiles?.[y]?.[x]||'W').toUpperCase();
  return ['T','G','S','D','U'].includes(c);
}
function reachable(floor,start,target){
  const q=[start], seen=new Set([`${start.x},${start.y}`]);
  const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
  while(q.length){
    const p=q.shift();
    if(p.x===target.x&&p.y===target.y) return true;
    for(const [dx,dy] of dirs){
      const n={x:p.x+dx,y:p.y+dy}, k=`${n.x},${n.y}`;
      if(seen.has(k)||n.x<0||n.y<0||n.x>=floor.width||n.y>=floor.height||!isWalkable(floor,n.x,n.y)) continue;
      seen.add(k); q.push(n);
    }
  }
  return false;
}

assert(master.UNDERSEA_VOLCANO?.id === 'MAP000072', 'Undersea Volcano must use MAP000072.');
const volcano = maps.UNDERSEA_VOLCANO;
assert(volcano && Array.isArray(volcano.floors) && volcano.floors.length === 5, 'Undersea Volcano must have exactly five floors.');
assert(volcano.floors[0].label.includes('第1層') && volcano.floors[1].label.includes('第2層') && volcano.floors[2].label.includes('第3層'), 'The first three floors must be dungeon floors.');
assert(volcano.floors[3].label === '研究区画', 'Floor 4 must be the research area.');
assert(volcano.floors[4].label === '最奥・戦闘エリア', 'Floor 5 must be the final battle area.');
assert(volcano.floors[3].randomEncounterDisabled === true && volcano.floors[4].randomEncounterDisabled === true, 'Research/battle floors must disable random encounters.');
volcano.floors.forEach((floor,index)=>{
  assert(Array.isArray(floor.tiles) && floor.tiles.length === floor.height, `Floor ${index+1} height mismatch.`);
  floor.tiles.forEach((row,y)=>assert(String(row).length === floor.width, `Floor ${index+1} row ${y} width mismatch.`));
});
for(let i=0;i<4;i++){
  assert((volcano.floors[i].floorLinks||[]).some(l=>Number(l.toFloor)===i+2), `Floor ${i+1} has no forward link.`);
  assert((volcano.floors[i+1].floorLinks||[]).some(l=>Number(l.toFloor)===i+1), `Floor ${i+2} has no return link.`);
}
volcano.floors.forEach((floor,index)=>{
  const links=floor.floorLinks||[];
  links.forEach(link=>{
    assert(isWalkable(floor,Number(link.x),Number(link.y)), `Floor ${index+1} link is not on a walkable tile.`);
    assert(reachable(floor,floor.entryPoint||volcano.entryPoint,{x:Number(link.x),y:Number(link.y)}), `Floor ${index+1} link is unreachable from entry.`);
  });
});
assert(volcano.floors[0].floorLinks.some(l=>l.to==='EXIT'), 'Floor 1 must have an exit route.');

assert(story.storyObjectives['6-1'] && story.storyObjectives['6-2'] && story.storyObjectives['6-3'] && story.storyObjectives['6-4'], 'Step 6 sub-objectives for lighthouse/volcano route are incomplete.');
assert(action('big_tower_clear','ALLY',a=>Number(a.value)===103), 'Zelied must join in the Big Tower main story.');
assert(!action('big_tower_clear','FLAG',a=>a.key==='underseaVolcanoRouteOpened'), 'Big Tower clear must return to Thunder Fort before revealing the Undersea Volcano route.');
assert(action('thunder_guild_undersea_volcano_briefing','FLAG',a=>a.key==='underseaVolcanoRouteOpened'), 'Thunder Fort guild briefing must reveal the Undersea Volcano route.');
assert(!action('big_tower_clear','STEP',a=>Number(a.value)===7), 'Big Tower clear must not skip directly to Light Palace.');
assert(action('undersea_volcano_departure','START_FIXED_DUNGEON',a=>a.value==='UNDERSEA_VOLCANO'), 'Undersea Volcano departure does not start the fixed dungeon.');
assert(action('undersea_volcano_departure','SUB',a=>Number(a.value)===3), 'Undersea Volcano departure must move to 6-3.');
assert(action('undersea_volcano_research_entry','SUB',a=>Number(a.value)===4), 'Research area entry must move to 6-4.');
assert(action('undersea_volcano_battle_area_entry','SUB',a=>Number(a.value)===4), 'Battle area entry must move to 6-4.');

const tower = maps.BIG_TOWER;
const travel = tower?.floors?.[0]?.mapActions?.find(a=>a.eventId==='undersea_volcano_departure');
assert(travel && travel.requiredFlag==='underseaVolcanoRouteOpened', 'Big Tower floor 1 has no gated Undersea Volcano travel action.');
assert(travel.missingFlag==='underseaVolcanoCleared', 'Undersea Volcano travel action must disappear after clear.');

assert(dungeonSource.includes("case 'UNDERSEA_VOLCANO':"), 'Dungeon entry gate for Undersea Volcano is missing.');
assert(dungeonSource.includes("'locked_light_palace_volcano'") && dungeonSource.includes('flags.underseaVolcanoCleared'), 'Light Palace must use the layered lighthouse/volcano gate.');
assert(mainSource.includes('underseaVolcanoState: 0') && databaseSource.includes('underseaVolcanoState: 0'), 'WorldState defaults are not synchronized.');
const mainSchema = Number((mainSource.match(/storyStateSchemaVersion:\s*(\d+)/) || [])[1] || 0);
const databaseSchema = Number((databaseSource.match(/storyStateSchemaVersion:\s*(\d+)/) || [])[1] || 0);
assert(mainSchema >= 6 && databaseSchema >= 6, 'StoryState schema version must remain at least 6 for Undersea Volcano saves.');
assert(mainSource.includes('reconcileUnderseaVolcanoWorldState') && mainSource.includes('underseaVolcanoLegacyBypass'), 'Undersea Volcano old-save reconciliation/bypass is missing.');

const routeText=[...(scripts.LIGHTHOUSE_CLEAR||[]), ...(scripts.THUNDER_GUILD_UNDERSEA_VOLCANO_BRIEFING||[])].map(x=>x.text||'').join('\n');
assert(routeText.includes('海底火山') && routeText.includes('ゼリード'), 'Lighthouse-to-Thunder-Fort route reveal skeleton is missing.');
console.log('PASS validate-undersea-volcano-phase6b');
