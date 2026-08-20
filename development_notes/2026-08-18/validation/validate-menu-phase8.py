#!/usr/bin/env python3
from pathlib import Path
from playwright.sync_api import sync_playwright
import re

ROOT = Path(__file__).resolve().parents[3]
CSS_FILES = [
    'modern-polish-base.css', 'modern-polish-menu.css', 'modern-polish-field.css',
    'modern-polish-items.css', 'modern-polish-battle-late.css',
    'modern-polish-config-save.css', 'modern-polish-final.css',
    'opening.css', 'runtime-components.css',
]
css = '\n'.join(re.sub(r'@import\s+url\([^;]+;\s*', '', (ROOT / f).read_text(encoding='utf-8')) for f in CSS_FILES)

html = '''<!doctype html><html><head><meta charset="utf-8"></head><body class="game-page">
<div class="sub-screen" id="sub-screen-allies" style="display:flex;width:450px;height:760px;">
  <div id="allies-detail-content"><div class="scroll-container-inner">
    <button id="ally-classic" class="btn menu-action-button menu-action-button--classic">スキル習得画面へ</button>
    <button id="ally-secondary" class="btn menu-action-button menu-action-button--secondary">キャラクター詳細を見る</button>
  </div></div>
</div>
<div class="sub-screen" id="sub-screen-items" style="display:flex;width:450px;height:760px;">
  <div class="header-bar"><span>道具</span></div>
  <div id="item-screen-list" class="flex-col-container">
    <div id="item-tab-page" class="item-tab-page">
      <div id="item-tabs" class="item-tab-bar">
        <button id="item-tab-on" class="item-tab-btn active" aria-selected="true">道具</button>
        <button class="item-tab-btn" aria-selected="false">育成</button>
        <button class="item-tab-btn" aria-selected="false">素材</button>
        <button class="item-tab-btn" aria-selected="false">貴重品</button>
      </div>
      <div id="list-items" class="scroll-area">
        <div id="item-row-a" class="list-item menu-pick-card item-list-row"><div class="menu-pick-main">A</div></div>
        <div id="item-row-b" class="list-item menu-pick-card item-list-row"><div class="menu-pick-main">B</div></div>
      </div>
    </div>
  </div>
</div>
</body></html>'''

failures=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1000,'height':900})
    page.set_content(html)
    page.add_style_tag(content=css)
    page.wait_for_timeout(150)

    classic=page.eval_on_selector('#ally-classic', '''el=>{const c=getComputedStyle(el);return {bg:c.backgroundImage,bw:c.borderTopWidth,bc:c.borderTopColor,shadow:c.boxShadow,color:c.color}}''')
    secondary=page.eval_on_selector('#ally-secondary', '''el=>{const c=getComputedStyle(el);return {bg:c.backgroundImage,bw:c.borderTopWidth,bc:c.borderTopColor,shadow:c.boxShadow,color:c.color}}''')
    if 'rgb(108, 67, 31)' not in classic['bg'] or classic['bw']=='0px' or classic['shadow']=='none':
        failures.append(('classic action button',classic))
    if 'rgb(36, 21, 12)' not in secondary['bg'] or secondary['bw']=='0px' or secondary['shadow']=='none':
        failures.append(('secondary action button',secondary))
    if classic['bg']==secondary['bg']:
        failures.append(('button hierarchy distinct',(classic,secondary)))

    panel=page.eval_on_selector('#item-tab-page', '''el=>{const c=getComputedStyle(el),r=el.getBoundingClientRect();return {w:r.width,bg:c.backgroundColor,bw:c.borderTopWidth,br:c.borderRadius,overflow:c.overflow}}''')
    tabs=page.eval_on_selector('#item-tabs', '''el=>{const c=getComputedStyle(el),r=el.getBoundingClientRect();return {w:r.width,m:c.margin,bb:c.borderBottomWidth,br:c.borderRadius,bg:c.backgroundColor}}''')
    lst=page.eval_on_selector('#list-items', '''el=>{const c=getComputedStyle(el),r=el.getBoundingClientRect();return {w:r.width,p:c.padding,bw:c.borderTopWidth,bg:c.backgroundColor}}''')
    rows=page.eval_on_selector_all('#item-row-a,#item-row-b', '''els=>els.map(el=>{const c=getComputedStyle(el);return {m:c.margin,br:c.borderRadius,bb:c.borderBottomWidth,bg:c.backgroundImage,shadow:c.boxShadow}})''')

    if panel['bg']!='rgb(26, 14, 7)' or panel['bw']=='0px' or panel['overflow']!='hidden':
        failures.append(('item outer page',panel))
    if abs(tabs['w']-lst['w'])>.5 or abs(panel['w']-tabs['w']-2)>.5:
        failures.append(('tab/list shared width',(panel,tabs,lst)))
    if tabs['m']!='0px' or tabs['bb']=='0px' or tabs['br']!='0px' or tabs['bg']!='rgb(19, 9, 5)':
        failures.append(('tabs attached to panel',tabs))
    if lst['p']!='0px' or lst['bw']!='0px' or lst['bg']!='rgb(26, 14, 7)':
        failures.append(('item list page surface',lst))
    if rows[0]['m']!='0px' or rows[0]['br']!='0px' or rows[0]['bb']=='0px' or 'rgb(48, 26, 14)' not in rows[0]['bg'] or rows[0]['shadow']!='none':
        failures.append(('contiguous first item row',rows[0]))
    if rows[1]['m']!='0px' or rows[1]['br']!='0px':
        failures.append(('contiguous second item row',rows[1]))

    print('classic:',classic)
    print('secondary:',secondary)
    print('item-panel:',panel)
    print('item-tabs:',tabs)
    print('item-list:',lst)
    print('item-rows:',rows)
    browser.close()

if failures:
    for name,value in failures:
        print('FAIL',name,value)
    raise SystemExit(1)
print('Phase 8 menu structure validation OK')
