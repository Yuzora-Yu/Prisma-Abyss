const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const mainSource = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const mapLogicSource = fs.readFileSync(path.join(root, 'maps_logic.js'), 'utf8');
const databaseSource = fs.readFileSync(path.join(root, 'database.js'), 'utf8');
const noop = () => {};
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const document = {
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: noop,
    createElement: () => ({
        style: {},
        classList: { add: noop, remove: noop, toggle: noop },
        appendChild: noop,
        addEventListener: noop,
        getContext: () => ({})
    }),
    body: { appendChild: noop, classList: { add: noop, remove: noop } },
    documentElement: { style: { setProperty: noop } }
};
const window = {
    JOB_SKILLS: {},
    CHARACTERS_DATA: [],
    addEventListener: noop,
    location: { href: '' },
    innerWidth: 800,
    innerHeight: 600,
    devicePixelRatio: 1,
    requestAnimationFrame: () => 0
};
const context = {
    console,
    window,
    document,
    localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    navigator: {},
    performance: { now: () => 0 },
    requestAnimationFrame: () => 0,
    cancelAnimationFrame: noop,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Image: function(){},
    Audio: function(){},
    Blob: function(){},
    URL: { createObjectURL: () => '', revokeObjectURL: noop },
    fetch: async () => ({ ok: false }),
    crypto: { getRandomValues: value => value },
    FIXED_MAPS: {},
    FIXED_DUNGEON_MAPS: {},
    FIXED_TILE_OVERLAYS: {},
    FIXED_OVERLAY_BASE_TILES: {},
    SEA_ENCOUNTER_MONSTERS: [],
    FIELD_ENCOUNTER_ZONES: []
};
context.globalThis = context;
window.window = window;
window.document = document;
vm.createContext(context);
vm.runInContext(`${mainSource}\nglobalThis.__App = App; globalThis.__Field = Field;`, context, { filename: 'main.js' });
vm.runInContext(`${mapLogicSource}\nglobalThis.__MapRegistry = MapRegistry;`, context, { filename: 'maps_logic.js' });
const App = context.__App;
const Field = context.__Field;
const MapRegistry = context.__MapRegistry;

App.save = noop;
App.data = {
    system: {},
    progress: {
        storyStep: 4,
        subStep: 6,
        flags: { waterCityCleared: true },
        worldState: {
            ...App.getDefaultWorldState(),
            fireVillageRecovery: 2,
            lunaMemoryStage: 1
        },
        storyCharacters: {},
        quests: {
            sample_done: { state: 'completed' },
            sample_active: { state: 'accepted' }
        }
    },
    items: { 100: 2 },
    characters: [
        { uid: 'p1', charId: 301, name: 'アルス', level: 1 },
        { uid: 'u101', charId: 101, name: 'ジョセフ', level: 1 }
    ],
    party: ['p1', 'u101', null, null]
};
App.ensureWorldState(App.data);
App.ensureStoryCharacterStates(App.data);

assert(Number(App.data.system.storyStateSchemaVersion) >= 2, 'Story state schema did not migrate to a compatible version.');
assert(App.hasStoryAlly(101) === true, 'Existing roster member was not migrated as recruited.');
assert(App.isStoryAllyAvailable(101) === true, 'Existing roster member was not migrated as available.');
assert(App.isStoryAllyInParty(101) === true, 'Party membership condition is not detected.');

assert(App.evaluateGameConditions({ requiredFlag: 'waterCityCleared' }) === true, 'Legacy requiredFlag compatibility failed.');
assert(App.evaluateGameConditions({ missingFlag: 'waterCityCleared' }) === false, 'Legacy missingFlag compatibility failed.');
assert(App.evaluateGameConditions({ requiredItems: [{ id: 100, count: 2 }] }) === true, 'Item requirement compatibility failed.');
assert(App.evaluateGameConditions({ requiredStoryStep: 4, requiredSubStep: 6 }) === true, 'Story step requirement compatibility failed.');
assert(App.evaluateGameConditions({ requiredStoryStep: 4, requiredSubStep: 7 }) === false, 'Story substep lower bound failed.');
assert(App.evaluateGameConditions({ requiredWorldState: { fireVillageRecovery: 2 } }) === true, 'WorldState equality shorthand failed.');
assert(App.evaluateGameConditions({ requiredWorldState: [{ key: 'fireVillageRecovery', op: '>=', value: 2 }] }) === true, 'WorldState comparison failed.');
assert(App.evaluateGameConditions({ requiredWorldState: [{ key: 'fireVillageRecovery', op: '>', value: 2 }] }) === false, 'WorldState comparison false branch failed.');
assert(App.evaluateGameConditions({ requiredAllies: [101], requiredAvailableAllies: [101], requiredPartyAllies: [101] }) === true,
    'Recruited/available/party condition integration failed.');
