#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..', '..');
const sourcePath = path.join(root, 'achievements.js');
const source = fs.readFileSync(sourcePath, 'utf8');
const context = {
  console,
  window: {},
  App: {
    data: { achievements: {} },
    save: () => true
  }
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: sourcePath });
const { AchievementManager, ACHIEVEMENTS_DATA } = context;
if (!AchievementManager || !Array.isArray(ACHIEVEMENTS_DATA) || ACHIEVEMENTS_DATA.length === 0) {
  throw new Error('achievement globals were not initialized');
}

const firstId = String(ACHIEVEMENTS_DATA[0].id);
const staleId = '999999999';

// Stale/retired save-state entry must never produce the main-menu badge.
context.App.data.achievements = {
  [staleId]: { completed: true, claimed: false, claimedRewardVersion: 0, progress: 999 }
};
if (AchievementManager.hasUnclaimed() !== false) {
  throw new Error('stale achievement id incorrectly produces unclaimed notification');
}
if (AchievementManager.getUnclaimedCount() !== 0) {
  throw new Error('stale achievement id incorrectly increases unclaimed count');
}

// A current achievement must still produce the badge.
context.App.data.achievements[firstId].completed = true;
context.App.data.achievements[firstId].claimed = false;
context.App.data.achievements[firstId].claimedRewardVersion = 0;
if (AchievementManager.hasUnclaimed() !== true || AchievementManager.getUnclaimedCount() !== 1) {
  throw new Error('current unclaimed achievement was not detected');
}

// Claiming it must clear the badge even while the stale entry remains in save data.
context.App.data.achievements[firstId].claimedRewardVersion = AchievementManager.getRewardVersion(ACHIEVEMENTS_DATA[0]);
context.App.data.achievements[firstId].claimed = true;
if (AchievementManager.hasUnclaimed() !== false || AchievementManager.getUnclaimedCount() !== 0) {
  throw new Error('notification did not clear after current reward was claimed');
}

console.log(`Achievement notification OK: current master=${ACHIEVEMENTS_DATA.length}, stale ids ignored`);
