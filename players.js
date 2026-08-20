// js/players.js
import { S, STAR, botsData } from './state.js';
import { db, ref, set, update, remove } from './firebase-config.js';
import { getSafeFlag, playSound, fmtStars } from './utils.js';
import { AppModal } from './ui-modal.js';
import { checkSupportEligibility } from './rewards.js';
import { checkAchievements } from './achievements.js';

export function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); playSound('click'); }

export function setFilterTab(tab) {
    S.currentFilterTab = tab;
    document.getElementById('tabAll').classList.remove('active-tab');
    document.getElementById('tabOnline').classList.remove('active-tab');
    if (tab === 'all') document.getElementById('tabAll').classList.add('active-tab');
    else document.getElementById('tabOnline').classList.add('active-tab');
    filterPlayers();
}

export function filterPlayers() {
    let filter = document.getElementById('searchPlayerInput').value.toLowerCase();
    let rows = document.getElementById('playersList').getElementsByClassName('player-row');
    for (let i = 0; i < rows.length; i++) {
        let nameElement = rows[i].getElementsByClassName('p-name-text')[0];
        let statusElement = rows[i].getElementsByClassName('status-dot')[0];
        if (nameElement && statusElement) {
            let txtValue = nameElement.textContent || nameElement.innerText;
            let isOnline = statusElement.classList.contains('online');
            let matchesSearch = txtValue.toLowerCase().indexOf(filter) > -1;
            let matchesTab = S.currentFilterTab === 'all' || (S.currentFilterTab === 'online' && isOnline);
            rows[i].style.display = (matchesSearch && matchesTab) ? "" : "none";
        }
    }
}

export function updatePlayersDOM() {
    if (!S.usersList) return;
    let currentHour = new Date().getHours();
    let timeVar = Math.floor(Date.now() / 15000);
    botsData.forEach((b, index) => {
        let isOnline = ((index + currentHour) % 2 === 0);
        let dynamicBalance = 550 + (((b.name.length * 23) + (index * 41) + (timeVar * 13)) % 3500);
        if (!S.usersList[b.name]) { S.usersList[b.name] = { balance: dynamicBalance, online: isOnline, flag: b.flag, isBot: true, banned: false, level: b.level }; }
        else { S.usersList[b.name].online = isOnline; S.usersList[b.name].isBot = true; S.usersList[b.name].flag = b.flag; S.usersList[b.name].balance = dynamicBalance; }
    });

    let html = '';
    let sorted = Object.keys(S.usersList).sort((a, b) => (S.usersList[b].balance || 0) - (S.usersList[a].balance || 0));
    let myData = S.usersList[S.currentUser] || {};
    let myBlockedList = myData.blocked || {};
    const scoreDisplay = document.getElementById('scoreDisplay');

    sorted.forEach((p, rankIndex) => {
        let pData = S.usersList[p]; let isMe = (p === S.currentUser);
        let pBalance = pData.balance || pData.totalScore || 0; let isOnline = pData.online === true;
        let isBannedGlobally = pData.banned === true;
        let pFlag = getSafeFlag(pData.flag);
        let rankCrown = '';
        if (!isBannedGlobally) {
            if (rankIndex === 0) rankCrown = '&#x1F947; '; else if (rankIndex === 1) rankCrown = '&#x1F948; '; else if (rankIndex === 2) rankCrown = '&#x1F949; ';
        }
        let pLevel = pData.level || 1;
        let pTitle = pLevel > 50 ? '&#x1F409; أسطورة' : pLevel > 20 ? '&#x1F479; زعيم' : pLevel > 10 ? '&#x1F977; محترف' : '&#x1F476; مبتدئ';
        let theirBlockedList = pData.blocked || {};
        let iBlockedThem = myBlockedList[p] === true;
        let theyBlockedMe = theirBlockedList[S.currentUser] === true;

        if (isMe) {
            S.userData.balance = pBalance; S.userData.blocked = myBlockedList;
            S.userData.lastSupportTime = pData.lastSupportTime || 0; S.userData.soloGamesPlayed = pData.soloGamesPlayed || 0;
            if (!S.battleMode) { scoreDisplay.innerHTML = fmtStars(pBalance); scoreDisplay.className = "value money-color"; }
            checkSupportEligibility();
        }

        let dotClass = isOnline ? 'online' : 'offline';
        let actionBtns = '';
        if (isMe) { actionBtns = `<span style="color:#8affd6; font-size:12px;">أنت</span>`; }
        else if (isBannedGlobally) { actionBtns = `<span class="banned-text">ممنوع من اللعب</span>`; }
        else if (iBlockedThem) { actionBtns = `<div class="admin-controls"><button class="ban-btn" onclick="window.togglePersonalBan('${p}', true)" style="background:#2ecc71; color:#000;">فك الحظر الشخصي &#x2705;</button></div>`; }
        else if (theyBlockedMe && !pData.isBot) { actionBtns = `<span style="color:#777; font-size:12px;">غير متاح للتفاعل</span>`; }
        else {
            let btnChallenge = `<button class="challenge-btn" onclick="window.openWagerModal('${p}')">تحدي &#x2694;</button>`;
            let btnGift = `<button class="gift-btn" onclick="window.openGiftModal('${p}')">إهداء &#x1F381;</button>`;
            let btnPersonalBlock = `<button class="ban-btn" onclick="window.togglePersonalBan('${p}', false)">حظر شخصي &#x1F6AB;</button>`;
            actionBtns = `<div class="btn-group">${btnGift}${btnChallenge}</div><div class="admin-controls">${btnPersonalBlock}</div>`;
        }

        let adminBtns = '';
        if (S.currentUser === 'اسلام' && !isMe && !pData.isBot) {
            let globalBanText = isBannedGlobally ? "فك الحظر العام &#x2705;" : "حظر عام &#x1F6A8;";
            adminBtns = `<div class="admin-controls" style="background:rgba(231, 76, 60, 0.2); padding:5px; border-radius:5px; margin-top:5px;">
                <button class="ban-btn" style="background:#e67e22;" onclick="window.toggleGlobalBan('${p}', ${isBannedGlobally})">${globalBanText}</button>
                <button class="del-btn" onclick="window.deletePlayer('${p}')">حذف نهائي &#x1F5D1;</button>
            </div>`;
        }

        let pStatus = isBannedGlobally ? `<span class="banned-text">(حساب مغلق)</span>` : (iBlockedThem ? `<span style="color:#7f8c8d">(محظور من قبلك)</span>` : `الرصيد: ${STAR}${pBalance}`);

        html += `<div class="player-row">
                    <div class="p-name"><span class="p-name-text">${rankCrown}${pFlag} ${p}</span><span class="status-dot ${dotClass}"></span></div>
                    <div><span class="p-title">${pTitle}</span></div>
                    <div class="p-score">${pStatus}</div>
                    ${actionBtns}
                    ${adminBtns}
                 </div>`;
    });

    let pList = document.getElementById('playersList');
    if (pList) { pList.innerHTML = html; filterPlayers(); }
}

