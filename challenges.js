// js/challenges.js
import { S, STAR } from './state.js';
import { db, ref, update } from './firebase-config.js';
import { playSound, fireConfetti } from './utils.js';
import { AppModal } from './ui-modal.js';

function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }

function buildDailyChallenges() {
    return {
        date: todayKey(),
        list: [
            { id: 'play3', desc: 'العب ٣ مباريات (فردي أو معركة)', target: 3, progress: 0, reward: 30, done: false, claimed: false },
            { id: 'score300', desc: 'اجمع ٣٠٠ نقطة في مباراة واحدة', target: 300, progress: 0, reward: 25, done: false, claimed: false },
            { id: 'winbattle', desc: 'اربح معركة واحدة ضد خصم', target: 1, progress: 0, reward: 50, done: false, claimed: false },
        ]
    };
}

export function ensureDailyChallenges() {
    if (!S.userData.dailyChallenges || S.userData.dailyChallenges.date !== todayKey()) {
        S.userData.dailyChallenges = buildDailyChallenges();
        update(ref(db, `users/${S.currentUser}`), { dailyChallenges: S.userData.dailyChallenges }).catch(e => console.log(e));
    }
}

export function progressChallenge(id, amount, isMax) {
    ensureDailyChallenges();
    let dc = S.userData.dailyChallenges;
    let ch = dc.list.find(c => c.id === id);
    if (!ch || ch.done) return;
    ch.progress = isMax ? Math.max(ch.progress, amount) : ch.progress + amount;
    if (ch.progress >= ch.target) { ch.progress = ch.target; ch.done = true; }
    update(ref(db, `users/${S.currentUser}/dailyChallenges`), dc).catch(e => console.log(e));
}

export function openDailyChallenges() {
    playSound('click');
    ensureDailyChallenges();
    let dc = S.userData.dailyChallenges;
    let html = '';
    dc.list.forEach(ch => {
        let pct = Math.min(100, (ch.progress / ch.target) * 100);
        html += `<div class="challenge-item ${ch.done ? 'done' : ''}">
            <div class="ch-title"><span>${ch.desc}</span><span class="ch-reward">${STAR}${ch.reward}</span></div>
            <div class="ch-bar-bg"><div class="ch-bar-fill" style="width:${pct}%"></div></div>
            <div class="ch-progress-text">${ch.progress} / ${ch.target}</div>
            ${ch.done && !ch.claimed ? `<button class="claim-btn" onclick="window.claimChallenge('${ch.id}')">استلام المكافأة 🎁</button>` : (ch.claimed ? `<div class="ch-progress-text" style="color:#8affd6">تم الاستلام ✅</div>` : '')}
        </div>`;
    });
    AppModal.show({ title: "التحديات اليومية &#x1F3AF;", html: html, confirmText: "إغلاق" });
}

export function claimChallenge(id) {
    let dc = S.userData.dailyChallenges;
    let ch = dc.list.find(c => c.id === id);
    if (!ch || !ch.done || ch.claimed) return;
    ch.claimed = true;
    S.userData.balance += ch.reward;
    update(ref(db, `users/${S.currentUser}`), { balance: S.userData.balance, dailyChallenges: dc }).catch(e => console.log(e));
    if (!S.battleMode) document.getElementById('scoreDisplay').innerHTML = `${STAR}${S.userData.balance}`;
    playSound('win'); fireConfetti(20);
    openDailyChallenges();
}
