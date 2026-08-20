// js/chat.js
import { S } from './state.js';
import { db, ref, update } from './firebase-config.js';
import { playSound } from './utils.js';

let previewTimeout = null;

export function toggleChat() {
    const chatPanel = document.getElementById('chatPanel'); const chatBadge = document.getElementById('chatBadge');
    if (chatPanel.style.display === 'flex') { chatPanel.style.display = 'none'; }
    else { chatPanel.style.display = 'flex'; document.getElementById('chatInput').focus(); chatBadge.style.display = 'none'; }
    playSound('click'); document.getElementById('chatPreviewBubble').classList.add('hidden');
}

export function submitTextChat() {
    let input = document.getElementById('chatInput'); let txt = input.value.trim();
    if (txt !== '') { sendChat(txt, false); input.value = ''; }
}

export function sendChat(text, isSticker) {
    if (!S.battleMode) return;
    if (S.isBotMatch) {
        renderChat({ sender: S.currentUser, text: text, isSticker: isSticker });
        setTimeout(() => {
            if (S.battleMode) {
                const stickers = ['&#x1F602;', '&#x1F621;', '&#x1F525;', '&#x1F631;', '&#x1F480;', '&#x1F60E;'];
                let botReply = stickers[Math.floor(Math.random() * stickers.length)];
                renderChat({ sender: S.opponentName, text: botReply, isSticker: true });
                playSound('msg_pop'); showChatPreview({ sender: S.opponentName, text: botReply, isSticker: true });
            }
        }, 1500 + Math.random() * 2000);
        return;
    }
    let targetBattlePath = `users/${S.battleRole === 'challenged' ? S.currentUser : S.opponentName}/battle`;
    update(ref(db, targetBattlePath), { lastMessage: { id: Date.now() + Math.random(), sender: S.currentUser, text: text, isSticker: isSticker } }).catch(e => console.log(e));
}

export function renderChat(msg) {
    const chatBox = document.getElementById('chatMessages'); const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${msg.sender === S.currentUser ? 'me' : 'opp'} ${msg.isSticker ? 'sticker' : ''}`;
    msgDiv.innerHTML = msg.text; chatBox.appendChild(msgDiv); chatBox.scrollTop = chatBox.scrollHeight;
}

export function showChatPreview(msg) {
    const bubble = document.getElementById('chatPreviewBubble'); const badge = document.getElementById('chatBadge');
    badge.style.display = 'block';
    if (msg.isSticker) {
        bubble.innerHTML = `<div style="font-size:60px; animation: popSticker 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-shadow: 0 5px 15px rgba(0,0,0,0.6);">${msg.text}</div>`;
        bubble.style.background = 'transparent'; bubble.style.border = 'none'; bubble.style.boxShadow = 'none'; bubble.style.bottom = '110px';
    } else {
        bubble.innerHTML = `<strong style="color:#ffc94d">${msg.sender}:</strong> ${msg.text}`;
        bubble.style.background = 'rgba(10, 5, 25, 0.9)'; bubble.style.border = '2px solid #ffc94d'; bubble.style.boxShadow = '0 5px 15px rgba(0,0,0,0.6)'; bubble.style.bottom = '85px';
    }
    bubble.classList.remove('hidden');
    clearTimeout(previewTimeout); previewTimeout = setTimeout(() => { bubble.classList.add('hidden'); }, 3000);
}
