// js/board-engine.js
import { S, STAR, candyIcons } from './state.js';
import { db, ref, update } from './firebase-config.js';
import { playSound, fmtStars } from './utils.js';
import { AppModal } from './ui-modal.js';
import { checkAchievements } from './achievements.js';
import { progressChallenge } from './challenges.js';
// استيراد دائري مقصود: endBattleMode و syncScoreToFirebase من battle.js تُستخدم فقط
// داخل دوال تُستدعى لاحقاً بعد اكتمال تحميل كل الوحدات، لذلك آمن في ES modules.
import { endBattleMode, syncScoreToFirebase } from './battle.js';

let grid, scoreDisplay, movesDisplay, targetDisplay, scoreLabel, targetLabel;
let dragStartX = 0, dragStartY = 0, dragStartIndex = null;

export function bindBoardDom() {
    grid = document.querySelector('.grid');
    scoreDisplay = document.getElementById('scoreDisplay');
    movesDisplay = document.getElementById('movesDisplay');
    targetDisplay = document.getElementById('targetDisplay');
    scoreLabel = document.getElementById('scoreLabel');
    targetLabel = document.getElementById('targetLabel');
}

export function initLevel() {
    S.battleEnded = false; S.moves = 25; S.currentLevelScore = 0; movesDisplay.innerHTML = S.moves;
    if (!S.battleMode) { targetDisplay.innerHTML = S.level; scoreDisplay.innerHTML = fmtStars(S.userData.balance); }
    createBoard();
}

export function createBoard() {
    grid.innerHTML = ''; S.squares = []; S.boardTypes = new Array(S.width * S.width).fill(-1);
    for (let i = 0; i < S.width * S.width; i++) {
        const sq = document.createElement('div'); sq.setAttribute('id', i);
        let randomIdx = Math.floor(Math.random() * candyIcons.length);
        sq.style.backgroundImage = candyIcons[randomIdx]; S.boardTypes[i] = randomIdx;
        sq.addEventListener('touchstart', handleInputStart, { passive: false });
        sq.addEventListener('touchend', handleInputEnd);
        sq.addEventListener('mousedown', handleInputStart);
        sq.addEventListener('mouseup', handleInputEnd);
        grid.appendChild(sq); S.squares.push(sq);
    }
    setTimeout(() => { checkAllMatches(true); }, 100);
}

function handleInputStart(e) {
    if (S.moves <= 0 || S.isAnimating) return;
    dragStartIndex = parseInt(e.target.id);
    if (e.type.includes('touch')) { dragStartX = e.touches[0].clientX; dragStartY = e.touches[0].clientY; }
    else { dragStartX = e.clientX; dragStartY = e.clientY; }
}

function handleInputEnd(e) {
    if (S.moves <= 0 || S.isAnimating || dragStartIndex === null) return;
    let endX, endY;
    if (e.type.includes('touch')) { endX = e.changedTouches[0].clientX; endY = e.changedTouches[0].clientY; }
    else { endX = e.clientX; endY = e.clientY; }
    let diffX = endX - dragStartX; let diffY = endY - dragStartY;
    const width = S.width;
    if (Math.abs(diffX) > 20 || Math.abs(diffY) > 20) {
        let targetIndex = dragStartIndex;
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0 && dragStartIndex % width !== width - 1) targetIndex += 1;
            else if (diffX < 0 && dragStartIndex % width !== 0) targetIndex -= 1;
        } else {
            if (diffY > 0 && dragStartIndex < width * (width - 1)) targetIndex += width;
            else if (diffY < 0 && dragStartIndex >= width) targetIndex -= width;
        }
        if (targetIndex !== dragStartIndex) attemptSwap(dragStartIndex, targetIndex);
    } else {
        if (S.selectedSquare === null) { S.selectedSquare = dragStartIndex; S.squares[dragStartIndex].classList.add('selected'); playSound('click'); }
        else {
            let i1 = S.selectedSquare; let i2 = dragStartIndex; S.squares[i1].classList.remove('selected'); S.selectedSquare = null;
            if (i1 !== i2) attemptSwap(i1, i2);
        }
    }
    dragStartIndex = null;
}

