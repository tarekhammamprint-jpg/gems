// js/battle.js
import { S, STAR, botsData } from './state.js';
import { db, ref, set, get, update, remove, onDisconnect } from './firebase-config.js';
import { getSafeFlag, playSound, fmtStars, fireConfetti } from './utils.js';
import { AppModal, showDynamicWaitModal, updateWaitingScreen, animateMoneyTransfer } from './ui-modal.js';
import { checkAchievements } from './achievements.js';
import { progressChallenge } from './challenges.js';
import { checkSupportEligibility } from './rewards.js';
import { renderChat, showChatPreview } from './chat.js';
// استيراد دائري مقصود مع board-engine.js — آمن لأنه يُستخدم داخل دوال تُستدعى لاحقاً فقط
import { createBoard, initLevel } from './board-engine.js';

let scoreDisplay, movesDisplay, targetDisplay, scoreLabel, targetLabel;
export function bindBattleDom() {
    scoreDisplay = document.getElementById('scoreDisplay');
    movesDisplay = document.getElementById('movesDisplay');
    targetDisplay = document.getElementById('targetDisplay');
    scoreLabel = document.getElementById('scoreLabel');
    targetLabel = document.getElementById('targetLabel');
}

export function startRandomMatch() {
    playSound('click');
    let wager = 100;
    if (S.userData.balance < wager) return AppModal.alert(`رصيدك لا يكفي! تحتاج إلى ${STAR}100 على الأقل للعب العشوائي.`);
    executeRandomSearch(wager);
}

function executeRandomSearch(wager) {
    S.userData.isSearching = true;
    update(ref(db, `users/${S.currentUser}`), { isSearching: true, searchWager: wager });
    let pool = botsData.map(b => ({ name: b.name, flag: b.flag }));
    Object.keys(S.usersList).forEach(p => { if (p !== S.currentUser) pool.push({ name: p, flag: getSafeFlag(S.usersList[p].flag) }); });

    AppModal.show({
        title: "جاري البحث...",
        html: `<p style="font-size:13px; color:#ddd;">نبحث عن لاعبين حقيقيين أولاً...</p>
               <div id="rouletteBox" style="font-size: 24px; font-weight: bold; margin: 20px 0; padding: 20px; background: rgba(0,0,0,0.4); border-radius: 12px; border: 2px solid #3fb8ff; color: #fff;">
                <span id="rFlag">&#x1F30D;</span> <span id="rName">نبحث...</span>
               </div>`,
        showCancel: true, cancelText: "إلغاء البحث", autoClose: false,
        onCancel: () => {
            S.userData.isSearching = false;
            update(ref(db, `users/${S.currentUser}`), { isSearching: false, searchWager: null });
            if (S.rouletteInterval) clearInterval(S.rouletteInterval);
            if (S.rouletteTimeout) clearTimeout(S.rouletteTimeout);
        }
    });

    let rFlag = document.getElementById('rFlag'); let rName = document.getElementById('rName'); let rBox = document.getElementById('rouletteBox');
    S.rouletteInterval = setInterval(() => {
        let randUser = pool[Math.floor(Math.random() * pool.length)];
        if (rFlag && rName) { rFlag.innerHTML = getSafeFlag(randUser.flag); rName.innerText = randUser.name; playSound('tick'); }
    }, 100);

    S.rouletteTimeout = setTimeout(() => {
        if (!S.userData.isSearching) return;
        clearInterval(S.rouletteInterval);
        let availableRealPlayers = Object.keys(S.usersList).filter(p => {
            let pd = S.usersList[p];
            return p !== S.currentUser && !pd.isBot && pd.online && pd.isSearching && pd.searchWager === wager && pd.balance >= wager;
        });
        let finalTarget; let isBotTarget = false;
        let validBots = botsData.filter(b => { let bBal = S.usersList[b.name] ? (S.usersList[b.name].balance || 0) : 0; return bBal >= wager; });

        if (availableRealPlayers.length > 0) {
            let targetPlayerName = availableRealPlayers[Math.floor(Math.random() * availableRealPlayers.length)];
            finalTarget = { name: targetPlayerName, flag: getSafeFlag(S.usersList[targetPlayerName].flag) };
        } else if (validBots.length > 0) { finalTarget = validBots[Math.floor(Math.random() * validBots.length)]; isBotTarget = true; }
        else { finalTarget = botsData[Math.floor(Math.random() * botsData.length)]; isBotTarget = true; update(ref(db, `users/${finalTarget.name}`), { balance: wager + 200 }); }

        if (rFlag && rName && rBox) {
            rFlag.innerHTML = getSafeFlag(finalTarget.flag); rName.innerText = finalTarget.name;
            rBox.style.background = 'rgba(0, 230, 168, 0.25)'; rBox.style.borderColor = '#00e6a8';
            rBox.style.transform = 'scale(1.05)'; rBox.style.transition = 'all 0.3s ease';
        }
        playSound('epic_match');
        setTimeout(() => {
            AppModal.close();
            AppModal.show({
                title: "تأكيد اللعب &#x2694;",
                html: `المنافس: <strong>${getSafeFlag(finalTarget.flag)} ${finalTarget.name}</strong><br>الرهان: <strong style="color:#8affd6">${STAR}${wager}</strong>`,
                showCancel: true, cancelText: "إلغاء &#x274C;", confirmText: "بدء &#x1F680;", confirmColor: '#00e6a8',
                onConfirm: () => { if (isBotTarget) challengeSelectedBot(finalTarget.name, wager, finalTarget.flag, true); else executeChallengeRequest(finalTarget.name, wager); },
                onCancel: () => { S.userData.isSearching = false; update(ref(db, `users/${S.currentUser}`), { isSearching: false, searchWager: null }); }
            });
        }, 1000);
    }, 3000);
}

