const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrderById,
  updateOrder,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  viewUserPassword,
  getCategories,
  createCategory,
  deleteCategory
} = require('../controllers/adminController');

// כל הנתיבים דורשים JWT + הרשאות מנהל
router.use(verifyToken);
router.use(verifyAdmin);

// קטגוריות
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

// מוצרים
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// הזמנות
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id', updateOrder);

// משתמשים
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users/:id/view-password', viewUserPassword);

module.exports = router;
