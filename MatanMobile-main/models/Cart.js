// מודל זה מגדיר את מבנה הנתונים והפונקציות לעבודה עם סל קניות
// כרגע עובד עם נתונים בזיכרון (in-memory)

// אובייקט גלובלי לאחסון סלי הקניות בזיכרון
// המפתח הוא ID המשתמש, והערך הוא מערך של פריטים בסל
let carts = {}; // אובייקט ריק להתחלה

class Cart {
  // פונקציה לקבלת סל הקניות של משתמש
  // מחזירה את כל הפריטים בסל של משתמש מסוים
  static async getByUserId(userId) {
    // מחזיר את הסל של המשתמש או מערך ריק אם אין סל
    return carts[userId] || [];
  }

  // פונקציה להוספת מוצר לסל
  // מוסיפה מוצר לסל של משתמש מסוים
  static async addItem(userId, productId, quantity = 1) {
    // אם אין סל למשתמש, יוצר סל חדש
    if (!carts[userId]) {
      carts[userId] = [];
    }

    // מחפש אם המוצר כבר קיים בסל
    const existingItemIndex = carts[userId].findIndex(item => item.productId === parseInt(productId));

    if (existingItemIndex !== -1) {
      // אם המוצר כבר קיים, מעדכן את הכמות
      carts[userId][existingItemIndex].quantity += quantity;
    } else {
      // אם המוצר לא קיים, מוסיף אותו לסל
      carts[userId].push({
        productId: parseInt(productId),
        quantity: quantity,
        addedAt: new Date().toISOString() // תאריך הוספה
      });
    }

    // מחזיר את הסל המעודכן
    return carts[userId];
  }

  // פונקציה לעדכון כמות מוצר בסל
  // מעדכנת את הכמות של מוצר מסוים בסל
  static async updateItem(userId, productId, quantity) {
    // אם אין סל למשתמש, מחזיר מערך ריק
    if (!carts[userId]) {
      return [];
    }

    // מחפש את המוצר בסל
    const itemIndex = carts[userId].findIndex(item => item.productId === parseInt(productId));

    // אם המוצר לא נמצא, מחזיר null
    if (itemIndex === -1) {
      return null;
    }

    // אם הכמות היא 0 או פחות, מוחק את הפריט
    if (quantity <= 0) {
      carts[userId].splice(itemIndex, 1);
    } else {
      // אחרת, מעדכן את הכמות
      carts[userId][itemIndex].quantity = quantity;
    }

    // מחזיר את הסל המעודכן
    return carts[userId];
  }

  // פונקציה להסרת מוצר מסל
  // מוחקת מוצר מסוים מהסל של משתמש
  static async removeItem(userId, productId) {
    // אם אין סל למשתמש, מחזיר false
    if (!carts[userId]) {
      return false;
    }

    // מחפש את המיקום של המוצר בסל
    const itemIndex = carts[userId].findIndex(item => item.productId === parseInt(productId));

    // אם המוצר לא נמצא, מחזיר false
    if (itemIndex === -1) {
      return false;
    }

    // מוחק את המוצר מהסל
    carts[userId].splice(itemIndex, 1);
    return true; // מחזיר true אם המוצר נמחק בהצלחה
  }

  // פונקציה לניקוי סל (הסרת כל הפריטים)
  // מוחקת את כל הפריטים מהסל של משתמש
  static async clearCart(userId) {
    // מאפס את הסל של המשתמש
    carts[userId] = [];
    return true; // מחזיר true אם הסל נוקה בהצלחה
  }

  // פונקציה לקבלת פרטי סל מלא עם פרטי המוצרים
  // מחזירה את הסל עם כל פרטי המוצרים (לא רק ID)
  static async getCartWithProducts(userId, Product) {
    const cartItems = await this.getByUserId(userId); // מקבל את פריטי הסל
    
    // מערך לפרטי המוצרים המלאים
    const cartWithProducts = [];

    // עבור כל פריט בסל, מוסיף את פרטי המוצר המלאים
    for (const item of cartItems) {
      const product = await Product.getById(item.productId); // מקבל את פרטי המוצר
      if (product) {
        cartWithProducts.push({
          ...item, // פרטי הפריט (productId, quantity, addedAt)
          product: product // פרטי המוצר המלאים
        });
      }
    }

    return cartWithProducts; // מחזיר את הסל עם פרטי המוצרים
  }
}

module.exports = Cart;
