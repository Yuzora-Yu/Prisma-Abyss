'use strict';
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');

const root = path.resolve(__dirname, '../../..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8').replace(/\r\n?/g, '\n');

function loadStory() {
  const context = { console, window: {} };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(read('story.js') + '\nglobalThis.__story = STORY_MANAGER_DATA;', context);
  return context.__story;
}

function loadMap() {
  const context = { console, window: {} };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(read('map.js') + '\nglobalThis.__maps = { FIXED_MAPS };', context);
  return context.__maps.FIXED_MAPS;
}

function checkHayate() {
  const story = loadStory();
  const maps = loadMap();
  const intro = story.scripts.HAYATE_REXNOTE_SIGHTING;
  const after = story.scripts.HAYATE_REXNOTE_AFTER_SIGHTING;
  const event = story.events.hayate_rexnote_sighting;
  assert(Array.isArray(intro) && intro.length >= 2, 'Hayate intro script missing');
  assert.strictEqual(intro[0].name, 'ハヤテ');
  assert.strictEqual(intro[0].text, '・・・・・・');
  const visual = intro.find(line => line.type === 'FIELD_CUTSCENE');
  assert(visual, 'Hayate vortex cutscene missing');
  const show = visual.commands.find(cmd => cmd.op === 'SHOW_SPRITE');
  assert(show, 'Hayate vortex SHOW_SPRITE missing');
  assert.strictEqual(show.src, 'assets/effect/fx-abyss-vortex-ai.png');
  assert.strictEqual(show.x, 5);
  assert.strictEqual(show.y, 7);
  const remove = after?.flatMap(line => line.commands || []).find(cmd => cmd.op === 'REMOVE_SPRITE');
  assert(remove && remove.id === show.id, 'Vortex must be removed after Hayate actor disappears');
  const gaile = after.find(line => line.charId === 109);
  assert(gaile && gaile.text === 'ん、誰かいたのか？', 'Gaile reaction missing');
  assert.deepStrictEqual(Array.from(event.actions, a => a.type), ['CONV', 'FLAG', 'CONV']);
  assert.strictEqual(event.actions[0].value, 'HAYATE_REXNOTE_SIGHTING');
  assert.strictEqual(event.actions[1].key, 'hayateRexnoteSighted');
  assert.strictEqual(event.actions[1].refreshField, true);
  assert.strictEqual(event.actions[2].value, 'HAYATE_REXNOTE_AFTER_SIGHTING');

  const actor = maps.REXNOTE_ESTATE_GROUNDS.mapActors.find(a => a.actorId === 'hayate_rexnote_sighting');
  assert(actor && actor.x === 5 && actor.y === 7, 'Hayate map placement changed unexpectedly');
  const state = actor.states.find(s => s.stateId === 'hayate_rexnote_sighting');
  assert(state && state.when.requiredFlag === 'rexnoteRouteKnown');
  assert.strictEqual(state.when.missingFlag, 'hayateRexnoteSighted');

  const assets = read('assets.js');
  assert(assets.includes('"abyss-vortex": "assets/effect/fx-abyss-vortex-ai.png"'), 'vortex asset is not registered in assets.js');
  const storyLogic = read('story_logic.js');
  assert(storyLogic.includes('if (cmd.src) return cmd.src;'), 'FIELD_CUTSCENE direct src support missing');
}

function auditPhase17() {
  const story = loadStory();
  const monsters = read('monsters.js');
  const battle = read('battle.js');
  const current = story.scripts.ABYSS_VEGNASIS || [];
  assert(current.some(line => String(line.text || '').includes('五つの声')), 'current five-wedge baseline unexpectedly changed');
  const linked = [...monsters.matchAll(/"id":(30208[0-9])[\s\S]*?"linkedBattleGroup":"vegnasis"/g)].map(m => Number(m[1]));
  const unique = [...new Set(linked)].sort((a,b) => a-b);
  assert.deepStrictEqual(unique, [302080,302081,302082,302083,302084], 'current Vegnasis baseline is no longer five linked units; re-audit proposal');
  assert(battle.includes('Math.min(4, Number(effect.stage'), 'five-unit visual-stage assumption not found');
  assert(battle.includes('Math.min(5, linkedIndex)'), 'five fall-script assumption not found');
  return { currentLinkedPillars: unique.length, linkedIds: unique };
}

const phase17 = auditPhase17();
checkHayate();
console.log(JSON.stringify({ hayate: 'ok', phase17Audit: phase17 }, null, 2));
