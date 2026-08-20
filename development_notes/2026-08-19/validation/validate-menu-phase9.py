#!/usr/bin/env python3
from pathlib import Path
from playwright.sync_api import sync_playwright
import re

ROOT = Path(__file__).resolve().parents[3]
CSS_FILES = [
    'modern-polish-base.css',
    'modern-polish-menu.css',
    'modern-polish-field.css',
    'modern-polish-items.css',
    'modern-polish-battle-late.css',
    'modern-polish-config-save.css',
    'modern-polish-final.css',
    'opening.css',
    'runtime-components.css',
]
SPLIT_POLISH_FILES = [
    'modern-polish-base.css',
    'modern-polish-menu.css',
    'modern-polish-field.css',
    'modern-polish-items.css',
    'modern-polish-battle-late.css',
    'modern-polish-config-save.css',
    'modern-polish-final.css',
]


def css_text(path: Path) -> str:
    return re.sub(r'@import\s+url\([^;]+;\s*', '', path.read_text(encoding='utf-8'))


css = '\n'.join(css_text(ROOT / name) for name in CSS_FILES)
failures = []


def require(condition, label, value=None):
    if not condition:
        failures.append((label, value))


def assert_brown_background(label, style, expected_fragment=None):
    bg = style.get('backgroundImage', '') or ''
    bgc = style.get('backgroundColor', '') or ''
    if expected_fragment:
        require(expected_fragment in bg, label, style)
    else:
        # Reject the old blue-gray family that was visible in the affected screens.
        old_blue = (
            'rgb(31, 42, 58)', 'rgb(30, 40, 54)', 'rgb(24, 48, 58)',
            'rgb(17, 29, 34)', 'rgb(77, 112, 132)', 'rgb(68, 68, 68)',
            'rgb(51, 51, 51)'
        )
        require(not any(token in bg or token == bgc for token in old_blue), label, style)


# Static ownership checks: state/decoration must be represented by semantic classes,
# not by the legacy inline blue/gray values that the CSS then has to override.
menus = (ROOT / 'menus.js').read_text(encoding='utf-8')
items = (ROOT / 'menus_items.js').read_text(encoding='utf-8')
save_slots = (ROOT / 'save_slots.js').read_text(encoding='utf-8')
save_backup = (ROOT / 'save_backup.js').read_text(encoding='utf-8')
base_css = (ROOT / 'modern-polish-base.css').read_text(encoding='utf-8')
items_css = (ROOT / 'modern-polish-items.css').read_text(encoding='utf-8')
save_css = (ROOT / 'modern-polish-config-save.css').read_text(encoding='utf-8')
final_css = (ROOT / 'modern-polish-final.css').read_text(encoding='utf-8')

sky_start = menus.find('skyPrismChoice:')
sky_end = menus.find('\n    listChoice:', sky_start)
sky_block = menus[sky_start: sky_end if sky_end >= 0 else len(menus)]
require(sky_start >= 0, 'skyPrismChoice block exists')
require('sky-prism-button' in sky_block, 'Sky Prism semantic button class present')
require('opts.background' not in sky_block, 'Sky Prism block no inline background ownership')
require("background: '#444'" not in sky_block and "background:'#444'" not in sky_block,
        'Sky Prism block no legacy gray cancel background')
require("background: '#333'" not in items and "background:'#333'" not in items,
        'Sky Prism unavailable destination no legacy gray data color')
require('item-target-summary' in items and 'item-target-row' in items,
        'Item target semantic classes present')
require('save-ui-button' in save_slots and 'save-ui-card' in save_slots,
        'Save/load semantic UI classes present')
require('save-ui-button' in save_backup and 'save-data-action' in save_backup,
        'Backup semantic UI classes present')
require(':not(:where(.menu-action-button, .save-ui-button, .sky-prism-button))' in base_css,
        'Global legacy button skin excludes semantic brown controls without specificity growth')

item_new = items_css[items_css.find('Item use target picker'):]
sky_new = final_css[final_css.find('Sky Prism dialog'):]
save_new_start = save_css.find('.save-slot-overlay {')
save_new_end = save_css.find('/* Config radio state', save_new_start)
save_new = save_css[save_new_start: save_new_end if save_new_end >= 0 else len(save_css)]
require('!important' not in item_new, 'Item target component adds no !important')
require('!important' not in sky_new, 'Sky Prism brown component adds no !important')
require('!important' not in save_new, 'Save/load/data brown component adds no !important')

important_count = sum((ROOT / name).read_text(encoding='utf-8').count('!important') for name in SPLIT_POLISH_FILES)
require(important_count <= 1170, 'Split modern-polish !important count did not increase', important_count)
require((ROOT / 'modern-polish-items.css').read_text(encoding='utf-8').count('!important') == 0,
        'Items CSS remains !important-free')

