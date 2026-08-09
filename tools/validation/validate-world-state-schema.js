const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

function createContext() {
    const context = {
        console, Date, Math, JSON, Set, Map, WeakSet, WeakMap,
        Number, String, Array, Object, Promise, Uint8Array,
        setTimeout: () => 0,
        clearTimeout: () => {},
        performance: { now: () => 0 },
        document: {}
    };
    context.globalThis = context;
    context.window = context;
    context.window.addEventListener = () => {};
    context.window.requestAnimationFrame = () => 0;
    context.window.JOB_SKILLS = {};
    context.window.SKILLS_DATA = [];
    context.window.ITEMS_DATA = [];
    context.window.CHARACTERS_DATA = [];
    context.window.MONSTERS_DATA = [];
    context.window.EQUIP_MASTER = [];
    context.CONST = { EXP_BASE: 100, RARITY_EXP_MULT: {} };
    context.DB = { CHARACTERS: [], ITEMS: [], MONSTERS: [], SKILLS: [], EQUIPS: [], OPT_RULES: [] };
    return context;
}

const mainContext = createContext();
const mainCode = fs.readFileSync(path.join(root, 'main.js'), 'utf8') + '\nglobalThis.__APP_FOR_VALIDATION__ = App;';
vm.runInNewContext(mainCode, mainContext, { filename: 'main.js' });
const App = mainContext.__APP_FOR_VALIDATION__;
assert(App && typeof App.ensureWorldState === 'function', 'WorldState migration helper is not available.');

const legacy = {
    progress: {
        flags: { legacyFlag: true },
        worldState: { lunaMemoryStage: 3, futureCompatibilityField: 'keep' }
    },
    characters: [],
    party: []
};
App.ensureWorldState(legacy);
assert(Number(legacy.system?.storyStateSchemaVersion || 0) >= 2, 'Legacy save did not receive a compatible storyStateSchemaVersion.');
assert(legacy.progress.worldState.fireVillageRecovery === 0, 'Legacy save did not receive WorldState defaults.');
assert(legacy.progress.worldState.lunaMemoryStage === 3, 'Existing WorldState value was overwritten during migration.');
assert(legacy.progress.worldState.futureCompatibilityField === 'keep', 'Unknown future WorldState fields were not preserved.');
assert(legacy.progress.flags.legacyFlag === true, 'Existing progress.flags were damaged by WorldState migration.');

const emptyLegacy = {};
App.ensureWorldState(emptyLegacy);
assert(emptyLegacy.progress?.worldState?.alanOutcome === 'active', 'Empty legacy save did not receive the canonical Alan outcome default.');

let saveCount = 0;
App.data = emptyLegacy;
App.save = () => { saveCount += 1; return true; };
assert(App.setWorldStateValue('churchPoliticalState', 2) === true, 'setWorldStateValue failed.');
assert(App.getWorldStateValue('churchPoliticalState') === 2, 'WorldState getter/setter round trip failed.');
assert(saveCount === 1, 'WorldState setter did not save exactly once.');
App.setWorldStateValue('churchPoliticalState', 3, { save: false });
assert(saveCount === 1 && App.getWorldStateValue('churchPoliticalState') === 3, 'WorldState save:false was not respected.');

const dbContext = createContext();
const databaseCode = fs.readFileSync(path.join(root, 'database.js'), 'utf8') + '\nglobalThis.__INITIAL_FOR_VALIDATION__ = INITIAL_DATA_TEMPLATE;';
vm.runInNewContext(databaseCode, dbContext, { filename: 'database.js' });
const initial = dbContext.__INITIAL_FOR_VALIDATION__;
assert(Number(initial?.system?.storyStateSchemaVersion || 0) >= 2, 'New-game template does not declare a compatible storyStateSchemaVersion.');
assert(initial?.progress?.worldState?.lunaMemoryStage === 0, 'New-game template is missing the WorldState defaults.');
assert(initial?.progress?.worldState?.alanOutcome === 'active', 'New-game template Alan state differs from runtime defaults.');

console.log('PASS: WorldState defaults, legacy-save migration, value preservation, setters, and new-game template are consistent.');
