const Order = require('../models/Order');

const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.getByUserId(userId);
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת ההזמנות',
      error: error.message
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const order = await Order.getById(orderId);
    if (!order || order.userId !== parseInt(userId)) {
      return res.status(404).json({ success: false, message: 'ההזמנה לא נמצאה' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בקבלת ההזמנה',
      error: error.message
    });
  }
};

const updateOrderAddress = async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const { address } = req.body || {};
    const order = await Order.updateAddress(orderId, userId, address || '');
    if (!order) {
      return res.status(404).json({ success: false, message: 'ההזמנה לא נמצאה' });
    }
    res.status(200).json({ success: true, data: order, message: 'הכתובת עודכנה בהצלחה' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בעדכון הכתובת',
      error: error.message
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const order = await Order.cancel(orderId, userId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'ההזמנה לא נמצאה' });
    }
    res.status(200).json({ success: true, data: order, message: 'ההזמנה בוטלה בהצלחה' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בביטול ההזמנה',
      error: error.message
    });
  }
};

module.exports = { getOrdersByUser, getOrderById, updateOrderAddress, cancelOrder };