export function challengeSelectedBot(botName, wager, botFlag, fromRandom = false) {
    botFlag = getSafeFlag(botFlag);
    let isABot = false;
    botsData.forEach(b => { if (b.name === botName) isABot = true; });
    if (isABot) {
        playSound('click');
        if (!fromRandom) AppModal.showWait("جاري إرسال التحدي...", `في انتظار رد ${botName}`, surrenderBattle);
        setTimeout(() => {
            let rejectChance = fromRandom ? 0 : 0.15;
            if (Math.random() < rejectChance) {
                AppModal.close(); playSound('error');
                AppModal.show({
                    title: "مرفوض &#x1F6A8;", html: `لقد رفض <strong>${botName}</strong> طلب التحدي. يبدو أنه مشغول بمباراة أخرى الآن!`,
                    confirmText: "حسناً &#x2705;",
                    onConfirm: () => { S.userData.isSearching = false; update(ref(db, `users/${S.currentUser}`), { isSearching: false, searchWager: null }); }
                });
            } else {
                AppModal.close(); playSound('alert');
                S.battleRole = 'challenger'; S.currentBattleWager = wager; S.opponentName = botName;
                startBotBattle(wager, botName, botFlag);
            }
        }, fromRandom ? 500 : 1500 + Math.random() * 1500);
        return;
    }
    executeChallengeRequest(botName, wager);
}

export function executeChallengeRequest(targetName, wager) {
    S.opponentName = targetName; S.battleRole = 'challenger'; S.currentBattleWager = wager;
    const targetBattleRef = ref(db, `users/${targetName}/battle`);
    get(targetBattleRef).then(snap => {
        if (snap.exists() && (snap.val().status === 'pending' || snap.val().status === 'accepted')) { return AppModal.alert("الخصم مشغول بتحدي آخر!"); }
        set(targetBattleRef, { challenger: S.currentUser, challenged: targetName, wager: wager, status: 'pending', p1Score: 0, p2Score: 0, p1Done: false, p2Done: false });
        if (S.unsubTargetBattle) S.unsubTargetBattle();
        S.unsubTargetBattle = (async () => {
            const { onValue } = await import('./firebase-config.js');
            return onValue(targetBattleRef, (snapTarget) => {
                if (!snapTarget.exists()) {
                    if (S.battleMode && !S.isBotMatch) { S.battleMode = false; AppModal.show({ title: "انتهت المعركة", html: "تم إنهاء المعركة بنجاح.", confirmText: "حسناً", onConfirm: resetToNormalMode }); }
                    return;
                }
                let battle = snapTarget.val();
                if (battle.status === 'accepted' && !S.battleMode) { AppModal.close(); playSound('alert'); startBattleMode(battle.wager, battle.challenged); }
                if (battle.status === 'declined') {
                    AppModal.show({ title: "مرفوض", html: "لقد رفض الخصم طلب التحدي." }); playSound('error');
                    resetToNormalMode(); if (S.unsubTargetBattle) S.unsubTargetBattle(); setTimeout(() => { remove(targetBattleRef); }, 1000);
                }
                if (S.battleMode && battle.status === 'accepted' && S.battleRole === 'challenger') {
                    targetDisplay.innerText = Math.max(0, battle.p2Score);
                    let myScore = battle.p1Score || 0; let oppScore = battle.p2Score || 0;
                    if (battle.p1Done && !battle.p2Done && !S.isWaitingForOpponent) { S.isWaitingForOpponent = true; showDynamicWaitModal(myScore, oppScore, targetName, surrenderBattle); }
                    else if (S.isWaitingForOpponent && battle.p1Done && !battle.p2Done) { updateWaitingScreen(myScore, oppScore, targetName, S.isWaitingForOpponent); }
                    else if (battle.p1Done && battle.p2Done) { S.isWaitingForOpponent = false; evaluateBattleResult(battle); }
                }
                if (battle.status === 'forfeited' && S.battleMode && S.battleRole === 'challenger') { handleForfeit(battle); }
                if (S.battleMode && battle.lastMessage && battle.lastMessage.id !== S.lastMsgId) {
                    S.lastMsgId = battle.lastMessage.id; renderChat(battle.lastMessage);
                    if (battle.lastMessage.sender !== S.currentUser) { playSound('msg_pop'); if (document.getElementById('chatPanel').style.display !== 'flex') showChatPreview(battle.lastMessage); }
                }
            });
        })();
        AppModal.showWait("جاري إرسال التحدي...", `في انتظار رد ${targetName}`, surrenderBattle);
    });
}

