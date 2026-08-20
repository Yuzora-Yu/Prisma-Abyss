#!/usr/bin/env python3
from pathlib import Path
from playwright.sync_api import sync_playwright

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
css = '\n'.join(__import__('re').sub(r'@import\s+url\([^;]+;\s*', '', (ROOT / f).read_text(encoding='utf-8')) for f in CSS_FILES)

html = r'''<!doctype html><html><head><meta charset="utf-8"></head><body class="game-page">
<div class="sub-screen" id="sub-screen-allies">
  <div class="header-bar"><span>仲間一覧</span><button id="header-back" class="btn">もどる</button></div>
  <div id="allies-detail-content"><div class="scroll-container-inner">
    <div class="menu-tab-rail">
      <button id="tab-on" class="menu-tab-button is-active" aria-selected="true">基本</button>
      <button id="tab-off" class="menu-tab-button" aria-selected="false">装備</button>
    </div>
    <button id="ally-action" class="btn menu-action-button menu-action-button--classic">スキル習得画面へ</button>
    <div id="skill-list-container">
      <div id="skill-card" class="ally-skill-card"><button id="skill-on" class="menu-state-button skill-usage-toggle is-enabled">ON</button></div>
      <div id="skill-card-hidden" class="ally-skill-card is-hidden"><button id="skill-off" class="menu-state-button skill-usage-toggle is-disabled">OFF</button></div>
    </div>
    <div id="trait-on" class="ally-trait-card is-equipment"></div>
    <div id="trait-off" class="ally-trait-card"></div>
    <div id="trait-fixed-eq" class="ally-trait-fixed-badge is-equipment"></div>
    <div id="trait-fixed-lock" class="ally-trait-fixed-badge is-locked"></div>
    <button id="trait-toggle-on" class="menu-state-button ally-trait-toggle is-on"></button>
    <button id="trait-toggle-off" class="menu-state-button ally-trait-toggle is-off"></button>
  </div></div>
</div>
<div class="sub-screen" id="sub-screen-party">
  <div id="party-screen-window">
    <div id="party-screen-tabs">
      <button id="party-tab-on" class="active is-active" aria-selected="true">仲間</button>
      <button id="party-tab-off" aria-selected="false">さくせん</button>
    </div>
    <div class="scroll-area">
      <div id="party-card" class="list-item">party card</div>
    </div>
    <button id="choice-on" class="menu-state-button menu-choice-button is-active"></button>
    <button id="choice-off" class="menu-state-button menu-choice-button"></button>
  </div>
</div>
<div class="sub-screen" id="sub-screen-inventory">
  <div id="inventory-controls"><div class="menu-filter-rail">
    <button id="filter-on" class="menu-filter-button is-active"></button>
    <button id="filter-off" class="menu-filter-button"></button>
  </div></div>
  <button id="sell-on" class="menu-state-button inventory-sell-selected-button has-selection"></button>
  <button id="sell-off" class="menu-state-button inventory-sell-selected-button is-empty"></button>
</div>
<div class="sub-screen" id="sub-screen-achievements">
  <div class="achievement-overview">
    <div class="achievement-summary">
      <div id="achievement-rate-card" class="achievement-rate-card"></div>
      <div class="achievement-summary-grid">
        <div id="achievement-summary-card" class="achievement-summary-card"></div>
      </div>
    </div>
    <button id="claim-on" class="menu-state-button achievement-claim-all-button has-claim"></button>
    <button id="claim-off" class="menu-state-button achievement-claim-all-button is-empty" disabled></button>
  </div>
  <div class="achievement-controls">
    <div id="achievement-filter-rail" class="menu-filter-rail achievement-filter-rail">
      <button id="ach-filter-on" class="menu-filter-button is-active">全て</button>
      <button id="ach-filter-off" class="menu-filter-button">未達成</button>
    </div>
    <div class="achievement-category-row"><label>カテゴリ</label><select id="achievement-select"><option>カテゴリ全て</option></select></div>
  </div>
  <div class="scroll-area achievement-list">
    <div id="ach-on" class="achievement-entry is-completed"></div>
    <div id="ach-off" class="achievement-entry is-incomplete"></div>
  </div>
</div>
<div class="sub-screen" id="sub-screen-blacksmith">
  <div id="smith-on" class="smith-material-item is-selected"></div>
  <div id="smith-off" class="smith-material-item"></div>
  <button id="smith-ready" class="menu-state-button smith-material-confirm is-ready"></button>
  <button id="smith-no" class="menu-state-button smith-material-confirm is-unavailable" disabled></button>
  <button id="enhance-ready" class="menu-state-button smith-enhance-confirm is-ready"></button>
</div>
<div class="sub-screen" id="sub-screen-status">
  <button id="guild-on" class="menu-state-button guild-travel-button is-available"></button>
  <button id="guild-off" class="menu-state-button guild-travel-button is-unavailable" disabled></button>
</div>
<div class="sub-screen" id="sub-screen-exchange">
  <button id="reward-on" class="menu-state-button daily-reward-button is-available"></button>
  <button id="reward-off" class="menu-state-button daily-reward-button is-claimed" disabled></button>
</div>
<div class="sub-screen" id="sub-screen-config">
  <div id="config-tab-test" class="config-tab-bar">
    <button id="config-tab-on" class="config-tab-button is-active" aria-selected="true">セーブ</button>
    <button id="config-tab-off" class="config-tab-button" aria-selected="false">設定</button>
  </div>
  <label id="config-on" class="config-radio-row is-selected"></label>
  <label id="config-off" class="config-radio-row"></label>
</div>
<div class="sub-screen" id="sub-screen-items">
  <div id="item-tabs" class="item-tab-bar">
    <button id="item-tab-on" class="item-tab-btn active" aria-selected="true">道具</button>
    <button id="item-tab-off" class="item-tab-btn" aria-selected="false">育成</button>
  </div>
</div>
</body></html>'''

