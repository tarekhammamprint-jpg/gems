// js/main.js
// نقطة الدخول الرئيسية: تربط كل الوحدات ببعضها وتكشف دوال onclick على window
import { S, STAR } from './state.js';
import { db, ref, get, remove, update, onValue, onDisconnect, set } from './firebase-config.js';
import { getSafeFlag, playSound, buildStarfield, fireConfetti } from './utils.js';
import { AppModal } from './ui-modal.js';
import { showLoginScreen, logout, editUserName, editPassword, toggleProfileMenu } from './auth.js';
import { openSpinWheel, claimSupport, checkSupportEligibility } from './rewards.js';
import { checkAchievements, openAchievements } from './achievements.js';
import { ensureDailyChallenges, openDailyChallenges, claimChallenge } from './challenges.js';
import {
    toggleSidebar, setFilterTab, filterPlayers, updatePlayersDOM,
    toggleGlobalBan, deletePlayer, togglePersonalBan, openGiftModal, makeOpenWagerModal
} from './players.js';
import { toggleChat, submitTextChat, sendChat, renderChat, showChatPreview } from './chat.js';
import { bindBoardDom, initLevel, useUltimateStrike } from './board-engine.js';
import {
    bindBattleDom, startRandomMatch, challengeSelectedBot, executeChallengeRequest,
    acceptChallenge, declineChallenge, surrenderBattle, handleForfeit,
    evaluateBattleResult, requestRematch, resetToNormalMode
} from './battle.js';

/* ============ ربط الأدوات ببعضها (لتفادي أي استيراد دائري بين الملفات) ============ */
const openWagerModal = makeOpenWagerModal(challengeSelectedBot, executeChallengeRequest);

/* ============ حقل النجوم في الخلفية ============ */
buildStarfield();

/* ============ الاستماع لقاعدة البيانات (اللاعبين، الهدايا، المعركة الحالية) ============ */
function listenToDatabase() {
    onValue(ref(db, 'users'), (snap) => { if (snap.exists()) { S.usersList = snap.val() || {}; updatePlayersDOM(); } });
    if (S.domUpdateInterval) clearInterval(S.domUpdateInterval);
    S.domUpdateInterval = setInterval(() => { updatePlayersDOM(); }, 15000);

    onValue(ref(db, `users/${S.currentUser}/liveGift`), (snap) => {
        if (snap.exists()) {
            let gift = snap.val(); playSound('win'); fireConfetti(25);
            AppModal.show({
                title: "هدية جديدة وصلت! &#x1F381;", html: `من: <strong style="color:#9b59b6; font-size:18px;">${gift.from}</strong><br>المبلغ: <strong style="color:#8affd6; font-size:22px;">${STAR}${gift.amount}</strong>!`,
                confirmText: "رائع! شكراً &#x1F970;", confirmColor: '#9b59b6',
                onConfirm: () => { remove(ref(db, `users/${S.currentUser}/liveGift`)); }
            });
        }
    });

    onValue(ref(db, `users/${S.currentUser}/battle`), (snap) => {
        if (!snap.exists()) {
            if (S.battleMode && S.battleRole === 'challenged' && !S.isBotMatch) {
                AppModal.show({ title: "انتهت المعركة", html: "تم إنهاء المعركة بنجاح.", confirmText: "حسناً &#x2705;", onConfirm: resetToNormalMode });
            }
            return;
        }
        let battle = snap.val();
        if (battle.status === 'pending' && battle.challenged === S.currentUser) {
            let myData = S.usersList[S.currentUser] || {};
            if (myData.blocked && myData.blocked[battle.challenger]) { update(ref(db, `users/${S.currentUser}/battle`), { status: 'declined' }); return; }
            if (S.userData.isSearching) { S.userData.isSearching = false; update(ref(db, `users/${S.currentUser}`), { isSearching: false }); }
            let oppData = S.usersList[battle.challenger] || {}; let oppFlag = getSafeFlag(oppData.flag);
            playSound('alert');
            AppModal.show({
                title: "تأكيد اللعب &#x2694;", html: `المنافس: <strong style="color:#ff6fa3">${oppFlag} ${battle.challenger}</strong><br>الرهان: <strong style="color:#8affd6">${STAR}${battle.wager}</strong>`,
                showCancel: true, confirmText: "بدء &#x1F680;", cancelText: "إلغاء &#x274C;",
                onConfirm: () => { if (S.userData.balance < battle.wager) { declineChallenge(); return AppModal.alert("رصيدك لا يكفي لقبول التحدي!"); } acceptChallenge(battle.wager, battle.challenger); },
                onCancel: () => { declineChallenge(); }
            });
        }
        if (S.battleMode && battle.status === 'accepted' && S.battleRole === 'challenged') {
            document.getElementById('targetDisplay').innerText = Math.max(0, battle.p1Score);
            let myScore = battle.p2Score || 0; let oppScore = battle.p1Score || 0;
            import('./ui-modal.js').then(({ showDynamicWaitModal, updateWaitingScreen }) => {
                if (battle.p2Done && !battle.p1Done && !S.isWaitingForOpponent) { S.isWaitingForOpponent = true; showDynamicWaitModal(myScore, oppScore, battle.challenger, surrenderBattle); }
                else if (S.isWaitingForOpponent && battle.p2Done && !battle.p1Done) { updateWaitingScreen(myScore, oppScore, battle.challenger, S.isWaitingForOpponent); }
                else if (battle.p1Done && battle.p2Done) { S.isWaitingForOpponent = false; evaluateBattleResult(battle); }
            });
        }
        if (battle.status === 'forfeited' && S.battleMode && S.battleRole === 'challenged') { handleForfeit(battle); }
        if (S.battleMode && battle.lastMessage && battle.lastMessage.id !== S.lastMsgId) {
            S.lastMsgId = battle.lastMessage.id; renderChat(battle.lastMessage);
            if (battle.lastMessage.sender !== S.currentUser) { playSound('msg_pop'); if (document.getElementById('chatPanel').style.display !== 'flex') showChatPreview(battle.lastMessage); }
        }
    });
}