export function acceptChallenge(wager, challenger) {
    playSound('click'); S.battleRole = 'challenged'; S.currentBattleWager = wager; S.opponentName = challenger;
    update(ref(db, `users/${S.currentUser}/battle`), { status: 'accepted' });
    playSound('alert'); startBattleMode(wager, challenger);
}

export function declineChallenge() {
    playSound('error'); update(ref(db, `users/${S.currentUser}/battle`), { status: 'declined' });
    setTimeout(() => { remove(ref(db, `users/${S.currentUser}/battle`)); }, 2000);
}

export function surrenderBattle() {
    try {
        if (!S.battleMode) return; playSound('error');
        AppModal.show({
            title: "تأكيد الانسحاب &#x26A0;", html: `هل أنت متأكد؟ سيتم خصم <strong style="color:#ff6fa3">${STAR}${S.currentBattleWager}</strong> من رصيدك كعقوبة!`,
            showCancel: true, confirmText: 'نعم، أنسحب', confirmColor: '#ff4d5e', onConfirm: () => {
                if (S.isBotMatch) {
                    if (S.botInterval) clearTimeout(S.botInterval);
                    S.battleMode = false; S.isBotMatch = false; S.battleEnded = true;
                    let botData = S.usersList[S.opponentName];
                    if (botData) update(ref(db, `users/${S.opponentName}`), { balance: (botData.balance || 0) + S.currentBattleWager });
                    updateMyBalance(-S.currentBattleWager);
                    animateMoneyTransfer(false, S.currentBattleWager, () => { resetToNormalMode(); });
                } else {
                    let targetBattlePath = `users/${S.battleRole === 'challenged' ? S.currentUser : S.opponentName}/battle`;
                    update(ref(db, targetBattlePath), { status: 'forfeited', disconnectedUser: S.currentUser }).catch(e => console.log(e));
                }
            }
        });
    } catch (e) { console.log(e); }
}

export function requestRematch(opponent, wager, isBotMatch) {
    AppModal.close();
    if (S.userData.balance < wager) return AppModal.alert("رصيدك لا يكفي للانتقام!");
    let tBal = S.usersList[opponent] ? (S.usersList[opponent].balance || 0) : 0;
    if (wager > tBal) return AppModal.alert("رصيد الخصم لا يكفي للانتقام!");
    if (isBotMatch) {
        let botFlag = '&#127757;';
        let botObj = botsData.find(b => b.name === opponent);
        if (botObj) botFlag = botObj.flag;
        challengeSelectedBot(opponent, wager, botFlag, true);
    } else { executeChallengeRequest(opponent, wager); }
}

export function handleOpponentDisconnect() {
    if (!S.battleMode || S.isBotMatch) return;
    let targetBattlePath = `users/${S.battleRole === 'challenged' ? S.currentUser : S.opponentName}/battle`;
    update(ref(db, targetBattlePath), { status: 'forfeited', disconnectedUser: S.opponentName }).catch(e => console.log(e));
}

