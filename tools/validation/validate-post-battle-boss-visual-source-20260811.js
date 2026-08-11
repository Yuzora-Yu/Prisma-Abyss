const path = require('path');
const { loadMapStoryRuntime } = require('./validation-helpers');

const root = path.resolve(__dirname, '..', '..');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const { context } = loadMapStoryRuntime(root);
const StoryManager = context.StoryManager;
const maps = context.FIXED_MAPS || {};

const bossMapEntry = Object.entries(maps).find(([, map]) => Array.isArray(map?.bosses) && map.bosses.length > 0);
assert(bossMapEntry, 'No fixed map with an authored boss was found for visual provenance validation.');
const [bossMapKey, bossMap] = bossMapEntry;
const authoredBoss = bossMap.bosses[0];
const authoredBossMonsterId = Array.isArray(authoredBoss.monsterId) ? authoredBoss.monsterId[0] : authoredBoss.monsterId;

context.App = {
  data: { progress: {}, battle: null },
  save: () => true
};
context.Field = {
  x: 5,
  y: 5,
  currentMapData: { ...(maps.PROLOGUE_SOUTH_VILLAGE || bossMap), isFixed:true },
  getCurrentProgressMapKey: () => 'VISUAL_TEST_MAP'
};

StoryManager.events.__visual_default = { actions: [] };
StoryManager.events.__visual_explicit = {
  postBattleBossSprite: { enabled:true, monsterId:Number(authoredBossMonsterId) || 1 },
  actions: []
};
StoryManager.events.__visual_rendered = { actions: [] };

// A story BOSS with no map sprite must never invent one at the player's current coordinates.
let captured = StoryManager.capturePostBattleBossVisualContext('__visual_default', {
  isBossBattle:true,
  fixedBossId:802000,
  fieldBossWasRendered:false
});
assert(captured === false, 'Non-rendered story boss incorrectly created a post-battle boss visual.');
assert(!context.App.data.progress.pendingPostBattleBossVisual,
  'Non-rendered story boss left a pending post-battle boss visual in progress state.');

// An explicit event-level sprite request remains a valid intentional exception.
captured = StoryManager.capturePostBattleBossVisualContext('__visual_explicit', {
  isBossBattle:true,
  fixedBossId:802000,
  fieldBossWasRendered:false
});
assert(captured === true, 'Explicit postBattleBossSprite no longer creates the requested post-battle visual.');
let pending = context.App.data.progress.pendingPostBattleBossVisual;
assert(pending?.explicitSprite === true && pending?.sourceWasRendered === false,
  'Explicit post-battle sprite provenance was not recorded.');
assert(Number(pending?.position?.x) === 5 && Number(pending?.position?.y) === 5,
  'Explicit post-battle sprite did not use the intentional current-position fallback.');

// A boss that was actually drawn on a fixed map remains eligible for post-battle dialogue visuals.
context.App.data.progress.pendingPostBattleBossVisual = null;
context.Field.currentMapData = { ...bossMap, isFixed:true };
context.Field.x = Number(authoredBoss.x);
context.Field.y = Number(authoredBoss.y);
captured = StoryManager.capturePostBattleBossVisualContext('__visual_rendered', {
  isBossBattle:true,
  fixedBossId:authoredBoss.monsterId,
  fixedBossPosition:{ x:Number(authoredBoss.x), y:Number(authoredBoss.y) },
  fixedBossProgressKey:bossMapKey,
  fieldBossWasRendered:true
});
assert(captured === true, 'A genuinely rendered fixed-map boss was not retained for post-battle dialogue.');
pending = context.App.data.progress.pendingPostBattleBossVisual;
assert(pending?.sourceWasRendered === true && pending?.explicitSprite === false,
  'Rendered fixed-map boss provenance was not recorded correctly.');

// Old saves without the new marker are accepted only when their position is an actual authored boss tile.
context.App.data.battle = null;
const nonBossPos = (() => {
  for (let y = 0; y < Number(bossMap.height || 0); y++) {
    for (let x = 0; x < Number(bossMap.width || 0); x++) {
      const isBoss = bossMap.bosses.some(b => Number(b.x) === x && Number(b.y) === y);
      if (!isBoss) return { x, y };
    }
  }
  return { x:-1, y:-1 };
})();
context.App.data.progress.pendingPostBattleBossVisual = {
  eventId:'__visual_default',
  phase:'actions',
  monsterId:Number(authoredBossMonsterId) || 1,
  position:nonBossPos
};
let resolved = StoryManager.getPostBattleBossVisualContext('__visual_default', StoryManager.events.__visual_default, 'actions');
assert(resolved === null, 'Legacy pending visual on a non-boss tile was incorrectly restored.');

context.App.data.progress.pendingPostBattleBossVisual = {
  eventId:'__visual_default',
  phase:'actions',
  monsterId:Number(authoredBossMonsterId) || 1,
  position:{ x:Number(authoredBoss.x), y:Number(authoredBoss.y) }
};
resolved = StoryManager.getPostBattleBossVisualContext('__visual_default', StoryManager.events.__visual_default, 'actions');
assert(resolved && Number(resolved.x) === Number(authoredBoss.x) && Number(resolved.y) === Number(authoredBoss.y),
  'Legacy pending visual for a real fixed-map boss tile was not preserved.');

console.log('PASS validate-post-battle-boss-visual-source-20260811');
