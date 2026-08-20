// js/firebase-config.js
// إعداد الاتصال بقاعدة بيانات Firebase وتصدير الأدوات المشتركة لباقي الملفات
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
    getDatabase, ref, set, get, onValue, update, remove, onDisconnect
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// ملاحظة أمان: هذه القيم عامة (Public) بطبيعتها في تطبيقات Firebase الأمامية،
// الحماية الحقيقية تُفرض عبر Security Rules من لوحة Firebase وليس بإخفاء هذه القيم.
// راجع ملف firebase-security-rules.json في جذر المستودع.
const firebaseConfig = {
    apiKey: "AIzaSyBGwo-ds88ucY9MTDxx7x_rPppnThvjiGc",
    authDomain: "gems-d8ae3.firebaseapp.com",
    projectId: "gems-d8ae3",
    storageBucket: "gems-d8ae3.firebasestorage.app",
    messagingSenderId: "747420762454",
    appId: "1:747420762454:web:302f25d10893180263d6f7"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, set, get, onValue, update, remove, onDisconnect };
export const STAR = '⭐';