assert(App.evaluateGameConditions({ requiredQuests: ['sample_done'] }) === true, 'Required completed quest condition failed.');
assert(App.evaluateGameConditions({ requiredQuestStates: { sample_active: 'accepted' } }) === true, 'Quest state condition failed.');

App.setStoryAllyAvailability(101, false, { save: false });
assert(App.hasStoryAlly(101) === true, 'Making an ally unavailable incorrectly erased recruitment history.');
assert(App.isStoryAllyAvailable(101) === false, 'Availability state did not change.');
assert(App.isStoryAllyInParty(101) === false, 'Unavailable ally was not removed from battle party.');
assert(App.evaluateGameConditions({ requiredAllies: [101], missingAvailableAllies: [101], missingPartyAllies: [101] }) === true,
    'Unavailable ally conditions failed.');

App.setStoryAllyPermanentlyUnavailable(101, true, { save: false });
assert(App.setStoryAllyAvailability(101, true, { save: false }) === false, 'Permanent unavailability was bypassed without explicit override.');
assert(App.isStoryAllyAvailable(101) === false, 'Permanently unavailable ally became available.');
App.setStoryAllyPermanentlyUnavailable(101, false, { save: false, restoreAvailability: true });
assert(App.isStoryAllyAvailable(101) === true, 'Explicit permanent-state recovery did not restore availability.');

window.CHARACTERS_DATA = [{ id: 999, name: 'テスト仲間', job: '戦士', rarity: 'R', hp: 10, mp: 5, atk: 3, def: 3, mag: 1, spd: 2, mdef: 1, sp: 0 }];
const added = App.addStoryAlly(999, { available: false, joinParty: false, silent: true, save: false });
assert(added && App.hasStoryAlly(999), 'addStoryAlly did not mark recruitment state.');
assert(App.isStoryAllyAvailable(999) === false, 'addStoryAlly available:false was ignored.');
assert(App.isStoryAllyInParty(999) === false, 'addStoryAlly joinParty:false was ignored.');
App.setStoryAllyPermanentlyUnavailable(999, true, { save: false });
assert(App.addStoryAlly(999, { silent: true, save: false }) === null, 'addStoryAlly revived a permanently unavailable ally.');
assert(App.addStoryAlly(999, { allowPermanentReturn: true, silent: true, save: false }) !== null, 'Explicit permanent return did not work.');

assert(MapRegistry.isProgressEntryActive({ requiredWorldState: [{ key: 'lunaMemoryStage', op: '>=', value: 1 }] }) === true,
    'MapRegistry is not using the shared condition engine.');
assert(Field.isMapActionAvailable({ requiredAvailableAllies: [101] }) === true,
    'Field map action is not using shared ally availability conditions.');

assert(/storyStateSchemaVersion:\s*(\d+)/.test(databaseSource) && Number(databaseSource.match(/storyStateSchemaVersion:\s*(\d+)/)[1]) >= 2, 'database.js initial template schema version is below v2.');
assert(databaseSource.includes('storyCharacters: {}'), 'database.js initial template is missing storyCharacters.');
assert(mainSource.includes('App.evaluateGameConditions(action)'), 'Field map action routing is not shared.');
assert(mapLogicSource.includes("typeof App.evaluateGameConditions === 'function'"), 'MapRegistry shared condition routing is missing.');

console.log('PASS: shared story conditions and recruited/available/party/temporary/permanent ally states behave as expected.');
