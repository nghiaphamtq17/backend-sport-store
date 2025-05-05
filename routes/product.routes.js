const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
  updateStock
} = require('../service/product.service');
const { authMiddleware } = require('../middleware/auth.middleware');
const { 
  canManageProducts,
  canManageInventory,
  canReviewProducts
} = require('../middleware/role.middleware');

// Public routes
router.get('/', async (req, res) => await getProducts(req, res));
router.get('/:id', async (req, res) => await getProductById(req, res));

// Protected routes (require authentication and appropriate role)
router.post('/:id/reviews', authMiddleware, canReviewProducts, async (req, res) => await addReview(req, res));

// Admin/Manager routes (require authentication and appropriate role)
router.post('/', authMiddleware, canManageProducts, async (req, res) => await createProduct(req, res));
router.put('/:id', authMiddleware, canManageProducts, async (req, res) => await updateProduct(req, res));
router.delete('/:id', authMiddleware, canManageProducts, async (req, res) => await deleteProduct(req, res));
router.put('/:id/stock', authMiddleware, canManageInventory, async (req, res) => await updateStock(req, res));

module.exports = router;
