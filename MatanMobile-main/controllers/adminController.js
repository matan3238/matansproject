const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Category = require('../models/Category');

// Middleware לבדיקת הרשאות מנהל – משתמש ב-verifyToken מ-auth

// GET /api/admin/products - כל המוצרים
const getProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json({ success: true, data: products });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// POST /api/admin/products - הוספת מוצר
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// PUT /api/admin/products/:id - עדכון מוצר
const updateProduct = async (req, res) => {
  try {
    const product = await Product.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ success: false, message: 'מוצר לא נמצא' });
    res.json({ success: true, data: product });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// DELETE /api/admin/products/:id - מחיקת מוצר
const deleteProduct = async (req, res) => {
  try {
    const ok = await Product.delete(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'מוצר לא נמצא' });
    res.json({ success: true, message: 'המוצר נמחק' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET /api/admin/orders - כל ההזמנות
const getOrders = async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.json({ success: true, data: orders });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET /api/admin/orders/:id - קבלת הזמנה בודדת
const getOrderById = async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'הזמנה לא נמצאה' });
    res.json({ success: true, data: order });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// PATCH /api/admin/orders/:id - עדכון סטטוס/כתובת הזמנה
const updateOrder = async (req, res) => {
  try {
    const { status, address } = req.body || {};
    const order = await Order.getById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'הזמנה לא נמצאה' });
    if (status) order.status = status;
    if (address !== undefined) order.address = address;
    res.json({ success: true, data: order });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// POST /api/admin/users - הוספת משתמש (מנהל)
const createUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, isAdmin } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'אימייל וסיסמה חובה' });
    }
    const newUser = await User.create({ email, password, firstName, lastName, phone });
    if (isAdmin) await User.setAdmin(newUser.id, true);
    res.status(201).json({ success: true, data: newUser, message: 'המשתמש נוסף' });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// POST /api/admin/users/:id/view-password - צפייה בסיסמה (דורש סיסמת מנהל)
const viewUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminPassword } = req.body || {};
    if (!adminPassword) {
      return res.status(400).json({ success: false, message: 'הזן את סיסמת המנהל' });
    }
    const password = await User.getPasswordForAdmin(id, req.adminUser.id, adminPassword);
    if (password === null) {
      return res.status(403).json({ success: false, message: 'סיסמת המנהל שגויה או אין הרשאה' });
    }
    res.json({ success: true, data: { password } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET /api/admin/users - כל המשתמשים
const getUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({ success: true, data: users });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// PUT /api/admin/users/:id - עדכון משתמש
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.adminUser.id) {
      return res.status(400).json({ success: false, message: 'לא ניתן לערוך את עצמך דרך ממשק זה' });
    }
    const user = await User.update(id, req.body);
    if (!user) return res.status(404).json({ success: false, message: 'משתמש לא נמצא' });
    res.json({ success: true, data: user });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// GET /api/admin/categories - כל הקטגוריות
const getCategories = async (req, res) => {
  try {
    const cats = await Category.getAll();
    res.json({ success: true, data: cats });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// POST /api/admin/categories - הוספת קטגוריה
const createCategory = async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json({ success: true, data: cat });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// DELETE /api/admin/categories/:id - מחיקת קטגוריה
const deleteCategory = async (req, res) => {
  try {
    const ok = await Category.delete(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'קטגוריה לא נמצאה' });
    res.json({ success: true, message: 'הקטגוריה נמחקה' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// DELETE /api/admin/users/:id - מחיקת משתמש
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.adminUser.id) {
      return res.status(400).json({ success: false, message: 'לא ניתן למחוק את עצמך' });
    }
    const ok = await User.delete(id);
    if (!ok) return res.status(404).json({ success: false, message: 'משתמש לא נמצא' });
    res.json({ success: true, message: 'המשתמש נמחק' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrderById,
  updateOrder,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  viewUserPassword,
  getCategories,
  createCategory,
  deleteCategory
};
