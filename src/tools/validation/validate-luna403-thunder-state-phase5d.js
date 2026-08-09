#!/usr/bin/env node
'use strict';
const fs = require('fs');
const vm = require('vm');
function assert(c,m){ if(!c) throw new Error(m); }

const charContext = { console };
charContext.window = charContext; charContext.globalThis = charContext;
vm.createContext(charContext);
vm.runInContext(fs.readFileSync('characters.js','utf8'), charContext, {filename:'characters.js'});
const chars = charContext.CHARACTERS_DATA || charContext.CHARACTER_DATA || charContext.CHARACTERS;
assert(Array.isArray(chars), 'character master missing');
const luna = chars.find(c => Number(c.id) === 403);
assert(luna, 'character ID403 missing');
assert(luna.name === 'ルーナ', 'ID403 display name must be ルーナ');
assert(luna.prologueOnly === true, 'ID403 must remain prologueOnly');
assert(Number(luna.adultCharacterId) === 401, 'ID403 adultCharacterId must remain 401');

const main = fs.readFileSync('main.js','utf8');
const db = fs.readFileSync('database.js','utf8');
const story = fs.readFileSync('story.js','utf8');
assert(main.includes('thunderFortState: 0'), 'main.js default thunderFortState missing');
const schemaMatch = main.match(/storyStateSchemaVersion:\s*(\d+)/); assert(schemaMatch && Number(schemaMatch[1]) >= 5, 'story state schema version must remain >=5');
assert(main.includes('reconcileThunderFortWorldState'), 'legacy thunder fort reconciliation helper missing');
assert(main.includes('flags.thunderFortCleared === true'), 'cleared flag migration missing');
assert(main.includes('flags.josephJoinedAtThunderFort === true'), 'entered flag migration missing');
assert(db.includes('thunderFortState: 0'), 'database.js default thunderFortState missing');
assert(story.includes('"key": "thunderFortState"'), 'story thunderFortState actions missing');
assert(story.includes('"value": 1') && story.includes('"value": 2'), 'thunderFortState transition values missing');
const uses403 = (story.match(/"charId": 403/g) || []).length;
assert(uses403 >= 8, 'prologue should consistently use character ID403');
console.log('PASS validate-luna403-thunder-state-phase5d');
