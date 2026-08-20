// js/rewards.js
import { S, STAR } from './state.js';
import { db, ref, update } from './firebase-config.js';
import { playSound, fireConfetti, fmtStars } from './utils.js';
import { AppModal } from './ui-modal.js';
import { checkAchievements } from './achievements.js';

export function checkSupportEligibility() {
    const btn = document.getElementById('supportBtn');
    if (S.battleMode) { btn.style.display = 'none'; return; }
    if (S.userData && S.userData.balance < 5) btn.style.display = 'block';
    else btn.style.display = 'none';
}

export function claimSupport() {
    playSound('click');
    let now = Date.now();
    let lastSupport = S.userData.lastSupportTime || 0;
    let cooldown = 3 * 60 * 60 * 1000;
    if (now - lastSupport < cooldown) {
        let remaining = cooldown - (now - lastSupport);
        let hours = Math.floor(remaining / (1000 * 60 * 60));
        let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        AppModal.alert(`عذراً! يجب الانتظار ${hours} ساعة و ${minutes} دقيقة لطلب الدعم مرة أخرى.`);
        return;
    }
    S.userData.lastSupportTime = now;
    S.userData.balance += 20;
    update(ref(db, `users/${S.currentUser}`), { balance: S.userData.balance, lastSupportTime: now });
    checkSupportEligibility();
    if (!S.battleMode) document.getElementById('scoreDisplay').innerHTML = fmtStars(S.userData.balance);
    playSound('win');
    AppModal.show({
        title: "دعم الطوارئ وصل! &#x1F691;",
        html: `<div class="trophy-icon">&#x1F3C6;</div><h3 style="color:#8affd6; margin: 5px 0;">حصلت على ${STAR}20</h3><p>لقد عدت إلى المنافسة بقوة! نتمنى لك حظاً أوفر.</p>`,
        confirmText: "شكراً! &#x1F680;", confirmColor: '#00e6a8'
    });
}

export function openSpinWheel() {
    playSound('click');
    let now = Date.now();
    let lastSpin = S.userData.lastSpinTime || 0;
    let cooldown = 24 * 60 * 60 * 1000;
    if (now - lastSpin < cooldown) {
        let remaining = cooldown - (now - lastSpin);
        let hours = Math.floor(remaining / (1000 * 60 * 60));
        let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        return AppModal.alert(`عذراً! لقد استخدمت لفتك المجانية. عد بعد ${hours} ساعة و ${minutes} دقيقة.`);
    }
    AppModal.show({
        title: "عجلة الحظ &#x1F3A8;",
        html: `<div id="wheelContainer" style="font-size:60px; text-align:center; transition: transform 2s cubic-bezier(0.25, 1, 0.5, 1); margin-bottom:15px;">&#x1F3B2;</div>
               <p style="text-align:center; color:#ddd; font-size:13px;">الجوائز: +⭐1000, +5 مستويات, -⭐100, +⭐1</p>`,
        confirmText: `لف العجلة (مجاناً)`, autoClose: false, showCancel: true,
        onConfirm: () => {
            S.userData.lastSpinTime = now;
            update(ref(db, `users/${S.currentUser}`), { lastSpinTime: now });
            playSound('tick');
            document.getElementById('dmConfirmBtn').style.display = 'none';
            document.getElementById('dmCancelBtn').style.display = 'none';
            let container = document.getElementById('wheelContainer');
            if (container) container.style.transform = `rotate(${360 * 5 + Math.floor(Math.random() * 360)}deg)`;
            setTimeout(() => {
                let r = Math.random(); let resultTitle = ""; let resultMsg = "";
                if (r < 0.1) { S.userData.balance += 1000; resultTitle = "جائزة كبرى! &#x1F4B0;"; resultMsg = `ربحت ${STAR}1000 نجمة!`; playSound('epic_match'); fireConfetti(60); }
                else if (r < 0.3) { S.userData.level = (S.userData.level || 1) + 5; resultTitle = "ترقية خرافية! &#x2B50;"; resultMsg = "تقدمت 5 مستويات دفعة واحدة!"; playSound('win'); fireConfetti(40); }
                else if (r < 0.6) { S.userData.balance = Math.max(0, S.userData.balance - 100); resultTitle = "حظ سيء! &#x1F480;"; resultMsg = `لقد خسرت ${STAR}100 نجمة!`; playSound('error'); }
                else { S.userData.balance += 1; resultTitle = "حظ غريب! &#x1F602;"; resultMsg = "ربحت نجمة واحدة فقط ههههه!"; playSound('match'); }
                update(ref(db, `users/${S.currentUser}`), { balance: S.userData.balance, level: S.userData.level });
                if (!S.battleMode) {
                    document.getElementById('scoreDisplay').innerHTML = fmtStars(S.userData.balance);
                    document.getElementById('targetDisplay').innerHTML = S.userData.level;
                }
                checkAchievements();
                AppModal.show({ title: resultTitle, html: resultMsg, confirmText: "حسناً &#x2705;" });
            }, 2000);
        }
    });
}
