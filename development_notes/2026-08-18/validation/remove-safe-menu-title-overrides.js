const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const rootDir = path.resolve(__dirname, '../../..');
const cssPath = path.join(rootDir, 'modern-polish.css');
const root = postcss.parse(fs.readFileSync(cssPath, 'utf8'), { from: cssPath });

const normalize = value => String(value).replace(/\s+/g, ' ').trim();
function contextKey(rule) {
  const parts = [];
  let node = rule.parent;
  while (node && node.type !== 'root') {
    if (node.type === 'atrule') parts.push(`@${node.name} ${node.params}`.trim());
    node = node.parent;
  }
  return parts.reverse().join(' | ');
}
function simpleValue(value) {
  const v = normalize(value);
  if (/var\(|env\(|clamp\(|calc\(|min\(|max\(|url\(|-webkit|revert|inherit|initial|unset|svh|dvh|lvh|vh\b|vw\b|%|gradient\(|filter\(|transform\(|animation\(|attr\(/i.test(v)) return false;
  return /^[#(),.\-\w\s\/:'"]+$/.test(v);
}
function allowedSelector(selector) {
  return /^body\.title-page(?:\b|\s|\.|#|:|\[)/.test(selector)
    || selector.includes('body.game-page .menu-select-card')
    || selector.includes('body.game-page .ally-archive-nav');
}

const groups = new Map();
root.walkRules(rule => {
  const selector = normalize(rule.selector);
  const context = contextKey(rule);
  for (const node of rule.nodes || []) {
    if (node.type !== 'decl') continue;
    const key = [context, selector, node.prop.toLowerCase(), node.important ? 'important' : 'normal'].join('@@');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(node);
  }
});

const removals = [];
for (const [key, decls] of groups) {
  if (decls.length < 2) continue;
  const [, selector] = key.split('@@');
  if (!allowedSelector(selector)) continue;
  const latest = decls[decls.length - 1];
  if (!simpleValue(latest.value)) continue;
  for (const previous of decls.slice(0, -1)) {
    if (!simpleValue(previous.value)) continue;
    if (normalize(previous.value) === normalize(latest.value)) continue;
    removals.push({
      line: previous.source?.start?.line || 0,
      keptLine: latest.source?.start?.line || 0,
      selector,
      property: previous.prop,
      removedValue: normalize(previous.value),
      keptValue: normalize(latest.value),
      important: !!previous.important,
      context: key.split('@@')[0]
    });
    previous.remove();
  }
}
root.walkRules(rule => {
  if (!(rule.nodes || []).some(node => node.type !== 'comment')) rule.remove();
});
fs.writeFileSync(cssPath, root.toString());
fs.writeFileSync(path.join(__dirname, 'phase2-dead-override-removals.json'), JSON.stringify({ count: removals.length, removals }, null, 2));
console.log(`Removed ${removals.length} safe dead title/menu declarations.`);
