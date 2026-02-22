// קובץ זה הוא נקודת הכניסה הראשית של האפליקציה
// הוא מגדיר את השרת Express ומחבר את כל החלקים יחד

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB = require('./config/database');
const Product = require('./models/Product');
const User = require('./models/User');

const app = express(); // יצירת אפליקציית Express

// הגדרת middleware - קוד שרץ לפני כל בקשה
app.use(cors()); // מאפשר גישה מכל מקור (CORS)
app.use(bodyParser.json()); // מפרסר JSON מה-body של הבקשות
app.use(bodyParser.urlencoded({ extended: true })); // מפרסר נתונים מטופס HTML

// הגדרת routes - כל בקשה שמתחילה ב-/api/products תעבור ל-productRoutes
const productRoutes = require('./routes/productRoutes'); // ייבוא ה-routes של מוצרים
app.use('/api/products', productRoutes); // חיבור ה-routes לנתיב /api/products

// הגדרת routes למשתמשים - כל בקשה שמתחילה ב-/api/users תעבור ל-userRoutes
const userRoutes = require('./routes/userRoutes'); // ייבוא ה-routes של משתמשים
app.use('/api/users', userRoutes); // חיבור ה-routes לנתיב /api/users

// הגדרת routes לסל קניות
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

// הגדרת routes להזמנות
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// הגדרת routes למנהלים
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// הגדרת תיקיית קבצים סטטיים (HTML, CSS, JS)
// כל הקבצים בתיקיית public יהיו נגישים ישירות מהדפדפן
app.use(express.static('public')); // מגדיר את תיקיית public כסטטית

// Route בסיסי - מפנה לדף הראשי
// GET / - מחזיר את דף הבית
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // שולח את קובץ ה-HTML הראשי
});

// פונקציה אסינכרונית לאתחול האפליקציה
async function initializeApp() {
  try {
    await connectDB();
    await Product.initialize();
    await User.initialize();

    if (!process.env.VERCEL) {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`🚀 שרת Matan Mobile רץ על פורט ${PORT}`);
        console.log(`🌐 Web App זמין בכתובת: http://localhost:${PORT}`);
        console.log(`📱 API זמין בכתובת: http://localhost:${PORT}/api/products`);
        console.log(`💾 משתמשים: ${process.env.MONGODB_URI ? 'MongoDB' : 'זיכרון'}`);
      });
    }
  } catch (error) {
    console.error('❌ שגיאה באתחול האפליקציה:', error.message);
    if (!process.env.VERCEL) process.exit(1);
  }
}

// ב-Vercel: Promise לאתחול (api/index.js מחכה לזה)
// מקומית: הרצה רגילה
if (process.env.VERCEL) {
  app.initPromise = initializeApp();
} else {
  initializeApp();
}

module.exports = app;
