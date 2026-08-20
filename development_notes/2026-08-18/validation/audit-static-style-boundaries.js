const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const rootDir = path.resolve(__dirname, '../../..');
const sheets = ['modern-polish.css', 'runtime-components.css'];

function normalize(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function atContext(node) {
  const parts = [];
  let parent = node.parent;
  while (parent && parent.type !== 'root') {
    if (parent.type === 'atrule') parts.push(`@${parent.name} ${parent.params}`.trim());
    parent = parent.parent;
  }
  return parts.reverse().join(' | ');
}

function parseSheet(file) {
  const fullPath = path.join(rootDir, file);
  const text = fs.readFileSync(fullPath, 'utf8');
  const root = postcss.parse(text, { from: fullPath });
  const rules = new Map();
  let declarations = 0;
  let important = 0;
  root.walkDecls(decl => {
    declarations += 1;
    if (decl.important) important += 1;
  });

  root.walkRules(rule => {
    const context = atContext(rule);
    for (const selector of rule.selectors || [rule.selector]) {
      const key = `${context}@@${normalize(selector)}`;
      const props = rules.get(key) || new Map();
      rule.nodes.filter(node => node.type === 'decl').forEach(decl => {
        props.set(decl.prop.toLowerCase(), {
          value: normalize(decl.value),
          important: Boolean(decl.important),
          line: decl.source?.start?.line || 0
        });
      });
      rules.set(key, props);
    }
  });

  return {
    file,
    text,
    rules,
    stats: {
      lines: text.split(/\r?\n/).length,
      declarations,
      important
    }
  };
}

const modern = parseSheet(sheets[0]);
const runtime = parseSheet(sheets[1]);
const exactOverlaps = [];

for (const [key, runtimeProps] of runtime.rules) {
  const modernProps = modern.rules.get(key);
  if (!modernProps) continue;
  const shared = [];
  for (const [prop, runtimeDecl] of runtimeProps) {
    if (!modernProps.has(prop)) continue;
    shared.push({
      property: prop,
      modern: modernProps.get(prop),
      runtime: runtimeDecl
    });
  }
  if (shared.length) {
    const [context, selector] = key.split('@@');
    exactOverlaps.push({ context, selector, shared });
  }
}

const indexText = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const swText = fs.readFileSync(path.join(rootDir, 'sw.js'), 'utf8');
const modernPos = indexText.indexOf('modern-polish.css');
const openingPos = indexText.indexOf('opening.css');
const runtimePos = indexText.indexOf('runtime-components.css');

const result = {
  sheets: {
    modernPolish: modern.stats,
    runtimeComponents: runtime.stats
  },
  exactSelectorPropertyOverlapCount: exactOverlaps.length,
  exactSelectorPropertyOverlaps: exactOverlaps,
  loadOrder: {
    modernPolishFound: modernPos >= 0,
    openingFound: openingPos >= 0,
    runtimeComponentsFound: runtimePos >= 0,
    runtimeComponentsAfterModernPolish: runtimePos > modernPos,
    runtimeComponentsAfterOpening: runtimePos > openingPos
  },
  serviceWorker: {
    runtimeComponentsPrecached: /["']runtime-components\.css["']/.test(swText),
    cacheName: (swText.match(/CACHE_NAME\s*=\s*["']([^"']+)/) || [])[1] || null
  }
};

fs.writeFileSync(
  path.join(__dirname, 'static-style-boundary-audit.json'),
  JSON.stringify(result, null, 2)
);
console.log(JSON.stringify(result, null, 2));
