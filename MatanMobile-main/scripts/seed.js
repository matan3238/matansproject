// קובץ זה מכיל נתוני דוגמה למילוי המוצרים בזיכרון
// כרגע המוצרים נטענים אוטומטית בעת הפעלת השרת
// קובץ זה נשמר למקרה שתרצה להוסיף מוצרים נוספים ידנית

const Product = require('../models/Product'); // ייבוא מודל המוצרים

// מערך של מוצרי דוגמה נוספים (טלפונים)
// כל אובייקט מייצג טלפון עם כל הפרטים הרלוונטיים
// התמונות הן מ-Unsplash - שירות תמונות חינמי
const sampleProducts = [
  {
    title: 'Xiaomi 14 Pro',
    price: 3299,
    description: 'טלפון דגל עם מצלמה Leica ומסך AMOLED 2K',
    category: 'smartphones',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop',
    brand: 'Xiaomi',
    model: '14 Pro',
    storage: '256GB',
    color: 'לבן',
    stock: 20,
    rating: 4.5
  },
  {
    title: 'OnePlus 12',
    price: 3499,
    description: 'טלפון דגל עם טעינה מהירה ומסך Fluid AMOLED',
    category: 'smartphones',
    image: 'https://images.unsplash.com/photo-1601972602237-8c79241f8d0a?w=500&h=500&fit=crop',
    brand: 'OnePlus',
    model: '12',
    storage: '256GB',
    color: 'שחור',
    stock: 10,
    rating: 4.6
  },
  {
    title: 'כבל USB-C',
    price: 49,
    description: 'כבל USB-C מהיר לטעינה והעברת נתונים',
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=500&fit=crop',
    brand: 'Generic',
    model: 'USB-C Cable',
    storage: 'N/A',
    color: 'שחור',
    stock: 100,
    rating: 4.2
  }
];

// פונקציה אסינכרונית להוספת מוצרי דוגמה נוספים
// פונקציה זו מוסיפה מוצרים נוספים למוצרים שכבר קיימים
async function addSampleProducts() {
  try {
    console.log('🌱 מתחיל הוספת מוצרי דוגמה...');

    // הוספת כל מוצרי הדוגמה למערך המוצרים
    for (const product of sampleProducts) {
      await Product.create(product); // יוצר מוצר חדש במערך
      console.log(`✅ נוסף: ${product.title}`); // הודעת הצלחה לכל מוצר
    }

    console.log(`\n🎉 הושלם! נוספו ${sampleProducts.length} מוצרים נוספים`);
    process.exit(0); // סיום התהליך בהצלחה
  } catch (error) {
    console.error('❌ שגיאה בהוספת מוצרים:', error.message);
    process.exit(1); // סיום התהליך עם קוד שגיאה
  }
}

// קריאה לפונקציית ההוספה
addSampleProducts();