export function toggleGlobalBan(targetPlayer, currentlyBanned) {
    let actionText = currentlyBanned ? "فك الحظر العام" : "حظر عام (نهائي)";
    AppModal.show({
        title: `${actionText} &#x26A0;`, html: `هل أنت متأكد من ${actionText} للاعب <strong>${targetPlayer}</strong>؟`,
        showCancel: true, confirmText: 'نعم', confirmColor: currentlyBanned ? '#00e6a8' : '#e74c3c',
        onConfirm: () => { update(ref(db, `users/${targetPlayer}`), { banned: !currentlyBanned }); AppModal.alert(`تمت العملية بنجاح!`); }
    });
}

export function deletePlayer(targetPlayer) {
    AppModal.show({
        title: "حذف حساب نهائي &#x1F5D1;", html: `هل أنت متأكد من مسح حساب <strong>${targetPlayer}</strong> بالكامل من اللعبة؟ (لا يمكن التراجع)`,
        showCancel: true, confirmText: 'نعم، احذف', confirmColor: '#c0392b',
        onConfirm: () => { remove(ref(db, `users/${targetPlayer}`)); AppModal.alert("تم مسح اللاعب من قاعدة البيانات بنجاح!"); }
    });
}

export function togglePersonalBan(targetPlayer, currentlyBlocked) {
    if (currentlyBlocked) { remove(ref(db, `users/${S.currentUser}/blocked/${targetPlayer}`)); }
    else {
        AppModal.show({
            title: "حظر شخصي &#x1F6AB;", html: `هل أنت متأكد من حظر "<strong>${targetPlayer}</strong>" شخصياً؟ لن تراه في القائمة ولن يتمكن من إزعاجك بتحديات أو رسائل.`,
            showCancel: true, confirmText: 'نعم، احظر', confirmColor: '#e74c3c',
            onConfirm: () => { set(ref(db, `users/${S.currentUser}/blocked/${targetPlayer}`), true); }
        });
    }
}

