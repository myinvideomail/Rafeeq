# رفيق (Rafeeq) - AI Mental Health Companion

تطبيق "رفيق" هو مساحتك الآمنة للدعم النفسي والتوجيه السلوكي، مبني باستخدام React، Tailwind CSS، Firebase، و Gemini AI.

## 🚀 كيفية النشر على GitHub

1. قم بإنشاء مستودع (Repository) جديد في حسابك على [GitHub](https://github.com/).
2. افتح موجه الأوامر (Terminal) في مجلد المشروع ونفذ الأوامر التالية:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## 🌐 كيفية النشر على استضافة Hostinger

### الطريقة الأولى: النشر اليدوي (Shared Hosting / cPanel / hPanel)

1. **بناء المشروع:**
   قم بتشغيل الأمر التالي لإنشاء نسخة الإنتاج (Production Build):
   ```bash
   npm run build
   ```
   سيقوم هذا الأمر بإنشاء مجلد جديد باسم `dist` يحتوي على ملفات التطبيق الجاهزة.

2. **الرفع إلى Hostinger:**
   - سجل الدخول إلى لوحة تحكم Hostinger (hPanel).
   - اذهب إلى **File Manager** (مدير الملفات).
   - افتح مجلد `public_html`.
   - قم برفع **محتويات** مجلد `dist` (وليس المجلد نفسه، بل الملفات التي بداخله) إلى `public_html`.
   - *ملاحظة:* تم تضمين ملف `.htaccess` مسبقاً لضمان عمل الروابط (Routing) بشكل صحيح دون أخطاء 404.

3. **إعداد متغيرات البيئة (Environment Variables):**
   تأكد من إضافة مفاتيح Firebase و Gemini AI في ملف `.env` قبل عملية البناء (`npm run build`).

### الطريقة الثانية: النشر التلقائي عبر GitHub (Hostinger VPS أو Hostinger Cloud)

إذا كنت تستخدم خطط استضافة متقدمة تدعم النشر التلقائي:
1. اربط حسابك في GitHub بلوحة تحكم Hostinger.
2. اختر المستودع (Repository) الخاص بالتطبيق.
3. حدد أمر البناء: `npm run build`
4. حدد مجلد النشر: `dist`

## 🛠️ المتطلبات الأساسية (Environment Variables)

يجب إنشاء ملف `.env` في المجلد الرئيسي (Root) قبل عملية البناء (`npm run build`) وإضافة المتغير التالي:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

*ملاحظة:* إعدادات Firebase موجودة بالفعل في ملف `firebase-applet-config.json` ولا تحتاج إلى إضافتها في `.env` إلا إذا كنت ترغب في تغييرها.
