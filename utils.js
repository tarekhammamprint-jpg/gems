// js/utils.js
// دوال مساعدة عامة لا تعتمد على حالة اللعبة (state) حتى نتفادى الاستيراد الدائري

export const STAR = '⭐';

export function getFlagEmoji(countryCode) {
    if (!countryCode || typeof countryCode !== 'string' || countryCode.length !== 2) return '&#127757;';
    const char1 = 127397 + countryCode.charCodeAt(0);
    const char2 = 127397 + countryCode.charCodeAt(1);
    return `&#${char1};&#${char2};`;
}

export function getSafeFlag(flagValue) {
    if (!flagValue || typeof flagValue !== 'string' || flagValue.includes('?')) return '&#127757;';
    if (flagValue === '????️' || flagValue === '&#127987;' || flagValue === '\uD83C\uDFF3\uFE0F') return '&#127757;';
    return flagValue;
}

export function fmtStars(n) { return `${STAR}${Math.max(0, Math.round(n))}`; }

/* ============ تشفير كلمات المرور (SHA-256 + Salt) ============
   ملاحظة أمان: هذا تطبيق client-only بدون سيرفر خاص، لذلك التشفير هنا
   يمنع تخزين كلمة المرور كنص صريح، لكنه لا يغني عن ضبط
   Firebase Security Rules الحقيقية على مستوى القاعدة نفسها. */
function bufToHex(buf) { return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''); }

export async function hashPassword(password, salt) {
    const enc = new TextEncoder();
    const data = enc.encode(salt + ':' + password);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return bufToHex(digest);
}

export function generateSalt() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return bufToHex(arr.buffer);
}

export async function fetchUserFlag() {
    try {
        let res = await fetch('https://get.geojs.io/v1/ip/country.json');
        let data = await res.json();
        let cc = data.country;
        if (cc) return getFlagEmoji(cc);
    } catch (e) {}
    return '&#127757;';
}

/* ============ الصوت ============ */
let audioCtx = null;
try {
    document.body.addEventListener('click', function () {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        } catch (e) {}
    }, { once: true });
} catch (e) {}

export function playSound(type) {
    try {
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const now = audioCtx.currentTime;
        function createTone(wave, freq, vol, timeStart, duration, freqGlideTo) {
            const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
            osc.type = wave; osc.frequency.setValueAtTime(freq, timeStart);
            if (freqGlideTo) osc.frequency.exponentialRampToValueAtTime(freqGlideTo, timeStart + duration);
            gain.gain.setValueAtTime(vol, timeStart); gain.gain.exponentialRampToValueAtTime(0.001, timeStart + duration);
            osc.connect(gain); gain.connect(audioCtx.destination); osc.start(timeStart); osc.stop(timeStart + duration);
        }
        if (type === 'click') createTone('sine', 400, 0.1, now, 0.1, 200);
        else if (type === 'tick') createTone('sine', 800, 0.05, now, 0.05);
        else if (type === 'match') { createTone('sine', 523.25, 0.15, now, 0.2); createTone('sine', 659.25, 0.1, now + 0.05, 0.2); }
        else if (type === 'epic_match') { createTone('sine', 523.25, 0.15, now, 0.3); createTone('sine', 659.25, 0.15, now + 0.1, 0.3); createTone('sine', 783.99, 0.15, now + 0.2, 0.4); }
        else if (type === 'error') createTone('triangle', 200, 0.2, now, 0.2, 100);
        else if (type === 'win') { createTone('sine', 440, 0.1, now, 0.3); createTone('sine', 554, 0.1, now + 0.15, 0.3); createTone('sine', 659, 0.1, now + 0.3, 0.3); createTone('sine', 880, 0.15, now + 0.45, 0.6); }
        else if (type === 'lose') { createTone('triangle', 349, 0.1, now, 0.4); createTone('triangle', 329, 0.1, now + 0.2, 0.4); createTone('triangle', 293, 0.15, now + 0.4, 0.6); }
        else if (type === 'alert') createTone('sine', 600, 0.1, now, 0.2, 800);
        else if (type === 'msg_pop') createTone('sine', 800, 0.05, now, 0.1, 1000);
        else if (type === 'coin') createTone('sine', 1200, 0.05, now, 0.15, 1600);
        else if (type === 'badge') { createTone('sine', 660, 0.12, now, 0.2); createTone('sine', 880, 0.12, now + 0.12, 0.25); createTone('sine', 1100, 0.12, now + 0.24, 0.35); }
    } catch (e) {}
}

/* ============ حقل النجوم المتلألئة في الخلفية ============ */
export function buildStarfield() {
    const field = document.getElementById('starfield');
    if (!field) return;
    for (let i = 0; i < 60; i++) {
        const s = document.createElement('div');
        s.className = 'star-dot';
        const size = 1 + Math.random() * 2.4;
        s.style.width = size + 'px'; s.style.height = size + 'px';
        s.style.left = Math.random() * 100 + 'vw'; s.style.top = Math.random() * 100 + 'vh';
        s.style.animationDelay = (Math.random() * 3) + 's';
        s.style.animationDuration = (2 + Math.random() * 3) + 's';
        field.appendChild(s);
    }
}

/* ============ قصاصات الاحتفال (Confetti) ============ */
export function fireConfetti(count = 40) {
    const colors = ['#ffc94d', '#ff3d78', '#00e6a8', '#3fb8ff', '#ff6fa3'];
    for (let i = 0; i < count; i++) {
        const c = document.createElement('div');
        c.style.position = 'fixed'; c.style.zIndex = '10000'; c.style.pointerEvents = 'none';
        c.style.width = '8px'; c.style.height = '8px'; c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.left = (45 + Math.random() * 10) + 'vw'; c.style.top = '40vh';
        c.style.opacity = '1';
        const dx = (Math.random() - 0.5) * window.innerWidth * 0.9;
        const dy = (Math.random()) * window.innerHeight * 0.6 + 100;
        const rot = Math.random() * 720;
        c.style.transition = `all ${0.9 + Math.random() * 0.7}s cubic-bezier(0.25,0.46,0.45,0.94)`;
        document.body.appendChild(c);
        requestAnimationFrame(() => {
            c.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
            c.style.opacity = '0';
        });
        setTimeout(() => { if (c.parentNode) c.parentNode.removeChild(c); }, 1800);
    }
}
