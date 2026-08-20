// js/auth.js
import { S, STAR } from './state.js';
import { db, ref, get, set, update, remove } from './firebase-config.js';
import { getSafeFlag, fetchUserFlag, hashPassword, generateSalt, playSound } from './utils.js';
import { AppModal } from './ui-modal.js';
import { ensureDailyChallenges } from './challenges.js';

export function showLoginScreen(onLoggedIn) {
    let savedUser = localStorage.getItem('candyUser');
    let savedPass = localStorage.getItem('candyPass');
    if (savedUser && savedPass) {
        AppModal.show({ title: "جاري الدخول...", html: '<div class="wait-spinner"></div>', autoClose: false, showCancel: false });
        processLogin(savedUser, savedPass, onLoggedIn);
    } else {
        displayLoginModal(onLoggedIn);
    }
}

function displayLoginModal(onLoggedIn) {
    let audioCtxRef = window.__candyAudioCtx;
    AppModal.show({
        title: "حلوى النجوم &#x1F31F;",
        html: `<div class="login-guide"><strong>كيف تبدأ اللعب؟</strong><br>1. اكتب <span>اسم مستخدم</span>.<br>2. اكتب <span>كلمة مرور</span>.<br>3. اضغط دخول.<br>&#x1F381; <span>هدية:</span> ${STAR}100 للمبتدئين!</div>`,
        type: 'login', confirmText: "دخول / تسجيل حساب", autoClose: false,
        onConfirm: (user, pass) => {
            if (!user || !pass) { AppModal.alert("يرجى كتابة اسم المستخدم وكلمة المرور أولاً!"); displayLoginModal(onLoggedIn); return; }
            AppModal.show({ title: "جاري الدخول...", html: '<div class="wait-spinner"></div>', autoClose: false, showCancel: false });
            processLogin(user, pass, onLoggedIn);
        }
    });
}

async function processLogin(user, pass, onLoggedIn) {
    let myFlag = await fetchUserFlag();
    get(ref(db, `users/${user}`)).then(async (snap) => {
        if (snap.exists()) {
            let data = snap.val();
            if (data.banned) {
                localStorage.removeItem('candyUser'); localStorage.removeItem('candyPass');
                return AppModal.alert("تم حظر هذا الحساب نهائياً من قبل الإدارة! &#x1F6AB;");
            }

            // توافق مع الحسابات القديمة المخزنة بنص صريح: نقوم بترقيتها تلقائياً لتشفير آمن
            let passOk = false;
            if (data.passwordHash && data.salt) {
                let attemptHash = await hashPassword(pass, data.salt);
                passOk = (attemptHash === data.passwordHash);
            } else if (data.password) {
                passOk = (data.password === pass);
                if (passOk) {
                    let newSalt = generateSalt();
                    let newHash = await hashPassword(pass, newSalt);
                    data.passwordHash = newHash; data.salt = newSalt;
                    update(ref(db, `users/${user}`), { passwordHash: newHash, salt: newSalt, password: null }).catch(e => console.log(e));
                }
            }

            if (passOk) {
                localStorage.setItem('candyUser', user); localStorage.setItem('candyPass', pass);
                if (data.balance === undefined) data.balance = data.totalScore || 100;
                if (data.battlesPlayed === undefined) data.battlesPlayed = 0;
                if (data.lastSupportTime === undefined) data.lastSupportTime = 0;
                if (data.soloGamesPlayed === undefined) data.soloGamesPlayed = 0;
                if (data.lastSpinTime === undefined) data.lastSpinTime = 0;
                if (data.lastGiftTime === undefined) data.lastGiftTime = 0;
                if (data.achievements === undefined) data.achievements = {};
                if (data.totalWins === undefined) data.totalWins = 0;
                if (data.bestCombo === undefined) data.bestCombo = 0;
                if (data.giftsSent === undefined) data.giftsSent = 0;
                data.flag = getSafeFlag(data.flag || myFlag);
                update(ref(db, `users/${user}`), { flag: data.flag, isSearching: false, online: true }).catch(e => console.log(e));
                S.currentUser = user; S.userData = data; AppModal.close();
                if (onLoggedIn) onLoggedIn();
            } else {
                localStorage.removeItem('candyUser'); localStorage.removeItem('candyPass');
                AppModal.alert("كلمة المرور خاطئة يا صديقي!");
                displayLoginModal(onLoggedIn);
            }
        } else {
            localStorage.setItem('candyUser', user); localStorage.setItem('candyPass', pass);
            let salt = generateSalt();
            let passwordHash = await hashPassword(pass, salt);
            let newData = { passwordHash, salt, level: 1, balance: 100, battlesPlayed: 0, soloGamesPlayed: 0, online: true, banned: false, flag: myFlag, isSearching: false, lastSupportTime: 0, lastSpinTime: 0, lastGiftTime: 0, achievements: {}, totalWins: 0, bestCombo: 0, giftsSent: 0 };
            set(ref(db, `users/${user}`), newData);
            S.currentUser = user; S.userData = newData; AppModal.close();
            if (onLoggedIn) onLoggedIn();
        }
    }).catch(() => { displayLoginModal(onLoggedIn); });
}