function attemptSwap(i1, i2) {
    const width = S.width;
    if (Math.abs((i1 % width) - (i2 % width)) + Math.abs(Math.floor(i1 / width) - Math.floor(i2 / width)) === 1) {
        swap(i1, i2); S.isAnimating = true; playSound('click');
        if (S.selectedSquare !== null) { S.squares[S.selectedSquare].classList.remove('selected'); S.selectedSquare = null; }
        setTimeout(() => {
            if (!checkMatches()) { playSound('error'); swap(i1, i2); S.isAnimating = false; }
            else { S.moves--; movesDisplay.innerHTML = S.moves; dropSequence(); }
        }, 250);
    } else { if (S.selectedSquare !== null) { S.squares[S.selectedSquare].classList.remove('selected'); S.selectedSquare = null; } }
}

function swap(i1, i2) {
    const tBg = S.squares[i1].style.backgroundImage; const tType = S.boardTypes[i1];
    S.squares[i1].style.backgroundImage = S.squares[i2].style.backgroundImage; S.boardTypes[i1] = S.boardTypes[i2];
    S.squares[i2].style.backgroundImage = tBg; S.boardTypes[i2] = tType;
}

function showFloatingReward(text, matchedSet, isCombo) {
    let firstElementId = Array.from(matchedSet)[0];
    let square = document.getElementById(firstElementId);
    if (!square) return;
    let floatEl = document.createElement('div');
    floatEl.className = 'floating-reward' + (isCombo ? ' combo' : '');
    floatEl.innerHTML = text;
    floatEl.style.left = square.offsetLeft + 'px'; floatEl.style.top = square.offsetTop + 'px';
    document.getElementById('grid').appendChild(floatEl);
    setTimeout(() => { if (floatEl.parentNode) floatEl.parentNode.removeChild(floatEl); }, 1000);
}

function checkMatches(isInit = false) {
    const width = S.width;
    let matched = new Set();
    for (let r = 0; r < width; r++) { for (let c = 0; c < width - 2; c++) { let i = r * width + c; let m = [i, i + 1, i + 2]; let type = S.boardTypes[i]; if (type !== -1 && m.every(x => S.boardTypes[x] === type)) m.forEach(x => matched.add(x)); } }
    for (let c = 0; c < width; c++) { for (let r = 0; r < width - 2; r++) { let i = r * width + c; let m = [i, i + width, i + 2 * width]; let type = S.boardTypes[i]; if (type !== -1 && m.every(x => S.boardTypes[x] === type)) m.forEach(x => matched.add(x)); } }

    if (matched.size > 0) {
        if (!isInit) {
            S.currentLevelScore += matched.size * 10;
            if (matched.size > (S.userData.bestCombo || 0)) {
                S.userData.bestCombo = matched.size;
                update(ref(db, `users/${S.currentUser}/bestCombo`), matched.size).catch(e => console.log(e));
                checkAchievements();
            }
            if (matched.size >= 4) {
                playSound('epic_match');
                S.userData.balance += 5;
                update(ref(db, `users/${S.currentUser}`), { balance: S.userData.balance });
                import('./rewards.js').then(m => m.checkSupportEligibility());
                if (!S.battleMode) scoreDisplay.innerHTML = fmtStars(S.userData.balance);
                showFloatingReward(`+${STAR}5`, matched, true);
            } else { playSound('match'); }
            progressChallenge('score300', S.currentLevelScore, true);
            if (S.battleMode) { scoreDisplay.innerHTML = S.currentLevelScore; syncScoreToFirebase(); }
        }
        matched.forEach(x => S.squares[x].classList.add('fade-out')); return true;
    } return false;
}

function dropSequence(isInit = false) {
    const width = S.width;
    setTimeout(() => {
        S.squares.forEach((sq, idx) => { if (sq.classList.contains('fade-out')) { sq.style.backgroundImage = ''; S.boardTypes[idx] = -1; sq.classList.remove('fade-out'); } });
        for (let c = 0; c < width; c++) {
            let eRow = width - 1;
            for (let r = width - 1; r >= 0; r--) {
                let i = r * width + c;
                if (S.boardTypes[i] !== -1) {
                    if (r !== eRow) {
                        let targetIdx = eRow * width + c;
                        S.squares[targetIdx].style.backgroundImage = S.squares[i].style.backgroundImage; S.boardTypes[targetIdx] = S.boardTypes[i];
                        S.squares[i].style.backgroundImage = ''; S.boardTypes[i] = -1;
                    }
                    eRow--;
                }
            }
            for (let r = eRow; r >= 0; r--) {
                let i = r * width + c;
                let randomIdx = Math.floor(Math.random() * candyIcons.length);
                S.squares[i].style.backgroundImage = candyIcons[randomIdx]; S.boardTypes[i] = randomIdx;
                S.squares[i].classList.add('new-candy'); setTimeout(() => S.squares[i].classList.remove('new-candy'), 400);
            }
        }
        setTimeout(() => { checkAllMatches(isInit); }, 400);
    }, 200);
}

