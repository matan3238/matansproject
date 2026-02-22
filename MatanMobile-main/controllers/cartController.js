// Controller זה מטפל בכל הבקשות הקשורות לסל קניות
// כל פונקציה מקבלת request ו-response ומבצעת פעולה מתאימה

const Cart = require('../models/Cart'); // ייבוא מודל הסל
const Product = require('../models/Product'); // ייבוא מודל המוצרים
const Order = require('../models/Order'); // ייבוא מודל ההזמנות
const User = require('../models/User'); // לעדכון אמצעי תשלום שמור

// פונקציה לקבלת סל הקניות של משתמש
// GET /api/cart/:userId
const getCart = async (req, res) => {
  try {
    const { userId } = req.params; // מקבל את ID המשתמש מה-URL
    
    // מקבל את הסל עם פרטי המוצרים המלאים
    const cart = await Cart.getCartWithProducts(parseInt(userId), Product);
    
    // חישוב סכום כולל של הסל
    const total = cart.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity); // מחיר כפול כמות
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        items: cart, // פריטי הסל עם פרטי המוצרים
        total: total, // סכום כולל
        itemCount: cart.length // מספר פריטים בסל
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת הסל',
      error: error.message
    });
  }
};

// פונקציה להוספת מוצר לסל
// POST /api/cart/:userId/add
const addToCart = async (req, res) => {
  try {
    const { userId } = req.params; // מקבל את ID המשתמש מה-URL
    const { productId, quantity } = req.body; // מקבל את ID המוצר והכמות מה-body

    // בדיקת שדות חובה
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'ID מוצר הוא שדה חובה'
      });
    }

    // בדיקה אם המוצר קיים
    const product = await Product.getById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'מוצר לא נמצא'
      });
    }

    // הוספת המוצר לסל
    await Cart.addItem(parseInt(userId), productId, quantity || 1);
    
    // מחזיר את הסל המעודכן
    const cart = await Cart.getCartWithProducts(parseInt(userId), Product);
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    res.status(200).json({
      success: true,
      message: 'מוצר נוסף לסל בהצלחה',
      data: {
        items: cart,
        total: total,
        itemCount: cart.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בהוספת מוצר לסל',
      error: error.message
    });
  }
};

// פונקציה לעדכון כמות מוצר בסל
// PUT /api/cart/:userId/update
const updateCartItem = async (req, res) => {
  try {
    const { userId } = req.params; // מקבל את ID המשתמש מה-URL
    const { productId, quantity } = req.body; // מקבל את ID המוצר והכמות החדשה מה-body

    // בדיקת שדות חובה
    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'ID מוצר וכמות הם שדות חובה'
      });
    }

    // עדכון הכמות בסל
    await Cart.updateItem(parseInt(userId), productId, quantity);
    
    // מחזיר את הסל המעודכן
    const cart = await Cart.getCartWithProducts(parseInt(userId), Product);
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    res.status(200).json({
      success: true,
      message: 'סל עודכן בהצלחה',
      data: {
        items: cart,
        total: total,
        itemCount: cart.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בעדכון הסל',
      error: error.message
    });
  }
};

// פונקציה להסרת מוצר מסל
// DELETE /api/cart/:userId/remove/:productId
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params; // מקבל את ID המשתמש וה-ID המוצר מה-URL

    // הסרת המוצר מהסל
    const removed = await Cart.removeItem(parseInt(userId), productId);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'מוצר לא נמצא בסל'
      });
    }

    // מחזיר את הסל המעודכן
    const cart = await Cart.getCartWithProducts(parseInt(userId), Product);
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    res.status(200).json({
      success: true,
      message: 'מוצר הוסר מהסל בהצלחה',
      data: {
        items: cart,
        total: total,
        itemCount: cart.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בהסרת מוצר מהסל',
      error: error.message
    });
  }
};

// פונקציה לביצוע תשלום (יצירת הזמנה)
// POST /api/cart/:userId/checkout
const checkout = async (req, res) => {
  try {
    const { userId } = req.params;
    const { address, payment } = req.body || {};

    const cart = await Cart.getCartWithProducts(parseInt(userId), Product);
    if (cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'הסל ריק - הוסף מוצרים לפני התשלום'
      });
    }

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const orderItems = cart.map(item => ({
      productId: item.productId,
      title: item.product.title,
      quantity: item.quantity,
      price: item.product.price
    }));

    const order = await Order.create(userId, orderItems, total, address);
    await Cart.clearCart(parseInt(userId));

    // קישור 4 הספרות האחרונות לאמצעי התשלום השמור בפרופיל
    if (payment?.last4 && /^\d{4}$/.test(payment.last4)) {
      await User.update(parseInt(userId), { creditCardLast4: payment.last4 });
    }

    res.status(201).json({
      success: true,
      message: 'ההזמנה בוצעה בהצלחה',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בביצוע התשלום',
      error: error.message
    });
  }
};

// פונקציה לניקוי סל (הסרת כל הפריטים)
// DELETE /api/cart/:userId/clear
const clearCart = async (req, res) => {
  try {
    const { userId } = req.params; // מקבל את ID המשתמש מה-URL

    // ניקוי הסל
    await Cart.clearCart(parseInt(userId));

    res.status(200).json({
      success: true,
      message: 'סל נוקה בהצלחה',
      data: {
        items: [],
        total: 0,
        itemCount: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בניקוי הסל',
      error: error.message
    });
  }
};

// ייצוא כל הפונקציות לשימוש ב-routes
module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout
};
