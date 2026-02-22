const express = require('express');
const router = express.Router();
const { getOrdersByUser, getOrderById, updateOrderAddress, cancelOrder } = require('../controllers/orderController');

router.get('/:userId', getOrdersByUser);
router.get('/:userId/:orderId', getOrderById);
router.patch('/:userId/:orderId/address', updateOrderAddress);
router.delete('/:userId/:orderId', cancelOrder);

module.exports = router;