export function handleForfeit(battle) {
    try {
        if (!S.battleMode) return;
        S.battleMode = false; S.isWaitingForOpponent = false; AppModal.close();
        if (S.battlePingInterval) clearInterval(S.battlePingInterval);
        if (S.battleMonitorInterval) clearInterval(S.battleMonitorInterval);
        if (S.disconnectRef) S.disconnectRef.cancel();

        if (battle.disconnectedUser === S.opponentName) {
            updateMyBalance(battle.wager);
            S.userData.totalWins = (S.userData.totalWins || 0) + 1;
            update(ref(db, `users/${S.currentUser}`), { totalWins: S.userData.totalWins });
            progressChallenge('winbattle', 1, true); checkAchievements();
            animateMoneyTransfer(true, battle.wager, () => {
                AppModal.show({ title: "هروب الخصم! &#x1F3C3;", html: `لقد انقطع الاتصال بالخصم أثناء المعركة!<br>تم إعلان فوزك، وربحت <strong style="color:#8affd6">+${STAR}${battle.wager}</strong>!`, confirmText: "عظيم!", onConfirm: resetToNormalMode });
            });
            get(ref(db, `users/${S.opponentName}`)).then(snap => {
                if (snap.exists()) { let oppBal = snap.val().balance || 0; update(ref(db, `users/${S.opponentName}`), { balance: Math.max(0, oppBal - battle.wager) }).catch(e => console.log(e)); }
            });
            let targetBattlePath = `users/${S.battleRole === 'challenged' ? S.currentUser : S.opponentName}/battle`;
            setTimeout(() => { remove(ref(db, targetBattlePath)); }, 2000);
        } else {
            updateMyBalance(-battle.wager);
            animateMoneyTransfer(false, battle.wager, () => {
                AppModal.show({ title: "لقد انسحبت &#x1F3F3;", html: `لقد انقطع اتصالك أو هربت، فخسرت <strong style="color:#ff6fa3">-${STAR}${battle.wager}</strong> لصالح الخصم.`, confirmText: "متابعة", onConfirm: resetToNormalMode });
            });
        }
    } catch (e) { console.log(e); }
}

/* ============ منطق البوت: عادل بالكامل، بدون تحيز مفروض ============
   البوت يلعب بمستوى مهارة قريب من مستوى اللاعب، والنتيجة تُحسم فعلياً
   بالأداء العشوائي الطبيعي لكل طرف، دون أي تلاعب لصالح "البيت". */
export function startBotBattle(wager, botName, botFlag) {
    S.userData.isSearching = false; update(ref(db, `users/${S.currentUser}`), { isSearching: false, searchWager: null });
    S.battleEnded = false; S.battleMode = true; S.isBotMatch = true; S.lastMsgId = 0; S.isWaitingForOpponent = false;
    S.botDone = false; S.playerDone = false; S.botScore = 0; S.botMoves = 25;

    document.getElementById('chatMessages').innerHTML = ''; document.getElementById('chatPreviewBubble').classList.add('hidden'); document.getElementById('chatBadge').style.display = 'none';
    S.moves = 25; S.currentLevelScore = 0; S.currentBattleWager = wager; S.opponentName = botName;

    document.getElementById('wagerBox').style.display = 'block'; document.getElementById('wagerDisplay').innerText = fmtStars(wager);
    scoreLabel.innerText = "نقاطك"; scoreDisplay.innerHTML = "0"; scoreDisplay.className = "value";
    targetLabel.innerHTML = `${getSafeFlag(botFlag)} ${botName}`; targetDisplay.innerText = "0"; targetDisplay.classList.add('vs-mode'); movesDisplay.innerHTML = S.moves;

    setBattleUIVisible(true);
    S.hasUsedSkill = false;
    let ultBtn = document.getElementById('ultimateBtn'); if (ultBtn) ultBtn.disabled = false;
    document.getElementById('skillBar').style.display = 'flex';
    checkSupportEligibility();

    if (S.botInterval) clearTimeout(S.botInterval);

    let botLevel = 1;
    let botObj = botsData.find(b => b.name === botName);
    if (botObj) botLevel = botObj.level;
    let playerLevel = S.userData.level || 1;
    let skillRatio = Math.max(0.6, Math.min(1.4, botLevel / Math.max(playerLevel, 1)));

    function botPlayNextMove() {
        if (!S.battleMode || !S.isBotMatch) return;
        if (S.botMoves > 0) {
            S.botMoves--;
            let basePoints = 10 + Math.floor(Math.random() * 35);
            let pointsToAdd = Math.max(5, Math.round(basePoints * skillRatio));
            S.botScore += pointsToAdd;
            targetDisplay.innerText = S.botScore;

            if (S.playerDone) updateWaitingScreen(S.currentLevelScore, S.botScore, botName, S.isWaitingForOpponent);

            if (S.botMoves === 12) {
                const midStickers = ['&#x1F608;', '&#x1F525;', '&#x1F4A5;', '&#x1F60E;', '&#x1F480;'];
                let s = midStickers[Math.floor(Math.random() * midStickers.length)];
                renderChat({ sender: botName, text: s, isSticker: true }); playSound('msg_pop'); showChatPreview({ sender: botName, text: s, isSticker: true });
            }

            if (S.botMoves <= 0) {
                S.botDone = true;
                if (S.playerDone) { AppModal.close(); setTimeout(() => evaluateBotBattleResult(), 500); }
            } else {
                let nextMoveTime = 900 + Math.random() * 1400;
                S.botInterval = setTimeout(botPlayNextMove, nextMoveTime);
            }
        }
    }
    S.botInterval = setTimeout(botPlayNextMove, 1500);
    createBoard();
}