# Static check that the old blue/gray palette no longer owns the save/load/data surfaces.
legacy_save_colors = [
    '#043f46', '#4d7084', '#18303a', '#111d22', '#242424', '#292929',
    '#282828', '#262626', '#202020', '#171717', '#151515', '#0c0c0c',
    '#505050', '#555', '#444', '#333'
]
for color in legacy_save_colors:
    require(color.lower() not in save_css.lower(), f'Old save gray/blue literal removed: {color}')

GAME_HTML = r'''<!doctype html><html><head><meta charset="utf-8"></head><body class="game-page">
<div id="game-container">
  <div class="sub-screen" id="sub-screen-items" style="display:flex;width:460px;height:760px;">
    <div id="item-screen-target" class="flex-col-container">
      <div id="list-item-targets" class="scroll-area">
        <div id="item-summary" class="item-target-summary">使用中: やくそう</div>
        <div id="item-row" class="list-item item-target-row">
          <div id="item-thumb" class="char-thumb"><img alt=""></div><div>ユウゾラ</div>
        </div>
      </div>
    </div>
  </div>

  <div id="menu-dialog-area" class="menu-dialog-overlay is-sky-prism" style="display:flex;">
    <div id="sky-shell" class="menu-dialog-shell">
      <div id="sky-body" class="menu-dialog-body">スカイプリズム：移動先を選択</div>
      <div id="menu-dialog-buttons" class="menu-dialog-footer is-list is-sky-prism-list">
        <button id="sky-destination" class="btn sky-prism-button sky-prism-button--destination">リュミナ村</button>
        <button id="sky-unavailable" class="btn sky-prism-button sky-prism-button--unavailable is-unavailable" disabled>？？？</button>
        <div class="sky-prism-nav"><button id="sky-nav" class="btn sky-prism-button sky-prism-button--nav">◀</button></div>
        <button id="sky-cancel" class="btn sky-prism-button sky-prism-button--secondary">キャンセル</button>
        <div class="sky-prism-confirm-panel"><div class="sky-prism-confirm-message">移動しますか？</div><div class="sky-prism-confirm-actions"><button id="sky-confirm" class="btn sky-prism-button sky-prism-button--confirm">はい</button></div></div>
      </div>
    </div>
  </div>

  <div id="save-game" class="save-slot-overlay is-game" style="position:absolute; width:460px; height:760px;">
    <div id="save-dialog" class="save-slot-dialog">
      <div id="save-header" class="save-slot-header"><div class="save-slot-title">セーブ</div><button id="save-back" class="btn save-ui-button save-slot-close">もどる</button></div>
      <div class="save-slot-list">
        <button id="save-card" class="save-slot-card save-ui-card"><span>通常セーブ</span></button>
        <button id="save-auto" class="save-slot-card save-ui-card is-auto"><span>オートセーブ</span></button>
      </div>
      <div class="save-slot-footer"><button id="save-footer-back" class="btn save-ui-button sub-screen-back-btn">もどる</button></div>
    </div>
  </div>

  <div id="data-game" class="save-slot-overlay save-data-overlay is-game" style="position:absolute; width:460px; height:760px;">
    <div id="data-dialog" class="save-slot-dialog save-data-dialog">
      <div class="save-slot-header"><div class="save-slot-title">データ出力</div><button id="data-back" class="btn save-ui-button">もどる</button></div>
      <div class="save-data-body">
        <button id="data-action" class="btn save-ui-button save-data-action"><span class="save-data-action-title">オートセーブ出力</span></button>
        <button id="data-disabled" class="btn save-ui-button save-data-action save-data-google-unavailable" disabled><span class="save-data-action-title">Googleドライブへ出力</span></button>
      </div>
    </div>
  </div>
</div>
</body></html>'''

TITLE_HTML = r'''<!doctype html><html><head><meta charset="utf-8"></head><body class="title-page">
<div id="save-title" class="save-slot-overlay is-title">
  <div id="title-save-dialog" class="save-slot-dialog">
    <div class="save-slot-header"><div class="save-slot-title">ロード</div><button id="title-save-back" class="btn save-ui-button save-slot-close">もどる</button></div>
    <div class="save-slot-list"><button id="title-save-card" class="save-slot-card save-ui-card is-auto">Auto</button></div>
  </div>
</div>
</body></html>'''


