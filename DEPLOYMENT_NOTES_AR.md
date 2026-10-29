# ملاحظات النشر

1. من Firebase Console فعّل Authentication providers: Anonymous وGoogle، وفعل Facebook فقط بعد إضافة App ID وApp Secret وOAuth redirect URI.
2. راجع قواعد `firebase-security-rules-v2.json` قبل تطبيقها، واختبرها على مشروع Firebase منفصل أولًا.
3. لا تعتمد على حساب Facebook داخل WebView قديم؛ Google/الضيف أكثر موثوقية.
4. ارفع `index.html` و`manifest.json` و`service-worker.js` و`icon.svg` على نفس النطاق.
5. أضف سياسة الخصوصية إلى صفحة المتجر.
6. اربط Play Console Analytics أو Firebase Analytics لقياس: فتح اللعبة، بدء أول جولة، إنهاء أول جولة، والعودة بعد يوم.
7. صور المتجر المقترحة: شاشة اللعب، شاشة الخريطة، شاشة التحدي، شاشة المعركة. لا تجعل لقطة الدخول أول صورة.
