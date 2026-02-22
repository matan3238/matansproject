// חיבור ל-MongoDB
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI חסר ב-.env');
    }
    await mongoose.connect(uri);
    console.log('✅ MongoDB מחובר בהצלחה');
  } catch (error) {
    console.error('❌ שגיאה בחיבור ל-MongoDB:', error.message);
    throw error;
  }
};

module.exports = connectDB;