export function startBattleMode(wager, opponent) {
    S.userData.isSearching = false; update(ref(db, `users/${S.currentUser}`), { isSearching: false });
    S.battleEnded = false; S.battleMode = true; S.lastMsgId = 0; S.isWaitingForOpponent = false; document.getElementById('chatMessages').innerHTML = '';
    document.getElementById('chatPreviewBubble').classList.add('hidden'); document.getElementById('chatBadge').style.display = 'none';
    S.moves = 25; S.currentLevelScore = 0;
    document.getElementById('wagerBox').style.display = 'block'; document.getElementById('wagerDisplay').innerText = fmtStars(wager);
    scoreLabel.innerText = "نقاطك"; scoreDisplay.innerHTML = "0"; scoreDisplay.className = "value";
    let oppFlag = getSafeFlag(S.usersList[opponent] ? S.usersList[opponent].flag : null);
    targetLabel.innerHTML = `${oppFlag} ${opponent}`; targetDisplay.innerText = "0"; targetDisplay.classList.add('vs-mode'); movesDisplay.innerHTML = S.moves;

    setBattleUIVisible(true);
    S.hasUsedSkill = false;
    let ultBtn = document.getElementById('ultimateBtn'); if (ultBtn) ultBtn.disabled = false;
    document.getElementById('skillBar').style.display = 'flex';
    checkSupportEligibility();

    if (S.battlePingInterval) clearInterval(S.battlePingInterval);
    if (S.battleMonitorInterval) clearInterval(S.battleMonitorInterval);
    S.battlePingInterval = setInterval(() => { if (S.amIConnected) update(ref(db, `users/${S.currentUser}`), { battlePing: Date.now() }); }, 3000);
    S.lastOpponentPingTime = Date.now(); S.lastOpponentPingValue = null;
    S.battleMonitorInterval = setInterval(() => {
        if (!S.battleMode || !S.opponentName) return;
        if (!S.amIConnected) { S.lastOpponentPingTime = Date.now(); return; }
        let oppData = S.usersList[S.opponentName];
        if (oppData) {
            if (oppData.battlePing !== S.lastOpponentPingValue) { S.lastOpponentPingValue = oppData.battlePing; S.lastOpponentPingTime = Date.now(); }
            else { if (Date.now() - S.lastOpponentPingTime > 12000) handleOpponentDisconnect(); }
        }
    }, 2000);

    let targetBattlePath = `users/${S.battleRole === 'challenged' ? S.currentUser : S.opponentName}/battle`;
    S.disconnectRef = onDisconnect(ref(db, targetBattlePath)); S.disconnectRef.update({ status: 'forfeited', disconnectedUser: S.currentUser });
    createBoard();
}

export function syncScoreToFirebase() {
    if (!S.battleMode) return;
    let targetBattlePath = `users/${S.battleRole === 'challenged' ? S.currentUser : S.opponentName}/battle`;
    update(ref(db, targetBattlePath), S.battleRole === 'challenger' ? { p1Score: S.currentLevelScore } : { p2Score: S.currentLevelScore }).catch(e => console.log(e));
}

