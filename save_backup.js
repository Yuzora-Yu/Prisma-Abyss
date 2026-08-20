/* save_backup.js - 全セーブ一括入出力 / Google Drive連携 / データ管理モーダル */
(function(global) {
    'use strict';

    const ALL_BACKUP_TYPE = 'PRISMA_ABYSS_ALL_SAVE_DATA';
    const ALL_BACKUP_VERSION = 1;
    const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
    const GOOGLE_DRIVE_FOLDER_NAME = 'Prisma Abyss Backups';
    const GOOGLE_DRIVE_FOLDER_MARKER = 'prisma-abyss-backup-folder-v1';
    const GOOGLE_DRIVE_FILE_MARKER = 'prisma-abyss-all-saves-v1';
    const GOOGLE_IDENTITY_SCRIPT = 'https://accounts.google.com/gsi/client';
    const GOOGLE_DRIVE_API = 'https://www.googleapis.com/drive/v3';
    const GOOGLE_DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';

    const getApp = () => (typeof App !== 'undefined' ? App : global.App);
    const getSaveSlots = () => (typeof SaveSlots !== 'undefined' ? SaveSlots : global.SaveSlots);
    const getSaveCrypto = () => (typeof SaveCrypto !== 'undefined' ? SaveCrypto : global.SaveCrypto);
    const getConst = () => (typeof CONST !== 'undefined' ? CONST : global.CONST);
    const clone = value => JSON.parse(JSON.stringify(value));
    const isGamePage = () => !!global.document?.body?.classList?.contains('game-page');

    const SaveBackup = {
        ALL_BACKUP_TYPE,
        ALL_BACKUP_VERSION,

        assertDependencies: () => {
            if (!getSaveSlots()) throw new Error('セーブスロット機能を読み込めませんでした。');
            if (!getSaveCrypto()?.encodeSaveData || !getSaveCrypto()?.decodeSaveText) {
                throw new Error('暗号化セーブ機能を読み込めませんでした。');
            }
        },

        updateCurrentAutoSave: () => {
            const app = getApp();
            if (!isGamePage() || !app?.data || typeof app.save !== 'function') return true;
            if (!app.save()) throw new Error('現在のオートセーブを更新できなかったため、データ出力を中止しました。');
            return true;
        },

        normalizeRecord: async (record) => {
            const slots = getSaveSlots();
            const slotId = slots.normalizeManualSlotId(record?.slotId);
            const payload = String(record?.payload || '');
            if (!payload) throw new Error(`セーブNo.${slotId}の内容がありません。`);
            if (!(await slots.verifyChecksum(payload, record?.checksum))) {
                throw new Error(`セーブNo.${slotId}の完全性を確認できません。`);
            }
            const data = slots.parsePayload(payload);
            const updatedAt = record?.updatedAt || data?.system?.lastSavedAt || new Date().toISOString();
            return {
                slotId,
                schemaVersion: Number(record?.schemaVersion || slots.RECORD_SCHEMA_VERSION),
                updatedAt,
                metadata: slots.buildMetadata(data, {
                    updatedAt,
                    payloadBytes: slots.bytesOf(payload)
                }),
                payload,
                checksum: String(record.checksum)
            };
        },

        buildAllSaveBundle: async () => {
            SaveBackup.assertDependencies();
            SaveBackup.updateCurrentAutoSave();
            const slots = getSaveSlots();
            const auto = slots.getAutoSlot();
            if (auto?.corrupt) throw new Error('オートセーブが破損しているため、全セーブデータを出力できません。');

            const rawManualRecords = await slots.listManualSlotRecords();
            const manualSlots = [];
            for (const record of rawManualRecords) manualSlots.push(await SaveBackup.normalizeRecord(record));

            let autoSlot = null;
            if (auto?.payload) {
                const checksum = await slots.computeChecksum(auto.payload);
                if (!(await slots.verifyChecksum(auto.payload, checksum))) {
                    throw new Error('オートセーブの完全性を確認できません。');
                }
                autoSlot = {
                    updatedAt: auto.updatedAt || auto.data?.system?.lastSavedAt || null,
                    metadata: slots.buildMetadata(auto.data, {
                        updatedAt: auto.updatedAt || null,
                        payloadBytes: slots.bytesOf(auto.payload)
                    }),
                    payload: auto.payload,
                    checksum
                };
            }

            if (!autoSlot && manualSlots.length === 0) throw new Error('出力できるセーブデータがありません。');
            return {
                backupType: ALL_BACKUP_TYPE,
                backupVersion: ALL_BACKUP_VERSION,
                app: 'PRISMA ABYSS',
                createdAt: new Date().toISOString(),
                manualSlotLimit: slots.MANUAL_SLOT_MAX,
                autoSlot,
                manualSlots
            };
        },

        validateAllSaveBundle: async (rawBundle) => {
            SaveBackup.assertDependencies();
            if (!rawBundle || typeof rawBundle !== 'object' || Array.isArray(rawBundle)) {
                throw new Error('全セーブデータの形式が不正です。');
            }
            if (rawBundle.backupType !== ALL_BACKUP_TYPE) {
                throw new Error('全セーブデータのバックアップファイルではありません。');
            }
            if (Number(rawBundle.backupVersion) !== ALL_BACKUP_VERSION) {
                throw new Error('未対応の全セーブデータ形式です。');
            }

            const slots = getSaveSlots();
            let autoSlot = null;
            if (rawBundle.autoSlot) {
                const payload = String(rawBundle.autoSlot.payload || '');
                if (!payload || !(await slots.verifyChecksum(payload, rawBundle.autoSlot.checksum))) {
                    throw new Error('オートセーブの完全性を確認できません。');
                }
                const data = slots.parsePayload(payload);
                autoSlot = {
                    updatedAt: rawBundle.autoSlot.updatedAt || data?.system?.lastSavedAt || null,
                    metadata: slots.buildMetadata(data, {
                        updatedAt: rawBundle.autoSlot.updatedAt || null,
                        payloadBytes: slots.bytesOf(payload)
                    }),
                    payload,
                    checksum: String(rawBundle.autoSlot.checksum)
                };
            }

            if (!Array.isArray(rawBundle.manualSlots)) throw new Error('手動セーブ一覧がありません。');
            const manualSlots = [];
            const usedIds = new Set();
            for (const rawRecord of rawBundle.manualSlots) {
                const record = await SaveBackup.normalizeRecord(rawRecord);
                if (usedIds.has(record.slotId)) throw new Error(`セーブNo.${record.slotId}が重複しています。`);
                usedIds.add(record.slotId);
                manualSlots.push(record);
            }
            manualSlots.sort((left, right) => left.slotId - right.slotId);
            if (!autoSlot && manualSlots.length === 0) throw new Error('バックアップにセーブデータがありません。');

            return {
                backupType: ALL_BACKUP_TYPE,
                backupVersion: ALL_BACKUP_VERSION,
                app: 'PRISMA ABYSS',
                createdAt: rawBundle.createdAt || null,
                manualSlotLimit: slots.MANUAL_SLOT_MAX,
                autoSlot,
                manualSlots
            };
        },

        encodeAllSaveBundle: async () => {
            const bundle = await SaveBackup.buildAllSaveBundle();
            return getSaveCrypto().encodeSaveData(bundle);
        },

        decodeAllSaveText: async (text) => {
            SaveBackup.assertDependencies();
            const decoded = await getSaveCrypto().decodeSaveText(text);
            return SaveBackup.validateAllSaveBundle(decoded.data);
        },

        replaceAllSaveData: async (rawBundle) => {
            const bundle = await SaveBackup.validateAllSaveBundle(rawBundle);
            const slots = getSaveSlots();
            const saveKey = getConst()?.SAVE_KEY;
            let storage;
            try { storage = global.localStorage; } catch (error) { storage = null; }
            if (!saveKey || !storage) throw new Error('オートセーブ領域を利用できません。');

            const previousManual = await slots.listManualSlotRecords();
            const previousAutoPayload = storage.getItem(saveKey);
            try {
                await slots.replaceManualSlotRecords(bundle.manualSlots);
                if (bundle.autoSlot?.payload) {
                    storage.setItem(saveKey, bundle.autoSlot.payload);
                    if (storage.getItem(saveKey) !== bundle.autoSlot.payload) {
                        throw new Error('オートセーブの書込確認に失敗しました。');
                    }
                    slots.parsePayload(storage.getItem(saveKey));
                } else {
                    storage.removeItem(saveKey);
                }
            } catch (error) {
                try {
                    await slots.replaceManualSlotRecords(previousManual);
                    if (previousAutoPayload === null) storage.removeItem(saveKey);
                    else storage.setItem(saveKey, previousAutoPayload);
                } catch (rollbackError) {
                    console.error('[SAVE BACKUP] 一括読込失敗後の復元にも失敗しました。', rollbackError);
                    const wrapped = new Error('全セーブデータの読込に失敗し、読込前の状態も完全には復元できませんでした。ゲームを閉じずに現在の状態を確認してください。');
                    wrapped.cause = error;
                    throw wrapped;
                }
                throw error;
            }
            return bundle;
        },

        downloadText: (text, fileName) => {
            const blob = new Blob([text], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = fileName;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            setTimeout(() => URL.revokeObjectURL(url), 0);
        },

        exportAllToFile: async () => {
            const text = await SaveBackup.encodeAllSaveBundle();
            const crypto = getSaveCrypto();
            const fileName = crypto.buildAllSaveFileName?.() || `prisma_abyss_all_saves_${Date.now()}.rpgsave`;
            SaveBackup.downloadText(text, fileName);
            return { fileName, text };
        },

        readFileText: file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => resolve(String(event.target?.result || ''));
            reader.onerror = () => reject(reader.error || new Error('ファイルを読み込めませんでした。'));
            reader.readAsText(file);
        })
    };

    const GoogleDriveBackup = {
        gisPromise: null,
        tokenClient: null,
        accessToken: '',
        accessTokenExpiresAt: 0,
        pendingAuthorization: null,

        getClientId: () => String(
            global.PRISMA_GOOGLE_DRIVE_CLIENT_ID
            || global.document?.querySelector?.('meta[name="google-drive-client-id"]')?.content
            || ''
        ).trim(),

        isConfigured: () => !!GoogleDriveBackup.getClientId(),

        loadIdentityServices: () => {
            if (global.google?.accounts?.oauth2) return Promise.resolve(true);
            if (GoogleDriveBackup.gisPromise) return GoogleDriveBackup.gisPromise;
            GoogleDriveBackup.gisPromise = new Promise((resolve, reject) => {
                const existing = document.querySelector(`script[src="${GOOGLE_IDENTITY_SCRIPT}"]`);
                const script = existing || document.createElement('script');
                const finish = () => global.google?.accounts?.oauth2
                    ? resolve(true)
                    : reject(new Error('Google Drive認証を読み込めませんでした。'));
                script.addEventListener('load', finish, { once: true });
                script.addEventListener('error', () => reject(new Error('Google Drive認証の読み込みに失敗しました。')), { once: true });
                if (!existing) {
                    script.src = GOOGLE_IDENTITY_SCRIPT;
                    script.async = true;
                    script.defer = true;
                    document.head.appendChild(script);
                }
            }).catch(error => {
                GoogleDriveBackup.gisPromise = null;
                throw error;
            });
            return GoogleDriveBackup.gisPromise;
        },

        ensureTokenClient: async () => {
            if (!GoogleDriveBackup.isConfigured()) throw new Error('Google Driveバックアップはまだ有効化されていません。');
            await GoogleDriveBackup.loadIdentityServices();
            if (GoogleDriveBackup.tokenClient) return GoogleDriveBackup.tokenClient;
            GoogleDriveBackup.tokenClient = global.google.accounts.oauth2.initTokenClient({
                client_id: GoogleDriveBackup.getClientId(),
                scope: GOOGLE_DRIVE_SCOPE,
                callback: response => {
                    const pending = GoogleDriveBackup.pendingAuthorization;
                    GoogleDriveBackup.pendingAuthorization = null;
                    if (!pending) return;
                    if (!response?.access_token || response.error) {
                        pending.reject(new Error(response?.error_description || response?.error || 'Google Driveの許可を確認できませんでした。'));
                        return;
                    }
                    GoogleDriveBackup.accessToken = response.access_token;
                    const expiresIn = Math.max(60, Number(response.expires_in || 3600));
                    GoogleDriveBackup.accessTokenExpiresAt = Date.now() + expiresIn * 1000 - 60000;
                    pending.resolve(response.access_token);
                },
                error_callback: response => {
                    const pending = GoogleDriveBackup.pendingAuthorization;
                    GoogleDriveBackup.pendingAuthorization = null;
                    pending?.reject(new Error(response?.message || response?.type || 'Google Driveの認証画面を開けませんでした。'));
                }
            });
            return GoogleDriveBackup.tokenClient;
        },

        authorize: async () => {
            if (GoogleDriveBackup.accessToken && Date.now() < GoogleDriveBackup.accessTokenExpiresAt) {
                return GoogleDriveBackup.accessToken;
            }
            const client = await GoogleDriveBackup.ensureTokenClient();
            if (GoogleDriveBackup.pendingAuthorization) throw new Error('Google Driveの認証処理中です。');
            return new Promise((resolve, reject) => {
                GoogleDriveBackup.pendingAuthorization = { resolve, reject };
                client.requestAccessToken({ prompt: '' });
            });
        },

        fetchJson: async (url, options = {}) => {
            const token = await GoogleDriveBackup.authorize();
            const headers = new Headers(options.headers || {});
            headers.set('Authorization', `Bearer ${token}`);
            const response = await fetch(url, { ...options, headers });
            if (!response.ok) {
                const detail = await response.text().catch(() => '');
                if (response.status === 401) {
                    GoogleDriveBackup.accessToken = '';
                    GoogleDriveBackup.accessTokenExpiresAt = 0;
                }
                throw new Error(`Google Driveとの通信に失敗しました（${response.status}）${detail ? `: ${detail.slice(0, 180)}` : ''}`);
            }
            if (response.status === 204) return null;
            return response.json();
        },

        escapeQueryValue: value => String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'"),

        findFolder: async () => {
            const marker = GoogleDriveBackup.escapeQueryValue(GOOGLE_DRIVE_FOLDER_MARKER);
            const query = `mimeType='application/vnd.google-apps.folder' and trashed=false and appProperties has { key='prismaAbyssType' and value='${marker}' }`;
            const params = new URLSearchParams({ q: query, spaces: 'drive', fields: 'files(id,name,modifiedTime)', pageSize: '10' });
            const result = await GoogleDriveBackup.fetchJson(`${GOOGLE_DRIVE_API}/files?${params}`);
            return result?.files?.[0] || null;
        },

        ensureFolder: async () => {
            const existing = await GoogleDriveBackup.findFolder();
            if (existing) return existing;
            return GoogleDriveBackup.fetchJson(`${GOOGLE_DRIVE_API}/files?fields=id,name,modifiedTime`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: GOOGLE_DRIVE_FOLDER_NAME,
                    mimeType: 'application/vnd.google-apps.folder',
                    appProperties: { prismaAbyssType: GOOGLE_DRIVE_FOLDER_MARKER }
                })
            });
        },

        findBackupFile: async (folderId) => {
            const marker = GoogleDriveBackup.escapeQueryValue(GOOGLE_DRIVE_FILE_MARKER);
            const parent = GoogleDriveBackup.escapeQueryValue(folderId);
            const query = `'${parent}' in parents and trashed=false and appProperties has { key='prismaAbyssType' and value='${marker}' }`;
            const params = new URLSearchParams({
                q: query,
                spaces: 'drive',
                fields: 'files(id,name,modifiedTime,size)',
                orderBy: 'modifiedTime desc',
                pageSize: '10'
            });
            const result = await GoogleDriveBackup.fetchJson(`${GOOGLE_DRIVE_API}/files?${params}`);
            return result?.files?.[0] || null;
        },

        uploadMultipart: async (fileId, folderId, text) => {
            const token = await GoogleDriveBackup.authorize();
            const crypto = getSaveCrypto();
            const metadata = {
                name: crypto?.getGoogleDriveFileName?.() || 'prisma_abyss_all_saves.rpgsave',
                mimeType: 'application/octet-stream',
                appProperties: { prismaAbyssType: GOOGLE_DRIVE_FILE_MARKER }
            };
            if (!fileId) metadata.parents = [folderId];
            const boundary = `prisma_abyss_${Date.now()}_${Math.random().toString(16).slice(2)}`;
            const body = new Blob([
                `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n`,
                JSON.stringify(metadata),
                `\r\n--${boundary}\r\nContent-Type: application/octet-stream\r\n\r\n`,
                text,
                `\r\n--${boundary}--`
            ], { type: `multipart/related; boundary=${boundary}` });
            const endpoint = fileId
                ? `${GOOGLE_DRIVE_UPLOAD_API}/files/${encodeURIComponent(fileId)}?uploadType=multipart&fields=id,name,modifiedTime,size`
                : `${GOOGLE_DRIVE_UPLOAD_API}/files?uploadType=multipart&fields=id,name,modifiedTime,size`;
            const response = await fetch(endpoint, {
                method: fileId ? 'PATCH' : 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': `multipart/related; boundary=${boundary}`
                },
                body
            });
            if (!response.ok) {
                const detail = await response.text().catch(() => '');
                throw new Error(`Google Driveへの保存に失敗しました（${response.status}）${detail ? `: ${detail.slice(0, 180)}` : ''}`);
            }
            return response.json();
        },

        exportAllSaveData: async () => {
            const text = await SaveBackup.encodeAllSaveBundle();
            const folder = await GoogleDriveBackup.ensureFolder();
            const existing = await GoogleDriveBackup.findBackupFile(folder.id);
            const file = await GoogleDriveBackup.uploadMultipart(existing?.id || null, folder.id, text);
            return { folder, file, updated: !!existing };
        },

        downloadAllSaveText: async () => {
            const folder = await GoogleDriveBackup.findFolder();
            if (!folder) throw new Error('Google DriveにPRISMA ABYSSのバックアップがありません。');
            const file = await GoogleDriveBackup.findBackupFile(folder.id);
            if (!file) throw new Error('Google Driveに全セーブデータのバックアップがありません。');
            const token = await GoogleDriveBackup.authorize();
            const response = await fetch(`${GOOGLE_DRIVE_API}/files/${encodeURIComponent(file.id)}?alt=media`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`Google Driveからバックアップを読み込めませんでした（${response.status}）。`);
            return { text: await response.text(), file, folder };
        }
    };

    const SaveDataUI = {
        overlay: null,
        mode: null,
        busy: false,

        close: () => {
            if (SaveDataUI.busy) return;
            SaveDataUI.overlay?.remove();
            SaveDataUI.overlay = null;
            SaveDataUI.mode = null;
        },

        setStatus: (message = '', kind = '') => {
            const status = SaveDataUI.overlay?.querySelector('.save-data-status');
            if (!status) return;
            status.textContent = String(message || '');
            status.dataset.kind = kind;
        },

        setBusy: (busy, message = '') => {
            SaveDataUI.busy = busy === true;
            SaveDataUI.overlay?.querySelectorAll('button').forEach(button => {
                if (!button.classList.contains('save-data-google-unavailable')) button.disabled = SaveDataUI.busy;
            });
            if (message) SaveDataUI.setStatus(message, 'progress');
        },

        showMessage: message => new Promise(resolve => {
            const overlay = SaveDataUI.overlay;
            if (!overlay) {
                global.alert?.(message);
                resolve(true);
                return;
            }
            const layer = document.createElement('div');
            layer.className = 'save-slot-prompt-layer';
            layer.innerHTML = `
                <div class="save-slot-prompt" role="dialog" aria-modal="true">
                    <div class="save-slot-prompt-message"></div>
                    <div class="save-slot-prompt-actions"><button type="button" class="btn save-ui-button">OK</button></div>
                </div>`;
            layer.querySelector('.save-slot-prompt-message').textContent = String(message || '');
            layer.querySelector('button').onclick = () => { layer.remove(); resolve(true); };
            overlay.appendChild(layer);
            requestAnimationFrame(() => layer.querySelector('button')?.focus());
        }),

        confirm: message => new Promise(resolve => {
            const overlay = SaveDataUI.overlay;
            if (!overlay) { resolve(!!global.confirm?.(message)); return; }
            const layer = document.createElement('div');
            layer.className = 'save-slot-prompt-layer';
            layer.innerHTML = `
                <div class="save-slot-prompt" role="alertdialog" aria-modal="true">
                    <div class="save-slot-prompt-message"></div>
                    <div class="save-slot-prompt-actions">
                        <button type="button" class="btn save-ui-button save-data-confirm-cancel">いいえ</button>
                        <button type="button" class="btn save-ui-button save-data-confirm-accept">はい</button>
                    </div>
                </div>`;
            layer.querySelector('.save-slot-prompt-message').textContent = String(message || '');
            const finish = value => { layer.remove(); resolve(value); };
            layer.querySelector('.save-data-confirm-cancel').onclick = () => finish(false);
            layer.querySelector('.save-data-confirm-accept').onclick = () => finish(true);
            overlay.appendChild(layer);
            requestAnimationFrame(() => layer.querySelector('.save-data-confirm-accept')?.focus());
        }),

        actionButton: (title, description, action, options = {}) => `
            <button class="btn save-ui-button save-data-action${options.unavailable ? ' save-data-google-unavailable' : ''}" type="button"
                ${options.disabled ? 'disabled' : ''} onclick="SaveDataUI.run('${action}')">
                <span class="save-data-action-title">${title}</span>
                ${description ? `<span class="save-data-action-desc">${description}</span>` : ''}
            </button>`,

        open: mode => {
            SaveDataUI.close();
            SaveDataUI.mode = mode === 'import' ? 'import' : 'export';
            const context = isGamePage() ? 'game' : 'title';
            const host = context === 'game' ? (document.getElementById('game-container') || document.body) : document.body;
            // Google Drive連携ロジックは将来再開できるよう保持するが、
            // 現時点ではプレイヤー向け導線を出さない。
            const overlay = document.createElement('div');
            overlay.className = `save-slot-overlay save-data-overlay is-${context}`;
            const title = SaveDataUI.mode === 'export' ? 'データ出力' : 'データ読込';
            const actions = SaveDataUI.mode === 'export'
                ? [
                    SaveDataUI.actionButton('オートセーブ出力', '現在のオートセーブ1件をファイルへ保存', 'exportAuto'),
                    SaveDataUI.actionButton('全セーブデータ出力', 'オートセーブと手動セーブNo.1～20を一括保存', 'exportAll')
                ]
                : [
                    SaveDataUI.actionButton('オートセーブ読込', '1件のバックアップをオートセーブへ復元', 'importAuto'),
                    SaveDataUI.actionButton('全セーブデータ読込', 'オートセーブと手動セーブNo.1～20を一括復元', 'importAll')
                ];
            overlay.innerHTML = `
                <div class="save-slot-dialog save-data-dialog" role="dialog" aria-modal="true" aria-labelledby="save-data-title">
                    <div class="save-slot-header">
                        <div id="save-data-title" class="save-slot-title">${title}</div>
                        <button type="button" class="btn save-ui-button" onclick="SaveDataUI.close()">もどる</button>
                    </div>
                    <div class="save-data-body">${actions.join('')}</div>
                    <div class="save-data-status" aria-live="polite"></div>
                    <div class="save-slot-footer"><button type="button" class="btn save-ui-button sub-screen-back-btn" onclick="SaveDataUI.close()">もどる</button></div>
                </div>`;
            overlay.addEventListener('click', event => {
                if (event.target === overlay && !SaveDataUI.busy) SaveDataUI.close();
            });
            host.appendChild(overlay);
            SaveDataUI.overlay = overlay;
        },

        chooseAllBackupFile: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.rpgsave,application/octet-stream,application/json';
            input.onchange = async event => {
                const file = event.target.files?.[0];
                if (!file) return;
                SaveDataUI.setBusy(true, '全セーブデータを確認しています……');
                try {
                    const text = await SaveBackup.readFileText(file);
                    const bundle = await SaveBackup.decodeAllSaveText(text);
                    SaveDataUI.setBusy(false);
                    const confirmed = await SaveDataUI.confirm(
                        '全セーブデータを読み込むと、現在のオートセーブと手動セーブNo.1～20は置き換わります。\n\n読み込んで再開しますか？'
                    );
                    if (!confirmed) return;
                    SaveDataUI.setBusy(true, '全セーブデータを復元しています……');
                    await SaveBackup.replaceAllSaveData(bundle);
                    global.location.href = 'index.html';
                } catch (error) {
                    console.error(error);
                    SaveDataUI.setBusy(false);
                    await SaveDataUI.showMessage(error?.message || '全セーブデータの読込に失敗しました。');
                }
            };
            input.click();
        },

        run: async action => {
            if (SaveDataUI.busy) return;
            const app = getApp();
            try {
                if (action === 'exportAuto') {
                    await app?.downloadSave?.();
                    return;
                }
                if (action === 'importAuto') {
                    app?.importSave?.();
                    return;
                }
                if (action === 'importAll') {
                    SaveDataUI.chooseAllBackupFile();
                    return;
                }
                if (action === 'exportAll') {
                    SaveDataUI.setBusy(true, '全セーブデータを出力しています……');
                    const result = await SaveBackup.exportAllToFile();
                    SaveDataUI.setBusy(false);
                    await SaveDataUI.showMessage(`全セーブデータを出力しました。\n${result.fileName}`);
                    return;
                }
                if (action === 'exportGoogle') {
                    const confirmed = await SaveDataUI.confirm('Googleドライブ上の全セーブデータを現在の内容で更新しますか？');
                    if (!confirmed) return;
                    SaveDataUI.setBusy(true, 'Googleドライブへ保存しています……');
                    const result = await GoogleDriveBackup.exportAllSaveData();
                    SaveDataUI.setBusy(false);
                    await SaveDataUI.showMessage(`Googleドライブへ保存しました。\n${GOOGLE_DRIVE_FOLDER_NAME}/${result.file.name}`);
                    return;
                }
                if (action === 'importGoogle') {
                    SaveDataUI.setBusy(true, 'Googleドライブのバックアップを確認しています……');
                    const downloaded = await GoogleDriveBackup.downloadAllSaveText();
                    const bundle = await SaveBackup.decodeAllSaveText(downloaded.text);
                    SaveDataUI.setBusy(false);
                    const modified = downloaded.file?.modifiedTime ? new Date(downloaded.file.modifiedTime).toLocaleString('ja-JP') : '日時不明';
                    const confirmed = await SaveDataUI.confirm(
                        `Googleドライブの全セーブデータ（${modified}）を読み込むと、現在のオートセーブと手動セーブNo.1～20は置き換わります。\n\n読み込んで再開しますか？`
                    );
                    if (!confirmed) return;
                    SaveDataUI.setBusy(true, '全セーブデータを復元しています……');
                    await SaveBackup.replaceAllSaveData(bundle);
                    global.location.href = 'index.html';
                }
            } catch (error) {
                console.error(error);
                SaveDataUI.setBusy(false);
                await SaveDataUI.showMessage(error?.message || 'データ処理に失敗しました。');
            }
        }
    };

    global.SaveBackup = SaveBackup;
    global.GoogleDriveBackup = GoogleDriveBackup;
    global.SaveDataUI = SaveDataUI;
})(globalThis);
