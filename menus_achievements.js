/* MenuAchievements extracted from menus.js. Keep runtime behavior aligned with Menu core. */
/* ==========================================================================
   9. 実績 (MenuAchievements) - 表示専用
   ========================================================================== */
const MenuAchievements = {
    filter: 'ALL',
    categoryFilter: 'ALL',

    /*
     * 実績の達成判定・報酬付与は achievements.js の AchievementManager に統一。
     * ここは「画面表示」「ボタン操作」だけを担当する。
     * Codex等で実績タイプを増やす場合も、この menus.js に判定switchを戻さないこと。
     */
    init: () => {
        const screen = document.getElementById('sub-screen-achievements');
        if (screen) screen.style.display = 'flex';
        MenuAchievements.checkProgress();
        MenuAchievements.render();
    },

    _renderInternal: () => {
        const container = document.getElementById('sub-screen-achievements');
        if (!container) return;
        const scrollArea = container.querySelector('.scroll-area');
        if (scrollArea) scrollArea.scrollTop = 0;
    },

    escapeHtml: (value) => String(value ?? '').replace(/[&<>'"]/g, (ch) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[ch])),

    formatNum: (n) => Number(n || 0).toLocaleString('ja-JP'),

    checkProgress: () => {
        if (typeof AchievementManager !== 'undefined' && AchievementManager.checkProgress) {
            return AchievementManager.checkProgress();
        }
        return 0;
    },

    processRewards: (rewards) => {
        if (typeof AchievementManager !== 'undefined' && AchievementManager.processRewards) {
            return AchievementManager.processRewards(rewards);
        }
        return '';
    },

    render: () => {
        const container = document.getElementById('sub-screen-achievements');
        if (!container) return;

        if (typeof AchievementManager === 'undefined') {
            container.innerHTML = `
                <div class="header-bar">
                    <span>🏆 実績</span>
                    <button class="btn" onclick="Menu.closeSubScreen('achievements')">もどる</button>
                </div>
                <div class="scroll-area" style="padding:16px; background:#111; color:#ccc;">
                    今は利用できないようだ。
                </div>
            `;
            return;
        }

        AchievementManager.checkProgress({ save: true });

        const allData = (typeof ACHIEVEMENTS_DATA !== 'undefined') ? ACHIEVEMENTS_DATA : [];
        // secret実績は達成するまで、一覧・カテゴリ・達成率・件数のすべてから除外する。
        // 達成後は通常実績と同じ扱いで表示し、報酬も受け取れる。
        const data = allData.filter(a => AchievementManager.isVisible(a));
        if (!App.data.achievements) App.data.achievements = {};

        const categories = ['ALL', ...Array.from(new Set(data.map(a => a.category || 'その他')))].filter(Boolean);

        let list = data.filter(a => {
            const state = AchievementManager.getState(a.id);
            if (MenuAchievements.filter === 'COMPLETED' && !state.completed) return false;
            if (MenuAchievements.filter === 'INCOMPLETE' && state.completed) return false;
            if (MenuAchievements.categoryFilter !== 'ALL' && (a.category || 'その他') !== MenuAchievements.categoryFilter) return false;
            return true;
        });

        list.sort((a, b) => {
            const sA = AchievementManager.getState(a.id);
            const sB = AchievementManager.getState(b.id);
            const score = (s) => (s.completed && !s.claimed) ? 0 : (!s.completed ? 1 : 2);
            const scoreDiff = score(sA) - score(sB);
            if (scoreDiff !== 0) return scoreDiff;
            return (a.id || 0) - (b.id || 0);
        });

        const completedCount = data.filter(a => AchievementManager.getState(a.id).completed).length;
        const claimedCount = data.filter(a => AchievementManager.getState(a.id).claimed).length;
        const unclaimedCount = (typeof AchievementManager.getUnclaimedCount === 'function')
            ? AchievementManager.getUnclaimedCount()
            : data.filter(a => {
                const s = AchievementManager.getState(a.id);
                return s.completed && !s.claimed;
            }).length;
        const incompleteCount = Math.max(0, data.length - completedCount);
        const completedPercent = data.length ? Math.floor((completedCount / data.length) * 100) : 0;
        const filteredCount = list.length;

        const filterLabels = {
            ALL: '全て',
            INCOMPLETE: '未達成',
            COMPLETED: '達成済み'
        };

        const categoryOptions = categories.map(cat => `
            <option value="${MenuAchievements.escapeHtml(cat)}" ${MenuAchievements.categoryFilter === cat ? 'selected' : ''}>
                ${cat === 'ALL' ? 'カテゴリ全て' : MenuAchievements.escapeHtml(cat)}
            </option>
        `).join('');

        container.innerHTML = `
            <div class="header-bar">
                <span>🏆 実績</span>
                <button class="btn" onclick="Menu.closeSubScreen('achievements')">もどる</button>
            </div>

            <div class="achievement-overview">
                <div class="achievement-summary">
                    <div class="achievement-rate-card">
                        <div class="achievement-rate-value">${completedPercent}%</div>
                        <div class="achievement-summary-label">達成率</div>
                    </div>
                    <div class="achievement-summary-grid">
                        <div class="achievement-summary-card">
                            <div class="achievement-summary-label">達成</div>
                            <div class="achievement-summary-value">${completedCount}/${data.length}</div>
                        </div>
                        <div class="achievement-summary-card ${unclaimedCount > 0 ? 'has-unclaimed' : ''}">
                            <div class="achievement-summary-label">未受取</div>
                            <div class="achievement-summary-value">${unclaimedCount}</div>
                        </div>
                        <div class="achievement-summary-card">
                            <div class="achievement-summary-label">未達成</div>
                            <div class="achievement-summary-value">${incompleteCount}</div>
                        </div>
                        <div class="achievement-summary-card">
                            <div class="achievement-summary-label">表示中</div>
                            <div class="achievement-summary-value">${filteredCount}</div>
                        </div>
                    </div>
                </div>

                <div class="achievement-progress-track">
                    <div class="achievement-progress-fill" style="width:${completedPercent}%;"></div>
                </div>

                <button class="menu-state-button achievement-claim-all-button ${unclaimedCount > 0 ? 'has-claim' : 'is-empty'}" onclick="MenuAchievements.claimAll()" ${unclaimedCount > 0 ? '' : 'disabled'}>
                    ${unclaimedCount > 0 ? `🎁 未受取 ${unclaimedCount} 件を一括受取` : '受け取れる報酬はありません'}
                </button>
            </div>

            <div class="achievement-controls">
                <div class="menu-filter-rail achievement-filter-rail">
                    ${['ALL', 'INCOMPLETE', 'COMPLETED'].map(f => `
                        <button class="menu-filter-button ${MenuAchievements.filter === f ? 'is-active' : ''}" aria-pressed="${MenuAchievements.filter === f ? 'true' : 'false'}"
                            onclick="MenuAchievements.filter='${f}'; MenuAchievements.render();">
                            ${filterLabels[f]}
                        </button>
                    `).join('')}
                </div>
                <div class="achievement-category-row">
                    <label>カテゴリ</label>
                    <select onchange="MenuAchievements.categoryFilter=this.value; MenuAchievements.render();">
                        ${categoryOptions}
                    </select>
                </div>
            </div>

            <div class="scroll-area achievement-list">
                ${list.map(a => {
                    const state = AchievementManager.getState(a.id);
                    const progress = AchievementManager.getProgress(a);
                    const canClaim = state.completed && !state.claimed;
                    const isClaimed = state.claimed;
                    const rewardText = AchievementManager.getRewardText(a.rewards || []);
                    const progressLabel = `${MenuAchievements.formatNum(Math.min(progress.value, progress.goal))}/${MenuAchievements.formatNum(progress.goal)}`;

                    return `
                        <div class="achievement-entry ${state.completed ? 'is-completed' : 'is-incomplete'}" style="opacity:${isClaimed ? 0.55 : 1}; padding:12px; margin-bottom:8px; display:flex; align-items:center; gap:10px;">
                            <div style="flex:1; min-width:0;">
                                <div style="display:flex; justify-content:space-between; gap:8px; align-items:center;">
                                    <div style="font-size:13px; font-weight:bold; color:${state.completed ? '#fff' : '#aaa'};">
                                        ${state.completed ? '✅ ' : ''}${MenuAchievements.escapeHtml(a.title)}
                                    </div>
                                    <div style="font-size:9px; color:#999; border:1px solid #444; border-radius:999px; padding:2px 6px; flex-shrink:0;">
                                        ${MenuAchievements.escapeHtml(a.category || 'その他')}
                                    </div>
                                </div>
                                <div style="font-size:10px; color:#777; margin-top:3px;">${MenuAchievements.escapeHtml(a.desc)}</div>
                                <div style="height:6px; background:#2a2a2a; border-radius:99px; overflow:hidden; margin-top:8px;">
                                    <div style="height:100%; width:${progress.percent}%; background:${state.completed ? '#d6b22e' : '#008888'};"></div>
                                </div>
                                <div style="display:flex; justify-content:space-between; font-size:10px; color:#888; margin-top:3px;">
                                    <span>進捗: ${progressLabel}</span>
                                    <span>${progress.percent}%</span>
                                </div>
                                <div style="font-size:11px; color:#00cccc; margin-top:5px;">
                                    報酬: ${MenuAchievements.escapeHtml(rewardText)}
                                </div>
                            </div>
                            <button class="btn ${canClaim ? 'menu-tone-danger' : 'menu-surface-card'}" style="width:82px; font-size:11px; flex-shrink:0;"
                                onclick="MenuAchievements.claim(${a.id})" ${canClaim ? '' : 'disabled'}>
                                ${isClaimed ? '受取済' : (state.completed ? '受取' : '未達成')}
                            </button>
                        </div>
                    `;
                }).join('') || '<div style="color:#777; text-align:center; padding:20px;">該当する実績はありません。</div>'}
            </div>

            <div class="sub-screen-bottom-panel">
                <button class="btn sub-screen-back-btn" onclick="Menu.closeSubScreen('achievements')">もどる</button>
            </div>
        `;

        MenuAchievements._renderInternal();
    },

    claim: (id) => {
        if (typeof AchievementManager === 'undefined') return;
        const result = AchievementManager.claim(id);
        if (!result.ok) {
            Menu.msg(result.message || '受け取れません。');
            return;
        }

        App.updateHUD();
        if (typeof Menu.renderPartyBar === 'function') Menu.renderPartyBar();

        Menu.msg(`実績達成報酬を獲得しました！\n${result.rewardText}`);
        MenuAchievements.render();
    },

    claimAll: () => {
        if (typeof AchievementManager === 'undefined') return;
        const result = AchievementManager.claimAll();

        if (!result.ok) {
            Menu.msg("受け取れる報酬はありません。");
            return;
        }

        App.updateHUD();
        if (typeof Menu.renderPartyBar === 'function') Menu.renderPartyBar();

        Menu.msg(`${result.count}件の実績報酬を一括で受け取りました。`);
        MenuAchievements.render();
    }
};

if (typeof window !== 'undefined') window.MenuAchievements = MenuAchievements;
