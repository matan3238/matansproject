// מודל משתמשים עם MongoDB, הצפנת סיסמאות (bcrypt) ו-JWT
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, select: false },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  creditCardLast4: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('id').get(function() {
  return this._id.toString();
});

// הצפנת סיסמה לפני שמירה
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  this.updatedAt = new Date();
});

// השוואת סיסמה
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// החזרת אובייקט ללא סיסמה
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  obj.id = obj._id.toString();
  delete obj._id;
  return obj;
};

const UserModel = mongoose.model('User', userSchema);

class User {
  static async create(userData) {
    const { email, password, firstName, lastName, phone } = userData;
    const existing = await UserModel.findOne({ email });
    if (existing) throw new Error('משתמש עם אימייל זה כבר קיים');

    const user = await UserModel.create({
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      phone: phone || ''
    });
    return user.toSafeObject();
  }

  static async authenticate(email, password) {
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) return null;
    return user.toSafeObject();
  }

  static async getById(id) {
    const user = await UserModel.findById(id);
    return user ? user.toSafeObject() : null;
  }

  static async getByEmail(email) {
    const user = await UserModel.findOne({ email });
    return user ? user.toSafeObject() : null;
  }

  static async update(id, userData) {
    const allowedKeys = ['firstName', 'lastName', 'phone', 'address', 'profileImage'];
    const update = {};
    Object.keys(userData).forEach(key => {
      if (userData[key] !== undefined && allowedKeys.includes(key)) {
        update[key] = userData[key];
      }
    });
    if (userData.creditCardLast4 !== undefined && /^\d{4}$/.test(userData.creditCardLast4)) {
      update.creditCardLast4 = userData.creditCardLast4;
    }
    update.updatedAt = new Date();

    const user = await UserModel.findByIdAndUpdate(id, update, { new: true });
    return user ? user.toSafeObject() : null;
  }

  static async updateEmail(id, newEmail) {
    const user = await UserModel.findById(id);
    if (!user) return null;
    const existing = await UserModel.findOne({ email: newEmail, _id: { $ne: id } });
    if (existing) throw new Error('אימייל זה כבר בשימוש');
    user.email = newEmail;
    user.updatedAt = new Date();
    await user.save();
    return user.toSafeObject();
  }

  static async updatePassword(id, currentPassword, newPassword) {
    const user = await UserModel.findById(id).select('+password');
    if (!user) return null;
    if (!(await user.comparePassword(currentPassword))) {
      throw new Error('הסיסמה הנוכחית שגויה');
    }
    user.password = newPassword;
    user.updatedAt = new Date();
    await user.save();
    return true;
  }

  static async getAll() {
    const users = await UserModel.find({});
    return users.map(u => u.toSafeObject());
  }

  static isAdmin(user) {
    return user && (user.isAdmin === true || user.email === 'admin@matan.com');
  }

  static async setAdmin(userId, isAdmin) {
    await UserModel.findByIdAndUpdate(userId, { isAdmin: !!isAdmin, updatedAt: new Date() });
  }

  static async getPasswordForAdmin(targetUserId, adminUserId, adminPassword) {
    const admin = await UserModel.findById(adminUserId).select('+password');
    if (!admin || !User.isAdmin(admin) || !(await admin.comparePassword(adminPassword))) {
      return null;
    }
    // סיסמאות מוצפנות – אי אפשר להציג את הסיסמה המקורית
    return '[מוצפן - לא ניתן להציג]';
  }

  static async delete(id) {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  static async initialize() {
    const count = await UserModel.countDocuments();
    if (count > 0) return;

    await UserModel.create({
      email: 'admin@matan.com',
      password: '123456',
      firstName: 'Matan',
      lastName: 'Admin',
      phone: '0541234567',
      address: 'רחוב הרצל 100, תל אביב',
      profileImage: 'https://via.placeholder.com/120',
      creditCardLast4: '1234',
      isAdmin: true
    });
    console.log('👤 משתמש דוגמה: admin@matan.com / 123456');
  }
}

module.exports = User;
