const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const rootDir = path.resolve(__dirname, '../../..');
const loaderPath = path.join(rootDir, 'modern-polish.css');

function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }
function lineAt(text, index) { return text.slice(0, index).split(/\r?\n/).length; }
function atContext(node) {
  const a = [];
  let p = node.parent;
  while (p && p.type !== 'root') {
    if (p.type === 'atrule') a.push(`@${p.name} ${p.params}`.trim());
    p = p.parent;
  }
  return a.reverse().join(' | ');
}

function readCssSource(file) {
  const full = path.join(rootDir, file);
  const text = fs.readFileSync(full, 'utf8');
  return { file, full, text, root: postcss.parse(text, { from: full }) };
}

function resolveLoadedCssFiles() {
  const loaderText = fs.readFileSync(loaderPath, 'utf8');
  const imports = [];
  const re = /@import\s+url\(\s*["']([^"']+)["']\s*\)\s*;/g;
  let m;
  while ((m = re.exec(loaderText))) imports.push(m[1]);
  // index.html loads these after modern-polish.css. Keep them in runtime order.
  for (const extra of ['opening.css', 'runtime-components.css']) {
    if (fs.existsSync(path.join(rootDir, extra))) imports.push(extra);
  }
  return { loaderText, files: imports };
}

const loaded = resolveLoadedCssFiles();
const cssSources = loaded.files.map(readCssSource);
const cssBySelector = new Map();

for (const source of cssSources) {
  source.root.walkRules(rule => {
    const ctx = atContext(rule);
    for (const sel of rule.selectors || [rule.selector]) {
      const key = `${ctx}@@${norm(sel)}`;
      if (!cssBySelector.has(key)) cssBySelector.set(key, []);
      const props = {};
      rule.nodes.filter(n => n.type === 'decl').forEach(d => {
        props[d.prop.toLowerCase()] = {
          value: norm(d.value),
          important: !!d.important,
          line: d.source?.start?.line || 0
        };
      });
      cssBySelector.get(key).push({
        file: source.file,
        line: rule.source?.start?.line || 0,
        context: ctx,
        props
      });
    }
  });
}

const files = fs.readdirSync(rootDir).filter(f => /\.(js|html)$/.test(f));
const findings = [];
const fileSummary = {};
function add(file, kind, line, detail = '') {
  findings.push({ file, kind, line, detail: detail.slice(0, 260) });
  const s = fileSummary[file] ||= { total: 0, kinds: {} };
  s.total++;
  s.kinds[kind] = (s.kinds[kind] || 0) + 1;
}

