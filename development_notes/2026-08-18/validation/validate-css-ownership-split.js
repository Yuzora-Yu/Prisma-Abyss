#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const root = path.resolve(__dirname, '..', '..', '..');
const loaderPath = path.join(root, 'modern-polish.css');
const loader = fs.readFileSync(loaderPath, 'utf8');
const imports = [...loader.matchAll(/@import\s+url\(["']([^"']+)["']\)\s*;/g)].map(m => m[1]);
const expected = [
  'modern-polish-base.css',
  'modern-polish-menu.css',
  'modern-polish-field.css',
  'modern-polish-items.css',
  'modern-polish-battle-late.css',
  'modern-polish-config-save.css',
  'modern-polish-final.css'
];
if (JSON.stringify(imports) !== JSON.stringify(expected)) {
  throw new Error(`unexpected modern-polish import order: ${JSON.stringify(imports)}`);
}

let important = 0;
let rules = 0;
for (const rel of imports) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) throw new Error(`missing imported CSS: ${rel}`);
  const css = fs.readFileSync(file, 'utf8');
  const ast = postcss.parse(css, { from: file });
  ast.walkRules(() => rules += 1);
  ast.walkDecls(d => { if (d.important) important += 1; });
}

const menuCss = fs.readFileSync(path.join(root, 'modern-polish-menu.css'), 'utf8');
if (!menuCss.includes('.menu-notification-dot')) throw new Error('menu notification marker CSS is not menu-owned');

console.log(`CSS split OK: ${imports.length} ordered files, ${rules} rules, ${important} !important declarations`);
