# نظام مصادقة كامل (MERN Stack Auth System)

---

## مقدمة

هذا المشروع يمثل نظام مصادقة كامل (Authentication System) مبني باستخدام **MERN Stack** (MongoDB, Express.js, React, Node.js). يوفر المشروع الوظائف الأساسية لتسجيل المستخدمين، تسجيل الدخول، التحقق من البريد الإلكتروني، وإعادة تعيين كلمة المرور، مع التركيز على ممارسات الأمان الجيدة وتحسين تجربة المستخدم.

---

## الميزات الرئيسية

* **تسجيل المستخدمين (User Registration):** إنشاء حسابات جديدة باسم مستخدم، بريد إلكتروني، وكلمة مرور.
* **تجزئة كلمات المرور (Password Hashing):** استخدام `bcryptjs` لتجزئة وتأمين كلمات المرور في قاعدة البيانات.
* **التحقق من البريد الإلكتروني (Email Verification):** إرسال رابط تأكيد للبريد الإلكتروني لتفعيل الحساب بعد التسجيل.
* **تسجيل الدخول (User Login):** تسجيل دخول آمن باستخدام JSON Web Tokens (JWT) للمصادقة.
* **إعادة تعيين كلمة المرور (Password Reset):** وظيفة "نسيت كلمة المرور" لإرسال رابط آمن لإعادة تعيين كلمة المرور.
* **حماية المسارات (Protected Routes):** استخدام الـ JWT لحماية المسارات التي تتطلب مصادقة المستخدم.
* **التحقق من المدخلات (Input Validation):**
    * **Backend:** باستخدام `express-validator` لضمان صحة البيانات المستقبلة من الواجهة الأمامية.
    * **Frontend:** التحقق من المدخلات قبل إرسالها للـ Backend لتحسين تجربة المستخدم.
* **تصميم واجهة المستخدم (UI Enhancements):** تحسينات بسيطة على CSS لجعل الواجهة أكثر جاذبية وسهولة في الاستخدام.
* **إشعارات المستخدم (User Feedback):** عرض رسائل واضحة للنجاح، الخطأ، أو التحذيرات للمستخدمين.

---

## التقنيات المستخدمة

* **Backend:**
    * Node.js
    * Express.js
    * MongoDB (عبر Mongoose ODM)
    * `bcryptjs` (لتجزئة كلمات المرور)
    * `jsonwebtoken` (لتوليد والتحقق من الـ JWT)
    * `nodemailer` (لإرسال رسائل البريد الإلكتروني)
    * `express-validator` (للتحقق من المدخلات)
    * `cors` (للسماح بالاتصال بين الواجهة الأمامية والخلفية)
    * `dotenv` (لإدارة متغيرات البيئة)

* **Frontend:**
    * React
    * React Router DOM (للتنقل بين الصفحات)
    * Axios (لإجراء طلبات HTTP)
    * HTML5
    * CSS3

---

## كيفية تشغيل المشروع

اتبع الخطوات التالية لتشغيل المشروع على جهازك المحلي.

### المتطلبات المسبقة

تأكد من تثبيت التالي على جهازك:

* [Node.js](https://nodejs.org/en/download/) (يتضمن npm)
* [MongoDB](https://www.mongodb.com/try/download/community) (يمكنك استخدام [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) كخدمة سحابية)
* [Git](https://git-scm.com/downloads) (اختياري، لإدارة إصدارات الكود)

### الإعداد والتشغيل

1.  **استنساخ المستودع (Clone the repository):**
    ```bash
    git clone [https://github.com/](https://github.com/)[YOUR_USERNAME]/MERN-Auth-System.git
    cd MERN-Auth-System
    ```

2.  **إعداد Backend:**
    انتقل إلى مجلد `backend`، قم بتثبيت التبعيات، وأنشئ ملف `.env`.

    ```bash
    cd backend
    npm install
    ```
    أنشئ ملف `.env` في مجلد `backend/` وضع فيه المتغيرات التالية:
    (غيّر القيم التي بين الأقواس المربعة `[]` بمعلوماتك الخاصة)
    ```env
    MONGO_URI=[YOUR_MONGODB_CONNECTION_STRING]
    JWT_SECRET=[YOUR_VERY_STRONG_JWT_SECRET_KEY]
    EMAIL_USER=[YOUR_EMAIL@gmail.com]
    EMAIL_PASS=[YOUR_GMAIL_APP_PASSWORD] # **مهم: هذا يجب أن يكون App Password وليس كلمة المرور العادية**
    BASE_URL=http://localhost:3000
    ```
    * **ملاحظة هامة حول `EMAIL_PASS`:** إذا كنت تستخدم Gmail، يجب عليك تفعيل [التحقق بخطوتين (2-Step Verification)](https://myaccount.google.com/security) ثم إنشاء [كلمة مرور تطبيق (App Password)](https://support.google.com/accounts/answer/185833?hl=ar) لاستخدامها هنا.

    شغّل الـ Backend:
    ```bash
    node server.js
    ```
    يجب أن ترى رسائل تشير إلى اتصال MongoDB وبدء تشغيل الخادم على المنفذ `5000`.

3.  **إعداد Frontend:**
    افتح نافذة Terminal جديدة، انتقل إلى مجلد `frontend`، ثم قم بتثبيت التبعيات.

    ```bash
    cd ../frontend
    npm install
    ```

    شغّل الـ Frontend:
    ```bash
    npm start
    ```
    سيتم فتح التطبيق في متصفحك على العنوان `http://localhost:3000`.

---

## استخدام التطبيق

1.  **صفحة التسجيل (`/register`):** قم بإنشاء حساب مستخدم جديد.
2.  **التحقق من البريد الإلكتروني:** ستتلقى رسالة بريد إلكتروني تحتوي على رابط لتفعيل حسابك. انقر على الرابط لإكمال عملية التحقق.
3.  **صفحة تسجيل الدخول (`/login`):** استخدم بيانات اعتمادك التي قمت بالتسجيل بها لتسجيل الدخول.
4.  **لوحة التحكم (`/dashboard`):** بعد تسجيل الدخول بنجاح، سيتم توجيهك إلى لوحة التحكم التي تعرض معلومات المستخدم.
5.  **نسيت كلمة المرور (`/forgot-password`):** إذا نسيت كلمة المرور، يمكنك طلب إعادة تعيينها عبر بريدك الإلكتروني.

---

