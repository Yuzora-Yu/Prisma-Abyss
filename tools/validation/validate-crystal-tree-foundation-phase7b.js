const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const assert = (cond, msg) => { if (!cond) { console.error(`[phase7b-foundation] FAIL: ${msg}`); process.exitCode = 1; } };

const main = read('main.js');
const database = read('database.js');
const storyLogic = read('story_logic.js');
const story = read('story.js');

const mainSchema = Number((main.match(/storyStateSchemaVersion:\s*(\d+)/) || [])[1] || 0);
const databaseSchema = Number((database.match(/storyStateSchemaVersion:\s*(\d+)/) || [])[1] || 0);
assert(mainSchema >= 8 && databaseSchema >= 8, 'StoryState schema must be >= 8 in both runtime and new-game template.');
assert(main.includes('crystalTreeState: 0') && database.includes('crystalTreeState: 0'), 'crystalTreeState default must exist in both sources.');
assert(main.includes('reconcileCrystalTreeWorldState'), 'crystalTreeState reconciliation is missing.');
assert(main.includes("flags.crystalTreeCleared === true") && main.includes("flags.crystalTreeRouteBriefed === true"), 'crystalTree reconciliation must recover route/clear state from flags.');
assert(main.includes('App.reconcileCrystalTreeWorldState(data);'), 'save migration must reconcile crystalTreeState.');

assert(storyLogic.includes("action.type === 'STORY_EXP'"), 'generic STORY_EXP action is missing.');
assert(storyLogic.includes('App.grantStoryExp?.(charId, amount, rewardKey'), 'STORY_EXP must use the once-only story reward path.');
assert(storyLogic.includes("result?.reason !== 'already_granted'"), 'duplicate STORY_EXP execution must be idempotent.');
assert(storyLogic.includes("action.type === 'SET_EXP_MULTIPLIER'"), 'generic SET_EXP_MULTIPLIER action is missing.');
assert(storyLogic.includes('App.setCharacterExpRequirementMultiplierPct?.(charId, pct'), 'EXP multiplier action must use the shared character multiplier setter.');

assert(story.includes('{ "type": "WORLD_STATE", "key": "crystalTreeState", "value": 1 }'), 'Sophia briefing must advance crystalTreeState to lead-known.');
if (!process.exitCode) console.log('[phase7b-foundation] PASS: Crystal Tree state/reward foundation remains synchronized.');
