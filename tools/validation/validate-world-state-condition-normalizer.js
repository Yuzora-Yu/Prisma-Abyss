const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const mainSource = fs.readFileSync(path.join(root, 'main.js'), 'utf8');

function assert(value, message) {
  if (!value) throw new Error(message);
}

const match = mainSource.match(/normalizeWorldStateConditions:\s*(\(value\)\s*=>\s*\{[\s\S]*?\n    \}),\n\n    evaluateWorldStateCondition/);
assert(match, 'Could not locate normalizeWorldStateConditions runtime.');
const normalize = vm.runInNewContext(`(${match[1]})`);

const primitive = normalize({ fireVillageRecovery: 2 });
assert(primitive.length === 1, 'Primitive world-state shorthand should produce one rule.');
assert(primitive[0].key === 'fireVillageRecovery' && primitive[0].op === '===' && primitive[0].value === 2,
  'Primitive world-state shorthand was changed.');

const threshold = normalize({ prologueStage: { op: '>=', value: 1 } });
assert(threshold.length === 1, 'Nested threshold world-state shorthand should produce one rule.');
assert(threshold[0].key === 'prologueStage' && threshold[0].op === '>=' && threshold[0].value === 1,
  'Nested >= world-state shorthand lost its operator/value.');

const exact = normalize({ thunderFortState: { op: '==', value: 3 } });
assert(exact.length === 1, 'Nested equality world-state shorthand should produce one rule.');
assert(exact[0].key === 'thunderFortState' && exact[0].op === '==' && exact[0].value === 3,
  'Nested == world-state shorthand lost its operator/value.');

const explicit = normalize({ key: 'lunaMemoryStage', op: '>=', value: 2 });
assert(explicit.length === 1 && explicit[0].key === 'lunaMemoryStage' && explicit[0].op === '>=',
  'Explicit world-state condition format was changed.');

console.log('PASS validate-world-state-condition-normalizer');
