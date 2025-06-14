const express = require('express');
const router = express.Router();
const { 
  processPayment, 
  updateOrderStatus, 
  updatePaymentStatus,
  getUserAddresses, 
  getOrderDetails,
  getUserOrders,
  getUserOrdersWithFilters,
  getUserOrderStatistics
} = require('../service/paymentService');
const { authMiddleware } = require('../middleware/auth.middleware');

// Process complete payment
router.post('/process', async (req, res) => {
  try {
    const result = await processPayment(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's order history with filters and pagination
router.get('/user-orders/filtered', authMiddleware, async (req, res) => {
  try {
    const { 
      status, 
      startDate, 
      endDate, 
      paymentMethod,
      page = 1,
      limit = 10
    } = req.query;

    const filters = {
      status,
      startDate,
      endDate,
      paymentMethod
    };

    const result = await getUserOrdersWithFilters(
      req.user.id,
      filters,
      parseInt(page),
      parseInt(limit)
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's order statistics
router.get('/user-orders/statistics', authMiddleware, async (req, res) => {
  try {
    const statistics = await getUserOrderStatistics(req.user.id);
    res.json(statistics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's order history -> khi đăng nhập mà đặt hàng sẽ lưu lại danh sách đã đặjt hàng
router.get('/user-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await getUserOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update order status (admin only)
router.patch('/orders/:orderId/status', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const result = await updateOrderStatus(orderId, status);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update payment status (admin only)
router.patch('/orders/:orderId/payment', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { payment_status, bank_transfer_info } = req.body;
    const result = await updatePaymentStatus(orderId, payment_status, bank_transfer_info);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get order details
router.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await getOrderDetails(orderId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's previous addresses (if logged in)
router.get('/user-addresses', authMiddleware, async (req, res) => {
  try {
    const addresses = await getUserAddresses(req.user.id);
    res.json(addresses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 