const injectedSheets = [];
for (const file of files) {
  const text = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((ln, idx) => {
    if (/\.style\.cssText\s*=/.test(ln)) add(file, 'cssText-assignment', idx + 1, ln.trim());
    if (/\.style\.[A-Za-z_$][\w$]*\s*=/.test(ln) && !/\.style\.cssText\s*=/.test(ln)) add(file, 'style-property-assignment', idx + 1, ln.trim());
    if (/Object\.assign\s*\([^\n]*\.style\s*,/.test(ln)) add(file, 'style-object-assignment', idx + 1, ln.trim());
    if (/setAttribute\s*\(\s*['"]style['"]/.test(ln)) add(file, 'setAttribute-style', idx + 1, ln.trim());
    if (/style\s*=\s*['"][^'"]/.test(ln) || /\sstyle=["']/.test(ln)) add(file, 'inline-style-markup', idx + 1, ln.trim());
    if (/\[style\*?=/.test(ln) || /\[style\*=/.test(ln)) add(file, 'style-attribute-selector', idx + 1, ln.trim());
    if (/\.style\.setProperty\s*\([^\n]*['"]important['"]/.test(ln)) add(file, 'style-setProperty-important', idx + 1, ln.trim());
  });

  const re = /style\.textContent\s*=\s*`([\s\S]*?)`\s*;/g;
  let m;
  while ((m = re.exec(text))) {
    const start = lineAt(text, m.index);
    add(file, 'runtime-stylesheet-injection', start, 'style.textContent = `...`');
    const css = m[1];
    const sheet = { file, line: start, selectors: [], parseError: null, interpolated: css.includes('${') };
    try {
      const r = postcss.parse(css.replace(/\$\{[^}]*\}/g, '0'));
      r.walkRules(rule => {
        const ctx = atContext(rule);
        for (const sel of rule.selectors || [rule.selector]) {
          const s = norm(sel);
          const props = {};
          rule.nodes.filter(n => n.type === 'decl').forEach(d => props[d.prop.toLowerCase()] = { value: norm(d.value), important: !!d.important });
          const overlaps = (cssBySelector.get(`${ctx}@@${s}`) || []).map(x => ({
            cssFile: x.file,
            cssLine: x.line,
            context: x.context,
            sharedProperties: Object.keys(props).filter(p => x.props[p]).map(p => ({ property: p, runtime: props[p], stylesheet: x.props[p] }))
          })).filter(x => x.sharedProperties.length);
          sheet.selectors.push({ selector: s, properties: Object.keys(props), overlaps });
        }
      });
    } catch (e) { sheet.parseError = String(e.message || e); }
    injectedSheets.push(sheet);
  }

  const quotedRe = /style\.textContent\s*=\s*(['"])([^\n]*?)\1\s*;/g;
  while ((m = quotedRe.exec(text))) {
    const start = lineAt(text, m.index);
    add(file, 'runtime-stylesheet-injection', start, 'style.textContent = quoted CSS');
    const css = m[2];
    const sheet = { file, line: start, selectors: [], parseError: null, interpolated: false };
    try {
      const r = postcss.parse(css);
      r.walkRules(rule => {
        const ctx = atContext(rule);
        for (const sel of rule.selectors || [rule.selector]) {
          const ss = norm(sel);
          const props = {};
          rule.nodes.filter(n => n.type === 'decl').forEach(d => props[d.prop.toLowerCase()] = { value: norm(d.value), important: !!d.important });
          const overlaps = (cssBySelector.get(`${ctx}@@${ss}`) || []).map(x => ({
            cssFile: x.file,
            cssLine: x.line,
            context: x.context,
            sharedProperties: Object.keys(props).filter(pp => x.props[pp]).map(pp => ({ property: pp, runtime: props[pp], stylesheet: x.props[pp] }))
          })).filter(x => x.sharedProperties.length);
          sheet.selectors.push({ selector: ss, properties: Object.keys(props), overlaps });
        }
      });
    } catch (e) { sheet.parseError = String(e.message || e); }
    injectedSheets.push(sheet);
  }
}

const fragileSelectors = [];
const wildcardTabSelectors = [];
const semanticStateImportant = [];
for (const source of cssSources) {
  source.root.walkRules(rule => {
    const selector = norm(rule.selector);
    if (/\[style\*\s*=/.test(selector)) fragileSelectors.push({ file: source.file, line: rule.source?.start?.line || 0, selector });
    if (/\[id\$\s*=\s*["']-tabs["']\]/.test(selector)) wildcardTabSelectors.push({ file: source.file, line: rule.source?.start?.line || 0, selector });
    const positiveSemanticSelector = selector.replace(/:not\([^)]*\)/g, '');
    if (/\.menu-(?:tab|filter)-button/.test(positiveSemanticSelector)) {
      const importantProps = rule.nodes.filter(n => n.type === 'decl' && n.important).map(n => n.prop);
      if (importantProps.length) semanticStateImportant.push({ file: source.file, line: rule.source?.start?.line || 0, selector, importantProps });
    }
  });
}

const inlineImportant = [];
for (const file of files) {
  const text = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((ln, i) => {
    if (/style=.*!important|style\.cssText.*!important|!important/.test(ln) && /style/.test(ln)) inlineImportant.push({ file, line: i + 1, text: ln.trim().slice(0, 280) });
  });
}

// State colors interpolated into button inline styles are a known source of hidden
// JS-vs-CSS competition. The menu cleanup target is zero for menu-owned files.
const statefulMenuInlineButtons = [];
const menuFiles = files.filter(file => /^menus.*\.js$/.test(file) || file === 'blacksmith.js');
for (const file of menuFiles) {
  const text = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const buttonRe = /<button\b([\s\S]*?)>/gi;
  let m;
  while ((m = buttonRe.exec(text))) {
    const attrs = m[1];
    const styleMatch = attrs.match(/style\s*=\s*(["'])([\s\S]*?)\1/i);
    if (!styleMatch) continue;
    const styleText = styleMatch[2];
    if (!styleText.includes('${') || !/(?:background|border|color)\s*:/.test(styleText)) continue;
    statefulMenuInlineButtons.push({ file, line: lineAt(text, m.index), style: norm(styleText).slice(0, 300), tag: norm(`<button${attrs}>`).slice(0, 360) });
  }
}

const priorityImportant = findings.filter(x => x.kind === 'style-setProperty-important');
const overlaps = injectedSheets.flatMap(s => s.selectors.flatMap(x => x.overlaps.length ? [{ file: s.file, line: s.line, selector: x.selector, overlaps: x.overlaps }] : []));
const stylesheetSummary = cssSources.map(source => {
  let importantDeclarations = 0;
  source.root.walkDecls(decl => { if (decl.important) importantDeclarations += 1; });
  return {
    file: source.file,
    lines: source.text.split(/\r?\n/).length,
    importantDeclarations,
    importantTokens: (source.text.match(/!important/g) || []).length
  };
});

const result = {
  loadedStylesheets: stylesheetSummary,
  modernPolish: {
    loaderLines: loaded.loaderText.split(/\r?\n/).length,
    importedFiles: loaded.files,
    totalLines: stylesheetSummary.reduce((n, x) => n + x.lines, 0),
    importantDeclarations: stylesheetSummary.reduce((n, x) => n + x.importantDeclarations, 0),
    importantTokens: stylesheetSummary.reduce((n, x) => n + x.importantTokens, 0),
    styleAttributeSelectorRules: fragileSelectors.length,
    wildcardTabSelectorRules: wildcardTabSelectors.length,
    semanticStateImportantRules: semanticStateImportant.length
  },
  runtimeStyleSources: { totalFindings: findings.length, filesWithFindings: Object.keys(fileSummary).length, fileSummary },
  runtimeInjectedStylesheets: { count: injectedSheets.length, exactSelectorPropertyOverlapCount: overlaps.length, sheets: injectedSheets, overlaps },
  fragileStyleAttributeSelectors: fragileSelectors,
  wildcardTabSelectors,
  semanticStateImportant,
  statefulMenuInlineButtons,
  inlineImportant,
  priorityImportant,
  findings
};

fs.writeFileSync(path.join(__dirname, 'runtime-style-source-audit.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify({
  modernPolish: result.modernPolish,
  runtimeStyleSources: { totalFindings: findings.length, filesWithFindings: Object.keys(fileSummary).length },
  runtimeInjectedStylesheets: { count: injectedSheets.length, overlaps: overlaps.length },
  inlineImportant: inlineImportant.length,
  priorityImportant: priorityImportant.length,
  statefulMenuInlineButtons: statefulMenuInlineButtons.length
}, null, 2));
