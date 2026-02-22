// Controller זה מטפל בכל הבקשות הקשורות למשתמשים
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// פונקציה להרשמה (יצירת משתמש חדש)
// POST /api/users/register
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body; // מקבל את נתוני המשתמש מה-body

    // בדיקת שדות חובה
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'אימייל וסיסמה הם שדות חובה' // הודעת שגיאה אם חסרים שדות חובה
      });
    }

    const newUser = await User.create({ email, password, firstName, lastName, phone });
    const token = generateToken(newUser);
    
    res.status(201).json({
      success: true,
      message: 'המשתמש נוצר בהצלחה',
      data: { user: newUser, token }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'שגיאה ביצירת המשתמש',
      error: error.message
    });
  }
};

// פונקציה להתחברות (אימות משתמש)
// POST /api/users/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body; // מקבל את האימייל והסיסמה מה-body

    // בדיקת שדות חובה
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'אימייל וסיסמה הם שדות חובה'
      });
    }

    const user = await User.authenticate(email, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'אימייל או סיסמה שגויים'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'התחברות הצליחה',
      data: { user, token }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בהתחברות',
      error: error.message
    });
  }
};

// פונקציה לקבלת פרטי משתמש
// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // מקבל את ה-ID מה-URL
    const user = await User.getById(id); // מחפש את המשתמש במסד הנתונים

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'משתמש לא נמצא' // הודעת שגיאה אם המשתמש לא קיים
      });
    }

    res.status(200).json({
      success: true,
      data: user // מחזיר את המשתמש שנמצא
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת המשתמש',
      error: error.message
    });
  }
};

// עדכון אימייל
// PUT /api/users/:id/email
const updateEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { newEmail } = req.body;
    if (!newEmail) {
      return res.status(400).json({ success: false, message: 'אימייל חדש נדרש' });
    }
    const user = await User.updateEmail(id, newEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: 'משתמש לא נמצא' });
    }
    res.status(200).json({
      success: true,
      message: 'האימייל עודכן בהצלחה',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'שגיאה בעדכון האימייל'
    });
  }
};

// עדכון סיסמה
// PUT /api/users/:id/password
const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'סיסמה נוכחית וחדשה נדרשות' });
    }
    await User.updatePassword(id, currentPassword, newPassword);
    res.status(200).json({
      success: true,
      message: 'הסיסמה עודכנה בהצלחה'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'שגיאה בעדכון הסיסמה'
    });
  }
};

// מחיקת חשבון
// DELETE /api/users/:id
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.delete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'משתמש לא נמצא' });
    }
    res.status(200).json({
      success: true,
      message: 'החשבון נמחק בהצלחה'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה במחיקת החשבון',
      error: error.message
    });
  }
};

// פונקציה לעדכון משתמש
// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // מקבל את ה-ID מה-URL
    const userData = req.body; // מקבל את הנתונים לעדכון מה-body

    const updatedUser = await User.update(id, userData); // מעדכן את המשתמש

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'משתמש לא נמצא'
      });
    }

    res.status(200).json({
      success: true,
      message: 'משתמש עודכן בהצלחה',
      data: updatedUser // מחזיר את המשתמש המעודכן
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בעדכון המשתמש',
      error: error.message
    });
  }
};

// ייצוא כל הפונקציות לשימוש ב-routes
module.exports = {
  register,
  login,
  getUserById,
  updateUser,
  updateEmail,
  updatePassword,
  deleteAccount
};