/* ============ بدء اللعبة بعد تسجيل الدخول ============ */
function startGame() {
    document.getElementById('playerName').innerText = S.currentUser;
    document.getElementById('playerFlag').innerHTML = getSafeFlag(S.userData.flag);
    remove(ref(db, `users/${S.currentUser}/battle`));
    ensureDailyChallenges();

    onValue(ref(db, '.info/connected'), (snap) => {
        S.amIConnected = snap.val() === true;
        if (S.amIConnected) {
            S.lastOpponentPingTime = Date.now();
            if (S.currentUser) {
                const myOnlineRef = ref(db, `users/${S.currentUser}/online`);
                onDisconnect(myOnlineRef).set(false).then(() => { set(myOnlineRef, true); });
                onDisconnect(ref(db, `users/${S.currentUser}/isSearching`)).set(false);
            }
        }
    });

    onValue(ref(db, `users/${S.currentUser}/banned`), (snap) => {
        if (snap.exists() && snap.val() === true) {
            localStorage.removeItem('candyUser'); localStorage.removeItem('candyPass');
            AppModal.show({ title: "تم حظرك! &#x1F6AB;", html: "لقد تم حظرك من قبل الإدارة لمخالفة القوانين.", confirmText: "خروج", autoClose: false, onConfirm: () => { location.reload(); } });
            set(ref(db, `users/${S.currentUser}/online`), false);
        }
    });

    S.level = S.userData.level || 1;
    listenToDatabase(); initLevel(); playSound('win');

    get(ref(db, `users/${S.currentUser}/pendingGift`)).then((snap) => {
        if (snap.exists()) {
            let gifts = snap.val(); let totalGifts = 0; let senders = [];
            Object.values(gifts).forEach(g => { totalGifts += g.amount; senders.push(g.from); });
            playSound('epic_match'); fireConfetti(30);
            AppModal.show({
                title: "مفاجأة! هدايا لك أثناء غيابك &#x1F381;",
                html: `المرسلون: <strong style="color:#9b59b6;">${[...new Set(senders)].join(' و ')}</strong><br>المبلغ الإجمالي: <strong style="color:#8affd6; font-size:24px;">${STAR}${totalGifts}</strong>!`,
                confirmText: "رائع! استلام &#x1F911;", confirmColor: '#9b59b6',
                onConfirm: () => { remove(ref(db, `users/${S.currentUser}/pendingGift`)); }
            });
        }
    });

    if (!S.botChallengeSent) {
        setTimeout(() => {
            if (!S.battleMode && !S.userData.isSearching) {
                S.botChallengeSent = true;
                import('./state.js').then(({ botsData }) => {
                    let onlineBots = botsData.filter((b, idx) => ((idx + new Date().getHours()) % 2 === 0));
                    let randomBot = onlineBots[Math.floor(Math.random() * onlineBots.length)] || botsData[0];
                    let botBal = S.usersList[randomBot.name] ? (S.usersList[randomBot.name].balance || 500) : 500;
                    let playerBal = S.userData.balance || 0;
                    let maxWager = Math.min(botBal, playerBal, 2000);
                    let wagerOptions = [10, 50, 100, 200, 500, 750, 1000, 1500, 2000];
                    let validWagers = wagerOptions.filter(w => w <= maxWager);
                    let wager = validWagers.length > 0 ? validWagers[Math.floor(Math.random() * validWagers.length)] : 10;
                    playSound('alert');
                    AppModal.show({
                        title: "تحدي جديد! &#x2694;",
                        html: `<strong style="color:#ff6fa3">${getSafeFlag(randomBot.flag)} ${randomBot.name}</strong> يتحداك على <strong style="color:#8affd6">${STAR}${wager}</strong>!`,
                        showCancel: true, confirmText: "قبول &#x2705;", cancelText: "رفض &#x274C;",
                        onConfirm: () => {
                            if (S.userData.balance < wager) return AppModal.alert("رصيدك لا يكفي لقبول التحدي!");
                            AppModal.close(); playSound('alert');
                            S.battleRole = 'challenged'; S.currentBattleWager = wager; S.opponentName = randomBot.name;
                            import('./battle.js').then(m => m.startBotBattle(wager, randomBot.name, getSafeFlag(randomBot.flag)));
                        },
                        onCancel: () => { AppModal.close(); }
                    });
                });
            }
        }, 25000);
    }
}

/* ============ كشف الدوال المطلوبة في onclick="" داخل HTML ============ */
Object.assign(window, {
    toggleSidebar, setFilterTab, filterPlayers,
    toggleProfileMenu, editUserName, editPassword,
    openSpinWheel, claimSupport,
    openAchievements, openDailyChallenges, claimChallenge,
    startRandomMatch, logout, surrenderBattle, useUltimateStrike,
    toggleChat, submitTextChat, sendChat,
    openWagerModal, openGiftModal, togglePersonalBan, toggleGlobalBan, deletePlayer,
    requestRematch, challengeSelectedBot
});

/* ============ بدء التشغيل ============ */
bindBoardDom();
bindBattleDom();
showLoginScreen(startGame);
