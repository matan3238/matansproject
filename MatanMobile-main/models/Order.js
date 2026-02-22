// מודל הזמנות - היסטוריית הזמנות למשתמשים
let orders = [];
let nextOrderId = 1;

const toUserId = (id) => (typeof id === 'string' && id.length === 24) ? id : String(id);

class Order {
  static async create(userId, items, total, address) {
    const order = {
      id: nextOrderId++,
      userId: toUserId(userId),
      items: items,
      total: total,
      address: address || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    orders.push(order);
    return order;
  }

  static async getByUserId(userId) {
    const uid = toUserId(userId);
    return orders.filter(o => o.userId === uid).sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  static async getById(id) {
    return orders.find(o => o.id === parseInt(id));
  }

  static async getAll() {
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async updateStatus(orderId, status) {
    const order = orders.find(o => o.id === parseInt(orderId));
    if (!order) return null;
    order.status = status;
    return order;
  }

  static async updateAddress(orderId, userId, address) {
    const uid = toUserId(userId);
    const order = orders.find(o => o.id === parseInt(orderId) && o.userId === uid);
    if (!order) return null;
    order.address = address;
    return order;
  }

  static async cancel(orderId, userId) {
    const uid = toUserId(userId);
    const order = orders.find(o => o.id === parseInt(orderId) && o.userId === uid);
    if (!order) return null;
    order.status = 'cancelled';
    return order;
  }
}

module.exports = Order;
