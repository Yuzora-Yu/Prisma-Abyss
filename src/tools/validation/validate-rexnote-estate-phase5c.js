const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { loadMapStoryRuntime } = require('./validation-helpers');
const root = path.resolve(__dirname, '..', '..');
const { context } = loadMapStoryRuntime(root);
const story = context.StoryManager;
const events = story.events || {};
const scripts = story.scripts || {};
const master = context.window?.MAP_MASTER || {};
const maps = context.FIXED_MAPS || {};
const mainSource = fs.readFileSync(path.join(root,'main.js'),'utf8');
const questsSource = fs.readFileSync(path.join(root,'quests.js'),'utf8');
function assert(v,msg){ if(!v) throw new Error(msg); }
function action(id,type,p=()=>true){ return (events[id]?.actions||[]).find(a=>a.type===type&&p(a)); }

assert(story.storyObjectives['4-9'], 'Rexnote estate objective 4-9 is missing.');
assert(master.REXNOTE_ESTATE?.id === 'MAP000071', 'Rexnote estate must use MAP000071.');
const estate = maps.REXNOTE_ESTATE;
assert(estate?.width === 17 && estate?.height === 11 && estate?.randomEncounterDisabled === true, 'Rexnote estate minimal map shape is missing.');
assert(estate.entryEventId === 'rexnote_estate_arrival' && estate.entryEventFlag === 'rexnoteEstateArrivalSeen', 'Rexnote estate arrival is not one-shot.');
assert((estate.mapActions||[]).some(a=>a.type==='fixedMap'&&a.target==='WATER_CITY'), 'Rexnote estate has no return route to Water City.');

const sophia = maps.WATER_CITY.mapActors.find(a=>a.actorId==='sophia_water_city');
const route = sophia?.states?.find(s=>s.stateId==='water_city_rexnote_route');
assert(route?.when?.requiredFlag==='arisaHaineMainStoryCleared' && route?.when?.missingFlag==='rexnoteRouteKnown', 'Rexnote route does not begin after mandatory forest rescue.');
assert(route?.action?.eventId==='water_city_rexnote_briefing', 'Sophia does not launch Rexnote briefing.');
assert(action('water_city_rexnote_briefing','FLAG',a=>a.key==='rexnoteRouteKnown'), 'Rexnote briefing does not persist route reveal.');
assert(action('water_city_rexnote_briefing','START_FIXED_MAP',a=>a.value==='REXNOTE_ESTATE'), 'Rexnote briefing does not transfer to estate.');

assert(action('rexnote_estate_arrival','ALLY',a=>Number(a.value)===201), 'Alan does not join at Rexnote estate.');
assert(action('rexnote_estate_arrival','ITEM',a=>Number(a.id)===108), 'Magic boat item is not obtained at Rexnote estate.');
assert(action('rexnote_estate_arrival','UNLOCK',a=>a.value==='boat'), 'Boat feature is not unlocked at Rexnote estate.');
assert(action('rexnote_estate_arrival','FLAG',a=>a.key==='hasShip'), 'hasShip is not set at Rexnote estate.');
assert(action('rexnote_estate_arrival','STEP',a=>Number(a.value)===5), 'Rexnote estate does not advance to Thunder Fort chapter after ship acquisition.');
const arrivalText=(scripts.REXNOTE_ESTATE_ARRIVAL||[]).map(x=>x.text||'').join('\n');
assert(arrivalText.includes('アレル＝レクスノート侯爵') && arrivalText.includes('アラン＝レクスノート'), 'Rexnote estate skeleton does not introduce the confirmed family names.');

assert(questsSource.includes('"disabled": true') && questsSource.includes('"legacyConvertedToStory": true'), 'Legacy Sophia/Alan joint recruitment quest is not disabled.');
assert(mainSource.includes("if (!quest || quest.disabled === true) return false;"), 'Quest runtime does not honor disabled legacy quests.');
const alanLegacy=maps.WATER_CITY.mapActors.find(a=>a.actorId==='sophia_alan_seabed_depths_2');
assert(alanLegacy?.states?.[0]?.when?.requiredFlag==='legacySophiaAlanQuestEnabled', 'Legacy Alan Water City actor can still appear normally.');
const sophiaLegacy=sophia?.states?.find(s=>s.stateId==='sophia_alan_seabed_depths');
assert(sophiaLegacy?.when?.requiredFlag==='legacySophiaAlanQuestEnabled', 'Legacy Sophia joint-recruitment state can still appear normally.');

console.log('PASS validate-rexnote-estate-phase5c');