function checkAllMatches(isInit = false) {
    if (checkMatches(isInit)) dropSequence(isInit);
    else {
        S.isAnimating = false;
        if (!isInit && S.moves <= 0) {
            if (S.battleMode) { endBattleMode(); }
            else {
                if (S.battleEnded) return; S.battleEnded = true;
                S.userData.soloGamesPlayed = (S.userData.soloGamesPlayed || 0) + 1;
                update(ref(db, `users/${S.currentUser}`), { soloGamesPlayed: S.userData.soloGamesPlayed });
                progressChallenge('play3', 1, false);
                checkAchievements();

                if (S.userData.soloGamesPlayed % 5 === 0) {
                    playSound('win'); S.level++; S.userData.level = S.level; S.userData.balance += 30;
                    update(ref(db, `users/${S.currentUser}`), { balance: S.userData.balance, level: S.level }).catch(e => console.log(e));
                    checkAchievements();
                    import('./utils.js').then(m => m.fireConfetti(35));
                    AppModal.show({
                        title: "مستوى جديد! &#x2B50;",
                        html: `<div style="position:relative; display:inline-block; margin:10px 0; animation: popSticker 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                                  <div style="font-size:80px; text-shadow: 0 0 20px #ffc94d;">&#x2B50;</div>
                                  <div style="position:absolute; top: 15px; left: 0; width: 100%; text-align: center; font-size: 28px; font-weight: 900; color: #fff; text-shadow: 2px 2px 4px #000;">${S.level}</div>
                               </div>
                               <h3 style="color:#8affd6; margin: 5px 0;">أحسنت!</h3>
                               <p>لقد ربحت <strong style="color:#8affd6">+${STAR}30</strong> كمكافأة.</p>`,
                        confirmText: "استمر &#x27A1;", onConfirm: initLevel
                    });
                } else {
                    let gamesLeft = 5 - (S.userData.soloGamesPlayed % 5);
                    playSound('match'); S.userData.balance += 5;
                    update(ref(db, `users/${S.currentUser}`), { balance: S.userData.balance });
                    scoreDisplay.innerHTML = fmtStars(S.userData.balance);
                    AppModal.show({
                        title: "انتهت اللعبة! &#x1F389;",
                        html: `<h3 style="color:#ffc94d; margin: 5px 0;">النقاط: ${S.currentLevelScore}</h3>
                               <p>العب <strong style="color:#ff6fa3">${gamesLeft}</strong> مباريات إضافية للوصول للمستوى التالي!</p>
                               <p style="font-size:13px; color:#8affd6;">مكافأة اللعب: +${STAR}5</p>`,
                        confirmText: "لعب مجدداً &#x1F501;", onConfirm: initLevel
                    });
                }
            }
        }
    }
}

export function useUltimateStrike() {
    if (!S.battleMode && !S.isBotMatch && !S.battleEnded) return;
    if (S.hasUsedSkill) return AppModal.alert("لقد استخدمت هذه المهارة مسبقاً في هذه المعركة!");
    if (S.userData.balance < 50) return AppModal.alert(`رصيدك لا يكفي! (تحتاج ${STAR}50)`);
    S.hasUsedSkill = true;
    document.getElementById('ultimateBtn').disabled = true;
    S.userData.balance -= 50;
    update(ref(db, `users/${S.currentUser}`), { balance: S.userData.balance });
    S.currentLevelScore += 150;
    playSound('epic_match');
    let destroyedCount = 0; let destroyedIndices = new Set();
    while (destroyedCount < 15) {
        let r = Math.floor(Math.random() * (S.width * S.width));
        if (!destroyedIndices.has(r)) { destroyedIndices.add(r); if (S.squares[r]) S.squares[r].classList.add('fade-out'); destroyedCount++; }
    }
    if (S.battleMode) { scoreDisplay.innerHTML = S.currentLevelScore; syncScoreToFirebase(); }
    setTimeout(() => dropSequence(false), 300);
    showFloatingReward("&#x26A1; +150", destroyedIndices, true);
}
