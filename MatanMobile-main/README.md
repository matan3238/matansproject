# Matan Mobile - רשת מוביל וחנות טלפונים

אפליקציית Web מלאה לניהול חנות טלפונים ניידים. בנויה עם Node.js, Express ו-Frontend מלא – ממשק משתמש מודרני ורספונסיבי בעברית (RTL).

## 🙏 תודות

**תודה מיוחדת ל-[MichoWorks](https://github.com/MichoWorks) (Micho.B)** על העיצוב וה-UI של האתר – ממשק המשתמש, העיצוב המודרני והחוויה הוויזואלית.

---

## מה האתר

**Matan Mobile** היא חנות אונליין לטלפונים ניידים ואביזרים. האתר מאפשר:

- **לקוחות** – גלישה במוצרים, סינון, הוספה לסל, תשלום מאובטח, ניהול פרופיל והיסטוריית הזמנות
- **מנהלים** – לוח בקרה לניהול מוצרים, הזמנות, משתמשים וקטגוריות

---

## מבנה קבצי האתר

### קבצי Frontend (תיקיית `public/`)

| קובץ | תיאור |
|------|-------|
| `index.html` | דף בית – מוצרים מובילים וניווט |
| `products.html` | דף מוצרים – רשימה מלאה עם סינון לפי קטגוריה, מותג ונפח אחסון |
| `product.html` | דף פרטי מוצר – פרטים, בחירת צבע/אחסון, הוספה לסל |
| `cart.html` | סל קניות – צפייה בפריטים, עדכון כמויות, מעבר לתשלום |
| `checkout.html` | דף תשלום – טופס כרטיס אשראי (Matan Pay) |
| `profile.html` | פרופיל משתמש – פרטים אישיים, כתובת, אמצעי תשלום, היסטוריית הזמנות |
| `admin.html` | לוח בקרה למנהלים – ניהול מוצרים, הזמנות, משתמשים וקטגוריות |
| `login.html` | דף התחברות |
| `register.html` | דף הרשמה |
| `about.html` | אודות |
| `contact.html` | יצירת קשר |
| `css/style.css` | עיצוב האתר – כל הסגנונות |
| `js/app.js` | לוגיקת Frontend – טעינת מוצרים, סל, ניווט, תצוגות |

### קבצי Backend (שרת Node.js)

| קובץ | תיאור |
|------|-------|
| `server.js` | נקודת כניסה – הפעלת השרת וחיבור ה-Routes |
| `config/database.js` | חיבור MongoDB |
| `middleware/auth.js` | אימות JWT – יצירת Token ובדיקת הרשאות |

### מודלים (תיקיית `models/`)

| קובץ | תיאור |
|------|-------|
| `Product.js` | מוצרים – CRUD, סינון, קטגוריות, ווריאציות |
| `User.js` | משתמשים – MongoDB, הצפנת סיסמאות (bcrypt), הרשמה והתחברות |
| `Cart.js` | סל קניות – הוספה, עדכון, הסרה, תשלום |
| `Order.js` | הזמנות – יצירה, היסטוריה, ביטול, עדכון כתובת |
| `Category.js` | קטגוריות – ניהול דינמי של קטגוריות מוצרים |

### Controllers (תיקיית `controllers/`)

| קובץ | תיאור |
|------|-------|
| `productController.js` | לוגיקה למוצרים – קבלה, סינון, אפשרויות |
| `userController.js` | לוגיקה למשתמשים – הרשמה, התחברות, עדכון |
| `cartController.js` | לוגיקה לסל – הוספה, עדכון, תשלום |
| `orderController.js` | לוגיקה להזמנות – קבלה לפי משתמש |
| `adminController.js` | לוגיקה למנהלים – מוצרים, הזמנות, משתמשים, קטגוריות |

### Routes (תיקיית `routes/`)

| קובץ | תיאור |
|------|-------|
| `productRoutes.js` | נתיבי API למוצרים |
| `userRoutes.js` | נתיבי API למשתמשים |
| `cartRoutes.js` | נתיבי API לסל קניות |
| `orderRoutes.js` | נתיבי API להזמנות |
| `adminRoutes.js` | נתיבי API למנהלים (דורש JWT + הרשאות מנהל) |

### סקריפטים (תיקיית `scripts/`)

| קובץ | תיאור |
|------|-------|
| `seed.js` | הוספת מוצרי דוגמה (הרצה ידנית) |

---

## איך הכל מתנהל

### זרימת לקוח

1. **גלישה** – דף בית או דף מוצרים, סינון לפי קטגוריה/מותג/אחסון
2. **בחירת מוצר** – לחיצה על מוצר → דף פרטי מוצר (בחירת צבע/אחסון אם קיים)
3. **הוספה לסל** – דורש התחברות. המוצר נשמר בסל של המשתמש
4. **סל קניות** – צפייה, עדכון כמויות, הסרה
5. **תשלום** – "המשך לתשלום" → דף תשלום (טופס כרטיס) → יצירת הזמנה
6. **אחרי תשלום** – מעבר לפרופיל, הזמנה חדשה בהיסטוריה

### זרימת מנהל

1. **התחברות** – עם משתמש מנהל (admin@matan.com / 123456)
2. **לוח בקרה** – קישור בתפריט או גישה ל-`admin.html`
3. **ניהול** – מוצרים (הוספה/עריכה/מחיקה), הזמנות (צפייה/עריכת סטטוס), משתמשים (הוספה/עריכה/מחיקה), קטגוריות (הוספה/מחיקה)

### אחסון נתונים

| רכיב | אחסון |
|------|-------|
| **משתמשים** | MongoDB – הצפנת סיסמאות (bcrypt) |
| **מוצרים, סל, הזמנות, קטגוריות** | זיכרון (in-memory) – נמחקים ברענון השרת |
| **מצב התחברות** | JWT ב-`localStorage` + פרטי משתמש |

---

## התקנה והפעלה

### דרישות
- Node.js 14+
- npm או yarn
- חשבון MongoDB Atlas (או MongoDB מקומי)

### משתני סביבה

צור קובץ `.env` בשורש הפרויקט (או העתק מ-`.env.example`):

```env
PORT=3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/matan_mobile?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

> **חשוב:** שנה את `JWT_SECRET` למחרוזת אקראית חזקה ב-production.

### שלבים

```bash
# 1. שכפול הפרויקט
git clone https://github.com/MichoWorks/MatanMobile
cd MatanMobile

# 2. התקנת תלויות
npm install

# 3. יצירת .env עם MONGODB_URI ו-JWT_SECRET

# 4. הפעלת השרת
npm start
# או למצב פיתוח עם auto-reload:
npm run dev
```

### גישה

- **אתר:** http://localhost:3000
- **מנהל:** התחברות עם `admin@matan.com` / `123456`

---

## פריסה ל-Vercel

1. חבר את ה-repo ל-Vercel
2. הוסף **Environment Variables**:
   - `MONGODB_URI` – מחרוזת החיבור ל-MongoDB
   - `JWT_SECRET` – סוד להצפנת JWT (מחרוזת אקראית)
3. Deploy – Vercel יזהה את `vercel.json` ויריץ את האפליקציה כ-Serverless

---

## API – סיכום

| תחום | נתיבים עיקריים |
|------|-----------------|
| מוצרים | `GET/POST /api/products`, `GET/PUT/DELETE /api/products/:id` |
| משתמשים | `POST /api/users/register`, `POST /api/users/login` (מחזיר JWT), `GET/PUT /api/users/:id` |
| סל | `GET /api/cart/:userId`, `POST .../add`, `PUT .../update`, `POST .../checkout` |
| הזמנות | `GET /api/orders/:userId`, `PATCH .../:orderId/address`, `DELETE .../:orderId` |
| מנהלים | `GET/POST/PUT/DELETE /api/admin/*` – דורש `Authorization: Bearer <token>` |

---

## אבטחה

- **סיסמאות** – מוצפנות עם bcrypt לפני שמירה ב-MongoDB
- **JWT** – התחברות מחזירה Token בתוקף 7 ימים; נשלח ב-header `Authorization: Bearer <token>`
- **מנהלים** – נתיבי `/api/admin/*` דורשים Token תקין והרשאות מנהל

## הערות

- הקוד מתועד בעברית
- משתמשים נשמרים ב-MongoDB; מוצרים, סל והזמנות – בזיכרון
- מצב המשתמש (user + token) נשמר ב-localStorage

## רישיון

ISC

---

**תודה ל-[MichoWorks](https://github.com/MichoWorks) על העיצוב וה-UI המעולה! 🎨**
