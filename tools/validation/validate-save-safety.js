const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const allies = fs.readFileSync(path.join(root, 'menus_allies.js'), 'utf8');
const title = fs.readFileSync(path.join(root, 'main.html'), 'utf8');
const saveSlots = fs.readFileSync(path.join(root, 'save_slots.js'), 'utf8');
const saveBackup = fs.readFileSync(path.join(root, 'save_backup.js'), 'utf8');
const configMenu = fs.readFileSync(path.join(root, 'menus_config.js'), 'utf8');

const assert = (condition, message) => {
    if (!condition) throw new Error(message);
};

assert(main.includes("if (key === 'image' && typeof value === 'string' && this && this.img === value) return undefined"),
    'Duplicate character image Data URLs are not removed from the serialized save.');
assert(main.includes('localStorage.setItem(CONST.SAVE_KEY, App.serializeSaveData(App.data))'),
    'App.save does not use the duplicate-safe serializer.');
assert(main.includes('App.showMessage(') && main.includes('セーブデータを保存できませんでした。') && main.includes('return saved;'),
    'Save failures are not propagated and shown to the player.');
assert(!main.includes('btn.innerHTML = `続きから<br><span style="font-size:12px">(${name}'),
    'The title continue button still injects an imported player name through innerHTML.');
assert(title.includes('id="btn-auto-continue"') && title.includes('id="btn-slot-continue"'),
    'The static title routes for auto-save and slot selection are missing.');
assert(saveSlots.includes('escapeHtml: (value)') && saveSlots.includes('SaveSlotUI.escapeHtml(heroLabel)'),
    'Imported player names are not escaped before the save-slot list renders them.');
assert(saveSlots.includes('const MANUAL_SLOT_MAX = 20;'),
    'Manual save slot count is not 20.');
assert(saveSlots.includes('assertEstimatedCapacity') && saveSlots.includes("error?.name === 'QuotaExceededError'")
    && saveSlots.includes('replaceManualSlotRecords'),
    '20-slot storage diagnostics or atomic replacement support is missing.');
assert(saveBackup.includes("const ALL_BACKUP_TYPE = 'PRISMA_ABYSS_ALL_SAVE_DATA'")
    && saveBackup.includes('validateAllSaveBundle')
    && saveBackup.includes('replaceAllSaveData')
    && saveBackup.includes('await slots.replaceManualSlotRecords(previousManual)'),
    'All-save backup validation or rollback support is missing.');
assert(saveBackup.includes("const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file'")
    && !saveBackup.includes('https://www.googleapis.com/auth/drive.readonly')
    && !saveBackup.includes("scope: 'email")
    && saveBackup.includes("meta[name=\"google-drive-client-id\"]"),
    'Google Drive backup does not use the intended narrow, configurable authorization scope.');
assert(configMenu.includes("MenuConfig.openDataModal('export')")
    && configMenu.includes("MenuConfig.openDataModal('import')"),
    'Data export/import actions do not open the new choice modals.');
assert(!allies.includes('header.innerHTML = `<div class="allies-tree-header-main"><span>${c.name}'),
    'The ally skill-tree header still injects an imported character name through innerHTML.');
assert(allies.includes('headerLabel.textContent = `${c.name} (SP:${sp})`'),
    'The ally skill-tree header does not use a text node for the imported character name.');
assert(main.includes('sanitizeCharacterName: (value, fallback = \'冒険者\', maxLength = 10)')
    && main.includes('char.name = App.sanitizeCharacterName(char.name')
    && allies.includes('${App.escapeHtml(c.name)}'),
    'Editable/imported ally names are not sanitized and escaped before rendering.');

const source = { img: 'data:image/png;base64,AAAA', image: 'data:image/png;base64,AAAA', name: '勇者' };
const serialized = JSON.stringify(source, function(key, value) {
    if (key === 'image' && typeof value === 'string' && this && this.img === value) return undefined;
    return value;
});
const parsed = JSON.parse(serialized);
assert(parsed.img === source.img && parsed.image === undefined && parsed.name === source.name,
    'Duplicate-safe serialization does not preserve the canonical img field.');

console.log('PASS: 20 manual slots, atomic all-save backup/restore, narrow Google Drive authorization, and safe editable names are present.');