def read_style(page, selector):
    return page.eval_on_selector(selector, '''el => { const c = getComputedStyle(el); return {
      backgroundImage:c.backgroundImage, backgroundColor:c.backgroundColor,
      borderTopColor:c.borderTopColor, borderTopWidth:c.borderTopWidth,
      color:c.color, boxShadow:c.boxShadow, opacity:c.opacity
    }; }''')


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1200, 'height': 900})
    page.set_content(GAME_HTML)
    page.add_style_tag(content=css)
    page.wait_for_timeout(100)

    item_thumb = read_style(page, '#item-thumb')
    item_row = read_style(page, '#item-row')
    item_summary = read_style(page, '#item-summary')
    require(item_thumb['backgroundColor'] == 'rgb(33, 19, 10)', 'Item target portrait background is brown', item_thumb)
    require(item_thumb['borderTopColor'] not in ('rgb(102, 102, 102)', 'rgb(68, 68, 68)'), 'Item target portrait border is not gray', item_thumb)
    require(item_row['backgroundColor'] in ('rgb(19, 9, 5)', 'rgba(19, 9, 5, 1)'), 'Item target row belongs to brown page surface', item_row)
    assert_brown_background('Item target summary is brown', item_summary, 'rgb(41, 23, 12)')

    sky_shell = read_style(page, '#sky-shell')
    sky_body = read_style(page, '#sky-body')
    sky_destination = read_style(page, '#sky-destination')
    sky_nav = read_style(page, '#sky-nav')
    sky_cancel = read_style(page, '#sky-cancel')
    sky_confirm = read_style(page, '#sky-confirm')
    sky_unavailable = read_style(page, '#sky-unavailable')
    assert_brown_background('Sky Prism shell is brown', sky_shell, 'rgb(45, 26, 13)')
    assert_brown_background('Sky Prism header/body is brown', sky_body, 'rgb(51, 32, 20)')
    assert_brown_background('Sky Prism destination button is brown', sky_destination, 'rgb(103, 64, 31)')
    assert_brown_background('Sky Prism navigation button is brown', sky_nav, 'rgb(67, 40, 19)')
    assert_brown_background('Sky Prism cancel button is brown', sky_cancel, 'rgb(67, 40, 19)')
    assert_brown_background('Sky Prism confirm button is brown', sky_confirm, 'rgb(114, 80, 44)')
    assert_brown_background('Sky Prism disabled button is muted brown', sky_unavailable, 'rgb(42, 26, 16)')
    require(sky_destination['borderTopWidth'] != '0px' and sky_destination['boxShadow'] != 'none',
            'Sky Prism destination remains visibly button-like', sky_destination)

    save_dialog = read_style(page, '#save-dialog')
    save_header = read_style(page, '#save-header')
    save_back = read_style(page, '#save-back')
    save_card = read_style(page, '#save-card')
    save_auto = read_style(page, '#save-auto')
    data_action = read_style(page, '#data-action')
    data_disabled = read_style(page, '#data-disabled')
    data_back = read_style(page, '#data-back')

    assert_brown_background('Save dialog is brown', save_dialog, 'rgb(37, 21, 11)')
    assert_brown_background('Save header is brown', save_header, 'rgb(101, 64, 31)')
    assert_brown_background('Save back button is brown', save_back, 'rgb(95, 58, 28)')
    assert_brown_background('Normal save card is brown', save_card, 'rgb(56, 34, 20)')
    assert_brown_background('Auto save card is brown', save_auto, 'rgb(67, 42, 22)')
    assert_brown_background('Data action is brown', data_action, 'rgb(89, 55, 29)')
    assert_brown_background('Data back button is brown', data_back, 'rgb(95, 58, 28)')
    assert_brown_background('Disabled data action is muted brown', data_disabled, 'rgb(40, 24, 16)')
    require(save_auto['borderTopColor'] != 'rgb(77, 112, 132)', 'Autosave emphasis no longer uses blue border', save_auto)
    require(data_disabled['opacity'] != '1', 'Disabled data action remains visibly disabled', data_disabled)

    # Title-page load dialog must also retain brown semantic button/card styles despite title CSS.
    title_page = browser.new_page(viewport={'width': 800, 'height': 800})
    title_page.set_content(TITLE_HTML)
    title_page.add_style_tag(content=css)
    title_page.wait_for_timeout(100)
    title_back = read_style(title_page, '#title-save-back')
    title_card = read_style(title_page, '#title-save-card')
    title_dialog = read_style(title_page, '#title-save-dialog')
    assert_brown_background('Title load dialog is brown', title_dialog, 'rgb(37, 21, 11)')
    assert_brown_background('Title load back button is brown', title_back, 'rgb(95, 58, 28)')
    assert_brown_background('Title autosave card is brown', title_card, 'rgb(67, 42, 22)')

    print('item-thumb:', item_thumb)
    print('sky-destination:', sky_destination)
    print('sky-nav:', sky_nav)
    print('save-dialog:', save_dialog)
    print('save-back:', save_back)
    print('save-card:', save_card)
    print('save-auto:', save_auto)
    print('data-action:', data_action)
    print('data-disabled:', data_disabled)
    print('title-save-back:', title_back)
    browser.close()

if failures:
    for label, value in failures:
        print('FAIL', label, value)
    raise SystemExit(1)

print(f'Phase 9 brown dialog validation OK (!important count: {important_count})')
