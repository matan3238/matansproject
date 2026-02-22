// קובץ זה מגדיר את כל ה-routes (נתיבים) הקשורים למוצרים
// כל route מגדיר איזה פונקציה תיקרא עבור כל סוג בקשה HTTP

const express = require('express'); // ייבוא Express ליצירת router
const router = express.Router(); // יצירת router חדש

// ייבוא כל הפונקציות מה-controller
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getFilterOptions
} = require('../controllers/productController');

// GET /api/products - קבלת כל המוצרים (תמיכה ב-query: category, brand, storage)
router.get('/', getAllProducts);

// GET /api/products/filters/options - אפשרויות סינון (מותגים, נפחי אחסון)
router.get('/filters/options', getFilterOptions);

// GET /api/products/category/:category - קבלת מוצרים לפי קטגוריה
// route זה מחזיר רק טלפונים מהקטגוריה המבוקשת (למשל: smartphones, accessories)
router.get('/category/:category', getProductsByCategory);

// GET /api/products/:id - קבלת מוצר בודד לפי ID
// route זה מחזיר פרטים של טלפון ספציפי לפי מספר מזהה
router.get('/:id', getProductById);

// POST /api/products - יצירת מוצר חדש
// route זה מאפשר הוספת טלפון חדש למסד הנתונים
router.post('/', createProduct);

// PUT /api/products/:id - עדכון מוצר קיים
// route זה מאפשר עדכון פרטי טלפון במסד הנתונים
router.put('/:id', updateProduct);

// DELETE /api/products/:id - מחיקת מוצר
// route זה מאפשר מחיקת טלפון ממסד הנתונים
router.delete('/:id', deleteProduct);

// ייצוא ה-router לשימוש בקובץ הראשי
module.exports = router;
