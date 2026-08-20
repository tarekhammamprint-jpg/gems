// js/state.js
// حالة اللعبة المشتركة بين كل الملفات. بما إن الكائن نفسه ثابت المرجع (const)،
// أي ملف يقدر يعدّل خصائصه (S.moves = 10) والتغيير هيظهر في كل مكان تاني بيستخدمه.
export const S = {
    width: 8,
    squares: [],
    boardTypes: [],
    moves: 25,
    level: 1,
    currentLevelScore: 0,
    selectedSquare: null,
    isAnimating: false,

    currentUser: null,
    userData: {
        balance: 0, level: 1, flag: '&#127757;', isSearching: false, battlesPlayed: 0,
        lastSupportTime: 0, soloGamesPlayed: 0, lastSpinTime: 0, lastGiftTime: 0,
        achievements: {}, dailyChallenges: null, totalWins: 0, bestCombo: 0, giftsSent: 0
    },
    usersList: {},

    currentFilterTab: 'all',
    botChallengeSent: false,
    battleEnded: false,
    battleMode: false,
    battleRole: null,
    currentBattleWager: 0,
    opponentName: "",
    unsubTargetBattle: null,
    disconnectRef: null,
    lastMsgId: 0,

    amIConnected: false,
    battlePingInterval: null,
    battleMonitorInterval: null,
    lastOpponentPingTime: Date.now(),
    lastOpponentPingValue: null,
    isWaitingForOpponent: false,
    domUpdateInterval: null,
    hasUsedSkill: false,

    isBotMatch: false,
    botInterval: null,
    botDone: false,
    playerDone: false,
    botScore: 0,
    botMoves: 25,

    rouletteInterval: null,
    rouletteTimeout: null,

    audioCtx: null,
    previewTimeout: null
};

const rawBotsData = [
    {n:"ريم عبدالصمد",c:'EG'},{n:"سارة محمود",c:'SA'},{n:"نورهان أحمد",c:'AE'},{n:"مريم ميمي",c:'MA'},
    {n:"ليلى سعيد",c:'DZ'},{n:"ياسمين جمال",c:'JO'},{n:"فاطمة علي",c:'TN'},{n:"نور كمال",c:'IQ'},
    {n:"شهد إبراهيم",c:'SY'},{n:"آية حسن",c:'LB'},{n:"ملك مصطفى",c:'KW'},{n:"حبيبة وليد",c:'QA'},
    {n:"جنى خالد",c:'BH'},{n:"ندى عادل",c:'OM'},{n:"روان يحيى",c:'YE'},{n:"دنيا فانية",c:'SD'},
    {n:"هبة جلال",c:'LY'},{n:"أميرة صبحي",c:'PS'},{n:"ميرنا جميل",c:'EG'},{n:"رقية ماجد",c:'SA'},
    {n:"أحمد حسن",c:'AE'},{n:"عمر محمود",c:'MA'},{n:"خالد عبدالله",c:'DZ'},{n:"اسراء اشرف",c:'IQ'},
    {n:'MARTINA',c:'EG'},{n:"يوسف شعبان",c:'PS'}
];

import { getFlagEmoji } from './utils.js';
export const botsData = rawBotsData.map((bot, index) => ({
    name: bot.n, code: bot.c, flag: getFlagEmoji(bot.c), level: 5 + (index * 2)
}));

export const ACHIEVEMENTS = [
    { id:'first_win', icon:'🥇', name:'أول انتصار', check:(u)=> (u.totalWins||0) >= 1 },
    { id:'win5', icon:'⚔️', name:'٥ انتصارات', check:(u)=> (u.totalWins||0) >= 5 },
    { id:'win20', icon:'🛡️', name:'٢٠ انتصار', check:(u)=> (u.totalWins||0) >= 20 },
    { id:'level10', icon:'🌟', name:'المستوى ١٠', check:(u)=> (u.level||1) >= 10 },
    { id:'level25', icon:'👑', name:'المستوى ٢٥', check:(u)=> (u.level||1) >= 25 },
    { id:'rich1000', icon:'💰', name:'ألف نجمة', check:(u)=> (u.balance||0) >= 1000 },
    { id:'combo5', icon:'💥', name:'كومبو ٥+', check:(u)=> (u.bestCombo||0) >= 5 },
    { id:'generous', icon:'🎁', name:'يد كريمة', check:(u)=> (u.giftsSent||0) >= 3 },
    { id:'battler50', icon:'🏹', name:'٥٠ معركة', check:(u)=> (u.battlesPlayed||0) >= 50 },
];

export const candyIcons = [
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CradialGradient id='g1' cx='30%25' cy='30%25' r='70%25'%3E%3Cstop offset='0%25' stop-color='%23ff9999'/%3E%3Cstop offset='100%25' stop-color='%23cc0000'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='45' fill='url(%23g1)'/%3E%3C/svg%3E\")",
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2366ccff'/%3E%3Cstop offset='100%25' stop-color='%230055cc'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpolygon points='50,5 95,50 50,95 5,50' fill='url(%23g2)'/%3E%3C/svg%3E\")",
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CradialGradient id='g3' cx='30%25' cy='30%25' r='70%25'%3E%3Cstop offset='0%25' stop-color='%2366ff99'/%3E%3Cstop offset='100%25' stop-color='%2300802b'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect x='10' y='10' width='80' height='80' rx='20' fill='url(%23g3)'/%3E%3C/svg%3E\")",
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CradialGradient id='g4' cx='30%25' cy='30%25' r='70%25'%3E%3Cstop offset='0%25' stop-color='%23ffffcc'/%3E%3Cstop offset='100%25' stop-color='%23cc9900'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cpolygon points='50,5 64,35 97,35 69,57 80,90 50,72 20,90 31,57 3,35 36,35' fill='url(%23g4)'/%3E%3C/svg%3E\")",
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g5' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23e699ff'/%3E%3Cstop offset='100%25' stop-color='%23660099'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpolygon points='25,5 75,5 95,50 75,95 25,95 5,50' fill='url(%23g5)'/%3E%3C/svg%3E\")"
];
