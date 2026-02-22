// Controller זה מטפל בכל הבקשות הקשורות למוצרים (טלפונים)
// כל פונקציה מקבלת request ו-response ומבצעת פעולה מתאימה

const Product = require('../models/Product');
const Category = require('../models/Category'); // ייבוא מודל המוצרים

// פונקציה לקבלת כל המוצרים (כולל סינון לפי brand, storage)
// GET /api/products?category=X&brand=Y&storage=Z
const getAllProducts = async (req, res) => {
  try {
    const { category, brand, storage } = req.query;
    const filters = {};
    if (category) filters.category = category;
    if (brand) filters.brand = brand;
    if (storage) filters.storage = storage;

    const products = Object.keys(filters).length > 0
      ? await Product.getFiltered(filters)
      : await Product.getAll();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת המוצרים',
      error: error.message
    });
  }
};

// פונקציה לקבלת אפשרויות סינון (מותגים, נפחי אחסון)
// GET /api/products/filters/options
const getFilterOptions = async (req, res) => {
  try {
    const options = Product.getFilterOptions();
    const categories = await Category.getAll();
    options.categories = categories;
    res.status(200).json({ success: true, data: options });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת אפשרויות הסינון',
      error: error.message
    });
  }
};

// פונקציה לקבלת מוצר בודד לפי ID
// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params; // מקבל את ה-ID מה-URL
    const product = await Product.getById(id); // מחפש את המוצר במסד הנתונים

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'מוצר לא נמצא' // הודעת שגיאה אם המוצר לא קיים
      });
    }

    res.status(200).json({
      success: true,
      data: product // מחזיר את המוצר שנמצא
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת המוצר',
      error: error.message
    });
  }
};

// פונקציה ליצירת מוצר חדש
// POST /api/products
const createProduct = async (req, res) => {
  try {
    const productData = req.body; // מקבל את נתוני המוצר מה-body של הבקשה

    // בדיקת שדות חובה
    if (!productData.title || !productData.price) {
      return res.status(400).json({
        success: false,
        message: 'שם המוצר ומחיר הם שדות חובה' // הודעת שגיאה אם חסרים שדות חובה
      });
    }

    const newProduct = await Product.create(productData); // יוצר מוצר חדש במסד הנתונים
    res.status(201).json({
      success: true,
      message: 'מוצר נוצר בהצלחה',
      data: newProduct // מחזיר את המוצר שנוצר
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה ביצירת המוצר',
      error: error.message
    });
  }
};

// פונקציה לעדכון מוצר קיים
// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // מקבל את ה-ID מה-URL
    const productData = req.body; // מקבל את הנתונים לעדכון מה-body

    const updatedProduct = await Product.update(id, productData); // מעדכן את המוצר במסד הנתונים

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'מוצר לא נמצא' // הודעת שגיאה אם המוצר לא קיים
      });
    }

    res.status(200).json({
      success: true,
      message: 'מוצר עודכן בהצלחה',
      data: updatedProduct // מחזיר את המוצר המעודכן
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בעדכון המוצר',
      error: error.message
    });
  }
};

// פונקציה למחיקת מוצר
// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // מקבל את ה-ID מה-URL
    const deleted = await Product.delete(id); // מוחק את המוצר ממסד הנתונים

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'מוצר לא נמצא' // הודעת שגיאה אם המוצר לא קיים
      });
    }

    res.status(200).json({
      success: true,
      message: 'מוצר נמחק בהצלחה' // הודעת הצלחה
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה במחיקת המוצר',
      error: error.message
    });
  }
};

// פונקציה לקבלת מוצרים לפי קטגוריה
// GET /api/products/category/:category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params; // מקבל את הקטגוריה מה-URL
    const products = await Product.getByCategory(category); // מחפש מוצרים לפי קטגוריה

    res.status(200).json({
      success: true,
      count: products.length,
      category: category, // הקטגוריה המבוקשת
      data: products // רשימת המוצרים בקטגוריה
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת מוצרים לפי קטגוריה',
      error: error.message
    });
  }
};

// ייצוא כל הפונקציות לשימוש ב-routes
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getFilterOptions
};
