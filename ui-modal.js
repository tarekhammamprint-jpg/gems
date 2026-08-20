// js/ui-modal.js
// نافذة منبثقة (Modal) عامة تستخدمها كل الملفات الأخرى لعرض الرسائل والتأكيدات
import { playSound } from './utils.js';

export const AppModal = {
    show: function (options) {
        const modal = document.getElementById('dynamicModal');
        const title = document.getElementById('dmTitle'); const body = document.getElementById('dmBody');
        const inp1 = document.getElementById('dmInput1'); const inp2 = document.getElementById('dmInput2');
        const btnConfirm = document.getElementById('dmConfirmBtn'); const btnCancel = document.getElementById('dmCancelBtn');
        title.innerHTML = options.title || "رسالة"; body.innerHTML = options.html || '';
        inp1.style.display = 'none'; inp2.style.display = 'none'; inp1.value = ''; inp2.value = '';
        if (options.type === 'login') {
            inp1.style.display = 'block'; inp1.type = 'text'; inp1.placeholder = "اسم المستخدم";
            inp2.style.display = 'block'; inp2.type = 'password'; inp2.placeholder = "كلمة المرور";
        } else if (options.type === 'prompt') {
            inp1.style.display = 'block'; inp1.type = options.inputType || 'number'; inp1.placeholder = options.placeholder || "الكمية...";
            setTimeout(() => inp1.focus(), 100);
        }
        btnConfirm.innerHTML = options.confirmText || "موافق &#x2705;";
        btnConfirm.style.display = options.hideConfirm ? 'none' : 'block';
        btnConfirm.style.background = options.confirmColor || 'linear-gradient(135deg,#ffc94d,#e6a53f)';
        btnConfirm.style.color = (options.confirmColor && options.confirmColor !== '#ffc94d') ? '#fff' : '#1a1250';
        btnConfirm.onclick = () => {
            playSound('click');
            if (options.autoClose !== false) modal.classList.add('hidden');
            if (options.onConfirm) {
                if (options.type === 'login') options.onConfirm(inp1.value.trim(), inp2.value.trim());
                else if (options.type === 'prompt') options.onConfirm(inp1.value);
                else options.onConfirm();
            }
        };
        if (options.showCancel) {
            btnCancel.style.display = 'block'; btnCancel.innerHTML = options.cancelText || "إلغاء &#x274C;";
            btnCancel.onclick = () => { playSound('click'); modal.classList.add('hidden'); if (options.onCancel) options.onCancel(); };
        } else { btnCancel.style.display = 'none'; }
        modal.classList.remove('hidden');
    },
    close: function () { document.getElementById('dynamicModal').classList.add('hidden'); },
    showWait: function (title, msg, onCancelSurrender) {
        this.show({ title: title, html: `<div class="wait-spinner"></div><p>${msg}</p>`, confirmText: "إلغاء الانتظار", onConfirm: onCancelSurrender });
    },
    alert: function (msg) { this.show({ title: "تنبيه &#x26A0;", html: msg }); }
};

export function showDynamicWaitModal(myScore, oppScore, oppName, onSurrender) {
    AppModal.show({
        title: "انتهت حركاتك! &#x23F3;",
        html: `<div class="wait-spinner"></div><p>ننتظر <strong style="color:#ffc94d">${oppName}</strong> لينهي حركاته...</p>
               <div style="display:flex; justify-content:space-around; margin-top:15px; font-size:18px; background:rgba(0,0,0,0.4); padding:10px; border-radius:12px; border:1px solid #3fb8ff;">
                   <div>نقاطك<br><strong style="color:#8affd6">${myScore}</strong></div>
                   <div>${oppName}<br><strong style="color:#ff6fa3" id="waitingOppScore">${oppScore}</strong></div>
               </div>`,
        showCancel: false, confirmText: "انسحاب (خسارة)", confirmColor: "#ff4d5e",
        onConfirm: onSurrender
    });
}

export function updateWaitingScreen(myScore, oppScore, oppName, isWaiting) {
    let bodyEl = document.getElementById('dmBody');
    if (bodyEl && isWaiting) {
        bodyEl.innerHTML = `<div class="wait-spinner"></div><p>ننتظر <strong style="color:#ffc94d">${oppName}</strong> لينهي حركاته...</p>
            <div style="display:flex; justify-content:space-around; margin-top:15px; font-size:18px; background:rgba(0,0,0,0.4); padding:10px; border-radius:12px; border:1px solid #3fb8ff;">
                <div>نقاطك<br><strong style="color:#8affd6">${myScore}</strong></div>
                <div>${oppName}<br><strong style="color:#ff6fa3" id="waitingOppScore">${oppScore}</strong></div>
            </div>`;
    }
}

export function animateMoneyTransfer(winnerIsMe, amount, callback) {
    const myBoxWrapper = document.getElementById('scoreWrapper');
    const oppBoxWrapper = document.getElementById('targetWrapper');
    const startBox = winnerIsMe ? oppBoxWrapper.getBoundingClientRect() : myBoxWrapper.getBoundingClientRect();
    const endBox = winnerIsMe ? myBoxWrapper.getBoundingClientRect() : oppBoxWrapper.getBoundingClientRect();

    if (winnerIsMe) { myBoxWrapper.classList.add('highlight'); oppBoxWrapper.classList.add('lose-highlight'); }
    else { oppBoxWrapper.classList.add('highlight'); myBoxWrapper.classList.add('lose-highlight'); }

    const numCoins = 15; let completed = 0;
    playSound('win');
    if (winnerIsMe) import('./utils.js').then(m => m.fireConfetti(50));

    for (let i = 0; i < numCoins; i++) {
        let coin = document.createElement('div');
        coin.innerHTML = '&#11088;';
        coin.style.position = 'fixed'; coin.style.fontSize = '32px'; coin.style.zIndex = '9999'; coin.style.pointerEvents = 'none';
        coin.style.left = (startBox.left + startBox.width / 2 - 15) + 'px'; coin.style.top = (startBox.top + startBox.height / 2 - 15) + 'px';
        coin.style.transition = `all ${0.6 + Math.random() * 0.4}s cubic-bezier(0.25, 1, 0.5, 1)`;
        let scatterX = (Math.random() - 0.5) * 80; let scatterY = (Math.random() - 0.5) * 80;
        coin.style.transform = `translate(${scatterX}px, ${scatterY}px) scale(0.5) rotate(${Math.random() * 360}deg)`;
        coin.style.opacity = '0';
        document.body.appendChild(coin);
        setTimeout(() => {
            coin.style.opacity = '1'; playSound('coin');
            coin.style.transform = `translate(${endBox.left - startBox.left}px, ${endBox.top - startBox.top}px) scale(1.2) rotate(${Math.random() * 360}deg)`;
        }, 50 + i * 40);
        setTimeout(() => {
            coin.style.opacity = '0'; coin.style.transform += ' scale(0)';
            setTimeout(() => {
                if (coin.parentNode) coin.parentNode.removeChild(coin);
                completed++;
                if (completed === numCoins) {
                    myBoxWrapper.classList.remove('highlight', 'lose-highlight');
                    oppBoxWrapper.classList.remove('highlight', 'lose-highlight');
                    if (callback) callback();
                }
            }, 300);
        }, 800 + i * 40);
    }
}
