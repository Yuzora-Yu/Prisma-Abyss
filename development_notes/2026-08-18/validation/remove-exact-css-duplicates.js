const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const rootDir = path.resolve(__dirname, '../../..');
const cssPath = path.join(rootDir, 'modern-polish.css');
const input = fs.readFileSync(cssPath, 'utf8');
const root = postcss.parse(input, { from: cssPath });

function contextKey(rule) {
  const parts = [];
  let node = rule.parent;
  while (node && node.type !== 'root') {
    if (node.type === 'atrule') parts.push(`@${node.name} ${node.params}`.trim());
    node = node.parent;
  }
  return parts.reverse().join(' | ');
}

function normalize(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

const seen = new Map();
const removals = [];
root.walkRules(rule => {
  const selector = normalize(rule.selector);
  const context = contextKey(rule);
  for (const node of [...rule.nodes]) {
    if (node.type !== 'decl') continue;
    const key = [context, selector, node.prop.toLowerCase(), node.important ? 'important' : 'normal', normalize(node.value)].join('@@');
    const previous = seen.get(key);
    if (previous) {
      // The later declaration is byte-for-byte equivalent in cascade meaning for
      // the same selector and at-rule context, so the earlier one cannot affect
      // the computed value. Keep the latest declaration to preserve source order.
      removals.push({
        line: previous.source?.start?.line || 0,
        keptLine: node.source?.start?.line || 0,
        selector,
        property: node.prop,
        value: normalize(node.value),
        important: !!node.important,
        context
      });
      previous.remove();
    }
    seen.set(key, node);
  }
});

// Empty rules have no cascade effect. Removing them only avoids leaving shells
// after duplicate declarations were deleted.
root.walkRules(rule => {
  const hasMeaningfulNode = rule.nodes.some(node => node.type !== 'comment');
  if (!hasMeaningfulNode) rule.remove();
});

fs.writeFileSync(cssPath, root.toString());
fs.writeFileSync(path.join(__dirname, 'exact-css-duplicate-removals.json'), JSON.stringify({ count: removals.length, removals }, null, 2));
console.log(`Removed ${removals.length} exact duplicate declarations.`);
console.log(`Removed !important duplicates: ${removals.filter(x => x.important).length}`);