pairs = [
    ('ally tab', '#tab-on', '#tab-off', ['backgroundImage', 'color']),
    ('party tab', '#party-tab-on', '#party-tab-off', ['backgroundImage', 'color']),
    ('filter', '#filter-on', '#filter-off', ['backgroundImage', 'color']),
    ('party strategy', '#choice-on', '#choice-off', ['backgroundImage', 'borderColor']),
    ('skill usage', '#skill-on', '#skill-off', ['backgroundImage', 'color']),
    ('trait toggle', '#trait-toggle-on', '#trait-toggle-off', ['backgroundImage', 'color']),
    ('trait equipment card', '#trait-on', '#trait-off', ['borderColor']),
    ('trait fixed badge', '#trait-fixed-eq', '#trait-fixed-lock', ['borderColor', 'color']),
    ('inventory selection', '#sell-on', '#sell-off', ['backgroundImage', 'borderColor']),
    ('achievement completion', '#ach-on', '#ach-off', ['borderLeftColor']),
    ('achievement claim', '#claim-on', '#claim-off', ['backgroundImage', 'borderColor']),
    ('smith material selection', '#smith-on', '#smith-off', ['backgroundColor', 'borderColor']),
    ('smith material confirm', '#smith-ready', '#smith-no', ['backgroundImage', 'borderColor']),
    ('guild travel', '#guild-on', '#guild-off', ['backgroundImage', 'borderColor']),
    ('daily reward', '#reward-on', '#reward-off', ['backgroundImage', 'color']),
    ('config radio', '#config-on', '#config-off', ['backgroundImage', 'borderColor']),
    ('config tab', '#config-tab-on', '#config-tab-off', ['backgroundImage', 'color']),
    ('item tab', '#item-tab-on', '#item-tab-off', ['backgroundImage', 'color']),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page = browser.new_page()
    page.set_content(html)
    page.add_style_tag(content=css)
    failures = []
    for label, left, right, props in pairs:
        vals = page.eval_on_selector_all(f'{left}, {right}', '''(els, props) => els.map(el => {
          const cs = getComputedStyle(el); const out = {}; for (const p of props) out[p] = cs[p]; return out;
        })''', props)
        if len(vals) != 2 or not any(vals[0][prop] != vals[1][prop] for prop in props):
            failures.append((label, vals))
        else:
            print(f'OK {label}: {vals[0]} != {vals[1]}')
    expected = {
        '#skill-on': {
            'backgroundImageContains': 'rgb(255, 210, 23)',
            'color': 'rgb(22, 12, 4)',
        },
        '#skill-off': {
            'backgroundImageContains': 'rgb(59, 59, 59)',
            'color': 'rgb(197, 197, 197)',
        },
        '#trait-toggle-on': {
            'backgroundImageContains': 'rgb(255, 210, 23)',
            'color': 'rgb(22, 12, 4)',
        },
        '#trait-toggle-off': {
            'backgroundImageContains': 'rgb(59, 59, 59)',
            'color': 'rgb(197, 197, 197)',
        },
        '#header-back': {
            'backgroundImageContains': 'rgb(104, 65, 31)',
            'color': 'rgb(248, 229, 191)',
        },
        '#ally-action': {
            'backgroundImageContains': 'rgb(108, 67, 31)',
            'color': 'rgb(248, 230, 194)',
        },
        '#skill-card': {
            'backgroundImageContains': 'rgb(50, 29, 16)',
            'color': 'rgb(245, 223, 184)',
        },
    }
    for selector, want in expected.items():
        got = page.eval_on_selector(selector, '''el => { const cs = getComputedStyle(el); return {backgroundImage: cs.backgroundImage, color: cs.color}; }''')
        if want['backgroundImageContains'] not in got['backgroundImage'] or want['color'] != got['color']:
            failures.append((f'exact style {selector}', [got, want]))
        else:
            print(f"OK exact style {selector}: {got}")
    action_border = page.eval_on_selector('#ally-action', '''el => { const cs = getComputedStyle(el); return {width: cs.borderTopWidth, color: cs.borderTopColor}; }''')
    if action_border['width'] == '0px' or action_border['color'] in ('rgba(0, 0, 0, 0)', 'transparent'):
        failures.append(('ally action visible border', [action_border]))
    else:
        print(f"OK ally action visible border: {action_border}")
    rail_border = page.eval_on_selector('.menu-tab-rail', '''el => getComputedStyle(el).borderTopColor''')
    if rail_border in ('rgba(0, 0, 0, 0)', 'transparent'):
        failures.append(('tab rail subtle border', [rail_border]))
    else:
        print(f"OK tab rail subtle border: {rail_border}")

    page_surface_selectors = [
        '#sub-screen-allies',
        '#sub-screen-status',
        '#sub-screen-config',
        '#sub-screen-items',
        '#party-screen-window',
        '.menu-tab-rail',
        '#party-screen-tabs',
        '#config-tab-test',
        '#item-tabs',
    ]
    for selector in page_surface_selectors:
        got = page.eval_on_selector(selector, '''el => {
          const cs = getComputedStyle(el);
          return { backgroundColor: cs.backgroundColor, backgroundImage: cs.backgroundImage };
        }''')
        if got['backgroundColor'] != 'rgb(19, 9, 5)' or got['backgroundImage'] != 'none':
            failures.append((f'page-side tab surface {selector}', [got]))
        else:
            print(f"OK page-side tab surface {selector}: {got}")

    brown_surface_checks = {
        '#party-screen-window .scroll-area': 'rgb(19, 9, 5)',
        '#sub-screen-achievements > .achievement-overview': 'rgb(19, 9, 5)',
        '#sub-screen-achievements > .achievement-controls': 'rgb(19, 9, 5)',
        '#sub-screen-achievements > .achievement-list': 'rgb(19, 9, 5)',
    }
    for selector, expected_bg in brown_surface_checks.items():
        got = page.eval_on_selector(selector, '''el => {
          const cs = getComputedStyle(el);
          return { backgroundColor: cs.backgroundColor, backgroundImage: cs.backgroundImage };
        }''')
        if got['backgroundColor'] != expected_bg or got['backgroundImage'] != 'none':
            failures.append((f'brown page surface {selector}', [got, expected_bg]))
        else:
            print(f"OK brown page surface {selector}: {got}")

    party_card = page.eval_on_selector('#party-card', '''el => {
      const cs = getComputedStyle(el);
      return { backgroundImage: cs.backgroundImage, borderColor: cs.borderTopColor };
    }''')
    if '43, 24, 13' not in party_card['backgroundImage'] or party_card['borderColor'] == 'rgba(0, 0, 0, 0)':
        failures.append(('party card muted brown surface', [party_card]))
    else:
        print(f"OK party card muted brown surface: {party_card}")

    achievement_rate = page.eval_on_selector('#achievement-rate-card', '''el => {
      const cs = getComputedStyle(el);
      return { backgroundImage: cs.backgroundImage, borderColor: cs.borderTopColor };
    }''')
    if '48, 28, 14' not in achievement_rate['backgroundImage']:
        failures.append(('achievement rate card brown surface', [achievement_rate]))
    else:
        print(f"OK achievement rate card brown surface: {achievement_rate}")

    achievement_select = page.eval_on_selector('#achievement-select', '''el => {
      const cs = getComputedStyle(el);
      return { backgroundImage: cs.backgroundImage, color: cs.color };
    }''')
    if '43, 26, 15' not in achievement_select['backgroundImage']:
        failures.append(('achievement select brown surface', [achievement_select]))
    else:
        print(f"OK achievement select brown surface: {achievement_select}")

    filter_rail = page.eval_on_selector('#achievement-filter-rail', '''el => {
      const cs = getComputedStyle(el);
      return { gap: cs.gap, padding: cs.padding, overflow: cs.overflow, borderRadius: cs.borderRadius };
    }''')
    if filter_rail['gap'] != '0px' or filter_rail['padding'] != '0px':
        failures.append(('achievement segmented filter rail', [filter_rail]))
    else:
        print(f"OK achievement segmented filter rail: {filter_rail}")

    browser.close()

if failures:
    for label, vals in failures:
        print(f'FAIL {label}: {vals}')
    raise SystemExit(1)
print(f'Cascade state validation OK: {len(pairs)} state pairs are visually distinct')
