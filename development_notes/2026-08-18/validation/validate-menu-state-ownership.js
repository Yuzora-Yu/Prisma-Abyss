#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const root = path.resolve(__dirname, '..', '..', '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const fail = msg => { throw new Error(msg); };

const menuCss = read('modern-polish-menu.css');
const fieldCss = read('modern-polish-field.css');
const configCss = read('modern-polish-config-save.css');
if (/\[id\$\s*=\s*["']-tabs["']\]/.test(menuCss)) fail('wildcard tab selector returned');
if (/#allies-detail-content\s*>\s*div:first-child\s+button/.test(menuCss)) fail('ally detail legacy skin must not target every descendant button');
if (fieldCss.includes('#skill-list-container')) fail('ally skill state CSS leaked into field stylesheet');

const semanticNames = [
  'menu-tab-button','menu-filter-button','menu-state-button','menu-choice-button',
  'ally-trait-toggle','skill-usage-toggle','ally-trait-card','ally-trait-fixed-badge',
  'inventory-sell-selected-button','achievement-claim-all-button','achievement-entry','menu-action-button',
  'guild-travel-button','smith-material-confirm','smith-material-item','smith-enhance-confirm','daily-reward-button'
];
for (const [file, css] of [['modern-polish-menu.css', menuCss], ['modern-polish-config-save.css', configCss]]) {
  const ast = postcss.parse(css, { from: file });
  ast.walkRules(rule => {
    const positive = rule.selector.replace(/:not\([^)]*\)/g, '');
    if (!semanticNames.some(name => positive.includes('.' + name))) return;
    const important = rule.nodes.filter(n => n.type === 'decl' && n.important).map(n => n.prop);
    if (important.length) fail(`${file}:${rule.source.start.line} semantic state rule uses !important: ${important.join(', ')}`);
  });
}

const sourceChecks = [
  ['menus_allies.js', /class="btn skill-usage-toggle/, 'skill toggles must not inherit legacy .btn skin'],
  ['menus_allies.js', /ally-skill-card[^>]*style="[^"]*(?:background|border)\s*:/, 'ally skill card surface must be class-owned'],
  ['menus_allies.js', /menu-action-button[^>]*style="[^"]*(?:background|border(?:-color)?)\s*:/, 'menu action surface must be class-owned'],
  ['menus_allies.js', /class="menu-surface-card"[^>]*\$\{t\.isEquip/, 'trait state must not be encoded behind menu-surface-card'],
  ['menus_achievements.js', /class="list-item"[^>]*border-left:[^>]*\$\{state\.completed/, 'achievement state must not depend on inline list-item border'],
  ['menus_config.js', /class="list-item"[^>]*background:\$\{checked/, 'config radio state must not depend on inline list-item color'],
  ['blacksmith.js', /div\.style\.background\s*=\s*MenuBlacksmith\.state\.materials/, 'smith selection must be class-owned'],
  ['blacksmith.js', /div\.style\.border\s*=\s*MenuBlacksmith\.state\.materials/, 'smith selection border must be class-owned'],
];
for (const [file, pattern, message] of sourceChecks) if (pattern.test(read(file))) fail(`${file}: ${message}`);

for (const file of fs.readdirSync(root).filter(f => (/^menus.*\.js$/.test(f) || f === 'blacksmith.js'))) {
  const text = read(file);
  const buttonRe = /<button\b([\s\S]*?)>/gi;
  let m;
  while ((m = buttonRe.exec(text))) {
    const attrs = m[1];
    const style = attrs.match(/style\s*=\s*(["'])([\s\S]*?)\1/i)?.[2] || '';
    if (style.includes('${') && /(?:background|border|color)\s*:/.test(style)) {
      const line = text.slice(0, m.index).split(/\r?\n/).length;
      fail(`${file}:${line} stateful button presentation remains inline`);
    }
  }
}

console.log('Menu state ownership OK: semantic states are class-owned without semantic !important overrides');