export function logout() {
    localStorage.removeItem('candyUser'); localStorage.removeItem('candyPass');
    if (S.currentUser) set(ref(db, `users/${S.currentUser}/online`), false).then(() => location.reload());
    else location.reload();
}

export function editUserName(e) {
    if (e) e.stopPropagation();
    document.getElementById('userMenu').classList.add('hidden');
    AppModal.show({
        title: "تعديل الاسم &#x270E;", type: 'prompt', inputType: 'text', placeholder: "الاسم الجديد...",
        showCancel: true, confirmText: "حفظ التغيير &#x2705;",
        onConfirm: (newName) => {
            newName = newName.trim();
            if (!newName || newName === S.currentUser) return;
            get(ref(db, `users/${newName}`)).then(snap => {
                if (snap.exists()) { AppModal.alert("هذا الاسم مستخدم مسبقاً، يرجى اختيار اسم آخر."); }
                else {
                    let oldData = { ...S.userData };
                    set(ref(db, `users/${newName}`), oldData).then(() => {
                        remove(ref(db, `users/${S.currentUser}`));
                        S.currentUser = newName;
                        localStorage.setItem('candyUser', newName);
                        document.getElementById('playerName').innerText = newName;
                        AppModal.alert("تم تغيير الاسم بنجاح!");
                    });
                }
            });
        }
    });
}

export function editPassword(e) {
    if (e) e.stopPropagation();
    document.getElementById('userMenu').classList.add('hidden');
    AppModal.show({
        title: "تعديل كلمة المرور &#x1F512;", type: 'prompt', inputType: 'text', placeholder: "كلمة المرور الجديدة...",
        showCancel: true, confirmText: "تحديث &#x2705;",
        onConfirm: async (newPass) => {
            newPass = newPass.trim();
            if (!newPass) return;
            let salt = S.userData.salt || generateSalt();
            let newHash = await hashPassword(newPass, salt);
            update(ref(db, `users/${S.currentUser}`), { passwordHash: newHash, salt: salt }).then(() => {
                localStorage.setItem('candyPass', newPass);
                S.userData.passwordHash = newHash; S.userData.salt = salt;
                AppModal.alert("تم تغيير كلمة المرور بنجاح!");
            });
        }
    });
}

export function toggleProfileMenu(e) {
    if (e) e.stopPropagation();
    playSound('click');
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('hidden');
    if (!menu.classList.contains('hidden')) updateUserMenuInfo();
}

export function updateUserMenuInfo() {
    document.getElementById('umName').innerText = S.currentUser || "لاعب";
    document.getElementById('umLevel').innerText = "المستوى: " + (S.userData.level || 1);
    let totalPlayed = (S.userData.battlesPlayed || 0) + (S.userData.soloGamesPlayed || 0);
    let matchesLeft = 5 - (totalPlayed % 5);
    let progressPercent = ((5 - matchesLeft) / 5) * 100;
    document.getElementById('umMatchesLeft').innerText = matchesLeft;
    document.getElementById('umProgressBar').style.width = progressPercent + '%';
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('userMenu');
    if (menu && !menu.classList.contains('hidden') && !e.target.closest('#userProfileBox')) menu.classList.add('hidden');
});
