const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { loadMapStoryRuntime } = require('./validation-helpers');
const root = path.resolve(__dirname, '..', '..');
const { context } = loadMapStoryRuntime(root);
const story = context.StoryManager;
const events = story.events || {};
const scripts = story.scripts || {};
const questsContext = { window:{}, globalThis:null, console }; questsContext.globalThis=questsContext; questsContext.window=questsContext; vm.createContext(questsContext);
vm.runInContext(fs.readFileSync(path.join(root,'quests.js'),'utf8'), questsContext);
const quests = questsContext.QUEST_DATA || questsContext.window?.QUEST_DATA || context.QUEST_DATA || {};
function assert(v,msg){ if(!v) throw new Error(msg); }
function action(id,type,p=()=>true){ return (events[id]?.actions||[]).find(a=>a.type===type&&p(a)); }
for(const key of ['4-6','4-7','4-8']) assert(story.storyObjectives[key], `Missing mandatory forest objective ${key}.`);

const q = quests.arisa_haine_forest_depths;
assert(q?.mainStory === true, 'Arisa/Haine rescue quest is not marked mainStory.');
assert(q?.unlockFlags?.includes('arisaHaineMainStoryRequired') && !q?.unlockFlags?.includes('waterCityCleared'), 'Arisa/Haine quest can still unlock as an optional quest immediately after Water City clear.');

const messenger = context.FIXED_MAPS.WATER_CITY.mapActors.find(a=>a.actorId==='wind_messenger_water_city');
assert(messenger?.placementId===14, 'Water City messenger placementId must remain stable at 14.');
const waterActorIds = (context.FIXED_MAPS.WATER_CITY.mapActors || []).map(actor => Number(actor.placementId) || 0);
assert(Number(context.FIXED_MAPS.WATER_CITY.nextActorPlacementId) > Math.max(...waterActorIds), 'Water City nextActorPlacementId must stay above every issued stable actor ID.');
assert(messenger?.states?.[0]?.when?.requiredFlag==='waterCityPostClearTalked' && messenger?.states?.[0]?.when?.missingFlag==='arisaHaineMainStoryRequired', 'Wind messenger does not appear only after the breathing-space conversation.');
assert(messenger?.states?.[0]?.action?.eventId==='water_city_wind_messenger', 'Wind messenger does not start mandatory rescue route.');
assert(action('water_city_wind_messenger','FLAG',a=>a.key==='arisaHaineMainStoryRequired'), 'Messenger does not mark the rescue as main-story required.');
assert(action('water_city_wind_messenger','SUB',a=>Number(a.value)===6), 'Messenger does not advance to 4-6.');

const windActor = context.FIXED_MAPS.WIND_VILLAGE.mapActors.find(a=>a.actorId==='arisa_haine_forest_depths');
const windState = windActor?.states?.[0];
assert(windState?.action?.type==='storyEvent' && windState?.action?.eventId==='main_arisa_haine_start', 'Wind Village still offers Arisa/Haine as an optional quest.');
assert(windState?.when?.requiredFlag==='arisaHaineMainStoryRequired' && windState?.when?.missingFlag==='arisaHaineMainStoryStarted', 'Wind Village mandatory rescue state gates are wrong.');
assert(action('main_arisa_haine_start','QUEST_ACCEPT',a=>a.value==='arisa_haine_forest_depths'), 'Main story does not auto-accept Arisa/Haine rescue.');
assert(action('main_arisa_haine_start','SUB',a=>Number(a.value)===7), 'Arisa/Haine rescue start does not advance to 4-7.');

assert(action('quest_arisa_haine_clear','QUEST_COMPLETE',a=>a.value==='arisa_haine_forest_depths'), 'Forest rescue does not immediately complete the mandatory quest and grant both allies.');
assert(action('quest_arisa_haine_clear','FLAG',a=>a.key==='arisaHaineMainStoryCleared'), 'Forest rescue does not persist main-story completion.');
assert(action('quest_arisa_haine_clear','SUB',a=>Number(a.value)===8), 'Forest rescue does not advance to 4-8.');
assert((scripts.WATER_CITY_WIND_MESSENGER||[]).length>=3, 'Mandatory rescue lacks messenger dialogue.');

console.log('PASS validate-arisa-haine-main-route-phase5b');