export function endBattleMode() {
    try {
        if (S.battleEnded) return;
        S.battleEnded = true;
        if (S.isBotMatch) {
            S.playerDone = true;
            if (!S.botDone) { S.isWaitingForOpponent = true; showDynamicWaitModal(S.currentLevelScore, S.botScore, S.opponentName, surrenderBattle); }
            else { setTimeout(() => evaluateBotBattleResult(), 500); }
        } else {
            syncScoreToFirebase();
            let targetBattlePath = `users/${S.battleRole === 'challenged' ? S.currentUser : S.opponentName}/battle`;
            update(ref(db, targetBattlePath), S.battleRole === 'challenger' ? { p1Done: true } : { p2Done: true }).catch(e => console.log(e));
        }
    } catch (e) { console.log(e); }
}

function evaluateBotBattleResult() {
    S.battleMode = false; S.isBotMatch = false; S.isWaitingForOpponent = false; AppModal.close();
    setBattleUIVisible(false);
    let myScore = S.currentLevelScore; let oppScore = S.botScore;
    let won = myScore > oppScore; let draw = myScore === oppScore;

    if (draw) { playSound('error'); AppModal.show({ title: "تعادل! &#x1F91D;", html: `كلاكما جمع <strong>${myScore}</strong> نقطة.<br>عادت النجوم المُراهن بها سالمة.`, onConfirm: () => resetToNormalMode() }); }
    else if (won) {
        updateMyBalance(S.currentBattleWager);
        S.userData.totalWins = (S.userData.totalWins || 0) + 1;
        update(ref(db, `users/${S.currentUser}`), { totalWins: S.userData.totalWins });
        progressChallenge('winbattle', 1, true); checkAchievements();
        let botData = S.usersList[S.opponentName];
        if (botData) update(ref(db, `users/${S.opponentName}`), { balance: Math.max(0, (botData.balance || 0) - S.currentBattleWager) });
        animateMoneyTransfer(true, S.currentBattleWager, () => {
            AppModal.show({ title: "انتصار ساحق! &#x1F3C6;", html: `نقاطك: <strong>${myScore}</strong> | ${S.opponentName}: <strong>${oppScore}</strong><br>ربحت <strong style="color:#8affd6">+${STAR}${S.currentBattleWager}</strong>!`, confirmText: "عظيم!", onConfirm: () => resetToNormalMode() });
        });
    } else {
        updateMyBalance(-S.currentBattleWager);
        let botData = S.usersList[S.opponentName];
        if (botData) update(ref(db, `users/${S.opponentName}`), { balance: (botData.balance || 0) + S.currentBattleWager });
        animateMoneyTransfer(false, S.currentBattleWager, () => {
            let rematchHtml = `<br><br><button onclick="window.requestRematch('${S.opponentName}', ${S.currentBattleWager * 2}, true)" style="background:linear-gradient(135deg,#ff3d78,#c92836); color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%;">طلب انتقام بـ ${STAR}${S.currentBattleWager * 2} &#x1F525;</button>`;
            AppModal.show({ title: "لقد خسرت &#x1F494;", html: `نقاطك: <strong>${myScore}</strong> | ${S.opponentName}: <strong>${oppScore}</strong><br>خسرت <strong style="color:#ff6fa3">-${STAR}${S.currentBattleWager}</strong>.${rematchHtml}`, confirmText: "حسناً", onConfirm: () => resetToNormalMode() });
        });
    }
}

