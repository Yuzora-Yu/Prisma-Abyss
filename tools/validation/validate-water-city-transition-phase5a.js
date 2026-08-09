const fs = require('fs');
const path = require('path');
const { loadMapStoryRuntime } = require('./validation-helpers');
const root = path.resolve(__dirname, '..', '..');
const { context } = loadMapStoryRuntime(root);
const story = context.StoryManager;
const events = story.events || {};
const scripts = story.scripts || {};
const mainSource = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const dbSource = fs.readFileSync(path.join(root, 'database.js'), 'utf8');
function assert(v, msg) { if (!v) throw new Error(msg); }
function action(eventId, type, pred = () => true) { return (events[eventId]?.actions || []).find(a => a.type === type && pred(a)); }

assert(story.storyObjectives['4-4'] && story.storyObjectives['4-5'], 'Post-Seabed Temple breathing objectives 4-4/4-5 are missing.');
assert(mainSource.includes('waterCityState: 0'), 'Runtime WorldState lacks waterCityState default.');
assert(dbSource.includes('waterCityState: 0'), 'New-game template lacks waterCityState default.');
assert(/storyStateSchemaVersion:\s*[4-9]/.test(mainSource), 'Story state schema must remain at least v4 after Water City state.');
assert(/storyStateSchemaVersion:\s*[4-9]/.test(dbSource), 'Database story state schema must remain at least v4 after Water City state.');
assert(action('water_city_intro','WORLD_STATE', a => a.key === 'waterCityState' && Number(a.value) === 1), 'Water City intro does not mark occupation state.');

const clear = events.water_temple_clear?.actions || [];
assert(clear.some(a => a.type === 'FLAG' && a.key === 'waterCityCleared'), 'Seabed Temple clear no longer marks Water City liberated.');
assert(clear.some(a => a.type === 'WORLD_STATE' && a.key === 'waterCityState' && Number(a.value) === 2), 'Seabed Temple clear does not set liberated WorldState.');
assert(clear.some(a => a.type === 'SUB' && Number(a.value) === 4), 'Seabed Temple clear must remain in storyStep 4 at subStep 4.');
assert(!clear.some(a => a.type === 'STEP' && Number(a.value) === 5), 'Seabed Temple clear still skips directly to Thunder Fort chapter.');
assert(!clear.some(a => a.type === 'UNLOCK' && a.value === 'boat'), 'Seabed Temple clear must not grant the ship before Rexnote estate.');
assert(!clear.some(a => a.type === 'FLAG' && a.key === 'hasShip'), 'Seabed Temple clear must not set hasShip before Rexnote estate.');
assert(!clear.some(a => a.type === 'ITEM' && Number(a.id) === 108), 'Seabed Temple clear still grants legacy boat item.');

const post = events.water_city_after_clear?.actions || [];
assert(post.some(a => a.type === 'FLAG' && a.key === 'waterCityPostClearTalked'), 'Post-clear breathing conversation is not one-shot.');
assert(post.some(a => a.type === 'SUB' && Number(a.value) === 5), 'Post-clear breathing conversation does not advance to research/exploration stage.');
const postText = (scripts.WATER_CITY_AFTER_CLEAR || []).map(x => x.text || '').join('\n');
assert(postText.includes('肩の力を抜き') && postText.includes('歩いてみる'), 'Water City breathing-space dialogue is missing its intended pause/exploration purpose.');
const templeText = (scripts.SEABED_TEMPLE_CLEAR || []).map(x => x.text || '').join('\n');
assert(!templeText.includes('船を託そう') && !templeText.includes('魔法の小舟'), 'Legacy immediate ship grant text remains after Seabed Temple clear.');

const sophia = context.FIXED_MAPS.WATER_CITY.mapActors.find(a => a.actorId === 'sophia_water_city');
const state = sophia?.states?.find(s => s.stateId === 'water_city_post_clear');
assert(state?.when?.requiredFlag === 'waterCityCleared' && state?.when?.missingFlag === 'waterCityPostClearTalked' && Number(state?.placement?.x) === 20 && Number(state?.placement?.y) === 13, 'Sophia post-clear state conditions/placement are wrong.');
assert(state?.action?.eventId === 'water_city_after_clear', 'Sophia post-clear state does not launch breathing conversation.');

console.log('PASS validate-water-city-transition-phase5a');
