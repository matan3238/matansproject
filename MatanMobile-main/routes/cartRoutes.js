// קובץ זה מגדיר את כל ה-routes (נתיבים) הקשורים לסל קניות
// כל route מגדיר איזה פונקציה תיקרא עבור כל סוג בקשה HTTP

const express = require('express'); // ייבוא Express ליצירת router
const router = express.Router(); // יצירת router חדש

// ייבוא כל הפונקציות מה-controller
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout
} = require('../controllers/cartController');

// GET /api/cart/:userId - קבלת סל הקניות של משתמש
// route זה מחזיר את כל הפריטים בסל של משתמש מסוים
router.get('/:userId', getCart);

// POST /api/cart/:userId/add - הוספת מוצר לסל
// route זה מאפשר הוספת מוצר לסל הקניות
router.post('/:userId/add', addToCart);

// PUT /api/cart/:userId/update - עדכון כמות מוצר בסל
// route זה מאפשר עדכון כמות של מוצר בסל
router.put('/:userId/update', updateCartItem);

// DELETE /api/cart/:userId/remove/:productId - הסרת מוצר מסל
// route זה מאפשר הסרת מוצר מסוים מהסל
router.delete('/:userId/remove/:productId', removeFromCart);

// POST /api/cart/:userId/checkout - ביצוע תשלום ויצירת הזמנה
router.post('/:userId/checkout', checkout);

// DELETE /api/cart/:userId/clear - ניקוי סל (הסרת כל הפריטים)
// route זה מאפשר מחיקת כל הפריטים מהסל
router.delete('/:userId/clear', clearCart);

// ייצוא ה-router לשימוש בקובץ הראשי
module.exports = router;
