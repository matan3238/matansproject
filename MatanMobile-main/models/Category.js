// מודל קטגוריות - ניהול דינמי של קטגוריות מוצרים
let categories = [
  { id: 1, name: 'סמארטפונים', value: 'smartphones' },
  { id: 2, name: 'אביזרים', value: 'accessories' }
];
let nextId = 3;

class Category {
  static async getAll() {
    return [...categories];
  }

  static async getByValue(value) {
    return categories.find(c => c.value.toLowerCase() === (value || '').toLowerCase());
  }

  static async create(data) {
    const { name, value } = data;
    const val = (value || name || '').trim().toLowerCase().replace(/\s+/g, '-');
    if (!val) throw new Error('נדרש שם או ערך לקטגוריה');
    const existing = categories.find(c => c.value === val);
    if (existing) throw new Error('קטגוריה עם ערך זה כבר קיימת');
    const cat = {
      id: nextId++,
      name: (name || val).trim(),
      value: val
    };
    categories.push(cat);
    return cat;
  }

  static async delete(id) {
    const idx = categories.findIndex(c => c.id === parseInt(id));
    if (idx === -1) return false;
    categories.splice(idx, 1);
    return true;
  }

  static async update(id, data) {
    const cat = categories.find(c => c.id === parseInt(id));
    if (!cat) return null;
    if (data.name !== undefined) cat.name = data.name.trim();
    if (data.value !== undefined) cat.value = data.value.trim().toLowerCase().replace(/\s+/g, '-');
    return cat;
  }
}

module.exports = Category;
