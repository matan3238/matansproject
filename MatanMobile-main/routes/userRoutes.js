// קובץ זה מגדיר את כל ה-routes (נתיבים) הקשורים למשתמשים
// כל route מגדיר איזה פונקציה תיקרא עבור כל סוג בקשה HTTP

const express = require('express'); // ייבוא Express ליצירת router
const router = express.Router(); // יצירת router חדש

// ייבוא כל הפונקציות מה-controller
const {
  register,
  login,
  getUserById,
  updateUser,
  updateEmail,
  updatePassword,
  deleteAccount
} = require('../controllers/userController');

// POST /api/users/register - הרשמה (יצירת משתמש חדש)
// route זה מאפשר למשתמש חדש להירשם לאתר
router.post('/register', register);

// POST /api/users/login - התחברות (אימות משתמש)
// route זה מאפשר למשתמש קיים להתחבר לאתר
router.post('/login', login);

// GET /api/users/:id - קבלת פרטי משתמש לפי ID
// route זה מחזיר פרטים של משתמש ספציפי
router.get('/:id', getUserById);

// PUT /api/users/:id - עדכון משתמש
router.put('/:id', updateUser);

// PUT /api/users/:id/email - עדכון אימייל
router.put('/:id/email', updateEmail);

// PUT /api/users/:id/password - עדכון סיסמה
router.put('/:id/password', updatePassword);

// DELETE /api/users/:id - מחיקת חשבון
router.delete('/:id', deleteAccount);

// ייצוא ה-router לשימוש בקובץ הראשי
module.exports = router;