export function evaluateBattleResult(battle) {
    if (!S.battleMode) return;
    S.battleMode = false; S.isWaitingForOpponent = false; AppModal.close();
    setBattleUIVisible(false);
    if (S.battlePingInterval) clearInterval(S.battlePingInterval);
    if (S.battleMonitorInterval) clearInterval(S.battleMonitorInterval);
    if (S.disconnectRef) S.disconnectRef.cancel();

    let myScore = S.battleRole === 'challenger' ? battle.p1Score : battle.p2Score;
    let oppScore = S.battleRole === 'challenger' ? battle.p2Score : battle.p1Score;
    let won = myScore > oppScore; let draw = myScore === oppScore;

    if (draw) { playSound('error'); AppModal.show({ title: "تعادل! &#x1F91D;", html: `كلاكما جمع <strong>${myScore}</strong> نقطة.<br>عادت النجوم المُراهن بها سالمة.`, onConfirm: () => resetToNormalMode() }); }
    else if (won) {
        updateMyBalance(battle.wager);
        S.userData.totalWins = (S.userData.totalWins || 0) + 1;
        update(ref(db, `users/${S.currentUser}`), { totalWins: S.userData.totalWins });
        progressChallenge('winbattle', 1, true); checkAchievements();
        animateMoneyTransfer(true, battle.wager, () => {
            AppModal.show({ title: "انتصار ساحق! &#x1F3C6;", html: `نقاطك: <strong>${myScore}</strong> | الخصم: <strong>${oppScore}</strong><br>ربحت <strong style="color:#8affd6">+${STAR}${battle.wager}</strong>!`, confirmText: "عظيم!", onConfirm: () => resetToNormalMode() });
        });
    } else {
        updateMyBalance(-battle.wager);
        animateMoneyTransfer(false, battle.wager, () => {
            let rematchHtml = `<br><br><button onclick="window.requestRematch('${S.opponentName}', ${battle.wager * 2}, false)" style="background:linear-gradient(135deg,#ff3d78,#c92836); color:white; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%;">طلب انتقام بـ ${STAR}${battle.wager * 2} &#x1F525;</button>`;
            AppModal.show({ title: "لقد خسرت &#x1F494;", html: `نقاطك: <strong>${myScore}</strong> | الخصم: <strong>${oppScore}</strong><br>خسرت <strong style="color:#ff6fa3">-${STAR}${battle.wager}</strong>.${rematchHtml}`, confirmText: "حسناً", onConfirm: () => resetToNormalMode() });
        });
    }
    if (S.unsubTargetBattle) S.unsubTargetBattle();
    if (S.battleRole === 'challenged') setTimeout(() => { remove(ref(db, `users/${S.currentUser}/battle`)); }, 3000);
}

function setBattleUIVisible(inBattle) {
    document.getElementById('menuBtn').style.display = inBattle ? 'none' : 'block';
    document.getElementById('logoutBtn').style.display = inBattle ? 'none' : 'block';
    document.getElementById('spinBtn').style.display = inBattle ? 'none' : 'block';
    document.getElementById('challengesBtn').style.display = inBattle ? 'none' : 'block';
    document.getElementById('achBtn').style.display = inBattle ? 'none' : 'block';
    document.getElementById('surrenderBtn').style.display = inBattle ? 'block' : 'none';
    document.getElementById('chatBtn').style.display = inBattle ? 'block' : 'none';
    if (!inBattle) { document.getElementById('chatPanel').style.display = 'none'; document.getElementById('chatPreviewBubble').classList.add('hidden'); document.getElementById('chatBadge').style.display = 'none'; document.getElementById('wagerBox').style.display = 'none'; document.getElementById('skillBar').style.display = 'none'; }
}

function updateMyBalance(amount) {
    S.userData.balance += amount;
    if (S.userData.balance < 0) S.userData.balance = 0;
    update(ref(db, `users/${S.currentUser}`), { balance: S.userData.balance }).catch(e => console.log(e));
    checkSupportEligibility(); checkAchievements();
    if (!S.battleMode) scoreDisplay.innerHTML = fmtStars(S.userData.balance);
}

export function resetToNormalMode() {
    S.battleMode = false; S.battleRole = null; S.isWaitingForOpponent = false; S.userData.isSearching = false; S.isBotMatch = false; S.battleEnded = false;
    update(ref(db, `users/${S.currentUser}`), { isSearching: false }).catch(e => console.log(e));
    if (S.botInterval) clearTimeout(S.botInterval);
    if (S.battlePingInterval) clearInterval(S.battlePingInterval);
    if (S.battleMonitorInterval) clearInterval(S.battleMonitorInterval);
    if (S.rouletteInterval) clearInterval(S.rouletteInterval);
    if (S.rouletteTimeout) clearTimeout(S.rouletteTimeout);

    setBattleUIVisible(false);
    scoreLabel.innerText = "رصيد النجوم"; targetLabel.innerText = "المستوى"; scoreDisplay.innerHTML = fmtStars(S.userData.balance); scoreDisplay.className = "value money-color"; targetDisplay.classList.remove('vs-mode');

    checkSupportEligibility();
    initLevel();
}

export function startGameBattleListeners() {
    // يُستدعى مرة واحدة من main.js بعد تسجيل الدخول — راجع main.js لسياق الاستماع الكامل لقاعدة البيانات
}
