// js/achievements.js
import { S, ACHIEVEMENTS } from './state.js';
import { db, ref, update } from './firebase-config.js';
import { playSound, fireConfetti } from './utils.js';
import { AppModal } from './ui-modal.js';

export function checkAchievements() {
    if (!S.userData.achievements) S.userData.achievements = {};
    let newlyUnlocked = [];
    ACHIEVEMENTS.forEach(a => {
        if (!S.userData.achievements[a.id] && a.check(S.userData)) {
            S.userData.achievements[a.id] = true;
            newlyUnlocked.push(a);
        }
    });
    if (newlyUnlocked.length > 0) {
        update(ref(db, `users/${S.currentUser}/achievements`), S.userData.achievements).catch(e => console.log(e));
        showAchievementPopup(newlyUnlocked);
    }
}

function showAchievementPopup(list) {
    let idx = 0;
    function showNext() {
        if (idx >= list.length) return;
        let a = list[idx]; idx++;
        playSound('badge'); fireConfetti(25);
        AppModal.show({
            title: "إنجاز جديد! &#x1F3C5;",
            html: `<div class="trophy-icon">${a.icon}</div><h3 style="color:#8affd6; margin:5px 0;">${a.name}</h3><p>لقد فتحت إنجازاً جديداً!</p>`,
            confirmText: "رائع! &#x1F31F;",
            onConfirm: showNext
        });
    }
    showNext();
}

export function openAchievements() {
    playSound('click');
    let unlocked = S.userData.achievements || {};
    let html = '<div class="badge-grid">';
    ACHIEVEMENTS.forEach(a => {
        let isUn = !!unlocked[a.id];
        html += `<div class="badge-item ${isUn ? 'unlocked' : ''}"><span class="badge-icon">${a.icon}</span><span class="badge-name">${a.name}</span></div>`;
    });
    html += '</div>';
    AppModal.show({ title: "الإنجازات &#x1F3C5;", html: html, confirmText: "إغلاق" });
}
