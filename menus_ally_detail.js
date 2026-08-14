/* MenuAllyDetail extracted from menus.js. Keep runtime behavior aligned with Menu core. */
/* ==========================================================================
   仲間詳細・アーカイブ画面 (完全版: 同期・ソート・固定レイアウト修正)
   ========================================================================== */
const MenuAllyDetail = {
    selectedChar: null,
    currentMainTab: 'archive', 
    currentArchive: 'base',
    currentPortraitExpression: 'normal',

	init: (char) => {
		if (!char) return;

		MenuAllyDetail.selectedChar = char;
		MenuAllies.selectedChar = char;
		MenuAllies.selectedUid = char.uid;

		MenuAllyDetail.currentMainTab = 'archive';
		MenuAllyDetail.currentArchive = 'base';
		MenuAllyDetail.currentPortraitExpression = 'normal';

		MenuAllies.showArchiveView();
		MenuAllyDetail.render();
	},
	
	render: () => {
		const c = MenuAllyDetail.selectedChar;
		if (!c) {
			MenuAllies.returnFromArchiveToDetail();
			return;
		}

		MenuAllies.selectedChar = c;
		MenuAllies.selectedUid = c.uid;
		MenuAllies.showArchiveView();

		const view = document.getElementById('allies-detail-view');
		const detailContent = MenuAllies.ensureDetailContent();
		if (!view || !detailContent) return;
        
        // メインタブ (固定エリア: flex-shrink: 0)
        const tabs = MenuAllyDetail.renderMainTabs();

		view.style.display = 'flex';
		view.style.flexDirection = 'column';

		detailContent.style.display = 'flex';
		detailContent.style.flexDirection = 'column';
		detailContent.style.minHeight = '0';

		detailContent.innerHTML = `
			<div style="padding:15px 15px 0 15px; background:#050505; flex-shrink:0;">
				${tabs}
			</div>
			<div id="ally-detail-body" class="scroll-area" style="padding:0 15px 15px 15px; background:#050505; flex:1; overflow-y:auto;">
				${MenuAllyDetail.renderCurrentMainTab()}
			</div>
		`;

        // ガチャカード側のCSS枠線除去処理を、仲間詳細の静的カードにも適用する。
        // 既存のガチャ演出/位置調整CSSはそのまま利用し、ここでは表示後の保険だけ行う。
        requestAnimationFrame(() => {
            if (typeof Gacha !== 'undefined' && typeof Gacha.removePremiumCssFrame === 'function') {
                Gacha.removePremiumCssFrame(detailContent);
            }
        });
    },

    renderMainTabs: () => {
        const items = [
            { id: 'archive', label: 'アーカイブ' },
            { id: 'progress', label: '成長の記録' },
            { id: 'limitBreak', label: '限界突破' }
        ];

        return `
            <div style="display:flex; background:#222; margin-bottom:12px; border-radius:6px; overflow:hidden; border:1px solid #444; flex-shrink:0;">
                ${items.map(item => {
                    const active = MenuAllyDetail.currentMainTab === item.id;
                    return `<button onclick="MenuAllyDetail.changeMainTab('${item.id}')" style="flex:1; min-width:0; padding:10px 4px; border:none; background:${active ? '#ffd700' : '#111'}; color:${active ? '#000' : '#777'}; font-weight:bold; font-size:11px; white-space:nowrap;">${item.label}</button>`;
                }).join('')}
            </div>
        `;
    },

    renderCurrentMainTab: () => {
        if (MenuAllyDetail.currentMainTab === 'archive') return MenuAllyDetail.renderArchive();
        if (MenuAllyDetail.currentMainTab === 'progress') return MenuAllyDetail.renderProgress();
        return MenuAllyDetail.renderLimitBreak();
    },

    getPortraitImage: (char, expression = 'normal') => {
        if (!char) return '';
        if (App.isMonsterAlly?.(char)) {
            return App.getCharacterDisplayImage ? App.getCharacterDisplayImage(char) : (char.img || '');
        }
        return App.getCharacterPortraitPath ? App.getCharacterPortraitPath(char, expression) : '';
    },

    randomizePortrait: (event) => {
        event?.stopPropagation?.();
        const char = MenuAllyDetail.selectedChar;
        if (!char || App.isMonsterAlly?.(char)) return;

        const expressions = Array.isArray(App.characterPortraitExpressions)
            ? App.characterPortraitExpressions
            : ['normal', 'happy', 'sad', 'shout', 'angry', 'defeated'];
        const current = App.normalizeCharacterExpression
            ? App.normalizeCharacterExpression(MenuAllyDetail.currentPortraitExpression)
            : (MenuAllyDetail.currentPortraitExpression || 'normal');
        const candidates = expressions.filter(expression => expression !== current);
        if (!candidates.length) return;

        const next = candidates[Math.floor(Math.random() * candidates.length)];
        const src = MenuAllyDetail.getPortraitImage(char, next);
        const img = document.querySelector('.ally-detail-card-character');
        if (!img || !src) {
            if (img) img.style.display = 'none';
            return;
        }

        MenuAllyDetail.currentPortraitExpression = next;
        img.style.display = 'none';
        img.onload = () => {
            img.style.display = '';
            img.onload = null;
            img.onerror = null;
        };
        img.onerror = () => {
            img.onload = null;
            img.onerror = null;
            img.removeAttribute('src');
            img.style.display = 'none';
        };
        img.src = src;
    },

    renderArchive: () => {
        const c = MenuAllyDetail.selectedChar;
        const master = DB.CHARACTERS.find(m => m.id === c.charId) || {};
        const rarity = c.rarity || 'N';
        const stars = { 'N': 1, 'R': 2, 'SR': 3, 'SSR': 4, 'UR': 5, 'EX': 6 }[rarity] || 1;
        const isMonsterAlly = App.isMonsterAlly?.(c) === true;
        const imgUrl = MenuAllyDetail.getPortraitImage(c, isMonsterAlly ? 'normal' : MenuAllyDetail.currentPortraitExpression);
        const imageErrorAttr = imgUrl ? ` onerror="this.onerror=null;this.removeAttribute('src');this.style.display='none';"` : '';

        let frontRareClass = "";
        if (rarity === "SSR") frontRareClass = "style-gold";
        else if (rarity === "UR") frontRareClass = "style-aurora";
        else if (rarity === "EX") frontRareClass = "style-majestic";

        // カードレイアウト：ガチャ演出と同じ premium-card-front を使用する。
        // 位置・サイズ・色・オーラは index.html 側の最新ガチャCSSをそのまま反映。
        const rarityClass = (typeof Gacha !== 'undefined' && typeof Gacha.getRarityClass === 'function')
            ? Gacha.getRarityClass(rarity)
            : `rarity-${String(rarity).toLowerCase()}`;
        const cardData = {
            ...master,
            ...c,
            id: c.charId || master.id,
            charId: c.charId || master.id,
            name: c.name || master.name,
            job: c.job || master.job || '',
            rarity,
            img: imgUrl || '',
            isNew: false,
            limitBreak: Number(c.limitBreak || 0)
        };

        let premiumFrontHtml = (typeof Gacha !== 'undefined' && typeof Gacha.buildPremiumFrontFace === 'function')
            ? Gacha.buildPremiumFrontFace(cardData, { displayImg: imgUrl || '' })
            : `
                <div class="card-face card-front premium-card-front ${rarityClass}" style="transform:none;">
                    <div class="gacha-card-backdrop"></div>
                    <div class="gacha-card-rarity-aura"></div>
                    <div class="gacha-character-window">
                        ${imgUrl ? `<img class="gacha-card-character" src="${imgUrl}"${imageErrorAttr} alt="">` : '<div class="gacha-card-silhouette">?</div>'}
                    </div>
                    <img class="gacha-card-template" src="assets/gacha/front_card.png" alt="">
                    <div class="gacha-card-rarity">${rarity}</div>
                    <div class="gacha-card-stars">${'★'.repeat(stars)}</div>
                    <div class="gacha-card-name"><span class="gacha-card-name-text">${c.name || ''}</span>${Number(c.limitBreak || 0) > 0 ? `<span class="gacha-lb-plus"> +${c.limitBreak}</span>` : ''}</div>
                    <div class="gacha-card-job">${c.job || ''}</div>
                    <div class="gacha-card-foil"></div>
                </div>`;

        // MenuAllyDetail の静的カードでは、ガチャ演出用のキャラ登場アニメーションを止めて
        // 初期描画時点からキャラクター画像を表示する。
		premiumFrontHtml = premiumFrontHtml
			.replace(
				'class="gacha-card-character"',
				`class="gacha-card-character ally-detail-card-character" style="animation:none !important; -webkit-animation:none !important; opacity:1 !important;" onerror="this.onerror=null;this.removeAttribute('src');this.style.display='none';"`
			)
			.replace(
				'class="card-face card-front premium-card-front',
				'class="card-face card-front premium-card-front ally-detail-card-front'
			);


        const cardHtml = `
            <div class="ally-archive-card-stage">
                <button type="button" class="ally-archive-nav prev" onclick="MenuAllyDetail.switchChar(-1)">◀</button>

                <div class="gacha-card-scene premium-card premium-card-static ally-detail-premium-card ${rarityClass}" ${isMonsterAlly ? '' : 'onclick="MenuAllyDetail.randomizePortrait(event)"'} style="width:clamp(205px, min(66vw, 36svh), 265px) !important; height:auto !important; aspect-ratio:2/3 !important; flex-shrink:0; animation:none !important; ${isMonsterAlly ? '' : 'cursor:pointer;'}">
                    ${premiumFrontHtml}
                </div>

                <button type="button" class="ally-archive-nav next" onclick="MenuAllyDetail.switchChar(1)">▶</button>
            </div>
        `;

        const milestones = [
            { id: 'base',  label: '初期', cond: () => true },
            { id: 'lv50',  label: 'Lv50', cond: () => c.level >= 50 },
            { id: 'lb50',  label: '+50',  cond: () => c.limitBreak >= 50 },
            { id: 'lv100', label: 'Lv100',cond: () => c.level >= 100 },
            { id: 'lb99',  label: '+99',  cond: () => c.limitBreak >= 99 }
        ];

        const archiveBtns = milestones.map(m => {
            const unlocked = m.cond();
            const active = MenuAllyDetail.currentArchive === m.id;
            const style = active ? 'background:#ffd700; color:#000; font-weight:bold;' : 'background:#222; color:#555;';
            return `<div onclick="${unlocked ? `MenuAllyDetail.changeArchive('${m.id}')` : ''}" 
                         style="flex:1; text-align:center; font-size:10px; padding:6px 0; cursor:pointer; border-right:1px solid #000; ${style}">
                         ${unlocked ? m.label : '🔒'}
                    </div>`;
        }).join('');

        const archives = master.archives || {};
        const flavorText = milestones.find(m => m.id === MenuAllyDetail.currentArchive).cond() 
            ? (archives[MenuAllyDetail.currentArchive] || "記録がありません。")
            : `<div style="color:#444; text-align:center; padding:30px 10px; font-size:11px;">未解放の記録です<br><br>さらなる成長で紐解かれます</div>`;

        return `
            ${cardHtml}
            <div style="background:rgba(255,255,255,0.03); border:1px solid #444; border-radius:8px; overflow:hidden; box-shadow: inset 0 0 10px rgba(0,0,0,0.5);">
                <div style="display:flex; border-bottom:1px solid #444;">${archiveBtns}</div>
                <div id="flavor-text-area" style="padding:15px; min-height:120px; font-size:13px; line-height:1.8; color:#bbb; white-space:pre-wrap;">${flavorText}</div>
            </div>
        `;
    },

    renderProgress: () => {
        const c = MenuAllyDetail.selectedChar;
        const master = DB.CHARACTERS.find(m => m.id === c.charId) || {};
        const jobData = window.JOB_SKILLS_DATA ? window.JOB_SKILLS_DATA[c.job] : null;
        if(!jobData) return `<div style="color:#666; text-align:center; padding:40px;">データが存在しません</div>`;

        let html = `<div style="font-size:11px; color:#aaa; margin-bottom:15px; text-align:center;">解放される可能性の断片</div>`;
        
        const allPossible = [];
        // 通常スキル (LV 1-100)
        Object.entries(jobData).forEach(([lv, skillId]) => {
            allPossible.push({ id: skillId, type: 'LV', req: parseInt(lv) });
        });
        // 限界突破スキル (+30, +50, +99)
        if(master.lbSkills) {
            Object.entries(master.lbSkills).forEach(([lbReq, skillId]) => {
                allPossible.push({ id: skillId, type: 'LB', req: parseInt(lbReq) });
            });
        }

        // ★修正: LVスキル(1-100)を先に、その後ろにLBスキルを並べる
        allPossible.sort((a, b) => {
            if (a.type !== b.type) return a.type === 'LV' ? -1 : 1;
            return a.req - b.req;
        });

        allPossible.forEach(entry => {
            const isLearned = entry.type === 'LV' ? c.level >= entry.req : c.limitBreak >= entry.req;
            const skill = DB.SKILLS.find(s => s.id === entry.id);
            const condText = entry.type === 'LV' ? `Lv.${entry.req}` : `突破+${entry.req}`;
            if(!skill) return;

            html += `
                <div style="background:rgba(255,255,255,0.02); border:1px solid #333; padding:12px; margin-bottom:8px; border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
                    <div style="flex:1; padding-right:10px;">
                        <div style="font-size:14px; font-weight:bold; color:${isLearned ? '#ffd700' : '#333'};">${isLearned ? skill.name : '？？？？？？'}</div>
                        <div style="font-size:10px; color:${isLearned ? '#888' : '#222'}; margin-top:2px;">${isLearned ? skill.desc : '未知の能力'}</div>
                    </div>
                    <div style="font-size:10px; font-weight:bold; color:${isLearned ? '#4f4' : '#ffd700'}; background:rgba(0,0,0,0.4); padding:4px 10px; border-radius:15px; border:1px solid ${isLearned?'#040':'#440'}; white-space:nowrap;">
                        ${isLearned ? '修得済' : condText}
                    </div>
                </div>`;
        });
        
        return html;
    },

    renderLimitBreak: () => {
        const c = MenuAllyDetail.selectedChar;
        if (!c) return '';
        App.ensureLimitBreakProgress?.(c);
        App.syncDerivedLimitBreaks?.();

        const cfg = App.limitBreakConfig || {};
        const progress = c.lbProgress || {};
        const sources = progress.sources || {};
        const counters = progress.counters || {};
        const max = Number(cfg.max || 99);
        const current = Math.max(0, Math.min(max, Math.floor(Number(c.limitBreak) || 0)));
        const isHero = c.charId === 301 || c.isHero || c.uid === 'p1';
        const sourceVal = key => Math.max(0, Math.floor(Number(sources[key]) || 0));
        const pct = (val, limit) => limit > 0 ? Math.max(0, Math.min(100, Math.floor(val / limit * 100))) : 0;
        const row = (label, value, limit = null, note = '') => {
            const shown = limit ? Math.min(value, limit) : value;
            const width = limit ? pct(shown, limit) : (shown > 0 ? 100 : 0);
            return `<div style="background:rgba(255,255,255,0.025); border:1px solid #333; border-radius:8px; padding:10px; margin-bottom:8px;">
                <div style="display:flex; justify-content:space-between; gap:8px; align-items:center; font-size:12px;"><span style="color:#ddd;">${label}</span><span style="color:#ffd700; white-space:nowrap;">+${shown}${limit ? ` / +${limit}` : ''}</span></div>
                <div style="height:5px; background:#111; border:1px solid #2c2c2c; border-radius:999px; overflow:hidden; margin-top:8px;"><div style="height:100%; width:${width}%; background:linear-gradient(90deg,#53dfe7,#ffd700);"></div></div>
                ${note ? `<div style="font-size:10px; color:#888; margin-top:6px; line-height:1.5;">${note}</div>` : ''}
            </div>`;
        };

        const sourceRows = [];
        const battleWins = Math.max(0, Math.floor(Number(counters.battleWins) || 0));
        const interval = Math.max(1, Math.floor(Number(cfg.battlesPerStep) || 20));
        if (isHero) {
            sourceRows.push(row('ストーリー進行', sourceVal('story'), Number(cfg.heroStoryMax || 10)));
            sourceRows.push(row('戦闘回数', sourceVal('battle'), Number(cfg.heroBattleMax || 70), `${battleWins}戦 / ${interval}戦ごとに+1`));
        } else {
            sourceRows.push(row('戦闘回数', sourceVal('battle'), Number(cfg.allyBattleMax || 70), `${battleWins}戦 / ${interval}戦ごとに+1`));
        }
        sourceRows.push(row('グロウプリズム', sourceVal('prism'), null, '貴重な秘石を用いた成長'));
        sourceRows.push(row('死闘の経験', sourceVal('random'), null, '戦闘勝利時に稀に得られる成長'));
        const other = ['quest','boss','gacha','monster','trial','item','legacy'].reduce((sum,key) => sum + sourceVal(key), 0);
        sourceRows.push(row('その他', other));

        const cap = App.getLimitBreakTrialCap?.(c) ?? max;
        const atGrowthLimit = current >= cap;
        return `<div style="display:flex; flex-direction:column; gap:12px;">
            <div style="border:1px solid #444; border-radius:10px; padding:12px; background:rgba(255,255,255,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:10px; margin-bottom:10px;"><div><div style="font-size:11px; color:#888;">現在値</div><div style="font-size:26px; color:#ffd700; line-height:1;">+${current}</div></div></div>
                <div style="height:7px; background:#111; border:1px solid #333; border-radius:999px; overflow:hidden;"><div style="height:100%; width:${pct(current,max)}%; background:linear-gradient(90deg,#53dfe7,#ffd700,#ec529c);"></div></div>
                ${atGrowthLimit ? '<div style="font-size:11px; color:#ffdf7a; margin-top:9px;">現在の成長限界に達しているようだ。</div>' : ''}
            </div>
            <div style="font-size:11px; color:#aaa; text-align:center;">獲得状況</div>
            <div>${sourceRows.join('')}</div>
        </div>`;
    },

    // キャラ切り替え：MenuAllies.selectedChar も同期して「もどる」時のズレを解消
    switchChar: (dir) => {
        const rarityVal = { N:1, R:2, SR:3, SSR:4, UR:5, EX:6 };
        const chars = [...App.data.characters].sort((a, b) => {
            const aInParty = App.data.party.includes(a.uid);
            const bInParty = App.data.party.includes(b.uid);
            if (aInParty !== bInParty) return bInParty - aInParty;
            if (a.uid === 'p1') return -1;
            if (b.uid === 'p1') return 1;
            const rA = rarityVal[a.rarity] || 0;
            const rB = rarityVal[b.rarity] || 0;
            if (rA !== rB) return rB - rA;
            if (b.level !== a.level) return b.level - a.level;
            return a.charId - b.charId;
        });
        let idx = chars.findIndex(ch => ch.uid === MenuAllyDetail.selectedChar.uid);
        let newIdx = (idx + dir + chars.length) % chars.length;
        
        const nextChar = chars[newIdx];
        MenuAllyDetail.selectedChar = nextChar;
        MenuAllyDetail.currentPortraitExpression = 'normal';
        // ★重要: 基本画面のターゲットも同期させる
        MenuAllies.selectedChar = nextChar;
		MenuAllies.selectedUid = nextChar.uid; // ★追加：UIDを同期
        
        MenuAllyDetail.render();
    },

    changeMainTab: (tab) => {
        MenuAllyDetail.currentMainTab = tab;
        MenuAllyDetail.render();
    },

    // アーカイブのサブタブ切り替え：スクロール位置を保持
    changeArchive: (milestoneId) => {
        const body = document.getElementById('ally-detail-body');
        const scrollPos = body ? body.scrollTop : 0;
        
        MenuAllyDetail.currentArchive = milestoneId;
        MenuAllyDetail.render();
        
        // 再描画後にスクロールを戻す
        const newBody = document.getElementById('ally-detail-body');
        if (newBody) newBody.scrollTop = scrollPos;
    }
};

if (typeof window !== 'undefined') window.MenuAllyDetail = MenuAllyDetail;