export function openGiftModal(targetPlayer) {
    playSound('click'); document.getElementById('sidebar').classList.remove('open');
    let now = Date.now(); let lastGift = S.userData.lastGiftTime || 0; let cooldown = 24 * 60 * 60 * 1000;
    if (now - lastGift < cooldown) {
        let remaining = cooldown - (now - lastGift);
        let hours = Math.floor(remaining / (1000 * 60 * 60)); let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        return AppModal.alert(`عذراً! يمكنك إرسال هدية واحدة فقط كل 24 ساعة. يرجى المحاولة بعد ${hours} ساعة و ${minutes} دقيقة.`);
    }
    let targetFlag = getSafeFlag(S.usersList[targetPlayer] ? S.usersList[targetPlayer].flag : null);
    AppModal.show({
        title: "إرسال هدية &#x1F381;", html: `إلى صديقك: <strong style="color:#9b59b6;">${targetFlag} ${targetPlayer}</strong>`,
        type: 'prompt', placeholder: "المبلغ بالنجوم", showCancel: true, confirmText: "إرسال &#x1F4B8;", confirmColor: '#9b59b6',
        onConfirm: (amount) => {
            amount = parseInt(amount);
            if (isNaN(amount) || amount <= 0) return AppModal.alert("الرجاء إدخال مبلغ صحيح!");
            if (amount > S.userData.balance) return AppModal.alert("رصيدك لا يكفي لإرسال هذه الهدية!");
            playSound('epic_match');
            let cashback = Math.floor(amount * 0.10);
            S.userData.balance = S.userData.balance - amount + cashback;
            S.userData.lastGiftTime = now;
            S.userData.giftsSent = (S.userData.giftsSent || 0) + 1;
            update(ref(db, `users/${S.currentUser}`), { balance: S.userData.balance, lastGiftTime: now, giftsSent: S.userData.giftsSent });
            if (S.usersList[targetPlayer]) {
                let isTargetOnline = S.usersList[targetPlayer].online === true;
                let targetBalance = S.usersList[targetPlayer].balance || 0;
                update(ref(db, `users/${targetPlayer}`), { balance: targetBalance + amount });
                if (!S.usersList[targetPlayer].isBot) {
                    if (isTargetOnline) { set(ref(db, `users/${targetPlayer}/liveGift`), { from: S.currentUser, amount: amount }); }
                    else { set(ref(db, `users/${targetPlayer}/pendingGift/${Date.now()}`), { from: S.currentUser, amount: amount }); }
                }
            }
            checkSupportEligibility(); checkAchievements();
            if (!S.battleMode) document.getElementById('scoreDisplay').innerHTML = fmtStars(S.userData.balance);
            playSound('win');
            AppModal.show({
                title: "كرمك عاد إليك! &#x1F381;",
                html: `<div class="trophy-icon">&#x1F4E6;</div><h3 style="color:#8affd6; margin: 5px 0;">استرداد 10%</h3><p>تم إرسال ${STAR}${amount} إلى ${targetPlayer} بنجاح.<br>وعاد إليك <strong style="color:#ffc94d">+${STAR}${cashback}</strong> كمكافأة كرم!</p>`,
                confirmText: "رائع! &#x1F970;"
            });
        }
    });
}

// openWagerModal يعتمد على منطق التحدي الموجود في battle.js — يتم ربطه في main.js
// لتفادي أي استيراد دائري بين الملفين.
export function makeOpenWagerModal(challengeSelectedBot, executeChallengeRequest) {
    return function openWagerModal(targetPlayer) {
        playSound('click'); document.getElementById('sidebar').classList.remove('open');
        let targetFlag = getSafeFlag(S.usersList[targetPlayer] ? S.usersList[targetPlayer].flag : null);
        AppModal.show({
            title: "تحدي المعركة &#x2694;", html: `الخصم: <strong style="color:#00e6a8;">${targetFlag} ${targetPlayer}</strong>`,
            type: 'prompt', placeholder: "مبلغ الرهان (نجوم)", showCancel: true, confirmText: "أرسل التحدي &#x2694;",
            onConfirm: (wager) => {
                wager = parseInt(wager);
                let tBal = S.usersList[targetPlayer] ? (S.usersList[targetPlayer].balance || 0) : 0;
                if (isNaN(wager) || wager < 5) return AppModal.alert(`أقل رهان ${STAR}5!`);
                if (wager > S.userData.balance) return AppModal.alert("رصيدك لا يكفي!");
                if (wager > tBal) return AppModal.alert("رصيد الخصم لا يكفي!");
                if (S.usersList[targetPlayer] && S.usersList[targetPlayer].isBot) { challengeSelectedBot(targetPlayer, wager, targetFlag); return; }
                if (!S.usersList[targetPlayer].online) {
                    AppModal.show({ title: 'تأكيد', html: "الخصم يظهر أنه <b>غير متصل</b> (نقطة رمادية). هل ترغب في الإرسال على أي حال؟", showCancel: true, confirmText: 'نعم، أرسل', onConfirm: () => { executeChallengeRequest(targetPlayer, wager); } });
                } else { executeChallengeRequest(targetPlayer, wager); }
            }
        });
    };
}
